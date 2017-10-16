// Load in our dependencies
const assert = require('assert');
const fs = require('fs');

const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const TextToSVG = require ('text-to-svg');

// Add an error handler
window.addEventListener('error', function handleError (err) {
  ipcRenderer.sendSync('browser-error', err.message);
});

// Inject our own CSS into the page
// DEV: We inject our CSS within the document as it's too bulky for data URIs
let katexCssContent = fs.readFileSync(require.resolve('katex/dist/katex.css'), 'utf8');
katexCssContent = katexCssContent.replace(/url\(["'](fonts\/[^\)]+)["']\)/g,
    function handleFontsReplacement (urlStr, urlStrContent, urlStrIndex) {
  // urlStr = url('fonts/KaTeX_Size1-Regular.eot')
  // urlStrContent = fonts/KaTeX_Size1-Regular.eot
  // urlStrIndex = 3107
  assert(!urlStrContent.includes('..'), `Found .. in ${urlStrContent}`);
  // Strip away `iefix` suffixes
  urlStrContent = urlStrContent.replace(/#iefix$/, '');
  let fontContentBase64 = fs.readFileSync(require.resolve(`katex/dist/${urlStrContent}`), 'base64');
  return 'url(data:text/plain;base64,' + fontContentBase64 + ')';
});
window.addEventListener('DOMContentLoaded', function handleDOMContentLoaded () {
  let katexStyleEl = document.createElement('style');
  katexStyleEl.innerHTML = katexCssContent;
  document.head.appendChild(katexStyleEl);
});

// Initialize our text-to-svg library
let textToSvg = TextToSVG.loadSync(require.resolve('katex/dist/fonts/KaTeX_Math-Regular.ttf'));

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

  // Draw our content
  let svgStr = textToSvg.getSVG('hello');
  let svgContainerEl = document.createElement('div');
  console.log(svgStr);
  svgContainerEl.innerHTML = svgStr;
  document.body.appendChild(svgContainerEl);
  console.log('wat', svgContainerEl);
}
currentWebContents.beginFrameSubscription(handleFrame);
