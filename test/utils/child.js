// Taken from https://github.com/twolfson/gulp.spritesmith/blob/6.5.1/test/utils/child.js
// Load in dependencies
const spawnSync = require('child_process').spawnSync;

// Define our execution helper
exports.run = function (cmd, args) {
  before(function runFn () {
    let spawnResult = spawnSync(cmd, args);
    let err = spawnResult.error;
    if (err) {
      throw err;
    }
    if (stderr) {
      throw new Error(stderr);
    }
  });
};
exports.runSaveError = function (cmd, args) {
  before(function runFn () {
    let spawnResult = spawnSync(cmd, args);
    let err = spawnResult.error;
    if (err) {
      this.err = err;
    } else if (stderr) {
      this.err = new Error(stderr);
    }
  });
  after(function cleanup () {
    delete this.err;
  });
};
