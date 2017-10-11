// Load in our dependencies
const assert = require('assert');

const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;

// Add an error handler
window.addEventListener('error', function handleError (err) {
  ipcRenderer.sendSync('browser-error', err.message);
});

// When our content loads
// DEV: We use `.send()` over `.sendSync()` so content isn't blocked
// DEV: Errors in top-level lines might not be cause by error handler
// DEV: We use `*FrameSubscription` as `load`, `DOMContentLoaded`, and `webContents.on('did-finish-load')` don't work
//   https://github.com/segmentio/nightmare/blob/2.10.0/lib/frame-manager.js#L37-L44
let currentWebContents = remote.getCurrentWebContents();
function handleFrame() {
  // Stop our frame subscription
  currentWebContents.endFrameSubscription(handleFrame);

  // Resolve our content element
  let containerEl = document.getElementById('container');
  assert(containerEl, 'Unable to find #container element');
  assert.strictEqual(containerEl.childNodes.length, 1);

  // Measure our container
  // DEV: We need to copy our bounds by key as it won't serialize otherwise
  // http://youmightnotneedjquery.com/#offset
  let containerElRect = containerEl.getBoundingClientRect();
  let {x, y, width, height, top, right, bottom, left} = containerElRect;
  let bounds = {x, y, width, height, top, right, bottom, left};

  // Send a load notification
  ipcRenderer.send('load', bounds);
}
currentWebContents.beginFrameSubscription(handleFrame);
