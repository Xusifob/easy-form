<?php


if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 *
 * used to create form
 *
 * Class Form
 */
class Form
{
    /**
     * All fields content in the form
     *
     * @var array
     */
    protected $fields = [];

    /**
     * This is an array which comport the form
     *
     * @var array
     */
    protected $template = [];


    /**
     *
     * This is the default class which will be added to every form component (input, selects...)
     *
     * @var string
     */
    protected $defaultclass;

    /**
     * @var bool
     */
    protected $formFinish = false;

    /**
     * @var array
     */
    protected $containers = [];

    /**
     * @var null|array
     */
    protected $postArgs = null;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $error;

    /**
     * @var array
     */
    protected $errors = [];


    /**
     * @var array
     */
    protected $args = [];


    /**
     * This is the action of the form
     *
     * @var string
     */
    protected $action;


    /**
     * a uniqId to avoid bug when there is multiples version of the same form in the page
     *
     * @since V 0.4
     *
     * @var string
     */
    protected $uniqId;


    /**
     *
     * @since V 0.1
     *
     * @var array
     */
    protected $errorMessages = [
        "missing" => "Un ou plusieurs champs n'est pas complet",
        "email" => "Adresse e-mail invalide",
        "2password" => "Veuillez retaper votre mot de passe",
        "samepassword" => "Les deux mots de passe entrés doivent être identiques",
        "filetype" => "Le type du fichier chargé est incorrect, Les types acceptés sont : ",
        "identifiants" => "Identifiants incorrects",
        "empty" => "Ce champ doit être rempli",
        "missingfield" => "Le formulaire doit avoir un champ ",
        "noUser" => "Aucun utilisateur n'a été trouvé avec cet identifiant",
        "noReset" => "La réinitialisation de mot de passe n'est pas autorisée sur cet utilisateur",
        "error" => "Une erreur est survenue",
        "filesize" => "La taille du fichier est trop importante, taille maximum : ",
        "errorDatabase" => "Une erreur est survenue lors de la modification de l'utilisateur",
        "expiredKey" => "La clé utilisée est expirée",
        "invalidKey" => "La clé utilisée est invalide",
        "alreadyActivated" => "Utilisateur introuvable ou déjà activé"
    ];

