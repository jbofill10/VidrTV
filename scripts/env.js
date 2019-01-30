#!/usr/bin/env node
const argv = require('yargs').argv;
const fs = require('fs');
const readline = require('readline');
const fancy = require('./fancy');

const userConfigName = 'env.config';
const userConfigPath = __dirname + '/../' + userConfigName;
const syncedConfigPath = __dirname + '/synced.config';

var syncedConfig = {};
var userConfig = {};

// load synced config
fs.readFile(syncedConfigPath, { encoding: 'utf-8' }, (err, data) => {
	if (err) {
		fancy.error(`An error occurred when trying to read ${syncedConfigPath}`);
		console.error(err);
	} else {
		syncedConfig = JSON.parse(data);
		start();
	}
});

function start() {
	// command input
	console.log(argv._[0]);

	// has args
	if (argv._.length > 0) {
		if (commands.hasOwnProperty(argv._[0])) commands[argv._[0]]();
		else
			// invalid command
			commands.check();
	} else {
		// default to check
		commands.check();
	}
}

const commands = {
	setup: (newfile = true) => {
		// TODO: go through env config wizard

		const prompt = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		try {
			//JSON.stringify({ test: 'hello' }, null, 4)
			fs.writeFileSync(userConfigPath, 'test2', { encoding: 'utf8' });
			fancy.event(`Created ${userConfigName} file`);
		} catch (error) {
			fancy.error(`An error occured while writing ${userConfigName} to ${userConfigPath}`);
			return console.error(error);
		}
	},

	check: () => {
		// see if config file exists
		const hasConfig = fs.existsSync(userConfigPath);

		if (!hasConfig) {
			commands.setup();
			return;
		}

		try {
			userconfig = fs.readFileSync(userConfigPath, { encoding: 'utf-8' });
		} catch (error) {
			fancy.error(`An error occured while reading ${userConfigName} from ${userConfigPath}`);
			return console.error(error);
		}

		// syncedConfig.env.keys;

		// check if user config has all keys
		// if some are missing, go to setup

		// check if .env file have key(s) not in synced config
		// if so, have them properly add keys via add command

		// write .env files
	}
};
