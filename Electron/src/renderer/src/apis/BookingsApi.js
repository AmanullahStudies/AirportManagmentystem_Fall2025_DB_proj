// src/apis/BookingsApi.js - FIXED: Proper passenger name display
import { selectQuery, mutationQuery } from './dbApi'

export const fetchBookings = async () => {
  const sql = `
    SELECT 
      b.BookingID AS id,
      b.BookingRef AS bookingRef,
      b.BookingDate AS bookingDate,
      b.BookingStatus AS status,
      COALESCE(COUNT(DISTINCT t.TicketID), 0) AS ticketCount,
      GROUP_CONCAT(
        DISTINCT CONCAT(p.FirstName, ' ', p.LastName) 
        ORDER BY p.FirstName 
        SEPARATOR ', '
      ) AS passengerNames
    FROM Bookings b
    LEFT JOIN Tickets t ON b.BookingID = t.BookingID
    LEFT JOIN Passengers p ON t.PassengerID = p.PassengerID
    GROUP BY b.BookingID, b.BookingRef, b.BookingDate, b.BookingStatus
    ORDER BY b.BookingID DESC
  `
  console.log('📊 Fetching bookings with SQL:', sql)
  const result = await selectQuery(sql)
  console.log('📊 Bookings fetched (total count):', result?.length)

  // Debug: Show first 3 bookings with details
  if (result && result.length > 0) {
    console.log('🔍 First 3 bookings details:')
    result.slice(0, 3).forEach((booking) => {
      console.log({
        id: booking.id,
        ref: booking.bookingRef,
        ticketCount: booking.ticketCount,
        passengerNames: booking.passengerNames,
        status: booking.status
      })
    })
  }

  // Debug: Check tickets table directly
  const ticketsDebug = await selectQuery(
    'SELECT BookingID, COUNT(*) as count FROM Tickets GROUP BY BookingID'
  )
  console.log('🔍 Tickets per booking (from Tickets table directly):')
  ticketsDebug?.forEach((t) => console.log(`  BookingID ${t.BookingID}: ${t.count} tickets`))

  return result
}

export const fetchFlightsForDropdown = async () => {
  const sql = `
    SELECT 
      f.FlightID AS id,
      CONCAT(
        f.FlightNumber, ' - ', 
        a1.AirportCode, ' → ', a2.AirportCode, 
        ' (', DATE_FORMAT(f.ScheduledDeparture, '%Y-%m-%d %H:%i'), ')'
      ) AS label,
      f.FlightNumber AS flightNumber,
      a1.AirportCode AS originCode,
      a2.AirportCode AS destinationCode,
      f.ScheduledDeparture AS scheduledDeparture
    FROM Flights f
    JOIN Routes r ON f.RouteID = r.RouteID
    JOIN Airports a1 ON r.OriginAirportID = a1.AirportID
    JOIN Airports a2 ON r.DestinationAirportID = a2.AirportID
    WHERE f.FlightStatus IN ('SCHEDULED', 'DELAYED')
    ORDER BY f.ScheduledDeparture ASC
  `
  return await selectQuery(sql)
}

export const fetchPassengersForDropdown = async () => {
  const sql = `
    SELECT 
      PassengerID AS id,
      CONCAT(FirstName, ' ', LastName) AS name,
      PassportNumber AS passportNumber
    FROM Passengers
    ORDER BY FirstName ASC
  `
  return await selectQuery(sql)
}

export const fetchSeatsForFlight = async (flightId) => {
  const sql = `
    SELECT 
      s.SeatID AS id,
      s.SeatNumber AS seatNumber,
      s.SeatClass AS seatClass,
      CASE WHEN t.TicketID IS NOT NULL THEN 1 ELSE 0 END AS isBooked
    FROM Seats s
    JOIN Aircraft a ON s.AircraftID = a.AircraftID
    JOIN Flights f ON a.AircraftID = f.AircraftID
    LEFT JOIN Tickets t ON s.SeatID = t.SeatID AND t.FlightID = f.FlightID
    WHERE f.FlightID = ?
    ORDER BY s.SeatNumber ASC
  `
  return await selectQuery(sql, [flightId])
}

export const generateBookingRef = async () => {
  const sql = `
    SELECT 
      CONCAT(
        'BK', 
        DATE_FORMAT(NOW(), '%Y%m%d'), 
        LPAD(
          COALESCE(MAX(CAST(SUBSTRING(BookingRef, 11) AS UNSIGNED)), 0) + 1, 
          5, 
          '0'
        )
      ) AS bookingRef
    FROM Bookings
    WHERE BookingRef LIKE CONCAT('BK', DATE_FORMAT(NOW(), '%Y%m%d'), '%')
  `
  const result = await selectQuery(sql)
  return (
    result?.[0]?.bookingRef || `BK${new Date().toISOString().slice(0, 10).replace(/-/g, '')}00001`
  )
}

export const addBooking = async (bookingRef) => {
  const sql = `
    INSERT INTO Bookings (BookingRef, BookingStatus)
    VALUES (?, 'CONFIRMED')
  `
  return await mutationQuery(sql, [bookingRef])
}

export const addTicket = async (bookingId, passengerId, flightId, seatId, ticketPrice) => {
  const sql = `
    INSERT INTO Tickets (BookingID, PassengerID, FlightID, SeatID, TicketPrice)
    VALUES (?, ?, ?, ?, ?)
  `
  console.log('🎫 SQL Query:', sql)
  console.log('🎫 Parameters:', { bookingId, passengerId, flightId, seatId, ticketPrice })

  const result = await mutationQuery(sql, [bookingId, passengerId, flightId, seatId, ticketPrice])
  console.log('🎫 Ticket insert result:', result)

  return result
}

export const updateBooking = async (id, status) => {
  const sql = `
    UPDATE Bookings
    SET BookingStatus = ?
    WHERE BookingID = ?
  `
  return await mutationQuery(sql, [status, id])
}

export const deleteBooking = async (id) => {
  // Delete tickets first (foreign key constraint)
  const deleteTicketsSql = 'DELETE FROM Tickets WHERE BookingID = ?'
  await mutationQuery(deleteTicketsSql, [id])

  // Then delete booking
  const deleteBookingSql = 'DELETE FROM Bookings WHERE BookingID = ?'
  return await mutationQuery(deleteBookingSql, [id])
}

export const fetchBookingDetails = async (bookingId) => {
  const sql = `
    SELECT 
      b.BookingID AS id,
      b.BookingRef AS bookingRef,
      b.BookingDate AS bookingDate,
      b.BookingStatus AS status,
      t.TicketID AS ticketId,
      p.PassengerID AS passengerId,
      CONCAT(p.FirstName, ' ', p.LastName) AS passengerName,
      p.PassportNumber AS passportNumber,
      f.FlightID AS flightId,
      f.FlightNumber AS flightNumber,
      s.SeatNumber AS seatNumber,
      t.TicketPrice AS ticketPrice
    FROM Bookings b
    LEFT JOIN Tickets t ON b.BookingID = t.BookingID
    LEFT JOIN Passengers p ON t.PassengerID = p.PassengerID
    LEFT JOIN Flights f ON t.FlightID = f.FlightID
    LEFT JOIN Seats s ON t.SeatID = s.SeatID
    WHERE b.BookingID = ?
  `
  return await selectQuery(sql, [bookingId])
}
