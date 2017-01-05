<?php

class EF_Form_Handler
{

    /**
     * @since 1.0.0
     *
     * Add a new form inside the database
     *
     * @param $data
     * @return bool
     */
    public static function add($data)
    {

        if(!isset($data['EF_save']))
            return false;

        if(!isset($data['title']) || empty($data['title'])){
            __('Please add a title for your form',EF_get_domain());
            return false;
        }


        $title = filter_var($data['title'], FILTER_SANITIZE_STRING);

        $form_data = [
            'post_name' => sanitize_title('form-' . $title),
            'post_title' => $title,
            'post_status' => 'publish',
            'post_type' => EF_get_post_type(),
        ];

        $form_id = wp_insert_post($form_data);

        if(is_wp_error($form_id) || 0 === $form_id)
            return false;


        self::addMetaData($form_id,$data);

        self::addInputs($form_id,$data);


        vardump(get_post($form_id));
        vardump(get_post_meta($form_id));

        return true;
    }

    /**
     *
     * @since 1.0.0
     *
     * Delete (soft or hard) the form
     *
     * @param $form_id
     *
     * @return array|bool|WP_Post
     */
    public static function delete($form_id)
    {
        $form = get_post($form_id);

        if(!$form instanceof WP_Form)
            return false;

        if($form->post_type !== EF_get_post_type())
            return false;

        if($form->post_status !== 'trash') {
            return wp_trash_post( $form_id );
        }else{
            return wp_delete_post($form_id);
        }
    }


    /**
     *
     * @since 1.0.0
     *
     * Add the meta data from the form
     *
     * @param $form_id
     * @param $data
     */
    protected static function addMetaData($form_id,$data)
    {
        update_post_meta($form_id,'attributes',$data['attributes']);
        update_post_meta($form_id,'settings',$data['settings']);
    }


    /**
     * @since 1.0.0
     *
     * Add the inputs in the form
     *
     * @param $form_id
     * @param $data
     * @return bool
     */
    protected static function addInputs($form_id,$data)
    {

        delete_post_meta($form_id,'inputs');

        if(!is_array($data['field']))
            return false;

        foreach($data['field'] as $key => $input){
            $input = new EF_Input(null,$input['attributes']);
            add_post_meta($form_id,'inputs',json_encode($input));
        }

        return true;
    }


    /**
     * @param $message
     * @param $status
     */
    public function addNotice($message,$status)
    {

        ?>
        <div class="notice notice-<?php echo $this->status; ?> is-dismissible">
            <p><?php $this->message; ?></p>
        </div>
        <?php
    }


}