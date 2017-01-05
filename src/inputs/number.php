<?php

/**
 * Class EF_Input
 */
class EF_Number_Input extends EF_Input
{

    /**
     * @var string
     */
    protected $type = 'number';


    /**
     * @param $data
     * @return bool
     */
    public function isValid($data)
    {
        if(parent::isValid($data)){

            $value = $data[$this->getName()];

            if(is_numeric($value))
                return true;
        }
        return false;
    }
}