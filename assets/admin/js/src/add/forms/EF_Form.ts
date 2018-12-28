
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
     * @param $data
     */
    public init($element : any, $data : any)
    {

        this.element = $($element);

        console.log(this.container);
        console.log(this.element);

        this.container.html(this.element);

        this.addData($data);
    }


    /**
     *
     * @param $data
     */
    public addData($data : any)
    {

    }

}