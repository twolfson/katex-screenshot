// Load in our dependencies
const ipcRenderer = require('electron').ipcRenderer;

// When our page loads, notify our main process
// TODO: Measure KaTeX and send back position/dimensions
ipcRenderer.sendSync('load');
