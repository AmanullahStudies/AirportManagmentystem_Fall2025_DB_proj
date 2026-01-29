// src/apis/AircraftApi.js
import { selectQuery, mutationQuery } from './dbApi'

export const fetchAircraft = async () => {
  const sql = `
    SELECT 
      a.AircraftID AS id,
      a.RegistrationNumber AS registrationNumber,
      a.AircraftStatus AS status,
      a.AircraftModelID AS modelId,
      a.AirlineID AS airlineId,
      air.AirlineName AS airlineName,
      air.AirlineCode AS airlineCode,
      am.AircraftModelID AS aircraftModelId,
      am.ModelName AS modelName,
      am.ManufacturerName AS manufacturerName,
      am.TotalSeatCapacity AS seatCapacity
    FROM Aircraft a
    JOIN Airlines air ON a.AirlineID = air.AirlineID
    JOIN AircraftModels am ON a.AircraftModelID = am.AircraftModelID
    ORDER BY a.AircraftID DESC
  `
  return await selectQuery(sql)
}

export const fetchAirlinesForDropdown = async () => {
  const sql = `
    SELECT 
      AirlineID AS id,
      AirlineCode AS code,
      AirlineName AS name
    FROM Airlines
    WHERE AirlineStatus = 'ACTIVE'
    ORDER BY AirlineName ASC
  `
  return await selectQuery(sql)
}

export const fetchAircraftModelsForDropdown = async () => {
  const sql = `
    SELECT 
      AircraftModelID AS id,
      ManufacturerName AS manufacturerName,
      ModelName AS modelName,
      TotalSeatCapacity AS seatCapacity
    FROM AircraftModels
    ORDER BY ManufacturerName ASC, ModelName ASC
  `
  return await selectQuery(sql)
}

export const addAircraft = async (registrationNumber, aircraftModelId, airlineId) => {
  const sql = `
    INSERT INTO Aircraft (RegistrationNumber, AircraftModelID, AirlineID, AircraftStatus)
    VALUES (?, ?, ?, 'ACTIVE')
  `
  return await mutationQuery(sql, [registrationNumber, aircraftModelId, airlineId])
}

export const updateAircraft = async (
  id,
  registrationNumber,
  aircraftModelId,
  airlineId,
  status
) => {
  const sql = `
    UPDATE Aircraft
    SET RegistrationNumber = ?, AircraftModelID = ?, AirlineID = ?, AircraftStatus = ?
    WHERE AircraftID = ?
  `
  return await mutationQuery(sql, [registrationNumber, aircraftModelId, airlineId, status, id])
}

export const deleteAircraft = async (id) => {
  const sql = 'DELETE FROM Aircraft WHERE AircraftID = ?'
  return await mutationQuery(sql, [id])
}
