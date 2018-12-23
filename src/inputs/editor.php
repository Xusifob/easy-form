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
     *
     * @return string
     */
    public function __toString()
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