    /**
     * @Since V 0.1
     *
     * @Updated :  - V 0.2
     *              - V 0.3
     *              - V 0.4
     *              - V 0.5
     *              - V 0.5.3 (Update error message translation)
     *              - V 0.5.4 (Add style for sr-only)
     *
     *
     * Constructor
     *
     * @param string $name
     * @param string $action
     * @param array $args
     */
    public function __construct($name, $action = '#', $args = [])
    {


        // Args action & name
        $this->action = $action;
        $this->args['defaultclass'] = isset($args['defaultClass']) ? $args['defaultClass'] : '';
        $this->args['displayErrors'] = isset($args['displayErrors']) ? $args['displayErrors'] : '';


        // Handle it here so that they can bee seen as strings to translate
        if (function_exists('__')) {
            $this->errorMessages["missing"] = __("Un ou plusieurs champs n'est pas complet", 'easy-form');
            $this->errorMessages["email"] = __("Adresse e-mail invalide", 'easy-form');
            $this->errorMessages["2password"] = __("Veuillez retaper votre mot de passe", 'easy-form');
            $this->errorMessages["samepassword"] = __("Les deux mots de passe entrés doivent être identiques", 'easy-form');
            $this->errorMessages["filetype"] = __("Le type du fichier chargé est incorrect, Les types acceptés sont : ", 'easy-form');
            $this->errorMessages["identifiants"] = __("Identifiants incorrects", 'easy-form');
            $this->errorMessages["empty"] = __("Ce champ doit être rempli", 'easy-form');
            $this->errorMessages["missingfield"] = __("Le formulaire doit avoir un champ ", 'easy-form');
            $this->errorMessages["noUser"] = __("Aucun utilisateur n'a été trouvé avec cet identifiant", 'easy-form');
            $this->errorMessages["noReset"] = __("La réinitialisation de mot de passe n'est pas autorisée sur cet utilisateur", 'easy-form');
            $this->errorMessages["error"] = __("Une erreur est survenue", 'easy-form');
            $this->errorMessages["filesize"] = __("La taille du fichier est trop importante, taille maximum : ", 'easy-form');
            $this->errorMessages["errorDatabase"] = __("Une erreur est survenue lors de la modification de l'utilisateur", 'easy-form');
            $this->errorMessages["expiredKey"] = __("La clé utilisée est expirée", 'easy-form');
            $this->errorMessages["invalidKey"] = __("La clé utilisée est invalide", 'easy-form');
            $this->errorMessages["alreadyActivated"] = __("Utilisateur introuvable ou déjà activé", 'easy-form');
        } else {
            $this->errorMessages["missing"] = "Un ou plusieurs champs n'est pas complet";
            $this->errorMessages["email"] = "Adresse e-mail invalide";
            $this->errorMessages["2password"] = "Veuillez retaper votre mot de passe";
            $this->errorMessages["samepassword"] = "Les deux mots de passe entrés doivent être identiques";
            $this->errorMessages["filetype"] = "Le type du fichier chargé est incorrect, Les types acceptés sont : ";
            $this->errorMessages["identifiants"] = "Identifiants incorrects";
            $this->errorMessages["empty"] = "Ce champ doit être rempli";
            $this->errorMessages["missingfield"] = "Le formulaire doit avoir un champ ";
            $this->errorMessages["noUser"] = "Aucun utilisateur n'a été trouvé avec cet identifiant";
            $this->errorMessages["noReset"] = "La réinitialisation de mot de passe n'est pas autorisée sur cet utilisateur";
            $this->errorMessages["error"] = "Une erreur est survenue";
            $this->errorMessages["filesize"] = "La taille du fichier est trop importante, taille maximum : ";
            $this->errorMessages["errorDatabase"] = "Une erreur est survenue lors de la modification de l'utilisateur";
            $this->errorMessages["expiredKey"] = "La clé utilisée est expirée";
            $this->errorMessages["invalidKey"] = "La clé utilisée est invalide";
            $this->errorMessages["alreadyActivated"] = "Utilisateur introuvable ou déjà activé";
        }


        $this->name = $name;
        $this->uniqId = uniqid();



        // Save post Id
        if (isset($args['postId']))
            $this->postArgs['id'] = $args['postId'];


        // Save post Type
        if (isset($args['formType']))
            $this->postArgs['formType'] = $args['formType'];

        if ($this->isResetForm() && $this->resetArgsAvailable()) {
            $this->args['submitValue'] = isset($args['form-send-args']['submitValue']) ? $args['form-send-args']['submitValue'] : null;
        }

        $template['field'] = '<form action="' . $this->action . '" ';
        $template['field'] .= $this->classAndId($args);
        $template['field'] .= isset($args['enctype']) ? 'enctype="' . $args['enctype'] . ' "' : 'enctype="multipart/form-data" ';
        $template['field'] .= isset($args['method']) ? 'method="' . $args['method'] . '" ' : 'method="POST"';
        $template['field'] .= '>';

        // Add Security Nounce
        $nonce = wp_create_nonce($this->name);

        $template['field'] .= '<input type="hidden" name="_nounce" value="' . $nonce . '" >';
        $template['field'] .= '<input type="hidden" name="_time" value="' . microtime(true) . '" >';

        $template['field'] .= "
<style>.sr-only{position: absolute;top: -9999px;left: -9999px;}.antispam{display: none !important;}</style>
<input type='text' name='url-antispam' class='antispam' id='antispam-$this->uniqId'>
                    <label for='antispam-$this->uniqId' class='antispam'>Do not type anything here</label>";

        $this->template['open_the_form'] = $template;
    }


    /**
     *
     * @Since V 0.1
     *
     * Creates a container around a field
     *
     * @param $container
     * @param array $args
     * @return $this
     */
    public function openContainer($container, $args = [])
    {
        if (!$this->formFinish) {
            $template['field'] = '<' . $container . ' ';
            $template['field'] .= $this->classAndId($args);
            $template['field'] .= '>';
            array_push($this->template, $template);
            array_push($this->containers, $container);
        }
        return $this;
    }

    /**
     *
     * @Since V 0.1
     *
     * Closes a container around a field
     *
     * @return $this
     */
    public function closeContainer()
    {
        if (!$this->formFinish) {
            $container = array_pop($this->containers);

            if ($container != null) {
                $template['field'] = '</' . $container . '>';
                array_push($this->template, $template);
            }
        }
        return $this;
    }


