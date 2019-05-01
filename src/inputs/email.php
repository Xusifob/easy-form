<?php

/**
 * Class EF_Input
 */
class EF_Email_Input extends EF_Input
{

    /**
     * @var string
     */
    public static $_TYPE = 'email';


    /**
     * @param $data
     * @return bool
     */
    public function isValid($data)
    {
        if(parent::isValid($data)){

            if(!$this->isRequired())
                return true;

            $value = $data[$this->getName()];

            if(filter_var($value, FILTER_VALIDATE_EMAIL))
                return true;
        }
        return false;
    }

    /**
     *
     */
    public static function register()
    {
        add_filter('EF_available_inputs',function($inputs){
            $inputs[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Email input','easy-form'),
                'class' => self::class,
            );

            return $inputs;
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