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
            'version'			=> '1.1.0',

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
        EF_include('src/inputs/nonce.php');


        // Include all forms
        EF_include('src/forms/form.php');
        EF_include('src/forms/form-interface.php');
        EF_include('src/forms/login.php');
        EF_include('src/forms/mail.php');
        EF_include('src/forms/post.php');
        EF_include('src/forms/reset.php');
        EF_include('src/forms/user.php');

        // Include class
        EF_include('src/wp_form.php');

        if( is_admin() ) {
            EF_include('src/admin/admin.php');
            EF_include('src/admin/EF_add.php');
            EF_include('src/admin/EF_list.php');
            EF_include('src/admin/EF_export.php');
        }

        $this->registerObjects();

        add_action('init',array($this, 'wp_init'), 5);

        add_action('wp_footer',array($this,'wp_footer'));


        add_action('template_redirect',array($this,'parse_content'));

        // Add action for multilingual traduction
        add_action('plugins_loaded', [$this, 'load_translation']);

    }


    /**
     * Parse the content of the page. If it's a POST and there is a form in it, check it !
     */
    public function parse_content()
    {

        if('POST' !== $_SERVER['REQUEST_METHOD']) {
            return;
        }

        global $post;
        if(preg_match('#\[wp_easy_form(( )+)?id=("|\')[a-zA-Z0-9]+("|\')(( )+)?\]#',$post->post_content,$matches)) {

            if(preg_match('#id=("|\')[a-zA-Z0-9]+("|\')#',$matches[0],$match)) {
                $match = substr($match[0],4,strlen($match[0])-5);
                $this->shortcode(array(
                    'id' => $match,
                    'validation-only' => true,
                ));
            }
        }
    }


    /**
     * Register the inputs and forms
     */
    public function registerObjects()
    {

        EF_Input::register();
        EF_Hidden_Input::register();
        EF_Checkbox_Input::register();
        EF_Editor_Input::register();
        EF_Email_Input::register();
        EF_Number_Input::register();
        EF_Password_Input::register();
        EF_Radio_Input::register();
        EF_Select::register();
        EF_TextArea::register();
        EF_URL_Input::register();
        EF_File_Input::register();
        EF_Submit_Input::register();
        EF_Nonce_Input::register();

        EF_Login_Form::register();
        EF_Mail_Form::register();
        EF_Post_Form::register();
        EF_Reset_Form::register();
        EF_User_Form::register();

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
            'supports' => array( 'title' ),
            'show_in_menu'		=> false,
        ));




        // register scripts
        $scripts = array(

            // array(
            //      'handle'	=> 'ef-admin-js',
            //      'src'		=> EF_get_dir('assets/admin/js/build/admin.js'),
            //      'deps'		=> array('jquery')
            //  ),
            array(
                'handle'	=> 'ef-add-js',
                'src'		=> EF_get_dir('assets/admin/js/build/add/main.js'),
                'deps'		=> array('jquery')
            ),
            array(
                'handle'	=> 'ef-libs-js',
                'src'		=> EF_get_dir('assets/admin/js/build/libs.js'),
                'deps'		=> array('jquery')
            ),

            array(
                'handle'	=> 'ef-export-js',
                'src'		=> EF_get_dir('assets/admin/js/build/ef-export.js'),
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


        add_shortcode('wp_easy_form',array($this,'shortcode'));

    }


    /**
     * @param $atts
     */
    public function shortcode($atts)
    {

        $form = new WP_Form($atts['id']);

        if(!isset($atts['validation-only'])) {
            echo $form;
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

