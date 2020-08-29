// Enable strict mode for Node.js@4
'use strict';

// Load in dependencies
const expect = require('chai').expect;
const pixelmatch = require('pixelmatch');

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
    // Verify dimensions are the same
    let actualWidth = this.actualPixels.shape[0];
    let expectedWidth = this.expectedPixels.shape[0];
    let actualHeight = this.actualPixels.shape[1];
    let expectedHeight = this.expectedPixels.shape[1];
    expect(`${actualWidth}x${actualHeight}`).to.equal(`${expectedWidth}x${expectedHeight}`);

    // Perform fuzzy comparison
    // DEV: Download failed image from CircleCI via:
    //   Run test with SSH
    //   Use SSH to download via base64 (we tried rsync but didn't try too long)
    //   ssh -p <PORT> <IP> -- 'base64 /home/circleci/project/debug.png' | base64 -d > ~/Desktop/debug.png && xdg-open ~/Desktop/debug.png
    let diffPixels = imageUtils._createDiffPixels(this.expectedPixels);
    let numDiffPixels = pixelmatch(
      this.actualPixels.data, this.expectedPixels.data, diffPixels.data,
      expectedWidth, expectedHeight, {threshold: 0.3});
    let MAXIMUM_DIFF_PIXELS = 100;
    if (numDiffPixels > MAXIMUM_DIFF_PIXELS) {
      console.error('Unexpected difference, saving diff image to `debug.png`');
      imageUtils._saveImage('debug.png', diffPixels, function noop () {});
    }
    expect(numDiffPixels).to.at.most(MAXIMUM_DIFF_PIXELS);
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
