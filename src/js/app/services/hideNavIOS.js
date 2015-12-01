var isIOSApp = require('./isIOSApp')

module.exports = function (hide) {
  if (isIOSApp()) {
    if (hide) {
      document.getElementById('nav').style.display = 'none'
    } else {
      document.getElementById('nav').style.display = 'block'
    }
  }
}
