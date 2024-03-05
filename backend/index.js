const connectToMongo = require("./db");
const express = require('express')
var cors = require('cors');

connectToMongo();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {
  console.log(`Backend is running on port ${port}`)
})