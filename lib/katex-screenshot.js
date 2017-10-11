// Based on https://github.com/twolfson/record-a-cast/blob/1.4.1/lib/record-a-cast.js
// When an unknown exception occurs, fully bail
// DEV: By default, Electron will log/alert but keep on running
process.on('uncaughtException', function handleUncaughtException (err) {
  throw err;
});

// Load in our dependencies
const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const fs = require('fs');

const program = require('commander');
let katex = require('katex');

const pkg = require('../package.json');

// Fallback ES6 package handling
katex = katex.default || katex;

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
    let fileContents = fs.readFileSync(infile, 'utf8');

    // Parse our KaTeX into HTML
    let htmlStr = katex.renderToString(fileContents);

    // Generate our browser window
    let browserWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false
    });

    // Load our HTML via data URI
    // DEV: We use a data URI to prevent collisions between temporary files
    browserWindow.loadURL(
      'data:text/html;charset=utf-8,' +
      encodeURIComponent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>katex-screenshot renderer</title>
          </head>
          <body>
            Hello World!
          </body>
        </html>
      `));

    // Exit our application
    // TODO: Move this into a timeout
    app.quit();
  });
});

// Parse our CLI
program.parse(process.argv);

// If main wasn't called, then display our help and exit
if (!mainCalled) {
  program.outputHelp();
  process.exit(0);
}
