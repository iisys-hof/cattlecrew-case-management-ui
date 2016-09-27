'use strict';

/**
 * @ngdoc service
 * @name cattlecrewCaseManagementUiApp.nuxeoDocumentService
 * @description
 * # nuxeoDocumentService
 * Factory in the cattlecrewCaseManagementUiApp.
 */
angular.module('cattlecrewCaseManagementUiApp')
  .factory('nuxeoDocumentService', function ($resource, $q, $timeout, camundaConstantsService, camundaCacheService) {
    //
    // local namespace
    //
    var srv = {},
        cache = {};

    srv._nuxeoCaseFolderName = 'Folder';

    srv._baseUrl = camundaConstantsService.nuxeoBaseUrl;
    srv._apiUrl = camundaConstantsService.nuxeoApiBaseUrl;
    srv._urlPartPathBefore = '/nxpath/default';
    srv._urlPartPathAfter = '@view_documents';

    // nuxeo cache:
    cache._possibleCaseFolders = [
      {
        id: 'bc0cc88e-6951-4aba-a118-31c77437ac1d',
        title: 'Briefe'
      },
      {
        id: 'f1ab390c-ebf6-42ca-9dc4-78a240990b7a',
        title: 'Berichte'
      }
    ];

    //
    // Service logic
    //
    srv._resourceDocumentsInFolder = $resource(srv._apiUrl + '/query/NXQL?query=select%20*%20from%20Document%20WHERE%20ecm%3AparentId=%27:folderId%27', {}, {
      get: {method: 'GET', isArray: false}
    });

    srv._resourcePossibleCaseFolders = $resource(srv._apiUrl + '/query/NXQL?query=select%20*%20from%20Document%20where%20ecm%3AprimaryType=%27:folderName%27', {}, {
      get: {method: 'GET', isArray: false}
    });


    srv.updateCaseDocuments = function(folderId, caseId) {
      var variables = srv._resourceDocumentsInFolder.get({folderId: folderId}).$promise;

      $q.all([variables]).then(function(result) {
        var documents = [];
        console.log('nuxeoDocService:', result, 'caseId: '+caseId);

        if(result && result[0].entries) {
          result[0].entries.forEach(function(doc) {
            if(doc.state && doc.state!=='deleted') {
              var path = srv._baseUrl + srv._urlPartPathBefore + doc.path + srv._urlPartPathAfter;
              documents.push({
                documentName: doc.title,
                documentLink: path
              });
            }
          });
        }

        if(caseId) {
//          console.log('nuxeoDocumentService, documents:', documents);
          camundaCacheService.putDocumentsForCase(documents, caseId);
        }
      });
    };

    srv.updatePossibleCaseFolders = function() {
      var foldersPromise = srv._resourcePossibleCaseFolders.get({folderName: srv._nuxeoCaseFolderName}).$promise;

      $q.all([foldersPromise]).then(function(result) {        
        console.log('folders:', result);

        var folders = null;

        if(result && result[0].entries) {
          folders = [];
          result[0].entries.forEach(function(folder) {
            if(folder.type && folder.type === srv._nuxeoCaseFolderName) {
              
              folders.push({
                id: folder.uid,
                title: folder.title
              });
            }
          });
        }

        if(folders) {
          cache._possibleCaseFolders = folders;
        }

        console.log('NEW folders:', folders);

      });
    };

    srv.getPossibleCaseFolders = function() {
      srv.updatePossibleCaseFolders();
      return cache._possibleCaseFolders;
    };
    
    srv.getPossibleCaseFoldersType = function() {
      return srv._nuxeoCaseFolderName;
    };

    //
    // Public API
    //
    return {
      updateCaseDocuments: function(folderId, caseId) {
        srv.updateCaseDocuments(folderId, caseId);
      },
      updatePossibleCaseFolders: function() {
        srv.updatePossibleCaseFolders();
      },
      getPossibleCaseFolders: function() {
        return srv.getPossibleCaseFolders();
      },
      getPossibleCaseFoldersType: function() {
        return srv.getPossibleCaseFoldersType();
      }
    };
  });
