main.service('KeyboardOperationService', function () {
    let keys = {};
    var KEYCODE_LEFT = 37,
        KEYCODE_RIGHT = 39,
        KEYCODE_UP = 38,
        KEYCODE_DOWN = 40;

    this.setKeyEvent = function () {
        this.document.onkeydown = keydown;
        this.document.onkeyup = keyup;
    }

    //#region keyboard
    function keydown(event) {
        keys[event.keyCode] = true;
        if (keys[KEYCODE_LEFT]) selectedFigure.x -= 10;
        if (keys[KEYCODE_UP]) selectedFigure.y -= 10;
        if (keys[KEYCODE_RIGHT]) selectedFigure.x += 10;
        if (keys[KEYCODE_DOWN]) selectedFigure.y += 10;
    }

    function keyup(event) {
        delete keys[event.keyCode];
    }

    //#endregion
});