<?php

/**
 * Class EF_Input
 */
class EF_TextArea extends EF_Input
{

    /**
     * @var string
     */
    public static $_TYPE = 'textarea';

    /**
     * @var string
     */
    protected $element = 'textarea';


    /**
     *
     * @since 1.0.0
     *
     * @return string
     */
    public function __toString()
    {

        $this->removeAttribute('type');

        $this->setDefaultLabel();

        $template =  $this->open() . $this->getAttribute('value') .  $this->close();

        if($this->getSetting('label-after') == true){
            return $template . $this->getLabel();
        }else{
            return $this->getLabel() . $template;
        }
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
                'label' => __('Text area','easy-form'),
                'class' => self::class
            );

            return $inputs;
        });

    }

}