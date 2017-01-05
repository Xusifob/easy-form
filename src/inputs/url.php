<?php

/**
 * Class EF_Input
 */
class EF_URL_Input extends EF_Input
{

    /**
     * @var string
     */
    protected $type = 'url';


    /**
     * @param $data
     * @return bool
     */
    public function isValid($data)
    {
        if(parent::isValid($data)){

            if(!$this->isRequired())
                return true;

            $value = $data[$this->getName()];

            if(filter_var($value, FILTER_VALIDATE_URL))
                return true;
        }
        return false;
    }
}