import BottomBar from "inquirer/lib/ui/bottom-bar";
import chalk from "chalk";
import util from "util";

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
			if (!obj.loading) render();
			return true;
		}
	}
);

/**
 * Formats the status bar
 */
function format(statustext) {
	return `${statustext} > `;
}

// loading animation
const frames = ["⠁", "⠂", "⠄", "⠂", "⠂", "⠂", "⠂"];

// current frame of the loading animation
let frame = 0;

// create status bar
const ui = new BottomBar({
	bottomBar: format(
		` ${chalk.cyan(frames[0] + frames[0] + frames[0])} Loading`
	)
});

// loading by default
let loading = true;

// queued render
let _render;

// render status bar
function render() {
	// clear previous queued render
	clearTimeout(_render);

	if (loading) {
		// animate loading bar
		frame++;
		frame %= 1000;

		// update status bar text
		ui.updateBottomBar(
			format(
				` ${chalk.cyan(
					frames[(frame + 2) % frames.length] +
						frames[(frame + 1) % frames.length] +
						frames[frame % frames.length]
				)} Loading`
			)
		);
	} else {
		// update status bar text
		ui.updateBottomBar(
			format(
				`${chalk.bgGreen.black(` ONLINE `)}${chalk.dim(
					`  ${status.rooms} rooms  |  ${status.connections} clients `
				)}`
			)
		);
	}

	// queue next render
	if (loading) setTimeout(render, 500);

	// is app still loading?
	loading = !status.express || !status.db || !status.roomservice;
}

// start status bar render loop
render();

/**
 * console.log override that pipes to custom area above the status bar
 */
console.log = function() {
	ui.log.write(util.format.apply(null, arguments) + "\n");
};

/**
 * console.error override that pipes to custom area above the status bar and makes the message red
 */
console.error = function() {
	ui.log.write(chalk.red(util.format.apply(null, arguments)) + "\n");
};

export { status };
