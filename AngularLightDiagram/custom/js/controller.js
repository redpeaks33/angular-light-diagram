var main = angular.module("app", [
    'ui.router',
]);

main.controller('MyController', ['$scope', function ($scope) {
    $scope.initialize = function()
    {
        $state.go('diagram');
    };

    $scope.tabClicked = function (type) {
        $state.go(type);
    }
}]);
