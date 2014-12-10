P = require("./photo.js");
p = new P();
var fs = require('fs');
var Canvas = require("canvas");
var ex = require('express');
var api = ex();
api.use('/test', ex.static('.'));
var tmp = require("tmp")
var bodyParser = require('body-parser');

api.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
api.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
	limit: '50mb'
}));

api.get('/snap', function(req,res){

	if(req.query.reset){
		p.reset();
		res.type('json');
		res.json({"reset":"array"});
	}else{
		p.snap().then(function(d){
			res.type('json');
			res.json(d);
		}).catch(function(e){

			res.type('json');
			res.json({error:e});
		});
	}

});

api.get('/', function(req,res){
		res.type('json');
		res.json({"hello":"world"});

})


api.post('/saveimg', function(req,res){
		console.log("saveimg");
		res.type('json');
		
		var doc = req.body;
		var dataURL = doc.dataURL;
		
		var I = new Canvas.Image();
		I.src = dataURL;
		var cnv = new Canvas(I.width, I.height);
		var ctx = cnv.getContext('2d');
		
		ctx.drawImage(I,0,0);
		
	
		
		tmp.tmpName(function(err, path) {
			doc.path = path+".png";
			debugger;
			res.send(doc);
			console.log("response");
		    fs.writeFile(doc.path, cnv.toBuffer());
			console.log("writeimage");
		});	
})


api.listen(2999);