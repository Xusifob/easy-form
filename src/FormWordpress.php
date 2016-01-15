<?php


/**
 * Class FormWordpress
 */
class FormWordpress extends Form
{

    /**
     * Form ID
     *
     * @since V 0.4
     *
     * @var int
     */
    protected $id;

    /**
     * Constructor
     *
     * @Since V 0.4
     *
     * @param string $name
     * @param string $action
     * @param array $args
     */
    public function __construct($name,$action = '#',$args = [])
    {


        parent::__construct($name,$action,$args);

        $json = $this->getLangTemplate('fr');

        $this->errorMessages = json_decode($json,true);

        // store the form Id
        if(isset($args['formId']))
            $this->id = $args['formId'];
    }

    /**
     * Return if the form is able to insert a post
     *
     * @since V 0.1
     *
     * @return bool
     */
    protected function canInsertPost()
    {
        $insert = false;
        foreach($this->fields as $field){
            if($field['name'] == 'title' && $field['required'])
                $insert = true;
        }

        if(!$insert)
            $this->setError($this->errorMessages['missingfield'] . 'name');

        return $insert;
    }

    /**
     * Return if the form is able to send a mail
     *
     * @since V 0.1
     *
     * @param $args
     * @return bool
     */
    protected function canSendMail($args)
    {
        $insert = [
            'email' => false,
            'sendername' => false,
            'message' => false,
        ];
        foreach ($this->fields as $field) {
            if ($field['name'] == 'email' || (isset($args['senderEmail']) && !empty($args['senderEmail'])))
                $insert['email'] = true;
            elseif ($field['name'] == 'sendername' || (isset($args['sendername']) && !empty($args['sendername']) ))
                $insert['sendername'] = true;
            elseif ($field['name'] == 'message' || (isset($args['message']) && !empty($args['message']))) {
                $insert['message'] = true;
            }
        }

        if(!($insert['sendername'] && $insert['email'] && $insert['message'])){
            $error = '';
            foreach($insert as $key => $val){
                if(!$val){
                    $error .= $this->errorMessages['missingfield'] . $key . ' ';
                }
            }
            $this->setError($error);
        }
        return ($insert['sendername'] && $insert['email'] && $insert['message']);
    }


    /**
     *
     * Return if the form is able to insert a user
     *
     * @since V 0.1
     *
     * @Modified V 0.4
     *
     * @param $postId
     * @return bool
     */
    protected function canInsertUser($postId)
    {
        if ($postId == null) {
            $insert = [
                'password' => false,
                'email' => false,
                'login' => false,
            ];
            foreach ($this->fields as $field) {
                if ($field['name'] == 'email')
                    $insert['email'] = true;
                elseif ($field['name'] == 'password')
                    $insert['password'] = true;
            }

            if(!($insert['login'] && $insert['email'])){
                $error = '';
                foreach($insert as $key => $val){
                    if(!$val){
                        $error .= $this->errorMessages['missingfield'] . $key . ' ';
                    }
                }
                $this->setError($error);
            }
            return ($insert['password'] && $insert['email']);
        }else{
            return true;
        }
    }


    /**
     *
     * Return if the form is able to connect a user
     *
     * @Used in FormWordpress::connectUser
     *
     * @since V 0.1
     *
     * @return bool
     */
    protected function canConnect()
    {

        // Mandatory Fields
        $insert = [
            'login' => false,
            'password' => false
        ];


        // Check fields
        foreach($this->fields as $field){
            if($field['name'] == 'login'){
                $insert['login'] = true;
            }elseif($field['name'] == 'password'){
                $insert['password'] = true;
            }
        }


        // display errors
        if(!($insert['login'] && $insert['password'])){
            $error = '';
            foreach($insert as $key => $val){
                if(!$val){
                    $error .= $this->errorMessages['missingfield'] . $key . ' ';
                }
            }
            $this->setError($error);
        }

        return ($insert['password'] && $insert['login']);
    }


    /**
     *
     * Return if the form is able to reset a password
     *
     * @since V 0.2
     *
     * @Modified : - V 0.5
     *
     * @return bool
     */
    protected function canResetPassword()
    {
        $insert = false;

        if($this->resetArgsAvailable()){
            // Check fields
            foreach($this->fields as $field){
                if($field['name'] == 'password')
                    $insert = true;
            }
        }else {

            // Check fields
            foreach ($this->fields as $field) {
                if ($field['name'] == 'login')
                    $insert = true;
            }
        }

        // display error
        if(!$insert) {
            $error = $this->errorMessages['missingfield'] . $this->resetArgsAvailable() ? 'password' : 'login';
            $this->setError($error);
        }

        return $insert;
    }



