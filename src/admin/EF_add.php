<?php

/**
 * @since 1.0.0
 *
 * Class EF_add
 */
class EF_add
{


	public function __construct() {

		add_action('current_screen', array($this, 'current_screen'));
	}


	/**
	 * @since 1.0.0
	 *
	 */
	public function current_screen()
	{
		// validate screen
		if( !EF_is_screen(EF_get_post_type()) ) {

			return;

		}


		EF_Form_Handler::add($_POST);



		add_action('admin_footer',              array($this,'admin_footer'));

		// actions
		add_action('admin_enqueue_scripts',		array($this,'admin_enqueue_scripts'));
		add_action('admin_head', 				array($this,'admin_head'));


	}


	/**
	 * @since 1.0.0
	 */
	public function admin_head()
	{
		// global
		global $post;

		$GLOBALS['wp_form'] = new WP_Form($post->ID);


		// metaboxes
		add_meta_box('ef-add-main-info', __("Main information",EF_get_domain()), array($this, 'mb_info'), EF_get_post_type(), 'normal', 'high');
		add_meta_box('ef-add-type', __("Type Of Form",EF_get_domain()), array($this, 'mb_type'), EF_get_post_type(), 'normal', 'high');
		add_meta_box('ef-add-fields', __("Fields",EF_get_domain()), array($this, 'mb_fields'), EF_get_post_type(), 'normal', 'high');
		add_meta_box('ef-add-submit', __("Submit Values",EF_get_domain()), array($this, 'mb_submit'), EF_get_post_type(), 'normal', 'high');

	}


	/**
	 * @since 1.0.0
	 *
	 * Display the meta box for the main informations
	 *
	 */
	public function mb_info()
	{
		EF_include('src/admin/templates/add/views/main-information.php');

	}


	/**
	 * @since 1.0.0
	 *
	 * Display the submit box
	 *
	 */
	public function mb_type()
	{
		EF_include('src/admin/templates/add/views/type-of-form.php');

	}



	/**
	 * @since 1.0.0
	 *
	 * Display all the fields
	 *
	 */
	public function mb_fields()
	{
		EF_include('src/admin/templates/add/views/fields.php');
	}



	/**
	 * @since 1.0.0
	 *
	 * Display the submit box
	 *
	 */
	public function mb_submit()
	{
		EF_include('src/admin/templates/add/views/submit.php');

	}


	/**
	 * @since 1.0.0
	 *
	 * Enqueue the scripts
	 *
	 */
	public function admin_enqueue_scripts()
	{
		wp_enqueue_script( 'ef-add-js',false,array('jquery'),false,true );
	}


	/**
	 *
	 */
	public function admin_footer()
	{
		EF_include('src/admin/templates/add/views/footer.php');
	}


}

new EF_add();