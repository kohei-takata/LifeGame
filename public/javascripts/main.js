var socket = io.connect();

var SCREEN_SIZE = 500;                    // キャンバスの幅
var SIDE_CELLS = 100;                     // 一辺のセルの数
var CELL_SIZE = SCREEN_SIZE / SIDE_CELLS; // セルの幅
var FPS = 10;                             // フレームレート
var canvas;                     //= document.getElementById('world');
var context;                    //= canvas.getContext('2d');

window.onload = function() {
	canvas = document.getElementById('world'); // canvas要素を取得
	canvas.width = canvas.height = SCREEN_SIZE; // キャンバスのサイズを設定
	var scaleRate = Math.min(window.innerHeight/SCREEN_SIZE, window.innerHeight/SCREEN_SIZE); // Canvas引き伸ばし率の取得
	canvas.style.width = canvas.style.height = SCREEN_SIZE*scaleRate+'px';  // キャンバスを引き伸ばし
	
	canvas.addEventListener('click', onClick, false);
	function onClick(e) {
		var rect = e.target.getBoundingClientRect();
		var mouseX = Math.round(e.clientX - rect.left);
		var mouseY = Math.round(e.clientY - rect.top);
	
		context.fillRect(mouseX, mouseY, CELL_SIZE, CELL_SIZE);
		
		var huga = 0;
		var hoge = setInterval(function() {
			    console.log(huga);
			        huga++;
				    //終了条件
				        if (huga == 10) {
				            clearInterval(hoge);
				                console.log("終わり");
				                    }
				                    }, 500);
		socket.emit('click', mouseX, mouseY);
	};

	context = canvas.getContext('2d');                // コンテキスト
	context.fillStyle = 'rgb(211, 85, 149)';          // 色
}

socket.on('send', function(field){
	draw(field);
	socket.emit('click', null, null);
});

function draw(field) {
	context.clearRect(0, 0, SCREEN_SIZE, SCREEN_SIZE); // 画面をクリア
	for (var i=0; i<field.length; i++) {
		var x = (i%SIDE_CELLS)*CELL_SIZE;             // x座標
		var y = Math.floor((i/SIDE_CELLS))*CELL_SIZE; // y座標
		if (field[i]) context.fillRect(x, y, CELL_SIZE, CELL_SIZE); // 「生」を描画
	}
}

