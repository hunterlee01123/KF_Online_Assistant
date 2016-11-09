'use strict';
const gulp = require('gulp');
const gutil = require('gulp-util');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const concat = require('gulp-concat');
const runSequence = require('run-sequence');

const srcPath = 'src/';
const distPath = 'dist/';
const es5Path = 'es5/';
const es6Path = 'es6/';
const libPath = 'lib/';
const appFileName = 'app.js';
const metaFileName = 'meta.js';
const commonEditionName = 'Common';
const fullEditionName = 'Full';
const forFirefoxEditionName = 'ForFirefox';
const scriptExt = '.user.js';
const metaExt = '.meta.js';
const metaContentRegex = /(\/\/ ==UserScript==(?:.|\r|\n)+?\/\/ ==\/UserScript==)(?:.|\r|\n)+/;

const getBundler = function () {
    return browserify({entries: [srcPath + appFileName]})
        .transform(babelify, {'plugins': ['transform-es2015-modules-commonjs']});
};

const compileEs6 = function (bundler) {
    return bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Compile es6 Script Error:\n'))
        .pipe(source(appFileName))
        //.pipe(buffer())
        .pipe(gulp.dest(distPath + es6Path));
};

const compileEs5 = function () {
    return browserify({entries: [srcPath + appFileName]})
        .transform(babelify, {presets: ['es2015', 'es2016', 'es2017']})
        .bundle()
        .on('error', gutil.log.bind(gutil, 'Compile es5 Script Error:\n'))
        .pipe(source(appFileName))
        //.pipe(buffer())
        .pipe(gulp.dest(distPath + es5Path));
};

const buildCommonEdition = function (isEs6 = false) {
    let path = isEs6 ? es6Path : es5Path;
    return gulp.src([srcPath + metaFileName, distPath + path + appFileName])
        .pipe(concat(commonEditionName + scriptExt))
        .pipe(replace(
            /\/\/ @pd-update-url-placeholder/,
            `// @updateURL   https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/${path}Common.meta.js\n` +
            `// @downloadURL https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/${path}Common.user.js`
        ))
        .pipe(replace(/\/\/ @pd-require\n/, !isEs6 ? '// @require     https://cdn.css.net/libs/babel-polyfill/6.16.0/polyfill.min.js\n' : ''))
        .pipe(gulp.dest(distPath + path))
        .pipe(replace(metaContentRegex, '$1'))
        .pipe(rename(commonEditionName + metaExt))
        .pipe(gulp.dest(distPath + path));
};

const buildFullEdition = function (isEs6 = false) {
    let path = isEs6 ? es6Path : es5Path;
    return gulp.src([srcPath + metaFileName, distPath + path + appFileName])
        .pipe(concat(fullEditionName + scriptExt))
        .pipe(replace(
            /\/\/ @pd-update-url-placeholder/,
            `// @updateURL   https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/${path}Full.meta.js\n` +
            `// @downloadURL https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/${path}Full.user.js`
        ))
        .pipe(replace(/\/\/ @pd-require\n/, !isEs6 ? '// @require     https://cdn.css.net/libs/babel-polyfill/6.16.0/polyfill.min.js\n' : ''))
        .pipe(replace(/(\/\/ @grant\s+)none/, '$1GM_getValue\n$1GM_setValue\n$1GM_deleteValue'))
        .pipe(replace(/(\/\/ @include-jquery\s+true)/, '$1\n// @use-greasemonkey true'))
        .pipe(gulp.dest(distPath + path))
        .pipe(replace(metaContentRegex, '$1'))
        .pipe(rename(fullEditionName + metaExt))
        .pipe(gulp.dest(distPath + path));
};

const buildForFirefoxEdition = function (isEs6 = false) {
    let path = isEs6 ? es6Path : es5Path;
    return gulp.src([srcPath + metaFileName, distPath + path + appFileName])
        .pipe(concat(forFirefoxEditionName + scriptExt))
        .pipe(replace(
            /\/\/ @pd-update-url-placeholder/,
            `// @updateURL   https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/${path}ForFirefox.meta.js\n` +
            `// @downloadURL https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/${path}ForFirefox.user.js`
        ))
        .pipe(replace(/(\/\/ @grant\s+)none/, '$1GM_getValue\n$1GM_setValue\n$1GM_deleteValue'))
        .pipe(replace(
            /\/\/ @pd-require\n/,
            (!isEs6 ? '// @require     https://cdn.css.net/libs/babel-polyfill/6.16.0/polyfill.min.js\n' : '') +
            '// @require     https://git.oschina.net/miaolapd/KF_Online_Assistant/raw/master/dist/lib/jquery.min.js?V2.2.4\n'
        ))
        .pipe(replace(/(\/\/ @include-jquery\s+true)/, '$1\n// @use-greasemonkey true'))
        .pipe(gulp.dest(distPath + path))
        .pipe(replace(metaContentRegex, '$1'))
        .pipe(rename(forFirefoxEditionName + metaExt))
        .pipe(gulp.dest(distPath + path));
};

gulp.task('compileEs6', () => compileEs6(getBundler()));
gulp.task('buildEs6CommonEdition', () => buildCommonEdition(true));
gulp.task('buildEs6FullEdition', () => buildFullEdition(true));
gulp.task('buildEs6ForFirefoxEdition', () => buildForFirefoxEdition(true));

gulp.task('compileEs5', () => compileEs5());
gulp.task('buildEs5CommonEdition', () => buildCommonEdition());
gulp.task('buildEs5FullEdition', () => buildFullEdition());
gulp.task('buildEs5ForFirefoxEdition', () => buildForFirefoxEdition());

gulp.task('uglify', function () {
    return gulp.src(distPath + es5Path + commonEditionName + scriptExt)
        .pipe(uglify())
        .pipe(rename(commonEditionName + '.min' + scriptExt))
        .pipe(gulp.dest(distPath + es5Path));
});

const bundler = watchify(getBundler());
gulp.task('watch', function () {
    bundler.on('update', function () {
        console.log('-> Compiling Script...');
        compileEs6(bundler);
    });
    bundler.on('log', gutil.log);
    gulp.watch(distPath + es6Path + appFileName, ['buildEs6CommonEdition', 'buildEs6FullEdition', 'buildEs6ForFirefoxEdition']);
    return compileEs6(bundler);
});

gulp.task('copy', () => gulp.src(srcPath + libPath + '*.js').pipe(gulp.dest(distPath + libPath)));

gulp.task('build', function (cb) {
    runSequence(
        'compileEs6', ['buildEs6CommonEdition', 'buildEs6FullEdition', 'buildEs6ForFirefoxEdition'],
        'compileEs5', ['buildEs5CommonEdition', 'buildEs5FullEdition', 'buildEs5ForFirefoxEdition'], 'uglify',
        'copy', cb
    );
});

gulp.task('default', ['build', 'watch']);
