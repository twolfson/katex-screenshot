#!/usr/bin/env node
// Load in our dependencies
var path = require('path');
var spawn = require('child_process').spawn;
var electronPath = require('electron');

// Find our application
var appPath = path.join(__dirname, '..');
var args = [appPath];

// Append all arguments after our node invocation
// e.g. `node bin/app.js --version` -> `--version`
args = args.concat(process.argv.slice(2));

// Run electron on our application and forward all stdio
spawn(electronPath, args, {stdio: 'inherit'});
