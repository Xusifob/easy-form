<?php

/**
 * Class EF_Input
 */
class EF_G_Map_Address_Input extends EF_Input
{

    /**
     * @var string
     */
    public static $_TYPE = 'g_map_address';

    /**
     * @var array
     */
    protected $defaultAttributes = [
        'value' => true,
        'required' => true,
        'autocomplete' => 'off',
    ];

    /**
     * @var array
     */
    protected $defaultSettings = [
        'label-after' => false,
    ];


    /**
     *
     */
    public static function register()
    {
        add_filter('EF_available_inputs',function($inputs){
            $inputs[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Google Maps address','easy-form'),
                'class' => self::class
            );

            return $inputs;
        });
        add_action('wp_enqueue_scripts',array(EF_G_Map_Address_Input::class,'wp_enqueue_scripts'));

    }


    /**
     * Add the g_map_address.js script in the queue
     */
    public static function wp_enqueue_scripts()
    {
        wp_register_script( 'ef-public-input-g_map_address-js', EF_get_dir('assets/public/js/inputs/g_map_address.js') , array('jquery'), EF_get_setting('version') );


        wp_enqueue_script('ef-public-input-g_map_address-js',false,array('jquery'),false,true);
    }




    /**
     * @param array $data
     * @return array
     */
    public function getGoogleMapsData($data = array())
    {

        if(empty($data)) {
            if(isset($_POST)) {
                $data = $_POST;
            }
        }

        if(empty($data)) {
            return array();
        }

       $key = $this->getName() . '_data';

        if(!isset($data[$key])) {
            return array();
        }

        return json_decode(stripslashes($data[$key]),true);


    }

    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }


    public function __toString()
    {

        $id = uniqid();

        $this->addAttribute('g_map_address',$id);
        // Force autocomplete to false to avoid overlapping data
        $this->addAttribute('type','password');
        $this->addAttribute('onfocus','this.type = \'text\'');
        $this->addAttribute('autocomplete','off');

        $template = parent::__toString(); // TODO: Change the autogenerated stub


        $template .= sprintf('<input type="hidden" name="%s" id="%s" >',$this->getName() . '_data',$id);
        $template .= sprintf('<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=%s&libraries=places"></script>',$this->getSetting('api_key'));

        return $template;
    }


}