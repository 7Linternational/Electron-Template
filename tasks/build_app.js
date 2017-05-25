const gulp = require('gulp');
const less = require('gulp-less');
const watch = require('gulp-watch');
const batch = require('gulp-batch');
const plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var gulpCopy = require('gulp-copy');
//var uglify = require('gulp-uglify');
//var rename = require('gulp-rename');
var pump = require('pump');
const jetpack = require('fs-jetpack');
const bundle = require('./bundle');
const utils = require('./utils');

const projectDir = jetpack;
const srcDir = jetpack.cwd('./scripts');
const vendorDir = jetpack.cwd('./scripts/vendor');
const destDir = jetpack.cwd('./');

gulp.task('bundle', () => {
    return Promise.all([
        bundle(srcDir.path('app/app.js'), destDir.path('final-app/scripts/app.js'))
        //bundle(srcDir.path('core.js'), destDir.path('core.js'))
    ]);
});

gulp.task("copyHtml", () => {
    return gulp.src([
            "index.html",
            "main.js",
            "renderer.js",
            "package.json"
        ])
        .pipe(gulp.dest("final-app"));
});

gulp.task("vendorjs", () => {
    return gulp.src([
            "node_modules/es6-promise/dist/es6-promise.js",
            "node_modules/jquery/dist/jquery.js",
            "scripts/vendor/**/*.js",
        ])
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest("final-app/scripts"));
});

gulp.task('compress', function(cb) {
    pump([
            gulp.src('scripts/app/*.js'),
            concat('core.js'),
            gulp.dest('final-app/scripts'),
            //rename('all.min.js'),
            //uglify(),
            //gulp.dest('dist')
        ],
        cb
    );
});

gulp.task('less', () => {
    return gulp.src(srcDir.path('../styles/main.less'))
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest(destDir.path('final-app/styles')));
});

gulp.task('watch', () => {
    const beepOnError = (done) => {
        return (err) => {
            if (err) {
                utils.beepSound();
            }
            done(err);
        };
    };

    watch('scripts/**/*.js', batch((events, done) => {
        gulp.start('bundle', beepOnError(done));
    }));
    watch('styles/**/*.less', batch((events, done) => {
        gulp.start('less', beepOnError(done));
    }));
    watch('./index.html', batch((events, done) => {
        gulp.start('build', beepOnError(done));
    }));
});

gulp.task('build', ['bundle', 'vendorjs', 'compress', 'less', 'copyHtml']);