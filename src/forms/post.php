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
        '_thumbnail_id',
        'taxonomy'
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

        if(!$this->isValid($data,$required)) {
            return false;
        }

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


        $this->addTaxonomy($the_post_id,$data);

        self::addMetaData(get_post( $the_post_id ),$data);


        do_action('form/AfterInsertOrModifyPost', $the_post_id );
        do_action('form/AfterInsertOrModifyPost-' . $this->getId(), $the_post_id );


        if(!$this->hasError()) {
            $this->setFormSend($the_post_id);

            // Redirect the user
            $this->redirect($the_post_id);
            return true;
        } else {
            return false;
        }
    }


    /**
     * @param $post_id
     * @param array $data
     * @return bool
     */
    protected function addTaxonomy($post_id,$data = array())
    {
        if(empty($data)) {
            return false;
        }


        foreach($data as $key => $value) {
            if(EF_Taxonomy_Input::isTaxValue($key)) {
                $category = EF_Taxonomy_Input::getTaxValue($key);
                $result = wp_set_post_terms($post_id,$value,$category);


                if(is_wp_error($result)) {
                    $this->setError($result->get_error_message());
                    return false;
                }
                if(false === $result) {
                    $this->setError(_('An error occurred while adding the post to the taxonomy',EF_get_domain()));
                }
            }
        }

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

        $remove = apply_filters('EF_Ignore_Fields',array(
            'post_title',
            'post_content',
        ));




        // TODO, Inputize this
        foreach($this->getInputs(true) as $input){

            if(in_array($input->getName(),$remove))
                continue;


            if(EF_File_Input::$_TYPE === $input->getType()){
                /** @var EF_File_Input $input  */
                $input->insert($the_post->ID);
                continue;
            }

            if(EF_Taxonomy_Input::$_TYPE == $input->getType()) {
                if($input->getSetting('add-to-taxonomy')) {
                    continue;
                }
            }

            if(EF_Section::$_TYPE == $input->getType()) {
                continue;
            }


            $value = $input->getValueFromPostData($data);


            // Handle multiple elements
            if($input->getAttribute('multiple') == true && is_array($value)) {

                delete_post_meta($the_post->ID,$input->getName());

                foreach ($value as $val) {
                    add_post_meta($the_post->ID,$input->getName(), $val);
                }

            }else{
                update_post_meta($the_post->ID,$input->getName(), $value);
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

        if(isset($data['post_content'])) {
            $postData['post_content'] = $data['post_content'];
        }

        if(isset($data['post_title'])) {
            $postData['post_title'] = $data['post_title'];
        }


        $postData['post_type'] = $this->getSetting('post_type');
        $postData['post_status'] = $this->getSetting('post_status');

        if(isset($data['post_title']))
            $postData['post_name'] = sanitize_title($data['post_title']);

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

        if('update' === $post_id && isset($_GET['post_id'])) {
            $post_id = $_GET['post_id'];
        }

        if('from_url' === $post_id && isset($_GET['post_id'])) {
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

        if(!current_user_can('edit_published_posts')) {
            $this->setError(__('Sorry, you\'re not allowed to update this post',EF_get_domain()));

        }

        if($post->post_author !== get_current_user_id() && !current_user_can('edit_others_posts')) {
            $this->setError(__('Sorry, you\'re not allowed to update this post',EF_get_domain()));

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
            if(count($meta) == 1) {
                $data[$key] = $meta[0];
            } else {
                $data[$key] = $meta;
            }
        }

        $taxs = get_post_taxonomies($post_id);
        $terms = wp_get_post_terms($post_id,$taxs);


        /** @var WP_Term $term */
        foreach($terms as $term) {

            $key = EF_Taxonomy_Input::$_PREFIX . $term->taxonomy;

            if(!isset($data[$key])) {
                $data[$key] = array($term->term_id);
            } else {
                $data[$key][] = $term->term_id;
            }
        }

        $data = apply_filters('EF_get_post_form_data',$data);

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
            $inputs['_thumbnail_id'] = EF_File_Input::$_TYPE;

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