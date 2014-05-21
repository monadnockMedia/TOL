<?php
/**
 * The loop that displays a page.
 *
 * The loop displays the posts and the post content.  See
 * http://codex.wordpress.org/The_Loop to understand it and
 * http://codex.wordpress.org/Template_Tags to understand
 * the tags used in it.
 *
 * This can be overridden in child themes with loop-page.php.
 *
 * @package WordPress
 * @subpackage Twenty_Ten
 * @since Twenty Ten 1.2
 */
?>
<?php
	if($_GET["trip_id"]){
		$id = $_GET["trip_id"];
		$img_meta = wp_get_attachment_metadata($id,true);
		//print_r($img_meta);
	} 	
	$UL = wp_upload_dir();
	$image_path = $UL["baseurl"];
	echo "</br></br>";
//	print_r($image_path);
?>
<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>

				<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
					<?php if ( is_front_page() ) { ?>
                                                   <!-- DON'T SHOW TITLE  -->
					<?php } else { ?>
						
					<?php } ?>

					<div class="entry-content">
						<h1 class="entry-title"><?php echo $img_meta['first']." ".$img_meta['last']?> is having the Trip of a Lifetime!</h1>

						<img width = "600" src= "<?php echo $image_path."/".$img_meta['file']?>" />
						<!-- ?php print_r($img_meta)? --> 
					</div><!-- .entry-content -->
				</div><!-- #post-## -->

				<?php comments_template( '', true ); ?>

<?php endwhile; // end of the loop. ?>


