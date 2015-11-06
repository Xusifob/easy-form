// All inputs available
var inputs = [
    'text', 'email', 'password','repeatPassword', 'number', 'tel', 'date', 'checkbox', 'radio', 'url', 'range', 'color', 'search', 'hidden','textarea'
];


// All empty inputs with theirs attributs
function getInput(args) {
    var emptyInputs = {
        input: {
            args: {
                autocomplete: true,
                'class': '',
                id: '',
                label: '',
                labelAfter: false,
                labelClass: '',
                placeholder: '',
                readOnly: false,
                required: true,
                value: ''
            },
            id: args.id,
            name: args.name,
            type: args.type
        },
        select: {
            args: {
                autocomplete: false,
                'class': "",
                id: "",
                label: "",
                labelAfter: false,
                labelClass: "",
                orderBy: "default",
                placeholder: null,
                readOnly: false,
                required: true,
                value: null,
                // All options of the select
                options: [
                    {
                        content: "",
                        select: true,
                        value: ""
                    }
                ]
            },
            id: args.id,
            name: args.name,
            type: args.type
        },
        taxonomy : {
            args: {
                autocomplete: true,
                class: "",
                emptyField: "",
                id: "",
                label: "",
                labelAfter: false,
                labelClass: "",
                readOnly: false,
                required: true,
                taxonomy: "",
                taxonomyType: "select",
                value: ""
            },
            id: args.id,
            name: args.name,
            type: args.type
        },
        file : {
            args: {
                acfField: "",
                allowed: [
                    "png",
                    "jpg",
                    "jpeg",
                    "gif"
                ],
                class: "",
                id: "",
                label: "",
                labelAfter: false,
                labelClass: "",
                maxSize: "",
                multiple: false,
                required: false
            },
            id: args.id,
            name: args.name,
            type: args.type
        }
    };

    if($.inArray(args.type,inputs) != -1)
        return emptyInputs.input;
    else
        return emptyInputs[args.type];
}
