<?php

/**
 * Class WP_Form
 */
class WP_Form implements JsonSerializable
{


    /**
     * @since 1.0.0
     *
     * The id of the form on wordpress
     *
     * @var int $id
     */
    protected $id;



    /**
     *
     * @since 1.0.0
     *
     * The object of the form
     *
     * @var EF_Form form
     *
     *
     */
    protected $form;

    /**
     * @since 1.0.0
     *
     * The WP_Post object of the form
     *
     * @var WP_Post $post
     */
    protected $post;


    /**
     * @since 1.0.0
     *
     * The id of the post or user you want to update
     *
     * @var int $post_id
     */
    protected $post_id;

    /**
     * @since 1.0.0
     *
     * Attributes of the form
     *
     * @var array
     */
    protected $attributes = array();


    /**
     * @since 1.0.0
     *
     * Attributes of the form
     *
     * @var array
     */
    protected $settings = array();


    /**
     * @since 1.0.0
     *
     * All inputs of the form
     *
     * @var array
     */
    protected $inputs = array();


    /**
     * @since 1.0.0
     *
     * All data from the form
     *
     * @var array
     */
    protected $data = array();

    /**
     * WP_Form2 constructor.
     * @param $id
     * @param null $post_id
     *
     * @since 1.0.0
     */
    public function __construct($id,$post_id = null)
    {
        $this->id = $id;
        $this->post_id = $post_id;
        $this->data = $_POST;


        /** @var boolean|WP_Error $loaded */
        $loaded = $this->loadPost();

        if(is_wp_error($loaded)){
            return $loaded;
        }

        try {
            /** @var boolean|WP_Error $created */
            $created = $this->createForm();

            if(is_wp_error($created)){
                return $created;
            }

        }catch (Exception $e) {
            return new WP_Error(666,$e->getMessage(),$e);
        }

        if(isset($this->data) && !empty($this->data)){
            return $this->form->submit($this->data);
        }

        return false;
    }


    /**
     *
     * @since 1.0.0
     *
     * Load the post from the database
     *
     * @return WP_Error|true
     */
    protected function loadPost()
    {
        // Sanitize the id
        $this->id = (int)$this->id == 0 ? $this->id : (int)$this->id;

        if(is_string($this->id)) {
            $args = array(
                'name'        => filter_var($this->id,FILTER_SANITIZE_STRING),
                'post_type'   => EF_get_post_type(),
                'post_status' => 'publish',
                'numberposts' => 1
            );

            $my_posts = get_posts($args);
            if( $my_posts ) {
                $this->post = $my_posts[0];
                $this->id = $this->post->ID;
            }else{
                $this->form = new EF_Post_Form();
                $this->form->setError(__(sprintf("No form found with the id %s",$this->id),EF_get_domain()));
                return new WP_Error(666,__(sprintf("No form found with the id %s",$this->id)));
            }
        }

        else if(is_numeric($this->id)){
            $this->post = get_post($this->id);
        }else{
            $this->form = new EF_Post_Form();
            $this->form->setError(__(sprintf("The id must be a string or an integer %s got ",gettype($this->id)),EF_get_domain()));
            return new WP_Error(666,__(sprintf("The id must be a string or an integer %s got ",gettype($this->id)),EF_get_domain()));
        }

        if(!is_object($this->post)|| $this->post->post_type !== EF_get_post_type()){
            $this->form = new EF_Post_Form();
            $this->form->setError(__(sprintf("No form found with the id %s",$this->id),EF_get_domain()));
            return new WP_Error(666,__(sprintf("No form found with the id %s",$this->id),EF_get_domain()));
        }


        $this->attributes = get_post_meta($this->id,'ef-attributes',true);
        $this->settings = get_post_meta($this->id,'ef-settings',true);

        $this->inputs = get_post_meta($this->id,'ef-inputs');

        return true;
    }


    /**
     *
     * Create the form according to the data
     *
     * @since 1.0.0
     *
     * @return bool|WP_Error
     *
     * @throws Exception
     */
    protected function createForm()
    {

        // Get the type from setting

        $form_type =  isset($this->settings['type']) ? $this->settings['type'] : false;

        $forms = EF_get_registered_forms();


        if(isset($forms[$form_type])){
            $className = $forms[$form_type]['class'];
        }else{
            $this->form = new EF_Post_Form();
            $this->form->setError(__(sprintf('Form type %s does not exist',$form_type),EF_get_domain()));
            return new WP_Error(666,__(sprintf('Form type %s does not exist or has not been registered',$form_type),EF_get_domain()));
        }

        // Create the form
        $this->form = new $className(
            $this->id,
            $this->attributes,
            $this->settings,
            $this->data
        );

        $inputs = EF_get_registered_inputs();


        $settings = array(
            'display-errors' => $this->form->getSetting('display-errors'),
            'errors-before' => $this->form->getSetting('errors-before'),
        );

        foreach ($this->inputs as $input){

            $input = json_decode($input,true);

            if(!isset($input['attributes']))
                continue;



            if(isset($inputs[$input['attributes']['type']])) {
                $inputName = $inputs[$input['attributes']['type']]['class'];
            }else{
                $inputName = $inputs[EF_Input::$_TYPE]['class'];
                $this->form->setError(__(sprintf('Form field %s does not exist or has not been registered',$input['attributes']['type']),EF_get_domain()));
            }
            $inputObj = new $inputName(
                $this->form->getUniqId(),
                $input['attributes'],
                array_merge($input['settings'],$settings),
                $this->data
            );

            $this->form->addInput($inputObj);
        }

        return true;
    }


