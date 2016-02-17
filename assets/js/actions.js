// Use to display the duplication field modal
$('body').on('click', '.move', function () {

    var fieldId = $(this).attr('data-field');
    $('#form-duplicate-field-id').val(fieldId);
    $('#modal-move').modal('show');

    return false;
});


/**
 * @Event : Called at click on the button add, add a new field
 */
$('button[data-action="add"]').on('click', function () {

    $('#spinner-fields').show();

    $('.minify').each(function () {
        $(this).click();
    });

    var input = getInput({
        type: 'text',
        id: (fieldIncrement + 1),
        name: ''
    });

    displayData(input, true).done(function () {
        $('#spinner-fields').hide();
    });

    nbfield++;
});


/**
 * @event : Called on change of the form type,
 */
$('body').on('change', 'select[name$="form-type]"]', function () {

        $('#spinner-fields').show();

        // Kind of field
        var type = $(this).val();
        var id = $(this).attr('data-field');
        var name = $('body input[name="field[' + id + '][form-name]"]').val();

        var input = getInput({
            type: type,
            id: id,
            name: name
        });
        // Replace the datas
        getData(input).done(function (data) {
            $('#field-' + id).replaceWith(data);

            handleHiddenFields(id, type);

            $('#spinner-fields').hide();

            // Open the field
            $('a[data-field="' + id + '"].open').click();
        });

    })
    /**
     *
     * Delete a field when you click on a delete button
     *
     * @Since V 0.3
     *
     * @Update V 0.5.4 (You can not remove the delete button in the last field)
     *
     * @event : Clic on delete button, delete a field
     */
    .on('click', '.delete', function () {
        var id = parseInt($(this).attr('data-field'));

        if (1 === id && 1 === nbfield)
            return false;

        $("#field-" + id).remove();
        for (var j = id + 1; j <= nbfield; j++)
            updateIds($('#field-' + j), j, j - 1);
        nbfield--;

        return false;


        /**
         * @event : Clic on minify button : hide the options of the field
         */
    }).on('click', '.minify', function () {

    var id = $(this).attr('data-field');

    $('.options-' + id).hide(200);
    $(this)
        .removeClass('minify')
        .addClass('open')
        .html('+');
    return false;


    /**
     * @event : Clic on open button, show the field options
     */
}).on('click', '.open', function () {
        var id = parseInt($(this).attr('data-field'));
        $('.options-' + id).show(200);
        $(this)
            .removeClass('open')
            .addClass('minify')
            .html('-')
        ;
        return false;

    })
    /**
     * @Event : called on "up" arrow, move the field 1 way up
     */
    .on('click', '.up', function () {
        var id = parseInt($(this).attr('data-field'));
        if (id != 1)
            switchIds(id, id - 1);

        return false;
    })
    /**
     * @event : Called on "down" arrow, move the field 1 way down
     */
    .on('click', '.down', function () {
        var id = parseInt($(this).attr('data-field'));
        if (id != nbfield)
            switchIds(id, id + 1);

        return false;
    })
    /**
     * @event : clic on duplicate field, create a new field with the same properties
     */
    .on('click', '.dupliquer', function () {
        var id = parseInt($(this).attr('data-field'));

        var thefield = $('#field-' + id);

        var clonedField = thefield.clone();
        $('div[id="field-' + nbfield + '"]').after(clonedField);

        updateIds(clonedField, id, (nbfield + 1));

        var val = $('select[name="field[' + id + '][form-type]"]').val();

        $('select[name="field[' + (nbfield + 1) + '][form-type]"]').val(val);
        clonedField.draggable(DraggableArgs);
        nbfield++;
        return false;
    })
    /**
     *
     * @Updated V 0.5.4 ( Add Spinner)
     *
     * @Event : clic on add option button (for a select) : add a new option row
     */
    .on('click', 'button[data-action="add-option"]', function () {

        $('#spinner-fields').show();

        var id = parseInt($(this).attr('data-field'));

        var nbOptions = $('#field-' + id + ' .option-select').length;
        var $this = $(this);
        getOption({
            id: id,
            nbOptions: nbOptions,
            option: {
                content: "",
                select: true,
                value: ""
            }
        }).done(function (option) {
            $this.before(option);
            $('#spinner-fields').hide();

        });
    })

    /**
     *
     * Triggered on click to remove an option in a select field.
     */
    .on('click', '.removeoption', function () {
        var id = parseInt($(this).attr('data-field'));
        var option = parseInt($(this).attr('data-option'));

        var nbOptions = $('#field-' + id + ' .option-select').length;


        $('#option-select' + id + '-' + option).empty();


        return false;
    })
    .on('keyup', 'input[name$="form-container-class]"]', function () {
        var id = parseInt($(this).attr('data-field'));
        var input = $('input[name="field[' + id + '][form-name]"');
        input.val($(this).val());
    })
    /**
     * @event : on called at select
     */
    .on('change', 'select[name$="[form-taxonomy]"]', function () {
        var id = parseInt($(this).attr('data-field'));

        var val = $(this).val();

        $('input[name="field[' + id + '][form-name]"]').val('taxonomy_' + val);
    })
    /**
     * @event : on called at select
     */
    .on('change', 'select[name="form-reset-action"]', function () {
        var val = $(this).val();
        displayReinitialiseUtility(val);
    });

