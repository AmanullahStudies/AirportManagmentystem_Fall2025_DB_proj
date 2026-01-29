// src/apis/ReportsApi.js
import { selectQuery } from './dbApi'

export const fetchDailyReport = async (date) => {
  const sql = `
    SELECT 
      DATE(f.ScheduledDeparture) AS reportDate,
      COUNT(DISTINCT f.FlightID) AS totalFlights,
      COUNT(DISTINCT b.BookingID) AS totalBookings,
      COUNT(DISTINCT t.TicketID) AS totalTickets,
      COALESCE(SUM(t.TicketPrice), 0) AS totalRevenue,
      COUNT(DISTINCT p.PassengerID) AS totalPassengers,
      f.FlightStatus,
      COUNT(f.FlightID) AS flightsByStatus
    FROM Flights f
    LEFT JOIN Bookings b ON DATE(b.BookingDate) = DATE(f.ScheduledDeparture)
    LEFT JOIN Tickets t ON b.BookingID = t.BookingID
    LEFT JOIN Passengers p ON t.PassengerID = p.PassengerID
    WHERE DATE(f.ScheduledDeparture) = ?
    GROUP BY DATE(f.ScheduledDeparture), f.FlightStatus
  `
  return await selectQuery(sql, [date || new Date().toISOString().split('T')[0]])
}

export const fetchPassengerSummary = async () => {
  const sql = `
    SELECT 
      'Total Passengers' AS category,
      COUNT(DISTINCT p.PassengerID) AS count,
      NULL AS details
    FROM Passengers p
    
    UNION ALL
    
    SELECT 
      'Passengers with Tickets' AS category,
      COUNT(DISTINCT t.PassengerID) AS count,
      NULL AS details
    FROM Tickets t
    
    UNION ALL
    
    SELECT 
      'Passengers by Airline' AS category,
      COUNT(DISTINCT t.PassengerID) AS count,
      CONCAT(al.AirlineName, ' (', COUNT(DISTINCT t.PassengerID), ')') AS details
    FROM Tickets t
    JOIN Flights f ON t.FlightID = f.FlightID
    JOIN Routes r ON f.RouteID = r.RouteID
    JOIN Aircraft ac ON f.AircraftID = ac.AircraftID
    JOIN Airlines al ON ac.AirlineID = al.AirlineID
    GROUP BY al.AirlineID, al.AirlineName
  `
  return await selectQuery(sql)
}

export const fetchRevenueReport = async () => {
  const sql = `
    SELECT 
      'Total Revenue' AS category,
      COALESCE(SUM(t.TicketPrice), 0) AS amount,
      COUNT(DISTINCT t.TicketID) AS ticketCount
    FROM Tickets t
    
    UNION ALL
    
    SELECT 
      'Revenue by Airline' AS category,
      COALESCE(SUM(t.TicketPrice), 0) AS amount,
      COUNT(DISTINCT t.TicketID) AS ticketCount
    FROM Tickets t
    JOIN Flights f ON t.FlightID = f.FlightID
    JOIN Aircraft ac ON f.AircraftID = ac.AircraftID
    JOIN Airlines al ON ac.AirlineID = al.AirlineID
    GROUP BY al.AirlineID
    
    UNION ALL
    
    SELECT 
      CONCAT('Revenue by Seat Class - ', t.SeatID) AS category,
      COALESCE(SUM(t.TicketPrice), 0) AS amount,
      COUNT(DISTINCT t.TicketID) AS ticketCount
    FROM Tickets t
    JOIN Seats s ON t.SeatID = s.SeatID
    GROUP BY s.SeatClass
  `
  return await selectQuery(sql)
}

export const fetchRevenueByAirline = async () => {
  const sql = `
    SELECT 
      al.AirlineID AS id,
      al.AirlineName AS airlineName,
      al.AirlineCode AS airlineCode,
      COUNT(DISTINCT t.TicketID) AS ticketCount,
      COALESCE(SUM(t.TicketPrice), 0) AS totalRevenue,
      ROUND(COALESCE(AVG(t.TicketPrice), 0), 2) AS averagePrice
    FROM Airlines al
    LEFT JOIN Aircraft ac ON al.AirlineID = ac.AirlineID
    LEFT JOIN Flights f ON ac.AircraftID = f.AircraftID
    LEFT JOIN Tickets t ON f.FlightID = t.FlightID
    GROUP BY al.AirlineID, al.AirlineName, al.AirlineCode
    ORDER BY totalRevenue DESC
  `
  return await selectQuery(sql)
}

export const fetchRevenueByFlight = async () => {
  const sql = `
    SELECT 
      f.FlightID AS id,
      f.FlightNumber,
      r.OriginAirportID,
      r.DestinationAirportID,
      a1.AirportCode AS originCode,
      a2.AirportCode AS destinationCode,
      COUNT(DISTINCT t.TicketID) AS ticketCount,
      COALESCE(SUM(t.TicketPrice), 0) AS totalRevenue,
      ROUND(COALESCE(AVG(t.TicketPrice), 0), 2) AS averagePrice,
      f.FlightStatus
    FROM Flights f
    JOIN Routes r ON f.RouteID = r.RouteID
    JOIN Airports a1 ON r.OriginAirportID = a1.AirportID
    JOIN Airports a2 ON r.DestinationAirportID = a2.AirportID
    LEFT JOIN Tickets t ON f.FlightID = t.FlightID
    GROUP BY f.FlightID, f.FlightNumber, f.FlightStatus
    ORDER BY totalRevenue DESC
  `
  return await selectQuery(sql)
}


export const fetchFlightStats = async () => {
  const sql = `
    SELECT 
      f.FlightStatus AS status,
      COUNT(DISTINCT f.FlightID) AS flightCount,
      COUNT(DISTINCT t.TicketID) AS ticketCount,
      COALESCE(SUM(t.TicketPrice), 0) AS totalRevenue
    FROM Flights f
    LEFT JOIN Tickets t ON f.FlightID = t.FlightID
    GROUP BY f.FlightStatus
  `
  return await selectQuery(sql)
}

export const fetchPassengerStats = async () => {
  const sql = `
    SELECT 
      COUNT(DISTINCT p.PassengerID) AS totalPassengers,
      COUNT(DISTINCT t.TicketID) AS totalTickets,
      COUNT(DISTINCT t.FlightID) AS uniqueFlights,
      COUNT(DISTINCT b.BookingID) AS totalBookings
    FROM Passengers p
    LEFT JOIN Tickets t ON p.PassengerID = t.PassengerID
    LEFT JOIN Bookings b ON t.BookingID = b.BookingID
  `
  return await selectQuery(sql)
}

export const fetchTopRoutes = async (limit = 5) => {
  const sql = `
    SELECT 
      r.RouteID AS id,
      a1.AirportCode AS origin,
      a2.AirportCode AS destination,
      a1.CityName AS originCity,
      a2.CityName AS destinationCity,
      COUNT(DISTINCT f.FlightID) AS flightCount,
      COUNT(DISTINCT t.TicketID) AS passengerCount,
      COALESCE(SUM(t.TicketPrice), 0) AS totalRevenue
    FROM Routes r
    JOIN Airports a1 ON r.OriginAirportID = a1.AirportID
    JOIN Airports a2 ON r.DestinationAirportID = a2.AirportID
    LEFT JOIN Flights f ON r.RouteID = f.RouteID
    LEFT JOIN Tickets t ON f.FlightID = t.FlightID
    GROUP BY r.RouteID, a1.AirportCode, a2.AirportCode
    ORDER BY flightCount DESC
    LIMIT ?
  `
  return await selectQuery(sql, [limit])
}