    /**
     *
     * @since 1.0.0
     *
     * Display the form
     *
     * @return string
     */
    public function __toString()
    {
        return $this->form->__toString();
    }


    /**
     *
     * @since 1.0.0
     *
     * Return the form serialized
     *
     * @return array
     */
    public function jsonSerialize()
    {
        return array_merge( array(
            'post_name' => $this->post->post_name,
            'post_title' => $this->post->post_title,
            'post_status' => $this->post->post_status
        ), $this->form->jsonSerialize()
        );
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }


    /**
     *
     *
     *
     * @return string
     */
    public function open()
    {
        return $this->form->open();
    }


    /**
     * Return the form closing string
     *
     * @since 1.0.0
     */
    public function get_close()
    {

        $template = '';

        foreach($this->form->getInputs() as $input){
            $template .= $this->get_field($input->getName())->__toString();
        }
        $template .= $this->form->close();

        return $template;
    }

    /**
     * Close the form
     *
     * @since 1.0.0
     */
    public function close()
    {
        echo $this->get_close();
    }


    /**
     * @since 1.0.0
     *
     * Return a specific field
     *
     * @param $name
     * @param null $field
     * @return bool|EF_Input
     */
    public function get_field($name,$field = null)
    {
        return $this->form->getField($name,$field);
    }

    /**
     * @since 1.0.0
     *
     * Return the form type
     */
    public function get_type()
    {
        return $this->form->getType();
    }

    /**
     * @since 1.0.0
     *
     * Return all the fields
     *
     *
     * @return bool|EF_Input[]
     */
    public function get_fields()
    {
        return $this->form->getInputs();
    }


    /**
     * @since 1.0.0
     *
     * Return if a form has the fields
     *
     * @param $key : string
     *
     * @return bool|EF_Input[]
     */
    public function has_field($key)
    {
        return $this->form->hasInput($key);
    }


    /**
     * @since 1.0.0
     *
     * Return the form
     *
     *
     * @return EF_Form
     */
    public function get_form()
    {
        return $this->form;
    }


    /**
     * @since 1.0.0
     *
     * Return the unique id of the form
     *
     * @return string
     */
    public function getUniqId()
    {
        return $this->form->getUniqId();
    }



    /**
     * @since V 0.1
     *
     * Return if form has an error
     *
     * @return bool
     */
    public function hasError()
    {
        return $this->form->hasError();
    }



    /**
     * @since V 0.1
     *
     * @update : 1.0.0
     *
     * Displays the error
     */
    public function theError()
    {
        echo $this->form->getError();
    }




    /**
     *
     * @since V 0.1
     *
     * Return the error
     *
     * @return bool
     */
    public function getError()
    {
        return $this->form->getError();
    }





    /**
     *
     * @since V 0.1
     *
     * @Updated : V 0.5.5 (Add $unset var)
     *          : 1.0.0 Update new structure
     *
     * Return if the form has been send. It can be used only once, except if you put $unset to false
     *
     *
     * @param bool $unset if true, the var will be unset and if you call hasBeenSend after, it will return false
     * @return bool
     */
    public function hasBeenSend($unset = true)
    {
        return $this->form->hasBeenSend($this->getId(),$unset);
    }




    /**
     *
     * @deprecated 1.0.0
     *
     * @since V 0.3
     *
     *
     * display the open form template
     *
     */
    public function open_the_form()
    {
        echo $this->open();
    }





    /**
     *
     * @since V 0.3
     *
     * @deprecated 1.0.0
     *
     * @Updated : V 0.5.4 (Handle the 2nd parameters ti display only a part of the field (label,error,field) )
     *
     * Display a form field
     *
     * @param $name string The name of the field
     * @param $field null | string
     */
    public function the_form_field($name,$field = null)
    {
        $this->get_field($name,$field);
    }


    /**
     *
     * @since V 0.3
     *
     * @deprecated 1.0.0
     *
     *
     * @Updated : V 0.5.4 (Handle the 2nd parameters ti display only a part of the field (label,error,field) )
     *
     * Return a form field
     *
     * @param $name
     * @param $field null | string
     * @return bool | string
     */
    public function get_form_field($name,$field = null)
    {
        return $this->get_field($name,$field);
    }

    /**
     *
     * @since V 0.3
     *
     * Return the end of the form
     *
     * @return string
     */
    public function get_close_the_form()
    {
        return $this->get_close();
    }

    /**
     * @deprecated 1.0.0
     *
     * @since V 0.3
     *
     * Display the end of the form
     */
    public function close_the_form()
    {
        $this->close();
    }


    /**
     * @deprecated 1.0.0
     *
     * Return the form uniqId
     *
     * @since V 0.4
     *
     * @return string
     */
    public function get_form_uniqId()
    {
        return $this->form->getUniqId();
    }


    /**
     * @deprecated 1.0.0
     *
     * Display the form uniqId
     *
     * @since V 0.4
     */
    public function the_form_uniqId()
    {
        echo $this->form->getUniqId();
    }





}