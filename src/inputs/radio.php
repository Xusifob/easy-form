<?php

/**
 * Class EF_Input
 */
class EF_Radio_Input extends EF_Input
{

    /**
     * @var string
     */
    public static $_TYPE = 'radio';


    /**
     * @var array
     */
    protected $defaultSettings = [
        'label-after' => true,
    ];




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
                'label' => __('Radio input','easy-form'),
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