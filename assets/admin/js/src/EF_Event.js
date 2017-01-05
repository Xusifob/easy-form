/**
 *
 * @returns {*}
 * @constructor
 */
function EF_Event() {

    var $this = this;
    var $ = jQuery;

    $this.init = init;


    /**
     * @constructor
     */
    function init() {


        _addEvents();
        return $this;
    }


    /**
     *
     * @since 1.0.0
     *
     * Add the events to the page
     *
     * @Event : Called at click on the button add, add a new field
     *
     * @private
     */
    function _addEvents(){

        var $body = $('body');

        // Use to display the duplication field modal
        $body
            .on('click','.move',_move);

        $body
            .on('click','.minify',_minify);

        // Delete a field
        $body
            .on('click','.delete',_delete);


        $body
            .on('click','.open',_open);

        $body
            .on('click','.up',_up);

        $body
            .on('click','.down',_down);

        $body
            .on('click','.removeoption',_removeOption);

        $body
            .on('click','.dupliquer',_duplicate);

        // Add a new field
        $body
            .on('click','button[data-action="add"]',_add);

        $body
            .on('click','button[data-action="add-option"]',_addOption);

        $body
            .on('change','select[name$="attributes[type]"]',_changeFieldType);

        $body
            .on('change','select[name$="[form-taxonomy]"]',_changeTaxonomy);

        $body
            .on('change','select[name="form-reset-action"]',_changeResetAction);

        $body
            .on('change','select[name="settings[type]"]',_changeUtility);

        $body
            .on('click','.panel header',_togglePanel);
    }


    /**
     *
     * @since 1.0.0
     *
     * Toggle a panel
     *
     * @private
     */
    function _togglePanel() {
        var panel = $(this).parent('.panel');

        panel.toggleClass('panel--open');
    }



    /**
     *
     * @since 1.0.0
     *
     * @private
     */
    function _changeUtility()
    {
        var val = $(this).val();

        EF_form_actions.getUtilities(val);
    }


    /**
     * @since 1.0.0
     *
     * Change the reset actions
     *
     * @private
     */
    function _changeResetAction()
    {
        var val = $(this).val();
        EF_Form_Actions().initReset(val);
    }



    /**
     *
     * @since 1.0.0
     *
     * Change the value of the field of the taxonomy
     *
     * @event : on called at select
     *
     * @private
     */
    function _changeTaxonomy()
    {
        var id = parseInt($(this).attr('data-field'));

        var val = $(this).val();

        $('input[name="field[' + id + '][form-name]"]').val('taxonomy_' + val);

    }





    /**
     *
     *
     * @Updated V 0.5.4 ( Add Spinner)
     *
     * @Event : clic on add option button (for a select) : add a new option row
     *
     *
     * @returns {boolean}
     * @private
     */
    function _addOption(event){
        $('#spinner-fields').show();

        var id = parseInt($(this).attr('data-field'));

        var nbOptions = $('#field-' + id + ' .option-select').length;

        var $_this = $(this);
        EF_form_actions.getOption({
            id: id,
            nbOptions: nbOptions,
            option: {
                content: "",
                select: true,
                value: ""
            }
        }).done(function (option) {
            $_this.before(option);
            $('#spinner-fields').hide();

        });

        return false;
    }


    /**
     *
     * Triggered on click to remove an option in a select field.
     *
     * @returns {boolean}
     * @private
     */
    function _removeOption()
    {
        var id = parseInt($(this).attr('data-field'));
        var option = parseInt($(this).attr('data-option'));

        var nbOptions = $('#field-' + id + ' .option-select').length;


        $('#option-select' + id + '-' + option).empty();


        return false;
    }


    /**
     *
     * @event : Called on "down" arrow, move the field 1 way down
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     * @private
     */
    function _down()
    {
        var id = parseInt($(this).attr('data-field'));
        if (id != nbfield)
            switchIds(id, id + 1);

        return false;
    }


    /**
     *
     * @since 1.0.0
     *
     * @event : clic on duplicate field, create a new field with the same properties
     *
     * @returns {boolean}
     * @private
     */
    function _duplicate(){
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
    }



    /**
     *
     * @event : Called on "up" arrow, move the field 1 way up
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     * @private
     */
    function _up(){
        var id = parseInt($(this).attr('data-field'));
        if (id != 1)
            switchIds(id, id - 1);

        return false;
    }


    /**
     *
     * @since 1.0.0
     *
     * Open a field
     *
     * @event : Clic on open button, show the field options
     *
     * @returns {boolean}
     * @private
     */
    function _open(){


        var id = parseInt($(this).attr('data-field'));
        $('.options-' + id).show(200);
        $(this)
            .removeClass('open')
            .addClass('minify')
            .html('-')
        ;
        return false;
    }




    /**
     *
     * @since 1.0.0
     *
     * @event : Called on change of a field type,
     *
     * @private
     */
    function _changeFieldType() {
        $('#spinner-fields').show();

        // Kind of field
        var type = $(this).val();
        var id = $(this).attr('data-field');
        var name = $('body input[name="field[' + id + '][form-name]"]').val();

        var input = EF_form_actions.getInput({
            type: type,
            id: id,
            name: name
        });

        // Replace the datas
        EF_form_actions.getFieldTemplate(type).done(function (data) {

            // If the template is not available
            if(!data.data){
                $('#spinner-fields').hide();
                return;
            }

            data = replace(data.data, 'fieldId', id);

            $('#options-' + id).replaceWith(data);

            EF_form_actions.addDataToField(input);

            $('#spinner-fields').hide();

            $('a[data-field="' + id + '"].minify').removeClass('minify').addClass('open');

            // Open the field
            $('a[data-field="' + id + '"].open').click();
        });
    }


    /**
     *
     * @since 1.0.0
     *
     * @event : Clic on minify button : hide the options of the field
     *
     * @returns {boolean}
     * @private
     */
    function _minify()
    {
        var id = $(this).attr('data-field');

        $('.options-' + id).hide(200);
        $(this)
            .removeClass('minify')
            .addClass('open')
            .html('+');
        return false;

    }



    /**
     *
     * @since 1.0.0
     *
     * Add a field
     *
     * @private
     */
    function _add() {

        // Show the spinner
        $('#spinner-fields').show();

        // Minify all the fields
        $('.minify').each(function () {
            $(this).click();
        });


        var input = EF_form_actions.getInput({
            type: 'text',
            id: (EF_form_actions.getCurrentFieldId() + 1),
            name: ''
        });


        // Display the data inside the field
        EF_form_actions.getField(input, true).done(function () {
            $('#spinner-fields').hide();
        });
    }






    /**
     *
     * Delete a field when you click on a delete button
     *
     * @Since V 0.3
     *
     * @Update  - V 0.5.4 (You can not remove the delete button in the last field)
     *          - 1.0.0
     *
     * @event : Clic on delete button, delete a field
     */
    function _delete() {
        var id = parseInt($(this).attr('data-field'));

        var nbfield = $('.ef-field').length;

        if (1 === id && 1 === nbfield)
            return false;

        $("#field-" + id).remove();
        for (var j = id + 1; j <= nbfield; j++)
            updateIds($('#field-' + j), j, j - 1);


        return false;
    }







    /**
     *
     * @since 1.0.0
     *
     * Move a field to another form
     *
     * @returns {boolean}
     * @private
     */
    function _move(){

        var fieldId = $(this).attr('data-field');
        $('#form-duplicate-field-id').val(fieldId);
        $('#modal-move').modal('show');

        return false;
    }





    return $this.init();
}