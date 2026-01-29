import { selectQuery, mutationQuery } from './dbApi'

export const fetchPassengers = async () => {
  const sql = `
    SELECT PassengerID AS id, FirstName AS firstName, LastName AS lastName, PassportNumber AS passport
    FROM Passengers
    ORDER BY PassengerID DESC
  `
  return await selectQuery(sql)
}

export const addPassenger = async (firstName, lastName, passport) => {
  const sql = `
    INSERT INTO Passengers (FirstName, LastName, PassportNumber)
    VALUES (?, ?, ?)
  `
  return await mutationQuery(sql, [firstName, lastName, passport])
}

export const updatePassenger = async (id, firstName, lastName, passport) => {
  const sql = `
    UPDATE Passengers
    SET FirstName = ?, LastName = ?, PassportNumber = ?
    WHERE PassengerID = ?
  `
  return await mutationQuery(sql, [firstName, lastName, passport, id])
}

export const deletePassenger = async (id) => {
  const sql = 'DELETE FROM Passengers WHERE PassengerID = ?'
  return await mutationQuery(sql, [id])
}
