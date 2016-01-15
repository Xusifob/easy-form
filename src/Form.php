<?php


/**
 *
 * used to create form
 *
 * Class Form
 */
class Form
{
    /**
     * All fields content in the form
     *
     * @var array
     */
    protected $fields = [];

    /**
     * This is an array which comport the form
     *
     * @var array
     */
    protected $template = [];


    /**
     *
     * This is the default class which will be added to every form component (input, selects...)
     *
     * @var string
     */
    protected $defaultclass;

    /**
     * @var bool
     */
    protected $formFinish = false;

    /**
     * @var array
     */
    protected $containers = [];

    /**
     * @var null|array
     */
    protected $postArgs = null;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $error;

    /**
     * @var array
     */
    protected $errors = [];


    /**
     * @var array
     */
    protected $args = [];


    /**
     * This is the action of the form
     *
     * @var string
     */
    protected $action;


    /**
     * a uniqId to avoid bug when there is multiples version of the same form in the page
     *
     * @since V 0.4
     *
     * @var string
     */
    protected $uniqId;


    /**
     *
     * @since V 0.1
     *
     * @var array
     */
    protected $errorMessages = [];

    /**
     * @Since V 0.1
     *
     * @Modified :  - V 0.2
     *              - V 0.3
     *              - V 0.4
     *              - V 0.5
     *
     *
     * Constructor
     *
     * @param string $name
     * @param string $action
     * @param array $args
     */
    public function __construct($name,$action = '#',$args = [])
    {

        $fr = file_get_contents(__DIR__ . '/../assets/langs/fr.json');

        $this->errorMessages = json_decode($fr,true);

        // Args action & name
        $this->action = $action;
        $this->args['defaultclass'] = isset($args['defaultClass']) ? $args['defaultClass'] : '';
        $this->args['displayErrors'] = isset($args['displayErrors']) ? $args['displayErrors'] : '';




        $this->name = $name;
        $this->uniqId = uniqid();


        // Save post Id
        if(isset($args['postId']))
            $this->postArgs['id'] = $args['postId'];

        // Save post Type
        if(isset($args['formType']))
            $this->postArgs['formType'] = $args['formType'];

        if($this->isResetForm() && $this->resetArgsAvailable()){
            $this->args['submitValue'] = isset($args['form-send-args']['submitValue']) ? $args['form-send-args']['submitValue'] : null;
        }

        $template = '<form action="'. $this->action .'" ';
        $template .= $this->classAndId($args);
        $template .= isset($args['enctype']) ? 'enctype="' . $args['enctype'] . ' "' : 'enctype="multipart/form-data" ';
        $template .= isset($args['method']) ? 'method="' . $args['method'] . '" ' : 'method="POST"';
        $template .= '>';

        // Add Security Nounce
        $nonce = wp_create_nonce($this->name);

        $template .= '<input type="hidden" name="_nounce" value="' . $nonce . '" >';
        $template .= '<input type="hidden" name="_time" value="' . microtime(true) . '" >';

        $template .="
<style>.antispam{display: none !important;}</style>
<input type='text' name='url-antispam' class='antispam' id='antispam-$this->uniqId'>
                    <label for='antispam-$this->uniqId' class='antispam'>Do not type anything here</label>";

        $this->template['open_the_form'] = $template;
    }



    /**
     *
     * @Since V 0.1
     *
     * Creates a container around a field
     *
     * @param $container
     * @param array $args
     * @return $this
     */
    public function openContainer($container,$args = [])
    {
        if(!$this->formFinish) {
            $template = '<' . $container . ' ';
            $template .= $this->classAndId($args);
            $template .= '>';
            array_push($this->template, $template);
            array_push($this->containers,$container);
        }
        return $this;
    }

    /**
     *
     * @Since V 0.1
     *
     * Closes a container around a field
     *
     * @return $this
     */
    public function closeContainer()
    {
        if(!$this->formFinish) {
            $container = array_pop($this->containers) ;

            if($container != null) {
                $template = '</' . $container . '>';
                array_push($this->template, $template);
            }
        }
        return $this;
    }


    /**
     *
     * @Since V 0.1
     *
     * @param string $error
     * @return $this
     */
    public function setError($error){

        $this->error = $error;
        return $this;
    }


