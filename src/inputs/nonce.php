<?php

/**
 * Class EF_Hidden_Input
 */
class EF_Nonce_Input extends EF_Hidden_Input
{

    /**
     * @var string
     */
    public static $_TYPE= 'nonce';


    /**
     * EF_Nonce_Input constructor.
     * @param null $id
     * @param $attributes
     * @throws Exception
     */
    public function __construct($id = null,$attributes = array()) {

        $value = 'nonce';

        $attributes['value'] = wp_create_nonce($value);
        $attributes['name'] = '_nonce';

        parent::__construct($id,$attributes);

        if(WP_DEBUG)
            $this->addSetting('display-errors','on');

        $this->ignore();


    }


    /**
     *
     * Return if the field is valid or nit
     *
     * @param $data
     * @return bool|int
     */
    public function isValid($data)
    {

        $value = 'nonce';

        $result = wp_verify_nonce($data[$this->getAttribute('name')],$value);

        if(!$result) {
            $this->setError('The nonce has not been verified');
        }

        return $result;
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
                'label' => __('Text input','easy-form'),
                'class' => self::class,
                'public' => false,
            );

            return $inputs;
        });

    }


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

}