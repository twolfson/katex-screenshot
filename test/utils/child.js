// Taken from https://github.com/twolfson/gulp.spritesmith/blob/6.5.1/test/utils/child.js
// Load in dependencies
const spawnSync = require('child_process').spawnSync;

// Define our execution helper
exports.run = function (cmd, args) {
  before(function runFn () {
    // Run our function
    let spawnResult = spawnSync(cmd, args);

    // If there was an invocation error, then throw it
    let err = spawnResult.error;
    if (err) {
      throw err;
    }

    // Otherwise, if there was unexpected `stderr`, then throw it
    let stderr = spawnResult.stderr.toString();
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
      return;
    }

    let stderr = spawnResult.stderr.toString();
    if (stderr) {
      this.err = new Error(stderr);
    }
  });
  after(function cleanup () {
    delete this.err;
  });
};
