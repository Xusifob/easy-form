<?php

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

// WP_List_Table is not loaded automatically so we need to load it in our application
if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class EF_List_Table extends WP_List_Table {


    /**
     * @var array
     */
    protected $data;

    /**
     * Prepare the items for the table to process
     *
     * @return Void
     */
    public function prepare_items()
    {
        $columns = $this->get_columns();
        $hidden = $this->get_hidden_columns();
        $sortable = $this->get_sortable_columns();
        $this->process_bulk_action();

        $data = $this->table_data();
        $this->data = $data;

        $status = isset($_GET['post_status']) ? $_GET['post_status'] : 'publish';

        $data = $this->getFromStatus($status);
        usort( $data, array( &$this, 'sort_data' ) );


        $perPage = 20;
        $currentPage = $this->get_pagenum();
        $totalItems = count($data);

        $this->set_pagination_args( array(
            'total_items' => $totalItems,
            'per_page'    => $perPage
        ) );

        $data = array_slice($data,(($currentPage-1)*$perPage),$perPage);


        $this->_column_headers = array($columns, $hidden, $sortable);
        $this->items = $data;
    }


    /**
     * @param string $status
     * @return array
     */
    public function getFromStatus($status)
    {
        $trash = [];
        /** @var WP_Post $data */
        foreach($this->data as $data){
            if($data['post_status'] === $status){
                $trash[] = $data;
            }
        }

       return $trash;
    }

    public function process_bulk_action() {

        // security check!
        if ( isset( $_POST['_wpnonce'] ) && ! empty( $_POST['_wpnonce'] ) ) {

            $nonce  = filter_input( INPUT_POST, '_wpnonce', FILTER_SANITIZE_STRING );
            $action = 'bulk-' . $this->_args['plural'];

            if ( ! wp_verify_nonce( $nonce, $action ) )
                wp_die( 'Nope! Security check failed!' );

        }

        $action = $this->current_action();


        switch ( $action ) {

            case 'delete':
                if(isset($_GET['form']) && is_numeric($_GET['form'])){
                    EF_Form_Handler::delete($_GET['form']);
                }
                break;
            default:
                // do nothing or something else
                return;
                break;
        }

        return;
    }

    /**
     * Override the parent columns method. Defines the columns to use in your listing table
     *
     * @return array
     */
    public function get_columns()
    {
        $columns = array(
            'cb'          => '<input type="checkbox">',
            'id'          => __('ID - slug',EF_get_domain()),
            'name'       =>  __('Name', EF_get_domain()),
            'nb_field' => __('Number of fields', EF_get_domain()),
            'form_action' => _x('Actions','List table header', EF_get_domain()),
        );

        return $columns;
    }

    /**
     * Define which columns are hidden
     *
     * @return array
     */
    public function get_hidden_columns()
    {
        return array();
    }


    /**
     * Define the sortable columns
     *
     * @return array
     */
    public function get_sortable_columns()
    {
        return [
            'id' => ['id',true],
            'name' => ['name',true],
            'nb_field' => ['nb_field',true],
            'form_action' => ['form_action',true],
        ];
    }

    /**
     * Get the table data
     *
     * @return array
     */
    private function table_data()
    {
        // Getting all forms
        $args = [
            'post_type' => EF_get_post_type(),
            'posts_per_page' => -1,
        ];

        $my_query = new WP_Query($args);

        $datas = [];

        while($my_query->have_posts()): $my_query->the_post();

            global $post;

            // TODO change number of fields
            $data = [
                'id' => get_the_ID(),
                'name' => get_the_title(),
                'nb_field' =>  4,
                'form_action' => 'kiwi',
                'slug' => $post->post_name,
                'post_status' => $post->post_status
            ];

            array_push($datas,$data);
        endwhile;

        return $datas;
    }


    // Used to display the value of the id column
    public function column_id($item)
    {
        $actions = array(
            'shw'      => sprintf('<a href="' . menu_page_url('EF_show',false) . '&id='. $item['id'] .'">'. __('Display', EF_get_domain()) .'</a>',$_REQUEST['page'],'show',$item['id']),
            'edit'      => sprintf('<a href="' . menu_page_url('EF_add',false) . '&modify='. $item['id'] .'">'. __('Update', EF_get_domain()) .'</a>',$_REQUEST['page'],'edit',$item['id']),
            'stat'      => sprintf('<a href="' . menu_page_url('EF_stat',false) . '&id='. $item['id'] .'">'. __('Statistics', EF_get_domain()) .'</a>',$_REQUEST['page'],'show',$item['id']),
            'duplicate'      => sprintf('<a href="#" data-toggle="modal" data-target="#modal-duplicate" data-form="'. $item['id'] .'" >'. __('Duplicate', EF_get_domain()) .'</a>',$_REQUEST['page'],'duplicate',$item['id']),
            'delete'    => sprintf('<a href="?page=%s&action=%s&form=%s" onclick="if(!confirm(\''. __('Are you sure you want to delete this form?', EF_get_domain()) .'\')) return false;">'. __('Delete', EF_get_domain()) .'</a>',$_REQUEST['page'],'delete',$item['id']),
        );
        return sprintf('%1$s %2$s', '<a href="'. menu_page_url('EF_show',false) .'&id='. $item['id'] .'">' . $item['id'] . ' -  ' . $item['slug'] .'</a>', $this->row_actions($actions) );
    }

    // Used to display the checkbox column
    function column_cb($item) {
        return sprintf(
            '<input type="checkbox" name="form[]" value="%s" />', $item['id']
        );
    }


    // used to put the bulk action select
    function get_bulk_actions() {
        $actions = array(
            'delete'    =>  __('Delete', EF_get_domain())
        );
        return $actions;
    }


    /**
     * Define what data to show on each column of the table
     *
     * @param  array $item        Data
     * @param  String $column_name - Current column name
     *
     * @return Mixed
     */
    public function column_default( $item, $column_name )
    {
        switch( $column_name ) {
            case 'cb':
            case 'id':
            case 'name':
            case 'nb_field':
            case 'form_action':
                return $item[ $column_name ];

            default:
                return print_r( $item, true ) ;
        }
    }

    /**
     * Allows you to sort the data by the variables set in the $_GET
     *
     * @return Mixed
     */
    private function sort_data( $a, $b )
    {
        // Set defaults
        $orderby = 'id';
        $order = 'asc';

        // If orderby is set, use this as the sort column
        if(!empty($_GET['orderby']))
        {
            $orderby = $_GET['orderby'];
        }

        // If order is set use this as the order
        if(!empty($_GET['order']))
        {
            $order = $_GET['order'];
        }

        $result = strnatcmp( $a[$orderby], $b[$orderby] );

        if($order === 'asc')
        {
            return $result;
        }

        return -$result;
    }

}