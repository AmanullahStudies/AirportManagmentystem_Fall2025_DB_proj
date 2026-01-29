// src/apis/TicketsApi.js
import { selectQuery, mutationQuery } from './dbApi'

export const fetchTickets = async () => {
  const sql = `
    SELECT 
      t.TicketID AS id,
      t.TicketPrice AS ticketPrice,
      b.BookingID AS bookingId,
      b.BookingRef AS bookingRef,
      p.PassengerID AS passengerId,
      CONCAT(p.FirstName, ' ', p.LastName) AS passengerName,
      p.PassportNumber AS passportNumber,
      f.FlightID AS flightId,
      f.FlightNumber AS flightNumber,
      f.ScheduledDeparture AS scheduledDeparture,
      f.ScheduledArrival AS scheduledArrival,
      f.FlightStatus AS flightStatus,
      s.SeatNumber AS seatNumber,
      s.SeatClass AS seatClass,
      a1.AirportCode AS originCode,
      a2.AirportCode AS destinationCode,
      a1.CityName AS originCity,
      a2.CityName AS destinationCity
    FROM Tickets t
    JOIN Bookings b ON t.BookingID = b.BookingID
    JOIN Passengers p ON t.PassengerID = p.PassengerID
    JOIN Flights f ON t.FlightID = f.FlightID
    LEFT JOIN Seats s ON t.SeatID = s.SeatID
    JOIN Routes r ON f.RouteID = r.RouteID
    JOIN Airports a1 ON r.OriginAirportID = a1.AirportID
    JOIN Airports a2 ON r.DestinationAirportID = a2.AirportID
    ORDER BY t.TicketID DESC
  `
  return await selectQuery(sql)
}

export const updateTicket = async (id, ticketPrice) => {
  const sql = `
    UPDATE Tickets
    SET TicketPrice = ?
    WHERE TicketID = ?
  `
  return await mutationQuery(sql, [ticketPrice, id])
}

export const deleteTicket = async (id) => {
  const sql = 'DELETE FROM Tickets WHERE TicketID = ?'
  return await mutationQuery(sql, [id])
}

export const fetchTicketsByBooking = async (bookingId) => {
  const sql = `
    SELECT 
      t.TicketID AS id,
      t.TicketPrice AS ticketPrice,
      p.PassengerID AS passengerId,
      CONCAT(p.FirstName, ' ', p.LastName) AS passengerName,
      p.PassportNumber AS passportNumber,
      f.FlightNumber AS flightNumber,
      s.SeatNumber AS seatNumber,
      s.SeatClass AS seatClass
    FROM Tickets t
    JOIN Passengers p ON t.PassengerID = p.PassengerID
    JOIN Flights f ON t.FlightID = f.FlightID
    LEFT JOIN Seats s ON t.SeatID = s.SeatID
    WHERE t.BookingID = ?
    ORDER BY t.TicketID ASC
  `
  return await selectQuery(sql, [bookingId])
}

export const fetchTicketsByPassenger = async (passengerId) => {
  const sql = `
    SELECT 
      t.TicketID AS id,
      t.TicketPrice AS ticketPrice,
      b.BookingRef AS bookingRef,
      f.FlightNumber AS flightNumber,
      f.ScheduledDeparture AS scheduledDeparture,
      f.ScheduledArrival AS scheduledArrival,
      f.FlightStatus AS flightStatus,
      s.SeatNumber AS seatNumber,
      s.SeatClass AS seatClass,
      a1.AirportCode AS originCode,
      a2.AirportCode AS destinationCode
    FROM Tickets t
    JOIN Bookings b ON t.BookingID = b.BookingID
    JOIN Flights f ON t.FlightID = f.FlightID
    LEFT JOIN Seats s ON t.SeatID = s.SeatID
    JOIN Routes r ON f.RouteID = r.RouteID
    JOIN Airports a1 ON r.OriginAirportID = a1.AirportID
    JOIN Airports a2 ON r.DestinationAirportID = a2.AirportID
    WHERE t.PassengerID = ?
    ORDER BY f.ScheduledDeparture DESC
  `
  return await selectQuery(sql, [passengerId])
}
