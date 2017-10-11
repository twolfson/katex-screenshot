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
  imageUtils.loadActual(__dirname + '/actual-files/valid.png');
  imageUtils.loadExpected(__dirname + '/expected-files/valid.png');

  it('generates a screenshot', function () {
    expect(this.actualPixels).to.deep.equal(this.expectedPixels);
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
