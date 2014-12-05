
//  Main  \\
var phase = 1;
var users = 0;
var picsTaken = 0;
var p, r, m;
var elipsisInterval;
var emailing = false;
var giftshopping = false;
var settings = {};
settings.request = {};

var canvas;
var data = require("./JS/targets.json");
var usersSupported = 3;
var finalURL;
var locTargetImgID;

//This array holds the filename for each possible image selection
var previewArr = new Array();
previewArr.push("0_lifering");
previewArr.push("1_fishing");
previewArr.push("2_crew");
previewArr.push("3_walk");
previewArr.push("4_couples");
previewArr.push("5_kids");

var shutterSnd;
var confirmSnd;
var hoverSnd;
var clickSnd;
var bigClickSnd;

var idleTimer;

var initHTML;

var initiated;

// Init
$(function init(){	
	if (!initiated) {
		initiated = true;
		initHTML = $(document.body).html();

		shutterSnd = document.createElement('audio');
		shutterSnd.setAttribute('src', 'JS/shutter.wav');
		shutterSnd.load();

		confirmSnd = document.createElement('audio');
		confirmSnd.setAttribute('src', 'JS/confirm.wav');
		confirmSnd.load();

		hoverSnd = document.createElement('audio');
		hoverSnd.setAttribute('src', 'JS/hover.wav');
		hoverSnd.load();

		clickSnd = document.createElement('audio');
		clickSnd.setAttribute('src', 'JS/click.wav');
		clickSnd.load();

		bigClickSnd = document.createElement('audio');
		bigClickSnd.setAttribute('src', 'JS/bigbutton.wav');
		bigClickSnd.load();


		bindNext();
		bindNumUsers();
		bindGallery();


	
	//	p = new photo();
	//	p.cam.deleteAll();


		r = new replacer(data);
	//	r.open();

		m = new mailer();

		startTimer();	
	}
	
})

function hardReset() {
	$.get("http://localhost:2999/snap?reset=true");
	$(document.body).empty().append(initHTML);
	
	if (oskOnScreen) {
		$pubKeyboard.fadeOut(250);
		$pubInput.blur();
		$pubKeyboardTriggers.removeClass('osk-focused');
		oskOnScreen = false;
	}
	
	phase = 1;
	users = 0;
	picsTaken = 0;
	usersSupported = 3;
	
	savedPics.length = 0;
	locTargetImgID = null;
	
	$("input[type=text], textarea").val("");
	
	bindNumUsers();
	bindNext();
	bindClick();
	bindGallery();
}

function startTimer() {
	clearInterval(idleTimer);
	idleTimer = setInterval(promptIdleUser, 90000); // 30000
	console.log("idle Start timer");
}

var promptIdleUser = function() {
	clearInterval(idleTimer);
  	idleTimer = setInterval(idleRestart, 10000);

	console.log("idle Warn");
	$( "#idleD" ).dialog("open");
}

$(document.body).click(function(e) {
	startTimer();
})

var idleRestart = function() {
	clearInterval(idleTimer);
	
	console.log("idle Restart app");
	
	hardReset();
	
}



