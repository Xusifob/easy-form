// Use to display the duplication field modal
$('.move').on('click',function() {
    var fieldId = $(this).attr('data-field');
    $('#form-duplicate-field-id').val(fieldId);
    $('#modal-move').modal('show');

    return false;
});
