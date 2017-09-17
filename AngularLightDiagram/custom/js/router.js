main.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('diagram', {
          url: '/diagram',
          templateUrl: '/custom/html/diagram/diagramcontainer.html'
      })
      .state('overview', {
          url: '/overview',
          templateUrl: '/custom/html/overview/overviewcontainer.html'
      })
}]);