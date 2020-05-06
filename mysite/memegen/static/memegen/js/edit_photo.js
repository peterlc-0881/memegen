// @TODO: handle window resizing

var windowW = window.innerWidth;
var windowH = window.innerHeight;

var stage = new Konva.Stage({
	container: 'container',
	width: windowW,
	height: windowH
});

window.onload = function() {
	console.log(windowW, windowH);
	var layer = new Konva.Layer();
	this.stage.add(layer);
	
	// @TODO: handle very large images (and probably very small images too)
	var src_img = document.getElementById("src-img");
	var img = new Konva.Image({
		x: windowW / 2,
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
};


/*
window.onload = function () {
	console.log("hi!");
	var canvas = document.getElementById("img-canvas");
	var src_img = document.getElementById("src-img");
	var ctx = canvas.getContext("2d");
	
	ctx.drawImage(src_img, 0, 100);
};
*/
change_photo = function() {

	/*
	//@TODO: validate user input

	console.log("hi!");

	const canvas = document.getElementById("img-canvas");
	const src_img = document.getElementById("src-img");

	/*
	$(src_img).hide();
	canvas.hidden = false;

	console.log($(src_img).height() + ", " + $(src_img).width());

	$(canvas).height($(src_img).height() + 20)
		.width($(src_img).width() + 20);
	var ctx	= canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.drawImage(src_img, 0, 100);

	console.log($("#font_size").val());
	console.log("Color: " + $("#font_color").val());

	ctx.lineWidth=1;
	ctx.fillStyle=$("#font_color").val();
	ctx.lineStyle="#ffff00";
	ctx.font=$("#font_size").val() + "px sans-serif";
	ctx.fillText($("#form_caption").val(), $("#xcoord").val(), $("#ycoord").val());

	//$(canvas).show();
	*/

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
		text: $("#form_caption").val(),
		fontSize:$("#font_size").val(),
		fontFamily: 'Calibri',
		fill: $("#font_color").val(),
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
	/*
	console.log("YES!");
	const canvas = document.getElementById("img-canvas");
	const src_img = document.getElementById("src-img");
	var ctx = canvas.getContext("2d");
	
	var temp_canvas = document.createElement("canvas");

	// @TODO: implement dynamic method of setting width and height
	temp_canvas.width = src_img.width + 200;
	temp_canvas.height = src_img.height + 200;

	var t_ctx = temp_canvas.getContext("2d");
	t_ctx.drawImage(canvas, 100, 100);
	
	// Check for browser compatibility
	if (window.navigator.msSaveBlob) {
		// for IE / Edge
		window.navigator.msSaveBlob(temp_canvas.msToBlob(), "meme.png");
	}
	else {
		let a = document.createElement("a");
		document.body.appendChild(a); // must do for firefox, not necessary for chrome
		a.href = temp_canvas.toDataURL();
		a.download = "meme.png";
		a.click();
		document.body.removeChild(a);
	}
	*/

	console.log(stage.x(), stage.y());

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

	console.log("(x,y):", newX, newY, "(w,h):", newWidth, newHeight);
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