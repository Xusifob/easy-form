<?php

require __DIR__ . '/header.php';

$form = selectLastPost('form-plugin-bastien');
if(!$form )
    return false;

$wp_form = new WP_Form($form->ID);

echo $wp_form;