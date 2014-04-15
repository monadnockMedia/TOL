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
	this.startCVServer = true;
	var socket = null;
	this.serverAppPath = "/Applications/tol_face_replaceDebug.app"
	
	this.open = function(){
		if(this.startCVServer){
			startServer();
		}else{
			openSocket();
		}
	}
	
	
	
	var startServer = function(){
		var command = "open "+self.serverAppPath;
		open = child.exec(command, function(e,sout,serr){});
		setTimeout(openSocket,2000);
	}
	
	var openSocket = function(){
		focus_window();
		win.enterKioskMode();
		
		console.log("opening");
		socket = new WebSocket("ws://localhost:9092");
		socket.onmessage = function(e){
			console.log("e.data.error");
			console.log(e.data.error);
			if(e.data){
				mess = JSON.parse(e.data);
				self.dfd.resolve( mess );
			}
		}

		socket.onopen = function(e){
			console.log("OPEN");
			$("#go").click(function(){
				sendImage(o);
				console.log("sending Image object");
			})
		}
	}
	
	this.replace = function( _req ){
		this.dfd = when.defer();
		socket.send(JSON.stringify(_req));
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

