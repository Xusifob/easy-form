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
                        input.val(EF_Input.stripslashes(value));
                    }
                };
                //       discuss at: http://locutus.io/php/stripslashes/
                //      original by: Kevin van Zonneveld (http://kvz.io)
                //      improved by: Ates Goral (http://magnetiq.com)
                //      improved by: marrtins
                //      improved by: rezna
                //         fixed by: Mick@el
                //      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
                //      bugfixed by: Brett Zamir (http://brett-zamir.me)
                //         input by: Rick Waldron
                //         input by: Brant Messenger (http://www.brantmessenger.com/)
                // reimplemented by: Brett Zamir (http://brett-zamir.me)
                //        example 1: stripslashes('Kevin\'s code')
                //        returns 1: "Kevin's code"
                //        example 2: stripslashes('Kevin\\\'s code')
                //        returns 2: "Kevin\'s code"
                EF_Input.stripslashes = function(str) {
                    return (str + "").replace(/\\(.?)/g, function(s, n1) {
                        switch (n1) {
                          case "\\":
                            return "\\";

                          case "0":
                            return "\0";

                          case "":
                            return "";

                          default:
                            return n1;
                        }
                    });
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
                            input.open();
                            input.dirty = true;
                        });
                    });
                    this.$body.off("change", 'select[name="settings[type]"]').on("change", 'select[name="settings[type]"]', function($event) {
                        var type = $($event.target).val();
                        _this.changeFormType(type);
                    });
                    this.$body.off("change", 'input[data-action="advanced-mode"]').on("change", 'input[data-action="advanced-mode"]', function($event) {
                        _this.toggleAdvancedMode();
                    });
                };
                /**
                 *
                 */
                EF_Add.prototype.toggleAdvancedMode = function() {
                    var mode = this.$body.find('input[data-action="advanced-mode"]').is(":checked");
                    $("[advanced]").toggle(mode);
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
                        _this.toggleAdvancedMode();
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
                            _this.toggleAdvancedMode();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2lucHV0cy9FRl9JbnB1dC50cyIsImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2Zvcm1zL0VGX0Zvcm0udHMiLCJhc3NldHMvYWRtaW4vanMvc3JjL2FkZC9FRl9BZGQudHMiXSwibmFtZXMiOlsiRUZfSW5wdXQiLCJ0aGlzIiwiZGlydHkiLCJjb250YWluZXIiLCIkIiwicHJvdG90eXBlIiwiaW5pdCIsIiRlbGVtZW50IiwiaWQiLCIkZGF0YSIsInBvc2l0aW9uIiwicmVwbGFjZSIsImVsZW1lbnQiLCJvcHRpb25zRWxlbWVudCIsImZpbmQiLCJhcHBlbmQiLCJyZXBsYWNlV2l0aCIsInNldEV2ZW50cyIsImFkZERhdGEiLCJoYW5kbGVDaGVja2JveCIsImVhY2giLCJrZXkiLCJpbnB1dCIsIiRpbnB1dCIsInZhbHVlIiwiaXMiLCJuYW1lIiwiYXR0ciIsIiRoaWRkZW4iLCJvbiIsImFmdGVyIiwiX3RoaXMiLCJvZmYiLCJ0b2dnbGUiLCJvbkR1cGxpY2F0ZSIsIm9uQ2hhbmdlVHlwZSIsIm9uRGVsZXRlIiwib25Nb3ZlIiwiZWxlbSIsImhhc0NsYXNzIiwiY2xvc2UiLCJvcGVuIiwiYWRkRGF0YVRvRWxlbWVudCIsInByb3AiLCJnZXRJbnB1dFByb3BlcnRpZXMiLCJzZXRJbnB1dFZhbHVlIiwidmFsIiwic3RyaXBzbGFzaGVzIiwic3RyIiwicyIsIm4xIiwiZ2V0SW5wdXRWYWx1ZSIsImRhdGEiLCJzcGxpdCIsImhpZGUiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiaHRtbCIsInNob3ciLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImF0dHJpYnV0ZXMiLCJ0eXBlIiwiRUZfRm9ybSIsIkVGX0lucHV0XzEiLCJFRl9BZGQiLCJ0ZW1wbGF0ZXMiLCJpbnB1dHMiLCJhdmFpbGFibGVJbnB1dHMiLCJhdmFpbGFibGVGb3JtcyIsImlzX2luaXQiLCIkYm9keSIsImxvYWQiLCJ0aGVuIiwiYWRkSW5wdXQiLCJsb2FkaW5nIiwiYWRkUG9zc2libGVGaWVsZHMiLCIkZXZlbnQiLCJ0YXJnZXQiLCJjaGFuZ2VGb3JtVHlwZSIsInRvZ2dsZUFkdmFuY2VkTW9kZSIsIm1vZGUiLCJyZW9yZ2FuaXNlIiwiZGZkIiwiRGVmZXJyZWQiLCJwdXNoIiwicmVtb3ZlQWxsSW5wdXRzIiwibG9hZElucHV0cyIsImNvbnNvbGUiLCJsb2ciLCJyZXNvbHZlIiwicHJvbWlzZSIsImRpcmVjdGlvbiIsImluZGV4T2YiLCJuZXdwb3MiLCJsZW5ndGgiLCJzd2l0Y2giLCJwb3MxIiwicG9zMiIsImlucHV0MSIsInN1Y2Nlc3MiLCJzcGxpY2UiLCJnZXRJbnB1dCIsImdlbmVyYXRlSW5wdXQiLCJhY3Rpb24iLCJnZXRKU09OIiwiYWpheFVybCIsImZvcm1faWQiLCJnZXRQYXJhbWV0ZXIiLCJmb3JtIiwiYWRkRm9ybURhdGEiLCJmb3JtcyIsImRlZmF1bHRJbnB1dFR5cGVzIiwiZGVmYXVsdF9pbnB1dHMiLCJzdWJtaXQiLCJhZGRTdWJtaXREYXRhIiwiZm9yRWFjaCIsImFkZFJlcXVpcmVkRmllbGRzIiwiZXJyb3IiLCJoYW5kbGVFcnJvciIsIiRmb3JtRGF0YSIsImZpbGxJbmZvcyIsImZvcm1UeXBlIiwiY3VycmVudCIsImdldEZvcm1UeXBlIiwicmVxdWlyZWQiLCJwb3NzaWJsZUZpZWxkcyIsInBvc3NpYmxlIiwiY29uY2F0IiwidGVtcGxhdGUiLCJpbmRleCIsImlucHV0X25hbWUiLCJfdGVtcGxhdGUiLCJnZXRBdmFpbGFibGVJbnB1dERhdGEiLCJsb2FkRm9ybVRlbXBsYXRlIiwiJHRlbXBsYXRlIiwiZ2VuZXJhdGVGb3JtIiwiX3JlcXVpcmVkIiwicmVtb3ZlVW50b3VjaGVkSW5wdXRzIiwiaW5BcnJheSIsImlucHV0TmFtZSIsImpvaW4iLCJnZXREZWZhdWx0VHlwZUZyb21OYW1lIiwidW5kZWZpbmVkIiwiZ2V0IiwiJGVsZW0iLCJFRl9JbnB1dF8yIiwib3JkZXIiLCJrZXlzIiwiRUZfRm9ybV8xIiwicmVzcG9uc2VKU09OIiwicGFyYW1ldGVyIiwicGFyYW1zX3N0cmluZyIsIndpbmRvdyIsImxvY2F0aW9uIiwic2VhcmNoIiwic3Vic3RyIiwicGFyYW1zX2FycmF5Iiwib2JqIiwiaSIsImUiLCJlcnJvck1lc3NhZ2UiLCJzZXRNZXNzYWdlIiwic3VjY2Vzc01lc3NhZ2UiLCJtZXNzYWdlIiwicGVyc2lzdCIsInRleHQiLCJmYWRlSW4iLCJzZXRUaW1lb3V0IiwiZmFkZU91dCIsIkVGX2FkZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Z0JBeURJLFNBQUFBOzs7O29CQVhPQyxLQUFBQyxRQUFrQjtvQkFhckJELEtBQUtFLFlBQVlDLEVBQUU7Ozs7Ozs7OztnQkFZaEJKLFNBQUFLLFVBQUFDLE9BQVAsU0FBWUMsVUFBZ0JDLElBQVlDLE9BQVlDO29CQUFBLElBQUFBLGtCQUFBLEdBQUE7d0JBQUFBLFdBQUE7O29CQUVoRFQsS0FBS08sS0FBS0E7b0JBRVZELFdBQVdBLFNBQVNJLFFBQVEsY0FBYUgsS0FBRztvQkFDNUNELFdBQVdBLFNBQVNJLFFBQVEsWUFBV0g7b0JBRXZDUCxLQUFLVyxVQUFVUixFQUFFRztvQkFDakJOLEtBQUtZLGlCQUFpQlosS0FBS1csUUFBUUUsS0FBSztvQkFFeEMsSUFBRyxTQUFTSixVQUFVO3dCQUNsQlQsS0FBS0UsVUFBVVksT0FBT2QsS0FBS1c7MkJBQ3pCO3dCQUNGWCxLQUFLRSxVQUFVVyxLQUFLLFlBQVlKLFVBQVVNLFlBQVlmLEtBQUtXOztvQkFHL0RYLEtBQUtnQjtvQkFFTGhCLEtBQUtpQixRQUFRVDtvQkFFYlIsS0FBS2tCOzs7OztnQkFRRm5CLFNBQUFLLFVBQUFjLGlCQUFQO29CQUVJbEIsS0FBS1csUUFBUUUsS0FBSywwQkFBMEJNLEtBQUssU0FBQ0MsS0FBYUM7d0JBQzNELElBQUlDLFNBQVNuQixFQUFFa0I7d0JBRWYsSUFBSUUsUUFBUUQsT0FBT0UsR0FBRyxjQUFjLElBQUk7d0JBQ3hDLElBQUlDLE9BQU9ILE9BQU9JLEtBQUs7d0JBQ3ZCSixPQUFPSSxLQUFLLFFBQU87d0JB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ZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBFRl9JbnB1dFxue1xuXG4gICAgLyoqXG4gICAgICogQHZhciBzdHJpbmdcbiAgICAgKlxuICAgICAqIFRoZSB0eXBlIG9mIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdHlwZSA6IHN0cmluZyA9ICd0ZXh0JztcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgb2YgdGhlIGlucHV0XG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgZWxlbWVudCA6IGFueTtcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgZm9yIHRoZSBvcHRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgb3B0aW9uc0VsZW1lbnQgOiBhbnk7XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBpZCAocG9zaXRpb24pIG9mIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBpZCA6IG51bWJlcjtcblxuXG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgY29udGFpbmVyXG4gICAgICovXG4gICAgcHVibGljIGNvbnRhaW5lciA6IGFueTtcblxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIGZpZWxkIGhhcyBiZWVuIGNoYW5nZWQgb3Igbm90XG4gICAgICovXG4gICAgcHVibGljIGRpcnR5IDogYm9vbGVhbiA9IGZhbHNlO1xuXG5cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiBjYWxsZWQgb24gZHVwbGljYXRlXG4gICAgICovXG4gICAgcHVibGljIG9uRHVwbGljYXRlIDogYW55O1xuICAgIHB1YmxpYyBvbkNoYW5nZVR5cGUgOiBhbnk7XG4gICAgcHVibGljIG9uRGVsZXRlIDogYW55O1xuICAgIHB1YmxpYyBvbk1vdmUgOiBhbnk7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIgPSAkKCcjZmxkJyk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICogQHBhcmFtIGlkXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIDogbnVtYmVyXG4gICAgICovXG4gICAgcHVibGljIGluaXQoJGVsZW1lbnQgOiBhbnksIGlkIDogbnVtYmVyLCRkYXRhIDogYW55LHBvc2l0aW9uIDogbnVsbHxudW1iZXIgPSBudWxsKVxuICAgIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgICAgICRlbGVtZW50ID0gJGVsZW1lbnQucmVwbGFjZSgvZmllbGRVbklkL2csaWQrMSk7XG4gICAgICAgICRlbGVtZW50ID0gJGVsZW1lbnQucmVwbGFjZSgvZmllbGRJZC9nLGlkKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKCRlbGVtZW50KTtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudCA9IHRoaXMuZWxlbWVudC5maW5kKCcuZWYtdGFibGUnKTtcblxuICAgICAgICBpZihudWxsID09PSBwb3NpdGlvbikge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmZpbmQoJyNmaWVsZC0nICsgcG9zaXRpb24pLnJlcGxhY2VXaXRoKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuXG4gICAgICAgIHRoaXMuYWRkRGF0YSgkZGF0YSk7XG5cbiAgICAgICAgdGhpcy5oYW5kbGVDaGVja2JveCgpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGNoZWNrYm94cyB0byBsaW5rIHRoZW0gd2l0aCBhIGhpZGRlbiBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVDaGVja2JveCgpXG4gICAge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGlucHV0IDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGxldCAkaW5wdXQgPSAkKGlucHV0KTtcblxuICAgICAgICAgICAgbGV0IHZhbHVlID0gJGlucHV0LmlzKCc6Y2hlY2tlZCcpID8gMSA6IDA7XG4gICAgICAgICAgICBsZXQgbmFtZSA9ICRpbnB1dC5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgICAkaW5wdXQuYXR0cignbmFtZScsJycpO1xuXG4gICAgICAgICAgICBsZXQgJGhpZGRlbiA9ICQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cIicrIG5hbWUgKydcIiB2YWx1ZT1cIicrIHZhbHVlICsnXCI+Jyk7XG5cblxuICAgICAgICAgICAgJGlucHV0Lm9uKCdjaGFuZ2UnLCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSAkaW5wdXQuaXMoJzpjaGVja2VkJykgPyAxIDogMDtcbiAgICAgICAgICAgICAgICAkaGlkZGVuLmF0dHIoJ3ZhbHVlJyx2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGlucHV0LmFmdGVyKCRoaWRkZW4pXG5cbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFNldCBhbGwgdGhlIGV2ZW50cyBsaW5rZWQgdG8gdGhpcyBlbGVtZW50XG4gICAgICovXG4gICAgcHVibGljIHNldEV2ZW50cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cIm9wZW4tY2xvc2VcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7cmV0dXJuIHRoaXMudG9nZ2xlKCl9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cImR1cGxpY2F0ZVwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHt0aGlzLm9uRHVwbGljYXRlKHRoaXMpOyByZXR1cm4gZmFsc2U7fSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJjaGFuZ2UtdHlwZVwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHt0aGlzLm9uQ2hhbmdlVHlwZSh0aGlzKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwiZGVsZXRlXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3RoaXMub25EZWxldGUodGhpcyk7IHJldHVybiBmYWxzZTt9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cInVwXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3RoaXMub25Nb3ZlKHRoaXMsJ3VwJyk7IHJldHVybiBmYWxzZTt9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cImRvd25cIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7dGhpcy5vbk1vdmUodGhpcywnZG93bicpOyByZXR1cm4gZmFsc2U7fSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdzZWxlY3QsaW5wdXQsdGV4dGFyZWEnKS5vbignaW5wdXQnLCAoKSA9PiB7IHRoaXMuZGlydHkgPSB0cnVlO30pO1xuICAgIH1cblxuXG5cblxuICAgIC8qKlxuICAgICAqIENsb3NlIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgcHVibGljIHRvZ2dsZSgpOiBib29sZWFuXG4gICAge1xuXG4gICAgICAgIGxldCBlbGVtID0gdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cIm9wZW4tY2xvc2VcIl0nKTtcblxuICAgICAgICBpZigkKGVsZW0pLmhhc0NsYXNzKCdtaW5pZnknKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3BlbigpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEluc2VydCB0aGUgZGF0YSBpbiB0aGUgdGVtcGxhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBhZGREYXRhKCRkYXRhKSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgaWYoJGRhdGEuZGlydHkpIHtcbiAgICAgICAgICAgIHRoaXMuZGlydHkgPSAkZGF0YS5kaXJ0eTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgRUZfSW5wdXQuYWRkRGF0YVRvRWxlbWVudCh0aGlzLmVsZW1lbnQsJGRhdGEpXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqIEBwYXJhbSAkZGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYWRkRGF0YVRvRWxlbWVudCgkZWxlbWVudCA6IGFueSwgJGRhdGEgOiBhbnkpIDogdm9pZFxuICAgIHtcbiAgICAgICAgJGVsZW1lbnQuZmluZCgnW25hbWVePVwiZmllbGRcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkKGVsZW0pKTtcblxuICAgICAgICAgICAgaWYoJGRhdGFbcHJvcC5wcm9wXSAmJiAkZGF0YVtwcm9wLnByb3BdW3Byb3AubmFtZV0pIHtcbiAgICAgICAgICAgICAgICBFRl9JbnB1dC5zZXRJbnB1dFZhbHVlKCQoZWxlbSksJGRhdGFbcHJvcC5wcm9wXVtwcm9wLm5hbWVdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCBhIHZhbHVlIHRvIGFuIGlucHV0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKiBAcGFyYW0gdmFsdWVcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldElucHV0VmFsdWUoaW5wdXQgOiBhbnksIHZhbHVlIDogc3RyaW5nfGJvb2xlYW4pXG4gICAge1xuICAgICAgICBpZihpbnB1dC5pcygnOmNoZWNrYm94Jykpe1xuICAgICAgICAgICAgaWYoXCIxXCIgPT0gdmFsdWUgfHwgdmFsdWUgPT0gJ29uJykge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5wdXQucHJvcCgnY2hlY2tlZCcsdmFsdWUpO1xuICAgICAgICB9ZWxzZSBpZihpbnB1dC5pcygnc2VsZWN0Jykpe1xuICAgICAgICAgICAgaW5wdXQuZmluZCgnb3B0aW9uW3ZhbHVlPVwiJysgdmFsdWUgKydcIl0nKS5wcm9wKCdzZWxlY3RlZCcsdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGlucHV0LnZhbChFRl9JbnB1dC5zdHJpcHNsYXNoZXModmFsdWUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gICAgICAgZGlzY3VzcyBhdDogaHR0cDovL2xvY3V0dXMuaW8vcGhwL3N0cmlwc2xhc2hlcy9cbiAgICAvLyAgICAgIG9yaWdpbmFsIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va3Z6LmlvKVxuICAgIC8vICAgICAgaW1wcm92ZWQgYnk6IEF0ZXMgR29yYWwgKGh0dHA6Ly9tYWduZXRpcS5jb20pXG4gICAgLy8gICAgICBpbXByb3ZlZCBieTogbWFycnRpbnNcbiAgICAvLyAgICAgIGltcHJvdmVkIGJ5OiByZXpuYVxuICAgIC8vICAgICAgICAgZml4ZWQgYnk6IE1pY2tAZWxcbiAgICAvLyAgICAgIGJ1Z2ZpeGVkIGJ5OiBPbm5vIE1hcnNtYW4gKGh0dHBzOi8vdHdpdHRlci5jb20vb25ub21hcnNtYW4pXG4gICAgLy8gICAgICBidWdmaXhlZCBieTogQnJldHQgWmFtaXIgKGh0dHA6Ly9icmV0dC16YW1pci5tZSlcbiAgICAvLyAgICAgICAgIGlucHV0IGJ5OiBSaWNrIFdhbGRyb25cbiAgICAvLyAgICAgICAgIGlucHV0IGJ5OiBCcmFudCBNZXNzZW5nZXIgKGh0dHA6Ly93d3cuYnJhbnRtZXNzZW5nZXIuY29tLylcbiAgICAvLyByZWltcGxlbWVudGVkIGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxuICAgIC8vICAgICAgICBleGFtcGxlIDE6IHN0cmlwc2xhc2hlcygnS2V2aW5cXCdzIGNvZGUnKVxuICAgIC8vICAgICAgICByZXR1cm5zIDE6IFwiS2V2aW4ncyBjb2RlXCJcbiAgICAvLyAgICAgICAgZXhhbXBsZSAyOiBzdHJpcHNsYXNoZXMoJ0tldmluXFxcXFxcJ3MgY29kZScpXG4gICAgLy8gICAgICAgIHJldHVybnMgMjogXCJLZXZpblxcJ3MgY29kZVwiXG5cbiAgICBwdWJsaWMgc3RhdGljIHN0cmlwc2xhc2hlcyAoc3RyKSB7XG4gICAgICAgIHJldHVybiAoc3RyICsgJycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxcXCguPykvZywgZnVuY3Rpb24gKHMsIG4xKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChuMSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdcXFxcJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnXFxcXCdcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnMCc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ1xcdTAwMDAnXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEdldCB0aGUgdmFsdWUgb2YgYW4gaW5wdXRcbiAgICAgKlxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICogQHJldHVybnMgYW55XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnB1dFZhbHVlKGlucHV0IDogYW55KVxuICAgIHtcblxuICAgICAgICBpZih0eXBlb2YgaW5wdXQudmFsICE9ICdmdW5jdGlvbicpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cblxuICAgICAgICBpZihpbnB1dC5pcygnOmNoZWNrYm94Jykpe1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LmlzKCc6Y2hlY2tlZCcpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC52YWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJldHVybiBhbGwgdGhlIHByb3BlcnRpZXMgb2YgYW4gaW5wdXRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnB1dFByb3BlcnRpZXMoZWxlbSA6IGFueSkgOiB7YXR0cixpZCxwcm9wLG5hbWV9XG4gICAge1xuXG4gICAgICAgIGxldCBuYW1lID0gZWxlbS5hdHRyKCduYW1lJyk7XG5cbiAgICAgICAgbGV0IGRhdGEgPSBuYW1lLnNwbGl0KCdbJyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGF0dHIgOiBkYXRhWzBdLnJlcGxhY2UoJ10nLCcnKSxcbiAgICAgICAgICAgIGlkIDogZGF0YVsxXS5yZXBsYWNlKCddJywnJyksXG4gICAgICAgICAgICBwcm9wIDogZGF0YVsyXSA/IGRhdGFbMl0ucmVwbGFjZSgnXScsJycpIDogJycsXG4gICAgICAgICAgICBuYW1lIDogZGF0YVszXSA/IGRhdGFbM10ucmVwbGFjZSgnXScsJycpIDogJycsXG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBzaW5jZSAxLjEuMFxuICAgICAqXG4gICAgICogQGV2ZW50IDogQ2xpY2sgb24gbWluaWZ5IGJ1dHRvbiA6IGhpZGUgdGhlIG9wdGlvbnMgb2YgdGhlIGZpZWxkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBjbG9zZSgpIDogYm9vbGVhblxuICAgIHtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudC5oaWRlKDIwMCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcubWluaWZ5JylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWluaWZ5JylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnb3BlbicpXG4gICAgICAgICAgICAuaHRtbCgnKycpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHNpbmNlIDEuMS4wXG4gICAgICpcbiAgICAgKiBPcGVuIGEgZmllbGRcbiAgICAgKlxuICAgICAqIEBldmVudCA6IENsaWNrIG9uIG9wZW4gYnV0dG9uLCBzaG93IHRoZSBmaWVsZCBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBvcGVuKCkgOiBib29sZWFuXG4gICAge1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50LnNob3coMjAwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5vcGVuJylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnb3BlbicpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ21pbmlmeScpXG4gICAgICAgICAgICAuaHRtbCgnLScpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIHRoZSB2YWx1ZSBvZiBhbGwgdGhlIGlucHV0cyBpbiB0aGUgZmllbGRcbiAgICAgKlxuICAgICAqL1xuICAgIGdldCB2YWx1ZSgpOiBhbnkge1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IHtcbiAgICAgICAgICAgIGRpcnR5IDogdGhpcy5kaXJ0eSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW25hbWVePVwiZmllbGRcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsaW5wdXQgOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJChpbnB1dCkpO1xuICAgICAgICAgICAgbGV0IHZhbCA9IEVGX0lucHV0LmdldElucHV0VmFsdWUoJChpbnB1dCkpO1xuXG4gICAgICAgICAgICBpZihwcm9wLnByb3AgJiYgIXZhbHVlW3Byb3AucHJvcF0gJiYgcHJvcC5uYW1lKXtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLnByb3BdID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHZhbHVlW3Byb3AucHJvcF0pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLnByb3BdW3Byb3AubmFtZV0gPSB2YWw7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5wcm9wXSA9IHZhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICB9XG5cblxuXG4gICAgcHVibGljIGdldCBuYW1lKClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLmF0dHJpYnV0ZXMubmFtZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IG5hbWUobmFtZSA6IHN0cmluZylcbiAgICB7XG4gICAgICAgIHRoaXMudmFsdWUuYXR0cmlidXRlcy5uYW1lID0gbmFtZTtcbiAgICB9XG5cbn0iLCJpbXBvcnQge0VGX0lucHV0fSBmcm9tIFwiLi4vaW5wdXRzL0VGX0lucHV0XCI7XG5cbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBFRl9Gb3JtIHtcblxuICAgIC8qKlxuICAgICAqIEB2YXIgc3RyaW5nXG4gICAgICpcbiAgICAgKiBUaGUgdHlwZSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHR5cGU6IHN0cmluZyA9ICd0ZXh0JztcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgb2YgdGhlIGlucHV0XG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgZWxlbWVudDogYW55O1xuXG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgY29udGFpbmVyXG4gICAgICovXG4gICAgcHVibGljIGNvbnRhaW5lciA6IGFueTtcblxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gJCgnI3V0aWxpdGllcycpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdCgkZWxlbWVudCA6IGFueSlcbiAgICB7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJCgkZWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuaHRtbCh0aGlzLmVsZW1lbnQpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gdGhlIHZhbHVlIG9mIGFsbCB0aGUgaW5wdXRzIGluIHRoZSBmaWVsZFxuICAgICAqXG4gICAgICovXG4gICAgZ2V0IHZhbHVlKCk6IGFueSB7XG5cbiAgICAgICAgbGV0IHZhbHVlID0ge307XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tuYW1lXj1cInNldHRpbmdzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGlucHV0IDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoaW5wdXQpKTtcbiAgICAgICAgICAgIGxldCB2YWwgPSBFRl9JbnB1dC5nZXRJbnB1dFZhbHVlKCQoaW5wdXQpKTtcblxuICAgICAgICAgICAgaWYocHJvcC5hdHRyICYmICF2YWx1ZVtwcm9wLmF0dHJdICYmIHByb3AuaWQpe1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AuYXR0cl0gPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodmFsdWVbcHJvcC5hdHRyXSkge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AuYXR0cl1bcHJvcC5pZF0gPSB2YWw7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5hdHRyXSA9IHZhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgIH1cblxuXG5cblxuXG59IiwiaW1wb3J0IHtFRl9Gb3JtfSBmcm9tIFwiLi9mb3Jtcy9FRl9Gb3JtXCI7XG5cbmRlY2xhcmUgdmFyICQ7XG5cbmRlY2xhcmUgdmFyIGFqYXhVcmwgOiBzdHJpbmc7XG5cbmltcG9ydCB7RUZfSW5wdXR9IGZyb20gJy4vaW5wdXRzL0VGX0lucHV0JztcblxuY2xhc3MgRUZfQWRkXG57XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBIVE1MIEJvZHkgb2YgdGhlIHBhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgJGJvZHk7XG5cbiAgICAvKipcbiAgICAgKkFuIG9iamVjdCBvZiBhbGwgdGhlIGlucHV0IHRlbXBsYXRlcyBjYWNoZWQgdG8gYXZvaWQgbGF0ZW5jeVxuICAgICAqL1xuICAgIHB1YmxpYyB0ZW1wbGF0ZXMgOiBhbnkgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIGFsbCB0aGUgaW5wdXRzIGF2YWlsYWJsZSBvbiB0aGUgcGFnZVxuICAgICAqL1xuICAgIHB1YmxpYyBpbnB1dHMgOiBFRl9JbnB1dFtdID0gW107XG5cblxuICAgIC8qKlxuICAgICAqIEFsbCB0aGUgYXZhaWxhYmxlIGlucHV0c1xuICAgICAqL1xuICAgIHB1YmxpYyBhdmFpbGFibGVJbnB1dHMgOiB7fSA9IHt9O1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGF2YWlsYWJsZSBpbnB1dHNcbiAgICAgKi9cbiAgICBwdWJsaWMgYXZhaWxhYmxlRm9ybXMgOiB7fSA9IHt9O1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGRlZmF1bHQgaW5wdXQgdHlwZXMuIEV4IDogdXNlcl9wYXNzIDogcGFzc3dvcmRcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVmYXVsdElucHV0VHlwZXMgOiB7fTtcblxuXG4gICAgcHVibGljIGZvcm1UeXBlIDogRUZfRm9ybTtcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBlZGl0b3IgaXMgaW5pdFxuICAgICAqL1xuICAgIHB1YmxpYyBpc19pbml0IDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuJGJvZHkgPSAkKCdib2R5Jyk7XG5cbiAgICB9XG5cblxuICAgIHB1YmxpYyBpbml0KCkge1xuXG4gICAgICAgIHRoaXMuc2V0RXZlbnRzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkKCkudGhlbigoZGF0YSkgPT4ge30pXG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICAvKlxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLm1vdmUnLF9tb3ZlKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLnVwJyxfdXApO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcuZG93bicsX2Rvd24pO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcucmVtb3Zlb3B0aW9uJyxfcmVtb3ZlT3B0aW9uKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLmR1cGxpcXVlcicsX2R1cGxpY2F0ZSk7Ki9cblxuICAgICAgICAvLyBBZGQgYSBuZXcgZmllbGRcbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9mZignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGRcIl0nKVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJ2J1dHRvbltkYXRhLWFjdGlvbj1cImFkZFwiXScsKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkSW5wdXQoJ3RleHQnLHt9KS50aGVuKChpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRQb3NzaWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5vcGVuKCk7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KSB9KTtcbiBcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub2ZmKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cInNldHRpbmdzW3R5cGVdXCJdJylcbiAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWU9XCJzZXR0aW5nc1t0eXBlXVwiXScsKCRldmVudCA6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSAkKCRldmVudC50YXJnZXQpLnZhbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlRm9ybVR5cGUodHlwZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub2ZmKCdjaGFuZ2UnLCdpbnB1dFtkYXRhLWFjdGlvbj1cImFkdmFuY2VkLW1vZGVcIl0nKVxuICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdpbnB1dFtkYXRhLWFjdGlvbj1cImFkdmFuY2VkLW1vZGVcIl0nLCgkZXZlbnQgOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlQWR2YW5jZWRNb2RlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAvKlxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjbGljaycsJ2J1dHRvbltkYXRhLWFjdGlvbj1cImFkZC1vcHRpb25cIl0nLF9hZGRPcHRpb24pO1xuXG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWUkPVwiW2Zvcm0tdGF4b25vbXldXCJdJyxfY2hhbmdlVGF4b25vbXkpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsJ3NlbGVjdFtuYW1lPVwiZm9ybS1yZXNldC1hY3Rpb25cIl0nLF9jaGFuZ2VSZXNldEFjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICovXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGVBZHZhbmNlZE1vZGUoKVxuICAgIHtcbiAgICAgICAgbGV0IG1vZGUgPSB0aGlzLiRib2R5LmZpbmQoJ2lucHV0W2RhdGEtYWN0aW9uPVwiYWR2YW5jZWQtbW9kZVwiXScpLmlzKCc6Y2hlY2tlZCcpO1xuXG4gICAgICAgICQoJ1thZHZhbmNlZF0nKS50b2dnbGUobW9kZSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBzaW5jZSAyLjAuMFxuICAgICAqXG4gICAgICogUmVvcmdhbmlzZSBhbGwgdGhlIGlucHV0cyBvbiB0aGUgcGFnZVxuICAgICAqL1xuICAgIHB1YmxpYyByZW9yZ2FuaXNlKCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG5cbiAgICAgICAgbGV0IGRmZCA9ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBFRl9BZGQubG9hZGluZyh0cnVlLCdmaWVsZHMnKTtcblxuXG4gICAgICAgIGxldCBpbnB1dHMgPSBbXTtcblxuICAgICAgICAkLmVhY2godGhpcy5pbnB1dHMsKGtleSxpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICBpbnB1dHMucHVzaChpbnB1dC52YWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsSW5wdXRzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cywwKS50aGVuKCgpID0+IHtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2tpd2knKTtcbiAgICAgICAgICAgIHRoaXMuYWRkUG9zc2libGVGaWVsZHMoKTtcblxuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ2ZpZWxkcycpO1xuXG4gICAgICAgICAgICBkZmQucmVzb2x2ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIHdoZW4gMiBpbnB1dHMgYXJlIG1vdmVkXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKiBAcGFyYW0gZGlyZWN0aW9uXG4gICAgICovXG4gICAgcHVibGljIG9uTW92ZShpbnB1dCA6IEVGX0lucHV0LGRpcmVjdGlvbiA6IHN0cmluZyA9ICd1cCcpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmlucHV0cy5pbmRleE9mKGlucHV0KTtcblxuICAgICAgICBsZXQgbmV3cG9zID0gZGlyZWN0aW9uID09ICd1cCcgPyBwb3NpdGlvbi0xIDogcG9zaXRpb24gKzE7XG5cbiAgICAgICAgaWYobmV3cG9zID09IC0xIHx8IG5ld3BvcyA9PSB0aGlzLmlucHV0cy5sZW5ndGggfHwgIXRoaXMuaW5wdXRzW25ld3Bvc10pIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zd2l0Y2gocG9zaXRpb24sbmV3cG9zKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogU3dpdGNoIDIgaW5wdXRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcG9zMVxuICAgICAqIEBwYXJhbSBwb3MyXG4gICAgICovXG4gICAgcHVibGljIHN3aXRjaChwb3MxIDogbnVtYmVyLCBwb3MyOiBudW1iZXIpXG4gICAge1xuICAgICAgICBsZXQgaW5wdXQxID0gdGhpcy5pbnB1dHNbcG9zMV07XG5cbiAgICAgICAgdGhpcy5pbnB1dHNbcG9zMV0gPSB0aGlzLmlucHV0c1twb3MyXTtcblxuICAgICAgICB0aGlzLmlucHV0c1twb3MyXSA9IGlucHV0MTtcblxuICAgICAgICB0aGlzLnJlb3JnYW5pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbGwgaW5wdXRzIGZyb20gdHJhY2tcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlQWxsSW5wdXRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmlucHV0cyA9IFtdO1xuICAgICAgICB0aGlzLiRib2R5LmZpbmQoJyNmbGQnKS5odG1sKCcnKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIG9uIGNsaWNrIG9uIHRoZSBkdXBsaWNhdGUgYnV0dG9uXG4gICAgICpcbiAgICAgKiBARXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBvbkR1cGxpY2F0ZShpbnB1dCA6IEVGX0lucHV0KSA6IGFueVxuICAgIHtcblxuICAgICAgICB0aGlzLmFkZElucHV0KGlucHV0LnZhbHVlLmF0dHJpYnV0ZXMudHlwZSxpbnB1dC52YWx1ZSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBFRl9BZGQuc3VjY2VzcyAgPSAnVGhlbSBpbnB1dCBoYXMgYmVlbiBkdXBsaWNhdGVkJztcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIGNoYW5nZSBvZiB0eXBlIGlzIHRyaWdnZXJlZFxuICAgICAqXG4gICAgICogQEV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgb25DaGFuZ2VUeXBlKGlucHV0IDogRUZfSW5wdXQpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmlucHV0cy5pbmRleE9mKGlucHV0KTtcblxuICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dC52YWx1ZTtcblxuICAgICAgICB0aGlzLmFkZElucHV0KHZhbHVlLmF0dHJpYnV0ZXMudHlwZSx2YWx1ZSxwb3NpdGlvbikudGhlbigoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgIGlucHV0Lm9wZW4oKTtcbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIG9uIGRlbGV0ZSBvZiBhbiBpbnB1dC5cbiAgICAgKlxuICAgICAqIFJlbW92ZSB0aGUgaW5wdXRcbiAgICAgKlxuICAgICAqIEBFdmVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIG9uRGVsZXRlKGlucHV0IDogRUZfSW5wdXQpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmlucHV0cy5pbmRleE9mKGlucHV0KTtcblxuICAgICAgICB0aGlzLmlucHV0cy5zcGxpY2UocG9zaXRpb24sMSk7XG5cbiAgICAgICAgdGhpcy5yZW9yZ2FuaXNlKCkudGhlbigoKSA9PiB7fSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEFkZCBhbiBpbnB1dCB0byB0aGUgZWRpdG9yXG4gICAgICovXG4gICAgcHVibGljIGFkZElucHV0KHR5cGUgOiBzdHJpbmcgPSAndGV4dCcsJGRhdGEscG9zaXRpb24gOiBudW1iZXJ8bnVsbCA9IG51bGwpIDogUHJvbWlzZTxFRl9JbnB1dD5cbiAgICB7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuXG4gICAgICAgIEVGX0FkZC5sb2FkaW5nKHRydWUsJ2ZpZWxkcycpO1xuXG4gICAgICAgIC8vIENsb3NlIGFsbCB0aGUgaW5wdXRzXG4gICAgICAgICQuZWFjaCh0aGlzLmlucHV0cywoa2V5IDogbnVtYmVyLCBpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICBpbnB1dC5jbG9zZSgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZ2V0SW5wdXQodHlwZSkudGhlbigoZGF0YSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgaW5wdXQgOiBFRl9JbnB1dDtcblxuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLmdlbmVyYXRlSW5wdXQodHlwZSk7XG5cbiAgICAgICAgICAgIGlucHV0LmluaXQoZGF0YSxwb3NpdGlvbiA/IHBvc2l0aW9uIDogdGhpcy5pbnB1dHMubGVuZ3RoLCRkYXRhLHBvc2l0aW9uKTtcblxuICAgICAgICAgICAgaW5wdXQub25EdXBsaWNhdGUgPSAoaW5wdXQgOiBFRl9JbnB1dCApID0+IHsgdGhpcy5vbkR1cGxpY2F0ZShpbnB1dCkgfTtcbiAgICAgICAgICAgIGlucHV0Lm9uQ2hhbmdlVHlwZSA9IChpbnB1dCA6IEVGX0lucHV0KSA9PiB7IHRoaXMub25DaGFuZ2VUeXBlKGlucHV0KSB9O1xuICAgICAgICAgICAgaW5wdXQub25EZWxldGUgPSAoaW5wdXQgOiBFRl9JbnB1dCkgPT4geyB0aGlzLm9uRGVsZXRlKGlucHV0KSB9O1xuICAgICAgICAgICAgaW5wdXQub25Nb3ZlID0gKGlucHV0OiAgRUZfSW5wdXQsIGFjdGlvbiA6IHN0cmluZykgPT4geyB0aGlzLm9uTW92ZShpbnB1dCxhY3Rpb24pIH07XG5cbiAgICAgICAgICAgIGlmKHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dHNbcG9zaXRpb25dID0gaW5wdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnB1c2goaW5wdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUFkdmFuY2VkTW9kZSgpO1xuXG4gICAgICAgICAgICBkZmQucmVzb2x2ZShpbnB1dCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcblxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFNob3cgb3IgaGlkZSB0aGUgbG9hZGluZ3NcbiAgICAgKlxuICAgICAqIEBwYXJhbSBsb2FkaW5nXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBsb2FkaW5nKGxvYWRpbmcgOiBib29sZWFuID0gdHJ1ZSwkZWxlbWVudCA6IG51bGx8c3RyaW5nID0gbnVsbClcbiAgICB7XG4gICAgICAgIC8vIFNob3cgdGhlIHNwaW5uZXJcblxuICAgICAgICBzd2l0Y2ggKCRlbGVtZW50KSB7XG4gICAgICAgICAgICBjYXNlICdmaWVsZHMnIDpcbiAgICAgICAgICAgICAgICAkKCcjc3Bpbm5lci1maWVsZHMnKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd1dGlsaXR5JyA6XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItdXRpbGl0eScpLnRvZ2dsZShsb2FkaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItdXRpbGl0eScpLnRvZ2dsZShsb2FkaW5nKTtcbiAgICAgICAgICAgICAgICAkKCcjc3Bpbm5lci1maWVsZHMnKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogTG9hZCB0aGUgZm9ybSBkYXRhIGZyb20gdGhlIGJhY2sgb2ZmaWNlXG4gICAgICovXG4gICAgcHVibGljIGxvYWQoKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICAkLmdldEpTT04oYWpheFVybCwge1xuICAgICAgICAgICAgZm9ybV9pZCA6IEVGX0FkZC5nZXRQYXJhbWV0ZXIoJ3Bvc3QnKSxcbiAgICAgICAgICAgIGFjdGlvbjogJ0VGL2xvYWRfZm9ybV9kYXRhJ1xuICAgICAgICB9KS5zdWNjZXNzKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0aGUgZGF0YSBmb3IgYWxsIHRoZSBmb3JtXG4gICAgICAgICAgICB0aGlzLmFkZERhdGEoZGF0YS5kYXRhLmZvcm0pO1xuICAgICAgICAgICAgdGhpcy5hZGRGb3JtRGF0YShkYXRhLmRhdGEuZm9ybSk7XG5cblxuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVJbnB1dHMgPSBkYXRhLmRhdGEuaW5wdXRzO1xuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVGb3JtcyA9IGRhdGEuZGF0YS5mb3JtcztcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdElucHV0VHlwZXMgPSBkYXRhLmRhdGEuZGVmYXVsdF9pbnB1dHM7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0aGUgc3VibWl0IGRhdGFcbiAgICAgICAgICAgIGlmKGRhdGEuZGF0YS5mb3JtLmlucHV0cy5zdWJtaXQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3VibWl0ID0gZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdDtcbiAgICAgICAgICAgICAgICBkZWxldGUgZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdDtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFN1Ym1pdERhdGEoc3VibWl0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTG9hZCBhbGwgdGhlIGlucHV0c1xuICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGRhdGEuZGF0YS5mb3JtLmlucHV0cywwKS50aGVuKCgpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKHZhbHVlIDogRUZfSW5wdXQsa2V5IDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzW2tleV0uZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRSZXF1aXJlZEZpZWxkcyhkYXRhLmRhdGEuZm9ybS50eXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFBvc3NpYmxlRmllbGRzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVBZHZhbmNlZE1vZGUoKTtcbiAgICAgICAgICAgIH0pO1xuXG5cblxuICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgZGF0YSBpbnNpZGUgdGhlIGZvcm0gPGh0bWw+IGVsZW1lbnRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZERhdGEoJGZvcm1EYXRhIDogYW55KSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbEluZm9zKCQoZWxlbSksJGZvcm1EYXRhKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJhdHRyaWJ1dGVzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBldmVudCA6IFRoZSA8c2VsZWN0PiBlbGVtZW50IGZvcm0gdHlwZSBpcyBjaGFuZ2VkXG4gICAgICpcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgOlxuICAgICAqIC0gQWRkIHRoZSBmb3JtIGRhdGEgd2l0aGluIHRoZSBuZXcgZm9ybSBhbmQgbG9hZCB0aGUgcmlnaHQgdGVtcGxhdGVcbiAgICAgKiAtIExvYWQgdGhlIHJlcXVpcmVkIGZpZWxkcyBvZiB0aGUgZm9ybVxuICAgICAqIC0gTG9hZCB0aGUgcG9zc2libGUgZmllbGRzIG9mIHRoZSBmb3JtXG4gICAgICpcbiAgICAgKiBAc2luY2UgMi4wLjBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNoYW5nZUZvcm1UeXBlKHR5cGUpIDogdm9pZFxuICAgIHtcblxuICAgICAgICBFRl9BZGQubG9hZGluZyh0cnVlLCd1dGlsaXR5Jyk7XG5cbiAgICAgICAgbGV0ICRmb3JtRGF0YSA9IHRoaXMuZm9ybVR5cGUudmFsdWU7XG5cbiAgICAgICAgJGZvcm1EYXRhLnR5cGUgPSB0eXBlO1xuXG4gICAgICAgIHRoaXMuYWRkRm9ybURhdGEoJGZvcm1EYXRhKTtcbiAgICAgICAgdGhpcy5hZGRSZXF1aXJlZEZpZWxkcygkZm9ybURhdGEudHlwZSk7XG4gICAgICAgIHRoaXMuYWRkUG9zc2libGVGaWVsZHMoKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogRGlzcGxheSB0aGUgbGlzdCBvZiBwb3NzaWJsZSBmaWVsZHMgYWNjb3JkaW5nIHRvIHRoZSB0eXBlIG9mIGZvcm0gc2VsZWN0ZWQuXG4gICAgICpcbiAgICAgKiBFeGVtcGxlIDogVXNlciBmb3JtIGhhcyB0aGUgZm9sbG93aW5nIGZpZWxkcyBhdmFpbGFibGUgOlxuICAgICAqXG4gICAgICogLSBmaXJzdF9uYW1lXG4gICAgICogLSBsYXN0X25hbWVcbiAgICAgKiAtIGNvbnRlbnRcbiAgICAgKlxuICAgICAqIFRoZXNlIGZpZWxkcyBhcmUgbm90IG1hbmRhdG9yeSBidXQgYXJlIGEgcGx1cyBpbiB0aGUgZm9ybSB0eXBlLlxuICAgICAqXG4gICAgICogRnVydGhlcm1vcmUgdGhleSBhcmUgaGFuZGxlZCBkaWZmZXJlbnRseSB0aGFuIG90aGVyIHR5cGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYWRkUG9zc2libGVGaWVsZHMoKVxuICAgIHtcblxuICAgICAgICBsZXQgY3VycmVudCA9IHRoaXMuYXZhaWxhYmxlRm9ybXNbdGhpcy5nZXRGb3JtVHlwZSgpXTtcblxuICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50LnJlcXVpcmVkKTtcbiAgICAgICAgLy8gU2xpY2UgaXMgdXNlZCBoZXJlIHRvIGNsb25lIHRoZSBvYmplY3RcbiAgICAgICAgbGV0IHBvc3NpYmxlRmllbGRzID0gY3VycmVudC5wb3NzaWJsZS5jb25jYXQoY3VycmVudC5yZXF1aXJlZCk7XG5cbiAgICAgICAgY29uc29sZS5sb2cocG9zc2libGVGaWVsZHMpO1xuXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMuJGJvZHkuZmluZCgnI3Bvc3NpYmxlLWZpZWxkJykuaHRtbCgpO1xuXG4gICAgICAgIGxldCBlbGVtID0gdGhpcy4kYm9keS5maW5kKCcjcG9zc2libGUtZmllbGRzJyk7XG5cbiAgICAgICAgLy8gUmVzZXQgdGhlIGZpZWxkcyBkaXNwbGF5ZWRcbiAgICAgICAgZWxlbS5odG1sKCcnKTtcblxuICAgICAgICAvLyBJIGRvbid0IHNob3cgdGhlIGlucHV0cyB0aGF0IGFyZSBhbHJlYWR5IGluIHRoZSBmb3JtXG4gICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHBvc3NpYmxlRmllbGRzLmluZGV4T2YoaW5wdXQubmFtZSk7XG5cbiAgICAgICAgICAgIGlmKGluZGV4ICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgcG9zc2libGVGaWVsZHMuc3BsaWNlKGluZGV4LDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZihwb3NzaWJsZUZpZWxkcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgJCgnI3Bvc3NpYmxlLWZpZWxkcy1sYWJlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJyNwb3NzaWJsZS1maWVsZHMtbGFiZWwnKS5zaG93KCk7XG5cblxuICAgICAgICBwb3NzaWJsZUZpZWxkcy5mb3JFYWNoKChpbnB1dF9uYW1lIDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBsZXQgX3RlbXBsYXRlID0gJCh0ZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgIF90ZW1wbGF0ZS5hdHRyKCduYW1lJyxpbnB1dF9uYW1lKTtcbiAgICAgICAgICAgIF90ZW1wbGF0ZS5odG1sKGlucHV0X25hbWUpO1xuXG4gICAgICAgICAgICBlbGVtLmFwcGVuZChfdGVtcGxhdGUpO1xuXG4gICAgICAgICAgICBfdGVtcGxhdGUub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGlucHV0ID0gdGhpcy5nZXRBdmFpbGFibGVJbnB1dERhdGEoaW5wdXRfbmFtZSk7XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5hdHRyaWJ1dGVzLm5hbWUgPSBpbnB1dF9uYW1lO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRJbnB1dChpbnB1dC5hdHRyaWJ1dGVzLnR5cGUsaW5wdXQpLnRoZW4oKGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRQb3NzaWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSwnZmllbGRzJyk7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfSlcblxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCB0aGUgZm9ybSBkYXRhIGluIHRoZSBmb3JtIHR5cGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZm9ybURhdGFcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYWRkRm9ybURhdGEoJGZvcm1EYXRhKSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgdGhpcy5sb2FkRm9ybVRlbXBsYXRlKCRmb3JtRGF0YS50eXBlKS50aGVuKCgkdGVtcGxhdGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybVR5cGUgPSB0aGlzLmdlbmVyYXRlRm9ybSgkZm9ybURhdGEudHlwZSk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9ybVR5cGUuaW5pdCgkdGVtcGxhdGUpO1xuXG4gICAgICAgICAgICAkKCcjZWYtYWRkLXR5cGUnKS5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxJbmZvcygkKGVsZW0pLCRmb3JtRGF0YSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ3V0aWxpdHknKTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGZvcm1UeXBlXG4gICAgICovXG4gICAgcHVibGljIGFkZFJlcXVpcmVkRmllbGRzKGZvcm1UeXBlIDogc3RyaW5nKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBfcmVxdWlyZWQgPSB0aGlzLmF2YWlsYWJsZUZvcm1zW2Zvcm1UeXBlXS5yZXF1aXJlZDtcblxuICAgICAgICAvLyBIZXJlIHdlIGFkZCB0aGUgY29uY2F0IHRvIGNsb25lIHRoZSBvYmplY3RcbiAgICAgICAgbGV0IHJlcXVpcmVkID0gX3JlcXVpcmVkLmNvbmNhdChbXSk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVVbnRvdWNoZWRJbnB1dHMoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICQuZWFjaCh0aGlzLmlucHV0cywoa2V5IDogc3RyaW5nLCBpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSAkLmluQXJyYXkoaW5wdXQudmFsdWUuYXR0cmlidXRlcy5uYW1lLHJlcXVpcmVkKTtcbiAgICAgICAgICAgICAgICBpZihpbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgaW5wdXRzID0gW107XG5cblxuICAgICAgICAgICAgJC5lYWNoKHJlcXVpcmVkLChrZXkgOiBudW1iZXIsaW5wdXROYW1lIDogc3RyaW5nKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIGRlZmF1bHQgdmFsdWVzIGluc2lkZVxuICAgICAgICAgICAgICAgIGxldCBpbnB1dCA9IHRoaXMuZ2V0QXZhaWxhYmxlSW5wdXREYXRhKGlucHV0TmFtZSk7XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5hdHRyaWJ1dGVzLm5hbWUgPSBpbnB1dE5hbWU7XG5cbiAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChpbnB1dCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZihpbnB1dHMgJiYgaW5wdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoaW5wdXRzLCAwKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgRUZfQWRkLnN1Y2Nlc3MgPSAnVGhlIGZpZWxkcyAnICsgcmVxdWlyZWQuam9pbignLCAnKSArICcgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBmb3JtJztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYWxsIHRoZSBpbnB1dHMgYWRkZWQgYnkgY2hhbmdpbmcgdGhlIHR5cGUgb2YgZm9ybVxuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmVVbnRvdWNoZWRJbnB1dHMoKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgbGV0IGlucHV0cyA9IFtdO1xuXG4gICAgICAgICQuZWFjaCh0aGlzLmlucHV0cywoa2V5IDogbnVtYmVyLCBpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChpbnB1dC5kaXJ0eSkge1xuICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMgPSBpbnB1dHM7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVvcmdhbmlzZSgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gdGhlIHR5cGUgb2YgaW5wdXQgYWNjb3JkaW5nIHRvIGl0cyBuYW1lXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXROYW1lXG4gICAgICovXG4gICAgcHVibGljIGdldEF2YWlsYWJsZUlucHV0RGF0YShpbnB1dE5hbWUgOiBzdHJpbmcpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgaW5wdXQ7XG5cbiAgICAgICAgbGV0IHR5cGUgPSB0aGlzLmdldERlZmF1bHRUeXBlRnJvbU5hbWUoaW5wdXROYW1lKTtcblxuICAgICAgICBpZih0aGlzLmF2YWlsYWJsZUlucHV0c1t0eXBlXSkge1xuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLmF2YWlsYWJsZUlucHV0c1t0eXBlXS5kYXRhO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBpbnB1dCA9IHRoaXMuYXZhaWxhYmxlSW5wdXRzWyd0ZXh0J10uZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIHRoZSBkZWZhdWx0IHR5cGUgb2YgYSBmaWVsZCBhY2NvcmRpbmcgdG8gaXRzIG5hbWVcbiAgICAgKlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICovXG4gICAgcHVibGljIGdldERlZmF1bHRUeXBlRnJvbU5hbWUobmFtZSA6IHN0cmluZykgOiBzdHJpbmdcbiAgICB7XG4gICAgICAgIC8vIERlZmF1bHQgdHlwZVxuICAgICAgICBsZXQgdHlwZSA9ICd0ZXh0JztcblxuICAgICAgICBpZih0aGlzLmRlZmF1bHRJbnB1dFR5cGVzW25hbWVdKSB7XG4gICAgICAgICAgICB0eXBlID0gdGhpcy5kZWZhdWx0SW5wdXRUeXBlc1tuYW1lXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHVibGljIGxvYWRGb3JtVGVtcGxhdGUodHlwZSA6IHN0cmluZykgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgbGV0IGtleSA9ICdmb3JtLScgKyB0eXBlO1xuXG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlc1trZXldICYmIHRoaXMudGVtcGxhdGVzW2tleV0gIT0gdW5kZWZpbmVkICYmIHRoaXMudGVtcGxhdGVzW2tleV0gIT0gJycpIHtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKHRoaXMudGVtcGxhdGVzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkLmdldChhamF4VXJsLCB7XG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ2FjdGlvbnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlIDogdHlwZSxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX3RlbXBsYXRlJ1xuICAgICAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNba2V5XSA9IGRhdGEuZGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIEkgc2VuZCBiYWNrIHRoZSBkYXRhXG4gICAgICAgICAgICAgICAgZGZkLnJlc29sdmUoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgIH0pLmVycm9yKHRoaXMuaGFuZGxlRXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogRmlsbCBmb3JtIGRhdGEgdGhlIGluZm9zIGluc2lkZSB0aGUgZWRpdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1cbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHVibGljIGZpbGxJbmZvcygkZWxlbSwkZm9ybURhdGEpIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJGVsZW0pO1xuXG4gICAgICAgIGlmKCRmb3JtRGF0YVtwcm9wLmF0dHJdICYmICRmb3JtRGF0YVtwcm9wLmF0dHJdW3Byb3AuaWRdKSB7XG5cbiAgICAgICAgICAgIEVGX0lucHV0LnNldElucHV0VmFsdWUoJGVsZW0sJGZvcm1EYXRhW3Byb3AuYXR0cl1bcHJvcC5pZF0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCB0aGUgZGF0YSBpbnNpZGUgdGhlIHN1Ym1pdCBidXR0b25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdWJtaXRcbiAgICAgKi9cbiAgICBwcml2YXRlIGFkZFN1Ym1pdERhdGEoc3VibWl0KSA6IHZvaWRcbiAgICB7XG4gICAgICAgIEVGX0lucHV0LmFkZERhdGFUb0VsZW1lbnQodGhpcy4kYm9keS5maW5kKCcjZWYtYWRkLXN1Ym1pdCcpLHN1Ym1pdCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIExvYWQgYWxsIHRoZSBpbnB1dHMgZnJvbSB0aGUgbGlzdFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0c1xuICAgICAqIEBwYXJhbSBkZmRcbiAgICAgKiBAcGFyYW0gb3JkZXJcbiAgICAgKi9cbiAgICBwcml2YXRlIGxvYWRJbnB1dHMoaW5wdXRzIDogeyBhdHRyaWJ1dGVzIDoge3R5cGUgOiBzdHJpbmcgfX1bXSxvcmRlciA6IG51bWJlcixkZmQgIDogYW55ID0gbnVsbCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIGlmKCFkZmQpIHtcbiAgICAgICAgICAgIGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKGlucHV0cyk7XG5cbiAgICAgICAgbGV0IGtleSA9IGtleXNbb3JkZXJdO1xuXG4gICAgICAgIGlmKCFrZXkgfHwgIWlucHV0cyB8fCAhaW5wdXRzW2tleV0pe1xuICAgICAgICAgICAgdGhpcy5pc19pbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmFkZElucHV0KGlucHV0c1trZXldLmF0dHJpYnV0ZXMudHlwZSxpbnB1dHNba2V5XSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgb3JkZXIrKztcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoaW5wdXRzLG9yZGVyLGRmZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuXG4gICAgcHVibGljIGdlbmVyYXRlRm9ybSh0eXBlIDogc3RyaW5nKSA6IEVGX0Zvcm1cbiAgICB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBFRl9Gb3JtKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICBsZXQgZm9ybTtcblxuICAgICAgICAgaWYoIXRoaXMuYXZhaWxhYmxlRm9ybXNbdHlwZV0pIHtcbiAgICAgICAgICAgIHR5cGUgPSAncG9zdCc7XG4gICAgICAgIH1cblxuICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdsb2dpbicgOlxuICAgICAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncG9zdCcgOlxuICAgICAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgICBpZighZm9ybSkge1xuICAgICAgICAgICAgZm9ybSA9IG5ldyBFRl9Gb3JtKCk7XG4gICAgICAgIH1cblxuICAgICAgICAgcmV0dXJuIGZvcm07XG4gICAgICAgICAqKi9cblxuICAgIH1cblxuXG5cbiAgICBwdWJsaWMgZ2V0Rm9ybVR5cGUoKSA6IHN0cmluZ1xuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGJvZHkuZmluZCgnKltuYW1lPVwic2V0dGluZ3NbdHlwZV1cIl0nKS52YWwoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHVibGljIGdlbmVyYXRlSW5wdXQodHlwZSA6IHN0cmluZykgOiBFRl9JbnB1dFxuICAgIHtcbiAgICAgICAgbGV0IGlucHV0O1xuXG4gICAgICAgIGlmKCF0aGlzLmF2YWlsYWJsZUlucHV0c1t0eXBlXSkge1xuICAgICAgICAgICAgdHlwZSA9ICd0ZXh0JztcbiAgICAgICAgfVxuXG5cbiAgICAgICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgICAgICAgIGlucHV0ID0gbmV3IEVGX0lucHV0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZighaW5wdXQpIHtcbiAgICAgICAgICAgIGlucHV0ID0gbmV3IEVGX0lucHV0KCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiBpbnB1dDtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBMb2FkIHRoZSBpbnB1dCB0ZW1wbGF0ZSBmcm9tIHRoZSBCT1xuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGUgOiBzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRJbnB1dCh0eXBlIDogc3RyaW5nID0gJ3RleHQnKVxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXNbdHlwZV0gJiYgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gIT0gdW5kZWZpbmVkICYmIHRoaXMudGVtcGxhdGVzW3R5cGVdICE9ICcnKSB7XG4gICAgICAgICAgICBkZmQucmVzb2x2ZSh0aGlzLnRlbXBsYXRlc1t0eXBlXSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQuZ2V0KGFqYXhVcmwsIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnaW5wdXRzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA6IHR5cGUsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF90ZW1wbGF0ZSdcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW3R5cGVdID0gZGF0YS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhLmRhdGEpO1xuICAgICAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIEhUVFAgRXJyb3JzXG4gICAgICpcbiAgICAgKiBAVE9ET1xuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVFcnJvcihkYXRhIDogc3RyaW5nfHtyZXNwb25zZUpTT04gOiB7ZXJyb3J9fSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIGxldCBlcnJvciA6IHN0cmluZztcblxuICAgICAgICBpZih0eXBlb2YgZGF0YSAhPSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBlcnJvciA9IGRhdGEucmVzcG9uc2VKU09OLmVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgRUZfQWRkLmVycm9yID0gZXJyb3I7XG4gICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlKTtcblxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEdldCB0aGUgdXJsIHBhcmFtZXRlclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtZXRlclxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRQYXJhbWV0ZXIocGFyYW1ldGVyIDogc3RyaW5nKTphbnlcbiAgICB7XG4gICAgICAgIHZhciBwYXJhbXNfc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSk7XG5cbiAgICAgICAgdmFyIHBhcmFtc19hcnJheSA9IHBhcmFtc19zdHJpbmcuc3BsaXQoJyYnKTtcblxuICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgIGZvcih2YXIgaSA9MDtpPHBhcmFtc19hcnJheS5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZSA9IHBhcmFtc19hcnJheVtpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgb2JqW2VbMF1dID0gZVsxXVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9ialtwYXJhbWV0ZXJdO1xuICAgIH1cblxuXG5cblxuICAgIC8qKlxuICAgICAqIERpc3BsYXkgYW4gZXJyb3IgbWVzc2FnZSB0aGF0IHdpbGwgZmFkZSBvdXQgaW4gNSBzZWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCBlcnJvcihlcnJvck1lc3NhZ2UgOiBzdHJpbmd8Ym9vbGVhbikge1xuXG4gICAgICAgIEVGX0FkZC5zZXRNZXNzYWdlKCcjZXJyb3ItbWVzc2FnZScsZXJyb3JNZXNzYWdlLGZhbHNlKTtcblxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIERpc3BsYXkgYSBzdWNjZXNzIG1lc3NhZ2UgdGhhdCB3aWxsIGZhZGUgb3V0IGluIDUgc2VjXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3VjY2Vzc01lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCBzdWNjZXNzKHN1Y2Nlc3NNZXNzYWdlOiBzdHJpbmd8Ym9vbGVhbikge1xuXG4gICAgICAgIEVGX0FkZC5zZXRNZXNzYWdlKCcjc3VjY2Vzcy1tZXNzYWdlJyxzdWNjZXNzTWVzc2FnZSxmYWxzZSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0gcGVyc2lzdCA6IGJvb2xlYW4sIFdlaXRoZXIgb3Igbm90IHRoZSBtZXNzYWdlIHNob3VsZCBiZSBkaXNwbGF5ZWQgb3Igbm90XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXRNZXNzYWdlKGVsZW1lbnQgOiBzdHJpbmcsbWVzc2FnZSA6IHN0cmluZ3xib29sZWFuLCBwZXJzaXN0IDogYm9vbGVhbnxudW1iZXIgPSBmYWxzZSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIGlmKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkudGV4dChtZXNzYWdlKS5mYWRlSW4oMjAwKTtcblxuICAgICAgICAgICAgaWYoIXBlcnNpc3QpIHtcblxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHBlcnNpc3QgaXMgbm90IGVxdWFsIHRvIGZhbHNlXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHBlcnNpc3QgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcnNpc3QgPSA1MDAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1lc3NhZ2UoZWxlbWVudCwnJyk7XG4gICAgICAgICAgICAgICAgfSxwZXJzaXN0KTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkuZmFkZU91dCgyMDAsKCkgPT4ge1xuICAgICAgICAgICAgICAgICQoZWxlbWVudCkudGV4dCgnJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG52YXIgRUZfYWRkID0gbmV3IEVGX0FkZCgpO1xuRUZfYWRkLmluaXQoKTsiXX0=
