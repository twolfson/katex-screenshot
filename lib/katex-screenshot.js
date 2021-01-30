// Based on https://github.com/twolfson/record-a-cast/blob/1.4.1/lib/record-a-cast.js
// When an unknown exception occurs, fully bail
// DEV: By default, Electron will log/alert but keep on running
process.on('uncaughtException', function handleUncaughtException (err) {
  throw err;
});

// Load in our dependencies
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const ipcMain = require('electron').ipcMain;
const electron = require('electron');
let katex = require('katex');
const program = require('commander');
const mkdirp = require('mkdirp');

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
  .option('--verbose', 'get verbose output')
  .usage('[options] <infile.tex> <outfile.png>');

// Define a debug helper
function debug(message) {
  if (program.verbose) {
    console.error(message);
  }
}

program.action(function main (infile, outfile) {
  // Set `mainCalled` to true
  mainCalled = true;

  // When Electron is done loading, launch our application
  app.on('ready', function handleReady () {
    // Load our requested file
    debug('app ready ran');
    debug('Loading file: ' + infile);
    let inputKatexStr = fs.readFileSync(infile, 'utf8');
    debug('Filed loaded');

    // Parse our KaTeX and built it into our HTML
    // DEV: Attribution to MathEmbed for \displaystyle tip
    //   https://github.com/codeOfRobin/MathEmbed/blob/223eb186c92a3000bea641e33839c578851e6393/templates/latex.jade#L12
    let htmlTemplateStr = fs.readFileSync(__dirname + '/renderer/index.html', 'utf8');
    let inputHtmlStr = katex.renderToString(`\\displaystyle{${inputKatexStr}}`);
    assert(htmlTemplateStr.includes('{{input_html}}'));
    let htmlStr = htmlTemplateStr.replace('{{input_html}}', inputHtmlStr);

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
    debug('Loading browser...');
    browserWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlStr)}`);

    // Wait for a message from our application that our page is loaded
    ipcMain.on('load', function handleLoad (evt, bounds) {
      // Capture our page contents
      debug('Browser loaded');
      debug('Capturing page...');
      browserWindow.capturePage({
        x: Math.ceil(bounds.left),
        y: Math.ceil(bounds.top),
        width: Math.ceil(bounds.width),
        height: Math.ceil(bounds.height)
      }, function handleCapturePage (nativeImage) {
        debug('Page captured');
        // If we need to resize our image, then resize it (OS X takes 2x images)
        // https://github.com/electron/electron/issues/8314#issuecomment-296011023
        assert(!nativeImage.isEmpty(), 'Expected images to be non-empty but it was empty');
        let scaleFactor = electron.screen.getPrimaryDisplay().scaleFactor;
        if (scaleFactor !== 1) {
          let nativeImageSize = nativeImage.getSize();
          // DEV: Add a sanity check for exact multiples
          assert.strictEqual(nativeImageSize.width % scaleFactor, 0);
          nativeImage = nativeImage.resize({
            width: nativeImageSize.width / scaleFactor
          });
        }

        // Save our file and exit
        debug('Saving file...');
        mkdirp.sync(path.dirname(outfile));
        fs.writeFileSync(outfile, nativeImage.toPNG());
        debug('File saved');
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
