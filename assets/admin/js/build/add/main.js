System.register("inputs/EF_Input", [], function(exports_1, context_1) {
    "use strict";
    var EF_Input;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function() {
            EF_Input = /** @class */ function() {
                function EF_Input() {
                    this.container = $("#fld");
                }
                /**
                 *
                 * @param $element
                 * @param $data
                 * @param id
                 * @param position : number
                 */
                EF_Input.prototype.init = function($element, id, $data, position) {
                    if (position === void 0) {
                        position = null;
                    }
                    this.id = id;
                    $element = $element.replace(/fieldId/g, id);
                    this.element = $($element);
                    this.optionsElement = this.element.find(".ef-table");
                    if (null === position) {
                        this.container.append(this.element);
                    } else {
                        this.container.find("#field-" + position).replaceWith(this.element);
                    }
                    this.setEvents();
                    this.addData($data);
                };
                EF_Input.prototype.setEvents = function() {
                    var _this = this;
                    this.element.find('[data-action="open-close"]').on("click", function() {
                        return _this.toggle();
                    });
                };
                /**
                 * Close the element
                 */
                EF_Input.prototype.toggle = function() {
                    var elem = this.element.find('[data-action="open-close"]');
                    if ($(elem).hasClass("minify")) {
                        return this.close();
                    } else {
                        return this.open();
                    }
                };
                /**
                 * Insert the data in the template
                 *
                 * @param $data
                 */
                EF_Input.prototype.addData = function($data) {
                    EF_Input.addDataToElement(this.element, $data);
                };
                /**
                 *
                 * @param $element
                 * @param $data
                 */
                EF_Input.addDataToElement = function($element, $data) {
                    $element.find('[name^="field"]').each(function(key, elem) {
                        var prop = EF_Input.getInputProperties($(elem));
                        if ($data[prop.prop] && $data[prop.prop][prop.name]) {
                            EF_Input.setInputValue($(elem), $data[prop.prop][prop.name]);
                        }
                    });
                };
                /**
                 *
                 * Add a value to an input
                 *
                 * @param input
                 * @param value
                 */
                EF_Input.setInputValue = function(input, value) {
                    if (input.is(":checkbox")) {
                        if (value == "on") {
                            value = true;
                        }
                        input.prop("checked", value);
                    } else if (input.is("select")) {
                        input.find('option[value="' + value + '"]').prop("selected", true);
                    } else {
                        input.val(value);
                    }
                };
                /**
                 *
                 * Get the value of an input
                 *
                 *
                 * @param input
                 * @returns any
                 */
                EF_Input.getInputValue = function(input) {
                    if (typeof input.val != "function") {
                        return false;
                    }
                    if (input.is(":checkbox")) {
                        return input.is(":checked");
                    } else {
                        return input.val();
                    }
                };
                /**
                 *
                 * Return all the properties of an input
                 *
                 * @param elem
                 */
                EF_Input.getInputProperties = function(elem) {
                    var name = elem.attr("name");
                    var data = name.split("[");
                    return {
                        attr: data[0].replace("]", ""),
                        id: data[1].replace("]", ""),
                        prop: data[2] ? data[2].replace("]", "") : "",
                        name: data[3] ? data[3].replace("]", "") : ""
                    };
                };
                /**
                 *
                 * @since 1.1.0
                 *
                 * @event : Click on minify button : hide the options of the field
                 *
                 * @returns {boolean}
                 * @private
                 */
                EF_Input.prototype.close = function() {
                    this.optionsElement.hide(200);
                    this.element.find(".minify").removeClass("minify").addClass("open").html("+");
                    return false;
                };
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
                EF_Input.prototype.open = function() {
                    this.optionsElement.show(200);
                    this.element.find(".open").removeClass("open").addClass("minify").html("-");
                    return false;
                };
                Object.defineProperty(EF_Input.prototype, "value", {
                    /**
                     *
                     * Return the value of all the inputs in the field
                     *
                     */
                    get: function() {
                        var value = {};
                        this.element.find('[name^="field"]').each(function(key, input) {
                            var prop = EF_Input.getInputProperties($(input));
                            var val = EF_Input.getInputValue($(input));
                            if (prop.prop && !value[prop.prop] && prop.name) {
                                value[prop.prop] = {};
                            }
                            if (value[prop.prop]) {
                                value[prop.prop][prop.name] = val;
                            } else {
                                value[prop.prop] = val;
                            }
                        });
                        return value;
                    },
                    // Void
                    set: function(value) {},
                    enumerable: true,
                    configurable: true
                });
                /**
                 * @var string
                 *
                 * The type of the input
                 */
                EF_Input.type = "text";
                return EF_Input;
            }();
            exports_1("EF_Input", EF_Input);
        }
    };
});

