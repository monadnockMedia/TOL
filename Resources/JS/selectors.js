
//  Main  \\
var phase = 1;
var users = 0;
var picsTaken = 0;
var p, r;
var previewArr = new Array();

previewArr.push("0_lifering");
previewArr.push("1_chef");
previewArr.push("2_crew");
previewArr.push("3_walk");
previewArr.push("4_couples");
previewArr.push("5_kids");

// Init
$(function init(){
	console.log("init");
	bindNext();
	p = new photo();
	
	r = new replacer();
	r.open();
})


function nextPhase (curPhase) {
	switch (curPhase) {
		case 0:
			/*console.log("Phase 0");
			$(".flex-item").animate({opacity: 0}, 250, function() {
				$(".numUsersBtn.notselected").remove();
				$(".numUsersBtn").removeClass("selected");
				$(".numUsersBtn").css("height", 550);
				$(".numUsersBtn").css("width", 700);
				$(".numUsersBtn").css("background-size", "700px 550px");
				
				if ($(".numUsersBtn").hasClass("one")) {
					users = 1;
				} else if ($(".numUsersBtn").hasClass("two")) {
					users = 2;
				} else if ($(".numUsersBtn").hasClass("three")) {
					users = 3;
				}
				
				console.log("Num Users: " + users);
				
			    $(".popup-interior").empty().prepend("Choose a photograph");
				$(".gallery").addClass("lit");
				
				$(".flex-item").animate({opacity: "1"}, 250);
			  });
			phase++;
			
			
			
			*/
			break;
			
		case 1:
			var flashInterval = setInterval(function(){
						flash(flashInterval);
					}, 1500);
			$(".flex-item").animate({
				opacity: 0
			  }, 250, function() {
				$(".galleryImage").removeClass("selected");
				$('.numUsersBtn').remove();
				$(".snappedImage").remove();
				$("#popup-interior-id").empty().prepend("Look into the mirror.<br/>Smile!");
				$("#popup-exterior-id").animate({opacity: 1}, 250, function() {});
				$("#popup-interior-id").animate({opacity: 1}, 250, function() {});
				$(".flex-gallery").animate({opacity: 0}, 250, function() {});
			  });
			phase++;
			break;
			
		case 2:
			if (picsTaken < users) {
				
				$( ".nextBtn" ).removeClass("selected");
				
				$("div.contentLabel-Interactive").animate({opacity: 0}, 250, function() {
					$('div.contentLabel-Interactive').remove();
					$(".gallery").css("height", 270);
					$(".gallery").css("width", 590);
					$("#nextLabel-id-ext").css("margin-left", "0px");
				});
				
				phase = 1;
				nextPhase(phase);
			} else {
				console.log("Phase 2");
				$('div.contentLabel-Interactive').remove();
				$(".flex-gallery").remove();
				
			
				$("#nextLabel-id-ext").css("margin-left", "00px");
				$("#popup-interior-id").empty().prepend("Drag your face onto the<br/> person you want to be!");
			
				// Add draggable pictures to footer
				var dragGallery = jQuery('<div class="flex-drag flex-container-wrap"></div>');
				dragGallery.prependTo("#footer");
			
				var dragFrame;
				for ( var i = 0; i < users; i++ ) {
					//WRN, added a source id
					dragFrame = jQuery('<div class="popup-exterior"><div srcid = "'+i+'" class="dragFrame ui-widget-content draggable"></div></div>');
				    dragFrame.appendTo(".flex-drag");
					//WRN added settings function to get img id.
					$(".dragFrame:last").append("<img src='" + settings.getImageURL(i) + "' width='184' height='184' />");
				}
			
				$(".draggable").draggable({
					helper: "clone",
					opacity: 0.7,
					revert: true,
					scroll: false,
					distance: 30,
					start: function() {},
					stop: function() {}
				});
				
				var dragAnchor = jQuery('<div class="dragAnchor ui-widget-header"></div>');
				dragAnchor.appendTo(".snappedImage");
				
				// Set drag anchor over pictures face (ring: L 405 T 270 / girls: L 350 T 175 / kids: L 370 T 235)
				//$(".dragAnchor").css("left", 370);
				//$(".dragAnchor").css("top", 235);
				
				if (settings.request.tgImageID == 0) {
					$(".dragAnchor").css("left", 405);
					$(".dragAnchor").css("top", 270);
				} else if (settings.request.tgImageID == 2) {
					$(".dragAnchor").css("left", 350);
					$(".dragAnchor").css("top", 175);
				} else if (settings.request.tgImageID == 5) {
					$(".dragAnchor").css("left", 370);
					$(".dragAnchor").css("top", 235);
				}
				
				$snap = $("#snap");
				$snap.attr({
					width: null,
					height: null,
					src: "IMAGES/"+previewArr[settings.request.tgImageID]+".jpg"
				})
				
				if (settings.request.tgImageID == 0 || settings.request.tgImageID == 2 || settings.request.tgImageID == 5) {
					$("#snap").addClass("portrait");
				} else {
					$("#snap").addClass("landscape");
				}
				
				$(".snappedImage").addClass("developed");
				
				///WRN
				$(".dragAnchor").droppable({
				      drop: function( event, ui ) {
						$this = $(this);
				        $this.addClass("anchored");
						var faceID = 0;
					//	WRN, add faceID of drop taret to the settings.request;
						$dropped = $(ui.helper[0]);
						
						var srcID = +$dropped.attr("srcid");
						console.log("Image with srcID "+srcID+" dropped;");
						savedPics[srcID].faceID = faceID;
						settings.request.sources = savedPics;
						checkAnchored();
						
						r.replace(settings.request).then(function(d){
							//$(".snappedImage").addClass("developed");
							
							if (settings.request.tgImageID == 0 || settings.request.tgImageID == 2 || settings.request.tgImageID == 5) {
								$("#snap").addClass("portrait");
							} else {
								$("#snap").addClass("landscape");
							}
							console.log(d.processedImage);
							$(".dragAnchor").remove();
							$snap = $("#snap");
							$snap.attr({
								width: null,
								height: null,
								src: d.processedImage
							})
						})
				      }
				    });
				phase++;
			}
			break;
			
		case 3:
			console.log("Phase 3");
			$("#popup-interior-id").empty().prepend("Share your photo!")
			$(".dragAnchor").remove();
			$(".nextBtn").addClass("selected");
			
			
			$(".flex-drag").empty();
			
			var shareButtons = jQuery('<div class="contentLabel-Interactive email"><div class="popup-exterior"><div class="popup-interior">Email</div></div></div><div class="contentLabel-Interactive twitter"><div class="popup-exterior"><div class="popup-interior">Twitter</div></div></div>');
			shareButtons.prependTo(".flex-drag");
			
			$(".contentLabel-Interactive").css("margin-left", 40);
			$(".contentLabel-Interactive").css("margin-top", 0);
			
			//$(".nextLabel").empty().prepend("Done");
			$("#nextLabel-id").empty().prepend("Done<br/><div class='nextBtn'></div>");
			$( ".nextBtn" ).toggleClass("selected");
			bindNext();
			bindClick();
			phase++;
			break;
			
		case 4:
			location.reload();
			break;
	}
}


