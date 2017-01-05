<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly

/** @var $wp_form WP_Form */
global $wp_form;

?>


<!-- Include the modal -->
<?php // EF_include('src/admin/templates/add/views/modal-duplicate.php'); ?>

<script type="text/javascript">

	var ajaxUrl = '<?php echo admin_url('admin-ajax.php'); ?>';

	var inputs_empty = {
		checkbox : <?php echo json_encode(new EF_Checkbox_Input()); ?>,
		editor : <?php echo json_encode(new EF_Editor_Input()); ?>,
		email : <?php echo json_encode(new EF_Email_Input()); ?>,
		file : <?php echo json_encode(new EF_File_Input()); ?>,
		hidden : <?php echo json_encode(new EF_Hidden_Input()); ?>,
		text : <?php echo json_encode(new EF_Input()); ?>,
		number : <?php echo json_encode(new EF_Number_Input()); ?>,
		password : <?php echo json_encode(new EF_Password_Input()); ?>,
		tel : <?php echo json_encode(new EF_Phone_Input()); ?>,
		radio : <?php echo json_encode(new EF_Radio_Input()); ?>,
		select : <?php echo json_encode(new EF_Select()); ?>,
		textarea : <?php echo json_encode(new EF_TextArea()); ?>,
		url : <?php echo json_encode(new EF_URL_Input()); ?>,
		submit : <?php echo json_encode(new EF_Submit_Input()); ?>,
	};



	jQuery(document).ready(function(){


		var form = <?php echo json_encode($wp_form,WP_DEBUG ? JSON_PRETTY_PRINT : false); ?>


		var remove = [
			'_time','_nonce','_uniqid','_antispam'
		];

		for(var i =0;i<remove.length;i++){
			//  delete form.inputs[remove[i]];
		}

		/**
		 *
		 * @type {EF_Add}
		 */
		var EF_add = new EF_Add(form);

	})
</script>