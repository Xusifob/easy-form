<?php

/**
 * @since 1.0.0
 *
 * Class EF_List_Leads
 */
class EF_List_Leads
{

    /**
     *
     * All the columns available
     *
     * @var array
     */
    public $columns = array();

    public $form_id;


    public function __construct() {

        if(isset($_GET['form_id'])) {
            $this->form_id = $_GET['form_id'];
        }
        add_action('current_screen', array($this, 'current_screen'));
    }


    /**
     * @since 1.0.0
     *
     */
    public function current_screen()
    {

        // validate screen
        if( !EF_is_screen('edit-' . EF_Lead::$_POST_TYPE) ) {
            return;
        }

        if(!isset($this->form_id)) {
            wp_redirect('edit.php?post_type=' . EF_get_post_type());
        }

        add_filter('parse_query',array($this,'parse_query'));

        add_filter('manage_edit-'. EF_Lead::$_POST_TYPE .'_columns' , array($this,'ef_columns'));
        add_filter('manage_edit-'. EF_Lead::$_POST_TYPE .'_sortable_columns' , array($this,'ef_sortable_columns'));

        add_action('manage_'. EF_Lead::$_POST_TYPE .'_posts_custom_column', array($this,'ef_data_columns'), 10, 2 );

    }


    /**
     * @param WP_Query $query
     * @return WP_Query
     */
    public function parse_query(WP_Query $query)
    {

        $parent_id = $_GET['form_id'];

        $query->query['post_parent'] = $parent_id;
        return $query;
    }



    /**
     * @param $columns
     *
     * @return array
     */
    public function ef_columns($columns)
    {
        global $post;

        $childrens = get_children(array(
            'post_parent' => $_GET['form_id'],
            'numberposts' => 1,
            'post_type' => EF_Lead::$_POST_TYPE,
            'order' => 'DESC'
        ));

        $id = array_keys($childrens)[0];

        $lead = new EF_Lead($id);

        $data = $lead->getData();

        $columns['title'] .= sprintf('<input type="hidden" name="form_id" value="%s">',$this->form_id);
        
        $date = $columns['date'];
        unset($columns['date']);

        $_data = array();

        foreach($data as $key => $val) {
            $_data[$key] = $key;
        }

        $columns = array_merge($columns,$_data);

        $columns['date'] = $date;

        $this->columns = $_data;

        return $columns;
    }


    /**
     * @since 1.0.0
     * @wp_type filter
     *
     * @param $columns
     * @return mixed
     */
    public function ef_sortable_columns($columns)
    {

        return $columns;
    }

    /**
     * Display the data
     *
     * @since 1.0.0
     *
     * @param $name
     */
    public function ef_data_columns($name) {
        global $post;

        $lead = new EF_Lead($post->ID);

        echo $lead->getValue($name);

    }


}

new EF_List_Leads();