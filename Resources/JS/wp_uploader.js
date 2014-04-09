var fs = require('fs');
var wp = require("wpmedia");
var when = require("when")

w = new wp();

var wordpress = {};

wordpress.upload = function(url, name){
	var dfd = when.defer();
	fs.readFile(url, function(err,data){
		if(err) throw err;
		w.postIMGRPC(name, data, 1).then(function(d){dfd.resolve(d)})
	})
	return dfd.promise;
}

wordpress.uploadAnnotated = function(_url, p){
	var dfd = when.defer();
	var name = p.last+"_"+p.first+".jpg";
	
	this.upload(_url, name).then(function(d){
		w.addAttachmentMetadata(d.id, p).then(function(d){
			dfd.resolve(d);
		})
		
	})
	
	
	return dfd.promise;
}


