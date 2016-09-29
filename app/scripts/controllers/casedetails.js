'use strict';

/**
 * @ngdoc function
 * @name cattlecrewCaseManagementUiApp.controller:CaseDetailsCtrl
 * @description
 * # CaseDetailsCtrl
 * Controller of the cattlecrewCaseManagementUiApp
 */
angular.module('cattlecrewCaseManagementUiApp')
  .controller('CaseDetailsCtrl', function ($scope, $location, $routeParams, caseService, userService, documentService, tabbingService, $window, localizationService, $locale, $route) {

    $scope.setLocale = function(id){
      $locale.id = id;
    };

    $scope.getString = function(key){
      return localizationService.getString(key);
    };

    $scope.initView = function(caseId) {

      $scope.caseId = caseId;
      caseService.getEntireCase($routeParams.caseId);

      //getting case object reference from cache. it might later then be filled by the
      // case service if this hasn't happened yet
      $scope.case = tabbingService.createNewTabByParentCaseId($routeParams.caseId);

      $scope.urlForUserAutocomplete = userService.getUrlForUserAutocomplete();
      $scope.isLoading = false;

      $scope.possibleCaseFolders = documentService.getPossibleCaseFolders();
      $scope.possibleCaseFoldersType = documentService.getPossibleCaseFoldersType();

      $scope.pollingActive = caseService.pollingActive();

      console.log('CaseDetailsCtrl', $scope.case);
    };

    $scope.initView($routeParams.caseId);

    $scope.startActivity = function(selectedActivity) {
      console.log(selectedActivity);
      caseService.startActivity(selectedActivity.caseId, selectedActivity.definitionId);
    };

    $scope.claimTask = function(taskId) {
      var loggedInUser = userService.getLoggedInUser();

      if(loggedInUser && loggedInUser.data && loggedInUser.data.id) {
        var userId = userService.getLoggedInUser().data.id;
        caseService.claimTask(taskId, userId);
        $scope.isLoading = true;        
        setTimeout(function(){
          $scope.isLoading = false;
          $route.reload();
        }, 1000);
      }
    };

    $scope.selectedAssignee = function(selected, taskId) {
      if (selected) {
        $scope.isLoading = true;

        var assigneeId = null;
        try {
          assigneeId = selected.originalObject.id;
        } catch(err) {
          console.error(err.message);
        }

        if(assigneeId) {
          console.log('assigneeId', assigneeId);
          caseService.assignTask(taskId, assigneeId);
          setTimeout(function(){
            $scope.isLoading = false;
            $route.reload();
          }, 1000);
        } else {
          console.log('Error: Could not fetch assignee.');
          $scope.isLoading = false;
          $route.reload();
        }
        $scope.startPolling();

      } else {
        // console.log('cleared');
      }
    };

    $scope.assignTask = function($event, taskId) { 
      $scope.isLoading = true;

      setTimeout(function(){
        var assignee = null;

        try {
          assignee = $event.currentTarget.children.assignee.value;
        } catch(err) {
          console.error(err.message);
        }

        if(assignee) {
          caseService.assignTask(taskId, assignee);
          setTimeout(function(){
            $scope.isLoading = false;
            $route.reload();
          }, 1000);
        } else {
          console.log('Error: Could not fetch assignee.');
          $scope.isLoading = false;
          $route.reload();
        }
        $scope.startPolling();
      }, 500);
    };

    $scope.unclaimTask = function(taskId) {
      $scope.isLoading = true;
      caseService.unclaimTask(taskId);
      setTimeout(function(){
        $scope.isLoading = false;
        $route.reload();
      }, 1000);
    };

    $scope.startPolling = function() {
      caseService.startPolling($scope.caseId);
      $scope.pollingActive = true;
    };

    $scope.pausePolling = function() {
      caseService.pausePolling();
    };

    $scope.stopPolling = function() {
      caseService.stopPolling();
      $scope.pollingActive = false;
    };

    $scope.openURL = function(url) {
      $window.open(url);
    };

    $scope.specifyDocumentFolder = function(folderId, folderName) {
      $scope.isLoading = true;
      caseService.putDocumentFolderForCase($scope.caseId, folderId, folderName);
      setTimeout(function(){
        $scope.isLoading = false;
        $route.reload();
      }, 1000);
    };

    $scope.disconnectDocumentFolder = function() {
      $scope.isLoading = true;
      caseService.clearDocumentsForCase($scope.caseId);
      setTimeout(function(){
        $scope.isLoading = false;
        $route.reload();
      }, 1000);
    };

});
