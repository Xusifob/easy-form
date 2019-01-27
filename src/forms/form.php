<?php


/**
 * Class EF_Form
 */
abstract class EF_Form extends EF_Html_Element
{

    /**
     * @var string : Type of the current form
     */
    public static $_TYPE;


    /**
     * @var array : An array of all the fields required in the form to be functioning properly
     */
    public static $_REQUIRED_FIELDS = array();


    /**
     *
     * An array of all the fields that can be added to this post
     *
     * @Since 2.0.0
     *
     * @var array
     */
    public static $_POSSIBLE_FIELDS = array();


    /**
     * The form id
     *
     * @var int
     */
    protected $id;

    /**
     * The error of the form
     *
     * @var string
     */
    protected $error = false;


    /**
     * @var string
     */
    protected $element = 'form';

    /**
     * @var bool
     */
    protected $displayErrors = false;



    /**
     * Default HTML attributes of the form
     *
     * @var array
     */
    protected $defaultAttributes = array(
        'name' => 'form',
        'novalidate' => true
    );


    /**
     * @var array
     */
    protected $defaultSettings = array(
        'default-class' => 'form-control',
    );

    /**
     * @var string
     */
    protected $uniqId;

    /**
     * @var array
     */
    protected $inputs = array();

    /**
     * @var array
     */
    protected $settings = array();


    protected $data = array();

    /**
     * EF_Form constructor.
     * @param null $id
     * @param array $attributes
     * @param array $settings
     * @throws Exception
     */
    public function __construct($id = null,array $attributes = [],array $settings = [])
    {

        $this->setId($id);
        $this->setUniqId(uniqid());

        $this->defaultSettings['type'] = $this->getType();

        if(is_array($settings)){
            $this->setSettings(array_merge($this->defaultSettings,$settings));
        }else{
            throw new Exception(sprintf('$settings must be an array %s gotten',gettype($settings)));
        }


        $attributes['method'] = 'POST';
        $attributes['action'] = '';

        parent::__construct($attributes);

        if($this->getSetting('update')) {
            $this->loadData();
        }

        $this->createDefaultInputs();
    }


    /**
     * @param bool|false $flat
     * @return EF_Input[]
     */
    public function getInputs($flat = false)
    {

        return $flat ? array_flatten($this->inputs) : $this->inputs;
    }


