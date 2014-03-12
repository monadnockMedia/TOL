
//  Main  \\
var phase = 0;
var users = 0;
var picsTaken = 0;


function nextPhase (curPhase) {
	switch (curPhase) {
		case 0:
			console.log("Phase 0");
			$(".flex-item").animate({
				opacity: 0
			  }, 250, function() {
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
				
			    $(".popup-interior").empty().prepend("Choose a photo");
				$(".gallery").addClass("lit");
				
				$(".flex-item").animate({opacity: "1"}, 250);
			  });
			phase++;
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
				$(".popup-interior").empty().prepend("Look into the mirror.<br/>Smile!");
				$(".popup-exterior").animate({opacity: 1}, 250, function() {});
				$(".popup-interior").animate({opacity: 1}, 250, function() {});
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
					$(".nextLabel").css("margin-top", "55px");
				});
				
				phase = 1;
				nextPhase(phase);
			} else {
				console.log("Phase 2");
				$('div.contentLabel-Interactive').remove();
				$(".flex-gallery").remove();
			
				$(".nextLabel").css("margin-top", "55px"); //55 33
				$(".popup-interior").empty().prepend("Drag your face onto the<br/> person you want to be!");
			
				// Add draggable pictures to footer
				var dragGallery = jQuery('<div class="flex-drag flex-container-wrap"></div>');
				dragGallery.prependTo("#footer");
			
				var dragFrame;
				for ( var i = 0; i < users; i++ ) {
					dragFrame = jQuery('<div class="dragFrame ui-widget-content draggable"></div>');
				    dragFrame.appendTo(".flex-drag");
					
					$(".dragFrame:last").append("<img src='" + savedPics[i] + "' width='184' height='200' />");
					
					//$('#snap').PhotoJShop({color: "b&w"});
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
				$(dragAnchor).appendTo(".snappedImage");
				$(".dragAnchor").css("left", 405);
				$(".dragAnchor").css("top", 290);
			
				$(".dragAnchor").droppable({
				      drop: function( event, ui ) {
				        $( this ).addClass("anchored");
						checkAnchored();
				      }
				    });
				phase++;
			}
			break;
			
		case 3:
			console.log("Phase 3");
			$(".popup-interior").empty().prepend("Share your photo!")
			$(".dragAnchor").remove();
			$(".nextBtn").addClass("selected");
			
			$(".flex-drag").empty();
			
			var shareButtons = jQuery('<div class="contentLabel-Interactive email"></div><div class="contentLabel-Interactive twitter"></div>');
			shareButtons.prependTo(".flex-drag");
			
			$(".contentLabel-Interactive").css("margin-left", 40);
			$(".contentLabel-Interactive").css("margin-top", 0);
			
			//$(".nextLabel").empty().prepend("Done");
			$(".nextLabel").addClass("done");
			bindClick();
			phase++;
			break;
		case 4:
			location.reload();
			break;
	}
	
	
}


//  Buttons  \\
$(".nextBtn").click(function(e) {
	//nextBtn will only be selected once the visitor has done everything needed on screen
	if ($(".nextBtn").hasClass("selected")) {
		$( this ).toggleClass("selected");
		nextPhase(phase);
	}
});

$(".numUsersBtn").click(function(e) {
	switch (phase) {
		case 0:
			$(".numUsersBtn").removeClass("selected");
			$(".numUsersBtn").addClass("notselected");
			$( this ).toggleClass("selected");
			$( this ).removeClass("notselected");
			$(".nextBtn").addClass("selected");
			$(".numUsersBtn.selected").css("opacity", 1);
			$(".numUsersBtn.notselected").css("opacity", 0.5);
			break;
	}
});

$(".galleryImage").click(function(e) {
	switch (phase) {
		case 1:
			$(".galleryImage").removeClass("selected");
			$(".galleryImage").addClass("notselected");
			$( this ).toggleClass("selected");
			$( this ).removeClass("notselected");
			$(".nextBtn").addClass("selected");
			$(".contentLabel").removeClass("choose");
			$(".contentLabel").addClass("takePic");
			
			var imageId = $(this).attr('id');
			$(".gallery").removeClass("lit one two three four five six");
			
			if (imageId == 1) {
				$(".gallery").addClass("one");
			} else if (imageId == 2) {
				$(".gallery").addClass("two");
			} else if (imageId == 3) {
				$(".gallery").addClass("three");
			} else if (imageId == 4) {
				$(".gallery").addClass("four");
			} else if (imageId == 5) {
				$(".gallery").addClass("five");
			} else if (imageId == 6) {
				$(".gallery").addClass("six");
			}
			
			break;
	}
});

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
					$( ".nextBtn" ).removeClass("selected");
					
					$("div.contentLabel-Interactive").animate({opacity: 0}, 250, function() {
						$('div.contentLabel-Interactive').remove();
						$(".gallery").css("height", 270);
						$(".gallery").css("width", 590);
						$(".nextLabel").css("margin-top", "55px");
					});
					
					phase = 1;
					nextPhase(phase);
				}
				break;
			case 4:
				$(".contentLabel-Interactive").removeClass("selected");
				$(".contentLabel-Interactive").addClass("notselected");
				$( this ).toggleClass("selected");
				$( this ).removeClass("notselected");

				//Email and Twitter Sharing
				if ($( this ).hasClass("twitter")) {
					
				} else if ($( this ).hasClass("email")) {
					
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
		//$(".contentLabel").append("Touch 'Next' to share<br/>your picture.");
	}
}


//  Camera 'Flash'  \\
function flash(flashInterval) {
	clearInterval(flashInterval);
	
	picsTaken++;
	console.log("picsTaken: " + picsTaken);
	
	var overlay = jQuery('<div class="overlay"> </div>');
	overlay.appendTo(document.body);
	
	$(".overlay").animate({opacity: 1}, 150, function() {
		
		$(".popup-interior").empty().prepend("Keep this picture?");
		
		//$(".contentLabel").append("Do you want to keep this picture?");
		$(".gallery").css("height", 0);
		$(".gallery").css("width", 0);
		$(".nextLabel").css("margin-top", "-80px");
		
		var snappedImage = jQuery('<div class="snappedImage flex-item">Developing Photo... <img width="805" height="550" id = "snap" /></div>');
		snappedImage.appendTo(".content");
		
		var cameraButton = jQuery('<div class="contentLabel-Interactive retake"></div><div class="contentLabel-Interactive keep"></div>');
		cameraButton.prependTo("#footer");
		
		bindClick();
		snap();
		
		
		//savedPics.push($("#snap").)
		
		$(".overlay").animate({opacity: 0}, 150, function() {
			$(".overlay").remove();
		});
	});
}