    /**
     *
     * @Since V 0.1
     *
     * @Modified :  - V 0.2
     *              - V 0.3
     *              - V 0.4
     *
     * add a field in the form
     *
     * @param string $field
     * @param string $name
     * @param array $args
     *
     * @return $this
     */
    public function addField($field,$name,$args = [])
    {

        if (!$this->formFinish) {

            // Handle an update post
            if(null != $this->postArgs && isset($this->postArgs['id']) ) {

                // If user & post, full the form
                if($this->postArgs['formType'] == 'user' || $this->postArgs['formType'] == 'post') {

                    // If user
                    if ($this->postArgs['formType'] == 'user') {

                        // Get not metas infos
                        $notMetas = [
                            'password',
                            'email',
                            'login',
                            'url',
                            'first_name',
                            'last_name',
                            'content',
                        ];

                        // Val = info (if exists)
                        if(!in_array($name,$notMetas)) {
                            $val = get_user_meta($this->postArgs['id'], $name);
                            $val = isset($val[0]) ? $val[0] : false;
                        }
                        else{

                            // Val = info
                            $user = get_userdata($this->postArgs['id']);
                            if($name != 'password' && $name != 'repeat-password'){
                                switch($name){
                                    case 'email' :
                                        $val = $user->user_email;
                                        break;
                                    case 'url' :
                                        $val = $user->user_url;
                                        break;
                                    case 'first_name' :
                                        $val = $user->first_name;
                                        break;
                                    case 'last_name' :
                                        $val = $user->last_name;
                                        break;
                                    case 'description' :
                                        $val = FormWordpress::user_meta($this->postArgs['id'],'description');
                                        break;
                                    case 'content' :
                                        $val = FormWordpress::user_meta($this->postArgs['id'],'description');
                                        break;
                                }
                            }
                        }

                    }elseif ($this->postArgs['formType'] == 'post') {
                        $val = get_post_meta($this->postArgs['id'], $name);
                        $notMetas = ['content', 'title'];
                        // Val = info (if exists)
                        if(!in_array($name,$notMetas)) {
                            $val = get_post_meta($this->postArgs['id'], $name);
                            $val = isset($val[0]) ? $val[0] : false;
                        }else{
                            $thepost = get_post($this->postArgs['id']);

                            if($name == 'content')
                                $val = $thepost->post_content;
                            elseif($name == 'title')
                                $val = $thepost->post_title;
                        }
                    }
                }
            }


            $template = '';

            $inputs = [
                'text', 'email', 'password', 'repeatPassword', 'number', 'tel', 'date', 'checkbox', 'radio', 'url', 'range', 'color', 'search', 'hidden', 'file',
            ];

            // List of arguments
            $theClass = (isset($args['class']) && !empty($args['class'])) ? $args['class'] : $this->args['defaultclass'];
            $theId = (isset($args['id']) && !empty($args['id'])) ? $args['id'] : $name . '-' . $this->uniqId;

            // Label handling
            $theLabel = '<label for="' . $theId . '" ';
            $theLabel .= isset($args['labelClass']) && !empty($args['labelClass']) ? 'class="' . $args['labelClass'] . ' "' : (isset($args['label']) && !empty($args['label']) ? '' : 'class="sr-only" ');
            $theLabel .= '>';
            $theLabel .= isset($args['label']) && !empty($args['label']) ? $args['label'] : $name;
            $theLabel .= '</label>';
            $thePlaceholder = isset($args['placeholder']) && !empty($args['placeholder']) ? $args['placeholder'] : false;
            $theAutocomplete = isset($args['autocomplete']) && !empty($args['autocomplete']) ? $args['autocomplete'] : true;
            $theValue = htmlspecialchars(isset($args['value']) && !empty($args['value']) ? $args['value'] : ((isset($_POST[$name]) ? $_POST[$name] : ((isset($val)) ? $val : false ))));
            $theRequired = isset($args['required']) ? $args['required'] : true;


            // If it's a field input
            if (in_array($field, $inputs)) {
                // I start the field
                if (!isset($args['labelAfter']) || !$args['labelAfter'])
                    $template .= $theLabel;
                // If is a password repeater
                if ($field == 'repeatPassword')
                    $template .= '<input type="password" ';
                else
                    $template .= '<input type="' . $field . '" ';

                $template .= 'id="' . $theId . '" ';
                // Handle readonly fields
                if(!isset($args['readOnly']) || empty($args['readOnly']))
                    $template .= isset($args['multiple']) && $args['multiple'] && $field == 'file' ? 'name="' . $name . '[]" ' : 'name="' . $name . '" ';
                else
                    $template .= ' readonly disabled ';

                $template .= 'class="' . $theClass . '" ';
                $template .= isset($args['multiple']) && $args['multiple'] && $field == 'file' ? 'multiple ' : '';
                $template .= $thePlaceholder ? 'placeholder="' . $thePlaceholder . '" ' : '';
                if($field != 'file') {
                    if (!is_wp_error($theValue))
                        $template .= $theValue ? 'value="' . $theValue . '" ' : '';
                    else
                        $this->setError('Un ou plusieurs champ est incorrect');
                }
                $template .= $theAutocomplete ? 'autocomplete="' . $theAutocomplete . '" ' : '';

                // Handle checked
                if ($field == 'checkbox') {
                    $template .= (isset($args['checked']) && $args['checked'] == true) ? 'checked ' : '';
                }
                $template .= $theRequired ? 'required' : '';
                $template .= '>';

                if($field == 'file' && isset($val) && $args['multiple'] && !is_wp_error($val)){
                    $template .= '<input type="hidden" value="'. implode(',',$val) .'" name="'.$name . '-values">';
                }

                //DEPRECIATED WILL BE REMOVES
                // Second field password
                if ($field == 'password' && isset($args['multiple']) && $args['multiple'] == true) {
                    $template .= '<input type="' . $field . '"';
                    $template .= 'id="' . $theId . '-2"';
                    $template .= 'name="' . $name . '-2"';
                    $template .= 'class="' . $theClass . '"';
                    $template .= $thePlaceholder ? 'placeholder="' . $thePlaceholder . '"' : '';
                    $template .= $theValue ? 'value="' . $theValue . '"' : '';
                    $template .= $theRequired ? 'required' : '';
                    $template .= '>';
                }
                // DEPRECIATED

                if (isset($args['labelAfter']) && $args['labelAfter'])
                    $template .= $theLabel;


            } else {
                switch ($field) {
                    case 'select':

                        $template .= '<select ';
                        $template .= 'id="' . $theId . '" ';

                        // Handle multiple
                        if (isset($args['multiple']) && true == $args['multiple'])
                            $template .= 'name="' . $name . '[]" ';
                        else
                            $template .= 'name="' . $name . '" ';
                        $template .= 'class="' . $theClass . '"';
                        $template .= $thePlaceholder ? 'placeholder="' . $thePlaceholder . '" ' : '';
                        $template .= $theRequired ? 'required ' : '';
                        $template .= '>';

                        // Display all options
                        if (is_array($args['options'])):

                            if(isset($args['orderBy'])){
                                switch($args['orderBy']){
                                    case 'croissant' :
                                        asort($args['options']);
                                        break;
                                    case 'decroissant' :
                                        arsort($args['options']);
                                        break;
                                }
                            }
                            foreach ($args['options'] as $option) {
                                $template .= '<option value="' . $option['value'] . '" ';

                                // Handle the selection
                                if(isset($val) && !empty($val)){
                                    if($option['value'] == $val)
                                        $template .= 'selected';

                                }elseif(isset($option['select']) && ($option['select']))
                                    $template .= 'selected';

                                $template .= ">";
                                $template .= $option['content'];
                                $template .= '</option>';
                            }
                        endif;
                        $template .= '</select>';
                        break;

                    case 'taxonomy':

                        // prevent old version
                        $args['taxonomyType'] = isset($args['taxonomyType']) ? $args['taxonomyType'] : 'select';

                        switch($args['taxonomyType']){
                            case 'select' :
                                $template .= '<select ';
                                $template .= 'id="' . $theId . '" ';


                                $template .= 'name="' . $name . '" ';
                                $template .= 'class="' . $theClass . '"';
                                $template .= $thePlaceholder ? 'placeholder="' . $thePlaceholder . '" ' : '';
                                $template .= $theRequired ? 'required ' : '';
                                $template .= '>';

                                $taxs = get_terms(substr($name,9),[
                                    'hide_empty' => false,
                                ]);

                                // Display all options
                                if (is_array($taxs)):
                                    if(isset($args['emptyField']) && !empty($args['emptyField']))
                                        $template .= '<option>'. $args['emptyField'] .'</option>';
                                    foreach ($taxs as $option) {
                                        $template .= '<option value="' . $option->slug . '" ';

                                        // Handle the selection
                                        if (isset($val) && !empty($val)) {
                                            if ($option->slug == $val)
                                                $template .= 'selected';
                                        }
                                        $template .= ">";
                                        $template .= $option->name;
                                        $template .= '</option>';
                                    }
                                endif;
                                $template .= '</select>';
                                break;
                            case 'hidden' :
                                $template = '<input type="hidden" name="'. $name .'" value="'. $theValue .'">';
                                break;
                        }


                        break;

                    // Display a textaera
                    case 'textarea' :
                        $template .= '<textarea ';
                        $template .= 'id="' . $theId . '" ';
                        $template .= 'name="' . $name . '" ';
                        $template .= 'class="' . $theClass . '" ';
                        $template .= isset($args['rows']) ? 'rows="' . $args['rows'] . '" ' : '';
                        $template .= isset($args['cols']) ? 'rows="' . $args['cols'] . '" ' : '';
                        $template .= $thePlaceholder ? 'placeholder="' . $thePlaceholder . '" ' : '';
                        $template .= $theRequired ? 'required ' : '';
                        $template .= '>';
                        $template .= $theValue ? $theValue : '';
                        $template .= '</textarea>';
                        break;

                    // Display a textaera
                    case 'textaera' :
                        $template .= '<textarea ';
                        $template .= 'id="' . $theId . '" ';
                        $template .= 'name="' . $name . '" ';
                        $template .= 'class="' . $theClass . '"';
                        $template .= isset($args['rows']) ? 'rows="' . $args['rows'] . '" ' : '';
                        $template .= isset($args['cols']) ? 'rows="' . $args['cols'] . '" ' : '';
                        $template .= $thePlaceholder ? 'placeholder="' . $thePlaceholder . '" ' : '';
                        $template .= $theRequired ? 'required ' : '';
                        $template .= '>';
                        $template .= $theValue ? $theValue : '';
                        $template .= '</textarea>';
                        break;

                    case 'wp_editor' :
                        $template .= $this->get_wp_editor($theValue, sanitize_title($name), [
                            'textarea_name' => $name,
                            'textarea_rows' => isset($args['rows']) ? $args['rows'] : 10,
                            'editor_class' => isset($args['class']) ? $args['class'] : '',
                            'media_buttons' => isset($args['media_buttons']) ? $args['media_buttons'] : true,
                        ]);
                        break;
                }
            }

            // Handle the radio field
            if($field == 'radio') {
                $rad = 0;

                // While there is a radio field
                while(isset($this->template[$name . '_' . $rad]))
                    $rad++;

                $pos = $this->template[$name  .'_' . $rad] = $template;

            }
            else
                $pos = $this->template[$name] = $template;

            $thefield = [
                'name' => $name,
                'type' => $field,
                'required' => $theRequired,
                'args' => $args,
            ];

            $this->fields[$name] = $thefield;
        }
        return $this;
    }