    /**
     *
     * @Since V 0.1
     *
     * @param string $error
     * @return $this
     */
    public function setError($error)
    {

        $this->error = $error;
        return $this;
    }


    /**
     *
     * @Since V 0.1
     *
     * @Updated :   - V 0.2
     *              - V 0.3
     *              - V 0.4
     *              - v 0.5.4 (Update $template from string to array with label and field keys, add __() function in placeholder value and label)
     *
     * add a field in the form
     *
     * @param string $field
     * @param string $name
     * @param array $args
     *
     * @return $this
     */
    public function addField($field, $name, $args = [])
    {

        if (!$this->formFinish) {

            // Handle an update post
            if (null != $this->postArgs && isset($this->postArgs['id'])) {

                // If user & post, full the form
                if ($this->postArgs['formType'] == 'user' || $this->postArgs['formType'] == 'post') {


                    // If user
                    if ($this->postArgs['formType'] == 'user') {


                        // Get not metas infos
                        $notMetas = [
                            'password',
                            'email',
                            'login',
                            'url',
                            'first_name',
                            'last_name',
                            'content',
                        ];

                        // Val = info (if exists)
                        if (!in_array($name, $notMetas)) {
                            $val = get_user_meta($this->postArgs['id'], $name);
                            $val = isset($val[0]) ? $val[0] : false;
                        } else {

                            // Val = info
                            $user = get_userdata($this->postArgs['id']);
                            if ($name != 'password' && $name != 'repeat-password') {
                                switch ($name) {
                                    case 'email' :
                                        $val = $user->user_email;
                                        break;
                                    case 'url' :
                                        $val = $user->user_url;
                                        break;
                                    case 'first_name' :
                                        $val = $user->first_name;
                                        break;
                                    case 'last_name' :
                                        $val = $user->last_name;
                                        break;
                                    case 'description' :
                                        $val = FormWordpress::user_meta($this->postArgs['id'], 'description');
                                        break;
                                    case 'content' :
                                        $val = FormWordpress::user_meta($this->postArgs['id'], 'description');
                                        break;
                                }
                            }
                        }

                    } elseif ($this->postArgs['formType'] == 'post') {
                        $val = get_post_meta($this->postArgs['id'], $name);
                        $notMetas = ['content', 'title'];
                        // Val = info (if exists)
                        if (!in_array($name, $notMetas)) {
                            $val = get_post_meta($this->postArgs['id'], $name);
                            $val = isset($val[0]) ? $val[0] : false;
                        } else {
                            $thepost = get_post($this->postArgs['id']);

                            if ($name == 'content')
                                $val = $thepost->post_content;
                            elseif ($name == 'title')
                                $val = $thepost->post_title;
                        }
                    }
                }
            }


            $template['field'] = '';

            $inputs = [
                'text', 'email', 'password', 'repeatPassword', 'number', 'tel', 'date', 'checkbox', 'radio', 'url', 'range', 'color', 'search', 'hidden', 'file',
            ];

            // List of arguments
            $theClass = (isset($args['class']) && !empty($args['class'])) ? $args['class'] : $this->args['defaultclass'];
            $theId = (isset($args['id']) && !empty($args['id'])) ? $args['id'] : $name . '-' . $this->uniqId;

            // Label handling
            $theLabel = '<label for="' . $theId . '" ';
            $theLabel .= isset($args['labelClass']) && !empty($args['labelClass']) ? 'class="' . $args['labelClass'] . ' "' : (isset($args['label']) && !empty($args['label']) ? '' : 'class="sr-only" ');
            $theLabel .= '>';
            $theLabel .= isset($args['label']) && !empty($args['label']) ? (function_exists('__') ? __($args['label'],'easy-form-userData') : $args['label'] ) : $name;
            $theLabel .= '</label>';
            $thePlaceholder = isset($args['placeholder']) && !empty($args['placeholder']) ? (function_exists('__') ? __($args['placeholder'],'easy-form-userData') : $args['placeholder'] ) : false;
            $theAutocomplete = isset($args['autocomplete']) && !empty($args['autocomplete']) ? $args['autocomplete'] : true;
            $theValue = htmlspecialchars(isset($args['value']) && !empty($args['value']) ? (function_exists('__') ? __($args['value'],'easy-form-userData') : $args['value'] ) : ((isset($_POST[$name]) ? $_POST[$name] : ((isset($val)) ? $val : false))));
            $theRequired = isset($args['required']) ? $args['required'] : true;


            // If it's a field input
            if (in_array($field, $inputs)) {

                /*
                 // I start the field
                 if (!isset($args['labelAfter']) || !$args['labelAfter'])
                     $template .= $theLabel; */


                // If is a password repeater
                if ($field == 'repeatPassword')
                    $template['field'] .= '<input type="password" ';
                else
                    $template['field'] .= '<input type="' . $field . '" ';

                $template['field'] .= 'id="' . $theId . '" ';
                // Handle readonly fields
                if (!isset($args['readOnly']) || empty($args['readOnly']))
                    $template['field'] .= isset($args['multiple']) && $args['multiple'] && $field == 'file' ? 'name="' . $name . '[]" ' : 'name="' . $name . '" ';
                else
                    $template['field'] .= ' readonly disabled ';

                $template['field'] .= 'class="' . $theClass . '" ';
                $template['field'] .= isset($args['multiple']) && $args['multiple'] && $field == 'file' ? 'multiple ' : '';
                $template['field'] .= $thePlaceholder ? 'placeholder="' . $thePlaceholder . '" ' : '';
                if ($field != 'file') {
                    if (!is_wp_error($theValue))
                        $template['field'] .= $theValue ? 'value="' . $theValue . '" ' : '';
                    else
                        $this->setError('Un ou plusieurs champ est incorrect');
                }
                $template['field'] .= $theAutocomplete ? 'autocomplete="' . $theAutocomplete . '" ' : '';

                // Handle checked
                if ($field == 'checkbox') {
                    $template['field'] .= (isset($args['checked']) && $args['checked'] == true) ? 'checked ' : '';
                }
                $template['field'] .= $theRequired ? 'required' : '';
                $template['field'] .= '>';

                if ($field == 'file' && isset($val) && $args['multiple'] && !is_wp_error($val)) {
                    $template['field'] .= '<input type="hidden" value="' . implode(',', $val) . '" name="' . $name . '-values">';
                }

                //DEPRECIATED WILL BE REMOVES
                // Second field password
                if ($field == 'password' && isset($args['multiple']) && $args['multiple'] == true) {
                    $template['field'] .= '<input type="' . $field . '"';
                    $template['field'] .= 'id="' . $theId . '-2"';
                    $template['field'] .= 'name="' . $name . '-2"';
                    $template['field'] .= 'class="' . $theClass . '"';
                    $template['field'] .= $thePlaceholder ? 'placeholder="' . $thePlaceholder . '"' : '';
                    $template['field'] .= $theValue ? 'value="' . $theValue . '"' : '';
                    $template['field'] .= $theRequired ? 'required' : '';
                    $template['field'] .= '>';
                }
                // DEPRECIATED

                /*if (isset($args['labelAfter']) && $args['labelAfter'])
                    $template .= $theLabel; */


            } else {
                switch ($field) {
                    case 'select':

                        $template['field'] .= '<select ';
                        $template['field'] .= 'id="' . $theId . '" ';

                        // Handle multiple
                        if (isset($args['multiple']) && true == $args['multiple'])
                            $template['field'] .= 'name="' . $name . '[]" ';
                        else
                            $template['field'] .= 'name="' . $name . '" ';
                        $template['field'] .= 'class="' . $theClass . '"';
                        $template['field'] .= $thePlaceholder ? 'placeholder="' . $thePlaceholder . '" ' : '';
                        $template['field'] .= $theRequired ? 'required ' : '';
                        $template['field'] .= '>';

                        // Display all options
                        if (is_array($args['options'])):

                            if (isset($args['orderBy'])) {
                                switch ($args['orderBy']) {
                                    case 'croissant' :
                                        asort($args['options']);
                                        break;
                                    case 'decroissant' :
                                        arsort($args['options']);
                                        break;
                                }
                            }
                            foreach ($args['options'] as $option) {
                                $template['field'] .= '<option value="' . $option['value'] . '" ';

                                // Handle the selection
                                if (isset($val) && !empty($val)) {
                                    if ($option['value'] == $val)
                                        $template['field'] .= 'selected';

                                } elseif (isset($option['select']) && ($option['select']))
                                    $template['field'] .= 'selected';

                                $template['field'] .= ">";
                                $template['field'] .= $option['content'];
                                $template['field'] .= '</option>';
                            }
                        endif;
                        $template['field'] .= '</select>';
                        break;

                    case 'taxonomy':

                        // prevent old version
                        $args['taxonomyType'] = isset($args['taxonomyType']) ? $args['taxonomyType'] : 'select';

                        switch ($args['taxonomyType']) {
                            case 'select' :
                                $template['field'] .= '<select ';
                                $template['field'] .= 'id="' . $theId . '" ';


                                $template['field'] .= 'name="' . $name . '" ';
                                $template['field'] .= 'class="' . $theClass . '"';
                                $template['field'] .= $thePlaceholder ? 'placeholder="' . $thePlaceholder . '" ' : '';
                                $template['field'] .= $theRequired ? 'required ' : '';
                                $template['field'] .= '>';

                                $taxs = get_terms(substr($name, 9), [
                                    'hide_empty' => false,
                                ]);

                                // Display all options
                                if (is_array($taxs)):
                                    if (isset($args['emptyField']) && !empty($args['emptyField']))
                                        $template['field'] .= '<option>' . $args['emptyField'] . '</option>';
                                    foreach ($taxs as $option) {
                                        $template['field'] .= '<option value="' . $option->slug . '" ';

                                        // Handle the selection
                                        if (isset($val) && !empty($val)) {
                                            if ($option->slug == $val)
                                                $template['field'] .= 'selected';
                                        }
                                        $template['field'] .= ">";
                                        $template['field'] .= $option->name;
                                        $template['field'] .= '</option>';
                                    }
                                endif;
                                $template['field'] .= '</select>';
                                break;
                            case 'hidden' :
                                $template['field'] = '<input type="hidden" name="' . $name . '" value="' . $theValue . '">';
                                break;
                        }


                        break;

                    // Display a textaera
                    case 'textarea' :
                        $template['field'] .= '<textarea ';
                        $template['field'] .= 'id="' . $theId . '" ';
                        $template['field'] .= 'name="' . $name . '" ';
                        $template['field'] .= 'class="' . $theClass . '" ';
                        $template['field'] .= isset($args['rows']) ? 'rows="' . $args['rows'] . '" ' : '';
                        $template['field'] .= isset($args['cols']) ? 'rows="' . $args['cols'] . '" ' : '';
                        $template['field'] .= $thePlaceholder ? 'placeholder="' . $thePlaceholder . '" ' : '';
                        $template['field'] .= $theRequired ? 'required ' : '';
                        $template['field'] .= '>';
                        $template['field'] .= $theValue ? $theValue : '';
                        $template['field'] .= '</textarea>';
                        break;

                    // Display a textaera
                    case 'textaera' :
                        $template['field'] .= '<textarea ';
                        $template['field'] .= 'id="' . $theId . '" ';
                        $template['field'] .= 'name="' . $name . '" ';
                        $template['field'] .= 'class="' . $theClass . '"';
                        $template['field'] .= isset($args['rows']) ? 'rows="' . $args['rows'] . '" ' : '';
                        $template['field'] .= isset($args['cols']) ? 'rows="' . $args['cols'] . '" ' : '';
                        $template['field'] .= $thePlaceholder ? 'placeholder="' . $thePlaceholder . '" ' : '';
                        $template['field'] .= $theRequired ? 'required ' : '';
                        $template['field'] .= '>';
                        $template['field'] .= $theValue ? $theValue : '';
                        $template['field'] .= '</textarea>';
                        break;

                    case 'wp_editor' :
                        $template['field'] .= $this->get_wp_editor($theValue, sanitize_title($name), [
                            'textarea_name' => $name,
                            'textarea_rows' => isset($args['rows']) ? $args['rows'] : 10,
                            'editor_class' => isset($args['class']) ? $args['class'] : '',
                            'media_buttons' => isset($args['media_buttons']) ? $args['media_buttons'] : true,
                        ]);
                        break;
                }
            }

            $template['label'] = $theLabel;

            // Handle the radio field
            if ($field == 'radio') {
                $rad = 0;

                // While there is a radio field
                while (isset($this->template[$name . '_' . $rad]))
                    $rad++;

                $this->template[$name . '_' . $rad] = $template;

            } else
                $this->template[$name] = $template;

            $thefield = [
                'name' => $name,
                'type' => $field,
                'required' => $theRequired,
                'args' => $args,
            ];
            $this->fields[$name] = $thefield;
        }
        return $this;
    }

