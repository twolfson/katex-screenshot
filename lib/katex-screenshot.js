// Based on https://github.com/twolfson/record-a-cast/blob/1.4.1/lib/record-a-cast.js
// When an unknown exception occurs, fully bail
// DEV: By default, Electron will log/alert but keep on running
process.on('uncaughtException', function handleUncaughtException (err) {
  throw err;
});

// Load in our dependencies
const assert = require('assert');
const fs = require('fs');

const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const ipcMain = require('electron').ipcMain;
let katex = require('katex');
const program = require('commander');
const katexCssContent = fs.readFileSync(require.resolve('katex/dist/katex.css'), 'utf8');

const pkg = require('../package.json');

// Fallback ES6 package handling
katex = katex.default || katex;

// Define our constants
const PAGE_LOAD_TIMEOUT = 10e3; // 10 seconds

// Set up CLI parser
program.name = pkg.name;
program.version(pkg.version);

// Set up our main command
let mainCalled = false;
program
  .usage('[options] <infile> <outfile>');

program.action(function main (infile, outfile) {
  // Set `mainCalled` to true
  mainCalled = true;

  // When Electron is done loading, launch our application
  app.on('ready', function handleReady () {
    // Load our requested file
    let inputKatexStr = fs.readFileSync(infile, 'utf8');

    // Parse our KaTeX and built it into our HTML
    let htmlTemplateStr = fs.readFileSync(__dirname + '/renderer/index.html', 'utf8');
    let inputHtmlStr = katex.renderToString(inputKatexStr);
    assert(htmlTemplateStr.includes('{{input_html}}'));
    assert(htmlTemplateStr.includes('<!-- katex_css_html -->'));
    let htmlStr = htmlTemplateStr
      .replace('{{input_html}}', inputHtmlStr)
      .replace('<!-- katex_css_html -->', `<style>${katexCssContent}</style>`);

    // Generate our browser window
    let browserWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        preload: __dirname + '/renderer/index.js'
      }
    });

    // Add an error listener
    ipcMain.on('browser-error', function handleError (evt, errMsg) {
      throw new Error(`Error from renderer: ${errMsg}`);
    });

    // Load our HTML via data URI
    // DEV: We use a data URI to prevent collisions between temporary files
    browserWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlStr)}`);

    // Wait for a message from our application that our page is loaded
    ipcMain.on('load', function handleLoad (evt, bounds) {
      // Capture our page contents
      browserWindow.capturePage({
        x: Math.ceil(bounds.left),
        y: Math.ceil(bounds.top),
        width: Math.ceil(bounds.width),
        height: Math.ceil(bounds.height)
      }, function handleCapturePage (nativeImage) {
        // Save our file and exit
        let pngBuff = nativeImage.toPNG();
        assert.notEqual(pngBuff.length, 0, 'Expected PNG to have non-zero size but it was 0 bytes large');
        fs.writeFileSync(outfile, pngBuff);
        app.quit(0);
      });
    });

    // If  we haven't loaded our content in a reasonable time, then bail
    setTimeout(function handleSetTimeout () {
      console.error(`Failed to load page in ${PAGE_LOAD_TIMEOUT}ms. Exiting \`katex-screenshot\``);
      app.exit(1);
    }, PAGE_LOAD_TIMEOUT);
  });
});

// Parse our CLI
program.parse(process.argv);

// If main wasn't called, then display our help and exit
if (!mainCalled) {
  program.outputHelp();
  app.exit(0);
}
