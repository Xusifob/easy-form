<?php
/**
 * This file will get every unit test for the project,
 *
 */
include __DIR__ . '/header.php';

if(!isset($_POST['username']) || !isset($_POST['password'])){ ?>
    <p>Entrez vos identifiants de connexion pour lancer le test</p>
    <form action="" method="post">
        <input type="text" placeholder="Admin Username" name="username">
        <input type="password" placeholder="Admin password" name="password">
        <input type="email" placeholder="Your email to test if they are correctly send" name="email">
        <input type="submit">
    </form>
    <?php die();
}


// Test login
test('login',[$_POST['username'], $_POST['password']]);


/********** ADD POST FORMS *****/
// Test form importation
test('import_form',['add-post.json','Test Add Post']);
// Test if the add post form works well
test('test_add_form',['add-post.json']);
// Delete the last form created
test('delete_last_form',[]);
// Delete the last post created
test('delete_last_post',[]);


/**************** ADD USER FORMS **********/
// Test form importation
test('import_form',['add-user.json','Test Add User']);
// Test if the user is added
test('test_add_user_form',['add-post.json']);
test('test_update_user_form',['add-post.json']);
// Delete the last form created
test('delete_last_form',[]);

/************** Login **********/
test('import_form',['connexion.json','Connexion']);
test('test_connect_user',['add-post.json']);
test('delete_last_user',[]);
