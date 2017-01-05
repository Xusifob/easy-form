<?php

/**
 * Class EF_Input
 */
class EF_Editor_Input extends EF_Input
{

    /**
     * @var string
     */
    protected $type = 'editor';


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
}