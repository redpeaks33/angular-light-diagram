var main = angular.module("app", [
    'ui.router',
]);

main.controller('MyController', ['$scope', '$state', '$rootScope',function ($scope, $state,$rootScope) {
    $scope.initialize = function()
    {
        //$state.go('overview');
        $state.go('diagram');
    };

    $scope.tabClicked = function (type) {
        $state.go(type);
    }

    $scope.addFigure = function () {
        //let info = { type: 1, name: 1 ,x:100,y:100,w:50,h:50};
        let info = { type: 2, name: 1 ,x:100,y:100,w:100,h:25};
        $rootScope.$broadcast('addFigure',info);
    }
    $scope.deleteFigure = function () {
        $rootScope.$broadcast('deleteFigure');
    }
}]);
