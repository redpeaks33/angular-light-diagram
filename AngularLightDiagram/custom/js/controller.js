var main = angular.module("app", [
    'ui.router',
]);

main.controller('MyController', ['$scope', '$state', '$rootScope',function ($scope, $state,$rootScope) {
    $scope.initialize = function()
    {
        $state.go('overview');
    };

    $scope.tabClicked = function (type) {
        $state.go(type);
    }

    $scope.addFigure = function () {
        $rootScope.$broadcast('addFigure');
    }
    $scope.deleteFigure = function () {
        $rootScope.$broadcast('deleteFigure');
    }
}]);