    /**
     *
     * @since V 0.1
     *
     * Insert a wordpress post
     *
     * @param null $postId
     * @param array $args
     * @return bool|int|null|WP_Error
     */
    public function insertPost($postId = null,$args = [])
    {

        // If i can insert the post, else if it's an update
        if ($this->canInsertPost() || null != $postId) {
            $postarr = [
                'post_title' => $_POST['title'],
                'post_type' => isset($args['post_type']) ? $args['post_type'] : 'post',
                'post_content' => isset($_POST['content']) ? $_POST['content'] : '',
                'post_name' => sanitize_title($_POST['title']),
                'post_status' => isset($args['post_status']) ? $args['post_status'] : 'publish',
                'post_author' => isset($args['post_author']) ? $args['post_author'] : get_current_user_id(),
            ];

            if (isset($postId) && null != ($postId))
                $postarr['ID'] = $postId;

            // If there is fields that belong here, i insert the post
            if($this->canInsertPost())
                $postId = wp_insert_post($postarr);

            if (!is_wp_error($postId)) {
                // Array of fields which are not metas
                $notField = ['content', 'title'];


                // Foreach Field
                foreach ($this->fields as $field) {
                    if ($field['type'] != 'file') {
                        if (!in_array($field['name'], $notField)) {
                            if ($field['type'] == 'taxonomy') {
                                wp_set_object_terms($postId, $_POST[$field['name']], substr($field['name'], 9));

                            } elseif(in_array($field['type'],['checkbox','radio'])) {
                                if(isset($_POST[$field['name']]))
                                    update_post_meta($postId, $field['name'], $_POST[$field['name']]);
                            }
                            else {
                                update_post_meta($postId, $field['name'], $_POST[$field['name']]);
                            }
                        }
                    } else {
                        // If there are some files upload

                        // Gestion des anciennes images
                        $oldvals = explode(',', $_POST[$field['name'] . '-values']);
                        foreach ($oldvals as $oldval) {
                            array_push($vals, (int)$oldval);
                        }

                        // If it's a file
                        if (
                            (isset($_FILES[$field['name']]['name']) && is_array($_FILES[$field['name']]['name']) &&  !empty($_FILES[$field['name']]['name'][0])) ||
                            (isset($_FILES[$field['name']]['name']) && !is_array($_FILES[$field['name']]['name']) && !empty($_FILES[$field['name']]['name']))
                        ){
                            $key = $field['name'];
                            $val = $_FILES[$field['name']];
                            $sizeOk = true;

                            if (isset($field['args']['maxSize']) && !empty($field['args']['maxSize'])){
                                foreach ($val['size'] as $siz) {
                                    if($siz > (int)$field['args']['maxSize']*1000) {
                                        $sizeOk = false;
                                        $this->setError($this->errorMessages['filesize']  . $field['args']['maxSize'] . 'ko');
                                    }
                                }
                            }
                            if($sizeOk) {
                                // Handle multiple upload
                                if (is_array($val['name'])) {
                                    $vals = [];
                                    for ($i = 0; $i < count($val['name']); $i++) {

                                        $_FILES[$key . '_' . $i] = [
                                            'name' => $val['name'][$i],
                                            'type' => $val['type'][$i],
                                            'tmp_name' => $val['tmp_name'][$i],
                                            'error' => $val['error'][$i],
                                            'size' => $val['size'][$i],
                                        ];


                                        array_push($vals, $this->insert_attachment($key . '_' . $i, $postId));
                                        // Gestion des anciennes images
                                        $oldvals = explode(',', $_POST[$field['name'] . '-values']);
                                        foreach ($oldvals as $oldval) {
                                            array_push($vals, (int)$oldval);
                                        }
                                        // Gestion des anciennes images
                                        update_post_meta($postId, $key, $vals);
                                        update_post_meta($postId, '_' . $key, $field['args']['acfField']);
                                    }
                                } else {
                                    $this->insert_attachment($key, $postId);
                                }
                            }else
                                return false;
                        }else{
                            // Il a modifié des anciennes photos mais pas de nouvelles
                            if(null != $oldvals) {
                                $oldvals = explode(',', $_POST[$field['name'] . '-values']);
                                update_post_meta($postId, $field['name'], $oldvals);

                                // Handle ACF field
                                if(isset($field['args']['acfField']) && !empty($field['args']['acfField']))
                                    update_post_meta($postId, '_' . $field['name'], $field['args']['acfField']);
                            }
                        }
                    }
                }
            }
            return $postId;
        } else {
            return false;
        }
    }


