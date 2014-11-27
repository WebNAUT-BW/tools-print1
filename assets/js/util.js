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

	for (var i = 0; i < files.length; i++) {
		var file = files[i],            // 2. files配列にファイルが入っています
		$_img = $('img.disp'), // 3. jQueryのsiblingsメソッドで兄弟のimgを取得
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

function imgSetInit() {
	var $_img = $('img.disp'),
	img_width = $_img.width(),
	img_height = $_img.height();

	var $_pa = $('#printArea'),
	pa_width = $_pa.width(),
	pa_height = $_pa.height();

	console.log('img_width=' + img_width + ', img_height=' + img_height);

	if (pa_height > img_height) {
		console.log('img_height under');
		$_img.clone().addClass('clone').appendTo($('#printArea'));
	} else {
		console.log('img_height over');

		var hval = (img_height / pa_height);
		console.log('hval=' + hval);

		var hvalMath = Math.floor(img_height / pa_height);
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



function onDragOver(event) {
	event.preventDefault();
}

function readText(name,input) {
	// File APIを利用できるかをチェック
	if (window.File) {

		// ファイル読み込みの準備
		var reader = new FileReader();

		// ファイルの読み込みに成功した後の処理
		reader.addEventListener('load', function(e) {
			//var fileContent = reader.result.replace(/(\n|\r)/g, '<br />');

			//ファイルの中身格納
			var fileContent = reader.result;

			//fileContent内の文字列処理：<content>の中身を取り出す、"<![CDATA["と"]]>"も合わせて削除
			var indexTagContent = fileContent.indexOf("<content>"); 
			var indexTagContentEnd = fileContent.indexOf("</content>"); 
			var txtContent = fileContent.substring(indexTagContent,indexTagContentEnd).replace("<![CDATA[", "").replace("]]>", "").replace("<content>", "").replace("</content>", "");

			//txtContentをそのまま出力するとタグとして生成されるので、ASCII文字に変換
			txtContent_length = txtContent.length;
			var txtContentAs = "";
			for(var i=0;i<txtContent_length;i++){
				txtContentAs = txtContentAs + "&" + "#" + txtContent.charCodeAt(i) + ";";
			}

			//fileContent内の文字列処理：<tabTrigger>の中身を取り出す
			var indexTabTrigger = fileContent.indexOf("<tabTrigger>"); 
			var indexTabTriggerEnd = fileContent.indexOf("</tabTrigger>"); 
			var txtTabTrigger = fileContent.substring(indexTabTrigger,indexTabTriggerEnd).replace("<tabTrigger>", "").replace("</tabTrigger>", "");

			//出力用HTMLの文字列を作成
			var outputName = '<td>' + name + '</td>';
			var outputContent = '<td><pre>' + txtContentAs + '</pre></td>';
			var outputTabTrigger = '<td>' + txtTabTrigger + '</td>';
			var outputAll = '<tr>' + outputName + outputContent + outputTabTrigger + '</tr>';

			//HTML出力
			$('#outputTable').append(outputAll);
		}, true);

		// ファイルの内容をテキストとして取得（3）
		reader.readAsText(input, 'UTF-8');
	}
}

