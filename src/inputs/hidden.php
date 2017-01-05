<?php

/**
 * Class EF_Hidden_Input
 */
class EF_Hidden_Input extends EF_Input
{

    /**
     * @var string
     */
    protected $type = 'hidden';


    /**
     * @since 1.0.0
     *
     * Return the label for the input, no label for hidden inputs
     *
     *
     * @param bool|false $force
     * @return string
     */
    public function getLabel($force = false)
    {
        return '';
    }

}