    /**
     *
     * @Since V 0.1
     *
     * @Modified : V 0.5
     *
     * @param string $submitValue
     * @param array $args
     */
    public function finishForm($submitValue = 'Send',$args = [])
    {

        if($this->isResetForm() && $this->resetArgsAvailable()){
            $submitValue = $this->args['submitValue'] == null ? $submitValue : $this->args['submitValue'];
        }


        if(!$this->formFinish) {
            $template = '<input type="submit" name="' . $this->name . '" value="' . $submitValue . '" ';
            $template .= $this->classAndId($args);
            $template .= '>';
            $this->template['submit'] = $template;

            $this->closeAllContainers();

            $this->template['close_the_form'] = '</form>';


            $this->formFinish = true;

        }
    }

    /**
     *
     * @Since V 0.1
     *
     * Add Class and Id
     *
     * @param $args
     * @return string
     */
    protected function classAndId($args)
    {

        $template = isset($args['class']) && !empty($args['class']) ? 'class="' . $args['class'] . '" ' : '';
        $template .= isset($args['id']) && !empty($args['id']) ? 'id="' . $args['id'] . '" ' : '';

        return $template;
    }


    /**
     * Return if the form is a reset one
     * @Since V 0.5
     * @return bool
     */
    public function isResetForm(){
        return (isset($this->postArgs['formType']) && $this->postArgs['formType'] == 'resetPassword');
    }

