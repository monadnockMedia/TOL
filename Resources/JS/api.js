P = require("./photo.js");
p = new P();

var ex = require('express');
var api = ex();
api.use('/test', ex.static('.'));

api.get('/snap', function(req,res){
	debugger;
	if(req.query.reset){
		p.reset();
		res.type('json');
		res.json({"reset":"array"});
	}else{
		p.snap().then(function(d){
			res.type('json');
			res.json(d);
		}).catch(function(e){
			debugger;
			res.type('json');
			res.json({error:e});
		});
	}

});

api.get('/', function(req,res){
		res.type('json');
		res.json({"hello":"world"});

})

api.listen(2999);