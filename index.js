var http = require('http')
var simpleConcat = require('simple-concat')

var HOST = 'members.calbar.ca.gov'
var PATH = '/fal/Member/Detail/'

module.exports = function (number, email, callback) {
  var calledBack = false
  function done (optionalError, match) {
    if (!calledBack) {
      calledBack = true
      callback(optionalError, match)
    }
  }
  http.request({
    method: 'GET',
    host: HOST,
    path: PATH + number
  })
    .once('error', done)
    .once('response', function (response) {
      var status = response.statusCode
      if (status !== 200) {
        return done(new Error('server responded ' + status))
      }
      simpleConcat(response, function (error, buffer) {
        if (error) return done(error)
        var firstSplit = email.split('@')
        var secondSplit = firstSplit[1].split('.')
        var mangled = (
          firstSplit[0] + '&#64;' +
          secondSplit[0] + '<span>&#46;</span>' + secondSplit[1]
        )
        done(null, buffer.toString().indexOf(mangled) !== -1)
      })
    })
    .end()
}
