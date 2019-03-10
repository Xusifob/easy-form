<?php global $_forms; ?>

<div class="metabox-holder metabox--export">
	<div class="postbox-container">
		<div class="meta-box">
			<div id="ef-add-type" class="postbox ">
				<h3 class="hndle"><span><?php _e('Import',EF_get_domain()); ?></span></h3>
				<div class="inside">
					<div class="ef-content ef-content--padded">

						<p><?php _e('Import a previously exported JSON file',EF_get_domain()); ?></p>

						<form enctype="multipart/form-data" action="" method="POST">

							<input type="file" name="file">

							<input type="hidden" name="nonce" value="<?php echo wp_create_nonce('import'); ?>">

							<br>
							<br>
							<button class="button button-primary button-large"><?php _e('Import the form',EF_get_domain()); ?></button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div><!-- /post-body -->
	<br class="clear">
</div>