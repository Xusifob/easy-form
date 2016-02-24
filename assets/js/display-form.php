 <?php  if (!defined('ABSPATH')) exit; // Exit if accessed directly ?>

    // Set all fields depending on modify or add
    <?php
    if(isset($formFields[0])):
        echo 'var fields = ' . json_encode($formFields[0]) . ';';
    else : ?>
    var fd = getInput({
        id: 1,
        type: 'text',
        name: ''
    });
    var fields = [fd];
    <?php endif; ?>


    // Object containing all templates when they are load once. (improve loading time)
    var templates = {};

    // Object containing all utilities template when they are load once. (improve loading time)
    var utilities = {};


    var utilitiesEmpty = {
        post: {
            post_type: "post",
            post_status: "publish"
        },
        connexion: {
            remember: true
        },
        user: {
            role: "current",
            connectUser: true,
            emailUser: false
        },
        email: {
            subject: "",
            recipientEmail: "<?php echo get_option('admin_email'); ?>",
            recipientName: "<?php echo get_option('blogname'); ?>"
        },
        resetPassword: {
            subject: "Réinitialisation du mot de passe",
            senderEmail: "<?php echo get_option('admin_email'); ?>",
            senderName: "<?php echo get_option('blogname'); ?>",
            message: "",
            resetAction: "reset-password-email",
            pageId: "",
            submitValue: 'Réinitialiser'
        }
    };


    var formType = "<?php echo isset($formMetas['form-type'][0]) ? $formMetas['form-type'][0] : 'post'; ?>";
    var formSendArgs = <?php echo isset($formSendArgs[0]) ? json_encode($formSendArgs[0]) : '""'; ?>;

    getUtilities(formType, formSendArgs);

    // Set the nb of fields at 0 for the start
    var fieldIncrement = 0;

    /**
     *
     * @Since V 0.5.0
     *
     * Display all the fields on the page as long as there are some fields
     */
    function retrieveData() {
        if (fieldIncrement < fields.length) {
            displayData(fields[fieldIncrement]);
        } else
            $('#spinner-fields').hide();
    }

    /**
     * Get the data and display it on the page
     *
     * @Since V 0.5.0
     *
     * @Updated V 0.5.4 (Return a promise)
     *
     *
     * @param field string the kind of field you want to display (input, select...)
     * @param expand If you want to expand the current field or let it closed
     * @returns {*}
     */
    function displayData(field, expand) {

        var dfd = new $.Deferred();
        getData(field).done(function (data) {
            // J'affiche les champs
            $("#fld").append(data);
            // Je rend le champ draggable
            $('#field-' + field.id).draggable(DraggableArgs);
            // Je m'occupe de certains champs à cacher
            handleHiddenFields(field.id, field.type);

            if (expand === true)
                $('a[data-field="' + field.id + '"].open').click();

            // J'incrémente le nombre de champs
            fieldIncrement++;

            // J'affiche les données
            retrieveData();
            dfd.resolve(data);

        });

        // Return a promise
        return dfd.promise();

    }


    /**
     *
     * Return the input template of the template asked if it has already been loaded, else it load it and and put it into a variable.
     *
     * @Since V 0.5.4
     *
     * @params template string the template you want to load
     * @return {*} promise
     *
     */
    function getTemplate(template) {
        // Create a promise
        var dfd = new $.Deferred();

        // If it's an imput
        if ($.inArray(template, inputs) !== -1) {
            template = 'input';
        }

        if (templates[template] && templates[template] != undefined && templates[template] != '') {
            console.log('input already loaded');
            dfd.resolve(templates[template]);
        } else {
            // Get the template
            $.get(ajaxUrl, {input: template, action: 'input_template'}, function () {
            }).always(function (data) {

                console.log('load template ' + template);

                templates[template] = data;

                // I send back the data
                dfd.resolve(data);
            });
        }


        // Return a promise
        return dfd.promise();
    }


    /**
     *
     * Get a field's template.
     *
     * @Since V 0.5.0
     *
     * @Updated :   - V 0.5.3 (Add htmlentities)
     *              - V 0.5.4 (Update ajax urls to use WordPress' ones & change to getbase)
     *
     * @param field string the kind of field you want to get (input, select...)
     * @returns {*}
     */
    function getData(field) {

        // Create a promise
        var dfd = new $.Deferred();

        // Je récupère la base
        getTemplate('input-empty').done(function (base) {

            getTemplate(field.type).done(function (data) {

                // Je met la base
                data = replace(base, 'input-content', data);

                // Je remplie les champs
                data = replace(data, 'fieldId', field.id);
                data = replace(data, 'field-id', htmlEntities(field.args.id));
                data = replace(data, 'field-name', htmlEntities(field.name));

                if (field.args.class != undefined)
                    data = replace(data, 'field-class', htmlEntities(field.args.class));

                if (field.args.placeholder != undefined)
                    data = replace(data, 'field-placeholder', htmlEntities(field.args.placeholder));

                if (field.args.value != undefined)
                    data = replace(data, 'field-value', htmlEntities(field.args.value));

                if (field.args.label != undefined)
                    data = replace(data, 'field-label', htmlEntities(field.args.label));

                if (field.args.labelClass != undefined)
                    data = replace(data, 'field-clas-label', htmlEntities(field.args.labelClass));

                // Required
                if (field.args.required != undefined)
                    data = replace(data, 'field-required-selected', (field.args.required ? 'checked' : ''));

                if (field.args.labelAfter != undefined)
                    data = replace(data, 'field-label-after-selected', (field.args.labelAfter ? 'checked' : ''));

                if (field.args.statsSelected != undefined)
                    data = replace(data, 'field-sort-stats-selected', (field.args.statsSelected ? 'checked' : ''));


                // Select
                data = replace(data, 'option value="' + field.type + '"', 'option selected value="' + field.type + '"');

                if (field.type == 'file') {
                    if (field.args.maxSize != undefined)
                        data = replace(data, 'field-max-size', htmlEntities(field.args.maxSize));

                    if (field.args.allowed != undefined)
                        data = replace(data, 'field-allowed', field.args.allowed.toString());

                    if (field.args.acfField != undefined)
                        data = replace(data, 'field-acf-field', htmlEntities(field.args.acfField));
                }

                // Handle Select Fields
                if (field.type == 'select') {
                    $.get(ajaxUrl, {input: 'options', action: 'input_template'}, function (optionTemplate) {
                        // Create the opts
                        var opts = '';
                        for (opt = 0; opt < field.args.options.length; opt++) {

                            // Define the option
                            var option = field.args.options[opt];
                            tmpOption = optionTemplate;
                            // Replace the sub field Id
                            tmpOption = replace(tmpOption, 'fieldSubId', opt);
                            tmpOption = replace(tmpOption, 'fieldId', field.id);
                            tmpOption = replace(tmpOption, 'OptionName', option.content);
                            tmpOption = replace(tmpOption, 'OptionValue', option.value);
                            tmpOption = replace(tmpOption, 'OptionSelected', option.select === true ? 'selected' : '');
                            opts += tmpOption;
                        }
                        // Add the options in the template
                        data = replace(data, 'optionsFields', opts);
                        dfd.resolve(data);
                    });
                } else {
                    dfd.resolve(data);
                }
            });
        });
        // Return a promise
        return dfd.promise();
    }

    // J'affiche tous les champs sur la page
    retrieveData();


    /**
     *
     * Get the option template
     *
     * @Since V O.5.0
     *
     * @Updated V 0.5.4 (Update ajax urls to use WordPress ones)
     *
     * @param field string the sub field data to display on the option
     * @returns {*}
     */
    function getOption(field) {

        // Create a promise
        var dfd = new $.Deferred();

        getTemplate('options').done(function (optionTemplate) {

            // Replace the sub field Id
            optionTemplate = replace(optionTemplate, 'fieldSubId', field.nbOptions);
            optionTemplate = replace(optionTemplate, 'fieldId', field.id);
            optionTemplate = replace(optionTemplate, 'OptionName', field.option.content);
            optionTemplate = replace(optionTemplate, 'OptionValue', field.option.value);
            optionTemplate = replace(optionTemplate, 'OptionSelected', field.option.select === true ? 'selected' : '');
            // Add the options in the template

            dfd.resolve(optionTemplate);
        });
        return dfd.promise();
    }
