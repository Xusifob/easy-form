<?php

/**
 * Class EF_Input
 */
class EF_Submit_Input extends EF_Input
{

    /**
     * @var string
     */
    protected $element = 'input';

    /**
     * @var string
     */
    public static $_TYPE = 'submit';

    /**
     * The meta id
     *
     * @var int
     */
    protected $id;

    /**
     * The name of the field
     *
     * @var string
     */
    protected $name;


    /**
     * @since 1.0.0
     *
     * Returns if the input is valid
     *
     * @param $data
     * @return bool
     */
    public function isValid($data)
    {
        return true;
    }


    /**
     *
     * @since 1.0.0
     *
     * EF_Submit_Input constructor.
     *
     * @param null $id
     * @param array $attributes
     * @param array $settings
     * @param array $data
     */
    public function __construct( $id = null, $attributes = [], $settings = [], $data = [] ) {

        $this->defaultAttributes['value'] = __('Send',EF_get_domain());

        parent::__construct( $id, $attributes, $settings, $data );
    }

    /**
     *
     * @since 1.0.0
     *
     * Return the label of the field
     *
     *
     * @param null $force
     * @return string
     */
    public function getLabel($force = null)
    {
        return  '';
    }

}