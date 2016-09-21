'use strict';

/**
 * @ngdoc service
 * @name cattlecrewCaseManagementUiApp.userService
 * @description
 * # userService
 * Factory in the cattlecrewCaseManagementUiApp.
 */
angular.module('cattlecrewCaseManagementUiApp')
  .factory('userService', function (shindigUserService) {
    //
    // local namespace
    //
    var srv = {};

    srv._userService = shindigUserService;

    //
    // Service logic
    //
    srv.getUserById = function(userId) {
      var user = srv._userService.getUserById(userId);
      
      return user;
    };

    srv.getUserFullnameById = function(userId) {
      var user = srv._userService.getUserById(userId);
      
      if(user && user.data && user.data.fullname) {
        return user.data.fullname;
      } else {
        return userId;
      }
    };

    srv.getUrlForUserAutocomplete = function() {
        return srv._userService.getUrlForUserAutocomplete();
    };

    srv.getLoggedInUser = function() {
        // TODO: get userId from CAS (or somewhere):
        return {
          valid: true,
          data: {
            id: 'baerbel',
            fullname: 'Bärbel Bitte',
            skills: null,
            organizations: []
          }
        };
    };

    // Demo data for angucomplete user autocompletion:
    srv.demoUsers = [
        {id: 'anna', displayName: 'Anna Alster'},
        {id: 'john', displayName: 'John Doe'},
        {id: 'josef', displayName: 'Josef Jeep'},
        {id: 'josh', displayName: 'Josh Smith'}
    ];

    srv.getDemoUsers = function() {
        return srv.demoUsers;
    };

    //
    // Public API
    //
    return {
      getLoggedInUser: function() {
        return srv.getLoggedInUser();
      },
      getUserById: function(userId) {
        return srv.getUserById(userId);
      },
      getUserFullnameById: function(userId) {
        return srv.getUserFullnameById(userId);
      },
      getUrlForUserAutocomplete: function() {
        return srv.getUrlForUserAutocomplete();
      },
      getDemoUsers: function() {
        return srv.getDemoUsers();
      }
    };
});
