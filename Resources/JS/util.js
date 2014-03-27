var fs = require('fs');
var wp = require("wpmedia");

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
		html:" "
	}
	this.sendmail = function(to,body){
		options.to = to;
		options.text = body;
		smtp.sendMail(options, function(e,r){
			if(e){
				console.log(e)
			}else{
				console.log("Message Sent:"+r.message);
			}
		})
	}

}