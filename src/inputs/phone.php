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
     *
     * EF_Phone_Input constructor.
     *
     * @param null $id
     * @param array $attributes
     * @param array $settings
     * @param array $data
     * @throws Exception
     */
    public function __construct($id = null,$attributes = [],$settings = [],$data = [])
    {

        parent::__construct($id, $attributes,$settings, $data);

        $this->pattern = '/' . implode('|',self::PATTERNS) . '/i';

        // echo $this->pattern;
        //  die();

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

            $format = $this->getAttribute('format');

            if(null === $format || null == (self::PATTERNS[$format])) {
                $pattern = $this->pattern;
            } else {
                $pattern = self::PATTERNS[$format];
            }

            $value = $data[$this->getName()];

            if(0 === preg_match($pattern,$value)) {
                $this->setError(__('Incorrect format','easy-form'));
                return false;
            }

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
                'label' => __('Phone input','easy-form'),
                'class' => self::class
            );

            return $inputs;
        });

        add_action('wp_enqueue_scripts',array(EF_Phone_Input::class,'wp_enqueue_scripts'));

    }



    /**
     * Add the password
     */
    public static function wp_enqueue_scripts()
    {
        wp_register_script( 'ef-public-input-phone-js', EF_get_dir('assets/public/js/inputs/phone.js') , array('jquery'), EF_get_setting('version') );

        wp_enqueue_script('ef-public-input-phone-js',false,array('jquery'),false,true);
    }



    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }

}