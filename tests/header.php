<?php

if( !function_exists( 'curl_init' ) || ! function_exists( 'curl_exec' )){
    die('cUrl is not vailable in you PHP server.');
}

define('WP_USE_THEMES', false);
global $wp, $wp_query, $wp_the_query, $wp_rewrite, $wp_did_header;
require(__DIR__ . '/../../../../wp-load.php');
require_once(ABSPATH.'wp-admin/includes/user.php' );
if(is_dir(__DIR__ . '/vendor'))
    require __DIR__ . '/vendor/autoload.php';
else{
    echo 'Install all the dependencies using composer';
    echo '<pre>';
    echo "cd wp-content/plugins/easy-forms/tests/\n\r";
    echo "composer install";
    echo "</pre>";
    echo 'To see how to install composer, please refer to it\'s doc : <a target="_blank" href="https://getcomposer.org/">https://getcomposer.org/</a>';
    die();
}

echo '<pre>';


$cookieFile  = __DIR__ . '/cookie.txt';

ob_start();
if(!is_file($cookieFile))
    touch($cookieFile);
ob_clean();
if(!is_writable($cookieFile))
    die('<span style=\'color:red;\'>Error on creating the file cookie.txt, check your permissions or create it and give the correct writing rights</span>');

file_get_contents($cookieFile);

require 'functions.php';


if(isset($_SERVER['REQUEST_SCHEME']))
$form_adress = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['SERVER_NAME'] .$_SERVER['REQUEST_URI'] . 'templates/form.php';
else
    $form_adress = $_SERVER['HTTP_ORIGIN'] .$_SERVER['REQUEST_URI'] . 'templates/form.php';
global $form_adress;




