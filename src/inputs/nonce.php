<?php

/**
 * Class EF_Hidden_Input
 */
class EF_Nonce_Input extends EF_Hidden_Input
{

    /**
     * @var string
     */
    protected $type = 'nonce';


    /**
     * EF_Nonce_Input constructor.
     * @param null $id
     * @param $attributes
     * @throws Exception
     */
    public function __construct($id = null,$attributes = array()) {

        $value = is_string($attributes['value']) ? $attributes['value'] : 'nonce';

        $attributes['value'] = wp_create_nonce($value);
        $attributes['name'] = '_nonce';

        parent::__construct($id,$attributes);

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