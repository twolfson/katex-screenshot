// Taken from https://github.com/twolfson/gulp.spritesmith/blob/6.5.1/test/utils/image.js
var getPixels = require('get-pixels');

// Define our helpers
exports.loadActual = function (filepath) {
  before(function loadActualFn (done) {
    var that = this;
    getPixels(filepath, function handleGetPixels (err, pixels) {
      that.actualPixels = pixels;
      done(err);
    });
  });
};

exports.loadExpected = function (filepath) {
  before(function loadExpectedFn (done) {
    var that = this;
    getPixels(filepath, function handleGetPixels (err, pixels) {
      that.expectedPixels = pixels;
      done(err);
    });
  });
};
