'use strict';

/**
 * @ngdoc function
 * @name cattlecrewCaseManagementUiApp.controller:CaseDetailsCtrl
 * @description
 * # CaseDetailsCtrl
 * Controller of the cattlecrewCaseManagementUiApp
 */
angular.module('cattlecrewCaseManagementUiApp')
  .controller('CaseDetailsCtrl', function ($scope, $location, $routeParams, camundaCaseService,
				 camundaHistoryService, camundaMilestoneService, camundaActivityService) {

      var caseId = $routeParams.caseId;
    
      //Fetch data for display
      camundaHistoryService.getHistoryById(caseId).then(function (res) {
        $scope.history = res;
	console.log('history');
	console.log(res);
      }, function (error) {
	console.log('An error occured!', error);
      });

      camundaMilestoneService.getMilestones(caseId).then(function (res) {
        $scope.milestones = res;
        console.log('milestones');
	console.log(res);
      }, function (error) {
        console.log('An error occured!', error);
      });

      camundaActivityService.getEnabledActivities(caseId).then( function (res) {
	$scope.enabledActivities = res;
	console.log('activities');
        console.log(res);
      }, function (error) {
	console.log('An error occured!', error);
      });

      camundaActivityService.getAllActivities(caseId).then( function (res) {
	$scope.allActivities = res;
	console.log(' all activities');
        console.log(res);
      }, function (error) {
	console.log('An error occured!', error);
      }) ;

      camundaCaseService.getCaseById(caseId).then(function (res) {
        $scope.case = res.data;
	console.log('case');
	console.log($scope.case);
      }, function(error) {
        console.log('An error occured!', error);
      });

      //UI logic
      $scope.goToListView = function () {
        $location.path('/');
      };
      
      $scope.toggleStartActivityDialog= function (activityId, activityName) {
	camundaActivityService.startActivity(activityId);
       console.log('Starting new : '+ activityName);
      };

      $scope.applicableActivity = function (type) {
	return 	type == 'humanTask' || type == 'processTask';
      }
      $scope.applicableActivity = function (type) {
	return 	type == 'milestone' ;
      }


    });
