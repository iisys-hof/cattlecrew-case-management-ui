'use strict';

/**
 * @ngdoc function
 * @name cattlecrewCaseManagementUiApp.directives:jquerydirectives
 * @description
 * # showInput
 * Directive of the cattlecrewCaseManagementUiApp
 */
angular.module('cattlecrewCaseManagementUiApp')
  .directive('showInput', function() {

  /* jshint ignore:start */
  return {

  	// This means the directive can be used as an attribute only. Example <div data-my-slide="variable"> </div>
    restrict: 'A',

    // This is the functions that gets executed after Angular has compiled the html
    link: function (scope, element, attrs) {
          element.click(function(e) {
            e.preventDefault();

  					console.log('HALLO', attrs);
  					var td = $(element).parent();
  					td.children('.btn').remove();
  					td.children('.'+attrs.showInput).css('display', 'inline');
          });
    }
  };
  /* jshint ignore:end */

});


angular.module('cattlecrewCaseManagementUiApp')
  .directive('insertLoadingAnimation', function() {

  /* jshint ignore:start */
  return {

    restrict: 'A',

    link: function (scope, element, attrs) {
        element.click(function(e) {
          element = $('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate">');
        });
    }
  };
  /* jshint ignore:end */

});