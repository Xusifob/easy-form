<?php
$allposts = get_post_types();

$postDisabled = ['page','revision','attachment','nav_menu_item','acf-field','acf-field-group'];

?>
<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>
<div class="ef-input">
	<label for="form-send-type"><?php _e('Post type',EF_get_domain()); ?></label>
	<select name="form-send-type" class="form-control" id="form-send-type">
		<?php
		foreach ($allposts as $allpost){
			if(!in_array($allpost,$postDisabled)){ ?>
				<option value="<?php echo $allpost; ?>"><?php echo $allpost; ?></option>
			<?php } } ?>
	</select>
</div>

<div class="ef-input">
	<label for="settings[post_status]"><?php _e('Status',EF_get_domain())?></label>
	<select id="settings[post_status]" class="form-control" name="settings[post_status]">
		<?php $post_status = get_post_stati();
		foreach($post_status as $status){ ?>
			<option value="<?php echo $status; ?>"><?php echo ucfirst($status); ?></option>
		<?php } ?>
	</select>
</div>