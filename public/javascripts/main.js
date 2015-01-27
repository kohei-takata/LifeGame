var SCREEN_SIZE = 500;                    // キャンバスの幅
var SIDE_CELLS = 100;                     // 一辺のセルの数
var CELL_SIZE = SCREEN_SIZE / SIDE_CELLS; // セルの幅
var FPS = 10;                             // フレームレート
var canvas;                     //= document.getElementById('world');
var context;                    //= canvas.getContext('2d');

window.onload = function() {
	    var field = new Array(SIDE_CELLS*SIDE_CELLS); // フィールド情報
	        var tempField = new Array(SIDE_CELLS*SIDE_CELLS); // フィールド情報の一時記憶用
		    for (var i=0; i<field.length; i++) field[i] = Math.floor(Math.random()*2); // ランダムに「生」「死」を格納
		        canvas = document.getElementById('world'); // canvas要素を取得
			    canvas.width = canvas.height = SCREEN_SIZE; // キャンバスのサイズを設定
			        var scaleRate = Math.min(window.innerHeight/SCREEN_SIZE, window.innerHeight/SCREEN_SIZE); // Canvas引き伸ばし率の取得
				    canvas.style.width = canvas.style.height = SCREEN_SIZE*scaleRate+'px';  // キャンバスを引き伸ばし
				        context = canvas.getContext('2d');                // コンテキスト
					    context.fillStyle = 'rgb(211, 85, 149)';          // 色
					        update(field, tempField);   // ゲームループ開始
}

function update(field, tempField) {
	    var n = 0;                    // 自身のまわりにある「生」の数
	        tempField = field.slice(); // 複製
		    for (var i=0; i<tempField.length; i++) {
			            n = 0;
				            for (var s=-1; s<2; s++) {
						                for (var t=-1; t<2; t++) {
									                if (s==0 && t==0) continue; // 自身はカウントしない
											                var c = i+s*SIDE_CELLS+t;   // チェックするセル
													                if (c>=0 && c<tempField.length) { // 配列からはみ出していないか(上下の壁判定も兼ねて)
																                    if (i<c && c%SIDE_CELLS!=0 || i>c && c%SIDE_CELLS!=SIDE_CELLS-1) { // 左右の壁判定
																			                            if (tempField[c]) n ++; // 「生」だったらカウント
																						                        }
																		                    }
															            }
								        }
					            if (tempField[i] && (n==2||n==3)) { // 自身が「生」でカウントが2か3
							                field[i] = 1;    // 「生」
									        } else if (!tempField[i] && n==3) { // 自身が「死」でカウントが3
											            field[i] = 1;    // 「生」
												            } else field[i] = 0; // 「死」
						        }
		        draw(field);                                    // canvasを更新
			    setTimeout(update, 1000/FPS, field, tempField); // 再帰
}

function draw(field) {
	    context.clearRect(0, 0, SCREEN_SIZE, SCREEN_SIZE); // 画面をクリア
	        for (var i=0; i<field.length; i++) {
			        var x = (i%SIDE_CELLS)*CELL_SIZE;             // x座標
				        var y = Math.floor((i/SIDE_CELLS))*CELL_SIZE; // y座標
					        if (field[i]) context.fillRect(x, y, CELL_SIZE, CELL_SIZE); // 「生」を描画
						    }
}

