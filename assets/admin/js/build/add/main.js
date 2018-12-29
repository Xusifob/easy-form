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
                    $element = $element.replace(/fieldUnId/g, id + 1);
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
                /**
                 * Set all the events linked to this element
                 */
                EF_Input.prototype.setEvents = function() {
                    var _this = this;
                    this.element.find('[data-action="open-close"]').on("click", function() {
                        return _this.toggle();
                    });
                    this.element.find('[data-action="duplicate"]').on("click", function() {
                        _this.onDuplicate(_this);
                        return false;
                    });
                    this.element.find('[data-action="change-type"]').on("click", function() {
                        _this.onChangeType(_this);
                        return false;
                    });
                    this.element.find('[data-action="delete"]').on("click", function() {
                        _this.onDelete(_this);
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
                    this.$body.off("click", 'button[data-action="add"]').on("click", 'button[data-action="add"]', function() {
                        _this.addInput("text", {}).then(function() {
                            EF_Add.loading(false, "fields");
                        });
                    });
                    this.$body.off("click", 'select[name="settings[type]"]').on("change", 'select[name="settings[type]"]', function($event) {
                        var type = $($event.target).val();
                        _this.changeFormType(type);
                    });
                };
                /**
                 * Reorganise all the inputs on the page according to the ones
                 */
                EF_Add.prototype.reorganise = function() {
                    EF_Add.loading(true, "fields");
                    var inputs = [];
                    $.each(this.inputs, function(key, input) {
                        inputs.push(input.value);
                    });
                    this.removeAllInputs();
                    this.loadInputs(inputs, 0).then(function() {
                        EF_Add.loading(false, "fields");
                    });
                };
                /**
                 * Remove all inputs from track
                 */
                EF_Add.prototype.removeAllInputs = function() {
                    this.inputs = [];
                    this.$body.find("#fld").html("");
                };
                /**
                 *
                 * Called on click on the duplicate button
                 *
                 * @Event
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
                 * Called when the change of type is triggered
                 *
                 * @Event
                 *
                 * @param input
                 */
                EF_Add.prototype.onChangeType = function(input) {
                    var position = this.inputs.indexOf(input);
                    var value = input.value;
                    this.addInput(value.attributes.type, value, position).then(function(input) {
                        EF_Add.loading(false, "fields");
                        input.open();
                    });
                };
                /**
                 *
                 * Called on delete of an input
                 *
                 * @Event
                 *
                 * @param input
                 */
                EF_Add.prototype.onDelete = function(input) {
                    var position = this.inputs.indexOf(input);
                    this.inputs.splice(position, 1);
                    this.reorganise();
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
                        input.onChangeType = function(input) {
                            _this.onChangeType(input);
                        };
                        input.onDelete = function(input) {
                            _this.onDelete(input);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2lucHV0cy9FRl9JbnB1dC50cyIsImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2Zvcm1zL0VGX0Zvcm0udHMiLCJhc3NldHMvYWRtaW4vanMvc3JjL2FkZC9FRl9BZGQudHMiXSwibmFtZXMiOlsiRUZfSW5wdXQiLCJ0aGlzIiwiY29udGFpbmVyIiwiJCIsInByb3RvdHlwZSIsImluaXQiLCIkZWxlbWVudCIsImlkIiwiJGRhdGEiLCJwb3NpdGlvbiIsInJlcGxhY2UiLCJlbGVtZW50Iiwib3B0aW9uc0VsZW1lbnQiLCJmaW5kIiwiYXBwZW5kIiwicmVwbGFjZVdpdGgiLCJzZXRFdmVudHMiLCJhZGREYXRhIiwiX3RoaXMiLCJvbiIsInRvZ2dsZSIsIm9uRHVwbGljYXRlIiwib25DaGFuZ2VUeXBlIiwib25EZWxldGUiLCJlbGVtIiwiaGFzQ2xhc3MiLCJjbG9zZSIsIm9wZW4iLCJhZGREYXRhVG9FbGVtZW50IiwiZWFjaCIsImtleSIsInByb3AiLCJnZXRJbnB1dFByb3BlcnRpZXMiLCJuYW1lIiwic2V0SW5wdXRWYWx1ZSIsImlucHV0IiwidmFsdWUiLCJpcyIsInZhbCIsImdldElucHV0VmFsdWUiLCJhdHRyIiwiZGF0YSIsInNwbGl0IiwiaGlkZSIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJodG1sIiwic2hvdyIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwidHlwZSIsIkVGX0Zvcm0iLCJFRl9JbnB1dF8xIiwiRUZfQWRkIiwidGVtcGxhdGVzIiwiaW5wdXRzIiwiYXZhaWxhYmxlSW5wdXRzIiwiYXZhaWxhYmxlRm9ybXMiLCJpc19pbml0IiwiJGJvZHkiLCJsb2FkIiwidGhlbiIsIm9mZiIsImFkZElucHV0IiwibG9hZGluZyIsIiRldmVudCIsInRhcmdldCIsImNoYW5nZUZvcm1UeXBlIiwicmVvcmdhbmlzZSIsInB1c2giLCJyZW1vdmVBbGxJbnB1dHMiLCJsb2FkSW5wdXRzIiwiYXR0cmlidXRlcyIsInN1Y2Nlc3MiLCJpbmRleE9mIiwic3BsaWNlIiwiZGZkIiwiRGVmZXJyZWQiLCJnZXRJbnB1dCIsImdlbmVyYXRlSW5wdXQiLCJsZW5ndGgiLCJyZXNvbHZlIiwicHJvbWlzZSIsImdldEpTT04iLCJhamF4VXJsIiwiZm9ybV9pZCIsImdldFBhcmFtZXRlciIsImFjdGlvbiIsImZvcm0iLCJhZGRGb3JtRGF0YSIsImZvcm1zIiwic3VibWl0IiwiYWRkU3VibWl0RGF0YSIsImVycm9yIiwiaGFuZGxlRXJyb3IiLCIkZm9ybURhdGEiLCJmaWxsSW5mb3MiLCJmb3JtVHlwZSIsImxvYWRGb3JtVGVtcGxhdGUiLCIkdGVtcGxhdGUiLCJnZW5lcmF0ZUZvcm0iLCJhZGRSZXF1aXJlZEZpZWxkcyIsInJlcXVpcmVkIiwiaW5kZXgiLCJpbkFycmF5Iiwiam9pbiIsInVuZGVmaW5lZCIsImdldCIsInRlbXBsYXRlIiwiJGVsZW0iLCIkZm9ybSIsIkVGX0lucHV0XzIiLCJvcmRlciIsImtleXMiLCJFRl9Gb3JtXzEiLCJyZXNwb25zZUpTT04iLCJwYXJhbWV0ZXIiLCJwYXJhbXNfc3RyaW5nIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJzdWJzdHIiLCJwYXJhbXNfYXJyYXkiLCJvYmoiLCJpIiwiZSIsImVycm9yTWVzc2FnZSIsInNldE1lc3NhZ2UiLCJzdWNjZXNzTWVzc2FnZSIsIm1lc3NhZ2UiLCJwZXJzaXN0IiwidGV4dCIsImZhZGVJbiIsInNldFRpbWVvdXQiLCJmYWRlT3V0IiwiRUZfYWRkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztnQkFrREksU0FBQUE7b0JBRUlDLEtBQUtDLFlBQVlDLEVBQUU7Ozs7Ozs7OztnQkFZaEJILFNBQUFJLFVBQUFDLE9BQVAsU0FBWUMsVUFBZ0JDLElBQVlDLE9BQVlDO29CQUFBLElBQUFBLGtCQUFBLEdBQUE7d0JBQUFBLFdBQUE7O29CQUVoRFIsS0FBS00sS0FBS0E7b0JBRVZELFdBQVdBLFNBQVNJLFFBQVEsY0FBYUgsS0FBRztvQkFDNUNELFdBQVdB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V0FBVyxvQkFBbUJDLGdCQUFlOzs7Ozs7Ozs7OztnQkFVMUMzRSxPQUFBMEUsYUFBZCxTQUF5QnBILFNBQWlCc0gsU0FBMEJDO29CQUFwRSxJQUFBaEgsUUFBQWpCO29CQUFvRSxJQUFBaUksaUJBQUEsR0FBQTt3QkFBQUEsVUFBQTs7b0JBR2hFLElBQUdELFNBQVM7d0JBQ1I5SCxFQUFFUSxTQUFTd0gsS0FBS0YsU0FBU0csT0FBTzt3QkFFaEMsS0FBSUYsU0FBUzs7NEJBR1QsV0FBVUEsWUFBWSxXQUFXO2dDQUM3QkEsVUFBVTs7NEJBR2RHLFdBQVc7Z0NBQ1BuSCxNQUFLNkcsV0FBV3BILFNBQVE7K0JBQzFCdUg7OzJCQUlKO3dCQUNGL0gsRUFBRVEsU0FBUzJILFFBQVEsS0FBSTs0QkFDbkJuSSxFQUFFUSxTQUFTd0gsS0FBSzs7OztnQkFLaEMsT0FBQTlFOztZQUVJa0YsU0FBUyxJQUFJbEY7WUFDakJrRixPQUFPbEkiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuZGVjbGFyZSB2YXIgJCA6IGFueTtcblxuZXhwb3J0IGNsYXNzIEVGX0lucHV0XG57XG5cbiAgICAvKipcbiAgICAgKiBAdmFyIHN0cmluZ1xuICAgICAqXG4gICAgICogVGhlIHR5cGUgb2YgdGhlIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB0eXBlIDogc3RyaW5nID0gJ3RleHQnO1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIEhUTUwgRWxlbWVudFxuICAgICAqXG4gICAgICogVGhlIGh0bWwgZWxlbWVudCBvZiB0aGUgaW5wdXRcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBlbGVtZW50IDogYW55O1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIEhUTUwgRWxlbWVudFxuICAgICAqXG4gICAgICogVGhlIGh0bWwgZWxlbWVudCBmb3IgdGhlIG9wdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBvcHRpb25zRWxlbWVudCA6IGFueTtcblxuXG4gICAgLyoqXG4gICAgICogVGhlIGlkIChwb3NpdGlvbikgb2YgdGhlIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIGlkIDogbnVtYmVyO1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBlbGVtZW50IG9mIHRoZSBjb250YWluZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgY29udGFpbmVyIDogYW55O1xuXG5cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiBjYWxsZWQgb24gZHVwbGljYXRlXG4gICAgICovXG4gICAgcHVibGljIG9uRHVwbGljYXRlIDogYW55O1xuICAgIHB1YmxpYyBvbkNoYW5nZVR5cGUgOiBhbnk7XG4gICAgcHVibGljIG9uRGVsZXRlIDogYW55O1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gJCgnI2ZsZCcpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqIEBwYXJhbSAkZGF0YVxuICAgICAqIEBwYXJhbSBpZFxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiA6IG51bWJlclxuICAgICAqL1xuICAgIHB1YmxpYyBpbml0KCRlbGVtZW50IDogYW55LCBpZCA6IG51bWJlciwkZGF0YSA6IGFueSxwb3NpdGlvbiA6IG51bGx8bnVtYmVyID0gbnVsbClcbiAgICB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcblxuICAgICAgICAkZWxlbWVudCA9ICRlbGVtZW50LnJlcGxhY2UoL2ZpZWxkVW5JZC9nLGlkKzEpO1xuICAgICAgICAkZWxlbWVudCA9ICRlbGVtZW50LnJlcGxhY2UoL2ZpZWxkSWQvZyxpZCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJCgkZWxlbWVudCk7XG4gICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmVmLXRhYmxlJyk7XG5cbiAgICAgICAgaWYobnVsbCA9PT0gcG9zaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5maW5kKCcjZmllbGQtJyArIHBvc2l0aW9uKS5yZXBsYWNlV2l0aCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRFdmVudHMoKTtcblxuICAgICAgICB0aGlzLmFkZERhdGEoJGRhdGEpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogU2V0IGFsbCB0aGUgZXZlbnRzIGxpbmtlZCB0byB0aGlzIGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0RXZlbnRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwib3Blbi1jbG9zZVwiXScpLm9uKCdjbGljaycsKCkgPT4ge3JldHVybiB0aGlzLnRvZ2dsZSgpfSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJkdXBsaWNhdGVcIl0nKS5vbignY2xpY2snLCgpID0+IHt0aGlzLm9uRHVwbGljYXRlKHRoaXMpOyByZXR1cm4gZmFsc2U7fSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJjaGFuZ2UtdHlwZVwiXScpLm9uKCdjbGljaycsKCkgPT4ge3RoaXMub25DaGFuZ2VUeXBlKHRoaXMpOyByZXR1cm4gZmFsc2U7fSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJkZWxldGVcIl0nKS5vbignY2xpY2snLCgpID0+IHt0aGlzLm9uRGVsZXRlKHRoaXMpOyByZXR1cm4gZmFsc2U7fSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBDbG9zZSB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGUoKTogYm9vbGVhblxuICAgIHtcblxuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJvcGVuLWNsb3NlXCJdJyk7XG5cbiAgICAgICAgaWYoJChlbGVtKS5oYXNDbGFzcygnbWluaWZ5JykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wZW4oKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgdGhlIGRhdGEgaW4gdGhlIHRlbXBsYXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGRhdGFcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkRGF0YSgkZGF0YSkgOiB2b2lkXG4gICAge1xuICAgICAgICBFRl9JbnB1dC5hZGREYXRhVG9FbGVtZW50KHRoaXMuZWxlbWVudCwkZGF0YSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGREYXRhVG9FbGVtZW50KCRlbGVtZW50IDogYW55LCAkZGF0YSA6IGFueSkgOiB2b2lkXG4gICAge1xuICAgICAgICAkZWxlbWVudC5maW5kKCdbbmFtZV49XCJmaWVsZFwiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoZWxlbSkpO1xuXG4gICAgICAgICAgICBpZigkZGF0YVtwcm9wLnByb3BdICYmICRkYXRhW3Byb3AucHJvcF1bcHJvcC5uYW1lXSkge1xuICAgICAgICAgICAgICAgIEVGX0lucHV0LnNldElucHV0VmFsdWUoJChlbGVtKSwkZGF0YVtwcm9wLnByb3BdW3Byb3AubmFtZV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQWRkIGEgdmFsdWUgdG8gYW4gaW5wdXRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0SW5wdXRWYWx1ZShpbnB1dCA6IGFueSwgdmFsdWUgOiBzdHJpbmd8Ym9vbGVhbilcbiAgICB7XG4gICAgICAgIGlmKGlucHV0LmlzKCc6Y2hlY2tib3gnKSl7XG4gICAgICAgICAgICBpZih2YWx1ZSA9PSAnb24nKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5wdXQucHJvcCgnY2hlY2tlZCcsdmFsdWUpO1xuICAgICAgICB9ZWxzZSBpZihpbnB1dC5pcygnc2VsZWN0Jykpe1xuICAgICAgICAgICAgaW5wdXQuZmluZCgnb3B0aW9uW3ZhbHVlPVwiJysgdmFsdWUgKydcIl0nKS5wcm9wKCdzZWxlY3RlZCcsdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGlucHV0LnZhbCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiBhbiBpbnB1dFxuICAgICAqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKiBAcmV0dXJucyBhbnlcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldElucHV0VmFsdWUoaW5wdXQgOiBhbnkpXG4gICAge1xuXG4gICAgICAgIGlmKHR5cGVvZiBpbnB1dC52YWwgIT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmKGlucHV0LmlzKCc6Y2hlY2tib3gnKSl7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQuaXMoJzpjaGVja2VkJyk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnZhbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIGFsbCB0aGUgcHJvcGVydGllcyBvZiBhbiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIGVsZW1cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldElucHV0UHJvcGVydGllcyhlbGVtIDogYW55KSA6IHthdHRyLGlkLHByb3AsbmFtZX1cbiAgICB7XG5cbiAgICAgICAgbGV0IG5hbWUgPSBlbGVtLmF0dHIoJ25hbWUnKTtcblxuICAgICAgICBsZXQgZGF0YSA9IG5hbWUuc3BsaXQoJ1snKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXR0ciA6IGRhdGFbMF0ucmVwbGFjZSgnXScsJycpLFxuICAgICAgICAgICAgaWQgOiBkYXRhWzFdLnJlcGxhY2UoJ10nLCcnKSxcbiAgICAgICAgICAgIHByb3AgOiBkYXRhWzJdID8gZGF0YVsyXS5yZXBsYWNlKCddJywnJykgOiAnJyxcbiAgICAgICAgICAgIG5hbWUgOiBkYXRhWzNdID8gZGF0YVszXS5yZXBsYWNlKCddJywnJykgOiAnJyxcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHNpbmNlIDEuMS4wXG4gICAgICpcbiAgICAgKiBAZXZlbnQgOiBDbGljayBvbiBtaW5pZnkgYnV0dG9uIDogaGlkZSB0aGUgb3B0aW9ucyBvZiB0aGUgZmllbGRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcHVibGljIGNsb3NlKCkgOiBib29sZWFuXG4gICAge1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50LmhpZGUoMjAwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5taW5pZnknKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdtaW5pZnknKVxuICAgICAgICAgICAgLmFkZENsYXNzKCdvcGVuJylcbiAgICAgICAgICAgIC5odG1sKCcrJyk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAc2luY2UgMS4xLjBcbiAgICAgKlxuICAgICAqIE9wZW4gYSBmaWVsZFxuICAgICAqXG4gICAgICogQGV2ZW50IDogQ2xpY2sgb24gb3BlbiBidXR0b24sIHNob3cgdGhlIGZpZWxkIG9wdGlvbnNcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcHVibGljIG9wZW4oKSA6IGJvb2xlYW5cbiAgICB7XG4gICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQuc2hvdygyMDApO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLm9wZW4nKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdvcGVuJylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnbWluaWZ5JylcbiAgICAgICAgICAgIC5odG1sKCctJyk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gdGhlIHZhbHVlIG9mIGFsbCB0aGUgaW5wdXRzIGluIHRoZSBmaWVsZFxuICAgICAqXG4gICAgICovXG4gICAgZ2V0IHZhbHVlKCk6IGFueSB7XG5cbiAgICAgICAgbGV0IHZhbHVlID0ge307XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tuYW1lXj1cImZpZWxkXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGlucHV0IDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoaW5wdXQpKTtcbiAgICAgICAgICAgIGxldCB2YWwgPSBFRl9JbnB1dC5nZXRJbnB1dFZhbHVlKCQoaW5wdXQpKTtcblxuICAgICAgICAgICAgaWYocHJvcC5wcm9wICYmICF2YWx1ZVtwcm9wLnByb3BdICYmIHByb3AubmFtZSl7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5wcm9wXSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih2YWx1ZVtwcm9wLnByb3BdKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5wcm9wXVtwcm9wLm5hbWVdID0gdmFsO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AucHJvcF0gPSB2YWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICB9XG5cblxuICAgIC8vIFZvaWRcbiAgICBzZXQgdmFsdWUodmFsdWUgOiBhbnkpIHsgfVxuXG59IiwiaW1wb3J0IHtFRl9JbnB1dH0gZnJvbSBcIi4uL2lucHV0cy9FRl9JbnB1dFwiO1xuXG5kZWNsYXJlIHZhciAkIDogYW55O1xuXG5leHBvcnQgY2xhc3MgRUZfRm9ybSB7XG5cbiAgICAvKipcbiAgICAgKiBAdmFyIHN0cmluZ1xuICAgICAqXG4gICAgICogVGhlIHR5cGUgb2YgdGhlIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB0eXBlOiBzdHJpbmcgPSAndGV4dCc7XG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgSFRNTCBFbGVtZW50XG4gICAgICpcbiAgICAgKiBUaGUgaHRtbCBlbGVtZW50IG9mIHRoZSBpbnB1dFxuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGVsZW1lbnQ6IGFueTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBIVE1MIGVsZW1lbnQgb2YgdGhlIGNvbnRhaW5lclxuICAgICAqL1xuICAgIHB1YmxpYyBjb250YWluZXIgOiBhbnk7XG5cblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9ICQoJyN1dGlsaXRpZXMnKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICovXG4gICAgcHVibGljIGluaXQoJGVsZW1lbnQgOiBhbnkpXG4gICAge1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoJGVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy5lbGVtZW50KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIHRoZSB2YWx1ZSBvZiBhbGwgdGhlIGlucHV0cyBpbiB0aGUgZmllbGRcbiAgICAgKlxuICAgICAqL1xuICAgIGdldCB2YWx1ZSgpOiBhbnkge1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IHt9O1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixpbnB1dCA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkKGlucHV0KSk7XG4gICAgICAgICAgICBsZXQgdmFsID0gRUZfSW5wdXQuZ2V0SW5wdXRWYWx1ZSgkKGlucHV0KSk7XG5cbiAgICAgICAgICAgIGlmKHByb3AuYXR0ciAmJiAhdmFsdWVbcHJvcC5hdHRyXSAmJiBwcm9wLmlkKXtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLmF0dHJdID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHZhbHVlW3Byb3AuYXR0cl0pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLmF0dHJdW3Byb3AuaWRdID0gdmFsO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AuYXR0cl0gPSB2YWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICB9XG5cblxuXG5cbn0iLCJpbXBvcnQge0VGX0Zvcm19IGZyb20gXCIuL2Zvcm1zL0VGX0Zvcm1cIjtcblxuZGVjbGFyZSB2YXIgJDtcblxuZGVjbGFyZSB2YXIgYWpheFVybCA6IHN0cmluZztcblxuaW1wb3J0IHtFRl9JbnB1dH0gZnJvbSAnLi9pbnB1dHMvRUZfSW5wdXQnO1xuXG5jbGFzcyBFRl9BZGRcbntcblxuXG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgQm9keSBvZiB0aGUgcGFnZVxuICAgICAqL1xuICAgIHB1YmxpYyAkYm9keTtcblxuICAgIC8qKlxuICAgICAqQW4gb2JqZWN0IG9mIGFsbCB0aGUgaW5wdXQgdGVtcGxhdGVzIGNhY2hlZCB0byBhdm9pZCBsYXRlbmN5XG4gICAgICovXG4gICAgcHVibGljIHRlbXBsYXRlcyA6IGFueSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgYWxsIHRoZSBpbnB1dHMgYXZhaWxhYmxlIG9uIHRoZSBwYWdlXG4gICAgICovXG4gICAgcHVibGljIGlucHV0cyA6IEVGX0lucHV0W10gPSBbXTtcblxuXG4gICAgLyoqXG4gICAgICogQWxsIHRoZSBhdmFpbGFibGUgaW5wdXRzXG4gICAgICovXG4gICAgcHVibGljIGF2YWlsYWJsZUlucHV0cyA6IHt9ID0ge307XG5cblxuICAgIC8qKlxuICAgICAqIEFsbCB0aGUgYXZhaWxhYmxlIGlucHV0c1xuICAgICAqL1xuICAgIHB1YmxpYyBhdmFpbGFibGVGb3JtcyA6IHt9ID0ge307XG5cblxuICAgIHB1YmxpYyBmb3JtVHlwZSA6IEVGX0Zvcm07XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgZWRpdG9yIGlzIGluaXRcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNfaW5pdCA6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLiRib2R5ID0gJCgnYm9keScpO1xuXG4gICAgfVxuXG5cbiAgICBwdWJsaWMgaW5pdCgpIHtcblxuICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuXG4gICAgICAgIHRoaXMubG9hZCgpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCBzZXRFdmVudHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIC8qXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcubW92ZScsX21vdmUpO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcudXAnLF91cCk7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5kb3duJyxfZG93bik7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5yZW1vdmVvcHRpb24nLF9yZW1vdmVPcHRpb24pO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcuZHVwbGlxdWVyJyxfZHVwbGljYXRlKTsqL1xuXG4gICAgICAgIC8vIEFkZCBhIG5ldyBmaWVsZFxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub2ZmKCdjbGljaycsJ2J1dHRvbltkYXRhLWFjdGlvbj1cImFkZFwiXScpXG4gICAgICAgICAgICAub24oJ2NsaWNrJywnYnV0dG9uW2RhdGEtYWN0aW9uPVwiYWRkXCJdJywoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRJbnB1dCgndGV4dCcse30pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSwnZmllbGRzJyk7XG4gICAgICAgICAgICAgICAgfSkgfSk7XG5cblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub2ZmKCdjbGljaycsJ3NlbGVjdFtuYW1lPVwic2V0dGluZ3NbdHlwZV1cIl0nKVxuICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cInNldHRpbmdzW3R5cGVdXCJdJywoJGV2ZW50IDogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9ICQoJGV2ZW50LnRhcmdldCkudmFsKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VGb3JtVHlwZSh0eXBlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywnYnV0dG9uW2RhdGEtYWN0aW9uPVwiYWRkLW9wdGlvblwiXScsX2FkZE9wdGlvbik7XG5cblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZSQ9XCJbZm9ybS10YXhvbm9teV1cIl0nLF9jaGFuZ2VUYXhvbm9teSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWU9XCJmb3JtLXJlc2V0LWFjdGlvblwiXScsX2NoYW5nZVJlc2V0QWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgKi9cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJlb3JnYW5pc2UgYWxsIHRoZSBpbnB1dHMgb24gdGhlIHBhZ2UgYWNjb3JkaW5nIHRvIHRoZSBvbmVzXG4gICAgICovXG4gICAgcHVibGljIHJlb3JnYW5pc2UoKSA6IGFueVxuICAgIHtcblxuICAgICAgICBFRl9BZGQubG9hZGluZyh0cnVlLCdmaWVsZHMnKTtcblxuXG4gICAgICAgIGxldCBpbnB1dHMgPSBbXTtcblxuICAgICAgICAkLmVhY2godGhpcy5pbnB1dHMsKGtleSxpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICBpbnB1dHMucHVzaChpbnB1dC52YWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsSW5wdXRzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cywwKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbGwgaW5wdXRzIGZyb20gdHJhY2tcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlQWxsSW5wdXRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmlucHV0cyA9IFtdO1xuICAgICAgICB0aGlzLiRib2R5LmZpbmQoJyNmbGQnKS5odG1sKCcnKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIG9uIGNsaWNrIG9uIHRoZSBkdXBsaWNhdGUgYnV0dG9uXG4gICAgICpcbiAgICAgKiBARXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBvbkR1cGxpY2F0ZShpbnB1dCA6IEVGX0lucHV0KSA6IGFueVxuICAgIHtcblxuICAgICAgICB0aGlzLmFkZElucHV0KGlucHV0LnZhbHVlLmF0dHJpYnV0ZXMudHlwZSxpbnB1dC52YWx1ZSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBFRl9BZGQuc3VjY2VzcyAgPSAnVGhlbSBpbnB1dCBoYXMgYmVlbiBkdXBsaWNhdGVkJztcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIGNoYW5nZSBvZiB0eXBlIGlzIHRyaWdnZXJlZFxuICAgICAqXG4gICAgICogQEV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgb25DaGFuZ2VUeXBlKGlucHV0IDogRUZfSW5wdXQpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmlucHV0cy5pbmRleE9mKGlucHV0KTtcblxuICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dC52YWx1ZTtcblxuICAgICAgICB0aGlzLmFkZElucHV0KHZhbHVlLmF0dHJpYnV0ZXMudHlwZSx2YWx1ZSxwb3NpdGlvbikudGhlbigoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgIGlucHV0Lm9wZW4oKTtcbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIG9uIGRlbGV0ZSBvZiBhbiBpbnB1dFxuICAgICAqXG4gICAgICogQEV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgb25EZWxldGUoaW5wdXQgOiBFRl9JbnB1dCkgOiBhbnlcbiAgICB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHRoaXMuaW5wdXRzLmluZGV4T2YoaW5wdXQpO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzLnNwbGljZShwb3NpdGlvbiwxKTtcblxuICAgICAgICB0aGlzLnJlb3JnYW5pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEFkZCBhbiBpbnB1dCB0byB0aGUgZWRpdG9yXG4gICAgICovXG4gICAgcHVibGljIGFkZElucHV0KHR5cGUgOiBzdHJpbmcgPSAndGV4dCcsJGRhdGEscG9zaXRpb24gOiBudW1iZXJ8bnVsbCA9IG51bGwpIDogUHJvbWlzZTxhbnk+XG4gICAge1xuXG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cblxuICAgICAgICBFRl9BZGQubG9hZGluZyh0cnVlLCdmaWVsZHMnKTtcblxuICAgICAgICAvLyBDbG9zZSBhbGwgdGhlIGlucHV0c1xuICAgICAgICAkLmVhY2godGhpcy5pbnB1dHMsKGtleSA6IG51bWJlciwgaW5wdXQgOiBFRl9JbnB1dCkgPT4ge1xuICAgICAgICAgICAgaW5wdXQuY2xvc2UoKVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmdldElucHV0KHR5cGUpLnRoZW4oKGRhdGEgOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IGlucHV0IDogRUZfSW5wdXQ7XG5cbiAgICAgICAgICAgIGlucHV0ID0gdGhpcy5nZW5lcmF0ZUlucHV0KHR5cGUpO1xuXG4gICAgICAgICAgICBpbnB1dC5pbml0KGRhdGEscG9zaXRpb24gPyBwb3NpdGlvbiA6IHRoaXMuaW5wdXRzLmxlbmd0aCwkZGF0YSxwb3NpdGlvbik7XG5cbiAgICAgICAgICAgIGlucHV0Lm9uRHVwbGljYXRlID0gKGlucHV0KSA9PiB7IHRoaXMub25EdXBsaWNhdGUoaW5wdXQpIH07XG4gICAgICAgICAgICBpbnB1dC5vbkNoYW5nZVR5cGUgPSAoaW5wdXQpID0+IHsgdGhpcy5vbkNoYW5nZVR5cGUoaW5wdXQpIH07XG4gICAgICAgICAgICBpbnB1dC5vbkRlbGV0ZSA9IChpbnB1dCkgPT4geyB0aGlzLm9uRGVsZXRlKGlucHV0KSB9O1xuXG4gICAgICAgICAgICBpZihwb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzW3Bvc2l0aW9uXSA9IGlucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5wdXNoKGlucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGZkLnJlc29sdmUoaW5wdXQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTaG93IG9yIGhpZGUgdGhlIGxvYWRpbmdzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbG9hZGluZ1xuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbG9hZGluZyhsb2FkaW5nIDogYm9vbGVhbiA9IHRydWUsJGVsZW1lbnQgOiBudWxsfHN0cmluZyA9IG51bGwpXG4gICAge1xuICAgICAgICAvLyBTaG93IHRoZSBzcGlubmVyXG5cbiAgICAgICAgc3dpdGNoICgkZWxlbWVudCkge1xuICAgICAgICAgICAgY2FzZSAnZmllbGRzJyA6XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItZmllbGRzJykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndXRpbGl0eScgOlxuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLXV0aWxpdHknKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLXV0aWxpdHknKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItZmllbGRzJykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIExvYWQgdGhlIGZvcm0gZGF0YSBmcm9tIHRoZSBiYWNrIG9mZmljZVxuICAgICAqL1xuICAgIHB1YmxpYyBsb2FkKCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgJC5nZXRKU09OKGFqYXhVcmwsIHtcbiAgICAgICAgICAgIGZvcm1faWQgOiBFRl9BZGQuZ2V0UGFyYW1ldGVyKCdwb3N0JyksXG4gICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX2Zvcm1fZGF0YSdcbiAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAvLyBBZGQgdGhlIGRhdGEgZm9yIGFsbCB0aGUgZm9ybVxuICAgICAgICAgICAgdGhpcy5hZGREYXRhKGRhdGEuZGF0YS5mb3JtKTtcbiAgICAgICAgICAgIHRoaXMuYWRkRm9ybURhdGEoZGF0YS5kYXRhLmZvcm0pO1xuXG5cbiAgICAgICAgICAgICQuZWFjaChkYXRhLmRhdGEuaW5wdXRzLCh0eXBlLGlucHV0IDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVJbnB1dHNbdHlwZV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5kYXRhLmZvcm1zLCh0eXBlLGlucHV0IDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVGb3Jtc1t0eXBlXSA9IGlucHV0O1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBzdWJtaXQgZGF0YVxuICAgICAgICAgICAgaWYoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdCkge1xuICAgICAgICAgICAgICAgIGxldCBzdWJtaXQgPSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkU3VibWl0RGF0YShzdWJtaXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMb2FkIGFsbCB0aGUgaW5wdXRzXG4gICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLDApO1xuXG5cblxuICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgZGF0YSBpbnNpZGUgdGhlIGZvcm0gaXRzZWxmXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZERhdGEoJGZvcm1EYXRhIDogYW55KSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbEluZm9zKCQoZWxlbSksJGZvcm1EYXRhKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJhdHRyaWJ1dGVzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNoYW5nZUZvcm1UeXBlKHR5cGUpIDogdm9pZFxuICAgIHtcblxuICAgICAgICBFRl9BZGQubG9hZGluZyh0cnVlLCd1dGlsaXR5Jyk7XG5cbiAgICAgICAgbGV0ICRmb3JtRGF0YSA9IHRoaXMuZm9ybVR5cGUudmFsdWU7XG5cbiAgICAgICAgJGZvcm1EYXRhLnR5cGUgPSB0eXBlO1xuXG4gICAgICAgIHRoaXMuYWRkRm9ybURhdGEoJGZvcm1EYXRhKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgdGhlIGZvcm0gZGF0YSBpbiB0aGUgZm9ybSB0eXBlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZEZvcm1EYXRhKCRmb3JtRGF0YSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIHRoaXMubG9hZEZvcm1UZW1wbGF0ZSgkZm9ybURhdGEudHlwZSkudGhlbigoJHRlbXBsYXRlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1UeXBlID0gdGhpcy5nZW5lcmF0ZUZvcm0oJGZvcm1EYXRhLnR5cGUpO1xuXG4gICAgICAgICAgICB0aGlzLmZvcm1UeXBlLmluaXQoJHRlbXBsYXRlKTtcblxuICAgICAgICAgICAgJCgnI2VmLWFkZC10eXBlJykuZmluZCgnW25hbWVePVwic2V0dGluZ3NcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCd1dGlsaXR5Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuYWRkUmVxdWlyZWRGaWVsZHMoJGZvcm1EYXRhLnR5cGUpO1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRSZXF1aXJlZEZpZWxkcyh0eXBlIDogc3RyaW5nKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCByZXF1aXJlZCA9IHRoaXMuYXZhaWxhYmxlRm9ybXNbdHlwZV0ucmVxdWlyZWQ7XG5cbiAgICAgICAgJC5lYWNoKHRoaXMuaW5wdXRzLChrZXkgOiBzdHJpbmcsIGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9ICQuaW5BcnJheShpbnB1dC52YWx1ZS5hdHRyaWJ1dGVzLm5hbWUscmVxdWlyZWQpO1xuICAgICAgICAgICAgaWYoaW5kZXggIT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXF1aXJlZC5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBpbnB1dHMgPSBbXTtcblxuICAgICAgICAkLmVhY2gocmVxdWlyZWQsKGtleSA6IG51bWJlcixpbnB1dCA6IHN0cmluZykgPT4ge1xuXG4gICAgICAgICAgICBpbnB1dHMucHVzaCh7YXR0cmlidXRlcyA6e3R5cGUgOiAndGV4dCcsbmFtZSA6IGlucHV0fX0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmKGlucHV0cyAmJiBpbnB1dHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cywgMCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgRUZfQWRkLnN1Y2Nlc3MgPSAnVGhlIGZpZWxkcyAnICsgcmVxdWlyZWQuam9pbignLCAnKSArICcgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBmb3JtJztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZEZvcm1UZW1wbGF0ZSh0eXBlIDogc3RyaW5nKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBsZXQga2V5ID0gJ2Zvcm0tJyArIHR5cGU7XG5cbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGVzW2tleV0gJiYgdGhpcy50ZW1wbGF0ZXNba2V5XSAhPSB1bmRlZmluZWQgJiYgdGhpcy50ZW1wbGF0ZXNba2V5XSAhPSAnJykge1xuICAgICAgICAgICAgZGZkLnJlc29sdmUodGhpcy50ZW1wbGF0ZXNba2V5XSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQuZ2V0KGFqYXhVcmwsIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnYWN0aW9ucycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgOiB0eXBlLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ0VGL2xvYWRfdGVtcGxhdGUnXG4gICAgICAgICAgICB9KS5zdWNjZXNzKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlc1trZXldID0gZGF0YS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhLmRhdGEpO1xuICAgICAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuICAgIH1cblxuXG4gICAgcHVibGljIGZpbGxJbmZvcygkZWxlbSwkZm9ybSkgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkZWxlbSk7XG5cbiAgICAgICAgaWYoJGZvcm1bcHJvcC5hdHRyXSAmJiAkZm9ybVtwcm9wLmF0dHJdW3Byb3AuaWRdKSB7XG5cbiAgICAgICAgICAgIEVGX0lucHV0LnNldElucHV0VmFsdWUoJGVsZW0sJGZvcm1bcHJvcC5hdHRyXVtwcm9wLmlkXSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQWRkIHRoZSBkYXRhIGluc2lkZSB0aGUgc3VibWl0IGJ1dHRvblxuICAgICAqXG4gICAgICogQHBhcmFtIHN1Ym1pdFxuICAgICAqL1xuICAgIHByaXZhdGUgYWRkU3VibWl0RGF0YShzdWJtaXQpIDogdm9pZFxuICAgIHtcbiAgICAgICAgRUZfSW5wdXQuYWRkRGF0YVRvRWxlbWVudCh0aGlzLiRib2R5LmZpbmQoJyNlZi1hZGQtc3VibWl0Jyksc3VibWl0KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogTG9hZCBhbGwgdGhlIGlucHV0cyBmcm9tIHRoZSBsaXN0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRzXG4gICAgICogQHBhcmFtIGRmZFxuICAgICAqIEBwYXJhbSBvcmRlclxuICAgICAqL1xuICAgIHByaXZhdGUgbG9hZElucHV0cyhpbnB1dHMgOiB7IGF0dHJpYnV0ZXMgOiB7dHlwZSA6IHN0cmluZyB9fVtdLG9yZGVyIDogbnVtYmVyLGRmZCAgOiBhbnkgPSBudWxsKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgaWYoIWRmZCkge1xuICAgICAgICAgICAgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoaW5wdXRzKTtcblxuICAgICAgICBsZXQga2V5ID0ga2V5c1tvcmRlcl07XG5cbiAgICAgICAgaWYoIWtleSB8fCAhaW5wdXRzIHx8ICFpbnB1dHNba2V5XSl7XG4gICAgICAgICAgICB0aGlzLmlzX2luaXQgPSB0cnVlO1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ2ZpZWxkcycpO1xuICAgICAgICAgICAgZGZkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmFkZElucHV0KGlucHV0c1trZXldLmF0dHJpYnV0ZXMudHlwZSxpbnB1dHNba2V5XSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgb3JkZXIrKztcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoaW5wdXRzLG9yZGVyLGRmZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuXG4gICAgcHVibGljIGdlbmVyYXRlRm9ybSh0eXBlIDogc3RyaW5nKSA6IEVGX0Zvcm1cbiAgICB7XG4gICAgICAgIGxldCBmb3JtO1xuXG4gICAgICAgIGlmKCF0aGlzLmF2YWlsYWJsZUZvcm1zW3R5cGVdKSB7XG4gICAgICAgICAgICB0eXBlID0gJ3Bvc3QnO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdsb2dpbicgOlxuICAgICAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncG9zdCcgOlxuICAgICAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFmb3JtKSB7XG4gICAgICAgICAgICBmb3JtID0gbmV3IEVGX0Zvcm0oKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcmV0dXJuIGZvcm07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHVibGljIGdlbmVyYXRlSW5wdXQodHlwZSA6IHN0cmluZykgOiBFRl9JbnB1dFxuICAgIHtcbiAgICAgICAgbGV0IGlucHV0O1xuXG4gICAgICAgIGlmKCF0aGlzLmF2YWlsYWJsZUlucHV0c1t0eXBlXSkge1xuICAgICAgICAgICAgdHlwZSA9ICd0ZXh0JztcbiAgICAgICAgfVxuXG5cbiAgICAgICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgICAgICAgIGlucHV0ID0gbmV3IEVGX0lucHV0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZighaW5wdXQpIHtcbiAgICAgICAgICAgIGlucHV0ID0gbmV3IEVGX0lucHV0KCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiBpbnB1dDtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBMb2FkIHRoZSBpbnB1dCB0ZW1wbGF0ZSBmcm9tIHRoZSBCT1xuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGUgOiBzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRJbnB1dCh0eXBlIDogc3RyaW5nID0gJ3RleHQnKVxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXNbdHlwZV0gJiYgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gIT0gdW5kZWZpbmVkICYmIHRoaXMudGVtcGxhdGVzW3R5cGVdICE9ICcnKSB7XG4gICAgICAgICAgICBkZmQucmVzb2x2ZSh0aGlzLnRlbXBsYXRlc1t0eXBlXSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQuZ2V0KGFqYXhVcmwsIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnaW5wdXRzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA6IHR5cGUsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF90ZW1wbGF0ZSdcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW3R5cGVdID0gZGF0YS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhLmRhdGEpO1xuICAgICAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIEhUVFAgRXJyb3JzXG4gICAgICpcbiAgICAgKiBAVE9ET1xuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVFcnJvcihkYXRhIDogc3RyaW5nfHtyZXNwb25zZUpTT04gOiB7ZXJyb3J9fSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIGxldCBlcnJvciA6IHN0cmluZztcblxuICAgICAgICBpZih0eXBlb2YgZGF0YSAhPSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBlcnJvciA9IGRhdGEucmVzcG9uc2VKU09OLmVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgRUZfQWRkLmVycm9yID0gZXJyb3I7XG4gICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlKTtcblxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEdldCB0aGUgdXJsIHBhcmFtZXRlclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtZXRlclxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRQYXJhbWV0ZXIocGFyYW1ldGVyIDogc3RyaW5nKTphbnlcbiAgICB7XG4gICAgICAgIHZhciBwYXJhbXNfc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSk7XG5cbiAgICAgICAgdmFyIHBhcmFtc19hcnJheSA9IHBhcmFtc19zdHJpbmcuc3BsaXQoJyYnKTtcblxuICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgIGZvcih2YXIgaSA9MDtpPHBhcmFtc19hcnJheS5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZSA9IHBhcmFtc19hcnJheVtpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgb2JqW2VbMF1dID0gZVsxXVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9ialtwYXJhbWV0ZXJdO1xuICAgIH1cblxuXG5cblxuICAgIC8qKlxuICAgICAqIERpc3BsYXkgYW4gZXJyb3IgbWVzc2FnZSB0aGF0IHdpbGwgZmFkZSBvdXQgaW4gNSBzZWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCBlcnJvcihlcnJvck1lc3NhZ2UgOiBzdHJpbmd8Ym9vbGVhbikge1xuXG4gICAgICAgIEVGX0FkZC5zZXRNZXNzYWdlKCcjZXJyb3ItbWVzc2FnZScsZXJyb3JNZXNzYWdlLGZhbHNlKTtcblxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIERpc3BsYXkgYSBzdWNjZXNzIG1lc3NhZ2UgdGhhdCB3aWxsIGZhZGUgb3V0IGluIDUgc2VjXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3VjY2Vzc01lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCBzdWNjZXNzKHN1Y2Nlc3NNZXNzYWdlOiBzdHJpbmd8Ym9vbGVhbikge1xuXG4gICAgICAgIEVGX0FkZC5zZXRNZXNzYWdlKCcjc3VjY2Vzcy1tZXNzYWdlJyxzdWNjZXNzTWVzc2FnZSxmYWxzZSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0gcGVyc2lzdCA6IGJvb2xlYW4sIFdlaXRoZXIgb3Igbm90IHRoZSBtZXNzYWdlIHNob3VsZCBiZSBkaXNwbGF5ZWQgb3Igbm90XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXRNZXNzYWdlKGVsZW1lbnQgOiBzdHJpbmcsbWVzc2FnZSA6IHN0cmluZ3xib29sZWFuLCBwZXJzaXN0IDogYm9vbGVhbnxudW1iZXIgPSBmYWxzZSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIGlmKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkudGV4dChtZXNzYWdlKS5mYWRlSW4oMjAwKTtcblxuICAgICAgICAgICAgaWYoIXBlcnNpc3QpIHtcblxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHBlcnNpc3QgaXMgbm90IGVxdWFsIHRvIGZhbHNlXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHBlcnNpc3QgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcnNpc3QgPSA1MDAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1lc3NhZ2UoZWxlbWVudCwnJyk7XG4gICAgICAgICAgICAgICAgfSxwZXJzaXN0KTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkuZmFkZU91dCgyMDAsKCkgPT4ge1xuICAgICAgICAgICAgICAgICQoZWxlbWVudCkudGV4dCgnJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG52YXIgRUZfYWRkID0gbmV3IEVGX0FkZCgpO1xuRUZfYWRkLmluaXQoKTsiXX0=
