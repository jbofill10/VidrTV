import readline from "readline";
import chalk from "chalk";
import util from "util";

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

var inputbuffer = "";
var cursorpos = 0;

process.stdin.on("keypress", (str, key) => {
	// ctrl + C exit
	if (key.sequence === "\u0003") {
		// kill it
		// eslint-disable-next-line no-process-exit
		process.exit("SIGINT");
	}

	// only allow the above inputs while loading
	if (loading) return;

	// TODO: ctrl+A, arrow keys

	// input has a 'code'
	if (key.hasOwnProperty("code")) {
		// key has a code
		switch (key.name) {
			case "up":
				break;
			case "down":
				break;
			case "left":
				if (cursorpos !== 0) {
					cursorpos = Math.max(0, cursorpos - 1);
					redrawprompt();
				}
				break;
			case "right":
				if (cursorpos !== inputbuffer.length) {
					cursorpos = Math.min(inputbuffer.length, cursorpos + 1);
					redrawprompt();
				}
				break;
			default:
				break;
		}
	} else if (str) {
		// non codes
		// ascii code for key
		let code = str.charCodeAt(0);

		// normal chars
		if (code >= 32 && code <= 126) {
			inputbuffer =
				inputbuffer.slice(0, cursorpos) +
				str +
				inputbuffer.slice(cursorpos);
			cursorpos = Math.min(cursorpos + 1, inputbuffer.length);
			redrawprompt();

			// return / enter
		} else if (code === 13) {
			// TODO: handle commands here
			console.log("command: " + inputbuffer);
			cursorpos = 0;
			inputbuffer = "";
			redrawprompt();

			// backspace
		} else if (code === 8) {
			if (inputbuffer.length > 0) {
				inputbuffer =
					inputbuffer.slice(0, cursorpos - 1) +
					inputbuffer.slice(cursorpos);
				cursorpos = Math.max(0, cursorpos - 1);
				redrawprompt();
			}
		}
	}
});

/**
 * Info that is displayed on the status bar
 */
const status = new Proxy(
	{
		/**express is loaded */
		express: false,
		/**db is loaded */
		db: false,
		/**roomservice is loaded */
		roomservice: false,
		/**number of connections */
		connections: 0,
		/**number of rooms loaded */
		rooms: 0
	},
	{
		set: (obj, prop, value) => {
			// set new value
			obj[prop] = value;
			// render status bar
			if (!obj.loading) redrawprompt();
			return true;
		}
	}
);

// loading animation
const frames = ["⠁", "⠂", "⠄", "⠂", "⠂", "⠂", "⠂"];

// current frame of the loading animation
let frame = 0;

// loading by default
let loading = true;

// queued render
let _render;

// render status bar
function redrawprompt(clear = true) {
	// clear previous queued render
	clearTimeout(_render);

	if (clear) clearprompt();

	if (loading) {
		// animate loading bar
		frame++;
		frame %= 1000;
		// update status bar text
		writeprompt(
			` ${chalk.cyan(
				frames[(frame + 2) % frames.length] +
					frames[(frame + 1) % frames.length] +
					frames[frame % frames.length]
			)} Loading`
		);
	} else {
		// update status bar text
		writeprompt(
			`${chalk.bgGreen.black(` ONLINE `)}${chalk.dim(
				`  ${status.rooms} rooms  |  ${status.connections} clients `
			)}`
		);
	}

	// queue next render
	_render = setTimeout(redrawprompt, loading ? 500 : 1000);

	// is app still loading?
	loading = !status.express || !status.db || !status.roomservice;
}

// start status bar render loop
redrawprompt(false);

function clearprompt() {
	readline.cursorTo(process.stdout, 0);
	readline.moveCursor(process.stdout, 0, -1);
	readline.clearLine(process.stdout);
}

function writeprompt(statustext) {
	readline.clearLine(process.stdout, 0);
	process.stdout.write(`${statustext}\n`);
	// process.stdout.write(`${statustext} | inputbuffer:"${inputbuffer}"\n`);

	// don't show prompt until loaded
	if (loading) return;

	readline.clearLine(process.stdout, 0);
	process.stdout.write(`${chalk.cyan(" ⚡ ❯ ")}${chalk.white(inputbuffer)}`);

	//* hack to fix cursor not going to the end of inputbuffer with a single trailing space
	if (inputbuffer.match(/\S(\s){1}$/))
		process.stdout.write(chalk.black.bgBlack(" "));

	// set cursor position back
	readline.cursorTo(process.stdout, cursorpos + 5);
}

/**
 * console.log override that writes above the status bar and prompt
 */
console.log = function() {
	clearprompt();
	process.stdout.write(util.format.apply(null, arguments) + "\n");
	redrawprompt(false);
};

/**
 * console.error override that writes above the status bar and prompt and
 * displays with red text
 */
console.error = function() {
	console.log(chalk.red(util.format.apply(null, arguments)));
};

export { status };
