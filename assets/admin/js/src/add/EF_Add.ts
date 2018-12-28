import {EF_Form} from "./forms/EF_Form";

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
     * All the available inputs
     */
    public availableForms : {} = {};


    /**
     * If the editor is init
     */
    public is_init : boolean = false;

    public constructor() {

        this.$body = $('body');

    }


    public init() {

        this.setEvents();

        this.load().then((data) => {
            this.loading(false);
        })
    }


    protected setEvents() : void
    {
        /*
        this.$body
            .on('click','.move',_move);

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
            .on('click','button[data-action="add"]',() => {
                this.addInput('text',{}).then(() => {
                    this.loading(false,'fields');
                }) });

        this.$body
            .on('change','select[name$="[attributes][type]"]',($event : Event) => {
                let type = $($event.target).val();
                let prop = EF_Input.getInputProperties($($event.target));
                this.changeInput(type,this.inputs[prop.id],prop.id)
            });

        /*
                this.$body
                    .on('click','button[data-action="add-option"]',_addOption);


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
     *
     * Change the type of input
     *
     * @param type
     * @param $input
     * @param $position
     */
    public changeInput(type : string,$input : EF_Input,$position : number|null = null)
    {
        let value = $input.value;

        this.addInput(type,value,$position).then((input) => {
            this.loading(false,'fields');
            input.open();
        })
    }



    /**
     * Add an input to the editor
     */
    public addInput(type : string = 'text',$data,position : number|null = null) : Promise<any>
    {

        // Create a promise
        let dfd = new $.Deferred();


        this.loading(true,'fields');

        // Close all the inputs
        $.each(this.inputs,(key : number, input : EF_Input) => {
            input.close()
        });

        this.getInput(type).then((data : any) => {

            let input : EF_Input;

            input = this.generateInput(type);

            input.init(data,position ? position : this.inputs.length,$data,position);

            if(position) {
                this.inputs[position] = input;
            } else {
                this.inputs.push(input);
            }

            dfd.resolve(input);

        });

        // Return a promise
        return dfd.promise();


    }


    /**
     *
     * Show or hide the loadings
     *
     * @param loading
     * @param $element
     */
    public loading(loading : boolean = true,$element : null|string = null)
    {
        // Show the spinner

        switch ($element) {
            case 'fields' :
                this.$body.find('#spinner-fields').toggle(loading);
                break;
            case 'utility' :
                this.$body.find('#spinner-utility').toggle(loading);
                break;
            default:
                this.$body.find('#spinner-utility').toggle(loading);
                this.$body.find('#spinner-fields').toggle(loading);
                break;
        }

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

            // Add the data for all the form
            this.addData(data.data.form);
            this.addFormData(data.data.form);


            $.each(data.data.inputs,(type,input : any) => {
                this.availableInputs[type] = input;
            });

            $.each(data.data.forms,(type,input : any) => {
                this.availableForms[type] = input;
            });


            // Add the submit data
            if(data.data.form.inputs.submit) {
                let submit = data.data.form.inputs.submit;
                delete data.data.form.inputs.submit;
                this.addSubmitData(submit);
            }

            // Load all the inputs
            this.loadInputs(data.data.form.inputs,0);



            // I send back the data
            dfd.resolve(data);
        }).error(this.handleError);


        // Return a promise
        return dfd.promise();

    }


    /**
     * Add the data inside the form itself
     *
     * @param $formData
     */
    protected addData($formData : any) : void
    {

        $('#ef-add-main-info').find('[name^="settings"]').each((key : number,elem : any) => {

            this.fillInfos($(elem),$formData);

        });
        $('#ef-add-main-info').find('[name^="attributes"]').each((key : number,elem : any) => {

            this.fillInfos($(elem),$formData);

        })
    }


    protected addFormData($formData) : void
    {
        this.loadFormTemplate($formData.type).then(($template) => {
            let $form : EF_Form = this.generateForm($formData.type);
            $form.init($template,$form);

            $('#ef-add-type').find('[name^="settings"]').each((key : number,elem : any) => {

                this.fillInfos($(elem),$formData);

            });


        });
    }


    /**
     *
     * @param type
     */
    public loadFormTemplate(type : string) : Promise<any>
    {
        // Create a promise
        let dfd = new $.Deferred();

        let key = 'form-' + type;

        if (this.templates[key] && this.templates[key] != undefined && this.templates[key] != '') {
            dfd.resolve(this.templates[key]);
        } else {

            $.get(ajaxUrl, {
                element: 'actions',
                template : type,
                action: 'EF/load_template'
            }).success((data) => {

                this.templates[key] = data.data;

                // I send back the data
                dfd.resolve(data.data);
            }).error(this.handleError);
        }

        // Return a promise
        return dfd.promise();
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
            this.loading(false,'fields');
            return;
        }else{
            this.addInput(inputs[key].attributes.type,inputs[key]).then(() => {
                order++;
                this.loadInputs(inputs,order);
            });

        }

    }



    public generateForm(type : string) : EF_Form
    {
        let form;

        if(!this.availableForms[type]) {
            type = 'post';
        }

        switch (type) {
            case 'login' :
                form = new EF_Form();
                break;
        }


        return form;
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

                this.templates[type] = data.data;

                // I send back the data
                dfd.resolve(data.data);
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
EF_add.init();