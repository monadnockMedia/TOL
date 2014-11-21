 var replacer = function(_targets){
	this.targets = _targets;

	
	
}

replacer.prototype.replace = function(_req){
	console.log("REPLACE", _req);
	var debug = false;
	var dfd = new $.Deferred();
	var blendMode = "overlay";
	var sources = _req.sources;
	var source;
	var target = this.targets[_req.tgImageID];
	var targetFace;

//	var dfd_src = $.Deferred();
//	var dfd_tg = $.Deferred();

//	$.when(dfd_src,dfd_tg).done(clone_loop);
	
	var iTg		= new	Image();
	var iSrc;
	
	$(iTg).load(clone_loop)
	
	
	var sources = _req.sources;
	
	var cnv,ctx;
	iTg.src = "./img/"+target.img_uri;
	
	
	function clone_loop(){
		cnv = document.createElement('canvas');
		ctx = cnv.getContext('2d');
		cnv.width = iTg.width;		cnv.height = iTg.height;
		ctx.drawImage(iTg,0,0);
		sources.forEach(function(s){
			iSrc	= new	Image();
			$(iSrc).load(function(d){clone_one});
			source = s;
			iSrc.src = source.face;
	
			targetFace = target.faces[source.faceID];
	
			clone_one();
		})
		
		
		
		dfd.resolve(cnv);
	}
	
	function clone_one(){
		
		
		var tW = targetFace.width;
		var tH = targetFace.height;
		var tX = targetFace.x;
		var tY = targetFace.y;
		var tC = {x:tX+tW/2, y:tY+tH/2};
		
		
		
		var rect = source.rect;
		var siW = iSrc.width;
		var siH = iSrc.height;
		var sW = rect.width;
		var sH = rect.height;
		var sX = rect.x;
		var sY = rect.y;
		var sC = {x:sX + (sW/2), y:sY + (sH/2)};
		
		var scale = tH/sH;

		var sDW = sW*scale;
		var sDH = sW*scale;
		var sDC = {x:rect.x*scale + ((rect.width*scale)/2), y:rect.y*scale + ((rect.height*scale)/2)}
		
	//	var siDX = tC.x - (sDC.x/2+sX*scale);
	//	var siDY = tC.y - (sDC.y/2+sY*scale);
		
		var siDX = tX - rect.x*scale;
		var siDY = tY - rect.y*scale;
			
	//	var sDX = tC.x - (sDC.x/2);
	//	var sDY = tC.y - (sDC.y/2);
		
		var sDX = tX ;
		var sDY = tY;
		
		
		if(debug){
			ctx.strokeStyle="red";
			ctx.rect(tX,tY, tW, tH);
			ctx.stroke();
		}
		ctx.globalCompositeOperation = blendMode;
		ctx.drawImage(iSrc,siDX,siDY,siW*scale,siH*scale);
		
		if(debug){
	
			
			ctx.strokeStyle="purple";
			ctx.rect(sDX,sDY,sDW,sDH);
			ctx.stroke();
		}
		
		
		dfd.resolve(cnv);
	}
	function clone(_src, _tg){
	
		console.log("CLONE");
		var cnv = document.createElement('canvas');
		var ctx = cnv.getContext('2d');
		
		var tW = targetFace.width;
		var tH = targetFace.height;
		var tX = targetFace.x;
		var tY = targetFace.y;
		var tC = {x:tX+tW/2, y:tY+tH/2};
		
		cnv.width = iTg.width;		cnv.height = iTg.height;
		
		var rect = source.rect;
		var siW = iSrc.width;
		var siH = iSrc.height;
		var sW = rect.width;
		var sH = rect.height;
		var sX = rect.x;
		var sY = rect.y;
		var sC = {x:sX + (sW/2), y:sY + (sH/2)};
		
		var scale = tH/sH;

		var sDW = sW*scale;
		var sDH = sW*scale;
		var sDC = {x:rect.x*scale + ((rect.width*scale)/2), y:rect.y*scale + ((rect.height*scale)/2)}
		
	//	var siDX = tC.x - (sDC.x/2+sX*scale);
	//	var siDY = tC.y - (sDC.y/2+sY*scale);
		
		var siDX = tX - rect.x*scale;
		var siDY = tY - rect.y*scale;
			
	//	var sDX = tC.x - (sDC.x/2);
	//	var sDY = tC.y - (sDC.y/2);
		
		var sDX = tX ;
		var sDY = tY;
		
		ctx.drawImage(iTg,0,0);
		if(debug){
			ctx.strokeStyle="red";
			ctx.rect(tX,tY, tW, tH);
			ctx.stroke();
		}
		ctx.globalCompositeOperation = "overlay";
		ctx.drawImage(iSrc,siDX,siDY,siW*scale,siH*scale);
		
		if(debug){
	
			
			ctx.strokeStyle="purple";
			ctx.rect(sDX,sDY,sDW,sDH);
			ctx.stroke();
		}
		
		
		dfd.resolve(cnv);
	}
	
		
	return dfd.promise();
}









replacer.prototype.getImageData = function(_img){
	var w = d.target.width;
	var h = d.target.height;
	
	var cnv = document.createElement("canvas");
	var ctx = cnv.getContext('2d');
	$(cnv).attr({width:w, height:h} );
	ctx.drawImage(this,0,0);
	return ctx.getImageData(0,0,w,h);
}



