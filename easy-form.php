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
     *          - V 0.5.5 (Add stat-form in the pages & add Mobile_Detect lib)
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
     * Displays the admin page
     */
    public function displayPage()
    {

        // I check if there is a duplicate action
        $this->handleDuplicate();

        $formTable = new FormListTable();

        $formTable->prepare_items();
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

    /**
     *
     * @Since V 0.5.5
     *
     * Display the stats page
     */
    public function displayStat()
    {

        $_GET['id'] = (int)$_GET['id'];

        if (isset($_GET['id']) && !empty($_GET['id'])) {
            $form = new WP_Form($_GET['id']);

            // Get the row impressions
            $impressions = get_post_meta(filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT), 'impressions');
            $conversions = get_post_meta(filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT), 'conversions');

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
                $imps = self::putInTab($imps, $impression, $args);
            }
            foreach ($conversions as $conversion) {
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
                if ($impression['time'] > $args['end'])
                    continue;
                elseif ($impression['time'] < $args['start'])
                    continue;
                if (!isset($tabData[$impression['ip']])) {
                    if ($impression['ip'] != $_SERVER['REMOTE_ADDR'] || isset($_GET['include_my_ip'])) {
                        $tmp = [
                            'date' => date('d-m-Y H:i', $impression['time']),
                            'ip' => $impression['ip'],
                            'location' => isset($imps['ips'][$impression['ip']]['region']) ? $imps['ips'][$impression['ip']]['region'] : ' - ',
                            'custom_data' => isset($impression['custom_data']) && !empty($impression['custom_data']) ? $impression['custom_data'] : ' - ',
                            'nb_impression' => $imps['ips'][$impression['ip']]['number'],
                            'device' => $impression['device'],
                            'conversion' => array_key_exists($impression['ip'], $convs['ips']),
                        ];

                        $tabData[$impression['ip']] = $tmp;
                    }
                } else {
                    $tabData[$impression['ip']]['date'] = date('d-m-Y H:i', $impression['time']);
                }

            }
            $tabData = array_reverse($tabData, true);


        }

        // Getting all forms
        $args = [
            'post_type' => 'form-plugin-bastien',
            'posts_per_page' => -1,
        ];

        $my_query = new WP_Query($args);

        //  die();


        include __DIR__ . '/templates/stats.php';
    }


    /**
     * @Since V 0.5.5
     *
     * @param $ip string the user Ip Address
     * @return array
     */
    private function getIpData($ip)
    {
        $geoplugin = json_decode(file_get_contents('http://ip-api.com/json/' . $ip), true);

        $data = [
            'lng' => is_numeric($geoplugin['lon']) ? $geoplugin['lon'] : 0,
            'lat' => is_numeric($geoplugin['lat']) ? $geoplugin['lat'] : 0,
            'region' => $geoplugin['city'] . ' - ' . $geoplugin['country'],
            'number' => 1,
        ];

        return $data;

    }

    /**
     *
     * @Since V 0.5.5
     *
     * Add the value in the chart datas if needed
     *
     * @param $tab array The values to put data in
     * @param $value int the value to put in the chart
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
                            if (!array_key_exists($value['ip'], $tab['ips'])) {
                                $tab['ips'][$value['ip']] = self::getIpData($value['ip']);
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