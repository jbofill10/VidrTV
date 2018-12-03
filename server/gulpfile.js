const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

const lint = () =>
	gulp
		.src('src/**/*.js')
		// eslint
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());

const compile = () =>
	gulp
		.src('src/**/*.js')
		// babel
		.pipe(babel())
		// output to build dir
		.pipe(gulp.dest('build'));

exports.default = exports.build = gulp.parallel(lint, compile);