// MAIN Function controlling app's behavior
function nextPhase (curPhase) {
	switch (curPhase) {
		case 0:
			
			break;
			
		case 1:
			//Start taking the picture
			userReady();
			
			phase++;
			break;
			
		case 2:
			//If not every user has had their picture taken, keep taking pictures
			if (picsTaken < users) {
				
				$( ".nextBtn" ).removeClass("selected");
				
				$("div.contentLabel-Interactive").animate({opacity: 0}, 250, function() {
					$('div.contentLabel-Interactive').remove();
					$(".gallery").css("height", 270);
					$(".gallery").css("width", 590);
				});
				
				phase = 1;
				nextPhase(phase);
			} else {
				console.log("Phase 2");
				
				// Add draggable pictures to footer
				var dragGallery = jQuery('<div class="flex-drag flex-container-wrap"></div>');
				dragGallery.prependTo("#footer");
			
				var dragFrame;
				for ( var i = 0; i < users; i++ ) {
					//WRN, added a source id
					dragFrame = jQuery('<div class="popup-exterior faceDragger"><div srcid = "'+i+'" class="dragFrame ui-widget-content draggable"></div></div>');
				    dragFrame.appendTo(".flex-drag");
					//WRN added settings function to get img id.
					$(".dragFrame:last").append("<img src='" + settings.request.sources[picsTaken-1].image + "' width='100%' height='100%' />");
					$("img").attr("draggable", "false");
				}
				
				$("#popup-interior-id").empty().prepend("Drag your face onto the<br/> person you want to be!");
				
				/*//Adds preview image to the stage
				$snap = $("#snap");
				$snap.attr({
					width: null,
					height: null,
					src: "IMAGES/"+previewArr[settings.request.tgImageID]+".jpg"
				})*/
				
				//Get coordinates for anchors based on image ID
			//	$.getJSON("JS/targets.json",function(d){
				//	data = d;
				//	console.log("Get JSON");
				//	console.log(d);
					draw(settings.request.tgImageID);
			//	})
				
				
				//Setup draggable faces and drag anchors for them to drop on
				$(".draggable").draggable({
					helper: "clone",
					start : function(event, ui){
							ui.helper.animate({
							            width: 120,
							            height: 120,
										marginLeft: 30,
										marginTop: 30
							        });
					    },
					opacity: 0.7,
					revert: true,
					scroll: false,
					distance: 30,
					stop: function(event, ui){
						
					    },
					drag: 	function(event, ui){
								
						    },
				});
				
				$(".snappedImage").addClass("developed");
				
				phase++;
			}
			break;
			
		case 3:
			console.log("Phase 3");
			//Show the final composite image
			$('div.contentLabel-Interactive').remove();
			$(".flex-gallery").remove();
			
			$("#popup-interior-id").empty().prepend("Share your photo!")
			$(".dragAnchor").remove();
			$(".nextBtn").addClass("selected");
			$("#nextLabel-id-ext").addClass("glow");
			setTimeout(function(){
				$("#nextLabel-id-ext").removeClass("glow");
			},120);
			
			//Make composite image bigger
			$(".snappedImage").addClass("grow");
			$("#snap").addClass("grow");
			$("#popup-exterior-id").remove();		
			$(".flex-drag").empty();
			
			//Add giftshop and email buttons
			var shareButtons = jQuery('<div class="contentLabel-Interactive email"><div class="popup-exterior"><div class="popup-interior">Email</div></div></div><div class="contentLabel-Interactive giftshop"><div class="popup-exterior"><div class="popup-interior">Buy A Print</div></div></div>');
			shareButtons.prependTo(".flex-drag");
			
			$(".contentLabel-Interactive").css("margin-left", 40);
			$(".contentLabel-Interactive").css("margin-top", 0);
			
			$("#nextLabel-id").empty().prepend("Done<br/><div class='nextBtn'></div>");
			
			$( ".nextBtn" ).toggleClass("selected");
			bindNext();
			bindClick();
			phase++;
			break;
			
		case 4:
			if (emailing) {
				//Check email submission form for errors and send email if valid
				if (validateEmailSubmit()) {
					console.log("sendEmail");
					$(".inputForm").css("top" , "200%");
					$(".inputForm").css("left" , "250%");

					if (oskOnScreen) {
						$pubKeyboard.fadeOut(250);
						$pubInput.blur();
						$pubKeyboardTriggers.removeClass('osk-focused');
						oskOnScreen = false;
					}

					$(".selected").removeClass("selected");
					$(".nextBtn").addClass("selected");
					emailing = false;
					
					$("#warning").empty().append("Your email has been sent successfully!");
				    $( "#warning" ).dialog( "open" );
					
				} else {
					console.log("email fail");
				}
			//Check giftshop submission form for errors and print if valid
			}else if(giftshopping) {
				if (validateGiftshopSubmit()) {
					$(".inputForm-gift").css("top" , "200%");
					$(".inputForm-gift").css("left" , "250%");

					if (oskOnScreen) {
						$pubKeyboard.fadeOut(250);
						$pubInput.blur();
						$pubKeyboardTriggers.removeClass('osk-focused');
						oskOnScreen = false;
					}

					$(".selected").removeClass("selected");
					$(".nextBtn").addClass("selected");
					giftshopping = false;
					
					$("#warning").empty().append("Your photo is printing in the giftshop!");
				    $( "#warning" ).dialog( "open" );
				} else {
					console.log("giftshop fail");
				}
			}else if (!giftshopping && !emailing) {
				//Restart app from beginning
				restartApp();
			}
			
			break;
	}
}

