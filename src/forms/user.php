<?php

class EF_User_Form extends EF_User_Activation_Form
{


    public static $_REQUIRED_FIELDS = array(
        'user_email',
        'user_pass'
    );


    /**
     * @var array
     */
    public static $_POSSIBLE_FIELDS = array(
        'first_name',
        'last_name',
        'content',
        'repeat_password',
        'url',
    );




    protected $defaultSettings = array(
        'role' => 'subscriber',
        'default-class' => 'form-control',
    );


    /**
     * @var string
     */
    public static $_TYPE = 'user';


    public function __construct($id = null, array $attributes = [], array $settings = [])
    {

        parent::__construct($id, $attributes, $settings);

    }



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

        $required = $this->isUpdate() ? false  : true;

        if(!$this->isValid($data,$required)) {
            return false;
        }

        do_action('form/BeforeInsertOrModifyUser', $data,$this);

        $data = apply_filters('form/BeforeInsertOrModifyUser',$data,$this);

        $user = null;


        if($this->isUpdate()){
            // Update the user
            do_action('form/BeforeModifyUser', $data,$this);
            $user_id = $this->update($data);
            if($user_id) {
                $user = get_user_by('id', $user_id);
                self::addMetaData($user, $data);
            }
            do_action('form/AfterModifyUser', $user_id);


        } else{
            // Register the user
            do_action('form/BeforeInsertUser', $data);
            $user_id = $this->create($data);
            if($user_id) {
                $user = get_user_by('id', $user_id);
                self::addMetaData($user, $data);
            }
            do_action('form/AfterInsertUser', $user_id);
        }

        if($user_id == false || !($user instanceof WP_User)) {
            return false;
        }

        do_action('form/AfterInsertOrModifyUser', $user,$this);


        if($this->requiresEmailActivation() && !$this->isUpdate()) {

            $this->deactivateUser($user_id);

            $activated = $this->sendActivationEmail($user);


            if(!$activated) {
                $this->setError(__('The account has been created but an error occured when sending the activation email.', 'easy-form'));
                $this->activateUser($user_id);
            }


        } else {
            $this->activateUser($user_id);
        }

