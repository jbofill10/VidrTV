const chalk = require('chalk');
/**
 * Custom Log formatting
 * @param {*} message message to display
 * @param {*} type type of message [info, error, warn]
 */
function _log(message, color, icon, bg = false) {
	if (bg)
		console.log(
			` ${chalk[color](icon)}  ${chalk.black['bg' + color.charAt(0).toUpperCase() + color.slice(1)](
				' ' + message + ' '
			)}`
		);
	else console.log(chalk[color](` ${icon}  ${message}`));
}
exports.info = (message, bg = false) => _log(message, 'cyan', '●', bg);
exports.event = (message, bg = false) => _log(message, 'magenta', '!', bg);
exports.warn = (message, bg = false) => _log(message, 'yellow', '⚠', bg);
exports.error = (message, bg = false) => _log(message, 'red', '✖', bg);
exports.complete = (message, bg = false) => _log(message, 'green', '✔', bg);
exports.question = (message, bg = false) => _log(message, 'blue', '?', bg);
exports.space = (lines = 1) => console.log('\n'.repeat(Math.max(0, lines - 1)));