change_photo = function() {
	console.log("help!");

	var canvas = document.getElementById("img-canvas");
	var src_img = document.getElementById("src-img");
	$(src_img).hide();
	canvas.hidden = false;

	console.log($(src_img).height() + ", " + $(src_img).width());

	/*
	$(canvas).height($(src_img).height() + 20)
		.width($(src_img).width() + 20);
	*/
	var ctx	= canvas.getContext("2d");

	ctx.drawImage(src_img, 10, 10);

	ctx.lineWidth=1;
	ctx.fillStyle="#000000";
	ctx.lineStyle="#ffff00";
	ctx.font="36px sans-serif";
	ctx.fillText($("#form_caption").val(), 10 + $(src_img).height() / 2, 10 + $(src_img).width() / 2);

	$(canvas).show();
}