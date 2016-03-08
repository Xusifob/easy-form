<?php
/*
Plugin Name: Easy WP Form
Plugin URI: http://easyform.bastienmalahieude.fr
Description: Permet de créer et styliser des formulaires facilement. Ce plugin a été créé conjointement par Bastien Malahieude et Baltazare (http://baltazare.fr).
Version: 0.5.5
Author: Bastien Malahieude
Author URI: http://bastienmalahieude.fr
Copyright: Bastien Malahieude
License: GPL

*/


ini_set('max_execution_time', 120);

class FormPlugin
{


    /**
     *
     * The conversion has been done
     *
     * @Since V 0.5.5
     */
    const _CONVERSION_DONE = 2;

    /**
     *
     * The conversion has been done by this IP but not on this custom data
     *
     * @Since V 0.5.5
     */
    const  _CONVERSION_PART = 1;

    /**
     * @Since V 0.5.5
     *
     * The conversion is missed
     */
    const _CONVERSION_MISSED = 0;

    /**
     *
     * Api url for update
     *
     * @Since V 0.5.5
     *
     * @var string
     */
    protected $api_url;
    /**
     *
     * Plugin slug
     *
     * @Since V 0.5.5
     *
     * @var string
     */
    protected $plugin_slug;

    /**
     * @Since V 0.1
     *
     * @Updated - V 0.5.3 (Add support for multi languages)
     *          - V 0.5.4 (Add support for update check)
     *          - V 0.5.5 (Add stat-form in the pages & add Mobile_Detect lib & add shortcode)
     *
     * Constructeur
     */
    public function __construct()
    {
        /** Include all classes */
        if (!class_exists('Form'))
            include_once plugin_dir_path(__FILE__) . '/src/Form.php';

        if (!class_exists('FormWordpress'))
            include_once plugin_dir_path(__FILE__) . '/src/FormWordpress.php';

        if (!class_exists('FormListTable'))
            include_once plugin_dir_path(__FILE__) . '/library/php/FormListTable.php';

        if (!class_exists('WP_Form'))
            include_once plugin_dir_path(__FILE__) . '/src/WP_Form.php';

        if (!class_exists('Phpmailerform'))
            include_once plugin_dir_path(__FILE__) . '/library/php/class-phpmailer.php';

        if (!class_exists('Mobile_Detect'))
            include_once plugin_dir_path(__FILE__) . '/library/php/Mobile_Detect.php';

        // Gestion de la partie admin
        if (is_admin()) {
            $pgs = [
                'forms',
                'add-form',
                'show-form',
                'import-form',
                'export-form',
                'doc-form',
                'stat-form',

            ];

            if (isset($_GET['page']) && in_array($_GET['page'], $pgs)) {
                require_once __DIR__ . '/templates/head-admin.php';
                add_action('admin_footer', [$this, 'includeFooterAdmin']);
            }
            $this->api_url = 'http://easyform.bastienmalahieude.fr/api/';
            $this->plugin_slug = basename(dirname(__FILE__));
            // Used for the update check of the plugin
            //set_site_transient('update_plugins', null);


            add_action('admin_menu', [$this, 'addAdminMenu']);
        } else {
            // use of sessions
            if (phpversion() >= 5.4) {
                if (session_status() == PHP_SESSION_NONE)
                    session_start();
            } else {
                if (session_id() == '')
                    session_start();
            }
        }
// Used for the update check of the plugin
        // set_site_transient('update_plugins', null);
        add_filter('pre_set_site_transient_update_plugins', [$this, 'check_for_plugin_update']);
        add_filter('plugins_api', [$this, 'plugin_api_call'], 10, 3);

        // Add action for multilingual traduction
        add_action('plugins_loaded', [$this, 'wan_load_textdomain']);


        // Add action for ajax calls in add.php template (page add-form)
        add_action('wp_ajax_input_template', [$this, 'input_template']);
        add_action('wp_ajax_form_action', [$this, 'action_template']);

        // Hook for the display-form.php file
        add_action('wp_ajax_display_form', [$this, 'display_form']);
        add_action('wp_ajax_nopriv_display_form', [$this, 'display_form']);


        /*
        // Hook for the display-form.php file
        add_action('wp_ajax_update_stats', [$this, 'update_stats']);
        add_action('wp_ajax_nopriv_update_stats', [$this, 'update_stats']); */

        // Add the shortcode
        // ShortCode for Content
        add_shortcode('WP_Form', [$this, 'shortcode']);

    }


    /**
     *
     * Create the shortcode to display a form
     *
     * @Since V 0.5.5
     *
     * @param $atts array shortcode parameters
     * @return string|void
     */
    public function shortcode($atts)
    {

        if (isset($atts['id']) && self::isForm($atts['id']))
            try {
                $form = new WP_Form($atts['id']);

            } catch (Exception $e) {
                return WP_DEBUG ? $e->getMessage() : '';
            }
        elseif (isset($atts['slug']))
            try {
                $form = new WP_Form($atts['slug']);

            } catch (Exception $e) {
                return WP_DEBUG ? $e->getMessage() : '';
            }
        else
            return WP_DEBUG ? __('Veuillez entrer un id ou un slug', 'easy-form') : '';

        $success = isset($atts['success']) ? $atts['success'] : __('Votre formulaire a bien été envoyé', 'easy-form');

        ob_start();

        // Display success message
        if ($form->hasBeenSend())
            echo '<div class="success">' . $success . '</div>';

        // Display the error
        if ($form->hasError())
            echo '<div class="error">' . $form->getError() . '</div>';

        echo $form;
        return ob_get_clean();
    }

    /**
     *
     * Return the display-form.php file on ajax call (to display as a js file)
     *
     *
     * @Updated : V 0.5.5 (Add sanitization)
     *
     * @Since V 0.5.4
     */
    public function display_form()
    {

        $_GET['modify'] = (int)$_GET['modify'];

        $form = get_post($_GET['modify']);
        if ($this->isForm($_GET['modify'])) {

            $formMetas = get_post_meta($_GET['modify']);
            $formArgs = get_post_meta($_GET['modify'], 'form-args');
            $formFields = get_post_meta($_GET['modify'], 'form-fields');
            $submitArgs = get_post_meta($_GET['modify'], 'form-submit-args');
            $formSendArgs = get_post_meta($_GET['modify'], 'form-send-args');


            $i = 1;
            foreach ($formFields[0] as $key => $field) {
                $formFields[0][$key]['id'] = $i;
                $i++;
            }
        } else
            unset($form);


        // Set all vars used in add.php
        $inputs = [
            'text', 'email', 'password', 'repeatPassword', 'number', 'tel', 'date', 'checkbox', 'select', 'radio', 'url', 'range', 'color', 'search', 'hidden', 'file', 'textarea', 'taxonomy', 'wp_editor', 'open container', 'close container', 'close all container',
        ];

        $roles = self::GetAllRoles();


        header('Content-Type: application/javascript');
        if (file_exists(__DIR__ . '/assets/js/display-form.php'))
            include __DIR__ . '/assets/js/display-form.php';
        die();
    }

    /**
     *
     * Return the template of the correct input if it exist
     *
     * @Since V 0.5.4
     */
    public function input_template()
    {
        if (isset($_GET['input']) && !empty($_GET['input'])) {
            if (file_exists(__DIR__ . '/templates/inputs/' . $_GET['input'] . '.php'))
                include __DIR__ . '/templates/inputs/' . $_GET['input'] . '.php';
        }
        die();
    }

    /**
     * @Since V 0.5.4
     * Return the form action template
     */
    public function action_template()
    {
        if (isset($_GET['form_action']) && !empty($_GET['form_action'])) {
            if (file_exists(__DIR__ . '/templates/form-actions/' . $_GET['form_action'] . '.php'))
                include __DIR__ . '/templates/form-actions/' . $_GET['form_action'] . '.php';
        }
        die();
    }


    /**
     * Load the traduction for easy-form
     *
     * @Since V 0.5.4
     */
    public function wan_load_textdomain()
    {
        load_plugin_textdomain('easy-form', false, dirname(plugin_basename(__FILE__)) . '/languages/');
    }

    /**
     * @Since V 0.1
     *
     * Called on plugin activation : Create user & usermeta tabs
     */
    public function activate()
    {
        /** @var $wpdb wpdb */
        global $wpdb;

        $table = $wpdb->prefix . 'easy_form_users';
        $table_meta = $wpdb->prefix . 'easy_form_usermeta';

        // Create user table
        if ($wpdb->get_var("show tables like '$table'") != $table) {
            $sql = "CREATE TABLE $table LIKE {$wpdb->prefix}users";

            require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
            dbDelta($sql);
        }

        // Create usermeta table
        if ($wpdb->get_var("show tables like '$table_meta'") != $table_meta) {
            $sql = "CREATE TABLE $table_meta LIKE {$wpdb->prefix}usermeta";

            require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
            dbDelta($sql);
        }
    }


