var gulp = require('gulp'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync').create();

// start port 5252, because my favorite number is 52
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./files"
        },
        port: 5252
    });
});

// watch the files for changes
gulp.task('watch', function() {
  /*
  * FIXME: watch the files YOU want to watch (this is for my template example)
  */
  return watch(['files/**/*.html', 'files/**/*.js', 'files/**/*.css', 'files/**/*.json', 'files/**/*.jpg', 'files/**/*.png', 'files/**/*.gif', , 'files/**/*.svg'], function () {
    gulp.src(__filename)
    .pipe(browserSync.reload({
        stream: true
    }));
  });
});

// define the default tasks
gulp.task('default', ['watch','browser-sync']);