var userReady = function() {
	var activeUser = picsTaken + 1;
	
	if (users == 1) {
		$("#readyDialog").empty().append("<b><u>Please have only one visitor's face in the frame.</u></b><br/><br/>When you are ready,<br/> press 'Okay'.");
	} else {
		$("#readyDialog").empty().append("<b><u>Please have only one visitor's face in the frame.</u></b><p style='text-align:left !important;'>We will take a picture of each of your faces individually, then combine them all at the end! <br/> <br/> When visitor " + activeUser + " is ready, press 'Okay'.</p>");
	}
	
    $( "#readyDialog" ).dialog( "open" );
}

var draw = function( id ){
	var scale;
	thisData = data[id];
	
	var l = thisData.faces.length;
	$c = $("#snap");
	
	//width: thisData[0].img_size.width,
	//height: thisData[0].img_size.height
	
	//Checks for landscape or portrait orientation and sets appropriate scaling
	if (thisData.img_size.height > thisData.img_size.width) {
		$c.css({
			"background-image":"url(IMAGES/"+thisData.img_uri+")",
			width: 550,
			height: 550,
			"background-size": "auto 100%",
			"margin-left":"14%"
		})
		scale = 550/thisData.img_size.height;
	} else {
		$c.css({
			"background-image":"url(IMAGES/"+thisData.img_uri+")",
			width: 550,
			height: 550,
			"background-size": "100% auto",
			"margin-top":"14%"
		})
		scale = 550/thisData.img_size.width;
	}
	
	for(var i = 0; i<l;i++){
	
		$c.append("<div />");
	}
	
	$c.find("div").each(function(i,d){
		$t = $(this);
		//Add anchor points here
		$t.addClass("dragAnchor");
		$t.css({
			width: thisData.faces[i].width * scale,
			height: thisData.faces[i].width * scale,
			left: thisData.faces[i].x * scale,
			top: thisData.faces[i].y * scale,
		}).attr("faceID", i);
		console.log(i)
	})
	
	$(".dragAnchor").droppable({
		  hoverClass: "dragAnchor-hover",
		  over: function( event, ui ) {
			hoverSnd.play();
		  },
		
	      drop: function( event, ui ) {
			confirmSnd.play();
			$(".ui-draggable-dragging").remove();
			ui.draggable.draggable( 'disable' );
			
			console.log($(ui.draggable));
			$(ui.draggable).html(" ");
			
			$this = $(this);
	        $this.addClass("anchored");
		//	WRN, add faceID of drop taret to the settings.request;
			$dropped = $(ui.helper[0]);
			var faceID = $(event.target).attr("faceID");
			
			var srcID = +$dropped.attr("srcid");
			
			savedPics[srcID].faceID = faceID;
			settings.request.sources = savedPics;
			
			checkAnchored();
			$this.css("opacity", 0);
	      }
	    });
}

