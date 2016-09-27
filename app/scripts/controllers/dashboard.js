'use strict';

/**
 * @ngdoc function
 * @name cattlecrewCaseManagementUiApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the cattlecrewCaseManagementUiApp
 */
angular.module('cattlecrewCaseManagementUiApp')
  .controller('DashboardCtrl', function($scope, $locale, caseService, localizationService, camundaConstantsService, documentService) {

    $scope.currentUser = 'baerbel';

    $scope.setLocale = function(id){
	    $locale.id = id;
    };

    $scope.getString = function(key){
    	return localizationService.getString(key);
    };

    $scope.initView = function() {

      $scope.caseModelUrl = camundaConstantsService.modelUrl;

      $scope.casesOrderCondition = {
        predicate: 'createTime',
        reverse: true
      };

      caseService.updateCaseDefinitions();
      $scope.caseDefinitionsArrayContainer = caseService.getCaseDefinitionsArrayContainer();

      caseService.updateTasklist();
      $scope.taskList = caseService.getTasklistForCurrentUser();

      caseService.updateCasesOverview();
      $scope.casesOverviewArrayContainer = caseService.getCasesOverviewArrayContainer();
      caseService.startPolling();

      documentService.startPossibleCaseFoldersPolling();

      console.log('$scope.casesOverviewArrayContainer',$scope.casesOverviewArrayContainer);
      console.log('$scope.taskList',$scope.taskList);
    };

    $scope.initView();

  });
