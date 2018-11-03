import express from 'express'
import io from 'socket.io-client'
import http from 'http'
const port = process.env.PORT || 5000
const app = express()
let server = http.createServer(app)
const ioServer = require('socket.io')(server)

ioServer.on('connection', socket => {
  socket.emit('hello', 8001)
  send(socket)
  console.log('user connected')
})

server.listen(port, () => {
  console.log('listening')
})

const send = (socket) => {

}
