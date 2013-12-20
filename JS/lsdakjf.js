
var r = $.ajax("http://dkjfhs.dsfkadjs.")
k<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Booklet - jQuery Plugin</title>

    <!--[if lt IE 9]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->

    <!-- required files for booklet -->
    <script src="jquery.min.js" type="text/javascript"></script>
    <script src="jquery-ui.min.js" type="text/javascript"></script>  
    <script src="jquery.easing.1.3.js" type="text/javascript"></script>
    <script src="jquery.booklet.latest.js" type="text/javascript"></script>
    <link href="jquery.booklet.latest.css" type="text/css" rel="stylesheet" media="screen, projection, tv" />

    <style type="text/css">
        body {
			width:1280px;
			height:1024px;
			background:#ccc; font:normal 12px/1.2 arial, verdana, sans-serif;}
			div{height:100%;}
    </style>

	<script type="text/javascript">
	jQuery.fx.interval = 50;
	function reset() {		
	        $("#mybook").booklet({
					easing:             'easeInOutQuad',                 // easing method for complete transition
					easeIn:             'easeInQuad',                    // easing method for first half of transition
					easeOut:            'easeOutQuad',
					shadows:            true
	});
	reset();
    </script>

	<script type="text/javascript">
	//	setInterval(function(){$("#mybook").booklet("next")},3000)
	</script>

</head>
<body>
	<header>
		<h1>Booklet Example</h1>
	</header>
	<section>
	    <div id="mybook">
	        <div title="first page" style="background:red;">
	            <h3>Page 1</h3>
	        </div>
	        <div title="second page" style="background:blue;">
	            <h3>Page 2</h3>
	        </div>
	        
	    </div>
	</section>
	<footer></footer>
</body>
</html>