    /**
     *
     * @since V 0.1
     *
     * @Modify V 0.4
     *
     * Insert a wp_post and redirect after it to the page with the name of the form at true
     *
     * @param string $type
     * @param null $lien
     * @param null $postId
     * @param array $args
     * @return bool
     */
    public function SendFormAndRedirect($type = 'post',$lien = null,$postId = null,$args = [])
    {

        $lien = ($lien == null || $lien == '' || $lien == false)  ? get_permalink() : $lien;


        if($lien === false)
            $lien = home_url();

        $varURl = (isset($args['varURl']) && $lien != 'newpost') ?
            ( strpos($lien,'?')  ? '&' . $args['varURl'] : '?' . $args['varURl'] )
            : '';

        // The union, depends on link if put a & or a ? to start php args
        $union = isset($_GET) && !empty($_GET) ? '&' : '?';

        $thepostId = $postId;

        switch($type) :

            // If it's a post
            case 'post' :

                /* @since V 0.4 add hooks Before Send */
                do_action('form/BeforeInsertOrModifyPost',$postId);
                do_action('form/BeforeInsertOrModifyPost-' . $this->id,$postId);
                if(isset($this->postArgs['id'])) {
                    do_action('form/BeforeModifyPost-' . $this->id,$postId);
                    do_action('form/BeforeModifyPost',$postId);
                }
                else {
                    do_action('form/BeforeInsertPost-' . $this->id,$postId);
                    do_action('form/BeforeInsertPost',$postId);
                }

                if($postId = $this->insertPost($postId,$args)) {
                    $this->setFormSend($thepostId);

                    /* @since V 0.4 add hooks */
                    do_action('form/insertOrModifyPost',$postId);
                    do_action('form/insertOrModifyPost-' . $this->id,$postId);

                    // Keep compatibility with old version, deprecated
                    do_action('form/insertOrModifyPost',$postId);
                    do_action('form/insertOrModifyPost-' . $this->id,$postId);
                    if(isset($this->postArgs['id'])) {
                        do_action('form/ModifyPost-' . $this->id,$postId);
                        do_action('form/ModifyPost',$postId);
                    }
                    else {
                        do_action('form/InsertPost-' . $this->id,$postId);
                        do_action('form/InsertPost',$postId);

                        // Keep compatibility with old version, deprecated
                        do_action('form/insertPost-' . $this->id,$postId);
                        do_action('form/insertPost',$postId);
                    }

                    // If lien == newpost redirect to the new post page
                    if($lien == 'newpost') {

                        /* @since V 0.4 */
                        if (isset($args['varURl']) && !empty($args['varURl'])) {
                            $union = self::getunion($lien);

                            $lien = get_permalink($postId) . $union . $args['varURl'];
                            wp_redirect($lien);
                        }else{
                            wp_redirect(get_permalink($postId));
                        }
                    }else
                        wp_redirect($lien  . $varURl);

                    // Exit after redirect
                    exit();
                }else{
                    return false;
                }
                break;

            case 'user' :

                // Actions
                /* @since V 0.4 add hooks */
                do_action('form/BeforeInsertOrModifyUser',$postId);
                do_action('form/BeforeInsertOrModifyUser-' . $this->id,$postId);
                if(isset($this->postArgs['id'])) {
                    do_action('form/ModifyUser',$postId);
                    do_action('form/ModifyUser-' . $this->id,$postId);
                } else {
                    do_action('form/BeforeInsertUser',$postId);
                    do_action('form/BeforeInsertUser-' . $this->id,$postId);
                }

                $lien = ($lien == 'newpost') ? null : $lien;

                if($postId  = $this->insertUser($postId,$args)) {
                    $this->setFormSend($thepostId);

                    // Actions
                    /* @since V 0.4 add hooks */
                    do_action('form/InsertOrModifyUser',$postId);
                    do_action('form/InsertOrModifyUser-' . $this->id,$postId);

                    // Keep compatibility with old version, deprecated
                    do_action('form/insertOrModifyUser',$postId);
                    do_action('form/insertOrModifyUser-' . $this->id,$postId);
                    if(isset($this->postArgs['id'])) {
                        do_action('form/ModifyUser',$postId);
                        do_action('form/ModifyUser-' . $this->id,$postId);
                    } else {

                        do_action('form/InsertUser',$postId);
                        do_action('form/InsertUser-' . $this->id,$postId);

                        // Keep compatibility with old version, deprecated
                        do_action('form/insertUser',$postId);
                        do_action('form/insertUser-' . $this->id,$postId);
                    }

                    wp_redirect($lien . $varURl);
                    exit();
                }else{
                    return false;
                }
                break;
            case 'email' :
                $lien = ($lien == 'newpost') ? null : $lien;

                do_action('form/BeforeSendMail');
                do_action('form/BeforeSendMail-' . $this->id);
                if($this->sendMail($args)) {
                    $this->setFormSend($thepostId);

                    /* @since V 0.4 add hooks */
                    do_action('form/SendMail');
                    do_action('form/SendMail-' . $this->id);

                    // Keep compatibility with old version, deprecated
                    do_action('form/sendMail');
                    do_action('form/sendMail-' . $this->id);
                    wp_redirect($lien . $varURl);
                    exit();
                }else{
                    return false;
                }
                break;
            case 'connexion' :
                $lien = ($lien == 'newpost') ? null : $lien;


                if($user = $this->connectUser($args)){
                    $this->setFormSend($thepostId);

                    /* @since V 0.4 add hooks */
                    do_action('form/ConnectUser',$user->ID);
                    do_action('form/ConnectUser-' . $this->id,$user->ID);
                    wp_redirect($lien . $varURl);
                    exit();
                }
                break;

            case 'resetPassword' :

                do_action('form/BeforeResetPassword');
                do_action('form/BeforeResetPassword-' . $this->id);

                $lien = ($lien == 'newpost') ? null : $lien;
                if($this->resetPassword($args)){
                    $this->setFormSend($thepostId);

                    /* @since V 0.4 add hooks */
                    do_action('form/ResetPassword');
                    do_action('form/ResetPassword-' . $this->id);

                    // Keep compatibility with old version, deprecated
                    do_action('form/resetPassword');
                    do_action('form/resetPassword-' . $this->id);

                    wp_redirect($lien . $varURl);
                    exit();
                }elseif(!$this->hasError())
                    $this->setError($this->errorMessages['error']);

                break;
        endswitch;
    }

    /**
     * Set the form has been send
     *
     * @since V 0.4
     *
     * @param $thepostId
     */
    protected function setFormSend($thepostId = null)
    {
        if(null == $thepostId)
            $_SESSION[$this->name] = true;
        else
            $_SESSION[$this->name . $thepostId] = true;
    }

