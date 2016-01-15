<?php

use \Symfony\Component\DomCrawler\Crawler;
use \Goutte\Client;
/**
 * @param $form
 * @param $formName
 * @return bool
 */
function import_form($form,$formName){

    $file = new CURLFile( __DIR__ . '/forms/' . $form,'application/json',$form);

    $ch = prepareCurl();
    curl_setopt($ch, CURLOPT_POSTFIELDS,[
        'import-form' => $file,
        'import-forms-bastien' => 'importer'
    ]);
    curl_setopt($ch, CURLOPT_URL, admin_url() . 'admin.php?page=import-form&noheader=true');
    $content = curl_exec($ch);
    curl_close($ch);
    if($content === false)
        return [
            'result' => false,
            'reason' => 'Error on form import' . ' on line ' .  __LINE__ . ' in ' . __FILE__
        ];

    $form = selectLastPost('form-plugin-bastien');
    if(!$form)
        return [
            'result' => false,
            'reason' => 'Form not found'. ' on line ' .  __LINE__ . ' in ' . __FILE__,
        ];

    return [
        'result' => $form->post_title == $formName,
        'reason' => 'Form has not been created'. ' on line ' .  __LINE__ . ' in ' . __FILE__,
    ];
}

/**
 *
 * Log the user
 *
 * @param $login_user
 * @param $login_pass
 * @return bool
 */
function login( $login_user, $login_pass){
    $login_url = home_url() . "/wp-login.php";
    // Preparing postdata for wordpress login
    $data = "log=". $login_user ."&pwd=" . $login_pass . "&wp-submit=Log%20In&rememberme=1";

    $ch = prepareCurl();
    curl_setopt( $ch, CURLOPT_URL, $login_url );
    curl_setopt( $ch, CURLOPT_REFERER, $login_url );
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $data );
    curl_setopt( $ch, CURLOPT_POST, 1);
    $content = curl_exec ($ch);
    // Close the cURL.
    curl_close( $ch );
    return [
        'result' => $content !== false,
        'reason' => 'Error on loading'. ' on line ' .  __LINE__ . ' in ' . __FILE__,
    ];
}

/**
 *
 */
function test_add_form(){

    global $form_adress;

    $form = selectLastPost('form-plugin-bastien');
    if(!$form )
        return [
            'result' => false,
            'reason' => 'form not found'. ' on line ' .  __LINE__ . ' in ' . __FILE__,
        ];

    $client = new Client();
    $crawler = $client->request('GET',$form_adress);

    try {
        // select the form and fill in some values
        $form = $crawler->selectButton($form->post_name)->form();
        $form['title'] = 'Test Title';
        $form['content'] = 'Test Content';
    }catch(Exception $e){

        return [
            'result' => false,
            'reason' => 'Line : ' .  $e->getMessage() . ' on line ' .  __LINE__ . ' in ' . __FILE__,
        ];
    }

    sleep(1);
    $result = $client->submit($form);

    if(strpos($result->text(),'Wp_Form_Error') !== false) {
        return [
            'result' => (strpos($result->text(), 'Wp_Form_Error') === false),
            'reason' => json_decode($result->text(), true)['Wp_Form_Error']. ' on line ' .  __LINE__ . ' in ' . __FILE__
        ];
    }

    $post = selectLastPost();
    if(!$post )
        return [
            'result' => false,
            'reason' => 'post not found'. ' on line ' .  __LINE__ . ' in ' . __FILE__,
        ];

    return [
        'result' => $post->post_title === 'Test Title' && $post->post_content === 'Test Content',
        'reason' => 'Last post incorrect'. ' on line ' .  __LINE__ . ' in ' . __FILE__,
    ];

}

/**
 *
 */
function delete_last_form(){
    if($result = selectLastPost('form-plugin-bastien'))
        return [
            'result' => wp_delete_post($result->ID) !== false,
            'reason' => 'Form not deleted'. ' on line ' .  __LINE__ . ' in ' . __FILE__,
        ];
    else
        return [
            'result' => wp_delete_post($result->ID) !== false,
            'reason' => 'Form not found'. ' on line ' .  __LINE__ . ' in ' . __FILE__,
        ];
}

function delete_last_post(){
    $args = [
        'post_type' => 'post',
        'posts_per_page' => 1,
    ];
    $my_query = new WP_Query($args);

    if(isset($my_query->posts[0])){
        return [
            'result' => wp_delete_post($my_query->posts[0]->ID),
            'reason' => 'Last post has not been deleted correctly'. ' on line ' .  __LINE__ . ' in ' . __FILE__
        ];
    }else{
        return [
            'result' => false,
            'reason' => 'Last post not found'. ' on line ' .  __LINE__ . ' in ' . __FILE__
        ];
    }
}



/**
 * @param string $postType
 * @return bool|WP_POST
 */
function selectLastPost($postType = 'post'){
    $args = [
        'post_type' => $postType,
        'posts_per_page' => 1,
    ];
    $my_query = new WP_Query($args);

    return  isset($my_query->posts[0]) ? $my_query->posts[0] : false;
}


/**
 *
 * Prepare a curl session
 *
 * @return resource
 */
function prepareCurl(){

    $cookie_file = __DIR__  ."/cookie.txt";
    $http_agent = "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6";
    // Intialize cURL
    $ch = curl_init();
    curl_setopt( $ch, CURLOPT_COOKIEFILE, $cookie_file );
    curl_setopt( $ch, CURLOPT_COOKIEJAR, $cookie_file );
    curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
    curl_setopt( $ch, CURLOPT_USERAGENT, $http_agent );
    curl_setopt( $ch, CURLOPT_TIMEOUT, 60 );
    curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, false );
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );

    return $ch;

}


/**
 *
 * Launch the test and display the result
 *
 * @param $function
 * @param $params
 */
function test($function,$params){

    $time = microtime(true);

    $result = call_user_func_array($function,$params);

    if(isset($result['result']) && $result['result'])
        echo "<span style='color:green;'>$function success in : " . round(microtime(true) - $time,2) . "s</span>";
    else
        die("<span style='color:red;'>$function Echec : {$result['reason']}</span>");

    echo "\n\r";
}

?>