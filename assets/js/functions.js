/**
 *  Handle hidden fields on certains kinds of fields
 *
 * @param id
 * @param type
 */
function handleHiddenFields(id,type){
    // Take care of checkbox & radios
    if($.inArray(type,inputs) != -1) {
        if (type == 'checkbox' || type == 'radio') {
            $('input[name="field[' + id + '][form-placeholder]"]').css('visibility', 'hidden').val('');
            $('input[name="field[' + id + '][form-autocomplete]"]').parent().parent().remove();
            $('input[name="field[' + id + '][form-required]"]').removeAttr('checked');
        }
    }
}

/**
 *
 * Update a field from id1 to id2
 *
 * @param field
 * @param id1
 * @param id2
 */
function updateIds(field, id1, id2) {
    field.attr("id", 'field-' + id2);
    field.find("*[data-field="+ id1 +"]").attr("data-field", id2);
    field.find(".options-"+ id1).attr("class", "options-"+ id2);
    field.find("input,select").each(function() {
        var newName = $(this).attr('name').replace(/field\[[0-9]+\]\[(.+)\]/g,"field["+ id2 +"][$1]");
        $(this).attr('name',newName);
        if ($(this).attr('id'))
            $(this).attr('id',newName);
    });
    field.find("label").each(function() {
        if ($(this).attr('for')) {
            var newName = $(this).attr('for').replace(/field\[[0-9]+\]\[(.+)\]/g, "field[" + id2 + "][$1]");
            $(this).attr('for', newName);
        }
    });
    field.find(".field-number").text(id2);
}
/**
 * Switch thd id of 2 fields
 *
 * @param id1
 * @param id2
 */
function switchIds(id1,id2) {
    var thefield = $('#field-' + id1);
    var fieldBefore = $('#field-' + id2);

    if (id1 < id2)
        fieldBefore.after(thefield);
    else
        fieldBefore.before(thefield);

    updateIds(thefield, id1,id2);
    updateIds(fieldBefore, id2,id1);
}
