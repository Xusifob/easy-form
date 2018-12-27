
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

    public constructor() {

        this.container = $('#fld');

    }


    /**
     *
     * @param $element
     * @param $data
     * @param id
     */
    public init($element : any, id : number,$data : any)
    {
        this.id = id;

        $element = $element.replace(/fieldId/g,id);

        this.element = $($element);
        this.optionsElement = this.element.find('.ef-table');

        this.container.append(this.element);

        this.setEvents();

        this.addData($data);
    }




    public setEvents() : void
    {
        this.element.find('[data-action="open-close"]').on('click',() => {return this.toggle()});
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
            if(value == 'on') {
                value = true;
            }
            input.prop('checked',value);
        }else if(input.is('select')){
            input.find('option[value="'+ value +'"]').prop('selected',true);
        }
        else{
            input.val(value);
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

}