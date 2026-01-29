// src/apis/AircraftModelsApi.js
import { selectQuery, mutationQuery } from './dbApi'

export const fetchAircraftModels = async () => {
  const sql = `
    SELECT 
      AircraftModelID AS id,
      ManufacturerName AS manufacturerName,
      ModelName AS modelName,
      TotalSeatCapacity AS seatCapacity
    FROM AircraftModels
    ORDER BY AircraftModelID DESC
  `
  return await selectQuery(sql)
}

export const addAircraftModel = async (manufacturerName, modelName, seatCapacity) => {
  const sql = `
    INSERT INTO AircraftModels (ManufacturerName, ModelName, TotalSeatCapacity)
    VALUES (?, ?, ?)
  `
  return await mutationQuery(sql, [manufacturerName, modelName, seatCapacity])
}

export const updateAircraftModel = async (id, manufacturerName, modelName, seatCapacity) => {
  const sql = `
    UPDATE AircraftModels
    SET ManufacturerName = ?, ModelName = ?, TotalSeatCapacity = ?
    WHERE AircraftModelID = ?
  `
  return await mutationQuery(sql, [manufacturerName, modelName, seatCapacity, id])
}

export const deleteAircraftModel = async (id) => {
  const sql = 'DELETE FROM AircraftModels WHERE AircraftModelID = ?'
  return await mutationQuery(sql, [id])
}
