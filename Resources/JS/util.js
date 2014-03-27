var fs = require('fs');
var wp = require("wpmedia");
var when = require("when")

w = new wp();
var upload = function(url, name){
	fs.readFile(url, function(err,data){
		if(err) throw err;
		w.postIMGRPC(name, data, 1).then(function(d){console.log(d)})
	})
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
		subject: "Greetings from Toledo",
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