const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const PORT = 8000

mongoose.connect("mongodb://localhost:27017/hacktech")
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.error("Could not connect to MongoDB!", err))

app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(PORT, "0.0.0.0", () => console.log(`Server listening on port ${PORT}...`))