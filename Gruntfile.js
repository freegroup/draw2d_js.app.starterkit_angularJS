module.exports = function (grunt) {

    //Initializing the configuration object
    grunt.initConfig({

        // get the configuration info from package.json ----------------------------
        // this way we can use things like name and version (pkg.name)
        pkg: grunt.file.readJSON('package.json'),

        // Task configuration
        concat: {
            options: {
                separator: ';'
            },
            libs: {
                src: [
                    './bower_components/shifty/dist/shifty.min.js',
                    './bower_components/draw2d/dist/patched_raphael.js',
                    './bower_components/jquery/jquery.min.js',
                    './bower_components/draw2d/dist/jquery.autoresize.js',
                    './bower_components/draw2d/dist/jquery-touch_punch.js',
                    './bower_components/draw2d/dist/jquery.contextmenu.js',
                    './bower_components/draw2d/dist/rgbcolor.js',
                    './bower_components/draw2d/dist/patched_canvg.js',
                    './bower_components/draw2d/dist/patched_Class.js',
                    './bower_components/draw2d/dist/json2.js',
                    './bower_components/draw2d/dist/pathfinding-browser.min.js',
                    './bower_components/draw2d/dist/draw2d.js',
                    './bower_components/angular/angular.min.js',
                    './bower_components/angular-bootstrap/ui-bootstrap.min.js',
                    './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    './bower_components/jquery-ui/ui/minified/jquery-ui.min.js'

                ],
                dest: './dist/assets/javascript/dependencies.js'
            },
            application: {
                src: [
                    './src/assets/javascript/directrives/draw2d.js',
                    './src/assets/javascript/directrives/canvas.js',
                    './src/assets/javascript/directrives/palette.js',
                    './src/assets/javascript/app.js',
                    './src/assets/javascript/factories/DemoData.js',
                    './src/assets/javascript/factories/FileFactory.js',
                    './src/assets/javascript/controllers/EditorController.js',
                    './src/assets/javascript/controllers/FileOpenController.js'
                ],
                dest: './dist/assets/javascript/app.js'
            },
            css:{
                src:[
                    './bower_components/bootstrap/dist/css/bootstrap.min.css'
                ],
                dest: './dist/assets/stylesheets/dependencies.css'
            }

        },

        copy: {
            jqueryUI:{
                expand: true,
                cwd: 'bower_components/jquery-ui/themes/eggplant',
                src: ['**/*'],
                dest: 'dist/lib/jquery-ui'
            },

            application: {
                expand: true,
                cwd: 'src/',
                src: '**/*.html',
                dest: 'dist/'
            },
            templates:{
                expand: true,
                cwd: 'src/assets/templates',
                src: '**/*.html',
                dest: 'assets/templates/'
            }
        },

        less: {
            development: {
                options: {
                    compress: false
                },
                files: {
                    "./dist/assets/stylesheets/app.css": "./src/assets/less/styles.less"
                }
            }
        },

        // configure jshint to validate js files -----------------------------------
        jshint: {
            options: {
                reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
            },

            // when this task is run, lint the Gruntfile and all js files in src
            build: ['Grunfile.js', 'src/**/*.js']
        },

        watch: {
            js: {
                files: [
                    './src/assets/javascript/**/*.js'
                ],
                tasks: ['concat:appliction'],
                options: {
                    livereload: true
                }
            },

            less: {
                files: [
                    "./src/assets/stylesheets/**/*.less"
                ],
                tasks: ['less'],
                options: {
                    livereload: true
                }
            }
        },
        'gh-pages': {
            options: {
                base: 'dist'
            },
            src: ['**']
        }
    });

    // Plugin loading
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-gh-pages');

    // Task definition
    grunt.registerTask('default', ['jshint', 'concat', 'less', 'copy']);
    grunt.registerTask('publish', ['jshint', 'concat', 'less', 'copy', 'gh-pages']);


};

