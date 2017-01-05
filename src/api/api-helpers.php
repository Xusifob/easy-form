<?php


/**
 * Return a setting from the main Easy Form instance
 *
 * @since 1.0.0
 *
 *
 * @param $name
 * @return mixed
 */
function EF_get_setting($name)
{
    // vars
    $r = null;


    // load from ACF if available
    if( isset( easy_form()->SETTINGS[ $name ] ) ) {

        $r = easy_form()->SETTINGS[ $name ];

    }

    return $r;
}


/**
 *  EF_include
 *
 *  This function will include a file
 *
 *  @since	1.0.0
 *
 * @param $file
 */
function EF_include( $file ) {

    $path = EF_get_path( $file );

    if( file_exists($path) ) {

        include_once( $path );

    }

}


/**
 * Return the path for a file within the plugin folder
 *
 * @since 1.0.0
 *
 * @param $path
 * @return string
 */
function EF_get_path($path){

    return EF_get_setting('path') . $path;

}


/**
 * Return the directory for a file within the plugin folder
 *
 * @since 1.0.0
 *
 * @param $path
 * @return string
 */
function EF_get_dir($path){

    return EF_get_setting('dir') . $path;

}




/**
 * Return the domain of the plugin
 *
 * @sinve 1.0.0
 *
 *
 * @return string
 */
function EF_get_domain(){
    return EF_get_setting('text_domain');
}

function EF_get_post_type()
{
    return EF_get_setting('post_type');
}


/**
 * @Since V 0.5
 *
 * Return the union between 2 parameters in a link
 *
 * @param $link
 * @return string
 */
function EF_get_link_union($link)
{
    return strpos($link, '?') === false ? '?' : '&';

}


/**
 *
 * @since 1.0.0
 *
 * @from http://stackoverflow.com/questions/526556/how-to-flatten-a-multi-dimensional-array-to-simple-one-in-php
 *
 * @param $array
 * @return array
 */
function array_flatten($array) {

    $return = array();
    foreach ($array as $key => $value) {
        if (is_array($value)){
            $new_value = [];
            foreach($value as $k => $v){
                $new_value[$key . '_' . $k] = $v;
            }
            $return = array_merge($return, array_flatten($new_value));
        }
        else {$return[$key] = $value;}
    }
    return $return;

}
