const express = require('express')
const app = express()
const server = require('http').createServer(app)
const socket = require('socket.io')
const io = socket(server)
const Datastore = require('nedb')
const path = require('path')
var counter = 1

// var levels = new Datastore({
//     filename: './database/levels.db',
//     autoload: true
// })
var players = new Datastore({
    filename: './database/players.db',
    autoload: true
})

app.use(express.static("static"))
app.use(express.static("static/game"))

app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname + '/static/game/index.html'))
})

server.listen(3000, () => {
    console.info('server running at port 3000')
})

io.on('connection', (socket) => {
    console.log('connection', Object.keys(Object.fromEntries(io.sockets.adapter.rooms)).length, Object.keys(Object.fromEntries(io.sockets.adapter.rooms)), socket.id)
    socket.on('join', (nick) => {
        if (io.sockets.adapter.rooms.get('room' + counter) == undefined) {
            socket.join('room' + counter)
            let player = {
                id: socket.id,
                nick: nick,
                room: 'room' + counter
            }
            players.insert(player)
        } else if (io.sockets.adapter.rooms.get('room' + counter).size == 1) {
            socket.join('room' + counter)
            let player = {
                id: socket.id,
                nick: nick,
                room: 'room' + counter
            }
            players.insert(player)
            counter++
        }
    })
    socket.on('disconnect', () => {
        players.remove({ id: socket.id }, {})
        console.log('player disconnected', socket.id)
    })
    socket.on('getPlayers', () => {
        console.log('getplayers')
        let tab = []
        let room = ''
        players.findOne({ id: socket.id }, (err, doc) => {
            room = doc.room
            players.find({ room: room }, (err, doc2) => {
                for (let nick of doc2) {
                    tab.push(nick.nick)
                }
                console.log(room, tab)
                io.to(room).emit("getPlayers", tab)
            })
        })
    })
})