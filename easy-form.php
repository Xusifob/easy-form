<?php
/*
Plugin Name: Easy WP Form
Plugin URI: http://baltazare.fr
Description: Permet de créer et styliser des formulaires facilement
Version: 0.5.3
Author: Bastien Malahieude
Author URI: http://bastienmalahieude.fr
License: MIT
*/

//TODO Add textaera & file options

ini_set('max_execution_time',3600);

class FormPlugin
{
    /**
     * Constructeur
     */
    public function __construct()
    {
        /** Include all classes */
        if(!class_exists('Form'))
            include_once plugin_dir_path( __FILE__ ).'/src/Form.php';

        if(!class_exists('FormWordpress'))
            include_once plugin_dir_path( __FILE__ ).'/src/FormWordpress.php';

        if(!class_exists('FormListTable'))
            include_once plugin_dir_path( __FILE__ ).'/src/FormListTable.php';

        if(!class_exists('WP_Form'))
            include_once plugin_dir_path( __FILE__ ).'/src/WP_Form.php';

        if(!class_exists('PHPMailer'))
            include_once plugin_dir_path( __FILE__ ).'/src/class-phpmailer.php';

        // Gestion de la partie admin
        if(is_admin()){
            $pgs = [
                'forms',
                'add-form',
                'show-form',
                'import-form',
                'export-form',
                'doc-form',

            ];

            if(isset($_GET['page']) && in_array($_GET['page'],$pgs)) {
                require_once __DIR__ . '/templates/head-admin.php';
                add_action('admin_footer', [$this, 'includeFooterAdmin']);
            }
            add_action('admin_menu', [$this, 'addAdminMenu']);
        }else{
            // use of sessions
            if(phpversion() >= 5.4){
                if (session_status() == PHP_SESSION_NONE)
                    session_start();
            }else{
                if(session_id() == '')
                    session_start();
            }
        }
    }

    /**
     * Called on plugin activation : Create user & usermeta tabs
     */
    public function activate(){
        /** @var $wpdb wpdb */
        global $wpdb;

        $table = $wpdb->prefix . 'easy_form_users';
        $table_meta = $wpdb->prefix . 'easy_form_usermeta';

        // Create user table
        if($wpdb->get_var("show tables like '$table'") != $table){
            $sql = "CREATE TABLE $table LIKE {$wpdb->prefix}users";

            require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
            dbDelta($sql);
        }

        // Create usermeta table
        if($wpdb->get_var("show tables like '$table_meta'") != $table_meta){
            $sql = "CREATE TABLE $table_meta LIKE {$wpdb->prefix}usermeta";

            require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
            dbDelta($sql);
        }
    }



    /**
     * Ajoute le menu
     */
    public function addAdminMenu()
    {
        // Menu formulaire/Tous les formulaires
        add_menu_page('Easy Forms','Easy Forms','edit_plugins','forms',[$this,'displayPage'],'dashicons-feedback',21);

        // Ajouter/modifier un formulaire
        add_submenu_page('forms','Ajouter un formulaire','Ajouter','edit_plugins','add-form',[$this,'displayPageAddForm']);
        // Prévisualiser son formulaire
        add_submenu_page('forms','Voir un formulaire','Prévisualiser','edit_plugins','show-form',[$this,'displayPrev']);

        add_submenu_page('forms','Importer un formulaire','Importer','edit_plugins','import-form',[$this,'displayImport']);

        // Exporter un formulaire
        add_submenu_page('forms','Exporter un formulaire','Exporter','edit_plugins','export-form',[$this,'displayExport']);

        // Doc
        add_submenu_page('forms','Documentation','Doccumentation','edit_plugins','doc-form',[$this,'displayDoc']);

    }