var restartApp = function(){
//p.cam.deleteAll();
	$.get("http://localhost:2999/snap?reset=true");
	$(".flex-drag").remove();
	$(".snappedImage").remove();
	
	if (oskOnScreen) {
		$pubKeyboard.fadeOut(250);
		$pubInput.blur();
		$pubKeyboardTriggers.removeClass('osk-focused');
		oskOnScreen = false;
	}
	
	$("#popup-interior-id").empty().prepend("How many people<br/>will be in your photo?");
	$("#nextLabel-id").empty().prepend("Next<br/><div class='nextBtn'></div>");
	
	var reset1 = jQuery('<div class="gallery flex-gallery"><div class="galleryImage" id="4" users="3">Image4</div><div class="galleryImage" id="5" users="3">Image5</div><div class="galleryImage" id="3" users="3">Image6</div><div class="galleryImage" id="0" users="1">Image1</div><div class="galleryImage" id="1" users="2">Image2</div><div class="galleryImage" id="2" users="2">Image3</div></div>');
	reset1.prependTo("#footer");
	
	var reset2 = jQuery('<div id="popup-exterior-id" class="popup-exterior flex-item"><div id="popup-interior-id" class="popup-interior">How many people<br/>will be in your photo?</div></div><div class="numUsersBtn two flex-item"></div><div class="numUsersBtn three flex-item"></div><div class="numUsersBtn one flex-item"></div>');
	reset2.appendTo(".content");
	
	phase = 1;
	users = 0;
	picsTaken = 0;
	usersSupported = 3;
	console.log("usersSupported");
	console.log(usersSupported);
	
	savedPics.length = 0;
	settings.request.tgImageID = null;
	
	$("input[type=text], textarea").val("");
	
	bindNumUsers();
	bindNext();
	bindClick();
	bindGallery();
	
}

