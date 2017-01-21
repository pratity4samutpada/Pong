/**
 * Created by itc_user1 on 1/21/2017.
 */
Pong = {};

Pong.boardWidth = 30;
Pong.boardHeight = 21;
Pong.ballSpeed = 3;
Pong.startDirection = 1;
Pong.player1Score = 0;
Pong.player2Score = 0;


Pong.init = function () {
    $(document).ready(function () {
        $(".button").click(Pong.start);
        Pong.generateGrid();
        Pong.generateMatrix();
        Pong.addPaddles();
        Pong.activatePaddles();


    })
};

Pong.start = function () {
    $(".button").remove();
    Pong.startGame(Pong.startDirection);
};

Pong.generateGrid = function () {
    var board = $("#mainBoard");
    for (var i = 0; i < Pong.boardHeight; i++) {
        if (i > 0) $("<br/>").appendTo(board);
        for (var j = 0; j < Pong.boardWidth; j++) {
            $("<div/>").addClass("cell").appendTo(board);
        }
    }

};

Pong.addPaddles = function () {
    Pong.matrix[Math.floor(Pong.boardHeight / 2)][0] = "paddle1";
    Pong.matrix[Math.floor(Pong.boardHeight / 2)][Pong.boardWidth - 1] = "paddle2";
};


Pong.startGame = function (dir) {
    Pong.resetBall();
    Pong.ballState = setInterval(function () {
        Pong.moveBallHorizontal(dir)
    }, Pong.ballSpeed * 100);
};


Pong.generateMatrix = function () {
    Pong.matrix = new Array(Pong.boardHeight);
    var cells = $(".cell");

    for (var i = 0; i < Pong.matrix.length; i++) {
        Pong.matrix[i] = new Array(Pong.boardWidth);
    }

    for (var i = 0; i < Pong.matrix.length; i++) {
        for (var j = 0; j < Pong.matrix[i].length; j++) {
            cells.eq(i * Pong.boardWidth + j)
                .data("i", i)
                .data("j", j);

        }
    }

};

Pong.resetBall = function () {
    Pong.matrix[Math.floor(Pong.boardHeight / 2)][Math.floor(Pong.boardWidth / 2)] = "ball";
    Pong.renderMatrix();
};


Pong.activatePaddles = function () {
    $(document).keydown(function (e) {
        switch (e.keyCode) {
            case 38:
                Pong.moveRightPaddleUp();
                break;
            case 40:
                Pong.moveRightPaddleDown();
                break;
            case 87:
                Pong.moveLeftPaddleUp();
                break;
            case 83:
                Pong.moveLeftPaddleDown();
                break;
        }
    })
};

Pong.moveRightPaddleUp = function () {
    var currentPos = $(".paddle2").data("i");
    Pong.matrix[currentPos - 1][Pong.boardWidth - 1] = "paddle2";
    Pong.matrix[currentPos - 2][Pong.boardWidth - 1] = "paddleTop";
    Pong.matrix[currentPos][Pong.boardWidth - 1] = "paddleBottom";
    Pong.matrix[currentPos + 1][Pong.boardWidth - 1] = undefined;
    Pong.renderMatrix();

};

Pong.moveRightPaddleDown = function () {
    var currentPos = $(".paddle2").data("i");
    Pong.matrix[currentPos + 1][Pong.boardWidth - 1] = "paddle2";
    Pong.matrix[currentPos + 2][Pong.boardWidth - 1] = "paddleBottom";
    Pong.matrix[currentPos][Pong.boardWidth - 1] = "paddleTop";
    Pong.matrix[currentPos - 1][Pong.boardWidth - 1] = undefined;
    Pong.renderMatrix();
};

Pong.moveLeftPaddleUp = function () {
    var currentPos = $(".paddle1").data("i");
    Pong.matrix[currentPos - 1][0] = "paddle1";
    Pong.matrix[currentPos - 2][0] = "paddleTop"
    Pong.matrix[currentPos][0] = "paddleBottom"
    Pong.matrix[currentPos + 1][0] = undefined;
    Pong.renderMatrix();
};

Pong.moveLeftPaddleDown = function () {
    var currentPos = $(".paddle1").data("i");
    Pong.matrix[currentPos + 1][0] = "paddle1";
    Pong.matrix[currentPos + 2][0] = "paddleBottom";
    Pong.matrix[currentPos][0] = "paddleTop";
    Pong.matrix[currentPos - 1][0] = undefined;
    Pong.renderMatrix();
};

Pong.continueGame = function (ballY, ballX) {
    $(".cell").removeClass("ball");
    Pong.matrix[ballX][ballY] = undefined;
    var dir = Pong.setDirection(ballY);
    Pong.resetBall();
    Pong.ballState = setInterval(function () {
        Pong.moveBallHorizontal(dir)
    }, Pong.ballSpeed * 100);
};


Pong.setDirection = function (ballY) {
    var dir;
    if (ballY > 0) {
        dir = (-1)
    }
    else {
        dir = 1
    }
    return dir;

}

Pong.checkIfScored = function (pos) {
    if (pos == 0 || pos == Pong.boardWidth - 1) {
        clearInterval(Pong.ballState);
        Pong.resetBall();
        return true;
    } else {
        return false;
    }
};

// Pong.addScore = function(pos){
//
// };

Pong.moveBallHorizontal = function (dir) {
    var ball = $(".ball");
    var ballX = parseInt(ball.data("i"));
    var ballY = parseInt(ball.data("j"));
    if (Pong.checkIfScored(ballY)) {
        Pong.continueGame(ballY, ballX);
        return;
    }
    if (Pong.checkIfPaddle(ballX, ballY, dir)) {
        Pong.changeBallDir(ballY, ballX, dir);
        return;
    }
    Pong.matrix[ballX][ballY] = undefined;
    Pong.matrix[ballX][ballY + dir] = "ball";
    Pong.renderMatrix();

};

Pong.changeBallDir = function (ballY, ballX, dir) {
    if (dir < 0){
    var paddlePart = Pong.matrix[ballX][$(".ball").data("j")-1];
    if(paddlePart != "paddleTop" && paddlePart != "paddleBottom"){
        clearInterval(Pong.ballState);
        Pong.ballState = setInterval(function(){Pong.moveBallHorizontal(1)},Pong.ballSpeed * 100);
    }
    }
    else{
        var paddlePart = Pong.matrix[ballX][$(".ball").data("j")+1];
        if(paddlePart != "paddleTop" && paddlePart != "paddleBottom"){
            clearInterval(Pong.ballState);
            Pong.ballState = setInterval(function(){Pong.moveBallHorizontal(-1)},Pong.ballSpeed * 100);
    }
};};

Pong.checkIfPaddle = function (ballX, ballY, dir) {
    if (ballY - 1 != undefined && dir < 0) {
        return Pong.matrix[ballX][ballY - 1];
    }
    if (ballY + 1 != undefined && dir > 0) {
        return Pong.matrix[ballX][ballY + 1];
    } else return false;
};


Pong.renderMatrix = function () {
    $(".cell").removeClass("ball")
        .removeClass("paddle1")
        .removeClass("paddle2")
        .removeClass("paddleTop")
        .removeClass("paddleBottom");
    var cells = $(".cell");
    for (var i = 0; i < Pong.matrix.length; i++) {
        for (var j = 0; j < Pong.matrix[i].length; j++) {
            cells.eq(i * Pong.boardWidth + j).addClass(Pong.matrix[i][j]);
        }
    }


};


Pong.init();