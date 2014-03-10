//Create a new GoPro remote from node module
//module must be cupofnestor branch
var Camera = require('gopro').Camera
var cam = new Camera('10.5.5.9', 'goprongl')
var savedPics = new Array();


//note new node requisites
var rq = require('request');
var fs = require('fs');
var tmp = require('tmp');
var when = require('when');

var tmpName;

//Setup the camera
with (cam){  //with changes the scope, all functions or props in the brackets are cam's
	powerOn()
    mode = "photo";
//    beepOff();
    photoResolution = "5mpm"
}

//Main function for snapping an image
var snap = function(){
	//startCapture takes a single image in photo mode.
	//then is a callback provided by the deffered object
	cam.startCapture().then(
		function(d)
		{
			$("#snap").animate({opacity:0});
			//hate hate hate timeouts, but it is necessary to ensure that the image has been saved to memory.
			window.setTimeout(loadImage,2000);  
		}
	) 
}

//Load the image using a deffered object 
//http://api.jquery.com/category/deferred-object/

//Some basic vars
var camHost = "http://10.5.5.9:8080"
var imgDir ="/videos/DCIM/100GOPRO/";
var lastImg;
var lastUrl;

var loadImage = function(){
	//("loadImage()");
	// ls function returns a deffered.
	cam.ls(imgDir).then(
		function(dfd){
			console.log(dfd);  //inspect the deferred object
			//when the deferred is resolved, get the string uri of the last image taken.
			lastImg = dfd[dfd.length-1];
			lastUrl = camHost+imgDir+lastImg.name;
			
			//get the image and then load it in to the image div
			getImage(lastUrl).then(function(d){
				savedPics.push(d);
				$("#snap").attr("src",d);
				$("#snap").load(function(){
					$("#snap").animate({opacity:1}, 400)
					cam.deleteLast();
				});
			});
			
		}),
		//then() second arg is a callback for error handling
		function(err){
			//console.log(err);
		}
}

var getImage = function(camUrl){
	//create a defered response.
	var dfd = when.defer();
	//create a temporary file(name) to pipe the image to.
	tmp.tmpName(function _tempNameGenerated(e, p) {
	    if (e) throw e; //if there is an error
	
		//if not, att jpg to the filename just for the fuck of it.
	    tmpName = p+".jpg";
	
		//finally, request the image and pipe it to the file, resolving the defered once the pipe is closed.
		rq(camUrl).pipe(fs.createWriteStream(tmpName)).on('close', function(){
			//resolve to return the path of the file we created.
			dfd.resolve(tmpName)
		});
	});
	return dfd.promise;
}