// REGULAR EXPRESSION CHECKERS \\
var validateEmailText = function(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var validateEmailSubmit = function (){
  var email = $("input[name='emailaddress']").val();
  var firstName = $("input[name='firstname']").val();
  var lastName = $("input[name='lastname']").val();
  var emailBody = $("input[name='firstname']").val() + " " + $("input[name='lastname']").val();
  var mailingList = $("input[name='mailinglist']").is(':checked');
  console.log("Mailing List: ");
  console.log(mailingList);

  //Make sure there are no empty fields, if not check email syntax and send the email
  if (firstName.length == 0 || lastName.length == 0 || email.length == 0) {
	$("#warning").empty().append("Please don't leave any field blank!");
    $( "#warning" ).dialog( "open" );
  } else {
	if (validateEmailText(email)) {
		var p = {first:firstName, last:lastName, email:email, mailinglist:mailingList};
		wordpress.uploadAnnotated(finalURL, p).then(function(d) {
			console.log("uploadAnnotated");
			console.log(d);
			emailBody = firstName + " " + lastName + " is having the Trip of a Lifetime at the National Museum of the Great Lakes. Click the link below to see a photo:<br/><a href='"+d+"'>I'm having the Trip of a Lifetime!</a>";
			m.sendmail(email, emailBody);
		});
	    
		return true;
	  } else {
		$("#warning").empty().append("That is not a valid email address!");
	    $( "#warning" ).dialog( "open" );
		return false;
	  }
  }
}

var validateGiftshopSubmit = function (){
  var firstName = $("input[name='firstname_g']").val();
  var lastName = $("input[name='lastname_g']").val();

  //Make sure there are no empty fields, if not check email syntax and send the email
  if (firstName.length == 0 || lastName.length == 0) {
	$("#warning").empty().append("Please don't leave any field blank!");
    $( "#warning" ).dialog( "open" );
	return false;
  } else {
	//Print Picture Here
	printer.print(finalURL);
	return true;
  }
}

//  Buttons  \\
function bindNext() {
	$(".nextBtn").click(function(e) {
		//nextBtn will only be selected once the visitor has done everything needed on screen
		if ($(".nextBtn").hasClass("selected")) {
			bigClickSnd.play();
			if (emailing) {
				nextPhase(phase);
			} else if (giftshopping) {
				nextPhase(phase);
			} else {
				$( this ).toggleClass("selected");
				nextPhase(phase);
			}
		}
	});
}

var bindNumUsers = function() {
	$(".numUsersBtn").click(function(e) {
		clickSnd.play();
		switch (phase) {
			case 1:
				//Checks which number of users was clicked, check against capacity of chosen photo
				var pastUsers = users;
				if ($(this).hasClass("one")) {
					users = 1;
				} else if ($(this).hasClass("two")) {
					users = 2;
				} else if ($(this).hasClass("three")) {
					users = 3;
				}
				
				if (usersSupported < users) {
					$("#warning").empty().append("You have too many people for this image!<br/><br/><br/>Please select a photo with more faces.");
					$( "#warning" ).dialog( "open" );
					users = pastUsers;
				} else {
					$("#popup-exterior-id").addClass("glow");
					setTimeout(function(){
						$("#popup-exterior-id").removeClass("glow");
					},120);
					$(".numUsersBtn").removeClass("selected");
					$(".numUsersBtn").addClass("notselected");
					$("#warning").empty().append("Currently only one person can be in each picture, check back soon!");

					if ($(this).hasClass("one")) {
						$( this ).toggleClass("selected");
						$( this ).removeClass("notselected");
						$(".numUsersBtn.selected").css("opacity", 1);
						$(".numUsersBtn.notselected").css("opacity", 0.5);
						$("#popup-interior-id").empty().prepend("Choose which<br/>photograph you want!");
						$(".gallery").addClass("lit");
						users = 1;
					} else if ($(this).hasClass("two")) {
						$( this ).toggleClass("selected");
						$( this ).removeClass("notselected");
						$(".numUsersBtn.selected").css("opacity", 1);
						$(".numUsersBtn.notselected").css("opacity", 0.5);
						$("#popup-interior-id").empty().prepend("Choose which<br/>photograph you want!");
						$(".gallery").addClass("lit");
						users = 2;
					} else if ($(this).hasClass("three")) {
						$( this ).toggleClass("selected");
						$( this ).removeClass("notselected");
						$(".numUsersBtn.selected").css("opacity", 1);
						$(".numUsersBtn.notselected").css("opacity", 0.5);
						$("#popup-interior-id").empty().prepend("Choose which<br/>photograph you want!");
						$(".gallery").addClass("lit");
						users = 3;
					}

					console.log("Num Users: " + users);

					checkReady();
				}
			
				

				break;
		}
	});
}

//Sets up image choosing gallery in phase 1
var bindGallery = function(){
	$(".galleryImage").click(function(e) {
		clickSnd.play();
		switch (phase) {
			case 1:
				usersSupported = parseInt($(this).attr('users'));
				
				
				if (usersSupported < users) {
					$("#warning").empty().append("You have too many people for this image!<br/>Please select a photo with more faces.")
					$( "#warning" ).dialog( "open" );
				} else {
					$("#popup-exterior-id").addClass("glow");
					setTimeout(function(){
						$("#popup-exterior-id").removeClass("glow");
					},120);
					$("#popup-interior-id").empty().prepend("Choose which<br/>photograph you want!");
					$(".galleryImage").removeClass("selected");
					$(".galleryImage").addClass("notselected");
					$( this ).toggleClass("selected");
					$( this ).removeClass("notselected");
					$(".contentLabel").removeClass("choose");
					$(".contentLabel").addClass("takePic");

					var imageId = $(this).attr('id');
					$(".gallery").removeClass("lit one two three four five six");


					$("#warning").empty().append("This picture isn't supported yet, check back soon!");
					if (imageId == 0) {
						$(".gallery").addClass("one");
						//settings.request.tgImageID = imageId;
						locTargetImgID = imageId;
					} else if (imageId == 1) {
						$(".gallery").addClass("two");
					//	settings.request.tgImageID = imageId;
						locTargetImgID = imageId;
					} else if (imageId == 2) {
						$(".gallery").addClass("three");
					//	settings.request.tgImageID = imageId;
						locTargetImgID = imageId;
					} else if (imageId == 3) {
						$(".gallery").addClass("six");
					//	settings.request.tgImageID = imageId;
						locTargetImgID = imageId;
					} else if (imageId == 4) {
						$(".gallery").addClass("four");
						//settings.request.tgImageID = imageId;
						locTargetImgID = imageId;
					} else if (imageId == 5) {
						$(".gallery").addClass("five");
						//settings.request.tgImageID = imageId;
						locTargetImgID = imageId;
					}

					checkReady();
				}
				
				

				break;
		}
	});
}

//Make sure an image and number of users has been selected
function checkReady() {
	if (locTargetImgID != null && $(".numUsersBtn").hasClass("selected")) {
		
		$( ".nextBtn" ).addClass("selected");
			$("#nextLabel-id-ext").addClass("glow");
			setTimeout(function(){
				$("#nextLabel-id-ext").removeClass("glow");
			},120);
			
		$("#popup-interior-id").empty().prepend("Touch 'Next' to take <br/>your picture!");
	}
}

function bindClick() {
	
	$('div.contentLabel-Interactive').on('click', function (e) {
		clickSnd.play();
		switch (phase) {
			case 2:
				$(".contentLabel-Interactive").removeClass("selected");
				$(".contentLabel-Interactive").addClass("notselected");
				$( this ).toggleClass("selected");
				$( this ).removeClass("notselected");
				
				//Keep picture or retake?
				if ($( this ).hasClass("keep")) {
					$( ".nextBtn" ).addClass("selected");
					$("#nextLabel-id-ext").addClass("glow");
					setTimeout(function(){
						$("#nextLabel-id-ext").removeClass("glow");
					},120);
				} else if ($( ".retake .popup-interior" ).hasClass("selected") == false){
					picsTaken--;
					savedPics.pop();
			//		p.cam.deleteLast();
					//$( ".retake .popup-interior" ).css("color", "#DAA520");
					//$( ".retake .popup-interior" ).css("-webkit-text-stroke-color", "#DAA520");
					$( ".nextBtn" ).removeClass("selected");
					$( ".retake .popup-interior" ).addClass("selected");
					
					$("div.contentLabel-Interactive").animate({opacity: 0}, 250, function() {
						$('div.contentLabel-Interactive').remove();
						$(".gallery").css("height", 270);
						$(".gallery").css("width", 590);
						//$("#nextLabel-id-ext").css("margin-left", "000px");
					});
					
					phase = 1;
					nextPhase(phase);
				}
				break;
			case 4:
				bindCancel();
				//Add Email and Giftshop submission forms to screen
				if ($( this ).hasClass("giftshop")) {
					$(".nextBtn").addClass("selected");
					$(".contentLabel-Interactive .popup-interior").removeClass("selected");
					$(".giftshop .popup-interior").addClass("selected");
					
					if (oskOnScreen) {
						$pubKeyboard.fadeOut(250);
						$pubInput.blur();
						$pubKeyboardTriggers.removeClass('osk-focused');
						oskOnScreen = false;
					}

					$(".inputForm").css("top" , "200%");
					$(".inputForm").css("left" , "250%");
					$(".inputForm-gift").css("top" , "7%");
					$(".inputForm-gift").css("left" , "20.5%");
					emailing = false;
					giftshopping = true;
				} else if ($( this ).hasClass("email")) {
					$(".nextBtn").addClass("selected");
					$(".contentLabel-Interactive .popup-interior").removeClass("selected");
					$(".email .popup-interior").addClass("selected");
					
					if (oskOnScreen) {
						$pubKeyboard.fadeOut(250);
						$pubInput.blur();
						$pubKeyboardTriggers.removeClass('osk-focused');
						oskOnScreen = false;
					}

					$(".inputForm").css("top" , "7%");
					$(".inputForm").css("left" , "20.5%");
					$(".inputForm-gift").css("top" , "200%");
					$(".inputForm-gift").css("left" , "250%");
					emailing = true;
					giftshopping = false;
				}
				break;
		}
	});
}

function bindCancel() {
	
	$('.cancel').on('click', function (e) {
		clickSnd.play();
		//Add Email and Giftshop submission forms to screen
		if (emailing) {
			$(".nextBtn").addClass("selected");
			$(".contentLabel-Interactive .popup-interior").removeClass("selected");
		
			if (oskOnScreen) {
				$pubKeyboard.fadeOut(250);
				$pubInput.blur();
				$pubKeyboardTriggers.removeClass('osk-focused');
				oskOnScreen = false;
			}

			$(".inputForm").css("top" , "200%");
			$(".inputForm").css("left" , "250%");
			emailing = false;
		} else if (giftshopping) {
			$(".nextBtn").addClass("selected");
			$(".contentLabel-Interactive .popup-interior").removeClass("selected");
		
			if (oskOnScreen) {
				$pubKeyboard.fadeOut(250);
				$pubInput.blur();
				$pubKeyboardTriggers.removeClass('osk-focused');
				oskOnScreen = false;
			}

			$(".inputForm-gift").css("top" , "200%");
			$(".inputForm-gift").css("left" , "250%");
			giftshopping = false;
		}
	});
}

function checkAnchored() {
	if ($(".anchored").length < users) {
		console.log("Anchored: " + $(".anchored").length);
	} else {
		console.log("Start Photoshopping");
		r.replace(settings.request).then(function(d){
			console.log("r.replace");
			console.log(d);
			//debugger;
			$( ".nextBtn" ).addClass("selected");
			$("#nextLabel-id-ext").addClass("glow");
			setTimeout(function(){
				$("#nextLabel-id-ext").removeClass("glow");
			},120);
			
			clearInterval(elipsisInterval);
			$snap = $("#snap");
			$snap.css({
				"background-image": "url("+d+")"
			})
			
			
			$(".dragAnchor").remove();
			
		/*	r.watermark(d.processedImage).then(function(d) {
				
				console.log("Set watermarked background-image");

				
			});*/
			
		});
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
		//$("#nextLabel-id-ext").css("margin-left", "152px");
		
		var snappedImage = jQuery('<div class="snappedImage flex-item"><div class="indent">Developing Photo<span class="elipsis"></span></div><div width="550" height="550" id = "snap"></div></div>');
		snappedImage.appendTo(".content");
		elipsisTimer();
		
		var cameraButton = jQuery("<div class='contentLabel-interactive retake'><div class='popup-exterior'><div class='popup-interior'>Retake</div></div></div>");
		
		cameraButton.prependTo("#footer");
		
		$("#nextLabel-id").empty().prepend("Keep<br/><div class='nextBtn'></div>");
		
		$.get( "http://localhost:2999/snap", function( d ) {
			settings.request = d;
			settings.request.tgImageID = locTargetImgID;
			picsTaken++;
			console.log("picsTaken: " + picsTaken);
			console.log(d);
			savedPics = d.sources; //WRN => if you are keeping a "local" copy, make sure to keep it in sync with settings.request;
			var loadUrl = "url("+d.sources[picsTaken-1].image+")"; // picsTaken-1
			$("#snap").css("background-image", loadUrl);
			$(".snappedImage .indent").remove();
			$(".elipsis").remove();
				$("#snap").animate({opacity: 1}, 250, function() {
					$( ".nextBtn" ).toggleClass("selected");
					$("#nextLabel-id-ext").addClass("glow");
					setTimeout(function(){
						$("#nextLabel-id-ext").removeClass("glow");
					},120);
					clearInterval(elipsisInterval);
					bindNext();
					bindClick();
					
				});
		});
		
		shutterSnd.play();
				
		$(".overlay").animate({opacity: 0}, 350, function() {
			$(".overlay").remove();
		});
	});
}


