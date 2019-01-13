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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2lucHV0cy9FRl9JbnB1dC50cyIsImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2Zvcm1zL0VGX0Zvcm0udHMiLCJhc3NldHMvYWRtaW4vanMvc3JjL2FkZC9FRl9BZGQudHMiXSwibmFtZXMiOlsiRUZfSW5wdXQiLCJ0aGlzIiwiZGlydHkiLCJjb250YWluZXIiLCIkIiwicHJvdG90eXBlIiwiaW5pdCIsIiRlbGVtZW50IiwiaWQiLCIkZGF0YSIsInBvc2l0aW9uIiwicmVwbGFjZSIsImVsZW1lbnQiLCJvcHRpb25zRWxlbWVudCIsImZpbmQiLCJhcHBlbmQiLCJyZXBsYWNlV2l0aCIsInNldEV2ZW50cyIsImFkZERhdGEiLCJoYW5kbGVDaGVja2JveCIsImVhY2giLCJrZXkiLCJpbnB1dCIsIiRpbnB1dCIsInZhbHVlIiwiaXMiLCJuYW1lIiwiYXR0ciIsIiRoaWRkZW4iLCJvbiIsImFmdGVyIiwiX3RoaXMiLCJvZmYiLCJ0b2dnbGUiLCJvbkR1cGxpY2F0ZSIsIm9uQ2hhbmdlVHlwZSIsIm9uRGVsZXRlIiwib25Nb3ZlIiwiZWxlbSIsImhhc0NsYXNzIiwiY2xvc2UiLCJvcGVuIiwiYWRkRGF0YVRvRWxlbWVudCIsInByb3AiLCJnZXRJbnB1dFByb3BlcnRpZXMiLCJzZXRJbnB1dFZhbHVlIiwidmFsIiwiZ2V0SW5wdXRWYWx1ZSIsImRhdGEiLCJzcGxpdCIsImhpZGUiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiaHRtbCIsInNob3ciLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInR5cGUiLCJFRl9Gb3JtIiwiRUZfSW5wdXRfMSIsIkVGX0FkZCIsInRlbXBsYXRlcyIsImlucHV0cyIsImF2YWlsYWJsZUlucHV0cyIsImF2YWlsYWJsZUZvcm1zIiwiaXNfaW5pdCIsIiRib2R5IiwibG9hZCIsInRoZW4iLCJhZGRJbnB1dCIsImxvYWRpbmciLCIkZXZlbnQiLCJ0YXJnZXQiLCJjaGFuZ2VGb3JtVHlwZSIsInJlb3JnYW5pc2UiLCJkZmQiLCJEZWZlcnJlZCIsInB1c2giLCJyZW1vdmVBbGxJbnB1dHMiLCJsb2FkSW5wdXRzIiwicmVzb2x2ZSIsInByb21pc2UiLCJkaXJlY3Rpb24iLCJpbmRleE9mIiwibmV3cG9zIiwiY29uc29sZSIsImxvZyIsImxlbmd0aCIsInN3aXRjaCIsInBvczEiLCJwb3MyIiwiaW5wdXQxIiwiYXR0cmlidXRlcyIsInN1Y2Nlc3MiLCJzcGxpY2UiLCJnZXRJbnB1dCIsImdlbmVyYXRlSW5wdXQiLCJhY3Rpb24iLCJnZXRKU09OIiwiYWpheFVybCIsImZvcm1faWQiLCJnZXRQYXJhbWV0ZXIiLCJmb3JtIiwiYWRkRm9ybURhdGEiLCJmb3JtcyIsInN1Ym1pdCIsImFkZFN1Ym1pdERhdGEiLCJmb3JFYWNoIiwiYWRkUmVxdWlyZWRGaWVsZHMiLCJlcnJvciIsImhhbmRsZUVycm9yIiwiJGZvcm1EYXRhIiwiZmlsbEluZm9zIiwiZm9ybVR5cGUiLCJsb2FkRm9ybVRlbXBsYXRlIiwiJHRlbXBsYXRlIiwiZ2VuZXJhdGVGb3JtIiwicmVxdWlyZWQiLCJyZW1vdmVVbnRvdWNoZWRJbnB1dHMiLCJpbmRleCIsImluQXJyYXkiLCJpbnB1dE5hbWUiLCJnZXRBdmFpbGFibGVJbnB1dERhdGEiLCJqb2luIiwiaW5wdXRUeXBlIiwidW5kZWZpbmVkIiwiZ2V0IiwidGVtcGxhdGUiLCIkZWxlbSIsIkVGX0lucHV0XzIiLCJvcmRlciIsImtleXMiLCJFRl9Gb3JtXzEiLCJyZXNwb25zZUpTT04iLCJwYXJhbWV0ZXIiLCJwYXJhbXNfc3RyaW5nIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJzdWJzdHIiLCJwYXJhbXNfYXJyYXkiLCJvYmoiLCJpIiwiZSIsImVycm9yTWVzc2FnZSIsInNldE1lc3NhZ2UiLCJzdWNjZXNzTWVzc2FnZSIsIm1lc3NhZ2UiLCJwZXJzaXN0IiwidGV4dCIsImZhZGVJbiIsInNldFRpbWVvdXQiLCJmYWRlT3V0IiwiRUZfYWRkIl0sIm1hcHBpbmdzIjoiOzs7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QU9uSiIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5kZWNsYXJlIHZhciAkIDogYW55O1xuXG5leHBvcnQgY2xhc3MgRUZfSW5wdXRcbntcblxuICAgIC8qKlxuICAgICAqIEB2YXIgc3RyaW5nXG4gICAgICpcbiAgICAgKiBUaGUgdHlwZSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHR5cGUgOiBzdHJpbmcgPSAndGV4dCc7XG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgSFRNTCBFbGVtZW50XG4gICAgICpcbiAgICAgKiBUaGUgaHRtbCBlbGVtZW50IG9mIHRoZSBpbnB1dFxuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGVsZW1lbnQgOiBhbnk7XG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgSFRNTCBFbGVtZW50XG4gICAgICpcbiAgICAgKiBUaGUgaHRtbCBlbGVtZW50IGZvciB0aGUgb3B0aW9uXG4gICAgICovXG4gICAgcHVibGljIG9wdGlvbnNFbGVtZW50IDogYW55O1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgaWQgKHBvc2l0aW9uKSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgaWQgOiBudW1iZXI7XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBIVE1MIGVsZW1lbnQgb2YgdGhlIGNvbnRhaW5lclxuICAgICAqL1xuICAgIHB1YmxpYyBjb250YWluZXIgOiBhbnk7XG5cblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBmaWVsZCBoYXMgYmVlbiBjaGFuZ2VkIG9yIG5vdFxuICAgICAqL1xuICAgIHB1YmxpYyBkaXJ0eSA6IGJvb2xlYW4gPSBmYWxzZTtcblxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gY2FsbGVkIG9uIGR1cGxpY2F0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBvbkR1cGxpY2F0ZSA6IGFueTtcbiAgICBwdWJsaWMgb25DaGFuZ2VUeXBlIDogYW55O1xuICAgIHB1YmxpYyBvbkRlbGV0ZSA6IGFueTtcbiAgICBwdWJsaWMgb25Nb3ZlIDogYW55O1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gJCgnI2ZsZCcpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqIEBwYXJhbSAkZGF0YVxuICAgICAqIEBwYXJhbSBpZFxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiA6IG51bWJlclxuICAgICAqL1xuICAgIHB1YmxpYyBpbml0KCRlbGVtZW50IDogYW55LCBpZCA6IG51bWJlciwkZGF0YSA6IGFueSxwb3NpdGlvbiA6IG51bGx8bnVtYmVyID0gbnVsbClcbiAgICB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcblxuICAgICAgICAkZWxlbWVudCA9ICRlbGVtZW50LnJlcGxhY2UoL2ZpZWxkVW5JZC9nLGlkKzEpO1xuICAgICAgICAkZWxlbWVudCA9ICRlbGVtZW50LnJlcGxhY2UoL2ZpZWxkSWQvZyxpZCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJCgkZWxlbWVudCk7XG4gICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmVmLXRhYmxlJyk7XG5cbiAgICAgICAgaWYobnVsbCA9PT0gcG9zaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5maW5kKCcjZmllbGQtJyArIHBvc2l0aW9uKS5yZXBsYWNlV2l0aCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRFdmVudHMoKTtcblxuICAgICAgICB0aGlzLmFkZERhdGEoJGRhdGEpO1xuXG4gICAgICAgIHRoaXMuaGFuZGxlQ2hlY2tib3goKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBjaGVja2JveHMgdG8gbGluayB0aGVtIHdpdGggYSBoaWRkZW4gaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFuZGxlQ2hlY2tib3goKVxuICAgIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLmVhY2goKGtleSA6IG51bWJlcixpbnB1dCA6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgJGlucHV0ID0gJChpbnB1dCk7XG5cbiAgICAgICAgICAgIGxldCB2YWx1ZSA9ICRpbnB1dC5pcygnOmNoZWNrZWQnKSA/IDEgOiAwO1xuICAgICAgICAgICAgbGV0IG5hbWUgPSAkaW5wdXQuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgJGlucHV0LmF0dHIoJ25hbWUnLCcnKTtcblxuICAgICAgICAgICAgbGV0ICRoaWRkZW4gPSAkKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCInKyBuYW1lICsnXCIgdmFsdWU9XCInKyB2YWx1ZSArJ1wiPicpO1xuXG5cbiAgICAgICAgICAgICRpbnB1dC5vbignY2hhbmdlJywoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gJGlucHV0LmlzKCc6Y2hlY2tlZCcpID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgJGhpZGRlbi5hdHRyKCd2YWx1ZScsdmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRpbnB1dC5hZnRlcigkaGlkZGVuKVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBTZXQgYWxsIHRoZSBldmVudHMgbGlua2VkIHRvIHRoaXMgZWxlbWVudFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRFdmVudHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJvcGVuLWNsb3NlXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3JldHVybiB0aGlzLnRvZ2dsZSgpfSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJkdXBsaWNhdGVcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7dGhpcy5vbkR1cGxpY2F0ZSh0aGlzKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwiY2hhbmdlLXR5cGVcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7dGhpcy5vbkNoYW5nZVR5cGUodGhpcyk7IHJldHVybiBmYWxzZTt9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cImRlbGV0ZVwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHt0aGlzLm9uRGVsZXRlKHRoaXMpOyByZXR1cm4gZmFsc2U7fSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJ1cFwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHt0aGlzLm9uTW92ZSh0aGlzLCd1cCcpOyByZXR1cm4gZmFsc2U7fSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJkb3duXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3RoaXMub25Nb3ZlKHRoaXMsJ2Rvd24nKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnc2VsZWN0LGlucHV0LHRleHRhcmVhJykub24oJ2lucHV0JywgKCkgPT4geyB0aGlzLmRpcnR5ID0gdHJ1ZTt9KTtcbiAgICB9XG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBDbG9zZSB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGUoKTogYm9vbGVhblxuICAgIHtcblxuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJvcGVuLWNsb3NlXCJdJyk7XG5cbiAgICAgICAgaWYoJChlbGVtKS5oYXNDbGFzcygnbWluaWZ5JykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wZW4oKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgdGhlIGRhdGEgaW4gdGhlIHRlbXBsYXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGRhdGFcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkRGF0YSgkZGF0YSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIGlmKCRkYXRhLmRpcnR5KSB7XG4gICAgICAgICAgICB0aGlzLmRpcnR5ID0gJGRhdGEuZGlydHk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIEVGX0lucHV0LmFkZERhdGFUb0VsZW1lbnQodGhpcy5lbGVtZW50LCRkYXRhKVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gJGRhdGFcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFkZERhdGFUb0VsZW1lbnQoJGVsZW1lbnQgOiBhbnksICRkYXRhIDogYW55KSA6IHZvaWRcbiAgICB7XG4gICAgICAgICRlbGVtZW50LmZpbmQoJ1tuYW1lXj1cImZpZWxkXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJChlbGVtKSk7XG5cbiAgICAgICAgICAgIGlmKCRkYXRhW3Byb3AucHJvcF0gJiYgJGRhdGFbcHJvcC5wcm9wXVtwcm9wLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgRUZfSW5wdXQuc2V0SW5wdXRWYWx1ZSgkKGVsZW0pLCRkYXRhW3Byb3AucHJvcF1bcHJvcC5uYW1lXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgYSB2YWx1ZSB0byBhbiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXRJbnB1dFZhbHVlKGlucHV0IDogYW55LCB2YWx1ZSA6IHN0cmluZ3xib29sZWFuKVxuICAgIHtcbiAgICAgICAgaWYoaW5wdXQuaXMoJzpjaGVja2JveCcpKXtcbiAgICAgICAgICAgIGlmKFwiMVwiID09IHZhbHVlIHx8IHZhbHVlID09ICdvbicpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlucHV0LnByb3AoJ2NoZWNrZWQnLHZhbHVlKTtcbiAgICAgICAgfWVsc2UgaWYoaW5wdXQuaXMoJ3NlbGVjdCcpKXtcbiAgICAgICAgICAgIGlucHV0LmZpbmQoJ29wdGlvblt2YWx1ZT1cIicrIHZhbHVlICsnXCJdJykucHJvcCgnc2VsZWN0ZWQnLHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBpbnB1dC52YWwodmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEdldCB0aGUgdmFsdWUgb2YgYW4gaW5wdXRcbiAgICAgKlxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICogQHJldHVybnMgYW55XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnB1dFZhbHVlKGlucHV0IDogYW55KVxuICAgIHtcblxuICAgICAgICBpZih0eXBlb2YgaW5wdXQudmFsICE9ICdmdW5jdGlvbicpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cblxuICAgICAgICBpZihpbnB1dC5pcygnOmNoZWNrYm94Jykpe1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LmlzKCc6Y2hlY2tlZCcpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC52YWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJldHVybiBhbGwgdGhlIHByb3BlcnRpZXMgb2YgYW4gaW5wdXRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnB1dFByb3BlcnRpZXMoZWxlbSA6IGFueSkgOiB7YXR0cixpZCxwcm9wLG5hbWV9XG4gICAge1xuXG4gICAgICAgIGxldCBuYW1lID0gZWxlbS5hdHRyKCduYW1lJyk7XG5cbiAgICAgICAgbGV0IGRhdGEgPSBuYW1lLnNwbGl0KCdbJyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGF0dHIgOiBkYXRhWzBdLnJlcGxhY2UoJ10nLCcnKSxcbiAgICAgICAgICAgIGlkIDogZGF0YVsxXS5yZXBsYWNlKCddJywnJyksXG4gICAgICAgICAgICBwcm9wIDogZGF0YVsyXSA/IGRhdGFbMl0ucmVwbGFjZSgnXScsJycpIDogJycsXG4gICAgICAgICAgICBuYW1lIDogZGF0YVszXSA/IGRhdGFbM10ucmVwbGFjZSgnXScsJycpIDogJycsXG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBzaW5jZSAxLjEuMFxuICAgICAqXG4gICAgICogQGV2ZW50IDogQ2xpY2sgb24gbWluaWZ5IGJ1dHRvbiA6IGhpZGUgdGhlIG9wdGlvbnMgb2YgdGhlIGZpZWxkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBjbG9zZSgpIDogYm9vbGVhblxuICAgIHtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudC5oaWRlKDIwMCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcubWluaWZ5JylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWluaWZ5JylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnb3BlbicpXG4gICAgICAgICAgICAuaHRtbCgnKycpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHNpbmNlIDEuMS4wXG4gICAgICpcbiAgICAgKiBPcGVuIGEgZmllbGRcbiAgICAgKlxuICAgICAqIEBldmVudCA6IENsaWNrIG9uIG9wZW4gYnV0dG9uLCBzaG93IHRoZSBmaWVsZCBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBvcGVuKCkgOiBib29sZWFuXG4gICAge1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50LnNob3coMjAwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5vcGVuJylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnb3BlbicpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ21pbmlmeScpXG4gICAgICAgICAgICAuaHRtbCgnLScpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIHRoZSB2YWx1ZSBvZiBhbGwgdGhlIGlucHV0cyBpbiB0aGUgZmllbGRcbiAgICAgKlxuICAgICAqL1xuICAgIGdldCB2YWx1ZSgpOiBhbnkge1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IHtcbiAgICAgICAgICAgIGRpcnR5IDogdGhpcy5kaXJ0eSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW25hbWVePVwiZmllbGRcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsaW5wdXQgOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJChpbnB1dCkpO1xuICAgICAgICAgICAgbGV0IHZhbCA9IEVGX0lucHV0LmdldElucHV0VmFsdWUoJChpbnB1dCkpO1xuXG4gICAgICAgICAgICBpZihwcm9wLnByb3AgJiYgIXZhbHVlW3Byb3AucHJvcF0gJiYgcHJvcC5uYW1lKXtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLnByb3BdID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHZhbHVlW3Byb3AucHJvcF0pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLnByb3BdW3Byb3AubmFtZV0gPSB2YWw7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5wcm9wXSA9IHZhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICB9XG5cbn0iLCJpbXBvcnQge0VGX0lucHV0fSBmcm9tIFwiLi4vaW5wdXRzL0VGX0lucHV0XCI7XG5cbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBFRl9Gb3JtIHtcblxuICAgIC8qKlxuICAgICAqIEB2YXIgc3RyaW5nXG4gICAgICpcbiAgICAgKiBUaGUgdHlwZSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHR5cGU6IHN0cmluZyA9ICd0ZXh0JztcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgb2YgdGhlIGlucHV0XG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgZWxlbWVudDogYW55O1xuXG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgY29udGFpbmVyXG4gICAgICovXG4gICAgcHVibGljIGNvbnRhaW5lciA6IGFueTtcblxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gJCgnI3V0aWxpdGllcycpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdCgkZWxlbWVudCA6IGFueSlcbiAgICB7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJCgkZWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuaHRtbCh0aGlzLmVsZW1lbnQpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gdGhlIHZhbHVlIG9mIGFsbCB0aGUgaW5wdXRzIGluIHRoZSBmaWVsZFxuICAgICAqXG4gICAgICovXG4gICAgZ2V0IHZhbHVlKCk6IGFueSB7XG5cbiAgICAgICAgbGV0IHZhbHVlID0ge307XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tuYW1lXj1cInNldHRpbmdzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGlucHV0IDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoaW5wdXQpKTtcbiAgICAgICAgICAgIGxldCB2YWwgPSBFRl9JbnB1dC5nZXRJbnB1dFZhbHVlKCQoaW5wdXQpKTtcblxuICAgICAgICAgICAgaWYocHJvcC5hdHRyICYmICF2YWx1ZVtwcm9wLmF0dHJdICYmIHByb3AuaWQpe1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AuYXR0cl0gPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodmFsdWVbcHJvcC5hdHRyXSkge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AuYXR0cl1bcHJvcC5pZF0gPSB2YWw7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5hdHRyXSA9IHZhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgIH1cblxuXG5cblxufSIsImltcG9ydCB7RUZfRm9ybX0gZnJvbSBcIi4vZm9ybXMvRUZfRm9ybVwiO1xuXG5kZWNsYXJlIHZhciAkO1xuXG5kZWNsYXJlIHZhciBhamF4VXJsIDogc3RyaW5nO1xuXG5pbXBvcnQge0VGX0lucHV0fSBmcm9tICcuL2lucHV0cy9FRl9JbnB1dCc7XG5cbmNsYXNzIEVGX0FkZFxue1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBCb2R5IG9mIHRoZSBwYWdlXG4gICAgICovXG4gICAgcHVibGljICRib2R5O1xuXG4gICAgLyoqXG4gICAgICpBbiBvYmplY3Qgb2YgYWxsIHRoZSBpbnB1dCB0ZW1wbGF0ZXMgY2FjaGVkIHRvIGF2b2lkIGxhdGVuY3lcbiAgICAgKi9cbiAgICBwdWJsaWMgdGVtcGxhdGVzIDogYW55ID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBhbGwgdGhlIGlucHV0cyBhdmFpbGFibGUgb24gdGhlIHBhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5wdXRzIDogRUZfSW5wdXRbXSA9IFtdO1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGF2YWlsYWJsZSBpbnB1dHNcbiAgICAgKi9cbiAgICBwdWJsaWMgYXZhaWxhYmxlSW5wdXRzIDoge30gPSB7fTtcblxuXG4gICAgLyoqXG4gICAgICogQWxsIHRoZSBhdmFpbGFibGUgaW5wdXRzXG4gICAgICovXG4gICAgcHVibGljIGF2YWlsYWJsZUZvcm1zIDoge30gPSB7fTtcblxuXG4gICAgcHVibGljIGZvcm1UeXBlIDogRUZfRm9ybTtcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBlZGl0b3IgaXMgaW5pdFxuICAgICAqL1xuICAgIHB1YmxpYyBpc19pbml0IDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuJGJvZHkgPSAkKCdib2R5Jyk7XG5cbiAgICB9XG5cblxuICAgIHB1YmxpYyBpbml0KCkge1xuXG4gICAgICAgIHRoaXMuc2V0RXZlbnRzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkKCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgLypcbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5tb3ZlJyxfbW92ZSk7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy51cCcsX3VwKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLmRvd24nLF9kb3duKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLnJlbW92ZW9wdGlvbicsX3JlbW92ZU9wdGlvbik7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5kdXBsaXF1ZXInLF9kdXBsaWNhdGUpOyovXG5cbiAgICAgICAgLy8gQWRkIGEgbmV3IGZpZWxkXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vZmYoJ2NsaWNrJywnYnV0dG9uW2RhdGEtYWN0aW9uPVwiYWRkXCJdJylcbiAgICAgICAgICAgIC5vbignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGRcIl0nLCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZElucHV0KCd0ZXh0Jyx7fSkudGhlbigoaW5wdXQgOiBFRl9JbnB1dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSwnZmllbGRzJyk7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KSB9KTtcblxuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vZmYoJ2NsaWNrJywnc2VsZWN0W25hbWU9XCJzZXR0aW5nc1t0eXBlXVwiXScpXG4gICAgICAgICAgICAub24oJ2NoYW5nZScsJ3NlbGVjdFtuYW1lPVwic2V0dGluZ3NbdHlwZV1cIl0nLCgkZXZlbnQgOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gJCgkZXZlbnQudGFyZ2V0KS52YWwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUZvcm1UeXBlKHR5cGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGQtb3B0aW9uXCJdJyxfYWRkT3B0aW9uKTtcblxuXG4gICAgICAgICAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsJ3NlbGVjdFtuYW1lJD1cIltmb3JtLXRheG9ub215XVwiXScsX2NoYW5nZVRheG9ub215KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cImZvcm0tcmVzZXQtYWN0aW9uXCJdJyxfY2hhbmdlUmVzZXRBY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAqL1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVvcmdhbmlzZSBhbGwgdGhlIGlucHV0cyBvbiB0aGUgcGFnZSBhY2NvcmRpbmcgdG8gdGhlIG9uZXNcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVvcmdhbmlzZSgpIDogUHJvbWlzZTxhbnk+XG4gICAge1xuXG4gICAgICAgIGxldCBkZmQgPSAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgRUZfQWRkLmxvYWRpbmcodHJ1ZSwnZmllbGRzJyk7XG5cblxuICAgICAgICBsZXQgaW5wdXRzID0gW107XG5cbiAgICAgICAgJC5lYWNoKHRoaXMuaW5wdXRzLChrZXksaW5wdXQgOiBFRl9JbnB1dCkgPT4ge1xuICAgICAgICAgICAgaW5wdXRzLnB1c2goaW5wdXQudmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlbW92ZUFsbElucHV0cygpO1xuXG4gICAgICAgIHRoaXMubG9hZElucHV0cyhpbnB1dHMsMCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSwnZmllbGRzJyk7XG4gICAgICAgICAgICBkZmQucmVzb2x2ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIHdoZW4gMiBpbnB1dHMgYXJlIG1vdmVkXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKiBAcGFyYW0gZGlyZWN0aW9uXG4gICAgICovXG4gICAgcHVibGljIG9uTW92ZShpbnB1dCA6IEVGX0lucHV0LGRpcmVjdGlvbiA6IHN0cmluZyA9ICd1cCcpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmlucHV0cy5pbmRleE9mKGlucHV0KTtcblxuICAgICAgICBsZXQgbmV3cG9zID0gZGlyZWN0aW9uID09ICd1cCcgPyBwb3NpdGlvbi0xIDogcG9zaXRpb24gKzE7XG5cbiAgICAgICAgY29uc29sZS5sb2coZGlyZWN0aW9uLG5ld3Bvcyxwb3NpdGlvbik7XG5cbiAgICAgICAgaWYobmV3cG9zID09IC0xIHx8IG5ld3BvcyA9PSB0aGlzLmlucHV0cy5sZW5ndGggfHwgIXRoaXMuaW5wdXRzW25ld3Bvc10pIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zd2l0Y2gocG9zaXRpb24sbmV3cG9zKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogU3dpdGNoIDIgaW5wdXRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcG9zMVxuICAgICAqIEBwYXJhbSBwb3MyXG4gICAgICovXG4gICAgcHVibGljIHN3aXRjaChwb3MxIDogbnVtYmVyLCBwb3MyOiBudW1iZXIpXG4gICAge1xuICAgICAgICBsZXQgaW5wdXQxID0gdGhpcy5pbnB1dHNbcG9zMV07XG5cbiAgICAgICAgdGhpcy5pbnB1dHNbcG9zMV0gPSB0aGlzLmlucHV0c1twb3MyXTtcblxuICAgICAgICB0aGlzLmlucHV0c1twb3MyXSA9IGlucHV0MTtcblxuICAgICAgICB0aGlzLnJlb3JnYW5pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbGwgaW5wdXRzIGZyb20gdHJhY2tcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlQWxsSW5wdXRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmlucHV0cyA9IFtdO1xuICAgICAgICB0aGlzLiRib2R5LmZpbmQoJyNmbGQnKS5odG1sKCcnKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIG9uIGNsaWNrIG9uIHRoZSBkdXBsaWNhdGUgYnV0dG9uXG4gICAgICpcbiAgICAgKiBARXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBvbkR1cGxpY2F0ZShpbnB1dCA6IEVGX0lucHV0KSA6IGFueVxuICAgIHtcblxuICAgICAgICB0aGlzLmFkZElucHV0KGlucHV0LnZhbHVlLmF0dHJpYnV0ZXMudHlwZSxpbnB1dC52YWx1ZSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBFRl9BZGQuc3VjY2VzcyAgPSAnVGhlbSBpbnB1dCBoYXMgYmVlbiBkdXBsaWNhdGVkJztcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIGNoYW5nZSBvZiB0eXBlIGlzIHRyaWdnZXJlZFxuICAgICAqXG4gICAgICogQEV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgb25DaGFuZ2VUeXBlKGlucHV0IDogRUZfSW5wdXQpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmlucHV0cy5pbmRleE9mKGlucHV0KTtcblxuICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dC52YWx1ZTtcblxuICAgICAgICB0aGlzLmFkZElucHV0KHZhbHVlLmF0dHJpYnV0ZXMudHlwZSx2YWx1ZSxwb3NpdGlvbikudGhlbigoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgIGlucHV0Lm9wZW4oKTtcbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIG9uIGRlbGV0ZSBvZiBhbiBpbnB1dFxuICAgICAqXG4gICAgICogQEV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgb25EZWxldGUoaW5wdXQgOiBFRl9JbnB1dCkgOiBhbnlcbiAgICB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHRoaXMuaW5wdXRzLmluZGV4T2YoaW5wdXQpO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzLnNwbGljZShwb3NpdGlvbiwxKTtcblxuICAgICAgICB0aGlzLnJlb3JnYW5pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEFkZCBhbiBpbnB1dCB0byB0aGUgZWRpdG9yXG4gICAgICovXG4gICAgcHVibGljIGFkZElucHV0KHR5cGUgOiBzdHJpbmcgPSAndGV4dCcsJGRhdGEscG9zaXRpb24gOiBudW1iZXJ8bnVsbCA9IG51bGwpIDogUHJvbWlzZTxFRl9JbnB1dD5cbiAgICB7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuXG4gICAgICAgIEVGX0FkZC5sb2FkaW5nKHRydWUsJ2ZpZWxkcycpO1xuXG4gICAgICAgIC8vIENsb3NlIGFsbCB0aGUgaW5wdXRzXG4gICAgICAgICQuZWFjaCh0aGlzLmlucHV0cywoa2V5IDogbnVtYmVyLCBpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICBpbnB1dC5jbG9zZSgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZ2V0SW5wdXQodHlwZSkudGhlbigoZGF0YSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgaW5wdXQgOiBFRl9JbnB1dDtcblxuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLmdlbmVyYXRlSW5wdXQodHlwZSk7XG5cbiAgICAgICAgICAgIGlucHV0LmluaXQoZGF0YSxwb3NpdGlvbiA/IHBvc2l0aW9uIDogdGhpcy5pbnB1dHMubGVuZ3RoLCRkYXRhLHBvc2l0aW9uKTtcblxuICAgICAgICAgICAgaW5wdXQub25EdXBsaWNhdGUgPSAoaW5wdXQgOiBFRl9JbnB1dCApID0+IHsgdGhpcy5vbkR1cGxpY2F0ZShpbnB1dCkgfTtcbiAgICAgICAgICAgIGlucHV0Lm9uQ2hhbmdlVHlwZSA9IChpbnB1dCA6IEVGX0lucHV0KSA9PiB7IHRoaXMub25DaGFuZ2VUeXBlKGlucHV0KSB9O1xuICAgICAgICAgICAgaW5wdXQub25EZWxldGUgPSAoaW5wdXQgOiBFRl9JbnB1dCkgPT4geyB0aGlzLm9uRGVsZXRlKGlucHV0KSB9O1xuICAgICAgICAgICAgaW5wdXQub25Nb3ZlID0gKGlucHV0OiAgRUZfSW5wdXQsIGFjdGlvbiA6IHN0cmluZykgPT4geyB0aGlzLm9uTW92ZShpbnB1dCxhY3Rpb24pIH07XG5cbiAgICAgICAgICAgIGlmKHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dHNbcG9zaXRpb25dID0gaW5wdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnB1c2goaW5wdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZmQucmVzb2x2ZShpbnB1dCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcblxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFNob3cgb3IgaGlkZSB0aGUgbG9hZGluZ3NcbiAgICAgKlxuICAgICAqIEBwYXJhbSBsb2FkaW5nXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBsb2FkaW5nKGxvYWRpbmcgOiBib29sZWFuID0gdHJ1ZSwkZWxlbWVudCA6IG51bGx8c3RyaW5nID0gbnVsbClcbiAgICB7XG4gICAgICAgIC8vIFNob3cgdGhlIHNwaW5uZXJcblxuICAgICAgICBzd2l0Y2ggKCRlbGVtZW50KSB7XG4gICAgICAgICAgICBjYXNlICdmaWVsZHMnIDpcbiAgICAgICAgICAgICAgICAkKCcjc3Bpbm5lci1maWVsZHMnKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd1dGlsaXR5JyA6XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItdXRpbGl0eScpLnRvZ2dsZShsb2FkaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItdXRpbGl0eScpLnRvZ2dsZShsb2FkaW5nKTtcbiAgICAgICAgICAgICAgICAkKCcjc3Bpbm5lci1maWVsZHMnKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogTG9hZCB0aGUgZm9ybSBkYXRhIGZyb20gdGhlIGJhY2sgb2ZmaWNlXG4gICAgICovXG4gICAgcHVibGljIGxvYWQoKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICAkLmdldEpTT04oYWpheFVybCwge1xuICAgICAgICAgICAgZm9ybV9pZCA6IEVGX0FkZC5nZXRQYXJhbWV0ZXIoJ3Bvc3QnKSxcbiAgICAgICAgICAgIGFjdGlvbjogJ0VGL2xvYWRfZm9ybV9kYXRhJ1xuICAgICAgICB9KS5zdWNjZXNzKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0aGUgZGF0YSBmb3IgYWxsIHRoZSBmb3JtXG4gICAgICAgICAgICB0aGlzLmFkZERhdGEoZGF0YS5kYXRhLmZvcm0pO1xuICAgICAgICAgICAgdGhpcy5hZGRGb3JtRGF0YShkYXRhLmRhdGEuZm9ybSk7XG5cblxuICAgICAgICAgICAgJC5lYWNoKGRhdGEuZGF0YS5pbnB1dHMsKHR5cGUsaW5wdXQgOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUlucHV0c1t0eXBlXSA9IGlucHV0O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQuZWFjaChkYXRhLmRhdGEuZm9ybXMsKHR5cGUsaW5wdXQgOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUZvcm1zW3R5cGVdID0gaW5wdXQ7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICAvLyBBZGQgdGhlIHN1Ym1pdCBkYXRhXG4gICAgICAgICAgICBpZihkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0KSB7XG4gICAgICAgICAgICAgICAgbGV0IHN1Ym1pdCA9IGRhdGEuZGF0YS5mb3JtLmlucHV0cy5zdWJtaXQ7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGRhdGEuZGF0YS5mb3JtLmlucHV0cy5zdWJtaXQ7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRTdWJtaXREYXRhKHN1Ym1pdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIExvYWQgYWxsIHRoZSBpbnB1dHNcbiAgICAgICAgICAgIHRoaXMubG9hZElucHV0cyhkYXRhLmRhdGEuZm9ybS5pbnB1dHMsMCkudGhlbigoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKCh2YWx1ZSA6IEVGX0lucHV0LGtleSA6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0c1trZXldLmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWRkUmVxdWlyZWRGaWVsZHMoZGF0YS5kYXRhLmZvcm0udHlwZSk7XG4gICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgIC8vIEkgc2VuZCBiYWNrIHRoZSBkYXRhXG4gICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG5cblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBBZGQgdGhlIGRhdGEgaW5zaWRlIHRoZSBmb3JtIGl0c2VsZlxuICAgICAqXG4gICAgICogQHBhcmFtICRmb3JtRGF0YVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhZGREYXRhKCRmb3JtRGF0YSA6IGFueSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgICQoJyNlZi1hZGQtbWFpbi1pbmZvJykuZmluZCgnW25hbWVePVwic2V0dGluZ3NcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxJbmZvcygkKGVsZW0pLCRmb3JtRGF0YSk7XG5cbiAgICAgICAgfSk7XG4gICAgICAgICQoJyNlZi1hZGQtbWFpbi1pbmZvJykuZmluZCgnW25hbWVePVwiYXR0cmlidXRlc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbEluZm9zKCQoZWxlbSksJGZvcm1EYXRhKTtcblxuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBjaGFuZ2VGb3JtVHlwZSh0eXBlKSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgRUZfQWRkLmxvYWRpbmcodHJ1ZSwndXRpbGl0eScpO1xuXG4gICAgICAgIGxldCAkZm9ybURhdGEgPSB0aGlzLmZvcm1UeXBlLnZhbHVlO1xuXG4gICAgICAgICRmb3JtRGF0YS50eXBlID0gdHlwZTtcblxuICAgICAgICB0aGlzLmFkZEZvcm1EYXRhKCRmb3JtRGF0YSk7XG4gICAgICAgIHRoaXMuYWRkUmVxdWlyZWRGaWVsZHMoJGZvcm1EYXRhLnR5cGUpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCB0aGUgZm9ybSBkYXRhIGluIHRoZSBmb3JtIHR5cGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZm9ybURhdGFcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYWRkRm9ybURhdGEoJGZvcm1EYXRhKSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgdGhpcy5sb2FkRm9ybVRlbXBsYXRlKCRmb3JtRGF0YS50eXBlKS50aGVuKCgkdGVtcGxhdGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybVR5cGUgPSB0aGlzLmdlbmVyYXRlRm9ybSgkZm9ybURhdGEudHlwZSk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9ybVR5cGUuaW5pdCgkdGVtcGxhdGUpO1xuXG4gICAgICAgICAgICAkKCcjZWYtYWRkLXR5cGUnKS5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxJbmZvcygkKGVsZW0pLCRmb3JtRGF0YSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ3V0aWxpdHknKTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGZvcm1UeXBlXG4gICAgICovXG4gICAgcHVibGljIGFkZFJlcXVpcmVkRmllbGRzKGZvcm1UeXBlIDogc3RyaW5nKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCByZXF1aXJlZCA9IHRoaXMuYXZhaWxhYmxlRm9ybXNbZm9ybVR5cGVdLnJlcXVpcmVkO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlVW50b3VjaGVkSW5wdXRzKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAkLmVhY2godGhpcy5pbnB1dHMsKGtleSA6IHN0cmluZywgaW5wdXQgOiBFRl9JbnB1dCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gJC5pbkFycmF5KGlucHV0LnZhbHVlLmF0dHJpYnV0ZXMubmFtZSxyZXF1aXJlZCk7XG4gICAgICAgICAgICAgICAgaWYoaW5kZXggIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IGlucHV0cyA9IFtdO1xuXG5cbiAgICAgICAgICAgICQuZWFjaChyZXF1aXJlZCwoa2V5IDogbnVtYmVyLGlucHV0TmFtZSA6IHN0cmluZykgPT4ge1xuXG4gICAgICAgICAgICAgICAgLy8gQWRkIHRoZSBkZWZhdWx0IHZhbHVlcyBpbnNpZGVcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXQgPSB0aGlzLmdldEF2YWlsYWJsZUlucHV0RGF0YShpbnB1dE5hbWUpO1xuXG4gICAgICAgICAgICAgICAgaW5wdXQuYXR0cmlidXRlcy5uYW1lID0gaW5wdXROYW1lO1xuXG4gICAgICAgICAgICAgICAgaW5wdXRzLnB1c2goaW5wdXQpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYoaW5wdXRzICYmIGlucHV0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cywgMCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIEVGX0FkZC5zdWNjZXNzID0gJ1RoZSBmaWVsZHMgJyArIHJlcXVpcmVkLmpvaW4oJywgJykgKyAnIGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgZm9ybSc7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFsbCB0aGUgaW5wdXRzIGFkZGVkIGJ5IGNoYW5naW5nIHRoZSB0eXBlIG9mIGZvcm1cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlVW50b3VjaGVkSW5wdXRzKCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIGxldCBpbnB1dHMgPSBbXTtcblxuICAgICAgICAkLmVhY2godGhpcy5pbnB1dHMsKGtleSA6IG51bWJlciwgaW5wdXQgOiBFRl9JbnB1dCkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoaW5wdXQuZGlydHkpIHtcbiAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChpbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzID0gaW5wdXRzO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJlb3JnYW5pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0VHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRBdmFpbGFibGVJbnB1dERhdGEoaW5wdXRUeXBlIDogc3RyaW5nKSA6IGFueVxuICAgIHtcbiAgICAgICAgbGV0IGlucHV0O1xuXG4gICAgICAgIGlmKHRoaXMuYXZhaWxhYmxlSW5wdXRzW2lucHV0VHlwZV0pIHtcbiAgICAgICAgICAgIGlucHV0ID0gdGhpcy5hdmFpbGFibGVJbnB1dHNbaW5wdXRUeXBlXS5kYXRhO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBpbnB1dCA9IHRoaXMuYXZhaWxhYmxlSW5wdXRzWyd0ZXh0J10uZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZEZvcm1UZW1wbGF0ZSh0eXBlIDogc3RyaW5nKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBsZXQga2V5ID0gJ2Zvcm0tJyArIHR5cGU7XG5cbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGVzW2tleV0gJiYgdGhpcy50ZW1wbGF0ZXNba2V5XSAhPSB1bmRlZmluZWQgJiYgdGhpcy50ZW1wbGF0ZXNba2V5XSAhPSAnJykge1xuICAgICAgICAgICAgZGZkLnJlc29sdmUodGhpcy50ZW1wbGF0ZXNba2V5XSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQuZ2V0KGFqYXhVcmwsIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnYWN0aW9ucycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgOiB0eXBlLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ0VGL2xvYWRfdGVtcGxhdGUnXG4gICAgICAgICAgICB9KS5zdWNjZXNzKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlc1trZXldID0gZGF0YS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhLmRhdGEpO1xuICAgICAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBGaWxsIGZvcm0gZGF0YSB0aGUgaW5mb3MgaW5zaWRlIHRoZSBlZGl0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZWxlbVxuICAgICAqIEBwYXJhbSAkZm9ybURhdGFcbiAgICAgKi9cbiAgICBwdWJsaWMgZmlsbEluZm9zKCRlbGVtLCRmb3JtRGF0YSkgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkZWxlbSk7XG5cbiAgICAgICAgaWYoJGZvcm1EYXRhW3Byb3AuYXR0cl0gJiYgJGZvcm1EYXRhW3Byb3AuYXR0cl1bcHJvcC5pZF0pIHtcblxuICAgICAgICAgICAgRUZfSW5wdXQuc2V0SW5wdXRWYWx1ZSgkZWxlbSwkZm9ybURhdGFbcHJvcC5hdHRyXVtwcm9wLmlkXSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQWRkIHRoZSBkYXRhIGluc2lkZSB0aGUgc3VibWl0IGJ1dHRvblxuICAgICAqXG4gICAgICogQHBhcmFtIHN1Ym1pdFxuICAgICAqL1xuICAgIHByaXZhdGUgYWRkU3VibWl0RGF0YShzdWJtaXQpIDogdm9pZFxuICAgIHtcbiAgICAgICAgRUZfSW5wdXQuYWRkRGF0YVRvRWxlbWVudCh0aGlzLiRib2R5LmZpbmQoJyNlZi1hZGQtc3VibWl0Jyksc3VibWl0KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogTG9hZCBhbGwgdGhlIGlucHV0cyBmcm9tIHRoZSBsaXN0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRzXG4gICAgICogQHBhcmFtIGRmZFxuICAgICAqIEBwYXJhbSBvcmRlclxuICAgICAqL1xuICAgIHByaXZhdGUgbG9hZElucHV0cyhpbnB1dHMgOiB7IGF0dHJpYnV0ZXMgOiB7dHlwZSA6IHN0cmluZyB9fVtdLG9yZGVyIDogbnVtYmVyLGRmZCAgOiBhbnkgPSBudWxsKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgaWYoIWRmZCkge1xuICAgICAgICAgICAgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoaW5wdXRzKTtcblxuICAgICAgICBsZXQga2V5ID0ga2V5c1tvcmRlcl07XG5cbiAgICAgICAgaWYoIWtleSB8fCAhaW5wdXRzIHx8ICFpbnB1dHNba2V5XSl7XG4gICAgICAgICAgICB0aGlzLmlzX2luaXQgPSB0cnVlO1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ2ZpZWxkcycpO1xuICAgICAgICAgICAgZGZkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuYWRkSW5wdXQoaW5wdXRzW2tleV0uYXR0cmlidXRlcy50eXBlLGlucHV0c1trZXldKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBvcmRlcisrO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZElucHV0cyhpbnB1dHMsb3JkZXIsZGZkKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcblxuICAgIH1cblxuXG5cbiAgICBwdWJsaWMgZ2VuZXJhdGVGb3JtKHR5cGUgOiBzdHJpbmcpIDogRUZfRm9ybVxuICAgIHtcbiAgICAgICAgbGV0IGZvcm07XG5cbiAgICAgICAgaWYoIXRoaXMuYXZhaWxhYmxlRm9ybXNbdHlwZV0pIHtcbiAgICAgICAgICAgIHR5cGUgPSAncG9zdCc7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2xvZ2luJyA6XG4gICAgICAgICAgICAgICAgZm9ybSA9IG5ldyBFRl9Gb3JtKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdwb3N0JyA6XG4gICAgICAgICAgICAgICAgZm9ybSA9IG5ldyBFRl9Gb3JtKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIWZvcm0pIHtcbiAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICB9XG5cblxuICAgICAgICByZXR1cm4gZm9ybTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2VuZXJhdGVJbnB1dCh0eXBlIDogc3RyaW5nKSA6IEVGX0lucHV0XG4gICAge1xuICAgICAgICBsZXQgaW5wdXQ7XG5cbiAgICAgICAgaWYoIXRoaXMuYXZhaWxhYmxlSW5wdXRzW3R5cGVdKSB7XG4gICAgICAgICAgICB0eXBlID0gJ3RleHQnO1xuICAgICAgICB9XG5cblxuICAgICAgICBzd2l0Y2godHlwZSkge1xuICAgICAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBuZXcgRUZfSW5wdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFpbnB1dCkge1xuICAgICAgICAgICAgaW5wdXQgPSBuZXcgRUZfSW5wdXQoKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcmV0dXJuIGlucHV0O1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIExvYWQgdGhlIGlucHV0IHRlbXBsYXRlIGZyb20gdGhlIEJPXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZSA6IHN0cmluZ1xuICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICovXG4gICAgcHVibGljIGdldElucHV0KHR5cGUgOiBzdHJpbmcgPSAndGV4dCcpXG4gICAge1xuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlc1t0eXBlXSAmJiB0aGlzLnRlbXBsYXRlc1t0eXBlXSAhPSB1bmRlZmluZWQgJiYgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gIT0gJycpIHtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKHRoaXMudGVtcGxhdGVzW3R5cGVdKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJC5nZXQoYWpheFVybCwge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdpbnB1dHMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlIDogdHlwZSxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX3RlbXBsYXRlJ1xuICAgICAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gPSBkYXRhLmRhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBJIHNlbmQgYmFjayB0aGUgZGF0YVxuICAgICAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEuZGF0YSk7XG4gICAgICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgSFRUUCBFcnJvcnNcbiAgICAgKlxuICAgICAqIEBUT0RPXG4gICAgICovXG4gICAgcHVibGljIGhhbmRsZUVycm9yKGRhdGEgOiBzdHJpbmd8e3Jlc3BvbnNlSlNPTiA6IHtlcnJvcn19KSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgbGV0IGVycm9yIDogc3RyaW5nO1xuXG4gICAgICAgIGlmKHR5cGVvZiBkYXRhICE9IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGVycm9yID0gZGF0YS5yZXNwb25zZUpTT04uZXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBFRl9BZGQuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UpO1xuXG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogR2V0IHRoZSB1cmwgcGFyYW1ldGVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW1ldGVyXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldFBhcmFtZXRlcihwYXJhbWV0ZXIgOiBzdHJpbmcpOmFueVxuICAgIHtcbiAgICAgICAgdmFyIHBhcmFtc19zdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKTtcblxuICAgICAgICB2YXIgcGFyYW1zX2FycmF5ID0gcGFyYW1zX3N0cmluZy5zcGxpdCgnJicpO1xuXG4gICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgZm9yKHZhciBpID0wO2k8cGFyYW1zX2FycmF5Lmxlbmd0aDtpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBlID0gcGFyYW1zX2FycmF5W2ldLnNwbGl0KCc9Jyk7XG4gICAgICAgICAgICBvYmpbZVswXV0gPSBlWzFdXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JqW3BhcmFtZXRlcl07XG4gICAgfVxuXG5cblxuXG4gICAgLyoqXG4gICAgICogRGlzcGxheSBhbiBlcnJvciBtZXNzYWdlIHRoYXQgd2lsbCBmYWRlIG91dCBpbiA1IHNlY1xuICAgICAqXG4gICAgICogQHBhcmFtIGVycm9yTWVzc2FnZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0IGVycm9yKGVycm9yTWVzc2FnZSA6IHN0cmluZ3xib29sZWFuKSB7XG5cbiAgICAgICAgRUZfQWRkLnNldE1lc3NhZ2UoJyNlcnJvci1tZXNzYWdlJyxlcnJvck1lc3NhZ2UsZmFsc2UpO1xuXG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogRGlzcGxheSBhIHN1Y2Nlc3MgbWVzc2FnZSB0aGF0IHdpbGwgZmFkZSBvdXQgaW4gNSBzZWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdWNjZXNzTWVzc2FnZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0IHN1Y2Nlc3Moc3VjY2Vzc01lc3NhZ2U6IHN0cmluZ3xib29sZWFuKSB7XG5cbiAgICAgICAgRUZfQWRkLnNldE1lc3NhZ2UoJyNzdWNjZXNzLW1lc3NhZ2UnLHN1Y2Nlc3NNZXNzYWdlLGZhbHNlKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAqIEBwYXJhbSBwZXJzaXN0IDogYm9vbGVhbiwgV2VpdGhlciBvciBub3QgdGhlIG1lc3NhZ2Ugc2hvdWxkIGJlIGRpc3BsYXllZCBvciBub3RcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldE1lc3NhZ2UoZWxlbWVudCA6IHN0cmluZyxtZXNzYWdlIDogc3RyaW5nfGJvb2xlYW4sIHBlcnNpc3QgOiBib29sZWFufG51bWJlciA9IGZhbHNlKSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgaWYobWVzc2FnZSkge1xuICAgICAgICAgICAgJChlbGVtZW50KS50ZXh0KG1lc3NhZ2UpLmZhZGVJbigyMDApO1xuXG4gICAgICAgICAgICBpZighcGVyc2lzdCkge1xuXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgcGVyc2lzdCBpcyBub3QgZXF1YWwgdG8gZmFsc2VcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgcGVyc2lzdCA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyc2lzdCA9IDUwMDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TWVzc2FnZShlbGVtZW50LCcnKTtcbiAgICAgICAgICAgICAgICB9LHBlcnNpc3QpO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgJChlbGVtZW50KS5mYWRlT3V0KDIwMCwoKSA9PiB7XG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS50ZXh0KCcnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbnZhciBFRl9hZGQgPSBuZXcgRUZfQWRkKCk7XG5FRl9hZGQuaW5pdCgpOyJdfQ==
