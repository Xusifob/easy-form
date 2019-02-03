<?php


/**
 * Class EF_Lead
 */
class EF_Lead implements JsonSerializable
{

    public static $_STATUS_DELETED = 0;

    public static $_STATUS_ACTIVE = 1;

    public static $_META_KEY = 'ef_leads';


    /**
     * @var int the Id of the meta field
     */
    public $meta_id;


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
     * @param null $meta_id
     * @param null $form_id
     * @param array $data
     */
    public function __construct($meta_id = null,$form_id = null,$data = array())
    {
        if($meta_id) {
            $meta = get_meta_from_id($meta_id);

            $data = unserialize($meta->meta_value);

            $this->form_id = $meta->post_id;

            $this->meta_id = $meta_id;
        }

        if($form_id) {
            $this->form_id = $form_id;
        }

        if($data) {
            $this->setData($data);
        }
    }


    /**
     * @param $data array the data to set to the Lead
     */
    public function setData($data = array())
    {

        if(!isset($data['created_date'])) {
            $data['created_date'] = date('c');
        } else {
            $data['updated_date'] = date('c');
        }

        if(!isset($data['status'])) {
            $data['status'] = self::$_STATUS_ACTIVE;
        }

        $this->data = $data;

    }


    /**
     * @return WP_Error|int
     */
    public function save()
    {

        if(empty($this->form_id)) {
            return new WP_Error(666,__('You must set a form id to a lead so you can save it',EF_get_domain()));
        }

        $meta_id = add_post_meta($this->form_id,self::$_META_KEY,$this->getData());

        if(false === $meta_id) {
            return new WP_Error(666,__('An error occurred while saving the lead, please try again later',EF_get_domain()));
        }

        $this->meta_id = $meta_id;

        return $meta_id;

    }


    public function getData()
    {
        return $this->data;
    }


    public function jsonSerialize()
    {
        return array(
                'meta_id' => $this->meta_id,
                'form_id' => $this->form_id,
                'data' => $this->getData(),
            );
    }

}