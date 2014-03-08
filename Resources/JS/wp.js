
/*client.methodCall('wp.getPost', [0,"monadnock","nomad",1], function (error, value) {
    // Results of the method response
    console.log('Method response for wp.getPost: ' + value);
	console.log(value);
 })*/
var xmlrpc = require('xmlrpc');
var mime = require("mime");
var when = require('when');

function wp(){
	
	this._client = xmlrpc.createClient({ host: 'monadnock.or.gs', path: '/wordpress/xmlrpc.php'});
	this._params = {
		blog_id:0,
		username:"monadnock",
		password:"nomad",
	}
}
wp.prototype._rpcCall = function(uri, paramObj){
		var dfd = when.defer();
		p = this._params;
		this._client.methodCall(uri, [0,p.username,p.password,paramObj], function (err, res) {
	    // Results of the method response
		if (err) return dfd.reject(err);
		return dfd.resolve(res);

	 })
	return dfd.promise;
}

wp.prototype.getPosts = function(){
	pObj = {"parent_id":"1"};
	return this._rpcCall('wp.getMediaLibrary', pObj);
}



wp.prototype.postIMG = function(path, name, bits, id){
	this._client.methodCall('wp.uploadFile', 
		[
			0,"monadnock","nomad",
				{
					"name":name,
					"type":mime.lookup(path),
					"bits":bits,
					"post_id":id
				}
		], function (error, value) {
					
					console.log(value);
				})
}


wp.prototype.postIMGRPC = function(name, bits, id){
	pObj =
		{
			"name":name,
			"type":mime.lookup(name),
			"bits":bits,
			"post_id":id
		}
	return this._rpcCall('wp.uploadFile', pObj);
}

wp.prototype.helloWorld = function(){
	return "Hello, Node nerd."
}



exports.wp = wp;
