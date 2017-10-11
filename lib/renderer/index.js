// Load in our dependencies
const ipcRenderer = require('electron').ipcRenderer;

// When our page loads, notify our main process
// TODO: Measure KaTeX and send back position/dimensions
// DEV: We use `.send()` over `.sendSync()` so content isn't blocked
window.addEventListener('load', function handleLoad () {
  ipcRenderer.send('load');
});
