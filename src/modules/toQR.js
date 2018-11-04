const toQR = async (x, qrc) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve((await qrc.toDataURL(x)))
    } catch (err) {
      console.error('qrc ERROR - ' + err)
    }
  })
}

export default toQR
