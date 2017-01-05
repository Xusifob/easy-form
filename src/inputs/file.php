<?php

/**
 * Class EF_Input
 */
class EF_File_Input extends EF_Input
{


    /**
     * @var array
     */
    protected $defaultAttributes = [
        'MAX_FILE_SIZE' => 2097152, // 2Mo
        'name' => 'thumbnail',
        'required' => true,
    ];

    /**
     * @var array
     */
    protected $defaultSettings = [
        'allowed' => 'png,jpg,jpeg,pdf,gif',
    ];

    /**
     * @var string
     */
    protected $type = 'file';


    /**
     * @since 1.0.0
     *
     * Impossible to put a value back in an input file
     *
     * @param $data
     */
    public function fillValue($data)
    {
        /* @void */
    }


    /**
     *
     * @since 1.0.0
     *
     * Check if the field is valid
     *
     * @param $data
     * @return bool
     */
    public function isValid($data)
    {

        if(parent::isValid($data)){

            $value = $data[$this->getName()];


            if ($value['error'] !== UPLOAD_ERR_OK){
                return false;
            }



            if($value['size'] > $this->getAttribute('MAX_FILE_SIZE')){
                return false;
            }

            if(!in_array(pathinfo($value['name'],PATHINFO_EXTENSION),explode(',',$this->getSetting('allowed')))){
                return false;
            }

            return true;
        }


        return false;
    }


    /**
     *
     * @since 1.0.0
     *
     * Upload the image in WordPress library
     *
     * @param $post_id
     * @param array $overrides
     *
     * @return bool|int|WP_Error
     */
    public function upload($post_id, $overrides  = array( 'test_form' => false ))
    {
        // Get all images
        require_once(ABSPATH . "wp-admin" . '/includes/image.php');
        require_once(ABSPATH . "wp-admin" . '/includes/file.php');
        require_once(ABSPATH . "wp-admin" . '/includes/media.php');

        // Upload the file
        $file_id = media_handle_upload($this->getName(), $post_id,[],$overrides);

        return is_wp_error($file_id) ? false : $file_id;
    }


    /**
     *
     * @Since V 0.1
     *
     * @update 1.0.0
     *
     * Insert a file into a wp_post or a wp_user meta
     *
     *
     * @param $post_id
     * @param string $post_type
     * @param array $overrides
     *
     * @return bool|int|WP_Error
     */
    public function insert($post_id, $post_type = 'post', $overrides  = array( 'test_form' => false ))
    {

        $id = $this->upload($post_id,$overrides);

        if ($id) {
            if ('post' === $post_type) {
                if ($this->getName() == $this->defaultAttributes['name'])
                    update_post_meta($post_id, '_thumbnail_id', $id);
                else
                    update_post_meta($post_id, $this->getName(), $id);
            } else {
                update_user_meta($post_id, $this->getName(), $id);
            }
        }


        // Upload ACF type gallery
        if($this->getSetting('acf')){
            update_post_meta($post_id, '_' . $this->getName(), $this->getSetting('acf'));
        }

        return $id;
    }


}