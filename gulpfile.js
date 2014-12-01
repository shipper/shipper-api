var gulp   = require( 'gulp' ),
    coffee = require( 'gulp-coffee' ),
    mkDir  = require( 'mkdirp'),
    rimRaf = require( 'gulp-rimraf'),
    path   = require( 'path' );


gulp.task('clean', function(){
    return gulp.src( 'dist' )
            .pipe( rimRaf( { force: true } ));
});

gulp.task('make', [ 'clean' ], function(done){
    mkDir( 'dist', done);
});

gulp.task('coffee', [ 'make' ], function(){
    return gulp.src( path.join( 'src', '**', '*.coffee' ) )
        .pipe( coffee( { bare: true } ) )
        .pipe( gulp.dest( 'dist' ) );
});


gulp.task('build', ['clean', 'make', 'coffee']);
gulp.task('default', ['build']);