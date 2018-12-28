import {EF_Input} from "../inputs/EF_Input";

declare var $ : any;

export class EF_Form {

    /**
     * @var string
     *
     * The type of the input
     */
    public static type: string = 'text';


    /**
     * @var HTML Element
     *
     * The html element of the input
     *
     */
    public element: any;

    /**
     * The HTML element of the container
     */
    public container : any;


    public constructor() {

        this.container = $('#utilities');

    }

    /**
     *
     * @param $element
     */
    public init($element : any)
    {

        this.element = $($element);

        this.container.html(this.element);
    }


    /**
     *
     * Return the value of all the inputs in the field
     *
     */
    get value(): any {

        let value = {};

        this.element.find('[name^="settings"]').each((key : number,input : any) => {

            let prop = EF_Input.getInputProperties($(input));
            let val = EF_Input.getInputValue($(input));

            if(prop.attr && !value[prop.attr] && prop.id){
                value[prop.attr] = {};
            }

            if(value[prop.attr]) {
                value[prop.attr][prop.id] = val;
            }else {
                value[prop.attr] = val;
            }

        });


        return value;

    }




}