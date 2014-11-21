//Create a new GoPro remote from node module
//module must be cupofnestor branch
var path = require('path');
var lw = require('lwip');
var fs = require('fs');
var debug = false;
var savedPics = new Array();
var exp = 16;
var blur_amt = 12;

//note new node requisites
//easyimage requires imagemagick from homebrew
//var rq = require('request');
//var fs = require('fs');
var cv = require('opencv');
var Canvas = require("canvas");
var tmp = require('tmp');
var when = require('when');
var ezi = require('easyimage');
var dg = require('dgram');
var ex = require('child_process').exec;
var tmpName;
var settings = {};
var AMX = {};

function transformFace(f){
	var w = f.width * 0.8;
	var h = f.height * 1.2;
	
	var dw = f.width - w;
	var dh = f.height - h;
	
	var dx = f.x+(dw/2);
	var dy = f.y+(dh/2);
	
	
	return {
		width: w,	height: h,
		x: dx,		y: 		dy 
	};
}


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

//crop image and id faces
function do_cv(_f){
	
	var cropped = null;
	var tracked = null;
	var mask = null;
	var dfd = when.defer();
	
	//read the image
	cv.readImage(_f, function(e,i){
		var res = {};
		var img = i;
		var dimen = 600;
		var w = img.width();
		var h = img.height();
		var dw = w-dimen;
		var dh = h-dimen;
		
		cropped = img.crop(dw/2, dh/2, dimen, dimen);
		var crop_path = _f+"_crop.png"
		cropped.save(crop_path);
		
		
		//detect face object using the cascade xml
		cropped.detectObject(cv.FACE_CASCADE, {}, function(err, faces){  
				if (faces.length == 0){ dfd.reject("No Face Detected");
				console.log("ERROR",err,faces.length);
				}
				
				
				else{
				mask = new cv.Matrix.Ones(dimen,dimen);
				debug = new cv.Matrix(dimen,dimen);
			
						var f = faces[0];
						var fm = transformFace(faces[0]);
						debugger;
						res.face = f;
						mask.ellipse(	fm.x + fm.width/2, 	fm.y + fm.height/2, 
										fm.width/2, fm.height/2, 
										[255,255 ,255],-1);
									

					
						debug.ellipse(f.x + f.width/2, f.y + f.height/2, f.width/2, f.height/2, [255,0,0],-255);
				
					var debug_path = _f+"_debug.png";
					var mask_path = _f+"_mask.png";
					var blur_path = _f+"blur.png";
					var dfd_blur = when.defer();
					
					
					
					debug.save(debug_path);   
					mask.save(mask_path); 
					var dfd_blur = when.defer();
					var dfds = [loadImage(crop_path),loadImage(mask_path), blur()];
					
					when.all(dfds).then(compose)}
					
					function blur(){
						var dfd = when.defer();
						lw.open(mask.toBuffer({ext: ".png", pngCompression: 0}), 'png', function(e,lwi){
							lwi.blur(blur_amt, function(e,lwi){
								lwi.toBuffer("png",function(e,b){
									var img = new Canvas.Image;
									img.src = b;
									var cnv = new Canvas(img.width, img.height);
									var ctx = cnv.getContext('2d');
									ctx.drawImage(img,0,0);
									
									dfd.resolve(ctx);
								
								});
							})
						})
						return dfd.promise;
					}
					//Load the image
					function loadImage(_path){
						var dfd = when.defer();
						
						fs.readFile(_path, function(e,d){
							var img = new Canvas.Image;
							img.src = d;
							var cnv = new Canvas(img.width, img.height);
							var ctx = cnv.getContext('2d');
							ctx.drawImage(img,0,0);
							dfd.resolve(ctx);
						})
						
					
						
						return dfd.promise;
					}
					
					function compose(_res){
						console.log(_res);
						var src = _res[0];
						var mask = _res[2];
						var w = src.canvas.width;
						var h = src.canvas.height;
						var srcData = src.getImageData(0,0,w,h);
						var maskData = mask.getImageData(0,0,w,h);

					

						var cnv = new Canvas(w, h);
						var ctx = cnv.getContext('2d');
						var imgData = ctx.createImageData(w,h);

						for (var i=0;i<imgData.data.length;i+=4)
						  {
						  	var srcLuma = luma(i, srcData.data);
						  //	cropdata.data[i+3]=luma(i);
							imgData.data[i+0]=srcLuma+exp%255;
							imgData.data[i+1]=srcLuma+exp%255;
							imgData.data[i+2]=srcLuma+exp%255;
							imgData.data[i+3]=luma(i, maskData.data);
						  }
						ctx.putImageData(imgData,0,0);
						res.masked_face = cnv.toDataURL();
						dfd.resolve(res);
					}

					function luma(i, data){
						var sum = 0;
						for (var j = 0; j < 3; j++){
							sum+=data[i+j];
						}
						
						return sum/3;
					}
		});
		
		
	
		
	});

	mask = null;
	cropped = null;
	return dfd.promise;
}



settings.reset = function(){
	settings.request.sources = [];
}

//END SETUP STUFF




function Photo(){
	//CONSTRUCTOR
	//Some basic vars
	var self = this;
	this.flash = new Buffer("flash\r");
	this.client = dg.createSocket("udp4");
}

Photo.prototype.reset = settings.reset;
Photo.prototype.snap = function(){

	var self = this;
	console.log("//SNAP//");
	var dfd = when.defer();
	
	//create temporary file name
	tmp.tmpName(function(e,p){
		if(e){
			dfd.reject(e);
		}
		//call AMX to trigger cam flash
		self.client.send(self.flash, 0, self.flash.length, AMX.port, AMX.ip, function(err, bytes) {
		  //client.close();
		});
		var tmpName = p+".png"
		
		//make the command to capture webcam image
		var wacaw = path.resolve("BIN/wacaw");
		var cmd = wacaw+" --png -x 1280 -y 720 "+p;
		
		//capture an image
		var proc = ex(cmd, function(err,so,se){
			if(err){
				console.log("snap error");
				dfd.reject(err);
			}else if(se){
				console.log("standard error");
				dfd.reject(se);
			}
			
			//call the cv function to id faces and mask image
			do_cv(tmpName).then(function(d){
				proc.kill("SIGINT");
				settings.request.sources.push(
					{ 	
						faceID: null, 
						face:d.masked_face,
						rect:d.face,
						mask:d.mask
					}
				);
				dfd.resolve(settings.request);
			}).catch(function(e){
				debugger;
				dfd.reject(e);
				})
		
			
			
		})
		
		
	})
	
	return dfd.promise;
}

module.exports = Photo;
















