// Taken from https://github.com/twolfson/gulp.spritesmith/blob/6.5.1/test/utils/image.js
// Enable strict mode for Node.js@4
'use strict';

// Load in our dependencies
const getPixels = require('get-pixels');

// Define our helpers
exports.loadPixels = function (key, filepath) {
  before(function loadPixelsFn (done) {
    let that = this;
    getPixels(filepath, function handleGetPixels (err, pixels) {
      that[key] = pixels;
      done(err);
    });
  });
};
