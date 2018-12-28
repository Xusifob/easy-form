<?php

class EF_User_Form extends EF_Form
{


    protected $requiredFields = [
        'email',
        'password'
    ];


    protected $defaultSettings = [
        'role' => 'subscriber',
        'default-class' => 'form-control',
    ];


    /**
     * @var string
     */
    public static $_TYPE = 'user';


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

//        $data['email'] = uniqid() . $data['email'];


        // If you update, no field is required
        if($this->getSetting('id')) {
            $this->requiredFields = [];
        }

        if(!$this->isValid($data))
            return false;

        do_action('form/BeforeInsertOrModifyUser', $data);
        do_action('form/BeforeInsertOrModifyUser-' . $this->getId(), $data);

        if($this->getSetting('id')){
            // Update the user
            do_action('form/BeforeModifyUser', $data);
            do_action('form/BeforeModifyUser-' . $this->getId(), $data);
            $user_id = $this->update($data);
            do_action('form/AfterModifyUser', $user_id);
            do_action('form/AfterModifyUser-' . $this->getId(), $user_id);


        } else{
            // Register the user
            do_action('form/BeforeInsertUser', $data);
            do_action('form/BeforeInsertUser-' . $this->getId(), $data);
            $user_id = $this->create($data);
            do_action('form/AfterInsertUser', $user_id);
            do_action('form/AfterInsertUser-' . $this->getId(), $user_id);
        }


        if($user_id == false)
            return false;

        $user = get_user_by('id',$user_id);

        self::addMetaData($user,$data);

        do_action('form/AfterInsertOrModifyUser', $user);
        do_action('form/AfterInsertOrModifyUser-' . $this->getId(), $user);

        //TODO Send register email

        $this->login($data);

        $this->setFormSend($user_id);

        // Redirect the user
        $this->redirect($user_id);

        return true;
    }


    /**
     *
     * Log the user
     *
     * @param $data
     */
    protected function login($data)
    {
        if($this->getSetting('autoLogin')){
            $form = new EF_Login_Form(null,$this->getAttributes());

            $login = $this->getInput('email');
            $login->setName('login');

            $this->addInput($login);

            $form->setInputs($this->getInputs());

            $this->removeInput('login');

            if(!isset($data['login'])){
                $data['login'] = $data['email'];
            }

            $form->addSetting('remember',$this->getSetting('remember'));
            $form->submit($data);

            $this->setError($form->getError());

        }
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
            'email',
            'password',
            'login',
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
     * @param $data
     * @param $userData
     * @return mixed
     */
    private static function prepareUserData($data,$userData)
    {

        if(isset($data['url'])){
            $userData['url'] = $data['url'];
        }

        if(isset($data['email'])){
            $userData['user_email'] =  $data['email'];
            $userData['user_login'] =  $data['email'];
        }

        if(isset($data['login'])){
            $userData['user_login'] = $data['login'];
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
        if(isset($data['password'])){
            $userData['user_pass'] = $data['password'];
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

        $user = get_user_by('id',$user_id);

        if (is_wp_error($user_id)) {
            $this->setError($user_id->get_error_message());

            return false;
        } else {
            self::addMetaData($user,$data);
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
                'class' => self::class
            );

            return $forms;
        });
    }


    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }

}