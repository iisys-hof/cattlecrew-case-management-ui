'use strict';

/**
 * @ngdoc service
 * @name cattlecrewCaseManagementUiApp.localizationService
 * @description
 * # localizationService
 * Factory in the cattlecrewCaseManagementUiApp.
 */
angular.module('cattlecrewCaseManagementUiApp')
  .factory('localizationService', function ($locale) {
    //
    // local namespace
    //
    var srv = {};

    /*
     * Returns the appropiate localized string for a given key and current locale
     */

    srv.res =  {
    	'appName': {
	     'de-de': 'CattleCrew Case Management UI',
	     'en-us': 'CattleCrew Case Mangement UI'
	},
     	'dashboard':{
	     'de-de': 'Dashboard',
	     'en-us': 'Dashboard'
    },
     	'Case Dashboard':{
	     'de-de': 'Fall Dashboard',
	     'en-us': 'Case Dashboard'
    },
	'New Case':{
		'de-de': 'Neuer Fall',
		'en-us': 'New Case'
	},
	'About':{
		'de-de': 'Über',
		'en-us': 'About'
	},
	'dashboardDesc':{
		'de-de': 'Übersicht über alle vorhandene Fälle',
		'en-us': 'Displaying all existing cases'
	},
	'caseInstances':{
		'de-de': 'Fall-Instanzen',
		'en-us': 'Case Instances'
	},
	'caseDefinitions':{
		'de-de': 'Fall-Definitionen',
		'en-us': 'Case Definitions'
	},
	'search':{
		'de-de': 'Suche',
		'en-us': 'Search'
	},
	'filterCase':{
		'de-de': 'Filter Fälle',
		'en-us': 'Filter Case'
	},
	'filterByCase':{
		'de-de': 'Filter nach Fall',
		'en-us': 'Filter by Case'
	},
	'businessId':{
		'de-de': 'Geschäfts-ID',
		'en-us': 'Business ID'
	},
	'case':{
		'de-de': 'Fall',
		'en-us': 'Case'
	},
	'technicalId':{
		'de-de': 'Technische ID',
		'en-us': 'Technical ID'
	},
	'created':{
		'de-de': 'Erstellt am',
		'en-us': 'Created'
	},
	'lastEdited':{
		'de-de': 'Zuletzt bearbeitet am',
		'en-us': 'Last Edited'
	},
	'status': {
		'de-de': 'Status',
		'en-us': 'Status'
	},
	'casesAreDisplayed':{
		'de-de': 'Fälle werden angezeigt',
		'en-us': 'Cases are displayed'
	},
	'casesAreDeployed':{
		'de-de': 'Fälle sind veröffentlicht',
		'en-us': 'Cases are deployed'
	},
	'fromTheOptizTeam':{
		'de-de': 'von dem OPITZ CONSULTING Team',
		'en-us': 'from the OPITZ CONSULTING TEAM'
	},
	'createNewCase':{
		'de-de': 'neuen Fall erstellen',
		'en-us': 'Create and initialize a new case'
	},
	'newCase':{
		'de-de': 'Neuer Fall',
		'en-us': 'New Case'
	},
	'selectAcase':{
		'de-de': 'Fallauswahl',
		'en-us': 'Select a case'
	},
	'createNewInstanceOf':{
		'de-de': 'Erzeuge eine neue Instanz von',
		'en-us': 'Create new instance of'
	},
	'inVersion':{
		'de-de': 'In Version',
		'en-us': 'in version'
	},
	'addVariable':{
		'de-de': 'Variable hinzufügen',
		'en-us': 'Add variable'
	},
	'backToOverview':{
		'de-de': 'Zurück zur Übersicht',
		'en-us': 'Back to overview'
	},
	'reset':{
		'de-de': 'Zurücksetzen',
		'en-us': 'Reset'
	},
	'create':{
		'de-de': 'Erstellen',
		'en-us': 'Create'
	},
	'value':{
		'de-de': 'Wert',
		'en-us': 'Value'
	},
	'select':{
		'de-de': 'Auswahl',
		'en-us': 'select'
	},
	'name':{
		'de-de': 'Name',
		'en-us': 'Name'
	},
	'type':{
		'de-de': 'Type',
		'en-us': 'Type'
	},
	'businessKey':{
		'de-de': 'Business Key',
		'en-us': 'Business Key'
	},
	// schub:
	'actions':{
		'de-de': 'Aktionen',
		'en-us': 'Actions'
	},
	'allCases':{
		'de-de': 'Alle Fälle',
		'en-us': 'All Cases'
	},
	'allTasks':{
		'de-de': 'Alle Aufgaben',
		'en-us': 'All Tasks'
	},
	'assignee':{
		'de-de': 'Beauftragter',
		'en-us': 'Assignee'
	},
	'caseDetails':{
		'de-de': 'Fall Details',
		'en-us': 'Case Details'
	},
	'completed':{
		'de-de': 'fertiggestellt',
		'en-us': 'completed'
	},
	'done':{
		'de-de': 'Fertig',
		'en-us': 'Done'
	},
	'due':{
		'de-de': 'Fälligkeit',
		'en-us': 'Due'
	},
	'end':{
		'de-de': 'Ende',
		'en-us': 'End'
	},
	'filterDone':{
		'de-de': 'Filter Fertig',
		'en-us': 'Filter Done'
	},
	'latestVersion':{
		'de-de': 'Aktuellste Version',
		'en-us': 'Latest Version'
	},
	'myCaseInstances':{
		'de-de': 'Meine Fälle',
		'en-us': 'My Case Instances'
	},
	'myCases':{
		'de-de': 'Meine Fälle',
		'en-us': 'My Cases'
	},
	'myCaseTasks':{
		'de-de': 'Meine Fall-Aufgaben',
		'en-us': 'My Case Tasks'
	},
	'open':{
		'de-de': 'offen',
		'en-us': 'open'
	},
	'runningInstances':{
		'de-de': 'Laufende Instanzen',
		'en-us': 'Running Instances'
	},
	'started':{
		'de-de': 'Gestartet',
		'en-us': 'Started'
	},
	'tasklist':{
		'de-de': 'Aufgaben',
		'en-us': 'Tasklist'
	},
	'tasks':{
		'de-de': 'Aufgaben',
		'en-us': 'Tasks'
	}
    };

    //
    // Public API
    //
    return {
      getString: function (key) {
        return srv.res[key][$locale.id ];
      }
    };
   });
