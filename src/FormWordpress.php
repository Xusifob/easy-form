<?php

if (!defined('ABSPATH')) exit; // Exit if accessed directly

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
     * @var int $id the Id of the WP_Form
     */
    protected $id = 0;


    /**
     *
     * If the current user is on mobile
     *
     * @Since V 0.5.5
     */
    const _MOBILE = 0;


    /**
     *
     * If the current user is on tablet
     *
     * @Since V 0.5.5
     */
    const _TABLET = 1;

    /**
     *
     * If the current user is on desktop
     *
     * @Since V 0.5.5
     */
    const  _DESKTOP = 2;


    /**
     * Return the current user's device
     *
     * @Since V 0.5.5
     *
     * @var int
     */
    public $device = self::_DESKTOP;


    /**
     *
     * @Since V 0.5.5
     *
     * The statistiques value to compare impressions with conversions
     *
     * @var mixed
     */
    protected $statValue = '';


    /**
     * Constructor
     *
     * @Since V 0.4
     *
     * @Updated :   - V 0.5.3 (Add lang support)
     *              - V 0.5.5 (Add kind of device support for impressions)
     *
     * @param string $name
     * @param string $action
     * @param array $args
     */
    public function __construct($name, $action = '#', $args = [])
    {


        parent::__construct($name, $action, $args);


        // store the form Id
        if (isset($args['formId']))
            $this->id = $args['formId'];


        foreach ($this->errorMessages as $key => $error) {
            $this->errorMessages[$key] = __($error, 'easy-form');
        }


        /** Detect the current device */
        $detect = new Mobile_Detect();
        if ($detect->isTablet())
            $this->device = self::_TABLET;
        elseif ($detect->isMobile())
            $this->device = self::_MOBILE;
        else
            $this->device = self::_DESKTOP;

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
    public static function url_origin($s, $use_forwarded_host = false)
    {
        $ssl = (!empty($s['HTTPS']) && $s['HTTPS'] == 'on');
        $sp = strtolower($s['SERVER_PROTOCOL']);
        $protocol = substr($sp, 0, strpos($sp, '/')) . (($ssl) ? 's' : '');
        $port = $s['SERVER_PORT'];
        $port = ((!$ssl && $port == '80') || ($ssl && $port == '443')) ? '' : ':' . $port;
        $host = ($use_forwarded_host && isset($s['HTTP_X_FORWARDED_HOST'])) ? $s['HTTP_X_FORWARDED_HOST'] : (isset($s['HTTP_HOST']) ? $s['HTTP_HOST'] : null);
        $host = isset($host) ? $host : $s['SERVER_NAME'] . $port;
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
    public static function full_url($s, $use_forwarded_host = false)
    {
        return self::url_origin($s, $use_forwarded_host) . $s['REQUEST_URI'];
    }


    /**
     *
     * @since V 0.1
     *
     * @Updated - V 0.4
     *          - V 0.5.2 (Add Sanitization)
     *          - V 0.5.3 (Add full url function)
     *          - V 0.5.4 (Add hooks before connexion)
     *          - V 0.5.5 (Pass data through the link)
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


        $lien = ($lien == null || $lien == '' || $lien == false) ? self::full_url($_SERVER) : $lien;


        if ($lien === false)
            $lien = self::full_url($_SERVER);


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
                            self::redirect($lien);
                        } else {
                            self::redirect(get_permalink($postId));
                        }
                    } else
                        self::redirect($lien . $varURl);

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

                if ($userId = $this->insertUser($postId, $args)) {
                    $this->setFormSend($thepostId);

                    // Actions
                    /* @since V 0.4 add hooks */
                    do_action('form/InsertOrModifyUser', $userId);
                    do_action('form/InsertOrModifyUser-' . $this->id, $userId);

                    // Keep compatibility with old version, deprecated
                    do_action('form/insertOrModifyUser', $userId);
                    do_action('form/insertOrModifyUser-' . $this->id, $userId);
                    if (isset($this->postArgs['id'])) {
                        do_action('form/ModifyUser', $userId);
                        do_action('form/ModifyUser-' . $this->id, $userId);
                    } else {

                        do_action('form/InsertUser', $userId);
                        do_action('form/InsertUser-' . $this->id, $userId);

                        // Keep compatibility with old version, deprecated
                        do_action('form/insertUser', $postId);
                        do_action('form/insertUser-' . $this->id, $userId);

                    }

                    self::redirect($lien . $varURl);
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

                    self::redirect($lien . $varURl);
                    exit();
                } else {
                    return false;
                }
                break;
            case 'connexion' :
                $lien = ($lien == 'newpost') ? null : $lien;


                /* @since V 0.5.4 Update hooks */
                do_action('form/BeforeConnectUser');
                do_action('form/BeforeConnectUser-' . $this->id);

                if ($user = $this->connectUser($args)) {
                    $this->setFormSend($thepostId);

                    /* @since V 0.4 add hooks */
                    do_action('form/ConnectUser', $user->ID);
                    do_action('form/ConnectUser-' . $this->id, $user->ID);
                    self::redirect($lien . $varURl);
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

                    self::redirect($lien . $varURl);
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
     * @Updated : - V 0.5.5 (Add conversions)
     *
     * @param $thepostId
     */
    protected function setFormSend($thepostId = null)
    {

        $custom_data = '';

        if (null == $thepostId)
            $_SESSION[$this->name] = true;
        else
            $_SESSION[$this->name . $thepostId] = true;

        foreach ($this->fields as $field) {
            if (isset($field['args']['statsSelected']) && $field['args']['statsSelected']) {
                $custom_data = htmlentities(filter_var($_POST[$field['name']], FILTER_SANITIZE_STRING));
                break;
            }
        }

        $this->addStatsInfos('conversions');
    }


    /**
     * Redirect a user with php if header has not been send, else with javascript
     *
     * @Since V 0.5.5
     *
     * @param $filename
     */
    public static function redirect($filename)
    {
        if (!headers_sent())
            wp_redirect($filename);
        else {
            echo '<script type="text/javascript">';
            echo 'window.location.href="' . $filename . '";';
            echo '</script>';
            echo '<noscript>';
            echo '<meta http-equiv="refresh" content="0;url=' . $filename . '" />';
            echo '</noscript>';
        }
        die();
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
     * @Updated : V 0.5.5 (Add Unset)
     *
     * @param $postId
     * @param bool $unset
     * @return bool
     */
    public function hasBeenSend($postId = null, $unset = true)
    {

        if (null == $postId) {
            // If there is a session with the name
            if (isset($_SESSION[$this->name])) {
                // I unset the session
                if ($unset)
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
                if ($unset)
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
                    isset($args['senderEmail']) ? $args['senderEmail'] : filter_var($_POST['email'], FILTER_SANITIZE_EMAIL),
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
                            $message .= "\n\r<br>" . $field['name'] . ' : ' . $_POST[$field['name']];
                        else {
                            if (isset($_FILES[$field['name']]) &&
                                $_FILES[$field['name']]['error'] == UPLOAD_ERR_OK
                            ) {
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
     * Returns the template override in theme || the form default template
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
     *
     * @since V 0.5.5 (Add Impressions to post meta)
     *
     * Return the open form field. it contains an antispam input, the wp_nounce input,some style and the form opening
     *
     * @override Form::get_open_the_form
     *
     * @return string
     */
    public function get_open_the_form()
    {

        $this->addStatsInfos('impressions');

        return $this->get_form_field('open_the_form');
    }


    /**
     * @Since V 0.5.5
     *
     * Add the stats infos into the database
     *
     * @param $kind
     */
   private function addStatsInfos($kind){
       // I put the impression only if the user is not a robot
       if (!self::isRobotIp($_SERVER['REMOTE_ADDR'])) {
           $data = [
               'time' => time(),
               'ip' => $_SERVER['REMOTE_ADDR'],
               'device' => $this->device,
               'custom_data' => $this->getStatValue(),
               'ip_data' => self::getIpData(),
           ];

           // If there is an error, it's not an impression
           if (!$this->hasError() && !$this->hasBeenSend(null, true))
               add_post_meta($this->id, $kind, $data);
       }
   }

    /**
     * Return informations linked to the IP Address
     *
     * @Since V 0.5.5
     *
     * @param null|string $ip
     * @return array
     */
    public static function getIpData($ip = null)
    {
        $ip = $ip === null ? $_SERVER['REMOTE_ADDR'] : $ip;

        $geoplugin = json_decode(file_get_contents('http://ip-api.com/json/' . $ip), true);

        $data = [
            'lng' => is_numeric($geoplugin['lon']) ? $geoplugin['lon'] : 0,
            'lat' => is_numeric($geoplugin['lat']) ? $geoplugin['lat'] : 0,
            'region' => $geoplugin['city'] . ' - ' . $geoplugin['country']
        ];

        return $data;

    }



    /**
     *
     * @since V 0.5.4
     *
     *
     * Display the open form
     *
     * @override Form::open_the_form
     *
     */
    public function open_the_form()
    {
        echo $this->get_open_the_form();
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

    /**
     *
     * @Since V 0.5.5
     *
     * Return the stat value
     *
     * @return mixed
     */
    public function getStatValue()
    {
        return $this->statValue;
    }


    /**
     *
     * Set the stat value
     *
     * @Since V 0.5.5
     *
     * @param $statValue mixed the value to set
     * @return $this
     */
    public function setStatValue($statValue)
    {
        $this->statValue = $statValue;
        return $this;
    }


    /**
     * @Since V 0.5.5
     *
     * Return if the current IP is a robot, if it is, do not count it as an impression
     *
     * @param $ip
     * @return bool
     */
    public static function isRobotIp($ip)
    {

        if(preg_match('/64\.233\.1[6-9]{1}[0-9]\.[0-9]{1,3}/',$ip))
            return true;

        if(preg_match('/66\.102\.[0-9]*[0-5]\.[0-9]{1,3}/',$ip))
            return true;

        if(preg_match('/66\.249\.[6-9]*[0-5]\.[0-9]{1,3}/',$ip))
            return true;



        $robots = [
            '66.249.64.139' => true,'66.249.64.250' => true, '66.249.64.133' => true,'66.249.65.103',
            '209.185.108' => true,'209.185.253' => true,'209.85.238' => true,'209.85.238.11' => true,'209.85.238.4' => true,'216.239.33.96' => true,'216.239.33.97' => true,'216.239.33.98' => true,'216.239.33.99' => true,'216.239.37.98' => true,'216.239.37.99' => true,'216.239.39.98' => true,'216.239.39.99' => true,'216.239.41.96' => true,'216.239.41.97' => true,'216.239.41.98' => true,'216.239.41.99' => true,'216.239.45.4' => true,'216.239.46' => true,'216.239.51.96' => true,'216.239.51.97' => true,'216.239.51.98' => true,'216.239.51.99' => true,'216.239.53.98' => true,'216.239.53.99' => true,'216.239.57.96' => true,'216.239.57.97' => true,'216.239.57.98' => true,'216.239.57.99' => true,'216.239.59.98' => true,'216.239.59.99' => true,'216.33.229.163' => true,'64.233.173.193' => true,'64.233.173.194' => true,'64.233.173.195' => true,'64.233.173.196' => true,'64.233.173.197' => true,'64.233.173.198' => true,'64.233.173.199' => true,'64.233.173.200' => true,'64.233.173.201' => true,'64.233.173.202' => true,'64.233.173.203' => true,'64.233.173.204' => true,'64.233.173.205' => true,'64.233.173.206' => true,'64.233.173.207' => true,'64.233.173.208' => true,'64.233.173.209' => true,'64.233.173.210' => true,'64.233.173.211' => true,'64.233.173.212' => true,'64.233.173.213' => true,'64.233.173.214' => true,'64.233.173.215' => true,'64.233.173.216' => true,'64.233.173.217' => true,'64.233.173.218' => true,'64.233.173.219' => true,'64.233.173.220' => true,'64.233.173.221' => true,'64.233.173.222' => true,'64.233.173.223' => true,'64.233.173.224' => true,'64.233.173.225' => true,'64.233.173.226' => true,'64.233.173.227' => true,'64.233.173.228' => true,'64.233.173.229' => true,'64.233.173.230' => true,'64.233.173.231' => true,'64.233.173.232' => true,'64.233.173.233' => true,'64.233.173.234' => true,'64.233.173.235' => true,'64.233.173.236' => true,'64.233.173.237' => true,'64.233.173.238' => true,'64.233.173.239' => true,'64.233.173.240' => true,'64.233.173.241' => true,'64.233.173.242' => true,'64.233.173.243' => true,'64.233.173.244' => true,'64.233.173.245' => true,'64.233.173.246' => true,'64.233.173.247' => true,'64.233.173.248' => true,'64.233.173.249' => true,'64.233.173.250' => true,'64.233.173.251' => true,'64.233.173.252' => true,'64.233.173.253' => true,'64.233.173.254' => true,'64.233.173.255' => true,'64.68.80' => true,'64.68.81' => true,'64.68.82' => true,'64.68.83' => true,'64.68.84' => true,'64.68.85' => true,'64.68.86' => true,'64.68.87' => true,'64.68.88' => true,'64.68.89' => true,'64.68.90.1' => true,'64.68.90.10' => true,'64.68.90.11' => true,'64.68.90.12' => true,'64.68.90.129' => true,'64.68.90.13' => true,'64.68.90.130' => true,'64.68.90.131' => true,'64.68.90.132' => true,'64.68.90.133' => true,'64.68.90.134' => true,'64.68.90.135' => true,'64.68.90.136' => true,'64.68.90.137' => true,'64.68.90.138' => true,'64.68.90.139' => true,'64.68.90.14' => true,'64.68.90.140' => true,'64.68.90.141' => true,'64.68.90.142' => true,'64.68.90.143' => true,'64.68.90.144' => true,'64.68.90.145' => true,'64.68.90.146' => true,'64.68.90.147' => true,'64.68.90.148' => true,'64.68.90.149' => true,'64.68.90.15' => true,'64.68.90.150' => true,'64.68.90.151' => true,'64.68.90.152' => true,'64.68.90.153' => true,'64.68.90.154' => true,'64.68.90.155' => true,'64.68.90.156' => true,'64.68.90.157' => true,'64.68.90.158' => true,'64.68.90.159' => true,'64.68.90.16' => true,'64.68.90.160' => true,'64.68.90.161' => true,'64.68.90.162' => true,'64.68.90.163' => true,'64.68.90.164' => true,'64.68.90.165' => true,'64.68.90.166' => true,'64.68.90.167' => true,'64.68.90.168' => true,'64.68.90.169' => true,'64.68.90.17' => true,'64.68.90.170' => true,'64.68.90.171' => true,'64.68.90.172' => true,'64.68.90.173' => true,'64.68.90.174' => true,'64.68.90.175' => true,'64.68.90.176' => true,'64.68.90.177' => true,'64.68.90.178' => true,'64.68.90.179' => true,'64.68.90.18' => true,'64.68.90.180' => true,'64.68.90.181' => true,'64.68.90.182' => true,'64.68.90.183' => true,'64.68.90.184' => true,'64.68.90.185' => true,'64.68.90.186' => true,'64.68.90.187' => true,'64.68.90.188' => true,'64.68.90.189' => true,'64.68.90.19' => true,'64.68.90.190' => true,'64.68.90.191' => true,'64.68.90.192' => true,'64.68.90.193' => true,'64.68.90.194' => true,'64.68.90.195' => true,'64.68.90.196' => true,'64.68.90.197' => true,'64.68.90.198' => true,'64.68.90.199' => true,'64.68.90.2' => true,'64.68.90.20' => true,'64.68.90.200' => true,'64.68.90.201' => true,'64.68.90.202' => true,'64.68.90.203' => true,'64.68.90.204' => true,'64.68.90.205' => true,'64.68.90.206' => true,'64.68.90.207' => true,'64.68.90.208' => true,'64.68.90.21' => true,'64.68.90.22' => true,'64.68.90.23' => true,'64.68.90.24' => true,'64.68.90.25' => true,'64.68.90.26' => true,'64.68.90.27' => true,'64.68.90.28' => true,'64.68.90.29' => true,'64.68.90.3' => true,'64.68.90.30' => true,'64.68.90.31' => true,'64.68.90.32' => true,'64.68.90.33' => true,'64.68.90.34' => true,'64.68.90.35' => true,'64.68.90.36' => true,'64.68.90.37' => true,'64.68.90.38' => true,'64.68.90.39' => true,'64.68.90.4' => true,'64.68.90.40' => true,'64.68.90.41' => true,'64.68.90.42' => true,'64.68.90.43' => true,'64.68.90.44' => true,'64.68.90.45' => true,'64.68.90.46' => true,'64.68.90.47' => true,'64.68.90.48' => true,'64.68.90.49' => true,'64.68.90.5' => true,'64.68.90.50' => true,'64.68.90.51' => true,'64.68.90.52' => true,'64.68.90.53' => true,'64.68.90.54' => true,'64.68.90.55' => true,'64.68.90.56' => true,'64.68.90.57' => true,'64.68.90.58' => true,'64.68.90.59' => true,'64.68.90.6' => true,'64.68.90.60' => true,'64.68.90.61' => true,'64.68.90.62' => true,'64.68.90.63' => true,'64.68.90.64' => true,'64.68.90.65' => true,'64.68.90.66' => true,'64.68.90.67' => true,'64.68.90.68' => true,'64.68.90.69' => true,'64.68.90.7' => true,'64.68.90.70' => true,'64.68.90.71' => true,'64.68.90.72' => true,'64.68.90.73' => true,'64.68.90.74' => true,'64.68.90.75' => true,'64.68.90.76' => true,'64.68.90.77' => true,'64.68.90.78' => true,'64.68.90.79' => true,'64.68.90.8' => true,'64.68.90.80' => true,'64.68.90.9' => true,'64.68.91' => true,'64.68.92' => true,'66.249.64' => true,'66.249.65' => true,'66.249.66' => true,'66.249.67' => true,'66.249.68' => true,'66.249.69' => true,'66.249.70' => true,'66.249.71' => true,'66.249.72' => true,'66.249.73' => true,'66.249.76.196' => true,'66.249.78' => true,'66.249.79' => true,'72.14.199' => true,'8.6.48' => true,'141.185.209' => true,'169.207.238' => true,'199.177.18.9' => true,'202.160.178' => true,'202.160.179' => true,'202.160.180' => true,'202.160.181' => true,'202.160.183.182' => true,'202.160.183.217' => true,'202.160.183.218' => true,'202.160.183.219' => true,'202.160.183.220' => true,'202.160.183.235' => true,'202.160.183.239' => true,'202.160.183.245' => true,'202.160.185.174' => true,'202.165.96.142' => true,'202.165.98' => true,'202.165.99' => true,'202.212.5.30' => true,'202.212.5.32' => true,'202.212.5.33' => true,'202.212.5.34' => true,'202.212.5.35' => true,'202.212.5.36' => true,'202.212.5.37' => true,'202.212.5.38' => true,'202.212.5.39' => true,'202.212.5.47' => true,'202.212.5.48' => true,'202.46.19.93' => true,'203.123.188.2' => true,'203.141.52.41' => true,'203.141.52.42' => true,'203.141.52.43' => true,'203.141.52.44' => true,'203.141.52.45' => true,'203.141.52.46' => true,'203.141.52.47' => true,'203.255.234.102' => true,'203.255.234.103' => true,'203.255.234.105' => true,'203.255.234.106' => true,'206.190.43.125' => true,'206.190.43.81' => true,'207.126.239.224' => true,'209.1.12' => true,'209.1.13.101' => true,'209.1.13.231' => true,'209.1.13.232' => true,'209.1.32.122' => true,'209.1.38' => true,'209.131.40' => true,'209.131.41' => true,'209.131.48' => true,'209.131.49.37' => true,'209.131.50.153' => true,'209.131.51.166' => true,'209.131.60.169' => true,'209.131.60.170' => true,'209.131.60.171' => true,'209.131.60.19' => true,'209.131.62.107' => true,'209.131.62.108' => true,'209.131.62.109' => true,'209.131.62.214' => true,'209.185.122' => true,'209.185.141' => true,'209.185.143' => true,'209.191.123.33' => true,'209.191.64.227' => true,'209.191.65' => true,'209.191.65.249' => true,'209.191.65.82' => true,'209.191.82.245' => true,'209.191.82.252' => true,'209.191.83' => true,'209.67.206.126' => true,'209.67.206.127' => true,'209.67.206.133' => true,'209.73.176.128' => true,'209.73.176.129' => true,'209.73.176.133' => true,'209.73.176.134' => true,'209.73.176.136' => true,'211.14.8.240' => true,'211.169.241.21' => true,'213.216.143.37' => true,'213.216.143.38' => true,'213.216.143.39' => true,'216.109.121.70' => true,'216.109.121.71' => true,'216.109.126.131' => true,'216.109.126.133' => true,'216.109.126.137' => true,'216.109.126.138' => true,'216.109.126.139' => true,'216.109.126.141' => true,'216.109.126.143' => true,'216.109.126.145' => true,'216.109.126.146' => true,'216.109.126.147' => true,'216.109.126.150' => true,'216.109.126.152' => true,'216.109.126.157' => true,'216.109.126.158' => true,'216.109.126.159' => true,'216.109.126.160' => true,'216.109.126.161' => true,'216.136.233.164' => true,'216.145.58.219' => true,'216.155.198.60' => true,'216.155.200' => true,'216.155.202.175' => true,'216.155.202.54' => true,'216.155.204.40' => true,'216.239.193.71' => true,'216.239.193.72' => true,'216.239.193.73' => true,'216.239.193.74' => true,'216.239.193.75' => true,'216.239.193.76' => true,'216.239.193.77' => true,'216.239.193.78' => true,'216.239.193.79' => true,'216.239.193.80' => true,'216.239.193.81' => true,'216.239.193.82' => true,'216.239.193.83' => true,'216.239.193.84' => true,'216.239.193.85' => true,'216.239.193.86' => true,'216.32.237.1' => true,'216.32.237.10' => true,'216.32.237.11' => true,'216.32.237.12' => true,'216.32.237.13' => true,'216.32.237.14' => true,'216.32.237.15' => true,'216.32.237.16' => true,'216.32.237.17' => true,'216.32.237.18' => true,'216.32.237.19' => true,'216.32.237.20' => true,'216.32.237.21' => true,'216.32.237.22' => true,'216.32.237.23' => true,'216.32.237.24' => true,'216.32.237.25' => true,'216.32.237.26' => true,'216.32.237.27' => true,'216.32.237.28' => true,'216.32.237.29' => true,'216.32.237.30' => true,'216.32.237.7' => true,'216.32.237.8' => true,'216.32.237.9' => true,'62.172.199.20' => true,'62.172.199.21' => true,'62.172.199.22' => true,'62.172.199.23' => true,'62.172.199.24' => true,'62.27.59.245' => true,'63.163.102.180' => true,'63.163.102.181' => true,'63.163.102.182' => true,'64.157.137.219' => true,'64.157.137.220' => true,'64.157.137.221' => true,'64.157.137.225' => true,'64.157.138.103' => true,'64.157.138.108' => true,'64.75.36.42' => true,'64.75.36.43' => true,'64.75.36.44' => true,'64.75.36.45' => true,'64.75.36.47' => true,'64.75.36.77' => true,'64.75.36.79' => true,'64.75.36.80' => true,'66.163.170.157' => true,'66.163.170.159' => true,'66.163.170.161' => true,'66.163.170.162' => true,'66.163.170.166' => true,'66.163.170.167' => true,'66.163.170.170' => true,'66.163.170.172' => true,'66.163.170.176' => true,'66.163.170.178' => true,'66.163.170.179' => true,'66.163.170.180' => true,'66.163.170.184' => true,'66.163.170.185' => true,'66.163.170.190' => true,'66.163.170.192' => true,'66.163.174.65' => true,'66.196.101' => true,'66.196.65' => true,'66.196.67.100' => true,'66.196.67.101' => true,'66.196.67.102' => true,'66.196.67.103' => true,'66.196.67.104' => true,'66.196.67.105' => true,'66.196.67.106' => true,'66.196.67.107' => true,'66.196.67.108' => true,'66.196.67.109' => true,'66.196.67.110' => true,'66.196.67.111' => true,'66.196.67.112' => true,'66.196.67.113' => true,'66.196.67.114' => true,'66.196.67.115' => true,'66.196.67.116' => true,'66.196.67.117' => true,'66.196.67.118' => true,'66.196.67.119' => true,'66.196.67.120' => true,'66.196.67.121' => true,'66.196.67.122' => true,'66.196.67.123' => true,'66.196.67.124' => true,'66.196.67.125' => true,'66.196.67.126' => true,'66.196.67.127' => true,'66.196.67.128' => true,'66.196.67.129' => true,'66.196.67.130' => true,'66.196.67.150' => true,'66.196.67.151' => true,'66.196.67.176' => true,'66.196.67.177' => true,'66.196.67.178' => true,'66.196.67.200' => true,'66.196.67.201' => true,'66.196.67.202' => true,'66.196.67.203' => true,'66.196.67.204' => true,'66.196.67.205' => true,'66.196.67.206' => true,'66.196.67.207' => true,'66.196.67.208' => true,'66.196.67.209' => true,'66.196.67.210' => true,'66.196.67.211' => true,'66.196.67.212' => true,'66.196.67.213' => true,'66.196.67.214' => true,'66.196.67.215' => true,'66.196.67.216' => true,'66.196.67.217' => true,'66.196.67.218' => true,'66.196.67.219' => true,'66.196.67.220' => true,'66.196.67.221' => true,'66.196.67.222' => true,'66.196.67.223' => true,'66.196.67.224' => true,'66.196.67.225' => true,'66.196.67.226' => true,'66.196.67.227' => true,'66.196.67.228' => true,'66.196.67.229' => true,'66.196.67.230' => true,'66.196.67.231' => true,'66.196.67.232' => true,'66.196.67.233' => true,'66.196.67.234' => true,'66.196.67.235' => true,'66.196.67.236' => true,'66.196.67.237' => true,'66.196.67.238' => true,'66.196.67.239' => true,'66.196.67.240' => true,'66.196.67.254' => true,'66.196.67.30' => true,'66.196.67.31' => true,'66.196.67.32' => true,'66.196.67.33' => true,'66.196.67.34' => true,'66.196.67.35' => true,'66.196.67.36' => true,'66.196.67.37' => true,'66.196.67.38' => true,'66.196.67.39' => true,'66.196.67.70' => true,'66.196.67.71' => true,'66.196.67.72' => true,'66.196.67.73' => true,'66.196.67.74' => true,'66.196.67.75' => true,'66.196.67.76' => true,'66.196.67.77' => true,'66.196.67.78' => true,'66.196.67.79' => true,'66.196.67.80' => true,'66.196.67.94' => true,'66.196.67.95' => true,'66.196.67.96' => true,'66.196.67.97' => true,'66.196.67.98' => true,'66.196.67.99' => true,'66.196.72' => true,'66.196.73' => true,'66.196.74' => true,'66.196.77' => true,'66.196.78' => true,'66.196.80' => true,'66.196.81.10' => true,'66.196.81.102' => true,'66.196.81.103' => true,'66.196.81.104' => true,'66.196.81.105' => true,'66.196.81.106' => true,'66.196.81.107' => true,'66.196.81.108' => true,'66.196.81.109' => true,'66.196.81.11' => true,'66.196.81.110' => true,'66.196.81.111' => true,'66.196.81.112' => true,'66.196.81.113' => true,'66.196.81.114' => true,'66.196.81.115' => true,'66.196.81.116' => true,'66.196.81.117' => true,'66.196.81.118' => true,'66.196.81.119' => true,'66.196.81.12' => true,'66.196.81.120' => true,'66.196.81.121' => true,'66.196.81.122' => true,'66.196.81.123' => true,'66.196.81.124' => true,'66.196.81.125' => true,'66.196.81.126' => true,'66.196.81.127' => true,'66.196.81.128' => true,'66.196.81.129' => true,'66.196.81.13' => true,'66.196.81.130' => true,'66.196.81.131' => true,'66.196.81.132' => true,'66.196.81.133' => true,'66.196.81.134' => true,'66.196.81.135' => true,'66.196.81.136' => true,'66.196.81.137' => true,'66.196.81.138' => true,'66.196.81.139' => true,'66.196.81.14' => true,'66.196.81.140' => true,'66.196.81.141' => true,'66.196.81.142' => true,'66.196.81.143' => true,'66.196.81.144' => true,'66.196.81.145' => true,'66.196.81.146' => true,'66.196.81.147' => true,'66.196.81.148' => true,'66.196.81.149' => true,'66.196.81.15' => true,'66.196.81.150' => true,'66.196.81.151' => true,'66.196.81.152' => true,'66.196.81.153' => true,'66.196.81.154' => true,'66.196.81.155' => true,'66.196.81.156' => true,'66.196.81.157' => true,'66.196.81.158' => true,'66.196.81.159' => true,'66.196.81.16' => true,'66.196.81.160' => true,'66.196.81.161' => true,'66.196.81.162' => true,'66.196.81.163' => true,'66.196.81.164' => true,'66.196.81.165' => true,'66.196.81.166' => true,'66.196.81.167' => true,'66.196.81.168' => true,'66.196.81.169' => true,'66.196.81.17' => true,'66.196.81.170' => true,'66.196.81.171' => true,'66.196.81.172' => true,'66.196.81.173' => true,'66.196.81.174' => true,'66.196.81.175' => true,'66.196.81.176' => true,'66.196.81.177' => true,'66.196.81.178' => true,'66.196.81.179' => true,'66.196.81.18' => true,'66.196.81.180' => true,'66.196.81.181' => true,'66.196.81.182' => true,'66.196.81.183' => true,'66.196.81.184' => true,'66.196.81.185' => true,'66.196.81.187' => true,'66.196.81.188' => true,'66.196.81.189' => true,'66.196.81.19' => true,'66.196.81.190' => true,'66.196.81.191' => true,'66.196.81.192' => true,'66.196.81.193' => true,'66.196.81.194' => true,'66.196.81.195' => true,'66.196.81.196' => true,'66.196.81.197' => true,'66.196.81.198' => true,'66.196.81.199' => true,'66.196.81.20' => true,'66.196.81.200' => true,'66.196.81.201' => true,'66.196.81.202' => true,'66.196.81.203' => true,'66.196.81.204' => true,'66.196.81.205' => true,'66.196.81.206' => true,'66.196.81.207' => true,'66.196.81.208' => true,'66.196.81.209' => true,'66.196.81.21' => true,'66.196.81.210' => true,'66.196.81.211' => true,'66.196.81.212' => true,'66.196.81.213' => true,'66.196.81.214' => true,'66.196.81.215' => true,'66.196.81.216' => true,'66.196.81.217' => true,'66.196.81.218' => true,'66.196.81.219' => true,'66.196.81.22' => true,'66.196.81.23' => true,'66.196.81.86' => true,'66.196.81.87' => true,'66.196.81.88' => true,'66.196.81.93' => true,'66.196.81.94' => true,'66.196.81.95' => true,'66.196.81.96' => true,'66.196.90' => true,'66.196.91' => true,'66.196.92' => true,'66.196.93.19' => true,'66.196.93.24' => true,'66.196.93.6' => true,'66.196.93.7' => true,'66.196.97' => true,'66.196.99.20' => true,'66.218.65.52' => true,'66.218.70' => true,'66.228.164' => true,'66.228.165' => true,'66.228.166' => true,'66.228.173' => true,'66.228.182.177' => true,'66.228.182.183' => true,'66.228.182.185' => true,'66.228.182.187' => true,'66.228.182.188' => true,'66.228.182.190' => true,'66.94.230.100' => true,'66.94.230.101' => true,'66.94.230.102' => true,'66.94.230.103' => true,'66.94.230.104' => true,'66.94.230.105' => true,'66.94.230.106' => true,'66.94.230.107' => true,'66.94.230.108' => true,'66.94.230.109' => true,'66.94.230.110' => true,'66.94.230.160' => true,'66.94.230.161' => true,'66.94.230.162' => true,'66.94.230.163' => true,'66.94.230.96' => true,'66.94.230.97' => true,'66.94.230.98' => true,'66.94.230.99' => true,'66.94.232' => true,'66.94.233' => true,'66.94.238.51' => true,'67.195.115' => true,'67.195.34' => true,'67.195.37' => true,'67.195.44' => true,'67.195.45' => true,'67.195.50.87' => true,'67.195.51' => true,'67.195.52' => true,'67.195.53.111' => true,'67.195.53.219' => true,'67.195.54' => true,'67.195.58' => true,'67.195.98' => true,'67.195.110' => true,'67.195.111' => true,'67.195.112' => true,'67.195.113' => true,'67.195.114' => true,'68.142.195.80' => true,'68.142.195.81' => true,'68.142.203.133' => true,'68.142.211.69' => true,'68.142.212.197' => true,'68.142.230.125' => true,'68.142.230.126' => true,'68.142.230.127' => true,'68.142.230.128' => true,'68.142.230.129' => true,'68.142.230.130' => true,'68.142.230.131' => true,'68.142.230.132' => true,'68.142.230.133' => true,'68.142.230.134' => true,'68.142.230.135' => true,'68.142.230.136' => true,'68.142.230.137' => true,'68.142.230.138' => true,'68.142.230.139' => true,'68.142.230.140' => true,'68.142.230.141' => true,'68.142.230.142' => true,'68.142.230.143' => true,'68.142.230.144' => true,'68.142.230.145' => true,'68.142.230.146' => true,'68.142.230.147' => true,'68.142.230.148' => true,'68.142.230.149' => true,'68.142.230.150' => true,'68.142.230.151' => true,'68.142.230.152' => true,'68.142.230.153' => true,'68.142.230.154' => true,'68.142.230.155' => true,'68.142.230.156' => true,'68.142.230.157' => true,'68.142.230.158' => true,'68.142.230.159' => true,'68.142.230.160' => true,'68.142.230.161' => true,'68.142.230.162' => true,'68.142.230.163' => true,'68.142.230.164' => true,'68.142.230.165' => true,'68.142.230.166' => true,'68.142.230.167' => true,'68.142.230.168' => true,'68.142.230.169' => true,'68.142.230.174' => true,'68.142.230.175' => true,'68.142.230.176' => true,'68.142.230.177' => true,'68.142.230.178' => true,'68.142.230.179' => true,'68.142.230.180' => true,'68.142.230.181' => true,'68.142.230.182' => true,'68.142.230.183' => true,'68.142.230.184' => true,'68.142.230.185' => true,'68.142.230.186' => true,'68.142.230.187' => true,'68.142.230.188' => true,'68.142.230.189' => true,'68.142.230.190' => true,'68.142.230.191' => true,'68.142.230.192' => true,'68.142.230.193' => true,'68.142.230.194' => true,'68.142.230.195' => true,'68.142.230.196' => true,'68.142.230.197' => true,'68.142.230.198' => true,'68.142.230.199' => true,'68.142.230.200' => true,'68.142.230.201' => true,'68.142.230.202' => true,'68.142.230.203' => true,'68.142.230.204' => true,'68.142.230.205' => true,'68.142.230.206' => true,'68.142.230.207' => true,'68.142.230.208' => true,'68.142.230.209' => true,'68.142.230.210' => true,'68.142.230.211' => true,'68.142.230.212' => true,'68.142.230.213' => true,'68.142.230.214' => true,'68.142.230.215' => true,'68.142.230.216' => true,'68.142.230.217' => true,'68.142.230.240' => true,'68.142.230.247' => true,'68.142.230.248' => true,'68.142.230.249' => true,'68.142.230.250' => true,'68.142.230.251' => true,'68.142.230.252' => true,'68.142.230.253' => true,'68.142.230.254' => true,'68.142.230.32' => true,'68.142.230.33' => true,'68.142.230.34' => true,'68.142.230.35' => true,'68.142.230.36' => true,'68.142.230.37' => true,'68.142.230.38' => true,'68.142.230.39' => true,'68.142.230.40' => true,'68.142.230.41' => true,'68.142.230.43' => true,'68.142.230.44' => true,'68.142.230.45' => true,'68.142.230.46' => true,'68.142.230.47' => true,'68.142.230.48' => true,'68.142.230.49' => true,'68.142.231.49' => true,'68.142.240.106' => true,'68.142.246' => true,'68.142.249' => true,'68.142.250' => true,'68.142.251' => true,'68.180.216.111' => true,'68.180.224.229' => true,'68.180.250' => true,'68.180.251' => true,'69.147.79.131' => true,'69.147.79.137' => true,'69.147.79.173' => true,'72.30.101' => true,'72.30.102' => true,'72.30.103' => true,'72.30.104' => true,'72.30.107' => true,'72.30.110' => true,'72.30.111' => true,'72.30.124.128' => true,'72.30.124.130' => true,'72.30.124.134' => true,'72.30.128' => true,'72.30.129' => true,'72.30.131' => true,'72.30.132' => true,'72.30.133' => true,'72.30.134' => true,'72.30.135' => true,'72.30.142' => true,'72.30.142.24' => true,'72.30.142.25' => true,'72.30.161' => true,'72.30.177' => true,'72.30.179' => true,'72.30.213.101' => true,'72.30.214' => true,'72.30.215' => true,'72.30.216' => true,'72.30.221' => true,'72.30.226' => true,'72.30.252' => true,'72.30.54' => true,'72.30.56' => true,'72.30.60' => true,'72.30.61' => true,'72.30.65' => true,'72.30.78' => true,'72.30.79' => true,'72.30.81' => true,'72.30.87' => true,'72.30.9' => true,'72.30.97' => true,'72.30.98' => true,'72.30.99' => true,'74.6.11' => true,'74.6.12' => true,'74.6.13' => true,'74.6.131' => true,'74.6.16' => true,'74.6.17' => true,'74.6.18' => true,'74.6.19' => true,'74.6.20' => true,'74.6.21' => true,'74.6.22' => true,'74.6.23' => true,'74.6.24' => true,'74.6.240' => true,'74.6.25' => true,'74.6.26' => true,'74.6.27' => true,'74.6.28' => true,'74.6.29' => true,'74.6.30' => true,'74.6.31' => true,'74.6.65' => true,'74.6.66' => true,'74.6.67' => true,'74.6.68' => true,'74.6.69' => true,'74.6.7' => true,'74.6.70' => true,'74.6.71' => true,'74.6.72' => true,'74.6.73' => true,'74.6.74' => true,'74.6.75' => true,'74.6.76' => true,'74.6.79' => true,'74.6.8' => true,'74.6.85' => true,'74.6.86' => true,'74.6.87' => true,'74.6.9' => true,'166.48.225.254' => true,'202.232.118.40' => true,'202.232.118.51' => true,'206.79.171' => true,'207.77.90' => true,'207.77.91.184' => true,'208.146.26' => true,'208.146.27.123' => true,'208.146.27.124' => true,'208.146.27.57' => true,'208.146.27.58' => true,'208.146.27.59' => true,'208.146.27.60' => true,'208.146.27.62' => true,'208.146.27.89' => true,'208.146.27.90' => true,'208.146.27.91' => true,'208.146.27.92' => true,'208.146.27.93' => true,'208.146.27.94' => true,'208.146.27.95' => true,'208.146.27.96' => true,'209.202.192' => true,'209.202.192.147' => true,'209.202.193' => true,'209.202.194.237' => true,'209.202.194.238' => true,'209.202.205.1' => true,'209.202.240.109' => true,'209.202.240.8' => true,'209.202.248.211' => true,'209.202.248.212' => true,'209.202.248.213' => true,'209.202.248.214' => true,'209.67.228' => true,'209.67.229' => true,'211.51.63.4' => true,'213.193.19.35' => true,'64.89.33' => true,'195.145.119.24' => true,'195.145.119.25' => true,'198.5.208' => true,'198.5.210' => true,'202.33.250.146' => true,'202.33.250.147' => true,'202.33.250.148' => true,'202.33.250.149' => true,'202.33.250.150' => true,'202.33.250.151' => true,'202.33.250.152' => true,'202.33.250.153' => true,'202.33.250.154' => true,'204.162.96' => true,'204.162.97.1' => true,'204.162.97.152' => true,'204.162.97.17' => true,'204.162.97.2' => true,'204.162.97.205' => true,'204.162.97.228' => true,'204.162.97.231' => true,'204.162.97.3' => true,'204.162.97.32' => true,'204.162.98.11' => true,'204.162.98.12' => true,'204.162.98.124' => true,'204.162.98.126' => true,'204.162.98.151' => true,'204.162.98.161' => true,'204.162.98.168' => true,'204.162.98.18' => true,'204.162.98.192' => true,'204.162.98.2' => true,'204.162.98.237' => true,'204.162.98.27' => true,'204.162.98.3' => true,'204.162.98.36' => true,'204.162.98.38' => true,'204.162.98.4' => true,'204.162.98.45' => true,'204.162.98.48' => true,'204.162.98.49' => true,'204.162.98.5' => true,'204.162.98.6' => true,'204.162.98.7' => true,'204.162.98.8' => true,'204.162.98.80' => true,'204.162.98.88' => true,'204.162.98.9' => true,'204.162.98.91' => true,'204.162.98.98' => true,'204.202.132.19' => true,'205.226.201' => true,'205.226.203.186' => true,'205.226.203.35' => true,'205.226.203.56' => true,'205.226.203.62' => true,'205.226.204.238' => true,'206.3.30.196' => true,'206.3.30.250' => true,'206.3.30.251' => true,'210.148.160.157' => true,'210.148.160.163' => true,'210.148.160.165' => true,'210.148.160.206' => true,'210.155.157' => true,'210.155.159' => true,'210.236.233.130' => true,'210.236.233.131' => true,'210.236.233.132' => true,'210.236.233.133' => true,'210.236.233.135' => true,'210.236.233.136' => true,'210.236.233.137' => true,'210.236.233.139' => true,'210.236.233.150' => true,'210.236.233.151' => true,'210.236.233.155' => true,'210.236.233.160' => true,'210.236.233.161' => true,'211.13.222.230' => true,'211.18.214.194' => true,'212.185.44.10' => true,'212.185.44.11' => true,'212.185.44.12' => true,'212.185.44.15' => true,'128.177.243' => true,'128.177.244.100' => true,'128.177.244.86' => true,'194.112.94.250' => true,'194.112.94.251' => true,'194.112.94.252' => true,'194.201.146.1' => true,'194.201.146.24' => true,'194.221.84.11' => true,'194.221.84.15' => true,'194.221.84.31' => true,'194.221.84.32' => true,'194.221.84.33' => true,'194.221.84.34' => true,'194.221.84.38' => true,'194.221.84.39' => true,'194.221.84.40' => true,'194.221.84.41' => true,'194.51.33.72' => true,'204.123.13.36' => true,'204.123.13.65' => true,'204.123.13.66' => true,'204.123.2' => true,'204.123.28.10' => true,'204.123.28.11' => true,'204.123.28.20' => true,'204.123.28.21' => true,'204.123.28.27' => true,'204.123.28.30' => true,'204.123.28.31' => true,'204.123.28.32' => true,'204.123.28.33' => true,'204.123.9' => true,'204.152.190' => true,'204.152.191' => true,'205.229.83.18' => true,'208.185.243.148' => true,'208.221.32' => true,'208.221.35.200' => true,'208.221.35.201' => true,'208.221.35.202' => true,'208.221.35.203' => true,'208.221.35.204' => true,'208.221.35.205' => true,'208.221.35.206' => true,'208.221.35.207' => true,'209.247.40.246' => true,'209.73.160.1' => true,'209.73.160.250' => true,'209.73.160.254' => true,'209.73.162' => true,'209.73.164' => true,'209.73.174.250' => true,'209.73.174.251' => true,'209.73.180' => true,'212.187.213.171' => true,'212.187.213.172' => true,'212.187.213.173' => true,'212.187.213.174' => true,'212.187.213.175' => true,'212.187.226' => true,'212.187.226.42' => true,'212.187.226.83' => true,'212.187.226.84' => true,'212.187.226.85' => true,'212.187.226.87' => true,'212.187.226.88' => true,'212.187.226.93' => true,'212.187.226.99' => true,'212.187.227' => true,'216.39.48' => true,'216.39.50' => true,'216.39.51' => true,'64.152.75' => true,'66.17.148.128' => true,'66.17.148.129' => true,'66.17.148.130' => true,'66.17.148.131' => true,'66.17.148.132' => true,'66.17.148.133' => true,'66.17.148.134' => true,'66.17.148.135' => true,'66.17.148.136' => true,'66.17.148.137' => true,'66.17.148.138' => true,'66.17.148.139' => true,'66.17.148.140' => true,'66.17.148.141' => true,'66.17.148.142' => true,'66.17.148.143' => true,'66.17.148.144' => true,'66.17.148.145' => true,'66.17.148.146' => true,'66.17.148.147' => true,'66.17.148.148' => true,'66.17.148.149' => true,'66.17.148.150' => true,'66.17.148.151' => true,'66.17.148.152' => true,'66.17.148.153' => true,'66.17.148.154' => true,'66.17.148.155' => true,'66.17.148.156' => true,'66.17.148.157' => true,'66.17.148.158' => true,'66.17.148.159' => true,'66.17.148.160' => true,'66.17.148.161' => true,'66.17.148.162' => true,'66.17.148.163' => true,'66.17.148.164' => true,'66.17.148.165' => true,'66.17.148.166' => true,'66.17.148.167' => true,'66.17.148.168' => true,'66.17.148.169' => true,'66.17.148.170' => true,'66.17.148.171' => true,'66.17.148.172' => true,'66.17.148.173' => true,'66.17.148.174' => true,'66.17.148.175' => true,'66.17.148.176' => true,'66.17.148.177' => true,'66.17.148.178' => true,'66.17.148.179' => true,'66.17.148.180' => true,'66.17.148.181' => true,'66.17.148.182' => true,'66.17.148.183' => true,'66.17.148.184' => true,'66.17.148.185' => true,'66.17.148.186' => true,'66.17.148.187' => true,'66.17.148.188' => true,'66.17.148.189' => true,'66.17.148.190' => true,'66.17.148.191' => true,'66.163.170.193' => true,'198.3.103' => true,'199.172.148.105' => true,'199.172.148.11' => true,'199.172.148.37' => true,'199.172.149' => true,'199.172.152.238' => true,'199.172.152.34' => true,'199.172.152.54' => true,'199.172.152.56' => true,'199.172.152.57' => true,'199.172.152.95' => true,'199.172.153.174' => true,'199.172.153.178' => true,'199.172.156.168' => true,'199.172.156.169' => true,'199.172.156.170' => true,'199.172.156.219' => true,'199.172.157.28' => true,'204.62.245' => true,'195.228.240.177' => true,'204.166.111.29' => true,'205.181.75.130' => true,'20.181.75.60' => true,'205.181.75.66' => true,'205.181.75.75' => true,'205.181.75.76' => true,'208.219.77' => true,'216.34.102' => true,'216.34.109.190' => true,'216.34.109.191' => true,'216.34.109.192' => true,'64.95.79.195' => true,'64.95.79.40' => true,'206.253.217.18' => true,'82.165.35.184' => true,'63.222.37.101' => true,'63.222.37.105' => true,'195.3.97.3' => true,'193.110.40.93' => true,'194.231.30.86' => true,'194.231.30.87' => true,'194.231.30.88' => true,'194.231.30.89' => true,'194.231.30.90' => true,'194.231.30.91' => true,'194.231.30.92' => true,'194.231.30.93' => true,'194.231.30.108' => true,'194.231.30.109' => true,'194.231.68.166' => true,'213.203.200.31' => true,'209.68.2.36' => true,'194.117.133.180' => true,'194.231.42.185' => true,'86.131.209.38' => true,'86.131.210.252' => true,'81.155.227.55' => true,'81.155.227.56' => true,'217.43.59.146' => true,'208.204.161.8' => true,'216.250.141.186' => true,'207.126.112.254' => true,'209.120.206.178' => true,'212.91.134.190' => true,'216.178.189.230' => true,'130.225.20.4' => true,'64.247.218.197' => true,'81.209.140.139' => true,'140.142.13.196' => true,'194.231.30.14' => true,'194.231.0.71' => true,'194.231.30.11' => true,'195.37.68.3' => true,'195.37.68.65' => true,'195.37.68.180' => true,'195.37.68.181' => true,'209.239.48.69' => true,'213.229.153.170' => true,'217.113.244.118' => true,'217.113.244.119' => true,'194.231.42.178' => true,'167.160.195.61' => true,'80.16.145.187' => true,'64.246.36.123' => true,'134.96.1.195' => true,'134.96.7.93' => true,'134.96.68.36' => true,'134.96.104.5' => true,'134.96.104.23' => true,'134.96.104.83' => true,'134.96.104.109' => true,'134.96.104.225' => true,'134.96.104.226' => true,'134.96.104.227' => true,'208.78.102.219' => true,'216.240.143.30' => true,'192.41.9.30' => true,'208.237.120.82' => true,'194.67.18.84' => true,'194.67.18.70' => true,'194.67.18.65' => true,'194.67.18.69' => true,'194.67.18.68' => true,'194.67.18.67' => true,'194.67.18.66' => true,'194.67.18.63' => true,'194.67.18.71' => true,'194.67.18.72' => true,'194.67.18.73' => true,'194.67.18.74' => true,'195.210.89.11' => true,'195.210.91.24' => true,'195.210.91.80' => true,'195.210.91.112' => true,'195.210.91.113' => true,'195.210.91.187' => true,'195.210.91.212' => true,'195.210.91.213' => true,'195.210.91.214' => true,'195.210.91.235' => true,'195.210.91.215' => true,'192.92.126.4' => true,'192.92.126.5' => true,'140.239.126.13' => true,'140.239.251.220' => true,'140.239.251.221' => true,'140.239.251.222' => true,'140.239.251.223' => true,'140.239.251.224' => true,'140.239.251.230' => true,'206.80.1.253' => true,'207.204.132.233' => true,'207.204.132.234' => true,'208.178.104.55' => true,'209.67.252.197' => true,'209.67.252.199' => true,'209.67.252.211' => true,'209.67.252.212' => true,'209.67.252.213' => true,'209.67.252.214' => true,'209.67.252.215' => true,'209.67.252.216' => true,'210.51.25.142' => true,'211.13.230.249' => true,'216.143.191.131' => true,'216.200.130.20' => true,'216.200.130.200' => true,'216.200.130.201' => true,'216.200.130.202' => true,'216.200.130.203' => true,'216.200.130.204' => true,'216.200.130.205' => true,'216.200.130.206' => true,'216.200.130.207' => true,'216.200.130.208' => true,'216.200.130.209' => true,'216.200.130.210' => true,'216.200.130.242' => true,'216.200.130.244' => true,'216.200.130.245' => true,'216.200.130.246' => true,'216.200.130.248' => true,'216.200.130.249' => true,'216.200.130.26' => true,'216.200.130.77' => true,'216.200.130.78' => true,'216.200.130.79' => true,'216.200.130.85' => true,'216.200.130.86' => true,'216.200.130.87' => true,'216.200.130.88' => true,'216.200.130.89' => true,'216.34.121.100' => true,'216.34.121.18' => true,'216.34.121.19' => true,'216.34.121.31' => true,'216.34.121.32' => true,'216.34.121.33' => true,'216.34.121.34' => true,'216.34.121.67' => true,'216.34.121.68' => true,'63.123.238.50' => true,'63.123.238.54' => true,'63.123.238.8' => true,'63.236.92.143' => true,'63.236.92.144' => true,'63.236.92.145' => true,'63.236.92.146' => true,'63.236.92.147' => true,'63.236.92.148' => true,'63.236.92.149' => true,'63.236.92.150' => true,'63.236.92.151' => true,'63.236.92.152' => true,'63.236.92.153' => true,'64.55.148.3' => true,'64.55.148.37' => true,'64.55.148.38' => true,'64.55.148.39' => true,'64.55.148.4' => true,'64.55.148.43' => true,'64.55.148.44' => true,'64.55.148.45' => true,'64.55.148.5' => true,'64.55.148.50' => true,'64.55.148.51' => true,'64.55.148.52' => true,'64.55.148.53' => true,'64.55.148.54' => true,'65.119.214.9' => true,'65.192.195.0' => true,'65.192.195.1' => true,'65.192.195.10' => true,'65.192.195.11' => true,'65.192.195.12' => true,'65.192.195.13' => true,'65.192.195.14' => true,'65.192.195.15' => true,'65.192.195.16' => true,'65.192.195.17' => true,'65.192.195.18' => true,'65.192.195.19' => true,'65.192.195.2' => true,'65.192.195.20' => true,'65.192.195.21' => true,'65.192.195.22' => true,'65.192.195.23' => true,'65.192.195.24' => true,'65.192.195.25' => true,'65.192.195.26' => true,'65.192.195.27' => true,'65.192.195.28' => true,'65.192.195.29' => true,'65.192.195.3' => true,'65.192.195.30' => true,'65.192.195.31' => true,'65.192.195.4' => true,'65.192.195.5' => true,'65.192.195.6' => true,'65.192.195.7' => true,'65.192.195.8' => true,'65.192.195.9' => true,'65.214.32' => true,'65.214.36' => true,'65.214.38' => true,'65.214.44' => true,'65.214.45' => true,'66.235.124' => true,'216.55.159.187' => true,'216.55.159.189' => true,'216.55.159.190' => true,'65.254.63.154' => true,'69.57.157.54' => true,'171.64.68.80' => true,'171.64.75.100' => true,'171.64.75.104' => true,'60.28.17.36' => true,'60.28.17.39' => true,'60.28.17.41' => true,'60.28.17.43' => true,'60.28.17.45' => true,'60.28.17.47' => true,'61.135.145.204' => true,'61.135.145.207' => true,'61.135.145.208' => true,'61.135.145.209' => true,'61.135.145.211' => true,'61.135.145.212' => true,'61.135.145.215' => true,'61.135.145.216' => true,'61.135.145.219' => true,'61.135.145.221' => true,'61.135.145.251' => true,'61.135.146.197' => true,'61.135.146.199' => true,'61.135.146.200' => true,'61.135.146.201' => true,'61.135.146.202' => true,'61.135.146.205' => true,'61.135.146.206' => true,'61.135.146.210' => true,'61.135.146.251' => true,'61.135.162.204' => true,'61.135.162.51' => true,'61.135.162.78' => true,'61.135.166.102' => true,'61.135.166.205' => true,'61.135.166.229' => true,'61.135.168' => true,'61.135.190' => true,'61.149.2.221' => true,'119.63.193.39' => true,'122.152.128.10' => true,'122.152.128.19' => true,'122.152.128.48' => true,'122.152.129.10' => true,'122.152.129.9' => true,'123.125.64.38' => true,'123.125.64.49' => true,'123.125.71' => true,'162.105.207.185' => true,'162.105.207.192' => true,'180.76.5.154' => true,'180.76.6.54' => true,'180.76.6.145' => true,'202.103.134.196' => true,'202.108.11.106' => true,'202.108.11.108' => true,'202.108.11.132' => true,'202.108.22.70' => true,'202.108.22.73' => true,'202.108.22.75' => true,'202.108.22.79' => true,'202.108.22.80' => true,'202.108.22.81' => true,'202.108.23.71' => true,'202.108.23.74' => true,'202.108.249.176' => true,'202.108.249.177' => true,'202.108.249.178' => true,'202.108.249.179' => true,'202.108.249.182' => true,'202.108.249.183' => true,'202.108.249.184' => true,'202.108.249.185' => true,'202.108.249.186' => true,'202.108.249.187' => true,'202.108.249.188' => true,'202.108.249.189' => true,'202.108.249.190' => true,'202.108.250.195' => true,'202.108.250.196' => true,'202.108.250.197' => true,'202.108.250.198' => true,'202.108.250.199' => true,'202.108.250.206' => true,'202.108.250.207' => true,'202.108.250.226' => true,'202.108.250.241' => true,'202.108.250.242' => true,'202.108.250.243' => true,'202.108.250.244' => true,'202.108.250.253' => true,'211.100.24.90' => true,'211.100.24.91' => true,'211.100.24.92' => true,'211.100.24.93' => true,'211.100.24.94' => true,'211.100.24.95' => true,'211.100.24.96' => true,'211.100.24.97' => true,'211.100.25.196' => true,'211.100.25.197' => true,'211.100.25.198' => true,'211.100.25.199' => true,'211.100.25.200' => true,'211.100.25.202' => true,'211.100.25.204' => true,'211.101.48.53' => true,'220.181.7' => true,'220.181.32.22' => true,'220.181.32.52' => true,'220.181.38.169' => true,'220.181.38.179' => true,'220.181.38.191' => true,'220.181.108' => true,'204.251.93.10' => true,'64.124.85' => true,'69.111.170.194' => true,'208.28.152.71' => true,'72.3.246.162' => true,'216.130.179.196' => true,'72.0.207.162' => true,'216.58.87.217' => true,'194.198.230.36' => true,'210.159.73.36' => true,'210.159.73.35' => true,'194.231.30.106' => true,'194.231.30.107' => true,'216.148.212.182' => true,'129.241.104.168' => true,'129.241.104.173' => true,'129.241.104.174' => true,'129.241.104.175' => true,'129.241.104.179' => true,'129.241.104.180' => true,'129.241.104.182' => true,'129.241.104.183' => true,'129.241.104.184' => true,'129.241.104.185' => true,'129.241.104.186' => true,'129.241.104.187' => true,'129.241.104.188' => true,'129.241.104.189' => true,'129.241.104.238' => true,'129.241.104.242' => true,'129.241.50.32' => true,'129.241.50.33' => true,'129.241.50.34' => true,'129.241.50.35' => true,'193.71.105.251' => true,'213.179.39.227' => true,'213.179.58.54' => true,'217.118.34.110' => true,'217.118.38.226' => true,'217.118.38.227' => true,'217.118.38.228' => true,'217.118.38.229' => true,'217.118.38.230' => true,'217.118.38.231' => true,'217.118.38.232' => true,'217.118.38.233' => true,'217.118.38.234' => true,'24.68.149.78' => true,'24.97.214.158' => true,'62.101.246.77' => true,'62.97.196.2' => true,'80.202.209.74' => true,'80.202.219.29' => true,'80.202.221.109' => true,'80.202.58.101' => true,'80.203.138.137' => true,'80.203.232.107' => true,'80.203.26.148' => true,'80.203.32.41' => true,'80.203.51.157' => true,'80.239.62.203' => true,'81.0.183.106' => true,'81.0.183.107' => true,'81.191.108.59' => true,'81.191.110.86' => true,'81.191.68.135' => true,'83.108.128.168' => true,'83.108.143.229' => true,'84.48.35.246' => true,'84.48.78.80' => true,'151.189.96.99' => true,'134.93.7.97' => true,'134.93.7.98' => true,'64.57.64.90' => true,'200.215.16.125' => true,'84.128.33.71' => true,'84.150.79.18' => true,'84.150.122.26' => true,'217.235.240.139' => true,'217.235.241.160' => true,'81.86.128.112' => true,'88.107.17.230' => true,'64.34.172.78' => true,'64.34.176.199' => true,'64.34.179.137' => true,'131.188.128.229' => true,'194.199.4.2' => true,'207.44.220.53' => true,'213.29.7.220' => true,'213.29.7.217' => true,'62.84.131.137' => true,'62.84.131.161' => true,'62.84.131.158' => true,'62.168.111.19' => true,'62.168.111.21' => true,'192.115.137.202' => true,'192.115.136.15' => true,'64.28.94.71' => true,'198.138.63.1' => true,'198.138.63.22' => true,'198.139.155.10' => true,'209.249.80.231' => true,'209.249.80.232' => true,'209.249.80.233' => true,'209.249.80.245' => true,'209.249.80.246' => true,'209.10.61.5' => true,'130.235.86.152' => true,'195.76.40.251' => true,'66.47.255.121' => true,'63.241.61.39' => true,'63.241.61.43' => true,'63.241.61.46' => true,'63.241.61.7' => true,'63.241.61.8' => true,'216.143.233.35' => true,'80.182.226.190' => true,'195.20.224.72' => true,'195.20.224.73' => true,'66.235.180.244' => true,'143.89.40.159' => true,'208.36.144.10' => true,'208.36.144.6' => true,'208.36.144.7' => true,'208.36.144.8' => true,'208.36.144.9' => true,'216.129.119.10' => true,'216.129.119.11' => true,'216.129.119.12' => true,'216.129.119.13' => true,'216.129.119.14' => true,'216.129.119.15' => true,'216.129.119.16' => true,'216.129.119.17' => true,'216.129.119.18' => true,'216.129.119.19' => true,'216.129.119.40' => true,'216.129.119.41' => true,'216.129.119.42' => true,'216.129.119.43' => true,'216.129.119.44' => true,'216.129.119.45' => true,'216.129.119.46' => true,'216.129.119.47' => true,'216.129.119.48' => true,'216.129.119.49' => true,'216.129.119.81' => true,'38.99.13.116' => true,'38.99.13.117' => true,'38.99.13.118' => true,'38.99.13.119' => true,'38.99.13.120' => true,'38.99.13.121' => true,'38.99.13.122' => true,'38.99.13.123' => true,'38.99.13.124' => true,'38.99.13.125' => true,'38.99.13.126' => true,'38.99.44.101' => true,'38.99.44.102' => true,'38.99.44.103' => true,'38.99.44.104' => true,'38.99.44.105' => true,'38.99.44.106' => true,'38.99.44.107' => true,'38.99.44.108' => true,'64.1.215.162' => true,'64.1.215.163' => true,'64.1.215.164' => true,'64.1.215.165' => true,'64.1.215.166' => true,'67.218.116.132' => true,'67.218.116.134' => true,'67.218.116.162' => true,'192.41.34.245' => true,'192.41.43.146' => true,'192.41.49.235' => true,'82.235.118.155' => true,'213.246.36.238' => true,'68.232.134.231' => true,'69.168.43.89' => true,'208.185.131.219' => true,'208.185.131.220' => true,'208.185.131.221' => true,'208.185.131.222' => true,'216.200.195.53' => true,'216.200.195.58' => true,'216.200.195.60' => true,'216.200.195.57' => true,'216.200.195.59' => true,'216.200.195.61' => true,'62.212.117.198' => true,'213.41.128.47' => true,'213.251.136.94' => true,'217.160.94.14' => true,'66.77.127.85' => true,'66.77.127.102' => true,'217.146.97.27' => true,'210.199.215.54' => true,'210.233.67.132' => true,'38.118.73.250' => true,'68.167.196.88' => true,'68.239.122.138' => true,'151.200.115.249' => true,'183.60.213.53' => true,'213.215.160.170' => true,'210.16.10.40' => true,'208.186.202.21' => true,'62.57.74.14' => true,'207.31.251.140' => true,'81.153.61.72' => true,'81.153.62.103' => true,'193.15.210.29' => true,'62.13.25.201' => true,'62.13.25.209' => true,'62.13.25.219' => true,'62.13.25.220' => true,'62.13.25.221' => true,'62.13.25.222' => true,'88.131.106.10' => true,'88.131.106.16' => true,'88.131.106.11' => true,'88.131.106.6' => true,'88.131.153.91' => true,'89.150.197.134' => true,'89.150.197.138' => true,'89.150.197.142' => true,'89.150.197.144' => true,'89.150.197.192' => true,'89.150.197.193' => true,'89.150.197.194' => true,'70.169.191.4' => true,'71.102.140.247' => true,'42.142.128.210' => true,'133.9.238.71' => true,'136.187.19.99' => true,'210.128.142.42' => true,'209.198.242.61' => true,'194.231.76.158' => true,'194.168.54.6' => true,'194.168.54.11' => true,'195.95.124.3' => true,'195.95.124.7' => true,'212.209.54.40' => true,'212.209.54.134' => true,'195.242.46.55' => true,'66.249.26.98' => true,'206.51.232.142' => true,'207.36.47.237' => true,'216.110.167.157' => true,'69.9.181.169' => true,'69.9.181.170' => true,'69.9.181.171' => true,'64.81.121.37' => true,'69.44.159.54' => true,'84.233.148.5' => true,'84.233.148.7' => true,'84.233.148.10' => true,'84.233.148.11' => true,'84.233.148.12' => true,'84.233.148.13' => true,'84.233.148.14' => true,'84.233.148.15' => true,'84.233.148.16' => true,'84.233.148.17' => true,'84.233.148.18' => true,'84.233.148.19' => true,'84.233.148.20' => true,'84.233.148.21' => true,'84.233.148.22' => true,'84.233.148.23' => true,'84.233.148.24' => true,'193.47.80.101' => true,'193.47.80.135' => true,'193.47.80.136' => true,'193.47.80.140' => true,'193.47.80.142' => true,'193.47.80.36' => true,'193.47.80.37' => true,'193.47.80.38' => true,'193.47.80.39' => true,'193.47.80.40' => true,'193.47.80.41' => true,'193.47.80.42' => true,'193.47.80.43' => true,'193.47.80.44' => true,'193.47.80.46' => true,'193.47.80.75' => true,'193.47.80.77' => true,'193.47.80.78' => true,'193.47.80.83' => true,'193.47.80.94' => true,'195.154.174.164' => true,'195.154.174.167' => true,'212.234.111.157' => true,'213.174.84.195' => true,'64.14.66.11' => true,'64.14.66.100' => true,'146.101.142.222' => true,'146.101.142.223' => true,'146.101.142.224' => true,'146.101.142.225' => true,'146.101.142.226' => true,'146.101.142.227' => true,'146.101.142.228' => true,'146.101.142.229' => true,'146.101.142.230' => true,'146.101.142.231' => true,'146.101.142.232' => true,'146.101.142.233' => true,'146.101.142.234' => true,'146.101.142.235' => true,'146.101.142.236' => true,'146.101.142.237' => true,'146.101.142.238' => true,'146.101.142.239' => true,'146.101.142.240' => true,'146.101.142.241' => true,'146.101.142.242' => true,'146.101.142.243' => true,'146.101.142.244' => true,'146.101.142.245' => true,'146.101.142.246' => true,'146.101.142.247' => true,'146.101.142.248' => true,'146.101.142.249' => true,'146.101.142.250' => true,'146.101.142.251' => true,'146.101.142.252' => true,'146.101.142.253' => true,'151.138.18.30' => true,'151.138.18.35' => true,'194.224.199.46' => true,'194.224.199.48' => true,'200.221.10.240' => true,'207.201.123.246' => true,'208.186.202.28' => true,'209.202.148' => true,'209.67.247' => true,'212.48.8.142' => true,'212.48.11.189' => true,'213.188.8.2' => true,'213.188.8.4' => true,'213.188.8.76' => true,'216.35.112.141' => true,'216.35.112.142' => true,'216.35.112.143' => true,'216.35.112.50' => true,'216.35.112.51' => true,'62.41.154' => true,'64.41.254.23' => true,'64.41.254.24' => true,'64.41.254.25' => true,'66.77.73' => true,'66.77.74' => true,'70.42.51.10' => true,'68.94.95.150' => true,'69.148.183.12' => true,'69.150.87.183' => true,'69.152.88.32' => true,'69.154.219.28' => true,'69.155.4.253' => true,'192.41.15.30' => true,'64.29.182.10' => true,'207.86.79.6' => true,'207.86.79.12' => true,'207.153.57.51' => true,'193.7.255.21' => true,'193.7.255.33' => true,'193.7.255.90' => true,'193.7.255.121' => true,'193.7.255.122' => true,'193.7.255.130' => true,'193.7.255.142' => true,'193.7.255.22' => true,'193.7.255.241' => true,'193.7.255.242' => true,'193.7.255.244' => true,'63.121.41.166' => true,'63.121.41.172' => true,'63.121.41.173' => true,'63.121.41.174' => true,'63.121.41.176' => true,'63.121.41.177' => true,'208.131.25.166' => true,'208.131.25.167' => true,'208.131.25.169' => true,'198.173.35.169' => true,'198.173.35.170' => true,'198.173.35.171' => true,'63.121.41.175' => true,'131.155.70.189' => true,'195.190.21.70' => true,'84.13.2.175' => true,'84.13.26.47' => true,'84.13.56.131' => true,'89.240.138.167' => true,'132.218.30.216' => true,'63.203.65.217' => true,'205.179.93.2' => true,'205.179.93.66' => true,'151.196.224.70' => true,'209.176.27.63' => true,'64.208.104.2' => true,'203.21.15.10' => true,'208.131.25.6' => true,'216.206.178.81' => true,'216.206.178.83' => true,'216.206.178.85' => true,'208.131.25.168' => true,'63.121.41.178' => true,'63.121.41.179' => true,'194.46.8.25' => true,'64.5.245.10' => true,'64.5.245.11' => true,'64.5.245.23' => true,'64.5.245.24' => true,'64.5.245.25' => true,'64.5.245.26' => true,'64.5.245.27' => true,'64.5.245.28' => true,'64.5.245.29' => true,'64.5.245.50' => true,'216.127.80.23' => true,'65.254.33.130' => true,'66.194.55.242' => true,'66.195.77.130' => true,'64.224.197.99' => true,'202.229.31.13' => true,'202.229.31.14' => true,'202.229.31.15' => true,'210.150.10.100' => true,'210.150.10.73' => true,'210.150.25.156' => true,'210.165.39.216' => true,'210.165.39.217' => true,'210.165.39.244' => true,'210.165.39.245' => true,'210.165.39.246' => true,'210.165.39.247' => true,'210.165.39.248' => true,'210.165.39.249' => true,'210.165.39.250' => true,'210.165.39.252' => true,'210.165.39.253' => true,'210.165.39.254' => true,'210.173.179.22' => true,'210.173.179.26' => true,'210.173.179.30' => true,'210.173.179.31' => true,'210.173.179.32' => true,'210.173.179.33' => true,'210.173.179.37' => true,'210.173.179.40' => true,'210.173.179.45' => true,'210.173.179.47' => true,'210.173.179.50' => true,'210.173.179.53' => true,'210.173.179.82' => true,'210.173.179.83' => true,'210.173.179.149' => true,'210.173.180.157' => true,'210.173.180.160' => true,'210.173.180.168' => true,'210.173.180.192' => true,'216.181.122.11' => true,'216.181.122.110' => true,'212.125.68.30' => true,'206.30.142.100' => true,'193.62.81.96' => true,'64.246.15.61' => true,'192.41.170.17' => true,'208.232.223.80' => true,'216.55.4.15' => true,'24.1.248.148' => true,'69.16.227.165' => true,'209.1.12.2' => true,'209.1.12.220' => true,'209.1.12.221' => true,'209.1.12.222' => true,'209.1.12.224' => true,'209.1.12.225' => true,'209.1.12.226' => true,'209.1.12.227' => true,'209.1.12.228' => true,'209.1.12.229' => true,'209.1.12.230' => true,'209.1.12.231' => true,'209.1.12.232' => true,'209.1.12.233' => true,'209.1.12.234' => true,'209.1.12.235' => true,'209.1.12.236' => true,'209.1.12.237' => true,'209.1.12.238' => true,'209.1.12.239' => true,'209.1.12.240' => true,'209.1.12.241' => true,'209.1.12.242' => true,'204.62.132.20' => true,'209.75.193.22' => true,'209.114.176.250' => true,'65.111.164.143' => true,'65.111.168.41' => true,'204.146.80.99' => true,'204.146.81.99' => true,'209.239.36.253' => true,'205.188.147.53' => true,'205.188.147.56' => true,'205.188.252.121' => true,'212.123.67.70' => true,'193.120.253.2' => true,'209.208.197.115' => true,'62.69.162.144' => true,'62.69.162.171' => true,'62.69.162.177' => true,'213.244.181.190' => true,'212.72.39.2' => true,'194.134.109.3' => true,'194.134.109.7' => true,'194.134.109.17' => true,'194.134.109.21' => true,'212.72.39.8' => true,'212.72.39.3' => true,'212.72.39.4' => true,'212.72.39.5' => true,'212.72.39.6' => true,'212.72.39.7' => true,'212.72.39.9' => true,'212.72.39.10' => true,'212.72.39.11' => true,'212.72.39.12' => true,'212.72.39.13' => true,'212.72.39.14' => true,'212.72.39.15' => true,'212.72.39.16' => true,'212.72.39.17' => true,'212.72.39.18' => true,'212.72.39.19' => true,'212.72.39.20' => true,'212.72.39.21' => true,'212.72.39.22' => true,'212.72.39.23' => true,'212.72.39.24' => true,'212.72.39.27' => true,'212.72.39.28' => true,'212.72.39.29' => true,'212.72.39.30' => true,'212.72.39.194' => true,'212.72.39.195' => true,'212.72.39.196' => true,'212.72.39.197' => true,'212.72.39.198' => true,'212.72.39.199' => true,'212.72.39.200' => true,'212.72.39.201' => true,'212.72.39.202' => true,'212.72.39.203' => true,'212.72.39.204' => true,'212.72.39.205' => true,'212.72.39.206' => true,'212.72.39.207' => true,'212.72.39.208' => true,'212.72.39.209' => true,'212.72.39.210' => true,'212.72.39.211' => true,'212.72.39.212' => true,'212.72.39.213' => true,'212.72.39.214' => true,'212.72.39.215' => true,'212.72.39.216' => true,'212.72.39.217' => true,'212.72.39.218' => true,'212.72.39.219' => true,'212.72.39.220' => true,'212.72.39.221' => true,'213.215.201.204' => true,'213.215.201.205' => true,'213.215.201.221' => true,'213.215.201.222' => true,'213.215.201.234' => true,'213.215.201.235' => true,'195.27.115.51' => true,'212.72.181.12' => true,'165.254.215.60' => true,'165.254.215.61' => true,'165.254.215.62' => true,'165.254.215.63' => true,'129.170.24.57' => true,'128.255.244.88' => true,'80.67.17.98' => true,'195.57.152.80' => true,'209.133.111.132' => true,'216.200.196.8' => true,'216.200.196.9' => true,'216.200.196.10' => true,'216.200.196.11' => true,'216.200.196.12' => true,'216.200.196.13' => true,'216.200.196.14' => true,'216.200.196.15' => true,'194.232.15.65' => true,'85.10.36.125' => true,'133.194.226.226' => true,'193.195.19.10' => true,'207.82.104.100' => true,'66.240.140.190' => true,'216.33.59.61' => true,'208.239.240.102' => true,'66.28.139.66' => true,'66.28.139.71' => true,'195.226.160.249' => true,'216.234.161.144' => true,'195.211.11.50' => true,'216.148.213.150' => true,'212.112.128.30' => true,'139.153.13.200' => true,'195.113.214.196' => true,'195.113.214.204' => true,'195.113.214.207' => true,'195.122.204.2' => true,'195.122.208.217' => true,'212.47.13.201' => true,'212.71.128.66' => true,'212.71.128.67' => true,'195.210.57.83' => true,'216.33.119.136' => true,'216.33.119.138' => true,'38.170.72.194' => true,'207.81.156.97' => true,'24.57.2.49' => true,'24.57.5.63' => true,'24.57.8.78' => true,'24.57.240.53' => true,'24.235.212.163' => true,'151.189.12.140' => true,'38.113.234.180' => true,'38.113.234.181' => true,'66.90.81.41' => true,'66.227.104.196' => true,'85.25.124.167' => true,'202.191.32.67' => true,'202.191.34.146' => true,'62.49.200.56' => true,'80.177.149.217' => true,'216.52.252.195' => true,'216.52.252.208' => true,'63.251.210.65' => true,'64.40.105.197' => true,'206.191.13.2' => true,'206.191.13.3' => true,'209.87.232.5' => true,'12.199.64.41' => true,'12.199.64.69' => true,'209.177.62.135' => true,'209.177.62.151' => true,'# UA "MARTINI"' => true,'207.138.42.212' => true,'64.241.242.160' => true,'64.241.242.18' => true,'64.241.242.34' => true,'195.20.224.66' => true,'195.153.48.120' => true,'216.94.9.119' => true,'195.44.0.150' => true,'195.44.0.104' => true,'195.44.0.152' => true,'195.44.0.153' => true,'207.158.203.71' => true,'66.219.58.34' => true,'66.219.58.41' => true,'66.219.58.42' => true,'66.219.58.43' => true,'66.219.58.44' => true,'66.219.58.45' => true,'71.41.201.34' => true,'71.41.201.35' => true,'71.41.201.36' => true,'71.41.201.37' => true,'71.41.201.38' => true,'130.75.2.24' => true,'130.75.6.10' => true,'213.203.245.153' => true,'213.203.245.158' => true,'194.202.39.44' => true,'212.56.39.2' => true,'217.154.244.217' => true,'217.154.244.228' => true,'217.154.244.229' => true,'217.154.244.230' => true,'217.154.244.231' => true,'217.154.244.232' => true,'217.154.244.233' => true,'217.154.244.234' => true,'217.154.244.235' => true,'217.154.244.239' => true,'217.154.244.240' => true,'217.154.244.241' => true,'217.154.245.2' => true,'217.154.245.201' => true,'217.154.245.202' => true,'217.154.245.203' => true,'217.154.245.204' => true,'217.154.245.205' => true,'217.154.245.207' => true,'217.154.245.209' => true,'217.154.245.210' => true,'217.154.245.211' => true,'217.154.245.212' => true,'217.154.245.213' => true,'217.154.245.214' => true,'217.154.245.215' => true,'217.154.245.216' => true,'217.154.245.217' => true,'217.154.245.218' => true,'217.154.245.219' => true,'217.154.245.220' => true,'217.154.245.224' => true,'217.154.245.225' => true,'217.154.245.226' => true,'217.154.245.227' => true,'217.154.245.228' => true,'217.154.245.229' => true,'217.154.245.230' => true,'217.154.245.232' => true,'217.154.245.233' => true,'217.154.245.234' => true,'217.154.245.236' => true,'217.154.245.237' => true,'217.154.245.238' => true,'217.154.245.239' => true,'217.154.245.240' => true,'217.154.245.241' => true,'217.154.245.242' => true,'217.154.245.244' => true,'217.154.245.245' => true,'217.154.245.246' => true,'217.154.245.248' => true,'217.154.245.249' => true,'217.154.244.251' => true,'217.154.245.250' => true,'217.154.245.251' => true,'217.205.60' => true,'217.205.61' => true,'195.200.163.250' => true,'195.200.169.193' => true,'67.18.55.52' => true,'198.31.135.245' => true,'217.155.205.49' => true,'217.42.129.249' => true,'217.42.133.84' => true,'81.149.13.26' => true,'81.154.83.118' => true,'81.155.214.30' => true,'83.67.53.154' => true,'213.41.71.18' => true,'131.107.0' => true,'131.107.137.165' => true,'131.107.137.166' => true,'131.107.137.37' => true,'131.107.137.47' => true,'131.107.163.47' => true,'131.107.163.48' => true,'131.107.163.49' => true,'131.107.163.57' => true,'131.107.163.58' => true,'131.107.76.139' => true,'157.55.33.251' => true,'157.55.33.38' => true,'157.55.34.27' => true,'202.96.51.137' => true,'202.96.51.144' => true,'202.96.51.145' => true,'202.96.51.147' => true,'202.96.51.148' => true,'202.96.51.149' => true,'202.96.51.150' => true,'202.96.51.151' => true,'202.96.51.152' => true,'202.96.51.153' => true,'202.96.51.154' => true,'202.96.51.155' => true,'202.96.51.156' => true,'202.96.51.157' => true,'202.96.51.158' => true,'202.96.51.159' => true,'202.96.51.162' => true,'202.96.51.172' => true,'204.4.80.10' => true,'204.95.98.251' => true,'204.95.98.252' => true,'204.95.98.253' => true,'207.46.238.133' => true,'207.46.238.137' => true,'207.46.238.138' => true,'207.46.238.143' => true,'207.46.71.12' => true,'207.46.71.16' => true,'207.46.89.16' => true,'207.46.89.17' => true,'207.46.98' => true,'207.68.146' => true,'207.68.154' => true,'207.68.157' => true,'207.68.188.241' => true,'207.68.188.242' => true,'207.68.188.243' => true,'207.68.188.244' => true,'213.199.128.156' => true,'219.142.53.16' => true,'219.142.53.17' => true,'219.142.53.18' => true,'219.142.53.19' => true,'219.142.53.20' => true,'219.142.53.21' => true,'219.142.53.22' => true,'219.142.53.23' => true,'219.142.53.24' => true,'219.142.53.25' => true,'219.142.53.26' => true,'219.142.53.27' => true,'219.142.53.28' => true,'219.142.53.29' => true,'219.142.53.30' => true,'63.194.155.144' => true,'63.194.155.145' => true,'63.194.155.146' => true,'63.194.155.147' => true,'63.194.155.148' => true,'63.194.155.149' => true,'63.194.155.150' => true,'63.194.155.151' => true,'64.4.8' => true,'65.54.112.146' => true,'65.54.164.100' => true,'65.54.164.101' => true,'65.54.164.102' => true,'65.54.164.103' => true,'65.54.164.104' => true,'65.54.164.105' => true,'65.54.164.106' => true,'65.54.164.107' => true,'65.54.164.108' => true,'65.54.164.109' => true,'65.54.164.110' => true,'65.54.164.111' => true,'65.54.164.112' => true,'65.54.164.113' => true,'65.54.164.114' => true,'65.54.164.115' => true,'65.54.164.116' => true,'65.54.164.117' => true,'65.54.164.118' => true,'65.54.164.119' => true,'65.54.164.120' => true,'65.54.164.121' => true,'65.54.164.122' => true,'65.54.164.123' => true,'65.54.164.124' => true,'65.54.164.125' => true,'65.54.164.126' => true,'65.54.164.127' => true,'65.54.164.128' => true,'65.54.164.129' => true,'65.54.164.130' => true,'65.54.164.131' => true,'65.54.164.132' => true,'65.54.164.133' => true,'65.54.164.134' => true,'65.54.164.135' => true,'65.54.164.34' => true,'65.54.164.35' => true,'65.54.164.36' => true,'65.54.164.37' => true,'65.54.164.38' => true,'65.54.164.39' => true,'65.54.164.40' => true,'65.54.164.41' => true,'65.54.164.42' => true,'65.54.164.43' => true,'65.54.164.44' => true,'65.54.164.45' => true,'65.54.164.46' => true,'65.54.164.47' => true,'65.54.164.48' => true,'65.54.164.49' => true,'65.54.164.50' => true,'65.54.164.51' => true,'65.54.164.52' => true,'65.54.164.53' => true,'65.54.164.54' => true,'65.54.164.55' => true,'65.54.164.56' => true,'65.54.164.57' => true,'65.54.164.58' => true,'65.54.164.59' => true,'65.54.164.60' => true,'65.54.164.61' => true,'65.54.164.62' => true,'65.54.164.63' => true,'65.54.164.64' => true,'65.54.164.65' => true,'65.54.164.66' => true,'65.54.164.67' => true,'65.54.164.68' => true,'65.54.164.69' => true,'65.54.164.70' => true,'65.54.164.71' => true,'65.54.164.72' => true,'65.54.164.73' => true,'65.54.164.74' => true,'65.54.164.75' => true,'65.54.164.76' => true,'65.54.164.77' => true,'65.54.164.78' => true,'65.54.164.79' => true,'65.54.164.80' => true,'65.54.164.81' => true,'65.54.164.82' => true,'65.54.164.83' => true,'65.54.164.84' => true,'65.54.164.85' => true,'65.54.164.86' => true,'65.54.164.87' => true,'65.54.164.88' => true,'65.54.164.89' => true,'65.54.164.90' => true,'65.54.164.91' => true,'65.54.164.92' => true,'65.54.164.93' => true,'65.54.164.94' => true,'65.54.164.95' => true,'65.54.164.96' => true,'65.54.164.97' => true,'65.54.164.98' => true,'65.54.164.99' => true,'65.54.165' => true,'65.54.188' => true,'65.54.189' => true,'65.54.236.87' => true,'65.54.236.88' => true,'65.54.236.90' => true,'65.55.0' => true,'65.55.1' => true,'65.55.10' => true,'65.55.100' => true,'65.55.101' => true,'65.55.102' => true,'65.55.103' => true,'65.55.104' => true,'65.55.105' => true,'65.55.106' => true,'65.55.107' => true,'65.55.108' => true,'65.55.109' => true,'65.55.11' => true,'65.55.110' => true,'65.55.111' => true,'65.55.112' => true,'65.55.113' => true,'65.55.114' => true,'65.55.115' => true,'65.55.116' => true,'65.55.117' => true,'65.55.118' => true,'65.55.119' => true,'65.55.12' => true,'65.55.120' => true,'65.55.121' => true,'65.55.122' => true,'65.55.123' => true,'65.55.124' => true,'65.55.125' => true,'65.55.126' => true,'65.55.127' => true,'65.55.128' => true,'65.55.129' => true,'65.55.13' => true,'65.55.130' => true,'65.55.131' => true,'65.55.132' => true,'65.55.133' => true,'65.55.134' => true,'65.55.135' => true,'65.55.136' => true,'65.55.137' => true,'65.55.138' => true,'65.55.139' => true,'65.55.14' => true,'65.55.140' => true,'65.55.141' => true,'65.55.142' => true,'65.55.143' => true,'65.55.144' => true,'65.55.145' => true,'65.55.146' => true,'65.55.147' => true,'65.55.148' => true,'65.55.149' => true,'65.55.15' => true,'65.55.150' => true,'65.55.151' => true,'65.55.152' => true,'65.55.153' => true,'65.55.154' => true,'65.55.155' => true,'65.55.156' => true,'65.55.157' => true,'65.55.158' => true,'65.55.159' => true,'65.55.16' => true,'65.55.160' => true,'65.55.161' => true,'65.55.162' => true,'65.55.163' => true,'65.55.164' => true,'65.55.165' => true,'65.55.166' => true,'65.55.167' => true,'65.55.168' => true,'65.55.169' => true,'65.55.17' => true,'65.55.170' => true,'65.55.171' => true,'65.55.172' => true,'65.55.173' => true,'65.55.174' => true,'65.55.175' => true,'65.55.176' => true,'65.55.177' => true,'65.55.178' => true,'65.55.179' => true,'65.55.18' => true,'65.55.180' => true,'65.55.181' => true,'65.55.182' => true,'65.55.183' => true,'65.55.184' => true,'65.55.185' => true,'65.55.186' => true,'65.55.187' => true,'65.55.188' => true,'65.55.189' => true,'65.55.19' => true,'65.55.190' => true,'65.55.191' => true,'65.55.192' => true,'65.55.193' => true,'65.55.194' => true,'65.55.195' => true,'65.55.196' => true,'65.55.197' => true,'65.55.198' => true,'65.55.199' => true,'65.55.2' => true,'65.55.20' => true,'65.55.200' => true,'65.55.201' => true,'65.55.202' => true,'65.55.203' => true,'65.55.204' => true,'65.55.205' => true,'65.55.206' => true,'65.55.207' => true,'65.55.208' => true,'65.55.209' => true,'65.55.21' => true,'65.55.210' => true,'65.55.211' => true,'65.55.212' => true,'65.55.213' => true,'65.55.214' => true,'65.55.215' => true,'65.55.216' => true,'65.55.217' => true,'65.55.217.53' => true,'65.55.217.54' => true,'65.55.217.55' => true,'65.55.217.56' => true,'65.55.217.57' => true,'65.55.218' => true,'65.55.219' => true,'65.55.22' => true,'65.55.220' => true,'65.55.221' => true,'65.55.222' => true,'65.55.223' => true,'65.55.224' => true,'65.55.225' => true,'65.55.226' => true,'65.55.227' => true,'65.55.228' => true,'65.55.229' => true,'65.55.23' => true,'65.55.230' => true,'65.55.231' => true,'65.55.232' => true,'65.55.233' => true,'65.55.234' => true,'65.55.235' => true,'65.55.236' => true,'65.55.237' => true,'65.55.238' => true,'65.55.239' => true,'65.55.24' => true,'65.55.240' => true,'65.55.241' => true,'65.55.242' => true,'65.55.243' => true,'65.55.244' => true,'65.55.245' => true,'65.55.246' => true,'65.55.247' => true,'65.55.248' => true,'65.55.249' => true,'65.55.25' => true,'65.55.250' => true,'65.55.251' => true,'65.55.252' => true,'65.55.253' => true,'65.55.254' => true,'65.55.255' => true,'65.55.26' => true,'65.55.27' => true,'65.55.28' => true,'65.55.29' => true,'65.55.3' => true,'65.55.30' => true,'65.55.31' => true,'65.55.32' => true,'65.55.33' => true,'65.55.34' => true,'65.55.35' => true,'65.55.36' => true,'65.55.37' => true,'65.55.38' => true,'65.55.39' => true,'65.55.4' => true,'65.55.40' => true,'65.55.41' => true,'65.55.42' => true,'65.55.43' => true,'65.55.44' => true,'65.55.45' => true,'65.55.46' => true,'65.55.47' => true,'65.55.48' => true,'65.55.49' => true,'65.55.5' => true,'65.55.50' => true,'65.55.51' => true,'65.55.52' => true,'65.55.53' => true,'65.55.54' => true,'65.55.55' => true,'65.55.56' => true,'65.55.57' => true,'65.55.58' => true,'65.55.59' => true,'65.55.6' => true,'65.55.60' => true,'65.55.61' => true,'65.55.62' => true,'65.55.63' => true,'65.55.64' => true,'65.55.65' => true,'65.55.66' => true,'65.55.67' => true,'65.55.68' => true,'65.55.69' => true,'65.55.7' => true,'65.55.70' => true,'65.55.71' => true,'65.55.72' => true,'65.55.73' => true,'65.55.74' => true,'65.55.75' => true,'65.55.76' => true,'65.55.77' => true,'65.55.78' => true,'65.55.79' => true,'65.55.8' => true,'65.55.80' => true,'65.55.81' => true,'65.55.82' => true,'65.55.83' => true,'65.55.84' => true,'65.55.85' => true,'65.55.86' => true,'65.55.87' => true,'65.55.88' => true,'65.55.89' => true,'65.55.9' => true,'65.55.90' => true,'65.55.91' => true,'65.55.92' => true,'65.55.93' => true,'65.55.94' => true,'65.55.95' => true,'65.55.96' => true,'65.55.97' => true,'65.55.98' => true,'65.55.99' => true,'68.55.252' => true,'24.42.211.66' => true,'194.221.102.137' => true,'66.27.55.14' => true,'209.116.58.140' => true,'199.184.188.143' => true,'199.184.188.151' => true,'199.184.188.160' => true,'204.210.31.231' => true,'209.116.58.143' => true,'209.191.102.228' => true,'61.247.217.34' => true,'61.247.217.41' => true,'61.247.217.42' => true,'61.247.221.43' => true,'61.247.221.44' => true,'61.247.221.45' => true,'61.247.221.87' => true,'61.247.221.92' => true,'61.247.222.53' => true,'61.247.222.55' => true,'61.78.61.162' => true,'61.78.61.163' => true,'61.78.61.164' => true,'61.78.61.165' => true,'61.78.61.166' => true,'61.78.61.167' => true,'61.78.61.168' => true,'61.78.61.176' => true,'61.78.61.192' => true,'61.78.61.193' => true,'61.78.61.194' => true,'61.78.61.195' => true,'61.78.61.206' => true,'61.78.61.220' => true,'61.78.61.221' => true,'61.78.61.222' => true,'61.78.61.223' => true,'114.111.36.26' => true,'202.179.180.43' => true,'202.179.180.45' => true,'202.179.180.53' => true,'202.179.180.54' => true,'202.179.181.137' => true,'202.179.181.138' => true,'218.23.2.122' => true,'218.145.25.11' => true,'218.145.25.14' => true,'218.145.25.17' => true,'218.145.25.19' => true,'218.145.25.20' => true,'218.145.25.43' => true,'218.145.25.45' => true,'218.145.25.46' => true,'218.145.25.49' => true,'218.145.25.51' => true,'218.145.25.53' => true,'218.145.25.52' => true,'218.145.25.78' => true,'218.145.25.83' => true,'218.145.25.105' => true,'218.145.25.109' => true,'218.145.25.110' => true,'218.145.25.111' => true,'218.145.25.113' => true,'220.73.146.105' => true,'220.73.146.106' => true,'220.73.146.107' => true,'220.73.146.108' => true,'220.73.159.54' => true,'220.73.159.55' => true,'220.73.159.56' => true,'220.73.159.57' => true,'220.73.159.58' => true,'220.73.159.59' => true,'220.73.159.60' => true,'220.73.159.61' => true,'220.73.159.62' => true,'220.73.159.63' => true,'220.73.165.11' => true,'220.73.165.12' => true,'220.73.165.14' => true,'220.73.165.15' => true,'220.73.165.17' => true,'220.73.165.77' => true,'220.73.165.142' => true,'220.73.165.143' => true,'220.73.165.204' => true,'220.73.165.206' => true,'220.95.235.166' => true,'222.122.194.111' => true,'222.122.194.112' => true,'222.122.194.114' => true,'222.122.194.115' => true,'222.122.194.164' => true,'222.122.194.27' => true,'222.122.194.31' => true,'222.122.194.33' => true,'222.122.194.35' => true,'222.122.194.41' => true,'222.122.194.47' => true,'222.122.194.53' => true,'222.122.194.75' => true,'194.231.30.16' => true,'195.188.192.23' => true,'208.222.98.150' => true,'199.35.98.30' => true,'199.35.98.241' => true,'150.59.20.63' => true,'150.59.20.20' => true,'216.71.78.11' => true,'69.9.167.198' => true,'84.56.103.71' => true,'84.56.114.19' => true,'84.56.74.242' => true,'84.56.77.39' => true,'84.56.84.58' => true,'84.56.93.33' => true,'212.63.155.1' => true,'67.18.222.18' => true,'129.110.16.16' => true,'129.110.10.1' => true,'69.64.69.73' => true,'194.224.199.47' => true,'194.224.199.50' => true,'194.224.199.52' => true,'210.165.39.210' => true,'210.165.39.211' => true,'210.165.39.212' => true,'210.165.39.213' => true,'210.165.39.214' => true,'210.165.39.215' => true,'82.32.121.70' => true,'82.32.121.164' => true,'82.32.123.249' => true,'82.33.193.111' => true,'82.68.206.22' => true,'84.9.137.104' => true,'208.53.131.158' => true,'130.235.86.136' => true,'130.235.86.137' => true,'202.36.240.1' => true,'194.221.132.133' => true,'68.88.244.177' => true,'68.88.244.178' => true,'69.150.7.163' => true,'69.150.7.164' => true,'69.150.7.165' => true,'128.95.1.184' => true,'128.95.1.208' => true,'128.95.1.84' => true,'64.62.175.130' => true,'64.62.175.131' => true,'64.62.175.137' => true,'64.71.131.109' => true,'64.71.131.117' => true,'64.127.124.130' => true,'64.127.124.131' => true,'64.127.124.132' => true,'64.127.124.133' => true,'64.127.124.139' => true,'64.127.124.143' => true,'64.127.124.145' => true,'64.127.124.148' => true,'64.127.124.153' => true,'64.127.124.157' => true,'64.127.124.158' => true,'64.127.124.159' => true,'64.127.124.165' => true,'64.127.124.168' => true,'64.127.124.169' => true,'64.127.124.170' => true,'64.127.124.171' => true,'64.127.124.172' => true,'64.127.124.173' => true,'64.127.124.188' => true,'64.127.124.189' => true,'64.127.124.190' => true,'64.127.124.191' => true,'64.127.124.193' => true,'65.19.150.134' => true,'65.19.150.204' => true,'65.19.150.206' => true,'65.19.150.207' => true,'65.19.150.208' => true,'65.19.150.209' => true,'65.19.150.210' => true,'65.19.150.211' => true,'65.19.150.212' => true,'65.19.150.213' => true,'65.19.150.214' => true,'65.19.150.217' => true,'65.19.150.218' => true,'65.19.150.219' => true,'65.19.150.220' => true,'65.19.150.221' => true,'65.19.150.222' => true,'65.19.150.223' => true,'65.19.150.224' => true,'65.19.150.225' => true,'65.19.150.226' => true,'65.19.150.227' => true,'65.19.150.228' => true,'65.19.150.229' => true,'65.19.150.230' => true,'65.19.150.231' => true,'65.19.150.232' => true,'65.19.150.233' => true,'65.19.150.234' => true,'65.19.150.235' => true,'65.19.150.236' => true,'65.19.150.237' => true,'65.19.150.238' => true,'65.19.150.239' => true,'65.19.150.240' => true,'65.19.150.241' => true,'65.19.150.242' => true,'65.19.150.243' => true,'65.19.150.244' => true,'65.19.150.245' => true,'65.19.150.246' => true,'65.19.150.247' => true,'65.19.150.248' => true,'65.19.150.249' => true,'65.19.150.250' => true,'65.19.150.251' => true,'65.19.150.252' => true,'65.19.169.228' => true,'65.19.169.229' => true,'65.19.169.230' => true,'65.19.169.242' => true,'65.19.169.252' => true,'65.19.169.254' => true,'213.180.128.151' => true,'213.180.128.152' => true,'213.180.128.153' => true,'213.180.128.154' => true,'213.180.137.71' => true,'195.20.225.123' => true,'212.227.109.241' => true,'195.20.225.112' => true,'195.20.225.115' => true,'212.227.109.14' => true,'212.227.109.57' => true,'212.227.109.58' => true,'212.227.109.197' => true,'212.227.109.225' => true,'212.227.109.229' => true,'212.227.118.9' => true,'212.227.118.25' => true,'212.227.118.130' => true,'212.227.119.5' => true,'64.23.82.44' => true,'140.123.100.5' => true,'140.123.101.14' => true,'140.123.101.143' => true,'140.123.101.144' => true,'140.123.101.145' => true,'140.123.101.146' => true,'140.123.101.147' => true,'140.123.101.148' => true,'140.123.101.62' => true,'140.123.101.66' => true,'140.123.101.67' => true,'140.123.103.2' => true,'140.123.103.244' => true,'140.123.103.4' => true,'202.165.96.139' => true,'202.165.96.140' => true,'202.165.96.167' => true,'202.165.96.173' => true,'205.158.61.194' => true,'205.158.61.197' => true,'205.158.61.198' => true,'205.158.61.200' => true,'205.158.61.201' => true,'205.158.61.202' => true,'205.158.61.207' => true,'209.133.111.56' => true,'209.133.111.57' => true,'209.133.111.58' => true,'210.201.54.203' => true,'210.201.54.207' => true,'210.201.54.209' => true,'210.201.54.214' => true,'210.201.54.216' => true,'210.201.54.218' => true,'210.59.144.148' => true,'210.59.144.149' => true,'211.155.160.12' => true,'211.155.160.2' => true,'211.155.160.5' => true,'211.72.252.147' => true,'211.72.252.150' => true,'211.72.252.182' => true,'211.72.252.242' => true,'211.72.252.243' => true,'211.72.252.49' => true,'212.98.78.29' => true,'216.250.80.67' => true,'220.135.237.66' => true,'220.135.254.94' => true,'221.169.30.130' => true,'61.59.121.2' => true,'64.208.8.196' => true,'64.62.168.160' => true,'64.62.168.173' => true,'66.234.139.204' => true,'66.234.139.205' => true,'66.234.139.206' => true,'66.234.139.207' => true,'66.234.139.208' => true,'66.234.139.209' => true,'66.234.139.212' => true,'66.234.139.213' => true,'66.234.139.214' => true,'66.234.139.215' => true,'66.234.139.216' => true,'66.234.139.218' => true,'66.237.60' => true,'66.7.131.130' => true,'66.7.131.131' => true,'66.7.131.132' => true,'66.7.131.133' => true,'66.7.131.134' => true,'66.7.131.135' => true,'66.7.131.136' => true,'66.7.131.137' => true,'66.7.131.138' => true,'66.7.131.139' => true,'66.7.131.140' => true,'66.7.131.141' => true,'66.7.131.142' => true,'66.7.131.143' => true,'66.7.131.144' => true,'66.7.131.145' => true,'66.7.131.146' => true,'66.7.131.147' => true,'66.7.131.148' => true,'66.7.131.149' => true,'66.7.131.150' => true,'66.7.131.151' => true,'66.7.131.152' => true,'66.7.131.153' => true,'66.7.131.154' => true,'66.7.131.155' => true,'66.7.131.156' => true,'66.7.131.157' => true,'66.7.131.158' => true,'66.7.131.159' => true,'66.7.131.160' => true,'66.7.131.161' => true,'66.7.131.162' => true,'66.7.131.163' => true,'66.7.131.164' => true,'66.7.131.165' => true,'204.138.115.2' => true,'213.239.197.150' => true,'213.239.206.109' => true,'213.215.133.19' => true,'212.69.208.31' => true,'213.242.179.43' => true,'217.75.104.23' => true,'217.75.104.26' => true,'217.212.224.141' => true,'217.212.224.142' => true,'217.212.224.143' => true,'217.212.224.144' => true,'217.212.224.145' => true,'217.212.224.146' => true,'217.212.224.147' => true,'217.212.224.148' => true,'217.212.224.149' => true,'217.212.224.159' => true,'217.212.224.162' => true,'217.212.224.164' => true,'217.212.224.165' => true,'217.212.224.168' => true,'217.212.224.177' => true,'217.212.224.178' => true,'62.119.21.136' => true,'62.119.21.132' => true,'62.119.21.135' => true,'62.119.21.137' => true,'62.119.21.138' => true,'62.119.21.139' => true,'62.119.21.150' => true,'62.119.21.157' => true,'62.119.133.11' => true,'62.119.133.12' => true,'62.119.133.13' => true,'62.119.133.14' => true,'63.223.65.253' => true,'83.140.161.141' => true,'83.140.161.142' => true,'128.109.136.132' => true,'195.120.233.1' => true,'209.116.70.46' => true,'24.106.39.250' => true,'161.58.207.17' => true,'216.218.130.79' => true,'216.218.155.2' => true,'216.218.197.2' => true,'207.87.8.78' => true,'207.87.10.33' => true,'212.27.33.160' => true,'212.27.33.161' => true,'212.27.33.162' => true,'212.27.33.163' => true,'212.27.33.164' => true,'212.27.33.165' => true,'212.27.33.166' => true,'212.27.33.167' => true,'212.27.33.168' => true,'212.27.33.169' => true,'212.27.41.11' => true,'212.27.41.14' => true,'212.27.41.22' => true,'212.27.41.23' => true,'212.27.41.24' => true,'212.27.41.25' => true,'212.27.41.26' => true,'212.27.41.30' => true,'212.27.41.31' => true,'212.27.41.33' => true,'212.27.41.34' => true,'212.27.41.35' => true,'212.27.41.36' => true,'212.27.41.37' => true,'212.27.41.38' => true,'212.27.41.39' => true,'212.27.41.40' => true,'212.27.41.41' => true,'195.186.149.91' => true,'209.10.169.15' => true,'209.10.169.16' => true,'209.10.169.17' => true,'209.20.44.236' => true,'67.18.87.100' => true,'209.203.226.174' => true,'193.12.151.201' => true,'154.15.28.143' => true,'69.225.183.82' => true,'212.78.64.35' => true,'217.158.17.25' => true,'80.60.157.168' => true,'84.82.133.41' => true,'69.28.130.222' => true,'69.28.130.229' => true,'69.28.130.230' => true,'69.28.130.231' => true,'216.104.145.71' => true,'81.19.66.9' => true,'81.19.66.6' => true,'81.19.66.39' => true,'81.176.67.106' => true,'81.19.66.8' => true,'81.19.67.34' => true,'81.19.66.42' => true,'81.19.66.38' => true,'81.222.64.10' => true,'81.19.66.74' => true,'81.19.67.253' => true,'81.19.67.247' => true,'203.87.123.139' => true,'63.251.238.8' => true,'216.86.229.85' => true,'216.86.229.86' => true,'66.45.38.86' => true,'66.55.143.162' => true,'80.229.145.226' => true,'80.229.216.40' => true,'83.146.31.19' => true,'212.158.198.8' => true,'212.158.235.113' => true,'212.158.249.0' => true,'212.158.251.24' => true,'212.172.94.128' => true,'206.215.122.20' => true,'216.255.229.246' => true,'64.124.122.228' => true,'209.254.2.2' => true,'124.32.246.45' => true,'64.140.165.132' => true,'64.140.165.133' => true,'64.140.165.139' => true,'66.93.156.38' => true,'66.93.156.39' => true,'208.234.1.83' => true,'208.145.190.250' => true,'208.145.190.251' => true,'208.145.190.254' => true,'195.141.85.115' => true,'195.141.85.116' => true,'195.141.85.142' => true,'195.141.85.146' => true,'194.201.93.6' => true,'194.201.93.18' => true,'194.201.93.118' => true,'206.40.146.58' => true,'208.148.122.27' => true,'208.148.122.28' => true,'208.148.122.29' => true,'81.169.136.109' => true,'205.237.206.30' => true,'208.165.96.26' => true,'206.129.98.7' => true,'206.129.98.16' => true,'206.129.98.19' => true,'206.129.0.3' => true,'206.129.0.131' => true,'206.129.0.132' => true,'206.129.1.24' => true,'206.129.1.27' => true,'24.90.243.203' => true,'81.92.97.41' => true,'84.73.59.129' => true,'216.205.148.106' => true,'82.42.115.108' => true,'64.151.82.12' => true,'195.27.115.50' => true,'195.27.215.70' => true,'195.27.215.89' => true,'195.27.215.91' => true,'195.27.215.92' => true,'212.114.209.250' => true,'133.9.222.37' => true,'66.151.181.4' => true,'66.151.181.10' => true,'70.42.51.30' => true,'38.98.120.85' => true,'8.11.2.19' => true,'8.11.2.95' => true,'63.251.10.139' => true,'63.251.169.236' => true,'64.12.186.194' => true,'64.12.186.197' => true,'64.12.186.198' => true,'64.12.186.199' => true,'64.12.186.201' => true,'64.12.186.203' => true,'64.12.186.206' => true,'64.12.186.207' => true,'64.12.186.208' => true,'64.12.186.209' => true,'206.253.222.233' => true,'65.110.1.7' => true,'65.110.21.171' => true,'149.99.7.152' => true,'67.15.42.16' => true,'128.121.225.20' => true,'207.16.241' => true,'146.186.148.76' => true,'203.89.255.8' => true,'#07)"' => true,'220.181.61.231' => true,'220.181.61.234' => true,'220.181.125.13' => true,'61.135.130.77' => true,'61.135.130.78' => true,'61.135.130.79' => true,'61.135.130.80' => true,'61.135.130.100' => true,'61.135.131.118' => true,'61.135.131.125' => true,'61.135.131.128' => true,'61.135.131.163' => true,'61.135.131.166' => true,'61.135.131.171' => true,'61.135.131.173' => true,'61.135.131.174' => true,'61.135.131.207' => true,'61.135.131.209' => true,'61.135.131.214' => true,'61.135.131.230' => true,'61.135.131.233' => true,'61.135.131.235' => true,'61.135.131.237' => true,'61.135.131.238' => true,'220.181.19.103' => true,'220.181.19.164' => true,'220.181.19.171' => true,'220.181.19.177' => true,'220.181.19.65' => true,'220.181.19.87' => true,'220.181.26.102' => true,'220.181.26.106' => true,'220.181.26.111' => true,'220.181.26.113' => true,'220.181.26.121' => true,'220.181.26.73' => true,'220.181.26.74' => true,'194.197.68.46' => true,'58.61.164.140' => true,'194.97.8.162' => true,'194.97.8.163' => true,'192.109.251.26' => true,'194.221.132.56' => true,'194.221.132.139' => true,'128.211.213.117' => true,'207.44.130.81' => true,'207.44.142.84' => true,'209.150.128.145' => true,'216.71.84.57' => true,'216.71.84.212' => true,'216.71.187.134' => true,'38.100.225.3' => true,'38.100.225.4' => true,'38.100.225.5' => true,'38.100.225.6' => true,'38.100.225.7' => true,'38.100.225.8' => true,'38.100.225.9' => true,'38.100.225.10' => true,'38.100.225.11' => true,'38.100.225.12' => true,'38.100.225.13' => true,'38.100.225.14' => true,'38.100.225.15' => true,'38.100.225.16' => true,'38.100.225.17' => true,'38.100.225.18' => true,'38.100.225.19' => true,'38.100.225.20' => true,'38.100.225.21' => true,'38.100.225.22' => true,'38.100.225.23' => true,'38.100.225.24' => true,'38.100.225.25' => true,'38.100.225.26' => true,'198.147.135.13' => true,'165.121.1.77' => true,'165.121.2.77' => true,'198.185.1.224' => true,'194.231.30.15' => true,'209.203.234.4' => true,'207.77.90.17' => true,'66.163.18.197' => true,'66.177.183.22' => true,'195.20.227.67' => true,'69.141.14.141' => true,'162.33.251.50' => true,'207.8.212.162' => true,'207.8.212.163' => true,'66.28.248.146' => true,'81.208.26.55' => true,'62.181.185.37' => true,'62.181.185.44' => true,'193.218.115.6' => true,'193.218.115.7' => true,'193.218.115.8' => true,'193.218.115.81' => true,'193.218.115.254' => true,'194.181.35.5' => true,'194.181.35.6' => true,'213.134.142.22' => true,'213.134.142.50' => true,'217.160.254.242' => true,'212.97.42.229' => true,'209.128.80.131' => true,'209.128.80.133' => true,'209.128.80.136' => true,'24.6.176.192' => true,'63.251.4.43' => true,'198.49.220.81' => true,'206.183.1.74' => true,'207.218.150.79' => true,'208.51.0.20' => true,'208.51.0.74' => true,'208.51.0.79' => true,'195.130.233.22' => true,'195.130.233.30' => true,'195.130.233.60' => true,'161.53.120.3' => true,'212.185.44.13' => true,'81.152.64.189' => true,'194.151.1.60' => true,'146.82.72.23' => true,'146.82.72.24' => true,'132.239.50.245' => true,'81.27.96.248' => true,'81.27.99.141' => true,'217.151.96.52' => true,'195.137.7.76' => true,'213.177.232.41' => true,'38.119.96.100' => true,'38.119.96.103' => true,'38.119.96.107' => true,'38.119.96.110' => true,'38.119.96.114' => true,'38.119.96.115' => true,'38.119.96.116' => true,'38.119.96.117' => true,'38.119.96.118' => true,'38.119.96.119' => true,'38.119.96.120' => true,'38.119.96.121' => true,'209.67.119.9' => true,'133.9.215.72' => true,'133.9.215.87' => true,'202.83.221.219' => true,'210.17.245.180' => true,'210.17.245.191' => true,'193.172.236.108' => true,'193.172.237.17' => true,'193.172.236.114' => true,'193.172.237.16' => true,'193.172.236.8' => true,'128.2.206.215' => true,'72.249.60.74' => true,'193.252.118.101' => true,'193.252.118.102' => true,'193.252.118.188' => true,'193.252.118.190' => true,'193.252.121.229' => true,'193.252.148.208' => true,'193.252.148.209' => true,'193.252.148.51' => true,'193.252.149.20' => true,'195.101.94.80' => true,'195.101.94.81' => true,'195.101.94.15' => true,'195.101.94.101' => true,'195.101.94.166' => true,'195.101.94.208' => true,'195.101.94.209' => true,'209.185.188.207' => true,'216.35.76.11' => true,'81.52.143.15' => true,'81.52.143.16' => true,'64.95.2.212' => true,'216.104.145.2' => true,'216.104.145.160' => true,'212.127.141.18' => true,'212.58.162.42' => true,'212.58.162.78' => true,'212.58.169.133' => true,'212.58.169.181' => true,'213.73.161.41' => true,'213.73.177.37' => true,'213.73.197.30' => true,'213.73.210.224' => true,'213.73.211.74' => true,'213.73.211.172' => true,'213.10.10.117' => true,'213.10.10.118' => true,'80.60.35.143' => true,'81.205.39.64' => true,'82.217.42.23' => true,'84.104.216.167' => true,'84.104.217.36' => true,'84.104.217.38' => true,'84.104.39.226' => true,'199.182.120.206' => true,'193.136.20.2' => true,'193.136.20.250' => true,'198.3.99.101' => true,'206.191.49.69' => true,'194.45.170.120' => true,'65.105.223.11' => true,'61.139.65.222' => true,'144.214.122.55' => true,'66.180.173.42' => true,'62.75.193.84' => true,'203.51.46.83' => true,'203.51.44.181' => true,'217.73.164.106' => true,'62.96.181.197' => true,'212.111.41.2' => true,'212.111.41.33' => true,'212.111.41.34' => true,'212.111.41.35' => true,'212.111.41.36' => true,'212.111.41.52' => true,'212.111.41.53' => true,'212.111.41.151' => true,'212.111.41.154' => true,'212.111.41.153' => true,'212.111.41.152' => true,'212.135.14.4' => true,'82.43.129.240' => true,'202.139.99.130' => true,'202.139.99.131' => true,'210.8.18.66' => true,'203.9.252.2' => true,'67.67.130.238' => true,'209.69.255.132' => true,'209.69.255.131' => true,'209.69.255.160' => true,'63.173.190.2' => true,'63.173.190.16' => true,'63.173.190.30' => true,'63.173.190.152' => true,'63.225.238.7' => true,'63.225.238.11' => true,'216.250.143.106' => true,'216.250.143.102' => true,'208.1.109.130' => true,'63.140.184.187' => true,'192.41.47.46' => true,'209.19.244.162' => true,'63.140.184.168' => true,'63.140.184.171' => true,'63.140.184.172' => true,'205.230.7.23' => true,'207.178.193.51' => true,'194.109.125.201' => true,'212.19.205.147' => true,'64.241.243.123' => true,'64.241.242.177' => true,'64.241.243.65' => true,'64.241.243.124' => true,'64.242.88.10' => true,'64.242.88.50' => true,'64.242.88.60' => true,'65.116.145.141' => true,'65.113.96.174' => true,'65.116.145' => true,'66.35.208.59' => true,'66.35.208.60' => true,'66.35.208.112' => true,'66.35.208.158' => true,'66.35.208.160' => true,'66.35.208.206' => true,'66.35.208.210' => true,'66.35.208.211' => true,'208.232.154.64' => true,'209.249.66.10' => true,'209.249.66.26' => true,'209.249.66.36' => true,'209.249.67.101' => true,'209.249.67.102' => true,'209.249.67.103' => true,'209.249.67.104' => true,'209.249.67.105' => true,'209.249.67.106' => true,'209.249.67.107' => true,'209.249.67.108' => true,'209.249.67.109' => true,'209.249.67.110' => true,'209.249.67.111' => true,'209.249.67.112' => true,'209.249.67.113' => true,'209.249.67.114' => true,'209.249.67.115' => true,'209.249.67.116' => true,'209.249.67.117' => true,'209.249.67.118' => true,'209.249.67.119' => true,'209.249.67.120' => true,'209.249.67.121' => true,'209.249.67.122' => true,'209.249.67.125' => true,'209.249.67.126' => true,'209.249.67.127' => true,'209.249.67.128' => true,'209.249.67.129' => true,'209.249.67.130' => true,'209.249.67.131' => true,'209.249.67.132' => true,'209.249.67.133' => true,'209.249.67.134' => true,'209.249.67.135' => true,'209.249.67.136' => true,'209.249.67.137' => true,'209.249.67.138' => true,'209.249.67.139' => true,'209.249.67.140' => true,'209.249.67.141' => true,'209.249.67.142' => true,'209.249.67.143' => true,'209.249.67.144' => true,'210.109.141.5' => true,'216.34.42.12' => true,'216.34.42.14' => true,'216.34.42.36' => true,'216.34.42.38' => true,'216.34.42.42' => true,'216.34.42.47' => true,'216.34.42.54' => true,'216.34.42.55' => true,'216.34.42.56' => true,'216.34.42.57' => true,'216.34.42.59' => true,'216.34.42.110' => true,'216.34.42.111' => true,'216.34.42.112' => true,'216.34.42.113' => true,'216.34.42.114' => true,'216.34.42.115' => true,'216.34.42.116' => true,'216.34.42.117' => true,'216.34.42.171' => true,'216.34.42.172' => true,'216.34.42.173' => true,'216.34.42.176' => true,'216.34.42.210' => true,'216.34.42.211' => true,'216.34.42.212' => true,'216.34.42.213' => true,'216.34.42.214' => true,'216.34.42.215' => true,'216.34.42.216' => true,'216.34.42.217' => true,'216.88.158.142' => true,'212.172.247.162' => true,'209.78.25.59' => true,'62.13.25.237' => true,'207.153.39.132' => true,'207.153.23.8' => true,'80.237.184.66' => true,'80.237.202.146' => true,'128.138.236.20' => true,'81.5.184.25' => true,'129.187.148.160' => true,'129.187.148.161' => true,'129.187.148.162' => true,'129.187.148.163' => true,'129.187.148.164' => true,'129.187.148.165' => true,'70.86.206.170' => true,'203.96.111.201' => true,'213.186.46.88' => true,'77.88.25.28' => true,'213.180.193' => true,'213.180.194' => true,'213.180.206' => true,'213.180.207' => true,'213.180.210' => true,'213.180.216' => true,'213.180.217' => true,'77.88.27.26' => true,'77.88.26.26' => true,'87.250.230.33' => true,'93.158.148.31' => true,'93.158.149.32' => true,'93.158.151.24' => true,'95.108.156.251' => true,'95.108.150.235' => true,'199.21.99.102' => true,'91.205.124.3' => true,'208.197.37.29' => true,'60.191.80.26' => true,'60.191.80.27' => true,'60.191.80.28' => true,'60.191.80.31' => true,'60.191.80.34' => true,'60.191.80.35' => true,'60.191.80.37' => true,'60.191.80.38' => true,'60.191.80.39' => true,'60.191.80.40' => true,'60.191.80.43' => true,'60.191.80.44' => true,'60.191.80.77' => true,'61.135.219.13' => true,'61.135.220.152' => true,'61.135.249.193' => true,'61.135.249.195' => true,'61.135.249.203' => true,'61.135.249.212' => true,'61.135.249.216' => true,'130.245.134.62' => true,'130.245.134.63' => true,'130.245.134.64' => true,'133.11.36.24' => true,'133.11.36.25' => true,'133.11.36.26' => true,'133.11.36.28' => true,'133.11.36.32' => true,'133.11.36.34' => true,'133.11.36.36' => true,'133.11.36.37' => true,'133.11.36.38' => true,'133.11.36.39' => true,'133.11.36.41' => true,'133.11.36.42' => true,'133.11.36.43' => true,'133.11.36.44' => true,'133.11.36.45' => true,'133.11.36.46' => true,'133.11.36.47' => true,'133.11.36.48' => true,'133.11.36.50' => true,'133.11.36.51' => true,'133.11.36.52' => true,'133.11.36.54' => true,'133.11.36.55' => true,'208.68.136.5' => true,'208.68.138.5' => true,'70.42.51.11' => true,'65.197.137.32' => true,'65.197.137.34' => true,'65.197.137.35' => true,'65.197.137.37' => true,'65.219.130.20' => true,'65.219.130.21' => true,'65.219.130.240' => true,'65.219.130.241' => true,'69.20.190.201' => true,'216.55.128.47' => true,'crawl8-public.alexa.com' => true,'209.247.40.99' => true,'198.4.83.49' => true,'63.148.99.224 - 63.148.99.255' => true,'64.222.18.44' => true,'62.58.2.5' => true,'64.210.196.195' => true,'64.210.196.198' => true,'211.154.211.209' => true,'66.94.35.20' => true,'brain.grub.org' => true,'208.128.7.215' => true,'64.81.243.66' => true,'64.133.109.250' => true,'211.101.236.91' => true,'211.101.236.162' => true,'212.1.26.100' => true,'213.97.108.143' => true,'63.212.171.171' => true,'64.158.138.48' => true,'198.139.155.7' => true,'198.139.155.32' => true,'198.185.18.207' => true,'209.167.50.22' => true,'209.167.50.25' => true,'24.126.133.124' => true,'204.62.226.36' => true,'206.190.171.174' => true,'206.190.171.175' => true,'66.28.20.194' => true,'66.28.44.122' => true,'66.28.44.123' => true,'66.28.44.125' => true,'66.28.68.234' => true,'66.28.68.235' => true,'66.28.68.236' => true,'66.28.68.237' => true,'195.166.231.3' => true,'crawler918.com' => true,'12.40.85' => true,'12.148.209.196' => true,'147.208.15.13' => true,'216.182.214.7' => true,'207.200.81.145' => true,'zeus.nj.nec.com' => true,'138.15.164.9' => true,'212.253.129.11' => true,'64.69.79.210' => true,'207.140.168.143' => true,'207.140.168.146' => true,'tracerlock.com' => true,'209.61.182.37' => true,'146.48.78.32' => true,'146.48.78.38' => true,'209.73.228.163' => true,'209.73.228.167' => true,'xs4.kso.co.uk' => true,'207.235.6.157' => true,'66.221.171.1' => true,'64.14.241.54' => true,'63.173.190.19' => true,'212.73.246.73' => true,'212.73.246.71' => true,'216.145.54.35' => true,'216.145.50.40' => true,'64.241.242.11' => true,'64.241.243.32' => true,'64.241.243.66' => true,];


        return isset($robots[$ip]);
    }


}
