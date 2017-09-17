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
        templateUrl: '/custom/html/diagram/lightdiagram.html',
        controller: ['$scope', '$timeout', 'FigureEditService', 'KeyboardOperationService', function ($scope, $timeout, FigureEditService, KeyboardOperationService) {
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
            function initializeCanvas() {
                //context for plot main data
                $scope.stage = new createjs.Stage($scope.chartid);
                ctx = $scope.stage.canvas.getContext('2d');

                //context for axis for main data
                $scope.stage_background = new createjs.Stage($scope.backgroundid);
                ctx_back = $scope.stage_background.canvas.getContext('2d');

                $scope.stage.enableMouseOver(20);

                var canvas = document.getElementById($scope.chartid);
                canvas.addEventListener("mousewheel", MouseWheelHandler, false);
                canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);

                setZoomEvent($scope.stage);

                let image = new createjs.Bitmap("/custom/resource/chk_captcha.png");
                //image.x = 0; image.y = 0; image.visible = true;

                $scope.stage.addChild(image);
                $scope.stage.update();
                addCircle(10, 200, 100);
                addCircle(3, 400, 400);


                KeyboardOperationService.setKeyEvent();
            }
            //#endregion

            //#region Edit Figure
            //#region Add
            $scope.$on('addFigure', function (e, info) {
                FigureEditService.AddFigure($scope,info);
            });
            //#endregion

            //#region Delete
            $scope.$on('deleteFigure', function (e){
                FigureEditService.DeleteFigure($scope,selectedFigure);
            });
            //#endregion
            //#endregion
 
            //-------------------------------------------------------------

            function MouseWheelHandler(e) {
                let stage = $scope.stage;
                if (Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) > 0)
                    zoom = 1.1;
                else
                    zoom = 1 / 1.1;
                var local = stage.globalToLocal(stage.mouseX, stage.mouseY);
                stage.regX = local.x;
                stage.regY = local.y;
                stage.x = stage.mouseX;
                stage.y = stage.mouseY;
                stage.scaleX = stage.scaleY *= zoom;

                stage.update();
            }

            function addCircle(r, x, y) {
                let stage = $scope.stage;
                var g = new createjs.Graphics().beginFill("#ff0000").drawCircle(0, 0, r);
                var s = new createjs.Shape(g)
                s.x = x;
                s.y = y;
                stage.addChild(s);
                stage.update();
            }

            var setZoomEvent = function (stage) {
                stage.enableDOMEvents(true);
                stage.addEventListener("stagemousedown", function (e) {
                    var offset = { x: stage.x - e.stageX, y: stage.y - e.stageY };
                    stage.addEventListener("stagemousemove", function (ev) {
                        stage.x = ev.stageX + offset.x;
                        stage.y = ev.stageY + offset.y;
                        stage.update();
                    });
                    stage.addEventListener("stagemouseup", function () {
                        stage.removeAllEventListeners("stagemousemove");
                    });
                });
            }
        }],
    };
});