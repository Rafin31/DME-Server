const express = require('express')

const { Server } = require('socket.io');
const http = require('http');
const app = express()



const cors = require('cors')
require('dotenv').config()
var colors = require('colors');
const path = require('path');
const connectToMongoDb = require('./config/database.config')
const origin = process.env.CLIENT_LINK



app.use(cors())
app.use(express.json())
app.use(express.static('public'));

connectToMongoDb()
module.exports = { app };