// Taken from https://github.com/twolfson/gulp.spritesmith/blob/6.5.1/test/utils/child.js
// Load in dependencies
const spawnSync = require('child_process').spawnSync;

// Define our execution helper
function _filterStderr(stderr) {
  return stderr.split(/\n/g).filter(function isOutOfScopeLine (line) {
    // Linux errors:
    //   Error: [27574:1011/011913.891018:ERROR:gles2_cmd_decoder.cc(2475)] [GroupMarkerNotSet(crbug.com/242999)!:D01089D00A3B0000]GL ERROR :GL_INVALID_ENUM : BackFramebuffer::Create: <- error from previous GL command
    // Travis CI errors:
    //   Xlib:  extension "RANDR" missing on display ":99.0".
    //   process 2776: D-Bus library appears to be incorrectly set up; failed to read machine uuid: Failed to open "/etc/machine-id": No such file or directory
    //     See the manual page for dbus-uuidgen to correct this issue.
    return !(
      line.includes('GL ERROR') ||
      line.includes('extension "RANDR" missing') ||
      line.includes('D-Bus library appears to be incorrectly set up') ||
      line.includes('manual page for dbus-uuidgen'));
  }).join('\n');
}
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
    let stderr = _filterStderr(spawnResult.stderr.toString());
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

    let stderr = _filterStderr(spawnResult.stderr.toString());
    if (stderr) {
      this.err = new Error(stderr);
    }
  });
  after(function cleanup () {
    delete this.err;
  });
};
