<?php
function load_custom_wp_admin_style() {
    $relPath = plugins_url() . '/easy-form/';


    /** All JS files */
    wp_register_script('bootstrap-js',$relPath . 'library/libs/bootstrap/js/bootstrap.min.js');
    wp_register_script('jquery-ui-js',$relPath . 'library/libs/jquery-ui/js/jquery-ui.min.js');
    wp_register_script('shCore-js',$relPath . 'library/js/shCore.js');
    wp_register_script('shBrushJScript-js',$relPath . 'library/js/shBrushJScript.js');
    wp_register_script('shBrushPhp-js',$relPath . 'library/js/shBrushPhp.js');
    wp_register_script('functions-js',$relPath . 'library/js/functions.js');

    wp_enqueue_script( 'bootstrap-js' );
    wp_enqueue_script( 'jquery-ui-js' );
    wp_enqueue_script( 'shCore-js' );
    wp_enqueue_script( 'shBrushJScript-js' );
    wp_enqueue_script( 'shBrushPhp-js' );
    wp_enqueue_script( 'functions-js' );

    /** All Css Files */

    wp_register_style('bootstrap-css',$relPath . 'library/libs/bootstrap/css/bootstrap.min.css');
    wp_register_style('jquery-ui-css',$relPath . 'library/libs/jquery-ui/css/jquery-ui.min.css');
    wp_register_style('style-css',$relPath . 'library/css/style.css');
    wp_register_style('shCore-css',$relPath . 'library/css/shCore.css');
    wp_register_style('shThemeDefault-css',$relPath . 'library/css/shThemeDefault.css');

    wp_enqueue_style( 'bootstrap-css' );
    wp_enqueue_style( 'jquery-ui-css' );
    wp_enqueue_style( 'shCore-css' );
    wp_enqueue_style( 'shThemeDefault-css' );
    wp_enqueue_style( 'style-css' );
}
add_action( 'admin_enqueue_scripts', 'load_custom_wp_admin_style' );