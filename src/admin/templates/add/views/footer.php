<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly

?>

<div class="ef-message ef-error-message" id="error-message"></div>
<div class="ef-message ef-success-message" id="success-message"></div>


<!-- Include the modal -->
<?php // EF_include('src/admin/templates/add/views/modal-duplicate.php'); ?>

<script type="text/javascript">

	var ajaxUrl = '<?php echo admin_url('admin-ajax.php'); ?>';

	let $ = jQuery;


	jQuery(document).ready(function(){

        System.import('EF_Add');

        // Hack to put the title at it's place
	//	$('#title').val($('#title')[0].defaultValue);

	})
</script>