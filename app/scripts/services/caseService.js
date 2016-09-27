'use strict';

/**
 * @ngdoc service
 * @name cattlecrewCaseManagementUiApp.caseService
 * @description
 * # caseService
 * Factory in the cattlecrewCaseManagementUiApp.
 */
angular.module('cattlecrewCaseManagementUiApp')
  .factory('caseService', function (camundaCaseService, camundaCacheService, camundaDmnService, userService) {
    //
    // local namespace
    //
    var srv = {};

    srv._caseService = camundaCaseService;
    srv._cache = camundaCacheService;
    srv._dmnService = camundaDmnService;

    srv._userService = userService;

    var vars = {};
    vars._caseFileId = 'caseFileId';
    vars._caseFileName = 'caseFileName';

    //
    // Service logic
    //
    srv.updateCasesOverview = function() {
      srv._caseService.updateCasesOverview();
    };

    srv.getCasesOverviewArrayContainer = function() {
      return srv._cache.getCasesOverviewArrayContainer();
    };

    srv.getEntireCase = function(entireCaseId) {
      srv._dmnService.updateDecisions(entireCaseId);
      return srv._caseService.getEntireCase(entireCaseId);
    };

    srv.getCase = function(caseId) {
      return srv._cache.getCase(caseId);
    };

    srv.updateTasklist = function() {
      var assignee = srv._userService.getLoggedInUser();

      if(assignee && assignee.data && assignee.data.id) {
        srv._caseService.updateTasklistForAssignee( assignee.data.id );
      }
    };

    srv.getTasklistForCurrentUser = function() {
      return srv._cache.getTasklistContainer();
    };

    srv.startActivity = function(caseId, activityDefinitionId) {
      return srv._caseService.startActivity(caseId, activityDefinitionId);
    };

    srv.startPolling = function(caseId) {
      srv._caseService.startPolling(caseId);
    };

    srv.pausePolling = function() {
      srv._caseService.pausePolling();
    };

    srv.stopPolling = function() {
      srv._caseService.stopPolling();
    };

    srv.pollingActive = function() {
      return srv._caseService.pollingActive();
    };

    srv.createCaseInstance = function(key, requestData) {
      srv._caseService.createCaseInstance(key, requestData);
    };

    srv.updateCaseDefinitions = function() {
      srv._caseService.updateCaseDefinitions();
    };

    srv.getCaseDefinitionsArrayContainer = function() {
      return srv._cache.getCaseDefinitionsArrayContainer();
    };

    // tasks:

    srv.claimTask = function(taskId, userId) {
      srv._caseService.claimTask(taskId, userId);
    };

    srv.assignTask = function(taskId, userId) {
      srv._caseService.assignTask(taskId, userId);
    };

    srv.unclaimTask = function(taskId) {
      srv._caseService.unclaimTask(taskId);
    };

    // variables:

    srv.setCaseVariable = function(caseId, variable, variableValue) {
      srv._caseService.setCaseVariable(caseId, variable, variableValue);
    };

    srv._setVarCaseFileId = function(caseId, fileId) {
      srv.setCaseVariable(caseId, vars._caseFileId, fileId);
    };

    srv._setVarCaseFileName = function(caseId, fileName) {
      srv.setCaseVariable(caseId, vars._caseFileName, fileName);
    };

    srv.putDocumentFolderForCase = function(caseId, folderId, folderName) {
      srv._cache.putDocumentFolderForCase(folderId, folderName, caseId);
      srv._setVarCaseFileId(caseId, folderId);
      srv._setVarCaseFileName(caseId, folderName);
    };

    srv.clearDocumentsForCase = function(caseId) {
      srv._cache.clearDocumentsForCase(caseId);
      srv._setVarCaseFileId(caseId, '');
      srv._setVarCaseFileName(caseId, '');
    };

    //
    // Public API
    //
    return {
      updateCasesOverview: function() {
        srv.updateCasesOverview();
      },
      getCasesOverviewArrayContainer: function() {
        return srv.getCasesOverviewArrayContainer();
      },
      updateCaseDefinitions: function() {
        srv.updateCaseDefinitions();
      },
      getCaseDefinitionsArrayContainer: function() {
        return srv.getCaseDefinitionsArrayContainer();
      },
      startPolling: function(caseId) {
        srv.startPolling(caseId);
      },
      pausePolling: function() {
        srv.pausePolling();
      },
      stopPolling: function() {
        srv.stopPolling();
      },
      pollingActive: function() {
        return srv.pollingActive();
      },
      getCase: function(caseId) {
        return srv.getCase(caseId);
      },
      getEntireCase: function(entireCaseID) {
        return srv.getEntireCase(entireCaseID);
      },
      updateTasklist: function() {
        srv.updateTasklist();
      },
      getTasklistForCurrentUser: function() {
        return srv.getTasklistForCurrentUser();
      },
      createCaseInstance: function(key, requestData) {
        return srv.createCaseInstance(key, requestData);
      },
      startActivity: function(caseId, activityDefinitionId, startActivityComment) {
        return srv.startActivity(caseId, activityDefinitionId, startActivityComment);
      },
      claimTask: function(taskId, userId) {
        return srv.claimTask(taskId, userId);
      },
      assignTask: function(taskId, userId) {
        return srv.assignTask(taskId, userId);
      },
      unclaimTask: function(taskId) {
        return srv.unclaimTask(taskId);
      },
      setCaseVariable: function(caseId, variable, variableValue) {
        return srv.setCaseVariable(caseId, variable, variableValue);
      },
      putDocumentFolderForCase: function(caseId, folderId, folderName) {
        srv.putDocumentFolderForCase(caseId, folderId, folderName);
      },
      clearDocumentsForCase: function(caseId) {
        srv.clearDocumentsForCase(caseId);
      }
    };
  });
