main.service('FigureEditService', function () {
    
    this.AddFigure = function ($scope, info) {
        $scope = $scope;
        var g = new createjs.Graphics();
        let shape = new createjs.Shape(g);
        if (info.type == 1) {
            g.s("Red").setStrokeStyle(1); //color dot thickness
            g.f("Pink").rr(info.x, info.y, info.w, info.h, 5);
            setMoveEventListner(shape);
        }
        else if (info.type == 2) {
            let termContainer = new createjs.Container();
            $scope.stage.addChild(termContainer);

            let leftEdge = new createjs.Shape();
            leftEdge.name = 'LEFT_EDGE'
            leftEdge.graphics.f("Red").dr(info.x, info.y, info.w, info.h);

            let centerRectangle = new createjs.Shape();
            centerRectangle.name = 'CENTER_RECTANGLE'
            centerRectangle.graphics.f("Pink").dr(info.x + info.w, info.y, info.w * 9, info.h);

            let rightEdge = new createjs.Shape();
            rightEdge.name = 'RIGHT_EDGE'
            rightEdge.graphics.f("Red").dr(info.x + info.w * 10, info.y, info.w, info.h);

            termContainer.addChild(leftEdge);
            termContainer.addChild(centerRectangle);
            termContainer.addChild(rightEdge);

            setRectangleEventListner(termContainer);
        }

        $scope.stage.addChild(shape);
        $scope.stage.update();
    }
    this.DeleteFigure = function (type) {
        FigureEditService.DeleteFigure($scope, selectedFigure);
    }

    let termContainer;
    let centerRectangle;
    let leftEdge;
    let rightEdge;
    const EDGE_WIDTH = 20;
    const CENTER_RECTANGLE_NAME = 'CENTER_RECTANGLE'
    const LEFT_EDGE_NAME = 'LEFT_EDGE'
    const RIGHT_EDGE_NAME = 'RIGHT_EDGE'
    //#region 
    function getShapeInfo(target) {
        return {
            x: target.graphics._instructions[1].x,
            y: target.graphics._instructions[1].y,
            w: target.graphics._instructions[1].w,
            h: target.graphics._instructions[1].h,
        }
    }

    function setRectangleEventListner(element) {
        element.addEventListener("mouseover", function (e) {
            let shapeInfo = getShapeInfo(e.target);
            e.target.graphics.f("Blue").dr(shapeInfo.x, shapeInfo.y, shapeInfo.w, shapeInfo.h);
        });

        element.addEventListener("mouseout", function (e) {
            let shapeInfo = getShapeInfo(e.target);
            let color = undefined;
            if (e.target.name === LEFT_EDGE_NAME) {
                color = "Red";
            }
            else if (e.target.name === CENTER_RECTANGLE_NAME) {
                color = "Pink";
            }
            else if (e.target.name === RIGHT_EDGE_NAME) {
                color = "Red";
            }
            e.target.graphics.f(color).dr(shapeInfo.x, shapeInfo.y, shapeInfo.w, shapeInfo.h);
        });

        //#region Change Item Size for Drag Event 
        //Get Start Point for drag.
        element.addEventListener("mousedown", function (e) {
            $scope.stagemouseX = $scope.stage.mouseX;
            $scope.eTargetX = e.target.x;
            $scope.$apply();

            //1.Check if click position is a left edge or a main rectangle or a right edge 
            dragStartPointX = $scope.stage.mouseX - e.target.x;
            $scope.RECTANGLE_POS_X = _.filter(e.target.parent.children, function (n) {
                return n.name == CENTER_RECTANGLE_NAME;
            })[0].graphics._instructions[1].x;

            $scope.RECTANGLE_WIDTH = _.filter(e.target.parent.children, function (n) {
                return n.name == CENTER_RECTANGLE_NAME;
            })[0].graphics._instructions[1].w;
        });

        //Moving Size -> $scope.stage.mouseX - dragStartPointX
        element.addEventListener("pressmove", function (e) {
            let newRectanglePos_x = null;
            let newLeftEdgePos_x = null;
            let newRightEdgePos_x = null;
            let newWidth = null;

            if (e.target.name === LEFT_EDGE_NAME) {
                //Move x position of Left Edge
                newRectanglePos_x = $scope.RECTANGLE_POS_X + ($scope.stage.mouseX - dragStartPointX);
                newLeftEdgePos_x = newRectanglePos_x - EDGE_WIDTH;
                newWidth = $scope.RECTANGLE_WIDTH - ($scope.stage.mouseX - dragStartPointX);
                newRightEdgePos_x = newRectanglePos_x + newWidth;
            }
            else if (e.target.name === CENTER_RECTANGLE_NAME) {
                //Move x position of LeftEdge and CenterRectangle and Right Edge. No change center rectangle width.
                newRectanglePos_x = $scope.RECTANGLE_POS_X + $scope.stage.mouseX - dragStartPointX;
                newLeftEdgePos_x = newRectanglePos_x - EDGE_WIDTH;
                newWidth = $scope.RECTANGLE_WIDTH;
                newRightEdgePos_x = newRectanglePos_x + newWidth;
            }
            else if (e.target.name === RIGHT_EDGE_NAME) {
                //Move x position of Right Edge
                newRectanglePos_x = $scope.RECTANGLE_POS_X;
                newLeftEdgePos_x = newRectanglePos_x - EDGE_WIDTH;
                newWidth = $scope.RECTANGLE_WIDTH + ($scope.stage.mouseX - dragStartPointX);
                newRightEdgePos_x = newRectanglePos_x + newWidth;

            }
            if (newWidth >= 0) {
                _.each(e.target.parent.children, function (n) {
                    if (n.name === LEFT_EDGE_NAME) {
                        n.graphics.clear().f("Green").rc(newLeftEdgePos_x, calculateYPosition(chartIndex) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 7, 5, 0, 0, 5);
                        $scope.NEW_POS_X = newLeftEdgePos_x;
                    }
                    else if (n.name === CENTER_RECTANGLE_NAME) {
                        n.graphics.clear().f("Pink").dr(newRectanglePos_x, calculateYPosition(chartIndex) + 3, newWidth, tableSizeInfo.rowHeight - 7);
                    }///
                    else if (n.name === RIGHT_EDGE_NAME) {
                        n.graphics.clear().f("Green").rc(newRightEdgePos_x, calculateYPosition(chartIndex) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 7, 0, 5, 5, 0);
                    }
                });
                $scope.NEW_WIDTH = newRightEdgePos_x - newLeftEdgePos_x;
            }
        });

        element.addEventListener("pressup", function (e) {
            let chartIndex = e.target.parent.chartIndex;
            if ($scope.NEW_WIDTH >= 0) {
                $scope.collection[chartIndex] = TimePosSynchronizerService.setConvertedTerm($scope.NEW_POS_X, $scope.NEW_WIDTH, $scope.collection[chartIndex], termSizeInfo);
                e.target.parent.removeAllChildren();
                createRectangle($scope.collection[chartIndex], chartIndex);
            }
        });
        //#endregion 
    }
    let dragPointX;
    let dragPointY;
    let selectedFigure;

    function setMoveEventListner(shape) {
        shape.addEventListener("mousedown", function (e) {
            selectedFigure = e.target;
            dragPointX = $scope.stage.mouseX - e.target.x;
            dragPointY = $scope.stage.mouseY - e.target.y;
        });
        shape.addEventListener("pressmove", function (e) {
            e.target.x = $scope.stage.mouseX - dragPointX;
            e.target.y = $scope.stage.mouseY - dragPointY;
        });
    }
    //#endregion
});