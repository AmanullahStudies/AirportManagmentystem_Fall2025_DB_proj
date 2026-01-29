// src/apis/RoutesApi.js
import { selectQuery, mutationQuery } from './dbApi'

export const fetchRoutes = async () => {
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

export const fetchAirportsForDropdown = async () => {
  const sql = `
    SELECT 
      AirportID AS id,
      AirportCode AS code,
      AirportName AS name,
      CityName AS city
    FROM Airports
    ORDER BY AirportName ASC
  `
  return await selectQuery(sql)
}

export const addRoute = async (originAirportId, destinationAirportId, distance) => {
  const sql = `
    INSERT INTO Routes (OriginAirportID, DestinationAirportID, DistanceKM)
    VALUES (?, ?, ?)
  `
  return await mutationQuery(sql, [originAirportId, destinationAirportId, distance])
}

export const updateRoute = async (id, originAirportId, destinationAirportId, distance) => {
  const sql = `
    UPDATE Routes
    SET OriginAirportID = ?, DestinationAirportID = ?, DistanceKM = ?
    WHERE RouteID = ?
  `
  return await mutationQuery(sql, [originAirportId, destinationAirportId, distance, id])
}

export const deleteRoute = async (id) => {
  const sql = 'DELETE FROM Routes WHERE RouteID = ?'
  return await mutationQuery(sql, [id])
}
