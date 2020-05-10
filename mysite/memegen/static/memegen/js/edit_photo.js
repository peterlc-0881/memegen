// @TODO: handle window resizing
// @TODO: use consistent variable naming conventions

// placeholder values
var windowW = window.innerWidth;
var windowH = window.innerHeight;
const IMAGE_MARGIN = 200; //leaves room for text to hang off the image
const MIN_SIZE = 600;

// initialize Konva stage -> needs to be global var
var stage;

/*
function resizeStage() {
	var container = document.getElementById("stage");
	var cWidth = container.offsetWidth;

	var stageWidth = this.stage.width();
	var stageHeight = this.stage.height();
	var scale = cWidth / stageWidth;
	
	this.stage.width(stageWidth * scale);
	this.stage.height(stageHeight * scale);
	this.stage.scale({
		x: scale,
		y: scale
	});
	this.stage.draw()
}

window.addEventListener('resize', resizeStage);
*/

window.onload = function() {
	var src_img = document.getElementById("srcImg");

	var imgScale = 1;
	// Account for very small images (to make editing easier)
	if (src_img.width < MIN_SIZE || src_img.height < MIN_SIZE) {
		let imgScaleX = (MIN_SIZE) / src_img.width;
		let imgScaleY = (MIN_SIZE) / src_img.height;

		imgScale = (imgScaleX > imgScaleY) ? imgScaleY : imgScaleX;		
	}

	// Account for images larger than the window
	if (src_img.width > window.innerWidth || src_img.height > window.innerHeight) {
		let imgScaleX = (windowW - IMAGE_MARGIN) / src_img.width; // accounting for image padding
		let imgScaleY = (windowH - IMAGE_MARGIN) / src_img.height;

		imgScale = (imgScaleX > imgScaleY) ? imgScaleY : imgScaleX;
	}
	else {
		this.windowW = src_img.width + IMAGE_MARGIN;
		this.windowH = src_img.height + IMAGE_MARGIN;			
	}

	stage = new Konva.Stage({
		container: 'container',
		width: this.windowW,
		height: this.windowH,
	});

	var borderLayer = new Konva.Layer();
	this.stage.add(borderLayer);

	var border = new Konva.Rect({
		x: 0,
		y: 0,
		width: this.windowW,
		height: this.windowH,
		stroke: 'black',
		strokeWidth: 1,
	});

	borderLayer.add(border);
	borderLayer.batchDraw();

	var layer = new Konva.Layer();
	this.stage.add(layer);
	
	var img = new Konva.Image({
		x: this.windowW / 2,
		y: this.windowH / 2,
		image: src_img,
		width: src_img.width,
		height: src_img.height,
		scaleX: imgScale,
		scaleY: imgScale,
		id: 'srcImg',
	});

	img.offsetX(img.width() / 2);
	img.offsetY(img.height() / 2);

	layer.add(img);
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

	// reset everything - will change mechanism if wanting to support multiple texts
	var layerToDestroy = stage.findOne("#txtLayer");
	if (layerToDestroy) {
		layerToDestroy.destroy();
	}

	var myImg = stage.findOne('#srcImg');
	var textLayer = new Konva.Layer({ id: "txtLayer" });
	var addedText = new Konva.Text({
		x: myImg.x(),
		y: myImg.y(),
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
	stage.add(textLayer);
};

function download_image(newX, newY, newWidth, newHeight) {
	// does not support IE
	var a = document.createElement("a");
	document.body.appendChild(a); // must do for firefox, not necessary for chrome
	a.href = stage.toDataURL({
		x: newX,
		y: newY,
		width: newWidth - newX,
		height: newHeight - newY
	});
	a.download = "meme.png";
	a.click();
	document.body.removeChild(a);
	delete a;	
}

save_photo = function() {
	var srcImage = stage.findOne("#srcImg");
	var srcImageW = srcImage.x() + 0.5 * srcImage.width();
	var srcImageH = srcImage.y() + 0.5 * srcImage.height();
	var srcImageX = srcImage.x() - 0.5 * srcImage.width();
	var srcImageY = srcImage.y() - 0.5 * srcImage.height();
	
	var addedText = stage.findOne("#addedTxt");
	// if the user did not add text (still allow to download image)
	if (!addedText) {
		download_image(srcImageX, srcImageY, srcImageW, srcImageH);
		return;
	}

	var addedTextW = addedText.x() + 0.5 * addedText.width();
	var addedTextH = addedText.y() + 0.5 * addedText.height();
	var addedTextX = addedText.x() - 0.5 * addedText.width();
	var addedTextY = addedText.y() - 0.5 * addedText.height();

	var newX = (addedTextX < srcImageX) ? addedTextX : srcImageX;
	var newY = (addedTextY < srcImageY) ? addedTextY : srcImageY;
	var newWidth = (addedTextW > srcImageW) ? addedTextW : srcImageW;
	var newHeight = (addedTextH > srcImageH) ? addedTextH : srcImageH;

	download_image(newX, newY, newWidth, newHeight);
}