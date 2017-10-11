// Load in dependencies
const assert = require('assert');

const childUtils = require('./utils/child');

// Define our constants
const katexScreenshotFilepath = __dirname + '/../bin/katex-screenshot.js';

// Start our tests
describe('katex-screenshot screenshotting a valid .tex file', function () {
  childUtils.run(katexScreenshotFilepath, [
    __dirname + '/test-files/valid.tex',
    __dirname + '/actual-files/valid.png']);

  it('generates a screenshot', function () {
    assert.strictEqual(true, false);
  });
});

describe.skip('katex-screenshot screenshotting an invalid .tex file', function () {
  it('outputs error message', function () {
    assert.strictEqual(true, false);
  });
});
