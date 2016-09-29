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

    srv._resourceUserSkills = $resource(srv._baseUrl + '/skills/:userId', {}, {
      get: {method: 'GET', isArray: false}
    });



    srv.loadSingleUser = function(userId) {
        return srv._resourceSingleUser.get({userId: userId}).$promise;
    };

    srv.loadUserSkills = function(userId) {
        return srv._resourceUserSkills.get({userId: userId}).$promise;
    };

    srv.updateSingleUser = function(userId) {
        if(userId) {
            // name:
            srv.loadSingleUser(userId).then(function(result) {
                var fullname = result.entry.displayName,
                    thumbnailUrl = result.entry.thumbnailUrl;

                shindigUserCache.putDetailsForUser(fullname, thumbnailUrl, userId);
            });
            // skills:
            srv.loadUserSkills(userId).then(function(result) {
                if(result && result.list) {
                    var skills = [];
                    result.list.forEach(function(element) {
                      skills.push( element.name );
                    });

                    shindigUserCache.putSkillsForUser(skills, userId);
                }
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