    /**
     *
     * Load the data from the database in case of an update
     *
     * @return mixed
     */
    public function loadData() {}


    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }

    /**
     * Create the default inputs for the form
     */
    protected function createDefaultInputs(){

        $nonce = new EF_Nonce_Input(null,array(
            'value' => $this->getAttributes(),
        ));


        $time = new EF_Hidden_Input(null,[
            'name' => '_time',
            'value' => microtime(true),
        ]);

        $antiSpam = new EF_Input(null,[
            'name' => '_antispam',
            'class' => 'sr-only',
            'required' => false,
            'style' => 'display: none !important;',
        ]);

        $uniqId = new EF_Hidden_Input(null,[
            'name' => '_uniqid',
            'value' => $this->getUniqId(),
            'required' => false
        ]);

        $this->addInput($nonce);
        $this->addInput($time);
        $this->addInput($uniqId);
        $this->addInput($antiSpam);

    }

    /**
     * @param EF_Input[] $inputs
     * @return $this
     */
    public function setInputs($inputs)
    {
        $this->inputs = $inputs;
        return $this;
    }

    /**
     * @return string
     */
    public function getElement()
    {
        return $this->element;
    }

    /**
     * @param string $element
     */
    public function setElement($element)
    {
        $this->element = $element;
    }

    /**
     * @return string
     */
    public function getUniqId()
    {
        return $this->uniqId;
    }

    /**
     * @param string $uniqId
     */
    public function setUniqId($uniqId)
    {
        $this->uniqId = $uniqId;
    }


    /**
     *
     * @since 1.0.0
     *
     * Concat all inputs in a string
     *
     * @param null $inputs
     * @return string
     */
    protected function concatenateInputs($inputs = null)
    {
        $inputs = $inputs == null ? $this->getInputs(true) : $inputs;
        $template = '';

        if(is_array($inputs)) {
            foreach ($inputs as $input) {
                $template .= "\n" . $input . "\n";
            }
        }

        return $template;
    }


    /**
     * @param $key
     * @return bool|EF_Input
     */
    public function getInput($key){
        return isset($this->inputs[$key]) ? $this->inputs[$key] : false;
    }

    /**
     * @param $key
     * @return bool
     */
    public function hasInput($key){
        return self::getInput($key) !== false;
    }


    /**
     *
     * @since 1.0.0
     *
     * Add an input inside a form
     *
     * @param $input EF_Input
     * @return $this
     */
    public function addInput($input){

        $name = $input->getName();

        if(isset($this->data[$name])) {
            $input->addAttribute('value',$this->data[$name]);
        }

        if(preg_match('#\[\]$#',$input->getName()) || $input->getType() == 'radio') {
            $this->inputs[$input->getName()][] = $input;
        }else{
            $this->inputs[$input->getName()] = $input;
        }

        return $this;
    }


    /**
     * @param $key
     * @return $this
     */
    public function removeInput($key){
        if(isset($this->inputs[$key])){
            unset($this->inputs[$key]);
        }

        return $this;
    }

    /**
     * @return array
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * @param array $data
     */
    public function setData($data)
    {
        $this->data = $data;
    }






    /**
     * @param $key
     * @return mixed
     */
    public function getSetting($key){
        return isset($this->settings[$key]) ? $this->settings[$key] : false;
    }

    /**
     * @return array
     */
    public function getSettings()
    {
        return $this->settings;
    }

    /**
     * @param array $settings
     */
    public function setSettings($settings)
    {
        $this->settings = $settings;
    }


    /**
     * @param $key
     * @param $value
     * @return $this
     */
    public function addSetting($key,$value){
        $this->settings[$key] = $value;
        return $this;
    }



    /**
     * @since 1.0.0
     *
     * @param $name
     * @param string $item
     * @return EF_Input|bool
     */
    public function getField($name,$item = ''){

        $input = $this->getInput($name);
        $this->removeInput($name);

        //TODO Handle $item
        return $input;
    }




    /**
     * @deprecated 1.0.0
     *
     * @param $name
     * @param string $field
     *
     * @return bool|EF_Input
     */
    public function get_form_field($name,$field = ''){
        return $this->getField($name,$field);
    }


    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }



    /**
     * @param $data
     * @param $required bool, weither the required fields are required or not
     * @return bool
     */
    public function isValid($data,$required = true)
    {


        $isValid = true;


        // Verify time
        if(!isset($data['_time']) || microtime(true) - $data['_time'] < 1){
            $this->setError(__('Anti spam Triggered please try again',EF_get_domain()));
            return false;
        }

        if(isset($data['_antispam']) && !empty($data['_antispam'])){
            $this->setError(__('Anti spam Triggered please try again',EF_get_domain()));
            return false;
        }

        if($required) {
            // Check if it has the required field
            foreach($this->getRequiredFields() as $field){
                if(!$this->hasInput($field)) {
                    $this->setError(__(sprintf('The form need a field %s',$field),EF_get_domain()));
                    return false;
                }
                if($this->getInput($field)->getAttribute('required') === false){
                    $this->setError(__(sprintf('The field %s must be required',$field),EF_get_domain()));
                    return false;
                }
            }
        }

        $passwords = array();

        $password_equals = false;

        /** @var EF_Input $input */
        foreach ($this->getInputs(true) as $input){
            if (!$input->isValid($data)) {
                $isValid = false;
                $this->setError(__('One or more field is missing', EF_get_domain()));
            }

            if($input->getType() == EF_Password_Input::$_TYPE) {
                $passwords[] = $input->getValue();

                if($setting = $input->getSetting('password-equals')) {
                    $password_equals = true;
                }
            }
        }

        if($password_equals) {
            // If there are multiple values, it means that some input are not equal
            if(count(array_count_values($passwords)) > 1) {
                $isValid = false;
                $this->setError(__('All the passwords must be similar', EF_get_domain()));

            }
        }


        return $isValid;
    }


    /**
     * @return string
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * @param string $error
     */
    public function setError($error)
    {
        $this->error = $error;
    }


    /**
     * @return bool
     */
    public function hasError(){
        return $this->getError() != false;
    }


    /**
     * Set that the form has been sent
     *
     * @Since 1.0.0
     *
     * @param null $post_id
     */
    protected function setFormSend($post_id = null)
    {
        $_SESSION['form-' . $this->getId()] = true;
        if (null != $post_id)
            $_SESSION['form-' . $this->getId() . $post_id] = true;

    }

    /**
     * Return if the form has been sent
     *
     * @Since 1.0.0
     *
     *
     * @param null $postId
     * @param bool|true $unset
     * @return bool
     */
    public function hasBeenSend($postId = null, $unset = true)
    {


        // Set the key
        $key = isset($postId) && null !== $postId ? 'form-' . $this->getId() . $postId : 'form-' . $this->getId();

        // Check if the session is set
        $is_send = isset($_SESSION[$key]);

        if(!$is_send)
            return false;

        if($unset)
            unset($_SESSION[$key]);

        return !$this->hasError();
    }

    /**
     * Redirect the user to the right page after submit
     *
     * @since 1.0.0
     *
     * @param null $post_id
     */
    protected function redirect($post_id = null)
    {

        $link = $this->generateRedirectLink($post_id);

        if (!headers_sent())
            wp_redirect($link);
        else {
            echo '<script type="text/javascript">';
            echo 'window.location.href="'.$link.'";';
            echo '</script>';
            echo '<noscript>';
            echo '<meta http-equiv="refresh" content="0;url='.$link.'" />';
            echo '</noscript>';
            die();
        }
    }


    /**
     *
     * @Since 1.1.0
     *
     * Generates the link to redirect the user too
     *
     * @param null $post_id
     * @return false|int|mixed|string
     */
    protected function generateRedirectLink($post_id = null)
    {
        $redirect = $this->getSetting('redirect');
        $parameters = $this->getSetting('parameters');
        $link = '';


        // Case redirect to the new post
        if($redirect == 'newpost' && is_numeric($post_id)){
            $link = get_permalink($post_id);
        }


        // Case redirect to a specific post
        if(is_numeric($redirect) || ( is_string($redirect) && preg_match('#^[0-9]+$#',$redirect))){
            $link = get_permalink($redirect);
        }


        // Case slug
        if($link === '' && $redirect != '' && is_string($redirect)){

            $args = array(
                'name'        => $redirect,
                'post_type'   => 'post',
                'post_status' => 'publish',
                'number' => 1
            );
            $my_posts = get_posts($args);

            /** WP_Post[] $my_posts */
            if( $my_posts  && $my_posts[0] ):
                $link = get_permalink($my_posts[0]->ID);
            endif;

        }

        if($link == '') {
            $link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        }

        // Case the user entered a complete full url
        if(filter_var($redirect, FILTER_VALIDATE_URL)){
            $link = $redirect;
        }

        // If the post has parameters
        if($parameters){
            $link = $link . EF_get_link_union($link) . $parameters;
        }

        return $link;
    }


    /**
     * @since 1.0.0
     *
     * Log the statistics
     *
     */
    public function logStats()
    {

    }


    /**
     *
     * Return if the form is currently doing an update or not
     *
     * @return bool
     */
    public function isUpdate()
    {
        return $this->getSetting('id') !== false;
    }



    /**
     * Display the form
     */
    public function __toString()
    {
        $template = $this->open();

        if($this->hasError()) {
            $template .= sprintf('<p class="ef-error">%s</p>', $this->getError());
        }
        /** @var EF_Input|array $input */
        $template .= $this->concatenateInputs();

        $template .= $this->close();

        return $template;
    }


    /**
     * @return array
     */
    public function jsonSerialize()
    {
        $elem = parent::jsonSerialize();
        return array_merge($elem,[
            'settings' => $this->getSettings(),
            'type' => $this->getType(),
            'inputs' => $this->getInputs(),
        ]);
    }


    /**
     * @since 1.0.0
     *
     * Remove the default inputs
     *
     */
    public function removeDefaultFields()
    {
        $fields = [
            '_nonce',
            '_time',
            '_antispam',
            '_uniqid',
        ];

        foreach($fields as $field){
            $this->removeInput($field);
        }

    }

    /**
     *
     * Return all the required fields for the current form
     *
     * @return array
     */
    public function getRequiredFields()
    {
        return self::$_REQUIRED_FIELDS;
    }


    /**
     *
     * Return all the possible additional fields for the form
     *
     * @return array
     */
    public function getPossibleFields()
    {
        return self::$_POSSIBLE_FIELDS;
    }




    /**
     * @param $data
     * @return mixed
     */
    abstract public function submit($data);


}