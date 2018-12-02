const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

exports.default = () => {

	return gulp.src('src/**/*.js')

		// eslint
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError())

		// babel
		.pipe(babel())

		.pipe(gulp.dest('build'));
};