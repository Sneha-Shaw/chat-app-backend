
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import webSocketFunctions from './controllers/webSocketFunctions.js'
import Router from './routes/index.js'
import databaseConnection from "./databaseConnection.js"


const app = express()
// set security HTTP headers
app.use(helmet())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// parse json request body
app.use(express.json())

// enable cors

app.use(cors())


// Server Listen
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

// Routes
app.use('/api', Router)

// home route
app.get('/', (req, res) => {
    res.send('Chat Backend is running...')
})

// page not found
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Page not found',
        data: null
    })
})

// Database Connection
databaseConnection()

// Websocket
webSocketFunctions(server)