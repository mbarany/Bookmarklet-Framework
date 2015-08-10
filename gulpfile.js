var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var chug = require('gulp-chug');


var BOOKMARKLETS_PATH = './bookmarklets';

function getFolders (dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

gulp.task('less', function () {
    var folders = getFolders(BOOKMARKLETS_PATH);

    for (var i in folders) {
        var projectPath = BOOKMARKLETS_PATH + '/' + folders[i];
        gulp.src(projectPath + '/less/**/*.less')
            .pipe(less())
            .pipe(concat('main.css'))
            .pipe(minifyCss())
            .pipe(gulp.dest(projectPath + '/'));
    }
});

gulp.task('bookmarklets', function () {
    gulp.src(BOOKMARKLETS_PATH + '/**/gulpfile.js')
        .pipe(chug());
});

gulp.task('default', ['less', 'bookmarklets']);
