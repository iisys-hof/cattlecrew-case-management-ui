'use strict';

/**
 * @ngdoc service
 * @name cattlecrewCaseManagementUiApp.documentService
 * @description
 * # documentService
 * Factory in the cattlecrewCaseManagementUiApp.
 */
angular.module('cattlecrewCaseManagementUiApp')
  .factory('documentService', function (nuxeoDocumentService) {
    //
    // local namespace
    //
    var srv = {};

    srv._docService = nuxeoDocumentService;

    //
    // Service logic
    //
    srv.updateCaseDocuments = function(folderId, caseId) {
        srv._docService.updateCaseDocuments(folderId, caseId);
    };


    srv.startPossibleCaseFoldersPolling = function() {
        // no polling yet
//        srv._docService.startPossibleCaseFoldersPolling();
        srv._docService.updatePossibleCaseFolders();
    };

    srv.getPossibleCaseFolders = function() {
        return srv._docService.getPossibleCaseFolders();
    };

    srv.getPossibleCaseFoldersType = function() {
      return srv._docService.getPossibleCaseFoldersType();
    };

    //
    // Public API
    //
    return {
      updateCaseDocuments: function(folderId, caseId) {
        srv.updateCaseDocuments(folderId, caseId);
      },
      startPossibleCaseFoldersPolling: function() {
        srv.startPossibleCaseFoldersPolling();
      },
      getPossibleCaseFolders: function() {
        return srv.getPossibleCaseFolders();
      },
      getPossibleCaseFoldersType: function() {
        return srv.getPossibleCaseFoldersType();
      }
    };
  });
