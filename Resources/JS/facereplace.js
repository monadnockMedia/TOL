



replacer = function(){
	var self = this;
	this.dfd =  null;
	this.startCVServer = false;
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
		console.log("opening");
		socket = new WebSocket("ws://localhost:9092");
		socket.onmessage = function(e){
			console.log("received");
			console.log(e);
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
	
}

