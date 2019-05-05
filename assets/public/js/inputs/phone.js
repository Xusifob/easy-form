(function ($) {

    let formats = {
        us: '(@@@) @@ @@ @@ @@',
        fr: '@@ @@ @@ @@ @@',
        en: '@@@ @@@ @@@@',
    };

    let tels = $('.ef_tel');

    tels.on('keyup',function () {

        let format = $(this).attr('format');

        if(!format) {
            return;
        }

        let val = $(this).val();

        val = val.replace(/[a-zA-Z()+.\-\\ ]+/gi,'');

        let string_format = formats[format];

        for(var i =0; i < val.length; i++) {
            string_format = string_format.replace(/@/,val[i]);
        }

        string_format = string_format.replace(/@/gi,'').trim();

        $(this).val(string_format);


    })

})(jQuery);