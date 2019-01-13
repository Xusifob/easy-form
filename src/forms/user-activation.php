<?php


/**
 *
 * This class contains all the functions that are linked to the activation of the users via the plugin.
 *
 * It sends the emails, activate users, deactivate users, generate the activation keys...
 *
 * Class EF_User_Activation_Form
 */
abstract class EF_User_Activation_Form extends EF_Form
{

    /**
     *
     * The Meta Key
     *
     * @var string
     */
    public static $ACTIVATION_KEY = 'ef_activation_key';


    public static $IS_ACTIVATED = 'ef_is_activated';


    /**
     *
     * The link is valid for 24 hours
     *
     * @var int
     */
    public static $LINK_VALIDITY = 24;



    /**
     *
     * Deactivate a user
     *
     * @param $user_id
     * @return string
     */
    public static function deactivateUser($user_id)
    {

        $key = self::generateActivationKey();

        update_user_meta($user_id,self::$ACTIVATION_KEY,$key);
        update_user_meta($user_id,self::$IS_ACTIVATED,false);

        return $key;
    }


    /**
     *
     * Activate a user
     *
     * @param $user_id
     * @return WP_Error|bool|int
     */
    public static function activateUser($user_id)
    {
        update_user_meta($user_id,self::$ACTIVATION_KEY,'');
        return update_user_meta($user_id,self::$IS_ACTIVATED,true);
    }


    /**
     *
     * Creates an activation key
     *
     * @return string
     */
    public static function generateActivationKey()
    {
        return base64_encode(uniqid() . '.' . time());
    }


    /**
     *
     * Check if the activation key is valid and not expired for the current user
     *
     * @param $key
     * @param $activation_key
     * @return bool|WP_Error
     */
    public static function checkActivationKey($key,$activation_key)
    {

        if(false && $activation_key !== $key) {
            return new WP_Error(666,__('The activation key is incorrect',EF_get_domain()));
        }

        $key = base64_decode($key);

        $key = explode('.',$key);
        $time = $key[1];

        if(time() - $time > self::$LINK_VALIDITY*60*60) {
            return new WP_Error(666,__('The activation key is expired',EF_get_domain()));
        }


        return true;

    }


    /**
     *
     */
    public static function activation_page() {


        if(!isset($_GET['ef_activation_key'])) {
            return;
        }

        if(!isset($_GET['ef_user_id'])) {
            return;
        }


        $key = $_GET['ef_activation_key'];

        $user_id = $_GET['ef_user_id'];


        $key = get_user_meta($user_id,self::$ACTIVATION_KEY,true);

        $is_valid = self::checkActivationKey($key,$key);

        if(is_wp_error($is_valid)) {
            //TODO Do something here
        }

        self::activateUser($user_id);


    }



    /**
     *
     * Send the activation email to the user
     *
     * @param WP_User $user
     * @return bool
     */
    public function sendActivationEmail(WP_User $user)
    {
        $mailer = new EF_Email_Helper();

        $activation_key = get_user_meta($user->ID,self::$ACTIVATION_KEY,true);

        $link = $this->generateRedirectLink();

        $link = implode('',array(
            $link,
            EF_get_link_union($link),
            'ef_user_id=',
            $user->ID,
            '&ef_activation_key=',
            $activation_key
        ));


        $template = $mailer->loadTemplate('activation');


        $data = array(
            'activation_link' => $link,
            'first_name' => get_user_meta($user->ID,'first_name',true),
        );

        $template = $mailer->parseTemplate($template,$data);


        $subject = __('Activate your account',EF_get_domain());

        $subject = apply_filters('ef_activation_email_subject',$subject);

        return $mailer->sendEmail($subject,$user->user_email,$template);
    }



    /**
     *
     * Check if the user account is activated. If not, returns an error
     *
     * @param $user
     * @return mixed
     */
    public static function checkIfActivated($user)
    {
        if(!$user instanceof WP_User) {
            return $user;
        }

        $is_activated = get_user_meta($user->ID,self::$IS_ACTIVATED,true);


        if(false === $is_activated) {
            return new WP_Error(666,__('Please activate your account by clicking on the link provided in the activation email',EF_get_domain()));
        }


        return $user;

    }



}