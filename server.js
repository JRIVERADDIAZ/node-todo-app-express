// Load env variables
if (process.env.NODE_ENV != "production") {
    require("dotenv").config()
}

// Import dependencies
const express = require("express");

const cors = require("cors")

const cookieParser = require('cookie-parser')

const connectToDb = require('./config/connectToDb')

const notesControler = require('./controllers/notescontroler')
const userController = require('./controllers/userController')
const requireAuth = require('./middleware/requireAuth')

// Create an express app 
const app = express();

// Middleware to parse JSON in the request body
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: true,
    credentials: true
}
))

// Create to a database 
connectToDb()

// Routing
// User Routes
app.post('/signup', userController.signUp)

app.post('/login', userController.login)

app.get('/logout', userController.logout)

app.get('/check-auth', requireAuth, userController.checkAuth)

// Notes Routes
app.get('/notes/:id', requireAuth, notesControler.fetchSpecificNotes);

app.get('/notes', requireAuth, notesControler.fetchAllNotes);

app.post('/notes', requireAuth, notesControler.createNote)

app.put('/notes/:id', requireAuth, notesControler.editNote);

app.delete('/notes/:id', requireAuth,  notesControler.deleteNote);

// Start our server
app.listen(process.env.PORT);