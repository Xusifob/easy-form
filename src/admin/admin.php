<?php

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly


/**
 * Class EF_Admin
 */
class EF_Admin
{


    const CONVERSION = 'conversion';


    const IMPRESSION = 'impression';

    /**
     * @since 1.0.0
     *
     * EF_Admin constructor.
     */
    public function __construct()
    {

        add_action('admin_menu',array($this, 'admin_menu'));

        add_action('admin_enqueue_scripts',	array($this, 'admin_enqueue_scripts'), 0);



    }


    /**
     * @since 1.0.0
     *
     * Add the admin menu
     */
    public function admin_menu()
    {

        $menu_page = 'edit.php?post_type=' . EF_get_post_type();

        // Menu formulaire/Tous les formulaires
        add_menu_page(__('Easy Forms',EF_get_domain()),__('Easy Forms',EF_get_domain()), EF_get_setting('capability'), $menu_page,false, 'dashicons-feedback', 22);

        // Ajouter/modifier un formulaire
        add_submenu_page($menu_page, __('Add', EF_get_domain()), __('Add', EF_get_domain()), EF_get_setting('capability'),'post-new.php?post_type=' . EF_get_post_type());
        // Prévisualiser son formulaire
        add_submenu_page($menu_page, __('Preview', EF_get_domain()), __('Preview', EF_get_domain()), EF_get_setting('capability'), 'EF_show', [$this, 'EF_show']);

        add_submenu_page($menu_page, __('Import', EF_get_domain()), __('Import', EF_get_domain()), EF_get_setting('capability'), 'EF_import', [$this, 'EF_import']);

        // Exporter un formulaire
        add_submenu_page($menu_page, __('Export', EF_get_domain()), __('Export', EF_get_domain()), EF_get_setting('capability'), 'EF_export', [$this, 'EF_export']);

        // Stats
        add_submenu_page($menu_page, __('Statistics', EF_get_domain()), __('Statistics', EF_get_domain()), EF_get_setting('capability'), 'EF_stat', [$this, 'EF_stat']);

        // Doc
        add_submenu_page($menu_page, __('Documentation', EF_get_domain()), __('Documentation', EF_get_domain()), EF_get_setting('capability'), 'EF_doc', [$this, 'EF_doc']);


    }


    /**
     * @since 1.0.0
     *
     * Enqueue the scripts for the admin
     */
    public function admin_enqueue_scripts()
    {
        if(self::is_EF_admin_page()){
            wp_enqueue_style( 'ef-admin-css' );
            wp_enqueue_script( 'ef-admin-js',false,array('jquery'),false,true );
        }
    }


    /**
     * @since 1.0.0
     *
     * Display the list of forms
     *
     */
    public function EF_list()
    {
        global $table;
        $table = new EF_List_Table();
        $table->prepare_items();
        EF_include('src/admin/templates/list.php');
    }


    /**
     *
     * Display the template for the post
     *
     * @since 1.0.0
     */
    public function EF_add()
    {

        EF_Form_Handler::add($_POST);

        $post_id = isset($_GET['form']) ? $_GET['form'] : null;
        $GLOBALS['wp_form'] = new WP_Form($post_id);


        EF_include('src/admin/templates/add.php');
    }



    public function EF_show()
    {

    }



    public function EF_import()
    {

    }



    public function EF_export()
    {

    }



    public function EF_stat()
    {

    }



    public function EF_doc()
    {

    }


    /**
     * Return if the page is an admin page from easy form
     *
     * @return bool
     */
    public static function is_EF_admin_page()
    {
        return isset($_GET['page']) &&
               in_array($_GET['page'],[
            'EF_list',
            'EF_add',
            'EF_show',
            'EF_import',
            'EF_export',
            'EF_stat',
            'EF_doc',
        ]);
    }

}


new EF_Admin();