window.onload = function () {
	console.log("hi!");
	var canvas = document.getElementById("img-canvas");
	var src_img = document.getElementById("src-img");
	var ctx = canvas.getContext("2d");
	
	ctx.drawImage(src_img, 0, 100);
};

change_photo = function() {

	//@TODO: validate user input

	console.log("hi!");

	var canvas = document.getElementById("img-canvas");
	var src_img = document.getElementById("src-img");

	/*
	$(src_img).hide();
	canvas.hidden = false;

	console.log($(src_img).height() + ", " + $(src_img).width());

	$(canvas).height($(src_img).height() + 20)
		.width($(src_img).width() + 20);
	*/
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
};

save_photo = function() {
	console.log("YES!");
	var canvas = document.getElementById("img-canvas");
	var src_img = document.getElementById("src-img");
	var ctx = canvas.getContext("2d");
	
	var temp_canvas = document.createElement("canvas");
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
		a = document.createElement("a");
		document.body.appendChild(a); // must do for firefox, not necessary for chrome
		a.href = temp_canvas.toDataURL();
		a.download = "meme.png";
		a.click();
		document.body.removeChild(a);
	}
}