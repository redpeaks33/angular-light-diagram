main.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('diagram', {
          url: '/diagram',
          templateUrl: '/custom/html/diagramcontainer.html'
      })
      .state('overview', {
          url: 'overview',
          templateUrl: '/custom/html/overviewcontainer.html'
      })
}]);