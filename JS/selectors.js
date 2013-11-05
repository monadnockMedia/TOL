var url = "http://server.local:8080/story"
var max = 9;
$.fx.interval = 40;	
	var currentID;
	var art;
	
	

$(function() {
	$( "#container" ).draggable(
		{
			axis: "x",
			snap: "#content",

		});
});

function loadSingle(_id){
	console.log("incrementID: "+_id)
	if(_id > max){	currentID = 1}else if (_id < 1){currentID = max}else{currentID = _id};
	console.log("targetID: "+currentID)

	var id_url = url+"/"+currentID;
	
	$("#lightbox").load(id_url,function(){
		art = $(".artifact","#lightbox" );
			$("#footer").find("p").remove();
			$("#footer").prepend(art);
			$(".artifact", "#lightbox").remove();
			
		$(".ship_section img").load(function(i){
			
		
			var imgsrc = this.src;
			var bgStr = String("url("+imgsrc+")");
				var newCss = {};
			newCss["background-image"] = bgStr;
			console.log("resizing single images");
			var maxWidth = 500;
			var maxHeight = 525;
		
			var imgsrc = this.src;
			var scale = 1;
			var imgWidth = this.width;
			var imgHeight = this.height;
			scale = (imgWidth > imgHeight) ? maxWidth / imgWidth : maxHeight / imgHeight; //is it landscape or portrait
			var wide = imgWidth*scale;
			var high = imgHeight*scale;
			newCss.height = high;
			newCss.width = wide;
//			$(this).css(newCss);
//			$(this).parent().width(wide);
			var line = String(wide)+"px "+String(high)+"px";
			newCss["background-size"] = line;
//			newCss.height = high;
//			newCss.width = wide;
			$(this).parent().css(newCss);
			$(this).remove();
			$("#lightbox").addClass("active");
		});
	})
}

$('body').on('click',".ship_section", function (){
    var id = $(this).attr("id");
	$("#container").removeClass("active");
	loadSingle(id);
});

$('body').on('click',".arr", function (){
	var dir = ($(this).attr("id") == "prev") ? -1 : 1;
    var id = parseInt(currentID) + dir;
	console.log("changing page, direction = "+dir+" next ID = "+id)
	loadSingle(id);
});

$("body").on('click',"#close",function(){
	$("#footer").find("p").remove();
	$("#lightbox").removeClass("active");
	$("#container").addClass("active");
	console.log("closing lightbox")
});

$.fn.redraw = function(){
  $(this).each(function(){
    var redraw = this.offsetHeight;
  });
};



//$("#tips").cycle({fx:"scrollHorz"});

$("#content").load(url, function(){
	pad = parseInt($(".ship_section").css('margin'));
	var maxWidth = $(this).width()/3-2*pad;
	var maxHeight = $(this).height()/5;
	console.log("max: "+maxWidth+"x"+maxHeight)
	$("img").load(function(i){
		var newCss = {};
		var imgsrc = this.src;
		var bgStr = String("url("+imgsrc+")");
		newCss["background-image"] = bgStr;
		
		var scale = 0;
		var shipWidth = this.width;
		var shipHeight = this.height;
	//	scale = (shipWidth > shipHeight) ? maxWidth / shipWidth : maxHeight / shipHeight; //is it landscape or portrait
		scale =  maxWidth / shipWidth; //is it landscape or portrait
	//	scale =  maxHeight / maxWidth; 
		console.log("scale:"+scale);
		var wide = maxWidth;
		var high = shipHeight*scale;
		var line = String(wide)+"px "+String(high)+"px";
		newCss["background-size"] = line;
		newCss.height = high;
		newCss.width = wide;
		$(this).parent().css(newCss);
		$(this).remove();
	});
})
