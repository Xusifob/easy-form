<?php


/**
 *
 * @since 1.0.0
 *
 * Fom class to create a WP_Post
 *
 * Class EF_Post_Form
 */
class EF_Post_Form extends EF_Form
{


    /**
     * @var string
     */
    public static $_TYPE = 'post';



    /**
     * Required fields for a create
     *
     * @since 1.0.0
     *
     * @var array
     */
    public static $_REQUIRED_FIELDS = array(
        'post_title',
    );


    /**
     * @var array
     */
    public static $_POSSIBLE_FIELDS = array(
        'post_content',
        'attachment'
    );


    /**
     * Default settings for the post
     *
     * @since 1.0.0
     *
     * @var array
     */
    protected $defaultSettings = array(
        'post_type' => 'post',
        'post_status' => 'publish',
        'default-class' => 'form-control',
    );


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


        $required = true;
        // If you update, no field is required
        if($this->isUpdate()) {
            $required = false;
        }

        if(!$this->isValid($data,$required))
            return false;

        do_action('form/BeforeInsertOrModifyPost', $data);
        do_action('form/BeforeInsertOrModifyPost-' . $this->getId(), $data);

        // If it's an update
        if($this->isUpdate()){
            // Update the post
            do_action('form/BeforeModifyPost', $data);
            do_action('form/BeforeModifyPost-' . $this->getId(), $data);
            $the_post_id  = $this->update($data);
            do_action('form/AfterModifyPost', $the_post_id );
            do_action('form/AfterModifyPost-' . $this->getId(), $the_post_id);

        } else{
            // Register the user
            do_action('form/BeforeInsertPost', $data);
            do_action('form/BeforeInsertPost-' . $this->getId(), $data);
            $the_post_id = $this->create($data);
            do_action('form/AfterInsertPost', $the_post_id );
            do_action('form/AfterInsertPost-' . $this->getId(), $the_post_id );
        }


        if($the_post_id  == false)
            return false;

        self::addMetaData(get_post( $the_post_id ),$data);

        do_action('form/AfterInsertOrModifyPost', $the_post_id );
        do_action('form/AfterInsertOrModifyPost-' . $this->getId(), $the_post_id );


        $this->setFormSend($the_post_id);

        // Redirect the user
        $this->redirect($the_post_id);
        return true;
    }




    /**
     *
     * @since 1.0.0
     *
     * Add the meta data for the post
     *
     * @param WP_Post $the_post
     * @param array $data
     */
    protected function addMetaData(WP_Post $the_post,$data){

        $remove = array(
            '_nonce',
            '_time',
            '_antispam',
            'title',
            'content',
            'content',
            '_uniqid'
        );

        foreach($this->getInputs(true) as $input){
            if(in_array($input->getName(),$remove))
                continue;


            if('file' === $input->getType()){
                /** @var EF_File_Input $input  */
                $input->insert($the_post->ID);
                continue;
            }

            // Handle multiple elements
            if($input->getAttribute('multiple') === true && is_array($data[$input->getName()])) {
                foreach ($data[$input->getName()] as $val) {
                    add_post_meta($the_post->ID,$input->getName(), $val);
                }
            }else{
                update_post_meta($the_post->ID,$input->getName(), $data[$input->getName()]);
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
     * @return bool|int
     */
    public function create($data){


        $postData  = self::preparePostData($data);

        $my_post = wp_insert_post($postData);

        if (is_wp_error($my_post)) {
            $this->setError($my_post->get_error_message());

            return false;
        } else {
            return $my_post;
        }
    }


    /**
     * @since 1.0.0
     *
     * Prepare the data to be inserted in the db
     *
     * @param $data
     * @param $postData
     * @return mixed
     */
    private function preparePostData($data,$postData = [])
    {

        if(isset($data['content'])) {
            $postData['post_content'] = $data['content'];
        }

        if(isset($data['title'])) {
            $postData['post_title'] = $data['title'];
        }


        $postData['post_type'] = $this->getSetting('post_type');
        $postData['post_status'] = $this->getSetting('post_status');

        if(isset($data['title']))
            $postData['post_name'] = sanitize_title($data['title']);

        return $postData;
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

        $postData = [
            'ID' => $this->getSetting('id'),
        ];

        $postData = self::preparePostData($data,$postData);

        $the_post = wp_update_post($postData);

        if (is_wp_error($the_post)) {
            $this->setError($the_post->get_error_message());

            return false;
        } else {
            return $the_post;
        }
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
            $post_id = $_GET['post_id'];
        }

        if(!$post_id || !is_numeric($post_id)) {
            return;
        }

        $post = get_post($post_id);

        // Post update is only available for logged in users
        if(!is_user_logged_in()) {
            $this->setError(__('For security reasons, post update is only available for logged in users',EF_get_domain()));
            return;
        }

        if($post->post_type != $this->getSetting('post_type')) {
            $this->setError(__('The type of post selected is not the same as the one you are trying to update',EF_get_domain()));
            return;
        }

        $this->addSetting('id',$post_id);


        // Transform the post from object to array
        $data = json_decode(json_encode($post),true);


        $metas = get_post_meta($post_id);

        foreach($metas as $key => $meta) {
            $data[$key] = $meta[0];
        }

        $this->data = $data;

    }


    public static function register()
    {
        add_filter('EF_available_forms',function($forms){
            $forms[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('Create a post','easy-form'),
                'class' => self::class,
                'required' => self::$_REQUIRED_FIELDS,
                'possible' => self::$_POSSIBLE_FIELDS,
            );

            return $forms;
        });


        add_filter('EF_fields_default_inputs',function($inputs) {

            $inputs['post_title'] = EF_Input::$_TYPE;
            $inputs['post_content'] = EF_Editor_Input::$_TYPE;
            $inputs['attachment'] = EF_File_Input::$_TYPE;

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


    /**
     * @return array
     */
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