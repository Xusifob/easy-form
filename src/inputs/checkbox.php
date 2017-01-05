<?php

/**
 * Class EF_Input
 */
class EF_Checkbox_Input extends EF_Input
{

    /**
     * @var string
     */
    protected $type = 'checkbox';

    /**
     * @var array
     */
    protected $defaultAttributes = [
        'value' => true,
    ];

    /**
     * @var array
     */
    protected $defaultSettings = [
        'label-after' => true,
    ];

}