//  Buttons  \\
function bindNext() {
	$(".nextBtn").click(function(e) {
		//nextBtn will only be selected once the visitor has done everything needed on screen
		if ($(".nextBtn").hasClass("selected")) {
			$( this ).toggleClass("selected");
			nextPhase(phase);
		}
	});
}


$(".numUsersBtn").click(function(e) {
	switch (phase) {
		case 1:
			$(".numUsersBtn").removeClass("selected");
			$(".numUsersBtn").addClass("notselected");
			$( this ).toggleClass("selected");
			$( this ).removeClass("notselected");
			$(".numUsersBtn.selected").css("opacity", 1);
			$(".numUsersBtn.notselected").css("opacity", 0.5);
			
			if ($(".numUsersBtn").hasClass("one")) {
				users = 1;
			} else if ($(".numUsersBtn").hasClass("two")) {
				users = 2;
			} else if ($(".numUsersBtn").hasClass("three")) {
				users = 3;
			}
			
			console.log("Num Users: " + users);
			
		    $("#popup-interior-id").empty().prepend("Choose which<br/>photograph you want!");
			$(".gallery").addClass("lit");
			
			checkReady();
			
			break;
	}
});

$(".galleryImage").click(function(e) {
	switch (phase) {
		case 1:
			$("#popup-interior-id").empty().prepend("Choose which<br/>photograph you want!");
			$(".galleryImage").removeClass("selected");
			$(".galleryImage").addClass("notselected");
			$( this ).toggleClass("selected");
			$( this ).removeClass("notselected");
			$(".contentLabel").removeClass("choose");
			$(".contentLabel").addClass("takePic");
			
			var imageId = $(this).attr('id');
			$(".gallery").removeClass("lit one two three four five six");
			
			settings.request.tgImageID = imageId;
			
			if (imageId == 0) {
				$(".gallery").addClass("one");
			} else if (imageId == 1) {
				//$(".gallery").addClass("two");
				$( "#dialog" ).dialog( "open" );
				imageId = null;
			} else if (imageId == 2) {
				$(".gallery").addClass("three");
			} else if (imageId == 3) {
				//$(".gallery").addClass("four");
				$( "#dialog" ).dialog( "open" );
				imageId = null;
			} else if (imageId == 4) {
				//$(".gallery").addClass("four");
				$( "#dialog" ).dialog( "open" );
				imageId = null;
			} else if (imageId == 5) {
				$(".gallery").addClass("five");
			}
			
			checkReady(imageId);
			
			break;
	}
});

