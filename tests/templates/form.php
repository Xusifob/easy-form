<?php

require __DIR__ . '/../header.php';


$form = selectLastPost('form-plugin-bastien');
if (!$form)
    return false;

$wp_form = new WP_Form($form->ID);
if(!$wp_form->hasBeenSend()) {
    echo $wp_form;
}else{
    echo json_encode(['worked' => true]);
}