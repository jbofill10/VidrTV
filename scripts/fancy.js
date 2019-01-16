const chalk = require('chalk');
/**
 * Fancy Log formatting
 * @param {*} message message to display
 * @param {chalk.color} color chalk text/bg color
 * @param {char} icon icon character
 * @param {boolean} bg use color as bg instead of text color
 */
const _log = (message, color, icon, bg = false) =>
	console.log(bg ?
		` ${chalk[color](icon)}  ${chalk.black['bg' + color.charAt(0).toUpperCase() + color.slice(1)](
			' ' + message + ' '
		)}`
		: chalk[color](` ${icon}  ${message}`
		)
	);

// main log functions

const fun = {};
fun.info = (message) => _log(message, 'cyan', '●', false);
fun.event = (message) => _log(message, 'magenta', '!', false);
fun.warn = (message) => _log(message, 'yellow', '⚠', false);
fun.error = (message) => _log(message, 'red', '✖', false);
fun.complete = (message) => _log(message, 'green', '✔', false);
fun.question = (message) => _log(message, 'blue', '?', false);
fun.bool = (expression, truemessage, falsemessage, truemessagetype = 'true', falsemessagetype = 'false') =>
	exports[expression ? truemessagetype : falsemessagetype](expression ? truemessage : falsemessage);

/**
 * Fancy Log with cyan background in the following format: ' ● {message}'
 * @param {*} message message to log
 */
fun.info.bg = (message) => _log(message, 'cyan', '●', true);
/**
 * Fancy Log with magenta background in the following format: ' ! {message}'
 * @param {*} message message to log
 */
fun.event.bg = (message) => _log(message, 'magenta', '!', true);
/**
 * Fancy Log with yellow background in the following format: ' ⚠ {message}'
 * @param {*} message message to log
 */
fun.warn.bg = (message) => _log(message, 'yellow', '⚠', true);
/**
 * Fancy Log with red background in the following format: ' ✖ {message}'
 * @param {*} message message to log
 */
fun.error.bg = (message) => _log(message, 'red', '✖', true);
/**
 * Fancy Log with green background in the following format: ' ✔ {message}'
 * @param {*} message message to log
 */
fun.complete.bg = (message) => _log(message, 'green', '✔', true);
/**
 * Fancy Log with blue background in the following format: ' ? {message}'
 * @param {*} message message to log
 */
fun.question.bg = (message) => _log(message, 'blue', '?', true);
/**
 * Use a boolean expression to choose which log is displayed.
 * @param {boolean} expression boolean expression, if true, the truelog message is displayed and vice versa
 * @param {*} truelog message to log if expression is true
 * @param {*} falselog message to log if expression is false
 * @param {string} truelogtype fancy log type (with bg) to use for true log (default = 'true')
 * @param {string} falselogtype fancy log type (with bg) to use for false log (default = 'false')
 */
fun.bool.bg = (expression, truemessage, falsemessage, truemessagetype = 'true', falsemessagetype = 'false') =>
	exports[expression ? truemessagetype : falsemessagetype].bg(expression ? truemessage : falsemessage);


// aliases

/**
 * Fancy Log with cyan text in the following format: ' ● {message}'
 * @param {*} message message to log
 */
exports.default = exports.log = exports.dot = exports.circle = exports.info = fun.info;
/**
 * Fancy Log with magenta text in the following format: ' ! {message}'
 * @param {*} message message to log
 */
exports.exclaim = exports.important = exports.event = fun.event;
/**
 * Fancy Log with yellow text in the following format: ' ⚠ {message}'
 * @param {*} message message to log
 */
exports.warning = exports.warn = exports.hazard = fun.warn;
/**
 * Fancy Log with red text in the following format: ' ✖ {message}'
 * @param {*} message message to log
 */
exports.wrong = exports.x = exports.incorrect = exports.bad = exports.false = exports.error = fun.error;
/**
 * Fancy Log with green text in the following format: ' ✔ {message}'
 * @param {*} message message to log
 */
exports.done = exports.finished = exports.check = exports.checked = exports.checkmark = exports.correct = exports.ok = exports.true = exports.complete = fun.complete;
/**
 * Fancy Log with blue text in the following format: ' ? {message}'
 * @param {*} message message to log
 */
exports.query = exports.ask = exports.question = fun.question;
/**
 * Creates new lines for spacing bewteen messages
 * @param lines how many new lines to create
 */
exports.newline = exports.space = (lines = 1) => console.log('\n'.repeat(Math.max(0, lines - 1)));
/**
 * Use a boolean expression to choose which log is displayed.
 * @param {boolean} expression boolean expression, if true, the truelog message is displayed and vice versa
 * @param {*} truelog message to log if expression is true
 * @param {*} falselog message to log if expression is false
 * @param {string} truelogtype fancy log type to use for true log (default = 'true')
 * @param {string} falselogtype fancy log type to use for false log (default = 'false')
 */
exports.has = exports.is = exports.choose = exports.bool = fun.bool;
/**
 * Optional Chaining with expression.
 * @example
 * fancy.if(loading).info('still loading');
 * @param {boolean} expression
 */
exports.if = (expression) => expression ? exports : exportsor;
/**
 * object for killing call chains
 */
const dead = new Proxy({}, {
	get: (obj, prop) => {
		if (prop === 'if')
			return () => dead;
		return () => { };
	}
});