    /**
     * Reset a password and send an e-mail
     *
     * @since V 0.2
     *
     * @Modified : V 0.4
     *
     * @param $args array
     *
     * @return bool
     */
    public function resetPassword($args = [])
    {
        if($this->canResetPassword()){

            global $wpdb, $wp_hasher;

            if($user = $this->checkResetPage()) {
                wp_set_password($_POST['password'], $user->data->ID);
                return true;
            }else {

                $user_login = $_POST['login'];

                if (strpos($user_login, '@')) {
                    $user_data = get_user_by('email', trim($user_login));

                    if(empty($user_data) || !$user_data)
                        $user_data = get_user_by('login', trim($user_login));

                } else {
                    $login = trim($user_login);
                    $user_data = get_user_by('login', $login);
                }

                do_action('lostpassword_post');


                if (!empty($user_data) && $user_data) {

                    // redefining user_login ensures we return the right case in the email
                    $user_login = $user_data->user_login;
                    $user_email = $user_data->user_email;

                    do_action('retrieve_password', $user_login);


                    $allow = apply_filters('allow_password_reset', true, $user_data->ID);

                    if ($allow) {
                        $args['resetAction'] = isset($args['resetAction']) ? $args['resetAction'] : 'reset-password-email';

                        /** @Since V 0.4 */
                        $sendArgs = isset(get_post_meta($this->id, 'form-send-args')[0]) ? get_post_meta($this->id, 'form-send-args')[0] : false;

                        $senderEmail = isset($sendArgs['senderEmail']) && !empty($sendArgs['senderEmail']) ? $sendArgs['senderEmail'] : get_option('admin_email');
                        $subject = isset($sendArgs['subject']) && !empty($sendArgs['subject']) ? $sendArgs['subject'] : 'Renouvellement du mot de passe';
                        $senderName = isset($sendArgs['sendername']) && !empty($sendArgs['sendername']) ? $sendArgs['sendername'] : get_option('blogname');

                        /** @var Phpmailerform $mail */
                        $mail = $this->prepareMail();
                        $mail->setFrom($senderEmail, $senderName);
                        $mail->addAddress($user_data->user_email, $user_data->user_login);
                        $mail->Subject = $subject;



                        if ($args['resetAction'] == 'reset-password-email') {

                            // Create new password
                            $password = self::random(8);

                            // Set new password
                            wp_set_password($password, $user_data->ID);


                            if (isset($sendArgs['message']) && !empty($sendArgs['message']))
                                $message = $sendArgs['message'];
                            else
                                $message = $this->getFormTemplate('resetPassword.php');

                            $message = str_replace('%ID%', $user_login, $message);
                            $message = str_replace('%PASSWORD%', $password, $message);
                            $message = str_replace('%BLOGNAME%', $senderName, $message);

                            // Send link
                        } else {
                            $key = $this->retrieve_password($user_login);

                            // Get the template||message
                            if (isset($sendArgs['message']) && !empty($sendArgs['message']))
                                $message = $sendArgs['message'];
                            else
                                $message = $this->getFormTemplate('retrievePassword.php');

                            // Get the link of the page
                            $lien = get_permalink($args['pageId']);

                            // If there isn't a ? start the params with ? else with &
                            $union = self::getunion($lien);

                            // I put every fields in the link
                            $lien .= $union . 'action=rt';
                            $lien .= '&login=' . rawurlencode($user_login);
                            $lien .= '&key=' . $key;

                            $lienhtml = '<a href="' . $lien . '">' . $lien . '</a>';


                            $message = str_replace('%ID%', $user_login, $message);
                            $message = str_replace('%LIEN%', $lienhtml, $message);
                            $message = str_replace('%BLOGNAME%', $senderName, $message);


                            $mail->Body = $message;


                        }
                        try {
                            $mail->Body = $message;

                            return $mail->send();
                        } catch (Exception $e) {

                            $this->setError($e->getMessage());
                            return false;
                        }

                    } else {
                        $this->setError($this->errorMessages['noReset']);
                        return false;
                    }
                } else {
                    $this->setError($this->errorMessages['noUser']);
                    return false;
                }
            }
        }else{
            return false;
        }
    }


    /**
     * @Since V 0.5
     *
     * Return the union between 2 parameters in a link
     *
     * @param $lien
     * @return string
     */
    public static function getunion($lien){
        return strpos($lien, '?') === false ? '?' : '&';

    }

    /**
     * @return Phpmailerform
     */
    public function prepareMail(){
        $mail = new Phpmailerform();
        $mail->isHTML(true);
        $mail->setLanguage('fr');
        $mail->CharSet = "UTF-8";
        return $mail;
    }


    /**
     * Handles sending password retrieval email to user.
     *
     * @Since V 0.5
     *
     * @param : $user_login string
     *
     * @global wpdb         $wpdb      WordPress database abstraction object.
     * @global PasswordHash $wp_hasher Portable PHP password hashing framework.
     *
     * @return bool|WP_Error True: when finish. WP_Error on error
     */
    public function retrieve_password($user_login) {

        global $wpdb;

        // Generate something random for a password reset key.
        $key = wp_generate_password( 20, false );

        do_action( 'retrieve_password_key', $user_login, $key );

        // Now insert the key, hashed, into the DB.
        if ( empty( $wp_hasher ) ) {
            require_once ABSPATH . WPINC . '/class-phpass.php';
            $wp_hasher = new PasswordHash( 8, true );
        }
        $hashed = $wp_hasher->HashPassword( $key );
        $wpdb->update( $wpdb->users, array( 'user_activation_key' => $hashed ), array( 'user_login' => $user_login ) );


        return $key;

    }

