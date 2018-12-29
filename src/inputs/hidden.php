<?php

/**
 * Class EF_Hidden_Input
 */
class EF_Hidden_Input extends EF_Input
{

    /**
     * @var string
     */
    public static $_TYPE = 'hidden';


    /**
     * @since 1.0.0
     *
     * Return the label for the input, no label for hidden inputs
     *
     *
     * @param bool|false $force
     * @return string
     */
    public function getLabel($force = false)
    {
        return '';
    }


    /**
     *
     */
    public static function register()
    {
        add_filter('EF_available_inputs',function($inputs){
            $inputs[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Hidden input','easy-form'),
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