    /**
     * Return if the form reset is available
     * @Since V 0.5
     * @return bool
     */
    public function resetArgsAvailable(){
        return (isset($_GET['action']) && $_GET['action'] == 'rt' && isset($_GET['key']) && isset($_GET['login']));
    }

    /**
     * @Since V 0.1
     *
     * @Modified :  - V 0.2
     *              - V 0.5
     *
     * Display the form
     *
     * @return string
     */
    public function __toString()
    {

        $templateString = '';

        if($this->isResetForm()){
            $availableFields = [
                'open_the_form','close_the_form','submit'
            ];
            if($this->resetArgsAvailable()) {
                array_push($availableFields, 'password');
                array_push($availableFields, 'repeat-password');
            }else
                array_push($availableFields, 'login');

        }


        $f = 1;
        foreach($this->template as $key => $template){

            // Display only a part of the form
            if($this->isResetForm()){
                if(!in_array($key,$availableFields))
                    continue;
            }

            // Handle errors
            if(isset($this->args['displayErrorsBefore']) && $this->args['displayErrorsBefore'] ){
                $templateString .= $this->DisplayOneError($f);
                $templateString .= $template . "\n";
            }else{
                $templateString .= $template . "\n";
                $templateString .= $this->DisplayOneError($f);
            }

            $f++;
        }
        return $templateString;
    }

