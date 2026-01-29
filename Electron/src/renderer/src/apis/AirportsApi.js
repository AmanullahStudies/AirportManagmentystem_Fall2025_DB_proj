// src/apis/AirportsApi.js
import { selectQuery, mutationQuery } from './dbApi'

export const fetchAirports = async () => {
  const sql = `
    SELECT 
      AirportID AS id, 
      AirportName AS name, 
      AirportCode AS code,
      CityName AS city,
      CountryName AS country
    FROM Airports
    ORDER BY AirportID DESC
  `
  return await selectQuery(sql)
}

export const addAirport = async (name, code, city, country) => {
  const sql = `
    INSERT INTO Airports (AirportName, AirportCode, CityName, CountryName)
    VALUES (?, ?, ?, ?)
  `
  return await mutationQuery(sql, [name, code, city, country])
}

export const updateAirport = async (id, name, code, city, country) => {
  const sql = `
    UPDATE Airports
    SET AirportName = ?, AirportCode = ?, CityName = ?, CountryName = ?
    WHERE AirportID = ?
  `
  return await mutationQuery(sql, [name, code, city, country, id])
}

export const deleteAirport = async (id) => {
  const sql = 'DELETE FROM Airports WHERE AirportID = ?'
  return await mutationQuery(sql, [id])
}
