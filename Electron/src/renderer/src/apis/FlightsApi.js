// src/apis/FlightsApi.js
import { selectQuery, mutationQuery } from './dbApi'

export const fetchFlights = async () => {
  const sql = `
    SELECT 
      f.FlightID AS id,
      f.FlightNumber AS flightNumber,
      f.RouteID AS routeId,
      f.AircraftID AS aircraftId,
      f.ScheduledDeparture AS scheduledDeparture,
      f.ScheduledArrival AS scheduledArrival,
      f.FlightStatus AS flightStatus,
      a.RegistrationNumber AS aircraftRegistration,
      air.AirlineName AS airlineName,
      r.OriginAirportID AS originAirportId,
      r.DestinationAirportID AS destinationAirportId,
      a1.AirportCode AS originCode,
      a1.AirportName AS originName,
      a1.CityName AS originCity,
      a2.AirportCode AS destinationCode,
      a2.AirportName AS destinationName,
      a2.CityName AS destinationCity
    FROM Flights f
    JOIN Routes r ON f.RouteID = r.RouteID
    JOIN Aircraft a ON f.AircraftID = a.AircraftID
    JOIN Airlines air ON a.AirlineID = air.AirlineID
    JOIN Airports a1 ON r.OriginAirportID = a1.AirportID
    JOIN Airports a2 ON r.DestinationAirportID = a2.AirportID
    ORDER BY f.FlightID DESC
  `
  return await selectQuery(sql)
}

export const fetchRoutesForDropdown = async () => {
  const sql = `
    SELECT 
      r.RouteID AS id,
      r.OriginAirportID AS originAirportId,
      r.DestinationAirportID AS destinationAirportId,
      r.DistanceKM AS distance,
      a1.AirportCode AS originCode,
      a1.AirportName AS originName,
      a1.CityName AS originCity,
      a2.AirportCode AS destinationCode,
      a2.AirportName AS destinationName,
      a2.CityName AS destinationCity
    FROM Routes r
    JOIN Airports a1 ON r.OriginAirportID = a1.AirportID
    JOIN Airports a2 ON r.DestinationAirportID = a2.AirportID
    ORDER BY r.RouteID DESC
  `
  return await selectQuery(sql)
}

export const fetchAircraftForDropdown = async () => {
  const sql = `
    SELECT 
      a.AircraftID AS id,
      a.RegistrationNumber AS registrationNumber,
      a.AircraftStatus AS status,
      air.AirlineName AS airlineName,
      am.ModelName AS modelName,
      am.ManufacturerName AS manufacturerName,
      am.TotalSeatCapacity AS seatCapacity
    FROM Aircraft a
    JOIN Airlines air ON a.AirlineID = air.AirlineID
    JOIN AircraftModels am ON a.AircraftModelID = am.AircraftModelID
    WHERE a.AircraftStatus = 'ACTIVE'
    ORDER BY a.RegistrationNumber ASC
  `
  return await selectQuery(sql)
}

export const addFlight = async (
  flightNumber,
  routeId,
  aircraftId,
  scheduledDeparture,
  scheduledArrival
) => {
  const sql = `
    INSERT INTO Flights (FlightNumber, RouteID, AircraftID, ScheduledDeparture, ScheduledArrival, FlightStatus)
    VALUES (?, ?, ?, ?, ?, 'SCHEDULED')
  `
  return await mutationQuery(sql, [
    flightNumber,
    routeId,
    aircraftId,
    scheduledDeparture,
    scheduledArrival
  ])
}

export const updateFlight = async (
  id,
  flightNumber,
  routeId,
  aircraftId,
  scheduledDeparture,
  scheduledArrival,
  flightStatus
) => {
  const sql = `
    UPDATE Flights
    SET FlightNumber = ?, RouteID = ?, AircraftID = ?, ScheduledDeparture = ?, ScheduledArrival = ?, FlightStatus = ?
    WHERE FlightID = ?
  `
  return await mutationQuery(sql, [
    flightNumber,
    routeId,
    aircraftId,
    scheduledDeparture,
    scheduledArrival,
    flightStatus,
    id
  ])
}

export const deleteFlight = async (id) => {
  const sql = 'DELETE FROM Flights WHERE FlightID = ?'
  return await mutationQuery(sql, [id])
}
