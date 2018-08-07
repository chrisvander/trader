const sass = require('node-sass');

module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      dist: {
        files: {
          'client/public/stylesheets/application.css': 'client/sass/app.scss'
        }
      }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer'),
          require('cssnano')
        ]
      },
      dist: {
        src: 'client/public/stylesheets/application.css',
        dest: 'client/public/stylesheets/application.css'
      }
    },
    watch: {
      source: {
        files: ['client/sass/**/*.scss', 'client/views/**/*.pug'],
        tasks: ['sass', 'postcss'],
        options: {
          livereload: true, // needed to run LiveReload
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-sass');
  grunt.registerTask('default', ['sass', 'postcss']);
  grunt.loadNpmTasks('grunt-contrib-watch');
};