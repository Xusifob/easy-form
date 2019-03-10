<?php

/**
 * Class EF_Input
 */
class EF_Checkbox_List_Input extends EF_Select
{

    /**
     * @var string
     */
    public static $_TYPE = 'checkbox-list';


    /**
     * @var array
     */
    protected $defaultSettings = array(
        'label-after' => true,
    );


    protected $defaultAttributes = array(
        'multiple' => true,
    );




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
                'label' => __('List of checkbox input','easy-form'),
                'class' => self::class
            );

            return $inputs;
        });

    }




    /**
     * @return string
     * @throws Exception
     */
    public function getInput()
    {

        $template = '';

        $this->removeAttribute('type');


        foreach($this->getOptions() as $option) {

            if($option['value'] == 'ef-other') {

                $txt = new EF_Input(null,array(
                    'name' => 'ef-other-' . $this->getName(),
                    'value' => $option['content'],
                ));

                $option['content'] = sprintf(__('Other : %s',EF_get_domain()),$txt);
            }

            $attributes = array(
                'value' => $option['value'],
                'name' => $this->getName(),
                'class' => self::$_TYPE . $this->getAttribute('class'),
                'multiple' => true,
            );


            if(isset($option['selected'])) {
                $attributes['checked'] = 'checked';
            }


            $input = new EF_Checkbox_Input(null,$attributes,array(
                'label' => $option['content'],
            ));

            $template .= $input;

        }


        return $template;
    }



    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }


    /**
     * @param $data
     * @return mixed
     */
    public function getValueFromPostData($data)
    {

        $val = parent::getValueFromPostData($data);

        if(is_array($val)) {
            foreach($val as &$v) {
                if($v == 'ef-other') {
                    $v = $data['ef-other-' . $this->getName()];
                }
            }
        }


        // If the value selected is other, we return the value of the input
        if($val === 'ef-other') {
            return $data['ef-other-' . $this->getName()];
        }

        return $val;
    }

}