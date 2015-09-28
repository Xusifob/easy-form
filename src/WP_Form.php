<?php

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
     * Constructor
     *
     * @param $formId
     * @param null $postId
     */
    public function __construct($formId,$postId = null)
    {

        if(is_numeric($formId)){
            $form = get_post($formId);

            if($form->post_type == 'form-plugin-bastien'){

                // All form metas
                $formMetas = get_post_meta($formId);

                // All args
                $formArgs = get_post_meta($formId,'form-args')[0];




                $formArgs['postId'] = $postId;
                /** @since V 0.4 */
                $formArgs['formId'] = $formId;
                $formArgs['formType'] = get_post_meta($formId,'form-type')[0];
                $formArgs['lien'] = get_post_meta($this->formId,'form-redirect')[0];

                $form = new FormWordpress($form->post_name,$formMetas['action'][0],$formArgs);
                $this->formId = $formId;
                $this->form = $form;
                $this->postId = $postId;

                // All fields
                $this->setFields();

                // Close the form
                $this->closeForm();

                // I check the form
                $this->CheckForm();

                return true;

            }else{
                return new WP_Error(123,"Le post n°$formId n'est pas un formulaire");
            }
        }else{
            return new WP_Error(123,"L'id $formId doit être un int");
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
     * @Modified : V 0.4
     *
     * Check if form is valid and send datas
     */
    private function CheckForm()
    {
        // If form is valid
        if($this->form->isValid()){
            $formType = get_post_meta($this->formId,'form-type')[0];

            $lien = get_post_meta($this->formId,'form-redirect')[0];

            /* @Modified V 0.4 */
            $argsMeta = get_post_meta($this->formId,'form-send-args');
            $args = !empty($argsMeta) ? get_post_meta($this->formId,'form-send-args')[0] : '';

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
     * Return if the form has been send
     *
     * @return bool
     */
    public function hasBeenSend()
    {
        return $this->form->hasBeenSend($this->postId);
    }


    /**
     *
     * @since V 0.3
     *
     * Return a form field
     *
     * @param $name
     * @return bool
     */
    public function get_form_field($name)
    {
        $this->form->get_form_field($name);
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
     * Display a form field
     *
     * @param $name
     */
    public function the_form_field($name)
    {
        $this->form->the_form_field($name);
    }

    /**
     *
     * @since V 0.3
     *
     * Return the open form
     *
     * @return bool
     */
    public function get_open_the_form()
    {
        return $this->form->get_open_the_form();
    }

    /**
     *
     * @since V 0.3
     *
     * Display the open form
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


}