var canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var stage = new createjs.Stage("myCanvas");

function addCircle(r, x, y) {
    var g = new createjs.Graphics().beginFill("#ff0000").drawCircle(0, 0, r);
    var s = new createjs.Shape(g)
    s.x = x;
    s.y = y;
    stage.addChild(s);
    stage.update();
}

addCircle(10, 200, 100);
addCircle(5, canvas.width / 2, canvas.height / 2);
addCircle(3, 400, 400);

canvas.addEventListener("mousewheel", MouseWheelHandler, false);
canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);

var zoom;

function MouseWheelHandler(e) {
    if (Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) > 0)
        zoom = 1.1;
    else
        zoom = 1 / 1.1;
    stage.regX += stage.mouseX - stage.regX;
    stage.regY += stage.mouseY - stage.regY;
    stage.x = stage.mouseX;
    stage.y = stage.mouseY;
    stage.scaleX = stage.scaleY *= zoom;

    stage.update();

}


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