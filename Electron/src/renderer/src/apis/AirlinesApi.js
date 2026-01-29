// src/apis/AirlinesApi.js
import { selectQuery, mutationQuery } from './dbApi'

export const fetchAirlines = async () => {
  const sql = `
    SELECT 
      AirlineID AS id, 
      AirlineName AS name, 
      AirlineCode AS code,
      CountryOfOrigin AS country,
      AirlineStatus AS status
    FROM Airlines
    ORDER BY AirlineID DESC
  `
  return await selectQuery(sql)
}

export const addAirline = async (name, code, country) => {
  const sql = `
    INSERT INTO Airlines (AirlineName, AirlineCode, CountryOfOrigin, AirlineStatus)
    VALUES (?, ?, ?, 'ACTIVE')
  `
  return await mutationQuery(sql, [name, code, country])
}

export const updateAirline = async (id, name, code, country) => {
  const sql = `
    UPDATE Airlines
    SET AirlineName = ?, AirlineCode = ?, CountryOfOrigin = ?
    WHERE AirlineID = ?
  `
  return await mutationQuery(sql, [name, code, country, id])
}

export const deleteAirline = async (id) => {
  const sql = 'DELETE FROM Airlines WHERE AirlineID = ?'
  return await mutationQuery(sql, [id])
}