    /**
     * @Since V 0.5
     *
     * @return bool
     */
    public function checkResetPage(){
        if(!$this->resetArgsAvailable())
            return false;

        if (isset($_GET['key']) && isset($_GET['login'])) {
            $user = check_password_reset_key($_GET['key'], $_GET['login']);

        } else {
            $this->error = $this->errorMessages['invalidKey'];
            return false;
        }

        if(is_wp_error($user)) {


            if ($user && $user->get_error_code() === 'expired_key')
                $this->error = $this->errorMessages['expiredKey'];
            else
                $this->error = $this->errorMessages['invalidKey'];

            return false;
        }


        if(is_object($user) && !is_wp_error($user))
            return $user;

        do_action('validate_password_reset', [], $user);

    }





    /**
     * Return if the post has been send or not
     *
     * @since V 0.1
     *
     * @param $postId
     * @return bool
     */
    public function hasBeenSend($postId = null)
    {

        if(null == $postId) {
            // If there is a session with the name
            if (isset($_SESSION[$this->name])) {
                // I unset the session
                unset($_SESSION[$this->name]);

                // I return if there is no error
                return (!$this->hasError());
                // Else, the form has not been send
            } else
                return false;
        }else{
            // If there is a session with the name
            if (isset($_SESSION[$this->name . $postId])) {
                // I unset the session
                unset($_SESSION[$this->name . $postId]);

                // I return if there is no error
                return (!$this->hasError());
                // Else, the form has not been send
            } else
                return false;
        }
    }

    /**
     *
     * @Since V 0.4
     *
     * Insert the file
     *
     * @param $file_handler
     * @param int $post_id
     * @return int|WP_Error
     */
    public static function insert_file($file_handler,$post_id = 0){
        // Get all images
        require_once(ABSPATH . "wp-admin" . '/includes/image.php');
        require_once(ABSPATH . "wp-admin" . '/includes/file.php');
        require_once(ABSPATH . "wp-admin" . '/includes/media.php');

        // check to make sure its a successful upload
        if ($_FILES[$file_handler]['error'] !== UPLOAD_ERR_OK) __return_false();

        // Upload the file
        $attachement_id = media_handle_upload($file_handler, $post_id);

        return is_wp_error($attachement_id) ? false : $attachement_id;
    }

    /**
     *
     * @Since V 0.1
     *
     * Insert a file into a wp_post or a wp_user meta
     *
     * @param $file_handler
     * @param $post_id
     *
     * @Since V 0.3
     * @param string $post_type
     *
     * @return int|WP_Error
     */
    protected function insert_attachment($file_handler,$post_id,$post_type = 'post') {

        $attach_id = self::insert_file($file_handler,$post_id);

        if($attach_id) {
            if ($post_type == 'post') {
                if ($file_handler == 'thumbnail')
                    update_post_meta($post_id, '_thumbnail_id', $attach_id);
                else
                    update_post_meta($post_id, $file_handler, $attach_id);
            } else {
                update_user_meta($post_id, $file_handler, $attach_id);
            }
        }

        return $attach_id;
    }

    /**
     *
     * Insert an user into the database
     *
     * @since V 0.1
     *
     * @Modified : V 0.4
     *
     * @param null $postId
     * @param array $args
     * @return bool
     */
    public function insertUser($postId = null,$args = [])
    {
        if($this->canInsertUser($postId)) {

            // Handle User has to be activated by e-mail
            $ActivateUser = isset($args['emailUser']) && true === $args['emailUser'];


            if(isset($args['role'])){
                if($args['role'] == 'current'){
                    if(is_user_logged_in())
                        $role = $this->get_user_role($postId);
                    else
                        $role = 'subscriber';
                }else
                    $role = $args['role'];
            }else
                $role = 'subscriber';


            // If there is an id it's an update, else it's an insert
            if(isset($postId) && null != ($postId)) {
                $postarr = [
                    'ID' => $postId,
                    'user_email' => isset($_POST['email']) ? $_POST['email'] : '',
                    'user_url' => isset($_POST['url']) ? $_POST['url'] : '',
                    'first_name' => isset($_POST['first_name']) ? $_POST['first_name'] : '',
                    'last_name' => isset($_POST['last_name']) ? $_POST['last_name'] : '',
                    'description' => isset($_POST['content']) ? $_POST['content'] : '',
                    'role' => $role,
                ];

                // Role
                $postarr['role'] = $role;

                // Password
                if(isset($_POST['password']) && !empty($_POST['password']))
                    $postarr['user_pass'] = $_POST['password'];

                // Update user
                $postId = wp_update_user($postarr);
            }else{

                $postarr = [
                    'ID' => $postId,
                    'user_email' => isset($_POST['email']) ? $_POST['email'] : '',
                    'user_login' => isset($_POST['login']) ? $_POST['login'] : $_POST['email'],
                    'user_url' => isset($_POST['url']) ? $_POST['url'] : '',
                    'first_name' => isset($_POST['first_name']) ? $_POST['first_name'] : '',
                    'last_name' => isset($_POST['last_name']) ? $_POST['last_name'] : '',
                    'description' => isset($_POST['content']) ? $_POST['content'] : '',
                    'role' => $role,
                ];

                if(isset($_POST['password']) && !empty($_POST['password']))
                    $postarr['user_pass'] = $_POST['password'];


                if($ActivateUser) {
                    /** @Since V 0.5 **/
                    $postId = $this->InsertUnactiveUser($postarr);
                }else{
                    $postId = wp_insert_user($postarr);
                }
            }

            /**
             * Check if there is an error
             */
            if(is_wp_error($postId)){
                $this->error = $postId->get_error_message();
                return false;
            }


            // Array of fields which are not metas
            $notField = [
                'password',
                'email',
                'login',
                'url',
                'first_name',
                'last_name',
                'content',
                'role',
                'repeat-password',
            ];

            // For all fields
            foreach($this->fields as $field){
                // If it's nor a file
                if($field['type'] != 'file') {
                    if (!in_array($field['name'], $notField)) {
                        if (isset($field['multiple']) && $field['multiple'] && is_array($_POST[$field['name']])) {
                            foreach ($_POST[$field['name']] as $val) {
                                if($ActivateUser){
                                    $this->addUnactiveUserMeta($postId,$field['name'],$val);
                                }else {
                                    add_user_meta($postId, $field['name'], $val);
                                }
                            }
                        } else {
                            if($ActivateUser){
                                $this->addUnactiveUserMeta($postId,$field['name'],$_POST[$field['name']]);
                            }else {
                                update_user_meta($postId, $field['name'], $_POST[$field['name']]);
                            }
                        }
                    }
                }else {
                    // If it's a file
                    if (isset($_FILES[$field['name']]['name']) && !empty($_FILES[$field['name']]['name'])) {
                        $key = $field['name'];
                        $val = $_FILES[$field['name']];
                        // Handle multiple upload
                        if (is_array($val['name'])) {
                            for ($i = 0; $i < count($val['name']); $i++) {

                                $_FILES[$key . '_' . $i] = [
                                    'name' => $val['name'][$i],
                                    'type' => $val['type'][$i],
                                    'tmp_name' => $val['tmp_name'][$i],
                                    'error' => $val['error'][$i],
                                    'size' => $val['size'][$i],
                                ];
                                $this->insert_attachment($key . '_' . $i, $postId, 'user');
                            }
                        } else {
                            $this->insert_attachment($key, $postId, 'user');
                        }
                    }
                }
            }
            /**
             * If the forms asks to connect the user (you can't connect & have to activate the user)
             */
            if($args['connectUser'] && !$ActivateUser){
                $creds = [
                    'user_login' => isset($_POST['login']) ? $_POST['login'] : $_POST['email'],
                    'user_password' => $_POST['password'],
                    'remember' => true,
                ];
                $this->doConnexion($creds);
            }
            /**
             * Send the e-mail for unactive user
             */
            $this->sendMailActivate($postId);

            return $postId;
        }else{
            return false;
        }
    }

