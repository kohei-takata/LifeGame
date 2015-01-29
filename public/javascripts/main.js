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
	var scaleRate = Math.min(window.innerHeight/SCREEN_SIZE, window.innerHeight/SCREEN_SIZE); // Canvas引き伸ばし率の取得
//	canvas.style.width = canvas.style.height = SCREEN_SIZE*scaleRate+'px';  // キャンバスを引き伸ばし
	
	canvas.addEventListener('click', onClick, false);
	document.addEventListener('keyup', onKeyup, false);
	function onClick(e) {
		var rect = e.target.getBoundingClientRect();
		var mouseX = Math.floor(e.clientX - rect.left);
		var mouseY = Math.floor(e.clientY);
	
//		localDraw(mouseX, mouseY);
		console.log('x:' + mouseX + ' y:' + mouseY);
		localField[Math.floor(mouseX + (SIDE_CELLS * mouseY)/5)] = 1;
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
	console.log('d x:' + x + ' y:' + y);
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

