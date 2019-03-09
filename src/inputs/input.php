<?php

/**
 * Class EF_Input
 */
class EF_Input extends EF_Settings_Element
{

    /**
     * @var string
     */
    protected $element = 'input';


    /**
     * @var string
     */
    static $_TYPE = 'text';


    /**
     * The meta id
     *
     * @var int
     */
    protected $id;

    /**
     * The name of the field
     *
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $error;


    /**
     * If the label has already been retrieved
     *
     * @since 1.0.0
     *
     * @var boolean
     */
    protected $label_retrieved = false;




    /**
     * @since 1.0.0
     *
     * @var array
     */
    protected $defaultAttributes = [
        'required' => true
    ];



    /**
     * EF_Input constructor.
     * @param null $id
     * @param array $attributes
     * @param array $settings
     * @param array $data
     * @throws Exception
     */
    public function __construct($id = null,$attributes = [],$settings = [],$data = [])
    {

        $this->addAttribute('type',$this->getType());

        parent::__construct($attributes,$settings);

        $this->fillValue($data);

        if(false === $this->getName()){
            $this->setError(__('A field must always have a name'));
            return new WP_Error(666,__('A field must always have a name'));
        }
    }


    /**
     * @param bool $ignore Set that the field should be ignored when saving the data
     */
    public function ignore($ignore = true)
    {

        if($ignore) {
            add_filter('EF_Ignore_Fields', function ($ignored) {
                $ignored[] = $this->getName();

                return $ignored;
            });
        }

    }



    /**
     * Add the value inside the input
     *
     * @param $data
     */
    public function fillValue($data){
        if(isset($data[$this->getAttribute('name')])){
            $this->addAttribute('value',$data[$this->getAttribute('name')]);
        }
    }


    /**
     * @return string
     */
    public function getFieldId()
    {
        return $this->getAttribute('id');
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getFieldClass()
    {
        return $this->getAttribute('class');
    }

    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }



    /**
     * @return boolean
     */
    public function isRequired()
    {
        return $this->getAttribute('required');
    }


    /**
     * @return string
     */
    public function getName()
    {
        return $this->getAttribute('name');
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->addAttribute('name',$name);
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        return $this->getAttribute('value');
    }

    /**
     * @return string
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * @param string $error
     */
    public function setError($error)
    {
        $this->error = $error;
    }



    /**
     *
     * Display the element
     *
     * @since 1.0.0
     *
     * @return string
     */
    public function __toString()
    {

        $this->generateAutoId();

        $template = $this->getInput();

        $error = '';

        if($this->getSetting('display-errors')) {
            $error = sprintf('<span class="ef-input-error" >%s</span>',$this->getError());
        }

        if($errorBefore = $this->getSetting('errors-before')) {
            $template = $error . $template;
        }

        if($this->getSetting('label-after') == true){
            $template = $template . $this->getLabel();
        }else{
            $template =$this->getLabel() . $template;
        }

        if(!$errorBefore) {
            $template = $template . $error;
        }

        return $template;



    }

    /**
     * @since 1.0.0
     *
     * Generate an id auto created if the field miss one
     */
    protected function generateAutoId() {

        // I don't generate the auto id
        if(empty($this->getName()))
            return;

        // Add the id if the input does not have any
        if(false === $this->getFieldId()){
            $this->addAttribute('id',$this->getName() . '-' . sanitize_title($this->getValue()) . '-' . $this->getId());
        }
    }


    /**
     * @since 1.0.0
     *
     * Return the input template
     *
     * @return string
     */
    public function getInput()
    {
        return $this->open();
    }

    /**
     * @since 1.0.0
     *
     * Set a default setting to display the hidden label
     *
     */
    protected function setDefaultLabel()
    {

        if(!$this->getSetting('label')){
            if(!$this->getSetting('label-class')){
                $this->addSetting('label-class','sr-only');
            }
            $this->addSetting('label',$this->getName());
        }
    }


    /**
     * @since 1.0.0
     *
     * Return a json object
     */
    public function jsonSerialize()
    {

        $elem = parent::jsonSerialize();
        return array_merge($elem,[
            'name' => $this->getName(),
            'settings' => $this->getSettings()
        ]);
    }

    /**
     *
     * @since 1.0.0
     *
     * Return if the input has errors
     *
     * @return bool
     */
    public function hasError(){
        return $this->getError() != false;
    }


    /**
     * @since 1.0.0
     *
     * Return a label
     *
     * @param bool|false $force if false, will return the label only once
     * @return string
     *
     * @throws Exception
     */
    public function getLabel($force = false)
    {

        $this->generateAutoId();

        $this->setDefaultLabel();

        if(!$this->label_retrieved || $force) {
            $label = new EF_Html_Element(array(
                'for' => $this->getFieldId(),
                'class' => $this->getSetting('label-class'),
            ));
            $label->setElement('label');

            $this->label_retrieved = true;

            // Return the label html
            $l =  $label->open() . $this->getSetting('label') . $label->close();

            return $l . $this->getExplanatoryText();
        }else{
            return '';
        }
    }


    /**
     * @return string
     * @throws Exception
     */
    function getExplanatoryText()
    {
        $txt = $this->getSetting('exp-text');

        if(!$txt) {
            return "";
        }


        $txt = stripslashes($txt);

        $text = new EF_Html_Element(array(
            'class' => $this->getSetting('exp-text-class'),
        ));

        $text->setElement('p');

        return $text->open() . $txt . $text->close();


    }


    /**
     *
     * @since 1.0.0
     *
     * Returns if the input is valid
     *
     * @param $data
     * @return bool
     */
    public function isValid($data)
    {

        if(!$this->isRequired()) {
            return true;
        }

        if(!isset($data[$this->getName()]) || empty($data[$this->getName()])){
            $this->setError(__('This field  is required','easy-form'));
            return false;
        }
        return true;

    }


    /**
     *
     * @Since 1.1.0
     *
     */
    public static function register()
    {

        add_filter('EF_available_inputs',function($inputs){
            $inputs[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Text input','easy-form'),
                'class' => self::class
            );

            return $inputs;
        });

    }



    public static function getAdminTemplate()
    {
        return EF_get_dir('');
    }

}