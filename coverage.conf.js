//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app',

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-bootstrap/ui-bootstrap.min.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/highcharts-ng/dist/highcharts-ng.min.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-bootstrap/ui-bootstrap.js',
      'bower_components/lodash/dist/lodash.min.js',
      'bower_components/moment/moment.js',
      'src/*.js',
      'src/**/*.js'
    ],

    preprocessors: {
      'src/test/*.js': 'coverage',
      'src/*.js': 'coverage',
      'src/**/*.js': 'coverage'
    },

    reporters : ['coverage'],

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-coverage'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
