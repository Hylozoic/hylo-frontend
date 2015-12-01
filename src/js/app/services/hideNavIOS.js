var isIOSApp = require('./isIOSApp')

module.exports = function (hide) {
  if (isIOSApp()) {
    if (hide) {
      console.log('hideNavIOS(true)')
      document.getElementById('nav').style.display = 'none'
    } else {
      console.log('hideNavIOS(false)')
      document.getElementById('nav').style.display = 'block'
    }
  }
}
