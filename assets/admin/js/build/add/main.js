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
                    this.element.find('[data-action="open-close"]').off("click").on("click", function() {
                        return _this.toggle();
                    });
                    this.element.find('[data-action="duplicate"]').off("click").on("click", function() {
                        _this.onDuplicate(_this);
                        return false;
                    });
                    this.element.find('[data-action="change-type"]').off("click").on("click", function() {
                        _this.onChangeType(_this);
                        return false;
                    });
                    this.element.find('[data-action="delete"]').off("click").on("click", function() {
                        _this.onDelete(_this);
                        return false;
                    });
                    this.element.find('[data-action="up"]').off("click").on("click", function() {
                        _this.onMove(_this, "up");
                        return false;
                    });
                    this.element.find('[data-action="down"]').off("click").on("click", function() {
                        _this.onMove(_this, "down");
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
                 *
                 * Called when 2 inputs are moved
                 *
                 * @param input
                 * @param direction
                 */
                EF_Add.prototype.onMove = function(input, direction) {
                    if (direction === void 0) {
                        direction = "up";
                    }
                    var position = this.inputs.indexOf(input);
                    var newpos = direction == "up" ? position - 1 : position + 1;
                    console.log(direction, newpos, position);
                    if (newpos == -1 || newpos == this.inputs.length || !this.inputs[newpos]) {
                        return;
                    }
                    this.switch(position, newpos);
                };
                /**
                 *
                 * Switch 2 inputs
                 *
                 * @param pos1
                 * @param pos2
                 */
                EF_Add.prototype.switch = function(pos1, pos2) {
                    var input1 = this.inputs[pos1];
                    this.inputs[pos1] = this.inputs[pos2];
                    this.inputs[pos2] = input1;
                    this.reorganise();
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
                        input.onMove = function(input, action) {
                            _this.onMove(input, action);
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
                        _this.loadInputs(data.data.form.inputs, 0).then(function() {
                            _this.addRequiredFields(data.data.form.type);
                        });
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
                    this.addRequiredFields($formData.type);
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
                    });
                };
                /**
                 *
                 * @param formType
                 */
                EF_Add.prototype.addRequiredFields = function(formType) {
                    var _this = this;
                    var required = this.availableForms[formType].required;
                    $.each(this.inputs, function(key, input) {
                        var index = $.inArray(input.value.attributes.name, required);
                        if (index != -1) {
                            required.splice(index, 1);
                        }
                    });
                    var inputs = [];
                    $.each(required, function(key, inputName) {
                        // Add the default values inside
                        var input = _this.getAvailableInputData(inputName);
                        input.attributes.name = inputName;
                        console.log(input);
                        inputs.push(input);
                    });
                    if (inputs && inputs.length > 0) {
                        this.loadInputs(inputs, 0).then(function() {
                            EF_Add.success = "The fields " + required.join(", ") + " have been added to the form";
                        });
                    }
                };
                /**
                 *
                 * @param inputType
                 */
                EF_Add.prototype.getAvailableInputData = function(inputType) {
                    var input;
                    if (this.availableInputs[inputType]) {
                        input = this.availableInputs[inputType].data;
                    } else {
                        input = this.availableInputs["text"].data;
                    }
                    return input;
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
                        return dfd.promise();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2lucHV0cy9FRl9JbnB1dC50cyIsImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2Zvcm1zL0VGX0Zvcm0udHMiLCJhc3NldHMvYWRtaW4vanMvc3JjL2FkZC9FRl9BZGQudHMiXSwibmFtZXMiOlsiRUZfSW5wdXQiLCJ0aGlzIiwiY29udGFpbmVyIiwiJCIsInByb3RvdHlwZSIsImluaXQiLCIkZWxlbWVudCIsImlkIiwiJGRhdGEiLCJwb3NpdGlvbiIsInJlcGxhY2UiLCJlbGVtZW50Iiwib3B0aW9uc0VsZW1lbnQiLCJmaW5kIiwiYXBwZW5kIiwicmVwbGFjZVdpdGgiLCJzZXRFdmVudHMiLCJhZGREYXRhIiwiX3RoaXMiLCJvZmYiLCJvbiIsInRvZ2dsZSIsIm9uRHVwbGljYXRlIiwib25DaGFuZ2VUeXBlIiwib25EZWxldGUiLCJvbk1vdmUiLCJlbGVtIiwiaGFzQ2xhc3MiLCJjbG9zZSIsIm9wZW4iLCJhZGREYXRhVG9FbGVtZW50IiwiZWFjaCIsImtleSIsInByb3AiLCJnZXRJbnB1dFByb3BlcnRpZXMiLCJuYW1lIiwic2V0SW5wdXRWYWx1ZSIsImlucHV0IiwidmFsdWUiLCJpcyIsInZhbCIsImdldElucHV0VmFsdWUiLCJhdHRyIiwiZGF0YSIsInNwbGl0IiwiaGlkZSIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJodG1sIiwic2hvdyIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwidHlwZSIsIkVGX0Zvcm0iLCJFRl9JbnB1dF8xIiwiRUZfQWRkIiwidGVtcGxhdGVzIiwiaW5wdXRzIiwiYXZhaWxhYmxlSW5wdXRzIiwiYXZhaWxhYmxlRm9ybXMiLCJpc19pbml0IiwiJGJvZHkiLCJsb2FkIiwidGhlbiIsImFkZElucHV0IiwibG9hZGluZyIsIiRldmVudCIsInRhcmdldCIsImNoYW5nZUZvcm1UeXBlIiwicmVvcmdhbmlzZSIsInB1c2giLCJyZW1vdmVBbGxJbnB1dHMiLCJsb2FkSW5wdXRzIiwiZGlyZWN0aW9uIiwiaW5kZXhPZiIsIm5ld3BvcyIsImNvbnNvbGUiLCJsb2ciLCJsZW5ndGgiLCJzd2l0Y2giLCJwb3MxIiwicG9zMiIsImlucHV0MSIsImF0dHJpYnV0ZXMiLCJzdWNjZXNzIiwic3BsaWNlIiwiZGZkIiwiRGVmZXJyZWQiLCJnZXRJbnB1dCIsImdlbmVyYXRlSW5wdXQiLCJhY3Rpb24iLCJyZXNvbHZlIiwicHJvbWlzZSIsImdldEpTT04iLCJhamF4VXJsIiwiZm9ybV9pZCIsImdldFBhcmFtZXRlciIsImZvcm0iLCJhZGRGb3JtRGF0YSIsImZvcm1zIiwic3VibWl0IiwiYWRkU3VibWl0RGF0YSIsImFkZFJlcXVpcmVkRmllbGRzIiwiZXJyb3IiLCJoYW5kbGVFcnJvciIsIiRmb3JtRGF0YSIsImZpbGxJbmZvcyIsImZvcm1UeXBlIiwibG9hZEZvcm1UZW1wbGF0ZSIsIiR0ZW1wbGF0ZSIsImdlbmVyYXRlRm9ybSIsInJlcXVpcmVkIiwiaW5kZXgiLCJpbkFycmF5IiwiaW5wdXROYW1lIiwiZ2V0QXZhaWxhYmxlSW5wdXREYXRhIiwiam9pbiIsImlucHV0VHlwZSIsInVuZGVmaW5lZCIsImdldCIsInRlbXBsYXRlIiwiJGVsZW0iLCIkZm9ybSIsIkVGX0lucHV0XzIiLCJvcmRlciIsImtleXMiLCJFRl9Gb3JtXzEiLCJyZXNwb25zZUpTT04iLCJwYXJhbWV0ZXIiLCJwYXJhbXNfc3RyaW5nIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJzdWJzdHIiLCJwYXJhbXNfYXJyYXkiLCJvYmoiLCJpIiwiZSIsImVycm9yTWVzc2FnZSIsInNldE1lc3NhZ2UiLCJzdWNjZXNzTWVzc2FnZSIsIm1lc3NhZ2UiLCJwZXJzaXN0IiwidGV4dCIsImZhZGVJbiIsInNldFRpbWVvdXQiLCJmYWRlT3V0IiwiRUZfYWRkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztnQkFtREksU0FBQUE7b0JBRUlDLEtBQUtDLFlBQVlDLEVBQUU7Ozs7Ozs7OztnQkFZaEJILFNBQUFJLFVBQUFDLE9BQVAsU0FB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bEQsSUFBSUMsZUFBZUwsY0FBY3JGLE1BQU07b0JBRXZDLElBQUkyRjtvQkFDSixLQUFJLElBQUlDLElBQUcsR0FBRUEsSUFBRUYsYUFBYXhELFFBQU8wRCxLQUNuQzt3QkFDSSxJQUFJQyxJQUFJSCxhQUFhRSxHQUFHNUYsTUFBTTt3QkFDOUIyRixJQUFJRSxFQUFFLE1BQU1BLEVBQUU7O29CQUdsQixPQUFPRixJQUFJUDs7Z0JBV2Y5RSxPQUFBQyxlQUFrQkksUUFBQTs7Ozs7O3lCQUFsQixTQUF3Qm1GO3dCQUVwQm5GLE9BQU9vRixXQUFXLGtCQUFpQkQsY0FBYTs7Ozs7Z0JBWXBEeEYsT0FBQUMsZUFBa0JJLFFBQUE7Ozs7Ozs7eUJBQWxCLFNBQTBCcUY7d0JBRXRCckYsT0FBT29GLFdBQVcsb0JBQW1CQyxnQkFBZTs7Ozs7Ozs7Ozs7Z0JBVTFDckYsT0FBQW9GLGFBQWQsU0FBeUJoSSxTQUFpQmtJLFNBQTBCQztvQkFBcEUsSUFBQTVILFFBQUFqQjtvQkFBb0UsSUFBQTZJLGlCQUFBLEdBQUE7d0JBQUFBLFVBQUE7O29CQUdoRSxJQUFHRCxTQUFTO3dCQUNSMUksRUFBRVEsU0FBU29JLEtBQUtGLFNBQVNHLE9BQU87d0JBRWhDLEtBQUlGLFNBQVM7OzRCQUdULFdBQVVBLFlBQVksV0FBVztnQ0FDN0JBLFVBQVU7OzRCQUdkRyxXQUFXO2dDQUNQL0gsTUFBS3lILFdBQVdoSSxTQUFROytCQUMxQm1JOzsyQkFJSjt3QkFDRjNJLEVBQUVRLFNBQVN1SSxRQUFRLEtBQUk7NEJBQ25CL0ksRUFBRVEsU0FBU29JLEtBQUs7Ozs7Z0JBS2hDLE9BQUF4Rjs7WUFFSTRGLFNBQVMsSUFBSTVGO1lBQ2pCNEYsT0FBTzlJIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBFRl9JbnB1dFxue1xuXG4gICAgLyoqXG4gICAgICogQHZhciBzdHJpbmdcbiAgICAgKlxuICAgICAqIFRoZSB0eXBlIG9mIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdHlwZSA6IHN0cmluZyA9ICd0ZXh0JztcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgb2YgdGhlIGlucHV0XG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgZWxlbWVudCA6IGFueTtcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgZm9yIHRoZSBvcHRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgb3B0aW9uc0VsZW1lbnQgOiBhbnk7XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBpZCAocG9zaXRpb24pIG9mIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBpZCA6IG51bWJlcjtcblxuXG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgY29udGFpbmVyXG4gICAgICovXG4gICAgcHVibGljIGNvbnRhaW5lciA6IGFueTtcblxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gY2FsbGVkIG9uIGR1cGxpY2F0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBvbkR1cGxpY2F0ZSA6IGFueTtcbiAgICBwdWJsaWMgb25DaGFuZ2VUeXBlIDogYW55O1xuICAgIHB1YmxpYyBvbkRlbGV0ZSA6IGFueTtcbiAgICBwdWJsaWMgb25Nb3ZlIDogYW55O1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gJCgnI2ZsZCcpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqIEBwYXJhbSAkZGF0YVxuICAgICAqIEBwYXJhbSBpZFxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiA6IG51bWJlclxuICAgICAqL1xuICAgIHB1YmxpYyBpbml0KCRlbGVtZW50IDogYW55LCBpZCA6IG51bWJlciwkZGF0YSA6IGFueSxwb3NpdGlvbiA6IG51bGx8bnVtYmVyID0gbnVsbClcbiAgICB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcblxuICAgICAgICAkZWxlbWVudCA9ICRlbGVtZW50LnJlcGxhY2UoL2ZpZWxkVW5JZC9nLGlkKzEpO1xuICAgICAgICAkZWxlbWVudCA9ICRlbGVtZW50LnJlcGxhY2UoL2ZpZWxkSWQvZyxpZCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJCgkZWxlbWVudCk7XG4gICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmVmLXRhYmxlJyk7XG5cbiAgICAgICAgaWYobnVsbCA9PT0gcG9zaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5maW5kKCcjZmllbGQtJyArIHBvc2l0aW9uKS5yZXBsYWNlV2l0aCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRFdmVudHMoKTtcblxuICAgICAgICB0aGlzLmFkZERhdGEoJGRhdGEpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogU2V0IGFsbCB0aGUgZXZlbnRzIGxpbmtlZCB0byB0aGlzIGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0RXZlbnRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwib3Blbi1jbG9zZVwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHtyZXR1cm4gdGhpcy50b2dnbGUoKX0pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwiZHVwbGljYXRlXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3RoaXMub25EdXBsaWNhdGUodGhpcyk7IHJldHVybiBmYWxzZTt9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cImNoYW5nZS10eXBlXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3RoaXMub25DaGFuZ2VUeXBlKHRoaXMpOyByZXR1cm4gZmFsc2U7fSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJkZWxldGVcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7dGhpcy5vbkRlbGV0ZSh0aGlzKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwidXBcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7dGhpcy5vbk1vdmUodGhpcywndXAnKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwiZG93blwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHt0aGlzLm9uTW92ZSh0aGlzLCdkb3duJyk7IHJldHVybiBmYWxzZTt9KTtcbiAgICB9XG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBDbG9zZSB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGUoKTogYm9vbGVhblxuICAgIHtcblxuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJvcGVuLWNsb3NlXCJdJyk7XG5cbiAgICAgICAgaWYoJChlbGVtKS5oYXNDbGFzcygnbWluaWZ5JykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wZW4oKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgdGhlIGRhdGEgaW4gdGhlIHRlbXBsYXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGRhdGFcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkRGF0YSgkZGF0YSkgOiB2b2lkXG4gICAge1xuICAgICAgICBFRl9JbnB1dC5hZGREYXRhVG9FbGVtZW50KHRoaXMuZWxlbWVudCwkZGF0YSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGREYXRhVG9FbGVtZW50KCRlbGVtZW50IDogYW55LCAkZGF0YSA6IGFueSkgOiB2b2lkXG4gICAge1xuICAgICAgICAkZWxlbWVudC5maW5kKCdbbmFtZV49XCJmaWVsZFwiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoZWxlbSkpO1xuXG4gICAgICAgICAgICBpZigkZGF0YVtwcm9wLnByb3BdICYmICRkYXRhW3Byb3AucHJvcF1bcHJvcC5uYW1lXSkge1xuICAgICAgICAgICAgICAgIEVGX0lucHV0LnNldElucHV0VmFsdWUoJChlbGVtKSwkZGF0YVtwcm9wLnByb3BdW3Byb3AubmFtZV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQWRkIGEgdmFsdWUgdG8gYW4gaW5wdXRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0SW5wdXRWYWx1ZShpbnB1dCA6IGFueSwgdmFsdWUgOiBzdHJpbmd8Ym9vbGVhbilcbiAgICB7XG4gICAgICAgIGlmKGlucHV0LmlzKCc6Y2hlY2tib3gnKSl7XG4gICAgICAgICAgICBpZih2YWx1ZSA9PSAnb24nKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5wdXQucHJvcCgnY2hlY2tlZCcsdmFsdWUpO1xuICAgICAgICB9ZWxzZSBpZihpbnB1dC5pcygnc2VsZWN0Jykpe1xuICAgICAgICAgICAgaW5wdXQuZmluZCgnb3B0aW9uW3ZhbHVlPVwiJysgdmFsdWUgKydcIl0nKS5wcm9wKCdzZWxlY3RlZCcsdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGlucHV0LnZhbCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiBhbiBpbnB1dFxuICAgICAqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKiBAcmV0dXJucyBhbnlcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldElucHV0VmFsdWUoaW5wdXQgOiBhbnkpXG4gICAge1xuXG4gICAgICAgIGlmKHR5cGVvZiBpbnB1dC52YWwgIT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmKGlucHV0LmlzKCc6Y2hlY2tib3gnKSl7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQuaXMoJzpjaGVja2VkJyk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnZhbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIGFsbCB0aGUgcHJvcGVydGllcyBvZiBhbiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIGVsZW1cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldElucHV0UHJvcGVydGllcyhlbGVtIDogYW55KSA6IHthdHRyLGlkLHByb3AsbmFtZX1cbiAgICB7XG5cbiAgICAgICAgbGV0IG5hbWUgPSBlbGVtLmF0dHIoJ25hbWUnKTtcblxuICAgICAgICBsZXQgZGF0YSA9IG5hbWUuc3BsaXQoJ1snKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXR0ciA6IGRhdGFbMF0ucmVwbGFjZSgnXScsJycpLFxuICAgICAgICAgICAgaWQgOiBkYXRhWzFdLnJlcGxhY2UoJ10nLCcnKSxcbiAgICAgICAgICAgIHByb3AgOiBkYXRhWzJdID8gZGF0YVsyXS5yZXBsYWNlKCddJywnJykgOiAnJyxcbiAgICAgICAgICAgIG5hbWUgOiBkYXRhWzNdID8gZGF0YVszXS5yZXBsYWNlKCddJywnJykgOiAnJyxcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHNpbmNlIDEuMS4wXG4gICAgICpcbiAgICAgKiBAZXZlbnQgOiBDbGljayBvbiBtaW5pZnkgYnV0dG9uIDogaGlkZSB0aGUgb3B0aW9ucyBvZiB0aGUgZmllbGRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcHVibGljIGNsb3NlKCkgOiBib29sZWFuXG4gICAge1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50LmhpZGUoMjAwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5taW5pZnknKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdtaW5pZnknKVxuICAgICAgICAgICAgLmFkZENsYXNzKCdvcGVuJylcbiAgICAgICAgICAgIC5odG1sKCcrJyk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAc2luY2UgMS4xLjBcbiAgICAgKlxuICAgICAqIE9wZW4gYSBmaWVsZFxuICAgICAqXG4gICAgICogQGV2ZW50IDogQ2xpY2sgb24gb3BlbiBidXR0b24sIHNob3cgdGhlIGZpZWxkIG9wdGlvbnNcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcHVibGljIG9wZW4oKSA6IGJvb2xlYW5cbiAgICB7XG4gICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQuc2hvdygyMDApO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLm9wZW4nKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdvcGVuJylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnbWluaWZ5JylcbiAgICAgICAgICAgIC5odG1sKCctJyk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gdGhlIHZhbHVlIG9mIGFsbCB0aGUgaW5wdXRzIGluIHRoZSBmaWVsZFxuICAgICAqXG4gICAgICovXG4gICAgZ2V0IHZhbHVlKCk6IGFueSB7XG5cbiAgICAgICAgbGV0IHZhbHVlID0ge307XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tuYW1lXj1cImZpZWxkXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGlucHV0IDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoaW5wdXQpKTtcbiAgICAgICAgICAgIGxldCB2YWwgPSBFRl9JbnB1dC5nZXRJbnB1dFZhbHVlKCQoaW5wdXQpKTtcblxuICAgICAgICAgICAgaWYocHJvcC5wcm9wICYmICF2YWx1ZVtwcm9wLnByb3BdICYmIHByb3AubmFtZSl7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5wcm9wXSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih2YWx1ZVtwcm9wLnByb3BdKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5wcm9wXVtwcm9wLm5hbWVdID0gdmFsO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AucHJvcF0gPSB2YWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICB9XG5cblxuICAgIC8vIFZvaWRcbiAgICBzZXQgdmFsdWUodmFsdWUgOiBhbnkpIHsgfVxuXG59IiwiaW1wb3J0IHtFRl9JbnB1dH0gZnJvbSBcIi4uL2lucHV0cy9FRl9JbnB1dFwiO1xuXG5kZWNsYXJlIHZhciAkIDogYW55O1xuXG5leHBvcnQgY2xhc3MgRUZfRm9ybSB7XG5cbiAgICAvKipcbiAgICAgKiBAdmFyIHN0cmluZ1xuICAgICAqXG4gICAgICogVGhlIHR5cGUgb2YgdGhlIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB0eXBlOiBzdHJpbmcgPSAndGV4dCc7XG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgSFRNTCBFbGVtZW50XG4gICAgICpcbiAgICAgKiBUaGUgaHRtbCBlbGVtZW50IG9mIHRoZSBpbnB1dFxuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGVsZW1lbnQ6IGFueTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBIVE1MIGVsZW1lbnQgb2YgdGhlIGNvbnRhaW5lclxuICAgICAqL1xuICAgIHB1YmxpYyBjb250YWluZXIgOiBhbnk7XG5cblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9ICQoJyN1dGlsaXRpZXMnKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICovXG4gICAgcHVibGljIGluaXQoJGVsZW1lbnQgOiBhbnkpXG4gICAge1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoJGVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy5lbGVtZW50KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIHRoZSB2YWx1ZSBvZiBhbGwgdGhlIGlucHV0cyBpbiB0aGUgZmllbGRcbiAgICAgKlxuICAgICAqL1xuICAgIGdldCB2YWx1ZSgpOiBhbnkge1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IHt9O1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixpbnB1dCA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkKGlucHV0KSk7XG4gICAgICAgICAgICBsZXQgdmFsID0gRUZfSW5wdXQuZ2V0SW5wdXRWYWx1ZSgkKGlucHV0KSk7XG5cbiAgICAgICAgICAgIGlmKHByb3AuYXR0ciAmJiAhdmFsdWVbcHJvcC5hdHRyXSAmJiBwcm9wLmlkKXtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLmF0dHJdID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHZhbHVlW3Byb3AuYXR0cl0pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLmF0dHJdW3Byb3AuaWRdID0gdmFsO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AuYXR0cl0gPSB2YWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICB9XG5cblxuXG5cbn0iLCJpbXBvcnQge0VGX0Zvcm19IGZyb20gXCIuL2Zvcm1zL0VGX0Zvcm1cIjtcblxuZGVjbGFyZSB2YXIgJDtcblxuZGVjbGFyZSB2YXIgYWpheFVybCA6IHN0cmluZztcblxuaW1wb3J0IHtFRl9JbnB1dH0gZnJvbSAnLi9pbnB1dHMvRUZfSW5wdXQnO1xuXG5jbGFzcyBFRl9BZGRcbntcblxuXG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgQm9keSBvZiB0aGUgcGFnZVxuICAgICAqL1xuICAgIHB1YmxpYyAkYm9keTtcblxuICAgIC8qKlxuICAgICAqQW4gb2JqZWN0IG9mIGFsbCB0aGUgaW5wdXQgdGVtcGxhdGVzIGNhY2hlZCB0byBhdm9pZCBsYXRlbmN5XG4gICAgICovXG4gICAgcHVibGljIHRlbXBsYXRlcyA6IGFueSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgYWxsIHRoZSBpbnB1dHMgYXZhaWxhYmxlIG9uIHRoZSBwYWdlXG4gICAgICovXG4gICAgcHVibGljIGlucHV0cyA6IEVGX0lucHV0W10gPSBbXTtcblxuXG4gICAgLyoqXG4gICAgICogQWxsIHRoZSBhdmFpbGFibGUgaW5wdXRzXG4gICAgICovXG4gICAgcHVibGljIGF2YWlsYWJsZUlucHV0cyA6IHt9ID0ge307XG5cblxuICAgIC8qKlxuICAgICAqIEFsbCB0aGUgYXZhaWxhYmxlIGlucHV0c1xuICAgICAqL1xuICAgIHB1YmxpYyBhdmFpbGFibGVGb3JtcyA6IHt9ID0ge307XG5cblxuICAgIHB1YmxpYyBmb3JtVHlwZSA6IEVGX0Zvcm07XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgZWRpdG9yIGlzIGluaXRcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNfaW5pdCA6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLiRib2R5ID0gJCgnYm9keScpO1xuXG4gICAgfVxuXG5cbiAgICBwdWJsaWMgaW5pdCgpIHtcblxuICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuXG4gICAgICAgIHRoaXMubG9hZCgpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCBzZXRFdmVudHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIC8qXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcubW92ZScsX21vdmUpO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcudXAnLF91cCk7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5kb3duJyxfZG93bik7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5yZW1vdmVvcHRpb24nLF9yZW1vdmVPcHRpb24pO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcuZHVwbGlxdWVyJyxfZHVwbGljYXRlKTsqL1xuXG4gICAgICAgIC8vIEFkZCBhIG5ldyBmaWVsZFxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub2ZmKCdjbGljaycsJ2J1dHRvbltkYXRhLWFjdGlvbj1cImFkZFwiXScpXG4gICAgICAgICAgICAub24oJ2NsaWNrJywnYnV0dG9uW2RhdGEtYWN0aW9uPVwiYWRkXCJdJywoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRJbnB1dCgndGV4dCcse30pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSwnZmllbGRzJyk7XG4gICAgICAgICAgICAgICAgfSkgfSk7XG5cblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub2ZmKCdjbGljaycsJ3NlbGVjdFtuYW1lPVwic2V0dGluZ3NbdHlwZV1cIl0nKVxuICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cInNldHRpbmdzW3R5cGVdXCJdJywoJGV2ZW50IDogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9ICQoJGV2ZW50LnRhcmdldCkudmFsKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VGb3JtVHlwZSh0eXBlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywnYnV0dG9uW2RhdGEtYWN0aW9uPVwiYWRkLW9wdGlvblwiXScsX2FkZE9wdGlvbik7XG5cblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZSQ9XCJbZm9ybS10YXhvbm9teV1cIl0nLF9jaGFuZ2VUYXhvbm9teSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWU9XCJmb3JtLXJlc2V0LWFjdGlvblwiXScsX2NoYW5nZVJlc2V0QWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgKi9cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJlb3JnYW5pc2UgYWxsIHRoZSBpbnB1dHMgb24gdGhlIHBhZ2UgYWNjb3JkaW5nIHRvIHRoZSBvbmVzXG4gICAgICovXG4gICAgcHVibGljIHJlb3JnYW5pc2UoKSA6IGFueVxuICAgIHtcblxuICAgICAgICBFRl9BZGQubG9hZGluZyh0cnVlLCdmaWVsZHMnKTtcblxuXG4gICAgICAgIGxldCBpbnB1dHMgPSBbXTtcblxuICAgICAgICAkLmVhY2godGhpcy5pbnB1dHMsKGtleSxpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICBpbnB1dHMucHVzaChpbnB1dC52YWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsSW5wdXRzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cywwKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIENhbGxlZCB3aGVuIDIgaW5wdXRzIGFyZSBtb3ZlZFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICogQHBhcmFtIGRpcmVjdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBvbk1vdmUoaW5wdXQgOiBFRl9JbnB1dCxkaXJlY3Rpb24gOiBzdHJpbmcgPSAndXAnKSA6IGFueVxuICAgIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5pbnB1dHMuaW5kZXhPZihpbnB1dCk7XG5cbiAgICAgICAgbGV0IG5ld3BvcyA9IGRpcmVjdGlvbiA9PSAndXAnID8gcG9zaXRpb24tMSA6IHBvc2l0aW9uICsxO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGRpcmVjdGlvbixuZXdwb3MscG9zaXRpb24pO1xuXG4gICAgICAgIGlmKG5ld3BvcyA9PSAtMSB8fCBuZXdwb3MgPT0gdGhpcy5pbnB1dHMubGVuZ3RoIHx8ICF0aGlzLmlucHV0c1tuZXdwb3NdKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3dpdGNoKHBvc2l0aW9uLG5ld3Bvcyk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFN3aXRjaCAyIGlucHV0c1xuICAgICAqXG4gICAgICogQHBhcmFtIHBvczFcbiAgICAgKiBAcGFyYW0gcG9zMlxuICAgICAqL1xuICAgIHB1YmxpYyBzd2l0Y2gocG9zMSA6IG51bWJlciwgcG9zMjogbnVtYmVyKVxuICAgIHtcbiAgICAgICAgbGV0IGlucHV0MSA9IHRoaXMuaW5wdXRzW3BvczFdO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzW3BvczFdID0gdGhpcy5pbnB1dHNbcG9zMl07XG5cbiAgICAgICAgdGhpcy5pbnB1dHNbcG9zMl0gPSBpbnB1dDE7XG5cbiAgICAgICAgdGhpcy5yZW9yZ2FuaXNlKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYWxsIGlucHV0cyBmcm9tIHRyYWNrXG4gICAgICovXG4gICAgcHVibGljIHJlbW92ZUFsbElucHV0cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5pbnB1dHMgPSBbXTtcbiAgICAgICAgdGhpcy4kYm9keS5maW5kKCcjZmxkJykuaHRtbCgnJyk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIENhbGxlZCBvbiBjbGljayBvbiB0aGUgZHVwbGljYXRlIGJ1dHRvblxuICAgICAqXG4gICAgICogQEV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgb25EdXBsaWNhdGUoaW5wdXQgOiBFRl9JbnB1dCkgOiBhbnlcbiAgICB7XG5cbiAgICAgICAgdGhpcy5hZGRJbnB1dChpbnB1dC52YWx1ZS5hdHRyaWJ1dGVzLnR5cGUsaW5wdXQudmFsdWUpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgRUZfQWRkLnN1Y2Nlc3MgID0gJ1RoZW0gaW5wdXQgaGFzIGJlZW4gZHVwbGljYXRlZCc7XG4gICAgICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSk7XG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBjaGFuZ2Ugb2YgdHlwZSBpcyB0cmlnZ2VyZWRcbiAgICAgKlxuICAgICAqIEBFdmVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIG9uQ2hhbmdlVHlwZShpbnB1dCA6IEVGX0lucHV0KSA6IGFueVxuICAgIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5pbnB1dHMuaW5kZXhPZihpbnB1dCk7XG5cbiAgICAgICAgbGV0IHZhbHVlID0gaW5wdXQudmFsdWU7XG5cbiAgICAgICAgdGhpcy5hZGRJbnB1dCh2YWx1ZS5hdHRyaWJ1dGVzLnR5cGUsdmFsdWUscG9zaXRpb24pLnRoZW4oKGlucHV0KSA9PiB7XG4gICAgICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSwnZmllbGRzJyk7XG4gICAgICAgICAgICBpbnB1dC5vcGVuKCk7XG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIENhbGxlZCBvbiBkZWxldGUgb2YgYW4gaW5wdXRcbiAgICAgKlxuICAgICAqIEBFdmVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIG9uRGVsZXRlKGlucHV0IDogRUZfSW5wdXQpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmlucHV0cy5pbmRleE9mKGlucHV0KTtcblxuICAgICAgICB0aGlzLmlucHV0cy5zcGxpY2UocG9zaXRpb24sMSk7XG5cbiAgICAgICAgdGhpcy5yZW9yZ2FuaXNlKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYW4gaW5wdXQgdG8gdGhlIGVkaXRvclxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRJbnB1dCh0eXBlIDogc3RyaW5nID0gJ3RleHQnLCRkYXRhLHBvc2l0aW9uIDogbnVtYmVyfG51bGwgPSBudWxsKSA6IFByb21pc2U8YW55PlxuICAgIHtcblxuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG5cbiAgICAgICAgRUZfQWRkLmxvYWRpbmcodHJ1ZSwnZmllbGRzJyk7XG5cbiAgICAgICAgLy8gQ2xvc2UgYWxsIHRoZSBpbnB1dHNcbiAgICAgICAgJC5lYWNoKHRoaXMuaW5wdXRzLChrZXkgOiBudW1iZXIsIGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgIGlucHV0LmNsb3NlKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5nZXRJbnB1dCh0eXBlKS50aGVuKChkYXRhIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBpbnB1dCA6IEVGX0lucHV0O1xuXG4gICAgICAgICAgICBpbnB1dCA9IHRoaXMuZ2VuZXJhdGVJbnB1dCh0eXBlKTtcblxuICAgICAgICAgICAgaW5wdXQuaW5pdChkYXRhLHBvc2l0aW9uID8gcG9zaXRpb24gOiB0aGlzLmlucHV0cy5sZW5ndGgsJGRhdGEscG9zaXRpb24pO1xuXG4gICAgICAgICAgICBpbnB1dC5vbkR1cGxpY2F0ZSA9IChpbnB1dCA6IEVGX0lucHV0ICkgPT4geyB0aGlzLm9uRHVwbGljYXRlKGlucHV0KSB9O1xuICAgICAgICAgICAgaW5wdXQub25DaGFuZ2VUeXBlID0gKGlucHV0IDogRUZfSW5wdXQpID0+IHsgdGhpcy5vbkNoYW5nZVR5cGUoaW5wdXQpIH07XG4gICAgICAgICAgICBpbnB1dC5vbkRlbGV0ZSA9IChpbnB1dCA6IEVGX0lucHV0KSA9PiB7IHRoaXMub25EZWxldGUoaW5wdXQpIH07XG4gICAgICAgICAgICBpbnB1dC5vbk1vdmUgPSAoaW5wdXQ6ICBFRl9JbnB1dCwgYWN0aW9uIDogc3RyaW5nKSA9PiB7IHRoaXMub25Nb3ZlKGlucHV0LGFjdGlvbikgfTtcblxuICAgICAgICAgICAgaWYocG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0c1twb3NpdGlvbl0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMucHVzaChpbnB1dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKGlucHV0KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogU2hvdyBvciBoaWRlIHRoZSBsb2FkaW5nc1xuICAgICAqXG4gICAgICogQHBhcmFtIGxvYWRpbmdcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGxvYWRpbmcobG9hZGluZyA6IGJvb2xlYW4gPSB0cnVlLCRlbGVtZW50IDogbnVsbHxzdHJpbmcgPSBudWxsKVxuICAgIHtcbiAgICAgICAgLy8gU2hvdyB0aGUgc3Bpbm5lclxuXG4gICAgICAgIHN3aXRjaCAoJGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNhc2UgJ2ZpZWxkcycgOlxuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLWZpZWxkcycpLnRvZ2dsZShsb2FkaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3V0aWxpdHknIDpcbiAgICAgICAgICAgICAgICAkKCcjc3Bpbm5lci11dGlsaXR5JykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAkKCcjc3Bpbm5lci11dGlsaXR5JykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLWZpZWxkcycpLnRvZ2dsZShsb2FkaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBMb2FkIHRoZSBmb3JtIGRhdGEgZnJvbSB0aGUgYmFjayBvZmZpY2VcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZCgpIDogUHJvbWlzZTxhbnk+XG4gICAge1xuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG4gICAgICAgICQuZ2V0SlNPTihhamF4VXJsLCB7XG4gICAgICAgICAgICBmb3JtX2lkIDogRUZfQWRkLmdldFBhcmFtZXRlcigncG9zdCcpLFxuICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF9mb3JtX2RhdGEnXG4gICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBkYXRhIGZvciBhbGwgdGhlIGZvcm1cbiAgICAgICAgICAgIHRoaXMuYWRkRGF0YShkYXRhLmRhdGEuZm9ybSk7XG4gICAgICAgICAgICB0aGlzLmFkZEZvcm1EYXRhKGRhdGEuZGF0YS5mb3JtKTtcblxuXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5kYXRhLmlucHV0cywodHlwZSxpbnB1dCA6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlSW5wdXRzW3R5cGVdID0gaW5wdXQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJC5lYWNoKGRhdGEuZGF0YS5mb3JtcywodHlwZSxpbnB1dCA6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlRm9ybXNbdHlwZV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgIC8vIEFkZCB0aGUgc3VibWl0IGRhdGFcbiAgICAgICAgICAgIGlmKGRhdGEuZGF0YS5mb3JtLmlucHV0cy5zdWJtaXQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3VibWl0ID0gZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdDtcbiAgICAgICAgICAgICAgICBkZWxldGUgZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdDtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFN1Ym1pdERhdGEoc3VibWl0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTG9hZCBhbGwgdGhlIGlucHV0c1xuICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGRhdGEuZGF0YS5mb3JtLmlucHV0cywwKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFJlcXVpcmVkRmllbGRzKGRhdGEuZGF0YS5mb3JtLnR5cGUpO1xuICAgICAgICAgICAgfSk7XG5cblxuXG4gICAgICAgICAgICAvLyBJIHNlbmQgYmFjayB0aGUgZGF0YVxuICAgICAgICAgICAgZGZkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgIH0pLmVycm9yKHRoaXMuaGFuZGxlRXJyb3IpO1xuXG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQWRkIHRoZSBkYXRhIGluc2lkZSB0aGUgZm9ybSBpdHNlbGZcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZm9ybURhdGFcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYWRkRGF0YSgkZm9ybURhdGEgOiBhbnkpIDogdm9pZFxuICAgIHtcblxuICAgICAgICAkKCcjZWYtYWRkLW1haW4taW5mbycpLmZpbmQoJ1tuYW1lXj1cInNldHRpbmdzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcjZWYtYWRkLW1haW4taW5mbycpLmZpbmQoJ1tuYW1lXj1cImF0dHJpYnV0ZXNcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxJbmZvcygkKGVsZW0pLCRmb3JtRGF0YSk7XG5cbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgY2hhbmdlRm9ybVR5cGUodHlwZSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIEVGX0FkZC5sb2FkaW5nKHRydWUsJ3V0aWxpdHknKTtcblxuICAgICAgICBsZXQgJGZvcm1EYXRhID0gdGhpcy5mb3JtVHlwZS52YWx1ZTtcblxuICAgICAgICAkZm9ybURhdGEudHlwZSA9IHR5cGU7XG5cbiAgICAgICAgdGhpcy5hZGRGb3JtRGF0YSgkZm9ybURhdGEpO1xuICAgICAgICB0aGlzLmFkZFJlcXVpcmVkRmllbGRzKCRmb3JtRGF0YS50eXBlKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgdGhlIGZvcm0gZGF0YSBpbiB0aGUgZm9ybSB0eXBlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZEZvcm1EYXRhKCRmb3JtRGF0YSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIHRoaXMubG9hZEZvcm1UZW1wbGF0ZSgkZm9ybURhdGEudHlwZSkudGhlbigoJHRlbXBsYXRlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1UeXBlID0gdGhpcy5nZW5lcmF0ZUZvcm0oJGZvcm1EYXRhLnR5cGUpO1xuXG4gICAgICAgICAgICB0aGlzLmZvcm1UeXBlLmluaXQoJHRlbXBsYXRlKTtcblxuICAgICAgICAgICAgJCgnI2VmLWFkZC10eXBlJykuZmluZCgnW25hbWVePVwic2V0dGluZ3NcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCd1dGlsaXR5Jyk7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBmb3JtVHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRSZXF1aXJlZEZpZWxkcyhmb3JtVHlwZSA6IHN0cmluZykgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgcmVxdWlyZWQgPSB0aGlzLmF2YWlsYWJsZUZvcm1zW2Zvcm1UeXBlXS5yZXF1aXJlZDtcblxuICAgICAgICAkLmVhY2godGhpcy5pbnB1dHMsKGtleSA6IHN0cmluZywgaW5wdXQgOiBFRl9JbnB1dCkgPT4ge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gJC5pbkFycmF5KGlucHV0LnZhbHVlLmF0dHJpYnV0ZXMubmFtZSxyZXF1aXJlZCk7XG4gICAgICAgICAgICBpZihpbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVkLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGlucHV0cyA9IFtdO1xuXG5cbiAgICAgICAgJC5lYWNoKHJlcXVpcmVkLChrZXkgOiBudW1iZXIsaW5wdXROYW1lIDogc3RyaW5nKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0aGUgZGVmYXVsdCB2YWx1ZXMgaW5zaWRlXG4gICAgICAgICAgICBsZXQgaW5wdXQgPSB0aGlzLmdldEF2YWlsYWJsZUlucHV0RGF0YShpbnB1dE5hbWUpO1xuXG4gICAgICAgICAgICBpbnB1dC5hdHRyaWJ1dGVzLm5hbWUgPSBpbnB1dE5hbWU7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGlucHV0KTtcblxuICAgICAgICAgICAgaW5wdXRzLnB1c2goaW5wdXQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmKGlucHV0cyAmJiBpbnB1dHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cywgMCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgRUZfQWRkLnN1Y2Nlc3MgPSAnVGhlIGZpZWxkcyAnICsgcmVxdWlyZWQuam9pbignLCAnKSArICcgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBmb3JtJztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFR5cGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0QXZhaWxhYmxlSW5wdXREYXRhKGlucHV0VHlwZSA6IHN0cmluZykgOiBhbnlcbiAgICB7XG4gICAgICAgIGxldCBpbnB1dDtcblxuICAgICAgICBpZih0aGlzLmF2YWlsYWJsZUlucHV0c1tpbnB1dFR5cGVdKSB7XG4gICAgICAgICAgICBpbnB1dCA9IHRoaXMuYXZhaWxhYmxlSW5wdXRzW2lucHV0VHlwZV0uZGF0YTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLmF2YWlsYWJsZUlucHV0c1sndGV4dCddLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHVibGljIGxvYWRGb3JtVGVtcGxhdGUodHlwZSA6IHN0cmluZykgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgbGV0IGtleSA9ICdmb3JtLScgKyB0eXBlO1xuXG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlc1trZXldICYmIHRoaXMudGVtcGxhdGVzW2tleV0gIT0gdW5kZWZpbmVkICYmIHRoaXMudGVtcGxhdGVzW2tleV0gIT0gJycpIHtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKHRoaXMudGVtcGxhdGVzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkLmdldChhamF4VXJsLCB7XG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ2FjdGlvbnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlIDogdHlwZSxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX3RlbXBsYXRlJ1xuICAgICAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNba2V5XSA9IGRhdGEuZGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIEkgc2VuZCBiYWNrIHRoZSBkYXRhXG4gICAgICAgICAgICAgICAgZGZkLnJlc29sdmUoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgIH0pLmVycm9yKHRoaXMuaGFuZGxlRXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcbiAgICB9XG5cblxuICAgIHB1YmxpYyBmaWxsSW5mb3MoJGVsZW0sJGZvcm0pIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJGVsZW0pO1xuXG4gICAgICAgIGlmKCRmb3JtW3Byb3AuYXR0cl0gJiYgJGZvcm1bcHJvcC5hdHRyXVtwcm9wLmlkXSkge1xuXG4gICAgICAgICAgICBFRl9JbnB1dC5zZXRJbnB1dFZhbHVlKCRlbGVtLCRmb3JtW3Byb3AuYXR0cl1bcHJvcC5pZF0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCB0aGUgZGF0YSBpbnNpZGUgdGhlIHN1Ym1pdCBidXR0b25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdWJtaXRcbiAgICAgKi9cbiAgICBwcml2YXRlIGFkZFN1Ym1pdERhdGEoc3VibWl0KSA6IHZvaWRcbiAgICB7XG4gICAgICAgIEVGX0lucHV0LmFkZERhdGFUb0VsZW1lbnQodGhpcy4kYm9keS5maW5kKCcjZWYtYWRkLXN1Ym1pdCcpLHN1Ym1pdCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIExvYWQgYWxsIHRoZSBpbnB1dHMgZnJvbSB0aGUgbGlzdFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0c1xuICAgICAqIEBwYXJhbSBkZmRcbiAgICAgKiBAcGFyYW0gb3JkZXJcbiAgICAgKi9cbiAgICBwcml2YXRlIGxvYWRJbnB1dHMoaW5wdXRzIDogeyBhdHRyaWJ1dGVzIDoge3R5cGUgOiBzdHJpbmcgfX1bXSxvcmRlciA6IG51bWJlcixkZmQgIDogYW55ID0gbnVsbCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIGlmKCFkZmQpIHtcbiAgICAgICAgICAgIGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKGlucHV0cyk7XG5cbiAgICAgICAgbGV0IGtleSA9IGtleXNbb3JkZXJdO1xuXG4gICAgICAgIGlmKCFrZXkgfHwgIWlucHV0cyB8fCAhaW5wdXRzW2tleV0pe1xuICAgICAgICAgICAgdGhpcy5pc19pbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmFkZElucHV0KGlucHV0c1trZXldLmF0dHJpYnV0ZXMudHlwZSxpbnB1dHNba2V5XSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgb3JkZXIrKztcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoaW5wdXRzLG9yZGVyLGRmZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuXG4gICAgcHVibGljIGdlbmVyYXRlRm9ybSh0eXBlIDogc3RyaW5nKSA6IEVGX0Zvcm1cbiAgICB7XG4gICAgICAgIGxldCBmb3JtO1xuXG4gICAgICAgIGlmKCF0aGlzLmF2YWlsYWJsZUZvcm1zW3R5cGVdKSB7XG4gICAgICAgICAgICB0eXBlID0gJ3Bvc3QnO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdsb2dpbicgOlxuICAgICAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncG9zdCcgOlxuICAgICAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFmb3JtKSB7XG4gICAgICAgICAgICBmb3JtID0gbmV3IEVGX0Zvcm0oKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcmV0dXJuIGZvcm07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHVibGljIGdlbmVyYXRlSW5wdXQodHlwZSA6IHN0cmluZykgOiBFRl9JbnB1dFxuICAgIHtcbiAgICAgICAgbGV0IGlucHV0O1xuXG4gICAgICAgIGlmKCF0aGlzLmF2YWlsYWJsZUlucHV0c1t0eXBlXSkge1xuICAgICAgICAgICAgdHlwZSA9ICd0ZXh0JztcbiAgICAgICAgfVxuXG5cbiAgICAgICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgICAgICAgIGlucHV0ID0gbmV3IEVGX0lucHV0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZighaW5wdXQpIHtcbiAgICAgICAgICAgIGlucHV0ID0gbmV3IEVGX0lucHV0KCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiBpbnB1dDtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBMb2FkIHRoZSBpbnB1dCB0ZW1wbGF0ZSBmcm9tIHRoZSBCT1xuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGUgOiBzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRJbnB1dCh0eXBlIDogc3RyaW5nID0gJ3RleHQnKVxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXNbdHlwZV0gJiYgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gIT0gdW5kZWZpbmVkICYmIHRoaXMudGVtcGxhdGVzW3R5cGVdICE9ICcnKSB7XG4gICAgICAgICAgICBkZmQucmVzb2x2ZSh0aGlzLnRlbXBsYXRlc1t0eXBlXSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQuZ2V0KGFqYXhVcmwsIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnaW5wdXRzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA6IHR5cGUsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF90ZW1wbGF0ZSdcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW3R5cGVdID0gZGF0YS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhLmRhdGEpO1xuICAgICAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIEhUVFAgRXJyb3JzXG4gICAgICpcbiAgICAgKiBAVE9ET1xuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVFcnJvcihkYXRhIDogc3RyaW5nfHtyZXNwb25zZUpTT04gOiB7ZXJyb3J9fSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIGxldCBlcnJvciA6IHN0cmluZztcblxuICAgICAgICBpZih0eXBlb2YgZGF0YSAhPSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBlcnJvciA9IGRhdGEucmVzcG9uc2VKU09OLmVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgRUZfQWRkLmVycm9yID0gZXJyb3I7XG4gICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlKTtcblxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEdldCB0aGUgdXJsIHBhcmFtZXRlclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtZXRlclxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRQYXJhbWV0ZXIocGFyYW1ldGVyIDogc3RyaW5nKTphbnlcbiAgICB7XG4gICAgICAgIHZhciBwYXJhbXNfc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSk7XG5cbiAgICAgICAgdmFyIHBhcmFtc19hcnJheSA9IHBhcmFtc19zdHJpbmcuc3BsaXQoJyYnKTtcblxuICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgIGZvcih2YXIgaSA9MDtpPHBhcmFtc19hcnJheS5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZSA9IHBhcmFtc19hcnJheVtpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgb2JqW2VbMF1dID0gZVsxXVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9ialtwYXJhbWV0ZXJdO1xuICAgIH1cblxuXG5cblxuICAgIC8qKlxuICAgICAqIERpc3BsYXkgYW4gZXJyb3IgbWVzc2FnZSB0aGF0IHdpbGwgZmFkZSBvdXQgaW4gNSBzZWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCBlcnJvcihlcnJvck1lc3NhZ2UgOiBzdHJpbmd8Ym9vbGVhbikge1xuXG4gICAgICAgIEVGX0FkZC5zZXRNZXNzYWdlKCcjZXJyb3ItbWVzc2FnZScsZXJyb3JNZXNzYWdlLGZhbHNlKTtcblxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIERpc3BsYXkgYSBzdWNjZXNzIG1lc3NhZ2UgdGhhdCB3aWxsIGZhZGUgb3V0IGluIDUgc2VjXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3VjY2Vzc01lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCBzdWNjZXNzKHN1Y2Nlc3NNZXNzYWdlOiBzdHJpbmd8Ym9vbGVhbikge1xuXG4gICAgICAgIEVGX0FkZC5zZXRNZXNzYWdlKCcjc3VjY2Vzcy1tZXNzYWdlJyxzdWNjZXNzTWVzc2FnZSxmYWxzZSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0gcGVyc2lzdCA6IGJvb2xlYW4sIFdlaXRoZXIgb3Igbm90IHRoZSBtZXNzYWdlIHNob3VsZCBiZSBkaXNwbGF5ZWQgb3Igbm90XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXRNZXNzYWdlKGVsZW1lbnQgOiBzdHJpbmcsbWVzc2FnZSA6IHN0cmluZ3xib29sZWFuLCBwZXJzaXN0IDogYm9vbGVhbnxudW1iZXIgPSBmYWxzZSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIGlmKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkudGV4dChtZXNzYWdlKS5mYWRlSW4oMjAwKTtcblxuICAgICAgICAgICAgaWYoIXBlcnNpc3QpIHtcblxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHBlcnNpc3QgaXMgbm90IGVxdWFsIHRvIGZhbHNlXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHBlcnNpc3QgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcnNpc3QgPSA1MDAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1lc3NhZ2UoZWxlbWVudCwnJyk7XG4gICAgICAgICAgICAgICAgfSxwZXJzaXN0KTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkuZmFkZU91dCgyMDAsKCkgPT4ge1xuICAgICAgICAgICAgICAgICQoZWxlbWVudCkudGV4dCgnJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG52YXIgRUZfYWRkID0gbmV3IEVGX0FkZCgpO1xuRUZfYWRkLmluaXQoKTsiXX0=
