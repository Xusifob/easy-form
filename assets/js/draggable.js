
var DraggableArgs = {
    containment: '#container',
    opacity: 1,
    zIndex: 100,
    cursor: 'move',
    handle: '.col-sm-7 label',

    // Event at the start of dragging
    start: function (event, ui) {
        // I close all fields
        $('.minify').each(function () {
            $(this).click();
        });

    },


    // Event when the field is dragged
    drag: function (event, ui) {
        var top = $(this).offset().top - $('#allfields').offset().top;

        var height = $(this).height();

        // The new id of the field
        var nbField = Math.min(Math.max(Math.ceil((top - 50) / height), 1), nbfield);

        var oldnbField = parseInt($(this).attr('id').substr(6));

        $(this).append('<span class="info"></span>');
        $(this).children('.info').html(nbField);

        $('div[id^="field-"]').each(function () {
            $(this).removeClass('hovered');
        });
        if (oldnbField != nbField) {
            $('#field-' + nbField).addClass('hovered');
        }
    },


    // when the dragging event stops
    stop: function (event, element) {

        var top = $(this).offset().top - $('#allfields').offset().top;

        var height = $(this).height();

        // The new id of the field
        var nbField = Math.min(Math.max(Math.ceil((top - 50) / height), 1), nbfield);

        // L'id du champ qui bouge
        var oldnbField = parseInt($(this).attr('id').substr(6));

        $(this).attr('style', 'position: relative;');

        // Je retire la class hovered
        $('div[id^="field-"]').each(function () {
            $(this).removeClass('hovered');
        });

        // Je bouge que si le champ est différent
        if (nbField != oldnbField) {


            if (oldnbField < nbField) {
                // Je descend le champ
                for (var k = oldnbField; k < nbField; k++) {
                    switchIds(k, k + 1);
                }
            } else {

                // Je monte le champ
                for (var k = oldnbField; k > nbField; k--) {
                    switchIds(k, k - 1);
                }
                // J'échange les id
            }
        }

    }
};