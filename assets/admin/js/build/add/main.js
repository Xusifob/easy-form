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
                    this.handleCheckbox();
                };
                /**
                 * Handle the checkboxs to link them with a hidden input
                 */
                EF_Input.prototype.handleCheckbox = function() {
                    this.element.find('input[type="checkbox"]').each(function(key, input) {
                        var $input = $(input);
                        var value = $input.is(":checked") ? 1 : 0;
                        var name = $input.attr("name");
                        $input.attr("name", "");
                        var $hidden = $('<input type="hidden" name="' + name + '" value="' + value + '">');
                        $input.on("change", function() {
                            var value = $input.is(":checked") ? 1 : 0;
                            $hidden.attr("value", value);
                        });
                        $input.after($hidden);
                    });
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
                        if ("1" == value || value == "on") {
                            value = true;
                        } else {
                            value = false;
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
                        _this.defaultInputTypes = data.data.default_inputs;
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
                    // Default type
                    var type = "text";
                    if (this.defaultInputTypes[inputType]) {
                        type = this.defaultInputTypes[inputType];
                    }
                    if (this.availableInputs[type]) {
                        input = this.availableInputs[type].data;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2lucHV0cy9FRl9JbnB1dC50cyIsImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2Zvcm1zL0VGX0Zvcm0udHMiLCJhc3NldHMvYWRtaW4vanMvc3JjL2FkZC9FRl9BZGQudHMiXSwibmFtZXMiOlsiRUZfSW5wdXQiLCJ0aGlzIiwiZGlydHkiLCJjb250YWluZXIiLCIkIiwicHJvdG90eXBlIiwiaW5pdCIsIiRlbGVtZW50IiwiaWQiLCIkZGF0YSIsInBvc2l0aW9uIiwicmVwbGFjZSIsImVsZW1lbnQiLCJvcHRpb25zRWxlbWVudCIsImZpbmQiLCJhcHBlbmQiLCJyZXBsYWNlV2l0aCIsInNldEV2ZW50cyIsImFkZERhdGEiLCJoYW5kbGVDaGVja2JveCIsImVhY2giLCJrZXkiLCJpbnB1dCIsIiRpbnB1dCIsInZhbHVlIiwiaXMiLCJuYW1lIiwiYXR0ciIsIiRoaWRkZW4iLCJvbiIsImFmdGVyIiwiX3RoaXMiLCJvZmYiLCJ0b2dnbGUiLCJvbkR1cGxpY2F0ZSIsIm9uQ2hhbmdlVHlwZSIsIm9uRGVsZXRlIiwib25Nb3ZlIiwiZWxlbSIsImhhc0NsYXNzIiwiY2xvc2UiLCJvcGVuIiwiYWRkRGF0YVRvRWxlbWVudCIsInByb3AiLCJnZXRJbnB1dFByb3BlcnRpZXMiLCJzZXRJbnB1dFZhbHVlIiwidmFsIiwiZ2V0SW5wdXRWYWx1ZSIsImRhdGEiLCJzcGxpdCIsImhpZGUiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiaHRtbCIsInNob3ciLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInR5cGUiLCJFRl9Gb3JtIiwiRUZfSW5wdXRfMSIsIkVGX0FkZCIsInRlbXBsYXRlcyIsImlucHV0cyIsImF2YWlsYWJsZUlucHV0cyIsImF2YWlsYWJsZUZvcm1zIiwiaXNfaW5pdCIsIiRib2R5IiwibG9hZCIsInRoZW4iLCJhZGRJbnB1dCIsImxvYWRpbmciLCIkZXZlbnQiLCJ0YXJnZXQiLCJjaGFuZ2VGb3JtVHlwZSIsInJlb3JnYW5pc2UiLCJkZmQiLCJEZWZlcnJlZCIsInB1c2giLCJyZW1vdmVBbGxJbnB1dHMiLCJsb2FkSW5wdXRzIiwicmVzb2x2ZSIsInByb21pc2UiLCJkaXJlY3Rpb24iLCJpbmRleE9mIiwibmV3cG9zIiwiY29uc29sZSIsImxvZyIsImxlbmd0aCIsInN3aXRjaCIsInBvczEiLCJwb3MyIiwiaW5wdXQxIiwiYXR0cmlidXRlcyIsInN1Y2Nlc3MiLCJzcGxpY2UiLCJnZXRJbnB1dCIsImdlbmVyYXRlSW5wdXQiLCJhY3Rpb24iLCJnZXRKU09OIiwiYWpheFVybCIsImZvcm1faWQiLCJnZXRQYXJhbWV0ZXIiLCJmb3JtIiwiYWRkRm9ybURhdGEiLCJmb3JtcyIsImRlZmF1bHRJbnB1dFR5cGVzIiwiZGVmYXVsdF9pbnB1dHMiLCJzdWJtaXQiLCJhZGRTdWJtaXREYXRhIiwiZm9yRWFjaCIsImFkZFJlcXVpcmVkRmllbGRzIiwiZXJyb3IiLCJoYW5kbGVFcnJvciIsIiRmb3JtRGF0YSIsImZpbGxJbmZvcyIsImZvcm1UeXBlIiwibG9hZEZvcm1UZW1wbGF0ZSIsIiR0ZW1wbGF0ZSIsImdlbmVyYXRlRm9ybSIsInJlcXVpcmVkIiwicmVtb3ZlVW50b3VjaGVkSW5wdXRzIiwiaW5kZXgiLCJpbkFycmF5IiwiaW5wdXROYW1lIiwiZ2V0QXZhaWxhYmxlSW5wdXREYXRhIiwiam9pbiIsImlucHV0VHlwZSIsInVuZGVmaW5lZCIsImdldCIsInRlbXBsYXRlIiwiJGVsZW0iLCJFRl9JbnB1dF8yIiwib3JkZXIiLCJrZXlzIiwiRUZfRm9ybV8xIiwicmVzcG9uc2VKU09OIiwicGFyYW1ldGVyIiwicGFyYW1zX3N0cmluZyIsIndpbmRvdyIsImxvY2F0aW9uIiwic2VhcmNoIiwic3Vic3RyIiwicGFyYW1zX2FycmF5Iiwib2JqIiwiaSIsImUiLCJlcnJvck1lc3NhZ2UiLCJzZXRNZXNzYWdlIiwic3VjY2Vzc01lc3NhZ2UiLCJtZXNzYWdlIiwicGVyc2lzdCIsInRleHQiLCJmYWRlSW4iLCJzZXRUaW1lb3V0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QUdkRyxXQUFXO2dDQUNQMUgsTUFBS29ILFdBQVd2SSxTQUFROytCQUMxQjBJOzsyQkFJSjt3QkFDRmxKLEVBQUVRLFNBQVM4SSxRQUFRLEtBQUk7NEJBQ25CdEosRUFBRVEsU0FBUzJJLEtBQUs7Ozs7Z0JBS2hDLE9BQUEzRjs7WUFFSStGLFNBQVMsSUFBSS9GO1lBQ2pCK0YsT0FBT3JKIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBFRl9JbnB1dFxue1xuXG4gICAgLyoqXG4gICAgICogQHZhciBzdHJpbmdcbiAgICAgKlxuICAgICAqIFRoZSB0eXBlIG9mIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdHlwZSA6IHN0cmluZyA9ICd0ZXh0JztcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgb2YgdGhlIGlucHV0XG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgZWxlbWVudCA6IGFueTtcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgZm9yIHRoZSBvcHRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgb3B0aW9uc0VsZW1lbnQgOiBhbnk7XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBpZCAocG9zaXRpb24pIG9mIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBpZCA6IG51bWJlcjtcblxuXG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgY29udGFpbmVyXG4gICAgICovXG4gICAgcHVibGljIGNvbnRhaW5lciA6IGFueTtcblxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIGZpZWxkIGhhcyBiZWVuIGNoYW5nZWQgb3Igbm90XG4gICAgICovXG4gICAgcHVibGljIGRpcnR5IDogYm9vbGVhbiA9IGZhbHNlO1xuXG5cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiBjYWxsZWQgb24gZHVwbGljYXRlXG4gICAgICovXG4gICAgcHVibGljIG9uRHVwbGljYXRlIDogYW55O1xuICAgIHB1YmxpYyBvbkNoYW5nZVR5cGUgOiBhbnk7XG4gICAgcHVibGljIG9uRGVsZXRlIDogYW55O1xuICAgIHB1YmxpYyBvbk1vdmUgOiBhbnk7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIgPSAkKCcjZmxkJyk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICogQHBhcmFtIGlkXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIDogbnVtYmVyXG4gICAgICovXG4gICAgcHVibGljIGluaXQoJGVsZW1lbnQgOiBhbnksIGlkIDogbnVtYmVyLCRkYXRhIDogYW55LHBvc2l0aW9uIDogbnVsbHxudW1iZXIgPSBudWxsKVxuICAgIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgICAgICRlbGVtZW50ID0gJGVsZW1lbnQucmVwbGFjZSgvZmllbGRVbklkL2csaWQrMSk7XG4gICAgICAgICRlbGVtZW50ID0gJGVsZW1lbnQucmVwbGFjZSgvZmllbGRJZC9nLGlkKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKCRlbGVtZW50KTtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudCA9IHRoaXMuZWxlbWVudC5maW5kKCcuZWYtdGFibGUnKTtcblxuICAgICAgICBpZihudWxsID09PSBwb3NpdGlvbikge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmZpbmQoJyNmaWVsZC0nICsgcG9zaXRpb24pLnJlcGxhY2VXaXRoKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuXG4gICAgICAgIHRoaXMuYWRkRGF0YSgkZGF0YSk7XG5cbiAgICAgICAgdGhpcy5oYW5kbGVDaGVja2JveCgpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGNoZWNrYm94cyB0byBsaW5rIHRoZW0gd2l0aCBhIGhpZGRlbiBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVDaGVja2JveCgpXG4gICAge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGlucHV0IDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGxldCAkaW5wdXQgPSAkKGlucHV0KTtcblxuICAgICAgICAgICAgbGV0IHZhbHVlID0gJGlucHV0LmlzKCc6Y2hlY2tlZCcpID8gMSA6IDA7XG4gICAgICAgICAgICBsZXQgbmFtZSA9ICRpbnB1dC5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgICAkaW5wdXQuYXR0cignbmFtZScsJycpO1xuXG4gICAgICAgICAgICBsZXQgJGhpZGRlbiA9ICQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cIicrIG5hbWUgKydcIiB2YWx1ZT1cIicrIHZhbHVlICsnXCI+Jyk7XG5cblxuICAgICAgICAgICAgJGlucHV0Lm9uKCdjaGFuZ2UnLCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSAkaW5wdXQuaXMoJzpjaGVja2VkJykgPyAxIDogMDtcbiAgICAgICAgICAgICAgICAkaGlkZGVuLmF0dHIoJ3ZhbHVlJyx2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGlucHV0LmFmdGVyKCRoaWRkZW4pXG5cbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFNldCBhbGwgdGhlIGV2ZW50cyBsaW5rZWQgdG8gdGhpcyBlbGVtZW50XG4gICAgICovXG4gICAgcHVibGljIHNldEV2ZW50cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cIm9wZW4tY2xvc2VcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7cmV0dXJuIHRoaXMudG9nZ2xlKCl9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cImR1cGxpY2F0ZVwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHt0aGlzLm9uRHVwbGljYXRlKHRoaXMpOyByZXR1cm4gZmFsc2U7fSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJjaGFuZ2UtdHlwZVwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHt0aGlzLm9uQ2hhbmdlVHlwZSh0aGlzKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwiZGVsZXRlXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3RoaXMub25EZWxldGUodGhpcyk7IHJldHVybiBmYWxzZTt9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cInVwXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3RoaXMub25Nb3ZlKHRoaXMsJ3VwJyk7IHJldHVybiBmYWxzZTt9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cImRvd25cIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7dGhpcy5vbk1vdmUodGhpcywnZG93bicpOyByZXR1cm4gZmFsc2U7fSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdzZWxlY3QsaW5wdXQsdGV4dGFyZWEnKS5vbignaW5wdXQnLCAoKSA9PiB7IHRoaXMuZGlydHkgPSB0cnVlO30pO1xuICAgIH1cblxuXG5cblxuICAgIC8qKlxuICAgICAqIENsb3NlIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgcHVibGljIHRvZ2dsZSgpOiBib29sZWFuXG4gICAge1xuXG4gICAgICAgIGxldCBlbGVtID0gdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cIm9wZW4tY2xvc2VcIl0nKTtcblxuICAgICAgICBpZigkKGVsZW0pLmhhc0NsYXNzKCdtaW5pZnknKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3BlbigpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEluc2VydCB0aGUgZGF0YSBpbiB0aGUgdGVtcGxhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBhZGREYXRhKCRkYXRhKSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgaWYoJGRhdGEuZGlydHkpIHtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSAkZGF0YS5kaXJ0eTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgRUZfSW5wdXQuYWRkRGF0YVRvRWxlbWVudCh0aGlzLmVsZW1lbnQsJGRhdGEpXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqIEBwYXJhbSAkZGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYWRkRGF0YVRvRWxlbWVudCgkZWxlbWVudCA6IGFueSwgJGRhdGEgOiBhbnkpIDogdm9pZFxuICAgIHtcbiAgICAgICAgJGVsZW1lbnQuZmluZCgnW25hbWVePVwiZmllbGRcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkKGVsZW0pKTtcblxuICAgICAgICAgICAgaWYoJGRhdGFbcHJvcC5wcm9wXSAmJiAkZGF0YVtwcm9wLnByb3BdW3Byb3AubmFtZV0pIHtcbiAgICAgICAgICAgICAgICBFRl9JbnB1dC5zZXRJbnB1dFZhbHVlKCQoZWxlbSksJGRhdGFbcHJvcC5wcm9wXVtwcm9wLm5hbWVdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCBhIHZhbHVlIHRvIGFuIGlucHV0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKiBAcGFyYW0gdmFsdWVcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldElucHV0VmFsdWUoaW5wdXQgOiBhbnksIHZhbHVlIDogc3RyaW5nfGJvb2xlYW4pXG4gICAge1xuICAgICAgICBpZihpbnB1dC5pcygnOmNoZWNrYm94Jykpe1xuICAgICAgICAgICAgaWYoXCIxXCIgPT0gdmFsdWUgfHwgdmFsdWUgPT0gJ29uJykge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5wdXQucHJvcCgnY2hlY2tlZCcsdmFsdWUpO1xuICAgICAgICB9ZWxzZSBpZihpbnB1dC5pcygnc2VsZWN0Jykpe1xuICAgICAgICAgICAgaW5wdXQuZmluZCgnb3B0aW9uW3ZhbHVlPVwiJysgdmFsdWUgKydcIl0nKS5wcm9wKCdzZWxlY3RlZCcsdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGlucHV0LnZhbCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiBhbiBpbnB1dFxuICAgICAqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKiBAcmV0dXJucyBhbnlcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldElucHV0VmFsdWUoaW5wdXQgOiBhbnkpXG4gICAge1xuXG4gICAgICAgIGlmKHR5cGVvZiBpbnB1dC52YWwgIT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmKGlucHV0LmlzKCc6Y2hlY2tib3gnKSl7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQuaXMoJzpjaGVja2VkJyk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnZhbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIGFsbCB0aGUgcHJvcGVydGllcyBvZiBhbiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIGVsZW1cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldElucHV0UHJvcGVydGllcyhlbGVtIDogYW55KSA6IHthdHRyLGlkLHByb3AsbmFtZX1cbiAgICB7XG5cbiAgICAgICAgbGV0IG5hbWUgPSBlbGVtLmF0dHIoJ25hbWUnKTtcblxuICAgICAgICBsZXQgZGF0YSA9IG5hbWUuc3BsaXQoJ1snKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXR0ciA6IGRhdGFbMF0ucmVwbGFjZSgnXScsJycpLFxuICAgICAgICAgICAgaWQgOiBkYXRhWzFdLnJlcGxhY2UoJ10nLCcnKSxcbiAgICAgICAgICAgIHByb3AgOiBkYXRhWzJdID8gZGF0YVsyXS5yZXBsYWNlKCddJywnJykgOiAnJyxcbiAgICAgICAgICAgIG5hbWUgOiBkYXRhWzNdID8gZGF0YVszXS5yZXBsYWNlKCddJywnJykgOiAnJyxcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHNpbmNlIDEuMS4wXG4gICAgICpcbiAgICAgKiBAZXZlbnQgOiBDbGljayBvbiBtaW5pZnkgYnV0dG9uIDogaGlkZSB0aGUgb3B0aW9ucyBvZiB0aGUgZmllbGRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcHVibGljIGNsb3NlKCkgOiBib29sZWFuXG4gICAge1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50LmhpZGUoMjAwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5taW5pZnknKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdtaW5pZnknKVxuICAgICAgICAgICAgLmFkZENsYXNzKCdvcGVuJylcbiAgICAgICAgICAgIC5odG1sKCcrJyk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAc2luY2UgMS4xLjBcbiAgICAgKlxuICAgICAqIE9wZW4gYSBmaWVsZFxuICAgICAqXG4gICAgICogQGV2ZW50IDogQ2xpY2sgb24gb3BlbiBidXR0b24sIHNob3cgdGhlIGZpZWxkIG9wdGlvbnNcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcHVibGljIG9wZW4oKSA6IGJvb2xlYW5cbiAgICB7XG4gICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQuc2hvdygyMDApO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLm9wZW4nKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdvcGVuJylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnbWluaWZ5JylcbiAgICAgICAgICAgIC5odG1sKCctJyk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gdGhlIHZhbHVlIG9mIGFsbCB0aGUgaW5wdXRzIGluIHRoZSBmaWVsZFxuICAgICAqXG4gICAgICovXG4gICAgZ2V0IHZhbHVlKCk6IGFueSB7XG5cbiAgICAgICAgbGV0IHZhbHVlID0ge1xuICAgICAgICAgICAgZGlydHkgOiB0aGlzLmRpcnR5LFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbbmFtZV49XCJmaWVsZFwiXScpLmVhY2goKGtleSA6IG51bWJlcixpbnB1dCA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkKGlucHV0KSk7XG4gICAgICAgICAgICBsZXQgdmFsID0gRUZfSW5wdXQuZ2V0SW5wdXRWYWx1ZSgkKGlucHV0KSk7XG5cbiAgICAgICAgICAgIGlmKHByb3AucHJvcCAmJiAhdmFsdWVbcHJvcC5wcm9wXSAmJiBwcm9wLm5hbWUpe1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AucHJvcF0gPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodmFsdWVbcHJvcC5wcm9wXSkge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AucHJvcF1bcHJvcC5uYW1lXSA9IHZhbDtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLnByb3BdID0gdmFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgIH1cblxufSIsImltcG9ydCB7RUZfSW5wdXR9IGZyb20gXCIuLi9pbnB1dHMvRUZfSW5wdXRcIjtcblxuZGVjbGFyZSB2YXIgJCA6IGFueTtcblxuZXhwb3J0IGNsYXNzIEVGX0Zvcm0ge1xuXG4gICAgLyoqXG4gICAgICogQHZhciBzdHJpbmdcbiAgICAgKlxuICAgICAqIFRoZSB0eXBlIG9mIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdHlwZTogc3RyaW5nID0gJ3RleHQnO1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIEhUTUwgRWxlbWVudFxuICAgICAqXG4gICAgICogVGhlIGh0bWwgZWxlbWVudCBvZiB0aGUgaW5wdXRcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBlbGVtZW50OiBhbnk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBlbGVtZW50IG9mIHRoZSBjb250YWluZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgY29udGFpbmVyIDogYW55O1xuXG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIgPSAkKCcjdXRpbGl0aWVzJyk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqL1xuICAgIHB1YmxpYyBpbml0KCRlbGVtZW50IDogYW55KVxuICAgIHtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKCRlbGVtZW50KTtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5odG1sKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJldHVybiB0aGUgdmFsdWUgb2YgYWxsIHRoZSBpbnB1dHMgaW4gdGhlIGZpZWxkXG4gICAgICpcbiAgICAgKi9cbiAgICBnZXQgdmFsdWUoKTogYW55IHtcblxuICAgICAgICBsZXQgdmFsdWUgPSB7fTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW25hbWVePVwic2V0dGluZ3NcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsaW5wdXQgOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJChpbnB1dCkpO1xuICAgICAgICAgICAgbGV0IHZhbCA9IEVGX0lucHV0LmdldElucHV0VmFsdWUoJChpbnB1dCkpO1xuXG4gICAgICAgICAgICBpZihwcm9wLmF0dHIgJiYgIXZhbHVlW3Byb3AuYXR0cl0gJiYgcHJvcC5pZCl7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5hdHRyXSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih2YWx1ZVtwcm9wLmF0dHJdKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5hdHRyXVtwcm9wLmlkXSA9IHZhbDtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLmF0dHJdID0gdmFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgfVxuXG5cblxuXG59IiwiaW1wb3J0IHtFRl9Gb3JtfSBmcm9tIFwiLi9mb3Jtcy9FRl9Gb3JtXCI7XG5cbmRlY2xhcmUgdmFyICQ7XG5cbmRlY2xhcmUgdmFyIGFqYXhVcmwgOiBzdHJpbmc7XG5cbmltcG9ydCB7RUZfSW5wdXR9IGZyb20gJy4vaW5wdXRzL0VGX0lucHV0JztcblxuY2xhc3MgRUZfQWRkXG57XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBIVE1MIEJvZHkgb2YgdGhlIHBhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgJGJvZHk7XG5cbiAgICAvKipcbiAgICAgKkFuIG9iamVjdCBvZiBhbGwgdGhlIGlucHV0IHRlbXBsYXRlcyBjYWNoZWQgdG8gYXZvaWQgbGF0ZW5jeVxuICAgICAqL1xuICAgIHB1YmxpYyB0ZW1wbGF0ZXMgOiBhbnkgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIGFsbCB0aGUgaW5wdXRzIGF2YWlsYWJsZSBvbiB0aGUgcGFnZVxuICAgICAqL1xuICAgIHB1YmxpYyBpbnB1dHMgOiBFRl9JbnB1dFtdID0gW107XG5cblxuICAgIC8qKlxuICAgICAqIEFsbCB0aGUgYXZhaWxhYmxlIGlucHV0c1xuICAgICAqL1xuICAgIHB1YmxpYyBhdmFpbGFibGVJbnB1dHMgOiB7fSA9IHt9O1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGF2YWlsYWJsZSBpbnB1dHNcbiAgICAgKi9cbiAgICBwdWJsaWMgYXZhaWxhYmxlRm9ybXMgOiB7fSA9IHt9O1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGRlZmF1bHQgaW5wdXQgdHlwZXMuIEV4IDogdXNlcl9wYXNzIDogcGFzc3dvcmRcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVmYXVsdElucHV0VHlwZXMgOiB7fTtcblxuXG4gICAgcHVibGljIGZvcm1UeXBlIDogRUZfRm9ybTtcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBlZGl0b3IgaXMgaW5pdFxuICAgICAqL1xuICAgIHB1YmxpYyBpc19pbml0IDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuJGJvZHkgPSAkKCdib2R5Jyk7XG5cbiAgICB9XG5cblxuICAgIHB1YmxpYyBpbml0KCkge1xuXG4gICAgICAgIHRoaXMuc2V0RXZlbnRzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkKCkudGhlbigoZGF0YSkgPT4ge30pXG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICAvKlxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLm1vdmUnLF9tb3ZlKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLnVwJyxfdXApO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcuZG93bicsX2Rvd24pO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcucmVtb3Zlb3B0aW9uJyxfcmVtb3ZlT3B0aW9uKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLmR1cGxpcXVlcicsX2R1cGxpY2F0ZSk7Ki9cblxuICAgICAgICAvLyBBZGQgYSBuZXcgZmllbGRcbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9mZignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGRcIl0nKVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJ2J1dHRvbltkYXRhLWFjdGlvbj1cImFkZFwiXScsKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkSW5wdXQoJ3RleHQnLHt9KS50aGVuKChpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pIH0pO1xuXG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9mZignY2xpY2snLCdzZWxlY3RbbmFtZT1cInNldHRpbmdzW3R5cGVdXCJdJylcbiAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWU9XCJzZXR0aW5nc1t0eXBlXVwiXScsKCRldmVudCA6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSAkKCRldmVudC50YXJnZXQpLnZhbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlRm9ybVR5cGUodHlwZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAvKlxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjbGljaycsJ2J1dHRvbltkYXRhLWFjdGlvbj1cImFkZC1vcHRpb25cIl0nLF9hZGRPcHRpb24pO1xuXG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWUkPVwiW2Zvcm0tdGF4b25vbXldXCJdJyxfY2hhbmdlVGF4b25vbXkpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsJ3NlbGVjdFtuYW1lPVwiZm9ybS1yZXNldC1hY3Rpb25cIl0nLF9jaGFuZ2VSZXNldEFjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICovXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBSZW9yZ2FuaXNlIGFsbCB0aGUgaW5wdXRzIG9uIHRoZSBwYWdlIGFjY29yZGluZyB0byB0aGUgb25lc1xuICAgICAqL1xuICAgIHB1YmxpYyByZW9yZ2FuaXNlKCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG5cbiAgICAgICAgbGV0IGRmZCA9ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBFRl9BZGQubG9hZGluZyh0cnVlLCdmaWVsZHMnKTtcblxuXG4gICAgICAgIGxldCBpbnB1dHMgPSBbXTtcblxuICAgICAgICAkLmVhY2godGhpcy5pbnB1dHMsKGtleSxpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICBpbnB1dHMucHVzaChpbnB1dC52YWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsSW5wdXRzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cywwKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBDYWxsZWQgd2hlbiAyIGlucHV0cyBhcmUgbW92ZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqIEBwYXJhbSBkaXJlY3Rpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgb25Nb3ZlKGlucHV0IDogRUZfSW5wdXQsZGlyZWN0aW9uIDogc3RyaW5nID0gJ3VwJykgOiBhbnlcbiAgICB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHRoaXMuaW5wdXRzLmluZGV4T2YoaW5wdXQpO1xuXG4gICAgICAgIGxldCBuZXdwb3MgPSBkaXJlY3Rpb24gPT0gJ3VwJyA/IHBvc2l0aW9uLTEgOiBwb3NpdGlvbiArMTtcblxuICAgICAgICBjb25zb2xlLmxvZyhkaXJlY3Rpb24sbmV3cG9zLHBvc2l0aW9uKTtcblxuICAgICAgICBpZihuZXdwb3MgPT0gLTEgfHwgbmV3cG9zID09IHRoaXMuaW5wdXRzLmxlbmd0aCB8fCAhdGhpcy5pbnB1dHNbbmV3cG9zXSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN3aXRjaChwb3NpdGlvbixuZXdwb3MpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTd2l0Y2ggMiBpbnB1dHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwb3MxXG4gICAgICogQHBhcmFtIHBvczJcbiAgICAgKi9cbiAgICBwdWJsaWMgc3dpdGNoKHBvczEgOiBudW1iZXIsIHBvczI6IG51bWJlcilcbiAgICB7XG4gICAgICAgIGxldCBpbnB1dDEgPSB0aGlzLmlucHV0c1twb3MxXTtcblxuICAgICAgICB0aGlzLmlucHV0c1twb3MxXSA9IHRoaXMuaW5wdXRzW3BvczJdO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzW3BvczJdID0gaW5wdXQxO1xuXG4gICAgICAgIHRoaXMucmVvcmdhbmlzZSgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFsbCBpbnB1dHMgZnJvbSB0cmFja1xuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmVBbGxJbnB1dHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gW107XG4gICAgICAgIHRoaXMuJGJvZHkuZmluZCgnI2ZsZCcpLmh0bWwoJycpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBDYWxsZWQgb24gY2xpY2sgb24gdGhlIGR1cGxpY2F0ZSBidXR0b25cbiAgICAgKlxuICAgICAqIEBFdmVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIG9uRHVwbGljYXRlKGlucHV0IDogRUZfSW5wdXQpIDogYW55XG4gICAge1xuXG4gICAgICAgIHRoaXMuYWRkSW5wdXQoaW5wdXQudmFsdWUuYXR0cmlidXRlcy50eXBlLGlucHV0LnZhbHVlKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIEVGX0FkZC5zdWNjZXNzICA9ICdUaGVtIGlucHV0IGhhcyBiZWVuIGR1cGxpY2F0ZWQnO1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UpO1xuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgY2hhbmdlIG9mIHR5cGUgaXMgdHJpZ2dlcmVkXG4gICAgICpcbiAgICAgKiBARXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBvbkNoYW5nZVR5cGUoaW5wdXQgOiBFRl9JbnB1dCkgOiBhbnlcbiAgICB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHRoaXMuaW5wdXRzLmluZGV4T2YoaW5wdXQpO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IGlucHV0LnZhbHVlO1xuXG4gICAgICAgIHRoaXMuYWRkSW5wdXQodmFsdWUuYXR0cmlidXRlcy50eXBlLHZhbHVlLHBvc2l0aW9uKS50aGVuKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ2ZpZWxkcycpO1xuICAgICAgICAgICAgaW5wdXQub3BlbigpO1xuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBDYWxsZWQgb24gZGVsZXRlIG9mIGFuIGlucHV0XG4gICAgICpcbiAgICAgKiBARXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBvbkRlbGV0ZShpbnB1dCA6IEVGX0lucHV0KSA6IGFueVxuICAgIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5pbnB1dHMuaW5kZXhPZihpbnB1dCk7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMuc3BsaWNlKHBvc2l0aW9uLDEpO1xuXG4gICAgICAgIHRoaXMucmVvcmdhbmlzZSgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQWRkIGFuIGlucHV0IHRvIHRoZSBlZGl0b3JcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkSW5wdXQodHlwZSA6IHN0cmluZyA9ICd0ZXh0JywkZGF0YSxwb3NpdGlvbiA6IG51bWJlcnxudWxsID0gbnVsbCkgOiBQcm9taXNlPEVGX0lucHV0PlxuICAgIHtcblxuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG5cbiAgICAgICAgRUZfQWRkLmxvYWRpbmcodHJ1ZSwnZmllbGRzJyk7XG5cbiAgICAgICAgLy8gQ2xvc2UgYWxsIHRoZSBpbnB1dHNcbiAgICAgICAgJC5lYWNoKHRoaXMuaW5wdXRzLChrZXkgOiBudW1iZXIsIGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgIGlucHV0LmNsb3NlKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5nZXRJbnB1dCh0eXBlKS50aGVuKChkYXRhIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBpbnB1dCA6IEVGX0lucHV0O1xuXG4gICAgICAgICAgICBpbnB1dCA9IHRoaXMuZ2VuZXJhdGVJbnB1dCh0eXBlKTtcblxuICAgICAgICAgICAgaW5wdXQuaW5pdChkYXRhLHBvc2l0aW9uID8gcG9zaXRpb24gOiB0aGlzLmlucHV0cy5sZW5ndGgsJGRhdGEscG9zaXRpb24pO1xuXG4gICAgICAgICAgICBpbnB1dC5vbkR1cGxpY2F0ZSA9IChpbnB1dCA6IEVGX0lucHV0ICkgPT4geyB0aGlzLm9uRHVwbGljYXRlKGlucHV0KSB9O1xuICAgICAgICAgICAgaW5wdXQub25DaGFuZ2VUeXBlID0gKGlucHV0IDogRUZfSW5wdXQpID0+IHsgdGhpcy5vbkNoYW5nZVR5cGUoaW5wdXQpIH07XG4gICAgICAgICAgICBpbnB1dC5vbkRlbGV0ZSA9IChpbnB1dCA6IEVGX0lucHV0KSA9PiB7IHRoaXMub25EZWxldGUoaW5wdXQpIH07XG4gICAgICAgICAgICBpbnB1dC5vbk1vdmUgPSAoaW5wdXQ6ICBFRl9JbnB1dCwgYWN0aW9uIDogc3RyaW5nKSA9PiB7IHRoaXMub25Nb3ZlKGlucHV0LGFjdGlvbikgfTtcblxuICAgICAgICAgICAgaWYocG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0c1twb3NpdGlvbl0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMucHVzaChpbnB1dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKGlucHV0KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogU2hvdyBvciBoaWRlIHRoZSBsb2FkaW5nc1xuICAgICAqXG4gICAgICogQHBhcmFtIGxvYWRpbmdcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGxvYWRpbmcobG9hZGluZyA6IGJvb2xlYW4gPSB0cnVlLCRlbGVtZW50IDogbnVsbHxzdHJpbmcgPSBudWxsKVxuICAgIHtcbiAgICAgICAgLy8gU2hvdyB0aGUgc3Bpbm5lclxuXG4gICAgICAgIHN3aXRjaCAoJGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNhc2UgJ2ZpZWxkcycgOlxuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLWZpZWxkcycpLnRvZ2dsZShsb2FkaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3V0aWxpdHknIDpcbiAgICAgICAgICAgICAgICAkKCcjc3Bpbm5lci11dGlsaXR5JykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAkKCcjc3Bpbm5lci11dGlsaXR5JykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLWZpZWxkcycpLnRvZ2dsZShsb2FkaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBMb2FkIHRoZSBmb3JtIGRhdGEgZnJvbSB0aGUgYmFjayBvZmZpY2VcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZCgpIDogUHJvbWlzZTxhbnk+XG4gICAge1xuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG4gICAgICAgICQuZ2V0SlNPTihhamF4VXJsLCB7XG4gICAgICAgICAgICBmb3JtX2lkIDogRUZfQWRkLmdldFBhcmFtZXRlcigncG9zdCcpLFxuICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF9mb3JtX2RhdGEnXG4gICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBkYXRhIGZvciBhbGwgdGhlIGZvcm1cbiAgICAgICAgICAgIHRoaXMuYWRkRGF0YShkYXRhLmRhdGEuZm9ybSk7XG4gICAgICAgICAgICB0aGlzLmFkZEZvcm1EYXRhKGRhdGEuZGF0YS5mb3JtKTtcblxuXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5kYXRhLmlucHV0cywodHlwZSxpbnB1dCA6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlSW5wdXRzW3R5cGVdID0gaW5wdXQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJC5lYWNoKGRhdGEuZGF0YS5mb3JtcywodHlwZSxpbnB1dCA6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlRm9ybXNbdHlwZV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdElucHV0VHlwZXMgPSBkYXRhLmRhdGEuZGVmYXVsdF9pbnB1dHM7XG5cblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBzdWJtaXQgZGF0YVxuICAgICAgICAgICAgaWYoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdCkge1xuICAgICAgICAgICAgICAgIGxldCBzdWJtaXQgPSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkU3VibWl0RGF0YShzdWJtaXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMb2FkIGFsbCB0aGUgaW5wdXRzXG4gICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLDApLnRoZW4oKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgodmFsdWUgOiBFRl9JbnB1dCxrZXkgOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHNba2V5XS5kaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFkZFJlcXVpcmVkRmllbGRzKGRhdGEuZGF0YS5mb3JtLnR5cGUpO1xuICAgICAgICAgICAgfSk7XG5cblxuXG4gICAgICAgICAgICAvLyBJIHNlbmQgYmFjayB0aGUgZGF0YVxuICAgICAgICAgICAgZGZkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgIH0pLmVycm9yKHRoaXMuaGFuZGxlRXJyb3IpO1xuXG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQWRkIHRoZSBkYXRhIGluc2lkZSB0aGUgZm9ybSBpdHNlbGZcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZm9ybURhdGFcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYWRkRGF0YSgkZm9ybURhdGEgOiBhbnkpIDogdm9pZFxuICAgIHtcblxuICAgICAgICAkKCcjZWYtYWRkLW1haW4taW5mbycpLmZpbmQoJ1tuYW1lXj1cInNldHRpbmdzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcjZWYtYWRkLW1haW4taW5mbycpLmZpbmQoJ1tuYW1lXj1cImF0dHJpYnV0ZXNcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxJbmZvcygkKGVsZW0pLCRmb3JtRGF0YSk7XG5cbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgY2hhbmdlRm9ybVR5cGUodHlwZSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIEVGX0FkZC5sb2FkaW5nKHRydWUsJ3V0aWxpdHknKTtcblxuICAgICAgICBsZXQgJGZvcm1EYXRhID0gdGhpcy5mb3JtVHlwZS52YWx1ZTtcblxuICAgICAgICAkZm9ybURhdGEudHlwZSA9IHR5cGU7XG5cbiAgICAgICAgdGhpcy5hZGRGb3JtRGF0YSgkZm9ybURhdGEpO1xuICAgICAgICB0aGlzLmFkZFJlcXVpcmVkRmllbGRzKCRmb3JtRGF0YS50eXBlKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgdGhlIGZvcm0gZGF0YSBpbiB0aGUgZm9ybSB0eXBlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZEZvcm1EYXRhKCRmb3JtRGF0YSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIHRoaXMubG9hZEZvcm1UZW1wbGF0ZSgkZm9ybURhdGEudHlwZSkudGhlbigoJHRlbXBsYXRlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1UeXBlID0gdGhpcy5nZW5lcmF0ZUZvcm0oJGZvcm1EYXRhLnR5cGUpO1xuXG4gICAgICAgICAgICB0aGlzLmZvcm1UeXBlLmluaXQoJHRlbXBsYXRlKTtcblxuICAgICAgICAgICAgJCgnI2VmLWFkZC10eXBlJykuZmluZCgnW25hbWVePVwic2V0dGluZ3NcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCd1dGlsaXR5Jyk7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBmb3JtVHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRSZXF1aXJlZEZpZWxkcyhmb3JtVHlwZSA6IHN0cmluZykgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgcmVxdWlyZWQgPSB0aGlzLmF2YWlsYWJsZUZvcm1zW2Zvcm1UeXBlXS5yZXF1aXJlZDtcblxuICAgICAgICB0aGlzLnJlbW92ZVVudG91Y2hlZElucHV0cygpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgJC5lYWNoKHRoaXMuaW5wdXRzLChrZXkgOiBzdHJpbmcsIGlucHV0IDogRUZfSW5wdXQpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9ICQuaW5BcnJheShpbnB1dC52YWx1ZS5hdHRyaWJ1dGVzLm5hbWUscmVxdWlyZWQpO1xuICAgICAgICAgICAgICAgIGlmKGluZGV4ICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBpbnB1dHMgPSBbXTtcblxuXG4gICAgICAgICAgICAkLmVhY2gocmVxdWlyZWQsKGtleSA6IG51bWJlcixpbnB1dE5hbWUgOiBzdHJpbmcpID0+IHtcblxuICAgICAgICAgICAgICAgIC8vIEFkZCB0aGUgZGVmYXVsdCB2YWx1ZXMgaW5zaWRlXG4gICAgICAgICAgICAgICAgbGV0IGlucHV0ID0gdGhpcy5nZXRBdmFpbGFibGVJbnB1dERhdGEoaW5wdXROYW1lKTtcblxuICAgICAgICAgICAgICAgIGlucHV0LmF0dHJpYnV0ZXMubmFtZSA9IGlucHV0TmFtZTtcblxuICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKGlucHV0KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmKGlucHV0cyAmJiBpbnB1dHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZElucHV0cyhpbnB1dHMsIDApLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBFRl9BZGQuc3VjY2VzcyA9ICdUaGUgZmllbGRzICcgKyByZXF1aXJlZC5qb2luKCcsICcpICsgJyBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIGZvcm0nO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbGwgdGhlIGlucHV0cyBhZGRlZCBieSBjaGFuZ2luZyB0aGUgdHlwZSBvZiBmb3JtXG4gICAgICovXG4gICAgcHVibGljIHJlbW92ZVVudG91Y2hlZElucHV0cygpIDogUHJvbWlzZTxhbnk+XG4gICAge1xuICAgICAgICBsZXQgaW5wdXRzID0gW107XG5cbiAgICAgICAgJC5lYWNoKHRoaXMuaW5wdXRzLChrZXkgOiBudW1iZXIsIGlucHV0IDogRUZfSW5wdXQpID0+IHtcblxuICAgICAgICAgICAgaWYgKGlucHV0LmRpcnR5KSB7XG4gICAgICAgICAgICAgICAgaW5wdXRzLnB1c2goaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmlucHV0cyA9IGlucHV0cztcblxuICAgICAgICByZXR1cm4gdGhpcy5yZW9yZ2FuaXNlKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFR5cGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0QXZhaWxhYmxlSW5wdXREYXRhKGlucHV0VHlwZSA6IHN0cmluZykgOiBhbnlcbiAgICB7XG4gICAgICAgIGxldCBpbnB1dDtcblxuICAgICAgICAvLyBEZWZhdWx0IHR5cGVcbiAgICAgICAgbGV0IHR5cGUgPSAndGV4dCc7XG5cbiAgICAgICAgaWYodGhpcy5kZWZhdWx0SW5wdXRUeXBlc1tpbnB1dFR5cGVdKSB7XG4gICAgICAgICAgICB0eXBlID0gdGhpcy5kZWZhdWx0SW5wdXRUeXBlc1tpbnB1dFR5cGVdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5hdmFpbGFibGVJbnB1dHNbdHlwZV0pIHtcbiAgICAgICAgICAgIGlucHV0ID0gdGhpcy5hdmFpbGFibGVJbnB1dHNbdHlwZV0uZGF0YTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLmF2YWlsYWJsZUlucHV0c1sndGV4dCddLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHVibGljIGxvYWRGb3JtVGVtcGxhdGUodHlwZSA6IHN0cmluZykgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgbGV0IGtleSA9ICdmb3JtLScgKyB0eXBlO1xuXG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlc1trZXldICYmIHRoaXMudGVtcGxhdGVzW2tleV0gIT0gdW5kZWZpbmVkICYmIHRoaXMudGVtcGxhdGVzW2tleV0gIT0gJycpIHtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKHRoaXMudGVtcGxhdGVzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkLmdldChhamF4VXJsLCB7XG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ2FjdGlvbnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlIDogdHlwZSxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX3RlbXBsYXRlJ1xuICAgICAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNba2V5XSA9IGRhdGEuZGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIEkgc2VuZCBiYWNrIHRoZSBkYXRhXG4gICAgICAgICAgICAgICAgZGZkLnJlc29sdmUoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgIH0pLmVycm9yKHRoaXMuaGFuZGxlRXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogRmlsbCBmb3JtIGRhdGEgdGhlIGluZm9zIGluc2lkZSB0aGUgZWRpdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1cbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHVibGljIGZpbGxJbmZvcygkZWxlbSwkZm9ybURhdGEpIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJGVsZW0pO1xuXG4gICAgICAgIGlmKCRmb3JtRGF0YVtwcm9wLmF0dHJdICYmICRmb3JtRGF0YVtwcm9wLmF0dHJdW3Byb3AuaWRdKSB7XG5cbiAgICAgICAgICAgIEVGX0lucHV0LnNldElucHV0VmFsdWUoJGVsZW0sJGZvcm1EYXRhW3Byb3AuYXR0cl1bcHJvcC5pZF0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCB0aGUgZGF0YSBpbnNpZGUgdGhlIHN1Ym1pdCBidXR0b25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdWJtaXRcbiAgICAgKi9cbiAgICBwcml2YXRlIGFkZFN1Ym1pdERhdGEoc3VibWl0KSA6IHZvaWRcbiAgICB7XG4gICAgICAgIEVGX0lucHV0LmFkZERhdGFUb0VsZW1lbnQodGhpcy4kYm9keS5maW5kKCcjZWYtYWRkLXN1Ym1pdCcpLHN1Ym1pdCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIExvYWQgYWxsIHRoZSBpbnB1dHMgZnJvbSB0aGUgbGlzdFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0c1xuICAgICAqIEBwYXJhbSBkZmRcbiAgICAgKiBAcGFyYW0gb3JkZXJcbiAgICAgKi9cbiAgICBwcml2YXRlIGxvYWRJbnB1dHMoaW5wdXRzIDogeyBhdHRyaWJ1dGVzIDoge3R5cGUgOiBzdHJpbmcgfX1bXSxvcmRlciA6IG51bWJlcixkZmQgIDogYW55ID0gbnVsbCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIGlmKCFkZmQpIHtcbiAgICAgICAgICAgIGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKGlucHV0cyk7XG5cbiAgICAgICAgbGV0IGtleSA9IGtleXNbb3JkZXJdO1xuXG4gICAgICAgIGlmKCFrZXkgfHwgIWlucHV0cyB8fCAhaW5wdXRzW2tleV0pe1xuICAgICAgICAgICAgdGhpcy5pc19pbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmFkZElucHV0KGlucHV0c1trZXldLmF0dHJpYnV0ZXMudHlwZSxpbnB1dHNba2V5XSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgb3JkZXIrKztcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoaW5wdXRzLG9yZGVyLGRmZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuXG4gICAgcHVibGljIGdlbmVyYXRlRm9ybSh0eXBlIDogc3RyaW5nKSA6IEVGX0Zvcm1cbiAgICB7XG4gICAgICAgIGxldCBmb3JtO1xuXG4gICAgICAgIGlmKCF0aGlzLmF2YWlsYWJsZUZvcm1zW3R5cGVdKSB7XG4gICAgICAgICAgICB0eXBlID0gJ3Bvc3QnO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdsb2dpbicgOlxuICAgICAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncG9zdCcgOlxuICAgICAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFmb3JtKSB7XG4gICAgICAgICAgICBmb3JtID0gbmV3IEVGX0Zvcm0oKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcmV0dXJuIGZvcm07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHVibGljIGdlbmVyYXRlSW5wdXQodHlwZSA6IHN0cmluZykgOiBFRl9JbnB1dFxuICAgIHtcbiAgICAgICAgbGV0IGlucHV0O1xuXG4gICAgICAgIGlmKCF0aGlzLmF2YWlsYWJsZUlucHV0c1t0eXBlXSkge1xuICAgICAgICAgICAgdHlwZSA9ICd0ZXh0JztcbiAgICAgICAgfVxuXG5cbiAgICAgICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgICAgICAgIGlucHV0ID0gbmV3IEVGX0lucHV0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZighaW5wdXQpIHtcbiAgICAgICAgICAgIGlucHV0ID0gbmV3IEVGX0lucHV0KCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiBpbnB1dDtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBMb2FkIHRoZSBpbnB1dCB0ZW1wbGF0ZSBmcm9tIHRoZSBCT1xuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGUgOiBzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRJbnB1dCh0eXBlIDogc3RyaW5nID0gJ3RleHQnKVxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXNbdHlwZV0gJiYgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gIT0gdW5kZWZpbmVkICYmIHRoaXMudGVtcGxhdGVzW3R5cGVdICE9ICcnKSB7XG4gICAgICAgICAgICBkZmQucmVzb2x2ZSh0aGlzLnRlbXBsYXRlc1t0eXBlXSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQuZ2V0KGFqYXhVcmwsIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnaW5wdXRzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA6IHR5cGUsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF90ZW1wbGF0ZSdcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW3R5cGVdID0gZGF0YS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhLmRhdGEpO1xuICAgICAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIEhUVFAgRXJyb3JzXG4gICAgICpcbiAgICAgKiBAVE9ET1xuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVFcnJvcihkYXRhIDogc3RyaW5nfHtyZXNwb25zZUpTT04gOiB7ZXJyb3J9fSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIGxldCBlcnJvciA6IHN0cmluZztcblxuICAgICAgICBpZih0eXBlb2YgZGF0YSAhPSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBlcnJvciA9IGRhdGEucmVzcG9uc2VKU09OLmVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgRUZfQWRkLmVycm9yID0gZXJyb3I7XG4gICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlKTtcblxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEdldCB0aGUgdXJsIHBhcmFtZXRlclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtZXRlclxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRQYXJhbWV0ZXIocGFyYW1ldGVyIDogc3RyaW5nKTphbnlcbiAgICB7XG4gICAgICAgIHZhciBwYXJhbXNfc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSk7XG5cbiAgICAgICAgdmFyIHBhcmFtc19hcnJheSA9IHBhcmFtc19zdHJpbmcuc3BsaXQoJyYnKTtcblxuICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgIGZvcih2YXIgaSA9MDtpPHBhcmFtc19hcnJheS5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZSA9IHBhcmFtc19hcnJheVtpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgb2JqW2VbMF1dID0gZVsxXVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9ialtwYXJhbWV0ZXJdO1xuICAgIH1cblxuXG5cblxuICAgIC8qKlxuICAgICAqIERpc3BsYXkgYW4gZXJyb3IgbWVzc2FnZSB0aGF0IHdpbGwgZmFkZSBvdXQgaW4gNSBzZWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCBlcnJvcihlcnJvck1lc3NhZ2UgOiBzdHJpbmd8Ym9vbGVhbikge1xuXG4gICAgICAgIEVGX0FkZC5zZXRNZXNzYWdlKCcjZXJyb3ItbWVzc2FnZScsZXJyb3JNZXNzYWdlLGZhbHNlKTtcblxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIERpc3BsYXkgYSBzdWNjZXNzIG1lc3NhZ2UgdGhhdCB3aWxsIGZhZGUgb3V0IGluIDUgc2VjXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3VjY2Vzc01lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCBzdWNjZXNzKHN1Y2Nlc3NNZXNzYWdlOiBzdHJpbmd8Ym9vbGVhbikge1xuXG4gICAgICAgIEVGX0FkZC5zZXRNZXNzYWdlKCcjc3VjY2Vzcy1tZXNzYWdlJyxzdWNjZXNzTWVzc2FnZSxmYWxzZSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0gcGVyc2lzdCA6IGJvb2xlYW4sIFdlaXRoZXIgb3Igbm90IHRoZSBtZXNzYWdlIHNob3VsZCBiZSBkaXNwbGF5ZWQgb3Igbm90XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXRNZXNzYWdlKGVsZW1lbnQgOiBzdHJpbmcsbWVzc2FnZSA6IHN0cmluZ3xib29sZWFuLCBwZXJzaXN0IDogYm9vbGVhbnxudW1iZXIgPSBmYWxzZSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIGlmKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkudGV4dChtZXNzYWdlKS5mYWRlSW4oMjAwKTtcblxuICAgICAgICAgICAgaWYoIXBlcnNpc3QpIHtcblxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHBlcnNpc3QgaXMgbm90IGVxdWFsIHRvIGZhbHNlXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHBlcnNpc3QgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcnNpc3QgPSA1MDAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1lc3NhZ2UoZWxlbWVudCwnJyk7XG4gICAgICAgICAgICAgICAgfSxwZXJzaXN0KTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkuZmFkZU91dCgyMDAsKCkgPT4ge1xuICAgICAgICAgICAgICAgICQoZWxlbWVudCkudGV4dCgnJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG52YXIgRUZfYWRkID0gbmV3IEVGX0FkZCgpO1xuRUZfYWRkLmluaXQoKTsiXX0=
