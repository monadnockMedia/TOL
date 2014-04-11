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

var nodemailer = require('nodemailer');


var mailer = function(){
	var smtp = nodemailer.createTransport("SMTP",{
		host: "mail.inlandseas.org",
		auth: {
		        user: "photobooth@inlandseas.org",
		        pass: "5p?&S5Z1CL(%"
		    }
	});
	
	var options = {
		from: "Trip of a Lifetime <photobooth@inlandseas.org>",
		to: " ",
		subject: "Greetings from the National Museum of the Great Lakes",
		text:" ",
		html:" ",
		generateTextFromHTML: true
	}
	this.sendmail = function(to,body){
		dfd = when.defer();
		options.to = to;
		options.html = body;
		smtp.sendMail(options, function(e,r){
			if(e){
				dfd.reject(e);
			}else{
				dfd.resolve(r);
			}
		})
		return dfd.promise;
	}

}
var printer = {};

	
	printer.print = function(_url){
		dfd = when.defer();
		child.exec('lp '+_url,
		  function (error, stdout, stderr) {
		    console.log('stdout: ' + stdout);
		    console.log('stderr: ' + stderr);
		    if (error !== null) {
		      console.log('exec error: ' + error);
		    }
			dfd.resolve({"status":"success"})
		});
		return dfd.promise;
	}


