<?php

if( !function_exists( 'curl_init' ) || ! function_exists( 'curl_exec' )){
    die('cUrl is not vailable in you PHP server.');
}

echo '<pre>';

define('WP_USE_THEMES', false);
global $wp, $wp_query, $wp_the_query, $wp_rewrite, $wp_did_header;
require(__DIR__ . '/../../../../wp-load.php');
require __DIR__ . '/vendor/autoload.php';
require 'functions.php';

$form_adress = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['SERVER_NAME'] .$_SERVER['REQUEST_URI'] . 'form.php';
global $form_adress;


