var gulp = require('gulp');
var bump = require('gulp-bump');
var shell = require('gulp-shell');
var runSequence = require('run-sequence');
var pckg = require('./package.json');
var util = require('gulp-util');
//Bumping version
function incrementVersion(importance) {
    // get all the files to bump version in
    return gulp.src(['./package.json','./sonar-project.properties'])
    // bump the version number in those files
        .pipe(bump({type: importance}))
        // save it back to filesystem
        .pipe(gulp.dest('./'));
}
gulp.task('prerelease', function() { return incrementVersion('prerelease'); })
gulp.task('patch', function() { return incrementVersion('patch'); })
gulp.task('feature', function() { return incrementVersion('minor'); })
gulp.task('release', function() { return incrementVersion('major'); })

//build tasks

gulp.task('composerInstall', shell.task([
    //'composer update --lock',
    'composer install --no-interaction',
]))

gulp.task('preparePackage', shell.task([
    'rm -rf internationalisation_PS.zip',
    'zip -r internationalisation_PS.zip . i internationalisation_PS',
]))

gulp.task('deleteZip', shell.task([
    'rm -f internationalisation_PS.zip',
]))

gulp.task('build', function() {
    runSequence(
        'composerInstall',
        'preparePackage'
    );
});



//git tasks
function prepare(branch) {
    return gulp.src(['./'])
    // bump the version number in those files
        .pipe(shell(['git config --local credential.helper store','git checkout '+ branch]))
        // save it back to filesystem
        .pipe(gulp.dest('./'));
}
gulp.task('gitPrepare', function() { return prepare(util.env.branch); })

gulp.task('gitAdd', shell.task([
    'git add -A'
]))
gulp.task('gitCommit', shell.task([
    'git commit -m "commit_bumping_version"',
]))
gulp.task('injectEnvVariable', shell.task([
    'echo RELEASE_VERSION= '+ pckg.version+' > envVars.properties',
]))
function pushToGit(remote, branch) {
    return gulp.src(['./'])
    // bump the version number in those files
        .pipe(shell('git push '+ remote+ ' '+ branch))
        // save it back to filesystem
        .pipe(gulp.dest('./'));
}
gulp.task('gitUpdateRepository', function(callback) {
    runSequence('gitAdd',
        'gitCommit',
        function (err) {
            //if any error happened in the previous tasks, exit with a code > 0
            if (err) {
                var exitCode = 2;
                console.log('[ERROR] gulp build task failed', err);
                console.log('[FAIL] gulp build task failed - exiting with code ' + exitCode);
                return process.exit(exitCode);
            }
            else {
                //console.log(pckg.version);
                return pushToGit(util.env.remote, util.env.branch);
            }
        }
    );
});