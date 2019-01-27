(function ($) {

    $('[delete-file]').click((event) => {

        let del = $(event.target);

        let img_id = del.attr('img-id');
        let input_id = del.attr('input-id');

        let input = $('#' + input_id);

        let val = input.val().split(',');

        let index = val.indexOf(img_id);
        val.splice(index,1);
        input.val(val.join(','));


        $('#' + img_id).remove();
        del.remove();

        return false;
    })

})(jQuery);