<?php

use \Symfony\Component\DomCrawler\Crawler;
use \Goutte\Client;


/**
 * @param $form
 * @param $formName
 * @return bool
 *
 * Import a form
 *
 * @Since V 0.6
 *
 * @CalledIn easy-forms/test/index.php
 */
function import_form($form, $formName)
{


    if (!is_dir(__DIR__ . '/../library/uploads') && !mkdir(__DIR__ . '/../library/uploads'))
        return [
            'result' => false,
            'reason' => 'Error on form import the directory library/uploads does not exist' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];

    $file = new CURLFile(__DIR__ . '/forms/' . $form, 'application/json', $form);

    $ch = prepareCurl();
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        'import-form' => $file,
        'import-forms-bastien' => 'importer'
    ]);
    curl_setopt($ch, CURLOPT_URL, admin_url() . 'admin.php?page=import-form&noheader=true');
    $content = curl_exec($ch);
    curl_close($ch);

    if ($content === false)
        return [
            'result' => false,
            'reason' => 'Error on form import' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>'
        ];

    $form = selectLastPost('form-plugin-bastien');
    if (!$form)
        return [
            'result' => false,
            'reason' => 'Form not found' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];


    return [
        'result' => $form->post_title == $formName,
        'reason' => 'Form has not been created' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
    ];
}

/**
 *
 * Log the user
 *
 * @param $login_user
 * @param $login_pass
 * @return bool
 *
 * @Since V 0.6
 *
 * @CalledIn easy-forms/test/index.php
 *
 */
function login($login_user, $login_pass)
{
    $login_url = home_url() . "/wp-login.php";
    // Preparing postdata for wordpress login
    $data = "log=" . $login_user . "&pwd=" . $login_pass . "&wp-submit=Log%20In&rememberme=1";

    $ch = prepareCurl();
    curl_setopt($ch, CURLOPT_URL, $login_url);
    curl_setopt($ch, CURLOPT_REFERER, $login_url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_POST, 1);
    $content = curl_exec($ch);
    // Close the cURL.
    curl_close($ch);
    return [
        'result' => $content !== false,
        'reason' => 'Error on loading' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
    ];
}

/**
 *  Test if the user add form works
 *
 * @Since V 0.6
 *
 * @CalledIn easy-forms/test/index.php
 *
 */
function test_add_form()
{


    $form = selectLastPost('form-plugin-bastien');
    if (!$form)
        return [
            'result' => false,
            'reason' => 'form not found' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];

    $client = new Client();
    $crawler = $client->request('GET', FORM_ADDRESS);


    try {
        // select the form and fill in some values
        $form = $crawler->selectButton($form->post_name)->form();
        $form['title'] = 'Test Title';
        $form['content'] = 'Test Content';
    } catch (Exception $e) {
        vardump(FORM_ADDRESS);
        vardump($crawler->html());
        return [
            'result' => false,
            'reason' => $e->getMessage() . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];
    }

    sleep(1);
    $result = $client->submit($form);

    if (strpos($result->text(), 'Wp_Form_Error') !== false) {
        return [
            'result' => (strpos($result->text(), 'Wp_Form_Error') === false),
            'reason' => json_decode($result->text(), true)['Wp_Form_Error'] . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>'
        ];
    }

    $post = selectLastPost();
    if (!$post)
        return [
            'result' => false,
            'reason' => 'post not found' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];

    return [
        'result' => $post->post_title === 'Test Title' && $post->post_content === 'Test Content',
        'reason' => 'Last post incorrect' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
    ];

}


/**
 *  Test if the user update form works
 *
 * @Since V 0.6
 *
 * @CalledIn easy-forms/test/index.php
 *
 */
function test_update_post_form()
{


    $form = selectLastPost('form-plugin-bastien');
    if (!$form)
        return [
            'result' => false,
            'reason' => 'form not found' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];

    $client = new Client();
    $crawler = $client->request('GET', FORM_ADDRESS . '&post=true');


    try {

        // select the form and fill in some values
        $form = $crawler->selectButton($form->post_name)->form();

        if (
            $form['title']->getValue() != 'Test Title' ||
            $form['content']->getValue() != 'Test Content'
        )
            return [
                'result' => false,
                'reason' => __("Les données du post ne sont pas dans le formulaire ", 'easy-form') . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
            ];


        $form['title'] = 'Test Title';
        $form['content'] = 'Test new Content';
    } catch (Exception $e) {
        vardump(FORM_ADDRESS);
        vardump($crawler->html());
        return [
            'result' => false,
            'reason' => $e->getMessage() . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];
    }

    sleep(1);
    $result = $client->submit($form);

    if (strpos($result->text(), 'Wp_Form_Error') !== false) {
        return [
            'result' => (strpos($result->text(), 'Wp_Form_Error') === false),
            'reason' => json_decode($result->text(), true)['Wp_Form_Error'] . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>'
        ];
    }

    // Flush the cache, else the metadata will not be the last ones
    /** @var $wp_object_cache wp_object_cache */
    global $wp_object_cache;
    $wp_object_cache->flush();

    $post = selectLastPost();
    if (!$post)
        return [
            'result' => false,
            'reason' => 'post not found' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];


    return [
        'result' => $post->post_content === 'Test new Content',
        'reason' => __('Le dernier post est incorrect', 'easy-form') . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
    ];

}


