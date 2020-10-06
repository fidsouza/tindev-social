const express = require('express')
const routes = require('./routes')
const mongoose = require ('mongoose')
const cors = require('cors')
const favicon = require('express-favicon')
const path = require('path')

require('dotenv').config()

const app = express()
const server     = require('http').Server(app)
const io   = require('socket.io')(server)

const connectedUser  = {}

io.on('connection' , socket => {
    const {user } = socket.handshake.query 
    connectedUser[user] = socket.id

    console.log(user,socket.id)
})

mongoose.connect(process.env.DB_URI,{
    useUnifiedTopology:true ,
    useNewUrlParser:true
})

app.use((req,res,next) => {
    req.io = io
    req.connectedUser = connectedUser

    return next()
})

app.use(favicon(__dirname + '/build/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.use(cors())
app.use(express.json())
app.use(routes) 
app.use("/*", express.static(__dirname + "/../../frontend/dist"))

const port = process.env.PORT || 9999

server.listen(port)