    /**
     * Send an e-mail
     *
     * @Since V 0.1
     *
     * @param array $args
     * @return bool
     */
    public function sendMail($args = [])
    {
        /** @var Mail $mail */
        if($mail  = $this->canSendMail($args)){

            try {
                $mail = new Mail();
                $mail
                    ->setSenderEmail(isset($args['senderEmail']) ? $args['senderEmail'] : $_POST['email'])
                    ->setSenderName(isset($args['sendername']) ? $args['sendername'] : $_POST['sendername'])
                    ->setRecipientEmail(isset($args['recipientEmail']) ? $args['recipientEmail'] : get_option('admin_email'))
                    ->setRecipientName(isset($args['recipientName']) ? $args['recipientName'] : get_option('blogname'))
                    ->setSubject(isset($args['subject']) ? $args['subject'] : (isset($_POST['subject']) ? $_POST['subject'] : ''));

                $message = isset($args['message']) ? $args['message'] : $_POST['message'];


                $notField = ['message', 'email', 'sendername', 'subject'];

                // For all fields
                foreach ($this->fields as $key => $field) {
                    if (!in_array($field['name'], $notField)) {
                        $message .= $mail->getReturnLigne() . $field['name'] . ' : ' . $_POST[$field['name']];
                    }
                }
                $mail->setMessage($message);

                try {
                    return $mail->send();
                }
                catch(Exception $e){
                    $this->error = $e->getMessage();
                }
            } catch (Exception $e) {
                $this->error = $e->getMessage();
            }
        }else {
            return false;
        }
    }


    /**
     *
     * Connect the user
     *
     * @Since V 0.1
     *
     * @Modified : V 0.4
     *
     *
     * @param array $args
     * @return bool|WP_Error|WP_User
     */
    public function connectUser($args = [])
    {
        // If he can connect
        if($this->canConnect()){
            $creds = [
                'user_login' => $_POST['login'],
                'user_password' => $_POST['password'],
                'remember' => isset($_POST['remember']) ? $_POST['remember'] : (isset($args['remember']) ? $args['remember'] : true),
            ];
            /* @since V 0.4 */

            do_action('form/BeforeConnectUser',$creds);
            do_action('form/BeforeConnectUser-' .$this->id,$creds);

            return $this->doConnexion($creds);
        }else{
            return false;
        }
    }

    /**
     * @since V 0.4
     *
     * Connect a user
     *
     * @param $creds
     * @return bool|WP_Error|WP_User
     */
    public function doConnexion($creds)
    {

        $usr = wp_signon($creds,false);
        if(is_wp_error($usr)){
            $this->setError($this->errorMessages['identifiants']);
            return false;
        }else{
            return $usr;
        }
    }

    /**
     *
     * @since 0.1
     *
     * @Used in FormWordpress::insertUser
     *
     * Get the user role
     *
     * @param null $userId
     * @return bool|mixed
     */
    protected function get_user_role($userId = null)
    {

        $userId = $userId == null ? get_current_user_id() : $userId;

        $current_user = get_userdata($userId);
        $roles = $current_user->roles;
        $role = array_shift($roles);

        return isset($role) ? $role : false;
    }


