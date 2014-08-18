//Create a new GoPro remote from node module
//module must be cupofnestor branch
var Camera = require('gopro').Camera
var debug = false;
var savedPics = new Array();

//note new node requisites
//easyimage requires imagemagick from homebrew
var rq = require('request');
var fs = require('fs');
var tmp = require('tmp');
var when = require('when');
var ezi = require('easyimage');
var dg = require('dgram');

var tmpName;
var settings = {};
var AMX = {};
AMX.ip = "192.168.1.200";
//AMX.ip = "127.0.0.1"
AMX.port = 8899;

settings.getImageURL = function(ID){
	return settings.request.dir+settings.request.sources[ID].filename+"."+settings.request.ext;
}

//the request object, as described in req_structure.json
settings.request = {origin:"client",ext:"jpg",command:"replace",tgImageID:null,dir:tmp.tmpdir,processedImage : null, sources:[]};
settings.dbrequest = {origin:"client",ext:"jpg",command:"replace",tgImageID:null,dir:tmp.tmpdir,processedImage : null, sources:[{filename: "sara1", faceID: 1},{filename: "sara2", faceID: 2},{filename: "boo", faceID: 0}]};
//get tmp dir for the request.
settings.ezoption = function(_s,_d){
	return {
		src:_s,			dst:_d,	
		cropwidth: 600,		cropheight:600,
		quality: 100,		gravity:"Center"
	}
}
//this function helps create a new target image object.
settings.source = function(_f){
	return {filename: _f, faceID: null}
}

settings.reset = function(){
	settings.request.sources = [];
}

//END SETUP STUFF




var photo = function(){
	//CONSTRUCTOR
	//Some basic vars
	var camHost = "http://10.5.5.9:8080"
	var imgDir ="/videos/DCIM/101GOPRO/";
	var lastImg;
	var lastUrl;
	
	
	var self = this;
	this.cam = new Camera('10.5.5.9', 'goprongl');
	var flash = new Buffer("flash\r");
	var client = dg.createSocket("udp4");
	
	//Setup the camera
/*	with (this.cam){  //with changes the scope, all functions or props in the brackets are cam's
		powerOn();
		stopCapture();
	    mode = "photo";
	//    beepOff();
	    photoResolution = "5mpm"
	}*/
	
	this.cam.powerOn().then(
		self.cam.stopCapture().then(function(){
			self.cam.mode = "photo";
			self.cam.photoResolution = "5mp";}
			)
	)
	
	//METHODS
	this.snap = function(){
		console.log("//SNAP//");
		this.main_dfd = when.defer();
	//	this.cam.mode = "photo";
		client.send(flash, 0, flash.length, AMX.port, AMX.ip, function(err, bytes) {
		  //client.close();
		});
		//startCapture takes a single image in photo mode.
		//then is a callback provided by the deffered object
		this.cam.startCapture().then(
			function(d)
			{
				self.cam.stopCapture();
				//hate hate hate timeouts, but it is necessary to ensure that the image has been saved to memory.
				window.setTimeout(
					self.loadImage
				,2000);  
			}
		)
		return this.main_dfd.promise;
	}
	
	this.loadImage = function(){
		console.log("//LOAD//");
		//var li_dfd = when.defer();
		// ls function returns a deffered.
		self.cam.ls(imgDir).then(
			
			function(d){
				console.log("//LIST//");
				console.log(d);
				//console.log(dfd);  //inspect the deferred object	
				//when the deferred is resolved, get the string uri of the last image taken.
				lastImg = d[d.length-1];
				lastUrl = camHost+imgDir+lastImg.name;

				//get the image and then load it in to the image div
				self.getImage(lastUrl);

			}),
			//then() second arg is a callback for error handling
			function(err){
				console.log(err);
			}
	//	return li_dfd.promise;
	}
	
	this.getImage = function(camUrl){
		console.log("//GET//");
		//create a defered response.
		//var gi_dfd = when.defer();
		//create a temporary file(name) to pipe the image to.
		tmp.tmpName(function _tempNameGenerated(e, p) {
		    if (e) throw e; //if there is an error

			//if not, att jpg to the filename just for the fuck of it.
		    tmpName = p+"."+settings.request.ext;

			//slice the directory path off of the tmpName to give a base filename to the server
			var fname = (debug) ? "sara1" : p.slice(settings.request.dir.length);
			settings.request.sources.push(new settings.source(fname));

			//finally, request the image and pipe it to the file, resolving the defered once the pipe is closed.
			rq(camUrl).pipe(fs.createWriteStream(tmpName)).on('close', function(){
				//resolve to return the path of the file we created.
				//cam.deleteLast();
				self.cam.deleteLast();
				var options = settings.ezoption(tmpName, tmpName);
				
				ezi.crop( options, function(e,i){
					
						//console.log("error",e);
						//self.main_dfd.reject(e)
				
						self.main_dfd.resolve(settings.request);
					
					
				})

			});
		});
	//	return gi_dfd.promise;
	}
	
}


















