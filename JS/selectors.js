var url = "http://server.local:8080/story"
var max = 9;
var scrolling = false;
//$.fx.interval = 40;	

var currentID;
var art;
var curScreen = 1;	
var direction = false;
	
//Cycle the text at the top of the window
$("#tips").cycle({fx:"scrollUp"});
	


//Load a single page from DB, rezize images to fit, and move img src to backgorund of div..
function loadSingle(_id){
	console.log("incrementID: "+_id)
	if(_id > max){	currentID = 1}else if (_id < 1){currentID = max}else{currentID = _id};
	console.log("targetID: "+currentID);

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
				newCss.height = high/1.1;
				newCss.width = wide;
	//			$(this).css(newCss);
	//			$(this).parent().width(wide);
				var line = String(wide)+"px "+String(high)+"px";
				newCss["background-size"] = line;
	//			newCss.height = high;
	//			newCss.width = wide;
				newCss.visibility = "visible";
				newCss.opacity = "1";
				$(this).parent().css(newCss);
				$(this).remove();
				$("#lightbox").addClass("active");
			});
	})
}

//handles clicking on ships in "gallery" view.
$('body').on('click',".ship_section", shipclick);

function shipclick(){
	if(!scrolling && curScreen == 1){
		console.log("shipclick");
		$("#tips").animate({opacity:0}, 150, function() {});
		$("#thumbnail").animate({opacity:1}, 150, function() {});
		$("#makeMeScrollable").animate({opacity:0}, 150, function() {});
		$("#makeMeScrollable2").animate({opacity:0}, 150, function() {});
		curScreen = 2;
		var id = $(this).attr("id");
		$("#container").removeClass("active");
		$(".ship_section").addClass("nomargin");
		loadSingle(id);
	}
}





//click handler for arrows in individual section
$('body').on('click',".arr", function (){
	var dir = ($(this).attr("id") == "prev") ? -1 : 1;
    var id = parseInt(currentID) + dir;
	console.log("changing page, direction = "+dir+" next ID = "+id)
	loadSingle(id);
});

//click handler for close "X" to close ind	ividual window.
$("body").on('click',"#close",function(){
	curScreen = 1;
	$("#tips").animate({opacity:1}, 150, function() {});
	$("#makeMeScrollable").animate({opacity:1}, 150, function() {});
	$("#makeMeScrollable2").animate({opacity:1}, 150, function() {});
	$("#thumbnail").animate({opacity:0}, 150, function() {});
	$("#footer").find("p").remove();
	$("#lightbox").removeClass("active");
	$("#container").addClass("active");
});


//loads content for "gallery", resizing images and moving them to the background.
$(".content").load(url, function(){
	pad = parseInt($(".ship_section").css('margin'));
	var maxWidth = $(this).width()/3-2*pad;
	var maxHeight = $(this).height()/5;
	console.log("max: "+maxWidth+"x"+maxHeight);
	
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
		var wide = maxWidth;
		var high = shipHeight*scale;
		var line = String(wide)*1.2+"px "+String(high)*1.4+"px";
		newCss["background-size"] = line;
		newCss.height = high*1.4;
		newCss.width = wide*1.2;
		newCss.visibility = "visible";
		newCss.opacity = "1";
		$(this).parent().css(newCss);
		$(this).remove();
	});
	
	$("div#makeMeScrollable").smoothDivScroll({
		autoScrollingMode: "onStart",
		autoScrollingDirection: "endlessLoopRight",
		hotSpotScrolling: false,
		touchScrolling: false,
		manualContinuousScrolling: true,
		mousewheelScrolling: false,
		autoScrollingStep: 5,
		mousewheelScrollingStep: 90
	});
	
	$("div#makeMeScrollable2").smoothDivScroll({
		autoScrollingMode: "onStart",
		autoScrollingDirection: "endlessLoopLeft",
		hotSpotScrolling: false,
		touchScrolling: false,
		manualContinuousScrolling: true,
		mousewheelScrolling: false,
		autoScrollingStep: 4,
		mousewheelScrollingStep: 90
	});
});

$( "#makeMeScrollable" ).mousedown(function() {
  console.log("Click");
  $("#makeMeScrollable").smoothDivScroll("stopAutoScrolling");
});

$( "#makeMeScrollable" ).mouseup(function() {
  console.log("Un-Click");
  $("#makeMeScrollable").smoothDivScroll("startAutoScrolling");
});

$( "#makeMeScrollable2" ).mousedown(function() {
  console.log("Click");
  $("#makeMeScrollable2").smoothDivScroll("stopAutoScrolling");
});

$( "#makeMeScrollable2" ).mouseup(function() {
  console.log("Un-Click");
  $("#makeMeScrollable2").smoothDivScroll("startAutoScrolling");
});