    /**
     *
     * Return a random car from the chaine defined in it
     *
     * @Used in FormWordpress::resetPassword
     *
     * @since V 0.2
     *
     * @param $car
     * @return string
     */
    protected static function random($car) {
        $string = '';

        // Every carac
        $chaine = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@$0123456789sdfhDFHGgfdhg';
        srand((double)microtime()*time());
        for($i=0; $i<$car; $i++) {
            $string .= $chaine[rand()%strlen($chaine)];
        }
        return $string;
    }

    /**
     * Return the form uniqId
     *
     * @since V 0.4
     *
     * @return string
     */
    public function get_form_uniqId()
    {
        return $this->uniqId;
    }


    /**
     *
     * @since V 0.4
     *
     * Get user first meta
     *
     * @param $userid
     * @param string $key
     * @param bool|false $single
     * @return bool
     */
    public static function user_meta($userid,$key,$single = false)
    {
        $userMeta = get_user_meta($userid,$key,$single);

        return isset($userMeta[0]) && is_string($userMeta[0]) ? $userMeta[0] : false;
    }

    /**
     *
     * @since V 0.4
     *
     * Get post first meta
     *
     * @param $postID
     * @param string $key
     * @param bool|false $single
     * @return bool
     */
    public static function post_meta($postID,$key,$single = false)
    {
        $postMeta = get_post_meta($postID,$key,$single);

        return isset($postMeta[0]) && is_string($postMeta[0]) ? $postMeta[0] : false;
    }

    /**
     * Display the form uniqId
     *
     * @since V 0.4
     */
    public function the_form_uniqId()
    {
        echo $this->get_form_uniqId();
    }


    /**
     * Insert an unactive user
     *
     * @CalledIn : FormWordpress::insertUser
     * @Since V 0.5
     * @param $postarr
     * @return WP_Error|mixed
     */
    private function InsertUnactiveUser($postarr){

        $user = get_user_by('login',$postarr['user_login']);


        if($user)
            return new WP_Error(99,"Un utilisateur avec le même identifiant a été trouvé");

        if($this->SelectUnactiveUser('user_login',$postarr['user_login']))
            return new WP_Error(99,"Un utilisateur avec le même identifiant a été trouvé");

        /** @var $wpdb wpdb */
        global $wpdb;

        $table = $wpdb->prefix . 'easy_form_users';

        $postarr['user_activation_key'] = $this->random(55);

        $sql = "INSERT INTO $table (
            user_login,
            user_pass,
            user_email,
            user_url,
            user_activation_key
             ) VALUES (
             '{$postarr['user_login']}',
             '{$postarr['user_pass']}',
             '{$postarr['user_email']}',
             '{$postarr['user_url']}',
             '{$postarr['user_activation_key']}'
             )";
        $wpdb->query($sql);

        // Get User Id
        $userId = $this->SelectUnactiveUser('user_login',$postarr['user_login'])->ID;

        if(isset($postarr['first_name']))
            $this->addUnactiveUserMeta($userId,'first_name',$postarr['first_name']);

        if(isset($postarr['last_name']))
            $this->addUnactiveUserMeta($userId,'last_name',$postarr['last_name']);

        if(isset($postarr['description']))
            $this->addUnactiveUserMeta($userId,'description',$postarr['description']);

        if(isset($postarr['role']))
            $this->addUnactiveUserMeta($userId,'role',$postarr['role']);

