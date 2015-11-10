var itemWidth   = 320;            //画像幅
var paWidth     = 1000;           //印刷エリア幅
var paHeight    = 1414;           //印刷エリア高さ
var $_img       = $('img.disp');  //画像
var $_pa        = $('#printArea');//印刷エリア
var storage     = localStorage;
var $slider;

$(function () {
	// File API Dropイベント追加
	if (window.File) {
		// File APIに関する処理を記述
		document.getElementById("printArea").addEventListener("drop", onDrop, false);
	} else {
		window.alert("本ブラウザではFile APIが使えません");
	}

	//画像ドラッグ設定
	$_img.draggable();

	//スライダー関連
	var sliderValue = parseInt(storage.getItem("print1-sliderValue"),10) || 300;
	$slider = $( "#slider" ).slider({
		max: 500,
		min: 100,
		value: sliderValue
	})
	.on({
		slide: function(event,ui){
			var value = ui.value;
			$('#printArea img').css('width',value);
			$('#inputItemWidth').val(value);
		},
		slidechange: function(event,ui){
			var value = ui.value;
			storage.setItem("print1-sliderValue", value);
			storage.setItem("print1-itemWidth", value);
		}
	});

	//初回表示時のみ説明モーダルを表示
	var initialFlag = storage.getItem("print1-initial");
	if(!initialFlag){
		$('#myModal').modal();
		storage.setItem("print1-initial",true);
	}
});

//Angular.js関連
var myApp = angular.module('print1', []);
myApp.controller('print1Controller', ['$scope', function($scope){

	//値の初期化
	$scope.itemWidth = 320;
	var getitemWidth = storage.getItem("print1-itemWidth");
	if(getitemWidth){
		$scope.itemWidth = getitemWidth;
		itemWidth = getitemWidth;
	}

	//画像幅変更処理
	$scope.changeItemWidth = function(num){
		$('#printArea img').css('width',num);
		itemWidth = num;
		storage.setItem("print1-itemWidth",num);
		slider.slider("option","value",num);//スライダーに値をセット
	};

	//クリア（リロード）
	$scope.clear = function(){
		window.location.reload();
	};

	//印刷
	$scope.wPrint = function(){
		window.print();
	};

	//情報
	$scope.info = function(){
		$('#myModal').modal();
	};
}]);


// Drop領域にドロップした際のファイルのプロパティ情報読み取り処理
var onDrop = function(event) {
	var files = event.dataTransfer.files;
	$('#beforeMessage').text('loading...');
	for (var i = 0; i < files.length; i++) {
		var file = files[i],
		fileReader = new FileReader();

		fileReader.onload = function(event) {
			// 読み込んだデータをimgに設定
			$_img.attr('src', event.target.result);

			$('#beforeMessage').hide();
			imgSetInit();
		};
		fileReader.readAsDataURL(file);
	}
	event.preventDefault();
}

//初期ドロップ処理
var imgSetInit = function() {
	var imgWidth = $_img.width();
	var imgHeight = $_img.height();
	var paWidth = $_pa.width();
	var paHeight = $_pa.height();
	console.log(imgWidth,imgHeight);
	var hval = (imgHeight / imgWidth) * itemWidth; //幅変更後の画像高さ
	var hvalMath = Math.floor(hval / paHeight); //コピー枚数（印刷エリアに対して画像高さの余り値）
	console.log(hval);
	console.log(hvalMath);
	//1枚目の画像幅指定
	$_img.css('width',itemWidth);

	//2枚目以降複製する場合（コピー枚数が1以上の場合）
	if (hvalMath >= 1) {
		for (var i = 1; i <= hvalMath; i++) {
			$_img.clone().addClass('clone').css(
				{
					//2枚目以降のスタイル設定
					'left':(itemWidth*(i)),
					'top':(paHeight*(i)*(-1)),
					'width':itemWidth
				}
			).appendTo($('#printArea')).draggable();;
		}
	}
}

var onDragOver = function(event) {
	event.preventDefault();
}