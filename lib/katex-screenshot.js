// When an unknown exception occurs, fully bail
// DEV: By default, Electron will log/alert but keep on running
process.on('uncaughtException', function handleUncaughtException (err) {
  throw err;
});

// Load in our dependencies
const app = require('electron').app;
const program = require('commander');

// Load in package info
const pkg = require('../package.json');

// Set up CLI parser
program.name = pkg.name;
program.version(pkg.version);

// Set up our main command
var mainCalled = false;
program
  .usage('[options] <infile> <outfile>');

program.action(function main (infile, outfile) {
  // Set `mainCalled` to true
  mainCalled = true;

  // When Electron is done loading, launch our application
  app.on('ready', function handleReady () {
    console.log('Hello World!');
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
