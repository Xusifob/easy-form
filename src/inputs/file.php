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
        'MAX_FILE_SIZE' => 2, // 2Mo
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
    public static $_TYPE = 'file';


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


        // First case, no image has been uploaded
        if(!$this->hasUpload()) {

            // The image is still the same, we don't return false
            if($this->getValue() && $this->getValue() === $data[$this->getName()]) {
                return true;
            }
            // Second case, no image has been uploaded but the image has been deleted
            if($this->getValue() && $this->getValue() !== $data[$this->getName()]) {
                return true;
            }
        }


        if(!parent::isValid($_FILES)) {
            return false;
        }


        // Here the field is not required and there are no data, so GO !
        if(!$this->isRequired() && !isset($_FILES[$this->getName()])) {
            return true;
        }


        $value = $_FILES[$this->getName()];


        $result = true;

        // multiple upload
        if($this->getAttribute('multiple')) {
            for($i = 0; $i < count($value['name']); $i++) {

               $val = $this->buildFileVar($value,$i);

                $result = $this->checkValidity($val);

                if(!$result) {
                    break;
                }

            }

        } else {
            $result = $this->checkValidity($value);
        }

        return $result;

    }


    /**
     *
     * Build an array like if there was only 1 file uploaded
     *
     * @param $value
     * @param $i
     * @return array
     */
    protected function buildFileVar($value,$i)
    {

        return array(
            'name' => $value['name'][$i],
            'size' => $value['size'][$i],
            'error' => $value['error'][$i],
            'type' => $value['type'][$i],
            'tmp_name' => $value['tmp_name'][$i]
        );
    }


    /**
     * @param $value
     * @return bool
     */
    protected function checkValidity($value)
    {
        if ($value['error'] !== UPLOAD_ERR_OK){
            $this->setError(__('An error occured while uploading the file',EF_get_domain()));
            return false;
        }



        if($value['size'] > $this->getMaxSize()){
            $this->setError(__(sprintf('The file you uploaded is too big, maximum %sMB',$this->getAttribute('MAX_FILE_SIZE')),EF_get_domain()));
            return false;
        }

        if(!in_array(pathinfo($value['name'],PATHINFO_EXTENSION),explode(',',$this->getSetting('allowed')))){
            $this->setError(__(sprintf('The file you uploaded is not in the right format. Only %s accepted',$this->getSetting('allowed')),EF_get_domain()));
            return false;
        }

        return true;
    }


    /**
     * @return float|int
     */
    public function getMaxSize()
    {
        $size = $this->getAttribute('MAX_FILE_SIZE');

        return $size*1024*1024;
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
     * @return int|WP_Error
     */
    public function upload($post_id, $overrides  = array( 'test_form' => false ))
    {
        // Get all images
        if(!function_exists('wp_crop_image')) {
            require_once(ABSPATH . "wp-admin" . '/includes/image.php');
        }
        if(!function_exists('get_file_description')) {
            require_once(ABSPATH . "wp-admin" . '/includes/file.php');
        }
        if(!function_exists('media_upload_tabs')) {
            require_once(ABSPATH . "wp-admin" . '/includes/media.php');
        }

        // Upload the file
        $file_id = media_handle_upload($this->getName(), $post_id,[],$overrides);

        return $file_id;
    }


    /**
     *
     * Return weither or not there has been a new upload
     *
     * @return bool
     */
    public function hasUpload()
    {


        if(!isset($_FILES)) {
            return false;
        }

        if(!isset($_FILES[$this->getName()])) {
            return false;
        }


        if($this->getAttribute('multiple')) {
            if($_FILES[$this->getName()]['error'][0] === UPLOAD_ERR_NO_FILE) {
                return false;
            }
        }else {
            if($_FILES[$this->getName()]['error'] === UPLOAD_ERR_NO_FILE) {
                return false;
            }
        }


        return true;

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


        // If no upload has been made, they you keep the previous data
        if(!$this->hasUpload()) {
            if($this->getAttribute('multiple')) {
                $id = explode(',',$_POST[$this->getName()][0]);
            } else {
                $id = $_POST[$this->getName()];
            }

        }
        else {

            if(!$this->getAttribute('multiple')) {
                $id = $this->upload($post_id, $overrides);
            } else {

                $files = $_FILES;

                $id = array();


                for($i =0; $i < count($files[$this->getName()]['name']);$i++) {

                    $_FILES = array();

                    $_FILES[$this->getName()] = $this->buildFileVar($files[$this->getName()],$i);

                    $upload = $this->upload($post_id,$overrides);

                    if(is_wp_error($upload)) {
                        $this->setError(__('An error occurred while uploading a file',EF_get_domain()));
                    }

                    $id[] = $upload;

                }

            }
        }


        if (!is_wp_error($id)) {
            if ('post' === $post_type) {
                update_post_meta($post_id, $this->getName(), $id);
            } else {
                update_user_meta($post_id, $this->getName(), $id);
            }
        } else {
            $this->setError($id->get_error_message());
        }


        // Upload ACF type gallery
        if($this->getSetting('acf')){
            update_post_meta($post_id, '_' . $this->getName(), $this->getSetting('acf'));
        }

        return $id;
    }


    /**
     *
     */
    public static function register()
    {
        add_filter('EF_available_inputs',function($inputs){
            $inputs[self::$_TYPE] = array(
                'type' => self::$_TYPE,
                'label' => __('File Input','easy-form'),
                'class' => self::class
            );

            return $inputs;
        });

        add_action('wp_enqueue_scripts',array(EF_File_Input::class,'wp_enqueue_scripts'));

    }


    /**
     * Add the g_map_address.js script in the queue
     */
    public static function wp_enqueue_scripts()
    {
        wp_register_script( 'ef-public-input-file-js', EF_get_dir('assets/public/js/inputs/file.js') , array('jquery'), EF_get_setting('version') );

        wp_enqueue_script('ef-public-input-file-js',false,array('jquery'),false,true);
    }


    /**
     * @return string
     */
    public function getType()
    {
        return self::$_TYPE;
    }


    /**
     * @return string
     */
    public function __toString()
    {

        if($this->getAttribute('multiple')) {
            $this->addAttribute('name',$this->getName() . '[]');
        }

        $elem = parent::__toString();

        $value = $this->getAttribute('value');



        if(!is_numeric($value) && !is_array($value) && !empty($value)) {
            return $elem;
        }

        $id = uniqid();

        if(is_numeric($value)) {
            $elem .= $this->getAttachmentLinked($value,$id);
        } else {
            if(is_array($value)) {
                foreach ($value as $val) {
                    if(!empty($val)) {
                        $elem .= $this->getAttachmentLinked($val, $id);
                    }
                }

                $value = join(',',$value);

            }
        }

        $elem .= sprintf('<input type="hidden" name="%s" value="%s" id="%s" >',$this->getName(),$value,$id);

        return $elem;

    }


    /**
     * @param $attachment_id
     * @param $id
     * @return string
     */
    public function getAttachmentLinked($attachment_id,$id)
    {
        $img = wp_get_attachment_url($attachment_id);

        if(preg_match('#\.(png|jpg|jpeg|gif|bmp)$#',strtolower($img))) {
            $string = sprintf('<div class="ef_attachment_container"><img class="ef_attachment" id="%s" src="%s"><a href="javascript:" delete-file img-id="%s" input-id="%s" >%s</a></div>',$attachment_id,$img,$attachment_id,$id,__('Delete',EF_get_domain()));
        } else {
            $string = sprintf(
                '<div class="ef_attachment_container"><a  class="ef_attachment" id="%s" href="%s" target="_blank">%s</a><a href="javascript:" delete-file img-id="%s" input-id="%s" >%s</a></div>',
                $attachment_id,
                $img,
                basename($img),
                $attachment_id,
                $id,
                __('Delete',EF_get_domain())
            );
        }

        return $string;
    }

}