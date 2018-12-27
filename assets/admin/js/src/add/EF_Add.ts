declare var $;

declare var ajaxUrl : string;

import {EF_Input} from './inputs/EF_Input';

class EF_Add
{


    /**
     * The HTML Body of the page
     */
    public $body;

    /**
     *An object of all the input templates cached to avoid latency
     */
    public templates : any = {};

    /**
     * Array of all the inputs available on the page
     */
    public inputs : EF_Input[] = [];


    /**
     * All the available inputs
     */
    public availableInputs : {} = {};


    /**
     * If the editor is init
     */
    public is_init : boolean = false;

    public constructor() {

        this.$body = $('body');

        this.setEvents();

        this.load().then((data) => {

        })

    }


    public init(form : any) {

        console.log(form);

    }


    protected setEvents() : void
    {
        /*
        this.$body
            .on('click','.move',_move);

        // Delete a field
        this.$body
            .on('click','.delete',_delete);


        this.$body
            .on('click','.up',_up);

        this.$body
            .on('click','.down',_down);

        this.$body
            .on('click','.removeoption',_removeOption);

        this.$body
            .on('click','.dupliquer',_duplicate);*/

        // Add a new field
        this.$body
            .on('click','button[data-action="add"]',this.addInput);
        /*
                this.$body
                    .on('click','button[data-action="add-option"]',_addOption);

                this.$body
                    .on('change','select[name$="attributes[type]"]',_changeFieldType);

                this.$body
                    .on('change','select[name$="[form-taxonomy]"]',_changeTaxonomy);

                this.$body
                    .on('change','select[name="form-reset-action"]',_changeResetAction);

                this.$body
                    .on('change','select[name="settings[type]"]',_changeUtility);

                this.$body
                    .on('click','.panel header',_togglePanel);*/
    }


    /**
     * Add an input to the editor
     */
    public addInput(type : string = 'text',$data) : Promise<any>
    {

        // Create a promise
        let dfd = new $.Deferred();


        this.loading(true);

        // Close all the inputs
        $.each(this.inputs,(key : number, input : EF_Input) => {
            input.close()
        });

        this.getInput(type).then((data : any) => {

            let input : EF_Input;

            input = this.generateInput(type);

            input.init(data.data,this.inputs.length,$data);

            this.inputs.push(input);

            dfd.resolve(input);

        })

        // Return a promise
        return dfd.promise();


    }


    /**
     *
     * @param loading
     */
    public loading(loading : boolean = true)
    {
        // Show the spinner
        $('#spinner-fields').toggle(loading);

    }


    /**
     * Load the form data from the back office
     */
    public load() : Promise<any>
    {
        // Create a promise
        let dfd = new $.Deferred();


        $.getJSON(ajaxUrl, {
            form_id : EF_Add.getParameter('post'),
            action: 'EF/load_form_data'
        }).success((data) => {

            this.addData(data.data.form);

            $.each(data.data.inputs,(type,input : any) => {
                this.availableInputs[type] = input;
            });

            if(data.data.form.inputs.submit) {
                let submit = data.data.form.inputs.submit;
                delete data.data.form.inputs.submit;
                this.addSubmitData(submit);
            }

            this.loadInputs(data.data.form.inputs,0);



            // I send back the data
            dfd.resolve(data);
        }).error(this.handleError);


        // Return a promise
        return dfd.promise();

    }


    /**
     * Add the data inside the form itself
     */
    protected addData($form : any) : void
    {

        console.log($form);

        $('#ef-add-main-info').find('[name^="settings"]').each((key : number,elem : any) => {

            this.fillInfos($(elem),$form);

        });
        $('#ef-add-main-info').find('[name^="attributes"]').each((key : number,elem : any) => {

            this.fillInfos($(elem),$form);

        })
    }


    public fillInfos($elem,$form) : void
    {
        let prop = EF_Input.getInputProperties($elem);

        if($form[prop.attr] && $form[prop.attr][prop.id]) {

            EF_Input.setInputValue($elem,$form[prop.attr][prop.id]);
        }
    }


    /**
     *
     * Add the data inside the submit button
     *
     * @param submit
     */
    private addSubmitData(submit) : void
    {
        EF_Input.addDataToElement(this.$body.find('#ef-add-submit'),submit);
    }


    /**
     *
     * @param inputs
     * @param order
     */
    private loadInputs(inputs,order : number)
    {

        let keys = Object.keys(inputs);

        let key = keys[order];

        if(!key || !inputs || !inputs[key]){
            this.is_init = true;
            this.loading(false);
            return;
        }else{
            this.addInput(inputs[key].attributes.type,inputs[key]).then(() => {
                order++;
                this.loadInputs(inputs,order);
            });

        }

    }


    /**
     *
     * @param type
     */
    public generateInput(type : string) : EF_Input
    {
        let input;

        if(!this.availableInputs[type]) {
            type = 'text';
        }


        switch(type) {
            default :
                input = new EF_Input();
        }


        return input;

    }


    /**
     *
     * Load the input template from the BO
     *
     * @param type : string
     * @return {Promise}
     */
    public getInput(type : string = 'text')
    {
        // Create a promise
        let dfd = new $.Deferred();

        if (this.templates[type] && this.templates[type] != undefined && this.templates[type] != '') {
            dfd.resolve(this.templates[type]);
        } else {

            $.get(ajaxUrl, {
                element: 'inputs',
                template : type,
                action: 'EF/load_template'
            }).success((data) => {

                this.templates[type] = data;

                // I send back the data
                dfd.resolve(data);
            }).error(this.handleError);
        }


        // Return a promise
        return dfd.promise();
    }


    /**
     * Handle the HTTP Errors
     *
     * @TODO
     */
    public handleError() : void
    {

    }


    /**
     *
     * Get the url parameter
     *
     * @param parameter
     * @returns {any}
     */
    public static getParameter(parameter : string):any
    {
        var params_string = window.location.search.substr(1);

        var params_array = params_string.split('&');

        var obj = {};
        for(var i =0;i<params_array.length;i++)
        {
            var e = params_array[i].split('=');
            obj[e[0]] = e[1]
        }

        return obj[parameter];
    }

}

var EF_add = new EF_Add();