        return $userId;
    }

    /**
     * Return a user from a certain condition
     *
     * @param $key
     * @param $val
     * @return mixed
     */
    private function SelectUnactiveUser($key,$val){
        /** @var $wpdb wpdb */
        global $wpdb;


        $table = $wpdb->prefix . 'easy_form_users';
        $sql = "SELECT * FROM $table WHERE {$key} = '{$val}'";


        return $wpdb->get_row($sql);
    }

    /**
     * Return a user from a certain condition
     *
     * @param $userId
     * @param string $key
     * @return mixed
     */
    private function SelectUnactiveUserMeta($userId,$key = null){
        /** @var $wpdb wpdb */
        global $wpdb;

        $table = $wpdb->prefix . 'easy_form_usermeta';
        $sql = "SELECT * FROM $table WHERE (user_id = '{$userId}')";

        if($key !== null)
            $sql .= "AND ( meta_key  = '{$key}' )";

        $results = $wpdb->get_results($sql);

        $resultSorted = new stdClass();
        if(is_array($results)) {
            foreach ($results as $result) {
                $resultSorted->{$result->meta_key} = $result->meta_value;
            }
        }else
            $resultSorted = $results;

        return $resultSorted;
    }

    /**
     * @param $userId
     * @param $key
     * @param $value
     * @return false|int
     */
    private function addUnactiveUserMeta($userId,$key,$value){

        /** @var $wpdb wpdb */
        global $wpdb;

        $table = $wpdb->prefix . 'easy_form_usermeta';

        $sql = "INSERT INTO $table (
            user_id,
            meta_key,
            meta_value

             ) VALUES (
             '$userId',
             '$key',
             '$value'
             )";
        return $wpdb->query($sql);
    }


    /**
     * Remove a selected user
     *
     * @param $userId
     * @return false|int
     */
    private function removeUnactiveUser($userId){



        /** @var $wpdb wpdb */
        global $wpdb;

        $table = $wpdb->prefix . 'easy_form_users';

        // Delete user
        $sql = "DELETE FROM $table WHERE ID = $userId";
        $wpdb->query($sql);

        // Delete metas
        $table = $wpdb->prefix . 'easy_form_usermeta';
        $sql = "DELETE FROM $table WHERE user_id = $userId";

        return $wpdb->query($sql);
    }

    /**
     * @param $userId
     * @return bool
     */
    private function sendMailActivate($userId){

        /** @var $user */
        $user = $this->SelectUnactiveUser('ID',$userId);

        $metas = $this->SelectUnactiveUserMeta($user->ID);


        $email = get_option('admin_email');
        $name = get_option('blogname');
        $mail = $this->prepareMail();
        $mail->setFrom($email,$name);
        $mail->addAddress($user->user_email,$metas->first_name . ' ' . $metas->last_name);

        $mail->Subject = "Inscription sur $name Confirmation de l'e-mail";

        $message = $this->getFormTemplate('activeAccount.php');


        $lien = $_SERVER['SERVER_PORT'] == 80 ? 'http://' : 'https://';

        $lien.= $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        $union = self::getunion($lien);


        $lien .= $union .  'key=' . $user->user_activation_key . '&login=' . $user->user_login;

        $message = str_replace('%NOM%',$metas->first_name,$message);
        $message = str_replace('%/LIEN%','</a>',$message);
        $message = str_replace('%LIEN%','<a href="'. $lien .'">',$message);
        $message = str_replace('%BLOGNAME%',$name,$message);

        $_SESSION['message'] = $lien;

        $mail->Body = $message;

        return $mail->send();
    }


    /**
     * @param $templateUrl
     * @return string
     */
    private function getTemplate($templateUrl){
        if(file_exists($templateUrl)) {
            ob_start();
            require $templateUrl;
            $var = ob_get_clean();
            return $var;
        }else
            return '';
    }


    /**
     * @param $templateName
     * @return bool
     */
    private function templateExists($templateName){
        return file_exists(get_template_directory() . '/EasyFormTemplates/' . $templateName);
    }

    /**
     * Returns the template overided in theme || the form default template
     *
     * @param $templateName
     * @return string
     */
    private function getFormTemplate($templateName){
        if($this->templateExists($templateName)){
            return $this->getTemplate(get_template_directory() . '/EasyFormTemplates/' . $templateName);
        }else{
            return $this->getTemplate(plugin_dir_path( __FILE__ ).'/../templates/mail/' . $templateName);
        }
    }

    /**
     * Returns the lang overided in theme || the form default template
     *
     * @Since V 0.5
     *
     * @param $templateName
     * @return string
     */
    private function getLangTemplate($lang){
        if($this->templateExists('langs/' . $lang . '.json')){
            return $this->getTemplate(get_template_directory() . '/EasyFormTemplates/langs/' . $lang . '.json');
        }elseif(is_file(plugin_dir_path( __FILE__ ).'/../assets/langs/' . $lang . '.json')){
            return $this->getTemplate(plugin_dir_path( __FILE__ ).'/../assets/langs/' . $lang . '.json');
        }else{
            return $this->getTemplate(plugin_dir_path( __FILE__ ).'/../assets/langs/fr.json');
        }
    }


    /**
     * Check if there is unactive users's activation on this page
     *
     * @return bool
     */
    public function CheckUnactiveUsers($args){


        if(!isset($_GET['key']) || !isset($_GET['login']))
            return false;


        $user = $this->SelectUnactiveUser('user_login',$_GET['login']);

        if(NULL === $user) {
            $this->error = $this->errorMessages['alreadyActivated'];
            return false;
        }


        if($user->user_activation_key != $_GET['key']) {
            $this->error = $this->errorMessages['invalidKey'];
            return false;
        }

        $metas = $this->SelectUnactiveUserMeta($user->ID);


        $postarr = [
            'user_email' => $user->user_email,
            'user_url' => $user->user_url,
            'user_pass' => $user->user_pass,
            'user_login' => $user->user_login,
            'first_name' => isset($metas->first_name) ? $metas->first_name : '',
            'last_name' => isset($metas->last_name) ? $metas->last_name : '',
            'description' => isset($metas->description) ? $metas->description : '',
            'role' => $metas->role,
        ];

        $userId = wp_insert_user($postarr);

        if(is_wp_error($userId)) {
            $this->error = $userId->get_error_message();
            return false;
        }

        $forgetMeta = ['role','last_name','description','first_name',];

        foreach ($metas as $key => $val){
            if(!in_array($key,$forgetMeta))
                add_user_meta($userId, $key, $val);
        }

        $this->setUserActive();

        if(isset($args['connectUser']) & $args['connectUser']){
            $creds = [
                'user_login' => $user->user_login,
                'user_password' => $user->user_pass,
                'remember' => true,
            ];
            $this->doConnexion($creds);
        }


        return $this->removeUnactiveUser($user->ID);
    }


    /**
     * Set the user has been activated
     *
     * @Since V 0.5
     */
    private function setUserActive(){
        $_SESSION['user_activated'] = true;
    }


    /**
     * @return bool
     */
    public function UserIsActivated(){
        if (isset($_SESSION['user_activated'])) {
            // I unset the session
            unset($_SESSION['user_activated']);
            return true;
        }else
            return false;
    }

}
