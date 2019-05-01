<?php

/**
 * Class EF_Input
 */
class EF_URL_Input extends EF_Input
{

    /**
     * @var string
     */
    public static $_TYPE = 'url';


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

            if(filter_var($value, FILTER_VALIDATE_URL))
                return true;
        }
        return false;
    }



    /**
     *
     * @Since 1.1.0
     *
     */
    public static function register()
    {

        add_filter('EF_available_inputs',function($inputs){
            $inputs[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('URL Input','easy-form'),
                'class' => self::class
            );

            return $inputs;
        });

    }

}