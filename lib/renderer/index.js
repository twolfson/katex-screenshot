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
remote.getCurrentWebContents().on('did-finish-load', function handleLoad () {
  ipcRenderer.send('load');
});