    /**
     *
     * @Since V 0.1
     *
     * @Updated :   - V 0.5.4 (Change capacities from edit_plugins to edit_pages this add editor support )
     *              - V 0.5.5 (Add the page stat-form & update )
     *
     * Add All Admin's Menu tab
     */
    public function addAdminMenu()
    {
        // Menu formulaire/Tous les formulaires
        add_menu_page('Easy Forms', 'Easy Forms', 'edit_posts', 'forms', [$this, 'displayPage'], 'dashicons-feedback', 21);

        // Ajouter/modifier un formulaire
        add_submenu_page('forms', __('Ajouter un formulaire', 'easy-form'), __('Ajouter', 'easy-form'), 'edit_pages', 'add-form', [$this, 'displayPageAddForm']);
        // Prévisualiser son formulaire
        add_submenu_page('forms', __('Voir un formulaire', 'easy-form'), __('Prévisualiser', 'easy-form'), 'edit_posts', 'show-form', [$this, 'displayPrev']);

        add_submenu_page('forms', __('Importer un formulaire', 'easy-form'), __('Importer', 'easy-form'), 'edit_pages', 'import-form', [$this, 'displayImport']);

        // Exporter un formulaire
        add_submenu_page('forms', __('Exporter un formulaire', 'easy-form'), __('Exporter', 'easy-form'), 'edit_pages', 'export-form', [$this, 'displayExport']);

        // Stats
        add_submenu_page('forms', __('Statistiques', 'easy-form'), __('Statistiques', 'easy-form'), 'edit_posts', 'stat-form', [$this, 'displayStat']);

        // Doc
        add_submenu_page('forms', __('Documentation', 'easy-form'), __('Documentation', 'easy-form'), 'edit_pages', 'doc-form', [$this, 'displayDoc']);


    }


    /**
     *
     * Check if the plugin needs updates
     *
     * @Since V 0.5.4
     *
     * @param $checked_data
     * @return mixed
     */
    function check_for_plugin_update($checked_data)
    {
        global $wp_version;
        if (
            !isset($checked_data->checked) ||
            empty($checked_data->checked) ||
            !isset($checked_data->checked[$this->plugin_slug . '/' . $this->plugin_slug . '.php']) ||
            empty($checked_data->checked[$this->plugin_slug . '/' . $this->plugin_slug . '.php'])
        )
            return $checked_data;

        $args = array(
            'slug' => $this->plugin_slug,
            'version' => $checked_data->checked[$this->plugin_slug . '/' . $this->plugin_slug . '.php'],
        );
        $request_string = array(
            'body' => array(
                'action' => 'basic_check',
                'request' => serialize($args),
                'api-key' => md5(get_bloginfo('url'))
            ),
            'user-agent' => 'WordPress/' . $wp_version . '; ' . get_bloginfo('url')
        );

        // Start checking for an update
        $raw_response = wp_remote_post($this->api_url, $request_string);

        if (!is_wp_error($raw_response) && ($raw_response['response']['code'] == 200))
            $response = unserialize($raw_response['body']);

        if (isset($response) && is_object($response) && !empty($response)) // Feed the update data into WP updater
            $checked_data->response[$this->plugin_slug . '/' . $this->plugin_slug . '.php'] = $response;

        return $checked_data;
    }


    /**
     * Take over the info's screen
     *
     * @Since V 0.5.4
     *
     * @param $def
     * @param $action
     * @param $args
     * @return bool|mixed|WP_Error
     */
    public function plugin_api_call($def, $action, $args)
    {
        global $wp_version;

        if (!isset($args->slug) || ($args->slug != $this->plugin_slug))
            return false;

        // Get the current version
        $plugin_info = get_site_transient('update_plugins');
        $current_version = $plugin_info->checked[$this->plugin_slug . '/' . $this->plugin_slug . '.php'];
        $args->version = $current_version;

        $request_string = array(
            'body' => array(
                'action' => $action,
                'request' => serialize($args),
                'api-key' => md5(get_bloginfo('url'))
            ),
            'user-agent' => 'WordPress/' . $wp_version . '; ' . get_bloginfo('url')
        );

        $request = wp_remote_post($this->api_url, $request_string);

        if (is_wp_error($request)) {
            $res = new WP_Error('plugins_api_failed', __('Une erreur HTTP est arrivée lors du chargement du plugin.</p> <p><a href="?" onclick="document.location.reload(); return false;">Réessayer</a>', 'easy-form'), $request->get_error_message());
        } else {
            $res = unserialize($request['body']);

            if ($res === false)
                $res = new WP_Error('plugins_api_failed', __('An unknown error occurred', 'easy-form'), $request['body']);
        }

        return $res;
    }


    /**
     * Create a footer in admin
     */
    public function includeFooterAdmin()
    {
        require_once __DIR__ . '/templates/footer.php';
    }


    /**
     *
     * @Since V 0.1
     *
     * @Updated : V 0.5.5 (Add count for posts)
     *
     * Displays the admin page
     */
    public function displayPage()
    {

        // I check if there is a duplicate action
        $this->handleDuplicate();

        $formTable = new FormListTable();

        $formTable->prepare_items();

        $args = [
            'post_type' => 'form-plugin-bastien',
            'posts_per_page' => -1,
            'post_status' => ['publish'],
        ];

        $tmp = new WP_Query($args);

        $available = $tmp->found_posts;

        $args['post_status'] = 'trash';

        $tmp = new WP_Query($args);

        $trash = $tmp->found_posts;


        require_once __DIR__ . '/templates/index.php';
    }

    /**
     * Display the add form page
     */
    public function displayPageAddForm()
    {

        // Vérifie les données de champs dupliqués
        $this->handleDuplicateFields();

        // Vérifie les données post envoyées
        $this->handleAdd();

        // If there ia a modify var
        if (isset($_GET['modify']) && !empty($_GET['modify'])) {

            $form = get_post($_GET['modify']);
            if ($this->isForm($_GET['modify'])) {

                $formMetas = get_post_meta($_GET['modify']);
                $formArgs = get_post_meta($_GET['modify'], 'form-args');
                $formFields = get_post_meta($_GET['modify'], 'form-fields');
                $submitArgs = get_post_meta($_GET['modify'], 'form-submit-args');
                $formSendArgs = get_post_meta($_GET['modify'], 'form-send-args');


                $i = 1;
                foreach ($formFields[0] as $key => $field) {
                    $formFields[0][$key]['id'] = $i;
                    $i++;
                }
            } else
                unset($form);

        }

        // Set all vars used in add.php
        $inputs = [
            'text', 'email', 'password', 'repeatPassword', 'number', 'tel', 'date', 'checkbox', 'select', 'radio', 'url', 'range', 'color', 'search', 'hidden', 'file', 'textarea', 'taxonomy', 'wp_editor', 'open container', 'close container', 'close all container',
        ];

        $roles = FormPlugin::GetAllRoles();

        // Call the template
        require_once __DIR__ . '/templates/add.php';
    }


    /**
     * Displays the export page
     */
    public function displayExport()
    {
        // Handle if form has been send
        $downloadButton = $this->handleExport();

        // Getting all forms
        $args = [
            'post_type' => 'form-plugin-bastien',
            'posts_per_page' => -1,
        ];

        $my_query = new WP_Query($args);

        // Display the template
        include __DIR__ . '/templates/export.php';
    }

    /**
     * Display the preview page
     */
    public function displayPrev()
    {
        if (isset($_GET['id']) && !empty($_GET['id'])) {
            $form = new WP_Form($_GET['id']);
            $formFields = get_post_meta(filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT), 'form-fields')[0];
        }

        // Getting all forms
        $args = [
            'post_type' => 'form-plugin-bastien',
            'posts_per_page' => -1,
        ];

        $my_query = new WP_Query($args);


