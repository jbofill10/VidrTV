const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const child_process = require('child_process');
const readline = require('readline');
const chalk = require('chalk');
// eslint-disable-next-line node/no-unpublished-require
const fancy = require('../scripts/fancy');

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
						fancy.error.bg('    ESLint Report    ');
						lintfailed = true;
					} else if (results.warningCount > 0) fancy.warn.bg('    ESLint Report    ');
					else fancy.complete('ESLint Report: No Issues Found');
				})
			)
			// format eslint report
			.pipe(eslint.format('stylish', process.stdout))
			// ESLint report footer
			.pipe(
				eslint.results((results) => {
					if (lintfailed) {
						fancy.space();
						fancy.error('ESLint has cancelled the build');
						fancy.info('waiting for file changes to restart...');
					} else if (results.warningCount > 0) fancy.space();
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
			if (!lintfailed) fancy.complete('Finished Compiling');
		});

/**
 * Build Gulp task
 *
 * Runs Lint and Compile in parallel
 */
const build = gulp.series((cb) => {
	fancy.space();
	fancy.info('Building Server...');
	fancy.space();
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
		stdio: [process.stdin, 'inherit', 'pipe', 'ipc']
	});

	// pipe input to server process
	// process.stdin.pipe(node.stdin);

	// color stderr red
	node.stderr.on('data', (data) => console.log(chalk.red(data)));

	// handle process close event
	node.on('close', (code) => {
		if (!restarting) fancy.space(2);

		if (code) {
			if (code === 0) fancy.event(`server ${restarting ? 'killed' : 'exited'} with code ${code}`);
			else fancy.error(`server ${restarting ? 'killed' : 'exited'} with code ${code}`);
		} else fancy.event(`server ${restarting ? 'killed' : 'exited'}`);

		if (!restarting) fancy.info('waiting for file changes to restart...');

		//? this seems to work
		process.stdin.resume();
		node = null;
	});

	// task callback
	cb();

	fancy.space();
	fancy.info('Launching Server...');
	fancy.space();
});

var restarting = false;

const restart = gulp.series(
	(cb) => {
		fancy.space();
		fancy.info('Restarting due to file change...');
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

var watchcallback = () => { };

const watch = (cb) => {
	watchcallback = cb;
	return gulp.watch('src/**/*.*', restart);
};

// build and spawn then start watching
exports.watch = gulp.series(build, spawnserver, watch);

// run the build task by default
exports.default = exports.build = build;
