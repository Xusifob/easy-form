System.register("inputs/EF_Input", [], function(exports_1, context_1) {
    "use strict";
    var EF_Input;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function() {
            EF_Input = /** @class */ function() {
                function EF_Input() {
                    /**
                     * If the field has been changed or not
                     */
                    this.dirty = false;
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
                    this.element.find("select,input,textarea").on("input", function() {
                        _this.dirty = true;
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
                    if ($data.dirty) {
                        this.dirty = $data.dirty;
                    }
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
                        var value = {
                            dirty: this.dirty
                        };
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
                        _this.addInput("text", {}).then(function(input) {
                            EF_Add.loading(false, "fields");
                            input.dirty = true;
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
                    var dfd = $.Deferred();
                    EF_Add.loading(true, "fields");
                    var inputs = [];
                    $.each(this.inputs, function(key, input) {
                        inputs.push(input.value);
                    });
                    this.removeAllInputs();
                    this.loadInputs(inputs, 0).then(function() {
                        EF_Add.loading(false, "fields");
                        dfd.resolve();
                    });
                    return dfd.promise();
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
                            _this.inputs.forEach(function(value, key) {
                                _this.inputs[key].dirty = true;
                            });
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
                    this.removeUntouchedInputs().then(function() {
                        $.each(_this.inputs, function(key, input) {
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
                            inputs.push(input);
                        });
                        if (inputs && inputs.length > 0) {
                            _this.loadInputs(inputs, 0).then(function() {
                                EF_Add.success = "The fields " + required.join(", ") + " have been added to the form";
                            });
                        }
                    });
                };
                /**
                 * Remove all the inputs added by changing the type of form
                 */
                EF_Add.prototype.removeUntouchedInputs = function() {
                    var inputs = [];
                    $.each(this.inputs, function(key, input) {
                        if (input.dirty) {
                            inputs.push(input);
                        }
                    });
                    this.inputs = inputs;
                    return this.reorganise();
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
                /**
                 *
                 * Fill form data the infos inside the editor
                 *
                 * @param $elem
                 * @param $formData
                 */
                EF_Add.prototype.fillInfos = function($elem, $formData) {
                    var prop = EF_Input_2.EF_Input.getInputProperties($elem);
                    if ($formData[prop.attr] && $formData[prop.attr][prop.id]) {
                        EF_Input_2.EF_Input.setInputValue($elem, $formData[prop.attr][prop.id]);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2lucHV0cy9FRl9JbnB1dC50cyIsImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2Zvcm1zL0VGX0Zvcm0udHMiLCJhc3NldHMvYWRtaW4vanMvc3JjL2FkZC9FRl9BZGQudHMiXSwibmFtZXMiOlsiRUZfSW5wdXQiLCJ0aGlzIiwiZGlydHkiLCJjb250YWluZXIiLCIkIiwicHJvdG90eXBlIiwiaW5pdCIsIiRlbGVtZW50IiwiaWQiLCIkZGF0YSIsInBvc2l0aW9uIiwicmVwbGFjZSIsImVsZW1lbnQiLCJvcHRpb25zRWxlbWVudCIsImZpbmQiLCJhcHBlbmQiLCJyZXBsYWNlV2l0aCIsInNldEV2ZW50cyIsImFkZERhdGEiLCJfdGhpcyIsIm9mZiIsIm9uIiwidG9nZ2xlIiwib25EdXBsaWNhdGUiLCJvbkNoYW5nZVR5cGUiLCJvbkRlbGV0ZSIsIm9uTW92ZSIsImVsZW0iLCJoYXNDbGFzcyIsImNsb3NlIiwib3BlbiIsImFkZERhdGFUb0VsZW1lbnQiLCJlYWNoIiwia2V5IiwicHJvcCIsImdldElucHV0UHJvcGVydGllcyIsIm5hbWUiLCJzZXRJbnB1dFZhbHVlIiwiaW5wdXQiLCJ2YWx1ZSIsImlzIiwidmFsIiwiZ2V0SW5wdXRWYWx1ZSIsImF0dHIiLCJkYXRhIiwic3BsaXQiLCJoaWRlIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImh0bWwiLCJzaG93IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJ0eXBlIiwiRUZfRm9ybSIsIkVGX0lucHV0XzEiLCJFRl9BZGQiLCJ0ZW1wbGF0ZXMiLCJpbnB1dHMiLCJhdmFpbGFibGVJbnB1dHMiLCJhdmFpbGFibGVGb3JtcyIsImlzX2luaXQiLCIkYm9keSIsImxvYWQiLCJ0aGVuIiwiYWRkSW5wdXQiLCJsb2FkaW5nIiwiJGV2ZW50IiwidGFyZ2V0IiwiY2hhbmdlRm9ybVR5cGUiLCJyZW9yZ2FuaXNlIiwiZGZkIiwiRGVmZXJyZWQiLCJwdXNoIiwicmVtb3ZlQWxsSW5wdXRzIiwibG9hZElucHV0cyIsInJlc29sdmUiLCJwcm9taXNlIiwiZGlyZWN0aW9uIiwiaW5kZXhPZiIsIm5ld3BvcyIsImNvbnNvbGUiLCJsb2ciLCJsZW5ndGgiLCJzd2l0Y2giLCJwb3MxIiwicG9zMiIsImlucHV0MSIsImF0dHJpYnV0ZXMiLCJzdWNjZXNzIiwic3BsaWNlIiwiZ2V0SW5wdXQiLCJnZW5lcmF0ZUlucHV0IiwiYWN0aW9uIiwiZ2V0SlNPTiIsImFqYXhVcmwiLCJmb3JtX2lkIiwiZ2V0UGFyYW1ldGVyIiwiZm9ybSIsImFkZEZvcm1EYXRhIiwiZm9ybXMiLCJzdWJtaXQiLCJhZGRTdWJtaXREYXRhIiwiZm9yRWFjaCIsImFkZFJlcXVpcmVkRmllbGRzIiwiZXJyb3IiLCJoYW5kbGVFcnJvciIsIiRmb3JtRGF0YSIsImZpbGxJbmZvcyIsImZvcm1UeXBlIiwibG9hZEZvcm1UZW1wbGF0ZSIsIiR0ZW1wbGF0ZSIsImdlbmVyYXRlRm9ybSIsInJlcXVpcmVkIiwicmVtb3ZlVW50b3VjaGVkSW5wdXRzIiwiaW5kZXgiLCJpbkFycmF5IiwiaW5wdXROYW1lIiwiZ2V0QXZhaWxhYmxlSW5wdXREYXRhIiwiam9pbiIsImlucHV0VHlwZSIsInVuZGVmaW5lZCIsImdldCIsInRlbXBsYXRlIiwiJGVsZW0iLCJFRl9JbnB1dF8yIiwib3JkZXIiLCJrZXlzIiwiRUZfRm9ybV8xIiwicmVzcG9uc2VKU09OIiwicGFyYW1ldGVyIiwicGFyYW1zX3N0cmluZyIsIndpbmRvdyIsImxvY2F0aW9uIiwic2VhcmNoIiwic3Vic3RyIiwicGFyYW1zX2FycmF5Iiwib2JqIiwiaSIsImUiLCJlcnJvck1lc3NhZ2UiLCJzZXRNZXNzYWdlIiwic3VjY2Vzc01lc3NhZ2UiLCJtZXNzYWdlIiwicGVyc2lzdCIsInRleHQiLCJmYWRlSW4iLCJzZXRUaW1lb3V0IiwiZmFkZU91dCIsIkVGX2FkZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Z0JBeURJLFNBQUFBOzs7O29CQVhPQyxLQUFBQyxRQUFrQjtvQkFh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Ozs7Ozs7Ozs7O2dCQVUxQ3RGLE9BQUFxRixhQUFkLFNBQXlCakksU0FBaUJtSSxTQUEwQkM7b0JBQXBFLElBQUE3SCxRQUFBbEI7b0JBQW9FLElBQUErSSxpQkFBQSxHQUFBO3dCQUFBQSxVQUFBOztvQkFHaEUsSUFBR0QsU0FBUzt3QkFDUjNJLEVBQUVRLFNBQVNxSSxLQUFLRixTQUFTRyxPQUFPO3dCQUVoQyxLQUFJRixTQUFTOzs0QkFHVCxXQUFVQSxZQUFZLFdBQVc7Z0NBQzdCQSxVQUFVOzs0QkFHZEcsV0FBVztnQ0FDUGhJLE1BQUswSCxXQUFXakksU0FBUTsrQkFDMUJvSTs7MkJBSUo7d0JBQ0Y1SSxFQUFFUSxTQUFTd0ksUUFBUSxLQUFJOzRCQUNuQmhKLEVBQUVRLFNBQVNxSSxLQUFLOzs7O2dCQUtoQyxPQUFBekY7O1lBRUk2RixTQUFTLElBQUk3RjtZQUNqQjZGLE9BQU8vSSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5kZWNsYXJlIHZhciAkIDogYW55O1xuXG5leHBvcnQgY2xhc3MgRUZfSW5wdXRcbntcblxuICAgIC8qKlxuICAgICAqIEB2YXIgc3RyaW5nXG4gICAgICpcbiAgICAgKiBUaGUgdHlwZSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHR5cGUgOiBzdHJpbmcgPSAndGV4dCc7XG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgSFRNTCBFbGVtZW50XG4gICAgICpcbiAgICAgKiBUaGUgaHRtbCBlbGVtZW50IG9mIHRoZSBpbnB1dFxuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGVsZW1lbnQgOiBhbnk7XG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgSFRNTCBFbGVtZW50XG4gICAgICpcbiAgICAgKiBUaGUgaHRtbCBlbGVtZW50IGZvciB0aGUgb3B0aW9uXG4gICAgICovXG4gICAgcHVibGljIG9wdGlvbnNFbGVtZW50IDogYW55O1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgaWQgKHBvc2l0aW9uKSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgaWQgOiBudW1iZXI7XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBIVE1MIGVsZW1lbnQgb2YgdGhlIGNvbnRhaW5lclxuICAgICAqL1xuICAgIHB1YmxpYyBjb250YWluZXIgOiBhbnk7XG5cblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBmaWVsZCBoYXMgYmVlbiBjaGFuZ2VkIG9yIG5vdFxuICAgICAqL1xuICAgIHB1YmxpYyBkaXJ0eSA6IGJvb2xlYW4gPSBmYWxzZTtcblxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gY2FsbGVkIG9uIGR1cGxpY2F0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBvbkR1cGxpY2F0ZSA6IGFueTtcbiAgICBwdWJsaWMgb25DaGFuZ2VUeXBlIDogYW55O1xuICAgIHB1YmxpYyBvbkRlbGV0ZSA6IGFueTtcbiAgICBwdWJsaWMgb25Nb3ZlIDogYW55O1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gJCgnI2ZsZCcpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqIEBwYXJhbSAkZGF0YVxuICAgICAqIEBwYXJhbSBpZFxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiA6IG51bWJlclxuICAgICAqL1xuICAgIHB1YmxpYyBpbml0KCRlbGVtZW50IDogYW55LCBpZCA6IG51bWJlciwkZGF0YSA6IGFueSxwb3NpdGlvbiA6IG51bGx8bnVtYmVyID0gbnVsbClcbiAgICB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcblxuICAgICAgICAkZWxlbWVudCA9ICRlbGVtZW50LnJlcGxhY2UoL2ZpZWxkVW5JZC9nLGlkKzEpO1xuICAgICAgICAkZWxlbWVudCA9ICRlbGVtZW50LnJlcGxhY2UoL2ZpZWxkSWQvZyxpZCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJCgkZWxlbWVudCk7XG4gICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmVmLXRhYmxlJyk7XG5cbiAgICAgICAgaWYobnVsbCA9PT0gcG9zaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5maW5kKCcjZmllbGQtJyArIHBvc2l0aW9uKS5yZXBsYWNlV2l0aCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRFdmVudHMoKTtcblxuICAgICAgICB0aGlzLmFkZERhdGEoJGRhdGEpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogU2V0IGFsbCB0aGUgZXZlbnRzIGxpbmtlZCB0byB0aGlzIGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0RXZlbnRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwib3Blbi1jbG9zZVwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHtyZXR1cm4gdGhpcy50b2dnbGUoKX0pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwiZHVwbGljYXRlXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3RoaXMub25EdXBsaWNhdGUodGhpcyk7IHJldHVybiBmYWxzZTt9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cImNoYW5nZS10eXBlXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3RoaXMub25DaGFuZ2VUeXBlKHRoaXMpOyByZXR1cm4gZmFsc2U7fSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJkZWxldGVcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7dGhpcy5vbkRlbGV0ZSh0aGlzKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwidXBcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7dGhpcy5vbk1vdmUodGhpcywndXAnKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwiZG93blwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHt0aGlzLm9uTW92ZSh0aGlzLCdkb3duJyk7IHJldHVybiBmYWxzZTt9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ3NlbGVjdCxpbnB1dCx0ZXh0YXJlYScpLm9uKCdpbnB1dCcsICgpID0+IHsgdGhpcy5kaXJ0eSA9IHRydWU7fSk7XG4gICAgfVxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQ2xvc2UgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlKCk6IGJvb2xlYW5cbiAgICB7XG5cbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwib3Blbi1jbG9zZVwiXScpO1xuXG4gICAgICAgIGlmKCQoZWxlbSkuaGFzQ2xhc3MoJ21pbmlmeScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9zZSgpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0IHRoZSBkYXRhIGluIHRoZSB0ZW1wbGF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICovXG4gICAgcHVibGljIGFkZERhdGEoJGRhdGEpIDogdm9pZFxuICAgIHtcblxuICAgICAgICBpZigkZGF0YS5kaXJ0eSkge1xuICAgICAgICAgICAgdGhpcy5kaXJ0eSA9ICRkYXRhLmRpcnR5O1xuICAgICAgICB9XG5cblxuICAgICAgICBFRl9JbnB1dC5hZGREYXRhVG9FbGVtZW50KHRoaXMuZWxlbWVudCwkZGF0YSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGREYXRhVG9FbGVtZW50KCRlbGVtZW50IDogYW55LCAkZGF0YSA6IGFueSkgOiB2b2lkXG4gICAge1xuICAgICAgICAkZWxlbWVudC5maW5kKCdbbmFtZV49XCJmaWVsZFwiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoZWxlbSkpO1xuXG4gICAgICAgICAgICBpZigkZGF0YVtwcm9wLnByb3BdICYmICRkYXRhW3Byb3AucHJvcF1bcHJvcC5uYW1lXSkge1xuICAgICAgICAgICAgICAgIEVGX0lucHV0LnNldElucHV0VmFsdWUoJChlbGVtKSwkZGF0YVtwcm9wLnByb3BdW3Byb3AubmFtZV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQWRkIGEgdmFsdWUgdG8gYW4gaW5wdXRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0SW5wdXRWYWx1ZShpbnB1dCA6IGFueSwgdmFsdWUgOiBzdHJpbmd8Ym9vbGVhbilcbiAgICB7XG4gICAgICAgIGlmKGlucHV0LmlzKCc6Y2hlY2tib3gnKSl7XG4gICAgICAgICAgICBpZih2YWx1ZSA9PSAnb24nKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5wdXQucHJvcCgnY2hlY2tlZCcsdmFsdWUpO1xuICAgICAgICB9ZWxzZSBpZihpbnB1dC5pcygnc2VsZWN0Jykpe1xuICAgICAgICAgICAgaW5wdXQuZmluZCgnb3B0aW9uW3ZhbHVlPVwiJysgdmFsdWUgKydcIl0nKS5wcm9wKCdzZWxlY3RlZCcsdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGlucHV0LnZhbCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiBhbiBpbnB1dFxuICAgICAqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKiBAcmV0dXJucyBhbnlcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldElucHV0VmFsdWUoaW5wdXQgOiBhbnkpXG4gICAge1xuXG4gICAgICAgIGlmKHR5cGVvZiBpbnB1dC52YWwgIT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmKGlucHV0LmlzKCc6Y2hlY2tib3gnKSl7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQuaXMoJzpjaGVja2VkJyk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnZhbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIGFsbCB0aGUgcHJvcGVydGllcyBvZiBhbiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIGVsZW1cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldElucHV0UHJvcGVydGllcyhlbGVtIDogYW55KSA6IHthdHRyLGlkLHByb3AsbmFtZX1cbiAgICB7XG5cbiAgICAgICAgbGV0IG5hbWUgPSBlbGVtLmF0dHIoJ25hbWUnKTtcblxuICAgICAgICBsZXQgZGF0YSA9IG5hbWUuc3BsaXQoJ1snKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXR0ciA6IGRhdGFbMF0ucmVwbGFjZSgnXScsJycpLFxuICAgICAgICAgICAgaWQgOiBkYXRhWzFdLnJlcGxhY2UoJ10nLCcnKSxcbiAgICAgICAgICAgIHByb3AgOiBkYXRhWzJdID8gZGF0YVsyXS5yZXBsYWNlKCddJywnJykgOiAnJyxcbiAgICAgICAgICAgIG5hbWUgOiBkYXRhWzNdID8gZGF0YVszXS5yZXBsYWNlKCddJywnJykgOiAnJyxcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHNpbmNlIDEuMS4wXG4gICAgICpcbiAgICAgKiBAZXZlbnQgOiBDbGljayBvbiBtaW5pZnkgYnV0dG9uIDogaGlkZSB0aGUgb3B0aW9ucyBvZiB0aGUgZmllbGRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcHVibGljIGNsb3NlKCkgOiBib29sZWFuXG4gICAge1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50LmhpZGUoMjAwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5taW5pZnknKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdtaW5pZnknKVxuICAgICAgICAgICAgLmFkZENsYXNzKCdvcGVuJylcbiAgICAgICAgICAgIC5odG1sKCcrJyk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAc2luY2UgMS4xLjBcbiAgICAgKlxuICAgICAqIE9wZW4gYSBmaWVsZFxuICAgICAqXG4gICAgICogQGV2ZW50IDogQ2xpY2sgb24gb3BlbiBidXR0b24sIHNob3cgdGhlIGZpZWxkIG9wdGlvbnNcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcHVibGljIG9wZW4oKSA6IGJvb2xlYW5cbiAgICB7XG4gICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQuc2hvdygyMDApO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLm9wZW4nKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdvcGVuJylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnbWluaWZ5JylcbiAgICAgICAgICAgIC5odG1sKCctJyk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gdGhlIHZhbHVlIG9mIGFsbCB0aGUgaW5wdXRzIGluIHRoZSBmaWVsZFxuICAgICAqXG4gICAgICovXG4gICAgZ2V0IHZhbHVlKCk6IGFueSB7XG5cbiAgICAgICAgbGV0IHZhbHVlID0ge1xuICAgICAgICAgICAgZGlydHkgOiB0aGlzLmRpcnR5LFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbbmFtZV49XCJmaWVsZFwiXScpLmVhY2goKGtleSA6IG51bWJlcixpbnB1dCA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkKGlucHV0KSk7XG4gICAgICAgICAgICBsZXQgdmFsID0gRUZfSW5wdXQuZ2V0SW5wdXRWYWx1ZSgkKGlucHV0KSk7XG5cbiAgICAgICAgICAgIGlmKHByb3AucHJvcCAmJiAhdmFsdWVbcHJvcC5wcm9wXSAmJiBwcm9wLm5hbWUpe1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AucHJvcF0gPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodmFsdWVbcHJvcC5wcm9wXSkge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AucHJvcF1bcHJvcC5uYW1lXSA9IHZhbDtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLnByb3BdID0gdmFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgIH1cblxufSIsImltcG9ydCB7RUZfSW5wdXR9IGZyb20gXCIuLi9pbnB1dHMvRUZfSW5wdXRcIjtcblxuZGVjbGFyZSB2YXIgJCA6IGFueTtcblxuZXhwb3J0IGNsYXNzIEVGX0Zvcm0ge1xuXG4gICAgLyoqXG4gICAgICogQHZhciBzdHJpbmdcbiAgICAgKlxuICAgICAqIFRoZSB0eXBlIG9mIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdHlwZTogc3RyaW5nID0gJ3RleHQnO1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIEhUTUwgRWxlbWVudFxuICAgICAqXG4gICAgICogVGhlIGh0bWwgZWxlbWVudCBvZiB0aGUgaW5wdXRcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBlbGVtZW50OiBhbnk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBlbGVtZW50IG9mIHRoZSBjb250YWluZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgY29udGFpbmVyIDogYW55O1xuXG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIgPSAkKCcjdXRpbGl0aWVzJyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqL1xuICAgIHB1YmxpYyBpbml0KCRlbGVtZW50IDogYW55KVxuICAgIHtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKCRlbGVtZW50KTtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5odG1sKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJldHVybiB0aGUgdmFsdWUgb2YgYWxsIHRoZSBpbnB1dHMgaW4gdGhlIGZpZWxkXG4gICAgICpcbiAgICAgKi9cbiAgICBnZXQgdmFsdWUoKTogYW55IHtcblxuICAgICAgICBsZXQgdmFsdWUgPSB7fTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW25hbWVePVwic2V0dGluZ3NcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsaW5wdXQgOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJChpbnB1dCkpO1xuICAgICAgICAgICAgbGV0IHZhbCA9IEVGX0lucHV0LmdldElucHV0VmFsdWUoJChpbnB1dCkpO1xuXG4gICAgICAgICAgICBpZihwcm9wLmF0dHIgJiYgIXZhbHVlW3Byb3AuYXR0cl0gJiYgcHJvcC5pZCl7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5hdHRyXSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih2YWx1ZVtwcm9wLmF0dHJdKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5hdHRyXVtwcm9wLmlkXSA9IHZhbDtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLmF0dHJdID0gdmFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgfVxuXG5cblxuXG59IiwiaW1wb3J0IHtFRl9Gb3JtfSBmcm9tIFwiLi9mb3Jtcy9FRl9Gb3JtXCI7XG5cbmRlY2xhcmUgdmFyICQ7XG5cbmRlY2xhcmUgdmFyIGFqYXhVcmwgOiBzdHJpbmc7XG5cbmltcG9ydCB7RUZfSW5wdXR9IGZyb20gJy4vaW5wdXRzL0VGX0lucHV0JztcblxuY2xhc3MgRUZfQWRkXG57XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBIVE1MIEJvZHkgb2YgdGhlIHBhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgJGJvZHk7XG5cbiAgICAvKipcbiAgICAgKkFuIG9iamVjdCBvZiBhbGwgdGhlIGlucHV0IHRlbXBsYXRlcyBjYWNoZWQgdG8gYXZvaWQgbGF0ZW5jeVxuICAgICAqL1xuICAgIHB1YmxpYyB0ZW1wbGF0ZXMgOiBhbnkgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIGFsbCB0aGUgaW5wdXRzIGF2YWlsYWJsZSBvbiB0aGUgcGFnZVxuICAgICAqL1xuICAgIHB1YmxpYyBpbnB1dHMgOiBFRl9JbnB1dFtdID0gW107XG5cblxuICAgIC8qKlxuICAgICAqIEFsbCB0aGUgYXZhaWxhYmxlIGlucHV0c1xuICAgICAqL1xuICAgIHB1YmxpYyBhdmFpbGFibGVJbnB1dHMgOiB7fSA9IHt9O1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGF2YWlsYWJsZSBpbnB1dHNcbiAgICAgKi9cbiAgICBwdWJsaWMgYXZhaWxhYmxlRm9ybXMgOiB7fSA9IHt9O1xuXG5cbiAgICBwdWJsaWMgZm9ybVR5cGUgOiBFRl9Gb3JtO1xuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIGVkaXRvciBpcyBpbml0XG4gICAgICovXG4gICAgcHVibGljIGlzX2luaXQgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy4kYm9keSA9ICQoJ2JvZHknKTtcblxuICAgIH1cblxuXG4gICAgcHVibGljIGluaXQoKSB7XG5cbiAgICAgICAgdGhpcy5zZXRFdmVudHMoKTtcblxuICAgICAgICB0aGlzLmxvYWQoKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICAvKlxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLm1vdmUnLF9tb3ZlKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLnVwJyxfdXApO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcuZG93bicsX2Rvd24pO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcucmVtb3Zlb3B0aW9uJyxfcmVtb3ZlT3B0aW9uKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLmR1cGxpcXVlcicsX2R1cGxpY2F0ZSk7Ki9cblxuICAgICAgICAvLyBBZGQgYSBuZXcgZmllbGRcbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9mZignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGRcIl0nKVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJ2J1dHRvbltkYXRhLWFjdGlvbj1cImFkZFwiXScsKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkSW5wdXQoJ3RleHQnLHt9KS50aGVuKChpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pIH0pO1xuXG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9mZignY2xpY2snLCdzZWxlY3RbbmFtZT1cInNldHRpbmdzW3R5cGVdXCJdJylcbiAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWU9XCJzZXR0aW5nc1t0eXBlXVwiXScsKCRldmVudCA6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSAkKCRldmVudC50YXJnZXQpLnZhbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlRm9ybVR5cGUodHlwZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAvKlxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjbGljaycsJ2J1dHRvbltkYXRhLWFjdGlvbj1cImFkZC1vcHRpb25cIl0nLF9hZGRPcHRpb24pO1xuXG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWUkPVwiW2Zvcm0tdGF4b25vbXldXCJdJyxfY2hhbmdlVGF4b25vbXkpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsJ3NlbGVjdFtuYW1lPVwiZm9ybS1yZXNldC1hY3Rpb25cIl0nLF9jaGFuZ2VSZXNldEFjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICovXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBSZW9yZ2FuaXNlIGFsbCB0aGUgaW5wdXRzIG9uIHRoZSBwYWdlIGFjY29yZGluZyB0byB0aGUgb25lc1xuICAgICAqL1xuICAgIHB1YmxpYyByZW9yZ2FuaXNlKCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG5cbiAgICAgICAgbGV0IGRmZCA9ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBFRl9BZGQubG9hZGluZyh0cnVlLCdmaWVsZHMnKTtcblxuXG4gICAgICAgIGxldCBpbnB1dHMgPSBbXTtcblxuICAgICAgICAkLmVhY2godGhpcy5pbnB1dHMsKGtleSxpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICBpbnB1dHMucHVzaChpbnB1dC52YWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsSW5wdXRzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cywwKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBDYWxsZWQgd2hlbiAyIGlucHV0cyBhcmUgbW92ZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqIEBwYXJhbSBkaXJlY3Rpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgb25Nb3ZlKGlucHV0IDogRUZfSW5wdXQsZGlyZWN0aW9uIDogc3RyaW5nID0gJ3VwJykgOiBhbnlcbiAgICB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHRoaXMuaW5wdXRzLmluZGV4T2YoaW5wdXQpO1xuXG4gICAgICAgIGxldCBuZXdwb3MgPSBkaXJlY3Rpb24gPT0gJ3VwJyA/IHBvc2l0aW9uLTEgOiBwb3NpdGlvbiArMTtcblxuICAgICAgICBjb25zb2xlLmxvZyhkaXJlY3Rpb24sbmV3cG9zLHBvc2l0aW9uKTtcblxuICAgICAgICBpZihuZXdwb3MgPT0gLTEgfHwgbmV3cG9zID09IHRoaXMuaW5wdXRzLmxlbmd0aCB8fCAhdGhpcy5pbnB1dHNbbmV3cG9zXSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN3aXRjaChwb3NpdGlvbixuZXdwb3MpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTd2l0Y2ggMiBpbnB1dHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwb3MxXG4gICAgICogQHBhcmFtIHBvczJcbiAgICAgKi9cbiAgICBwdWJsaWMgc3dpdGNoKHBvczEgOiBudW1iZXIsIHBvczI6IG51bWJlcilcbiAgICB7XG4gICAgICAgIGxldCBpbnB1dDEgPSB0aGlzLmlucHV0c1twb3MxXTtcblxuICAgICAgICB0aGlzLmlucHV0c1twb3MxXSA9IHRoaXMuaW5wdXRzW3BvczJdO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzW3BvczJdID0gaW5wdXQxO1xuXG4gICAgICAgIHRoaXMucmVvcmdhbmlzZSgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFsbCBpbnB1dHMgZnJvbSB0cmFja1xuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmVBbGxJbnB1dHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gW107XG4gICAgICAgIHRoaXMuJGJvZHkuZmluZCgnI2ZsZCcpLmh0bWwoJycpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBDYWxsZWQgb24gY2xpY2sgb24gdGhlIGR1cGxpY2F0ZSBidXR0b25cbiAgICAgKlxuICAgICAqIEBFdmVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIG9uRHVwbGljYXRlKGlucHV0IDogRUZfSW5wdXQpIDogYW55XG4gICAge1xuXG4gICAgICAgIHRoaXMuYWRkSW5wdXQoaW5wdXQudmFsdWUuYXR0cmlidXRlcy50eXBlLGlucHV0LnZhbHVlKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIEVGX0FkZC5zdWNjZXNzICA9ICdUaGVtIGlucHV0IGhhcyBiZWVuIGR1cGxpY2F0ZWQnO1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UpO1xuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgY2hhbmdlIG9mIHR5cGUgaXMgdHJpZ2dlcmVkXG4gICAgICpcbiAgICAgKiBARXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBvbkNoYW5nZVR5cGUoaW5wdXQgOiBFRl9JbnB1dCkgOiBhbnlcbiAgICB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHRoaXMuaW5wdXRzLmluZGV4T2YoaW5wdXQpO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IGlucHV0LnZhbHVlO1xuXG4gICAgICAgIHRoaXMuYWRkSW5wdXQodmFsdWUuYXR0cmlidXRlcy50eXBlLHZhbHVlLHBvc2l0aW9uKS50aGVuKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ2ZpZWxkcycpO1xuICAgICAgICAgICAgaW5wdXQub3BlbigpO1xuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBDYWxsZWQgb24gZGVsZXRlIG9mIGFuIGlucHV0XG4gICAgICpcbiAgICAgKiBARXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBvbkRlbGV0ZShpbnB1dCA6IEVGX0lucHV0KSA6IGFueVxuICAgIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5pbnB1dHMuaW5kZXhPZihpbnB1dCk7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMuc3BsaWNlKHBvc2l0aW9uLDEpO1xuXG4gICAgICAgIHRoaXMucmVvcmdhbmlzZSgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQWRkIGFuIGlucHV0IHRvIHRoZSBlZGl0b3JcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkSW5wdXQodHlwZSA6IHN0cmluZyA9ICd0ZXh0JywkZGF0YSxwb3NpdGlvbiA6IG51bWJlcnxudWxsID0gbnVsbCkgOiBQcm9taXNlPEVGX0lucHV0PlxuICAgIHtcblxuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG5cbiAgICAgICAgRUZfQWRkLmxvYWRpbmcodHJ1ZSwnZmllbGRzJyk7XG5cbiAgICAgICAgLy8gQ2xvc2UgYWxsIHRoZSBpbnB1dHNcbiAgICAgICAgJC5lYWNoKHRoaXMuaW5wdXRzLChrZXkgOiBudW1iZXIsIGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgIGlucHV0LmNsb3NlKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5nZXRJbnB1dCh0eXBlKS50aGVuKChkYXRhIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBpbnB1dCA6IEVGX0lucHV0O1xuXG4gICAgICAgICAgICBpbnB1dCA9IHRoaXMuZ2VuZXJhdGVJbnB1dCh0eXBlKTtcblxuICAgICAgICAgICAgaW5wdXQuaW5pdChkYXRhLHBvc2l0aW9uID8gcG9zaXRpb24gOiB0aGlzLmlucHV0cy5sZW5ndGgsJGRhdGEscG9zaXRpb24pO1xuXG4gICAgICAgICAgICBpbnB1dC5vbkR1cGxpY2F0ZSA9IChpbnB1dCA6IEVGX0lucHV0ICkgPT4geyB0aGlzLm9uRHVwbGljYXRlKGlucHV0KSB9O1xuICAgICAgICAgICAgaW5wdXQub25DaGFuZ2VUeXBlID0gKGlucHV0IDogRUZfSW5wdXQpID0+IHsgdGhpcy5vbkNoYW5nZVR5cGUoaW5wdXQpIH07XG4gICAgICAgICAgICBpbnB1dC5vbkRlbGV0ZSA9IChpbnB1dCA6IEVGX0lucHV0KSA9PiB7IHRoaXMub25EZWxldGUoaW5wdXQpIH07XG4gICAgICAgICAgICBpbnB1dC5vbk1vdmUgPSAoaW5wdXQ6ICBFRl9JbnB1dCwgYWN0aW9uIDogc3RyaW5nKSA9PiB7IHRoaXMub25Nb3ZlKGlucHV0LGFjdGlvbikgfTtcblxuICAgICAgICAgICAgaWYocG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0c1twb3NpdGlvbl0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMucHVzaChpbnB1dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKGlucHV0KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogU2hvdyBvciBoaWRlIHRoZSBsb2FkaW5nc1xuICAgICAqXG4gICAgICogQHBhcmFtIGxvYWRpbmdcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGxvYWRpbmcobG9hZGluZyA6IGJvb2xlYW4gPSB0cnVlLCRlbGVtZW50IDogbnVsbHxzdHJpbmcgPSBudWxsKVxuICAgIHtcbiAgICAgICAgLy8gU2hvdyB0aGUgc3Bpbm5lclxuXG4gICAgICAgIHN3aXRjaCAoJGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNhc2UgJ2ZpZWxkcycgOlxuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLWZpZWxkcycpLnRvZ2dsZShsb2FkaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3V0aWxpdHknIDpcbiAgICAgICAgICAgICAgICAkKCcjc3Bpbm5lci11dGlsaXR5JykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAkKCcjc3Bpbm5lci11dGlsaXR5JykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLWZpZWxkcycpLnRvZ2dsZShsb2FkaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBMb2FkIHRoZSBmb3JtIGRhdGEgZnJvbSB0aGUgYmFjayBvZmZpY2VcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZCgpIDogUHJvbWlzZTxhbnk+XG4gICAge1xuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG4gICAgICAgICQuZ2V0SlNPTihhamF4VXJsLCB7XG4gICAgICAgICAgICBmb3JtX2lkIDogRUZfQWRkLmdldFBhcmFtZXRlcigncG9zdCcpLFxuICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF9mb3JtX2RhdGEnXG4gICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBkYXRhIGZvciBhbGwgdGhlIGZvcm1cbiAgICAgICAgICAgIHRoaXMuYWRkRGF0YShkYXRhLmRhdGEuZm9ybSk7XG4gICAgICAgICAgICB0aGlzLmFkZEZvcm1EYXRhKGRhdGEuZGF0YS5mb3JtKTtcblxuXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5kYXRhLmlucHV0cywodHlwZSxpbnB1dCA6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlSW5wdXRzW3R5cGVdID0gaW5wdXQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJC5lYWNoKGRhdGEuZGF0YS5mb3JtcywodHlwZSxpbnB1dCA6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlRm9ybXNbdHlwZV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgIC8vIEFkZCB0aGUgc3VibWl0IGRhdGFcbiAgICAgICAgICAgIGlmKGRhdGEuZGF0YS5mb3JtLmlucHV0cy5zdWJtaXQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3VibWl0ID0gZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdDtcbiAgICAgICAgICAgICAgICBkZWxldGUgZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdDtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFN1Ym1pdERhdGEoc3VibWl0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTG9hZCBhbGwgdGhlIGlucHV0c1xuICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGRhdGEuZGF0YS5mb3JtLmlucHV0cywwKS50aGVuKCgpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKHZhbHVlIDogRUZfSW5wdXQsa2V5IDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzW2tleV0uZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRSZXF1aXJlZEZpZWxkcyhkYXRhLmRhdGEuZm9ybS50eXBlKTtcbiAgICAgICAgICAgIH0pO1xuXG5cblxuICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgZGF0YSBpbnNpZGUgdGhlIGZvcm0gaXRzZWxmXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZERhdGEoJGZvcm1EYXRhIDogYW55KSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbEluZm9zKCQoZWxlbSksJGZvcm1EYXRhKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJhdHRyaWJ1dGVzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNoYW5nZUZvcm1UeXBlKHR5cGUpIDogdm9pZFxuICAgIHtcblxuICAgICAgICBFRl9BZGQubG9hZGluZyh0cnVlLCd1dGlsaXR5Jyk7XG5cbiAgICAgICAgbGV0ICRmb3JtRGF0YSA9IHRoaXMuZm9ybVR5cGUudmFsdWU7XG5cbiAgICAgICAgJGZvcm1EYXRhLnR5cGUgPSB0eXBlO1xuXG4gICAgICAgIHRoaXMuYWRkRm9ybURhdGEoJGZvcm1EYXRhKTtcbiAgICAgICAgdGhpcy5hZGRSZXF1aXJlZEZpZWxkcygkZm9ybURhdGEudHlwZSk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQWRkIHRoZSBmb3JtIGRhdGEgaW4gdGhlIGZvcm0gdHlwZVxuICAgICAqXG4gICAgICogQHBhcmFtICRmb3JtRGF0YVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhZGRGb3JtRGF0YSgkZm9ybURhdGEpIDogdm9pZFxuICAgIHtcblxuICAgICAgICB0aGlzLmxvYWRGb3JtVGVtcGxhdGUoJGZvcm1EYXRhLnR5cGUpLnRoZW4oKCR0ZW1wbGF0ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtVHlwZSA9IHRoaXMuZ2VuZXJhdGVGb3JtKCRmb3JtRGF0YS50eXBlKTtcblxuICAgICAgICAgICAgdGhpcy5mb3JtVHlwZS5pbml0KCR0ZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgICQoJyNlZi1hZGQtdHlwZScpLmZpbmQoJ1tuYW1lXj1cInNldHRpbmdzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbEluZm9zKCQoZWxlbSksJGZvcm1EYXRhKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSwndXRpbGl0eScpO1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZm9ybVR5cGVcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkUmVxdWlyZWRGaWVsZHMoZm9ybVR5cGUgOiBzdHJpbmcpIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IHJlcXVpcmVkID0gdGhpcy5hdmFpbGFibGVGb3Jtc1tmb3JtVHlwZV0ucmVxdWlyZWQ7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVVbnRvdWNoZWRJbnB1dHMoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICQuZWFjaCh0aGlzLmlucHV0cywoa2V5IDogc3RyaW5nLCBpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSAkLmluQXJyYXkoaW5wdXQudmFsdWUuYXR0cmlidXRlcy5uYW1lLHJlcXVpcmVkKTtcbiAgICAgICAgICAgICAgICBpZihpbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgaW5wdXRzID0gW107XG5cblxuICAgICAgICAgICAgJC5lYWNoKHJlcXVpcmVkLChrZXkgOiBudW1iZXIsaW5wdXROYW1lIDogc3RyaW5nKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIGRlZmF1bHQgdmFsdWVzIGluc2lkZVxuICAgICAgICAgICAgICAgIGxldCBpbnB1dCA9IHRoaXMuZ2V0QXZhaWxhYmxlSW5wdXREYXRhKGlucHV0TmFtZSk7XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5hdHRyaWJ1dGVzLm5hbWUgPSBpbnB1dE5hbWU7XG5cbiAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChpbnB1dCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZihpbnB1dHMgJiYgaW5wdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoaW5wdXRzLCAwKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgRUZfQWRkLnN1Y2Nlc3MgPSAnVGhlIGZpZWxkcyAnICsgcmVxdWlyZWQuam9pbignLCAnKSArICcgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBmb3JtJztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYWxsIHRoZSBpbnB1dHMgYWRkZWQgYnkgY2hhbmdpbmcgdGhlIHR5cGUgb2YgZm9ybVxuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmVVbnRvdWNoZWRJbnB1dHMoKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgbGV0IGlucHV0cyA9IFtdO1xuXG4gICAgICAgICQuZWFjaCh0aGlzLmlucHV0cywoa2V5IDogbnVtYmVyLCBpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChpbnB1dC5kaXJ0eSkge1xuICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMgPSBpbnB1dHM7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVvcmdhbmlzZSgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRUeXBlXG4gICAgICovXG4gICAgcHVibGljIGdldEF2YWlsYWJsZUlucHV0RGF0YShpbnB1dFR5cGUgOiBzdHJpbmcpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgaW5wdXQ7XG5cbiAgICAgICAgaWYodGhpcy5hdmFpbGFibGVJbnB1dHNbaW5wdXRUeXBlXSkge1xuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLmF2YWlsYWJsZUlucHV0c1tpbnB1dFR5cGVdLmRhdGE7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIGlucHV0ID0gdGhpcy5hdmFpbGFibGVJbnB1dHNbJ3RleHQnXS5kYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBsb2FkRm9ybVRlbXBsYXRlKHR5cGUgOiBzdHJpbmcpIDogUHJvbWlzZTxhbnk+XG4gICAge1xuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG4gICAgICAgIGxldCBrZXkgPSAnZm9ybS0nICsgdHlwZTtcblxuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXNba2V5XSAmJiB0aGlzLnRlbXBsYXRlc1trZXldICE9IHVuZGVmaW5lZCAmJiB0aGlzLnRlbXBsYXRlc1trZXldICE9ICcnKSB7XG4gICAgICAgICAgICBkZmQucmVzb2x2ZSh0aGlzLnRlbXBsYXRlc1trZXldKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJC5nZXQoYWpheFVybCwge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdhY3Rpb25zJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA6IHR5cGUsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF90ZW1wbGF0ZSdcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW2tleV0gPSBkYXRhLmRhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBJIHNlbmQgYmFjayB0aGUgZGF0YVxuICAgICAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEuZGF0YSk7XG4gICAgICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEZpbGwgZm9ybSBkYXRhIHRoZSBpbmZvcyBpbnNpZGUgdGhlIGVkaXRvclxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtXG4gICAgICogQHBhcmFtICRmb3JtRGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBmaWxsSW5mb3MoJGVsZW0sJGZvcm1EYXRhKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCRlbGVtKTtcblxuICAgICAgICBpZigkZm9ybURhdGFbcHJvcC5hdHRyXSAmJiAkZm9ybURhdGFbcHJvcC5hdHRyXVtwcm9wLmlkXSkge1xuXG4gICAgICAgICAgICBFRl9JbnB1dC5zZXRJbnB1dFZhbHVlKCRlbGVtLCRmb3JtRGF0YVtwcm9wLmF0dHJdW3Byb3AuaWRdKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgdGhlIGRhdGEgaW5zaWRlIHRoZSBzdWJtaXQgYnV0dG9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3VibWl0XG4gICAgICovXG4gICAgcHJpdmF0ZSBhZGRTdWJtaXREYXRhKHN1Ym1pdCkgOiB2b2lkXG4gICAge1xuICAgICAgICBFRl9JbnB1dC5hZGREYXRhVG9FbGVtZW50KHRoaXMuJGJvZHkuZmluZCgnI2VmLWFkZC1zdWJtaXQnKSxzdWJtaXQpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBMb2FkIGFsbCB0aGUgaW5wdXRzIGZyb20gdGhlIGxpc3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dHNcbiAgICAgKiBAcGFyYW0gZGZkXG4gICAgICogQHBhcmFtIG9yZGVyXG4gICAgICovXG4gICAgcHJpdmF0ZSBsb2FkSW5wdXRzKGlucHV0cyA6IHsgYXR0cmlidXRlcyA6IHt0eXBlIDogc3RyaW5nIH19W10sb3JkZXIgOiBudW1iZXIsZGZkICA6IGFueSA9IG51bGwpIDogUHJvbWlzZTxhbnk+XG4gICAge1xuICAgICAgICBpZighZGZkKSB7XG4gICAgICAgICAgICBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhpbnB1dHMpO1xuXG4gICAgICAgIGxldCBrZXkgPSBrZXlzW29yZGVyXTtcblxuICAgICAgICBpZigha2V5IHx8ICFpbnB1dHMgfHwgIWlucHV0c1trZXldKXtcbiAgICAgICAgICAgIHRoaXMuaXNfaW5pdCA9IHRydWU7XG4gICAgICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSwnZmllbGRzJyk7XG4gICAgICAgICAgICBkZmQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5hZGRJbnB1dChpbnB1dHNba2V5XS5hdHRyaWJ1dGVzLnR5cGUsaW5wdXRzW2tleV0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9yZGVyKys7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cyxvcmRlcixkZmQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG4gICAgfVxuXG5cblxuICAgIHB1YmxpYyBnZW5lcmF0ZUZvcm0odHlwZSA6IHN0cmluZykgOiBFRl9Gb3JtXG4gICAge1xuICAgICAgICBsZXQgZm9ybTtcblxuICAgICAgICBpZighdGhpcy5hdmFpbGFibGVGb3Jtc1t0eXBlXSkge1xuICAgICAgICAgICAgdHlwZSA9ICdwb3N0JztcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnbG9naW4nIDpcbiAgICAgICAgICAgICAgICBmb3JtID0gbmV3IEVGX0Zvcm0oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Bvc3QnIDpcbiAgICAgICAgICAgICAgICBmb3JtID0gbmV3IEVGX0Zvcm0oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZighZm9ybSkge1xuICAgICAgICAgICAgZm9ybSA9IG5ldyBFRl9Gb3JtKCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiBmb3JtO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZW5lcmF0ZUlucHV0KHR5cGUgOiBzdHJpbmcpIDogRUZfSW5wdXRcbiAgICB7XG4gICAgICAgIGxldCBpbnB1dDtcblxuICAgICAgICBpZighdGhpcy5hdmFpbGFibGVJbnB1dHNbdHlwZV0pIHtcbiAgICAgICAgICAgIHR5cGUgPSAndGV4dCc7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHN3aXRjaCh0eXBlKSB7XG4gICAgICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG5ldyBFRl9JbnB1dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIWlucHV0KSB7XG4gICAgICAgICAgICBpbnB1dCA9IG5ldyBFRl9JbnB1dCgpO1xuICAgICAgICB9XG5cblxuICAgICAgICByZXR1cm4gaW5wdXQ7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogTG9hZCB0aGUgaW5wdXQgdGVtcGxhdGUgZnJvbSB0aGUgQk9cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlIDogc3RyaW5nXG4gICAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0SW5wdXQodHlwZSA6IHN0cmluZyA9ICd0ZXh0JylcbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGVzW3R5cGVdICYmIHRoaXMudGVtcGxhdGVzW3R5cGVdICE9IHVuZGVmaW5lZCAmJiB0aGlzLnRlbXBsYXRlc1t0eXBlXSAhPSAnJykge1xuICAgICAgICAgICAgZGZkLnJlc29sdmUodGhpcy50ZW1wbGF0ZXNbdHlwZV0pO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkLmdldChhamF4VXJsLCB7XG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ2lucHV0cycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgOiB0eXBlLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ0VGL2xvYWRfdGVtcGxhdGUnXG4gICAgICAgICAgICB9KS5zdWNjZXNzKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlc1t0eXBlXSA9IGRhdGEuZGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIEkgc2VuZCBiYWNrIHRoZSBkYXRhXG4gICAgICAgICAgICAgICAgZGZkLnJlc29sdmUoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgIH0pLmVycm9yKHRoaXMuaGFuZGxlRXJyb3IpO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBIVFRQIEVycm9yc1xuICAgICAqXG4gICAgICogQFRPRE9cbiAgICAgKi9cbiAgICBwdWJsaWMgaGFuZGxlRXJyb3IoZGF0YSA6IHN0cmluZ3x7cmVzcG9uc2VKU09OIDoge2Vycm9yfX0pIDogdm9pZFxuICAgIHtcblxuICAgICAgICBsZXQgZXJyb3IgOiBzdHJpbmc7XG5cbiAgICAgICAgaWYodHlwZW9mIGRhdGEgIT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgZXJyb3IgPSBkYXRhLnJlc3BvbnNlSlNPTi5lcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIEVGX0FkZC5lcnJvciA9IGVycm9yO1xuICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSk7XG5cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBHZXQgdGhlIHVybCBwYXJhbWV0ZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbWV0ZXJcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UGFyYW1ldGVyKHBhcmFtZXRlciA6IHN0cmluZyk6YW55XG4gICAge1xuICAgICAgICB2YXIgcGFyYW1zX3N0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpO1xuXG4gICAgICAgIHZhciBwYXJhbXNfYXJyYXkgPSBwYXJhbXNfc3RyaW5nLnNwbGl0KCcmJyk7XG5cbiAgICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgICBmb3IodmFyIGkgPTA7aTxwYXJhbXNfYXJyYXkubGVuZ3RoO2krKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGUgPSBwYXJhbXNfYXJyYXlbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgICAgIG9ialtlWzBdXSA9IGVbMV1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYmpbcGFyYW1ldGVyXTtcbiAgICB9XG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBEaXNwbGF5IGFuIGVycm9yIG1lc3NhZ2UgdGhhdCB3aWxsIGZhZGUgb3V0IGluIDUgc2VjXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXJyb3JNZXNzYWdlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXQgZXJyb3IoZXJyb3JNZXNzYWdlIDogc3RyaW5nfGJvb2xlYW4pIHtcblxuICAgICAgICBFRl9BZGQuc2V0TWVzc2FnZSgnI2Vycm9yLW1lc3NhZ2UnLGVycm9yTWVzc2FnZSxmYWxzZSk7XG5cbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBEaXNwbGF5IGEgc3VjY2VzcyBtZXNzYWdlIHRoYXQgd2lsbCBmYWRlIG91dCBpbiA1IHNlY1xuICAgICAqXG4gICAgICogQHBhcmFtIHN1Y2Nlc3NNZXNzYWdlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXQgc3VjY2VzcyhzdWNjZXNzTWVzc2FnZTogc3RyaW5nfGJvb2xlYW4pIHtcblxuICAgICAgICBFRl9BZGQuc2V0TWVzc2FnZSgnI3N1Y2Nlc3MtbWVzc2FnZScsc3VjY2Vzc01lc3NhZ2UsZmFsc2UpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbWVudFxuICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICogQHBhcmFtIHBlcnNpc3QgOiBib29sZWFuLCBXZWl0aGVyIG9yIG5vdCB0aGUgbWVzc2FnZSBzaG91bGQgYmUgZGlzcGxheWVkIG9yIG5vdFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0TWVzc2FnZShlbGVtZW50IDogc3RyaW5nLG1lc3NhZ2UgOiBzdHJpbmd8Ym9vbGVhbiwgcGVyc2lzdCA6IGJvb2xlYW58bnVtYmVyID0gZmFsc2UpIDogdm9pZFxuICAgIHtcblxuICAgICAgICBpZihtZXNzYWdlKSB7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLnRleHQobWVzc2FnZSkuZmFkZUluKDIwMCk7XG5cbiAgICAgICAgICAgIGlmKCFwZXJzaXN0KSB7XG5cbiAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCBwZXJzaXN0IGlzIG5vdCBlcXVhbCB0byBmYWxzZVxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBwZXJzaXN0ID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgICAgICAgICBwZXJzaXN0ID0gNTAwMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRNZXNzYWdlKGVsZW1lbnQsJycpO1xuICAgICAgICAgICAgICAgIH0scGVyc2lzdCk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLmZhZGVPdXQoMjAwLCgpID0+IHtcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnRleHQoJycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxudmFyIEVGX2FkZCA9IG5ldyBFRl9BZGQoKTtcbkVGX2FkZC5pbml0KCk7Il19
