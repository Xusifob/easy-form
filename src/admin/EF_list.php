<?php

/**
 * @since 1.0.0
 *
 * Class EF_List
 */
class EF_List
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
		if( !EF_is_screen('edit-' . EF_get_post_type()) ) {

			return;
		}



		add_filter('manage_edit-'. EF_get_post_type() .'_columns' , array($this,'ef_columns'));
		add_filter('manage_edit-'. EF_get_post_type() .'_sortable_columns' , array($this,'ef_sortable_columns'));


		add_action('manage_'. EF_get_post_type() .'_posts_custom_column', array($this,'ef_data_columns'), 10, 2 );



	}


	/**
	 * @param $columns
	 *
	 * @return array
	 */
	public function ef_columns($columns)
	{

		$date = $columns['date'];

		unset($columns['date']);
		$columns['id'] = __('ID - Slug',EF_get_domain());
		$columns['nb_fields'] = __('Number of fields',EF_get_domain());
		$columns['type'] = __('Form type',EF_get_domain());
		$columns['date'] = $date;

		return $columns;
	}


	/**
	 * @since 1.0.0
	 * @wp_type filter
	 *
	 * @param $columns
	 */
	public function ef_sortable_columns($columns)
	{

		$columns['id'] = 'id';
		$columns['nb_fields'] = 'nb_fields';
		$columns['type'] = 'type';

		return $columns;
	}

	/**
	 * Display the data
	 *
	 * @since 1.0.0
	 *
	 * @param $name
	 */
	public function ef_data_columns($name) {
		global $post;

		$form = new WP_Form($post->ID);
		$form->get_field('_nonce');
		$form->get_field('_time');
		$form->get_field('_uniqid');
		$form->get_field('submit');
		$form->get_field('_antispam');

		switch ($name) {
			case 'id':
				echo $form->getId() . ' - ' . $post->post_name;
				break;

			case 'nb_fields':
				echo count($form->get_fields());
				break;
			case 'type' :
				echo $form->get_type();
				break;
		}
	}


}

new EF_List();