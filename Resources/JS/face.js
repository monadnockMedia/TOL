 var replacer = function(_targets){
	var self = this;
	this.imgDir = "./img/"
	this.targets = _targets;
	this.targets.forEach(function(t,i){
		t.paint = new Image();
		t.paint.src = self.imgDir+t.paint_uri;
	})

}

replacer.prototype.replace = function(_req){
	
	console.log("REPLACE", _req);
	var debug = false;
	var dfd = new $.Deferred();  //main deferred
	var blendMode = "overlay";
	var sources = _req.sources;
	var target = this.targets[_req.tgImageID];
	var ctx, cnv;

	var dfd_wm = $.Deferred();
	var dfd_tg = $.Deferred();

	
	var iTg		= new	Image();
	var iWm		= new	Image();
	
	var replacer = this;

	$.when.apply(this,[dfd_tg, dfd_wm])  //when both target image and watermark are loaded
		.done(function(tg,wm){

			clone_loop.call(replacer).done(function(d){
				dfd.resolve(d);
			})
		});

	
	$(iTg).load(dfd_tg.resolve);
	$(iWm).load(dfd_wm.resolve);
	

	
	var sources = _req.sources;
	
	var cnv,ctx;
	iTg.src = this.imgDir+target.img_uri;
	iWm.src = this.imgDir+"watermarksm.png";

	
	
	function clone_loop(){

		var loop_dfd = new $.Deferred();
		var self = this;
		cnv = document.createElement('canvas');
		ctx = cnv.getContext('2d');
		cnv.width = iTg.width;		
		cnv.height = iTg.height;
		ctx.drawImage(iTg,0,0);
		ctx.drawImage(iWm,0,iTg.height-iWm.height);
		
		var dfds = new Array();

		
		sources.forEach(function(s,i){
			var tmpI = new Image();
			s.image = tmpI;
			dfds.push(new $.Deferred());
			$(tmpI).load(function(d){
			
				dfds[i].resolve();
			});
			
			tmpI.src=s.face;
		})
		
		

		$.when.apply(self, dfds).done(function(){
			console.log("loading complete",this);
			
			sources.forEach(function(s,i){
				clone_one(s)
			});
			var res = {
				
				dataURL:cnv.toDataURL()
			}
			
		
			$.post("http://localhost:2999/saveimg",res).done(function(d){
				loop_dfd.resolve(d);
			});
			
		
		});
		return loop_dfd.promise();
	}
	
	function clone_one(s){
	
	//	var clone_dfd = new $.Deferred();
		this.foo = "bar";
		var iSrc	= new	Image();
		var targetFace = target.faces[s.faceID];
		var iPaint = target.paint;
		iSrc = s.image;
		clone();
		
		function clone(){
	
			var tW = targetFace.width;
			var tH = targetFace.height;
			var tX = targetFace.x;
			var tY = targetFace.y;
			var tC = {x:tX+tW/2, y:tY+tH/2};
		
		
		
			var rect = s.rect;
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
		
		
			function maskPaint(){
				var pad = 20;
				ctx.globalCompositeOperation = "source-over";
				ctx.save();

				ctx.beginPath();
				ctx.moveTo(tX-pad, tY-pad);
				ctx.lineTo(tX+tW+pad,tY-pad);
				/// ... more here - see demo
				ctx.lineTo(tX+tW+pad, tY+tH+pad);
				ctx.lineTo(tX-pad, tY+tH+pad);
				ctx.lineTo(tX-pad,tY+pad);
				ctx.closePath();

				/// define this Path as clipping mask
				ctx.clip();
				
				/// draw the image
				ctx.drawImage(iPaint, 0, 0);

				/// reset clip to default
				ctx.restore();
			}
			
			function drawFace(){
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
				
			}
			maskPaint();
			drawFace();
			
		
		
		//	clone_dfd.resolve(ctx);
		}
	//	return clone_dfd.promise();
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