function checkReady(imageId) {
	if (imageId != null && $(".numUsersBtn").hasClass("selected")) {
		$( ".nextBtn" ).addClass("selected");
		$("#popup-interior-id").empty().prepend("Touch 'Next' to take <br/>your picture!");
	}
}

function bindClick() {
	$('div.contentLabel-Interactive').on('click', function (e) {
		switch (phase) {
			case 2:
				$(".contentLabel-Interactive").removeClass("selected");
				$(".contentLabel-Interactive").addClass("notselected");
				$( this ).toggleClass("selected");
				$( this ).removeClass("notselected");
				
				//Keep picture or retake?
				if ($( this ).hasClass("keep")) {
					$( ".nextBtn" ).addClass("selected");
				} else {
					picsTaken--;
					savedPics.pop();
					//$( ".retake .popup-interior" ).css("color", "#DAA520");
					//$( ".retake .popup-interior" ).css("-webkit-text-stroke-color", "#DAA520");
					$( ".nextBtn" ).removeClass("selected");
					$( ".retake .popup-interior" ).addClass("selected");
					
					$("div.contentLabel-Interactive").animate({opacity: 0}, 250, function() {
						$('div.contentLabel-Interactive').remove();
						$(".gallery").css("height", 270);
						$(".gallery").css("width", 590);
						$("#nextLabel-id-ext").css("margin-left", "000px");
					});
					
					phase = 1;
					nextPhase(phase);
				}
				break;
			case 4:

				//Email and Twitter Sharing
				if ($( this ).hasClass("twitter")) {
					$(".contentLabel-Interactive .popup-interior").removeClass("selected");
					$(".twitter .popup-interior").addClass("selected");
				} else if ($( this ).hasClass("email")) {
					$(".contentLabel-Interactive .popup-interior").removeClass("selected");
					$(".email .popup-interior").addClass("selected");
				}
				break;
		}
	});
}

function checkAnchored() {
	if ($(".anchored").length < users) {
		//console.log("Waiting for Anchors");
	} else {
		//console.log("All pics anchored");
		$( ".nextBtn" ).addClass("selected");
	}
}


//  Camera 'Flash'  \\
function flash(flashInterval) {
	clearInterval(flashInterval);
	

	
	var overlay = jQuery('<div class="overlay"> </div>');
	overlay.appendTo(document.body);
	
	$(".overlay").animate({opacity: 1}, 150, function() {
		
		$("#popup-interior-id").empty().prepend("Keep this picture?");
		
		//$(".contentLabel").append("Do you want to keep this picture?");
		$(".gallery").css("height", 0);
		$(".gallery").css("width", 0);
		$("#nextLabel-id-ext").css("margin-left", "152px");
		
		var snappedImage = jQuery('<div class="snappedImage flex-item">Developing Photo... <img width="550" height="550" id = "snap" /></div>');
		snappedImage.appendTo(".content");
		
		var cameraButton = jQuery("<div class='contentLabel-interactive retake'><div class='popup-exterior'><div class='popup-interior'>Retake</div></div></div>");
		
		cameraButton.prependTo("#footer");
		
		$("#nextLabel-id").empty().prepend("Keep<br/><div class='nextBtn'></div>");
		
		
		bindNext();
		bindClick();
		
		p.snap().then(function(d){
			picsTaken++;
			console.log("picsTaken: " + picsTaken);
			savedPics = d.sources; //WRN => if you are keeping a "local" copy, make sure to keep it in sync with settings.request;
			$("#snap").attr("src", settings.getImageURL(picsTaken-1))
				$("#snap").animate({opacity: 1}, 250, function() {
					$( ".nextBtn" ).toggleClass("selected");
				});
		
			
			/*
			r.replace(d).then(  function(d){
				console.log("Snapped d:");
				console.log(d);
				savedPics.push(d.processedImage);
				$("#snap").attr("src", savedPics[0]);
				$("#snap").animate({opacity: 1}, 150, function() {
				});
			});
			*/
		});
		
		
		//savedPics.push($("#snap").)
		
		$(".overlay").animate({opacity: 0}, 150, function() {
			$(".overlay").remove();
		});
	});
}