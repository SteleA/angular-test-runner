angular.module('angularApp').factory('Build', function(
  $q,
  $timeout,
  $interval,
  Utils
){
  var
    buildId               = Utils.randomNumber(10000),
    fireWallId            = Utils.randomNumber(10000),
    totalUnitTests        = Utils.randomNumber(100),
    totalFunctionalTests  = Utils.randomNumber(1000),
    types                 = ['build','firewall'],
    owners                = ['alex','joe', 'adi', 'william'],
    buildName             = 'rainman',
    buildnumber           = 0;

  return {
    getBuild: getBuild,
    runBuild: runBuild
  };

  function getBuild(){
    var  deferred = $q.defer();

    $timeout(function(){
      var
        type  = Utils.getRandomItemFromArray(types),
        owner = Utils.getRandomItemFromArray(owners),
        build = {
          buildNumber           : buildnumber,
          id                    : type === 'build' ? buildId : fireWallId,
          type                  : type,
          name                  : type === 'build' ? buildName + '-' + buildId : fireWallId,
          owner                 : owner,
          date                  : moment().format(),
          build : {
            lastBuild           : moment().subtract(1,'day').format(),
          },
          totalUnitTests        : totalUnitTests,
          totalFunctionalTests  : totalFunctionalTests
        };

      //increment id of wither build or firewall
      type === 'build' ? buildId++ : fireWallId++;
      buildnumber++;

      deferred.resolve(build);

    },500);

    return deferred.promise;
  }

  function runBuild(build){
    var
      deferred = $q.defer(),
      keys = Object.keys(build.progress);

      runSimulatedProgress(0);

      return deferred.promise;

      function runSimulatedProgress(index){
        var
          activeProgressPercent,
          activeProgress;

        if (index < keys.length) {

          var progressInterval = $interval(function () {

            activeProgressPercent = build.progress[keys[index]],
            activeProgress = keys[index];

            if (activeProgressPercent < 100) {
              return build.progress[activeProgress] += 1;
            }

            $interval.cancel(progressInterval);
            return runSimulatedProgress(index+1);
          }, 10);
        } else {
          return deferred.resolve(build);
        }
      }
  }

});
