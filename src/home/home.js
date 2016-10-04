angular.module('angularApp').controller('HomeCtrl',
  function(
    Build,
    Utils,
    $q
  ){
    var vm = this;

    vm.data = {
      results: [
        {
          status: 'merged',
          subTitle: 'Change Accepted',
          message: 'Auto-Merged'
        },
        {
          status: 'rejected',
          subTitle: 'Change Rejected',
          message: 'Metrics Reduction'
        },
        {
          status: 'complete',
          subTitle: null,
          message: 'Complete'
        },
      ],
      states: [
        'pending',
        'running',
        'complete',
        'rejected'
      ],
      buildDefaults: {
        state: 'pending',
        progress: {
          metrics: 0,
          build: 0,
          unitTest: 0,
          functionalTest: 0
        },
        expanded:false,
        metrics: {
          test:0,
          security:0,
          maintainability:0,
          workmanship:0
        },
        unitTest: {
          passed: 0,
          failed: 0,
          coverage: 0,
        },
        functionalTest: {
          passed: 0,
          failed: 0,
          coverage: 0
        },
        result: null
      },
      pending: [],
      builds: []
    };

    vm.ui   = {
      building: false,
      start: true
    };

    vm.fn   = {
      addBuild            : addBuild,
      runBuild            : runBuild,
      clearBuilds         : clearBuilds,
      addMockTestsResults : addMockTestsResults,
      runNextPendingBuild : runNextPendingBuild,
      expandBuild         : expandBuild,
      initChart           : initChart,
      extendBuild         : extendBuild,
      analyzeBuild        : analyzeBuild,
      addResults          : addResults
    };

    function addBuild() {
      Build.getBuild()
      .then(vm.fn.extendBuild)
      .then(vm.fn.runNextPendingBuild);
    }

    //extend the build response with values needed for processing
    function extendBuild(buildResponse) {
      var
        defaults                    = angular.copy(vm.data.buildDefaults),
        build                       = _.extend({}, buildResponse, defaults);
      vm.ui.start = false;
      vm.data.pending.push(build);
      vm.data.builds.push(build);

      return build;
    }

    function runNextPendingBuild() {
      return vm.fn.runBuild()
      .then(vm.fn.addMockTestsResults)
      .then(vm.fn.analyzeBuild)
      .then(vm.fn.addResults)
      .then(vm.fn.runNextPendingBuild);
    }

    function runBuild(){
      if (!vm.ui.building && vm.data.pending.length > 0) {
        var activeBuild             = vm.data.pending.shift();

        activeBuild.state           = vm.data.states[1];
        vm.ui.building              = true;
        return Build.runBuild(activeBuild);
      } else {
        return $q.reject('build skipped');
      }
    }

    function addMockTestsResults (build) {
      //mock results for metrics
      for (var key in build.metrics) {
        if (build.metrics.hasOwnProperty(key)) {
          build.metrics[key]        = Utils.randomNumber(100);
        }
      }

      //mock results for unitTest
      build.unitTest.passed         = Utils.randomNumber(build.totalUnitTests);
      build.unitTest.failed         = build.totalUnitTests - build.unitTest.passed;
      build.unitTest.percent        = build.unitTest.passed/build.totalUnitTests * 100;
      build.unitTest.coverage       = Utils.randomNumber(100);

      //mock results for functionalTest
      build.functionalTest.passed   = Utils.randomNumber(build.totalFunctionalTests);
      build.functionalTest.failed   = build.totalFunctionalTests - build.functionalTest.passed;
      build.functionalTest.percent  = build.functionalTest.passed/build.totalFunctionalTests * 100;
      build.functionalTest.coverage = Utils.randomNumber(100);
      return build;
    }

    function analyzeBuild(activeBuild){
      var
        lastBuildId                 = activeBuild.id - 1,
        lastBuild                   = _.find(vm.data.builds, {id: lastBuildId}),
        metrics                     = activeBuild.metrics,
        testsPassed;

      if (lastBuild) {
          metrics.testPassed        = (metrics.test - lastBuild.metrics.test) >= 0,
          metrics.maintainPassed    = (metrics.maintainability - lastBuild.metrics.maintainability) >= 0,

          testsPassed               = (metrics.testPassed && metrics.maintainPassed);

        if (testsPassed) {
          activeBuild.state         = vm.data.states[2];
        } else {
          activeBuild.state         = vm.data.states[3];
        }
      }
      // first build of kind
      else {
        metrics.testPassed          = true,
        metrics.maintainPassed      = true,
        activeBuild.state           = vm.data.states[2];
      }

      activeBuild.chart = {
        unitTest      : vm.fn.initChart(activeBuild.unitTest.passed, activeBuild.unitTest.failed),
        functionalTest: vm.fn.initChart(activeBuild.functionalTest.passed, activeBuild.functionalTest.failed)
      };

      return activeBuild;
    }

    function addResults(activeBuild) {
      if (activeBuild.state      === 'rejected') {
        activeBuild.result          = vm.data.results[1];
      }
      else if (activeBuild.state === 'complete' && activeBuild.type === 'firewall') {
        activeBuild.result          = vm.data.results[0];
      }
      else if (activeBuild.state === 'complete' && activeBuild.type === 'build') {
        activeBuild.result          = vm.data.results[2];
      }
      vm.ui.building                = false;
      return activeBuild;
    }

    function clearBuilds(){
      vm.data.builds                = [];
    }

    function expandBuild(build) {
      if (build.state === 'pending' || build.state === 'running' ) {
        return;
      }
      if (vm.data.expandedBuild && build.id === vm.data.expandedBuild.id) {
        build.expanded              = !build.expanded;
        build.showChart             = !build.showChart;
        vm.data.expandedBuild       = null;
      } else {
        vm.data.builds.forEach(function(build){
          build.expanded            = false;
          build.showChart           = false;
        });

        vm.data.expandedBuild       = build;
        build.expanded              = true;
        build.showChart             = true;
      }
    }

    function initChart(passed, failed) {
      return {
        options: {
          legend: {
            align           : 'center',
            verticalAlign   : 'bottom',
            layout          : 'vertical',
            useHTML         : true,
            labelFormatter: function () {
              return  '<span class="legend-wrapper"><span class="text-ellipsis font9 legend-title">' +
                      this.name +
                      '</span>' +
                      ' <span class="mute font9">(' +
                      this.y +
                      ')</span></span>';
            }
          },
          plotOptions: {
            pie: {
              point: {
                events: {
                  legendItemClick: function () {
                    return false;
                  }
                }
              },
              enableMouseTracking: false,
              showInLegend  : true,
              innerSize     : '67%',
              dataLabels    : {
                enabled: false,
              }
            }
          }
        },
        size: {
          height:200
        },
        title: {text:''},
        series: [{
          type:'pie',
          data: [{name:'Passed', y:passed},{name:'Failed', y:failed}]
        }]
      };
    }

    //init
    addBuild();
});
