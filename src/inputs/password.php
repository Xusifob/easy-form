<?php

/**
 * Class EF_Input
 *
 */
class EF_Password_Input extends EF_Input
{

    /**
     * @var string
     */
    public static $_TYPE = 'password';


    const VERY_WEAK = 0;
    const WEAK = 1;
    const MEDIUM = 2;
    const STRONG = 3;
    const VERY_STRONG = 4;


    /**
     * @since 1.0.0
     *
     * Array of patterns to test against the string or chars
     *
     * @var array
     */
    public static $PATTERNS = [
        'is_upper' => '/[A-Z]/',
        'is_number' => '/[0-9]/',
        'is_symbol' => '/(.*[!,@,#,$,%,^,&,*,?,_,~])/',
        'flat_lower' => '/^[\sa-z]+$/',
        'flat_upper' => '/^[\sA-Z]+$/',
        'flat_number' => '/^[\s0-9]+$/',
    ];



    /**
     *
     * @since 1.0.0
     *
     * Default setting
     *
     * @var array
     */
    protected $defaultSettings = [
        'min-strength' => '',
        'min-length' => 8,
    ];

    public function __construct($id = null, array $attributes = [], array $settings = [], array $data = [])
    {

        $this->defaultSettings['min-strength'] = self::WEAK;

        parent::__construct($id, $attributes, $settings, $data);
    }

    /**
     * @param $password
     * @return string
     */
    public function getStrength($password)
    {

        // Get the score
        $score = $this->analyze($password);

        // According to the number of point
        if($score > 100 ) {
            return self::VERY_STRONG;
        }
        if($score > 75) {
            return self::STRONG;
        }
        if($score > 50) {
            return self::MEDIUM;
        }
        if($score > 25) {
            return self::WEAK;
        }
        return self::VERY_WEAK;

    }

    /**
     * @param $data
     *
     * @return bool
     */
    public function isValid( $data ) {
        if(parent::isValid($data)){

            if(!$this->isRequired())
                return true;

            $password = $data[$this->getName()];


            if($this->getStrength($password) >= $this->getSetting('min-strength')){
                return true;
            }else {
                $this->setError(__('The password is not strong enough.',EF_get_domain()));
            }
        }
        return false;
    }

    /**
     * @since 1.0.0
     *
     * Analyze the password to get the score
     *
     * @param $password
     *
     * @from https://code.tutsplus.com/tutorials/build-a-simple-password-strength-checker--net-7565
     *
     *
     * @return int
     */
    protected function analyze($password)
    {

        $score = strlen($password) < $this->getSetting('min-length') ? 0 : 40 ;

        $num = [
            'excess' => 0,
            'upper' => 0,
            'symbols' => 0,
            'numbers' => 0
        ];

        $bonus = [
            'excess' => 1,
            'upper' => 4,
            'numbers' => 5,
            'symbols' => 5,
            'combo' => 0,
            'flat_lower' => 0,
            'flat_number' => 0,
            'same_char' => 0,
            'flat_upper' => 0,
        ];



        foreach(str_split($password) as $char){
            if(preg_match(self::$PATTERNS['is_number'],$char))
                $num['numbers']++;
            if(preg_match(self::$PATTERNS['is_symbol'],$char))
                $num['symbols']++;
            if(preg_match(self::$PATTERNS['is_upper'],$char))
                $num['upper']++;
        }

        // Check the number over the min length
        $num['excess'] = strlen($password) - $this->getSetting('min-length');


        if($num['upper'] && $num['numbers'] && $num['symbols']){
            $bonus['combo'] = 25;
        }else if($num['upper'] && $num['numbers'] || $num['upper'] && $num['symbols'] || $num['numbers'] && $num['symbols']){
            $bonus['combo'] = 15;
        }


        if(preg_match(self::$PATTERNS['flat_lower'],$password))
            $bonus['flat_lower'] = -25;
        if(preg_match(self::$PATTERNS['flat_number'],$password))
            $bonus['flat_number'] = -25;
        if(preg_match(self::$PATTERNS['flat_upper'],$password))
            $bonus['flat_upper'] = -25;


        // Calculate the score
        $score = $score + $num['excess']*$bonus['excess'] +
            $num['upper']*$bonus['upper'] +
            $num['numbers']* $bonus['numbers'] +
            $num['symbols']*$bonus['symbols'] +
            $bonus['combo'] +
            $bonus['flat_lower'] +
            $bonus['flat_upper'] +
            $bonus['flat_number'] +
            $bonus['same_char']
        ;

        return $score;

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
                'label' => __('Password input','easy-form'),
                'class' => self::class
            );

            return $inputs;
        });


        add_action('wp_enqueue_scripts',array(EF_Password_Input::class,'wp_enqueue_scripts'));

    }


    public static function wp_enqueue_scripts()
    {
        wp_register_script( 'ef-public-input-password-js', EF_get_dir('assets/public/js/inputs/password.js') , array('jquery'), EF_get_setting('version') );
        wp_enqueue_script('ef-public-input-password-js',false,array('jquery'),false,true);
    }



    public function __toString()
    {
        $strength = $this->getSetting('min-strength');

        if($strength > self::VERY_WEAK) {
            $uniqId = uniqid();
            $this->addAttribute('password-id',$uniqId);
        }

        $template = parent::__toString(); // TODO: Change the autogenerated stub

        if(isset($uniqId)) {
            $template .= sprintf('<p class="password-checked ef-password-checked" min-length="%s" min-strength="%s" id="%s" pattern-number="%s" pattern-symbol="%s" pattern-upper="%s" pattern-flat-lower="%s" pattern-flat-number="%s" pattern-flat-upper="%s" ></p>',
                $this->getSetting('min-length'),
                $this->getSetting('min-strength'),
                $uniqId,
                substr(self::$PATTERNS['is_number'],1,strlen(self::$PATTERNS['is_number'])-2),
                substr(self::$PATTERNS['is_symbol'],1,strlen(self::$PATTERNS['is_symbol'])-2),
                substr(self::$PATTERNS['is_upper'],1,strlen(self::$PATTERNS['is_upper'])-2),
                substr(self::$PATTERNS['flat_lower'],1,strlen(self::$PATTERNS['flat_lower'])-2),
                substr(self::$PATTERNS['flat_number'],1,strlen(self::$PATTERNS['flat_number'])-2),
                substr(self::$PATTERNS['flat_upper'],1,strlen(self::$PATTERNS['flat_upper'])-2)

            );
        }

        return $template;
    }


    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }


}