'use strict';

/**
 * @ngdoc service
 * @name cattlecrewCaseManagementUiApp.shindigUserCache
 * @description
 * # shindigUserCache
 * Factory in the cattlecrewCaseManagementUiApp.
 */
angular.module('cattlecrewCaseManagementUiApp')
  .factory('shindigUserCache', function () {
    //
    // local namespace
    //
    var srv = {};

    //
    // object structure
    //
    srv._users = {};

    srv._userTemplate = {
      valid: true,
      data: {
        id: null,
        fullname: null,
        skills: null,
        organizations: []
      }
    };

    /**
     * Service logic
     */

    srv.getUser = function(userId) {
      if(!srv._users[userId]){
        srv.initUserInCache(userId);
      }
      if(srv.isValid(userId)){
        return srv._users[userId];
      }
    };

    //clears user if invalid or pushes new user into cache if wasn't present yet
    srv.initUserInCache = function(userId) {
      if(!srv._users[userId] || !srv._users[userId].valid){
        srv._users[userId] = angular.copy(srv._userTemplate);
        srv._users[userId].data.id = userId;
      }
    };

    srv.isValid = function(userId) {
      if(srv._users[userId]){
        return srv._users[userId].valid;
      } else {
        return false;
      }
    };

    srv.putNamesForUser = function(fullname, userId) {
      srv.initUserInCache(userId);

      srv._users[userId].data.fullname = fullname;
      srv._users[userId].valid = true;
    };


    //
    // Public API
    //
    return {
      getUser: function(userId) {
        return srv.getUser(userId);
      },
      putNamesForUser: function(fullname, userId) {
        return srv.putNamesForUser(fullname, userId);
      }
    };
  });
