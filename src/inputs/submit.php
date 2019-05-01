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
     *
     * @throws Exception
     */
    public function __construct( $id = null, $attributes = [], $settings = [], $data = [] ) {

        $this->defaultAttributes['value'] = __('Send','easy-form');

        parent::__construct( $id, $attributes, $settings, $data );

        $this->ignore();
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


    /**
     *
     * Display the element
     *
     * @since 1.0.0
     *
     * @return string
     */
    public function __toString()
    {

        $this->generateAutoId();

        $template = $this->getInput();

        return $template;

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
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }

}