'use strict';
;(function($) {

	// var
	var colNum      = 3;              //列数
	var itemWidth   = 320;            //画像幅
	var offsetAll   = 0;              //全体オフセット
	var offsetCol   = new Array(10);  //各列オフセット
	var paWidth     = 1000;           //印刷エリア幅
	var paHeight    = 1414;           //印刷エリア高さ
	var $_img       = $('img.disp');  //画像
	var $_pa        = $('#printArea');//印刷エリア


	// File API Dropイベント追加
	if (window.File) {
		document.getElementById("printArea").addEventListener("drop", onDrop, false);
	} else {
		window.alert("本ブラウザではFile APIが使えません");
	}


	// Drop領域にドロップした際のファイルのプロパティ情報読み取り処理
	function onDrop(event) {
		var files = event.dataTransfer.files;

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

			for (var i = 0; i < hvalMath; i++) {
				$_img.clone().addClass('clone').css(
					{
						'left':(320*(i+1)),
						'top':(1414*(i+1)*(-1))
					}
				).appendTo($('#printArea'));
			}
		}
	}


	//画像幅変更処理
	// function changeItemWidth(num) {
	// }

	//全体オフセット変更処理
	// function changeOffsetAll(num) {
	// 	alert(num);
	// }

	//各列オフセット変更処理
	// function changeOffsetCol(col,num) {
	// }

	// 画像ドラッグ中のイベント
	// $_pa.on("dragover",function(e){
	// 	if (!$(this).hasClass('dragover')) {
	// 		$(this).addClass('dragover');
	// 		console.log('add dragover');
	// 	}
	// 	e.preventDefault();
	// });

}(jQuery));

var myApp = angular.module('print1', []);
myApp.controller('print1Controller', ['$scope', function($scope){

	//全体オフセット変更処理
	$scope.changeOffsetAll = function(num){
		// $scope.spice = spice;
		console.log(num);
	};

	//各列オフセット変更処理
	$scope.changeOffsetCol = function(col,num){
		// $scope.spice = spice;
		console.log(num);
	};

}]);