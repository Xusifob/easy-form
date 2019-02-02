<?php

/**
 * Class EF_Input
 */
class EF_Editor_Input extends EF_Input
{

    /**
     * @var string
     */
    public static $_TYPE = 'editor';

    /**
     * @since 1.0.0
     *
     * @var array
     */
    protected $defaultAttributes = array();


    public function __construct($id = null, array $attributes = [], array $settings = [], array $data = [])
    {

        $attributes = array_merge($attributes,$this->defaultAttributes);

        parent::__construct($id, $attributes, $settings, $data);

        $this->addAttribute('id',$this->getName());

    }


    /**
     *
     * @return string
     */
    public function getInput()
    {
        ob_start();

        if (function_exists('wp_editor'))
            wp_editor($this->getValue(), $this->getFieldId());
        $editor_contents = ob_get_clean();
        return $editor_contents;
    }



    /**
     *
     */
    public static function register()
    {
        add_filter('EF_available_inputs',function($inputs){
            $inputs[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Editor WYSIWYG','easy-form'),
                'class' => self::class
            );

            return $inputs;
        });
    }

}