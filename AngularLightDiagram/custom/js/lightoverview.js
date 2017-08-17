main.directive('lightOverview', function () {
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
        templateUrl: '/custom/html/lightoverview.html',
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
                $scope.stage_background.update();
            }

            //#region initialize canvas
            let baseBitmap = null;
            let contentsBitmap = null;
            function initializeCanvas(canvasID) {
                //context for plot main data
                $scope.stage = new createjs.Stage($scope.chartid);
                ctx = $scope.stage.canvas.getContext('2d');

                baseBitmap = new createjs.Bitmap('/custom/resource/bear1.jpg')
                $scope.stage.addChild(baseBitmap);

                //context for axis for main data
                $scope.stage_background = new createjs.Stage($scope.backgroundid);
                ctx_back = $scope.stage_background.canvas.getContext('2d');


                //baseBitmap = new createjs.Bitmap('/custom/resource/chk_captcha.png')
                //$scope.stage_background.addChild(baseBitmap);

                //contentsBitmap = new createjs.Bitmap('/custom/resource/WBB_group.jpg')
                //contentsBitmap.alpha = 0;
                //$scope.stage_background.addChild(contentsBitmap);


                $scope.stage_background.nextStage = $scope.stage;

                $scope.stage.enableMouseOver(20);
                $scope.stage_background.enableMouseOver(20);

                //drawWhiteCanvas();
                //drawGrid();
                drawSubContents();
            }
            //#endregion

            var circleShape;
            var rectangleShape;
            function drawSubContents() {
                createRectangle1();
                createRectangle2();
            }

            function createRectangle1() {
                var g = new createjs.Graphics();
                g.s("Red").setStrokeStyle(1); //color dot thickness
                g.f("Pink").dr(500, 200, 400, 30);

                shape = new createjs.Shape(g);
                shape.name = '1imnida';
                //shape.alpha = 0;
                //shape.hitArea = new createjs.Shape(g);
                //shape.hitArea.graphics.beginFill("#FFF000").dr(500, 200, 400, 30);
                setEventListner(shape);
                $scope.stage.addChild(shape);
            }

            function createRectangle2() {
                var g = new createjs.Graphics();
                g.s("Red").setStrokeStyle(1); //color dot thickness
                g.f("Pink").dr(700, 500, 400, 30);

                shape = new createjs.Shape(g);
                shape.name = '2imnida';
                //shape.alpha = 0;
                //shape.hitArea = new createjs.Shape(g);
                //shape.hitArea.graphics.beginFill("#FFF000").dr(700, 500, 400, 30);

                setEventListner(shape);
                $scope.stage.addChild(shape);
            }

            let shape;
            let dragPointX;
            let dragPointY;


            function setEventListner(element) {
                //shape.addEventListener("mousedown", function (e) {
                //    dragPointX = $scope.stage.mouseX - e.target.x;
                //    dragPointY = $scope.stage.mouseY - e.target.y;
                //});
                //shape.addEventListener("pressmove", function (e) {
                //    e.target.x = $scope.stage.mouseX - dragPointX;
                //    e.target.y = $scope.stage.mouseY - dragPointY;
                //});
                element.addEventListener("mouseover", function (e) {
                    setContentsBitmapByName(e);
                    baseBitmap.alpha = 1;
                    contentsBitmap.alpha = 0;
                    createjs.Tween.get(baseBitmap).to({ alpha:0 }, 500)
                    createjs.Tween.get(contentsBitmap).to({ alpha: 1 }, 500)
                });
                element.addEventListener("mouseout", function (e) {
                    baseBitmap.alpha = 0;
                    contentsBitmap.alpha = 1;
                    createjs.Tween.get(baseBitmap).to({ alpha: 1 }, 500)
                    createjs.Tween.get(contentsBitmap).to({ alpha: 0 }, 500)
                });
                element.addEventListener("pressup", function (e) {
                    //alert('pressup');
                });
            }

            function setContentsBitmapByName(e) {
                if(e.target.name == '1imnida')
                {
                    contentsBitmap = new createjs.Bitmap('/custom/resource/bear2.jpg')
                }
                else if (e.target.name == '2imnida')
                {
                    contentsBitmap = new createjs.Bitmap('/custom/resource/bear3.jpg')
                }
                contentsBitmap.alpha = 0;
                $scope.stage_background.removeAllChildren();
                $scope.stage_background.addChild(contentsBitmap);
            }
        }],
    };
});