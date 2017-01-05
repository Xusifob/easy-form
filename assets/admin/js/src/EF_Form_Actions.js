/**
 *
 * @returns {*}
 * @constructor
 */
function EF_Form_Actions(empty_inputs)
{

    var $ = jQuery;
    var $this = this;

    // Object caching the templates
    var utilities = {};
    var templates = {};



    // Set the nb of fields at 0 for the start
    var fieldIncrement = 0;

    // All inputs available
    var inputs = [
        'text', 'email', 'password', 'number', 'tel', 'date', 'checkbox', 'radio', 'url', 'range', 'color', 'search', 'hidden','textarea','wp_editor'
    ];

    $this.initReset = initReset;
    $this.getUtilities = getUtilities;
    $this.getOption = getOption;
    $this.loadFields = loadFields;
    $this.getField = getField;
    $this.getInput = getInput;
    $this.getNumberOfFields = getNumberOfFields;
    $this.getFieldTemplate = getFieldTemplate;
    $this.addDataToField = addDataToField;

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

        $this.getField('options').done(function (optionTemplate) {

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


    /**
     *
     * @param fields
     */
    function loadFields(fields)
    {

        if(fields) {
            $this.fields = fields;
        }

        var _fields = jQuery.extend({}, $this.fields);

        // Do not display submit element
        delete _fields.submit;

        var keys = Object.keys(_fields);

        if (getNumberOfFields() < keys.length) {

            getField($this.fields[keys[getNumberOfFields()]]);
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
    function getField(field, expand) {

        var dfd = new $.Deferred();

        _getFieldTemplate(field).done(function (data) {

            // J'affiche les champs
            $("#fld").append(data);
            // Je rend le champ draggable
            $('#field-' + field.id).draggable(DraggableArgs);


            // Je m'occupe de some champs à hide
            _handleHiddenFields(field.id, field.type);

            addDataToField(field);

            if (expand === true)
                $('a[data-field="' + field.id + '"].open').click();

            // J'affiche les data
            loadFields();
            dfd.resolve(data);

        });

        // Return a promise
        return dfd.promise();

    }


    /**
     * @since 1.0.0
     *
     * Add the data inside the HTML field element
     *
     * @param field
     */
    function addDataToField(field)
    {
        if(field.attributes){
            $.each(field.attributes,function(key,value){
                if(input = document.getElementById('field['+ field.id +'][attributes]['+ key +']')){
                    if(input.type == 'checkbox' || input.type == 'radio'){
                        input.checked = value;
                    }else{
                        input.value = value;
                    }
                }

            })
        }

        if(field.settings){
            $.each(field.settings,function(key,value){
                if(input = document.getElementById('field['+ field.id +'][settings]['+ key +']')){
                    if(input.type == 'checkbox' || input.type == 'radio'){
                        input.checked = value;
                    }else{
                        input.value = value;
                    }
                }

            })
        }

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
    function getFieldTemplate(template) {
        // Create a promise
        var dfd = new $.Deferred();


        if (templates[template] && templates[template] != undefined && templates[template] != '') {
            dfd.resolve(templates[template]);
        } else {

            $.get(ajaxUrl, {
                element: 'inputs',
                template : template,
                action: 'EF/load_template'
            }).always(function (data) {

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
     * @since 1.0.0
     *
     * Init the form
     *
     * @returns {EF_Form_Actions}
     */
    function init()
    {

        return $this;
    }


    /**
     * @since 1.0.0
     *
     * @param val
     */
    function initReset(val)
    {
        $('#link-password-email').hide();
        $('#reset-password-email').hide();
        $('#' + val).show();
    }



    /**
     *
     * @since 1.0.0
     *
     * Display utilities on the map
     *
     *
     * @param val
     * @returns {*}
     */
    function getUtilities(val) {

        var q = $.Deferred();

        $('#spinner-utility').show();

        _getUtilityTemplate(val).done(function (data) {
            $('.utilities').html(data);
            $('#spinner-utility').hide();
            q.resolve();

        });

        return q.promise();

    }


    /**
     *
     * Return the input template of the template asked if it has already been loaded, else it load it and and put it into a variable.
     *
     * @Since V 0.5.4
     *
     * @update : 1.0.0
     *
     * @param val  string the template you want to load
     * @returns {*}
     */
    function _getUtilityTemplate(val) {


        // Create a promise
        var dfd = new $.Deferred();


        if (utilities[val] && utilities[val] != undefined && utilities[val] != '') {
            dfd.resolve(utilities[val]);
        } else {
            // Get the template
            $.get(ajaxUrl, {
                element: 'actions',
                template : val,
                action: 'EF/load_template'
            }, function (data) {
            }).always(function (data) {

                utilities[val] = data.data;

                // I send back the data
                dfd.resolve(data.data);
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
    function _getFieldTemplate(field) {

        // Create a promise
        var dfd = new $.Deferred();

        // Je récupère la base
        getFieldTemplate('base').done(function (base) {

            getFieldTemplate(field.attributes.type).done(function (data) {

                // Je met la base
                data = replace(base.data, 'input-content', data.data);
                data = replace(data, 'fieldId', field.id);

                dfd.resolve(data);
            });
        });
        // Return a promise
        return dfd.promise();
    }











    /**
     *  Handle hidden fields on certains kinds of fields
     *
     * @Since V 0.4
     *
     * @Updated : V 0.5.5 (Correct the value remove on hidden)
     *
     * @param id
     * @param type
     */
    function _handleHiddenFields(id,type){
        // Take care of checkbox & radios
        if($.inArray(type,inputs) != -1) {
            if (type == 'checkbox' || type == 'radio') {
                $('input[name="field[' + id + '][form-placeholder]"]').css('visibility', 'hidden').val('');
                $('input[name="field[' + id + '][form-autocomplete]"]').parent().parent().remove();
                $('input[name="field[' + id + '][form-required]"]').removeAttr('checked');
            }
            if(type == 'hidden'){
                $('input[name="field[' + id + '][form-placeholder]"]').parent().remove();
                $('input[name="field[' + id + '][form-autocomplete]"]').parent().parent().remove();
                $('input[name="field[' + id + '][form-label-after]"]').parent().parent().remove();
                $('input[name="field[' + id + '][form-required]"]').parent().parent().remove();
                $('input[name="field[' + id + '][form-class]"]').parent().parent().remove();
                $('input[name="field[' + id + '][form-id]"]').parent().parent().remove();
                $('input[name="field[' + id + '][form-label]"]').parent().parent().remove();
                $('input[name="field[' + id + '][form-label-class]"]').parent().parent().remove();
            }
        }
    }




    /**
     *
     * All empty inputs with theirs attributes
     *
     * @param args
     * @returns {*}
     */
    function getInput(args) {

        var input = empty_inputs[args.type];


        input.attributes.name = args.name;
        input.id = args.id;

        return input;
    }


    /**
     *
     * @returns {number}
     */
    function getNumberOfFields(){
        return $('.ef-field').length;
    }


    return init();
}