```javascript
var assert = require('assert')
var validate = require('./')

validate(
  282906, 'ansel@krinternetlaw.com',
  function (error, match, active) {
    assert.ifError(error, 'no error')
    assert.strictEqual(match, true, 'match')
    assert.strictEqual(active, true, 'active')
  }
)

validate(
  291465, 'kyle@kemitchell.com',
  function (error, match, active) {
    assert.ifError(error, 'no error')
    assert.strictEqual(match, true, 'match')
    assert.strictEqual(active, true, 'active')
  }
)

validate(
  291465, 'test@example.com',
  function (error, match, active) {
    assert.ifError(error, 'no error')
    assert.strictEqual(match, false, 'match')
    assert.strictEqual(active, true, 'active')
  }
)
```
