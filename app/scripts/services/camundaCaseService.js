'use strict';

/**
 * @ngdoc service
 * @name cattlecrewCaseManagementUiApp.camundaCaseService
 * @description
 * # camundaCaseService
 * Factory in the cattlecrewCaseManagementUiApp.
 */
angular.module('cattlecrewCaseManagementUiApp')
  .factory('camundaCaseService', function ($resource, $q, $timeout, camundaConstantsService, camundaCacheService, utilService, userService) {
    //
    // local namespace
    //
    var srv = {};

    srv._baseUrl = camundaConstantsService.baseUrl;

    // parameters for polling data from server
    srv._serverPollingDelay = camundaConstantsService.serverPollingDelay;
    srv._serverPollingPauseDelay = camundaConstantsService.serverPollingPauseDelay;
    srv._pollingActive = false;
    srv._lastRequestedCaseId = undefined;

    //
    // Service logic
    //
    srv._resourceCases = $resource(srv._baseUrl + '/history/case-instance/:caseId');

    srv._resourceCaseDefinitions = $resource(srv._baseUrl + '/case-definition/:caseDefinitionId');

    srv._resourceLastAction = $resource(srv._baseUrl + '/history/user-operation?sortBy=timestamp&sortOrder=desc&maxResults=1&caseInstanceId=:caseId');

    srv._resourceCaseExecutions = $resource(srv._baseUrl + '/history/case-activity-instance?caseInstanceId=:caseId', {}, {
      get: {method: 'GET', isArray: true}
    });

    srv._resourceChildren = $resource(srv._baseUrl + '/history/case-instance?superCaseInstanceId=:caseId', {}, {
      get: {method: 'GET', isArray: true}
    });

    srv._resourceParent = $resource(srv._baseUrl + '/history/case-instance?subCaseInstanceId=:caseId', {}, {
      get: {method: 'GET', isArray: true}
    });

    srv._resourceEnabledTasks = $resource(srv._baseUrl + '/history/case-activity-instance?enabled=true&caseActivityType=:type&caseInstanceId=:caseId', {}, {
      get: {method: 'GET', isArray: true}
    });

    srv._resourceHumanTasks = $resource(srv._baseUrl + '/history/task?caseInstanceId=:caseId', {}, {
      get: {method: 'GET', isArray: true}
    });

    srv._resourceActiveTasks = $resource(srv._baseUrl + '/history/case-activity-instance?active=true&caseInstanceId=:caseId', {}, {
      get: {method: 'GET', isArray: true}
    });

    srv._resourceCompletedTasks = $resource(srv._baseUrl + '/history/case-activity-instance?completed=true&caseInstanceId=:caseId', {}, {
      get: {method: 'GET', isArray: true}
    });

    srv._resourceMilestonesHistory = $resource(srv._baseUrl + '/history/case-activity-instance?caseActivityType=milestone&caseInstanceId=:caseId', {}, {
      get: {method: 'GET', isArray: true}
    });

    srv._resourceAllAssigneeTasks = $resource(srv._baseUrl + '/history/task?taskAssignee=:userId&unfinished=true', {}, {
      get: {method: 'GET', isArray: true}
    });

    srv._resourceActivity = $resource(srv._baseUrl + '/case-execution/:activityId/manual-start', {}, {
      activate: {method: 'POST', isArray: true}
    });

    srv._resourceNewInstance = $resource(srv._baseUrl + '/case-definition/key/:key/create', {}, {
      create: {method: 'POST'}
    });

    srv._resourceClaimTask = $resource(srv._baseUrl + '/task/:id/claim', {}, {
      claim: {method: 'POST'}
    });

    srv._resourceAssignTask = $resource(srv._baseUrl + '/task/:id/assignee', {}, {
      assign: {method: 'POST'}
    });

    srv._resourceUnclaimTask = $resource(srv._baseUrl + '/task/:id/unclaim', {}, {
      unclaim: {method: 'POST'}
    });

    srv.loadCases = function() {
      return srv._resourceCases.query().$promise;
    };

    srv.loadLastActionFor = function(cases) {
      var promises = cases.map(function(caseInstance) {
        return $q(function(resolve, reject) {
          srv._resourceLastAction.query({caseId: caseInstance.id}, function(result) {
            result.every(function(item) { // FIXME lastEditedString is only set on last item
              caseInstance.lastEditedString = utilService.calcSmallestTimeElementDifference(new Date(item.timestamp), new Date());
            });
            resolve(caseInstance);
          }, function(error) {
            console.log('An error occured during function \'loadLastActionFor\'!', error);
            reject(caseInstance);
          });
        });
      });
      return $q.all(promises);
    };

    srv.updateCasesOverview = function() {
      srv.loadCases().then(function(firstResult) {
        return srv.loadLastActionFor(firstResult);
      }).then(function(secondResult) {
        camundaCacheService.putValuesInCache(secondResult);
      });
    };

    srv.getEntireCase = function(caseId) {
      srv._lastRequestedCaseId = caseId;

      srv._resourceCaseExecutions.get({caseId: caseId}, function(caseExecutions) {
        camundaCacheService.putMilestonesForCase(caseExecutions.filter(srv.isMilestone), caseId);
      });

      srv.loadChildren(caseId);
      srv.loadParent(caseId);

      srv.enrichWithActivities(caseId);
      srv.enrichWithHumanTasks(caseId);
      srv.enrichWithDetailsInformation(caseId);

      var promise1 = srv.enrichForAuditTrail(caseId);
      var promise2 = srv.enrichWithMilestonesAuditInformation(caseId);

      $q.all([promise1, promise2]).then(function(result) {
        camundaCacheService.clearAuditTrail(caseId);
        camundaCacheService.putAuditInformationForCase(result[0], caseId);
        camundaCacheService.putMilestoneAuditInformationForCase(result[1], caseId);
      });
    };

    srv.enrichWithActivities = function(caseId) {
      var humanTasks = srv._resourceEnabledTasks.get({caseId: caseId, type: 'humanTask'}).$promise;
      var processTasks = srv._resourceEnabledTasks.get({caseId: caseId, type: 'processTask'}).$promise;
      var caseTasks = srv._resourceEnabledTasks.get({caseId: caseId, type: 'caseTask'}).$promise;

      $q.all([humanTasks, processTasks, caseTasks]).then(function(result) {
        var activities = [];
        result.forEach(function(element) {
          Array.prototype.push.apply(activities, element);
        });

        camundaCacheService.putActivitiesForCase(activities, caseId);
      });
    };

    // iisys:
    srv.enrichWithHumanTasks = function(caseId) {
      var humanTasks = srv._resourceHumanTasks.get({caseId: caseId}).$promise;

      $q.all([humanTasks]).then(function(result) {
        var tasks = [];

        result.forEach(function(element) {
          Array.prototype.push.apply(tasks, element);
        });

        tasks.forEach(function(task) {
          if(task.assignee) {
            task.assignee = userService.getUserById(task.assignee);
          }
        });

        camundaCacheService.putTasksForCase(tasks, caseId);
      });
    };

    srv.updateTasklistForAssignee = function(assigneeUserId) {
      srv._resourceAllAssigneeTasks.get({userId: assigneeUserId}, function(tasks) {
        var caseTasklist = [];

        tasks.forEach(function(task) {
          if(task.caseInstanceId) {
            if(task.assignee) {
              task.assignee = userService.getUserById(task.assignee);
            }

            caseTasklist.push(task);
          }
        });
        camundaCacheService.putTasklistinCache(caseTasklist);
      });
    };

    // iisys END

     srv.enrichForAuditTrail = function(caseId) {
      var activeTasksResult = srv._resourceActiveTasks.get({caseId: caseId}).$promise;
      var completedTasksResult = srv._resourceCompletedTasks.get({caseId: caseId}).$promise;

      return $q(function(resolve) {
        $q.all([activeTasksResult, completedTasksResult]).then(function(result) {
          var activityEvent = [];

          result.forEach(function(element) {
            Array.prototype.push.apply(activityEvent, element.filter(srv.isTask));
          });

          //camundaCacheService.putAuditInformationForCase(activityEvent, caseId);
          resolve(activityEvent);
        });
      });
    };

    srv.enrichWithMilestonesAuditInformation = function(caseId) {
      return srv._resourceMilestonesHistory.get({caseId: caseId}).$promise;
    };

    srv.enrichWithDetailsInformation = function(caseId) {
      srv._resourceCases.get({caseId: caseId}, function(result) {
        camundaCacheService.putDetailsInformationForCase(result, caseId);
      });
    };

    srv.isMilestone = function(execution) {
      return execution.caseActivityType === 'milestone';
    };

    srv.isTask = function(element) {
      return element.caseActivityType === 'humanTask' ||
        element.caseActivityType === 'processTask' ||
        element.caseActivityType === 'caseTask';
    };

    srv.loadChildren = function(caseId) {
      srv._resourceChildren.get({caseId: caseId}, function(result) {
        camundaCacheService.putChildrenForCase(result, caseId);
      });
    };

    srv.loadParent = function(caseId) {
      srv._resourceParent.get({caseId: caseId}, function(result) {
        if (result.length > 0) {
          camundaCacheService.putParentForCase(result[0], caseId);
        }
      });
    };

    srv.pollDataFromServer = function() {
      if (srv._pollingActive) {
        srv.updateCasesOverview();

        var assignee = userService.getLoggedInUser();
        if(assignee && assignee.data && assignee.data.id) {
          srv.updateTasklistForAssignee( assignee.data.id );
        }

        if (srv._lastRequestedCaseId) {
          srv.getEntireCase(srv._lastRequestedCaseId);
        }
      }

      $timeout(srv.pollDataFromServer, srv._serverPollingDelay);
    };

    srv.startPolling = function(caseId) {
      srv._lastRequestedCaseId = caseId;
      srv._pollingActive = true;
      srv.pollDataFromServer();
    };

    srv.pausePolling = function() {
      if(srv._pollingActive) {
        console.log('Pause polling...');
        srv._stopPolling();

        $timeout(function() {
            if(!srv._pollingActive) {
              console.log('Start polling again.');
              srv.startPolling(srv._lastRequestedCaseId);
            }
          }, srv._serverPollingPauseDelay);
      }
    };

    srv._stopPolling = function() {
      srv._pollingActive = false;
    };

    srv.loadCaseDefinitions = function() {
      return srv._resourceCaseDefinitions.query().$promise;
    };

    srv.updateCaseDefinitions = function() {
      srv.loadCaseDefinitions().then(function(result) {
        camundaCacheService.putCaseDefinitionsInCache(result);
      });
    };

    srv.createCaseInstance = function(key, requestData) {
      srv._resourceNewInstance.create({key: key}, requestData, function(result) {
        console.log('New case instance created: ' + result);
      }, function(error) {
        console.log('Error occurred during creating a new case instance: ' + error);
      });
    };

    srv.startActivity = function(caseId, activityDefinitionId) {
      srv._resourceActivity.activate({activityId: activityDefinitionId}, {}, function(result) {
        console.log('New activity started: ' + result);
      }, function(error) {
        console.log('Error occurred during starting a new activity: ' + error);
      });
    };

    srv.claimTask = function(taskId, userId) {
      srv._resourceClaimTask.claim({id: taskId}, {userId: userId}, function(result) {
        console.log('Task successfully claimed. ' + result);
      }, function(error) {
        console.log('Error occurred during claiming a task: ' + error);
      });
    };

    srv.assignTask = function(taskId, userId) {
      srv._resourceAssignTask.assign({id: taskId}, {userId: userId}, function(result) {
        console.log('Task successfully assigned to '+userId+'. ' + result);
      }, function(error) {
        console.log('Error occurred during assigning a task: ' + error);
      });
    };

    srv.unclaimTask = function(taskId) {
      srv._resourceUnclaimTask.unclaim({id: taskId}, {}, function(result) {
        console.log('Task successfully unclaimed. ' + result);
      }, function(error) {
        console.log('Error occurred during unclaiming task: ' + error);
      });
    };

    //
    // Public API
    //
    return {
      updateCasesOverview: function() {
        srv.updateCasesOverview();
      },
      updateTasklistForAssignee: function(assigneeUserId) {
        return srv.updateTasklistForAssignee(assigneeUserId);
      },
      updateCaseDefinitions: function() {
        srv.updateCaseDefinitions();
      },
      startPolling: function(caseId) {
        srv.startPolling(caseId);
      },
      pausePolling: function() {
        srv.pausePolling();
      },
      stopPolling: function() {
        srv._stopPolling();
      },
      pollingActive: function() {
        return srv._pollingActive;
      },
      getEntireCase: function(caseId) {
        return srv.getEntireCase(caseId);
      },
      createCaseInstance: function(key, requestData) {
        srv.createCaseInstance(key, requestData);
      },
      startActivity: function(caseId, activityDefinitionId) {
        srv.startActivity(caseId, activityDefinitionId);
      },
      claimTask: function(taskId, userId) {
        srv.claimTask(taskId, userId);
      },
      assignTask: function(taskId, userId) {
        srv.assignTask(taskId, userId);
      },
      unclaimTask: function(taskId) {
        srv.unclaimTask(taskId);
      }
    };
  });