    /**
     *
     * @Since V 0.1
     *
     * @Updated :   - V 0.5
     *              - V 0.5.4 (Add $template['field'] instead of $template)
     *
     * @param string $submitValue
     * @param array $args
     */
    public function finishForm($submitValue = 'Send', $args = [])
    {

        if ($this->isResetForm() && $this->resetArgsAvailable()) {
            $submitValue = $this->args['submitValue'] == null ? $submitValue : $this->args['submitValue'];
        }


        if (!$this->formFinish) {
            $template['field'] = '<input type="submit" name="' . $this->name . '" value="' . $submitValue . '" ';
            $template['field'] .= $this->classAndId($args);
            $template['field'] .= '>';
            $this->template['submit'] = $template;

            $this->closeAllContainers();

            $this->template['close_the_form']['field'] = '</form>';


            $this->formFinish = true;

        }
    }

    /**
     *
     * @Since V 0.1
     *
     * Add Class and Id
     *
     * @param $args
     * @return string
     */
    protected function classAndId($args)
    {

        $template = isset($args['class']) && !empty($args['class']) ? 'class="' . $args['class'] . '" ' : '';
        $template .= isset($args['id']) && !empty($args['id']) ? 'id="' . $args['id'] . '" ' : '';

        return $template;
    }


    /**
     * Return if the form is a reset one
     * @Since V 0.5
     * @return bool
     */
    public function isResetForm()
    {
        return (isset($this->postArgs['formType']) && $this->postArgs['formType'] == 'resetPassword');
    }

