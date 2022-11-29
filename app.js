const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
var colors = require('colors');
const connectToMongoDb = require('./config/database.config')
app.use(cors())
app.use(express.json())

connectToMongoDb()
module.exports = app;