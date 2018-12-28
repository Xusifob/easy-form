<?php

class EF_Reset_Form extends EF_Form
{

    protected $requiredFields = [
        'login',
        'password'
    ];


    /**
     * @var string
     */
    public static $_TYPE = 'reset';


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
            'user_login' => $data['login'],
            'user_password' => $data['password'],
            'remember' => isset($data['remember']) ? $data['remember'] : $this->getSetting('remember'),
        ];

        /* @since V 0.4 */

        do_action('form/BeforeConnectUser', $credentials);
        do_action('form/BeforeConnectUser-' . $this->getId(), $credentials);
        $user = self::login($credentials);
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
        $usr = wp_signon($credentials, false);
        if (is_wp_error($usr)) {
            $this->setError(__('Invalid credentials','easy-form'));
            return false;
        } else {
            return $usr;
        }
    }


    public static function register()
    {
        add_filter('EF_available_forms',function($forms){
            $forms[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Reset a password','easy-form'),
                'class' => self::class
            );

            return $forms;
        });
    }

    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }

}