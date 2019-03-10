<?php

class EF_Html_Element implements JsonSerializable
{

    /**
     * @var string
     */
    protected $element = '';

    /**
     * The attributes
     *
     * @var array
     */
    protected $attributes = [];

    /**
     * @var array
     */
    protected $defaultAttributes = [];


    /**
     * EF_Html_Element constructor.
     * @param array $attributes
     * @throws Exception
     */
    public function __construct($attributes = [])
    {
        if(is_array($attributes)){
            $this->setAttributes(array_merge($this->defaultAttributes,$this->attributes,$attributes));
        }else{
            throw new Exception(sprintf('$attributes must be an array %s gotten',gettype($attributes)));
        }
    }

    /**
     * @param $key
     * @return bool
     */
    public function getAttribute($key){

        if(!isset($this->attributes[$key])) {
            return false;
        }

        if(is_serialized($this->attributes[$key])) {
            return unserialize($this->attributes[$key]);
        }

        if(is_string($this->attributes[$key])) {
            return stripslashes($this->attributes[$key]);
        }
        return $this->attributes[$key];
    }

    /**
     * @return array
     */
    public function getAttributes()
    {
        return $this->attributes;
    }

    /**
     * @param array $attributes
     */
    public function setAttributes($attributes)
    {
        $this->attributes = $attributes;
    }


    /**
     *
     * @since 1.0.0
     *
     * Add an html attribute
     *
     * @param $key
     * @param $value
     * @return $this
     */
    public function addAttribute($key,$value)
    {
        $this->attributes[$key] = $value;
        return $this;
    }

    /**
     *
     * @since 1.0.0
     *
     * Remove an attribute
     *
     * @param $key
     * @return $this
     */
    public function removeAttribute($key)
    {

        if(isset($this->attributes[$key])){
            unset($this->attributes[$key]);
        }
        return $this;
    }


    /**
     * @return string
     */
    public function open()
    {
        // Open the element
        $template = '<' . $this->element;

        // Add all attributes
        foreach ($this->getAttributes() as $key => $attribute) {
            if($attribute) {
                $template .= " $key=\"". htmlspecialchars($attribute). "\" ";
            }
        }

        // Close the element
        $template .= '>';

        return $template;
    }

    /**
     * @return string
     */
    public function close()
    {
        // Open the element
        $template = '</' . $this->element . '>';

        return $template;
    }

    /**
     * @return string
     */
    public function getElement()
    {
        return $this->element;
    }

    /**
     * @param string $element
     */
    public function setElement($element)
    {
        $this->element = $element;
    }


    /**
     * @return string
     */
    public function __toString()
    {
        return $this->open() . $this->close();
    }

    /**
     * Return a json object
     */
    public function jsonSerialize()
    {
        return [
            'attributes' => $this->getAttributes(),
            'element' => $this->getElement(),
        ];
    }

}