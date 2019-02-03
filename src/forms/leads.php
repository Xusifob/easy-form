<?php

class EF_Leads_Form extends EF_Form
{

    /**
     * @var array
     */
    public static $_REQUIRED_FIELDS = array();


    /**
     * @var array
     */
    public static $_POSSIBLE_FIELDS = array(
        'first_name',
        'last_name',
        'phone',
        'email',
    );


    /**
     * @var string
     */
    public static $_TYPE = 'leads';

    /**
     *
     * Submit the form
     *
     * @Since 1.0.0
     *
     * @param $data
     * @return bool
     */
    public function submit($data){

        if(!$this->isValid($data)) {
            return false;
        }


        $_data = array();

        $remove = apply_filters('EF_Ignore_Fields',array());


        foreach($this->getInputs() as $input) {
            if(in_array($input->getName(),$remove)) {
                continue;
            }

            $_data[$input->getName()] = $input->getValue();
        }


        $lead = new EF_Lead(null,$this->id,$_data);
        $save = $lead->save();

        if(is_wp_error($save)) {
            $this->setError($save->get_error_message());
            return false;
        }


        $this->setFormSend();
        // Redirect the user
        $this->redirect();
        return true;

    }


    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }

    /**
     * @return array
     */
    public function getRequiredFields()
    {
        return self::$_REQUIRED_FIELDS;
    }


    public static function register()
    {
        add_filter('EF_available_forms',function($forms){
            $forms[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Leads Generator form','easy-form'),
                'class' => self::class,
                'required' => self::$_REQUIRED_FIELDS,
                'possible' => self::$_POSSIBLE_FIELDS,
            );

            return $forms;
        });


        add_filter('EF_fields_default_inputs',function($inputs) {

            $inputs['first_name'] = EF_Input::$_TYPE;
            $inputs['last_name'] = EF_Input::$_TYPE;
            $inputs['email'] = EF_Email_Input::$_TYPE;
            $inputs['phone'] = EF_Phone_Input::$_TYPE;

            return $inputs;

        });

    }


    /**
     * @return array
     */
    public function getPossibleFields()
    {
        return self::$_POSSIBLE_FIELDS;
    }

}