<?php

/**
 * Class EF_Input
 */
class EF_ReCaptcha_Input extends EF_Input
{

    /**
     * @var string
     */
    public static $_TYPE = 'captcha';

    /**
     *
     */
    public static function register()
    {
        add_filter('EF_available_inputs',function($inputs){
            $inputs[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Captcha','easy-form'),
                'class' => self::class
            );

            return $inputs;
        });
    }


    /**
     * @return string
     */
    public function getInput()
    {
        $template = ' <script src="https://www.google.com/recaptcha/api.js" async defer></script>';
        $template .= sprintf('<div class="g-recaptcha" data-sitekey="%s"></div>',$this->getSetting('api_key'));

        return $template;

    }


    /**
     *
     * Validates if the field is valid or not
     *
     * @param $data
     * @return bool
     */
    public function isValid($data)
    {

        $response = Requests::post('https://www.google.com/recaptcha/api/siteverify',array(),
            array(
                'secret' => $this->getSetting('api_key_secret'),
                'response' => $data['g-recaptcha-response'],
                'remoteip' => $_SERVER['REMOTE_ADDR']
            ));


        $responseData = json_decode($response->body,true);

        return isset($responseData['success']) && true === $responseData['success'];

    }


    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }


}