    /**
     *
     * Create a header not in admin
     *
     */
    public function includeHead()
    {
        require_once __DIR__ . '/templates/head.php';
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
    public function displayPageAddForm(){

        // Vérifie les données de champs dupliqués
        $this->handleDuplicateFields();

        // Vérifie les données post envoyées
        $this->handleAdd();

        // If there ia a modify var
        if(isset($_GET['modify']) && !empty($_GET['modify'])){

            $form = get_post($_GET['modify']);
            if($this->isForm($_GET['modify'])){

                $formMetas = get_post_meta($_GET['modify']);
                $formArgs = get_post_meta($_GET['modify'],'form-args');
                $formFields = get_post_meta($_GET['modify'],'form-fields');
                $submitArgs = get_post_meta($_GET['modify'],'form-submit-args');
                $formSendArgs = get_post_meta($_GET['modify'],'form-send-args');


                $i = 1;
                foreach ($formFields[0] as $key => $field) {
                    $formFields[0][$key]['id'] = $i;
                    $i++;
                }
            }else
                unset($form);

        }

        // Set all vars used in add.php
        $inputs = [
            'text', 'email', 'password','repeatPassword', 'number', 'tel', 'date', 'checkbox', 'select', 'radio', 'url', 'range', 'color', 'search', 'hidden','file','textarea','taxonomy','wp_editor','open container','close container', 'close all container',
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
        if(isset($_GET['id']) && !empty($_GET['id'])){
            $form = new WP_Form($_GET['id']);

            $formFields = get_post_meta($_GET['id'],'form-fields')[0];
        }
        else{
            // Getting all forms
            $args = [
                'post_type' => 'form-plugin-bastien',
                'posts_per_page' => -1,
            ];

            $my_query = new WP_Query($args);
        }
        include __DIR__ . '/templates/preview.php';
    }

    /**
     * Display the import page
     */
    public function displayImport()
    {
        if(true === $error = $this->handleImport()){
            $result = $this->ImportForm();

            if($result['error'] == true)
                $error = $result['message'];
            else
                $success = $result['message'];
        }

        include __DIR__ . '/templates/import.php';
    }


    /**
     * @since V 0.1
     *
     * @Updated :  - V 0.2
     *              - V 0.3
     *              - V 0.4
     *              - V 0.5.2 (Add Sanitization0
     *              - V 0.5.3 (Remove sanitization for label)
     *
     *
     * Check if add form is send
     */
    public function handleAdd()
    {
        // If the form is send
        if(isset($_POST['add-form-plugin-bastien']) && 'send' == $_POST['add-form-plugin-bastien']){

            //TODO all verifications depending on type

            // If the form has a title
            if(isset($_POST['form-title'])){
                $postInfos = [
                    'post_name' => sanitize_title(filter_var($_POST['form-title']),FILTER_SANITIZE_STRING),
                    'post_title' => filter_var($_POST['form-title'],FILTER_SANITIZE_STRING),
                    'post_status' => 'publish',
                    'post_type' => 'form-plugin-bastien',
                ];
                if(isset($_POST['form-id']) && !empty($_POST['form-id'])) {
                    // I insert the post
                    wp_update_post($postInfos);
                    $pid = filter_var($_POST['form-id'],FILTER_SANITIZE_NUMBER_INT);
                }else{
                    // I insert the post
                    $pid = wp_insert_post($postInfos);
                }

                // If the post is inserted
                if(!is_wp_error($pid)){

                    // All actions
                    update_post_meta($pid,'action',$_POST['form-action']);
                    update_post_meta($pid,'form-args',[
                        'defaultClass' => filter_var($_POST['form-class-defaut'],FILTER_SANITIZE_STRING),
                        'class' => filter_var($_POST['form-class'],FILTER_SANITIZE_STRING),
                        'id' => filter_var($_POST['form-id-form'],FILTER_SANITIZE_STRING),
                        'displayErrors' => isset($_POST['form-display-errors']),
                        'displayErrorsBefore' => isset($_POST['form-display-errors-before']),
                    ]);

                    $fields = [];

                    if(is_array($_POST['field'])) {
                        foreach ($_POST['field'] as $field) {
                            switch ($field['form-type']) {
                                case 'open_container' :
                                    $fi = [
                                        'container' => filter_var($field['form-container'],FILTER_SANITIZE_STRING),
                                        'args' => [
                                            'id' => filter_var($field['form-container-id'],FILTER_SANITIZE_NUMBER_INT),
                                            'class' => filter_var($field['form-container-class'],FILTER_SANITIZE_STRING),
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
                                            'id' => filter_var($field['form-id'],FILTER_SANITIZE_NUMBER_INT),
                                            'class' => filter_var($field['form-class'],FILTER_SANITIZE_STRING),
                                            'multiple' => (isset($field['form-multiple'])),
                                            'label' => $field['form-label'],FILTER_SANITIZE_STRING,
                                            'labelClass' => filter_var($field['form-label-class'],FILTER_SANITIZE_STRING),
                                            'required' => (isset($field['form-required'])),
                                            'labelAfter' => (isset($field['form-label-after'])),
                                            'allowed' => explode(',', filter_var($field['form-allowed']),FILTER_SANITIZE_STRING),
                                            'acfField' => filter_var($field['form-acf-field'],FILTER_SANITIZE_STRING),
                                            'maxSize' => filter_var($field['form-max-size'],FILTER_SANITIZE_NUMBER_INT),
                                        ]
                                    ];
                                    break;
                                // If it's a field
                                case 'taxonomy' :
                                    $fi = [
                                        'args' => [
                                            'id' => filter_var($field['form-id'],FILTER_SANITIZE_NUMBER_INT),
                                            'class' => filter_var($field['form-class'],FILTER_SANITIZE_STRING),
                                            'value' => filter_var($field['form-value'],FILTER_SANITIZE_STRING),
                                            'label' => $field['form-label'],
                                            'labelClass' => filter_var($field['form-label-class'],FILTER_SANITIZE_STRING),
                                            'required' => isset($field['form-required']),
                                            'autocomplete' => isset($field['form-autocomplete']),
                                            'labelAfter' => isset($field['form-label-after']),
                                            'taxonomy' => filter_var($field['form-taxonomy'],FILTER_SANITIZE_STRING),
                                            'emptyField' => filter_var($field['form-empty-field'],FILTER_SANITIZE_STRING),
                                            'taxonomyType' => filter_var($field['form-taxonomy-type'],FILTER_SANITIZE_STRING),
                                            'readOnly' => isset($field['form-readonly']),

                                        ]
                                    ];
                                    break;
                                default :

                                    $fi = [
                                        'args' => [
                                            'id' => filter_var($field['form-id'],FILTER_SANITIZE_NUMBER_INT),
                                            'class' => filter_var($field['form-class'],FILTER_SANITIZE_STRING),
                                            'placeholder' => isset($field['form-placeholder']) ? $field['form-placeholder'] : '' ,
                                            'value' => isset($field['form-value']) ? $field['form-value'] : '',
                                            'label' => $field['form-label'],FILTER_SANITIZE_STRING,
                                            'labelClass' =>filter_var($field['form-label-class'],FILTER_SANITIZE_STRING),
                                            'required' => isset($field['form-required']),
                                            'autocomplete' => isset($field['form-autocomplete']),
                                            'labelAfter' => isset($field['form-label-after']),
                                            'readOnly' => isset($field['form-readonly']),
                                        ]
                                    ];

                                    if ($field['form-type'] == 'select') {
                                        $fi['args']['options'] = [];
                                        // The selected key is the 1st one or the selected option in the radio field
                                        $selected = isset($field['form-select-option-selected']) ? $field['form-select-option-selected'] : array_keys($field['form-select-option'])[0];
                                        foreach ($field['form-select-option'] as $key => $opts) {
                                            $opt = [
                                                'content' => filter_var($opts['name'],FILTER_SANITIZE_STRING),
                                                'value' => filter_var($opts['value'],FILTER_SANITIZE_STRING),
                                                'select' => ($key == $selected),
                                            ];
                                            array_push($fi['args']['options'], $opt);
                                        }
                                        $fi['args']['orderBy'] = $field['form-order-by'];
                                    }
                                    break;
                            }

                            // fields which are here anyway
                            $fi['type'] = filter_var($field['form-type'],FILTER_SANITIZE_STRING);
                            $fi['name'] = filter_var(sanitize_title($field['form-name']),FILTER_SANITIZE_STRING);

                            // At the end, i push everything
                            array_push($fields, $fi);
                        }
                    }
                    // and hop ! post meta
                    update_post_meta($pid,'form-fields',$fields);

                    // send button args
                    update_post_meta($pid,'form-submit-value',$_POST['form-button-send']);
                    update_post_meta($pid,'form-submit-args',[
                        'id' => filter_var($_POST['form-button-send-id'],FILTER_SANITIZE_STRING),
                        'class' => filter_var($_POST['form-button-send-class'],FILTER_SANITIZE_STRING),
                    ]);

                    // Form type args
                    update_post_meta($pid,'form-redirect',filter_var($_POST['form-send-lien']),FILTER_SANITIZE_NUMBER_INT);
                    update_post_meta($pid,'form-var-url',filter_var($_POST['form-var-url'],FILTER_SANITIZE_URL));
                    update_post_meta($pid,'form-type',filter_var($_POST['form-utility'],FILTER_SANITIZE_STRING));

                    switch($_POST['form-utility']){
                        case 'post' :
                            $args = [
                                'post_type' => filter_var($_POST['form-send-type'],FILTER_SANITIZE_STRING),
                                'post_status' => filter_var($_POST['form-send-staut'],FILTER_SANITIZE_STRING),
                            ];
                            update_post_meta($pid,'form-send-args',$args);
                            break;

                        case 'connexion' :
                            $args = [
                                'remember' => 'form-send-remember',
                            ];
                            update_post_meta($pid,'form-send-args',$args);
                            break;

                        case 'user' :
                            $args = [
                                'role' => isset($_POST['form-send-role']) ? filter_var($_POST['form-send-role'],FILTER_SANITIZE_STRING) : 'current',
                                'connectUser' => isset($_POST['form-connexion-user']),
                                'emailUser' => isset($_POST['form-email-user']),
                            ];
                            update_post_meta($pid,'form-send-args',$args);
                            break;

                        case 'email' :
                            $args = [
                                'subject' => filter_var($_POST['form-send-subject'],FILTER_SANITIZE_STRING),
                                'recipientEmail' => filter_var($_POST['form-send-recipientEmail'],FILTER_SANITIZE_EMAIL),
                                'recipientName' => filter_var($_POST['form-send-recipientName'],FILTER_SANITIZE_STRING),
                            ];
                            update_post_meta($pid,'form-send-args',$args);
                            break;

                        case 'resetPassword' :


                            $args = [
                                'subject' => filter_var($_POST['form-send-subject'],FILTER_SANITIZE_STRING),
                                'senderEmail' => filter_var($_POST['form-send-senderEmail'],FILTER_SANITIZE_EMAIL),
                                'senderName' => filter_var($_POST['form-send-senderName'],FILTER_SANITIZE_STRING),
                                'message' => ($_POST['form-send-message']),
                                'resetAction' => filter_var($_POST['form-reset-action'],FILTER_SANITIZE_STRING),
                                'pageId' => filter_var($_POST['form-send-page-id'],FILTER_SANITIZE_NUMBER_INT),
                                'submitValue' => filter_var($_POST['form-send-submit-value'],FILTER_SANITIZE_STRING),

                            ];
                            update_post_meta($pid,'form-send-args',$args);
                            break;
                    }
                    $url = menu_page_url('show-form',false) . '&id=' . $pid;
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

        if(isset($_POST['import-forms-bastien'])) {
            if (isset($_FILES['import-form']) && !empty($_FILES['import-form'])) {

                // Define Vars
                $maxSize = 200000;
                $tmpName = $_FILES['import-form']['tmp_name'];
                $fileName = $_FILES['import-form']['name'];
                $fileSize = $_FILES['import-form']['size'];
                $error = false;

                if($fileSize < $maxSize){
                    $ext = pathinfo($fileName, PATHINFO_EXTENSION);
                    if($ext == 'json'){
                        if(is_writable(plugin_dir_path( __FILE__ ).'/library/uploads/')) {
                            $return = move_uploaded_file($tmpName, plugin_dir_path(__FILE__) . '/library/uploads/' . $fileName);
                            if(!$return)
                                $error = "Une erreur est survenue lors de l'upload du fichier, veuillez réessayer";
                            return $return;
                        }else{
                            $error = 'Le dossier <strong>' . plugin_dir_path( __FILE__ ).'/library/uploads/' . ' </strong>n\'a pas pu être ouvert, vérifiez ses droits d\'écriture';
                        }
                    }else
                        $error = 'Le fichier doit être un .json';
                    return $error;

                }else
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
        if(isset($_POST['action']) && $_POST['action'] == 'duplicate_field') {

            if(!wp_verify_nonce($_POST['wp_nonce'],'duplicate_field'))
                die(json_encode(['Wp_Form_Error' => 'Security Error']));

            $duplicatedField = get_post_meta(filter_var($_POST['form-id'],FILTER_SANITIZE_NUMBER_INT),'form-fields')[0][$_POST['form-duplicate-field-id']];

            $newformFields = get_post_meta(filter_var($_POST['form-duplicate-form'],FILTER_SANITIZE_NUMBER_INT),'form-fields')[0];
            array_push($newformFields,$duplicatedField);

            update_post_meta(filter_var($_POST['form-duplicate-form'],FILTER_SANITIZE_NUMBER_INT),'form-fields',$newformFields);

            $url = menu_page_url('add-form',false) . '&modify=' . $_POST['form-duplicate-form'];
            wp_redirect(filter_var($url),FILTER_SANITIZE_URL);
            die();
        }
    }


    /**
     * Handle duplicate forms
     */
    public function handleDuplicate()
    {
        if(isset($_POST['form-duplicate']) && !empty($_POST['form-duplicate'])){
            // If the form has a title
            if(isset($_POST['form-duplicate-name'])) {

                if($this->isForm($_POST['form-duplicate-id'])) {
                    $form = get_post(filter_var($_POST['form-duplicate-id'],FILTER_SANITIZE_NUMBER_INT));

                    $formMetas = get_post_meta(filter_var($_POST['form-duplicate-id'],FILTER_SANITIZE_NUMBER_INT));


                    $postInfos = [
                        'post_name' => filter_var(sanitize_title($_POST['form-duplicate-name']),FILTER_SANITIZE_STRING),
                        'post_title' => filter_var($_POST['form-duplicate-name'],FILTER_SANITIZE_STRING),
                        'post_status' => $form->post_status,
                        'post_type' => $form->post_type,
                    ];

                    $pid = wp_insert_post($postInfos);


                    if(!is_wp_error($pid)){
                        // Mono args
                        update_post_meta($pid,'action',$formMetas['action'][0]);
                        update_post_meta($pid,'form-submit-value',$formMetas['form-submit-value'][0]);
                        update_post_meta($pid,'form-redirect',$formMetas['form-redirect'][0]);
                        update_post_meta($pid,'form-type',$formMetas['form-type'][0]);


                        // Multiple args
                        $formArgs = get_post_meta($_POST['form-duplicate-id'],'form-args');
                        update_post_meta($pid,'form-args',$formArgs[0]);
                        $formFields = get_post_meta($_POST['form-duplicate-id'],'form-fields');
                        update_post_meta($pid,'form-fields',$formFields[0]);


                        $formSubmitArgs = get_post_meta($_POST['form-duplicate-id'],'form-submit-args');
                        update_post_meta($pid,'form-submit-args',$formSubmitArgs[0]);
                        $formSendArgs = get_post_meta($_POST['form-duplicate-id'],'form-send-args');
                        update_post_meta($pid,'form-send-args',$formSendArgs[0]);

                        $url = menu_page_url('show-form',false) . '&id=' . $pid;
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

                    if($this->isForm($formId)){

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
        $file = plugin_dir_path( __FILE__ ).'/library/uploads/' .  $_FILES['import-form']['name'];

        // I get the json file content
        $json = file_get_contents($file);

        // I get the json content in php
        $array = json_decode($json);

        $flag = true;

        foreach($array as $form){
            $postargs = [
                'post_name' => sanitize_title($form->post_title),
                'post_title' => $form->post_title,
                'post_status' => $form->post_status,
                'post_type' => 'form-plugin-bastien',
            ];
            $pid = wp_insert_post($postargs);

            if($pid){
                foreach($form->metas as $key => $meta){

                    if(strpos($key,'args') || $key == 'form-fields')
                        update_post_meta($pid,$key,unserialize($meta));
                    else
                        update_post_meta($pid,$key,$meta);
                }
            }else
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
        fputs($f,json_encode($val,JSON_PRETTY_PRINT));
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
        foreach ($wp_roles->roles as $key => $rl){
            array_push($rls,[
                'slug' => $key,
                'name' => filter_var($rl['name'],FILTER_SANITIZE_STRING),
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
     * Check if the id is a form
     *
     * @param $formId
     * @return bool
     */
    protected function isForm($formId)
    {
        $form = get_post(filter_var($formId,FILTER_SANITIZE_NUMBER_INT));
        // If it's a form
        return($form->post_type == 'form-plugin-bastien');

    }

}
if(class_exists('FormPlugin')) {

    $formPlugin = new FormPlugin();
    register_activation_hook(__FILE__, array($formPlugin, 'activate'));


}