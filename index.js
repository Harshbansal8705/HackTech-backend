const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const {client} = require("./redis")
require('dotenv').config()
const router = require('./controllers/routes/router')
const app = express()
const PORT = 8000
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.error("Could not connect to MongoDB!", err))
try {

    client.connect();
    client.on("error", err => console.log("Redis client error: ", err));
    client.on("connect", () => console.log("Connected to redis"));

    // client.FLUSHALL();

} catch (e) {
    console.log(e)
}
app.use(cors())
app.use(express.json() , express.urlencoded({extended : true }));
app.use('/' , require('./controllers/routes/router'));
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(PORT, "0.0.0.0", () => console.log(`Server listening on port ${PORT}...`))