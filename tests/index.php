<?php
/**
 * This file will get every unit test for the project,
 *
 */
include __DIR__ . '/header.php';

$login_user = "baltazare";
$login_pass = "#bltzr";

// Test login
test('login',[$login_user, $login_pass]);

// Test form importation
test('import_form',['add-post.json','Test Add Post']);

// Test if the add post form works well
test('test_add_form',['add-post.json']);

// Delete the last form created
test('delete_last_form',[]);
// Delete the last post created
test('delete_last_post',[]);