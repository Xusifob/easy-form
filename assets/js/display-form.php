<script type="text/javascript">
    // All inputs available
    var inputs = [
        'text', 'email', 'password','repeatPassword', 'number', 'tel', 'date', 'checkbox', 'radio', 'url', 'range', 'color', 'search', 'hidden','textarea'
    ];

    // Set all fields depending on modify or add
    <?php
    if(isset($formFields[0])):
        echo 'var fields = ' .  json_encode($formFields[0]) . ';';
    else : ?>
    var fields = [{
        id: 1,
        name : '',
        type : 'text',
        args : {
            autocomplete : true,
            'class' : '',
            id : '',
            label : '',
            labelAfter : false,
            labelClass : '',
            placeholder : '',
            readOnly : false,
            required : true,
            value : ''
        }
    }];
    <?php endif; ?>

    // Set the nb of fields at 0 for the start
    var fieldIncrement = 0;

    // Affiche toutes les données des champs
    function retrieveData(){
        if(fieldIncrement <fields.length){
            getData(fields[fieldIncrement]);
        }
    }

    // Récupère le champ lié
    function getData(field){

// Je récupère la base
        $.get('<?php echo plugins_url()?>/easy-form/templates/inputs/input-empty.php',function(base){

            if($.inArray(field.type,inputs) !== -1) {
                var template = '<?php echo plugins_url()?>/easy-form/templates/inputs/input.php';
            }else {
                var template = '<?php echo plugins_url()?>/easy-form/templates/inputs/' + field.type + '.php';
            }
            $.get(template, function () {
            }).always(function(data){

                // Je met la base
                data = replace(base,'input-content',data);

                // Je remplie les champs
                data = replace(data, 'fieldId', field.id);
                data = replace(data, 'field-id', field.args.id);
                data = replace(data, 'field-name', field.name);
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

                if(field.type == 'open_container')
                    console.log(field);

                // Handle Select Fields
                if(field.type == 'select'){
                    $.get('<?php echo plugins_url()?>/easy-form/templates/inputs/options.php',function(optionTemplate) {
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

                        $("#fld").append(data);
                    });
                }else{
                    // J'affiche les champs
                    $("#fld").append(data);
                }

// Checkboxs
                // Je rend le champ draggable
                $('#field-' + fieldIncrement).draggable(DraggableArgs);

// J'incrémente le nombre de champs
                fieldIncrement++;
// J'affiche les données
                retrieveData();
            });
        });
    }
    // J'affiche tous les champs sur la page
    retrieveData();
</script>