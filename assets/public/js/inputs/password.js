(function ($) {

    let strengths = [
        ef_password_strings.very_weak,
        ef_password_strings.weak,
        ef_password_strings.medium,
        ef_password_strings.strong,
        ef_password_strings.very_strong,
    ];


    let passwords = $('.password-checked');

    passwords.each(function(key){
        let id = $(this).attr('id');

        let input = $('[password-id="'+ id + '"]');

        input.on('input',_onPWdChange);

    });


    /**
     *
     * @param event
     * @private
     */
    function _onPWdChange(event)
    {
        let input = $(this);

        let checker = $('#' + input.attr('password-id'));

        let similar = true;

        if(checker.attr('password-similar')) {
            let value = input.val();

            $('input[type="password"]').each(function () {

                let pwd = $(this).val();

                if(value != pwd && pwd != '') {
                    similar = false;
                }
            });

        }


        let strength = get_strength(_analyse($(this)));

        let string = '';

        if(!similar) {
            string = ef_password_strings.similar_passwords + strengths[strength];
        } else {
            string = strengths[strength];
        }

        checker.html(string);

    }


    function _analyse(input) {

        let password = input.val();
        let score = 0;
        let checker = $('#' + input.attr('password-id'));

        if(!password) {
            return score;
        }

        if(password.length > parseInt(checker.attr('min-length'))) {
            score += 40;
        }


        let $num = {
            'excess': 0,
            'upper': 0,
            'symbols': 0,
            'numbers': 0,
        };

        let $bonus = {
            'excess' : 1,
            'upper' : 4,
            'numbers' : 5,
            'symbols' : 5,
            'combo' : 0,
            'flat_lower' : 0,
            'flat_number' : 0,
            'flat_upper' : 0,
            'same_char' : 0,
        };


        password.split('').forEach((char) => {

            if (char.match(checker.attr('pattern-number')))
                $num['numbers']++;

            if (char.match(checker.attr('pattern-symbol')))
                $num['symbols']++;

            if (char.match(checker.attr('pattern-upper')))
                $num['upper']++;
        });

        // Check the number over the min length
        $num['excess'] = password.length - checker.attr('min-length');


        if($num['upper'] && $num['numbers'] && $num['symbols']){
            $bonus['combo'] = 25;
        }else if($num['upper'] && $num['numbers'] || $num['upper'] && $num['symbols'] || $num['numbers'] && $num['symbols']){
            $bonus['combo'] = 15;
        }


        if(password.match(checker.attr('pattern-flat-lower')))
            $bonus['flat_lower'] = -25;

        if(password.match(checker.attr('pattern-flat-number')))
            $bonus['flat_number'] = -25;
        if(password.match(checker.attr('pattern-flat-upper')))
            $bonus['flat_upper'] = -25;


        // Calculate the score
        score = score + $num['excess']*$bonus['excess'] +
            $num['upper']*$bonus['upper'] +
            $num['numbers']* $bonus['numbers'] +
            $num['symbols']*$bonus['symbols'] +
            $bonus['combo'] +
            $bonus['flat_lower'] +
            $bonus['flat_number'] +
            $bonus['flat_upper'] +
            $bonus['same_char'];


        return score;
    }


    /**
     *
     * Return the strength of the password
     *
     * @param score
     * @return {number}
     */
    function get_strength(score)
    {
        if(score > 100 ) {
            return 4;
        }
        if(score > 75) {
            return 3;
        }
        if(score > 50) {
            return 2;
        }
        if(score > 25) {
            return 1
        }
        return 0;
    }


})(jQuery);