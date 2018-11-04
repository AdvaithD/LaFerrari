/* eslint-disable camelcase */
import chalk from 'chalk'
import distribute from './modules/distribute'
import createContract from './modules/createContract'
import pubs from './util/pubs'
// import toQR from './modules/toQR'
import express from 'express'
import io from 'socket.io-client'
import http from 'http'
const Web3 = require('web3')
const web3 = new Web3('https://ropsten.infura.io/v3/e6780ebea2fe4b1b8dde4c72fa0c78a8')
// var Tx = require('ethereumjs-tx')
// const Web3 = require('web3')
// var QRCode = require('qrcode')
// const low = require('lowdb')
// const FileSync = require('lowdb/adapters/FileSync')
// const adapter = new FileSync('db.json')
// const db = low(adapter)
// import distribute from './modules/distribute'
const port = 5000
const app = express()
let server = http.createServer(app)
const ioServer = require('socket.io')(server)

// const web3 = new Web3('https://ropsten.infura.io/v3/e6780ebea2fe4b1b8dde4c72fa0c78a8')
// const web3 = new Web3('https://ropsten.infura.io/v3/6395e443a0a9487b8f345b7aa684011d')
// Manufacturers address(generate from web3)
// const accountFrom = '0xaa2188f9dd12d91adab2045c42dfc76e2ace86c5'
// private key
// const pKey = '3f530f071eb45d61cd9be599a570d47d7e580999cfe525f9a7c0de1549513af0'
// private key parsed from buffer to hex
// const privateKeyFrom = Buffer.from(pKey, 'hex')
// const man_account = web3.eth.accounts.privateKeyToAccount(pKey)
// global variables
// var i, a, pub_keys, private_keys

// prototype DB defaults
// db.defaults({ qr: [] })
// .write()

ioServer.on('connection', socket => {
  socket.on('submit', async data => {
    try {
      let { company, productName, expiryDate, quantity, privKey, rebateVal } = data
      createContract(productName, 'Rebate smart contract test', expiryDate, company, quantity, pubs, web3)
      console.log(chalk.cyan.bold(
        `Form submitted
       ${company} - ${productName} - ${expiryDate} - ${quantity} - ${privKey} - ${rebateVal}`))

      await distribute(quantity, rebateVal, web3)
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
