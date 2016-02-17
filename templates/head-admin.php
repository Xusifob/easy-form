<?php  if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
function load_custom_wp_admin_style() {
    $relPath = plugins_url( '../', __FILE__ );


    /** All JS files */
    wp_register_script('bootstrap-js',$relPath . 'library/libs/bootstrap/js/bootstrap.min.js');
    wp_register_script('shCore-js',$relPath . 'library/js/shCore.js');
    wp_register_script('shBrushJScript-js',$relPath . 'library/js/shBrushJScript.js');
    wp_register_script('shBrushPhp-js',$relPath . 'library/js/shBrushPhp.js');
    wp_register_script('charts-js',$relPath . 'library/libs/charts-js/Chart.js');
    wp_register_script('jquery-jvectormap',$relPath . 'library/libs/jquery-jvectormap/jquery-jvectormap.js');
    wp_register_script('jquery-jvectormap-map',$relPath . 'library/libs/jquery-jvectormap/jquery-jvectormap-world-mill-en.js');

    wp_enqueue_script( 'bootstrap-js' );
    wp_enqueue_script( 'jquery-ui-draggable' );
    wp_enqueue_script( 'shCore-js' );
    wp_enqueue_script( 'shBrushJScript-js' );
    wp_enqueue_script( 'shBrushPhp-js' );
    wp_enqueue_script( 'charts-js' );
    wp_enqueue_script( 'jquery-jvectormap' );
    wp_enqueue_script( 'jquery-jvectormap-map' );



    /** All Css Files */

    wp_register_style('bootstrap-css',$relPath . 'library/libs/bootstrap/css/bootstrap.min.css');
    wp_register_style('jquery-ui-css',$relPath . 'library/libs/jquery-ui/css/jquery-ui.min.css');
    wp_register_style('style-css',$relPath . 'library/css/style.css');
    wp_register_style('shCore-css',$relPath . 'library/css/shCore.css');
    wp_register_style('font-awesome-css',$relPath . 'library/libs/font-awesome/css/font-awesome.min.css');
    wp_register_style('jquery-jvectormap',$relPath . 'library/libs/jquery-jvectormap/jquery-jvectormap.css');
    wp_register_style('shThemeDefault-css',$relPath . 'library/css/shThemeDefault.css');

    wp_enqueue_style( 'bootstrap-css' );
    wp_enqueue_style( 'jquery-ui-css' );
    wp_enqueue_style( 'shCore-css' );
    wp_enqueue_style( 'font-awesome-css' );
    wp_enqueue_style( 'shThemeDefault-css' );
    wp_enqueue_style( 'style-css' );
    wp_enqueue_style( 'jquery-jvectormap' );


}
add_action( 'admin_enqueue_scripts', 'load_custom_wp_admin_style' );