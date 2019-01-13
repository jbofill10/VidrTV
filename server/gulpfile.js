const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const child_process = require('child_process');
const chalk = require('chalk');

/**
 * Custom Log formatting
 * @param {*} message message to display
 * @param {*} error if true, changes color to red
 */
function log(message = '', error = false) {
	if (message.length === 0) console.log('');
	else {
		if (error) console.log(`${chalk.red(' ✖ ')}${chalk.red(' ' + message + ' ')}`);
		else console.log(`${chalk.cyan(' ● ')}${chalk.cyan(' ' + message + ' ')}`);
	}
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
						console.log(`${chalk.red(' ✖ ')}${chalk.black.bgRed('     ESLint Report     ')}`);
						lintfailed = true;
					} else if (results.warningCount > 0)
						console.log(`${chalk.yellow(' ⚠ ')}${chalk.black.bgYellow('     ESLint Report     ')}`);
					else console.log(`${chalk.green(' ✓ ')}${chalk.green(' ESLint Report: No Issues Found ')}`);
				})
			)
			// format eslint report
			.pipe(eslint.format('stylish', process.stdout))
			// ESLint report footer
			.pipe(
				eslint.results((results) => {
					if (lintfailed) {
						log();
						log('ESLint has cancelled the build', true);
						log('waiting for file changes to restart...');
					} else if (results.warningCount > 0) log();
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
			if (!lintfailed) console.log(`${chalk.green(' ✓ ')}${chalk.green(' Finished Compiling ')}`);
		});

/**
 * Build Gulp task
 *
 * Runs Lint and Compile in parallel
 */
const build = gulp.series((cb) => {
	log();
	log('Building Server...');
	log();
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
			console.log(`${chalk.green(' ✓ ')}${chalk.green(' Killed Server Process ')}`);
			log();
			node = null;
			cb();
		});
		process.stdin.unpipe(node.stdin);
		// node.stdout.destroy();
		// node.stderr.destroy();
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

	// start server process
	node = child_process.fork('.', [], {
		stdio: [ 'pipe', 'inherit', 'pipe', 'ipc' ]
	});

	// pipe input to server process
	process.stdin.pipe(node.stdin);

	// color stderr red
	node.stderr.on('data', (data) => console.log(chalk.red(data)));

	// handle process close event
	node.on('close', (code) => {
		if (code) {
			log(`server exited with code ${code}`, code !== 0);
			log('waiting for file changes to restart...');
		}
		node = null;
	});

	// task callback
	cb();

	log();
	log('Launching Server...');
	log();
});

const restart = gulp.series(
	(cb) => {
		log();
		log('Restarting due to file change...');
		cb();
	},
	killserver,
	(cb) => {
		console.log('------------------------------------------------------------');
		cb();
	},
	build,
	spawnserver
);

const watch = () => {
	return gulp.watch('src/**/*.*', restart);
};

// build and spawn then start watching
exports.watch = gulp.series(build, spawnserver, watch);

// run the build task by default
exports.default = build;

exports.build = build;
