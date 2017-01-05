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

    protected $type = 'post';

    /**
     * Required fields for a create
     *
     * @since 1.0.0
     *
     * @var array
     */
    protected $requiredFields = [
        'title',
    ];


    /**
     * Default settings for the post
     *
     * @since 1.0.0
     *
     * @var array
     */
    protected $defaultSettings = [
        'post_type' => 'post',
        'post_status' => 'publish',
        'default-class' => 'form-control',
    ];


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


        // If you update, no field is required
        if($this->getSetting('id')) {
            $this->requiredFields = [];
        }

        if(!$this->isValid($data))
            return false;

        do_action('form/BeforeInsertOrModifyPost', $data);
        do_action('form/BeforeInsertOrModifyPost-' . $this->getId(), $data);

        // If it's an update
        if($this->getSetting('id')){
            // Update the post
            do_action('form/BeforeModifyPost', $data);
            do_action('form/BeforeModifyPost-' . $this->getId(), $data);
            $the_post  = $this->update($data);
            do_action('form/AfterModifyPost', $the_post );
            do_action('form/AfterModifyPost-' . $this->getId(), $the_post);


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

        $remove = [
            '_nonce',
            '_time',
            '_antispam',
            'title',
            'content',
            'content',
            '_uniqid'
        ];

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


}