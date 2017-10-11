// Load in our dependencies
const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;

// Add an error handler
window.addEventListener('error', function (err) {
  ipcRenderer.sendSync('browser-error', err.message);
});

// When our page loads, notify our main process
// TODO: Measure KaTeX and send back position/dimensions
// DEV: We use `.send()` over `.sendSync()` so content isn't blocked
// DEV: Errors in top-level lines might not be cause by error handler
// DEV: We use `*FrameSubscription` as `load`, `DOMContentLoaded`, and `webContents.on('did-finish-load')` don't work
//   https://github.com/segmentio/nightmare/blob/2.10.0/lib/frame-manager.js#L37-L44
let currentWebContents = remote.getCurrentWebContents();
function handleFrame() {
  currentWebContents.endFrameSubscription(handleFrame);
  ipcRenderer.send('load');
}
currentWebContents.beginFrameSubscription(handleFrame);
