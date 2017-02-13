gulp = require('gulp')
browserify = require('browserify')
source = require('vinyl-source-stream')

gulp.task('jsBrowserify', ()->
	console.log "starting Browserify"
	browserify({entries: ['src/plugin-portals.js']})
		.bundle()
		.on('error', (e)->
			console.log e.toString()
			#console.log e.stack
		)
		.pipe(source('plugin-portals.js'))
		.pipe(gulp.dest('build'))
	console.log "end"
)

gulp.task('watch', ()->
	gulp.watch('src/*', ['jsBrowserify'])
)
