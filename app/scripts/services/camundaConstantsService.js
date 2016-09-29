'use strict';

/**
 * @ngdoc service
 * @name cattlecrewCaseManagementUiApp.camundaConstantsService
 * @description
 * # camundaConstantsService
 * Constant in the cattlecrewCaseManagementUiApp.
 */
angular.module('cattlecrewCaseManagementUiApp')
  .constant('camundaConstantsService', {
    baseUrl : 'https://broton.sc-hub.de/engine-rest',
    modelUrl : 'https://broton.sc-hub.de/cmmnjs/?caseId=',
    nuxeoBaseUrl: 'https://broton.sc-hub.de/nuxeo',
    nuxeoApiBaseUrl: 'https://broton.sc-hub.de/nuxeo/api/v1',
    serverPollingDelay : 10000,
    serverPollingPauseDelay : 30000,
    shindigUrl : 'https://broton.sc-hub.de/shindig/social/rest',
    shindigUrlForUserAutocomplete : 'https://broton.sc-hub.de/shindig/social/rest/user?fields=id,name,displayName&filterBy=displayName&filterOp=contains&filterValue=',
    varCaseFileId : 'caseFileId',
    varCaseFileURL : 'caseFileURL'
  });
