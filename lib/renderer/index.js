// Load in our dependencies
const ipcRenderer = require('electron').ipcRenderer;

// Add an error handler
window.addEventListener('error', function (err) {
  ipcRenderer.sendSync('browser-error', err.message);
});

// Give ourselves a second to register our onerror handler
process.nextTick(function handleNextTick () {
  // When our page loads, notify our main process
  // TODO: Measure KaTeX and send back position/dimensions
  // DEV: We use `.send()` over `.sendSync()` so content isn't blocked
  window.body.onload = function handleLoad () {
    requestAnimationFrame(function handleSetTimeout () {
      ipcRenderer.send('load');
    });
  };
});
