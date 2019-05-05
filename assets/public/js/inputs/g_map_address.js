(function ($) {

    let inputs = $('[g_map_address]');


    let autocompletes = [];

    inputs.each((key,input) => {

        let id = $(input).attr('g_map_address');
        let old_data = $('script[for="'+ id +'"]').text();

        var options = {
            componentRestrictions: {country: ''}
        };

        options.componentRestrictions.country = $(input).attr('countries').split(',');


        let autocomplete = new google.maps.places.Autocomplete(input, options);
        autocompletes.push(autocomplete);

        let hidden = $('#' + id);

        if(old_data) {
            hidden.val(old_data);
        }

        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();

            hidden.val(JSON.stringify(place));

        });

        $(input).attr('type','text');
    })





})(jQuery);