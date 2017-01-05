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

		add_action('admin_footer',              array($this,'admin_footer'));

		// actions
		add_action('admin_enqueue_scripts',		array($this,'admin_enqueue_scripts'));
		add_action('admin_head', 				array($this,'admin_head'));


		add_filter('wp_insert_post_data',       array($this,'wp_insert_post_data'));
		add_filter('save_post',                 array($this,'save_post'));

	}


	/**
	 *
	 * @wp_type action
	 *
	 * Register the meta boxes
	 * Create the form global used in the add page
	 *
	 * @since 1.0.0
	 */
	public function admin_head()
	{

		self::create_wp_form();


		// metaboxes
		add_meta_box('ef-add-main-info', __("Main information",EF_get_domain()), array($this, 'mb_info'), EF_get_post_type(), 'normal', 'high');
		add_meta_box('ef-add-type', __("Type Of Form",EF_get_domain()), array($this, 'mb_type'), EF_get_post_type(), 'normal', 'high');
		add_meta_box('ef-add-fields', __("Fields",EF_get_domain()), array($this, 'mb_fields'), EF_get_post_type(), 'normal', 'high');
		add_meta_box('ef-add-submit', __("Submit Values",EF_get_domain()), array($this, 'mb_submit'), EF_get_post_type(), 'normal', 'high');

	}


	/**
	 * Create the global $wp_form and set it to be used in the page
	 *
	 * @since 1.0.0
	 */
	protected static function create_wp_form()
	{
		// global
		global $post;
		$GLOBALS['wp_form'] = new WP_Form($post->ID);

		// Remove all "default fields"
		global $wp_form;
		$wp_form->get_field('_nonce');
		$wp_form->get_field('_time');
		$wp_form->get_field('_uniqid');
		$wp_form->get_field('_antispam');

		vardump();


		if(!isset($wp_form->get_fields()['submit'])){
			$wp_form->get_form()->addInput(new EF_Submit_Input(null,['name' => 'submit']));
		}

		if(count($wp_form->get_fields()) > 1 )
			return;

		$wp_form->get_form()->addInput(new EF_Input());

	}




	/**
	 * @since 1.0.0
	 * @wp_type meta_box
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
	 * @wp_type meta_box
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
	 * @wp_type meta_box
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
	 * @wp_type meta_box
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
	 * @wp_type action
	 *
	 * Enqueue the scripts
	 *
	 */
	public function admin_enqueue_scripts()
	{
		wp_enqueue_script( 'ef-add-js',false,array('jquery'),false,true );
	}


	/**
	 * @since 1.0.0
	 * @wp_type action
	 *
	 * Insert the footer of the add page
	 */
	public function admin_footer()
	{
		EF_include('src/admin/templates/add/views/footer.php');
	}


	/**
	 * @since 1.0.0
	 * @wp_type filter
	 *
	 * Update the post name to add 'form-' in front of it
	 *
	 *
	 * @param $post_array
	 *
	 * @return mixed
	 */
	public function wp_insert_post_data($post_array)
	{
		if($post_array['post_type'] != EF_get_post_type()){
			return $post_array;
		}

		if(preg_match('/^form-/',$post_array['post_name'])){
			return $post_array;
		}

		$post_array['post_name'] = 'form-' . $post_array['post_name'];

		return $post_array;
	}

	/**
	 * @since 1.0.0
	 * @wp_type action
	 *
	 * Save the form attributes settings and inputs
	 *
	 *
	 * @param $post_id
	 *
	 * @return bool
	 */
	public function save_post($post_id)
	{

		if(isset($_POST['settings']))
			update_post_meta($post_id,'settings',$_POST['settings']);
		if(isset($_POST['attributes']))
			update_post_meta($post_id,'attributes',$_POST['attributes']);




		if(!isset($_POST['field']) || !is_array($_POST['field']))
			return false;

		delete_post_meta($post_id,'inputs');


		foreach($_POST['field'] as $key => $input){
			$input = new EF_Input(null,$input['attributes']);
			add_post_meta($post_id,'inputs',json_encode($input));
		}

		return true;
	}


}

new EF_add();