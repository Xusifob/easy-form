<?php

/**
 * Class EF_Input
 */
class EF_Note_Input extends EF_Input
{

    /**
     * @var string
     */
    public static $_TYPE = 'note';




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
                'label' => __('Note input','easy-form'),
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


    public function getInput()
    {
        $string = '<div class="note">';

        $min = (int)$this->getSetting('min-number');
        $max = (int)$this->getSetting('max-number');

        $value = $this->getValue();

        if($min == 0) {
            $nb  = $max+1;
        } else {
            $nb = $max;
        }

        $name = $this->getAttribute('name');

        $left = $this->getSetting('left-label');
        if($left) {
            $string .= sprintf('<span class="label-note"><label>%s</label></span>',$left);
        }
        $string .= '<span class="numbers" >';
        for($i = $min; $i <=$max;$i++) {

            $checked = $value == $i ? 'checked' : '';

            $string .= sprintf('<label class="note-%s"><span>%s</span>',$nb,$i);
            $string .= sprintf('<input type="radio" name="%s" value="%s" id="%s" %s />',$name,$i,"$name$i",$checked);
            $string .= '</label>';
        }
        $string .= '</span>';

        $right = $this->getSetting('right-label');
        if($right) {
            $string .= sprintf('<span class="label-note"><label>%s</label></span>',$right);
        }
        $string .= '</div>';

        return $string;
    }

}