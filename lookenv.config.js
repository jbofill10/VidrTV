const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const fancy = require('./scripts/fancy');

console.log(process.env);

const requirements = Joi.object().keys({
	REACT_APP_GOOGLE_API_KEY: Joi.string().alphanum().length(39).required(),
	REACT_APP_OAUTH_CLIENT_ID: Joi.string().required(),
	MONGO_URL: Joi.string().required()
});

// create .env file if it doesn't exist
if (process.env.NODE_ENV !== 'production' && !fs.existsSync(path.resolve(__dirname, '.env'))) {
	fancy.space();
	fancy.warn('.env file not found!');
	fancy.info('Creating a new one...');
	fancy.space();

	fs.writeFileSync(
		path.resolve(__dirname, '.env'),
		requirements._inner.children.reduce((file, e) => (file += e.key + '=\n'), '')
	);
}

/**
 * These are the environment variable requirements to run the server
 */
module.exports = requirements;
