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
var ex = require('child_process').exec;
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
	var self = this;
	var flash = new Buffer("flash\r");
	var client = dg.createSocket("udp4");
	
	//METHODS
	this.snap = function(){
		console.log("//SNAP//");
		var dfd = when.defer();
		tmp.tmpName(function(e,p){
			if(e){
				dfd.reject(e);
			}
			
			client.send(flash, 0, flash.length, AMX.port, AMX.ip, function(err, bytes) {
			  //client.close();
			});
			var tmpName = p+".png"
			var wacaw = path.resolve("../BIN/wacaw");
			var cmd = wacaw+" --png "+p;
			ex(cmd, function(err,so,se){
				console.log(err,so,se);
				if(err){
					dfd.reject(err);
				}else if(se){
					dfd.reject(se);
				}
				
				var fname = p.slice(settings.request.dir.length)
				settings.request.sources.push(new settings.source(fname));
				
				var options = settings.ezoption(tmpName, tmpName);
				ezi.crop( options, function(e,i){
					
						//console.log("error",e);
						//self.main_dfd.reject(e)
				
						dfd.resolve(settings.request);
					
					
				})
				
				
			})
			
			
		})
		
		return dfd.promise;
	}
	

	

	
}


