        if($this->login($data) && ! $this->requiresEmailActivation()){

            $this->setFormSend($user_id);

            // Redirect the user
            $this->redirect($user_id);

            return true;
        }
        return false;
    }


    /**
     *
     * Returns weither or not the form is valid
     *
     * @param $data
     * @param bool $required
     * @return bool
     */
    public function isValid($data,$required = true)
    {

        if($this->isUpdate()) {
            foreach ($this->getInputs() as &$input) {
                if($input->getType() === EF_Password_Input::$_TYPE) {
                    $input->addAttribute('required',false);
                }
            }
        }


        if(!$isValid = parent::isValid($data,$required)) {
            return $isValid;
        }

        if(!$this->isUpdate()) {

            $email = $this->getInput('user_email');
            if($email) {
                $user = get_user_by('email',$email->getValue());

                if($user instanceof WP_User) {
                    $isValid = false;
                    $this->setError(__('A user already exist with this e-mail','easy-form'));
                }
            }

            $login = $this->getInput('user_login');
            if($login) {
                $user = get_user_by('email',$email->getValue());

                if($user instanceof WP_User) {
                    $isValid = false;
                    $this->setError(__('A user already exist with this login','easy-form'));
                }
            }
        }


        return $isValid;

    }



    /**
     *
     * Load the data from the database
     *
     * @return mixed|void
     */
    public function loadData()
    {

        $post_id = $this->getSetting('update');

        if('update' === $post_id) {
            $post_id = get_current_user_id();
        }


        if('from_url' === $post_id && isset($_GET['user_id'])) {

            if(current_user_can('edit_users')) {
                $post_id = $_GET['user_id'];
            }else {
                $this->setError(__('Sorry, you\'re not allowed to update this user','easy-form'));
                return;
            }
        }


        if(!$post_id || !is_numeric($post_id)) {
            return;
        }

        $this->addSetting('id',$post_id);

        $user = get_user_by('id',$post_id);

        $data = json_decode(json_encode($user->data),true);

        unset($data['user_pass']);

        $metas = get_user_meta($post_id);

        foreach($metas as $key => $meta) {
            $data[$key] = $meta[0];
        }

        $this->data = $data;

    }



    /**
     *
     * Log the user
     *
     *
     * @param $data
     * @return bool|WP_User
     */
    protected function login($data)
    {

        if($this->isUpdate()) {
            return true;
        }


        if($this->getSetting('connexion-user')){

            $credentials = [
                'user_login' => isset($data['user_login']) ? $data['user_login'] : $data['user_email'],
                'user_pass' => $data['user_pass'],
                'remember' => true
            ];

            $usr = wp_signon($credentials);
            if (is_wp_error($usr)) {
                $this->setError(__('Invalid credentials','easy-form'));
                return false;
            } else {

                return $usr;
            }

        }
        return true;
    }




    /**
     * @param WP_User $user
     * @param array $data
     */
    protected function addMetaData(WP_User $user,$data){

        $remove = apply_filters('EF_Ignore_Fields',array(
            'user_email',
            'user_login',
            'first_name',
            'last_name',
            'url',
            'content',
        ));

        foreach($this->getInputs(true) as $key => $input){
            if(in_array($input->getName(),$remove))
                continue;


            if('file' === $input->getType()){
                /** @var EF_File_Input $input  */
                $input->insert($user->ID,'user');
            }
            else {

                $value = $input->getValueFromPostData($data);

                // Handle multiple elements
                if ($input->getAttribute('multiple') === true && is_array($value)) {
                    foreach ($value as $val) {
                        add_user_meta($user->ID, $input->getName(), $val);
                    }
                } else {
                    update_user_meta($user->ID, $input->getName(),$value);
                }
            }
        }



    }


    /**
     *
     * @Since 1.0.0
     *
     * Register the user
     *
     * @param $data
     * @return bool
     */
    public function create($data){

        $userData = [
            'role' => $this->getSetting('role'),
        ];

        $userData = self::prepareUserData($data,$userData);

        $user = wp_insert_user($userData);

        if (is_wp_error($user)) {
            $this->setError($user->get_error_message());

            return false;
        } else {
            return $user;
        }
    }


    /**
     *
     * @Since 1.1.0
     *
     * Returns if the form needs an email activation or not
     *
     * @return bool
     */
    public function requiresEmailActivation()
    {
        // The form is activation via email and the form is not an update one
        return $this->getSetting('activation-via-email') == true && !$this->isUpdate();
    }




    /**
     * @param $data
     * @param $userData
     * @return mixed
     */
    private static function prepareUserData($data,$userData)
    {

        if(isset($data['url'])){
            $userData['url'] = $data['url'];
        }

        if(isset($data['user_email'])){
            $userData['user_email'] =  $data['user_email'];
            // If it's not an update, we put the email as the login
            if(!isset($userData['ID'])) {
                $userData['user_login'] =  $data['user_email'];
            }
        }

        if(isset($data['user_login'])){
            $userData['user_login'] = $data['user_login'];
        }

        if(isset($data['first_name'])){
            $userData['first_name'] = $data['first_name'];
        }

        if(isset($data['last_name'])){
            $userData['last_name'] = $data['last_name'];
        }

        if(isset($data['content'])){
            $userData['description'] = $data['content'];
        }
        if(isset($data['user_pass'])){
            $userData['user_pass'] = $data['user_pass'];
        }

        return $userData;
    }

    /**
     *
     * @Since 1.0.0
     *
     * Register the user
     *
     * @param $data
     * @return bool
     */
    public function update($data){

        $userData = [
            'ID' => $this->getSetting('id'),
        ];


        $userData = self::prepareUserData($data,$userData);

        $userData = self::removeUnChangedData($userData);

        $user_id = wp_update_user($userData);

        if (is_wp_error($user_id)) {
            $this->setError($user_id->get_error_message());

            return false;
        } else {
            return $user_id;
        }
    }


    /**
     * @param $userData
     * @return mixed
     */
    public function removeUnchangedData($userData)
    {

        if(!isset($userData['ID'])) {
            return $userData;
        }

        $user = get_user_by('id',$userData['ID']);

        foreach($userData as $key => $datum) {

            // Always keep ID and do not change password
            if($key == "ID") {
                continue;
            }


            // If password is empty
            if($datum == "" && $key == "user_pass") {
                unset($userData[$key]);
                continue;
            }

            // If value is the same, do not update
            if($datum == $user->$key) {
                unset($userData[$key]);
                continue;
            }
        }

        return $userData;
    }


    /**
     * @since 1.0.0
     *
     * Return the list of roles
     *
     * @return array
     */
    public static function get_all_roles()
    {
        global $wp_roles;

        $rls = [];
        foreach ($wp_roles->roles as $key => $rl) {
            array_push($rls, [
                'slug' => $key,
                'name' => filter_var($rl['name'], FILTER_SANITIZE_STRING),
            ]);
        }

        return $rls;
    }

    public static function register()
    {
        add_filter('EF_available_forms',function($forms){
            $forms[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Create a user','easy-form'),
                'class' => self::class,
                'required' => self::$_REQUIRED_FIELDS,
                'possible' => self::$_POSSIBLE_FIELDS,
            );

            return $forms;
        });

        add_filter('EF_fields_default_inputs',function($inputs) {

            $inputs['user_email'] = EF_Email_Input::$_TYPE;
            $inputs['user_pass'] = EF_Password_Input::$_TYPE;
            $inputs['first_name'] = EF_Input::$_TYPE;
            $inputs['last_name'] = EF_Input::$_TYPE;
            $inputs['content'] = EF_TextArea::$_TYPE;
            $inputs['url'] = EF_URL_Input::$_TYPE;
            $inputs['repeat_password'] = EF_Password_Input::$_TYPE;

            return $inputs;

        });


    }

    /**
     * @return array
     */
    public function getRequiredFields()
    {
        return self::$_REQUIRED_FIELDS;
    }


    public function getPossibleFields()
    {
        return self::$_POSSIBLE_FIELDS;
    }


    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }


}