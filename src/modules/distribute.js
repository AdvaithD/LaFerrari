/* eslint-disable camelcase */
var Tx = require('ethereumjs-tx')
// const Web3 = require('web3')
var QRCode = require('qrcode')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

// const web3 = new Web3('https://ropsten.infura.io/v3/e6780ebea2fe4b1b8dde4c72fa0c78a8')
// Manufacturers address(generate from web3)
const accountFrom = '0xaa2188f9dd12d91adab2045c42dfc76e2ace86c5'
// private key
const pKey = '3f530f071eb45d61cd9be599a570d47d7e580999cfe525f9a7c0de1549513af0'
// private key parsed from buffer to hex
const privateKeyFrom = Buffer.from(pKey, 'hex')
// global variables
var i, a, pub_keys, private_keys, fNonce

// prototype DB defaults
db.defaults({ qr: [], pubkeys: [] })
  .write()

let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const toQR = async (x) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve((await QRCode.toDataURL(x)))
    } catch (err) {
      console.error('QRCODE ERROR - ' + err)
    }
  })
}
// company, productName, expiryDate, quantity, privKey, rebateVal
export default async function (n, val, web3) {
  var accounts = {}
  for (i = 0; i < n; i++) {
    var account = await web3.eth.accounts.create()
    accounts[account.address] = account.privateKey
    pub_keys = Object.keys(accounts)
    private_keys = Object.values(accounts)
  }
  // push list of new pubkeys
  db.get('pubkeys')
    .push(pub_keys)
    .write()

  sleep(1000)
  for (i = 0; i < private_keys.length; i++) {
    // console.log(private_keys)
    a = private_keys[i]
    // console.log(a)
    let qr = await toQR(a, QRCode)
    db.get('qr')
      .push({ private_key: a, qr_code: qr })
      .write()
    // console.log(private_keys[i])
  }
  // console.log(private_keys)

  // console.log(private_keys)
  // console.log(accounts)

  // Looking up nonce to update after every transaction
  web3.eth.getTransactionCount(accountFrom).then(_nonce => {
    fNonce = '0x' + _nonce.toString(16)
    // console.log(pub_keys.length)
    for (i = 0; i < pub_keys.length; i++) {
      console.log(pub_keys[i])
      const txObject = {
        from: accountFrom,
        nonce: web3.utils.toHex(_nonce + i),
        to: pub_keys[i],
        value: web3.utils.toHex(web3.utils.toWei(val, 'ether')),
        gasLimit: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei'))
      }

      // Sign the transaction

      const tx = new Tx(txObject)
      tx.sign(privateKeyFrom)

      const serializedTx = tx.serialize()
      const raw = '0x' + serializedTx.toString('hex')

      // Broadcast the transaction
      web3.eth.sendSignedTransaction(raw, (err, txHash) => {
        if (err) {
          console.log(err)
        }
        console.log('txHash:', txHash)
      })
    }
  })
}
