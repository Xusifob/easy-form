<?php

class EF_User_Form extends EF_User_Activation_Form
{


    public static $_REQUIRED_FIELDS = [
        'user_email',
        'user_pass'
    ];




    protected $defaultSettings = [
        'role' => 'subscriber',
        'default-class' => 'form-control',
    ];


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

        if(!$this->isValid($data,$required))
            return false;


        do_action('form/BeforeInsertOrModifyUser', $data);
        do_action('form/BeforeInsertOrModifyUser-' . $this->getId(), $data);

        if($this->isUpdate()){
            // Update the user
            do_action('form/BeforeModifyUser', $data);
            do_action('form/BeforeModifyUser-' . $this->getId(), $data);
            $user_id = $this->update($data);
            if($user_id) {
                $user = get_user_by('id', $user_id);
                self::addMetaData($user, $data);
            }
            do_action('form/AfterModifyUser', $user_id);
            do_action('form/AfterModifyUser-' . $this->getId(), $user_id);


        } else{
            // Register the user
            do_action('form/BeforeInsertUser', $data);
            do_action('form/BeforeInsertUser-' . $this->getId(), $data);
            $user_id = $this->create($data);
            if($user_id) {
                $user = get_user_by('id', $user_id);
                self::addMetaData($user, $data);
            }
            do_action('form/AfterInsertUser', $user_id);
            do_action('form/AfterInsertUser-' . $this->getId(), $user_id);
        }

        if($user_id == false)
            return false;

        do_action('form/AfterInsertOrModifyUser', $user);
        do_action('form/AfterInsertOrModifyUser-' . $this->getId(), $user);


        if($this->requiresEmailActivation() && !$this->isUpdate()) {

            $this->deactivateUser($user_id);

            $activated = $this->sendActivationEmail($user);


            if(!$activated) {
                $this->setError(__('The account has been created but an error occured when sending the activation email.', EF_get_domain()));
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
     * Return if the form is currently doing an update or not
     *
     * @return bool
     */
    public function isUpdate()
    {
        return $this->getSetting('id') !== false;
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

        $remove = [
            '_nonce',
            '_time',
            '_antispam',
            'user_email',
            'user_pass',
            'user_login',
            'first_name',
            'last_name',
            'url',
            'content',
            '_uniqid'
        ];

        foreach($this->getInputs(true) as $key => $input){
            if(in_array($input->getName(),$remove))
                continue;


            if('file' === $input->getType()){
                /** @var EF_File_Input $input  */
                $input->insert($user->ID,'user');
            }
            else {
                // Handle multiple elements
                if ($input->getAttribute('multiple') === true && is_array($data[$input->getName()])) {
                    foreach ($data[$input->getName()] as $val) {
                        add_user_meta($user->ID, $input->getName(), $val);
                    }
                } else {
                    update_user_meta($user->ID, $input->getName(), $data[$input->getName()]);
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
            $userData['user_login'] =  $data['user_email'];
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

        $user_id = wp_update_user($userData);


        if (is_wp_error($user_id)) {
            $this->setError($user_id->get_error_message());

            return false;
        } else {
            return $user_id;
        }
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
                'required' => self::$_REQUIRED_FIELDS
            );

            return $forms;
        });
    }

    /**
     * @return array
     */
    public function getRequiredFields()
    {
        return self::$_REQUIRED_FIELDS;
    }


    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }


}