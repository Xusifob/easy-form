<?php

/**
 * Class EF_Input
 */
class EF_Email_Input extends EF_Input
{

    /**
     * @var string
     */
    protected $type = 'email';


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

            if(filter_var($value, FILTER_VALIDATE_EMAIL))
                return true;
        }
        return false;
    }
}