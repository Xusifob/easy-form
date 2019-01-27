<?php

class EF_Login_Form extends EF_Form
{

    /**
     * @var array
     */
    public static $_REQUIRED_FIELDS = array(
        'user_login',
        'user_pass'
    );


    /**
     * @var array
     */
    public static $_POSSIBLE_FIELDS = array(
        'remember',
    );


    /**
     * @var string
     */
    public static $_TYPE = 'login';

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


        if(!$this->isValid($data))
            return false;

        $credentials = [
            'user_login' => $data['user_login'],
            'user_password' => $data['user_pass'],
            'remember' => isset($data['remember']) ? $data['remember'] : $this->getSetting('remember'),
        ];

        /* @since V 0.4 */

        do_action('form/BeforeConnectUser', $credentials);
        do_action('form/BeforeConnectUser-' . $this->getId(), $credentials);
        $user = $this->login($credentials);
        /* @since V 0.4 */
        if(!$user)
            return false;

        do_action('form/BeforeConnectUser', $credentials);
        do_action('form/BeforeConnectUser-' . $this->getId(), $credentials);

        $this->setFormSend();
        // Redirect the user
        $this->redirect();
        return true;

    }


    /**
     *
     * @Since 1.0.0
     *
     * Login the user
     *
     * @param $credentials
     * @return bool|WP_User
     */
    public function login($credentials){
        $usr = wp_signon($credentials);
        if (is_wp_error($usr)) {
            $this->setError(__('Invalid credentials','easy-form'));
            return false;
        } else {
            return $usr;
        }
    }


    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }

    /**
     * @return array
     */
    public function getRequiredFields()
    {
        return self::$_REQUIRED_FIELDS;
    }


    public static function register()
    {
        add_filter('EF_available_forms',function($forms){
            $forms[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Login form','easy-form'),
                'class' => self::class,
                'required' => self::$_REQUIRED_FIELDS
            );

            return $forms;
        });


        add_filter('EF_fields_default_inputs',function($inputs) {

            $inputs['user_login'] = EF_Input::$_TYPE;
            $inputs['user_pass'] = EF_Password_Input::$_TYPE;
            $inputs['remember'] = EF_Checkbox_Input::$_TYPE;

            return $inputs;

        });


    }

    public function getPossibleFields()
    {
        return self::$_POSSIBLE_FIELDS;
    }

}