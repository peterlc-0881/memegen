// placeholder values
var windowW = window.innerWidth;
var windowH = window.innerHeight;

const IMAGE_MARGIN_SCALE = 1.25; // multiplier to leave room for text to hang off the image
const MIN_SIZE = 150; // if original image is too small, enlarge to MIN_SIZE to make editing easier
var windowResizeFactor = 1; // resize factor applies only to image w/o border

// initialize Konva stage -> needs to be global var
var stage;
var downloadStage;

function createKonvaImage(x, y, srcImg, imgScale, id, layer) {
	var img = new Konva.Image({
		x: x,
		y: y,
		image: srcImg,
		width: srcImg.width,
		height: srcImg.height,
		scaleX: imgScale,
		scaleY: imgScale,
		id: id,
	});

	img.offsetX(img.width() / 2);
	img.offsetY(img.height() / 2);

	layer.add(img);
}

function resize_stage() {
	const container = document.getElementById("stage");
	var cWidth = container.clientWidth;

	const srcImg = document.getElementById("srcImg");
	const origStageWidth = srcImg.width * IMAGE_MARGIN_SCALE;
	const origStageHeight = srcImg.height * IMAGE_MARGIN_SCALE;

	if (cWidth > origStageWidth) {
		cWidth = origStageWidth;
	}

	// calculates scale wrt to original stage size
	windowResizeFactor = cWidth / origStageWidth;
	console.log("before", windowResizeFactor);
	
	this.stage.width(origStageWidth * windowResizeFactor);
	this.stage.height(origStageHeight * windowResizeFactor);
	console.log("stage w,h", origStageWidth * windowResizeFactor, origStageHeight * windowResizeFactor);
	this.stage.scale({
		x: windowResizeFactor,
		y: windowResizeFactor
	});
	this.stage.draw();
}

window.addEventListener('resize', resize_stage);

window.onload = function() {
	const srcImg = document.getElementById("srcImg");

	var imgScale = 1;
	// Account for very small images (to make editing easier)
	if (srcImg.width < MIN_SIZE || srcImg.height < MIN_SIZE) {
		console.log("1");
		let imgScaleX = MIN_SIZE / srcImg.width;
		let imgScaleY = MIN_SIZE / srcImg.height;

		imgScale = (imgScaleX > imgScaleY) ? imgScaleY : imgScaleX;
		
		this.windowW = imgScale * src_img.width * IMAGE_MARGIN_SCALE;
		this.windowH = imgScale * src_img.height * IMAGE_MARGIN_SCALE;
	}
	else if	(srcImg.width > window.innerWidth || srcImg.height > window.innerHeight) {
		// Account for images larger than the window
		let imgScaleX = windowW / srcImg.width; // accounting for image padding
		let imgScaleY = windowH / srcImg.height;

		imgScale = (imgScaleX > imgScaleY) ? imgScaleY : imgScaleX;
		
		this.windowW = imgScale * srcImg.width;
		this.windowH = imgScale * srcImg.height;
	}
	else {
		this.windowW = srcImg.width * IMAGE_MARGIN_SCALE;
		this.windowH = srcImg.height * IMAGE_MARGIN_SCALE;			
	}
	
	stage = new Konva.Stage({
		container: 'container',
		width: this.windowW,
		height: this.windowH,
	});

	downloadStage = new Konva.Stage({
		container: 'containerDownload',
		width: this.windowW,
		height: this.windowH,
	});
	var downloadImgLayer = new Konva.Layer({ id: "downloadLayer"});
	this.downloadStage.add(downloadImgLayer);

	var borderLayer = new Konva.Layer({ id: "borderLayer" });
	this.stage.add(borderLayer);

	var border = new Konva.Rect({
		x: 0,
		y: 0,
		width: this.windowW - 1, // to account for the thickness of the border
		height: this.windowH - 1,
		stroke: 'black',
		strokeWidth: 1,
		id: 'borderRect'
	});

	borderLayer.add(border);
	borderLayer.batchDraw();

	var layer = new Konva.Layer();
	this.stage.add(layer);
	
	this.createKonvaImage(0.5 * this.windowW, 0.5 * this.windowH, srcImg, imgScale, "konvaSrcImg", layer);
	this.createKonvaImage(0.5 * this.windowW, 0.5 * this.windowH, srcImg, imgScale, "konvaDownloadImage", downloadImgLayer);
	windowResizeFactor = imgScale;

	layer.batchDraw();
};

