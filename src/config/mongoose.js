
import mongoose from 'mongoose'
import { insertData } from './data.js'

/**
 * Establishes a connection to a database.
 *
 * @param {string} connectionString - The connection used to open the MongoDB database.
 * @returns {Promise} Resolves to this if connection succeeded.
 */
export const connectDB = async (connectionString) => {
  const { connection } = mongoose

  // Bind connection to events (to get notifications).
  connection.on('connected', () => {
    insertData()
    console.log('MongoDB connection opened.')
  })
  connection.on('error', err => console.error(`MongoDB connection error occurred: ${err}`))
  connection.on('disconnected', () => console.log('MongoDB is disconnected.'))

  // If the Node.js process ends, close the connection.
  process.on('SIGINT', () => {
    connection.close()
      .then(() => {
        console.log('Connection closed')

        process.exit(0)
      })
  })

  // Connect to the server.
  return mongoose.connect(connectionString)
}
