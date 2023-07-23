
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import webSocketFunctions from './controllers/webSocketFunctions.js'
import Router from './routes/index.js'
import databaseConnection from "./databaseConnection.js"
import bodyParser from "body-parser";

const app = express()
// set security HTTP headers
app.use(helmet())

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: false, limit: "200kb" }));
app.use(bodyParser.json({ limit: "200kb" }));

app.options("*", cors());

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

app.use((error, req, res, next) => {
    if (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
});

// Database Connection
databaseConnection()

// Websocket
webSocketFunctions(server)