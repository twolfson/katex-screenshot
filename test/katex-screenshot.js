// Load in dependencies
const assert = require('assert');

// Define our constants
const katexScreenshotFilepath = __dirname + '/../bin/katex-screenshot.js';

// Start our tests
describe.skip('katex-screenshot screenshotting a valid .tex file', function () {
  it('generates a screenshot', function () {
    assert.strictEqual(true, false);
  });
});

describe.skip('katex-screenshot screenshotting an invalid .tex file', function () {
  it('outputs error message', function () {
    assert.strictEqual(true, false);
  });
});
