'use strict';

(function(){

  describe('Controller: HomeCtrl', function (){
    var
      httpBackend,
      vm,
      deferred,
      scope,
      BuildService,

      buildResponse = {
        'buildNumber':0,
        'id':4452,
        'type':'build',
        'name':'rainman-4452',
        'owner':'alex',
        'date':'2016-09-24T18:03:03+02:00',
        'build':{'lastBuild':'2016-09-23T18:03:03+02:00'},
        'totalUnitTests':53,
        'totalFunctionalTests':759
      },

      extendedBuild = {
        'buildNumber':0,
        'id':5577,
        'type':'firewall',
        'name':5577,
        'owner':'adi',
        'date':'2016-09-24T18:13:32+02:00',
        'build':{'lastBuild':'2016-09-23T18:13:32+02:00'},
        'totalUnitTests':50,
        'totalFunctionalTests':161,
        'state':'pending',
        'progress':{
          'metrics':0,
          'build':0,
          'unitTest':0,
          'functionalTest':0
        },
        'expanded':false,
        'metrics':{
          'test':0,
          'security':0,
          'maintainability':0,
          'workmanship':0
        },
        'unitTest':{
          'passed':null,
          'failed':null,
          'coverage':null
        },
        'functionalTest':{
          'passed':null,
          'failed':null,
          'coverage':null
        },
        'result':null
      },

      completedBuild = {
        'buildNumber':0,
        'id':5577,
        'type':'firewall',
        'name':5577,
        'owner':'adi',
        'date':'2016-09-24T18:13:32+02:00',
        'build':{'lastBuild':'2016-09-23T18:13:32+02:00'},
        'totalUnitTests':50,
        'totalFunctionalTests':161,
        'state':'complete',
        'progress':{
          'metrics':100,
          'build':100,
          'unitTest':100,
          'functionalTest':100
        },
        'expanded':false,
        'metrics':{
          'test':40,
          'security':37,
          'maintainability':84,
          'workmanship':15
        },
        'unitTest':{
          'passed':3,
          'failed':10,
          'coverage':70,
          'percent':23
        },
        'functionalTest':{
          'passed':446,
          'failed':32,
          'coverage':32,
          'percent':30
        },
        'result':{
          message: 'Complete',
          status: 'complete'
        }
      };

    beforeEach(module('angularApp'));

    beforeEach(angular.mock.inject(function(
      $rootScope,
      $controller,
      $location,
      $httpBackend,
      Build,
      $q
    ){
      scope = $rootScope.$new();

      BuildService = Build;
      BuildService.getBuild = function(){
        deferred = $q.defer();
        return deferred.promise;
      };
      BuildService.runBuild = function(){
        deferred = $q.defer();
        return deferred.promise;
      };

      httpBackend = $httpBackend;
      httpBackend.expectGET('src/home/home.tpl.html').respond(200);

      vm = $controller('HomeCtrl', {
        $scope: scope,
        Build: BuildService
      });

    }));

    describe('Initialize', function(){
      it('should be defined', function(){
        expect(vm).toBeDefined();
        expect(vm.data).toBeDefined();
        expect(vm.fn).toBeDefined();
        expect(vm.ui).toBeDefined();
      });
    });

    describe('addBuild fn', function(){
      beforeEach(function(){
        spyOn(BuildService, 'getBuild').and.callThrough();
        spyOn(vm.fn, 'runNextPendingBuild').and.returnValue();
      });

      it('should be defined', function(){
        expect(vm.fn.addBuild).toBeDefined();
      });

      it('should call getBuild method and add extended build to state', function(){
        expect(vm.ui.start).toBe(true);
        expect(vm.data.builds.length).toBe(0);
        expect(vm.data.pending.length).toBe(0);

        vm.fn.addBuild();
        expect(BuildService.getBuild).toHaveBeenCalled();
        deferred.resolve(buildResponse);
        scope.$apply();

        expect(vm.data.builds.length).toBe(1);
        expect(vm.data.pending.length).toBe(1);

        expect(vm.data.pending[0].state).toBe('pending');
        expect(vm.ui.start).toBe(false);

      });
    });

    describe('runBuild fn', function(){
      beforeEach(function(){
        spyOn(BuildService, 'runBuild').and.callThrough();
        // spyOn(vm.fn, 'runNextPendingBuild').and.returnValue();
      });

      it('should be defined', function(){
        expect(vm.fn.runBuild).toBeDefined();
      });

      it('should return reject if there is no pending build', function(){
        vm.ui.building = false;
        vm.data.pending = [];

        vm.fn.runBuild()
        .catch(function(res){
          expect(res).toBe('build skipped');
        });

        scope.$apply();

      });

      it('should return reject if there is a build running', function(){
        vm.ui.building = true;
        vm.data.pending = [extendedBuild];

        vm.fn.runBuild()
        .catch(function(res){
          expect(res).toBe('build skipped');
        });

        scope.$apply();

      });

      it('should set the state, reduce the first item from the pending array and call BuildService.runBuild fn', function(){
        vm.ui.building = false;
        vm.data.pending = [extendedBuild];

        vm.fn.runBuild();

        scope.$apply();

        expect(vm.data.pending.length).toBe(0);
        expect(vm.ui.building).toBe(true);
        expect(BuildService.runBuild).toHaveBeenCalledWith(extendedBuild);
      });
    });

    describe('clearBuilds fn', function(){
      it('should clear the vm.data.builds array', function(){
        vm.data.builds = [extendedBuild];

        expect(vm.data.builds.length).toBe(1);

        vm.fn.clearBuilds();
        expect(vm.data.builds.length).toBe(0);

      });
    });

    describe('addMockTestsResults fn', function(){
      it('should add mock rest results to build', function(){

        extendedBuild.metrics.workmanship = null;
        extendedBuild.metrics.maintainability = null;
        extendedBuild.metrics.security = null;
        extendedBuild.metrics.test = null;

        vm.fn.addMockTestsResults(extendedBuild);

        expect(extendedBuild.metrics.workmanship).not.toBe(null);
        expect(extendedBuild.metrics.maintainability).not.toBe(null);
        expect(extendedBuild.metrics.security).not.toBe(null);
        expect(extendedBuild.metrics.test).not.toBe(null);

        expect(extendedBuild.unitTest.passed).not.toBe(null);
        expect(extendedBuild.unitTest.failed).not.toBe(null);
        expect(extendedBuild.unitTest.coverage).not.toBe(null);
        expect(extendedBuild.unitTest.percent).not.toBe(null);

        expect(extendedBuild.functionalTest.passed).not.toBe(null);
        expect(extendedBuild.functionalTest.failed).not.toBe(null);
        expect(extendedBuild.functionalTest.coverage).not.toBe(null);
        expect(extendedBuild.functionalTest.percent).not.toBe(null);

      });
    });

    describe('runNextPendingBuild fn', function(){
      beforeEach(function(){
        spyOn(vm.fn,'runBuild').and.callThrough();
        spyOn(BuildService, 'runBuild').and.callThrough();
        spyOn(vm.fn,'addMockTestsResults').and.callThrough();
        spyOn(vm.fn,'analyzeBuild').and.callThrough();
        spyOn(vm.fn,'addResults').and.callThrough();
        spyOn(vm.fn,'runNextPendingBuild').and.callThrough();
        spyOn(vm.fn,'initChart').and.callThrough();

        vm.data.builds = [extendedBuild];
        vm.data.pending = [extendedBuild];
      });

      it('should be defined', function(){
        expect(vm.fn.runBuild).toBeDefined();
      });

      it('should run build fn and call fn in the building process chain', function(){
        vm.fn.runNextPendingBuild();

        expect(vm.fn.runBuild).toHaveBeenCalled();
        expect(vm.ui.building).toBe(true);

        deferred.resolve(extendedBuild);
        scope.$apply();

        expect(vm.fn.addMockTestsResults).toHaveBeenCalled();
        expect(vm.fn.analyzeBuild).toHaveBeenCalled();
        expect(vm.fn.addResults).toHaveBeenCalled();
        expect(vm.fn.initChart).toHaveBeenCalled();
        expect(vm.fn.runNextPendingBuild).toHaveBeenCalled();
        expect(vm.ui.building).toBe(false);

      });
    });

    describe('expandBuild fn', function(){
      it('should be defined', function(){
        expect(vm.fn.expandBuild).toBeDefined();
      });
      it('should return undefined when state is running', function(){
        extendedBuild.state = 'running';
        expect(vm.fn.expandBuild(extendedBuild)).toBe(undefined);
      });
      it('should return undefined when state is pending', function(){
        extendedBuild.state = 'pending';
        expect(vm.fn.expandBuild(extendedBuild)).toBe(undefined);
      });

      it('should close a expanded build when clicking on it', function(){
        vm.data.expandedBuild = completedBuild;
        vm.data.expandedBuild.expanded = true;
        vm.data.expandedBuild.showChart = true;

        vm.fn.expandBuild(completedBuild);
        expect(vm.data.expandedBuild).toBe(null);
        expect(completedBuild.expanded).toBe(false);
        expect(completedBuild.showChart).toBe(false);

      });

      it('should close a expanded build when clicking on another build', function(){
        var anotherBuild = {};

        vm.data.builds = [
          extendedBuild,
          completedBuild,
          anotherBuild
        ];

        vm.data.expandedBuild = completedBuild;
        vm.data.expandedBuild.expanded = true;
        vm.data.expandedBuild.showChart = true;

        vm.fn.expandBuild(anotherBuild);

        expect(completedBuild.expanded).toBe(false);
        expect(completedBuild.showChart).toBe(false);

        expect(anotherBuild.showChart).toBe(true);
        expect(anotherBuild.expanded).toBe(true);
        expect(vm.data.expandedBuild).toEqual(anotherBuild);

      });
    });

    describe('analyzeBuild fn', function(){
      beforeEach(function(){
          spyOn(vm.fn, 'initChart').and.callThrough();
      });

      it('should be defined', function(){
        expect(vm.fn.analyzeBuild).toBeDefined();
      });
      it('should pass tests if it is first of its kind', function(){
        completedBuild.state = null;

        vm.fn.analyzeBuild(completedBuild);
        expect(vm.fn.initChart).toHaveBeenCalled();
        expect(completedBuild.state).toBe('complete');

      });
      it('should pass tests when test and maintainability score is higher than the last build', function(){
        completedBuild.state = null;

        var lastBuild = {
          id: completedBuild.id-1,
          metrics: {
            test: 35,
            maintainability: 80
          }
        };

        vm.data.builds = [completedBuild,lastBuild];

        vm.fn.analyzeBuild(completedBuild);
        expect(vm.fn.initChart).toHaveBeenCalled();
        expect(completedBuild.state).toBe('complete');

      });
      it('should fail tests when test and maintainability score is higher than the last build', function(){
        completedBuild.state = null;

        var lastBuild = {
          id: completedBuild.id-1,
          metrics: {
            test: 40,
            maintainability: 85
          }
        };

        vm.data.builds = [completedBuild,lastBuild];

        vm.fn.analyzeBuild(completedBuild);
        expect(vm.fn.initChart).toHaveBeenCalled();
        expect(completedBuild.state).toBe('rejected');

      });
      it('should fail tests when test score is higher than the last build', function(){
        completedBuild.state = null;

        var lastBuild = {
          id: completedBuild.id-1,
          metrics: {
            test: 45,
            maintainability: 1
          }
        };

        vm.data.builds = [completedBuild,lastBuild];

        vm.fn.analyzeBuild(completedBuild);
        expect(vm.fn.initChart).toHaveBeenCalled();
        expect(completedBuild.state).toBe('rejected');

      });
      it('should fail tests when maintainability score is higher than the last build', function(){
        completedBuild.state = null;

        var lastBuild = {
          id: completedBuild.id-1,
          metrics: {
            test: 1,
            maintainability: 90
          }
        };

        vm.data.builds = [completedBuild,lastBuild];

        vm.fn.analyzeBuild(completedBuild);
        expect(vm.fn.initChart).toHaveBeenCalled();
        expect(completedBuild.state).toBe('rejected');

      });
      it('should fail tests when test and maintainability score is equal to last build', function(){
        completedBuild.state = null;

        var lastBuild = {
          id: completedBuild.id-1,
          metrics: {
            test: 40,
            maintainability: 84
          }
        };

        vm.data.builds = [completedBuild,lastBuild];

        vm.fn.analyzeBuild(completedBuild);
        expect(vm.fn.initChart).toHaveBeenCalled();
        expect(completedBuild.state).toBe('complete');

      });
    });

    describe('addResults fn', function(){
      it('should be defined', function(){
        expect(vm.fn.addResults).toBeDefined();
      });

      it('should set state and have the rejected result added', function(){
        var build = {state: 'rejected'};
        vm.ui.building = true;
        vm.fn.addResults(build);
        expect(build.result).toBe(vm.data.results[1]);
        expect(vm.ui.building).toBe(false);
      });
      it('should set state and have the complted firewall result added', function(){
        var build = {state: 'complete', type:'firewall'};
        vm.fn.addResults(build);
        expect(build.result).toBe(vm.data.results[0]);
        expect(vm.ui.building).toBe(false);
      });
      it('should set state and have the completed build result added', function(){
        var build = {state: 'complete', type:'build'};
        vm.fn.addResults(build);
        expect(build.result).toBe(vm.data.results[2]);
        expect(vm.ui.building).toBe(false);
      });
    });
  });
}());
