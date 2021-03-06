var http = require('http')
var simpleConcat = require('simple-concat')

var HOST = 'members.calbar.ca.gov'
var PATH = '/fal/Member/Detail/'

var ACTIVE = 'This attorney is active and may practice law in California.'

module.exports = function (number, email, callback) {
  var calledBack = false
  function done (optionalError, match, active) {
    if (!calledBack) {
      calledBack = true
      callback(optionalError, match, active)
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
        var html = buffer.toString()
        // The Bar's database does some predictable mangling and
        // encoding on e-mail addresses---the real address and the
        // "fuzz" included to prevent easy scraping---which we replicate
        // here.
        //
        // We could do a function (number, callback) -> error | email
        // if we drove a headless browser and did a query on visible
        // text.  But this is leaner, meaner, and probably better for
        // the use case I have in mind.
        var firstSplit = email.split('@')
        var secondSplit = firstSplit[1].split('.')
        var mangled = (
          firstSplit[0] + '&#64;' +
          secondSplit[0] + '<span>&#46;</span>' + secondSplit[1]
        )
        var emailAppears = html.indexOf(mangled) !== -1
        var active = html.indexOf(ACTIVE) !== -1
        done(null, emailAppears, active)
      })
    })
    .end()
}
