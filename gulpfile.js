/**
 * @autor Laisson R. Silveira<laisson.r.silveira@gmail.com>
 *
 * Created on 23/05/2019
 */
const { join } = require('path');
const { writeFileSync } = require('fs');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const apidoc = require('gulp-api-doc');
const clean = require('gulp-clean');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');
const install = require('gulp-install');
const rename = require('gulp-rename');

// // Files & Paths
const DIST_PATH = 'build/';
const PROJECT_NAME = 'cpf-validate';
const packageFile = require('./package.json');
const TESTS_PATH = './test/**/*.test.js';
const ROUTES_API = './src/routes';
const DIST_DOCS = './docs';

gulp.task('clean', () => {
    return gulp.src(DIST_PATH + '*').pipe(clean());
});

gulp.task('copy', () => {
    return gulp.src(['package*', 'src/**/*', 'bin/*'], { base: './' })
        .pipe(gulp.dest(DIST_PATH));
});

gulp.task('compress', () => {
    return gulp.src(`${DIST_PATH}**/*`)
        .pipe(tar(PROJECT_NAME))
        .pipe(gzip())
        .pipe(rename(`${PROJECT_NAME}.tgz`))
        .pipe(gulp.dest('dist/'));
});

gulp.task('install-dependencies', () => {
    const pathPackage = join(__dirname, DIST_PATH);
    return gulp.src(join(pathPackage, 'package.json'))
        .pipe(gulp.dest(pathPackage))
        .pipe(install({ production: true }));
});

gulp.task('remove-files', () => {
    return gulp.src(DIST_PATH + 'package*').pipe(clean());
});

gulp.task('build',
    gulp.series(
        'clean',
        'copy',
        'install-dependencies',
        'remove-files',
        'compress',
        'clean',
    )
);

// =============================================== DOC ====================================================

gulp.task('set-version-api', done => {
    const apidocCrawler = {
        name: 'Validação de CPF - Documentação',
        description: 'Documentação de cpf-validate',
        title: 'Doc cpf-validate',
        version: require('./package').version
    };
    const DIST_APIDOC_API = join(__dirname, `./${DIST_DOCS}/apidoc.json`);
    writeFileSync(DIST_APIDOC_API, JSON.stringify(apidocCrawler, null, 4));
    done();
});

gulp.task('make-doc', () => {
    return gulp.src(`${ROUTES_API}/**/*.js`)
        .pipe(apidoc({ markdown: false, config: `${DIST_DOCS}` }))
        .pipe(gulp.dest(DIST_DOCS));
});

gulp.task('doc', gulp.parallel('set-version-api', 'make-doc'));

// =============================================== TEST ====================================================

gulp.task('test', done => {
    process.env.NODE_ENV = 'test';
    return gulp.src(TESTS_PATH, { read: false })
        .pipe(mocha({
            timeout: 10000000,
            exit: true,
            reporter: 'mochawesome',
            reporterOptions: {
                reportDir: join('test/coverage'),
                reportTitle: `Relatório de testes cpf-validate v${packageFile.version}`,
                reportPageTitle: 'Testes cpf-validate'
            }
        }))
        .on('error', err => {
            done(err);
            process.exit(1);
        });
});