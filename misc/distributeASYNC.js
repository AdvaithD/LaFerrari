/ DISTRIBUTE FUNCTION //
const distribute = async (n, privK, val) => {
  return new Promise(async (resolve, reject) => {
    var accounts = {}

    for (i = 0; i < n; i++) {
      var account = await web3.eth.accounts.create()
      accounts[account.address] = account.privateKey
      console.log(chalk.green.bold(`New keypair created - ${account}`))
      pub_keys = Object.keys(accounts)
      private_keys = Object.values(accounts)
    }

    for (i = 0; i < private_keys.length; i++) {
      // console.log(private_keys)
      a = private_keys[i]
      // console.log(a)
      let qr = await toQR(a, QRCode)
      console.log(chalk.bgWhite.black(`New QR - qr`))
      db.get('qr')
        .push({ private_key: a, qr_code: qr })
        .write()
      // console.log(private_keys[i])
    }
    // console.log(private_keys)

    // console.log(private_keys)
    // console.log(accounts)
    let fNonce
    // Looking up nonce to update after every transaction
    web3.eth.getTransactionCount(man_account.address).then(async _nonce => {
      fNonce = '0x' + _nonce.toString(16)
      // console.log(pub_keys.length)
      for (i = 0; i < pub_keys.length; i++) {
        // console.log(pub_keys[i])
        const txObject = {
          from: man_account,
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
        await web3.eth.sendSignedTransaction(raw, (err, txHash) => {
          if (!err) console.log(txHash)
          else console.log(err)
        })
      }
      resolve(true)
    })
  })
}