<?php

/**
 * Class EF_Input
 */
class EF_Radio_List_Input extends EF_Select
{

    /**
     * @var string
     */
    public static $_TYPE = 'radio-list';


    /**
     * @var array
     */
    protected $defaultSettings = [
        'label-after' => true,
    ];




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
                'label' => __('List of radio input','easy-form'),
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

            // Case the user removed the possibility to add a new answer
            if(!isset($option['value'])) {
                $option['value'] = $option['content'];
            }

            if($option['value'] == 'ef-other') {

                $txt = new EF_Input(null,array(
                    'name' => 'ef-other-' . $this->getName(),
                    'value' => $option['content'],
                ));

                $option['content'] = sprintf(__('Other : %s',EF_get_domain()),$txt);
            }

            $input = new EF_Radio_Input(null,array(
                'value' => $option['value'],
                'checked' => isset($option['selected']) ? $option['selected'] : '',
                'name' => $this->getName(),
                'required' => false,
                'class' => self::$_TYPE . $this->getAttribute('class'),
            ),array(
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




}