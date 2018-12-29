<?php

/**
 * Class EF_Input
 */
class EF_Select extends EF_Input
{

    /**
     * @var string
     */
    public static $_TYPE = 'select';

    /**
     * @var string
     */
    protected $element = 'select';


    /**
     * @since 1.0.0
     *
     * Array containing all options of the select
     *
     * @var array
     */
    protected $options = [];



    /**
     * @return array
     */
    public function getOptions()
    {
        return $this->options;
    }


    /**
     * @param array $options
     * @return $this
     */
    public function setOptions($options)
    {
        $this->options = $options;
        return $this;
    }


    /**
     * @param $option
     * @return $this
     */
    public function addOption($option)
    {
        $this->options[] = $option;
        return $this;
    }



    /**
     * @return string
     */
    public function __toString()
    {

        $this->removeAttribute('type');

        $template =  $this->open() . $this->displayOptions() .   $this->close();

        if($this->getSetting('label-after') == true){
            return $template . $this->getLabel();
        }else{
            return $this->getLabel() . $template;
        }
    }



    /**
     * @since 1.0.0
     *
     * Display all options of the select
     *
     */
    protected function displayOptions()
    {

        $options = '';

        if(is_array($this->getOptions())){
            foreach($this->getOptions() as $option){
                $opt = new EF_Html_Element($option);
                $opt->setElement('option');
                $opt->removeAttribute('content');

                $options .= $opt->open();
                if(isset($option['content'])){
                    $options .= $option['content'];
                }
                $options .= $opt->close();
            }
        }

        return $options;

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
                'label' => __('Select input','easy-form'),
                'class' => self::class
            );

            return $inputs;
        });

    }



    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }


}