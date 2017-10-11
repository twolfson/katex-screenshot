// Load in dependencies
var assert = require('assert');
var katexScreenshot = require('../');

// Start our tests
describe('katex-screenshot', function () {
  it('returns awesome', function () {
    assert.strictEqual(katexScreenshot(), 'awesome');
  });
});
