'use strict';

/**
 * @ngdoc overview
 * @name cattlecrewCaseManagementUiApp
 * @description
 * # cattlecrewCaseManagementUiApp
 *
 * Main module of the application.
 */
angular
  .module('cattlecrewCaseManagementUiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angucomplete-alt'
  ])
  .config(function ($routeProvider/**, $compileProvider */) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard'
      })
      .when('/tasklist', {
        templateUrl: 'views/tasklist.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard'
      })
      .when('/caseinstances', {
        templateUrl: 'views/caseinstances.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard'
      })
      .when('/casedefinitions', {
        templateUrl: 'views/casedefinitions.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard'
      })
      .when('/newcase', {
        templateUrl: 'views/newcase.html',
        controller: 'NewCaseCtrl',
        controllerAs: 'newcase'
      })
      .when('/casetasks/:caseId', {
        templateUrl: 'views/casetasks.html',
        controller: 'CaseDetailsCtrl',
        controllerAs: 'casedetails'
      })
      .when('/casedetails/:caseId', {
        templateUrl: 'views/casedetails.html',
        controller: 'CaseDetailsCtrl',
        controllerAs: 'casedetails'
      })
      .when('/casemodel/:caseId', {
        templateUrl: 'views/casemodel.html',
        controller: 'CaseModelCtrl',
        controllerAs: 'casemodel'
      })
      .when('/casedecisionhistory/:caseId', {
        templateUrl: 'views/casedecisionhistory.html',
        controller: 'CaseDecisionHistoryCtrl',
        controllerAs: 'casedecisionhistory'
      })
      .when('/caserawdata/:caseId', {
        templateUrl: 'views/caserawdata.html',
        controller: 'CaseRawDataCtrl',
        controllerAs: 'caserawdata'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
