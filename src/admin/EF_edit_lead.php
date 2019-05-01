<?php

/**
 * @since 1.0.0
 *
 * Class EF_edit_lead
 */
class EF_edit_lead
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
        if( !EF_is_screen(EF_Lead::$_POST_TYPE) ) {
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

        // metaboxes
        add_meta_box('ef-edit-lead', __("Lead informations",'easy-form'), array($this, 'mb_edit'), EF_Lead::$_POST_TYPE, 'normal', 'high');

    }




    /**
     * @since 1.0.0
     * @wp_type meta_box
     *
     * Display all the fields
     *
     */
    public function mb_edit()
    {
        EF_include('src/admin/templates/leads-edit/views/edit.php');
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
        wp_enqueue_style( 'ef-admin-css' );
    }


    /**
     * @since 1.0.0
     * @wp_type action
     *
     * Insert the footer of the add page
     */
    public function admin_footer()
    {
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

        $lead = new EF_Lead(null,null,$_POST['lead_data']);

        $post_array['post_content'] = $lead->getPostData()['post_content'];

        return $post_array;
    }



}

new EF_edit_lead();