//Make the "..." animate while developing
function elipsisTimer() {
	console.log("elipsisTimer tic");
	var elipsisCnt = 0;
	
	elipsisInterval = setInterval(function(){
		if (elipsisCnt < 3) {
			$(".elipsis").append(".");
			elipsisCnt++;
		} else {
			$(".elipsis").empty();
			elipsisCnt = 0;
		}
	},500);
}

///
var nwKiosk = function(){
	var mouseHidden =true;
	var kioskMode=true;
	var devTools=true;
	var gui =require('nw.gui');
	//setInterval(focus_window,5000);

	var win = gui.Window.get();
	this.win = win;
	this.gui = gui;
	
	this.setup = function(){$(document).keypress(function(d){
		switch(d.keyCode)
		{
		case 107:
		  (kioskMode) ? win.enterKioskMode() : win.leaveKioskMode() ;
		  kioskMode = !kioskMode;
		  break;
		case 109:
		  (mouseHidden) ? $("body").css("cursor","none") : $("body").css("cursor","pointer") ;
		  mouseHidden=!mouseHidden;
		  break;
		case 100:
		  (devTools) ? gui.Window.get().showDevTools() : gui.Window.get().closeDevTools();
		  devTools=!devTools;
		  break;
		}


	})}
	this.hideMouse = function(){
		$("body").css("cursor","none")
	}
	this.showMouse = function(){
		$("body").css("cursor","pointer")
	}
	
}
$(function(){nwK = new nwKiosk();
nwK.hideMouse();
nwK.setup();})