/**
 *
 * @Since V 0.6
 *
 * @CalledIn easy-forms/test/index.php
 *
 * Test if the user add form works
 *
 * @return array
 */
function test_add_user_form()
{


    $form = selectLastPost('form-plugin-bastien');
    if (!$form)
        return [
            'result' => false,
            'reason' => 'form not found' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];

    $client = new Client();
    $crawler = $client->request('GET', FORM_ADDRESS . '&user=true');


    try {
        // select the form and fill in some values
        $form = $crawler->selectButton($form->post_name)->form();
        $form['email'] = 'email@email.com';
        $form['password'] = 'password';
        $form['repeat-password'] = 'password';
        $form['login'] = 'loginIn';
        $form['first_name'] = "first Name";
        $form['last_name'] = "Last name";
        $form['url'] = 'http://www.myurl.com';
        $form['content'] = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aut dicta excepturi exercitationem harum hic illo iusto mollitia natus nihil obcaecati possimus, quod saepe sint tenetur! Dolorum ducimus expedita modi?";
    } catch (Exception $e) {

        return [
            'result' => false,
            'reason' => 'Line : ' . $e->getMessage() . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];
    }

    sleep(1);
    $result = $client->submit($form);

    if (strpos($result->text(), 'Wp_Form_Error') !== false) {
        return [
            'result' => (strpos($result->text(), 'Wp_Form_Error') === false),
            'reason' => json_decode($result->text(), true)['Wp_Form_Error'] . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>'
        ];
    }

    $user = selectLastUser();
    if (!$user)
        return [
            'result' => false,
            'reason' => 'user not found' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];

    return [
        'result' => $user->data->user_login === 'loginIn' && $user->data->user_email === 'email@email.com' && $user->data->user_url = "http://www.myurl.com",
        'reason' => 'Last user incorrect' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
    ];

}

/**
 *
 * @Since V 0.6
 *
 * @CalledIn easy-forms/test/index.php
 *
 * Test the update of a user
 *
 */
function test_update_user_form()
{
    $form = selectLastPost('form-plugin-bastien');
    if (!$form)
        return [
            'result' => false,
            'reason' => 'form not found' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];

    $client = new Client();
    $crawler = $client->request('GET', FORM_ADDRESS . '&user=true');


    try {
        // select the form and fill in some values
        $form = $crawler->selectButton($form->post_name)->form();

        if (
            $form['email']->getValue() != 'email@email.com' ||
            $form['first_name']->getValue() != 'first Name' ||
            $form['last_name']->getValue() != 'Last name' ||
            $form['url']->getValue() != 'http://www.myurl.com' ||
            $form['content']->getValue() != 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aut dicta excepturi exercitationem harum hic illo iusto mollitia natus nihil obcaecati possimus, quod saepe sint tenetur! Dolorum ducimus expedita modi?'
        )
            return [
                'result' => false,
                'reason' => __("Les données de l'utilisateur ne sont pas dans le formulaire ", 'easy-form') . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
            ];


        $form['email'] = 'email@email.com';
        $form['password'] = 'password';
        $form['repeat-password'] = 'password';
        $form['login'] = 'loginIn';
        $form['first_name'] = "New First Name";
        $form['last_name'] = "New Last name";
        $form['url'] = 'http://www.mynewurl.com';
        $form['content'] = "I like Bananas";

    } catch (Exception $e) {

        return [
            'result' => false,
            'reason' => $e->getMessage() . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];
    }

    sleep(1);
    $result = $client->submit($form);

    if (strpos($result->text(), 'Wp_Form_Error') !== false) {
        return [
            'result' => (strpos($result->text(), 'Wp_Form_Error') === false),
            'reason' => json_decode($result->text(), true)['Wp_Form_Error'] . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>'
        ];
    }

    $user = selectLastUser();
    if (!$user)
        return [
            'result' => false,
            'reason' => 'user not found' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];


    // Flush the cache, else the metadata will not be the last ones
    /** @var $wp_object_cache wp_object_cache */
    global $wp_object_cache;
    $wp_object_cache->flush();

    return [
        'result' => get_user_meta($user->data->ID, 'last_name', true) == 'New Last name' && get_user_meta($user->data->ID, 'first_name', true) == 'New First Name' && $user->data->user_url == "http://www.mynewurl.com",
        'reason' => __("La mise à jour de l'utilisateur n'a pas fonctionné ", 'easy-form') . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
    ];

}


