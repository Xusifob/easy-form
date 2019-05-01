
declare var $ : any;

export class EF_Input
{

    /**
     * @var string
     *
     * The type of the input
     */
    public static type : string = 'text';


    /**
     * @var HTML Element
     *
     * The html element of the input
     *
     */
    public element : any;


    /**
     * @var HTML Element
     *
     * The html element for the option
     */
    public optionsElement : any;


    /**
     * The id (position) of the input
     */
    public id : number;


    /**
     * The HTML element of the container
     */
    public container : any;


    /**
     * If the field has been changed or not
     */
    public dirty : boolean = false;


    /**
     * Function called on duplicate
     */
    public onDuplicate : any;
    public onChangeType : any;
    public onDelete : any;
    public onMove : any;

    public constructor() {

        this.container = $('#fld');

    }


    /**
     *
     * @param $element
     * @param $data
     * @param id
     * @param position : number
     */
    public init($element : any, id : number,$data : any,position : null|number = null)
    {
        this.id = id;

        $element = $element.replace(/fieldUnId/g,id+1);
        $element = $element.replace(/fieldId/g,id);

        this.element = $($element);
        this.optionsElement = this.element.find('.ef-table');

        if(null === position) {
            this.container.append(this.element);
        }else {
            this.container.find('#field-' + position).replaceWith(this.element);
        }

        this.setEvents();

        this.addData($data);

        this.handleCheckbox();

    }


    /**
     * Handle the checkboxs to link them with a hidden input
     */
    public handleCheckbox()
    {
        this.element.find('input[type="checkbox"]').each((key : number,input : HTMLElement) => {
            let $input = $(input);

            let value = $input.is(':checked') ? 1 : 0;
            let name = $input.attr('name');
            $input.attr('name','');

            let $hidden = $('<input type="hidden" name="'+ name +'" value="'+ value +'">');


            $input.on('change',() => {
                let value = $input.is(':checked') ? 1 : 0;
                $hidden.attr('value',value);
            });

            $input.after($hidden)

        })
    }


    /**
     * Set all the events linked to this element
     */
    public setEvents() : void
    {
        this.element.find('[data-action="open-close"]').off('click').on('click',() => {return this.toggle()});
        this.element.find('[data-action="duplicate"]').off('click').on('click',() => {this.onDuplicate(this); return false;});
        this.element.find('[data-action="change-type"]').off('click').on('click',() => {this.onChangeType(this); return false;});
        this.element.find('[data-action="delete"]').off('click').on('click',() => {this.onDelete(this); return false;});
        this.element.find('[data-action="up"]').off('click').on('click',() => {this.onMove(this,'up'); return false;});
        this.element.find('[data-action="down"]').off('click').on('click',() => {this.onMove(this,'down'); return false;});
        this.element.find('select,input,textarea').on('input', () => { this.dirty = true;});
    }




    /**
     * Close the element
     */
    public toggle(): boolean
    {

        let elem = this.element.find('[data-action="open-close"]');

        if($(elem).hasClass('minify')) {
            return this.close();
        }else {
            return this.open();
        }

    }


    /**
     * Insert the data in the template
     *
     * @param $data
     */
    public addData($data) : void
    {

        if($data.dirty) {
            this.dirty = $data.dirty;
        }


        EF_Input.addDataToElement(this.element,$data)
    }


    /**
     *
     * @param $element
     * @param $data
     */
    public static addDataToElement($element : any, $data : any) : void
    {
        $element.find('[name^="field"]').each((key : number,elem : any) => {

            let prop = EF_Input.getInputProperties($(elem));

            if($data[prop.prop] && $data[prop.prop][prop.name]) {
                EF_Input.setInputValue($(elem),$data[prop.prop][prop.name]);
            }

        })
    }



    /**
     *
     * Add a value to an input
     *
     * @param input
     * @param value
     */
    public static setInputValue(input : any, value : string|boolean)
    {
        if(input.is(':checkbox')){
            if("1" == value || value == 'on') {
                value = true;
            }else {
                value = false;
            }
            input.prop('checked',value);
        }else if(input.is('select')){
            input.find('option[value="'+ value +'"]').prop('selected',true);
        }
        else{
            input.val(EF_Input.stripslashes(value));
        }
    }


    //       discuss at: http://locutus.io/php/stripslashes/
    //      original by: Kevin van Zonneveld (http://kvz.io)
    //      improved by: Ates Goral (http://magnetiq.com)
    //      improved by: marrtins
    //      improved by: rezna
    //         fixed by: Mick@el
    //      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    //      bugfixed by: Brett Zamir (http://brett-zamir.me)
    //         input by: Rick Waldron
    //         input by: Brant Messenger (http://www.brantmessenger.com/)
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    //        example 1: stripslashes('Kevin\'s code')
    //        returns 1: "Kevin's code"
    //        example 2: stripslashes('Kevin\\\'s code')
    //        returns 2: "Kevin\'s code"

    public static stripslashes (str) {
        return (str + '')
            .replace(/\\(.?)/g, function (s, n1) {
                switch (n1) {
                    case '\\':
                        return '\\'
                    case '0':
                        return '\u0000'
                    case '':
                        return ''
                    default:
                        return n1
                }
            })
    }


    /**
     *
     * Get the value of an input
     *
     *
     * @param input
     * @returns any
     */
    public static getInputValue(input : any)
    {

        if(typeof input.val != 'function'){
            return false;
        }


        if(input.is(':checkbox')){
            return input.is(':checked');
        }else{
            return input.val();
        }
    }



    /**
     *
     * Return all the properties of an input
     *
     * @param elem
     */
    public static getInputProperties(elem : any) : {attr,id,prop,name}
    {

        let name = elem.attr('name');

        let data = name.split('[');

        return {
            attr : data[0].replace(']',''),
            id : data[1].replace(']',''),
            prop : data[2] ? data[2].replace(']','') : '',
            name : data[3] ? data[3].replace(']','') : '',
        };
    }


    /**
     *
     * @since 1.1.0
     *
     * @event : Click on minify button : hide the options of the field
     *
     * @returns {boolean}
     * @private
     */
    public close() : boolean
    {
        this.optionsElement.hide(200);
        this.element.find('.minify')
            .removeClass('minify')
            .addClass('open')
            .html('+');

        return false;
    }


    /**
     *
     * @since 1.1.0
     *
     * Open a field
     *
     * @event : Click on open button, show the field options
     *
     * @returns {boolean}
     * @private
     */
    public open() : boolean
    {
        this.optionsElement.show(200);
        this.element.find('.open')
            .removeClass('open')
            .addClass('minify')
            .html('-');

        return false;
    }


    /**
     *
     * Return the value of all the inputs in the field
     *
     */
    get value(): any {

        let value = {
            dirty : this.dirty,
        };

        this.element.find('[name^="field"]').each((key : number,input : any) => {

            let prop = EF_Input.getInputProperties($(input));
            let val = EF_Input.getInputValue($(input));

            if(prop.prop && !value[prop.prop] && prop.name){
                value[prop.prop] = {};
            }

            if(value[prop.prop]) {
                value[prop.prop][prop.name] = val;
            }else {
                value[prop.prop] = val;
            }

        });

        return value;

    }



    public get name()
    {
        return this.value.attributes.name;
    }


    /**
     *
     * @param name
     */
    public set name(name : string)
    {
        this.value.attributes.name = name;
    }

}