    /**
     * Return if the form reset is available
     * @Since V 0.5
     * @return bool
     */
    public function resetArgsAvailable()
    {
        return (isset($_GET['action']) && $_GET['action'] == 'rt' && isset($_GET['key']) && isset($_GET['login']));
    }

    /**
     * @Since V 0.1
     *
     * @Updated :   - V 0.2
     *              - V 0.5
     *              - V 0.5.4 (Remove $f and add support for getting label and fields separetly)
     *
     * Display the form
     *
     * @return string
     */
    public function __toString()
    {


        $templateString = '';

        // Handle Reset Form options,
        // In a reset form, some fields are displays only if the reset form is available, else only the login field is displayed.
        if ($this->isResetForm()) {
            $availableFields = [
                'open_the_form', 'close_the_form', 'submit'
            ];
            if ($this->resetArgsAvailable()) {
                array_push($availableFields, 'password');
                array_push($availableFields, 'repeat-password');
            } else
                array_push($availableFields, 'login');
        }


        foreach ($this->template as $key => $template) {

            // Display only a part of the form
            if ($this->isResetForm()) {
                if (!in_array($key, $availableFields))
                    continue;
            }

            // I check if the label exists
            $label = isset($template['label']) ? $template['label'] : '';

            // Handle errors
            if (isset($this->args['displayErrorsBefore']) && $this->args['displayErrorsBefore']) {
                $templateString .= $this->DisplayOneError($key);
                $templateString .= isset($this->fields[$key]['args']['labelAfter']) && $this->fields[$key]['args']['labelAfter'] ? $template['field'] . $label : $label . $template['field'] . "\n  ";
            } else {
                $templateString .= isset($this->fields[$key]['args']['labelAfter']) && $this->fields[$key]['args']['labelAfter'] ? $template['field'] . $label : $label . $template['field'] . "\n";
                $templateString .= $this->DisplayOneError($key);
            }

        }

        return $templateString;
    }

