(function ($) {

    let inputs = $('[g_map_address]');


    let autocompletes = [];

    inputs.each((key,input) => {

        var options = {
            componentRestrictions: {country: ''}
        };

        options.componentRestrictions.country = $(input).attr('countries').split(',');


        let autocomplete = new google.maps.places.Autocomplete(input, options);
        autocompletes.push(autocomplete);

        let hidden = $('#' + $(input).attr('g_map_address'));

        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();

            hidden.val(JSON.stringify(place));

        });

        $(input).attr('type','text');
    })





})(jQuery);