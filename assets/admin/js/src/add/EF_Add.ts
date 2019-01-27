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
     * All the default input types. Ex : user_pass : password
     */
    public defaultInputTypes : {};


    public formType : EF_Form;

    /**
     * If the editor is init
     */
    public is_init : boolean = false;

    public constructor() {

        this.$body = $('body');

    }


    public init() {

        this.setEvents();

        this.load().then((data) => {})
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
            .off('click','button[data-action="add"]')
            .on('click','button[data-action="add"]',() => {
                this.addInput('text',{}).then((input : EF_Input) => {
                    EF_Add.loading(false,'fields');
                    input.dirty = true;
                }) });


        this.$body
            .off('click','select[name="settings[type]"]')
            .on('change','select[name="settings[type]"]',($event : Event) => {
                let type = $($event.target).val();
                this.changeFormType(type);
            });

        /*
                this.$body
                    .on('click','button[data-action="add-option"]',_addOption);


                this.$body
                    .on('change','select[name$="[form-taxonomy]"]',_changeTaxonomy);

                this.$body
                    .on('change','select[name="form-reset-action"]',_changeResetAction);
                    */
    }


    /**
     * Reorganise all the inputs on the page according to the ones
     */
    public reorganise() : Promise<any>
    {

        let dfd = $.Deferred();

        EF_Add.loading(true,'fields');


        let inputs = [];

        $.each(this.inputs,(key,input : EF_Input) => {
            inputs.push(input.value);
        });

        this.removeAllInputs();

        this.loadInputs(inputs,0).then(() => {
            EF_Add.loading(false,'fields');
            dfd.resolve();
        });

        return dfd.promise();

    }

    /**
     *
     * Called when 2 inputs are moved
     *
     * @param input
     * @param direction
     */
    public onMove(input : EF_Input,direction : string = 'up') : any
    {
        let position = this.inputs.indexOf(input);

        let newpos = direction == 'up' ? position-1 : position +1;

        console.log(direction,newpos,position);

        if(newpos == -1 || newpos == this.inputs.length || !this.inputs[newpos]) {
            return
        }

        this.switch(position,newpos);
    }


    /**
     *
     * Switch 2 inputs
     *
     * @param pos1
     * @param pos2
     */
    public switch(pos1 : number, pos2: number)
    {
        let input1 = this.inputs[pos1];

        this.inputs[pos1] = this.inputs[pos2];

        this.inputs[pos2] = input1;

        this.reorganise();
    }


    /**
     * Remove all inputs from track
     */
    public removeAllInputs() : void
    {
        this.inputs = [];
        this.$body.find('#fld').html('');
    }


    /**
     *
     * Called on click on the duplicate button
     *
     * @Event
     *
     * @param input
     */
    public onDuplicate(input : EF_Input) : any
    {

        this.addInput(input.value.attributes.type,input.value).then(() => {
            EF_Add.success  = 'Them input has been duplicated';
            EF_Add.loading(false);
        })
    }


    /**
     *
     * Called when the change of type is triggered
     *
     * @Event
     *
     * @param input
     */
    public onChangeType(input : EF_Input) : any
    {
        let position = this.inputs.indexOf(input);

        let value = input.value;

        this.addInput(value.attributes.type,value,position).then((input) => {
            EF_Add.loading(false,'fields');
            input.open();
        })
    }


    /**
     *
     * Called on delete of an input
     *
     * @Event
     *
     * @param input
     */
    public onDelete(input : EF_Input) : any
    {
        let position = this.inputs.indexOf(input);

        this.inputs.splice(position,1);

        this.reorganise();
    }


    /**
     * Add an input to the editor
     */
    public addInput(type : string = 'text',$data,position : number|null = null) : Promise<EF_Input>
    {

        // Create a promise
        let dfd = new $.Deferred();


        EF_Add.loading(true,'fields');

        // Close all the inputs
        $.each(this.inputs,(key : number, input : EF_Input) => {
            input.close()
        });

        this.getInput(type).then((data : any) => {

            let input : EF_Input;

            input = this.generateInput(type);

            input.init(data,position ? position : this.inputs.length,$data,position);

            input.onDuplicate = (input : EF_Input ) => { this.onDuplicate(input) };
            input.onChangeType = (input : EF_Input) => { this.onChangeType(input) };
            input.onDelete = (input : EF_Input) => { this.onDelete(input) };
            input.onMove = (input:  EF_Input, action : string) => { this.onMove(input,action) };

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
    public static loading(loading : boolean = true,$element : null|string = null)
    {
        // Show the spinner

        switch ($element) {
            case 'fields' :
                $('#spinner-fields').toggle(loading);
                break;
            case 'utility' :
                $('#spinner-utility').toggle(loading);
                break;
            default:
                $('#spinner-utility').toggle(loading);
                $('#spinner-fields').toggle(loading);
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


            this.defaultInputTypes = data.data.default_inputs;


            // Add the submit data
            if(data.data.form.inputs.submit) {
                let submit = data.data.form.inputs.submit;
                delete data.data.form.inputs.submit;
                this.addSubmitData(submit);
            }

            // Load all the inputs
            this.loadInputs(data.data.form.inputs,0).then(() => {

                this.inputs.forEach((value : EF_Input,key : number) => {
                    this.inputs[key].dirty = true;
                });

                this.addRequiredFields(data.data.form.type);
            });



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


    /**
     *
     * @param type
     */
    protected changeFormType(type) : void
    {

        EF_Add.loading(true,'utility');

        let $formData = this.formType.value;

        $formData.type = type;

        this.addFormData($formData);
        this.addRequiredFields($formData.type);

    }


    /**
     *
     * Add the form data in the form type
     *
     * @param $formData
     */
    protected addFormData($formData) : void
    {

        this.loadFormTemplate($formData.type).then(($template) => {
            this.formType = this.generateForm($formData.type);

            this.formType.init($template);

            $('#ef-add-type').find('[name^="settings"]').each((key : number,elem : any) => {

                this.fillInfos($(elem),$formData);

            });
            EF_Add.loading(false,'utility');

        });
    }


    /**
     *
     * @param formType
     */
    public addRequiredFields(formType : string) : void
    {
        let required = this.availableForms[formType].required;

        this.removeUntouchedInputs().then(() => {
            $.each(this.inputs,(key : string, input : EF_Input) => {

                let index = $.inArray(input.value.attributes.name,required);
                if(index != -1) {
                    required.splice(index, 1);
                }
            });

            let inputs = [];


            $.each(required,(key : number,inputName : string) => {

                // Add the default values inside
                let input = this.getAvailableInputData(inputName);

                input.attributes.name = inputName;

                inputs.push(input);

            });

            if(inputs && inputs.length > 0) {
                this.loadInputs(inputs, 0).then(() => {
                    EF_Add.success = 'The fields ' + required.join(', ') + ' have been added to the form';
                });
            }
        });
    }


    /**
     * Remove all the inputs added by changing the type of form
     */
    public removeUntouchedInputs() : Promise<any>
    {
        let inputs = [];

        $.each(this.inputs,(key : number, input : EF_Input) => {

            if (input.dirty) {
                inputs.push(input);
            }
        });

        this.inputs = inputs;

        return this.reorganise();
    }


    /**
     *
     * @param inputType
     */
    public getAvailableInputData(inputType : string) : any
    {
        let input;

        // Default type
        let type = 'text';

        if(this.defaultInputTypes[inputType]) {
            type = this.defaultInputTypes[inputType];
        }

        if(this.availableInputs[type]) {
            input = this.availableInputs[type].data;
        }else {
            input = this.availableInputs['text'].data;
        }

        return input;
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


    /**
     *
     * Fill form data the infos inside the editor
     *
     * @param $elem
     * @param $formData
     */
    public fillInfos($elem,$formData) : void
    {
        let prop = EF_Input.getInputProperties($elem);

        if($formData[prop.attr] && $formData[prop.attr][prop.id]) {

            EF_Input.setInputValue($elem,$formData[prop.attr][prop.id]);
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
     * Load all the inputs from the list
     *
     * @param inputs
     * @param dfd
     * @param order
     */
    private loadInputs(inputs : { attributes : {type : string }}[],order : number,dfd  : any = null) : Promise<any>
    {
        if(!dfd) {
            dfd = new $.Deferred();
        }

        let keys = Object.keys(inputs);

        let key = keys[order];

        if(!key || !inputs || !inputs[key]){
            this.is_init = true;
            EF_Add.loading(false,'fields');
            dfd.resolve();
            return dfd.promise();
        }else{
            this.addInput(inputs[key].attributes.type,inputs[key]).then(() => {
                order++;
                this.loadInputs(inputs,order,dfd);
            });

        }

        return dfd.promise();

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
            case 'post' :
                form = new EF_Form();
                break;
        }
        if(!form) {
            form = new EF_Form();
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

        if(!input) {
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
    public handleError(data : string|{responseJSON : {error}}) : void
    {

        let error : string;

        if(typeof data != "string") {
            error = data.responseJSON.error;
        }

        EF_Add.error = error;
        EF_Add.loading(false);


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




    /**
     * Display an error message that will fade out in 5 sec
     *
     * @param errorMessage
     */
    public static set error(errorMessage : string|boolean) {

        EF_Add.setMessage('#error-message',errorMessage,false);

    }



    /**
     *
     * Display a success message that will fade out in 5 sec
     *
     * @param successMessage
     */
    public static set success(successMessage: string|boolean) {

        EF_Add.setMessage('#success-message',successMessage,false);
    }


    /**
     *
     * @param element
     * @param message
     * @param persist : boolean, Weither or not the message should be displayed or not
     */
    public static setMessage(element : string,message : string|boolean, persist : boolean|number = false) : void
    {

        if(message) {
            $(element).text(message).fadeIn(200);

            if(!persist) {

                // Make sure that persist is not equal to false
                if(typeof persist === "boolean") {
                    persist = 5000;
                }

                setTimeout(() => {
                    this.setMessage(element,'');
                },persist);
            }


        }else {
            $(element).fadeOut(200,() => {
                $(element).text('');
            });
        }
    }

}

var EF_add = new EF_Add();
EF_add.init();