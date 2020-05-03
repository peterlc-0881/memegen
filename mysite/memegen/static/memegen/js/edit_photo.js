change_photo = function() {
	console.log("help!");

	var canvas = document.getElementById("img-canvas");
	var src_img = document.getElementById("src-img");
	$(src_img).hide();

	console.log($(src_img).height() + ", " + $(src_img).width());

	$(canvas).height($(src_img).height() + 100)
		.width($(src_img).width());

	var ctx	= canvas.getContext("2d");

	ctx.drawImage(src_img, 10, 10);

	ctx.lineWidth=1;
	ctx.fillStyle="#CC00FF";
	ctx.lineStyle="#ffff00";
	ctx.font="18px sans-serif";
	ctx.fillText($("#form_caption").val(), 50, 50);
}