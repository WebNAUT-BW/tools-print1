// var
var colNum      = 3;              //列数
var itemWidth   = 320;            //画像幅
var offsetAll   = 0;              //全体オフセット
var offsetCol   = new Array(10);  //各列オフセット
var paWidth     = 1000;           //印刷エリア幅
var paHeight    = 1414;           //印刷エリア高さ
var $_img       = $('img.disp');  //画像
var $_pa        = $('#printArea');//印刷エリア
var storage     = localStorage;

// File API Dropイベント追加
$(function () {
	if (window.File) {
		// File APIに関する処理を記述
		document.getElementById("printArea").addEventListener("drop", onDrop, false);
	} else {
		window.alert("本ブラウザではFile APIが使えません");
	}
});


// Drop領域にドロップした際のファイルのプロパティ情報読み取り処理
function onDrop(event) {
	var files = event.dataTransfer.files;
	$('#beforeMessage').text('loading...');
	for (var i = 0; i < files.length; i++) {
		var file = files[i],            // 2. files配列にファイルが入っています
		fileReader = new FileReader();   // 4. ファイルを読み込むFileReaderオブジェクト

		// 5. 読み込みが完了した際のイベントハンドラ。imgのsrcにデータをセット
		fileReader.onload = function(event) {
			// 読み込んだデータをimgに設定
			$_img.attr('src', event.target.result);
			$('#beforeMessage').hide();
			imgSetInit();
		};
		// 6. 画像読み込み
		fileReader.readAsDataURL(file);
	}
	event.preventDefault();
}


//初期ドロップ処理
function imgSetInit() {
	var imgWidth = $_img.width(),
	imgHeight = $_img.height();

	var paWidth = $_pa.width(),
	paHeight = $_pa.height();

	console.log('imgWidth=' + imgWidth + ', imgHeight=' + imgHeight);

	if (paHeight > imgHeight) {
		console.log('imgHeight under');
		$_img.clone().addClass('clone').appendTo($('#printArea'));
	} else {
		console.log('imgHeight over');

		var hval = (imgHeight / paHeight);
		console.log('hval=' + hval);

		var hvalMath = Math.floor(imgHeight / paHeight);
		console.log('hvalMath=' + hvalMath);

		//1枚目の画像幅指定
		$_img.css('width',itemWidth);
		for (var i = 0; i < (colNum-1); i++) {
			$_img.clone().addClass('clone').css(
				{
					//2枚目以降のスタイル設定
					'left':(itemWidth*(i+1)),
					'top':(1414*(i+1)*(-1)),
					'width':itemWidth
				}
			).appendTo($('#printArea')).draggable();;
		}
	}
}

function onDragOver(event) {
	event.preventDefault();
}

var myApp = angular.module('print1', []);
myApp.controller('print1Controller', ['$scope', function($scope){

	$scope.colNum = 3;
	$scope.itemWidth = 320;

	var getcolNum = storage.getItem("print1-colNum");
	if(getcolNum){
		$scope.colNum = getcolNum;
		colNum = getcolNum;
	}
	var getitemWidth = storage.getItem("print1-itemWidth");
	if(getitemWidth){
		$scope.itemWidth = getitemWidth;
		itemWidth = getitemWidth;
	}

	//列数変更処理
	$scope.changeColNum = function(num){
		// $scope.spice = spice;
		$_pa.attr('data-colnum',num);
		colNum = num;
		storage.setItem("print1-colNum", num);
	};

	//画像幅変更処理
	$scope.changeItemWidth = function(num){
		console.log(num);
		$('img').css('width',num);
		itemWidth = num;
		storage.setItem("print1-itemWidth", num);
	};

	//全体オフセット変更処理
	$scope.changeOffsetAll = function(num){
		// $scope.spice = spice;
		$_img.each(function(){
			var _top = $(this).css('top');
			$(this).css('top',_top+num);
		});
		console.log(num);
	};

	//各列オフセット変更処理
	$scope.changeOffsetCol = function(col,num){
		// $scope.spice = spice;
		console.log(num);
	};

	//クリア
	$scope.clear = function(){
		clear();
	};

}]);

$(function() {
    $_img.draggable();
});

function clear() {
	window.location.reload();
	// $('#beforeMessage').show();
	// $_pa.find('img').remove();
	// $_pa.append('<img src="" alt="" class="disp">');
}