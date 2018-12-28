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
                    this.element.find('[data-action="duplicate"]').on("click", function() {
                        _this.onDuplicate(_this);
                        return false;
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
                 * @param input
                 */
                EF_Add.prototype.onDuplicate = function(input) {
                    this.addInput(input.value.attributes.type, input.value).then(function() {
                        EF_Add.success = "Them input has been duplicated";
                        EF_Add.loading(false);
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
                        input.onDuplicate = function(input) {
                            _this.onDuplicate(input);
                        };
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2lucHV0cy9FRl9JbnB1dC50cyIsImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2Zvcm1zL0VGX0Zvcm0udHMiLCJhc3NldHMvYWRtaW4vanMvc3JjL2FkZC9FRl9BZGQudHMiXSwibmFtZXMiOlsiRUZfSW5wdXQiLCJ0aGlzIiwiY29udGFpbmVyIiwiJCIsInByb3RvdHlwZSIsImluaXQiLCIkZWxlbWVudCIsImlkIiwiJGRhdGEiLCJwb3NpdGlvbiIsInJlcGxhY2UiLCJlbGVtZW50Iiwib3B0aW9uc0VsZW1lbnQiLCJmaW5kIiwiYXBwZW5kIiwicmVwbGFjZVdpdGgiLCJzZXRFdmVudHMiLCJhZGREYXRhIiwiX3RoaXMiLCJvbiIsInRvZ2dsZSIsIm9uRHVwbGljYXRlIiwiZWxlbSIsImhhc0NsYXNzIiwiY2xvc2UiLCJvcGVuIiwiYWRkRGF0YVRvRWxlbWVudCIsImVhY2giLCJrZXkiLCJwcm9wIiwiZ2V0SW5wdXRQcm9wZXJ0aWVzIiwibmFtZSIsInNldElucHV0VmFsdWUiLCJpbnB1dCIsInZhbHVlIiwiaXMiLCJ2YWwiLCJnZXRJbnB1dFZhbHVlIiwiYXR0ciIsImRhdGEiLCJzcGxpdCIsImhpZGUiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiaHRtbCIsInNob3ciLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInR5cGUiLCJFRl9Gb3JtIiwiRUZfSW5wdXRfMSIsIkVGX0FkZCIsInRlbXBsYXRlcyIsImlucHV0cyIsImF2YWlsYWJsZUlucHV0cyIsImF2YWlsYWJsZUZvcm1zIiwiaXNfaW5pdCIsIiRib2R5IiwibG9hZCIsInRoZW4iLCJhZGRJbnB1dCIsImxvYWRpbmciLCIkZXZlbnQiLCJ0YXJnZXQiLCJFRl9JbnB1dF8yIiwiY2hhbmdlSW5wdXQiLCJldmVudCIsImNoYW5nZUZvcm1UeXBlIiwiYXR0cmlidXRlcyIsInN1Y2Nlc3MiLCIkaW5wdXQiLCIkcG9zaXRpb24iLCJkZmQiLCJEZWZlcnJlZCIsImdldElucHV0IiwiZ2VuZXJhdGVJbnB1dCIsImxlbmd0aCIsInB1c2giLCJyZXNvbHZlIiwicHJvbWlzZSIsImdldEpTT04iLCJhamF4VXJsIiwiZm9ybV9pZCIsImdldFBhcmFtZXRlciIsImFjdGlvbiIsImZvcm0iLCJhZGRGb3JtRGF0YSIsImZvcm1zIiwic3VibWl0IiwiYWRkU3VibWl0RGF0YSIsImxvYWRJbnB1dHMiLCJlcnJvciIsImhhbmRsZUVycm9yIiwiJGZvcm1EYXRhIiwiZmlsbEluZm9zIiwiZm9ybVR5cGUiLCJsb2FkRm9ybVRlbXBsYXRlIiwiJHRlbXBsYXRlIiwiZ2VuZXJhdGVGb3JtIiwiYWRkUmVxdWlyZWRGaWVsZHMiLCJyZXF1aXJlZCIsImluZGV4IiwiaW5BcnJheSIsInNwbGljZSIsImpvaW4iLCJ1bmRlZmluZWQiLCJnZXQiLCJ0ZW1wbGF0ZSIsIiRlbGVtIiwiJGZvcm0iLCJvcmRlciIsImtleXMiLCJFRl9Gb3JtXzEiLCJyZXNwb25zZUpTT04iLCJwYXJhbWV0ZXIiLCJwYXJhbXNfc3RyaW5nIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJzdWJzdHIiLCJwYXJhbXNfYXJyYXkiLCJvYmoiLCJpIiwiZSIsImVycm9yTWVzc2FnZSIsInNldE1lc3NhZ2UiLCJzdWNjZXNzTWVzc2FnZSIsIm1lc3NhZ2UiLCJwZXJzaXN0IiwidGV4dCIsImZhZGVJbiIsInNldFRpbWVvdXQiLCJmYWRlT3V0IiwiRUZfYWRkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztnQkFpREksU0FBQUE7b0JBRUlDLEtBQUtDLFlBQVlDLEVBQUU7Ozs7Ozs7OztnQkFZaEJILFNBQUFJLFVBQUFDLE9BQVAsU0FBWUMsVUFBZ0JDLElBQVlDLE9BQVlDO29CQUFBLElBQUFBLGtCQUFBLEdBQUE7d0JBQUFBLFdBQUE7O29CQUVoRFIsS0FBS00sS0FBS0E7b0JBRVZELFdBQVdBLFNBQVNJLFFBQVEsWUFBV0g7b0JBRXZDTixLQUFLVSxVQUFVUixFQUFFRztvQkFDakJMLEtBQUtXLGlCQUFpQlgs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QkFFdkMsSUFBSWlGO29CQUNKLEtBQUksSUFBSUMsSUFBRyxHQUFFQSxJQUFFRixhQUFhNUMsUUFBTzhDLEtBQ25DO3dCQUNJLElBQUlDLElBQUlILGFBQWFFLEdBQUdsRixNQUFNO3dCQUM5QmlGLElBQUlFLEVBQUUsTUFBTUEsRUFBRTs7b0JBR2xCLE9BQU9GLElBQUlQOztnQkFXZnBFLE9BQUFDLGVBQWtCSSxRQUFBOzs7Ozs7eUJBQWxCLFNBQXdCeUU7d0JBRXBCekUsT0FBTzBFLFdBQVcsa0JBQWlCRCxjQUFhOzs7OztnQkFZcEQ5RSxPQUFBQyxlQUFrQkksUUFBQTs7Ozs7Ozt5QkFBbEIsU0FBMEIyRTt3QkFFdEIzRSxPQUFPMEUsV0FBVyxvQkFBbUJDLGdCQUFlOzs7Ozs7Ozs7OztnQkFVMUMzRSxPQUFBMEUsYUFBZCxTQUF5QmxILFNBQWlCb0gsU0FBMEJDO29CQUFwRSxJQUFBOUcsUUFBQWpCO29CQUFvRSxJQUFBK0gsaUJBQUEsR0FBQTt3QkFBQUEsVUFBQTs7b0JBR2hFLElBQUdELFNBQVM7d0JBQ1I1SCxFQUFFUSxTQUFTc0gsS0FBS0YsU0FBU0csT0FBTzt3QkFFaEMsS0FBSUYsU0FBUzs7NEJBR1QsV0FBVUEsWUFBWSxXQUFXO2dDQUM3QkEsVUFBVTs7NEJBR2RHLFdBQVc7Z0NBQ1BqSCxNQUFLMkcsV0FBV2xILFNBQVE7K0JBQzFCcUg7OzJCQUlKO3dCQUNGN0gsRUFBRVEsU0FBU3lILFFBQVEsS0FBSTs0QkFDbkJqSSxFQUFFUSxTQUFTc0gsS0FBSzs7OztnQkFLaEMsT0FBQTlFOztZQUVJa0YsU0FBUyxJQUFJbEY7WUFDakJrRixPQUFPaEkiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuZGVjbGFyZSB2YXIgJCA6IGFueTtcblxuZXhwb3J0IGNsYXNzIEVGX0lucHV0XG57XG5cbiAgICAvKipcbiAgICAgKiBAdmFyIHN0cmluZ1xuICAgICAqXG4gICAgICogVGhlIHR5cGUgb2YgdGhlIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB0eXBlIDogc3RyaW5nID0gJ3RleHQnO1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIEhUTUwgRWxlbWVudFxuICAgICAqXG4gICAgICogVGhlIGh0bWwgZWxlbWVudCBvZiB0aGUgaW5wdXRcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBlbGVtZW50IDogYW55O1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIEhUTUwgRWxlbWVudFxuICAgICAqXG4gICAgICogVGhlIGh0bWwgZWxlbWVudCBmb3IgdGhlIG9wdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBvcHRpb25zRWxlbWVudCA6IGFueTtcblxuXG4gICAgLyoqXG4gICAgICogVGhlIGlkIChwb3NpdGlvbikgb2YgdGhlIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIGlkIDogbnVtYmVyO1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBlbGVtZW50IG9mIHRoZSBjb250YWluZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgY29udGFpbmVyIDogYW55O1xuXG5cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiBjYWxsZWQgb24gZHVwbGljYXRlXG4gICAgICovXG4gICAgcHVibGljIG9uRHVwbGljYXRlIDogYW55O1xuXG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIgPSAkKCcjZmxkJyk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICogQHBhcmFtIGlkXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIDogbnVtYmVyXG4gICAgICovXG4gICAgcHVibGljIGluaXQoJGVsZW1lbnQgOiBhbnksIGlkIDogbnVtYmVyLCRkYXRhIDogYW55LHBvc2l0aW9uIDogbnVsbHxudW1iZXIgPSBudWxsKVxuICAgIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgICAgICRlbGVtZW50ID0gJGVsZW1lbnQucmVwbGFjZSgvZmllbGRJZC9nLGlkKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKCRlbGVtZW50KTtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudCA9IHRoaXMuZWxlbWVudC5maW5kKCcuZWYtdGFibGUnKTtcblxuICAgICAgICBpZihudWxsID09PSBwb3NpdGlvbikge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmZpbmQoJyNmaWVsZC0nICsgcG9zaXRpb24pLnJlcGxhY2VXaXRoKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuXG4gICAgICAgIHRoaXMuYWRkRGF0YSgkZGF0YSk7XG4gICAgfVxuXG5cblxuXG4gICAgcHVibGljIHNldEV2ZW50cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cIm9wZW4tY2xvc2VcIl0nKS5vbignY2xpY2snLCgpID0+IHtyZXR1cm4gdGhpcy50b2dnbGUoKX0pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwiZHVwbGljYXRlXCJdJykub24oJ2NsaWNrJywoKSA9PiB7dGhpcy5vbkR1cGxpY2F0ZSh0aGlzKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQ2xvc2UgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlKCk6IGJvb2xlYW5cbiAgICB7XG5cbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwib3Blbi1jbG9zZVwiXScpO1xuXG4gICAgICAgIGlmKCQoZWxlbSkuaGFzQ2xhc3MoJ21pbmlmeScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9zZSgpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0IHRoZSBkYXRhIGluIHRoZSB0ZW1wbGF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICovXG4gICAgcHVibGljIGFkZERhdGEoJGRhdGEpIDogdm9pZFxuICAgIHtcbiAgICAgICAgRUZfSW5wdXQuYWRkRGF0YVRvRWxlbWVudCh0aGlzLmVsZW1lbnQsJGRhdGEpXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqIEBwYXJhbSAkZGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYWRkRGF0YVRvRWxlbWVudCgkZWxlbWVudCA6IGFueSwgJGRhdGEgOiBhbnkpIDogdm9pZFxuICAgIHtcbiAgICAgICAgJGVsZW1lbnQuZmluZCgnW25hbWVePVwiZmllbGRcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkKGVsZW0pKTtcblxuICAgICAgICAgICAgaWYoJGRhdGFbcHJvcC5wcm9wXSAmJiAkZGF0YVtwcm9wLnByb3BdW3Byb3AubmFtZV0pIHtcbiAgICAgICAgICAgICAgICBFRl9JbnB1dC5zZXRJbnB1dFZhbHVlKCQoZWxlbSksJGRhdGFbcHJvcC5wcm9wXVtwcm9wLm5hbWVdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCBhIHZhbHVlIHRvIGFuIGlucHV0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKiBAcGFyYW0gdmFsdWVcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldElucHV0VmFsdWUoaW5wdXQgOiBhbnksIHZhbHVlIDogc3RyaW5nfGJvb2xlYW4pXG4gICAge1xuICAgICAgICBpZihpbnB1dC5pcygnOmNoZWNrYm94Jykpe1xuICAgICAgICAgICAgaWYodmFsdWUgPT0gJ29uJykge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlucHV0LnByb3AoJ2NoZWNrZWQnLHZhbHVlKTtcbiAgICAgICAgfWVsc2UgaWYoaW5wdXQuaXMoJ3NlbGVjdCcpKXtcbiAgICAgICAgICAgIGlucHV0LmZpbmQoJ29wdGlvblt2YWx1ZT1cIicrIHZhbHVlICsnXCJdJykucHJvcCgnc2VsZWN0ZWQnLHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBpbnB1dC52YWwodmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEdldCB0aGUgdmFsdWUgb2YgYW4gaW5wdXRcbiAgICAgKlxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICogQHJldHVybnMgYW55XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnB1dFZhbHVlKGlucHV0IDogYW55KVxuICAgIHtcblxuICAgICAgICBpZih0eXBlb2YgaW5wdXQudmFsICE9ICdmdW5jdGlvbicpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cblxuICAgICAgICBpZihpbnB1dC5pcygnOmNoZWNrYm94Jykpe1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LmlzKCc6Y2hlY2tlZCcpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC52YWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJldHVybiBhbGwgdGhlIHByb3BlcnRpZXMgb2YgYW4gaW5wdXRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnB1dFByb3BlcnRpZXMoZWxlbSA6IGFueSkgOiB7YXR0cixpZCxwcm9wLG5hbWV9XG4gICAge1xuXG4gICAgICAgIGxldCBuYW1lID0gZWxlbS5hdHRyKCduYW1lJyk7XG5cbiAgICAgICAgbGV0IGRhdGEgPSBuYW1lLnNwbGl0KCdbJyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGF0dHIgOiBkYXRhWzBdLnJlcGxhY2UoJ10nLCcnKSxcbiAgICAgICAgICAgIGlkIDogZGF0YVsxXS5yZXBsYWNlKCddJywnJyksXG4gICAgICAgICAgICBwcm9wIDogZGF0YVsyXSA/IGRhdGFbMl0ucmVwbGFjZSgnXScsJycpIDogJycsXG4gICAgICAgICAgICBuYW1lIDogZGF0YVszXSA/IGRhdGFbM10ucmVwbGFjZSgnXScsJycpIDogJycsXG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBzaW5jZSAxLjEuMFxuICAgICAqXG4gICAgICogQGV2ZW50IDogQ2xpY2sgb24gbWluaWZ5IGJ1dHRvbiA6IGhpZGUgdGhlIG9wdGlvbnMgb2YgdGhlIGZpZWxkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBjbG9zZSgpIDogYm9vbGVhblxuICAgIHtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudC5oaWRlKDIwMCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcubWluaWZ5JylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWluaWZ5JylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnb3BlbicpXG4gICAgICAgICAgICAuaHRtbCgnKycpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHNpbmNlIDEuMS4wXG4gICAgICpcbiAgICAgKiBPcGVuIGEgZmllbGRcbiAgICAgKlxuICAgICAqIEBldmVudCA6IENsaWNrIG9uIG9wZW4gYnV0dG9uLCBzaG93IHRoZSBmaWVsZCBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBvcGVuKCkgOiBib29sZWFuXG4gICAge1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50LnNob3coMjAwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5vcGVuJylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnb3BlbicpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ21pbmlmeScpXG4gICAgICAgICAgICAuaHRtbCgnLScpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIHRoZSB2YWx1ZSBvZiBhbGwgdGhlIGlucHV0cyBpbiB0aGUgZmllbGRcbiAgICAgKlxuICAgICAqL1xuICAgIGdldCB2YWx1ZSgpOiBhbnkge1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IHt9O1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbbmFtZV49XCJmaWVsZFwiXScpLmVhY2goKGtleSA6IG51bWJlcixpbnB1dCA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkKGlucHV0KSk7XG4gICAgICAgICAgICBsZXQgdmFsID0gRUZfSW5wdXQuZ2V0SW5wdXRWYWx1ZSgkKGlucHV0KSk7XG5cbiAgICAgICAgICAgIGlmKHByb3AucHJvcCAmJiAhdmFsdWVbcHJvcC5wcm9wXSAmJiBwcm9wLm5hbWUpe1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AucHJvcF0gPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodmFsdWVbcHJvcC5wcm9wXSkge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AucHJvcF1bcHJvcC5uYW1lXSA9IHZhbDtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLnByb3BdID0gdmFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgfVxuXG5cbiAgICAvLyBWb2lkXG4gICAgc2V0IHZhbHVlKHZhbHVlIDogYW55KSB7IH1cblxufSIsImltcG9ydCB7RUZfSW5wdXR9IGZyb20gXCIuLi9pbnB1dHMvRUZfSW5wdXRcIjtcblxuZGVjbGFyZSB2YXIgJCA6IGFueTtcblxuZXhwb3J0IGNsYXNzIEVGX0Zvcm0ge1xuXG4gICAgLyoqXG4gICAgICogQHZhciBzdHJpbmdcbiAgICAgKlxuICAgICAqIFRoZSB0eXBlIG9mIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdHlwZTogc3RyaW5nID0gJ3RleHQnO1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIEhUTUwgRWxlbWVudFxuICAgICAqXG4gICAgICogVGhlIGh0bWwgZWxlbWVudCBvZiB0aGUgaW5wdXRcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBlbGVtZW50OiBhbnk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBlbGVtZW50IG9mIHRoZSBjb250YWluZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgY29udGFpbmVyIDogYW55O1xuXG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIgPSAkKCcjdXRpbGl0aWVzJyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqL1xuICAgIHB1YmxpYyBpbml0KCRlbGVtZW50IDogYW55KVxuICAgIHtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKCRlbGVtZW50KTtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5odG1sKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJldHVybiB0aGUgdmFsdWUgb2YgYWxsIHRoZSBpbnB1dHMgaW4gdGhlIGZpZWxkXG4gICAgICpcbiAgICAgKi9cbiAgICBnZXQgdmFsdWUoKTogYW55IHtcblxuICAgICAgICBsZXQgdmFsdWUgPSB7fTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW25hbWVePVwic2V0dGluZ3NcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsaW5wdXQgOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJChpbnB1dCkpO1xuICAgICAgICAgICAgbGV0IHZhbCA9IEVGX0lucHV0LmdldElucHV0VmFsdWUoJChpbnB1dCkpO1xuXG4gICAgICAgICAgICBpZihwcm9wLmF0dHIgJiYgIXZhbHVlW3Byb3AuYXR0cl0gJiYgcHJvcC5pZCl7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5hdHRyXSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih2YWx1ZVtwcm9wLmF0dHJdKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5hdHRyXVtwcm9wLmlkXSA9IHZhbDtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLmF0dHJdID0gdmFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgfVxuXG5cblxuXG59IiwiaW1wb3J0IHtFRl9Gb3JtfSBmcm9tIFwiLi9mb3Jtcy9FRl9Gb3JtXCI7XG5cbmRlY2xhcmUgdmFyICQ7XG5cbmRlY2xhcmUgdmFyIGFqYXhVcmwgOiBzdHJpbmc7XG5cbmltcG9ydCB7RUZfSW5wdXR9IGZyb20gJy4vaW5wdXRzL0VGX0lucHV0JztcblxuY2xhc3MgRUZfQWRkXG57XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBIVE1MIEJvZHkgb2YgdGhlIHBhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgJGJvZHk7XG5cbiAgICAvKipcbiAgICAgKkFuIG9iamVjdCBvZiBhbGwgdGhlIGlucHV0IHRlbXBsYXRlcyBjYWNoZWQgdG8gYXZvaWQgbGF0ZW5jeVxuICAgICAqL1xuICAgIHB1YmxpYyB0ZW1wbGF0ZXMgOiBhbnkgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIGFsbCB0aGUgaW5wdXRzIGF2YWlsYWJsZSBvbiB0aGUgcGFnZVxuICAgICAqL1xuICAgIHB1YmxpYyBpbnB1dHMgOiBFRl9JbnB1dFtdID0gW107XG5cblxuICAgIC8qKlxuICAgICAqIEFsbCB0aGUgYXZhaWxhYmxlIGlucHV0c1xuICAgICAqL1xuICAgIHB1YmxpYyBhdmFpbGFibGVJbnB1dHMgOiB7fSA9IHt9O1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGF2YWlsYWJsZSBpbnB1dHNcbiAgICAgKi9cbiAgICBwdWJsaWMgYXZhaWxhYmxlRm9ybXMgOiB7fSA9IHt9O1xuXG5cbiAgICBwdWJsaWMgZm9ybVR5cGUgOiBFRl9Gb3JtO1xuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIGVkaXRvciBpcyBpbml0XG4gICAgICovXG4gICAgcHVibGljIGlzX2luaXQgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy4kYm9keSA9ICQoJ2JvZHknKTtcblxuICAgIH1cblxuXG4gICAgcHVibGljIGluaXQoKSB7XG5cbiAgICAgICAgdGhpcy5zZXRFdmVudHMoKTtcblxuICAgICAgICB0aGlzLmxvYWQoKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICAvKlxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLm1vdmUnLF9tb3ZlKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLnVwJyxfdXApO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcuZG93bicsX2Rvd24pO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcucmVtb3Zlb3B0aW9uJyxfcmVtb3ZlT3B0aW9uKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLmR1cGxpcXVlcicsX2R1cGxpY2F0ZSk7Ki9cblxuICAgICAgICAvLyBBZGQgYSBuZXcgZmllbGRcbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJ2J1dHRvbltkYXRhLWFjdGlvbj1cImFkZFwiXScsKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkSW5wdXQoJ3RleHQnLHt9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ2ZpZWxkcycpO1xuICAgICAgICAgICAgICAgIH0pIH0pO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWUkPVwiW2F0dHJpYnV0ZXNdW3R5cGVdXCJdJywoJGV2ZW50IDogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9ICQoJGV2ZW50LnRhcmdldCkudmFsKCk7XG4gICAgICAgICAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJCgkZXZlbnQudGFyZ2V0KSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VJbnB1dCh0eXBlLHRoaXMuaW5wdXRzW3Byb3AuaWRdLHByb3AuaWQpXG4gICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cInNldHRpbmdzW3R5cGVdXCJdJywoJGV2ZW50IDogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9ICQoZXZlbnQudGFyZ2V0KS52YWwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUZvcm1UeXBlKHR5cGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGQtb3B0aW9uXCJdJyxfYWRkT3B0aW9uKTtcblxuXG4gICAgICAgICAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsJ3NlbGVjdFtuYW1lJD1cIltmb3JtLXRheG9ub215XVwiXScsX2NoYW5nZVRheG9ub215KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cImZvcm0tcmVzZXQtYWN0aW9uXCJdJyxfY2hhbmdlUmVzZXRBY3Rpb24pO1xuXG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCcucGFuZWwgaGVhZGVyJyxfdG9nZ2xlUGFuZWwpOyovXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBvbkR1cGxpY2F0ZShpbnB1dCA6IEVGX0lucHV0KSA6IGFueVxuICAgIHtcblxuICAgICAgICB0aGlzLmFkZElucHV0KGlucHV0LnZhbHVlLmF0dHJpYnV0ZXMudHlwZSxpbnB1dC52YWx1ZSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBFRl9BZGQuc3VjY2VzcyAgPSAnVGhlbSBpbnB1dCBoYXMgYmVlbiBkdXBsaWNhdGVkJztcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIENoYW5nZSB0aGUgdHlwZSBvZiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKiBAcGFyYW0gJGlucHV0XG4gICAgICogQHBhcmFtICRwb3NpdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBjaGFuZ2VJbnB1dCh0eXBlIDogc3RyaW5nLCRpbnB1dCA6IEVGX0lucHV0LCRwb3NpdGlvbiA6IG51bWJlcnxudWxsID0gbnVsbClcbiAgICB7XG4gICAgICAgIGxldCB2YWx1ZSA9ICRpbnB1dC52YWx1ZTtcblxuICAgICAgICB0aGlzLmFkZElucHV0KHR5cGUsdmFsdWUsJHBvc2l0aW9uKS50aGVuKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ2ZpZWxkcycpO1xuICAgICAgICAgICAgaW5wdXQub3BlbigpO1xuICAgICAgICB9KVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYW4gaW5wdXQgdG8gdGhlIGVkaXRvclxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRJbnB1dCh0eXBlIDogc3RyaW5nID0gJ3RleHQnLCRkYXRhLHBvc2l0aW9uIDogbnVtYmVyfG51bGwgPSBudWxsKSA6IFByb21pc2U8YW55PlxuICAgIHtcblxuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG5cbiAgICAgICAgRUZfQWRkLmxvYWRpbmcodHJ1ZSwnZmllbGRzJyk7XG5cbiAgICAgICAgLy8gQ2xvc2UgYWxsIHRoZSBpbnB1dHNcbiAgICAgICAgJC5lYWNoKHRoaXMuaW5wdXRzLChrZXkgOiBudW1iZXIsIGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgIGlucHV0LmNsb3NlKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5nZXRJbnB1dCh0eXBlKS50aGVuKChkYXRhIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBpbnB1dCA6IEVGX0lucHV0O1xuXG4gICAgICAgICAgICBpbnB1dCA9IHRoaXMuZ2VuZXJhdGVJbnB1dCh0eXBlKTtcblxuICAgICAgICAgICAgaW5wdXQuaW5pdChkYXRhLHBvc2l0aW9uID8gcG9zaXRpb24gOiB0aGlzLmlucHV0cy5sZW5ndGgsJGRhdGEscG9zaXRpb24pO1xuXG4gICAgICAgICAgICBpbnB1dC5vbkR1cGxpY2F0ZSA9IChpbnB1dCkgPT4geyB0aGlzLm9uRHVwbGljYXRlKGlucHV0KSB9O1xuXG4gICAgICAgICAgICBpZihwb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzW3Bvc2l0aW9uXSA9IGlucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5wdXNoKGlucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGZkLnJlc29sdmUoaW5wdXQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTaG93IG9yIGhpZGUgdGhlIGxvYWRpbmdzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbG9hZGluZ1xuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbG9hZGluZyhsb2FkaW5nIDogYm9vbGVhbiA9IHRydWUsJGVsZW1lbnQgOiBudWxsfHN0cmluZyA9IG51bGwpXG4gICAge1xuICAgICAgICAvLyBTaG93IHRoZSBzcGlubmVyXG5cbiAgICAgICAgc3dpdGNoICgkZWxlbWVudCkge1xuICAgICAgICAgICAgY2FzZSAnZmllbGRzJyA6XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItZmllbGRzJykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndXRpbGl0eScgOlxuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLXV0aWxpdHknKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLXV0aWxpdHknKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItZmllbGRzJykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIExvYWQgdGhlIGZvcm0gZGF0YSBmcm9tIHRoZSBiYWNrIG9mZmljZVxuICAgICAqL1xuICAgIHB1YmxpYyBsb2FkKCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgJC5nZXRKU09OKGFqYXhVcmwsIHtcbiAgICAgICAgICAgIGZvcm1faWQgOiBFRl9BZGQuZ2V0UGFyYW1ldGVyKCdwb3N0JyksXG4gICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX2Zvcm1fZGF0YSdcbiAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAvLyBBZGQgdGhlIGRhdGEgZm9yIGFsbCB0aGUgZm9ybVxuICAgICAgICAgICAgdGhpcy5hZGREYXRhKGRhdGEuZGF0YS5mb3JtKTtcbiAgICAgICAgICAgIHRoaXMuYWRkRm9ybURhdGEoZGF0YS5kYXRhLmZvcm0pO1xuXG5cbiAgICAgICAgICAgICQuZWFjaChkYXRhLmRhdGEuaW5wdXRzLCh0eXBlLGlucHV0IDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVJbnB1dHNbdHlwZV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5kYXRhLmZvcm1zLCh0eXBlLGlucHV0IDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVGb3Jtc1t0eXBlXSA9IGlucHV0O1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBzdWJtaXQgZGF0YVxuICAgICAgICAgICAgaWYoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdCkge1xuICAgICAgICAgICAgICAgIGxldCBzdWJtaXQgPSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkU3VibWl0RGF0YShzdWJtaXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMb2FkIGFsbCB0aGUgaW5wdXRzXG4gICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLDApO1xuXG5cblxuICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgZGF0YSBpbnNpZGUgdGhlIGZvcm0gaXRzZWxmXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZERhdGEoJGZvcm1EYXRhIDogYW55KSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbEluZm9zKCQoZWxlbSksJGZvcm1EYXRhKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJhdHRyaWJ1dGVzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNoYW5nZUZvcm1UeXBlKHR5cGUpIDogdm9pZFxuICAgIHtcblxuICAgICAgICBFRl9BZGQubG9hZGluZyh0cnVlLCd1dGlsaXR5Jyk7XG5cbiAgICAgICAgbGV0ICRmb3JtRGF0YSA9IHRoaXMuZm9ybVR5cGUudmFsdWU7XG5cbiAgICAgICAgJGZvcm1EYXRhLnR5cGUgPSB0eXBlO1xuXG4gICAgICAgIHRoaXMuYWRkRm9ybURhdGEoJGZvcm1EYXRhKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgdGhlIGZvcm0gZGF0YSBpbiB0aGUgZm9ybSB0eXBlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZEZvcm1EYXRhKCRmb3JtRGF0YSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIHRoaXMubG9hZEZvcm1UZW1wbGF0ZSgkZm9ybURhdGEudHlwZSkudGhlbigoJHRlbXBsYXRlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1UeXBlID0gdGhpcy5nZW5lcmF0ZUZvcm0oJGZvcm1EYXRhLnR5cGUpO1xuXG4gICAgICAgICAgICB0aGlzLmZvcm1UeXBlLmluaXQoJHRlbXBsYXRlKTtcblxuICAgICAgICAgICAgJCgnI2VmLWFkZC10eXBlJykuZmluZCgnW25hbWVePVwic2V0dGluZ3NcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCd1dGlsaXR5Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuYWRkUmVxdWlyZWRGaWVsZHMoJGZvcm1EYXRhLnR5cGUpO1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRSZXF1aXJlZEZpZWxkcyh0eXBlIDogc3RyaW5nKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCByZXF1aXJlZCA9IHRoaXMuYXZhaWxhYmxlRm9ybXNbdHlwZV0ucmVxdWlyZWQ7XG5cbiAgICAgICAgJC5lYWNoKHRoaXMuaW5wdXRzLChrZXkgOiBzdHJpbmcsIGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9ICQuaW5BcnJheShpbnB1dC52YWx1ZS5hdHRyaWJ1dGVzLm5hbWUscmVxdWlyZWQpO1xuICAgICAgICAgICAgaWYoaW5kZXggIT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXF1aXJlZC5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBpbnB1dHMgPSBbXTtcblxuICAgICAgICAkLmVhY2gocmVxdWlyZWQsKGtleSA6IG51bWJlcixpbnB1dCA6IHN0cmluZykgPT4ge1xuXG4gICAgICAgICAgICBpbnB1dHMucHVzaCh7YXR0cmlidXRlcyA6e3R5cGUgOiAndGV4dCcsbmFtZSA6IGlucHV0fX0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmKGlucHV0cyAmJiBpbnB1dHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cywgMCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgRUZfQWRkLnN1Y2Nlc3MgPSAnVGhlIGZpZWxkcyAnICsgcmVxdWlyZWQuam9pbignLCAnKSArICcgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBmb3JtJztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZEZvcm1UZW1wbGF0ZSh0eXBlIDogc3RyaW5nKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBsZXQga2V5ID0gJ2Zvcm0tJyArIHR5cGU7XG5cbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGVzW2tleV0gJiYgdGhpcy50ZW1wbGF0ZXNba2V5XSAhPSB1bmRlZmluZWQgJiYgdGhpcy50ZW1wbGF0ZXNba2V5XSAhPSAnJykge1xuICAgICAgICAgICAgZGZkLnJlc29sdmUodGhpcy50ZW1wbGF0ZXNba2V5XSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQuZ2V0KGFqYXhVcmwsIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnYWN0aW9ucycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgOiB0eXBlLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ0VGL2xvYWRfdGVtcGxhdGUnXG4gICAgICAgICAgICB9KS5zdWNjZXNzKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlc1trZXldID0gZGF0YS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhLmRhdGEpO1xuICAgICAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuICAgIH1cblxuXG4gICAgcHVibGljIGZpbGxJbmZvcygkZWxlbSwkZm9ybSkgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkZWxlbSk7XG5cbiAgICAgICAgaWYoJGZvcm1bcHJvcC5hdHRyXSAmJiAkZm9ybVtwcm9wLmF0dHJdW3Byb3AuaWRdKSB7XG5cbiAgICAgICAgICAgIEVGX0lucHV0LnNldElucHV0VmFsdWUoJGVsZW0sJGZvcm1bcHJvcC5hdHRyXVtwcm9wLmlkXSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQWRkIHRoZSBkYXRhIGluc2lkZSB0aGUgc3VibWl0IGJ1dHRvblxuICAgICAqXG4gICAgICogQHBhcmFtIHN1Ym1pdFxuICAgICAqL1xuICAgIHByaXZhdGUgYWRkU3VibWl0RGF0YShzdWJtaXQpIDogdm9pZFxuICAgIHtcbiAgICAgICAgRUZfSW5wdXQuYWRkRGF0YVRvRWxlbWVudCh0aGlzLiRib2R5LmZpbmQoJyNlZi1hZGQtc3VibWl0Jyksc3VibWl0KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogTG9hZCBhbGwgdGhlIGlucHV0cyBmcm9tIHRoZSBsaXN0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRzXG4gICAgICogQHBhcmFtIGRmZFxuICAgICAqIEBwYXJhbSBvcmRlclxuICAgICAqL1xuICAgIHByaXZhdGUgbG9hZElucHV0cyhpbnB1dHMgOiB7IGF0dHJpYnV0ZXMgOiB7dHlwZSA6IHN0cmluZyB9fVtdLG9yZGVyIDogbnVtYmVyLGRmZCAgOiBhbnkgPSBudWxsKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgaWYoIWRmZCkge1xuICAgICAgICAgICAgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoaW5wdXRzKTtcblxuICAgICAgICBsZXQga2V5ID0ga2V5c1tvcmRlcl07XG5cbiAgICAgICAgaWYoIWtleSB8fCAhaW5wdXRzIHx8ICFpbnB1dHNba2V5XSl7XG4gICAgICAgICAgICB0aGlzLmlzX2luaXQgPSB0cnVlO1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ2ZpZWxkcycpO1xuICAgICAgICAgICAgZGZkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmFkZElucHV0KGlucHV0c1trZXldLmF0dHJpYnV0ZXMudHlwZSxpbnB1dHNba2V5XSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgb3JkZXIrKztcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoaW5wdXRzLG9yZGVyLGRmZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuXG4gICAgcHVibGljIGdlbmVyYXRlRm9ybSh0eXBlIDogc3RyaW5nKSA6IEVGX0Zvcm1cbiAgICB7XG4gICAgICAgIGxldCBmb3JtO1xuXG4gICAgICAgIGlmKCF0aGlzLmF2YWlsYWJsZUZvcm1zW3R5cGVdKSB7XG4gICAgICAgICAgICB0eXBlID0gJ3Bvc3QnO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdsb2dpbicgOlxuICAgICAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncG9zdCcgOlxuICAgICAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFmb3JtKSB7XG4gICAgICAgICAgICBmb3JtID0gbmV3IEVGX0Zvcm0oKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcmV0dXJuIGZvcm07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHVibGljIGdlbmVyYXRlSW5wdXQodHlwZSA6IHN0cmluZykgOiBFRl9JbnB1dFxuICAgIHtcbiAgICAgICAgbGV0IGlucHV0O1xuXG4gICAgICAgIGlmKCF0aGlzLmF2YWlsYWJsZUlucHV0c1t0eXBlXSkge1xuICAgICAgICAgICAgdHlwZSA9ICd0ZXh0JztcbiAgICAgICAgfVxuXG5cbiAgICAgICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgICAgICAgIGlucHV0ID0gbmV3IEVGX0lucHV0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZighaW5wdXQpIHtcbiAgICAgICAgICAgIGlucHV0ID0gbmV3IEVGX0lucHV0KCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiBpbnB1dDtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBMb2FkIHRoZSBpbnB1dCB0ZW1wbGF0ZSBmcm9tIHRoZSBCT1xuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGUgOiBzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRJbnB1dCh0eXBlIDogc3RyaW5nID0gJ3RleHQnKVxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXNbdHlwZV0gJiYgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gIT0gdW5kZWZpbmVkICYmIHRoaXMudGVtcGxhdGVzW3R5cGVdICE9ICcnKSB7XG4gICAgICAgICAgICBkZmQucmVzb2x2ZSh0aGlzLnRlbXBsYXRlc1t0eXBlXSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQuZ2V0KGFqYXhVcmwsIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnaW5wdXRzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA6IHR5cGUsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF90ZW1wbGF0ZSdcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW3R5cGVdID0gZGF0YS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhLmRhdGEpO1xuICAgICAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIEhUVFAgRXJyb3JzXG4gICAgICpcbiAgICAgKiBAVE9ET1xuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVFcnJvcihkYXRhIDogc3RyaW5nfHtyZXNwb25zZUpTT04gOiB7ZXJyb3J9fSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIGxldCBlcnJvciA6IHN0cmluZztcblxuICAgICAgICBpZih0eXBlb2YgZGF0YSAhPSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBlcnJvciA9IGRhdGEucmVzcG9uc2VKU09OLmVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgRUZfQWRkLmVycm9yID0gZXJyb3I7XG4gICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlKTtcblxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEdldCB0aGUgdXJsIHBhcmFtZXRlclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtZXRlclxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRQYXJhbWV0ZXIocGFyYW1ldGVyIDogc3RyaW5nKTphbnlcbiAgICB7XG4gICAgICAgIHZhciBwYXJhbXNfc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSk7XG5cbiAgICAgICAgdmFyIHBhcmFtc19hcnJheSA9IHBhcmFtc19zdHJpbmcuc3BsaXQoJyYnKTtcblxuICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgIGZvcih2YXIgaSA9MDtpPHBhcmFtc19hcnJheS5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZSA9IHBhcmFtc19hcnJheVtpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgb2JqW2VbMF1dID0gZVsxXVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9ialtwYXJhbWV0ZXJdO1xuICAgIH1cblxuXG5cblxuICAgIC8qKlxuICAgICAqIERpc3BsYXkgYW4gZXJyb3IgbWVzc2FnZSB0aGF0IHdpbGwgZmFkZSBvdXQgaW4gNSBzZWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCBlcnJvcihlcnJvck1lc3NhZ2UgOiBzdHJpbmd8Ym9vbGVhbikge1xuXG4gICAgICAgIEVGX0FkZC5zZXRNZXNzYWdlKCcjZXJyb3ItbWVzc2FnZScsZXJyb3JNZXNzYWdlLGZhbHNlKTtcblxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIERpc3BsYXkgYSBzdWNjZXNzIG1lc3NhZ2UgdGhhdCB3aWxsIGZhZGUgb3V0IGluIDUgc2VjXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3VjY2Vzc01lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCBzdWNjZXNzKHN1Y2Nlc3NNZXNzYWdlOiBzdHJpbmd8Ym9vbGVhbikge1xuXG4gICAgICAgIEVGX0FkZC5zZXRNZXNzYWdlKCcjc3VjY2Vzcy1tZXNzYWdlJyxzdWNjZXNzTWVzc2FnZSxmYWxzZSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0gcGVyc2lzdCA6IGJvb2xlYW4sIFdlaXRoZXIgb3Igbm90IHRoZSBtZXNzYWdlIHNob3VsZCBiZSBkaXNwbGF5ZWQgb3Igbm90XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXRNZXNzYWdlKGVsZW1lbnQgOiBzdHJpbmcsbWVzc2FnZSA6IHN0cmluZ3xib29sZWFuLCBwZXJzaXN0IDogYm9vbGVhbnxudW1iZXIgPSBmYWxzZSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIGlmKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkudGV4dChtZXNzYWdlKS5mYWRlSW4oMjAwKTtcblxuICAgICAgICAgICAgaWYoIXBlcnNpc3QpIHtcblxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHBlcnNpc3QgaXMgbm90IGVxdWFsIHRvIGZhbHNlXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHBlcnNpc3QgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcnNpc3QgPSA1MDAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1lc3NhZ2UoZWxlbWVudCwnJyk7XG4gICAgICAgICAgICAgICAgfSxwZXJzaXN0KTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkuZmFkZU91dCgyMDAsKCkgPT4ge1xuICAgICAgICAgICAgICAgICQoZWxlbWVudCkudGV4dCgnJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG52YXIgRUZfYWRkID0gbmV3IEVGX0FkZCgpO1xuRUZfYWRkLmluaXQoKTsiXX0=