    /**
     *
     * Display one error
     *
     * @Since V 0.2
     *
     * @Updated : V 0.5.4 (Add obliged var & changed $f to $key for better understanding)
     *
     * @param $key string The field key of the error
     * @param bool $obliged Return the value anyway
     * @return string
     */
    public function DisplayOneError($key, $obliged = false)
    {
        $templateString = '';
        // If i display Errors
        if ($obliged || (isset($this->args['displayErrors']) && true == $this->args['displayErrors'])) {

            // If the field is an input
            if (isset($this->fields[$key])) {

                // If there is an error i display it
                if (isset($this->errors[$key])) {
                    $templateString .= isset($this->args['errorsClass']) ? '<span class="' . $this->args['errorsClass'] . '">' : '<span class="warning">';
                    $templateString .= $this->errors[$key] . "</span>\n";
                }
            }
        }

        return $templateString;
    }

    /**
     * @since V 0.1
     * @Updated :   - V 0.2
     *              - V 0.3
     *              - v 0.5.3 (remove the return if the foreach)
     *
     * @param $formtype string the type of form, if it's a reset form or not
     * @return bool
     */
    public function isValid($formtype = null)
    {
        if (isset($_POST[$this->name]) && !empty($_POST[$this->name])) {

            if (!wp_verify_nonce($_POST['_nounce'], $this->name)) {

                die(json_encode(['Wp_Form_Error' => 'Security check']));

            } else {

                if ($formtype == 'reset' && $this->isResetForm() && !$this->resetArgsAvailable()) {
                    unset($this->fields['password']);
                    unset($this->fields['repeat-password']);

                }
                if ($formtype == 'reset' && $this->isResetForm() && $this->resetArgsAvailable())
                    unset($this->fields['login']);


                $error = true;

                foreach ($this->fields as $key => $field) {
                    if (!isset($field['args']['readOnly']) || empty($field['args']['readOnly'])) {
                        // Check if isset & !empty
                        if ($field['required'] && $field['type'] != 'file') {
                            if (!isset($_POST[$field['name']]) || empty($_POST[$field['name']])) {
                                $error = false;
                                $errorMsg = $this->errorMessages['missing'];
                                $this->error = $errorMsg;
                                $this->errors[$key] = $this->errorMessages['empty'];
                            }
                        }


                        // Check if e-mail is a good e-mail format
                        switch ($field['type']) {
                            case 'email' :
                                if (!isset($_POST[$field['name']]) || !filter_var($_POST[$field['name']], FILTER_VALIDATE_EMAIL)) {
                                    $errorMsg = $this->errorMessages['email'];
                                    $error = false;
                                    $this->error = $errorMsg;
                                    $this->errors[$key] = $this->errorMessages['email'];
                                }
                                break;
                            case 'password' :
                                foreach ($this->fields as $thefield) {
                                    if ($thefield['name'] == 'repeat-' . $field['name'] && $thefield['type'] == 'repeatPassword') {
                                        if ($_POST[$thefield['name']] != $_POST[$field['name']]) {
                                            $error = false;
                                            $errorMsg = $this->errorMessages['samepassword'];
                                            $this->error = $errorMsg;
                                            $this->errors[$key] = $this->errorMessages['samepassword'];
                                        }
                                    }
                                }
                                break;
                            case 'file' :
                                // Check the file only if required or not empty
                                if (
                                    $field['required'] ||
                                    (is_array($_FILES[$field['name']]['name']) && !empty($_FILES[$field['name']]['name'][0])) ||
                                    (!is_array($_FILES[$field['name']]['name']) && !empty($_FILES[$field['name']]['name']))
                                ) {

                                    // Default extensions allowed if not in args
                                    $allowed = (isset($field['args']['allowed'][0]) && !empty($field['args']['allowed'][0])) ? $field['args']['allowed'] : ['gif', 'png', 'jpg', 'jpeg', 'pdf'];

                                    // multiple upload
                                    if (is_array($_FILES[$field['name']]['name'])) {

                                        // Foreach files, check extension
                                        for ($i = 0; $i < count($_FILES[$field['name']]['name']); $i++) {
                                            $ext = pathinfo($_FILES[$field['name']]['name'][$i], PATHINFO_EXTENSION);
                                            // if extension not in array, error
                                            if (!in_array(strtolower($ext), $allowed)) {
                                                $error = false;
                                                $errorMsg = $this->errorMessages['filetype'] . implode(',', $allowed);
                                                $this->error = $errorMsg;
                                                $this->errors[$key] = $this->errorMessages['filetype'] . implode(',', $allowed);
                                            }
                                        }

                                        // Single upload
                                    } else {
                                        $ext = pathinfo($_FILES[$field['name']]['name'], PATHINFO_EXTENSION);
                                        if (!in_array(strtolower($ext), $allowed)) {
                                            $error = false;
                                            $errorMsg = $this->errorMessages['filetype'] . implode(',', $allowed);
                                            $this->error = $errorMsg;
                                            $this->errors[$key] = $this->errorMessages['filetype'] . implode(',', $allowed);
                                        }
                                    }
                                }
                                break;
                        }
                    }
                }
                return $error;
            }
        } else {
            return false;
        }
    }

