// Enable strict mode for Node.js@4
'use strict';

// Load in dependencies
const expect = require('chai').expect;

const childUtils = require('./utils/child');
const imageUtils = require('./utils/image');

// Define our constants
const katexScreenshotFilepath = __dirname + '/../bin/katex-screenshot.js';

// Start our tests
describe('katex-screenshot screenshotting a valid .tex file', function () {
  childUtils.run(katexScreenshotFilepath, [
    __dirname + '/test-files/valid.tex',
    __dirname + '/actual-files/valid.png']);
  imageUtils.loadPixels('actualPixels', __dirname + '/actual-files/valid.png');
  imageUtils.loadPixels('expectedPixelsLinux', __dirname + '/expected-files/valid-linux.png');
  imageUtils.loadPixels('expectedPixelsOsx', __dirname + '/expected-files/valid-osx.png');

  it('generates a screenshot', function () {
    let expectedPixels = process.platform === 'darwin' ? this.expectedPixelsOsx : this.expectedPixelsLinux;
    expect(this.actualPixels).to.deep.equal(expectedPixels);
  });
});

describe('katex-screenshot screenshotting an invalid .tex file', function () {
  childUtils.runSaveError(katexScreenshotFilepath, [
    __dirname + '/test-files/invalid.tex',
    __dirname + '/actual-files/invalid.png']);

  it('outputs an error message', function () {
    expect(this.err).to.not.equal(null);
    expect(this.err.message).to.contain('KaTeX parse error');
  });
});
