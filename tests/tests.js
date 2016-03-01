/**
 *
 * Function that does the test
 *
 * @param fnc
 * @param params
 * @returns {*}
 */
function test(fnc, params) {

    var dfd = new jQuery.Deferred();
    var time = Date.now();
    var result = fnc(params);
    time = Math.round((Date.now() - time) * 100) / 100;

    var ret = {
        result : result.result,
        function : fnc.name,
        params : params == undefined ? {} : params,
        time : time + 's',
        reason : result.reason,
    };

    dfd.resolve(ret);

    return dfd.promise();

}


/**
 *
 * @since V 0.5.6
 *
 * Launch the next php test
 *
 * @param i int number of the text to do
 */
function nextTestJs(i) {
    if (tests_js[i] != undefined) {
        test(tests_js[i].test,tests_js[i].params)
            .done(function (data) {
                handleResult(data, 'js');
                i++;
                nextTestJs(i);
            });
    } else {
        jQuery('#spinner-js').hide();

        var table = jQuery('#table-js');

        table.after("<span style='color:green;'>" + success.js + " Succès</span><br>");
        if (fail.php != 0)
            table.after("<span style='color:red;'>" + fail.js + " Echec</span>");
        table.after("<span>" + (success.php + fail.js) + " Total</span><br>");
    }
}


var tests_js = [
    {
        test : test_vars_utilities,
        params : {}
    },{
        test : test_vars_fields,
        params : {}
    },{
        test : test_vars_inputs,
        params : {}
    },{
        test : test_function_get_input,
        params : {}
    },{
        test : test_page_fields_available,
        params : {}
    },
];



// Launch the tests in JS
nextTestJs(0);



/*********************** ALL TEST FUNCTIONS ********/

/**
 * @Since V 0.5.5
 *
 * Test that the utilities vars exist
 *
 * @returns {*}
 */
function test_vars_utilities() {

    if (utilitiesEmpty == undefined)
        return {
            result: false,
            reason: 'var utilitiesEmpty does not exist'
        };

    if (utilitiesEmpty.connexion == undefined)
        return {
            result: false,
            reason: 'var utilitiesEmpty.connexion does not exist'
        };

    if (utilitiesEmpty.email == undefined)
        return {
            result: false,
            reason: 'var utilitiesEmpty.email does not exist'
        };

    if (utilitiesEmpty.post == undefined)
        return {
            result: false,
            reason: 'var utilitiesEmpty.post does not exist'
        };

    if (utilitiesEmpty.resetPassword == undefined)
        return {
            result: false,
            reason: 'var utilitiesEmpty.resetPassword does not exist'
        };

    if (utilitiesEmpty.user == undefined)
        return {
            result: false,
            reason: 'var utilitiesEmpty.user does not exist'
        };


    return {
        result: true,
        reason: ''
    };
}


/**
 * @Since V 0.5.5
 *
 * Test that the utilities vars exist
 *
 * @returns {*}
 */
function test_vars_fields() {

    if (fields == undefined)
        return {
            result: false,
            reason: 'var fields does not exist'
        };


    return {
        result: true,
        reason: ''
    };
}

/**
 * @Since V 0.5.5
 *
 * Test that the inputs vars exist
 *
 * @returns {*}
 */
function test_vars_inputs() {

    if (inputs == undefined)
        return {
            result: false,
            reason: 'var inputs does not exist'
        };


    return {
        result: true,
        reason: ''
    };
}

/**
 * @Since V 0.5.5
 *
 * Test the function getInput the inputs vars exist
 *
 * @returns {*}
 */
function test_function_get_input(){

    var inputTest = {
        id: 1,
        type: 'text',
        name: ''
    };

    for(var i=0;i<inputs.length;i++){
        inputTest.type = inputs[i];
        if(getInput(inputTest) == undefined || typeof getInput(inputTest) != 'object')
            return {
                result: false,
                reason: 'Error on getInput in input ' + inputs[i],
            };
    }

    return {
        result: true,
        reason: ''
    };
}

/**
 * @Since V 0.5.5
 *
 * Test if all the fields in the add page are available
 *
 * @returns {*}
 */
function test_page_fields_available(){

    var fieldsToTest = {
        'form-title' : '',
        'form-action' : '#',
        'form-class-defaut' : 'form-control',
        'form-class' : '',
        'form-id' : '',
        'form-display-errors' : false,
        'form-display-errors-before' : false,
        'form-button-send' : 'Envoyer',
    };

    console.log($('#form-title').length);
    return {
        result: true,
        reason: ''
    };
}