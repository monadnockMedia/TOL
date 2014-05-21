<?php

/**

 * The template for displaying all pages.

 *

 * This is the template that displays all pages by default.

 * Please note that this is the WordPress construct of pages

 * and that other 'pages' on your WordPress site will use a

 * different template.

 *

 * @package WordPress

 * @subpackage Twenty_Ten

 * @since Twenty Ten 1.0

 */



get_header(); ?>



	<div id="container">

         <?php if(is_page('Home')) : ?> 



      <?php endif; ?> 



		<div id="content" role="main">

		<table id = "contacts">
			<td><strong>First</strong></td>
			<td><strong>Last</strong></td>
			<td><strong>Email Address</strong></td>
			<?php


				$att = get_attached_media( 'image', 1225 );
				
				foreach($att as $a){
					
					$t = wp_get_attachment_metadata( $a->ID);
			
					if($t["mailinglist"]){
					?>
					<tr>
						<td><?php echo $t["first"]?></td>
						<td><?php echo $t["last"]?></td>
						<td><?php echo $t["email"]?></td>
					</tr>
					<?php
					}
				}
	

			?>
			
</table>
</div></div>

<!-- #container -->



<?php get_sidebar(); ?>

<?php get_footer(); ?>

