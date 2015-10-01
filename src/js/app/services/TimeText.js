var moment = require('moment-timezone')

var sameDay = function (t1, t2) {
  return t1.getFullYear() === t2.getFullYear() &&
  t1.getMonth() === t2.getMonth() &&
  t1.getDate() === t2.getDate()
}

module.exports = {
  range: function (start, end) {
    var startText = moment(start).calendar(null, {
      sameElse: 'dddd, MMM D, YYYY [at] h:mm A'
    })
    if (!end) {
      return startText
    } else if (sameDay(start, end)) {
      startText = startText.replace(' at ', ' from ')
      var endText = moment(end).format('h:mm A')
      return format('%s to %s', startText, endText)
    } else {
      return format('%s to %s', startText, moment(end).calendar())
    }
  },

  rangeFullText: function (start, end) {
    if (!end) {
      return moment(start).format('LLLL')
    } else {
      return moment(start).format('LLLL') + ' to ' + moment(end).format('LLLL')
    }
  }
}
