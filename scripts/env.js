#!/usr/bin/env node
const argv = require('yargs').argv;
const fs = require('fs');
const fancy = require('./fancy');

const userConfigName = 'env.config';

const userConfigPath = __dirname + '/../env.config';
const syncedConfigPath = __dirname + '/synced.config';

fs.readFile(syncedConfigPath, { encoding: 'utf-8' }, (err, data) => {
	if (err) {
		fancy.error("An error occured when loading " + syncedConfigPath);
		console.error(err);
	} else {
		console.log(data);
	}
});

// see if config file exists
const hasConfig = fs.existsSync(userConfigPath);

if (!hasConfig) {

	// TODO: go through env config wizard

	fs.writeFile(configPath, JSON.stringify(defaultconfig, null, 4), 'utf8', (err) => {
		if (err) {
			fancy.error(`An error occured while writing ${userConfigName} to ${userConfigPath}`);
			return console.log(err);
		} else
			fancy.event(`Created ${userConfigName} file`);
	});
}

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