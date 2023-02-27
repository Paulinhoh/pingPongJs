const canvasEl = document.querySelector("canvas"),
canvasCtx = canvasEl.getContext("2d"),
gapX = 10;

const mouse = { x: 0, y: 0 };

const field = {
w: window.innerWidth,
h: window.innerHeight,

draw: function () {
  canvasCtx.fillStyle = "#286047";
  canvasCtx.fillRect(0, 0, this.w, this.h);
},
};

const line = {
w: 15,
h: field.h,

draw: function () {
  canvasCtx.fillStyle = "#ffff";
  canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h);
},
};

const leftPaddle = {
x: gapX,
y: 0,
w: line.w,
h: 200,

_move: function () {
  this.y = mouse.y - this.h / 2;
},
draw: function () {
  canvasCtx.fillStyle = "#ffff";
  canvasCtx.fillRect(this.x, this.y, this.w, this.h);

  this._move();
},
};

const rightPaddle = {
x: field.w - line.w - gapX,
y: 300,
w: line.w,
h: 200,
speed: 6,

_move: function () {
  if (this.y + this.h / 2 < ball.y + ball.r) {
    this.y += this.speed;
  } else {
    this.y -= this.speed;
  }
},
_speedUp: function () {
  this.speed += 2;
},
draw: function () {
  canvasCtx.fillStyle = "#ffff";
  canvasCtx.fillRect(this.x, this.y, this.w, this.h);

  this._move();
},
};

const score = {
human: 0,
computer: 0,

_increaseHuman: function () {
  this.human++;
},
_increaseComputer: function () {
  this.computer++;
},
draw: function () {
  canvasCtx.font = "bold 72px Arial";
  canvasCtx.textAlign = "center";
  canvasCtx.textBaseline = "top";
  canvasCtx.fillStyle = "#01341d";
  canvasCtx.fillText(this.human, field.w / 4, 50);
  canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50);
},
};

const ball = {
x: field.w / 2,
y: field.h / 2,
r: 20,
speed: 7,
directionX: 1,
directionY: 1,

_calcPosition: function () {
  // verifica se o jogador 1 fez um ponto (x > largura do campo)
  if (this.x > field.w - this.r - rightPaddle.w - gapX) {
    // verifica se a raquete direita esta na posição y da bola
    if (
      this.y + this.r > rightPaddle.y &&
      this.y - this.r < rightPaddle.y + rightPaddle.h
    ) {
      // rebate a bola revertendo o sinal de x
      this._reverseX();
    } else {
      // pontuar o jogador 1
      score._increaseHuman();
      this._pointUp();
    }
  }

  // verifica se o jogador 2 fez um ponto (x < 0)
  if (this.x < this.r + leftPaddle.w + gapX) {
    // verifica se a raquete esquerda esta na posição y da bola
    if (
      this.y + this.r > leftPaddle.y &&
      this.y - this.r < leftPaddle.y + leftPaddle.h
    ) {
      // rebate a bola revertendo o sinal de x
      this._reverseX();
    } else {
      // pontuar jogador 2
      score._increaseComputer();
      this._pointUp();
    }
  }

  // verifica as laterais superiores e inferiores do campo
  if (
    (this.y - this.r < 0 && this.directionY < 0) ||
    (this.y > field.h - this.r && this.directionY > 0)
  ) {
    // rebate a bola e inverte o sinal do eixo
    this._reverseY();
  }
},
_reverseX: function () {
  this.directionX *= -1;
},
_reverseY: function () {
  this.directionY *= -1;
},
_speedUp: function () {
  this.speed += 3;
},
_pointUp: function () {
  if (score.human >= 7 || score.computer >= 7) {
    this.x = field.w / 2;
    this.y = field.h / 2;
  } else {
    this._speedUp();
    rightPaddle._speedUp();

    this.x = field.w / 2;
    this.y = field.h / 2;
  }
},
_move: function () {
  this.x += this.directionX * this.speed;
  this.y += this.directionY * this.speed;
},
draw: function () {
  canvasCtx.fillStyle = "#ffff";
  canvasCtx.beginPath();
  canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
  canvasCtx.fill();

  this._calcPosition();
  this._move();
},
};

function setup() {
canvasEl.width = canvasCtx.width = field.w;
canvasEl.height = canvasCtx.height = field.h;
}

function draw() {
field.draw();
line.draw();

leftPaddle.draw();
rightPaddle.draw();

score.draw();
ball.draw();
}

window.animateFrame = (function () {
return (
  window.requestAnimationFrame ||
  window.wwebkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    return window.setTimeout(callback, 1000 / 60);
  }
);
})();

function main() {
animateFrame(main);
draw();
}

setup();
main();

canvasEl.addEventListener("mousemove", function (e) {
mouse.x = e.pageX;
mouse.y = e.pageY;
});