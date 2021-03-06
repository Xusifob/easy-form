<?php

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class WP_Form
{

    /**
     * @since V 0.1
     *
     * @var int
     */
    private $formId;

    /**
     * @since V 0.1
     *
     * @var null|int
     */
    private $postId;

    /**
     * @since V 0.1
     *
     * @var FormWordpress
     */
    private $form;


    /**
     * @since V 0.1
     *
     * @Modified :  - V 0.5
     *              - V 0.5.1 : Add support for slug
     *              - V 0.5.3 (Remove add_action for checkform)
     *
     * WP_Form constructor.
     * @param $formId int|string Id ou slug du form
     * @param null $postId
     */
    public function __construct($formId,$postId = null)
    {
        $formId = (int)$formId == 0 ? $formId : (int)$formId;


        if(is_string($formId)) {

            $args = array(
                'name'        => filter_var($formId,FILTER_SANITIZE_STRING),
                'post_type'   => 'form-plugin-bastien',
                'post_status' => 'publish',
                'numberposts' => 1
            );

            $my_posts = get_posts($args);
            if( $my_posts ) {
                $form = $my_posts[0];
                $formId = $form->ID;
            }else
                return new WP_Error(123,"Aucun formulaire n'a été trouvé avec le slug $formId");


        }elseif(is_numeric($formId)) {
            $form = get_post($formId);
        }
        else{
            return new WP_Error(123,"L'id $formId doit être un int ou une string");
        }


        if(is_object($form) && $form->post_type == 'form-plugin-bastien'){




            // All form metas
            $formMetas = get_post_meta($formId);

            // All args
            $formArgs = get_post_meta($formId,'form-args')[0];


            $formArgs['postId'] = $postId;
            /** @since V 0.4 */
            $formArgs['formId'] = $formId;
            $formArgs['formType'] = get_post_meta($formId,'form-type',true);
            $formArgs['lien'] = get_post_meta($formId,'form-redirect',true);
            $formArgs['form-send-args'] = get_post_meta($formId,'form-send-args',true);


            $form = new FormWordpress($form->post_name,$formMetas['action'][0],$formArgs);
            $this->formId = $formId;
            $this->form = $form;
            $this->postId = $postId;


            // All fields
            $this->setFields();

            // Close the form
            $this->closeForm();


            // I check the form
            /** @Since V 0.5.3 Correct bug on init */
            $this->CheckForm();
            //add_action('init',[$this,'CheckForm'],10);

            return true;

        }else{
            return new WP_Error(123,"Le post n°$formId n'est pas un formulaire");
        }
    }


    /**
     * @since V 0.1
     *
     * Set All fienlds from database
     *
     */
    private function setFields()
    {
        $fields = get_post_meta($this->formId,'form-fields')[0];
        if(is_array($fields)){
            foreach($fields as $field){
                switch ($field['type']){
                    case 'open_container' :
                        $this->form->openContainer($field['container'],$field['args']);
                        break;
                    case 'close_container' :
                        $this->form->closeContainer();
                        break;
                    case 'close_all_container' :
                        $this->form->closeAllContainers();
                        break;
                    case 'file' :
                        $this->form->addField($field['type'],$field['name'],$field['args']);
                        break;
                    default:
                        $this->form->addField($field['type'],$field['name'],$field['args']);
                        break;
                }
            }
        }
    }

    /**
     * @since V 0.1
     *
     * Close the form
     */
    private function closeForm()
    {
        $submitArgs = get_post_meta($this->formId,'form-submit-args');
        $submitValue = get_post_meta($this->formId,'form-submit-value');
        $this->form->finishForm($submitValue[0],$submitArgs[0]);
    }

    /**
     * @since V 0.1
     *
     * @return string
     */
    public function __toString()
    {
        return $this->form->__toString();
    }

    /**
     *@since V 0.1
     *
     * @Modified : - V 0.4
     *             - V 0.5
     *             - V 0.5.2
     *              - V 0.5.4 (Transform public to private)
     *
     * Check if form is valid and send datas
     */
    private function CheckForm()
    {

        if(isset($_POST['_time']) && microtime(true) - $_POST['_time'] < 1)
            die(json_encode(['Wp_Form_Error' => 'Anti Spam Triggered']));

        if(isset($_POST['url-antispam']) && !empty($_POST['url-antispam']))
            die(json_encode(['Wp_Form_Error' => 'Anti Spam Triggered']));

        /* @Modified V 0.4 */
        $argsMeta = get_post_meta($this->formId,'form-send-args');
        $args = !empty($argsMeta) ? get_post_meta($this->formId,'form-send-args',true): '';

        if(!$this->form->isResetForm())
            $this->form->CheckUnactiveUsers($args);

        $formType = $this->form->isResetForm() ? 'reset' : null;


        // If form is valid
        if($this->form->isValid($formType)){

            $formType = get_post_meta($this->formId,'form-type',true);

            $lien = get_post_meta($this->formId,'form-redirect',true);


            /* @since V 0.4 */
            $args['varURl'] = FormWordpress::post_meta($this->formId,'form-var-url');


            $lien = !empty($lien) ? (is_numeric($lien) ? get_permalink($lien) : $lien) : null;


            $this->form->SendFormAndRedirect($formType,$lien,$this->postId,$args);
        }
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
     * Displays the error
     */
    public function theError()
    {
        $this->form->theError();
    }

    /**
     *
     * @since V 0.1
     *
     * Return the error based on the asked lang
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
     *
     * Return if the form has been send. It can be used only once, except if you put $unset to false
     *
     *
     * @param bool $unset if true, the var will be unset and if you call hasBeenSend after, it will return false
     * @return bool
     */
    public function hasBeenSend($unset = true)
    {
        return $this->form->hasBeenSend($this->postId,$unset);
    }


    /**
     *
     * @since V 0.3
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
        $this->form->get_form_field($name,$field);
    }

    /**
     *
     * @since V 0.3
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
        $this->form->the_form_field($name,$field);
    }


    /**
     * Return the form uniqId
     *
     * @since V 0.4
     *
     * @return string
     */
    public function get_form_uniqId()
    {
        return $this->form->get_form_uniqId();
    }


    /**
     * Display the form uniqId
     *
     * @since V 0.4
     */
    public function the_form_uniqId()
    {
        $this->form->the_form_uniqId();
    }



    /**
     *
     * @since V 0.3
     *
     *
     * Return the open form template
     *
     * @return string the template of the form opening
     */
    public function get_open_the_form()
    {
        return $this->form->get_open_the_form();
    }


    /**
     *
     * @since V 0.3
     *
     *
     * display the open form template
     *
     */
    public function open_the_form()
    {
        $this->form->open_the_form();
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
        return $this->form->get_close_the_form();
    }

    /**
     * @since V 0.3
     *
     * Display the end of the form
     */
    public function close_the_form()
    {
        $this->form->close_the_form();
    }

    /**
     * @Since V 0.5
     *
     * @return bool
     */
    public function checkResetPage()
    {
        return $this->form->checkResetPage();
    }

    /**
     * @Since V 0.5
     *
     * @return bool
     */
    public function isResetForm()
    {
        return $this->form->isResetForm();
    }


    /**
     * @Since V 0.5
     *
     * @return bool
     */
    public function UserIsActivated()
    {
        return $this->form->UserIsActivated();
    }


    /**
     *
     * @Since V 0.5.5
     *
     * Return the stat value
     *
     * @return mixed
     */
    public function getStatValue()
    {
        return $this->form->getStatValue();
    }


    /**
     *
     * Set the stat value
     *
     * @Since V 0.5.5
     *
     * @param $statValue mixed the value to set
     * @return $this
     */
    public function setStatValue($statValue)
    {
        $this->form->setStatValue($statValue);
        return $this;
    }

}
