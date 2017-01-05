<?php

/**
 * Class EF_Input
 */
class EF_TextArea extends EF_Input
{

    /**
     * @var string
     */
    protected $type = 'textarea';

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

}