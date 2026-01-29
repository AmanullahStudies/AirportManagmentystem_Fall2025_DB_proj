import { selectQuery, mutationQuery } from './dbApi'

/**
 * Fetch all Airlines from Airlines table
 */
export const fetchAirlines = async () => {
  const sql = `
    SELECT 
      AirlineID AS id, 
      AirlineName AS name, 
      AirlineCode AS code, 
      CountryOfOrigin AS country, 
      ContactEmail AS email, 
      ContactPhone AS phone, 
      AirlineStatus AS status
    FROM Airlines
    ORDER BY AirlineID DESC
  `
  return await selectQuery(sql)
}

/**
 * Add a new Airline
 */
export const addAirline = async (name, code, country, email, phone, status = 'Active') => {
  const sql = `
    INSERT INTO Airlines 
      (AirlineName, AirlineCode, CountryOfOrigin, ContactEmail, ContactPhone, AirlineStatus)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  return await mutationQuery(sql, [name, code, country, email, phone, status])
}

/**
 * Update an existing Airline
 */
export const updateAirline = async (id, name, code, country, email, phone, status) => {
  const sql = `
    UPDATE Airlines 
    SET AirlineName = ?, AirlineCode = ?, CountryOfOrigin = ?, ContactEmail = ?, ContactPhone = ?, AirlineStatus = ?
    WHERE AirlineID = ?
  `
  return await mutationQuery(sql, [name, code, country, email, phone, status, id])
}

/**
 * Delete an Airline
 */
export const deleteAirline = async (id) => {
  const sql = 'DELETE FROM Airlines WHERE AirlineID = ?'
  return await mutationQuery(sql, [id])
}
