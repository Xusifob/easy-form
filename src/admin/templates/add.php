<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly

/** @var $wp_form WP_Form */
global $wp_form;

?>


<div class="wrap">

    <?php if($wp_form->getId()){ ?>
        <h2><?php _e('Update a form',EF_get_domain()); ?></h2>
    <?php } else{ ?>
        <h2><?php _e('Add a form',EF_get_domain()); ?></h2>
    <?php } ?>

    <form action="<?php echo $_SERVER['REQUEST_URI']; ?>" novalidate method="post">
        <div id="titlediv">
            <div id="titlewrap">
                <input type="text" placeholder="<?php _e('Title of your form',EF_get_domain()); ?>" name="title" size="30" value="" id="title" required spellcheck="true" autocomplete="off">
            </div>
            <div class="inside">
            </div>
            <input type="hidden" name="form-id" value="<?php echo $wp_form->getId(); ?>">
        </div>

        <section class="panel panel--open">
            <header>
                <h3><?php _e('Main Information', EF_get_domain()); ?> </h3>
                <div class="handlediv" title="<?php _e('Click to inverse', EF_get_domain()); ?>"><br></div>
            </header>
            <div class="ef-content">
                <table class="ef-table">
                    <tr class="ef-table--separator">
                        <td class="ef-rules">
                            <h4><?php _e('HTML Elements',EF_get_domain()); ?></h4>
                            <p><?php _e('This part will regroup all the information linked to the &lt;form&gt; html element',EF_get_domain()); ?></p>
                        </td>
                        <td class="ef-table-content">
                            <div class="ef-input">
                                <label for="attributes[class]"><?php _e('Class of the form', EF_get_domain()); ?></label>
                                <input type="text" id="attributes[class]"
                                       name="attributes[class]" class="form-control"
                                       placeholder="<?php _e('Class of the form', EF_get_domain()); ?>"/>
                            </div>


                            <div class="ef-input">
                                <label for="attributes[id]"><?php _e('Id of the form', EF_get_domain()); ?></label>
                                <input type="text" class="form-control" id="attributes[id]"
                                       name="attributes[id]" placeholder="<?php _e('Id of the form', EF_get_domain()); ?>"/>
                            </div>

                            <div class="ef-input">
                                <label for="attributes[action]"><?php _ex('Action','Action of the form',EF_get_domain()); ?></label>
                                <input type="text"
                                       class="form-control"
                                       id="attributes[action]"
                                       name="attributes[action]"
                                       placeholder="<?php _e('Action of the form', EF_get_domain()); ?>"/>
                            </div>
                        </td>
                    </tr>

                    <tr class="ef-table--separator">
                        <td class="ef-rules">
                            <h4><?php _e('Field options',EF_get_domain()); ?></h4>
                            <p><?php _e('This part will regroup all the information repeated on all fields',EF_get_domain()); ?></p>
                        </td>
                        <td class="ef-table-content">
                            <div class="ef-input">
                                <label for="settings[default-class]"><?php _e('Default Class', EF_get_domain()); ?></label>
                                <input type="text"
                                       id="settings[default-class]"
                                       name="settings[default-class]"
                                       class="form-control"
                                       placeholder="<?php _e('Field\'s default class', EF_get_domain()); ?>"/>
                            </div>
                        </td>
                    </tr>

                    <tr class="ef-table--separator">
                        <td class="ef-rules">
                            <h4><?php _e('Errors',EF_get_domain()); ?></h4>
                            <p><?php _e('This part will regroup  how the errors will be handled in the form',EF_get_domain()); ?></p>
                        </td>
                        <td class="ef-table-content">
                            <div class="ef-input">
                                <label for="settings[display-errors]" class="label-checkbox">
                                    <input type="checkbox" id="settings[display-errors]" name="settings[display-errors]"/>
                                    <?php _e('Display the errors of every field', EF_get_domain()); ?>
                                </label>
                            </div>
                            <div class="ef-input">
                                <label for="settings[errors-before]" class="label-checkbox">
                                    <input type="checkbox" id="settings[errors-before]" name="settings[errors-before]"/>
                                    <?php _e('Display errors over the field',EF_get_domain()); ?>
                                </label>

                            </div>
                        </td>
                    </tr>

                </table>
            </div>
        </section>


        <section class="panel panel--open">
            <header>
                <h3><?php _e('Type of form', EF_get_domain()); ?> </h3>
                <div class="handlediv" title="<?php _e('Click to inverse', EF_get_domain()); ?>"><br></div>
            </header>
            <div class="ef-content">
                <div class="spinner-container" id="spinner-utility">
                    <div class="spinner"></div>
                </div>
                <table class="ef-table">
                    <tr class="ef-table--separator">
                        <td class="ef-rules">
                            <h4><?php _e('Type of form',EF_get_domain()); ?></h4>
                        </td>
                        <td class="ef-table-content">
                            <div class="ef-input">
                                <label for="settings[type]"><?php _e('Type of form', EF_get_domain()); ?></label>
                                <select name="settings[type]" class="form-control" id="settings[type]">
                                    <option
                                        value="post"><?php _e('Add a post', EF_get_domain()); ?></option>
                                    <option
                                        value="login"><?php _e('Login', EF_get_domain()); ?></option>
                                    <option
                                        value="user"><?php _e('Register or user update', EF_get_domain()); ?></option>
                                    <option
                                        value="email"><?php _e('Email', EF_get_domain()); ?></option>
                                    <option
                                        value="resetPassword"><?php _e('Password Reset', EF_get_domain()); ?></option>
                                </select>
                            </div>
                        </td>
                    </tr>
                    <tr class="ef-table--separator">
                        <td class="ef-rules">
                            <h4><?php _e('Specs',EF_get_domain()); ?></h4>
                            <p><?php _e('This part comport all specs linked to the type of form selected',EF_get_domain()); ?></p>
                        </td>
                        <td class="ef-table-content">
                            <div class="utilities"></div>
                        </td>
                    </tr>
                    <tr class="ef-table--separator">
                        <td class="ef-rules">
                            <h4><?php _e('Redirection',EF_get_domain()); ?></h4>
                            <p><?php _e('This part comport all information from the redirection when the form is send',EF_get_domain()); ?></p>
                        </td>
                        <td class="ef-table-content">
                            <div class="ef-input">
                                <label
                                    for="settings[redirect]"><?php _e('Url or Page ID to be redirected after success (newpost for the new post page)', EF_get_domain()); ?></label>
                                <input name="settings[redirect]" type="text" id="settings[redirect]"
                                       placeholder="<?php _e('Url or Page ID to be redirected after success (newpost for the new post page)', EF_get_domain()); ?>" <?php echo isset($formMetas['form-redirect'][0]) ? 'value="' . $formMetas['form-redirect'][0] . '"' : ''; ?>
                                       class="form-control"/>
                            </div>

                            <div class="ef-input">
                                <label
                                    for="settings[parameters]"><?php _e('Url parameters', EF_get_domain()); ?></label>
                                <input name="settings[parameters]" type="text" id="settings[parameters]"
                                       placeholder="<?php _e('key=parameter&key=parameter', EF_get_domain()); ?>" class="form-control"/>
                            </div>
                        </td>
                    </tr>

                </table>
            </div>
        </section>


        <section class="panel panel--open">
            <header>
                <h3><?php _e('All Fields', EF_get_domain()); ?> </h3>
                <div class="handlediv" title="<?php _e('Click to inverse', EF_get_domain()); ?>"><br></div>
            </header>


            <div class="ef-content">
                <div class="spinner-container" id="spinner-fields">
                    <div class="spinner"></div>
                </div>
                <div id="fld">
                </div>
                <button class="button button-primary button-large right button-add" data-action="add" type="button">
                    <?php _e('Add a field', EF_get_domain()); ?>
                </button>
            </div>
        </section>


        <section class="panel panel--open">
            <header>
                <h3><?php _e('Submit Values', EF_get_domain()); ?> </h3>
                <div class="handlediv" title="<?php _e('Click to inverse', EF_get_domain()); ?>"><br></div>
            </header>
            <div class="ef-content">
                <table class="ef-table">
                    <tr class="ef-table--separator">
                        <td class="ef-rules">
                            <h4><?php _e('Submit Information',EF_get_domain()); ?></h4>
                            <p><?php _e('This part regroup all informations of the submit button',EF_get_domain()); ?></p>
                        </td>
                        <td class="ef-table-content">
                            <div class="ef-input">
                                <label for="form-button-send"><?php _e('Send Value', EF_get_domain()); ?></label>
                                <input type="text"
                                       class="form-control" id="field[submit][attributes][value]" name="field[submit][attributes][value]"
                                       placeholder="<?php _e('Send Value', EF_get_domain()); ?>"/>
                            </div>
                            <div class="ef-input">
                                <label for="field[submit][attributes][class]"><?php _e('Input Class', EF_get_domain()); ?></label>
                                <input type="text" class="form-control" id="field[submit][attributes][class]"
                                       name="field[submit][attributes][class]"
                                       placeholder="<?php _e('Class', EF_get_domain()); ?>"/>
                            </div>

                            <div class="ef-input">
                                <label for="field[submit][attributes][id]"><?php _e('Input Id', EF_get_domain()); ?></label>
                                <input type="text" class="form-control" id="field[submit][attributes][id]"
                                       name="field[submit][attributes][id]"
                                       placeholder="<?php _e('Id', EF_get_domain()); ?>"/>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </section>

        <section class="panel-wordpress">
            <div class="row">
                <button class="button button-primary button-large right" name="EF_save"
                        value="send"><?php echo isset($form) ? __('Update the form', EF_get_domain()) : __('Add the form', EF_get_domain()); ?></button>
            </div>
        </section>
    </form>
