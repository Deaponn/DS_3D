const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: { origin: "*" }
})
const Datastore = require('nedb')
const path = require('path')

var levels = new Datastore({
    filename: 'levels.db',
    autoload: true
})
var players = new Datastore({
    filename: 'players.db',
    autoload: true
})

app.use(express.static("static"))

app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname + '/static/html/start.html'))
})
app.get('/game', (_req, res) => {
    res.sendFile(path.join(__dirname + "/static/game/index.html"))
})
app.get('/choose', (_req, res) => {
    res.sendFile(path.join(__dirname + "/static/html/lobby_choose.html"))
})
app.get('/join', (_req, res) => {
    res.sendFile(path.join(__dirname + "/static/html/join.html"))
})
app.get('/lobby', (_req, res) => {
    res.sendFile(path.join(__dirname + "/static/html/lobby.html"))
})
io.on('connection', socket => {

})


server.listen(3000, () => {
    console.info('server running at port 3000')
})
