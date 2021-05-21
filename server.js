const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: { origin: "*" }
})
const Datastore = require('nedb')

var levels = new Datastore({
    filename: 'levels.db',
    autoload: true
})

app.use(express.static("static"))

server.listen(3000, () => {
    console.log('server running at port 3000')
})
