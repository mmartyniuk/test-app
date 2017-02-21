const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babel = require('babelify');
const inject = require("gulp-inject");
const sass = require('gulp-sass');

// files to be injected
const jsForInject = [
    './build/*.js'
];

const cssForInject = [
    "./node_modules/bootstrap/dist/css/bootstrap.min.css",
    "./node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css",
    "./build/*.css"
];

const fonts = [
    "./node_modules/bootstrap/fonts/*.{ttf,woff,woff2}"
];

// bundling client ui
gulp.task('bundle', () => {
    const bundler = browserify("./src/client/app.js", { debug: true }).transform(babel);
        return bundler.bundle()
            .on("error", (err) => { 
                console.error(err); 
                this.emit("end"); 
            })
            .pipe(source("build.js"))
            .pipe(buffer())
            .pipe(gulp.dest("./build"));
});

gulp.task("sass", () => {
    return gulp.src("./src/client/styles/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./build"));
});

gulp.task("fonts", () => {
    return gulp.src(fonts)
        .pipe(gulp.dest("./build/fonts"));
});

gulp.task("default", ["bundle", "fonts", "sass"], () => {
    return gulp.src("./index.html")
        .pipe(inject(gulp.src(cssForInject,
            {read: false}), {addRootSlash: true})
        )
        .pipe(inject(gulp.src(jsForInject,
            {read: false}), {addRootSlash: true})
        )
        .pipe(gulp.dest("./build"));
});
