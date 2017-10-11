#!/usr/bin/env node
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
spawn(electronPath, args, {stdio: 'inherit'});
