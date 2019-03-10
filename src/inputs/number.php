<?php

/**
 * Class EF_Input
 */
class EF_Number_Input extends EF_Input
{

    /**
     * @var string
     */
    public static $_TYPE = 'number';


    /**
     * @param $data
     * @return bool
     */
    public function isValid($data)
    {
        if(parent::isValid($data)){

            $value = $data[$this->getName()];

            if(is_numeric($value))
                return true;
        }

        $this->setError(__('The field must be a numeric value',EF_get_domain()));

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
                'label' => __('Number input','easy-form'),
                'class' => self::class
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