// All inputs available
var inputs = [
    'text', 'email', 'password','repeatPassword', 'number', 'tel', 'date', 'checkbox', 'radio', 'url', 'range', 'color', 'search', 'hidden','textarea','wp_editor'
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
                value: '',
                statsSelected : false,
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
                statsSelected : false,
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
                statsSelected : false,
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
                required: false,
                statsSelected : false,
            },
            id: args.id,
            name: args.name,
            type: args.type
        },
        open_container : {
            args: {

                class: "",
                id: "",
            },
            id: args.id,
            name: args.name,
            type: args.type
        },
        close_container : {
            args: {

                class: "",
                id: "",
            },
            id: args.id,
            name: args.name,
            type: args.type
        },
        close_all_container : {
            args: {

                class: "",
                id: "",
            },
            id: args.id,
            name: args.name,
            type: args.type
        },
    };

    if($.inArray(args.type,inputs) != -1)
        return emptyInputs.input;
    else
        return emptyInputs[args.type];
}
