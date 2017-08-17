main.directive('lightDiagram', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            title: '@',
            chartid: '@',
            backgroundid: '@',
            width: '=',
            height: '=',
        },
        templateUrl: '/custom/html/lightdiagram.html',
        controller: ['$scope', '$timeout', function ($scope, $timeout) {
            var chartSizeInfo = {
                canvasSizeX: $scope.width,
                canvasSizeY: $scope.height,
                xMax: $scope.width,
                xMin: 0,
                yMax: $scope.height,
                yMin: 0,
            };

            initialize();
            var ctx = {};
            var ctx_back = {};

            function initialize() {
                //$timeout -> Execute after html tag canvas is loaded.
                $timeout(function () {
                    initializeCanvas();

                    createjs.Ticker.addEventListener("tick", handleTick);
                    createjs.Ticker.timingMode = createjs.Ticker.RAF;
                });
            }
            function handleTick() {
                $scope.stage.update();
            }

            //#region initialize canvas
            function initializeCanvas(canvasID) {
                //context for plot main data
                $scope.stage = new createjs.Stage($scope.chartid);
                ctx = $scope.stage.canvas.getContext('2d');

                //context for axis for main data
                $scope.stage_background = new createjs.Stage($scope.backgroundid);
                ctx_back = $scope.stage_background.canvas.getContext('2d');

                //drawWhiteCanvas();
                //drawGrid();
                drawSubContents();
            }
            //#endregion

            var circleShape;
            var rectangleShape;
            function drawSubContents() {
                for (var i = 0; i < 130; i++) {
                    createRectangle(i);
                }
            }
            //let shape;
            let dragPointX;
            let dragPointY;
            //function createRectangle(i) {
            //    var g = new createjs.Graphics();
            //    g.s("Red").setStrokeStyle(1); //color dot thickness
            //    g.f("Pink").rr(0, 30 * i, 100, 20, 5);
            //    shape = new createjs.Shape(g);
            //    setEventListner(shape);
            //    $scope.stage.addChild(shape);
            //}

            let selectedFigure;
            function setEventListner(shape) {
                shape.addEventListener("mousedown", function (e) {
                    //selectedFigure = shape;
                    dragPointX = $scope.stage.mouseX - e.target.x;
                    dragPointY = $scope.stage.mouseY - e.target.y;
                });
                shape.addEventListener("pressmove", function (e) {
                    e.target.x = $scope.stage.mouseX - dragPointX;
                    e.target.y = $scope.stage.mouseY - dragPointY;
                });
            }
            $scope.$on('addFigure',function(e,info){
                var g = new createjs.Graphics();
                g.s("Red").setStrokeStyle(1); //color dot thickness
                g.f("Pink").rr(100, 100, 50, 50, 5);
                let shape = new createjs.Shape(g);
                setEventListner(shape);
                $scope.stage.addChild(shape);
                $scope.stage.update();
            });

            $scope.$on('deleteFigure', function (e) {
                alert();
            });
        }],
    };
});