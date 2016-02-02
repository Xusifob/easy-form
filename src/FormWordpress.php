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
    public function __construct($name, $action = '#', $args = [])
    {


        parent::__construct($name, $action, $args);

        $json = $this->getLangTemplate('fr');

        $this->errorMessages = json_decode($json, true);

        // store the form Id
        if (isset($args['formId']))
            $this->id = $args['formId'];
    }

    /**
     * Return if the form is able to insert a post
     *
     * @since V 0.1
     *
     * @Updated : V 0.5.2
     *
     * @return bool
     */
    protected function canInsertPost()
    {

        // By default, the field does not exist
        $insert = false;
        foreach ($this->fields as $field) {

            // IF the field exist, then I insert it
            if ($field['name'] == 'title' && $field['required']) {
                $insert = true;
                break;
            }
        }

        // Else, I display the error
        if (!$insert)
            $this->setError($this->errorMessages['missingfield'] . 'title');

        return $insert;
    }

    /**
     * Return if the form is able to send a mail
     *
     * @since V 0.1
     *
     * @Updated V 0.5
     *
     * @param $args
     * @return bool
     */
    protected function canSendMail($args)
    {

        // By default, all theses fields are not found
        $insert = [
            'email' => false,
            'sendername' => false,
            'message' => false,
        ];
        foreach ($this->fields as $field) {
            if ($field['name'] == 'email' || (isset($args['senderEmail']) && !empty($args['senderEmail'])))
                $insert['email'] = true;
            elseif ($field['name'] == 'sendername' || (isset($args['sendername']) && !empty($args['sendername'])))
                $insert['sendername'] = true;
            elseif ($field['name'] == 'message' || (isset($args['message']) && !empty($args['message']))) {
                $insert['message'] = true;
            }
        }

        if (!($insert['sendername'] && $insert['email'] && $insert['message'])) {
            $error = '';
            foreach ($insert as $key => $val) {
                if (!$val) {
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
     * @Used FormWordPress::insertUser
     *
     * @Updated V 0.4
     *
     * @param $userID int The User'Id (in case of update)
     * @return bool
     */
    protected function canInsertUser($userID)
    {

        // If there is no userId I check the fields
        if ($userID == null) {
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

            if (!($insert['login'] && $insert['email'])) {
                $error = '';
                foreach ($insert as $key => $val) {
                    if (!$val) {
                        $error .= $this->errorMessages['missingfield'] . $key . ' ';
                    }
                }
                $this->setError($error);
            }
            return ($insert['password'] && $insert['email']);
        } else {
            // Else, if there is already a user, I can update whatever I want
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
        foreach ($this->fields as $field) {
            if ($field['name'] == 'login') {
                $insert['login'] = true;
            } elseif ($field['name'] == 'password') {
                $insert['password'] = true;
            }
        }


        // display errors
        if (!($insert['login'] && $insert['password'])) {
            $error = '';
            foreach ($insert as $key => $val) {
                if (!$val) {
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
     * @Updated : - V 0.5
     *
     * @return bool
     */
    protected function canResetPassword()
    {

        $insert = false;
        if ($this->resetArgsAvailable()) {
            // Check fields
            foreach ($this->fields as $field) {
                if ($field['name'] == 'password')
                    $insert = true;
            }
        } else {

            // Check fields
            foreach ($this->fields as $field) {
                if ($field['name'] == 'login')
                    $insert = true;
            }
        }

        // display error
        if (!$insert) {
            $error = $this->errorMessages['missingfield'] . $this->resetArgsAvailable() ? 'password' : 'login';
            $this->setError($error);
        }

        return $insert;
    }


    /**
     *
     * @since V 0.1
     *
     * @Updated : V 0.5.2
     *
     * Insert a wordpress post
     *
     * @param null $postId the post's Id if it's an update
     * @param array $args
     * @return bool|int|null|WP_Error
     */
    public function insertPost($postId = null, $args = [])
    {


        // If i can insert the post, else if it's an update
        if ($this->canInsertPost() || null != $postId) {
            $postarr = [
                'post_title' => filter_var($_POST['title'], FILTER_SANITIZE_STRING),
                'post_type' => isset($args['post_type']) ? filter_var($args['post_type'], FILTER_SANITIZE_STRING) : 'post',
                'post_content' => isset($_POST['content']) ? filter_var($_POST['content'], FILTER_SANITIZE_STRING) : '',
                'post_name' => filter_var(sanitize_title($_POST['title']), FILTER_SANITIZE_STRING),
                'post_status' => isset($args['post_status']) ? filter_var($args['post_status'], FILTER_SANITIZE_STRING) : 'publish',
                'post_author' => isset($args['post_author']) ? filter_var($args['post_author'], FILTER_SANITIZE_NUMBER_INT) : get_current_user_id(),
            ];


            // If there is a post Id, I add it to the update fields
            if (isset($postId) && null != ($postId))
                $postarr['ID'] = $postId;

            // If there is fields that belong here, i insert the post
            if ($this->canInsertPost())
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

                            } elseif (in_array($field['type'], ['checkbox', 'radio'])) {
                                if (isset($_POST[$field['name']]))
                                    update_post_meta($postId, $field['name'], filter_var($_POST[$field['name']], FILTER_SANITIZE_STRING));
                            } else {
                                update_post_meta($postId, $field['name'], $this->sanitizeField($_POST[$field['name']], $field['type']));
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
                            (isset($_FILES[$field['name']]['name']) && is_array($_FILES[$field['name']]['name']) && !empty($_FILES[$field['name']]['name'][0])) ||
                            (isset($_FILES[$field['name']]['name']) && !is_array($_FILES[$field['name']]['name']) && !empty($_FILES[$field['name']]['name']))
                        ) {
                            $key = $field['name'];
                            $val = $_FILES[$field['name']];
                            $sizeOk = true;

                            if (isset($field['args']['maxSize']) && !empty($field['args']['maxSize'])) {
                                foreach ($val['size'] as $siz) {
                                    if ($siz > (int)$field['args']['maxSize'] * 1000) {
                                        $sizeOk = false;
                                        $this->setError($this->errorMessages['filesize'] . $field['args']['maxSize'] . 'ko');
                                    }
                                }
                            }
                            if ($sizeOk) {
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
                                        update_post_meta($postId, $key, filter_var($vals, FILTER_SANITIZE_STRING));
                                        update_post_meta($postId, '_' . $key, filter_var($field['args']['acfField']), FILTER_SANITIZE_STRING);
                                    }
                                } else {
                                    $this->insert_attachment($key, $postId);
                                }
                            } else
                                return false;
                        } else {
                            // Il a modifié des anciennes photos mais pas de nouvelles
                            if (null != $oldvals) {
                                $oldvals = explode(',', filter_var($_POST[$field['name'] . '-values'], FILTER_SANITIZE_STRING));
                                update_post_meta($postId, filter_var($field['name'], FILTER_SANITIZE_STRING), filter_var($oldvals, FILTER_SANITIZE_STRING));

                                // Handle ACF field
                                if (isset($field['args']['acfField']) && !empty($field['args']['acfField']))
                                    update_post_meta($postId, '_' . $field['name'], filter_var($field['args']['acfField'], FILTER_SANITIZE_STRING));
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
     * @Since V 0.5.3
     *
     * return the full current url without the $_GET params
     *
     * @param $s
     * @param bool $use_forwarded_host
     * @return string
     */
    public static function url_origin( $s, $use_forwarded_host = false )
    {
        $ssl      = ( ! empty( $s['HTTPS'] ) && $s['HTTPS'] == 'on' );
        $sp       = strtolower( $s['SERVER_PROTOCOL'] );
        $protocol = substr( $sp, 0, strpos( $sp, '/' ) ) . ( ( $ssl ) ? 's' : '' );
        $port     = $s['SERVER_PORT'];
        $port     = ( ( ! $ssl && $port=='80' ) || ( $ssl && $port=='443' ) ) ? '' : ':'.$port;
        $host     = ( $use_forwarded_host && isset( $s['HTTP_X_FORWARDED_HOST'] ) ) ? $s['HTTP_X_FORWARDED_HOST'] : ( isset( $s['HTTP_HOST'] ) ? $s['HTTP_HOST'] : null );
        $host     = isset( $host ) ? $host : $s['SERVER_NAME'] . $port;
        return $protocol . '://' . $host;
    }

    /**
     * @Since V 0.5.3
     *
     * return the full current url with the $_GET params
     *
     * @param $s
     * @param bool $use_forwarded_host
     * @return string
     */
    public static function full_url( $s, $use_forwarded_host = false )
    {
        return self::url_origin( $s, $use_forwarded_host ) . $s['REQUEST_URI'];
    }


    /**
     *
     * @since V 0.1
     *
     * @Updated - V 0.4
     *          - V 0.5.2 (Add Sanitization)
     *          - V 0.5.3 (Add full url function)
     *
     * Insert a wp_post and redirect after it to the page with the name of the form at true
     *
     * @param string $type
     * @param null $lien
     * @param null $postId
     * @param array $args
     * @return bool
     */
    public function SendFormAndRedirect($type = 'post', $lien = null, $postId = null, $args = [])
    {

        $lien = ($lien == null || $lien == '' || $lien == false) ? get_permalink() : $lien;


        if ($lien === false)
            $lien = self::full_url( $_SERVER );


        $varURl = (isset($args['varURl']) && $lien != 'newpost') ?
            (strpos($lien, '?') ? '&' . $args['varURl'] : '?' . $args['varURl'])
            : '';

        $thepostId = $postId;

        switch ($type) :

            // If it's a post
            case 'post' :

                /* @since V 0.4 add hooks Before Send */
                do_action('form/BeforeInsertOrModifyPost', $postId);
                do_action('form/BeforeInsertOrModifyPost-' . $this->id, $postId);
                if (isset($this->postArgs['id'])) {
                    do_action('form/BeforeModifyPost-' . $this->id, $postId);
                    do_action('form/BeforeModifyPost', $postId);
                } else {
                    do_action('form/BeforeInsertPost-' . $this->id, $postId);
                    do_action('form/BeforeInsertPost', $postId);
                }

                if ($postId = $this->insertPost($postId, $args)) {
                    $this->setFormSend($thepostId);

                    /* @since V 0.4 add hooks */
                    do_action('form/insertOrModifyPost', $postId);
                    do_action('form/insertOrModifyPost-' . $this->id, $postId);

                    // Keep compatibility with old version, deprecated
                    do_action('form/insertOrModifyPost', $postId);
                    do_action('form/insertOrModifyPost-' . $this->id, $postId);
                    if (isset($this->postArgs['id'])) {
                        do_action('form/ModifyPost-' . $this->id, $postId);
                        do_action('form/ModifyPost', $postId);
                    } else {
                        do_action('form/InsertPost-' . $this->id, $postId);
                        do_action('form/InsertPost', $postId);

                        // Keep compatibility with old version, deprecated
                        do_action('form/insertPost-' . $this->id, $postId);
                        do_action('form/insertPost', $postId);
                    }

                    // If lien == newpost redirect to the new post page
                    if ($lien == 'newpost') {

                        /* @since V 0.4 */
                        if (isset($args['varURl']) && !empty($args['varURl'])) {
                            $union = self::getunion($lien);

                            $lien = filter_var(get_permalink($postId) . $union . $args['varURl'], FILTER_SANITIZE_URL);
                            wp_redirect($lien);
                        } else {
                            wp_redirect(get_permalink($postId));
                        }
                    } else
                        wp_redirect($lien . $varURl);

                    // Exit after redirect
                    exit();
                } else {
                    return false;
                }
                break;
            case 'user' :
                // Actions
                /* @since V 0.4 add hooks */
                do_action('form/BeforeInsertOrModifyUser', $postId);
                do_action('form/BeforeInsertOrModifyUser-' . $this->id, $postId);
                if (isset($this->postArgs['id'])) {
                    do_action('form/ModifyUser', $postId);
                    do_action('form/ModifyUser-' . $this->id, $postId);
                } else {
                    do_action('form/BeforeInsertUser', $postId);
                    do_action('form/BeforeInsertUser-' . $this->id, $postId);
                }

                $lien = ($lien == 'newpost') ? null : $lien;

                if ($postId = $this->insertUser($postId, $args)) {
                    $this->setFormSend($thepostId);

                    // Actions
                    /* @since V 0.4 add hooks */
                    do_action('form/InsertOrModifyUser', $postId);
                    do_action('form/InsertOrModifyUser-' . $this->id, $postId);

                    // Keep compatibility with old version, deprecated
                    do_action('form/insertOrModifyUser', $postId);
                    do_action('form/insertOrModifyUser-' . $this->id, $postId);
                    if (isset($this->postArgs['id'])) {
                        do_action('form/ModifyUser', $postId);
                        do_action('form/ModifyUser-' . $this->id, $postId);
                    } else {

                        do_action('form/InsertUser', $postId);
                        do_action('form/InsertUser-' . $this->id, $postId);

                        // Keep compatibility with old version, deprecated
                        do_action('form/insertUser', $postId);
                        do_action('form/insertUser-' . $this->id, $postId);
                    }

                    wp_redirect($lien . $varURl);
                    exit();
                } else {
                    return false;
                }
                break;
            case 'email' :
                $lien = ($lien == 'newpost') ? null : $lien;

                do_action('form/BeforeSendMail');
                do_action('form/BeforeSendMail-' . $this->id);
                if ($this->sendMail($args)) {
                    $this->setFormSend($thepostId);

                    /* @since V 0.4 add hooks */
                    do_action('form/SendMail');
                    do_action('form/SendMail-' . $this->id);

                    // Keep compatibility with old version, deprecated
                    do_action('form/sendMail');
                    do_action('form/sendMail-' . $this->id);

                    wp_redirect($lien . $varURl);
                    exit();
                } else {
                    return false;
                }
                break;
            case 'connexion' :
                $lien = ($lien == 'newpost') ? null : $lien;

                if ($user = $this->connectUser($args)) {
                    $this->setFormSend($thepostId);

                    /* @since V 0.4 add hooks */
                    do_action('form/ConnectUser', $user->ID);
                    do_action('form/ConnectUser-' . $this->id, $user->ID);
                    wp_redirect($lien . $varURl);
                    exit();
                }
                break;

            case 'resetPassword' :

                do_action('form/BeforeResetPassword');
                do_action('form/BeforeResetPassword-' . $this->id);

                $lien = ($lien == 'newpost') ? null : $lien;
                if ($this->resetPassword($args)) {
                    $this->setFormSend($thepostId);

                    /* @since V 0.4 add hooks */
                    do_action('form/ResetPassword');
                    do_action('form/ResetPassword-' . $this->id);

                    // Keep compatibility with old version, deprecated
                    do_action('form/resetPassword');
                    do_action('form/resetPassword-' . $this->id);

                    wp_redirect($lien . $varURl);
                    exit();
                } elseif (!$this->hasError())
                    $this->setError($this->errorMessages['error']);

                break;
        endswitch;

        return false;
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
        if (null == $thepostId)
            $_SESSION[$this->name] = true;
        else
            $_SESSION[$this->name . $thepostId] = true;
    }

    /**
     * Reset a password and send an e-mail
     *
     * @since V 0.2
     *
     * @Updated :  - V 0.4
     *             - V 0.5.2
     *
     * @param $args array
     *
     * @return bool
     */
    public function resetPassword($args = [])
    {
        if ($this->canResetPassword()) {

            /**@var $user WP_User * */
            if ($user = $this->checkResetPage()) {
                wp_set_password($_POST['password'], $user->data->ID);
                return true;
            } else {

                $user_login = $_POST['login'];

                if (strpos($user_login, '@')) {
                    $user_data = get_user_by('email', trim($user_login));

                    if (empty($user_data) || !$user_data)
                        $user_data = get_user_by('login', trim($user_login));

                } else {
                    $login = trim($user_login);
                    $user_data = get_user_by('login', $login);
                }

                do_action('lostpassword_post');


                if (!empty($user_data) && $user_data) {


                    do_action('retrieve_password', $user_data->user_login);


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
        } else {
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
    public static function getunion($lien)
    {
        return strpos($lien, '?') === false ? '?' : '&';

    }

    /**
     * @return Phpmailerform
     */
    public function prepareMail()
    {
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
     * @global wpdb $wpdb WordPress database abstraction object.
     * @global PasswordHash $wp_hasher Portable PHP password hashing framework.
     *
     * @return bool|WP_Error True: when finish. WP_Error on error
     */
    public function retrieve_password($user_login)
    {

        /** @var $wpdb wpdb */
        global $wpdb;

        // Generate something random for a password reset key.
        $key = wp_generate_password(20, false);

        do_action('retrieve_password_key', $user_login, $key);

        // Now insert the key, hashed, into the DB.
        if (empty($wp_hasher)) {
            require_once ABSPATH . WPINC . '/class-phpass.php';
            $wp_hasher = new PasswordHash(8, true);
        }
        $hashed = $wp_hasher->HashPassword($key);
        $wpdb->update($wpdb->users, array('user_activation_key' => $hashed), array('user_login' => $user_login));


        return $key;

    }

    /**
     * @Since V 0.5
     *
     * @return bool|WP_User
     */
    public function checkResetPage()
    {
        if (!$this->resetArgsAvailable())
            return false;

        if (isset($_GET['key']) && isset($_GET['login'])) {
            $user = check_password_reset_key($_GET['key'], $_GET['login']);

        } else {
            $this->error = $this->errorMessages['invalidKey'];
            return false;
        }

        if (is_wp_error($user)) {


            if ($user && $user->get_error_code() === 'expired_key')
                $this->error = $this->errorMessages['expiredKey'];
            else
                $this->error = $this->errorMessages['invalidKey'];

            return false;
        }


        if (is_object($user) && !is_wp_error($user))
            return $user;

        do_action('validate_password_reset', [], $user);

        return false;
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

        if (null == $postId) {
            // If there is a session with the name
            if (isset($_SESSION[$this->name])) {
                // I unset the session
                unset($_SESSION[$this->name]);

                // I return if there is no error
                return (!$this->hasError());
                // Else, the form has not been send
            } else
                return false;
        } else {
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
    public static function insert_file($file_handler, $post_id = 0)
    {
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
    protected function insert_attachment($file_handler, $post_id, $post_type = 'post')
    {

        $attach_id = self::insert_file($file_handler, $post_id);

        if ($attach_id) {
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
     * @Updated : V 0.4
     *
     * @param null $postId
     * @param array $args
     * @return bool
     */
    public function insertUser($postId = null, $args = [])
    {
        if ($this->canInsertUser($postId)) {

            // Handle User has to be activated by e-mail
            $ActivateUser = isset($args['emailUser']) && true === $args['emailUser'];


            if (isset($args['role'])) {
                if ($args['role'] == 'current') {
                    if (is_user_logged_in())
                        $role = $this->get_user_role($postId);
                    else
                        $role = 'subscriber';
                } else
                    $role = $args['role'];
            } else
                $role = 'subscriber';


            // If there is an id it's an update, else it's an insert
            if (isset($postId) && null != ($postId)) {
                $postarr = [
                    'ID' => filter_var($postId, FILTER_SANITIZE_STRING),
                    'user_email' => isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '',
                    'user_url' => isset($_POST['url']) ? filter_var($_POST['url'], FILTER_SANITIZE_URL) : '',
                    'first_name' => isset($_POST['first_name']) ? filter_var($_POST['first_name'], FILTER_SANITIZE_STRING) : '',
                    'last_name' => isset($_POST['last_name']) ? filter_var($_POST['last_name'], FILTER_SANITIZE_STRING) : '',
                    'description' => isset($_POST['content']) ? filter_var($_POST['content'], FILTER_SANITIZE_STRING) : '',
                    'role' => filter_var($role, FILTER_SANITIZE_STRING),
                ];

                // Role
                $postarr['role'] = filter_var($role, FILTER_SANITIZE_STRING);

                // Password
                if (isset($_POST['password']) && !empty($_POST['password']))
                    $postarr['user_pass'] = $_POST['password'];

                // Update user
                $postId = wp_update_user($postarr);
            } else {

                $postarr = [
                    'ID' => filter_var($postId, FILTER_SANITIZE_NUMBER_INT),
                    'user_email' => isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '',
                    'user_login' => isset($_POST['login']) ? filter_var($_POST['login'], FILTER_SANITIZE_STRING) : filter_var($_POST['email'], FILTER_SANITIZE_EMAIL),
                    'user_url' => isset($_POST['url']) ? filter_var($_POST['url'], FILTER_SANITIZE_URL) : '',
                    'first_name' => isset($_POST['first_name']) ? filter_var($_POST['first_name'], FILTER_SANITIZE_STRING) : '',
                    'last_name' => isset($_POST['last_name']) ? filter_var($_POST['last_name'], FILTER_SANITIZE_STRING) : '',
                    'description' => isset($_POST['content']) ? filter_var($_POST['content'], FILTER_SANITIZE_STRING) : '',
                    'role' => $role,
                ];

                if (isset($_POST['password']) && !empty($_POST['password']))
                    $postarr['user_pass'] = $_POST['password'];


                if ($ActivateUser) {
                    /** @Since V 0.5 * */
                    $postId = $this->InsertUnactiveUser($postarr);
                } else {
                    $postId = wp_insert_user($postarr);
                }
            }

            /**
             * Check if there is an error
             */
            if (is_wp_error($postId)) {
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
            foreach ($this->fields as $field) {
                // If it's nor a file
                if ($field['type'] != 'file') {
                    if (!in_array($field['name'], $notField)) {
                        if (isset($field['multiple']) && $field['multiple'] && is_array($_POST[$field['name']])) {
                            foreach ($_POST[$field['name']] as $val) {
                                if ($ActivateUser) {
                                    $this->addUnactiveUserMeta($postId, $field['name'], $this->sanitizeField($val, $field['type']));
                                } else {
                                    add_user_meta($postId, $field['name'], $this->sanitizeField($val, $field['type']));
                                }
                            }
                        } else {
                            if ($ActivateUser) {
                                $this->addUnactiveUserMeta($postId, $field['name'], $this->sanitizeField($_POST[$field['name']], $field['type']));
                            } else {
                                update_user_meta($postId, $field['name'], $this->sanitizeField($_POST[$field['name']], $field['type']));
                            }
                        }
                    }
                } else {
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
            if ($args['connectUser'] && !$ActivateUser) {
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
        } else {
            return false;
        }
    }

    /**
     *
     * @Since V 0.5.2
     *
     * Return the sanitized version of the field depending on it's kind
     *
     * @param $field string|int the field to sanitize
     * @param $fieldType string the field type
     * @return mixed
     */
    public function sanitizeField($field, $fieldType)
    {

        // Array of filters
        $filters = [
            'url' => FILTER_SANITIZE_URL,
            'number' => FILTER_SANITIZE_NUMBER_FLOAT,
            'email' => FILTER_SANITIZE_EMAIL,
        ];

        return filter_var($field, in_array($fieldType, $filters) ? $filters[$fieldType] : FILTER_SANITIZE_STRING);
    }


    /**
     * Send an e-mail
     *
     * @Since V 0.1
     *
     * @Updated :   - V 0.5.2 (Remove Mail class and use PhpMailer Instead
     *              - V 0.5.3 (Add attachment for e-mail)
     *
     * @param array $args
     * @return bool
     */
    public function sendMail($args = [])
    {


        if ($this->canSendMail($args)) {

            try {

                /** @var Phpmailerform $mail */
                $mail = $this->prepareMail();
                $mail->setFrom(
                    isset($args['senderEmail']) ? $args['senderEmail'] : filter_var($_POST['email'],FILTER_SANITIZE_EMAIL),
                    isset($args['sendername']) ? $args['sendername'] : filter_var($_POST['sendername'], FILTER_SANITIZE_STRING)
                );
                $mail->addAddress(
                    isset($args['recipientEmail']) ? $args['recipientEmail'] : get_option('admin_email'),
                    isset($args['recipientName']) ? $args['recipientName'] : get_option('blogname')
                );
                $mail->Subject = isset($args['subject']) ? $args['subject'] : (isset($_POST['subject']) ? filter_var($_POST['subject'], FILTER_SANITIZE_STRING) : '');



                $message = isset($args['message']) ? $args['message'] : $_POST['message'];

                $notField = ['message', 'email', 'sendername', 'subject'];


                // For all fields
                foreach ($this->fields as $key => $field) {
                    if (!in_array($field['name'], $notField)) {

                        if ($field['type'] != 'file' && (is_string($_POST[$field['name']]) || is_int($_POST[$field['name']]) || is_bool($_POST[$field['name']])))
                            $message .= "\n\r" . $field['name'] . ' : ' . $_POST[$field['name']];
                        else {
                            if (isset($_FILES[$field['name']]) &&
                                $_FILES[$field['name']]['error'] == UPLOAD_ERR_OK) {
                                $mail->AddAttachment($_FILES[$field['name']]['tmp_name'],
                                    $_FILES[$field['name']]['name']);
                            }
                        }
                    }
                }

                $mail->Body = $message;

                try {
                    return $mail->send();
                } catch (Exception $e) {
                    $this->error = $e->getMessage();
                }
            } catch (Exception $e) {
                $this->error = $e->getMessage();
            }
        } else {
            return false;
        }

        return false;
    }


    /**
     *
     * Connect the user
     *
     * @Since V 0.1
     *
     * @Updated : V 0.4
     *
     *
     * @param array $args
     * @return bool|WP_Error|WP_User
     */
    public function connectUser($args = [])
    {
        // If he can connect
        if ($this->canConnect()) {
            $creds = [
                'user_login' => $_POST['login'],
                'user_password' => $_POST['password'],
                'remember' => isset($_POST['remember']) ? $_POST['remember'] : (isset($args['remember']) ? $args['remember'] : true),
            ];
            /* @since V 0.4 */

            do_action('form/BeforeConnectUser', $creds);
            do_action('form/BeforeConnectUser-' . $this->id, $creds);

            return $this->doConnexion($creds);
        } else {
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

        $usr = wp_signon($creds, false);
        if (is_wp_error($usr)) {
            $this->setError($this->errorMessages['identifiants']);
            return false;
        } else {
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
    protected static function random($car)
    {
        $string = '';

        // Every carac
        $chaine = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@$0123456789sdfhDFHGgfdhg';
        srand((double)microtime() * time());
        for ($i = 0; $i < $car; $i++) {
            $string .= $chaine[rand() % strlen($chaine)];
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
    public static function user_meta($userid, $key, $single = false)
    {
        $userMeta = get_user_meta($userid, $key, $single);

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
    public static function post_meta($postID, $key, $single = false)
    {
        $postMeta = get_post_meta($postID, $key, $single);

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
    private function InsertUnactiveUser($postarr)
    {

        $user = get_user_by('login', $postarr['user_login']);


        if ($user)
            return new WP_Error(99, "Un utilisateur avec le même identifiant a été trouvé");

        if ($this->SelectUnactiveUser('user_login', $postarr['user_login']))
            return new WP_Error(99, "Un utilisateur avec le même identifiant a été trouvé");

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
        $userId = $this->SelectUnactiveUser('user_login', $postarr['user_login'])->ID;

        if (isset($postarr['first_name']))
            $this->addUnactiveUserMeta($userId, 'first_name', $postarr['first_name']);

        if (isset($postarr['last_name']))
            $this->addUnactiveUserMeta($userId, 'last_name', $postarr['last_name']);

        if (isset($postarr['description']))
            $this->addUnactiveUserMeta($userId, 'description', $postarr['description']);

        if (isset($postarr['role']))
            $this->addUnactiveUserMeta($userId, 'role', $postarr['role']);

        return $userId;
    }

    /**
     * Return a user from a certain condition
     *
     * @param $key
     * @param $val
     * @return mixed
     */
    private function SelectUnactiveUser($key, $val)
    {
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
    private function SelectUnactiveUserMeta($userId, $key = null)
    {
        /** @var $wpdb wpdb */
        global $wpdb;

        $table = $wpdb->prefix . 'easy_form_usermeta';
        $sql = "SELECT * FROM $table WHERE (user_id = '{$userId}')";

        if ($key !== null)
            $sql .= "AND ( meta_key  = '{$key}' )";

        $results = $wpdb->get_results($sql);

        $resultSorted = new stdClass();
        if (is_array($results)) {
            foreach ($results as $result) {
                $resultSorted->{$result->meta_key} = $result->meta_value;
            }
        } else
            $resultSorted = $results;

        return $resultSorted;
    }

    /**
     * @param $userId
     * @param $key
     * @param $value
     * @return false|int
     */
    private function addUnactiveUserMeta($userId, $key, $value)
    {

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
    private function removeUnactiveUser($userId)
    {


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
    private function sendMailActivate($userId)
    {

        /** @var $user */
        $user = $this->SelectUnactiveUser('ID', $userId);

        $metas = $this->SelectUnactiveUserMeta($user->ID);


        $email = get_option('admin_email');
        $name = get_option('blogname');
        $mail = $this->prepareMail();
        $mail->setFrom($email, $name);
        $mail->addAddress($user->user_email, $metas->first_name . ' ' . $metas->last_name);

        $mail->Subject = "Inscription sur $name Confirmation de l'e-mail";

        $message = $this->getFormTemplate('activeAccount.php');


        $lien = $_SERVER['SERVER_PORT'] == 80 ? 'http://' : 'https://';

        $lien .= $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

        $union = self::getunion($lien);


        $lien .= $union . 'key=' . $user->user_activation_key . '&login=' . $user->user_login;

        $message = str_replace('%NOM%', $metas->first_name, $message);
        $message = str_replace('%/LIEN%', '</a>', $message);
        $message = str_replace('%LIEN%', '<a href="' . $lien . '">', $message);
        $message = str_replace('%BLOGNAME%', $name, $message);

        $_SESSION['message'] = $lien;

        $mail->Body = $message;

        return $mail->send();
    }


    /**
     * @param $templateUrl
     * @return string
     */
    private function getTemplate($templateUrl)
    {
        if (file_exists($templateUrl)) {
            ob_start();
            require $templateUrl;
            $var = ob_get_clean();
            return $var;
        } else
            return '';
    }


    /**
     * @param $templateName
     * @return bool
     */
    private function templateExists($templateName)
    {
        return file_exists(get_template_directory() . '/EasyFormTemplates/' . $templateName);
    }

    /**
     * Returns the template overided in theme || the form default template
     *
     * @param $templateName
     * @return string
     */
    private function getFormTemplate($templateName)
    {
        if ($this->templateExists($templateName)) {
            return $this->getTemplate(get_template_directory() . '/EasyFormTemplates/' . $templateName);
        } else {
            return $this->getTemplate(plugin_dir_path(__FILE__) . '/../templates/mail/' . $templateName);
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
    private function getLangTemplate($lang)
    {
        if ($this->templateExists('langs/' . $lang . '.json')) {
            return $this->getTemplate(get_template_directory() . '/EasyFormTemplates/langs/' . $lang . '.json');
        } elseif (is_file(plugin_dir_path(__FILE__) . '/../assets/langs/' . $lang . '.json')) {
            return $this->getTemplate(plugin_dir_path(__FILE__) . '/../assets/langs/' . $lang . '.json');
        } else {
            return $this->getTemplate(plugin_dir_path(__FILE__) . '/../assets/langs/fr.json');
        }
    }


    /**
     * Check if there is unactive users's activation on this page
     *
     * @return bool
     */
    public function CheckUnactiveUsers($args)
    {


        if (!isset($_GET['key']) || !isset($_GET['login']))
            return false;


        $user = $this->SelectUnactiveUser('user_login', $_GET['login']);

        if (NULL === $user) {
            $this->error = $this->errorMessages['alreadyActivated'];
            return false;
        }


        if ($user->user_activation_key != $_GET['key']) {
            $this->error = $this->errorMessages['invalidKey'];
            return false;
        }

        $metas = $this->SelectUnactiveUserMeta($user->ID);


        $postarr = [
            'user_email' => filter_var($user->user_email, FILTER_SANITIZE_EMAIL),
            'user_url' => filter_var($user->user_url, FILTER_SANITIZE_URL),
            'user_pass' => filter_var($user->user_pass, FILTER_SANITIZE_STRING),
            'user_login' => filter_var($user->user_login, FILTER_SANITIZE_STRING),
            'first_name' => isset($metas->first_name) ? filter_var($metas->first_name, FILTER_SANITIZE_STRING) : '',
            'last_name' => isset($metas->last_name) ? filter_var($metas->last_name, FILTER_SANITIZE_STRING) : '',
            'description' => isset($metas->description) ? filter_var($metas->description, FILTER_SANITIZE_STRING) : '',
            'role' => $metas->role,
        ];

        $userId = wp_insert_user($postarr);

        if (is_wp_error($userId)) {
            $this->error = $userId->get_error_message();
            return false;
        }

        $forgetMeta = ['role', 'last_name', 'description', 'first_name',];

        foreach ($metas as $key => $val) {
            if (!in_array($key, $forgetMeta))
                add_user_meta($userId, $key, filter_var($val, FILTER_SANITIZE_STRING));
        }

        $this->setUserActive();

        if (isset($args['connectUser']) & $args['connectUser']) {
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
    private function setUserActive()
    {
        $_SESSION['user_activated'] = true;
    }


    /**
     * @return bool
     */
    public function UserIsActivated()
    {
        if (isset($_SESSION['user_activated'])) {
            // I unset the session
            unset($_SESSION['user_activated']);
            return true;
        } else
            return false;
    }

}