    /**
     *
     * Display one error
     *
     * @Since V 0.2
     *
     * @param $f
     * @return string
     */
    public function DisplayOneError($f)
    {
        $templateString = '';
        // If i display Errors
        if(isset($this->args['displayErrors']) && true == $this->args['displayErrors']){

            // If the field is an input
            if(isset($this->fields[$f])) {

                // If there is an error i display it
                if (isset($this->errors[$f])) {
                    $templateString .= isset($this->args['errorsClass']) ? '<span class="' . $this->args['errorsClass'] . '">' : '<span class="warning">';
                    $templateString .= $this->errors[$f] . "</span>\n";
                }
            }
        }

        return $templateString;
    }

    /**
     * @since V 0.1
     * @Modified :  - V 0.2
     *              - V 0.3
     *
     * @param $formtype
     * @return bool
     */
    public function isValid($formtype = null)
    {
        if(isset($_POST[$this->name]) && !empty($_POST[$this->name])) {

            if ( ! wp_verify_nonce( $_POST['_nounce'], $this->name ) ) {

                die(json_encode(['Wp_Form_Error' => 'Security check']));

            } else {

                if($formtype == 'reset' && $this->isResetForm() && !$this->resetArgsAvailable()) {
                    unset($this->fields['password']);
                    unset($this->fields['repeat-password']);

                }if($formtype == 'reset' && $this->isResetForm() && $this->resetArgsAvailable())
                    unset($this->fields['login']);


                $error = true;
                foreach ($this->fields as $key => $field) {

                    if (!isset($field['args']['readOnly']) || empty($field['args']['readOnly'])) {
                        // Check if isset & !empty
                        if ($field['required'] && $field['type'] != 'file') {
                            if (!isset($_POST[$field['name']]) || empty($_POST[$field['name']])) {
                                $error = false;
                                $errorMsg = $this->errorMessages['missing'];
                                $this->error = $errorMsg;
                                $this->errors[$key] = $this->errorMessages['empty'];
                            }
                        }
                        // Check if e-mail is a good e-mail format
                        switch ($field['type']) {
                            case 'email' :
                                if (!isset($_POST[$field['name']]) || !filter_var($_POST[$field['name']], FILTER_VALIDATE_EMAIL)) {
                                    $errorMsg = $this->errorMessages['email'];
                                    $error = false;
                                    $this->error = $errorMsg;
                                    $this->errors[$key] = $this->errorMessages['email'];
                                }
                                break;
                            case 'password' :
                                foreach ($this->fields as $thefield) {
                                    if ($thefield['name'] == 'repeat-' . $field['name'] && $thefield['type'] == 'repeatPassword') {
                                        if ($_POST[$thefield['name']] != $_POST[$field['name']]) {
                                            $error = false;
                                            $errorMsg = $this->errorMessages['samepassword'];
                                            $this->error = $errorMsg;
                                            $this->errors[$key] = $this->errorMessages['samepassword'];
                                        }
                                    }
                                }
                                break;
                            case 'file' :
                                // Check the file only if required or not empty
                                if (
                                    $field['required'] ||
                                    (is_array($_FILES[$field['name']]['name']) && !empty($_FILES[$field['name']]['name'][0])) ||
                                    (!is_array($_FILES[$field['name']]['name']) && !empty($_FILES[$field['name']]['name']))
                                ) {


                                    // Default extensions allowed if not in args
                                    $allowed = (isset($field['args']['allowed'][0]) && !empty($field['args']['allowed'][0])) ? $field['args']['allowed'] : ['gif', 'png', 'jpg', 'jpeg', 'pdf'];

                                    // multiple upload
                                    if (is_array($_FILES[$field['name']]['name'])) {

                                        // Foreach files, check extension
                                        for ($i = 0; $i < count($_FILES[$field['name']]['name']); $i++) {
                                            $ext = pathinfo($_FILES[$field['name']]['name'][$i], PATHINFO_EXTENSION);
                                            // if extension not in array, error
                                            if (!in_array(strtolower($ext), $allowed)) {
                                                $error = false;
                                                $errorMsg = $this->errorMessages['filetype'] . 'Les types acceptés sont : ' . implode(',', $allowed);
                                                $this->error = $errorMsg;
                                                $this->errors[$key] = $this->errorMessages['filetype'] . 'Les types acceptés sont : ' . implode(',', $allowed);
                                            }
                                        }

                                        // Single upload
                                    } else {
                                        $ext = pathinfo($_FILES[$field['name']]['name'], PATHINFO_EXTENSION);
                                        if (!in_array(strtolower($ext), $allowed)) {
                                            $error = false;
                                            $errorMsg = $this->errorMessages['filetype'] . 'Les types acceptés sont : ' . implode(',', $allowed);
                                            $this->error = $errorMsg;
                                            $this->errors[$key] = $this->errorMessages['filetype'] . 'Les types acceptés sont : ' . implode(',', $allowed);
                                        }
                                    }
                                    break;
                                }
                        }
                    }
                    return $error;
                }
            }
        }else{
            return false;
        }
    }

