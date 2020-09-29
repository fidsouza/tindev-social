const express = require('express')
const routes = require('./routes')
const mongoose = require ('mongoose')
const cors = require('cors')
const connectionString = require('./connection/connection-mongo.json').connectionstring

const app = express()
const server     = require('http').Server(app)
const io   = require('socket.io')(server)

const connectedUser  = {}

io.on('connection' , socket => {
    const {user } = socket.handshake.query 
    connectedUser[user] = socket.id

    console.log(user,socket.id)
})

mongoose.connect(connectionString,{
    useUnifiedTopology:true ,
    useNewUrlParser:true
})

app.use((req,res,next) => {
    req.io = io
    req.connectedUser = connectedUser

    return next()
})

app.use(cors())
app.use(express.json())
app.use(routes) 

server.listen(3333)