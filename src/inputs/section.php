<?php

/**
 * Class EF_Section
 */
class EF_Section extends EF_Input
{

    /**
     * @var string
     */
    public static $_TYPE = 'section';


    /**
     *
     */
    public static function register()
    {
        add_filter('EF_available_inputs',function($inputs){
            $inputs[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Section','easy-form'),
                'class' => self::class
            );

            return $inputs;
        });
    }


    public function isValid($data)
    {
        return true;
    }


    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }


    /**
     * @return string
     * @throws Exception
     */
    public function __toString()
    {

        $this->addAttribute('required',false);

        $class = $this->getSetting('label-class');
        $this->addSetting('label-class',$class . ' ef-section-label');

        $class = $this->getSetting('exp-text-class');
        $this->addSetting('exp-text-class',$class . ' ef-section-exp-text');


        return $this->getLabel(true);
    }

}