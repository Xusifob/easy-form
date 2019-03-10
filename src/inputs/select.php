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


    public function __construct($id = null, array $attributes = [], array $settings = [], array $data = [])
    {
        parent::__construct($id, $attributes, $settings, $data);


        $this->setOptions($this->getSetting('options'));

    }


    /**
     * @return array
     */
    public function getOptions()
    {
        return $this->options;
    }


    /**
     * @param string $options_string
     * @return $this
     */
    public function setOptions($options_string)
    {

        $options = explode("\n",$options_string);

        $opts = array();


        foreach ($options as $option) {

            $opt = array();

            if(strpos($option,'*') !== false) {
                $option = str_replace('*','',$option);
                $opt['selected'] = true;
            }

            if(strpos($option,':') !== false) {
                $option = explode(':',$option);

                $opt['value'] = trim($option[0]);
                $opt['content'] = trim($option[1]);
            }else {
                $opt['value'] = trim($option);
                $opt['content'] = trim($option);
            }


            $opts[] = $opt;
        }

        $this->options = $opts;

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
     * @throws Exception
     */
    public function getInput()
    {

        $this->removeAttribute('type');

        $template =  $this->open() . $this->displayOptions() .   $this->close();

        if($this->getSetting('label-after') == true){
            return $template . $this->getLabel();
        }else{
            return $this->getLabel() . $template;
        }
    }



    public function fillValue($data)
    {
        parent::fillValue($data); // TODO: Change the autogenerated stub


        foreach($this->options as &$option) {
            if($this->getValue() === $option['value']) {
                $option['selected'] = true;
            } else {
                unset($option['selected']);
            }
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