<?php

/**
 * Class EF_Input
 */
class EF_Checkbox_Input extends EF_Input
{

    /**
     * @var string
     */
    public static $_TYPE = 'checkbox';

    /**
     * @var array
     */
    protected $defaultAttributes = array(
        'value' => true,
    );

    /**
     * @var array
     */
    protected $defaultSettings = array(
        'label-after' => true,
    );


    /**
     *
     */
    public static function register()
    {
        add_filter('EF_available_inputs',function($inputs){
            $inputs[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Checkbox input','easy-form'),
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