<?php

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/*
Plugin Name: Easy WP Form V2
Plugin URI: http://easyform.bastienmalahieude.fr
Description: Permet de créer et styliser des formulaires facilement. Ce plugin a été créé conjointement par Bastien Malahieude et Baltazare (http://baltazare.fr).
Version: 1.0.0
Author: Bastien Malahieude
Author URI: http://bastienmalahieude.fr
Copyright: Bastien Malahieude
License: GPL

*/



/**
 * Class Easy_Form
 */
class Easy_Form
{
    var $SETTINGS = [
        'is_initialised' => false,
    ];


    /**
     * Easy_Form constructor.
     */
    public function __construct()
    {
        // Do nothing here
    }


    public function initialise()
    {
        $this->SETTINGS = [

            'text_domain' => 'easy-form',
            // basic
            'version'			=> '1.0.0',

            // urls
            'basename'			=> plugin_basename( __FILE__ ),
            'path'				=> plugin_dir_path( __FILE__ ),
            'dir'				=> plugin_dir_url( __FILE__ ),


            'post_type' => 'easy_form',
            'capability' => 'edit_posts',
            'is_initialised' => true,
            'default_language' => 'en',
            'test' => 'test'
        ];


        $this->SETTINGS['name'] = __('Easy Form', $this->SETTINGS['text_domain']);


        include_once('src/api/api-helpers.php');


        EF_include('src/core/ajax.php');

        // Include all requirements
        EF_include('src/html.php');
        EF_include('src/settings.php');


        // Include all inputs
        EF_include('src/inputs/input.php');
        EF_include('src/inputs/editor.php');
        EF_include('src/inputs/email.php');
        EF_include('src/inputs/hidden.php');
        EF_include('src/inputs/number.php');
        EF_include('src/inputs/url.php');
        EF_include('src/inputs/password.php');
        EF_include('src/inputs/phone.php');
        EF_include('src/inputs/checkbox.php');
        EF_include('src/inputs/radio.php');
        EF_include('src/inputs/select.php');
        EF_include('src/inputs/textarea.php');
        EF_include('src/inputs/file.php');
        EF_include('src/inputs/submit.php');


        // Include all forms
        EF_include('src/forms/form.php');
        EF_include('src/forms/login.php');
        EF_include('src/forms/mail.php');
        EF_include('src/forms/post.php');
        EF_include('src/forms/user.php');

        // Include class
        EF_include('src/wp_form.php');

        if( is_admin() ) {
            EF_include('src/admin/list-table.php');
            EF_include('src/admin/handler.php');
            EF_include('src/admin/admin.php');
        }

        add_action('init',array($this, 'wp_init'), 5);

        add_action('wp_footer',array($this,'wp_footer'));


        // Add action for multilingual traduction
        add_action('plugins_loaded', [$this, 'load_translation']);

    }


    /**
     * Include the ajax url in the footer
     */
    public function wp_footer()
    {

    }


    /**
     * @since 1.0.0
     *
     * Load the translation files
     */
    public function load_translation()
    {
        load_plugin_textdomain(EF_get_domain(), false, EF_get_setting('dir') . '/languages/');
    }


    private function start_session()
    {
        // use of sessions
        if (phpversion() >= 5.4) {
            if (session_status() == PHP_SESSION_NONE)
                session_start();
        } else {
            if (session_id() == '')
                session_start();
        }
    }


    /**
     * @since 1.0.0
     *
     * Is called when the plugin is activated
     */
    public function on_activation()
    {
        //TODO do something here
    }


    /**
     * @since 1.0.0
     *
     * Init the plugin and register scripts
     *
     */
    public function wp_init()
    {
        $this->start_session();



        // Register the post type
        // vars
        $cap = EF_get_setting('capability');


        // Create post type 'acf-field-group'
        register_post_type( EF_get_post_type() , array(
            'labels'			=> array(
                'name'					=> __( 'Forms', EF_get_domain() ),
                'singular_name'			=> __( 'Form', EF_get_domain() ),
                'add_new'				=> __( 'Add New' , EF_get_domain() ),
                'add_new_item'			=> __( 'Add New Form' , EF_get_domain() ),
                'edit_item'				=> __( 'Edit Form' , EF_get_domain() ),
                'new_item'				=> __( 'New Form' , EF_get_domain() ),
                'view_item'				=> __( 'View Form', EF_get_domain() ),
                'search_items'			=> __( 'Search Form', EF_get_domain() ),
                'not_found'				=> __( 'No Form found', EF_get_domain() ),
                'not_found_in_trash'	=> __( 'No Form found in Trash', EF_get_domain() ),
            ),
            'public'			=> false,
            'show_ui'			=> true,
            '_builtin'			=> false,
            'capability_type'	=> 'post',
            'capabilities'		=> array(
                'edit_post'			=> $cap,
                'delete_post'		=> $cap,
                'edit_posts'		=> $cap,
                'delete_posts'		=> $cap,
            ),
            'hierarchical'		=> true,
            'rewrite'			=> false,
            'query_var'			=> false,
            'supports' 			=> array('title'),
            'show_in_menu'		=> false,
        ));











        // register scripts
        $scripts = array(

           array(
                'handle'	=> 'ef-admin-js',
                'src'		=> EF_get_dir('assets/admin/js/build/admin.js'),
                'deps'		=> array('jquery')
            ),
        );

        foreach( $scripts as $script ) {

            wp_register_script( $script['handle'], $script['src'], $script['deps'], EF_get_setting('version') );

        }


        // register styles
        $styles = array(

            array(
                'handle'	=> 'ef-admin-css',
                'src'		=> EF_get_dir('assets/admin/css/build/core.css'),
                'deps'		=> false
            )

        );

        foreach( $styles as $style ) {

            wp_register_style( $style['handle'], $style['src'], $style['deps'], EF_get_setting('version') );

        }



    }

}


/**
 *
 * Instance of easy_form
 *
 * @since 1.0.0
 *
 * @return Easy_Form
 */
function easy_form(){
    global $easy_form;


    if(!isset($easy_form)){
        $easy_form = new Easy_Form();

        register_activation_hook(__FILE__, array($easy_form, 'on_activation'));

        $easy_form->initialise();
    }

    return $easy_form;
}


easy_form();

