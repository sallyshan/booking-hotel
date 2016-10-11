
var gulp = require('gulp');
var less = require('gulp-less');
var browserSync= require('browser-sync').create();
var reload = browserSync.reload;
var sourcemaps = require('gulp-sourcemaps');



gulp.task('start',['less'],function() {
	browserSync.init({
		server:{baseDir:'./'},
		startPath:'src/html/index.html'
	});

	gulp.watch('src/less/*.less',['less']);
	gulp.watch('src/html/*.html').on('change',reload);
	gulp.watch('src/js/*.js').on('change',reload);
	gulp.watch('src/img/*.jpg').on('change',reload);
});

gulp.task('less',function(){
      gulp.src('src/main.less')
		  .pipe(sourcemaps.init())
		.pipe(less())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('src/css'))
});