/**
 *
 * @Since V 0.6
 *
 * @CalledIn easy-forms/test/index.php
 *
 * Test the connexion of a user
 *
 */
function test_connect_user()
{

    $form = selectLastPost('form-plugin-bastien');
    if (!$form)
        return [
            'result' => false,
            'reason' => 'form not found' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];

    $client = new Client();
    $crawler = $client->request('GET', FORM_ADDRESS);

    try {
        // select the form and fill in some values
        $form = $crawler->selectButton($form->post_name)->form();
        $form['login'] = 'loginIn';
        $form['password'] = "password";
        $form['remember'] = "on";
    } catch (Exception $e) {

        vardump(FORM_ADDRESS);
        vardump($crawler->html());
        return [
            'result' => false,
            'reason' => $e->getMessage() . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];
    }

    sleep(1);
    $result = $client->submit($form);

    if (strpos($result->text(), 'Wp_Form_Error') !== false) {
        return [
            'result' => (strpos($result->text(), 'Wp_Form_Error') === false),
            'reason' => json_decode($result->text(), true)['Wp_Form_Error'] . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];
    }

    return [
        'result' => json_decode($result->text(), true)['is_connected'],
        'reason' => 'User not connected ' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
    ];
}

/**
 *
 * @Since V 0.6
 *
 * @CalledIn easy-forms/test/index.php
 *
 * Delete the last form in the database
 */
function delete_last_form()
{
    if ($result = selectLastPost('form-plugin-bastien'))
        return [
            'result' => wp_delete_post($result->ID) !== false,
            'reason' => 'Form not deleted' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];
    else
        return [
            'result' => wp_delete_post($result->ID) !== false,
            'reason' => 'Form not found' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];
}

/**
 * Delete the last post created by the script
 *
 * @Since V 0.6
 *
 * @CalledIn easy-forms/test/index.php
 *
 * @return array
 */
function delete_last_post()
{
    $args = [
        'post_type' => 'post',
        'posts_per_page' => 1,
    ];
    $my_query = new WP_Query($args);

    if (isset($my_query->posts[0])) {
        return [
            'result' => wp_delete_post($my_query->posts[0]->ID),
            'reason' => 'Last post has not been deleted correctly' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];
    } else {
        return [
            'result' => false,
            'reason' => 'Last post not found' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>',
        ];
    }
}

/**
 *
 * @Since V 0.6
 *
 * @CalledIn easy-forms/test/index.php
 *
 * delete the last user created by the script
 *
 * @return array
 */
function delete_last_user()
{

    $user = selectLastUser();

    if ($user) {
        return [
            'result' => wp_delete_user($user->ID),
            'reason' => 'Last user has not been deleted correctly' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>'
        ];
    } else {
        return [
            'result' => false,
            'reason' => 'Last user not found' . '<b> in ' . __FILE__ . ' on line ' . __LINE__ . '</b>'
        ];
    }
}


/**
 *
 * @Since V 0.6
 *
 * @CalledIn easy-forms/test/functions.php
 *
 * @param string $postType
 * @return bool|WP_POST
 */
function selectLastPost($postType = 'post')
{
    $args = [
        'post_type' => $postType,
        'posts_per_page' => 1,
    ];
    $my_query = new WP_Query($args);

    return isset($my_query->posts[0]) ? $my_query->posts[0] : false;
}

/**
 * @Since V 0.6
 *
 * @CalledIn easy-forms/test/functions.php
 *
 * @return bool|WP_POST
 */
function selectLastUser()
{
    $args = [
        'role' => 'Subscriber',
        'number' => 1,
        'orderby' => 'ID',
        'order' => 'DESC'
    ];
    $my_query = new WP_User_Query($args);

    return isset($my_query->get_results()[0]) ? $my_query->get_results()[0] : false;
}


/**
 *
 * @Since V 0.6
 *
 * @CalledIn easy-forms/test/functions.php
 *
 * Prepare a curl session
 *
 * @return resource
 */
function prepareCurl()
{

    $cookie_file = __DIR__ . "/cookie.txt";
    $http_agent = "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6";
    // Intialize cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie_file);
    curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie_file);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERAGENT, $http_agent);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    return $ch;

}


/**
 *
 * @Since V 0.5.6
 *
 * @CalledIn easy-forms/test/index.php
 *
 * Launch the test and display the result
 *
 * @param $function string the function you want to test
 * @param $params array the parameters for the function
 * @return bool if the test was a success
 */
function test($function, $params)
{

    $time = microtime(true);

    $result = call_user_func_array($function, $params);

    echo json_encode([
        'result' => isset($result['result']) && $result['result'],
        'function' => $function,
        'params' => $function == 'login' ? [] : $params,
        'time' => round(microtime(true) - $time, 2) . 's',
        'reason' => isset($result['result']) && $result['result'] ? '' : $result['reason'],

    ]);

    return isset($result['result']) && $result['result'];
}