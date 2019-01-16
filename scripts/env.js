#!/usr/bin/env node
const argv = require('yargs').argv;
const fs = require('fs');
const readline = require('readline');
const fancy = require('./fancy');

const userConfigName = 'env.config';
const userConfigPath = __dirname + '/../' + userConfigName;
const syncedConfigPath = __dirname + '/synced.config';

// command input

// has args
if (argv._.length > 0) {
	switch (argv._[0]) {
		case 'setup':
			setup();
			break;
		default:
			check();
			break;
	}
} else {
	// default to check
	check();
}

function setup(newfile = true) {

	// TODO: go through env config wizard

	fs.writeFile(configPath, JSON.stringify(defaultconfig, null, 4), 'utf8', (err) => {
		if (err) {
			fancy.error(`An error occured while writing ${userConfigName} to ${userConfigPath}`);
			return console.log(err);
		} else
			fancy.event(`Created ${userConfigName} file`);
	});
}

function check() {
	// check for user config
	// if none, go to setup

	fancy.has()

	// see if config file exists
	const hasConfig = fs.existsSync(userConfigPath);

	fancy.has(hasConfig, 'has env.config', "doesn't have env.config");

	if (!hasConfig) {
		setup();
		return;
	}

	// check if user config has all keys
	// if some are missing, go to setup

	// check if .env file have key(s) not in synced config
	// if so, have them properly add keys via add command

	// write .env files
}








const prompt = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

console.log(argv._);

fs.readFile(syncedConfigPath, { encoding: 'utf-8' }, (err, data) => {
	if (err) {
		fancy.error("An error occured when loading " + syncedConfigPath);
		console.error(err);
	} else {
		console.log(data);
	}
});



fs.readFile(userConfigPath, { encoding: 'utf-8' }, (err, data) => {
	if (err) {
		fancy.error(`An error occured while writing ${userConfigName} to ${userConfigPath}`);
		return console.log(err);
	} else
		fancy.event(`Created ${userConfigName} file`);
});

// TODO: if there are missing keys, go through wizard to add them

// TODO: if there are new keys in .env files, tell user to add the properly via command

// TODO: write .env files

