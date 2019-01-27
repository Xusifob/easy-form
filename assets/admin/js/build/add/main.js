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
                Object.defineProperty(EF_Input.prototype, "name", {
                    get: function() {
                        return this.value.attributes.name;
                    },
                    /**
                     *
                     * @param name
                     */
                    set: function(name) {
                        this.value.attributes.name = name;
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
                            _this.addPossibleFields();
                            input.dirty = true;
                        });
                    });
                    this.$body.off("click", 'select[name="settings[type]"]').on("change", 'select[name="settings[type]"]', function($event) {
                        var type = $($event.target).val();
                        _this.changeFormType(type);
                    });
                };
                /**
                 *
                 * @since 2.0.0
                 *
                 * Reorganise all the inputs on the page
                 */
                EF_Add.prototype.reorganise = function() {
                    var _this = this;
                    var dfd = $.Deferred();
                    EF_Add.loading(true, "fields");
                    var inputs = [];
                    $.each(this.inputs, function(key, input) {
                        inputs.push(input.value);
                    });
                    this.removeAllInputs();
                    this.loadInputs(inputs, 0).then(function() {
                        console.log("kiwi");
                        _this.addPossibleFields();
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
                 * Called on delete of an input.
                 *
                 * Remove the input
                 *
                 * @Event
                 *
                 * @param input
                 */
                EF_Add.prototype.onDelete = function(input) {
                    var position = this.inputs.indexOf(input);
                    this.inputs.splice(position, 1);
                    this.reorganise().then(function() {});
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
                        _this.availableInputs = data.data.inputs;
                        _this.availableForms = data.data.forms;
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
                            _this.addPossibleFields();
                        });
                        // I send back the data
                        dfd.resolve(data);
                    }).error(this.handleError);
                    // Return a promise
                    return dfd.promise();
                };
                /**
                 * Add the data inside the form <html> elements
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
                 * @event : The <select> element form type is changed
                 *
                 * This function will :
                 * - Add the form data within the new form and load the right template
                 * - Load the required fields of the form
                 * - Load the possible fields of the form
                 *
                 * @since 2.0.0
                 *
                 * @param type
                 */
                EF_Add.prototype.changeFormType = function(type) {
                    EF_Add.loading(true, "utility");
                    var $formData = this.formType.value;
                    $formData.type = type;
                    this.addFormData($formData);
                    this.addRequiredFields($formData.type);
                    this.addPossibleFields();
                };
                /**
                 * Display the list of possible fields according to the type of form selected.
                 *
                 * Exemple : User form has the following fields available :
                 *
                 * - first_name
                 * - last_name
                 * - content
                 *
                 * These fields are not mandatory but are a plus in the form type.
                 *
                 * Furthermore they are handled differently than other types
                 *
                 */
                EF_Add.prototype.addPossibleFields = function() {
                    var _this = this;
                    var current = this.availableForms[this.getFormType()];
                    console.log(current.required);
                    // Slice is used here to clone the object
                    var possibleFields = current.possible.concat(current.required);
                    console.log(possibleFields);
                    var template = this.$body.find("#possible-field").html();
                    var elem = this.$body.find("#possible-fields");
                    // Reset the fields displayed
                    elem.html("");
                    // I don't show the inputs that are already in the form
                    this.inputs.forEach(function(input) {
                        var index = possibleFields.indexOf(input.name);
                        if (index != -1) {
                            possibleFields.splice(index, 1);
                        }
                    });
                    if (possibleFields.length == 0) {
                        $("#possible-fields-label").hide();
                        return;
                    }
                    $("#possible-fields-label").show();
                    possibleFields.forEach(function(input_name) {
                        var _template = $(template);
                        _template.attr("name", input_name);
                        _template.html(input_name);
                        elem.append(_template);
                        _template.off("click").on("click", function() {
                            var input = _this.getAvailableInputData(input_name);
                            input.attributes.name = input_name;
                            _this.addInput(input.attributes.type, input).then(function(input) {
                                _this.addPossibleFields();
                                EF_Add.loading(false, "fields");
                                input.dirty = true;
                            });
                        });
                    });
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
                    var _required = this.availableForms[formType].required;
                    // Here we add the concat to clone the object
                    var required = _required.concat([]);
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
                 * Return the type of input according to its name
                 *
                 * @param inputName
                 */
                EF_Add.prototype.getAvailableInputData = function(inputName) {
                    var input;
                    var type = this.getDefaultTypeFromName(inputName);
                    if (this.availableInputs[type]) {
                        input = this.availableInputs[type].data;
                    } else {
                        input = this.availableInputs["text"].data;
                    }
                    return input;
                };
                /**
                 *
                 * Return the default type of a field according to its name
                 *
                 * @param name
                 */
                EF_Add.prototype.getDefaultTypeFromName = function(name) {
                    // Default type
                    var type = "text";
                    if (this.defaultInputTypes[name]) {
                        type = this.defaultInputTypes[name];
                    }
                    return type;
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
                    return new EF_Form_1.EF_Form();
                };
                EF_Add.prototype.getFormType = function() {
                    return this.$body.find('*[name="settings[type]"]').val();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2lucHV0cy9FRl9JbnB1dC50cyIsImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2Zvcm1zL0VGX0Zvcm0udHMiLCJhc3NldHMvYWRtaW4vanMvc3JjL2FkZC9FRl9BZGQudHMiXSwibmFtZXMiOlsiRUZfSW5wdXQiLCJ0aGlzIiwiZGlydHkiLCJjb250YWluZXIiLCIkIiwicHJvdG90eXBlIiwiaW5pdCIsIiRlbGVtZW50IiwiaWQiLCIkZGF0YSIsInBvc2l0aW9uIiwicmVwbGFjZSIsImVsZW1lbnQiLCJvcHRpb25zRWxlbWVudCIsImZpbmQiLCJhcHBlbmQiLCJyZXBsYWNlV2l0aCIsInNldEV2ZW50cyIsImFkZERhdGEiLCJoYW5kbGVDaGVja2JveCIsImVhY2giLCJrZXkiLCJpbnB1dCIsIiRpbnB1dCIsInZhbHVlIiwiaXMiLCJuYW1lIiwiYXR0ciIsIiRoaWRkZW4iLCJvbiIsImFmdGVyIiwiX3RoaXMiLCJvZmYiLCJ0b2dnbGUiLCJvbkR1cGxpY2F0ZSIsIm9uQ2hhbmdlVHlwZSIsIm9uRGVsZXRlIiwib25Nb3ZlIiwiZWxlbSIsImhhc0NsYXNzIiwiY2xvc2UiLCJvcGVuIiwiYWRkRGF0YVRvRWxlbWVudCIsInByb3AiLCJnZXRJbnB1dFByb3BlcnRpZXMiLCJzZXRJbnB1dFZhbHVlIiwidmFsIiwiZ2V0SW5wdXRWYWx1ZSIsImRhdGEiLCJzcGxpdCIsImhpZGUiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiaHRtbCIsInNob3ciLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImF0dHJpYnV0ZXMiLCJ0eXBlIiwiRUZfRm9ybSIsIkVGX0lucHV0XzEiLCJFRl9BZGQiLCJ0ZW1wbGF0ZXMiLCJpbnB1dHMiLCJhdmFpbGFibGVJbnB1dHMiLCJhdmFpbGFibGVGb3JtcyIsImlzX2luaXQiLCIkYm9keSIsImxvYWQiLCJ0aGVuIiwiYWRkSW5wdXQiLCJsb2FkaW5nIiwiYWRkUG9zc2libGVGaWVsZHMiLCIkZXZlbnQiLCJ0YXJnZXQiLCJjaGFuZ2VGb3JtVHlwZSIsInJlb3JnYW5pc2UiLCJkZmQiLCJEZWZlcnJlZCIsInB1c2giLCJyZW1vdmVBbGxJbnB1dHMiLCJsb2FkSW5wdXRzIiwiY29uc29sZSIsImxvZyIsInJlc29sdmUiLCJwcm9taXNlIiwiZGlyZWN0aW9uIiwiaW5kZXhPZiIsIm5ld3BvcyIsImxlbmd0aCIsInN3aXRjaCIsInBvczEiLCJwb3MyIiwiaW5wdXQxIiwic3VjY2VzcyIsInNwbGljZSIsImdldElucHV0IiwiZ2VuZXJhdGVJbnB1dCIsImFjdGlvbiIsImdldEpTT04iLCJhamF4VXJsIiwiZm9ybV9pZCIsImdldFBhcmFtZXRlciIsImZvcm0iLCJhZGRGb3JtRGF0YSIsImZvcm1zIiwiZGVmYXVsdElucHV0VHlwZXMiLCJkZWZhdWx0X2lucHV0cyIsInN1Ym1pdCIsImFkZFN1Ym1pdERhdGEiLCJmb3JFYWNoIiwiYWRkUmVxdWlyZWRGaWVsZHMiLCJlcnJvciIsImhhbmRsZUVycm9yIiwiJGZvcm1EYXRhIiwiZmlsbEluZm9zIiwiZm9ybVR5cGUiLCJjdXJyZW50IiwiZ2V0Rm9ybVR5cGUiLCJyZXF1aXJlZCIsInBvc3NpYmxlRmllbGRzIiwicG9zc2libGUiLCJjb25jYXQiLCJ0ZW1wbGF0ZSIsImluZGV4IiwiaW5wdXRfbmFtZSIsIl90ZW1wbGF0ZSIsImdldEF2YWlsYWJsZUlucHV0RGF0YSIsImxvYWRGb3JtVGVtcGxhdGUiLCIkdGVtcGxhdGUiLCJnZW5lcmF0ZUZvcm0iLCJfcmVxdWlyZWQiLCJyZW1vdmVVbnRvdWNoZWRJbnB1dHMiLCJpbkFycmF5IiwiaW5wdXROYW1lIiwiam9pbiIsImdldERlZmF1bHRUeXBlRnJvbU5hbWUiLCJ1bmRlZmluZWQiLCJnZXQiLCIkZWxlbSIsIkVGX0lucHV0XzIiLCJvcmRlciIsImtleXMiLCJFRl9Gb3JtXzEiLCJyZXNwb25zZUpTT04iLCJwYXJhbWV0ZXIiLCJwYXJhbXNfc3RyaW5nIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJzdWJzdHIiLCJwYXJhbXNfYXJyYXkiLCJvYmoiLCJpIiwiZSIsImVycm9yTWVzc2FnZSIsInNldE1lc3NhZ2UiLCJzdWNjZXNzTWVzc2FnZSIsIm1lc3NhZ2UiLCJwZXJzaXN0IiwidGV4dCIsImZhZGVJbiIsInNldFRpbWVvdXQiLCJmYWRlT3V0IiwiRUZfYWRkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztnQkF5REksU0FBQUE7Ozs7b0JBWE9DLEtBQUFDLFFBQWtCO29CQWFyQkQsS0FBS0UsWUFBWUMsRUFBRTs7Ozs7Ozs7O2dCQVloQkosU0FBQUssVUFBQUMsT0FBUCxTQUFZQyxVQUFnQkMsSUFBWUMsT0FBWUM7b0JBQUEsSUFBQUEsa0JBQUEsR0FBQTt3QkFBQUEsV0FBQTs7b0JBRWhEVCxLQUFLTyxLQUFLQTtvQkFFVkQsV0FBV0EsU0FBU0ksUUFBUSxjQUFhSCxLQUFHO29CQUM1Q0QsV0FBV0EsU0FBU0ksUUFBUSxZQUFXSDtvQkFFdkNQLEtBQUtXLFVBQVVSLEVBQUVHO29CQUNqQk4sS0FBS1ksaUJBQWlCWixLQUFLVyxRQUFRRSxLQUFLO29CQUV4QyxJQUFHLFNBQVNKLFVBQVU7d0JBQ2xCVCxLQUFLRSxVQUFVWSxPQUFPZCxLQUFLVzsyQkFDekI7d0JBQ0ZYLEtBQUtFLFVBQVVXLEtBQUssWUFBWUosVUFBVU0sWUFBWWYsS0FBS1c7O29CQUcvRFgsS0FBS2dCO29CQUVMaEIsS0FBS2lCLFFBQVFUO29CQUViUixLQUFLa0I7Ozs7O2dCQVFGbkIsU0FBQUssVUFBQWMsaUJBQVA7b0JBRUlsQixLQUFLVyxRQUFRRSxLQUFLLDBCQUEwQk0sS0FBSyxTQUFDQyxLQUFhQzt3QkFDM0QsSUFBSUMsU0FBU25CLEVBQUVrQjt3QkFFZixJQUFJRSxRQUFRRCxPQUFPRSxHQUFHLGNBQWMsSUFBSTt3QkFDeEMsSUFBSUMsT0FBT0gsT0FBT0ksS0FBSzt3QkFDdkJKLE9BQU9JLEtBQUssUUFBTzt3QkFFbkIsSUFBSUMsVUFBVXhCLEVBQUUsZ0NBQStCc0IsT0FBTSxjQUFhRixRQUFPO3dCQUd6RUQsT0FB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Ozs7Ozs7Ozs7OztnQkFVMUNoRyxPQUFBK0YsYUFBZCxTQUF5QmhKLFNBQWlCa0osU0FBMEJDO29CQUFwRSxJQUFBaEksUUFBQTlCO29CQUFvRSxJQUFBOEosaUJBQUEsR0FBQTt3QkFBQUEsVUFBQTs7b0JBR2hFLElBQUdELFNBQVM7d0JBQ1IxSixFQUFFUSxTQUFTb0osS0FBS0YsU0FBU0csT0FBTzt3QkFFaEMsS0FBSUYsU0FBUzs7NEJBR1QsV0FBVUEsWUFBWSxXQUFXO2dDQUM3QkEsVUFBVTs7NEJBR2RHLFdBQVc7Z0NBQ1BuSSxNQUFLNkgsV0FBV2hKLFNBQVE7K0JBQzFCbUo7OzJCQUlKO3dCQUNGM0osRUFBRVEsU0FBU3VKLFFBQVEsS0FBSTs0QkFDbkIvSixFQUFFUSxTQUFTb0osS0FBSzs7OztnQkFLaEMsT0FBQW5HOztZQUVJdUcsU0FBUyxJQUFJdkc7WUFDakJ1RyxPQUFPOUoiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuZGVjbGFyZSB2YXIgJCA6IGFueTtcblxuZXhwb3J0IGNsYXNzIEVGX0lucHV0XG57XG5cbiAgICAvKipcbiAgICAgKiBAdmFyIHN0cmluZ1xuICAgICAqXG4gICAgICogVGhlIHR5cGUgb2YgdGhlIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB0eXBlIDogc3RyaW5nID0gJ3RleHQnO1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIEhUTUwgRWxlbWVudFxuICAgICAqXG4gICAgICogVGhlIGh0bWwgZWxlbWVudCBvZiB0aGUgaW5wdXRcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBlbGVtZW50IDogYW55O1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIEhUTUwgRWxlbWVudFxuICAgICAqXG4gICAgICogVGhlIGh0bWwgZWxlbWVudCBmb3IgdGhlIG9wdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBvcHRpb25zRWxlbWVudCA6IGFueTtcblxuXG4gICAgLyoqXG4gICAgICogVGhlIGlkIChwb3NpdGlvbikgb2YgdGhlIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIGlkIDogbnVtYmVyO1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBlbGVtZW50IG9mIHRoZSBjb250YWluZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgY29udGFpbmVyIDogYW55O1xuXG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgZmllbGQgaGFzIGJlZW4gY2hhbmdlZCBvciBub3RcbiAgICAgKi9cbiAgICBwdWJsaWMgZGlydHkgOiBib29sZWFuID0gZmFsc2U7XG5cblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIGNhbGxlZCBvbiBkdXBsaWNhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgb25EdXBsaWNhdGUgOiBhbnk7XG4gICAgcHVibGljIG9uQ2hhbmdlVHlwZSA6IGFueTtcbiAgICBwdWJsaWMgb25EZWxldGUgOiBhbnk7XG4gICAgcHVibGljIG9uTW92ZSA6IGFueTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9ICQoJyNmbGQnKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gJGRhdGFcbiAgICAgKiBAcGFyYW0gaWRcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gOiBudW1iZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdCgkZWxlbWVudCA6IGFueSwgaWQgOiBudW1iZXIsJGRhdGEgOiBhbnkscG9zaXRpb24gOiBudWxsfG51bWJlciA9IG51bGwpXG4gICAge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG5cbiAgICAgICAgJGVsZW1lbnQgPSAkZWxlbWVudC5yZXBsYWNlKC9maWVsZFVuSWQvZyxpZCsxKTtcbiAgICAgICAgJGVsZW1lbnQgPSAkZWxlbWVudC5yZXBsYWNlKC9maWVsZElkL2csaWQpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoJGVsZW1lbnQpO1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5lZi10YWJsZScpO1xuXG4gICAgICAgIGlmKG51bGwgPT09IHBvc2l0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmQodGhpcy5lbGVtZW50KTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuZmluZCgnI2ZpZWxkLScgKyBwb3NpdGlvbikucmVwbGFjZVdpdGgodGhpcy5lbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0RXZlbnRzKCk7XG5cbiAgICAgICAgdGhpcy5hZGREYXRhKCRkYXRhKTtcblxuICAgICAgICB0aGlzLmhhbmRsZUNoZWNrYm94KCk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgY2hlY2tib3hzIHRvIGxpbmsgdGhlbSB3aXRoIGEgaGlkZGVuIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIGhhbmRsZUNoZWNrYm94KClcbiAgICB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsaW5wdXQgOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgbGV0ICRpbnB1dCA9ICQoaW5wdXQpO1xuXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAkaW5wdXQuaXMoJzpjaGVja2VkJykgPyAxIDogMDtcbiAgICAgICAgICAgIGxldCBuYW1lID0gJGlucHV0LmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICRpbnB1dC5hdHRyKCduYW1lJywnJyk7XG5cbiAgICAgICAgICAgIGxldCAkaGlkZGVuID0gJCgnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiJysgbmFtZSArJ1wiIHZhbHVlPVwiJysgdmFsdWUgKydcIj4nKTtcblxuXG4gICAgICAgICAgICAkaW5wdXQub24oJ2NoYW5nZScsKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9ICRpbnB1dC5pcygnOmNoZWNrZWQnKSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgICRoaWRkZW4uYXR0cigndmFsdWUnLHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkaW5wdXQuYWZ0ZXIoJGhpZGRlbilcblxuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogU2V0IGFsbCB0aGUgZXZlbnRzIGxpbmtlZCB0byB0aGlzIGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0RXZlbnRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwib3Blbi1jbG9zZVwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHtyZXR1cm4gdGhpcy50b2dnbGUoKX0pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwiZHVwbGljYXRlXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3RoaXMub25EdXBsaWNhdGUodGhpcyk7IHJldHVybiBmYWxzZTt9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cImNoYW5nZS10eXBlXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3RoaXMub25DaGFuZ2VUeXBlKHRoaXMpOyByZXR1cm4gZmFsc2U7fSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJkZWxldGVcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7dGhpcy5vbkRlbGV0ZSh0aGlzKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwidXBcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7dGhpcy5vbk1vdmUodGhpcywndXAnKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwiZG93blwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHt0aGlzLm9uTW92ZSh0aGlzLCdkb3duJyk7IHJldHVybiBmYWxzZTt9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ3NlbGVjdCxpbnB1dCx0ZXh0YXJlYScpLm9uKCdpbnB1dCcsICgpID0+IHsgdGhpcy5kaXJ0eSA9IHRydWU7fSk7XG4gICAgfVxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQ2xvc2UgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlKCk6IGJvb2xlYW5cbiAgICB7XG5cbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwib3Blbi1jbG9zZVwiXScpO1xuXG4gICAgICAgIGlmKCQoZWxlbSkuaGFzQ2xhc3MoJ21pbmlmeScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9zZSgpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0IHRoZSBkYXRhIGluIHRoZSB0ZW1wbGF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICovXG4gICAgcHVibGljIGFkZERhdGEoJGRhdGEpIDogdm9pZFxuICAgIHtcblxuICAgICAgICBpZigkZGF0YS5kaXJ0eSkge1xuICAgICAgICAgICAgdGhpcy5kaXJ0eSA9ICRkYXRhLmRpcnR5O1xuICAgICAgICB9XG5cblxuICAgICAgICBFRl9JbnB1dC5hZGREYXRhVG9FbGVtZW50KHRoaXMuZWxlbWVudCwkZGF0YSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGREYXRhVG9FbGVtZW50KCRlbGVtZW50IDogYW55LCAkZGF0YSA6IGFueSkgOiB2b2lkXG4gICAge1xuICAgICAgICAkZWxlbWVudC5maW5kKCdbbmFtZV49XCJmaWVsZFwiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoZWxlbSkpO1xuXG4gICAgICAgICAgICBpZigkZGF0YVtwcm9wLnByb3BdICYmICRkYXRhW3Byb3AucHJvcF1bcHJvcC5uYW1lXSkge1xuICAgICAgICAgICAgICAgIEVGX0lucHV0LnNldElucHV0VmFsdWUoJChlbGVtKSwkZGF0YVtwcm9wLnByb3BdW3Byb3AubmFtZV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQWRkIGEgdmFsdWUgdG8gYW4gaW5wdXRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0SW5wdXRWYWx1ZShpbnB1dCA6IGFueSwgdmFsdWUgOiBzdHJpbmd8Ym9vbGVhbilcbiAgICB7XG4gICAgICAgIGlmKGlucHV0LmlzKCc6Y2hlY2tib3gnKSl7XG4gICAgICAgICAgICBpZihcIjFcIiA9PSB2YWx1ZSB8fCB2YWx1ZSA9PSAnb24nKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnB1dC5wcm9wKCdjaGVja2VkJyx2YWx1ZSk7XG4gICAgICAgIH1lbHNlIGlmKGlucHV0LmlzKCdzZWxlY3QnKSl7XG4gICAgICAgICAgICBpbnB1dC5maW5kKCdvcHRpb25bdmFsdWU9XCInKyB2YWx1ZSArJ1wiXScpLnByb3AoJ3NlbGVjdGVkJyx0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgaW5wdXQudmFsKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBHZXQgdGhlIHZhbHVlIG9mIGFuIGlucHV0XG4gICAgICpcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqIEByZXR1cm5zIGFueVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5wdXRWYWx1ZShpbnB1dCA6IGFueSlcbiAgICB7XG5cbiAgICAgICAgaWYodHlwZW9mIGlucHV0LnZhbCAhPSAnZnVuY3Rpb24nKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYoaW5wdXQuaXMoJzpjaGVja2JveCcpKXtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5pcygnOmNoZWNrZWQnKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQudmFsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gYWxsIHRoZSBwcm9wZXJ0aWVzIG9mIGFuIGlucHV0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5wdXRQcm9wZXJ0aWVzKGVsZW0gOiBhbnkpIDoge2F0dHIsaWQscHJvcCxuYW1lfVxuICAgIHtcblxuICAgICAgICBsZXQgbmFtZSA9IGVsZW0uYXR0cignbmFtZScpO1xuXG4gICAgICAgIGxldCBkYXRhID0gbmFtZS5zcGxpdCgnWycpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhdHRyIDogZGF0YVswXS5yZXBsYWNlKCddJywnJyksXG4gICAgICAgICAgICBpZCA6IGRhdGFbMV0ucmVwbGFjZSgnXScsJycpLFxuICAgICAgICAgICAgcHJvcCA6IGRhdGFbMl0gPyBkYXRhWzJdLnJlcGxhY2UoJ10nLCcnKSA6ICcnLFxuICAgICAgICAgICAgbmFtZSA6IGRhdGFbM10gPyBkYXRhWzNdLnJlcGxhY2UoJ10nLCcnKSA6ICcnLFxuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAc2luY2UgMS4xLjBcbiAgICAgKlxuICAgICAqIEBldmVudCA6IENsaWNrIG9uIG1pbmlmeSBidXR0b24gOiBoaWRlIHRoZSBvcHRpb25zIG9mIHRoZSBmaWVsZFxuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xvc2UoKSA6IGJvb2xlYW5cbiAgICB7XG4gICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQuaGlkZSgyMDApO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLm1pbmlmeScpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ21pbmlmeScpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ29wZW4nKVxuICAgICAgICAgICAgLmh0bWwoJysnKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBzaW5jZSAxLjEuMFxuICAgICAqXG4gICAgICogT3BlbiBhIGZpZWxkXG4gICAgICpcbiAgICAgKiBAZXZlbnQgOiBDbGljayBvbiBvcGVuIGJ1dHRvbiwgc2hvdyB0aGUgZmllbGQgb3B0aW9uc1xuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgb3BlbigpIDogYm9vbGVhblxuICAgIHtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudC5zaG93KDIwMCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcub3BlbicpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ29wZW4nKVxuICAgICAgICAgICAgLmFkZENsYXNzKCdtaW5pZnknKVxuICAgICAgICAgICAgLmh0bWwoJy0nKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJldHVybiB0aGUgdmFsdWUgb2YgYWxsIHRoZSBpbnB1dHMgaW4gdGhlIGZpZWxkXG4gICAgICpcbiAgICAgKi9cbiAgICBnZXQgdmFsdWUoKTogYW55IHtcblxuICAgICAgICBsZXQgdmFsdWUgPSB7XG4gICAgICAgICAgICBkaXJ0eSA6IHRoaXMuZGlydHksXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tuYW1lXj1cImZpZWxkXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGlucHV0IDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoaW5wdXQpKTtcbiAgICAgICAgICAgIGxldCB2YWwgPSBFRl9JbnB1dC5nZXRJbnB1dFZhbHVlKCQoaW5wdXQpKTtcblxuICAgICAgICAgICAgaWYocHJvcC5wcm9wICYmICF2YWx1ZVtwcm9wLnByb3BdICYmIHByb3AubmFtZSl7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5wcm9wXSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih2YWx1ZVtwcm9wLnByb3BdKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5wcm9wXVtwcm9wLm5hbWVdID0gdmFsO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AucHJvcF0gPSB2YWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuXG4gICAgfVxuXG5cblxuICAgIHB1YmxpYyBnZXQgbmFtZSgpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5hdHRyaWJ1dGVzLm5hbWU7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICovXG4gICAgcHVibGljIHNldCBuYW1lKG5hbWUgOiBzdHJpbmcpXG4gICAge1xuICAgICAgICB0aGlzLnZhbHVlLmF0dHJpYnV0ZXMubmFtZSA9IG5hbWU7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtFRl9JbnB1dH0gZnJvbSBcIi4uL2lucHV0cy9FRl9JbnB1dFwiO1xuXG5kZWNsYXJlIHZhciAkIDogYW55O1xuXG5leHBvcnQgY2xhc3MgRUZfRm9ybSB7XG5cbiAgICAvKipcbiAgICAgKiBAdmFyIHN0cmluZ1xuICAgICAqXG4gICAgICogVGhlIHR5cGUgb2YgdGhlIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB0eXBlOiBzdHJpbmcgPSAndGV4dCc7XG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgSFRNTCBFbGVtZW50XG4gICAgICpcbiAgICAgKiBUaGUgaHRtbCBlbGVtZW50IG9mIHRoZSBpbnB1dFxuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGVsZW1lbnQ6IGFueTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBIVE1MIGVsZW1lbnQgb2YgdGhlIGNvbnRhaW5lclxuICAgICAqL1xuICAgIHB1YmxpYyBjb250YWluZXIgOiBhbnk7XG5cblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9ICQoJyN1dGlsaXRpZXMnKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICovXG4gICAgcHVibGljIGluaXQoJGVsZW1lbnQgOiBhbnkpXG4gICAge1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoJGVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy5lbGVtZW50KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIHRoZSB2YWx1ZSBvZiBhbGwgdGhlIGlucHV0cyBpbiB0aGUgZmllbGRcbiAgICAgKlxuICAgICAqL1xuICAgIGdldCB2YWx1ZSgpOiBhbnkge1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IHt9O1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixpbnB1dCA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkKGlucHV0KSk7XG4gICAgICAgICAgICBsZXQgdmFsID0gRUZfSW5wdXQuZ2V0SW5wdXRWYWx1ZSgkKGlucHV0KSk7XG5cbiAgICAgICAgICAgIGlmKHByb3AuYXR0ciAmJiAhdmFsdWVbcHJvcC5hdHRyXSAmJiBwcm9wLmlkKXtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLmF0dHJdID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHZhbHVlW3Byb3AuYXR0cl0pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLmF0dHJdW3Byb3AuaWRdID0gdmFsO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AuYXR0cl0gPSB2YWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICB9XG5cblxuXG5cblxufSIsImltcG9ydCB7RUZfRm9ybX0gZnJvbSBcIi4vZm9ybXMvRUZfRm9ybVwiO1xuXG5kZWNsYXJlIHZhciAkO1xuXG5kZWNsYXJlIHZhciBhamF4VXJsIDogc3RyaW5nO1xuXG5pbXBvcnQge0VGX0lucHV0fSBmcm9tICcuL2lucHV0cy9FRl9JbnB1dCc7XG5cbmNsYXNzIEVGX0FkZFxue1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBCb2R5IG9mIHRoZSBwYWdlXG4gICAgICovXG4gICAgcHVibGljICRib2R5O1xuXG4gICAgLyoqXG4gICAgICpBbiBvYmplY3Qgb2YgYWxsIHRoZSBpbnB1dCB0ZW1wbGF0ZXMgY2FjaGVkIHRvIGF2b2lkIGxhdGVuY3lcbiAgICAgKi9cbiAgICBwdWJsaWMgdGVtcGxhdGVzIDogYW55ID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBhbGwgdGhlIGlucHV0cyBhdmFpbGFibGUgb24gdGhlIHBhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5wdXRzIDogRUZfSW5wdXRbXSA9IFtdO1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGF2YWlsYWJsZSBpbnB1dHNcbiAgICAgKi9cbiAgICBwdWJsaWMgYXZhaWxhYmxlSW5wdXRzIDoge30gPSB7fTtcblxuXG4gICAgLyoqXG4gICAgICogQWxsIHRoZSBhdmFpbGFibGUgaW5wdXRzXG4gICAgICovXG4gICAgcHVibGljIGF2YWlsYWJsZUZvcm1zIDoge30gPSB7fTtcblxuXG4gICAgLyoqXG4gICAgICogQWxsIHRoZSBkZWZhdWx0IGlucHV0IHR5cGVzLiBFeCA6IHVzZXJfcGFzcyA6IHBhc3N3b3JkXG4gICAgICovXG4gICAgcHVibGljIGRlZmF1bHRJbnB1dFR5cGVzIDoge307XG5cblxuICAgIHB1YmxpYyBmb3JtVHlwZSA6IEVGX0Zvcm07XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgZWRpdG9yIGlzIGluaXRcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNfaW5pdCA6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLiRib2R5ID0gJCgnYm9keScpO1xuXG4gICAgfVxuXG5cbiAgICBwdWJsaWMgaW5pdCgpIHtcblxuICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuXG4gICAgICAgIHRoaXMubG9hZCgpLnRoZW4oKGRhdGEpID0+IHt9KVxuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgLypcbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5tb3ZlJyxfbW92ZSk7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy51cCcsX3VwKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLmRvd24nLF9kb3duKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLnJlbW92ZW9wdGlvbicsX3JlbW92ZU9wdGlvbik7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5kdXBsaXF1ZXInLF9kdXBsaWNhdGUpOyovXG5cbiAgICAgICAgLy8gQWRkIGEgbmV3IGZpZWxkXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vZmYoJ2NsaWNrJywnYnV0dG9uW2RhdGEtYWN0aW9uPVwiYWRkXCJdJylcbiAgICAgICAgICAgIC5vbignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGRcIl0nLCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZElucHV0KCd0ZXh0Jyx7fSkudGhlbigoaW5wdXQgOiBFRl9JbnB1dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSwnZmllbGRzJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkUG9zc2libGVGaWVsZHMoKTtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pIH0pO1xuXG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9mZignY2xpY2snLCdzZWxlY3RbbmFtZT1cInNldHRpbmdzW3R5cGVdXCJdJylcbiAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWU9XCJzZXR0aW5nc1t0eXBlXVwiXScsKCRldmVudCA6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSAkKCRldmVudC50YXJnZXQpLnZhbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlRm9ybVR5cGUodHlwZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAvKlxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjbGljaycsJ2J1dHRvbltkYXRhLWFjdGlvbj1cImFkZC1vcHRpb25cIl0nLF9hZGRPcHRpb24pO1xuXG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWUkPVwiW2Zvcm0tdGF4b25vbXldXCJdJyxfY2hhbmdlVGF4b25vbXkpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsJ3NlbGVjdFtuYW1lPVwiZm9ybS1yZXNldC1hY3Rpb25cIl0nLF9jaGFuZ2VSZXNldEFjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICovXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBzaW5jZSAyLjAuMFxuICAgICAqXG4gICAgICogUmVvcmdhbmlzZSBhbGwgdGhlIGlucHV0cyBvbiB0aGUgcGFnZVxuICAgICAqL1xuICAgIHB1YmxpYyByZW9yZ2FuaXNlKCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG5cbiAgICAgICAgbGV0IGRmZCA9ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBFRl9BZGQubG9hZGluZyh0cnVlLCdmaWVsZHMnKTtcblxuXG4gICAgICAgIGxldCBpbnB1dHMgPSBbXTtcblxuICAgICAgICAkLmVhY2godGhpcy5pbnB1dHMsKGtleSxpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICBpbnB1dHMucHVzaChpbnB1dC52YWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsSW5wdXRzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cywwKS50aGVuKCgpID0+IHtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2tpd2knKTtcbiAgICAgICAgICAgIHRoaXMuYWRkUG9zc2libGVGaWVsZHMoKTtcblxuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ2ZpZWxkcycpO1xuXG4gICAgICAgICAgICBkZmQucmVzb2x2ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIHdoZW4gMiBpbnB1dHMgYXJlIG1vdmVkXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKiBAcGFyYW0gZGlyZWN0aW9uXG4gICAgICovXG4gICAgcHVibGljIG9uTW92ZShpbnB1dCA6IEVGX0lucHV0LGRpcmVjdGlvbiA6IHN0cmluZyA9ICd1cCcpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmlucHV0cy5pbmRleE9mKGlucHV0KTtcblxuICAgICAgICBsZXQgbmV3cG9zID0gZGlyZWN0aW9uID09ICd1cCcgPyBwb3NpdGlvbi0xIDogcG9zaXRpb24gKzE7XG5cbiAgICAgICAgaWYobmV3cG9zID09IC0xIHx8IG5ld3BvcyA9PSB0aGlzLmlucHV0cy5sZW5ndGggfHwgIXRoaXMuaW5wdXRzW25ld3Bvc10pIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zd2l0Y2gocG9zaXRpb24sbmV3cG9zKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogU3dpdGNoIDIgaW5wdXRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcG9zMVxuICAgICAqIEBwYXJhbSBwb3MyXG4gICAgICovXG4gICAgcHVibGljIHN3aXRjaChwb3MxIDogbnVtYmVyLCBwb3MyOiBudW1iZXIpXG4gICAge1xuICAgICAgICBsZXQgaW5wdXQxID0gdGhpcy5pbnB1dHNbcG9zMV07XG5cbiAgICAgICAgdGhpcy5pbnB1dHNbcG9zMV0gPSB0aGlzLmlucHV0c1twb3MyXTtcblxuICAgICAgICB0aGlzLmlucHV0c1twb3MyXSA9IGlucHV0MTtcblxuICAgICAgICB0aGlzLnJlb3JnYW5pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbGwgaW5wdXRzIGZyb20gdHJhY2tcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlQWxsSW5wdXRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmlucHV0cyA9IFtdO1xuICAgICAgICB0aGlzLiRib2R5LmZpbmQoJyNmbGQnKS5odG1sKCcnKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIG9uIGNsaWNrIG9uIHRoZSBkdXBsaWNhdGUgYnV0dG9uXG4gICAgICpcbiAgICAgKiBARXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBvbkR1cGxpY2F0ZShpbnB1dCA6IEVGX0lucHV0KSA6IGFueVxuICAgIHtcblxuICAgICAgICB0aGlzLmFkZElucHV0KGlucHV0LnZhbHVlLmF0dHJpYnV0ZXMudHlwZSxpbnB1dC52YWx1ZSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBFRl9BZGQuc3VjY2VzcyAgPSAnVGhlbSBpbnB1dCBoYXMgYmVlbiBkdXBsaWNhdGVkJztcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIGNoYW5nZSBvZiB0eXBlIGlzIHRyaWdnZXJlZFxuICAgICAqXG4gICAgICogQEV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgb25DaGFuZ2VUeXBlKGlucHV0IDogRUZfSW5wdXQpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmlucHV0cy5pbmRleE9mKGlucHV0KTtcblxuICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dC52YWx1ZTtcblxuICAgICAgICB0aGlzLmFkZElucHV0KHZhbHVlLmF0dHJpYnV0ZXMudHlwZSx2YWx1ZSxwb3NpdGlvbikudGhlbigoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgIGlucHV0Lm9wZW4oKTtcbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIG9uIGRlbGV0ZSBvZiBhbiBpbnB1dC5cbiAgICAgKlxuICAgICAqIFJlbW92ZSB0aGUgaW5wdXRcbiAgICAgKlxuICAgICAqIEBFdmVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIG9uRGVsZXRlKGlucHV0IDogRUZfSW5wdXQpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmlucHV0cy5pbmRleE9mKGlucHV0KTtcblxuICAgICAgICB0aGlzLmlucHV0cy5zcGxpY2UocG9zaXRpb24sMSk7XG5cbiAgICAgICAgdGhpcy5yZW9yZ2FuaXNlKCkudGhlbigoKSA9PiB7fSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEFkZCBhbiBpbnB1dCB0byB0aGUgZWRpdG9yXG4gICAgICovXG4gICAgcHVibGljIGFkZElucHV0KHR5cGUgOiBzdHJpbmcgPSAndGV4dCcsJGRhdGEscG9zaXRpb24gOiBudW1iZXJ8bnVsbCA9IG51bGwpIDogUHJvbWlzZTxFRl9JbnB1dD5cbiAgICB7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuXG4gICAgICAgIEVGX0FkZC5sb2FkaW5nKHRydWUsJ2ZpZWxkcycpO1xuXG4gICAgICAgIC8vIENsb3NlIGFsbCB0aGUgaW5wdXRzXG4gICAgICAgICQuZWFjaCh0aGlzLmlucHV0cywoa2V5IDogbnVtYmVyLCBpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICBpbnB1dC5jbG9zZSgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZ2V0SW5wdXQodHlwZSkudGhlbigoZGF0YSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgaW5wdXQgOiBFRl9JbnB1dDtcblxuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLmdlbmVyYXRlSW5wdXQodHlwZSk7XG5cbiAgICAgICAgICAgIGlucHV0LmluaXQoZGF0YSxwb3NpdGlvbiA/IHBvc2l0aW9uIDogdGhpcy5pbnB1dHMubGVuZ3RoLCRkYXRhLHBvc2l0aW9uKTtcblxuICAgICAgICAgICAgaW5wdXQub25EdXBsaWNhdGUgPSAoaW5wdXQgOiBFRl9JbnB1dCApID0+IHsgdGhpcy5vbkR1cGxpY2F0ZShpbnB1dCkgfTtcbiAgICAgICAgICAgIGlucHV0Lm9uQ2hhbmdlVHlwZSA9IChpbnB1dCA6IEVGX0lucHV0KSA9PiB7IHRoaXMub25DaGFuZ2VUeXBlKGlucHV0KSB9O1xuICAgICAgICAgICAgaW5wdXQub25EZWxldGUgPSAoaW5wdXQgOiBFRl9JbnB1dCkgPT4geyB0aGlzLm9uRGVsZXRlKGlucHV0KSB9O1xuICAgICAgICAgICAgaW5wdXQub25Nb3ZlID0gKGlucHV0OiAgRUZfSW5wdXQsIGFjdGlvbiA6IHN0cmluZykgPT4geyB0aGlzLm9uTW92ZShpbnB1dCxhY3Rpb24pIH07XG5cbiAgICAgICAgICAgIGlmKHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dHNbcG9zaXRpb25dID0gaW5wdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnB1c2goaW5wdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZmQucmVzb2x2ZShpbnB1dCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcblxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFNob3cgb3IgaGlkZSB0aGUgbG9hZGluZ3NcbiAgICAgKlxuICAgICAqIEBwYXJhbSBsb2FkaW5nXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBsb2FkaW5nKGxvYWRpbmcgOiBib29sZWFuID0gdHJ1ZSwkZWxlbWVudCA6IG51bGx8c3RyaW5nID0gbnVsbClcbiAgICB7XG4gICAgICAgIC8vIFNob3cgdGhlIHNwaW5uZXJcblxuICAgICAgICBzd2l0Y2ggKCRlbGVtZW50KSB7XG4gICAgICAgICAgICBjYXNlICdmaWVsZHMnIDpcbiAgICAgICAgICAgICAgICAkKCcjc3Bpbm5lci1maWVsZHMnKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd1dGlsaXR5JyA6XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItdXRpbGl0eScpLnRvZ2dsZShsb2FkaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItdXRpbGl0eScpLnRvZ2dsZShsb2FkaW5nKTtcbiAgICAgICAgICAgICAgICAkKCcjc3Bpbm5lci1maWVsZHMnKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogTG9hZCB0aGUgZm9ybSBkYXRhIGZyb20gdGhlIGJhY2sgb2ZmaWNlXG4gICAgICovXG4gICAgcHVibGljIGxvYWQoKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICAkLmdldEpTT04oYWpheFVybCwge1xuICAgICAgICAgICAgZm9ybV9pZCA6IEVGX0FkZC5nZXRQYXJhbWV0ZXIoJ3Bvc3QnKSxcbiAgICAgICAgICAgIGFjdGlvbjogJ0VGL2xvYWRfZm9ybV9kYXRhJ1xuICAgICAgICB9KS5zdWNjZXNzKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0aGUgZGF0YSBmb3IgYWxsIHRoZSBmb3JtXG4gICAgICAgICAgICB0aGlzLmFkZERhdGEoZGF0YS5kYXRhLmZvcm0pO1xuICAgICAgICAgICAgdGhpcy5hZGRGb3JtRGF0YShkYXRhLmRhdGEuZm9ybSk7XG5cblxuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVJbnB1dHMgPSBkYXRhLmRhdGEuaW5wdXRzO1xuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVGb3JtcyA9IGRhdGEuZGF0YS5mb3JtcztcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdElucHV0VHlwZXMgPSBkYXRhLmRhdGEuZGVmYXVsdF9pbnB1dHM7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0aGUgc3VibWl0IGRhdGFcbiAgICAgICAgICAgIGlmKGRhdGEuZGF0YS5mb3JtLmlucHV0cy5zdWJtaXQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3VibWl0ID0gZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdDtcbiAgICAgICAgICAgICAgICBkZWxldGUgZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdDtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFN1Ym1pdERhdGEoc3VibWl0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTG9hZCBhbGwgdGhlIGlucHV0c1xuICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGRhdGEuZGF0YS5mb3JtLmlucHV0cywwKS50aGVuKCgpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKHZhbHVlIDogRUZfSW5wdXQsa2V5IDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzW2tleV0uZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRSZXF1aXJlZEZpZWxkcyhkYXRhLmRhdGEuZm9ybS50eXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFBvc3NpYmxlRmllbGRzKCk7XG4gICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgIC8vIEkgc2VuZCBiYWNrIHRoZSBkYXRhXG4gICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG5cblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBBZGQgdGhlIGRhdGEgaW5zaWRlIHRoZSBmb3JtIDxodG1sPiBlbGVtZW50c1xuICAgICAqXG4gICAgICogQHBhcmFtICRmb3JtRGF0YVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhZGREYXRhKCRmb3JtRGF0YSA6IGFueSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgICQoJyNlZi1hZGQtbWFpbi1pbmZvJykuZmluZCgnW25hbWVePVwic2V0dGluZ3NcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxJbmZvcygkKGVsZW0pLCRmb3JtRGF0YSk7XG5cbiAgICAgICAgfSk7XG4gICAgICAgICQoJyNlZi1hZGQtbWFpbi1pbmZvJykuZmluZCgnW25hbWVePVwiYXR0cmlidXRlc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbEluZm9zKCQoZWxlbSksJGZvcm1EYXRhKTtcblxuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAZXZlbnQgOiBUaGUgPHNlbGVjdD4gZWxlbWVudCBmb3JtIHR5cGUgaXMgY2hhbmdlZFxuICAgICAqXG4gICAgICogVGhpcyBmdW5jdGlvbiB3aWxsIDpcbiAgICAgKiAtIEFkZCB0aGUgZm9ybSBkYXRhIHdpdGhpbiB0aGUgbmV3IGZvcm0gYW5kIGxvYWQgdGhlIHJpZ2h0IHRlbXBsYXRlXG4gICAgICogLSBMb2FkIHRoZSByZXF1aXJlZCBmaWVsZHMgb2YgdGhlIGZvcm1cbiAgICAgKiAtIExvYWQgdGhlIHBvc3NpYmxlIGZpZWxkcyBvZiB0aGUgZm9ybVxuICAgICAqXG4gICAgICogQHNpbmNlIDIuMC4wXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBjaGFuZ2VGb3JtVHlwZSh0eXBlKSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgRUZfQWRkLmxvYWRpbmcodHJ1ZSwndXRpbGl0eScpO1xuXG4gICAgICAgIGxldCAkZm9ybURhdGEgPSB0aGlzLmZvcm1UeXBlLnZhbHVlO1xuXG4gICAgICAgICRmb3JtRGF0YS50eXBlID0gdHlwZTtcblxuICAgICAgICB0aGlzLmFkZEZvcm1EYXRhKCRmb3JtRGF0YSk7XG4gICAgICAgIHRoaXMuYWRkUmVxdWlyZWRGaWVsZHMoJGZvcm1EYXRhLnR5cGUpO1xuICAgICAgICB0aGlzLmFkZFBvc3NpYmxlRmllbGRzKCk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIERpc3BsYXkgdGhlIGxpc3Qgb2YgcG9zc2libGUgZmllbGRzIGFjY29yZGluZyB0byB0aGUgdHlwZSBvZiBmb3JtIHNlbGVjdGVkLlxuICAgICAqXG4gICAgICogRXhlbXBsZSA6IFVzZXIgZm9ybSBoYXMgdGhlIGZvbGxvd2luZyBmaWVsZHMgYXZhaWxhYmxlIDpcbiAgICAgKlxuICAgICAqIC0gZmlyc3RfbmFtZVxuICAgICAqIC0gbGFzdF9uYW1lXG4gICAgICogLSBjb250ZW50XG4gICAgICpcbiAgICAgKiBUaGVzZSBmaWVsZHMgYXJlIG5vdCBtYW5kYXRvcnkgYnV0IGFyZSBhIHBsdXMgaW4gdGhlIGZvcm0gdHlwZS5cbiAgICAgKlxuICAgICAqIEZ1cnRoZXJtb3JlIHRoZXkgYXJlIGhhbmRsZWQgZGlmZmVyZW50bHkgdGhhbiBvdGhlciB0eXBlc1xuICAgICAqXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZFBvc3NpYmxlRmllbGRzKClcbiAgICB7XG5cbiAgICAgICAgbGV0IGN1cnJlbnQgPSB0aGlzLmF2YWlsYWJsZUZvcm1zW3RoaXMuZ2V0Rm9ybVR5cGUoKV07XG5cbiAgICAgICAgY29uc29sZS5sb2coY3VycmVudC5yZXF1aXJlZCk7XG4gICAgICAgIC8vIFNsaWNlIGlzIHVzZWQgaGVyZSB0byBjbG9uZSB0aGUgb2JqZWN0XG4gICAgICAgIGxldCBwb3NzaWJsZUZpZWxkcyA9IGN1cnJlbnQucG9zc2libGUuY29uY2F0KGN1cnJlbnQucmVxdWlyZWQpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHBvc3NpYmxlRmllbGRzKTtcblxuICAgICAgICBsZXQgdGVtcGxhdGUgPSB0aGlzLiRib2R5LmZpbmQoJyNwb3NzaWJsZS1maWVsZCcpLmh0bWwoKTtcblxuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuJGJvZHkuZmluZCgnI3Bvc3NpYmxlLWZpZWxkcycpO1xuXG4gICAgICAgIC8vIFJlc2V0IHRoZSBmaWVsZHMgZGlzcGxheWVkXG4gICAgICAgIGVsZW0uaHRtbCgnJyk7XG5cbiAgICAgICAgLy8gSSBkb24ndCBzaG93IHRoZSBpbnB1dHMgdGhhdCBhcmUgYWxyZWFkeSBpbiB0aGUgZm9ybVxuICAgICAgICB0aGlzLmlucHV0cy5mb3JFYWNoKChpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSBwb3NzaWJsZUZpZWxkcy5pbmRleE9mKGlucHV0Lm5hbWUpO1xuXG4gICAgICAgICAgICBpZihpbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgICAgIHBvc3NpYmxlRmllbGRzLnNwbGljZShpbmRleCwxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYocG9zc2libGVGaWVsZHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICQoJyNwb3NzaWJsZS1maWVsZHMtbGFiZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkKCcjcG9zc2libGUtZmllbGRzLWxhYmVsJykuc2hvdygpO1xuXG5cbiAgICAgICAgcG9zc2libGVGaWVsZHMuZm9yRWFjaCgoaW5wdXRfbmFtZSA6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgbGV0IF90ZW1wbGF0ZSA9ICQodGVtcGxhdGUpO1xuXG4gICAgICAgICAgICBfdGVtcGxhdGUuYXR0cignbmFtZScsaW5wdXRfbmFtZSk7XG4gICAgICAgICAgICBfdGVtcGxhdGUuaHRtbChpbnB1dF9uYW1lKTtcblxuICAgICAgICAgICAgZWxlbS5hcHBlbmQoX3RlbXBsYXRlKTtcblxuICAgICAgICAgICAgX3RlbXBsYXRlLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBpbnB1dCA9IHRoaXMuZ2V0QXZhaWxhYmxlSW5wdXREYXRhKGlucHV0X25hbWUpO1xuXG4gICAgICAgICAgICAgICAgaW5wdXQuYXR0cmlidXRlcy5uYW1lID0gaW5wdXRfbmFtZTtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWRkSW5wdXQoaW5wdXQuYXR0cmlidXRlcy50eXBlLGlucHV0KS50aGVuKChpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkUG9zc2libGVGaWVsZHMoKTtcbiAgICAgICAgICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ2ZpZWxkcycpO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5kaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIH0pXG5cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgdGhlIGZvcm0gZGF0YSBpbiB0aGUgZm9ybSB0eXBlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZEZvcm1EYXRhKCRmb3JtRGF0YSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIHRoaXMubG9hZEZvcm1UZW1wbGF0ZSgkZm9ybURhdGEudHlwZSkudGhlbigoJHRlbXBsYXRlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm1UeXBlID0gdGhpcy5nZW5lcmF0ZUZvcm0oJGZvcm1EYXRhLnR5cGUpO1xuXG4gICAgICAgICAgICB0aGlzLmZvcm1UeXBlLmluaXQoJHRlbXBsYXRlKTtcblxuICAgICAgICAgICAgJCgnI2VmLWFkZC10eXBlJykuZmluZCgnW25hbWVePVwic2V0dGluZ3NcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCd1dGlsaXR5Jyk7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBmb3JtVHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRSZXF1aXJlZEZpZWxkcyhmb3JtVHlwZSA6IHN0cmluZykgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgX3JlcXVpcmVkID0gdGhpcy5hdmFpbGFibGVGb3Jtc1tmb3JtVHlwZV0ucmVxdWlyZWQ7XG5cbiAgICAgICAgLy8gSGVyZSB3ZSBhZGQgdGhlIGNvbmNhdCB0byBjbG9uZSB0aGUgb2JqZWN0XG4gICAgICAgIGxldCByZXF1aXJlZCA9IF9yZXF1aXJlZC5jb25jYXQoW10pO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlVW50b3VjaGVkSW5wdXRzKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAkLmVhY2godGhpcy5pbnB1dHMsKGtleSA6IHN0cmluZywgaW5wdXQgOiBFRl9JbnB1dCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gJC5pbkFycmF5KGlucHV0LnZhbHVlLmF0dHJpYnV0ZXMubmFtZSxyZXF1aXJlZCk7XG4gICAgICAgICAgICAgICAgaWYoaW5kZXggIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IGlucHV0cyA9IFtdO1xuXG5cbiAgICAgICAgICAgICQuZWFjaChyZXF1aXJlZCwoa2V5IDogbnVtYmVyLGlucHV0TmFtZSA6IHN0cmluZykgPT4ge1xuXG4gICAgICAgICAgICAgICAgLy8gQWRkIHRoZSBkZWZhdWx0IHZhbHVlcyBpbnNpZGVcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXQgPSB0aGlzLmdldEF2YWlsYWJsZUlucHV0RGF0YShpbnB1dE5hbWUpO1xuXG4gICAgICAgICAgICAgICAgaW5wdXQuYXR0cmlidXRlcy5uYW1lID0gaW5wdXROYW1lO1xuXG4gICAgICAgICAgICAgICAgaW5wdXRzLnB1c2goaW5wdXQpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYoaW5wdXRzICYmIGlucHV0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cywgMCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIEVGX0FkZC5zdWNjZXNzID0gJ1RoZSBmaWVsZHMgJyArIHJlcXVpcmVkLmpvaW4oJywgJykgKyAnIGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgZm9ybSc7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFsbCB0aGUgaW5wdXRzIGFkZGVkIGJ5IGNoYW5naW5nIHRoZSB0eXBlIG9mIGZvcm1cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlVW50b3VjaGVkSW5wdXRzKCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIGxldCBpbnB1dHMgPSBbXTtcblxuICAgICAgICAkLmVhY2godGhpcy5pbnB1dHMsKGtleSA6IG51bWJlciwgaW5wdXQgOiBFRl9JbnB1dCkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoaW5wdXQuZGlydHkpIHtcbiAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChpbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzID0gaW5wdXRzO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJlb3JnYW5pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIHRoZSB0eXBlIG9mIGlucHV0IGFjY29yZGluZyB0byBpdHMgbmFtZVxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0TmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRBdmFpbGFibGVJbnB1dERhdGEoaW5wdXROYW1lIDogc3RyaW5nKSA6IGFueVxuICAgIHtcbiAgICAgICAgbGV0IGlucHV0O1xuXG4gICAgICAgIGxldCB0eXBlID0gdGhpcy5nZXREZWZhdWx0VHlwZUZyb21OYW1lKGlucHV0TmFtZSk7XG5cbiAgICAgICAgaWYodGhpcy5hdmFpbGFibGVJbnB1dHNbdHlwZV0pIHtcbiAgICAgICAgICAgIGlucHV0ID0gdGhpcy5hdmFpbGFibGVJbnB1dHNbdHlwZV0uZGF0YTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLmF2YWlsYWJsZUlucHV0c1sndGV4dCddLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJldHVybiB0aGUgZGVmYXVsdCB0eXBlIG9mIGEgZmllbGQgYWNjb3JkaW5nIHRvIGl0cyBuYW1lXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXREZWZhdWx0VHlwZUZyb21OYW1lKG5hbWUgOiBzdHJpbmcpIDogc3RyaW5nXG4gICAge1xuICAgICAgICAvLyBEZWZhdWx0IHR5cGVcbiAgICAgICAgbGV0IHR5cGUgPSAndGV4dCc7XG5cbiAgICAgICAgaWYodGhpcy5kZWZhdWx0SW5wdXRUeXBlc1tuYW1lXSkge1xuICAgICAgICAgICAgdHlwZSA9IHRoaXMuZGVmYXVsdElucHV0VHlwZXNbbmFtZV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBsb2FkRm9ybVRlbXBsYXRlKHR5cGUgOiBzdHJpbmcpIDogUHJvbWlzZTxhbnk+XG4gICAge1xuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG4gICAgICAgIGxldCBrZXkgPSAnZm9ybS0nICsgdHlwZTtcblxuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXNba2V5XSAmJiB0aGlzLnRlbXBsYXRlc1trZXldICE9IHVuZGVmaW5lZCAmJiB0aGlzLnRlbXBsYXRlc1trZXldICE9ICcnKSB7XG4gICAgICAgICAgICBkZmQucmVzb2x2ZSh0aGlzLnRlbXBsYXRlc1trZXldKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJC5nZXQoYWpheFVybCwge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdhY3Rpb25zJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA6IHR5cGUsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF90ZW1wbGF0ZSdcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW2tleV0gPSBkYXRhLmRhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBJIHNlbmQgYmFjayB0aGUgZGF0YVxuICAgICAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEuZGF0YSk7XG4gICAgICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEZpbGwgZm9ybSBkYXRhIHRoZSBpbmZvcyBpbnNpZGUgdGhlIGVkaXRvclxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtXG4gICAgICogQHBhcmFtICRmb3JtRGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBmaWxsSW5mb3MoJGVsZW0sJGZvcm1EYXRhKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCRlbGVtKTtcblxuICAgICAgICBpZigkZm9ybURhdGFbcHJvcC5hdHRyXSAmJiAkZm9ybURhdGFbcHJvcC5hdHRyXVtwcm9wLmlkXSkge1xuXG4gICAgICAgICAgICBFRl9JbnB1dC5zZXRJbnB1dFZhbHVlKCRlbGVtLCRmb3JtRGF0YVtwcm9wLmF0dHJdW3Byb3AuaWRdKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgdGhlIGRhdGEgaW5zaWRlIHRoZSBzdWJtaXQgYnV0dG9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3VibWl0XG4gICAgICovXG4gICAgcHJpdmF0ZSBhZGRTdWJtaXREYXRhKHN1Ym1pdCkgOiB2b2lkXG4gICAge1xuICAgICAgICBFRl9JbnB1dC5hZGREYXRhVG9FbGVtZW50KHRoaXMuJGJvZHkuZmluZCgnI2VmLWFkZC1zdWJtaXQnKSxzdWJtaXQpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBMb2FkIGFsbCB0aGUgaW5wdXRzIGZyb20gdGhlIGxpc3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dHNcbiAgICAgKiBAcGFyYW0gZGZkXG4gICAgICogQHBhcmFtIG9yZGVyXG4gICAgICovXG4gICAgcHJpdmF0ZSBsb2FkSW5wdXRzKGlucHV0cyA6IHsgYXR0cmlidXRlcyA6IHt0eXBlIDogc3RyaW5nIH19W10sb3JkZXIgOiBudW1iZXIsZGZkICA6IGFueSA9IG51bGwpIDogUHJvbWlzZTxhbnk+XG4gICAge1xuICAgICAgICBpZighZGZkKSB7XG4gICAgICAgICAgICBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhpbnB1dHMpO1xuXG4gICAgICAgIGxldCBrZXkgPSBrZXlzW29yZGVyXTtcblxuICAgICAgICBpZigha2V5IHx8ICFpbnB1dHMgfHwgIWlucHV0c1trZXldKXtcbiAgICAgICAgICAgIHRoaXMuaXNfaW5pdCA9IHRydWU7XG4gICAgICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSwnZmllbGRzJyk7XG4gICAgICAgICAgICBkZmQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5hZGRJbnB1dChpbnB1dHNba2V5XS5hdHRyaWJ1dGVzLnR5cGUsaW5wdXRzW2tleV0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9yZGVyKys7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cyxvcmRlcixkZmQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG4gICAgfVxuXG5cblxuICAgIHB1YmxpYyBnZW5lcmF0ZUZvcm0odHlwZSA6IHN0cmluZykgOiBFRl9Gb3JtXG4gICAge1xuXG4gICAgICAgIHJldHVybiBuZXcgRUZfRm9ybSgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgbGV0IGZvcm07XG5cbiAgICAgICAgIGlmKCF0aGlzLmF2YWlsYWJsZUZvcm1zW3R5cGVdKSB7XG4gICAgICAgICAgICB0eXBlID0gJ3Bvc3QnO1xuICAgICAgICB9XG5cbiAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnbG9naW4nIDpcbiAgICAgICAgICAgICAgICBmb3JtID0gbmV3IEVGX0Zvcm0oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Bvc3QnIDpcbiAgICAgICAgICAgICAgICBmb3JtID0gbmV3IEVGX0Zvcm0oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICAgaWYoIWZvcm0pIHtcbiAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgIHJldHVybiBmb3JtO1xuICAgICAgICAgKiovXG5cbiAgICB9XG5cblxuXG4gICAgcHVibGljIGdldEZvcm1UeXBlKCkgOiBzdHJpbmdcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLiRib2R5LmZpbmQoJypbbmFtZT1cInNldHRpbmdzW3R5cGVdXCJdJykudmFsKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZW5lcmF0ZUlucHV0KHR5cGUgOiBzdHJpbmcpIDogRUZfSW5wdXRcbiAgICB7XG4gICAgICAgIGxldCBpbnB1dDtcblxuICAgICAgICBpZighdGhpcy5hdmFpbGFibGVJbnB1dHNbdHlwZV0pIHtcbiAgICAgICAgICAgIHR5cGUgPSAndGV4dCc7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHN3aXRjaCh0eXBlKSB7XG4gICAgICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG5ldyBFRl9JbnB1dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIWlucHV0KSB7XG4gICAgICAgICAgICBpbnB1dCA9IG5ldyBFRl9JbnB1dCgpO1xuICAgICAgICB9XG5cblxuICAgICAgICByZXR1cm4gaW5wdXQ7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogTG9hZCB0aGUgaW5wdXQgdGVtcGxhdGUgZnJvbSB0aGUgQk9cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlIDogc3RyaW5nXG4gICAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0SW5wdXQodHlwZSA6IHN0cmluZyA9ICd0ZXh0JylcbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGVzW3R5cGVdICYmIHRoaXMudGVtcGxhdGVzW3R5cGVdICE9IHVuZGVmaW5lZCAmJiB0aGlzLnRlbXBsYXRlc1t0eXBlXSAhPSAnJykge1xuICAgICAgICAgICAgZGZkLnJlc29sdmUodGhpcy50ZW1wbGF0ZXNbdHlwZV0pO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkLmdldChhamF4VXJsLCB7XG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ2lucHV0cycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgOiB0eXBlLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ0VGL2xvYWRfdGVtcGxhdGUnXG4gICAgICAgICAgICB9KS5zdWNjZXNzKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlc1t0eXBlXSA9IGRhdGEuZGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIEkgc2VuZCBiYWNrIHRoZSBkYXRhXG4gICAgICAgICAgICAgICAgZGZkLnJlc29sdmUoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgIH0pLmVycm9yKHRoaXMuaGFuZGxlRXJyb3IpO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBIVFRQIEVycm9yc1xuICAgICAqXG4gICAgICogQFRPRE9cbiAgICAgKi9cbiAgICBwdWJsaWMgaGFuZGxlRXJyb3IoZGF0YSA6IHN0cmluZ3x7cmVzcG9uc2VKU09OIDoge2Vycm9yfX0pIDogdm9pZFxuICAgIHtcblxuICAgICAgICBsZXQgZXJyb3IgOiBzdHJpbmc7XG5cbiAgICAgICAgaWYodHlwZW9mIGRhdGEgIT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgZXJyb3IgPSBkYXRhLnJlc3BvbnNlSlNPTi5lcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIEVGX0FkZC5lcnJvciA9IGVycm9yO1xuICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSk7XG5cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBHZXQgdGhlIHVybCBwYXJhbWV0ZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbWV0ZXJcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UGFyYW1ldGVyKHBhcmFtZXRlciA6IHN0cmluZyk6YW55XG4gICAge1xuICAgICAgICB2YXIgcGFyYW1zX3N0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpO1xuXG4gICAgICAgIHZhciBwYXJhbXNfYXJyYXkgPSBwYXJhbXNfc3RyaW5nLnNwbGl0KCcmJyk7XG5cbiAgICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgICBmb3IodmFyIGkgPTA7aTxwYXJhbXNfYXJyYXkubGVuZ3RoO2krKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGUgPSBwYXJhbXNfYXJyYXlbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgICAgIG9ialtlWzBdXSA9IGVbMV1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYmpbcGFyYW1ldGVyXTtcbiAgICB9XG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBEaXNwbGF5IGFuIGVycm9yIG1lc3NhZ2UgdGhhdCB3aWxsIGZhZGUgb3V0IGluIDUgc2VjXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXJyb3JNZXNzYWdlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXQgZXJyb3IoZXJyb3JNZXNzYWdlIDogc3RyaW5nfGJvb2xlYW4pIHtcblxuICAgICAgICBFRl9BZGQuc2V0TWVzc2FnZSgnI2Vycm9yLW1lc3NhZ2UnLGVycm9yTWVzc2FnZSxmYWxzZSk7XG5cbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBEaXNwbGF5IGEgc3VjY2VzcyBtZXNzYWdlIHRoYXQgd2lsbCBmYWRlIG91dCBpbiA1IHNlY1xuICAgICAqXG4gICAgICogQHBhcmFtIHN1Y2Nlc3NNZXNzYWdlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXQgc3VjY2VzcyhzdWNjZXNzTWVzc2FnZTogc3RyaW5nfGJvb2xlYW4pIHtcblxuICAgICAgICBFRl9BZGQuc2V0TWVzc2FnZSgnI3N1Y2Nlc3MtbWVzc2FnZScsc3VjY2Vzc01lc3NhZ2UsZmFsc2UpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbWVudFxuICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICogQHBhcmFtIHBlcnNpc3QgOiBib29sZWFuLCBXZWl0aGVyIG9yIG5vdCB0aGUgbWVzc2FnZSBzaG91bGQgYmUgZGlzcGxheWVkIG9yIG5vdFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0TWVzc2FnZShlbGVtZW50IDogc3RyaW5nLG1lc3NhZ2UgOiBzdHJpbmd8Ym9vbGVhbiwgcGVyc2lzdCA6IGJvb2xlYW58bnVtYmVyID0gZmFsc2UpIDogdm9pZFxuICAgIHtcblxuICAgICAgICBpZihtZXNzYWdlKSB7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLnRleHQobWVzc2FnZSkuZmFkZUluKDIwMCk7XG5cbiAgICAgICAgICAgIGlmKCFwZXJzaXN0KSB7XG5cbiAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCBwZXJzaXN0IGlzIG5vdCBlcXVhbCB0byBmYWxzZVxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBwZXJzaXN0ID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgICAgICAgICBwZXJzaXN0ID0gNTAwMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRNZXNzYWdlKGVsZW1lbnQsJycpO1xuICAgICAgICAgICAgICAgIH0scGVyc2lzdCk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLmZhZGVPdXQoMjAwLCgpID0+IHtcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnRleHQoJycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxudmFyIEVGX2FkZCA9IG5ldyBFRl9BZGQoKTtcbkVGX2FkZC5pbml0KCk7Il19
