<?php

/**
 * Class EF_Input
 */
class EF_Phone_Input extends EF_Input
{

    /**
     * @var string
     */
    public static $_TYPE = 'tel';

    /**
     * @var
     */
    protected $pattern;

    const PATTERNS = [
        'fr' => '(^((\+([0-9 ]){0,5})|[0-9]{1,2})( |-)?[0-9]{2}( |-)?[0-9]{2}( |-)?[0-9]{2}( |-)?[0-9]{2}$)',
        'us' => '(^(\+[0-9]){0,3}? ?\(?[0-9]{3}\)? ?[0-9]{3}( |-)?[0-9]{4}$)',
        'uk' => '(^(\+[0-9]{0,5}|0)( |-)?[0-9]{4}( |-)?[0-9]{0,6}$)',
];


    /**
     * EF_Phone_Input constructor.
     *
     * @param null $id
     * @param array $attributes
     * @param array $data
     */
    public function __construct($id = null, array $attributes = [], array $data = [])
    {
        parent::__construct($id, $attributes, $data);
        $this->pattern = '/' . implode('|',self::PATTERNS) . '/i';

    }

    /**
     * @since 1.0.0
     *
     * @param $data
     * @return bool
     */
    public function isValid($data)
    {
        if(parent::isValid($data)){

            $value = $data[$this->getName()];

            return 0 !== preg_match($this->pattern,$value);

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
                'label' => __('Phone input','easy-form'),
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