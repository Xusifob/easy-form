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
    protected $type = 'password';


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
        'min-strength' => self::WEAK,
        'min-length' => 8,
    ];

    /**
     * @param $password
     * @return string
     */
    public function getStrength($password)
    {

        // Get the score
        $score = $this->analyze($password);

        // According to the number of point
        switch(true) {
            case in_array($score, range(0,25)):
                return self::VERY_WEAK;
                break;
            case in_array($score, range(25,50)):
                return self::WEAK;
                break;
            case in_array($score, range(51,75)):
                return self::MEDIUM;
                break;
            case in_array($score, range(76,100)):
                return self::STRONG;
                break;
            default:
                return self::VERY_STRONG;
        }

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

        $score = strlen($password) < $this->getSetting('min-length') ? 0 : 50 ;

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
            $bonus['flat_lower'] = -15;
        if(preg_match(self::$PATTERNS['flat_number'],$password))
            $bonus['flat_number'] = -15;


        // Check number of occurences
        if(array_values(count_chars($password,1))[0] >= strlen($password) -3){
            $bonus['same_char'] = -25;
        }

        // Calculate the score
        $score = $score + $num['excess']*$bonus['excess'] +
                 $num['upper']*$bonus['upper'] +
                 $num['numbers']* $bonus['numbers'] +
                 $num['symbols']*$bonus['symbols'] +
                 $bonus['combo'] +
                 $bonus['flat_lower'] +
                 $bonus['flat_number'] +
                 $bonus['same_char']
        ;

        return $score;

    }

}