</div>

<!-- Include the modal -->
<?php EF_include('templates/modals/duplicate.php'); ?>

<script type="text/javascript">

    var ajaxUrl = '<?php echo admin_url('admin-ajax.php'); ?>';

    var inputs_empty = {
        checkbox : <?php echo json_encode(new EF_Checkbox_Input()); ?>,
        editor : <?php echo json_encode(new EF_Editor_Input()); ?>,
        email : <?php echo json_encode(new EF_Email_Input()); ?>,
        file : <?php echo json_encode(new EF_File_Input()); ?>,
        hidden : <?php echo json_encode(new EF_Hidden_Input()); ?>,
        text : <?php echo json_encode(new EF_Input()); ?>,
        number : <?php echo json_encode(new EF_Number_Input()); ?>,
        password : <?php echo json_encode(new EF_Password_Input()); ?>,
        tel : <?php echo json_encode(new EF_Phone_Input()); ?>,
        radio : <?php echo json_encode(new EF_Radio_Input()); ?>,
        select : <?php echo json_encode(new EF_Select()); ?>,
        textarea : <?php echo json_encode(new EF_TextArea()); ?>,
        url : <?php echo json_encode(new EF_URL_Input()); ?>,
        submit : <?php echo json_encode(new EF_Submit_Input()); ?>,
    };



    jQuery(document).ready(function(){


        var form = <?php echo json_encode($wp_form,WP_DEBUG ? JSON_PRETTY_PRINT : false); ?>


        var remove = [
            '_time','_nonce','_uniqid','_antispam'
        ];

        for(var i =0;i<remove.length;i++){
          //  delete form.inputs[remove[i]];
        }

        /**
         *
         * @type {EF_Add}
         */
        var EF_add = new EF_Add(form);

        // Used to call jQuery with $
        var $ = jQuery;


        // Load the input empty
        $.get(ajaxUrl, {input: 'input-empty', action: 'input_template'}, function (data) {});

        var templatePath = '<?php echo plugins_url('/', __FILE__); ?>';

    })
</script>


<script type="text/javascript">
    var nbfield = <?php echo isset($i) ? ($i - 1) : 1; ?> ;
</script>