    /**
     *
     * @since V 0.1
     *
     * @return $this
     */
    public function closeAllContainers()
    {
        foreach($this->containers as $content){
            $this->closeContainer();
        }
        return $this;
    }


    /**
     * @return bool
     */
    public function hasError()
    {
        return isset($this->error);
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
        return $this->error;
    }

    /**
     * @since V 0.1
     *
     * @Modify : V 0.4
     *
     * Displays the error on screen
     */
    public function theError()
    {
        if($this->hasError())
            echo $this->error;
    }

    /**
     *
     * @since V 0.1
     *
     * @param $content
     * @param $editor_id
     * @param array $settings
     * @return string
     */
    private function get_wp_editor($content,$editor_id,$settings = [])
    {
        ob_start();
        wp_editor($content,$editor_id,$settings = []);
        $editor_contents = ob_get_clean();

        return $editor_contents;
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
        if(isset($this->template[$name])) {
            $template = $this->template[$name];
            unset($this->template[$name]);
            return $template;
        }else{
            return false;
        }
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
        $formField = $this->get_form_field($name);
        if($formField)
            echo $formField;
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

        return $this->get_form_field('open_the_form');
    }

    /**
     *
     * @since V 0.3
     *
     * Display the open form
     */
    public function open_the_form()
    {
        echo $this->get_open_the_form();
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
        return $this->__toString();
    }

    /**
     * @since V 0.3
     *
     * Display the end of the form
     */
    public function close_the_form()
    {
        echo $this->get_close_the_form();
    }

}