System.register("forms/EF_Form", [ "inputs/EF_Input" ], function(exports_2, context_2) {
    "use strict";
    var EF_Input_1, EF_Form;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [ function(EF_Input_1_1) {
            EF_Input_1 = EF_Input_1_1;
        } ],
        execute: function() {
            EF_Form = /** @class */ function() {
                function EF_Form() {
                    this.container = $("#utilities");
                }
                /**
                 *
                 * @param $element
                 */
                EF_Form.prototype.init = function($element) {
                    this.element = $($element);
                    this.container.html(this.element);
                };
                Object.defineProperty(EF_Form.prototype, "value", {
                    /**
                     *
                     * Return the value of all the inputs in the field
                     *
                     */
                    get: function() {
                        var value = {};
                        this.element.find('[name^="settings"]').each(function(key, input) {
                            var prop = EF_Input_1.EF_Input.getInputProperties($(input));
                            var val = EF_Input_1.EF_Input.getInputValue($(input));
                            if (prop.attr && !value[prop.attr] && prop.id) {
                                value[prop.attr] = {};
                            }
                            if (value[prop.attr]) {
                                value[prop.attr][prop.id] = val;
                            } else {
                                value[prop.attr] = val;
                            }
                        });
                        return value;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * @var string
                 *
                 * The type of the input
                 */
                EF_Form.type = "text";
                return EF_Form;
            }();
            exports_2("EF_Form", EF_Form);
        }
    };
});

System.register("EF_Add", [ "forms/EF_Form", "inputs/EF_Input" ], function(exports_3, context_3) {
    "use strict";
    var EF_Form_1, EF_Input_2, EF_Add, EF_add;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [ function(EF_Form_1_1) {
            EF_Form_1 = EF_Form_1_1;
        }, function(EF_Input_2_1) {
            EF_Input_2 = EF_Input_2_1;
        } ],
        execute: function() {
            EF_Add = /** @class */ function() {
                function EF_Add() {
                    /**
                     *An object of all the input templates cached to avoid latency
                     */
                    this.templates = {};
                    /**
                     * Array of all the inputs available on the page
                     */
                    this.inputs = [];
                    /**
                     * All the available inputs
                     */
                    this.availableInputs = {};
                    /**
                     * All the available inputs
                     */
                    this.availableForms = {};
                    /**
                     * If the editor is init
                     */
                    this.is_init = false;
                    this.$body = $("body");
                }
                EF_Add.prototype.init = function() {
                    this.setEvents();
                    this.load().then(function(data) {});
                };
                EF_Add.prototype.setEvents = function() {
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
                    var _this = this;
                    // Add a new field
                    this.$body.on("click", 'button[data-action="add"]', function() {
                        _this.addInput("text", {}).then(function() {
                            EF_Add.loading(false, "fields");
                        });
                    });
                    this.$body.on("change", 'select[name$="[attributes][type]"]', function($event) {
                        var type = $($event.target).val();
                        var prop = EF_Input_2.EF_Input.getInputProperties($($event.target));
                        _this.changeInput(type, _this.inputs[prop.id], prop.id);
                    });
                    this.$body.on("change", 'select[name="settings[type]"]', function($event) {
                        var type = $(event.target).val();
                        _this.changeFormType(type);
                    });
                };
                /**
                 *
                 * Change the type of input
                 *
                 * @param type
                 * @param $input
                 * @param $position
                 */
                EF_Add.prototype.changeInput = function(type, $input, $position) {
                    if ($position === void 0) {
                        $position = null;
                    }
                    var value = $input.value;
                    this.addInput(type, value, $position).then(function(input) {
                        EF_Add.loading(false, "fields");
                        input.open();
                    });
                };
                /**
                 * Add an input to the editor
                 */
                EF_Add.prototype.addInput = function(type, $data, position) {
                    var _this = this;
                    if (type === void 0) {
                        type = "text";
                    }
                    if (position === void 0) {
                        position = null;
                    }
                    // Create a promise
                    var dfd = new $.Deferred();
                    EF_Add.loading(true, "fields");
                    // Close all the inputs
                    $.each(this.inputs, function(key, input) {
                        input.close();
                    });
                    this.getInput(type).then(function(data) {
                        var input;
                        input = _this.generateInput(type);
                        input.init(data, position ? position : _this.inputs.length, $data, position);
                        if (position) {
                            _this.inputs[position] = input;
                        } else {
                            _this.inputs.push(input);
                        }
                        dfd.resolve(input);
                    });
                    // Return a promise
                    return dfd.promise();
                };
                /**
                 *
                 * Show or hide the loadings
                 *
                 * @param loading
                 * @param $element
                 */
                EF_Add.loading = function(loading, $element) {
                    // Show the spinner
                    if (loading === void 0) {
                        loading = true;
                    }
                    if ($element === void 0) {
                        $element = null;
                    }
                    switch ($element) {
                      case "fields":
                        $("#spinner-fields").toggle(loading);
                        break;

                      case "utility":
                        $("#spinner-utility").toggle(loading);
                        break;

                      default:
                        $("#spinner-utility").toggle(loading);
                        $("#spinner-fields").toggle(loading);
                        break;
                    }
                };
                /**
                 * Load the form data from the back office
                 */
                EF_Add.prototype.load = function() {
                    var _this = this;
                    // Create a promise
                    var dfd = new $.Deferred();
                    $.getJSON(ajaxUrl, {
                        form_id: EF_Add.getParameter("post"),
                        action: "EF/load_form_data"
                    }).success(function(data) {
                        // Add the data for all the form
                        _this.addData(data.data.form);
                        _this.addFormData(data.data.form);
                        $.each(data.data.inputs, function(type, input) {
                            _this.availableInputs[type] = input;
                        });
                        $.each(data.data.forms, function(type, input) {
                            _this.availableForms[type] = input;
                        });
                        // Add the submit data
                        if (data.data.form.inputs.submit) {
                            var submit = data.data.form.inputs.submit;
                            delete data.data.form.inputs.submit;
                            _this.addSubmitData(submit);
                        }
                        // Load all the inputs
                        _this.loadInputs(data.data.form.inputs, 0);
                        // I send back the data
                        dfd.resolve(data);
                    }).error(this.handleError);
                    // Return a promise
                    return dfd.promise();
                };
                /**
                 * Add the data inside the form itself
                 *
                 * @param $formData
                 */
                EF_Add.prototype.addData = function($formData) {
                    var _this = this;
                    $("#ef-add-main-info").find('[name^="settings"]').each(function(key, elem) {
                        _this.fillInfos($(elem), $formData);
                    });
                    $("#ef-add-main-info").find('[name^="attributes"]').each(function(key, elem) {
                        _this.fillInfos($(elem), $formData);
                    });
                };
                /**
                 *
                 * @param type
                 */
                EF_Add.prototype.changeFormType = function(type) {
                    EF_Add.loading(true, "utility");
                    var $formData = this.formType.value;
                    $formData.type = type;
                    this.addFormData($formData);
                };
                /**
                 *
                 * Add the form data in the form type
                 *
                 * @param $formData
                 */
                EF_Add.prototype.addFormData = function($formData) {
                    var _this = this;
                    this.loadFormTemplate($formData.type).then(function($template) {
                        _this.formType = _this.generateForm($formData.type);
                        _this.formType.init($template);
                        $("#ef-add-type").find('[name^="settings"]').each(function(key, elem) {
                            _this.fillInfos($(elem), $formData);
                        });
                        EF_Add.loading(false, "utility");
                        _this.addRequiredFields($formData.type);
                    });
                };
                /**
                 *
                 * @param type
                 */
                EF_Add.prototype.addRequiredFields = function(type) {
                    var required = this.availableForms[type].required;
                    $.each(this.inputs, function(key, input) {
                        var index = $.inArray(input.value.attributes.name, required);
                        if (index != -1) {
                            required.splice(index, 1);
                        }
                    });
                    var inputs = [];
                    $.each(required, function(key, input) {
                        inputs.push({
                            attributes: {
                                type: "text",
                                name: input
                            }
                        });
                    });
                    if (inputs && inputs.length > 0) {
                        this.loadInputs(inputs, 0).then(function() {
                            EF_Add.success = "The fields " + required.join(", ") + " have been added to the form";
                        });
                    }
                };
                /**
                 *
                 * @param type
                 */
                EF_Add.prototype.loadFormTemplate = function(type) {
                    var _this = this;
                    // Create a promise
                    var dfd = new $.Deferred();
                    var key = "form-" + type;
                    if (this.templates[key] && this.templates[key] != undefined && this.templates[key] != "") {
                        dfd.resolve(this.templates[key]);
                    } else {
                        $.get(ajaxUrl, {
                            element: "actions",
                            template: type,
                            action: "EF/load_template"
                        }).success(function(data) {
                            _this.templates[key] = data.data;
                            // I send back the data
                            dfd.resolve(data.data);
                        }).error(this.handleError);
                    }
                    // Return a promise
                    return dfd.promise();
                };
                EF_Add.prototype.fillInfos = function($elem, $form) {
                    var prop = EF_Input_2.EF_Input.getInputProperties($elem);
                    if ($form[prop.attr] && $form[prop.attr][prop.id]) {
                        EF_Input_2.EF_Input.setInputValue($elem, $form[prop.attr][prop.id]);
                    }
                };
                /**
                 *
                 * Add the data inside the submit button
                 *
                 * @param submit
                 */
                EF_Add.prototype.addSubmitData = function(submit) {
                    EF_Input_2.EF_Input.addDataToElement(this.$body.find("#ef-add-submit"), submit);
                };
                /**
                 *
                 * Load all the inputs from the list
                 *
                 * @param inputs
                 * @param dfd
                 * @param order
                 */
                EF_Add.prototype.loadInputs = function(inputs, order, dfd) {
                    var _this = this;
                    if (dfd === void 0) {
                        dfd = null;
                    }
                    if (!dfd) {
                        dfd = new $.Deferred();
                    }
                    var keys = Object.keys(inputs);
                    var key = keys[order];
                    if (!key || !inputs || !inputs[key]) {
                        this.is_init = true;
                        EF_Add.loading(false, "fields");
                        dfd.resolve();
                        return;
                    } else {
                        this.addInput(inputs[key].attributes.type, inputs[key]).then(function() {
                            order++;
                            _this.loadInputs(inputs, order, dfd);
                        });
                    }
                    return dfd.promise();
                };
                EF_Add.prototype.generateForm = function(type) {
                    var form;
                    if (!this.availableForms[type]) {
                        type = "post";
                    }
                    switch (type) {
                      case "login":
                        form = new EF_Form_1.EF_Form();
                        break;

                      case "post":
                        form = new EF_Form_1.EF_Form();
                        break;
                    }
                    if (!form) {
                        form = new EF_Form_1.EF_Form();
                    }
                    return form;
                };
                /**
                 *
                 * @param type
                 */
                EF_Add.prototype.generateInput = function(type) {
                    var input;
                    if (!this.availableInputs[type]) {
                        type = "text";
                    }
                    switch (type) {
                      default:
                        input = new EF_Input_2.EF_Input();
                    }
                    if (!input) {
                        input = new EF_Input_2.EF_Input();
                    }
                    return input;
                };
                /**
                 *
                 * Load the input template from the BO
                 *
                 * @param type : string
                 * @return {Promise}
                 */
                EF_Add.prototype.getInput = function(type) {
                    var _this = this;
                    if (type === void 0) {
                        type = "text";
                    }
                    // Create a promise
                    var dfd = new $.Deferred();
                    if (this.templates[type] && this.templates[type] != undefined && this.templates[type] != "") {
                        dfd.resolve(this.templates[type]);
                    } else {
                        $.get(ajaxUrl, {
                            element: "inputs",
                            template: type,
                            action: "EF/load_template"
                        }).success(function(data) {
                            _this.templates[type] = data.data;
                            // I send back the data
                            dfd.resolve(data.data);
                        }).error(this.handleError);
                    }
                    // Return a promise
                    return dfd.promise();
                };
                /**
                 * Handle the HTTP Errors
                 *
                 * @TODO
                 */
                EF_Add.prototype.handleError = function(data) {
                    var error;
                    if (typeof data != "string") {
                        error = data.responseJSON.error;
                    }
                    EF_Add.error = error;
                    EF_Add.loading(false);
                };
                /**
                 *
                 * Get the url parameter
                 *
                 * @param parameter
                 * @returns {any}
                 */
                EF_Add.getParameter = function(parameter) {
                    var params_string = window.location.search.substr(1);
                    var params_array = params_string.split("&");
                    var obj = {};
                    for (var i = 0; i < params_array.length; i++) {
                        var e = params_array[i].split("=");
                        obj[e[0]] = e[1];
                    }
                    return obj[parameter];
                };
                Object.defineProperty(EF_Add, "error", {
                    /**
                     * Display an error message that will fade out in 5 sec
                     *
                     * @param errorMessage
                     */
                    set: function(errorMessage) {
                        EF_Add.setMessage("#error-message", errorMessage, false);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(EF_Add, "success", {
                    /**
                     *
                     * Display a success message that will fade out in 5 sec
                     *
                     * @param successMessage
                     */
                    set: function(successMessage) {
                        EF_Add.setMessage("#success-message", successMessage, false);
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 *
                 * @param element
                 * @param message
                 * @param persist : boolean, Weither or not the message should be displayed or not
                 */
                EF_Add.setMessage = function(element, message, persist) {
                    var _this = this;
                    if (persist === void 0) {
                        persist = false;
                    }
                    if (message) {
                        $(element).text(message).fadeIn(200);
                        if (!persist) {
                            // Make sure that persist is not equal to false
                            if (typeof persist === "boolean") {
                                persist = 5e3;
                            }
                            setTimeout(function() {
                                _this.setMessage(element, "");
                            }, persist);
                        }
                    } else {
                        $(element).fadeOut(200, function() {
                            $(element).text("");
                        });
                    }
                };
                return EF_Add;
            }();
            EF_add = new EF_Add();
            EF_add.init();
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2lucHV0cy9FRl9JbnB1dC50cyIsImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2Zvcm1zL0VGX0Zvcm0udHMiLCJhc3NldHMvYWRtaW4vanMvc3JjL2FkZC9FRl9BZGQudHMiXSwibmFtZXMiOlsiRUZfSW5wdXQiLCJ0aGlzIiwiY29udGFpbmVyIiwiJCIsInByb3RvdHlwZSIsImluaXQiLCIkZWxlbWVudCIsImlkIiwiJGRhdGEiLCJwb3NpdGlvbiIsInJlcGxhY2UiLCJlbGVtZW50Iiwib3B0aW9uc0VsZW1lbnQiLCJmaW5kIiwiYXBwZW5kIiwicmVwbGFjZVdpdGgiLCJzZXRFdmVudHMiLCJhZGREYXRhIiwiX3RoaXMiLCJvbiIsInRvZ2dsZSIsImVsZW0iLCJoYXNDbGFzcyIsImNsb3NlIiwib3BlbiIsImFkZERhdGFUb0VsZW1lbnQiLCJlYWNoIiwia2V5IiwicHJvcCIsImdldElucHV0UHJvcGVydGllcyIsIm5hbWUiLCJzZXRJbnB1dFZhbHVlIiwiaW5wdXQiLCJ2YWx1ZSIsImlzIiwidmFsIiwiZ2V0SW5wdXRWYWx1ZSIsImF0dHIiLCJkYXRhIiwic3BsaXQiLCJoaWRlIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImh0bWwiLCJzaG93IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJ0eXBlIiwiRUZfRm9ybSIsIkVGX0lucHV0XzEiLCJFRl9BZGQiLCJ0ZW1wbGF0ZXMiLCJpbnB1dHMiLCJhdmFpbGFibGVJbnB1dHMiLCJhdmFpbGFibGVGb3JtcyIsImlzX2luaXQiLCIkYm9keSIsImxvYWQiLCJ0aGVuIiwiYWRkSW5wdXQiLCJsb2FkaW5nIiwiJGV2ZW50IiwidGFyZ2V0IiwiRUZfSW5wdXRfMiIsImNoYW5nZUlucHV0IiwiZXZlbnQiLCJjaGFuZ2VGb3JtVHlwZSIsIiRpbnB1dCIsIiRwb3NpdGlvbiIsImRmZCIsIkRlZmVycmVkIiwiZ2V0SW5wdXQiLCJnZW5lcmF0ZUlucHV0IiwibGVuZ3RoIiwicHVzaCIsInJlc29sdmUiLCJwcm9taXNlIiwiZ2V0SlNPTiIsImFqYXhVcmwiLCJmb3JtX2lkIiwiZ2V0UGFyYW1ldGVyIiwiYWN0aW9uIiwic3VjY2VzcyIsImZvcm0iLCJhZGRGb3JtRGF0YSIsImZvcm1zIiwic3VibWl0IiwiYWRkU3VibWl0RGF0YSIsImxvYWRJbnB1dHMiLCJlcnJvciIsImhhbmRsZUVycm9yIiwiJGZvcm1EYXRhIiwiZmlsbEluZm9zIiwiZm9ybVR5cGUiLCJsb2FkRm9ybVRlbXBsYXRlIiwiJHRlbXBsYXRlIiwiZ2VuZXJhdGVGb3JtIiwiYWRkUmVxdWlyZWRGaWVsZHMiLCJyZXF1aXJlZCIsImluZGV4IiwiaW5BcnJheSIsImF0dHJpYnV0ZXMiLCJzcGxpY2UiLCJqb2luIiwidW5kZWZpbmVkIiwiZ2V0IiwidGVtcGxhdGUiLCIkZWxlbSIsIiRmb3JtIiwib3JkZXIiLCJrZXlzIiwiRUZfRm9ybV8xIiwicmVzcG9uc2VKU09OIiwicGFyYW1ldGVyIiwicGFyYW1zX3N0cmluZyIsIndpbmRvdyIsImxvY2F0aW9uIiwic2VhcmNoIiwic3Vic3RyIiwicGFyYW1zX2FycmF5Iiwib2JqIiwiaSIsImUiLCJlcnJvck1lc3NhZ2UiLCJzZXRNZXNzYWdlIiwic3VjY2Vzc01lc3NhZ2UiLCJtZXNzYWdlIiwicGVyc2lzdCIsInRleHQiLCJmYWRlSW4iLCJzZXRUaW1lb3V0IiwiZmFkZU91dCIsIkVGX2FkZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Z0JBMkNJLFNBQUFBO29CQUVJQyxLQUFLQyxZQUFZQyxFQUFFOzs7Ozs7Ozs7Z0JBWWhCSCxTQUFBSSxVQUFBQyxPQUFQLFNBQVlDLFVBQWdCQyxJQUFZQyxPQUFZQztvQkFBQSxJQUFBQSxrQkFBQSxHQUFBO3dCQUFBQSxXQUFBOztvQkFFaERSLEtBQUtNLEtBQUtBO29CQUVWRCxXQUFXQSxTQUFTSSxRQUFRLFlBQVdIO29CQUV2Q04sS0FBS1UsVUFBVVIsRUFBRUc7b0JBQ2pCTCxLQUFLVyxpQkFBaUJYLEtBQUtVLFFBQVFFLEtB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QTBCMkU7d0JBRXRCM0UsT0FBTzBFLFdBQVcsb0JBQW1CQyxnQkFBZTs7Ozs7Ozs7Ozs7Z0JBVTFDM0UsT0FBQTBFLGFBQWQsU0FBeUJqSCxTQUFpQm1ILFNBQTBCQztvQkFBcEUsSUFBQTdHLFFBQUFqQjtvQkFBb0UsSUFBQThILGlCQUFBLEdBQUE7d0JBQUFBLFVBQUE7O29CQUdoRSxJQUFHRCxTQUFTO3dCQUNSM0gsRUFBRVEsU0FBU3FILEtBQUtGLFNBQVNHLE9BQU87d0JBRWhDLEtBQUlGLFNBQVM7OzRCQUdULFdBQVVBLFlBQVksV0FBVztnQ0FDN0JBLFVBQVU7OzRCQUdkRyxXQUFXO2dDQUNQaEgsTUFBSzBHLFdBQVdqSCxTQUFROytCQUMxQm9IOzsyQkFJSjt3QkFDRjVILEVBQUVRLFNBQVN3SCxRQUFRLEtBQUk7NEJBQ25CaEksRUFBRVEsU0FBU3FILEtBQUs7Ozs7Z0JBS2hDLE9BQUE5RTs7WUFFSWtGLFNBQVMsSUFBSWxGO1lBQ2pCa0YsT0FBTy9IIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBFRl9JbnB1dFxue1xuXG4gICAgLyoqXG4gICAgICogQHZhciBzdHJpbmdcbiAgICAgKlxuICAgICAqIFRoZSB0eXBlIG9mIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdHlwZSA6IHN0cmluZyA9ICd0ZXh0JztcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgb2YgdGhlIGlucHV0XG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgZWxlbWVudCA6IGFueTtcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgZm9yIHRoZSBvcHRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgb3B0aW9uc0VsZW1lbnQgOiBhbnk7XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBpZCAocG9zaXRpb24pIG9mIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBpZCA6IG51bWJlcjtcblxuXG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgY29udGFpbmVyXG4gICAgICovXG4gICAgcHVibGljIGNvbnRhaW5lciA6IGFueTtcblxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gJCgnI2ZsZCcpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqIEBwYXJhbSAkZGF0YVxuICAgICAqIEBwYXJhbSBpZFxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiA6IG51bWJlclxuICAgICAqL1xuICAgIHB1YmxpYyBpbml0KCRlbGVtZW50IDogYW55LCBpZCA6IG51bWJlciwkZGF0YSA6IGFueSxwb3NpdGlvbiA6IG51bGx8bnVtYmVyID0gbnVsbClcbiAgICB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcblxuICAgICAgICAkZWxlbWVudCA9ICRlbGVtZW50LnJlcGxhY2UoL2ZpZWxkSWQvZyxpZCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJCgkZWxlbWVudCk7XG4gICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmVmLXRhYmxlJyk7XG5cbiAgICAgICAgaWYobnVsbCA9PT0gcG9zaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5maW5kKCcjZmllbGQtJyArIHBvc2l0aW9uKS5yZXBsYWNlV2l0aCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRFdmVudHMoKTtcblxuICAgICAgICB0aGlzLmFkZERhdGEoJGRhdGEpO1xuICAgIH1cblxuXG5cblxuICAgIHB1YmxpYyBzZXRFdmVudHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJvcGVuLWNsb3NlXCJdJykub24oJ2NsaWNrJywoKSA9PiB7cmV0dXJuIHRoaXMudG9nZ2xlKCl9KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIENsb3NlIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgcHVibGljIHRvZ2dsZSgpOiBib29sZWFuXG4gICAge1xuXG4gICAgICAgIGxldCBlbGVtID0gdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cIm9wZW4tY2xvc2VcIl0nKTtcblxuICAgICAgICBpZigkKGVsZW0pLmhhc0NsYXNzKCdtaW5pZnknKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3BlbigpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEluc2VydCB0aGUgZGF0YSBpbiB0aGUgdGVtcGxhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBhZGREYXRhKCRkYXRhKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIEVGX0lucHV0LmFkZERhdGFUb0VsZW1lbnQodGhpcy5lbGVtZW50LCRkYXRhKVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gJGRhdGFcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFkZERhdGFUb0VsZW1lbnQoJGVsZW1lbnQgOiBhbnksICRkYXRhIDogYW55KSA6IHZvaWRcbiAgICB7XG4gICAgICAgICRlbGVtZW50LmZpbmQoJ1tuYW1lXj1cImZpZWxkXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJChlbGVtKSk7XG5cbiAgICAgICAgICAgIGlmKCRkYXRhW3Byb3AucHJvcF0gJiYgJGRhdGFbcHJvcC5wcm9wXVtwcm9wLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgRUZfSW5wdXQuc2V0SW5wdXRWYWx1ZSgkKGVsZW0pLCRkYXRhW3Byb3AucHJvcF1bcHJvcC5uYW1lXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgYSB2YWx1ZSB0byBhbiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXRJbnB1dFZhbHVlKGlucHV0IDogYW55LCB2YWx1ZSA6IHN0cmluZ3xib29sZWFuKVxuICAgIHtcbiAgICAgICAgaWYoaW5wdXQuaXMoJzpjaGVja2JveCcpKXtcbiAgICAgICAgICAgIGlmKHZhbHVlID09ICdvbicpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnB1dC5wcm9wKCdjaGVja2VkJyx2YWx1ZSk7XG4gICAgICAgIH1lbHNlIGlmKGlucHV0LmlzKCdzZWxlY3QnKSl7XG4gICAgICAgICAgICBpbnB1dC5maW5kKCdvcHRpb25bdmFsdWU9XCInKyB2YWx1ZSArJ1wiXScpLnByb3AoJ3NlbGVjdGVkJyx0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgaW5wdXQudmFsKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBHZXQgdGhlIHZhbHVlIG9mIGFuIGlucHV0XG4gICAgICpcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqIEByZXR1cm5zIGFueVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5wdXRWYWx1ZShpbnB1dCA6IGFueSlcbiAgICB7XG5cbiAgICAgICAgaWYodHlwZW9mIGlucHV0LnZhbCAhPSAnZnVuY3Rpb24nKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYoaW5wdXQuaXMoJzpjaGVja2JveCcpKXtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5pcygnOmNoZWNrZWQnKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQudmFsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gYWxsIHRoZSBwcm9wZXJ0aWVzIG9mIGFuIGlucHV0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5wdXRQcm9wZXJ0aWVzKGVsZW0gOiBhbnkpIDoge2F0dHIsaWQscHJvcCxuYW1lfVxuICAgIHtcblxuICAgICAgICBsZXQgbmFtZSA9IGVsZW0uYXR0cignbmFtZScpO1xuXG4gICAgICAgIGxldCBkYXRhID0gbmFtZS5zcGxpdCgnWycpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhdHRyIDogZGF0YVswXS5yZXBsYWNlKCddJywnJyksXG4gICAgICAgICAgICBpZCA6IGRhdGFbMV0ucmVwbGFjZSgnXScsJycpLFxuICAgICAgICAgICAgcHJvcCA6IGRhdGFbMl0gPyBkYXRhWzJdLnJlcGxhY2UoJ10nLCcnKSA6ICcnLFxuICAgICAgICAgICAgbmFtZSA6IGRhdGFbM10gPyBkYXRhWzNdLnJlcGxhY2UoJ10nLCcnKSA6ICcnLFxuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAc2luY2UgMS4xLjBcbiAgICAgKlxuICAgICAqIEBldmVudCA6IENsaWNrIG9uIG1pbmlmeSBidXR0b24gOiBoaWRlIHRoZSBvcHRpb25zIG9mIHRoZSBmaWVsZFxuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xvc2UoKSA6IGJvb2xlYW5cbiAgICB7XG4gICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQuaGlkZSgyMDApO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLm1pbmlmeScpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ21pbmlmeScpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ29wZW4nKVxuICAgICAgICAgICAgLmh0bWwoJysnKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBzaW5jZSAxLjEuMFxuICAgICAqXG4gICAgICogT3BlbiBhIGZpZWxkXG4gICAgICpcbiAgICAgKiBAZXZlbnQgOiBDbGljayBvbiBvcGVuIGJ1dHRvbiwgc2hvdyB0aGUgZmllbGQgb3B0aW9uc1xuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgb3BlbigpIDogYm9vbGVhblxuICAgIHtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudC5zaG93KDIwMCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcub3BlbicpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ29wZW4nKVxuICAgICAgICAgICAgLmFkZENsYXNzKCdtaW5pZnknKVxuICAgICAgICAgICAgLmh0bWwoJy0nKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJldHVybiB0aGUgdmFsdWUgb2YgYWxsIHRoZSBpbnB1dHMgaW4gdGhlIGZpZWxkXG4gICAgICpcbiAgICAgKi9cbiAgICBnZXQgdmFsdWUoKTogYW55IHtcblxuICAgICAgICBsZXQgdmFsdWUgPSB7fTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW25hbWVePVwiZmllbGRcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsaW5wdXQgOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJChpbnB1dCkpO1xuICAgICAgICAgICAgbGV0IHZhbCA9IEVGX0lucHV0LmdldElucHV0VmFsdWUoJChpbnB1dCkpO1xuXG4gICAgICAgICAgICBpZihwcm9wLnByb3AgJiYgIXZhbHVlW3Byb3AucHJvcF0gJiYgcHJvcC5uYW1lKXtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLnByb3BdID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHZhbHVlW3Byb3AucHJvcF0pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLnByb3BdW3Byb3AubmFtZV0gPSB2YWw7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5wcm9wXSA9IHZhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgIH1cblxuXG4gICAgLy8gVm9pZFxuICAgIHNldCB2YWx1ZSh2YWx1ZSA6IGFueSkgeyB9XG5cbn0iLCJpbXBvcnQge0VGX0lucHV0fSBmcm9tIFwiLi4vaW5wdXRzL0VGX0lucHV0XCI7XG5cbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBFRl9Gb3JtIHtcblxuICAgIC8qKlxuICAgICAqIEB2YXIgc3RyaW5nXG4gICAgICpcbiAgICAgKiBUaGUgdHlwZSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHR5cGU6IHN0cmluZyA9ICd0ZXh0JztcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgb2YgdGhlIGlucHV0XG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgZWxlbWVudDogYW55O1xuXG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgY29udGFpbmVyXG4gICAgICovXG4gICAgcHVibGljIGNvbnRhaW5lciA6IGFueTtcblxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gJCgnI3V0aWxpdGllcycpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdCgkZWxlbWVudCA6IGFueSlcbiAgICB7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJCgkZWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuaHRtbCh0aGlzLmVsZW1lbnQpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gdGhlIHZhbHVlIG9mIGFsbCB0aGUgaW5wdXRzIGluIHRoZSBmaWVsZFxuICAgICAqXG4gICAgICovXG4gICAgZ2V0IHZhbHVlKCk6IGFueSB7XG5cbiAgICAgICAgbGV0IHZhbHVlID0ge307XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tuYW1lXj1cInNldHRpbmdzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGlucHV0IDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoaW5wdXQpKTtcbiAgICAgICAgICAgIGxldCB2YWwgPSBFRl9JbnB1dC5nZXRJbnB1dFZhbHVlKCQoaW5wdXQpKTtcblxuICAgICAgICAgICAgaWYocHJvcC5hdHRyICYmICF2YWx1ZVtwcm9wLmF0dHJdICYmIHByb3AuaWQpe1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AuYXR0cl0gPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodmFsdWVbcHJvcC5hdHRyXSkge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AuYXR0cl1bcHJvcC5pZF0gPSB2YWw7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5hdHRyXSA9IHZhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgIH1cblxuXG5cblxufSIsImltcG9ydCB7RUZfRm9ybX0gZnJvbSBcIi4vZm9ybXMvRUZfRm9ybVwiO1xuXG5kZWNsYXJlIHZhciAkO1xuXG5kZWNsYXJlIHZhciBhamF4VXJsIDogc3RyaW5nO1xuXG5pbXBvcnQge0VGX0lucHV0fSBmcm9tICcuL2lucHV0cy9FRl9JbnB1dCc7XG5cbmNsYXNzIEVGX0FkZFxue1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBCb2R5IG9mIHRoZSBwYWdlXG4gICAgICovXG4gICAgcHVibGljICRib2R5O1xuXG4gICAgLyoqXG4gICAgICpBbiBvYmplY3Qgb2YgYWxsIHRoZSBpbnB1dCB0ZW1wbGF0ZXMgY2FjaGVkIHRvIGF2b2lkIGxhdGVuY3lcbiAgICAgKi9cbiAgICBwdWJsaWMgdGVtcGxhdGVzIDogYW55ID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBhbGwgdGhlIGlucHV0cyBhdmFpbGFibGUgb24gdGhlIHBhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5wdXRzIDogRUZfSW5wdXRbXSA9IFtdO1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGF2YWlsYWJsZSBpbnB1dHNcbiAgICAgKi9cbiAgICBwdWJsaWMgYXZhaWxhYmxlSW5wdXRzIDoge30gPSB7fTtcblxuXG4gICAgLyoqXG4gICAgICogQWxsIHRoZSBhdmFpbGFibGUgaW5wdXRzXG4gICAgICovXG4gICAgcHVibGljIGF2YWlsYWJsZUZvcm1zIDoge30gPSB7fTtcblxuXG4gICAgcHVibGljIGZvcm1UeXBlIDogRUZfRm9ybTtcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBlZGl0b3IgaXMgaW5pdFxuICAgICAqL1xuICAgIHB1YmxpYyBpc19pbml0IDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuJGJvZHkgPSAkKCdib2R5Jyk7XG5cbiAgICB9XG5cblxuICAgIHB1YmxpYyBpbml0KCkge1xuXG4gICAgICAgIHRoaXMuc2V0RXZlbnRzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkKCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgLypcbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5tb3ZlJyxfbW92ZSk7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy51cCcsX3VwKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLmRvd24nLF9kb3duKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLnJlbW92ZW9wdGlvbicsX3JlbW92ZU9wdGlvbik7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5kdXBsaXF1ZXInLF9kdXBsaWNhdGUpOyovXG5cbiAgICAgICAgLy8gQWRkIGEgbmV3IGZpZWxkXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGRcIl0nLCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZElucHV0KCd0ZXh0Jyx7fSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgICAgICB9KSB9KTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NoYW5nZScsJ3NlbGVjdFtuYW1lJD1cIlthdHRyaWJ1dGVzXVt0eXBlXVwiXScsKCRldmVudCA6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSAkKCRldmVudC50YXJnZXQpLnZhbCgpO1xuICAgICAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoJGV2ZW50LnRhcmdldCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlSW5wdXQodHlwZSx0aGlzLmlucHV0c1twcm9wLmlkXSxwcm9wLmlkKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cInNldHRpbmdzW3R5cGVdXCJdJywoJGV2ZW50IDogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9ICQoZXZlbnQudGFyZ2V0KS52YWwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUZvcm1UeXBlKHR5cGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGQtb3B0aW9uXCJdJyxfYWRkT3B0aW9uKTtcblxuXG4gICAgICAgICAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsJ3NlbGVjdFtuYW1lJD1cIltmb3JtLXRheG9ub215XVwiXScsX2NoYW5nZVRheG9ub215KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cImZvcm0tcmVzZXQtYWN0aW9uXCJdJyxfY2hhbmdlUmVzZXRBY3Rpb24pO1xuXG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCcucGFuZWwgaGVhZGVyJyxfdG9nZ2xlUGFuZWwpOyovXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIENoYW5nZSB0aGUgdHlwZSBvZiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKiBAcGFyYW0gJGlucHV0XG4gICAgICogQHBhcmFtICRwb3NpdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBjaGFuZ2VJbnB1dCh0eXBlIDogc3RyaW5nLCRpbnB1dCA6IEVGX0lucHV0LCRwb3NpdGlvbiA6IG51bWJlcnxudWxsID0gbnVsbClcbiAgICB7XG4gICAgICAgIGxldCB2YWx1ZSA9ICRpbnB1dC52YWx1ZTtcblxuICAgICAgICB0aGlzLmFkZElucHV0KHR5cGUsdmFsdWUsJHBvc2l0aW9uKS50aGVuKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ2ZpZWxkcycpO1xuICAgICAgICAgICAgaW5wdXQub3BlbigpO1xuICAgICAgICB9KVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYW4gaW5wdXQgdG8gdGhlIGVkaXRvclxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRJbnB1dCh0eXBlIDogc3RyaW5nID0gJ3RleHQnLCRkYXRhLHBvc2l0aW9uIDogbnVtYmVyfG51bGwgPSBudWxsKSA6IFByb21pc2U8YW55PlxuICAgIHtcblxuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG5cbiAgICAgICAgRUZfQWRkLmxvYWRpbmcodHJ1ZSwnZmllbGRzJyk7XG5cbiAgICAgICAgLy8gQ2xvc2UgYWxsIHRoZSBpbnB1dHNcbiAgICAgICAgJC5lYWNoKHRoaXMuaW5wdXRzLChrZXkgOiBudW1iZXIsIGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgIGlucHV0LmNsb3NlKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5nZXRJbnB1dCh0eXBlKS50aGVuKChkYXRhIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBpbnB1dCA6IEVGX0lucHV0O1xuXG4gICAgICAgICAgICBpbnB1dCA9IHRoaXMuZ2VuZXJhdGVJbnB1dCh0eXBlKTtcblxuICAgICAgICAgICAgaW5wdXQuaW5pdChkYXRhLHBvc2l0aW9uID8gcG9zaXRpb24gOiB0aGlzLmlucHV0cy5sZW5ndGgsJGRhdGEscG9zaXRpb24pO1xuXG4gICAgICAgICAgICBpZihwb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzW3Bvc2l0aW9uXSA9IGlucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5wdXNoKGlucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGZkLnJlc29sdmUoaW5wdXQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTaG93IG9yIGhpZGUgdGhlIGxvYWRpbmdzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbG9hZGluZ1xuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbG9hZGluZyhsb2FkaW5nIDogYm9vbGVhbiA9IHRydWUsJGVsZW1lbnQgOiBudWxsfHN0cmluZyA9IG51bGwpXG4gICAge1xuICAgICAgICAvLyBTaG93IHRoZSBzcGlubmVyXG5cbiAgICAgICAgc3dpdGNoICgkZWxlbWVudCkge1xuICAgICAgICAgICAgY2FzZSAnZmllbGRzJyA6XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItZmllbGRzJykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndXRpbGl0eScgOlxuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLXV0aWxpdHknKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLXV0aWxpdHknKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItZmllbGRzJykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIExvYWQgdGhlIGZvcm0gZGF0YSBmcm9tIHRoZSBiYWNrIG9mZmljZVxuICAgICAqL1xuICAgIHB1YmxpYyBsb2FkKCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgJC5nZXRKU09OKGFqYXhVcmwsIHtcbiAgICAgICAgICAgIGZvcm1faWQgOiBFRl9BZGQuZ2V0UGFyYW1ldGVyKCdwb3N0JyksXG4gICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX2Zvcm1fZGF0YSdcbiAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAvLyBBZGQgdGhlIGRhdGEgZm9yIGFsbCB0aGUgZm9ybVxuICAgICAgICAgICAgdGhpcy5hZGREYXRhKGRhdGEuZGF0YS5mb3JtKTtcbiAgICAgICAgICAgIHRoaXMuYWRkRm9ybURhdGEoZGF0YS5kYXRhLmZvcm0pO1xuXG5cbiAgICAgICAgICAgICQuZWFjaChkYXRhLmRhdGEuaW5wdXRzLCh0eXBlLGlucHV0IDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVJbnB1dHNbdHlwZV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5kYXRhLmZvcm1zLCh0eXBlLGlucHV0IDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVGb3Jtc1t0eXBlXSA9IGlucHV0O1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBzdWJtaXQgZGF0YVxuICAgICAgICAgICAgaWYoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdCkge1xuICAgICAgICAgICAgICAgIGxldCBzdWJtaXQgPSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkU3VibWl0RGF0YShzdWJtaXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMb2FkIGFsbCB0aGUgaW5wdXRzXG4gICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLDApO1xuXG5cblxuICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgZGF0YSBpbnNpZGUgdGhlIGZvcm0gaXRzZWxmXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZERhdGEoJGZvcm1EYXRhIDogYW55KSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbEluZm9zKCQoZWxlbSksJGZvcm1EYXRhKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJhdHRyaWJ1dGVzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNoYW5nZUZvcm1UeXBlKHR5cGUpIDogdm9pZFxuICAgIHtcblxuICAgICAgICBFRl9BZGQubG9hZGluZyh0cnVlLCd1dGlsaXR5Jyk7XG5cbiAgICAgICAgbGV0ICRmb3JtRGF0YSA9IHRoaXMuZm9ybVR5cGUudmFsdWU7XG5cbiAgICAgICAgJGZvcm1EYXRhLnR5cGUgPSB0eXBlO1xuXG4gICAgICAgIHRoaXMuYWRkRm9ybURhdGEoJGZvcm1EYXRhKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgdGhlIGZvcm0gZGF0YSBpbiB0aGUgZm9ybSB0eXBlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZEZvcm1EYXRhKCRmb3JtRGF0YSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIHRoaXMubG9hZEZvcm1UZW1wbGF0ZSgkZm9ybURhdGEudHlwZSkudGhlbigoJHRlbXBsYXRlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1UeXBlID0gdGhpcy5nZW5lcmF0ZUZvcm0oJGZvcm1EYXRhLnR5cGUpO1xuXG4gICAgICAgICAgICB0aGlzLmZvcm1UeXBlLmluaXQoJHRlbXBsYXRlKTtcblxuICAgICAgICAgICAgJCgnI2VmLWFkZC10eXBlJykuZmluZCgnW25hbWVePVwic2V0dGluZ3NcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCd1dGlsaXR5Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuYWRkUmVxdWlyZWRGaWVsZHMoJGZvcm1EYXRhLnR5cGUpO1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRSZXF1aXJlZEZpZWxkcyh0eXBlIDogc3RyaW5nKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCByZXF1aXJlZCA9IHRoaXMuYXZhaWxhYmxlRm9ybXNbdHlwZV0ucmVxdWlyZWQ7XG5cbiAgICAgICAgJC5lYWNoKHRoaXMuaW5wdXRzLChrZXkgOiBzdHJpbmcsIGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9ICQuaW5BcnJheShpbnB1dC52YWx1ZS5hdHRyaWJ1dGVzLm5hbWUscmVxdWlyZWQpO1xuICAgICAgICAgICAgaWYoaW5kZXggIT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXF1aXJlZC5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBpbnB1dHMgPSBbXTtcblxuICAgICAgICAkLmVhY2gocmVxdWlyZWQsKGtleSA6IG51bWJlcixpbnB1dCA6IHN0cmluZykgPT4ge1xuXG4gICAgICAgICAgICBpbnB1dHMucHVzaCh7YXR0cmlidXRlcyA6e3R5cGUgOiAndGV4dCcsbmFtZSA6IGlucHV0fX0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmKGlucHV0cyAmJiBpbnB1dHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cywgMCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgRUZfQWRkLnN1Y2Nlc3MgPSAnVGhlIGZpZWxkcyAnICsgcmVxdWlyZWQuam9pbignLCAnKSArICcgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBmb3JtJztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZEZvcm1UZW1wbGF0ZSh0eXBlIDogc3RyaW5nKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBsZXQga2V5ID0gJ2Zvcm0tJyArIHR5cGU7XG5cbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGVzW2tleV0gJiYgdGhpcy50ZW1wbGF0ZXNba2V5XSAhPSB1bmRlZmluZWQgJiYgdGhpcy50ZW1wbGF0ZXNba2V5XSAhPSAnJykge1xuICAgICAgICAgICAgZGZkLnJlc29sdmUodGhpcy50ZW1wbGF0ZXNba2V5XSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQuZ2V0KGFqYXhVcmwsIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnYWN0aW9ucycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgOiB0eXBlLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ0VGL2xvYWRfdGVtcGxhdGUnXG4gICAgICAgICAgICB9KS5zdWNjZXNzKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlc1trZXldID0gZGF0YS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhLmRhdGEpO1xuICAgICAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuICAgIH1cblxuXG4gICAgcHVibGljIGZpbGxJbmZvcygkZWxlbSwkZm9ybSkgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkZWxlbSk7XG5cbiAgICAgICAgaWYoJGZvcm1bcHJvcC5hdHRyXSAmJiAkZm9ybVtwcm9wLmF0dHJdW3Byb3AuaWRdKSB7XG5cbiAgICAgICAgICAgIEVGX0lucHV0LnNldElucHV0VmFsdWUoJGVsZW0sJGZvcm1bcHJvcC5hdHRyXVtwcm9wLmlkXSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQWRkIHRoZSBkYXRhIGluc2lkZSB0aGUgc3VibWl0IGJ1dHRvblxuICAgICAqXG4gICAgICogQHBhcmFtIHN1Ym1pdFxuICAgICAqL1xuICAgIHByaXZhdGUgYWRkU3VibWl0RGF0YShzdWJtaXQpIDogdm9pZFxuICAgIHtcbiAgICAgICAgRUZfSW5wdXQuYWRkRGF0YVRvRWxlbWVudCh0aGlzLiRib2R5LmZpbmQoJyNlZi1hZGQtc3VibWl0Jyksc3VibWl0KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogTG9hZCBhbGwgdGhlIGlucHV0cyBmcm9tIHRoZSBsaXN0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRzXG4gICAgICogQHBhcmFtIGRmZFxuICAgICAqIEBwYXJhbSBvcmRlclxuICAgICAqL1xuICAgIHByaXZhdGUgbG9hZElucHV0cyhpbnB1dHMgOiB7IGF0dHJpYnV0ZXMgOiB7dHlwZSA6IHN0cmluZyB9fVtdLG9yZGVyIDogbnVtYmVyLGRmZCAgOiBhbnkgPSBudWxsKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgaWYoIWRmZCkge1xuICAgICAgICAgICAgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoaW5wdXRzKTtcblxuICAgICAgICBsZXQga2V5ID0ga2V5c1tvcmRlcl07XG5cbiAgICAgICAgaWYoIWtleSB8fCAhaW5wdXRzIHx8ICFpbnB1dHNba2V5XSl7XG4gICAgICAgICAgICB0aGlzLmlzX2luaXQgPSB0cnVlO1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ2ZpZWxkcycpO1xuICAgICAgICAgICAgZGZkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmFkZElucHV0KGlucHV0c1trZXldLmF0dHJpYnV0ZXMudHlwZSxpbnB1dHNba2V5XSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgb3JkZXIrKztcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoaW5wdXRzLG9yZGVyLGRmZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuXG4gICAgcHVibGljIGdlbmVyYXRlRm9ybSh0eXBlIDogc3RyaW5nKSA6IEVGX0Zvcm1cbiAgICB7XG4gICAgICAgIGxldCBmb3JtO1xuXG4gICAgICAgIGlmKCF0aGlzLmF2YWlsYWJsZUZvcm1zW3R5cGVdKSB7XG4gICAgICAgICAgICB0eXBlID0gJ3Bvc3QnO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdsb2dpbicgOlxuICAgICAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncG9zdCcgOlxuICAgICAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFmb3JtKSB7XG4gICAgICAgICAgICBmb3JtID0gbmV3IEVGX0Zvcm0oKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcmV0dXJuIGZvcm07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHVibGljIGdlbmVyYXRlSW5wdXQodHlwZSA6IHN0cmluZykgOiBFRl9JbnB1dFxuICAgIHtcbiAgICAgICAgbGV0IGlucHV0O1xuXG4gICAgICAgIGlmKCF0aGlzLmF2YWlsYWJsZUlucHV0c1t0eXBlXSkge1xuICAgICAgICAgICAgdHlwZSA9ICd0ZXh0JztcbiAgICAgICAgfVxuXG5cbiAgICAgICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgICAgICAgIGlucHV0ID0gbmV3IEVGX0lucHV0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZighaW5wdXQpIHtcbiAgICAgICAgICAgIGlucHV0ID0gbmV3IEVGX0lucHV0KCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiBpbnB1dDtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBMb2FkIHRoZSBpbnB1dCB0ZW1wbGF0ZSBmcm9tIHRoZSBCT1xuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGUgOiBzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRJbnB1dCh0eXBlIDogc3RyaW5nID0gJ3RleHQnKVxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXNbdHlwZV0gJiYgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gIT0gdW5kZWZpbmVkICYmIHRoaXMudGVtcGxhdGVzW3R5cGVdICE9ICcnKSB7XG4gICAgICAgICAgICBkZmQucmVzb2x2ZSh0aGlzLnRlbXBsYXRlc1t0eXBlXSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQuZ2V0KGFqYXhVcmwsIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnaW5wdXRzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA6IHR5cGUsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF90ZW1wbGF0ZSdcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW3R5cGVdID0gZGF0YS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhLmRhdGEpO1xuICAgICAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIEhUVFAgRXJyb3JzXG4gICAgICpcbiAgICAgKiBAVE9ET1xuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVFcnJvcihkYXRhIDogc3RyaW5nfHtyZXNwb25zZUpTT04gOiB7ZXJyb3J9fSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIGxldCBlcnJvciA6IHN0cmluZztcblxuICAgICAgICBpZih0eXBlb2YgZGF0YSAhPSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBlcnJvciA9IGRhdGEucmVzcG9uc2VKU09OLmVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgRUZfQWRkLmVycm9yID0gZXJyb3I7XG4gICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlKTtcblxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEdldCB0aGUgdXJsIHBhcmFtZXRlclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtZXRlclxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRQYXJhbWV0ZXIocGFyYW1ldGVyIDogc3RyaW5nKTphbnlcbiAgICB7XG4gICAgICAgIHZhciBwYXJhbXNfc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSk7XG5cbiAgICAgICAgdmFyIHBhcmFtc19hcnJheSA9IHBhcmFtc19zdHJpbmcuc3BsaXQoJyYnKTtcblxuICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgIGZvcih2YXIgaSA9MDtpPHBhcmFtc19hcnJheS5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZSA9IHBhcmFtc19hcnJheVtpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgb2JqW2VbMF1dID0gZVsxXVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9ialtwYXJhbWV0ZXJdO1xuICAgIH1cblxuXG5cblxuICAgIC8qKlxuICAgICAqIERpc3BsYXkgYW4gZXJyb3IgbWVzc2FnZSB0aGF0IHdpbGwgZmFkZSBvdXQgaW4gNSBzZWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCBlcnJvcihlcnJvck1lc3NhZ2UgOiBzdHJpbmd8Ym9vbGVhbikge1xuXG4gICAgICAgIEVGX0FkZC5zZXRNZXNzYWdlKCcjZXJyb3ItbWVzc2FnZScsZXJyb3JNZXNzYWdlLGZhbHNlKTtcblxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIERpc3BsYXkgYSBzdWNjZXNzIG1lc3NhZ2UgdGhhdCB3aWxsIGZhZGUgb3V0IGluIDUgc2VjXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3VjY2Vzc01lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCBzdWNjZXNzKHN1Y2Nlc3NNZXNzYWdlOiBzdHJpbmd8Ym9vbGVhbikge1xuXG4gICAgICAgIEVGX0FkZC5zZXRNZXNzYWdlKCcjc3VjY2Vzcy1tZXNzYWdlJyxzdWNjZXNzTWVzc2FnZSxmYWxzZSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0gcGVyc2lzdCA6IGJvb2xlYW4sIFdlaXRoZXIgb3Igbm90IHRoZSBtZXNzYWdlIHNob3VsZCBiZSBkaXNwbGF5ZWQgb3Igbm90XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXRNZXNzYWdlKGVsZW1lbnQgOiBzdHJpbmcsbWVzc2FnZSA6IHN0cmluZ3xib29sZWFuLCBwZXJzaXN0IDogYm9vbGVhbnxudW1iZXIgPSBmYWxzZSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIGlmKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkudGV4dChtZXNzYWdlKS5mYWRlSW4oMjAwKTtcblxuICAgICAgICAgICAgaWYoIXBlcnNpc3QpIHtcblxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHBlcnNpc3QgaXMgbm90IGVxdWFsIHRvIGZhbHNlXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHBlcnNpc3QgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcnNpc3QgPSA1MDAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1lc3NhZ2UoZWxlbWVudCwnJyk7XG4gICAgICAgICAgICAgICAgfSxwZXJzaXN0KTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkuZmFkZU91dCgyMDAsKCkgPT4ge1xuICAgICAgICAgICAgICAgICQoZWxlbWVudCkudGV4dCgnJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG52YXIgRUZfYWRkID0gbmV3IEVGX0FkZCgpO1xuRUZfYWRkLmluaXQoKTsiXX0=
