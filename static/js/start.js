document.socket = io.connect("wss://rury-3d-sajecki-ciszewski.herokuapp.com")
var socket = document.socket
const input = document.getElementById('input')
const btn = document.getElementById('btn')
const root = document.getElementById('root')
const controls = document.getElementById('controls')
const joinCont = document.getElementById('join-cont')
const players = document.getElementById('players')
const player1 = document.getElementById('player1')
const player2 = document.getElementById('player2')
const audio = document.getElementById('audio')
const timer = document.getElementById('timer')
const minutes = document.getElementById('minutes')
const seconds = document.getElementById('seconds')
const winLose = document.getElementById('win-lose')
const vid1 = document.getElementById("monitor1")
const vid2 = document.getElementById("monitor2")
var time = 90
var isPlaying = true
audio.setAttribute("src", "../audio/lobby.wav")
audio.loop = true
audio.play()

function lobbyPlay() {
    audio.setAttribute("src", "../audio/lobby.wav")
    audio.loop = true
    audio.play()
}

function log() {
    if (input.value.trim().length > 20) {
        input.value = ''
        alert('za dlugi nick')
    } else if (input.value.trim() != '') {
        socket.emit('join', input.value.trim(), socket.id)
        joinCont.style.display = 'none'
        root.style.display = 'block'
        controls.style.display = 'block'
        players.style.display = 'flex'
        timer.style.display = 'block'
        socket.emit('getPlayers')
    }
    else {
        input.value = ''
        alert('podaj jakis nick')
    }
}

socket.on('getPlayers', (players) => {
    if (players.length == 2) {
        player1.innerHTML = players[1] + " &#128721"
        player2.innerHTML = players[0] + " &#128154"
    } else {
        player1.innerHTML = players[0] + " &#128721"
    }
})
socket.on('win', () => {
    isPlaying = false
    winLose.style.backgroundImage = 'url("../gpx/win.png")'
    winLose.style.display = 'block'
})
socket.on('tick', () => {
    console.log(`time goes by... ${time}`)
    vid1.play()
    vid2.play()
    if (isPlaying) {
        time--
        minutes.innerHTML = Math.floor(time / 60)
        if (time % 60 < 10) {
            seconds.innerHTML = '0' + time % 60
        } else {
            seconds.innerHTML = time % 60
        }
    }
})
socket.on('lost', () => {
    if (!isPlaying) return
    winLose.style.backgroundImage = 'url("../gpx/lose.png")'
    winLose.style.display = 'block'
})