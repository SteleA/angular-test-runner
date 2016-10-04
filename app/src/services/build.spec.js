'use strict';

(function(){

  describe('Service: Build', function (){
    var build, interval, timeout;

    beforeEach(module('angularApp'));

    beforeEach(angular.mock.inject(function(Build, $interval, $timeout){
      build = Build;
      interval = $interval;
      timeout = $timeout;
    }));

    describe('getBuild fn', function(){
      it('should return a build', function(){
        build.getBuild().then(function(build){
          expect(build.buildNumber).toBeDefined();
          expect(build.id).toBeDefined();
          expect(build.type).toBeDefined();
          expect(build.name).toBeDefined();
          expect(build.owner).toBeDefined();
          expect(build.date).toBeDefined();
          expect(build.build).toBeDefined();
          expect(build.totalUnitTests).toBeDefined();
          expect(build.totalFunctionalTests).toBeDefined();
        });
        timeout.flush();
      });
    });

    describe('runBuild fn', function(){
      it('should ', function(){

        var extendedBuild = {
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
        };

        build.runBuild(extendedBuild);

        expect(extendedBuild.progress.metrics).toBe(0);
        expect(extendedBuild.progress.build).toBe(0);
        expect(extendedBuild.progress.unitTest).toBe(0);
        expect(extendedBuild.progress.functionalTest).toBe(0);

        interval.flush(10000);
        expect(extendedBuild.progress.metrics).toBe(100);
        interval.flush(10000);
        expect(extendedBuild.progress.build).toBe(100);
        interval.flush(10000);
        expect(extendedBuild.progress.unitTest).toBe(100);
        interval.flush(10000);
        expect(extendedBuild.progress.functionalTest).toBe(100);
      });
    });
  });
}());
