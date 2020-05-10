// @TODO: handle window resizing
// @TODO: use consistent variable naming conventions

var windowW = window.innerWidth;
var windowH = window.innerHeight;

var stage = new Konva.Stage({
	container: 'container',
	width: windowW,
	height: windowH
});

window.onload = function() {
	var layer = new Konva.Layer();
	this.stage.add(layer);
	
	// @TODO: handle very large images (and probably very small images too)
	var src_img = document.getElementById("srcImg");
	var img = new Konva.Image({
		x: windowW / 2 - src_img.width / 2,
		y: windowH / 2,
		image: src_img,
		width: src_img.width,
		height: src_img.height,
		id: 'srcImg'
	});

	img.offsetX(img.width() / 2);
	img.offsetY(img.height() / 2);

	layer.add(img);
	layer.batchDraw();

	document.getElementById("container").style = "border:1px solid #000000;";
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
		id: "addedTxt"
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

save_photo = function() {
	var addedText = stage.findOne("#addedTxt");
	var srcImage = stage.findOne("#srcImg");
	var addedTextW = addedText.x() + 0.5 * addedText.width();
	var addedTextH = addedText.y() + 0.5 * addedText.height();
	var addedTextX = addedText.x() - 0.5 * addedText.width();
	var addedTextY = addedText.y() - 0.5 * addedText.height();
	var srcImageW = srcImage.x() + 0.5 * srcImage.width();
	var srcImageH = srcImage.y() + 0.5 * srcImage.height();
	var srcImageX = srcImage.x() - 0.5 * srcImage.width();
	var srcImageY = srcImage.y() - 0.5 * srcImage.height();

	var newX = (addedTextX < srcImageX) ? addedTextX : srcImageX;
	var newY = (addedTextY < srcImageY) ? addedTextY : srcImageY;
	var newWidth = (addedTextW > srcImageW) ? addedTextW : srcImageW;
	var newHeight = (addedTextH > srcImageH) ? addedTextH : srcImageH;

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