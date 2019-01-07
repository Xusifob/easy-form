<?php

class EF_Reset_Form extends EF_Form implements EF_Form_Interface
{

    public static $_REQUIRED_FIELDS = [
        'email',
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

        $user = get_user_by('email',$data['login']);


        if(!$user) {
            $this->setError(__('No user found in the database',EF_get_domain()));
            return false;
        }


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
        return self::$_REQUIRED_FIELDS;
    }

    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }

}