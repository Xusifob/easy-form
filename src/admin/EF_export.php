<?php

/**
 * @since 1.0.0
 *
 * Class EF_Export
 */
class EF_Export
{


	private $page_id = 'easy-forms_page_EF_import_export';

	public function __construct() {

		add_action('current_screen',    array($this, 'current_screen'));
		add_action('admin_menu',        array($this, 'admin_menu'));
	}


	/**
	 *
	 */
	function admin_menu() {

		// add page
		$page = add_submenu_page('edit.php?post_type=' . EF_get_post_type(), __('Import/Export', EF_get_domain()), __('Import/Export', EF_get_domain()), EF_get_setting('capability'), 'EF_import_export', [$this, 'render']);


		// actions
		add_action('load-' . $page, array($this,'load'));

	}


	/**
	 * @since 1.0.0
	 *
	 */
	public function current_screen()
	{

		// validate screen
		if( !EF_is_screen($this->page_id) ) {

			return;

		}

		add_action('admin_footer',              array($this,'admin_footer'));

		add_action('init',              array($this,'export'));

		// actions
		add_action('admin_enqueue_scripts',		array($this,'admin_enqueue_scripts'));
		//	add_action('admin_head', 				array($this,'admin_head'));

	}


	/**
	 *
	 * @wp_type action
	 *
	 * Register the meta boxes
	 * Create the form global used in the export page
	 *
	 * @since 1.0.0
	 */
	public function admin_footer()
	{
		?><script type="text/javascript">var ajaxUrl = '<?php echo admin_url('admin-ajax.php'); ?>';</script><?php
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
		wp_enqueue_style( 'ef-admin-css' );
		wp_enqueue_script( 'ef-export-js' );
	}


	/**
	 * @since 1.0.0
	 *
	 * Render the page
	 */
	public function render()
	{
		$GLOBALS['_forms'] = get_posts([
				'post_type' => EF_get_post_type(),
				'posts_per_page' => -1,
		]);


		EF_include('src/admin/templates/import-export/export.php');
		EF_include('src/admin/templates/import-export/import.php');
	}


	/**
	 *
	 * @since 1.0.0
	 *
	 *
	 */
	public function load()
	{


		if(EF_verify_nonce('export')){
			$this->export();
		}



		if(EF_verify_nonce('import')){
			$this->import();
		}

	}


	/**
	 * @since 1.0.0
	 *
	 * Import all posts
	 */
	public function import()
	{

		if(!isset($_FILES['file']))
			return false;

		$content = file_get_contents($_FILES['file']['tmp_name']);

		$_forms = json_decode($content,true);

		if(is_array($_forms)){
			foreach($_forms as $form){

				$post_id = wp_insert_post([
						'post_title' => $form['post_title'],
						'post_name' => $form['post_name'],
						'post_status' => $form['post_status'],
						'post_type' => EF_get_post_type(),
				]);

				//TODO add an error message
				if(is_wp_error($post_id))
					continue;

				add_post_meta($post_id,'attributes',$form['attributes']);
				add_post_meta($post_id,'settings',$form['settings']);

				foreach($form['inputs'] as $input){
					add_post_meta($post_id,'inputs',json_encode($input));
				}

			}
		}

	}


	/**
	 * @since 1.0.0
	 *
	 * Export posts
	 *
	 *
	 */
	public function export()
	{


		if(!isset($_POST['forms']) || !is_array($_POST['forms']))
			return;

		// set headers
		$file_name = 'ef-export-' . date('Y-m-d') . '.json';

		header( "Content-Description: File Transfer" );
		header( "Content-Disposition: attachment; filename={$file_name}" );
		header( "Content-Type: application/json" );

		$json = [];

		foreach($_POST['forms'] as $form_id){

			$_post = get_post($form_id);
			if(!is_object($_post) || $_post->post_type !== EF_get_post_type())
				continue;

			$form = new WP_Form($form_id);

			$form->get_form()->removeDefaultFields();

			$json[] = $form;
		}

		echo json_encode($json,JSON_PRETTY_PRINT);

		die();
	}

}

new EF_Export();