change_photo = function() {
	// input validation
	var fontSizeObj = document.getElementById("fontSize");
	if (!fontSizeObj.checkValidity()) {
		return;
	}
	var captionObj = document.getElementById("formCaption");
	if (!captionObj.checkValidity()) {
		return;
	}

	document.getElementById("helpText").innerHTML = "Note: Drag the text to where you would like";

	// reset everything - will change mechanism if wanting to support multiple texts
	var txtToDestroy = stage.findOne("#addedTxt");
	var oldX = -1;
	var oldY = -1;
	if (txtToDestroy) {
		oldX = txtToDestroy.x();
		oldY = txtToDestroy.y();
		txtToDestroy.destroy();
	} else {
		let newTxtLayer = new Konva.Layer({ id: "txtLayer" });
		stage.add(newTxtLayer);
	}

	var myImg = stage.findOne('#konvaSrcImg');
	var textLayer = stage.findOne("#txtLayer");
	var addedText = new Konva.Text({
		x: (oldX == -1) ? myImg.x() : oldX,
		y: (oldY == -1) ? myImg.y() : oldY,
		text: $("#formCaption").val(),
		fontSize:$("#fontSize").val(),
		fontFamily: 'Calibri',
		fill: $("#fontColor").val(),
		draggable: true,
		dragBoundFunc: function(pos) {
			var newX = pos.x;
			var newY = pos.y;
			if (pos.x - 0.5 * this.width() < stage.x()) {
				newX = stage.x() + 0.5 * this.width();
			}
			if (pos.x + 0.5 * this.width() > stage.x() + stage.width()) {
				newX = stage.x() + stage.width() - 0.5 * this.width();
			}
			if (pos.y < stage.y()) {
				newY = stage.y();
			}
			if (pos.y + this.height() > stage.y() + stage.height()) {
				newY = stage.y() + stage.height() - this.height();
			}

			return {
				x: newX,
				y: newY
			};
		},
		id: "addedTxt",
	});
	addedText.offsetX(addedText.width() / 2);
	
	addedText.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	addedText.on('mouseout', function() {
		document.body.style.cursor = 'default';
	});

	textLayer.add(addedText);
	textLayer.batchDraw();
};

function download_image(newLeft, newRight, newTop, newBottom) {
	// does not support IE
	var a = document.createElement("a");
	document.body.appendChild(a); // must do for firefox, not necessary for chrome
	a.href = downloadStage.toDataURL({
		x: newLeft,
		y: newTop,
		width: newRight - newLeft,
		height: newBottom - newTop
	});
	a.download = "meme.png";
	a.click();
	document.body.removeChild(a);
	delete a;	
}

save_photo = function() {
	var downloadKonvaImage = downloadStage.findOne("#konvaDownloadImage");

	var downloadKonvaImageLeft = downloadKonvaImage.x() - 0.5 * downloadKonvaImage.width();
	var downloadKonvaImageRight = downloadKonvaImage.x() + 0.5 * downloadKonvaImage.width();
	var downloadKonvaImageTop = downloadKonvaImage.y() - 0.5 * downloadKonvaImage.height();
	var downloadKonvaImageBottom = downloadKonvaImage.y() + 0.5 * downloadKonvaImage.height();

	var oldDownloadTxtLayer = downloadStage.findOne("#downloadTxtLayer");
	if (oldDownloadTxtLayer) {
		oldDownloadTxtLayer.destroy();
	}
	var txtToCpy = stage.findOne("#addedTxt");
	if (!txtToCpy) {
		download_image(downloadKonvaImageLeft, downloadKonvaImageRight, downloadKonvaImageTop, downloadKonvaImageBottom);
		return;
	}
	var newDownloadTxtLayer = new Konva.Layer({ id: "downloadTxtLayer" });
	downloadStage.add(newDownloadTxtLayer);
	console.log("factor:", windowResizeFactor);
	console.log("x,y", txtToCpy.x(), txtToCpy.y());
	console.log("x.,y.", txtToCpy.x() / windowResizeFactor, txtToCpy.y() / windowResizeFactor);
	var addedText = new Konva.Text({
		x: txtToCpy.x(),
		y: txtToCpy.y(),
		text: $("#formCaption").val(),
		fontSize:$("#fontSize").val(),
		fontFamily: 'Calibri',
		fill: $("#fontColor").val(),
		id: "downloadAddedTxt",
	});
	addedText.offsetX(addedText.width() / 2);
	newDownloadTxtLayer.add(addedText);
	newDownloadTxtLayer.batchDraw();

	var addedTextLeft = addedText.x() - 0.5 * addedText.width();
	var addedTextRight = addedText.x() + 0.5 * addedText.width();
	var addedTextTop = addedText.y();
	var addedTextBottom = addedText.y() + addedText.height();

	var newLeft = (addedTextLeft < downloadKonvaImageLeft) ? addedTextLeft : downloadKonvaImageLeft;
	var newRight = (addedTextRight > downloadKonvaImageRight) ? addedTextRight : downloadKonvaImageRight;
	var newTop = (addedTextTop < downloadKonvaImageTop) ? addedTextTop : downloadKonvaImageTop;
	var newBottom = (addedTextBottom > downloadKonvaImageBottom) ? addedTextBottom : downloadKonvaImageBottom;

	download_image(newLeft, newRight, newTop, newBottom);
}