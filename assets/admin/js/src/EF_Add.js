/**
 * @since 1.0.0
 *
 *
 * @constructor
 */
function EF_Add(form)
{
    var $this = this;
    var $ = jQuery;


    /**
     *
     * @since 1.0.0
     *
     * Init the function
     *
     * @returns {EF_Add}
     */
    function init(){

        _loadUtilities();
        _loadInputs();


        var field = form.inputs.submit;
        field.id = 'submit';

        EF_form_actions.addDataToField(field);

        return $this;
    }


    /**
     *
     * @since 1.0.0
     *
     * Load the utilities
     *
     * @private
     */
    function _loadUtilities()
    {
        $('#title').val(form.title);
        EF_form_actions.getUtilities(form.settings.type).then(function(){
            _setSettings();
            _setAttributes();
        });
    }


    /**
     *
     * @since 1.0.0
     *
     * @private
     */
    function _loadInputs() {
        i = 0;

        $.each(form.inputs,function(key){
            form.inputs[key].id = (i+1);
            i++;
        });

        EF_form_actions.loadFields(form.inputs);
    }

    /**
     *
     * @private
     */
    function _setSettings()
    {
        if(!form.settings)
            return;

        $.each(form.settings,function(key,val){
            if(input = document.getElementById('settings['+ key +']')){
                input.value = val;
            }
        });
    }

    /**
     *
     * @private
     */
    function _setAttributes()
    {
        if(!form.attributes)
            return;
        $.each(form.attributes,function(key,val){
            if(input = document.getElementById('attributes['+ key +']')){
                input.value = val;
            }
        });
    }

    return init();
}