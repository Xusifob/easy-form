<?php

class EF_Reset_Form extends EF_Form implements EF_Form_Interface
{

    public static $_REQUIRED_FIELDS = [
        'user_email',
        'user_pass'
    ];


    public static $_PASSWORD_FORGOT_KEY = 'ef_pass_forgot_key';


    /**
     * @var string
     */
    public static $_TYPE = 'reset';


    public function __construct($id = null, array $attributes = [], array $settings = [])
    {

        parent::__construct($id, $attributes, $settings);

    }


    /**
     * According to the kind of input, remove the useless ones
     *
     */
    protected function removeUselessInputs()
    {


        if($this->isResetting()) {
            $this->removeInput('user_email');
        } else {
            $this->removeInput('user_pass');
        }
    }


    /**
     * @return string
     */
    public function __toString()
    {
        $this->removeUselessInputs();

        return parent::__toString();
    }


    /**
     *
     * Submit the form
     *
     * @Since 1.0.0
     *
     * @param $data
     * @return bool
     */
    public function submit($data){

        $this->removeUselessInputs();

        if(!$this->isValid($data))
            return false;

        $user = get_user_by('email',$data['user_email']);


        if(!$user) {
            $this->setError(__('No user found in the database',EF_get_domain()));
            return false;
        }

        $key = EF_User_Activation_Form::generateActivationKey();

        $update = update_user_meta($user->ID,self::$_PASSWORD_FORGOT_KEY,$key);

        if(!$update) {
            $this->setError(__('An error occurred while generating the key, please try again later.',EF_get_domain()));
            return false;
        }

        if(!$this->sendResetEmail($user)) {
            $this->setError(__('An error occurred while sending the email, please try again later',EF_get_domain()));
            return false;
        }

        return true;

    }


    /**
     *
     * Returns if the form is currently resetting or sending the password
     *
     * @return bool
     */
    public function isResetting()
    {
        return isset($_GET['ef_reset_key']) && !empty($_GET['ef_reset_key']);
    }




    /**
     *
     * Send the activation email to the user
     *
     * @param WP_User $user
     * @return bool
     */
    public function sendResetEmail(WP_User $user)
    {
        $mailer = new EF_Email_Helper();

        $activation_key = get_user_meta($user->ID,self::$_PASSWORD_FORGOT_KEY,true);

        $link = $this->generateRedirectLink();

        $link = implode('',array(
            $link,
            EF_get_link_union($link),
            'ef_user_id=',
            $user->ID,
            '&ef_reset_key=',
            $activation_key
        ));


        $template = $mailer->loadTemplate('reset-password');


        $data = array(
            'activation_link' => $link,
            'first_name' => get_user_meta($user->ID,'first_name',true),
        );

        $template = $mailer->parseTemplate($template,$data);


        $subject = __('Reset your password',EF_get_domain());

        $subject = apply_filters('ef_reset_email_subject',$subject);

        return $mailer->sendEmail($subject,$user->user_email,$template);
    }






    public static function register()
    {
        add_filter('EF_available_forms',function($forms){
            $forms[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Reset a password','easy-form'),
                'class' => self::class,
                'required' => self::$_REQUIRED_FIELDS
            );

            return $forms;
        });
    }

    /**
     * @return array
     */
    public function getRequiredFields()
    {
        $required = self::$_REQUIRED_FIELDS;

        if($this->isResetting()) {
            unset($required[array_search('user_email',$required)]);
        } else {
            unset($required[array_search('user_pass',$required)]);
        }

        return $required;
    }

    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }

}