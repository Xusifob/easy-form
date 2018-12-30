(function ($) {

    let strengths = [
        'Very Weak',
        'Weak',
        'Medium',
        'Strong',
        'Very strong'
    ];


    let passwords = $('.password-checked');

    passwords.each(function(){
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

        let strength = get_strength(_analyse($(this)));

        let checker = $('#' + input.attr('password-id'));

        checker.html(strengths[strength]);

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