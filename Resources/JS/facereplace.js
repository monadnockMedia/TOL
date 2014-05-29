var child = require("child_process");

var gui = require('nw.gui');
//setInterval(focus_window,5000);
var win = gui.Window.get();

function focus_window(){
	console.log("fox");
	win.show();
}

replacer = function(){
	var self = this;
	this.dfd =  null;
	this.startCVServer = false;
	this.socket = null;
	this.serverAppPath = "/Applications/tol_face_replaceDebug.app"
	this.currentRequest;
	this.open = function(){
		if(this.startCVServer){
			startServer();
		}else{
			this.openSocket();
			focus_window();
			win.enterKioskMode();
		}
	}
	
	
	
	var startServer = function(){
		var command = "open "+self.serverAppPath;
		open = child.exec(command, function(e,sout,serr){});
		setTimeout(openSocket,2000);
	}
	
	this.openSocket = function(){
		
		
		console.log("opening");
		this.socket = new WebSocket("ws://localhost:9092");
		this.socket.onmessage = this.message;

		this.socket.onopen = function(e){
			console.log("OPEN");
		}
	}
	
	this.message = function(e){
		console.log("Server Response");
		console.log(e);
		if(e.data){
			mess = JSON.parse(e.data);
			self.dfd.resolve( mess );
		}
	}
	
	this.replace = function( _req ){
		this.dfd = when.defer();
		this.currentRequest = _req;
		console.log("ATTEMPTING REPLACE", self.socket.readyState);
		if(self.socket.readyState === 1){
			console.log("SOCKET OPEN", 	this.currentRequest);
			
			self.socket.send(JSON.stringify(this.currentRequest));
			
			
		}else{
			console.log("SOCKET CLOSED");
			self.socket = new WebSocket("ws://localhost:9092");
			self.socket.onmessage = self.message;
			self.socket.onopen = function(){
				console.log("attempting again ", self.currentRequest);
				self.socket.send(JSON.stringify(self.currentRequest));
			}
			
		
		}
		return this.dfd.promise;
	}
	
	this.watermark = function(_url){
		dfd = when.defer();
		child.exec('composite -gravity southwest IMAGES/watermarksm.png '+_url+" "+_url,
		  function (error, stdout, stderr) {
		    console.log('stdout: ' + stdout);
		    console.log('stderr: ' + stderr);
		    if (error !== null) {
		      console.log('exec error: ' + error);
		    }
			dfd.resolve({"image":_url})
		});
		return dfd.promise;
	}
	
}