    /**
     *
     * @since V 0.1
     *
     * @return $this
     */
    public function closeAllContainers()
    {
        foreach ($this->containers as $content) {
            $this->closeContainer();
        }
        return $this;
    }


    /**
     * @return bool
     */
    public function hasError()
    {
        return isset($this->error);
    }

    /**
     *
     * @since V 0.1
     *
     * Return the error
     *
     * @return bool
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * @since V 0.1
     *
     * @Modify : V 0.4
     *
     * Displays the form error on screen
     */
    public function theError()
    {
        if ($this->hasError())
            echo $this->error;
    }

    /**
     *
     * @since V 0.1
     *
     * @Updated : V 0.5.4 (Add a if to check if the function wp_editor exists or not)
     *
     * Get the WordPress WYSIWYG editor and return it's code into a string
     *
     * @param $content
     * @param $editor_id
     * @param array $settings
     * @return string
     */
    private function get_wp_editor($content, $editor_id, $settings = [])
    {
        ob_start();
        if (function_exists('wp_editor'))
            wp_editor($content, $editor_id, $settings = []);
        $editor_contents = ob_get_clean();
        return $editor_contents;
    }


    /**
     *
     * @since V 0.3
     *
     * @Updated : V 0.5.4 (Update to handle second param and getting fields and label separetly. Remove the bool return)
     *
     * Return a form field
     *
     * @param $name
     * @param $field null | string
     * @return string
     */
    public function get_form_field($name, $field = null)
    {

        // If the label is displayed after the field or not
        $labelAfter = isset($this->fields[$name]['args']['labelAfter']) ? $this->fields[$name]['args']['labelAfter'] : false;

        // init the template variable
        $template = '';

        // If the template exist
        if (isset($this->template[$name])) {

            // If there is a field required
            if (isset($field) && null != $field) {

                // If you display the error
                if ($field == 'error') {
                    $template = $this->DisplayOneError($name, true);
                } else {
                    // If the existing field exist, I return it
                    if (isset($this->template[$name][$field])) {
                        $template = $this->template[$name][$field];
                        unset($this->template[$name][$field]);
                    }
                }
            } else {
                // I check if the label exists
                $label = isset($this->template[$name]['label']) ? $this->template[$name]['label'] : '';

                // Handle errors
                if (isset($this->args['displayErrorsBefore']) && $this->args['displayErrorsBefore']) {
                    $template .= $this->DisplayOneError($name);
                    $template .= $labelAfter ? $this->template[$name]['field'] . $label : $label . $this->template[$name]['field'] . "\n";
                } else {
                    $template .= $labelAfter ? $this->template[$name]['field'] . $label : $label . $this->template[$name]['field'] . "\n";
                    $template .= $this->DisplayOneError($name);
                }
                unset($this->template[$name]);
            }
        }

        return $template;
    }

    /**
     *
     * @since V 0.3
     *
     * Display a form field
     *
     * @Updated : V 0.5.4 (Update to handle second param and getting fields and label separetly. Remove the if to check if the field exist)
     *
     * @param $field null | string
     * @param $name
     */
    public function the_form_field($name, $field = null)
    {
        echo $this->get_form_field($name, $field);
    }

    /**
     *
     * @since V 0.3
     *
     * Return the open form field. it contains an antispam input, the wp_nounce input,some style and the form opening
     *
     * @return bool
     */
    public function get_open_the_form()
    {

        return $this->get_form_field('open_the_form');
    }

    /**
     *
     * @since V 0.3
     *
     * Display the open form
     */
    public function open_the_form()
    {
        echo $this->get_open_the_form();
    }

    /**
     *
     * @since V 0.3
     *
     * Return the end of the form
     *
     * @return string
     */
    public function get_close_the_form()
    {
        return $this->__toString();
    }

    /**
     * @since V 0.3
     *
     * Display the end of the form
     */
    public function close_the_form()
    {
        echo $this->get_close_the_form();
    }

}