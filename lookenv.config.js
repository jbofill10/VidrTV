const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const fancy = require("./scripts/fancy");

const requirements = Joi.object().keys({
	REACT_APP_GOOGLE_API_KEY: Joi.string().alphanum().length(39).required(),
	REACT_APP_OAUTH_CLIENT_ID: Joi.string().required(),
	MONGO_URL: Joi.string().required()
});

// create .env file if it doesn't exist
if (process.env.NODE_ENV !== "production" && !fs.existsSync(path.resolve(__dirname, ".env"))) {
	const header = `#######################################################
###     THIS FILE CONTAINS SENSITIVE INFORMATION    ###
### DO NOT SHARE WITH ANYONE OUTSIDE OF THE PROJECT ###
#######################################################

### Project Environment Variables
###
### NOTE: add new entries to the requirements in lookenv.config.js
`;

	fancy.space();
	fancy.space();
	fancy.info(".env file not found!  Creating a new .env file!");
	fancy.space();
	fancy.warn("GET THE KEYS FROM SOMEONE WHO ALREADY HAS THEM !!!");
	fancy.warn("THE PROJECT WILL NOT FUNCTION WITHOUT THEM !!!");
	fancy.space();

	fs.writeFileSync(
		path.resolve(__dirname, ".env"),
		requirements._inner.children.reduce((file, e) => (file += e.key + "=\n"), header + "\n")
	);
}

/**
 * These are the environment variable requirements to run the server
 */
module.exports = requirements;
