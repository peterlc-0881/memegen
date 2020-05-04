window.onload = function () {
	console.log("hi!");
	var canvas = document.getElementById("img-canvas");
	var src_img = document.getElementById("src-img");
	var ctx = canvas.getContext("2d");
	
	ctx.drawImage(src_img, 0, 100);
};

change_photo = function() {
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