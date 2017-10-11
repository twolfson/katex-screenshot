// Taken from https://github.com/twolfson/gulp.spritesmith/blob/6.5.1/test/utils/image.js
// Enable strict mode for Node.js@4
'use strict';

// Load in our dependencies
const getPixels = require('get-pixels');

// Define our helpers
exports.loadActual = function (filepath) {
  before(function loadActualFn (done) {
    let that = this;
    getPixels(filepath, function handleGetPixels (err, pixels) {
      that.actualPixels = pixels;
      done(err);
    });
  });
};

exports.loadExpected = function (filepath) {
  before(function loadExpectedFn (done) {
    let that = this;
    getPixels(filepath, function handleGetPixels (err, pixels) {
      that.expectedPixels = pixels;
      done(err);
    });
  });
};
