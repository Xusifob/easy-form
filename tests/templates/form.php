<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

require __DIR__ . '/../header.php';

$form = selectLastPost('form-plugin-bastien');
if (!$form)
    return false;

$postId = null;

if(isset($_GET['user']) && 'true' == $_GET['user']){
    $user = selectLastUser();
    $postId = $user->ID;
}

if(isset($_GET['post']) && 'true' == $_GET['post']){
    $thepost = selectLastPost();
    $postId = $thepost->ID;
}

$wp_form = new WP_Form($form->ID,$postId);


if($wp_form->hasError())
    die(json_encode(['Wp_Form_Error' => $wp_form->getError()]));

if(!$wp_form->hasBeenSend()) {
    echo $wp_form;
}else{
    die(json_encode(['worked' => true,'is_connected' => is_user_logged_in()]));
}