// Change utility on top
$('select[name="form-utility"]').change(function () {
    var val = $(this).val();

    getUtilities(val, utilitiesEmpty[val]);
});

function displayReinitialiseUtility(val) {
    $('#link-password-email').hide();
    $('#reset-password-email').hide();
    $('#' + val).show();
}

/**
 * Display utilities on the map
 *
 * @param val
 * @param formSendArgs
 */
function getUtilities(val, formSendArgs) {


    if(formSendArgs == undefined)
        formSendArgs = utilitiesEmpty[val];

    $('#spinner-utility').show();

    getUtilyTemplate(val).done(function (data) {
        switch (val) {
            case 'post':
                data = replace(data, 'value="' + formSendArgs.post_type + '"', 'value="' + formSendArgs.post_type + '" selected');
                data = replace(data, 'value="' + formSendArgs.post_status + '"', 'value="' + formSendArgs.post_status + '" selected');
                break;
            case 'connexion':
                data = replace(data, 'ConnectUserChecked', formSendArgs.remember ? 'checked' : '');
                break;
            case 'user':
                data = replace(data, 'value="' + formSendArgs.role + '"', 'value="' + formSendArgs.role + '" selected');
                data = replace(data, 'ConnectUserChecked', formSendArgs.connectUser ? 'checked' : '');
                data = replace(data, 'EmailUserChecked', formSendArgs.emailUser ? 'checked' : '');
                break;
            case 'email' :
                data = replace(data, 'SubjectValue', 'value="' + formSendArgs.subject + '"');
                data = replace(data, 'recipiendNameValue', 'value="' + formSendArgs.recipientName + '"');
                data = replace(data, 'recipiendEmailValue', 'value="' + formSendArgs.recipientEmail + '"');
                break;
            case 'resetPassword':
                formSendArgs.submitValue = formSendArgs.submitValue == undefined ? 'Réinitialiser' : '';
                data = replace(data, 'SubjectValue', 'value="' + formSendArgs.subject + '"');
                data = replace(data, 'senderEmailValue', 'value="' + formSendArgs.senderEmail + '"');
                data = replace(data, 'SenderNameValue', 'value="' + formSendArgs.senderName + '"');
                data = replace(data, 'MessageValue', 'value="' + formSendArgs.message + '"');
                data = replace(data, 'PageValue', 'value="' + formSendArgs.pageId + '"');
                data = replace(data, 'submitValue', 'value="' + formSendArgs.submitValue + '"');
                data = replace(data, 'value="' + formSendArgs.resetAction + '"', 'value="' + formSendArgs.resetAction + '" selected');

                break;
        }
        $('.utilities').html(data);

        if (formSendArgs.resetAction != undefined)
            displayReinitialiseUtility(formSendArgs.resetAction);

        $('#spinner-utility').hide();
    });

}

/**
 *
 * Return the input template of the template asked if it has already been loaded, else it load it and and put it into a variable.
 *
 * @Since V 0.5.4
 *
 * @param val  string the template you want to load
 * @returns {*}
 */
function getUtilyTemplate(val) {


    // Create a promise
    var dfd = new $.Deferred();


    if (utilities[val] && utilities[val] != undefined && utilities[val] != '') {
        console.log('input already loaded');
        dfd.resolve(utilities[val]);
    } else {
        // Get the template
        $.get(ajaxUrl, {form_action: val, action: 'form_action'}, function (data) {
        }).always(function (data) {

            console.log('load Utility ' + val);

            utilities[val] = data;

            // I send back the data
            dfd.resolve(data);
        });
    }


    // Return a promise
    return dfd.promise();
}

