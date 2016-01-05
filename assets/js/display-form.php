<script type="text/javascript">
    // Set all fields depending on modify or add
    <?php
    if(isset($formFields[0])):
        echo 'var fields = ' .  json_encode($formFields[0]) . ';';
    else : ?>
    var fd = getInput({
        id : 1,
        type : 'text',
        name : ''
    });
    var fields = [fd];
    <?php endif; ?>


    var utilitiesEmpty = {
        post : {
            post_type: "post",
            post_status: "publish"
        },
        connexion : {
            remember: true
        },
        user :  {
            role: "current",
            connectUser: true,
            emailUser : false
        },
        email : {
            subject: "",
            recipientEmail: "<?php echo get_option('admin_email'); ?>",
            recipientName: "<?php echo get_option('blogname'); ?>"
        },
        resetPassword :
        {
            subject: "Réinitialisation du mot de passe",
            senderEmail: "<?php echo get_option('admin_email'); ?>",
            senderName: "<?php echo get_option('blogname'); ?>",
            message: "",
            resetAction: "reset-password-email",
            pageId : "",
            submitValue : 'Réinitialiser'
        }
    };


    var formType = "<?php echo isset($formMetas['form-type'][0]) ? $formMetas['form-type'][0] : 'post'; ?>";
    var formSendArgs = <?php echo isset($formSendArgs[0]) ?  json_encode($formSendArgs[0]) : '""'; ?>;

    getUtilities(formType,formSendArgs);

    // Set the nb of fields at 0 for the start
    var fieldIncrement = 0;

    // Affiche toutes les données des champs
    function retrieveData(){
        if(fieldIncrement <fields.length){
            displayData(fields[fieldIncrement]);
        }
    }

    // Get the data and display it on the page
    function displayData(field,expand){

        getData(field).done(function(data){
            // J'affiche les champs
            $("#fld").append(data);
            // Je rend le champ draggable
            $('#field-' + field.id).draggable(DraggableArgs);
            // Je m'occupe de certains champs à cacher
            handleHiddenFields(field.id,field.type);

            if(expand === true)
                $('a[data-field="'+ field.id +'"].open').click();

            // J'incrémente le nombre de champs
            fieldIncrement++;

            // J'affiche les données
            retrieveData();
        });
    }




    // Récupère le champ lié
    function getData(field){

        // Create a promise
        var dfd = new $.Deferred();

        // Je récupère la base
        $.get('<?php echo plugins_url()?>/easy-form/templates/inputs/input-empty.php',function(base){


            if($.inArray(field.type,inputs) !== -1) {
                var template = templatePath + '/inputs/input.php';
            }else {
                var template = templatePath + '/inputs/' + field.type + '.php';
            }
            $.get(template, function () {
            }).always(function(data){

                // Je met la base
                data = replace(base,'input-content',data);

                // Je remplie les champs
                data = replace(data, 'fieldId', field.id);
                data = replace(data, 'field-id', field.args.id);
                data = replace(data, 'field-name', field.name);

                console.log(field.id);

                if(field.args.class != undefined)
                    data = replace(data, 'field-class', field.args.class);

                if(field.args.placeholder != undefined)
                    data = replace(data, 'field-placeholder', field.args.placeholder);

                if(field.args.value != undefined)
                    data = replace(data, 'field-value', field.args.value);

                if(field.args.label != undefined)
                    data = replace(data, 'field-label', field.args.label);

                if(field.args.labelClass != undefined)
                    data = replace(data, 'field-clas-label', field.args.labelClass);

                // Required
                if(field.args.required != undefined)
                    data = replace(data,'field-required-selected',field.args.required ? 'checked' : '');

                if(field.args.labelAfter != undefined)
                    data = replace(data,'field-label-after-selected',field.args.labelAfter ? 'checked' : '');



                // Select
                data = replace(data, 'option value="'+ field.type +'"', 'option selected value="'+ field.type +'"');

                if(field.type == 'file'){
                    if(field.args.maxSize != undefined)
                        data = replace(data,'field-max-size',field.args.maxSize);

                    if(field.args.allowed != undefined)
                        data = replace(data,'field-allowed',field.args.allowed.toString());

                    if(field.args.acfField != undefined)
                        data = replace(data,'field-acf-field',field.args.acfField);
                }

                // Handle Select Fields
                if(field.type == 'select'){
                    $.get(templatePath + '/inputs/options.php',function(optionTemplate) {
                        // Create the opts
                        var opts = '';
                        for(opt = 0; opt< field.args.options.length;opt++){

                            // Define the option
                            var option = field.args.options[opt];
                            tmpOption = optionTemplate;
                            // Replace the sub field Id
                            tmpOption = replace(tmpOption, 'fieldSubId',opt);
                            tmpOption = replace(tmpOption, 'fieldId', field.id);
                            tmpOption = replace(tmpOption, 'OptionName', option.content);
                            tmpOption = replace(tmpOption, 'OptionValue', option.value);
                            tmpOption = replace(tmpOption, 'OptionSelected', option.select === true ? 'selected' : '');
                            opts += tmpOption;
                        }
                        // Add the options in the template
                        data = replace(data,'optionsFields',opts);
                        dfd.resolve(data);
                    });
                }else{
                    dfd.resolve(data);
                }
            });
        });
        // Return a promise
        return dfd.promise();
    }

    // J'affiche tous les champs sur la page
    retrieveData();

    function getOption(field){

        // Create a promise
        var dfd = new $.Deferred();

        $.get(templatePath + '/inputs/options.php',function(optionTemplate) {

            // Replace the sub field Id
            optionTemplate = replace(optionTemplate, 'fieldSubId',field.nbOptions);
            optionTemplate = replace(optionTemplate, 'fieldId', field.id);
            optionTemplate = replace(optionTemplate, 'OptionName', field.option.content);
            optionTemplate = replace(optionTemplate, 'OptionValue', field.option.value);
            optionTemplate = replace(optionTemplate, 'OptionSelected', field.option.select === true ? 'selected' : '');
            // Add the options in the template

            dfd.resolve(optionTemplate);
        });
        return dfd.promise();
    }

</script>