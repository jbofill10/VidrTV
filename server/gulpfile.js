const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const child_process = require('child_process');
const readline = require('readline');
const chalk = require('chalk');

// keypress listener

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
	// ctrl + C exit
	if (key.sequence === '\u0003') {
		process.stdin.pause();

		// async close watch task
		watchcallback();

		// kill process
		// eslint-disable-next-line no-process-exit
		process.exit('SIGINT');
	}

	// console.log('gulp keypress ' + key.name);
});

// log test
// info('info');
// event('event');
// warn('warning');
// error('error');
// complete('complete');
// info('info', true);
// event('event', true);
// warn('warning', true);
// error('error', true);
// complete('complete', true);

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
function info(message, bg = false) {
	_log(message, 'cyan', '●', bg);
}
function event(message, bg = false) {
	_log(message, 'magenta', '!', bg);
}
function warn(message, bg = false) {
	_log(message, 'yellow', '⚠', bg);
}
function error(message, bg = false) {
	_log(message, 'red', '✖', bg);
}
function complete(message, bg = false) {
	_log(message, 'green', '✔', bg);
}
function space(lines = 1) {
	console.log('\n'.repeat(Math.max(0, lines - 1)));
}

var lintfailed = false;

/**
 * ESLint Gulp task
 */
const lint = () => {
	lintfailed = false;
	return (
		gulp
			.src('src/**/*.js')
			// eslint
			.pipe(eslint())
			// ESLint report header
			.pipe(
				eslint.results((results) => {
					if (results.errorCount > 0) {
						error('    ESLint Report    ', true);
						lintfailed = true;
					} else if (results.warningCount > 0) warn('    ESLint Report    ', true);
					else complete('ESLint Report: No Issues Found');
				})
			)
			// format eslint report
			.pipe(eslint.format('stylish', process.stdout))
			// ESLint report footer
			.pipe(
				eslint.results((results) => {
					if (lintfailed) {
						space();
						error('ESLint has cancelled the build');
						info('waiting for file changes to restart...');
					} else if (results.warningCount > 0) space();
				})
			)
	);
};

/**
 * Babel compile Gulp task
 */
const compile = () =>
	gulp
		.src('src/**/*.js')
		// babel compile
		.pipe(babel())
		// output to build dir
		.pipe(gulp.dest('build'))
		// console log when finished
		.on('end', () => {
			if (!lintfailed) complete('Finished Compiling');
		});

/**
 * Build Gulp task
 *
 * Runs Lint and Compile in parallel
 */
const build = gulp.series((cb) => {
	space();
	info('Building Server...');
	space();
	cb();
}, gulp.parallel(lint, compile));

/**
 * Spawned Server Process
 */
var node;

const killserver = (cb) => {
	if (node) {
		// kill running node and callback when it exits
		node.on('close', () => {
			cb();
		});
		node.kill('SIGINT');
	} else {
		// no node to kill
		cb();
	}
};

/**
 * Gulp task that spawns the server process or restarts if already running
 */
const spawnserver = gulp.series(killserver, (cb) => {
	if (lintfailed) {
		cb();
		return;
	}

	process.stdin.pause();

	// start server process
	node = child_process.fork('.', [], {
		stdio: [ process.stdin, 'inherit', 'pipe', 'ipc' ]
	});

	// pipe input to server process
	// process.stdin.pipe(node.stdin);

	// color stderr red
	node.stderr.on('data', (data) => console.log(chalk.red(data)));

	// handle process close event
	node.on('close', (code) => {
		if (!restarting) space(2);

		if (code) {
			if (code === 0) event(`server ${restarting ? 'killed' : 'exited'} with code ${code}`);
			else error(`server ${restarting ? 'killed' : 'exited'} with code ${code}`);
		} else event(`server ${restarting ? 'killed' : 'exited'}`);

		if (!restarting) info('waiting for file changes to restart...');

		//? this seems to work
		process.stdin.resume();
		node = null;
	});

	// task callback
	cb();

	space();
	info('Launching Server...');
	space();
});

var restarting = false;

const restart = gulp.series(
	(cb) => {
		space();
		info('Restarting due to file change...');
		restarting = true;
		cb();
	},
	killserver,
	(cb) => {
		console.log('------------------------------------------------------------');
		cb();
	},
	build,
	spawnserver,
	(cb) => {
		restarting = false;
		cb();
	}
);

var watchcallback = () => {};

const watch = (cb) => {
	watchcallback = cb;
	return gulp.watch('src/**/*.*', restart);
};

// build and spawn then start watching
exports.watch = gulp.series(build, spawnserver, watch);

// run the build task by default
exports.default = exports.build = build;
