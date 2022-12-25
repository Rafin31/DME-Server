const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
var colors = require('colors');
const path = require('path');
const connectToMongoDb = require('./config/database.config')
const origin = "http://localhost:3000"

app.use(cors())
app.use(express.json())
app.use(express.static('public'));

connectToMongoDb()
module.exports = app;