const express = require('express')
const app = express()
const server = require('http').createServer(app)
const socket = require('socket.io')
const io = socket(server)
const Datastore = require('nedb')
const path = require('path')
var counter = 1

var levels = new Datastore({
    filename: './database/levels.db',
    autoload: true
})
// let level = {
//     level:[{"config":{"scale":2.9,"positionX":400,"positionY":200,"positionZ":80,"rotation":-0.2,"width":4,"height":4},"state":[[{"type":"elbow","rotation":1,"active":false},{"type":"tee","rotation":1,"active":false},{"type":"elbow","rotation":1,"active":true},{"type":"exit","rotation":1,"active":false}],[{"type":"exit","rotation":2,"active":false},{"type":"exit","rotation":0,"active":false},{"type":"tee","rotation":2,"active":true},{"type":"tee","rotation":3,"active":false}],[{"type":"exit","rotation":0,"active":false},{"type":"tee","rotation":1,"active":false},{"type":"input","base":"tee","rotation":0,"active":true},{"type":"exit","rotation":1,"active":false}],[{"type":"exit","rotation":2,"active":false},{"type":"elbow","rotation":1,"active":false},{"type":"elbow","rotation":0,"active":true},{"type":"exit","rotation":1,"active":false}]]},{"config":{"scale":2.9,"positionX":400,"positionY":200,"positionZ":80,"rotation":-0.2,"width":4,"height":4},"state":[[{"type":"exit","rotation":3,"active":false},{"type":"elbow","rotation":1,"active":false},{"type":"exit","rotation":2,"active":false},{"type":"exit","rotation":2,"active":false}],[{"type":"tee","rotation":1,"active":false},{"type":"tee","rotation":3,"active":false},{"type":"tee","rotation":1,"active":false},{"type":"elbow","rotation":3,"active":false}],[{"type":"exit","rotation":0,"active":false},{"type":"exit","rotation":0,"active":false},{"type":"input","base":"tee","rotation":1,"active":true},{"type":"elbow","rotation":3,"active":true}],[{"type":"exit","rotation":2,"active":false},{"type":"tee","rotation":3,"active":true},{"type":"elbow","rotation":3,"active":true},{"type":"exit","rotation":1,"active":false}]]}]
// }
// levels.insert(level)
var players = new Datastore({
    filename: './database/players.db',
    autoload: true
})

app.use(express.static("static"))
app.use(express.static("static/game"))

app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname + '/static/game/index.html'))
})

app.get('/level', (_req, res) => {
    levels.findOne({}, (err, doc) => { res.send(doc) })
})

app.get('/favicon.ico', (_req, res) => {
    res.type("image/x-icon")
    res.sendFile(path.join(__dirname + '/favicon.ico'))
})

server.listen(3000, () => {
    console.info('server running at port 3000')
})

io.on('connection', (socket) => {
    socket.on('join', (nick) => {
        if (io.sockets.adapter.rooms.get('room' + counter) == undefined) {
            socket.join('room' + counter)
            let player = {
                id: socket.id,
                nick: nick,
                room: 'room' + counter,
                color: 'red'
            }
            players.insert(player)
            socket.emit('setColor', player.color)
        } else if (io.sockets.adapter.rooms.get('room' + counter).size == 1) {
            socket.join('room' + counter)
            let player = {
                id: socket.id,
                nick: nick,
                room: 'room' + counter,
                color: 'green'
            }
            players.insert(player)
            socket.emit('setColor', player.color)
            io.to('room' + counter).emit("startGame")
            counter++
        }
    })
    socket.on('disconnect', () => {
        players.remove({
            id: socket.id
        }, {})
        console.log('player disconnected', socket.id)
    })
    socket.on('getPlayers', () => {
        console.log('getplayers')
        let tab = []
        let room = ''
        players.findOne({
            id: socket.id
        }, (err, doc) => {
            room = doc.room
            players.find({
                room: room
            }, (err, doc2) => {
                for (let nick of doc2) {
                    tab.push(nick.nick)
                }
                console.log(room, tab)
                io.to(room).emit("getPlayers", tab)
            })
        })
    })
    socket.on('rotation', (userData) => {
        players.findOne({ id: socket.id }, (err, doc) => {
            players.find({ room: doc.room }, (err, doc2) => {
                for (let player of doc2) {
                    if (player.id != socket.id) {
                        io.to(player.id).emit('rotation', userData)
                    }
                }
            })
        })
    })
    socket.on('win', () => {
        players.findOne({ id: socket.id }, (err, doc) => {
            io.to(doc.room).emit('win')
        })
    })
})

