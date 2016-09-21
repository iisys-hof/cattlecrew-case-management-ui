'use strict';

/**
 * @ngdoc service
 * @name cattlecrewCaseManagementUiApp.shindigUserService
 * @description
 * # shindigUserService
 * Factory in the cattlecrewCaseManagementUiApp.
 */
angular.module('cattlecrewCaseManagementUiApp')
  .factory('shindigUserService', function ($resource, $q, $timeout, camundaConstantsService, shindigUserCache) {
    //
    // local namespace
    //
    var srv = {};

    srv._baseUrl = camundaConstantsService.shindigUrl;
    srv._urlForUserAutocomplete = camundaConstantsService.shindigUrlForUserAutocomplete;

    // parameters for polling data from server
    srv._serverPollingDelay = camundaConstantsService.serverPollingDelay;

    //
    // Service logic
    //
    srv._resourceAllUsers = $resource(srv._baseUrl + '/user/', {}, {
      get: {method: 'GET', isArray: false}
    });

    srv._resourceSingleUser = $resource(srv._baseUrl + '/people/:userId', {}, {
      get: {method: 'GET', isArray: false}
    });

    /*
    srv.loadAllUsers = function() {
    	return srv._resourceAllUsers.query().$promise;
    };
    */

    srv.loadSingleUser = function(userId) {
        return srv._resourceSingleUser.get({userId: userId}).$promise;
    };

    srv.updateSingleUser = function(userId) {
        if(userId) {
            srv.loadSingleUser(userId).then(function(result) {
                var fullname = result.entry.displayName;

                shindigUserCache.putNamesForUser(fullname, userId);
            });
        }
    };

    srv.getUserById = function(userId) {
        var user = shindigUserCache.getUser(userId);

        if(!user.data || !user.data.name) {
            srv.updateSingleUser(userId);
        }

        return user;
    };

    srv.getUrlForUserAutocomplete = function() {
        return srv._urlForUserAutocomplete;
    };


    //
    // Public API
    //
    return {
      getUserById: function(userId) {
        return srv.getUserById(userId);
      },
      getUrlForUserAutocomplete: function() {
        return srv.getUrlForUserAutocomplete();
      }
    };
});
