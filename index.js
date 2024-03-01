const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 8000

app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(PORT, "0.0.0.0", () => console.log(`Server listening on port ${PORT}...`))