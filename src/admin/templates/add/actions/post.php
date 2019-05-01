<?php
// Charge all post types that are made to be displayed in the BO
$postTypes = get_post_types(array('public' => true));

$postDisabled = ['attachment','acf-field','acf-field-group','easy_form'];

?>
<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly ?>
<div class="ef-input">
	<label for="settings[form-send-type]"><?php _e('Post type','easy-form'); ?></label>
	<select name="settings[form-send-type]" class="form-control" id="settings[form-send-type]">
		<?php
		foreach ($postTypes as $postType){
			if(!in_array($postType,$postDisabled)){ ?>
				<option value="<?php echo $postType; ?>"><?php echo $postType; ?></option>
			<?php } } ?>
	</select>
</div>

<div class="ef-input">
	<label for="settings[post_status]"><?php _e('Status','easy-form')?></label>
	<select id="settings[post_status]" class="form-control" name="settings[post_status]">
		<?php $post_status = get_post_stati();
		foreach($post_status as $status){ ?>
			<option value="<?php echo $status; ?>"><?php echo ucfirst($status); ?></option>
		<?php } ?>
	</select>
</div>