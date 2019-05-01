<?php


/**
 * Class EF_Lead
 */
class EF_Lead implements JsonSerializable
{


    public static $_POST_TYPE = 'ef_leads';

    /**
     * @var int the Id of the meta field
     */
    public $post_id;


    /**
     * @var int The form id of the lead
     */
    public $form_id;


    /**
     * @var array All the data linked to the lead
     */
    protected $data = array();


    /**
     * EF_Lead constructor.
     *
     * @param null $post_id
     * @param null $form_id
     * @param array $data
     */
    public function __construct($post_id = null,$form_id = null,$data = array())
    {
        if($post_id) {
            $lead = get_post($post_id);

            $data = json_decode($lead->post_content,true);

            $this->form_id = $lead->post_parent;

            $this->post_id = $lead->ID;

            $this->data = $data;
        }

        if($form_id) {
            $this->form_id = $form_id;
        }

        if($data) {
            $this->setData($data);
        }


    }


    /**
     * @param $key
     * @return mixed|null
     */
    public function getValue($key)
    {

        if(isset($this->data[$key])) {
            return $this->data[$key];
        }

        return null;

    }

    public function getPostData()
    {
        return array(
            'post_content' => addslashes(json_encode($this->getData())),
            'post_title' => uniqid(),
            'post_parent' => $this->form_id,
            'post_type' => self::$_POST_TYPE,
            'post_status' => 'publish'
        );
    }


    /**
     * @param $data array the data to set to the Lead
     */
    public function setData($data = array())
    {

        $this->data = $data;

    }


    /**
     * @return WP_Error|int
     */
    public function save()
    {

        if(empty($this->form_id)) {
            return new WP_Error(666,__('You must set a form id to a lead so you can save it','easy-form'));
        }

        if($this->post_id) {
            $post_id = wp_update_post($this->getPostData());
        } else {
            $post_id = wp_insert_post($this->getPostData());
        }

        if(false === $post_id) {
            return new WP_Error(666,__('An error occurred while saving the lead, please try again later','easy-form'));
        }

        $this->post_id = $post_id;

        return $post_id;

    }


    /**
     * @return array
     */
    public function getData()
    {
        return $this->data;
    }


    /**
     * @return array|mixed
     */
    public function jsonSerialize()
    {
        return array(
                'meta_id' => $this->post_id,
                'form_id' => $this->form_id,
                'data' => $this->getData(),
            );
    }

}