        include __DIR__ . '/templates/preview.php';
    }

    /**
     * Display the import page
     */
    public function displayImport()
    {
        if (true === $error = $this->handleImport()) {
            $result = $this->ImportForm();

            if ($result['error'] == true)
                $error = $result['message'];
            else
                $success = $result['message'];
        }

        include __DIR__ . '/templates/import.php';
    }


    /**
     * @since V 0.1
     *
     * @Updated :   - V 0.2
     *              - V 0.3
     *              - V 0.4
     *              - V 0.5.2 (Add Sanitization)
     *              - V 0.5.3 (Remove sanitization for label & update sanitization for id)
     *              - v 0.5.4 (Add form- before post_title to avoid duplicate slug and conflicts with pages, Add $postInfos['ID'] to avoid bug, Add $traduction)
     *
     *
     * Check if add form is send
     */
    public function handleAdd()
    {
        // If the form is send
        if (isset($_POST['add-form-plugin-bastien']) && 'send' == $_POST['add-form-plugin-bastien']) {

            //TODO all verifications depending on type

            // If the form has a title
            if (isset($_POST['form-title'])) {
                $postInfos = [
                    'post_name' => sanitize_title('form-' . filter_var($_POST['form-title']), FILTER_SANITIZE_STRING),
                    'post_title' => filter_var($_POST['form-title'], FILTER_SANITIZE_STRING),
                    'post_status' => 'publish',
                    'post_type' => 'form-plugin-bastien',
                ];
                if (isset($_POST['form-id']) && !empty($_POST['form-id'])) {
                    // I insert the post
                    $postInfos['ID'] = filter_var($_POST['form-id'], FILTER_SANITIZE_NUMBER_INT);
                    wp_update_post($postInfos);
                    $pid = filter_var($_POST['form-id'], FILTER_SANITIZE_NUMBER_INT);
                } else {
                    // I insert the post
                    $pid = wp_insert_post($postInfos);
                }

                // If the post is inserted
                if (!is_wp_error($pid)) {


                    // All actions
                    update_post_meta($pid, 'action', $_POST['form-action']);
                    update_post_meta($pid, 'form-args', [
                        'defaultClass' => filter_var($_POST['form-class-defaut'], FILTER_SANITIZE_STRING),
                        'class' => filter_var($_POST['form-class'], FILTER_SANITIZE_STRING),
                        'id' => filter_var($_POST['form-id-form'], FILTER_SANITIZE_STRING),
                        'displayErrors' => isset($_POST['form-display-errors']),
                        'displayErrorsBefore' => isset($_POST['form-display-errors-before']),
                    ]);

                    $fields = [];

                    // String to put in the fields_traduction.php file
                    $traduction = '<?php ';

                    if (is_array($_POST['field'])) {
                        foreach ($_POST['field'] as $field) {
                            switch ($field['form-type']) {
                                case 'open_container' :
                                    $fi = [
                                        'container' => filter_var($field['form-container'], FILTER_SANITIZE_STRING),
                                        'args' => [
                                            'id' => filter_var($field['form-container-id'], FILTER_SANITIZE_NUMBER_INT),
                                            'class' => filter_var($field['form-container-class'], FILTER_SANITIZE_STRING),
                                        ]
                                    ];
                                    break;
                                case 'close_container' :
                                    break;
                                case 'close_all_container' :
                                    break;
                                case 'file' :
                                    $fi = [
                                        'args' => [
                                            'id' => filter_var($field['form-id'], FILTER_SANITIZE_STRING),
                                            'class' => filter_var($field['form-class'], FILTER_SANITIZE_STRING),
                                            'multiple' => (isset($field['form-multiple'])),
                                            'label' => $field['form-label'], FILTER_SANITIZE_STRING,
                                            'labelClass' => filter_var($field['form-label-class'], FILTER_SANITIZE_STRING),
                                            'required' => (isset($field['form-required'])),
                                            'labelAfter' => (isset($field['form-label-after'])),
                                            'allowed' => explode(',', filter_var($field['form-allowed']), FILTER_SANITIZE_STRING),
                                            'acfField' => filter_var($field['form-acf-field'], FILTER_SANITIZE_STRING),
                                            'maxSize' => filter_var($field['form-max-size'], FILTER_SANITIZE_NUMBER_INT),
                                            'statsSelected' => isset($field['form-sort-stats']),
                                        ]
                                    ];
                                    break;
                                // If it's a field
                                case 'taxonomy' :
                                    $fi = [
                                        'args' => [
                                            'id' => filter_var($field['form-id'], FILTER_SANITIZE_STRING),
                                            'class' => filter_var($field['form-class'], FILTER_SANITIZE_STRING),
                                            'value' => filter_var($field['form-value'], FILTER_SANITIZE_STRING),
                                            'label' => $field['form-label'],
                                            'labelClass' => filter_var($field['form-label-class'], FILTER_SANITIZE_STRING),
                                            'required' => isset($field['form-required']),
                                            'autocomplete' => isset($field['form-autocomplete']),
                                            'labelAfter' => isset($field['form-label-after']),
                                            'taxonomy' => filter_var($field['form-taxonomy'], FILTER_SANITIZE_STRING),
                                            'emptyField' => filter_var($field['form-empty-field'], FILTER_SANITIZE_STRING),
                                            'taxonomyType' => filter_var($field['form-taxonomy-type'], FILTER_SANITIZE_STRING),
                                            'readOnly' => isset($field['form-readonly']),
                                            'statsSelected' => isset($field['form-sort-stats']),


                                        ]
                                    ];
                                    break;
                                default :

                                    $fi = [
                                        'args' => [
                                            'id' => filter_var($field['form-id'], FILTER_SANITIZE_STRING),
                                            'class' => filter_var($field['form-class'], FILTER_SANITIZE_STRING),
                                            'placeholder' => isset($field['form-placeholder']) ? $field['form-placeholder'] : '',
                                            'value' => isset($field['form-value']) ? $field['form-value'] : '',
                                            'label' => $field['form-label'], FILTER_SANITIZE_STRING,
                                            'labelClass' => filter_var($field['form-label-class'], FILTER_SANITIZE_STRING),
                                            'required' => isset($field['form-required']),
                                            'autocomplete' => isset($field['form-autocomplete']),
                                            'labelAfter' => isset($field['form-label-after']),
                                            'readOnly' => isset($field['form-readonly']),
                                            'statsSelected' => isset($field['form-sort-stats']),
                                        ]
                                    ];

                                    if ($field['form-type'] == 'select') {
                                        $fi['args']['options'] = [];
                                        // The selected key is the 1st one or the selected option in the radio field
                                        $selected = isset($field['form-select-option-selected']) ? $field['form-select-option-selected'] : array_keys($field['form-select-option'])[0];
                                        foreach ($field['form-select-option'] as $key => $opts) {
                                            $opt = [
                                                'content' => filter_var($opts['name'], FILTER_SANITIZE_STRING),
                                                'value' => filter_var($opts['value'], FILTER_SANITIZE_STRING),
                                                'select' => ($key == $selected),
                                            ];
                                            array_push($fi['args']['options'], $opt);
                                        }
                                        $fi['args']['orderBy'] = $field['form-order-by'];
                                    }
                                    break;
                            }

                            // Handle the translation for plugin data
                            if (isset($field['form-label']) && $field['form-label'] != '')
                                $traduction .= "__('" . $field['form-label'] . "','easy-form-userData');";

                            // Handle the translation for plugin data
                            if (isset($field['form-placeholder']) && $field['form-placeholder'] != '')
                                $traduction .= "__('" . $field['form-placeholder'] . "','easy-form-userData');";

                            // Handle the translation for plugin data
                            if (isset($field['form-value']) && $field['form-value'] != '')
                                $traduction .= "__('" . $field['form-value'] . "','easy-form-userData');";


                            // fields which are here anyway
                            $fi['type'] = filter_var($field['form-type'], FILTER_SANITIZE_STRING);
                            $fi['name'] = filter_var(sanitize_title($field['form-name']), FILTER_SANITIZE_STRING);

                            // At the end, i push everything
                            array_push($fields, $fi);
                        }
                    }


                    // Put the content for traduction in the field traduction
                    file_put_contents(plugin_dir_path(__FILE__) . '/assets/fields_traductions.php', $traduction);


                    // and hop ! post meta
                    update_post_meta($pid, 'form-fields', $fields);

                    // send button args
                    update_post_meta($pid, 'form-submit-value', $_POST['form-button-send']);
                    update_post_meta($pid, 'form-submit-args', [
                        'id' => filter_var($_POST['form-button-send-id'], FILTER_SANITIZE_STRING),
                        'class' => filter_var($_POST['form-button-send-class'], FILTER_SANITIZE_STRING),
                    ]);

                    // Form type args
                    update_post_meta($pid, 'form-redirect', filter_var($_POST['form-send-lien'], FILTER_SANITIZE_NUMBER_INT));
                    update_post_meta($pid, 'form-var-url', filter_var($_POST['form-var-url'], FILTER_SANITIZE_URL));
                    update_post_meta($pid, 'form-type', filter_var($_POST['form-utility'], FILTER_SANITIZE_STRING));


                    switch ($_POST['form-utility']) {
                        case 'post' :
                            $args = [
                                'post_type' => filter_var($_POST['form-send-type'], FILTER_SANITIZE_STRING),
                                'post_status' => filter_var($_POST['form-send-staut'], FILTER_SANITIZE_STRING),
                            ];
                            update_post_meta($pid, 'form-send-args', $args);
                            break;

                        case 'connexion' :
                            $args = [
                                'remember' => 'form-send-remember',
                            ];
                            update_post_meta($pid, 'form-send-args', $args);
                            break;

                        case 'user' :
                            $args = [
                                'role' => isset($_POST['form-send-role']) ? filter_var($_POST['form-send-role'], FILTER_SANITIZE_STRING) : 'current',
                                'connectUser' => isset($_POST['form-connexion-user']),
                                'emailUser' => isset($_POST['form-email-user']),
                            ];
                            update_post_meta($pid, 'form-send-args', $args);
                            break;

                        case 'email' :
                            $args = [
                                'subject' => filter_var($_POST['form-send-subject'], FILTER_SANITIZE_STRING),
                                'recipientEmail' => filter_var($_POST['form-send-recipientEmail'], FILTER_SANITIZE_EMAIL),
                                'recipientName' => filter_var($_POST['form-send-recipientName'], FILTER_SANITIZE_STRING),
                            ];
                            update_post_meta($pid, 'form-send-args', $args);
                            break;

                        case 'resetPassword' :


                            $args = [
                                'subject' => filter_var($_POST['form-send-subject'], FILTER_SANITIZE_STRING),
                                'senderEmail' => filter_var($_POST['form-send-senderEmail'], FILTER_SANITIZE_EMAIL),
                                'senderName' => filter_var($_POST['form-send-senderName'], FILTER_SANITIZE_STRING),
                                'message' => ($_POST['form-send-message']),
                                'resetAction' => filter_var($_POST['form-reset-action'], FILTER_SANITIZE_STRING),
                                'pageId' => filter_var($_POST['form-send-page-id'], FILTER_SANITIZE_NUMBER_INT),
                                'submitValue' => filter_var($_POST['form-send-submit-value'], FILTER_SANITIZE_STRING),

                            ];
                            update_post_meta($pid, 'form-send-args', $args);
                            break;
                    }
                    $url = menu_page_url('show-form', false) . '&id=' . $pid;
                    wp_redirect($url);
                }
            }
        }
    }


    /**
     *
     * @return bool|string
     */
    protected function handleImport()
    {

        if (isset($_POST['import-forms-bastien'])) {
            if (isset($_FILES['import-form']) && !empty($_FILES['import-form'])) {

                // Define Vars
                $maxSize = 200000;
                $tmpName = $_FILES['import-form']['tmp_name'];
                $fileName = $_FILES['import-form']['name'];
                $fileSize = $_FILES['import-form']['size'];
                $error = false;

                if ($fileSize < $maxSize) {
                    $ext = pathinfo($fileName, PATHINFO_EXTENSION);
                    if ($ext == 'json') {
                        if (is_writable(plugin_dir_path(__FILE__) . 'library/uploads/')) {
                            $return = move_uploaded_file($tmpName, plugin_dir_path(__FILE__) . 'library/uploads/' . $fileName);
                            if (!$return)
                                $error = "Une erreur est survenue lors de l'upload du fichier, veuillez réessayer";
                            return $return;
                        } else {
                            $error = 'Le dossier <strong>' . plugin_dir_path(__FILE__) . 'library/uploads/' . ' </strong>n\'a pas pu être ouvert, vérifiez ses droits d\'écriture';
                        }
                    } else
                        $error = 'Le fichier doit être un .json';
                    return $error;

                } else
                    $error = 'Taille du fichier trop importante';
                return $error;
            }
        }
    }

    /**
     *
     * @Since V 0.3
     * Handle duplicate fields
     */
    public function handleDuplicateFields()
    {
        if (isset($_POST['action']) && $_POST['action'] == 'duplicate_field') {

            if (!wp_verify_nonce($_POST['wp_nonce'], 'duplicate_field'))
                die(json_encode(['Wp_Form_Error' => 'Security Error']));

            $duplicatedField = get_post_meta(filter_var($_POST['form-id'], FILTER_SANITIZE_NUMBER_INT), 'form-fields')[0][$_POST['form-duplicate-field-id']];

            $newformFields = get_post_meta(filter_var($_POST['form-duplicate-form'], FILTER_SANITIZE_NUMBER_INT), 'form-fields')[0];
            array_push($newformFields, $duplicatedField);

            update_post_meta(filter_var($_POST['form-duplicate-form'], FILTER_SANITIZE_NUMBER_INT), 'form-fields', $newformFields);

            $url = menu_page_url('add-form', false) . '&modify=' . $_POST['form-duplicate-form'];
            wp_redirect(filter_var($url), FILTER_SANITIZE_URL);
            die();
        }
    }


    /**
     * Handle duplicate forms
     */
    public function handleDuplicate()
    {
        if (isset($_POST['form-duplicate']) && !empty($_POST['form-duplicate'])) {
            // If the form has a title
            if (isset($_POST['form-duplicate-name'])) {

                if ($this->isForm($_POST['form-duplicate-id'])) {
                    $form = get_post(filter_var($_POST['form-duplicate-id'], FILTER_SANITIZE_NUMBER_INT));

                    $formMetas = get_post_meta(filter_var($_POST['form-duplicate-id'], FILTER_SANITIZE_NUMBER_INT));


                    $postInfos = [
                        'post_name' => filter_var(sanitize_title($_POST['form-duplicate-name']), FILTER_SANITIZE_STRING),
                        'post_title' => filter_var($_POST['form-duplicate-name'], FILTER_SANITIZE_STRING),
                        'post_status' => $form->post_status,
                        'post_type' => $form->post_type,
                    ];

                    $pid = wp_insert_post($postInfos);


                    if (!is_wp_error($pid)) {
                        // Mono args
                        update_post_meta($pid, 'action', $formMetas['action'][0]);
                        update_post_meta($pid, 'form-submit-value', $formMetas['form-submit-value'][0]);
                        update_post_meta($pid, 'form-redirect', $formMetas['form-redirect'][0]);
                        update_post_meta($pid, 'form-type', $formMetas['form-type'][0]);


                        // Multiple args
                        $formArgs = get_post_meta($_POST['form-duplicate-id'], 'form-args');
                        update_post_meta($pid, 'form-args', $formArgs[0]);
                        $formFields = get_post_meta($_POST['form-duplicate-id'], 'form-fields');
                        update_post_meta($pid, 'form-fields', $formFields[0]);


                        $formSubmitArgs = get_post_meta($_POST['form-duplicate-id'], 'form-submit-args');
                        update_post_meta($pid, 'form-submit-args', $formSubmitArgs[0]);
                        $formSendArgs = get_post_meta($_POST['form-duplicate-id'], 'form-send-args');
                        update_post_meta($pid, 'form-send-args', $formSendArgs[0]);

                        $url = menu_page_url('show-form', false) . '&id=' . $pid;
                        wp_redirect($url);
                        exit();
                    }
                }
            }
        }
    }


    /**
     * @Since V 0.3
     *
     * Used to handle import forms
     *
     * @return bool|string
     */
    protected function handleExport()
    {
        // If the post exists
        if (isset($_POST['export-forms-bastien'])) {

            // If there are some valid posts
            if (isset($_POST['forms']) && is_array($_POST['forms'])) {

                $vals = [];

                // Foreach post
                foreach ($_POST['forms'] as $formId) {

                    if ($this->isForm($formId)) {

                        $form = get_post($formId);

                        // I get the metas
                        $formMeta = get_post_meta($formId);

                        $array = [
                            'post_title' => $form->post_title,
                            'post_type' => $form->post_type,
                            'post_status' => $form->post_status,
                        ];

                        foreach ($formMeta as $key => $meta) {
                            $array['metas'][$key] = $meta[0];
                        }

                        array_push($vals, $array);

                    }
                }
                $downloadButton = $this->arrayToJson($vals, 'export-forms.json');
            }
        }
        return isset($downloadButton) ? $downloadButton : false;
    }


    /**
     *
     * @Since V 0.3
     *
     * Used to import a form
     *
     * @return array
     */
    protected function ImportForm()
    {
        /** @var string $file */
        // I get the json file
        $file = plugin_dir_path(__FILE__) . '/library/uploads/' . $_FILES['import-form']['name'];

        // I get the json file content
        $json = file_get_contents($file);

        // I get the json content in php
        $array = json_decode($json);

        $flag = true;

        foreach ($array as $form) {
            $postargs = [
                'post_name' => sanitize_title($form->post_title),
                'post_title' => $form->post_title,
                'post_status' => $form->post_status,
                'post_type' => 'form-plugin-bastien',
            ];
            $pid = wp_insert_post($postargs);

            if ($pid) {
                foreach ($form->metas as $key => $meta) {

                    if (strpos($key, 'args') || $key == 'form-fields')
                        update_post_meta($pid, $key, unserialize($meta));
                    else
                        update_post_meta($pid, $key, $meta);
                }
            } else
                $flag = false;

        }
        return $flag ? [
            'error' => false,
            'message' => "Les formulaires ont bien tous été importés"
        ] : [
            'error' => true,
            'message' => "Une erreur est survenue à la création d'un ou plusieurs formulaires"
        ];
    }


    /**
     *
     * @Since V 0.3
     *
     * Used to create the forms to download
     *
     * @param $val
     * @param string $filename
     * @return string
     */
    protected function arrayToJson($val, $filename = "export.json")
    {
        // open raw memory as file so no temp files needed, you might run out of memory though
        $f = fopen(wp_upload_dir()['path'] . '/' . $filename, 'w');
        fputs($f, json_encode($val, JSON_PRETTY_PRINT));
        fclose($f);
        return '<a href="' . wp_upload_dir()['url'] . '/' . $filename . '" class="button button-primary" target="_blank" download>Télécharger</a>';
    }


    /**
     * Retourne tous les roles existants sur le site
     *
     * @return array
     */
    public static function GetAllRoles()
    {
        global $wp_roles;

        $rls = [];
        foreach ($wp_roles->roles as $key => $rl) {
            array_push($rls, [
                'slug' => $key,
                'name' => filter_var($rl['name'], FILTER_SANITIZE_STRING),
            ]);
        }

        return $rls;
    }


    /**
     * Display the doc page
     */
    public function displayDoc()
    {
        include __DIR__ . '/templates/doc.php';
    }

    /*

    public function update_stats()
    {


        if (isset($_GET['impression'])) {
            // old data
            if($_GET['i'] === "0")
                $delete = delete_post_meta($_GET['id'], $_GET['type']);
            else
                $delete = 'no deleted';

            if(!FormWordpress::isRobotIp($_GET['impression']['ip'])){
            // new data
            $data = [
                'time' => $_GET['impression']['time'],
                'ip' => $_GET['impression']['ip'],
                'device' => $_GET['impression']['device'],
                'custom_data' => $_GET['impression']['custom_data'],
                'ip_data' => FormWordpress::getIpData($_GET['impression']['ip']),
            ];

            echo json_encode(
                [
                    'delete' => $delete,
                    'data' => $data,
                    'add' => add_post_meta($_GET['id'], $_GET['type'], $data)
                ]);
            }else
                echo json_encode([
                    'delete' => $delete,
                    'data' => 'is_robot',
                ]);

        }
        die();
    }

    */


    /**
     *
     * @Since V 0.5.5
     *
     * Display the stats page
     */
    public function displayStat()
    {


    /*    if(isset($_GET['updateData'])){
            $impression = json_decode('[{"time":"1455630930","ip":"31.221.68.82","device":"2","custom_data":"","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455642326","ip":"31.221.68.82","device":"2","custom_data":"","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455642370","ip":"31.221.68.82","device":"2","custom_data":"","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455642625","ip":"31.221.68.82","device":"2","custom_data":"","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455643262","ip":"31.221.68.82","device":"2","custom_data":"","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455643310","ip":"31.221.68.82","device":"2","custom_data":"","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455643696","ip":"31.221.68.82","device":"2","custom_data":"","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455668409","ip":"188.226.223.177","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455684363","ip":"95.85.18.74","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455684433","ip":"178.62.148.228","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455684441","ip":"95.85.18.74","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455684654","ip":"188.226.196.167","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455699834","ip":"31.221.68.82","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455703021","ip":"188.226.144.252","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455719718","ip":"31.221.68.82","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455719730","ip":"31.221.68.82","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455719739","ip":"31.221.68.82","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455719894","ip":"31.221.68.82","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455719926","ip":"31.221.68.82","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455720084","ip":"31.221.68.82","device":"0","custom_data":"Business Development Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455720089","ip":"31.221.68.82","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455720158","ip":"31.221.68.82","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455720811","ip":"31.221.68.82","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455722870","ip":"5.135.143.104","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":3.1997,"lat":50.6931,"region":"Roubaix - France"}},{"time":"1455722912","ip":"5.135.143.104","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":3.1997,"lat":50.6931,"region":"Roubaix - France"}},{"time":"1455730210","ip":"31.221.68.82","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455730226","ip":"31.221.68.82","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455730592","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455744558","ip":"80.240.136.71","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455758989","ip":"78.46.37.41","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":11.0683,"lat":49.4478,"region":"Nuremberg - Germany"}},{"time":"1455781576","ip":"51.255.36.87","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":3.1997,"lat":50.6931,"region":"Roubaix - France"}},{"time":"1455781578","ip":"51.255.36.87","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":3.1997,"lat":50.6931,"region":"Roubaix - France"}},{"time":"1455781580","ip":"51.255.36.87","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":3.1997,"lat":50.6931,"region":"Roubaix - France"}},{"time":"1455793583","ip":"83.199.49.86","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":-2.0787,"lat":47.7765,"region":"Sixt-sur-Aff - France"}},{"time":"1455796525","ip":"162.210.196.98","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-77.5366,"lat":38.7932,"region":"Manassas - United States"}},{"time":"1455796527","ip":"162.210.196.98","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":-77.5366,"lat":38.7932,"region":"Manassas - United States"}},{"time":"1455796530","ip":"162.210.196.98","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":-77.5366,"lat":38.7932,"region":"Manassas - United States"}},{"time":"1455798127","ip":"188.226.247.155","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455814227","ip":"178.62.148.228","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455814230","ip":"95.85.47.123","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455814317","ip":"95.85.47.123","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455814906","ip":"95.85.52.54","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455828138","ip":"68.180.228.152","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":-122.0074,"lat":37.4249,"region":"Sunnyvale - United States"}},{"time":"1455832910","ip":"188.226.144.252","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455875172","ip":"95.85.52.54","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455882379","ip":"90.199.96.13","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455882408","ip":"90.199.96.13","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455891538","ip":"178.255.215.69","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":2.21823,"lat":48.782,"region":"V\u00e9lizy-Villacoublay - France"}},{"time":"1455897794","ip":"94.199.151.22","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":-0.0830327,"lat":51.523,"region":"London - United Kingdom"}},{"time":"1455897808","ip":"94.199.151.22","device":"2","custom_data":"Business Developer","ip_data":{"lng":-0.0830327,"lat":51.523,"region":"London - United Kingdom"}},{"time":"1455897815","ip":"94.199.151.22","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-0.0830327,"lat":51.523,"region":"London - United Kingdom"}},{"time":"1455897822","ip":"94.199.151.22","device":"2","custom_data":"Content Marketing Internship","ip_data":{"lng":-0.0830327,"lat":51.523,"region":"London - United Kingdom"}},{"time":"1455897830","ip":"94.199.151.22","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":-0.0830327,"lat":51.523,"region":"London - United Kingdom"}},{"time":"1455897837","ip":"94.199.151.22","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0830327,"lat":51.523,"region":"London - United Kingdom"}},{"time":"1455897851","ip":"94.199.151.22","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":-0.0830327,"lat":51.523,"region":"London - United Kingdom"}},{"time":"1455897858","ip":"94.199.151.22","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":-0.0830327,"lat":51.523,"region":"London - United Kingdom"}},{"time":"1455897881","ip":"94.199.151.22","device":"2","custom_data":"Media Buyer","ip_data":{"lng":-0.0830327,"lat":51.523,"region":"London - United Kingdom"}},{"time":"1455897905","ip":"94.199.151.22","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0830327,"lat":51.523,"region":"London - United Kingdom"}},{"time":"1455897930","ip":"94.199.151.22","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":-0.0830327,"lat":51.523,"region":"London - United Kingdom"}},{"time":"1455900746","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455903768","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455903788","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455903812","ip":"31.221.68.82","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455903830","ip":"31.221.68.82","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455927858","ip":"188.226.223.177","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455943934","ip":"188.226.185.191","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455943981","ip":"95.85.18.74","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455944109","ip":"188.226.247.155","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455944791","ip":"188.226.196.167","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1455962566","ip":"188.226.247.155","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456004744","ip":"2.29.9.200","device":"1","custom_data":"French-speaking Account Manager","ip_data":{"lng":-1.4248,"lat":50.9171,"region":"Southampton - United Kingdom"}},{"time":"1456005180","ip":"188.226.185.191","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456058887","ip":"80.240.136.71","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456069123","ip":"81.64.154.100","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.9167,"lat":45.7333,"region":"Bron - France"}},{"time":"1456073652","ip":"178.62.148.228","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456073871","ip":"188.226.247.155","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456074018","ip":"188.226.247.155","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456074913","ip":"188.226.196.167","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456075609","ip":"94.193.196.51","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.631836,"lat":51.5192,"region":"Slough - United Kingdom"}},{"time":"1456075623","ip":"94.193.196.51","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.631836,"lat":51.5192,"region":"Slough - United Kingdom"}},{"time":"1456078981","ip":"66.249.79.168","device":"2","custom_data":"Business Developer","ip_data":{"lng":-122.0574,"lat":37.4192,"region":"Mountain View - United States"}},{"time":"1456091270","ip":"178.255.215.69","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":2.21823,"lat":48.782,"region":"V\u00e9lizy-Villacoublay - France"}},{"time":"1456080661","ip":"66.249.79.175","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":-122.0574,"lat":37.4192,"region":"Mountain View - United States"}},{"time":"1456091274","ip":"178.255.215.69","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":2.21823,"lat":48.782,"region":"V\u00e9lizy-Villacoublay - France"}},{"time":"1456091271","ip":"178.255.215.69","device":"2","custom_data":"Business Developer","ip_data":{"lng":2.21823,"lat":48.782,"region":"V\u00e9lizy-Villacoublay - France"}},{"time":"1456092253","ip":"178.62.176.64","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456097379","ip":"78.235.0.14","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":2.549,"lat":48.8537,"region":"Neuilly-sur-Marne - France"}},{"time":"1456149918","ip":"167.114.209.28","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":-73.5747,"lat":45.504,"region":"Montreal - Canada"}},{"time":"1456134910","ip":"178.62.159.51","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456178199","ip":"82.242.180.243","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.9102,"lat":44.956,"region":"Bourg-les-Valence - France"}},{"time":"1456184560","ip":"95.85.18.74","device":"2","custom_data":"Business Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456190132","ip":"95.85.52.54","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456203384","ip":"95.85.18.74","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456203752","ip":"178.62.176.64","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456203904","ip":"188.226.223.177","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456204845","ip":"95.85.47.123","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456208220","ip":"180.76.15.28","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":116.3883,"lat":39.9289,"region":"Beijing - China"}},{"time":"1456222620","ip":"188.226.185.191","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456225682","ip":"180.76.15.140","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":116.3883,"lat":39.9289,"region":"Beijing - China"}},{"time":"1456227821","ip":"5.9.85.4","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":12.4869,"lat":49.0976,"region":"Falkenstein - Germany"}},{"time":"1456227825","ip":"5.9.85.4","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":12.4869,"lat":49.0976,"region":"Falkenstein - Germany"}},{"time":"1456227828","ip":"5.9.85.4","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":12.4869,"lat":49.0976,"region":"Falkenstein - Germany"}},{"time":"1456234195","ip":"91.212.128.201","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-1.6743,"lat":48.112,"region":"Rennes - France"}},{"time":"1456241118","ip":"192.99.44.141","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":-73.5747,"lat":45.504,"region":"Montreal - Canada"}},{"time":"1456265019","ip":"188.226.223.177","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456283704","ip":"180.76.15.32","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":116.3883,"lat":39.9289,"region":"Beijing - China"}},{"time":"1456314431","ip":"188.226.144.252","device":"2","custom_data":"Business Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456319996","ip":"188.226.185.191","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456333458","ip":"188.226.196.167","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456333641","ip":"188.226.223.177","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456333687","ip":"188.226.247.155","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456334611","ip":"188.226.185.191","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456354092","ip":"80.240.132.125","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456380389","ip":"82.94.179.38","device":"2","custom_data":"Media Buyer","ip_data":{"lng":4.92265,"lat":52.3687,"region":"Amsterdam (Oostelijke Eilanden en Kadijken) - Netherlands"}},{"time":"1456380736","ip":"82.94.179.38","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":4.92265,"lat":52.3687,"region":"Amsterdam (Oostelijke Eilanden en Kadijken) - Netherlands"}},{"time":"1456380820","ip":"82.94.179.38","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.92265,"lat":52.3687,"region":"Amsterdam (Oostelijke Eilanden en Kadijken) - Netherlands"}},{"time":"1456394777","ip":"188.226.144.252","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456397528","ip":"158.69.225.35","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":-73.5747,"lat":45.504,"region":"Montreal - Canada"}},{"time":"1456398711","ip":"180.76.15.22","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":116.3883,"lat":39.9289,"region":"Beijing - China"}},{"time":"1456444163","ip":"188.226.185.191","device":"2","custom_data":"Business Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456463400","ip":"178.62.176.64","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456449816","ip":"95.85.47.123","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456463407","ip":"95.85.47.123","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456463991","ip":"80.240.138.58","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456464384","ip":"95.85.18.74","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456477577","ip":"31.221.68.82","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456477609","ip":"31.221.68.82","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456485170","ip":"178.62.176.64","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456503520","ip":"89.92.222.69","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":2.3822,"lat":48.8817,"region":"Paris - France"}},{"time":"1456503995","ip":"86.123.242.159","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":21.9031,"lat":45.6886,"region":"Lugoj - Romania"}},{"time":"1456504443","ip":"31.221.68.82","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456508564","ip":"31.221.68.82","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456508789","ip":"51.255.65.15","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":3.1997,"lat":50.6931,"region":"Roubaix - France"}},{"time":"1456524428","ip":"188.226.247.155","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456535233","ip":"136.243.103.156","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":10.7806,"lat":49.1247,"region":"Gunzenhausen (Frickenfelden) - Germany"}},{"time":"1456535227","ip":"136.243.103.156","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":10.7806,"lat":49.1247,"region":"Gunzenhausen (Frickenfelden) - Germany"}},{"time":"1456535239","ip":"136.243.103.156","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":10.7806,"lat":49.1247,"region":"Gunzenhausen (Frickenfelden) - Germany"}},{"time":"1456535243","ip":"136.243.103.156","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":10.7806,"lat":49.1247,"region":"Gunzenhausen (Frickenfelden) - Germany"}},{"time":"1456535247","ip":"136.243.103.156","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":10.7806,"lat":49.1247,"region":"Gunzenhausen (Frickenfelden) - Germany"}},{"time":"1456546261","ip":"173.193.219.168","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":-77.4311,"lat":38.8943,"region":"Chantilly - United States"}},{"time":"1456546264","ip":"173.193.219.168","device":"2","custom_data":"Business Developer","ip_data":{"lng":-77.4311,"lat":38.8943,"region":"Chantilly - United States"}},{"time":"1456546265","ip":"173.193.219.168","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-77.4311,"lat":38.8943,"region":"Chantilly - United States"}},{"time":"1456546266","ip":"173.193.219.168","device":"2","custom_data":"Content Marketing Internship","ip_data":{"lng":-77.4311,"lat":38.8943,"region":"Chantilly - United States"}},{"time":"1456546267","ip":"173.193.219.168","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":-77.4311,"lat":38.8943,"region":"Chantilly - United States"}},{"time":"1456546268","ip":"173.193.219.168","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-77.4311,"lat":38.8943,"region":"Chantilly - United States"}},{"time":"1456546270","ip":"173.193.219.168","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":-77.4311,"lat":38.8943,"region":"Chantilly - United States"}},{"time":"1456546271","ip":"173.193.219.168","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":-77.4311,"lat":38.8943,"region":"Chantilly - United States"}},{"time":"1456546272","ip":"173.193.219.168","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-77.4311,"lat":38.8943,"region":"Chantilly - United States"}},{"time":"1456546273","ip":"173.193.219.168","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":-77.4311,"lat":38.8943,"region":"Chantilly - United States"}},{"time":"1456555997","ip":"188.226.223.177","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456573862","ip":"178.62.148.228","device":"2","custom_data":"Business Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456579469","ip":"178.62.148.228","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456593028","ip":"188.226.185.191","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456593085","ip":"95.85.52.54","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456593840","ip":"95.85.18.74","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456593994","ip":"178.62.159.51","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456599047","ip":"86.246.151.215","device":"0","custom_data":"Business Development Internship","ip_data":{"lng":2.1333,"lat":48.6833,"region":"Gif-sur-Yvette - France"}},{"time":"1456615051","ip":"188.226.247.155","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456649391","ip":"86.246.151.215","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":2.1333,"lat":48.6833,"region":"Gif-sur-Yvette - France"}},{"time":"1456654269","ip":"178.62.159.51","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456665083","ip":"178.24.113.152","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":10.453,"lat":51.2217,"region":"M\u00fchlhausen - Germany"}},{"time":"1456665131","ip":"178.24.113.152","device":"2","custom_data":"Business Developer","ip_data":{"lng":10.453,"lat":51.2217,"region":"M\u00fchlhausen - Germany"}},{"time":"1456665134","ip":"178.24.113.152","device":"2","custom_data":"Content Marketing Internship","ip_data":{"lng":10.453,"lat":51.2217,"region":"M\u00fchlhausen - Germany"}},{"time":"1456665139","ip":"178.24.113.152","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":10.453,"lat":51.2217,"region":"M\u00fchlhausen - Germany"}},{"time":"1456665142","ip":"178.24.113.152","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":10.453,"lat":51.2217,"region":"M\u00fchlhausen - Germany"}},{"time":"1456666710","ip":"51.255.65.64","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":3.1997,"lat":50.6931,"region":"Roubaix - France"}},{"time":"1456674404","ip":"88.172.52.223","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":1.0029,"lat":49.2867,"region":"Elbeuf - France"}},{"time":"1456674583","ip":"88.172.52.223","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":1.0029,"lat":49.2867,"region":"Elbeuf - France"}},{"time":"1456685691","ip":"188.226.144.252","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456703698","ip":"95.85.47.123","device":"2","custom_data":"Business Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456709250","ip":"188.226.247.155","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456722816","ip":"178.62.148.228","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456722869","ip":"188.226.144.252","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456723596","ip":"178.62.159.51","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456723748","ip":"188.226.247.155","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456736619","ip":"78.193.181.65","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":2.4394,"lat":48.8117,"region":"Maisons-Alfort - France"}},{"time":"1456737541","ip":"81.91.247.148","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456745284","ip":"80.240.138.58","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456756045","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456756417","ip":"31.221.68.82","device":"2","custom_data":"Content Marketing Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456756471","ip":"31.221.68.82","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456756503","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456756936","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456756943","ip":"31.221.68.82","device":"2","custom_data":"Business Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456757142","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456757149","ip":"104.45.18.178","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456757162","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456757173","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456757813","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456757850","ip":"31.221.68.82","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456758734","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456758976","ip":"31.221.68.82","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456759152","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456764759","ip":"87.113.245.42","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456783999","ip":"188.226.247.155","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456815683","ip":"188.226.247.155","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456824952","ip":"66.249.78.54","device":"0","custom_data":"Business Developer","ip_data":{"lng":-122.0574,"lat":37.4192,"region":"Mountain View - United States"}},{"time":"1456830880","ip":"109.200.26.5","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456830886","ip":"109.200.26.5","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456831700","ip":"178.255.215.69","device":"2","custom_data":"Content Marketing Internship","ip_data":{"lng":2.21823,"lat":48.782,"region":"V\u00e9lizy-Villacoublay - France"}},{"time":"1456833472","ip":"178.62.176.64","device":"2","custom_data":"Business Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456834574","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456838939","ip":"69.30.215.26","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":-94.566,"lat":39.1068,"region":"Kansas City - United States"}},{"time":"1456838869","ip":"95.85.47.123","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456838935","ip":"69.30.215.26","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-94.566,"lat":39.1068,"region":"Kansas City - United States"}},{"time":"1456838937","ip":"69.30.215.26","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":-94.566,"lat":39.1068,"region":"Kansas City - United States"}},{"time":"1456845383","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456845400","ip":"31.221.68.82","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456845412","ip":"31.221.68.82","device":"2","custom_data":"Business Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456847914","ip":"90.206.118.174","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456848174","ip":"90.206.118.174","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456849387","ip":"90.206.118.174","device":"2","custom_data":"Content Marketing Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456852897","ip":"188.226.247.155","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456852952","ip":"178.62.159.51","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456853015","ip":"86.166.241.58","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456853677","ip":"178.62.159.51","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456856998","ip":"37.205.58.146","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456853681","ip":"95.85.18.74","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456857214","ip":"37.205.58.146","device":"2","custom_data":"Business Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456871533","ip":"86.181.89.135","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456872274","ip":"51.255.65.66","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":3.1997,"lat":50.6931,"region":"Roubaix - France"}},{"time":"1456875584","ip":"188.226.144.252","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456886342","ip":"62.210.90.118","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":2.32142,"lat":48.8713,"region":"Paris (8th arrondissement of Paris) - France"}},{"time":"1456886345","ip":"62.210.90.118","device":"2","custom_data":"Business Developer","ip_data":{"lng":2.32142,"lat":48.8713,"region":"Paris (8th arrondissement of Paris) - France"}},{"time":"1456886347","ip":"62.210.90.118","device":"2","custom_data":"Content Marketing Internship","ip_data":{"lng":2.32142,"lat":48.8713,"region":"Paris (8th arrondissement of Paris) - France"}},{"time":"1456895095","ip":"51.255.65.74","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":3.1997,"lat":50.6931,"region":"Roubaix - France"}},{"time":"1456914889","ip":"80.12.90.62","device":"2","custom_data":"Business Developer","ip_data":{"lng":2.3417,"lat":48.8592,"region":"Paris - France"}},{"time":"1456915213","ip":"80.240.136.71","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456917252","ip":"162.243.44.92","device":"2","custom_data":"Business Developer","ip_data":{"lng":-73.9865,"lat":40.749,"region":"New York - United States"}},{"time":"1456917347","ip":"162.243.44.92","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":-73.9865,"lat":40.749,"region":"New York - United States"}},{"time":"1456917437","ip":"162.243.44.92","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":-73.9865,"lat":40.749,"region":"New York - United States"}},{"time":"1456917453","ip":"162.243.44.92","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-73.9865,"lat":40.749,"region":"New York - United States"}},{"time":"1456917462","ip":"162.243.44.92","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":-73.9865,"lat":40.749,"region":"New York - United States"}},{"time":"1456917497","ip":"162.243.44.92","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":-73.9865,"lat":40.749,"region":"New York - United States"}},{"time":"1456917522","ip":"162.243.44.92","device":"2","custom_data":"Content Marketing Internship","ip_data":{"lng":-73.9865,"lat":40.749,"region":"New York - United States"}},{"time":"1456917582","ip":"162.243.44.92","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":-73.9865,"lat":40.749,"region":"New York - United States"}},{"time":"1456917608","ip":"162.243.44.92","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-73.9865,"lat":40.749,"region":"New York - United States"}},{"time":"1456917977","ip":"162.243.44.92","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-73.9865,"lat":40.749,"region":"New York - United States"}},{"time":"1456930810","ip":"86.164.46.204","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.1,"lat":51.55,"region":"London - United Kingdom"}},{"time":"1456936294","ip":"2.218.155.76","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.4167,"lat":51.45,"region":"Feltham - United Kingdom"}},{"time":"1456936607","ip":"2.218.155.76","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.4167,"lat":51.45,"region":"Feltham - United Kingdom"}},{"time":"1456937073","ip":"2.218.155.76","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.4167,"lat":51.45,"region":"Feltham - United Kingdom"}},{"time":"1456943758","ip":"37.205.58.146","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456943798","ip":"37.205.58.146","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456943818","ip":"37.205.58.146","device":"2","custom_data":"Business Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456947162","ip":"188.226.185.191","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456963722","ip":"178.62.159.51","device":"2","custom_data":"Business Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456968884","ip":"188.226.185.191","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456982851","ip":"95.85.52.54","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456982891","ip":"178.62.159.51","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456983457","ip":"178.62.159.51","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1456983615","ip":"188.226.247.155","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457005515","ip":"95.85.18.74","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457018549","ip":"90.61.51.165","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":2.4645,"lat":48.8915,"region":"Noisy-le-Sec - France"}},{"time":"1457039871","ip":"52.18.194.68","device":"2","custom_data":"Content Marketing Internship","ip_data":{"lng":-6.2489,"lat":53.3331,"region":"Dublin - Ireland"}},{"time":"1457039879","ip":"52.18.194.68","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-6.2489,"lat":53.3331,"region":"Dublin - Ireland"}},{"time":"1457039880","ip":"52.18.194.68","device":"2","custom_data":"Business Developer","ip_data":{"lng":-6.2489,"lat":53.3331,"region":"Dublin - Ireland"}},{"time":"1457039912","ip":"52.18.194.68","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-6.2489,"lat":53.3331,"region":"Dublin - Ireland"}},{"time":"1457039914","ip":"52.18.194.68","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":-6.2489,"lat":53.3331,"region":"Dublin - Ireland"}},{"time":"1457039915","ip":"52.18.194.68","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":-6.2489,"lat":53.3331,"region":"Dublin - Ireland"}},{"time":"1457039917","ip":"52.18.194.68","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":-6.2489,"lat":53.3331,"region":"Dublin - Ireland"}},{"time":"1457039935","ip":"52.18.194.68","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-6.2489,"lat":53.3331,"region":"Dublin - Ireland"}},{"time":"1457039940","ip":"52.18.194.68","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":-6.2489,"lat":53.3331,"region":"Dublin - Ireland"}},{"time":"1457039963","ip":"52.18.194.68","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":-6.2489,"lat":53.3331,"region":"Dublin - Ireland"}},{"time":"1457046195","ip":"188.226.185.191","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457077125","ip":"95.85.52.54","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457093537","ip":"95.85.18.74","device":"2","custom_data":"Business Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457098627","ip":"95.85.18.74","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457109450","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1457109475","ip":"31.221.68.82","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1457112586","ip":"178.62.148.228","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457112632","ip":"178.62.176.64","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457113217","ip":"178.62.148.228","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457113468","ip":"95.85.18.74","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457128910","ip":"79.67.176.3","device":"2","custom_data":"Business Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1457135253","ip":"95.85.52.54","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457149810","ip":"68.180.228.152","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":-122.0074,"lat":37.4249,"region":"Sunnyvale - United States"}},{"time":"1457176127","ip":"95.85.18.74","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457188639","ip":"86.185.27.252","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-1.5631,"lat":54.7684,"region":"Durham - United Kingdom"}},{"time":"1457189647","ip":"92.251.74.102","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":14.4989,"lat":35.8731,"region":"Paola - Malta"}},{"time":"1457206984","ip":"178.62.159.51","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457223718","ip":"188.226.196.167","device":"2","custom_data":"Business Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457228471","ip":"95.85.47.123","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457234485","ip":"78.46.37.41","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":11.0683,"lat":49.4478,"region":"Nuremberg - Germany"}},{"time":"1457242257","ip":"95.85.52.54","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457242696","ip":"80.240.138.58","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457242876","ip":"188.226.247.155","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457243154","ip":"178.62.176.64","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457248852","ip":"89.2.73.61","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":3.1746,"lat":50.6942,"region":"Roubaix - France"}},{"time":"1457249633","ip":"212.194.181.127","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":2.4991,"lat":48.8702,"region":"Rosny-sous-Bois - France"}},{"time":"1457265065","ip":"178.62.176.64","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457286787","ip":"82.225.173.144","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":5.0167,"lat":47.3167,"region":"Dijon - France"}},{"time":"1457286863","ip":"82.225.173.144","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":5.0167,"lat":47.3167,"region":"Dijon - France"}},{"time":"1457306326","ip":"95.85.47.123","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457336679","ip":"188.226.144.252","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457353842","ip":"95.85.18.74","device":"2","custom_data":"Business Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457358535","ip":"95.85.18.74","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457372000","ip":"178.62.159.51","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457372605","ip":"188.226.247.155","device":"2","custom_data":"Graphic Designer Intern","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457372798","ip":"178.62.148.228","device":"2","custom_data":"Inbound Marketing Manager","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457372973","ip":"95.85.18.74","device":"2","custom_data":"Senior Front End Developer","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457389170","ip":"90.198.250.110","device":"2","custom_data":"Business Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1457395174","ip":"80.240.138.58","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":4.8897,"lat":52.374,"region":"Amsterdam - Netherlands"}},{"time":"1457398733","ip":"188.29.165.93","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1457411519","ip":"82.94.179.38","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":4.92265,"lat":52.3687,"region":"Amsterdam (Oostelijke Eilanden en Kadijken) - Netherlands"}},{"time":"1457411567","ip":"82.94.179.38","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":4.92265,"lat":52.3687,"region":"Amsterdam (Oostelijke Eilanden en Kadijken) - Netherlands"}}]',true);
            $conversion = json_decode('[{"time":"1455643838","ip":"31.221.68.82","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455700003","ip":"31.221.68.82","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455730262","ip":"31.221.68.82","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455730608","ip":"31.221.68.82","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1455793796","ip":"83.199.49.86","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":-2.0787,"lat":47.7765,"region":"Sixt-sur-Aff - France"}},{"time":"1455882483","ip":"90.199.96.13","device":"2","custom_data":"Customer Service Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456477636","ip":"31.221.68.82","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456503580","ip":"89.92.222.69","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":2.3822,"lat":48.8817,"region":"Paris - France"}},{"time":"1456649493","ip":"86.246.151.215","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":2.1333,"lat":48.6833,"region":"Gif-sur-Yvette - France"}},{"time":"1456674537","ip":"88.172.52.223","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":1.0029,"lat":49.2867,"region":"Elbeuf - France"}},{"time":"1456736764","ip":"78.193.181.65","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":2.4394,"lat":48.8117,"region":"Maisons-Alfort - France"}},{"time":"1456848013","ip":"90.206.118.174","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456848199","ip":"90.206.118.174","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456872252","ip":"86.181.89.135","device":"2","custom_data":"Solution Marketing Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456930918","ip":"86.164.46.204","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.1,"lat":51.55,"region":"London - United Kingdom"}},{"time":"1456937107","ip":"2.218.155.76","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.4167,"lat":51.45,"region":"Feltham - United Kingdom"}},{"time":"1456943785","ip":"37.205.58.146","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1456943877","ip":"37.205.58.146","device":"2","custom_data":"Business Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}},{"time":"1457018600","ip":"90.61.51.165","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":2.4645,"lat":48.8915,"region":"Noisy-le-Sec - France"}},{"time":"1457188812","ip":"86.185.27.252","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":-1.5631,"lat":54.7684,"region":"Durham - United Kingdom"}},{"time":"1457190182","ip":"92.251.74.102","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":14.4989,"lat":35.8731,"region":"Paola - Malta"}},{"time":"1457248930","ip":"89.2.73.61","device":"2","custom_data":"Business Development Internship","ip_data":{"lng":3.1746,"lat":50.6942,"region":"Roubaix - France"}},{"time":"1457249711","ip":"212.194.181.127","device":"2","custom_data":"French-speaking Account Manager","ip_data":{"lng":2.4991,"lat":48.8702,"region":"Rosny-sous-Bois - France"}},{"time":"1457286827","ip":"82.225.173.144","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":5.0167,"lat":47.3167,"region":"Dijon - France"}},{"time":"1457286884","ip":"82.225.173.144","device":"2","custom_data":"Affiliate Marketing Internship","ip_data":{"lng":5.0167,"lat":47.3167,"region":"Dijon - France"}},{"time":"1457389223","ip":"90.198.250.110","device":"2","custom_data":"Business Developer","ip_data":{"lng":-0.0941,"lat":51.5144,"region":"London - United Kingdom"}}]',true);

            delete_post_meta($_GET['id'], 'impressions');
            delete_post_meta($_GET['id'], 'conversions');

            foreach($impression as $imp){
                add_post_meta($_GET['id'],'impressions',$imp);
            }

            foreach($conversion as $conv){
                add_post_meta($_GET['id'],'conversions',$conv);
            }

            die();
        } */

        $time = microtime();

        $_GET['id'] = (int)$_GET['id'];


        if (isset($_GET['id']) && !empty($_GET['id'])) {
            $form = new WP_Form($_GET['id']);

            // Get the row impressions
            $impressions = get_post_meta(filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT), 'impressions');
            $conversions = get_post_meta(filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT), 'conversions');

            if(isset($_GET['updateData']))
                include __DIR__ . '/templates/update_stats.php';




            // Data from the user
            $start = isset($_GET['period']) ? filter_var($_GET['period'], FILTER_SANITIZE_STRING) : '1 month ago';
            $end = 'today';
            $filter = isset($_GET['groupby']) ? filter_var($_GET['groupby'], FILTER_SANITIZE_STRING) : 'days';
            $format = isset($_GET['format']) ? $_GET['format'] : 'd/m/Y';
            $device = isset($_GET['device']) && in_array($_GET['device'], ['mobile', 'desktop', 'tablet', 'all']) ? $_GET['device'] : 'all';


            /** Fixed vars : **/

            // Data linked to impressions
            $imps = [
                'ips' => [],
                'total' => 0,
                'data' => [],
                'devices' => [
                    'mobile' => 0,
                    'tablet' => 0,
                    'desktop' => 0
                ],
                'regions' => [],
                'custom_datas' => []
            ];

            // Data linked to conversions
            $convs = [
                'ips' => [],
                'total' => 0,
                'data' => [],
                'devices' => [
                    'mobile' => 0,
                    'tablet' => 0,
                    'desktop' => 0
                ],
                'regions' => [],
                'custom_datas' => []
            ];
            $startTimestamp = strtotime($start);
            $endTimestamp = strtotime($end . "+ 1 $filter");

            // This is all the data used
            $nbj = 0;
            while (strtotime("$start  + $nbj $filter") <= $endTimestamp) {
                $dt = date($format, strtotime("$start + $nbj $filter"));
                if (!isset($imps['data'][$dt]))
                    $imps['data'][$dt] = 0;
                if (!isset($convs['data'][$dt]))
                    $convs['data'][$dt] = 0;
                $nbj++;
            }


            $args = [
                'start' => $startTimestamp,
                'end' => $endTimestamp,
                'format' => $format,
                'unique' => isset($_GET['unique']),
                'device' => $device,
                'custom_data' => isset($_GET['custom_data']) && !empty($_GET['custom_data']) ? $_GET['custom_data'] : null,
                'include_my_ip' => isset($_GET['include_my_ip'])
            ];



            // Put the data inside the impression table
            foreach ($impressions as $impression) {

                // if (!FormWordpress::isRobotIp($impression['ip']))
                $imps = self::putInTab($imps, $impression, $args);
            }


            foreach ($conversions as $key => $conversion) {

                //  if (!FormWordpress::isRobotIp($conversion['ip']))
                $convs = self::putInTab($convs, $conversion, $args);
            }


            // Add the ips into the regions & handle the number of person per region
            foreach ($imps['ips'] as $ip) {
                if (!array_key_exists($ip['region'], $imps['regions'])) {
                    $imps['regions'][$ip['region']] = 1;
                } else {
                    $imps['regions'][$ip['region']]++;
                }
            }
            arsort($imps['regions']);


            // Handle the tab
            $tabData = [];
            foreach ($impressions as $impression) {

                // if (FormWordpress::isRobotIp($impression['ip']))
                //    continue;

                if ($impression['time'] > $args['end'])
                    continue;
                elseif ($impression['time'] < $args['start'])
                    continue;

                $customData = isset($impression['custom_data']) && !empty($impression['custom_data']) ? $impression['custom_data'] : ' - ';

                if (!isset($tabData[$impression['ip'] . ' - ' . $customData])) {
                    if ($impression['ip'] != $_SERVER['REMOTE_ADDR'] || isset($_GET['include_my_ip'])) {


                        // Handle Conversion
                        $conversion = self::_CONVERSION_MISSED;
                        if (array_key_exists($impression['ip'], $convs['ips'])) {

                            $conversion = self::_CONVERSION_PART;
                            if ($impression['custom_data'] == $convs['ips'][$impression['ip']]['custom_data'])
                                $conversion = self::_CONVERSION_DONE;
                        }


                        $tmp = [
                            'date' => date('d-m-Y H:i', $impression['time']),
                            'ip' => $impression['ip'],
                            'location' => isset($imps['ips'][$impression['ip']]['region']) ? $imps['ips'][$impression['ip']]['region'] : ' - ',
                            'custom_data' => $customData,
                            'nb_impression' => 1,
                            'device' => $impression['device'],
                            'conversion' => $conversion,
                        ];

                        $tabData[$impression['ip'] . ' - ' . $customData] = $tmp;
                    }
                } else {
                    $tabData[$impression['ip'] . ' - ' . $customData]['date'] = date('d-m-Y H:i', $impression['time']);
                    $tabData[$impression['ip'] . ' - ' . $customData]['nb_impression']++;
                }

            }

            usort($tabData, [$this, 'sortByDate']);


            if (isset($_GET['download_as_csv']) && $_GET['download_as_csv']) {

                $head = [
                    __("Dernière visite", 'easy-form'),
                    __("Adresse IP", 'easy-form'),
                    __("Région", 'easy-form'),
                    __("Appareil", 'easy-form'),
                    __("Champ Personnalisé", 'easy-form'),
                    __("Nombre de visites", 'easy-form'),
                    __("Conversion", 'easy-form'),
                ];

                $this->convert_to_csv($tabData, $head, 'export.csv');

                die();
            }
        }

        // Getting all forms
        $args = [
            'post_type' => 'form-plugin-bastien',
            'posts_per_page' => -1,
        ];

        $my_query = new WP_Query($args);


        include __DIR__ . '/templates/stats.php';

        vardump(microtime() - $time);

    }

    private static function sortByDate($a, $b)
    {
        return strtotime($b['date']) - strtotime($a['date']);
    }


    /**
     *
     * @Since V 0.5.5
     *
     * This convert a table to a CSV file
     *
     * @param array $input_array
     * @param array|null $input_head a table with all headers of the tab
     * @param string $output_file_name
     * @param string $delimiter
     */
    private function convert_to_csv($input_array, $input_head = null, $output_file_name = 'export.csv', $delimiter = ',')
    {
        /** open raw memory as file, no need for temp files, be careful not to run out of memory thought */
        $f = fopen('php://memory', 'w');

        if (isset($input_head) && is_array($input_head)) {
            fputcsv($f, $input_head, $delimiter);
        }

        /** loop through array  */
        foreach ($input_array as $line) {
            /** default php csv handler **/
            fputcsv($f, $line, $delimiter);
        }
        /** rewrind the "file" with the csv lines **/
        fseek($f, 0);
        /** modify header to be downloadable csv file **/
        header('Content-Type: application/csv');
        header('Content-Disposition: attachement; filename="' . $output_file_name . '";');
        /** Send file to browser for download */
        fpassthru($f);
    }


    /**
     *
     * @Since V 0.5.5
     *
     * Add the value in the chart datas if needed
     *
     * @param $tab array The values to put data in
     * @param $value array the value to put in the chart
     * @param $args array start of the chart
     *          * start int start of the chart
     *          * end int end of the chart
     *          * format string the format of the date
     *          * unique bool  if the visitor is unique or not
     *          * device int the device used (mobile, desktop...) with FormWordPress consts
     *          * custom_data string a data used to filter more
     *
     * @return array the array with all the datas
     */
    protected static function putInTab($tab, $value, $args)
    {


        if ($value['time'] > $args['end'])
            return $tab;
        elseif ($value['time'] < $args['start'])
            return $tab;
        else {
            // Sort by custom data
            if (($args['custom_data'] == null || $args['custom_data'] == $value['custom_data'])) {

                if ($args['include_my_ip'] || ($value['ip'] != $_SERVER['REMOTE_ADDR'])) {

                    // Sort by uniq value
                    if ((!$args['unique'] || !in_array($value['ip'], $tab['ips']))) {

                        // If the date is one we want to display
                        if (isset($tab['data'][date($args['format'], $value['time'])])) {

                            // Increment the date (+1 Visit)
                            $tab['data'][date($args['format'], $value['time'])]++;


                            // Put the user IP in the ip tabs (in case we want unique users)
                            if (array_key_exists($value['ip'], $tab['ips'])) {
                                $tab['ips'][$value['ip']] = $value['ip_data'];
                            } else
                                $tab['ips'][$value['ip']]['number']++;


                            // Switch the device value
                            $value['device'] = isset($value['device']) ? $value['device'] : 'desktop';
                            switch ($value['device']) {
                                case FormWordpress::_MOBILE:
                                    $tab['devices']['mobile']++;
                                    break;
                                case FormWordpress::_TABLET:
                                    $tab['devices']['tablet']++;
                                    break;
                                case FormWordpress::_DESKTOP:
                                    $tab['devices']['desktop']++;
                                    break;
                            }
                        }
                    }
                    $tab['total']++;
                }
            }
            // Put the custom data so it will always be available
            if (!in_array($value['custom_data'], $tab['custom_datas']) && $value['custom_data'] != null)
                array_push($tab['custom_datas'], $value['custom_data']);

            return $tab;
        }
    }

    /**
     *
     * Check if the id is a form
     *
     * @param $formId
     * @return bool
     */
    protected function isForm($formId)
    {
        $form = get_post(filter_var($formId, FILTER_SANITIZE_NUMBER_INT));
        // If it's a form
        return ($form->post_type == 'form-plugin-bastien');

    }

}

if (class_exists('FormPlugin')) {

    $formPlugin = new FormPlugin();
    register_activation_hook(__FILE__, array($formPlugin, 'activate'));
}