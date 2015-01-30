var socket = io.connect();

var SCREEN_SIZE = 500;                    // キャンバスの幅
var SIDE_CELLS = 100;                     // 一辺のセルの数
var CELL_SIZE = SCREEN_SIZE / SIDE_CELLS; // セルの幅
var FPS = 10;                             // フレームレート
var canvas;                     //= document.getElementById('world');
var context;                    //= canvas.getContext('2d');
var localField = new Array(SIDE_CELLS*SIDE_CELLS);

window.onload = function() {
	canvas = document.getElementById('world'); // canvas要素を取得
	canvas.width = canvas.height = SCREEN_SIZE; // キャンバスのサイズを設定

	// canvas.addEventListener('click', onClick, false);
	canvas.addEventListener('mousedown', onMouseDown, false);
	canvas.addEventListener('mousemove', onMouseMove, false);
	canvas.addEventListener('mouseup', onMouseUp, false);
	canvas.addEventListener('mouseout', onMouseOut, false);
	document.addEventListener('keyup', onKeyup, false);
	var mouseDownFlag = false;
	function onMouseDown(e) {
		getLocalAddress(e);
		mouseDownFlag = true;
	};
	function onMouseMove(e) {
		if(mouseDownFlag) getLocalAddress(e);
	};
	function onMouseUp(e) {
		getLocalAddress(e);
		mouseDownFlag = false;
	};
	function onMouseOut(e) {
		mouseDownFlag = false;
	};
	function getLocalAddress(e) {
		var rect = e.target.getBoundingClientRect();
		var mouseX = Math.floor((e.layerX - rect.left)/5);
		var mouseY = Math.floor(e.layerY/5);

		localField[mouseX + SIDE_CELLS * mouseY] = 1;
	};
	function onKeyup(e) {
		for(var i = 0;i < localField.length;i++) {
			if(localField[i]) socket.emit('click', i);		
		}
		localField = new Array(SIDE_CELLS*SIDE_CELLS);
	};
	context = canvas.getContext('2d');                // コンテキスト
}

function localDraw(x, y){
	context.fillStyle = 'rgb(255, 255, 255)';
	context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
};

socket.on('send', function(field){
	draw(field);
});

function draw(field) {
	context.clearRect(0, 0, SCREEN_SIZE, SCREEN_SIZE); // 画面をクリア
	for (var i=0; i<field.length; i++) {
		context.fillStyle = 'rgb(221, 85, 149)';
		var x = (i%SIDE_CELLS)*CELL_SIZE;             // x座標
		var y = Math.floor((i/SIDE_CELLS))*CELL_SIZE; // y座標
		if (field[i]) context.fillRect(x, y, CELL_SIZE, CELL_SIZE); // 「生」を描画
		if(localField[i]) localDraw(x, y);
	}
}

