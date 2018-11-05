/* eslint-disable camelcase */
import chalk from 'chalk'
import distribute from './modules/distribute'
import createContract from './modules/createContract'
import pubs from './util/pubs'
// import toQR from './modules/toQR'
import EventEmitter from 'events'
import express from 'express'
import io from 'socket.io-client'
import http from 'http'
const Web3 = require('web3')
const web3 = new Web3('https://ropsten.infura.io/v3/e6780ebea2fe4b1b8dde4c72fa0c78a8')
const FileAsync = require('lowdb/adapters/FileAsync')
const low = require('lowdb')

const port = 5000
const app = express()
let server = http.createServer(app)
const ioServer = require('socket.io')(server)
class Emitter extends EventEmitter {}
const listener = new Emitter()

const adapter = new FileAsync('db.json')
low(adapter)
  .then(db => {
    // Routes
    // GET /posts/:id
    app.get('/posts/:id', (req, res) => {
      const post = db.get('posts')
        .find({ id: req.params.id })
        .value()

      res.send(post)
    })

    // POST /posts
    app.post('/posts', (req, res) => {
      db.get('posts')
        .push(req.body)
        .last()
        .assign({ id: Date.now().toString() })
        .write()
        .then(post => res.send(post))
    })

    // Set db default values
    return db.defaults({ posts: [] }).write()
  })
  .then(() => {
    app.listen(3000, () => console.log('listening on port 3000'))
  })

ioServer.on('connection', socket => {
  socket.on('submit', async data => {
    try {
      let { company, productName, expiryDate, quantity, privKey, rebateVal } = data
      // createContract(productName, 'Rebate smart contract test', expiryDate, company, quantity, pubs)
      console.log(chalk.cyan.bold(
        `Form submitted
       ${company} - ${productName} - ${expiryDate} - ${quantity} - ${privKey} - ${rebateVal}`))

      await distribute(quantity, rebateVal, web3, listener)
      listener.on('txHash', txHash => {
        socket.emit('txHash', txHash)
      })
    } catch (error) {
      console.log(error)
    }
  })
  socket.emit('hello', 8001)
  console.log('user connected')
})

server.listen(port, () => {
  console.log('listening')
})
