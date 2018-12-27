var gulp = require('gulp');
var combiner = require('stream-combiner2');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var gulpif = require('gulp-if');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
var minimist = require('minimist');
var less = require('gulp-less');
var path = require('path');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");


var knownOptions = {
    string: 'env',
    default: { env: process.env.NODE_ENV || 'dev' }
};

var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('admin-less', function () {
    var combined = combiner.obj([
        gulp.src('./assets/admin/css/src/core.less')
            .pipe(gulpif(options.env == 'dev',sourcemaps.init()))
            .pipe(less({
                paths: [ path.join('./admin/less') ],
                plugins: [autoprefix]
            }))
            .pipe(gulpif(options.env == 'dev',sourcemaps.write()))
            .pipe(gulpif(options.env != 'dev',cleanCSS({compatibility: 'ie8'})))
            //.pipe(uglify({
            //    mangle: false,
            //    compress: options.env != 'dev',
            //    output : {
            //        beautify : options.env == 'dev',
            //        comments : options.env != 'dev',
            //    }
            //}))
            .pipe(gulp.dest('./assets/admin/css/build'))
        //   .pipe(rename('style.css'))
    ]);
    combined.on('error', console.error.bind(console));
    return combined;

});


gulp.task('admin-js',function(){
    return gulp.src([
            '../../libs/bootstrap/js/bootstrap.min.js',
            'assets/admin/js/src/functions.js',
            'assets/admin/js/src/add-draggable.js',
            'assets/admin/js/src/EF_Form_Actions.js',
            'assets/admin/js/src/EF_Event.js',
            'assets/admin/js/src/EF_Add.js',
            'assets/admin/js/src/add.js',
        ])
        // Put everything in one file
        .pipe(concat('admin.js'))
        .pipe(uglify({
            mangle: false,
            compress: options.env != 'dev',
            output : {
                beautify : options.env == 'dev',
                comments : options.env != 'dev',
            }
        }))
        // Output : all.js in assets/js/
        .pipe(gulp.dest('assets/admin/js/build'))
        .pipe(rename('admin.js'))
});

gulp.task("add-ts", function () {
    return tsProject.src()
        .pipe(gulpif(options.env == 'dev', sourcemaps.init()))
        .pipe(tsProject())
        .pipe(uglify({
            mangle: false,
            compress: options.env != 'dev',
            output : {
                beautify : options.env == 'dev',
                comments : options.env == 'dev',
            }
        }))
        .pipe(gulpif(options.env == 'dev', sourcemaps.write()))
        .pipe(gulp.dest("./assets/admin/js/build/add"));
});


gulp.task("libs",['add-ts'], function () {
    return gulp.src([
        './node_modules/systemjs/dist/system.js',
    ])
        .pipe(gulpif(options.env == 'dev', sourcemaps.init()))
        // Put everything in one file
        .pipe(concat('libs.js'))
        .pipe(uglify({
            mangle: false,
            compress: options.env != 'dev',
            output : {
                beautify : options.env == 'dev',
                comments : options.env == 'dev',
            }
        }))
        .pipe(gulpif(options.env == 'dev', sourcemaps.write()))
        // Output : all.js in assets/js/
        .pipe(gulp.dest('./assets/admin/js/build/'))
});



gulp.task('watch',function(){
    gulp.watch('./assets/admin/css/src/**/*.less',['admin-less']);
    //gulp.watch('./assets/admin/js/src/**/*.js',['admin-js']);
    gulp.watch('./assets/admin/js/src/**/*.ts',['add-ts']);
    gulp.watch('./assets/public/css/src/**/*.less',['public-less','admin-less']);
    gulp.watch('./assets/public/js/src/**/*.js',['public-js']);
});
