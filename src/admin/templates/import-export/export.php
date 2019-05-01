<?php global $_forms; ?>

<div class="metabox-holder metabox--export">
	<div class="postbox-container">
		<div class="meta-box">
			<div id="ef-add-type" class="postbox ">
				<h3 class="hndle"><span><?php _e('Export','easy-form'); ?></span></h3>
				<div class="inside">
					<div class="ef-content ef-content--padded">

						<p><?php _e('Select the forms you wish to export and export it. You will get a JSON file that will allow you to re import your forms later or in another website','easy-form'); ?></p>

						<form action="" method="POST">
							<?php /** @var $form WP_Post; ?> */
							foreach ($_forms as $key => $form) { ?>
								<div class="ef-input">
									<label for="form-<?php echo $key; ?>">
										<input type="checkbox" value="<?php echo $form->ID; ?>" id="form-<?php echo $key; ?>" name="forms[]">
										<?php echo $form->post_title; ?>
									</label>
								</div>
							<?php } ?>


							<input type="hidden" name="nonce" value="<?php echo wp_create_nonce('export'); ?>">

							<br>
							<br>
							<button class="button button-primary button-large"><?php _e('Export the selected forms','easy-form'); ?></button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div><!-- /post-body -->
	<br class="clear">
</div>