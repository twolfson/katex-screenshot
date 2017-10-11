#!/usr/bin/env node
// Taken from https://github.com/twolfson/record-a-cast/blob/1.4.1/bin/record-a-cast.js
// Enable strict mode for Node.js@4
'use strict';

// Load in our dependencies
const path = require('path');
const spawn = require('child_process').spawn;
const electronPath = require('electron');

// Find our application
let appPath = path.join(__dirname, '..');
let args = [appPath];

// Append all arguments after our node invocation
// e.g. `node bin/app.js --version` -> `--version`
args = args.concat(process.argv.slice(2));

// Run electron on our application and forward all stdio
let child = spawn(electronPath, args, {stdio: 'inherit'});
child.on('exit', function handleExit (code, signal) {
  process.exit(code);
});
