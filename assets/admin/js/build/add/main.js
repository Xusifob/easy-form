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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2lucHV0cy9FRl9JbnB1dC50cyIsImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2Zvcm1zL0VGX0Zvcm0udHMiLCJhc3NldHMvYWRtaW4vanMvc3JjL2FkZC9FRl9BZGQudHMiXSwibmFtZXMiOlsiRUZfSW5wdXQiLCJ0aGlzIiwiZGlydHkiLCJjb250YWluZXIiLCIkIiwicHJvdG90eXBlIiwiaW5pdCIsIiRlbGVtZW50IiwiaWQiLCIkZGF0YSIsInBvc2l0aW9uIiwicmVwbGFjZSIsImVsZW1lbnQiLCJvcHRpb25zRWxlbWVudCIsImZpbmQiLCJhcHBlbmQiLCJyZXBsYWNlV2l0aCIsInNldEV2ZW50cyIsImFkZERhdGEiLCJoYW5kbGVDaGVja2JveCIsImVhY2giLCJrZXkiLCJpbnB1dCIsIiRpbnB1dCIsInZhbHVlIiwiaXMiLCJuYW1lIiwiYXR0ciIsIiRoaWRkZW4iLCJvbiIsImFmdGVyIiwiX3RoaXMiLCJvZmYiLCJ0b2dnbGUiLCJvbkR1cGxpY2F0ZSIsIm9uQ2hhbmdlVHlwZSIsIm9uRGVsZXRlIiwib25Nb3ZlIiwiZWxlbSIsImhhc0NsYXNzIiwiY2xvc2UiLCJvcGVuIiwiYWRkRGF0YVRvRWxlbWVudCIsInByb3AiLCJnZXRJbnB1dFByb3BlcnRpZXMiLCJzZXRJbnB1dFZhbHVlIiwidmFsIiwic3RyaXBzbGFzaGVzIiwic3RyIiwicyIsIm4xIiwiZ2V0SW5wdXRWYWx1ZSIsImRhdGEiLCJzcGxpdCIsImhpZGUiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiaHRtbCIsInNob3ciLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImF0dHJpYnV0ZXMiLCJ0eXBlIiwiRUZfRm9ybSIsIkVGX0lucHV0XzEiLCJFRl9BZGQiLCJ0ZW1wbGF0ZXMiLCJpbnB1dHMiLCJhdmFpbGFibGVJbnB1dHMiLCJhdmFpbGFibGVGb3JtcyIsImlzX2luaXQiLCIkYm9keSIsImxvYWQiLCJ0aGVuIiwiYWRkSW5wdXQiLCJsb2FkaW5nIiwiYWRkUG9zc2libGVGaWVsZHMiLCIkZXZlbnQiLCJ0YXJnZXQiLCJjaGFuZ2VGb3JtVHlwZSIsInJlb3JnYW5pc2UiLCJkZmQiLCJEZWZlcnJlZCIsInB1c2giLCJyZW1vdmVBbGxJbnB1dHMiLCJsb2FkSW5wdXRzIiwiY29uc29sZSIsImxvZyIsInJlc29sdmUiLCJwcm9taXNlIiwiZGlyZWN0aW9uIiwiaW5kZXhPZiIsIm5ld3BvcyIsImxlbmd0aCIsInN3aXRjaCIsInBvczEiLCJwb3MyIiwiaW5wdXQxIiwic3VjY2VzcyIsInNwbGljZSIsImdldElucHV0IiwiZ2VuZXJhdGVJbnB1dCIsImFjdGlvbiIsImdldEpTT04iLCJhamF4VXJsIiwiZm9ybV9pZCIsImdldFBhcmFtZXRlciIsImZvcm0iLCJhZGRGb3JtRGF0YSIsImZvcm1zIiwiZGVmYXVsdElucHV0VHlwZXMiLCJkZWZhdWx0X2lucHV0cyIsInN1Ym1pdCIsImFkZFN1Ym1pdERhdGEiLCJmb3JFYWNoIiwiYWRkUmVxdWlyZWRGaWVsZHMiLCJlcnJvciIsImhhbmRsZUVycm9yIiwiJGZvcm1EYXRhIiwiZmlsbEluZm9zIiwiZm9ybVR5cGUiLCJjdXJyZW50IiwiZ2V0Rm9ybVR5cGUiLCJyZXF1aXJlZCIsInBvc3NpYmxlRmllbGRzIiwicG9zc2libGUiLCJjb25jYXQiLCJ0ZW1wbGF0ZSIsImluZGV4IiwiaW5wdXRfbmFtZSIsIl90ZW1wbGF0ZSIsImdldEF2YWlsYWJsZUlucHV0RGF0YSIsImxvYWRGb3JtVGVtcGxhdGUiLCIkdGVtcGxhdGUiLCJnZW5lcmF0ZUZvcm0iLCJfcmVxdWlyZWQiLCJyZW1vdmVVbnRvdWNoZWRJbnB1dHMiLCJpbkFycmF5IiwiaW5wdXROYW1lIiwiam9pbiIsImdldERlZmF1bHRUeXBlRnJvbU5hbWUiLCJ1bmRlZmluZWQiLCJnZXQiLCIkZWxlbSIsIkVGX0lucHV0XzIiLCJvcmRlciIsImtleXMiLCJFRl9Gb3JtXzEiLCJyZXNwb25zZUpTT04iLCJwYXJhbWV0ZXIiLCJwYXJhbXNfc3RyaW5nIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJzdWJzdHIiLCJwYXJhbXNfYXJyYXkiLCJvYmoiLCJpIiwiZSIsImVycm9yTWVzc2FnZSIsInNldE1lc3NhZ2UiLCJzdWNjZXNzTWVzc2FnZSIsIm1lc3NhZ2UiLCJwZXJzaXN0IiwidGV4dCIsImZhZGVJbiIsInNldFRpbWVvdXQiLCJmYWRlT3V0IiwiRUZfYWRkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztnQkF5REksU0FBQUE7Ozs7b0JBWE9DLEtBQUFDLFFBQWtCO29CQWFyQkQsS0FBS0UsWUFBWUMsRUFBRTs7Ozs7Ozs7O2dCQVloQkosU0FBQUssVUFBQUMsT0FBUCxTQUFZQyxVQUFnQkMsSUFBWUMsT0FBWUM7b0JBQUEsSUFBQUEsa0JBQUEsR0FBQTt3QkFBQUEsV0FBQTs7b0JBRWhEVCxLQUFLTyxLQUFLQTtvQkFFVkQsV0FBV0EsU0FBU0ksUUFBUSxjQUFhSCxLQUFHO29CQUM1Q0QsV0FBV0EsU0FBU0ksUUFBUSxZQUFXSDtvQkFFdkNQLEtBQUtXLFVBQVVSLEVBQUVHO29CQUNqQk4sS0FBS1ksaUJBQWlCWixLQUFLVyxRQUFRRSxLQUFLO29CQUV4QyxJQUFHLFNBQVNKLFVBQVU7d0JBQ2xCVCxLQUFLRSxVQUFVWSxPQUFPZCxLQUFLVzsyQkFDekI7d0JBQ0ZYLEtBQUtFLFVBQVVXLEtBQUssWUFBWUosVUFBVU0sWUFBWWYsS0FBS1c7O29CQUcvRFgsS0FBS2dCO29CQUVMaEIsS0FBS2lCLFFBQVFUO29CQUViUixLQUFLa0I7Ozs7O2dCQVFGbkIsU0FBQUssVUFBQWMsaUJBQVA7b0JBRUlsQixLQUFLVyxRQUFRRSxLQUFLLDBCQUEwQk0sS0FBSyxTQUFDQyxLQUFhQzt3QkFDM0QsSUFBSUMsU0FBU25CLEVBQUVrQjt3QkFFZixJQUFJRSxRQUFRRCxPQUFPRSxHQUFHLGNBQWMsSUFBSTt3QkFDeEMsSUFBSUMsT0FBT0gsT0FBT0ksS0FBSzt3QkFDdkJKLE9BQU9JLEtBQUssUUFBTzt3QkFFbkIsSUFBSUMsVUFBVXhCLEVBQUUsZ0NBQStC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LElBQUlILGFBQWFFLEdBQUd4RyxNQUFNO3dCQUM5QnVHLElBQUlFLEVBQUUsTUFBTUEsRUFBRTs7b0JBR2xCLE9BQU9GLElBQUlQOztnQkFXZjFGLE9BQUFDLGVBQWtCSyxRQUFBOzs7Ozs7eUJBQWxCLFNBQXdCOEY7d0JBRXBCOUYsT0FBTytGLFdBQVcsa0JBQWlCRCxjQUFhOzs7OztnQkFZcERwRyxPQUFBQyxlQUFrQkssUUFBQTs7Ozs7Ozt5QkFBbEIsU0FBMEJnRzt3QkFFdEJoRyxPQUFPK0YsV0FBVyxvQkFBbUJDLGdCQUFlOzs7Ozs7Ozs7OztnQkFVMUNoRyxPQUFBK0YsYUFBZCxTQUF5QnBKLFNBQWlCc0osU0FBMEJDO29CQUFwRSxJQUFBcEksUUFBQTlCO29CQUFvRSxJQUFBa0ssaUJBQUEsR0FBQTt3QkFBQUEsVUFBQTs7b0JBR2hFLElBQUdELFNBQVM7d0JBQ1I5SixFQUFFUSxTQUFTd0osS0FBS0YsU0FBU0csT0FBTzt3QkFFaEMsS0FBSUYsU0FBUzs7NEJBR1QsV0FBVUEsWUFBWSxXQUFXO2dDQUM3QkEsVUFBVTs7NEJBR2RHLFdBQVc7Z0NBQ1B2SSxNQUFLaUksV0FBV3BKLFNBQVE7K0JBQzFCdUo7OzJCQUlKO3dCQUNGL0osRUFBRVEsU0FBUzJKLFFBQVEsS0FBSTs0QkFDbkJuSyxFQUFFUSxTQUFTd0osS0FBSzs7OztnQkFLaEMsT0FBQW5HOztZQUVJdUcsU0FBUyxJQUFJdkc7WUFDakJ1RyxPQUFPbEsiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuZGVjbGFyZSB2YXIgJCA6IGFueTtcblxuZXhwb3J0IGNsYXNzIEVGX0lucHV0XG57XG5cbiAgICAvKipcbiAgICAgKiBAdmFyIHN0cmluZ1xuICAgICAqXG4gICAgICogVGhlIHR5cGUgb2YgdGhlIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB0eXBlIDogc3RyaW5nID0gJ3RleHQnO1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIEhUTUwgRWxlbWVudFxuICAgICAqXG4gICAgICogVGhlIGh0bWwgZWxlbWVudCBvZiB0aGUgaW5wdXRcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBlbGVtZW50IDogYW55O1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIEhUTUwgRWxlbWVudFxuICAgICAqXG4gICAgICogVGhlIGh0bWwgZWxlbWVudCBmb3IgdGhlIG9wdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBvcHRpb25zRWxlbWVudCA6IGFueTtcblxuXG4gICAgLyoqXG4gICAgICogVGhlIGlkIChwb3NpdGlvbikgb2YgdGhlIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIGlkIDogbnVtYmVyO1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBlbGVtZW50IG9mIHRoZSBjb250YWluZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgY29udGFpbmVyIDogYW55O1xuXG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgZmllbGQgaGFzIGJlZW4gY2hhbmdlZCBvciBub3RcbiAgICAgKi9cbiAgICBwdWJsaWMgZGlydHkgOiBib29sZWFuID0gZmFsc2U7XG5cblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIGNhbGxlZCBvbiBkdXBsaWNhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgb25EdXBsaWNhdGUgOiBhbnk7XG4gICAgcHVibGljIG9uQ2hhbmdlVHlwZSA6IGFueTtcbiAgICBwdWJsaWMgb25EZWxldGUgOiBhbnk7XG4gICAgcHVibGljIG9uTW92ZSA6IGFueTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9ICQoJyNmbGQnKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gJGRhdGFcbiAgICAgKiBAcGFyYW0gaWRcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gOiBudW1iZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdCgkZWxlbWVudCA6IGFueSwgaWQgOiBudW1iZXIsJGRhdGEgOiBhbnkscG9zaXRpb24gOiBudWxsfG51bWJlciA9IG51bGwpXG4gICAge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG5cbiAgICAgICAgJGVsZW1lbnQgPSAkZWxlbWVudC5yZXBsYWNlKC9maWVsZFVuSWQvZyxpZCsxKTtcbiAgICAgICAgJGVsZW1lbnQgPSAkZWxlbWVudC5yZXBsYWNlKC9maWVsZElkL2csaWQpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoJGVsZW1lbnQpO1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5lZi10YWJsZScpO1xuXG4gICAgICAgIGlmKG51bGwgPT09IHBvc2l0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmQodGhpcy5lbGVtZW50KTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuZmluZCgnI2ZpZWxkLScgKyBwb3NpdGlvbikucmVwbGFjZVdpdGgodGhpcy5lbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0RXZlbnRzKCk7XG5cbiAgICAgICAgdGhpcy5hZGREYXRhKCRkYXRhKTtcblxuICAgICAgICB0aGlzLmhhbmRsZUNoZWNrYm94KCk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgY2hlY2tib3hzIHRvIGxpbmsgdGhlbSB3aXRoIGEgaGlkZGVuIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIGhhbmRsZUNoZWNrYm94KClcbiAgICB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsaW5wdXQgOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgbGV0ICRpbnB1dCA9ICQoaW5wdXQpO1xuXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAkaW5wdXQuaXMoJzpjaGVja2VkJykgPyAxIDogMDtcbiAgICAgICAgICAgIGxldCBuYW1lID0gJGlucHV0LmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICRpbnB1dC5hdHRyKCduYW1lJywnJyk7XG5cbiAgICAgICAgICAgIGxldCAkaGlkZGVuID0gJCgnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiJysgbmFtZSArJ1wiIHZhbHVlPVwiJysgdmFsdWUgKydcIj4nKTtcblxuXG4gICAgICAgICAgICAkaW5wdXQub24oJ2NoYW5nZScsKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9ICRpbnB1dC5pcygnOmNoZWNrZWQnKSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgICRoaWRkZW4uYXR0cigndmFsdWUnLHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkaW5wdXQuYWZ0ZXIoJGhpZGRlbilcblxuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogU2V0IGFsbCB0aGUgZXZlbnRzIGxpbmtlZCB0byB0aGlzIGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0RXZlbnRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwib3Blbi1jbG9zZVwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHtyZXR1cm4gdGhpcy50b2dnbGUoKX0pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwiZHVwbGljYXRlXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3RoaXMub25EdXBsaWNhdGUodGhpcyk7IHJldHVybiBmYWxzZTt9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cImNoYW5nZS10eXBlXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3RoaXMub25DaGFuZ2VUeXBlKHRoaXMpOyByZXR1cm4gZmFsc2U7fSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJkZWxldGVcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7dGhpcy5vbkRlbGV0ZSh0aGlzKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwidXBcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7dGhpcy5vbk1vdmUodGhpcywndXAnKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwiZG93blwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHt0aGlzLm9uTW92ZSh0aGlzLCdkb3duJyk7IHJldHVybiBmYWxzZTt9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ3NlbGVjdCxpbnB1dCx0ZXh0YXJlYScpLm9uKCdpbnB1dCcsICgpID0+IHsgdGhpcy5kaXJ0eSA9IHRydWU7fSk7XG4gICAgfVxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQ2xvc2UgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlKCk6IGJvb2xlYW5cbiAgICB7XG5cbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwib3Blbi1jbG9zZVwiXScpO1xuXG4gICAgICAgIGlmKCQoZWxlbSkuaGFzQ2xhc3MoJ21pbmlmeScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9zZSgpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0IHRoZSBkYXRhIGluIHRoZSB0ZW1wbGF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICovXG4gICAgcHVibGljIGFkZERhdGEoJGRhdGEpIDogdm9pZFxuICAgIHtcblxuICAgICAgICBpZigkZGF0YS5kaXJ0eSkge1xuICAgICAgICAgICAgdGhpcy5kaXJ0eSA9ICRkYXRhLmRpcnR5O1xuICAgICAgICB9XG5cblxuICAgICAgICBFRl9JbnB1dC5hZGREYXRhVG9FbGVtZW50KHRoaXMuZWxlbWVudCwkZGF0YSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGREYXRhVG9FbGVtZW50KCRlbGVtZW50IDogYW55LCAkZGF0YSA6IGFueSkgOiB2b2lkXG4gICAge1xuICAgICAgICAkZWxlbWVudC5maW5kKCdbbmFtZV49XCJmaWVsZFwiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoZWxlbSkpO1xuXG4gICAgICAgICAgICBpZigkZGF0YVtwcm9wLnByb3BdICYmICRkYXRhW3Byb3AucHJvcF1bcHJvcC5uYW1lXSkge1xuICAgICAgICAgICAgICAgIEVGX0lucHV0LnNldElucHV0VmFsdWUoJChlbGVtKSwkZGF0YVtwcm9wLnByb3BdW3Byb3AubmFtZV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQWRkIGEgdmFsdWUgdG8gYW4gaW5wdXRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0SW5wdXRWYWx1ZShpbnB1dCA6IGFueSwgdmFsdWUgOiBzdHJpbmd8Ym9vbGVhbilcbiAgICB7XG4gICAgICAgIGlmKGlucHV0LmlzKCc6Y2hlY2tib3gnKSl7XG4gICAgICAgICAgICBpZihcIjFcIiA9PSB2YWx1ZSB8fCB2YWx1ZSA9PSAnb24nKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnB1dC5wcm9wKCdjaGVja2VkJyx2YWx1ZSk7XG4gICAgICAgIH1lbHNlIGlmKGlucHV0LmlzKCdzZWxlY3QnKSl7XG4gICAgICAgICAgICBpbnB1dC5maW5kKCdvcHRpb25bdmFsdWU9XCInKyB2YWx1ZSArJ1wiXScpLnByb3AoJ3NlbGVjdGVkJyx0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgaW5wdXQudmFsKEVGX0lucHV0LnN0cmlwc2xhc2hlcyh2YWx1ZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gXG4gICAgLy8gICAgICAgZGlzY3VzcyBhdDogaHR0cDovL2xvY3V0dXMuaW8vcGhwL3N0cmlwc2xhc2hlcy9cbiAgICAvLyAgICAgIG9yaWdpbmFsIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va3Z6LmlvKVxuICAgIC8vICAgICAgaW1wcm92ZWQgYnk6IEF0ZXMgR29yYWwgKGh0dHA6Ly9tYWduZXRpcS5jb20pXG4gICAgLy8gICAgICBpbXByb3ZlZCBieTogbWFycnRpbnNcbiAgICAvLyAgICAgIGltcHJvdmVkIGJ5OiByZXpuYVxuICAgIC8vICAgICAgICAgZml4ZWQgYnk6IE1pY2tAZWxcbiAgICAvLyAgICAgIGJ1Z2ZpeGVkIGJ5OiBPbm5vIE1hcnNtYW4gKGh0dHBzOi8vdHdpdHRlci5jb20vb25ub21hcnNtYW4pXG4gICAgLy8gICAgICBidWdmaXhlZCBieTogQnJldHQgWmFtaXIgKGh0dHA6Ly9icmV0dC16YW1pci5tZSlcbiAgICAvLyAgICAgICAgIGlucHV0IGJ5OiBSaWNrIFdhbGRyb25cbiAgICAvLyAgICAgICAgIGlucHV0IGJ5OiBCcmFudCBNZXNzZW5nZXIgKGh0dHA6Ly93d3cuYnJhbnRtZXNzZW5nZXIuY29tLylcbiAgICAvLyByZWltcGxlbWVudGVkIGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxuICAgIC8vICAgICAgICBleGFtcGxlIDE6IHN0cmlwc2xhc2hlcygnS2V2aW5cXCdzIGNvZGUnKVxuICAgIC8vICAgICAgICByZXR1cm5zIDE6IFwiS2V2aW4ncyBjb2RlXCJcbiAgICAvLyAgICAgICAgZXhhbXBsZSAyOiBzdHJpcHNsYXNoZXMoJ0tldmluXFxcXFxcJ3MgY29kZScpXG4gICAgLy8gICAgICAgIHJldHVybnMgMjogXCJLZXZpblxcJ3MgY29kZVwiXG5cbiAgICBwdWJsaWMgc3RhdGljIHN0cmlwc2xhc2hlcyAoc3RyKSB7XG4gICAgICAgIHJldHVybiAoc3RyICsgJycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxcXCguPykvZywgZnVuY3Rpb24gKHMsIG4xKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChuMSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdcXFxcJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnXFxcXCdcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnMCc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ1xcdTAwMDAnXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJyc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEdldCB0aGUgdmFsdWUgb2YgYW4gaW5wdXRcbiAgICAgKlxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICogQHJldHVybnMgYW55XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnB1dFZhbHVlKGlucHV0IDogYW55KVxuICAgIHtcblxuICAgICAgICBpZih0eXBlb2YgaW5wdXQudmFsICE9ICdmdW5jdGlvbicpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cblxuICAgICAgICBpZihpbnB1dC5pcygnOmNoZWNrYm94Jykpe1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LmlzKCc6Y2hlY2tlZCcpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC52YWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJldHVybiBhbGwgdGhlIHByb3BlcnRpZXMgb2YgYW4gaW5wdXRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnB1dFByb3BlcnRpZXMoZWxlbSA6IGFueSkgOiB7YXR0cixpZCxwcm9wLG5hbWV9XG4gICAge1xuXG4gICAgICAgIGxldCBuYW1lID0gZWxlbS5hdHRyKCduYW1lJyk7XG5cbiAgICAgICAgbGV0IGRhdGEgPSBuYW1lLnNwbGl0KCdbJyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGF0dHIgOiBkYXRhWzBdLnJlcGxhY2UoJ10nLCcnKSxcbiAgICAgICAgICAgIGlkIDogZGF0YVsxXS5yZXBsYWNlKCddJywnJyksXG4gICAgICAgICAgICBwcm9wIDogZGF0YVsyXSA/IGRhdGFbMl0ucmVwbGFjZSgnXScsJycpIDogJycsXG4gICAgICAgICAgICBuYW1lIDogZGF0YVszXSA/IGRhdGFbM10ucmVwbGFjZSgnXScsJycpIDogJycsXG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBzaW5jZSAxLjEuMFxuICAgICAqXG4gICAgICogQGV2ZW50IDogQ2xpY2sgb24gbWluaWZ5IGJ1dHRvbiA6IGhpZGUgdGhlIG9wdGlvbnMgb2YgdGhlIGZpZWxkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBjbG9zZSgpIDogYm9vbGVhblxuICAgIHtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudC5oaWRlKDIwMCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcubWluaWZ5JylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWluaWZ5JylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnb3BlbicpXG4gICAgICAgICAgICAuaHRtbCgnKycpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHNpbmNlIDEuMS4wXG4gICAgICpcbiAgICAgKiBPcGVuIGEgZmllbGRcbiAgICAgKlxuICAgICAqIEBldmVudCA6IENsaWNrIG9uIG9wZW4gYnV0dG9uLCBzaG93IHRoZSBmaWVsZCBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBvcGVuKCkgOiBib29sZWFuXG4gICAge1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50LnNob3coMjAwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5vcGVuJylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnb3BlbicpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ21pbmlmeScpXG4gICAgICAgICAgICAuaHRtbCgnLScpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIHRoZSB2YWx1ZSBvZiBhbGwgdGhlIGlucHV0cyBpbiB0aGUgZmllbGRcbiAgICAgKlxuICAgICAqL1xuICAgIGdldCB2YWx1ZSgpOiBhbnkge1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IHtcbiAgICAgICAgICAgIGRpcnR5IDogdGhpcy5kaXJ0eSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW25hbWVePVwiZmllbGRcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsaW5wdXQgOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJChpbnB1dCkpO1xuICAgICAgICAgICAgbGV0IHZhbCA9IEVGX0lucHV0LmdldElucHV0VmFsdWUoJChpbnB1dCkpO1xuXG4gICAgICAgICAgICBpZihwcm9wLnByb3AgJiYgIXZhbHVlW3Byb3AucHJvcF0gJiYgcHJvcC5uYW1lKXtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLnByb3BdID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHZhbHVlW3Byb3AucHJvcF0pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLnByb3BdW3Byb3AubmFtZV0gPSB2YWw7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5wcm9wXSA9IHZhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICB9XG5cblxuXG4gICAgcHVibGljIGdldCBuYW1lKClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLmF0dHJpYnV0ZXMubmFtZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0IG5hbWUobmFtZSA6IHN0cmluZylcbiAgICB7XG4gICAgICAgIHRoaXMudmFsdWUuYXR0cmlidXRlcy5uYW1lID0gbmFtZTtcbiAgICB9XG5cbn0iLCJpbXBvcnQge0VGX0lucHV0fSBmcm9tIFwiLi4vaW5wdXRzL0VGX0lucHV0XCI7XG5cbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBFRl9Gb3JtIHtcblxuICAgIC8qKlxuICAgICAqIEB2YXIgc3RyaW5nXG4gICAgICpcbiAgICAgKiBUaGUgdHlwZSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHR5cGU6IHN0cmluZyA9ICd0ZXh0JztcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgb2YgdGhlIGlucHV0XG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgZWxlbWVudDogYW55O1xuXG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgY29udGFpbmVyXG4gICAgICovXG4gICAgcHVibGljIGNvbnRhaW5lciA6IGFueTtcblxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gJCgnI3V0aWxpdGllcycpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdCgkZWxlbWVudCA6IGFueSlcbiAgICB7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJCgkZWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuaHRtbCh0aGlzLmVsZW1lbnQpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gdGhlIHZhbHVlIG9mIGFsbCB0aGUgaW5wdXRzIGluIHRoZSBmaWVsZFxuICAgICAqXG4gICAgICovXG4gICAgZ2V0IHZhbHVlKCk6IGFueSB7XG5cbiAgICAgICAgbGV0IHZhbHVlID0ge307XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tuYW1lXj1cInNldHRpbmdzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGlucHV0IDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoaW5wdXQpKTtcbiAgICAgICAgICAgIGxldCB2YWwgPSBFRl9JbnB1dC5nZXRJbnB1dFZhbHVlKCQoaW5wdXQpKTtcblxuICAgICAgICAgICAgaWYocHJvcC5hdHRyICYmICF2YWx1ZVtwcm9wLmF0dHJdICYmIHByb3AuaWQpe1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AuYXR0cl0gPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodmFsdWVbcHJvcC5hdHRyXSkge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AuYXR0cl1bcHJvcC5pZF0gPSB2YWw7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5hdHRyXSA9IHZhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgIH1cblxuXG5cblxuXG59IiwiaW1wb3J0IHtFRl9Gb3JtfSBmcm9tIFwiLi9mb3Jtcy9FRl9Gb3JtXCI7XG5cbmRlY2xhcmUgdmFyICQ7XG5cbmRlY2xhcmUgdmFyIGFqYXhVcmwgOiBzdHJpbmc7XG5cbmltcG9ydCB7RUZfSW5wdXR9IGZyb20gJy4vaW5wdXRzL0VGX0lucHV0JztcblxuY2xhc3MgRUZfQWRkXG57XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBIVE1MIEJvZHkgb2YgdGhlIHBhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgJGJvZHk7XG5cbiAgICAvKipcbiAgICAgKkFuIG9iamVjdCBvZiBhbGwgdGhlIGlucHV0IHRlbXBsYXRlcyBjYWNoZWQgdG8gYXZvaWQgbGF0ZW5jeVxuICAgICAqL1xuICAgIHB1YmxpYyB0ZW1wbGF0ZXMgOiBhbnkgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIGFsbCB0aGUgaW5wdXRzIGF2YWlsYWJsZSBvbiB0aGUgcGFnZVxuICAgICAqL1xuICAgIHB1YmxpYyBpbnB1dHMgOiBFRl9JbnB1dFtdID0gW107XG5cblxuICAgIC8qKlxuICAgICAqIEFsbCB0aGUgYXZhaWxhYmxlIGlucHV0c1xuICAgICAqL1xuICAgIHB1YmxpYyBhdmFpbGFibGVJbnB1dHMgOiB7fSA9IHt9O1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGF2YWlsYWJsZSBpbnB1dHNcbiAgICAgKi9cbiAgICBwdWJsaWMgYXZhaWxhYmxlRm9ybXMgOiB7fSA9IHt9O1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGRlZmF1bHQgaW5wdXQgdHlwZXMuIEV4IDogdXNlcl9wYXNzIDogcGFzc3dvcmRcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVmYXVsdElucHV0VHlwZXMgOiB7fTtcblxuXG4gICAgcHVibGljIGZvcm1UeXBlIDogRUZfRm9ybTtcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBlZGl0b3IgaXMgaW5pdFxuICAgICAqL1xuICAgIHB1YmxpYyBpc19pbml0IDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuJGJvZHkgPSAkKCdib2R5Jyk7XG5cbiAgICB9XG5cblxuICAgIHB1YmxpYyBpbml0KCkge1xuXG4gICAgICAgIHRoaXMuc2V0RXZlbnRzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkKCkudGhlbigoZGF0YSkgPT4ge30pXG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgc2V0RXZlbnRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICAvKlxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLm1vdmUnLF9tb3ZlKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLnVwJyxfdXApO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcuZG93bicsX2Rvd24pO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcucmVtb3Zlb3B0aW9uJyxfcmVtb3ZlT3B0aW9uKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLmR1cGxpcXVlcicsX2R1cGxpY2F0ZSk7Ki9cblxuICAgICAgICAvLyBBZGQgYSBuZXcgZmllbGRcbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9mZignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGRcIl0nKVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJ2J1dHRvbltkYXRhLWFjdGlvbj1cImFkZFwiXScsKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkSW5wdXQoJ3RleHQnLHt9KS50aGVuKChpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRQb3NzaWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5kaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSkgfSk7XG5cblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub2ZmKCdjbGljaycsJ3NlbGVjdFtuYW1lPVwic2V0dGluZ3NbdHlwZV1cIl0nKVxuICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cInNldHRpbmdzW3R5cGVdXCJdJywoJGV2ZW50IDogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9ICQoJGV2ZW50LnRhcmdldCkudmFsKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VGb3JtVHlwZSh0eXBlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywnYnV0dG9uW2RhdGEtYWN0aW9uPVwiYWRkLW9wdGlvblwiXScsX2FkZE9wdGlvbik7XG5cblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZSQ9XCJbZm9ybS10YXhvbm9teV1cIl0nLF9jaGFuZ2VUYXhvbm9teSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWU9XCJmb3JtLXJlc2V0LWFjdGlvblwiXScsX2NoYW5nZVJlc2V0QWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgKi9cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHNpbmNlIDIuMC4wXG4gICAgICpcbiAgICAgKiBSZW9yZ2FuaXNlIGFsbCB0aGUgaW5wdXRzIG9uIHRoZSBwYWdlXG4gICAgICovXG4gICAgcHVibGljIHJlb3JnYW5pc2UoKSA6IFByb21pc2U8YW55PlxuICAgIHtcblxuICAgICAgICBsZXQgZGZkID0gJC5EZWZlcnJlZCgpO1xuXG4gICAgICAgIEVGX0FkZC5sb2FkaW5nKHRydWUsJ2ZpZWxkcycpO1xuXG5cbiAgICAgICAgbGV0IGlucHV0cyA9IFtdO1xuXG4gICAgICAgICQuZWFjaCh0aGlzLmlucHV0cywoa2V5LGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgIGlucHV0cy5wdXNoKGlucHV0LnZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVBbGxJbnB1dHMoKTtcblxuICAgICAgICB0aGlzLmxvYWRJbnB1dHMoaW5wdXRzLDApLnRoZW4oKCkgPT4ge1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZygna2l3aScpO1xuICAgICAgICAgICAgdGhpcy5hZGRQb3NzaWJsZUZpZWxkcygpO1xuXG4gICAgICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSwnZmllbGRzJyk7XG5cbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBDYWxsZWQgd2hlbiAyIGlucHV0cyBhcmUgbW92ZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqIEBwYXJhbSBkaXJlY3Rpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgb25Nb3ZlKGlucHV0IDogRUZfSW5wdXQsZGlyZWN0aW9uIDogc3RyaW5nID0gJ3VwJykgOiBhbnlcbiAgICB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHRoaXMuaW5wdXRzLmluZGV4T2YoaW5wdXQpO1xuXG4gICAgICAgIGxldCBuZXdwb3MgPSBkaXJlY3Rpb24gPT0gJ3VwJyA/IHBvc2l0aW9uLTEgOiBwb3NpdGlvbiArMTtcblxuICAgICAgICBpZihuZXdwb3MgPT0gLTEgfHwgbmV3cG9zID09IHRoaXMuaW5wdXRzLmxlbmd0aCB8fCAhdGhpcy5pbnB1dHNbbmV3cG9zXSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN3aXRjaChwb3NpdGlvbixuZXdwb3MpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTd2l0Y2ggMiBpbnB1dHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwb3MxXG4gICAgICogQHBhcmFtIHBvczJcbiAgICAgKi9cbiAgICBwdWJsaWMgc3dpdGNoKHBvczEgOiBudW1iZXIsIHBvczI6IG51bWJlcilcbiAgICB7XG4gICAgICAgIGxldCBpbnB1dDEgPSB0aGlzLmlucHV0c1twb3MxXTtcblxuICAgICAgICB0aGlzLmlucHV0c1twb3MxXSA9IHRoaXMuaW5wdXRzW3BvczJdO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzW3BvczJdID0gaW5wdXQxO1xuXG4gICAgICAgIHRoaXMucmVvcmdhbmlzZSgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFsbCBpbnB1dHMgZnJvbSB0cmFja1xuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmVBbGxJbnB1dHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuaW5wdXRzID0gW107XG4gICAgICAgIHRoaXMuJGJvZHkuZmluZCgnI2ZsZCcpLmh0bWwoJycpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBDYWxsZWQgb24gY2xpY2sgb24gdGhlIGR1cGxpY2F0ZSBidXR0b25cbiAgICAgKlxuICAgICAqIEBFdmVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIG9uRHVwbGljYXRlKGlucHV0IDogRUZfSW5wdXQpIDogYW55XG4gICAge1xuXG4gICAgICAgIHRoaXMuYWRkSW5wdXQoaW5wdXQudmFsdWUuYXR0cmlidXRlcy50eXBlLGlucHV0LnZhbHVlKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIEVGX0FkZC5zdWNjZXNzICA9ICdUaGVtIGlucHV0IGhhcyBiZWVuIGR1cGxpY2F0ZWQnO1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UpO1xuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgY2hhbmdlIG9mIHR5cGUgaXMgdHJpZ2dlcmVkXG4gICAgICpcbiAgICAgKiBARXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBvbkNoYW5nZVR5cGUoaW5wdXQgOiBFRl9JbnB1dCkgOiBhbnlcbiAgICB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHRoaXMuaW5wdXRzLmluZGV4T2YoaW5wdXQpO1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IGlucHV0LnZhbHVlO1xuXG4gICAgICAgIHRoaXMuYWRkSW5wdXQodmFsdWUuYXR0cmlidXRlcy50eXBlLHZhbHVlLHBvc2l0aW9uKS50aGVuKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ2ZpZWxkcycpO1xuICAgICAgICAgICAgaW5wdXQub3BlbigpO1xuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBDYWxsZWQgb24gZGVsZXRlIG9mIGFuIGlucHV0LlxuICAgICAqXG4gICAgICogUmVtb3ZlIHRoZSBpbnB1dFxuICAgICAqXG4gICAgICogQEV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgb25EZWxldGUoaW5wdXQgOiBFRl9JbnB1dCkgOiBhbnlcbiAgICB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHRoaXMuaW5wdXRzLmluZGV4T2YoaW5wdXQpO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzLnNwbGljZShwb3NpdGlvbiwxKTtcblxuICAgICAgICB0aGlzLnJlb3JnYW5pc2UoKS50aGVuKCgpID0+IHt9KVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQWRkIGFuIGlucHV0IHRvIHRoZSBlZGl0b3JcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkSW5wdXQodHlwZSA6IHN0cmluZyA9ICd0ZXh0JywkZGF0YSxwb3NpdGlvbiA6IG51bWJlcnxudWxsID0gbnVsbCkgOiBQcm9taXNlPEVGX0lucHV0PlxuICAgIHtcblxuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG5cbiAgICAgICAgRUZfQWRkLmxvYWRpbmcodHJ1ZSwnZmllbGRzJyk7XG5cbiAgICAgICAgLy8gQ2xvc2UgYWxsIHRoZSBpbnB1dHNcbiAgICAgICAgJC5lYWNoKHRoaXMuaW5wdXRzLChrZXkgOiBudW1iZXIsIGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgIGlucHV0LmNsb3NlKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5nZXRJbnB1dCh0eXBlKS50aGVuKChkYXRhIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBpbnB1dCA6IEVGX0lucHV0O1xuXG4gICAgICAgICAgICBpbnB1dCA9IHRoaXMuZ2VuZXJhdGVJbnB1dCh0eXBlKTtcblxuICAgICAgICAgICAgaW5wdXQuaW5pdChkYXRhLHBvc2l0aW9uID8gcG9zaXRpb24gOiB0aGlzLmlucHV0cy5sZW5ndGgsJGRhdGEscG9zaXRpb24pO1xuXG4gICAgICAgICAgICBpbnB1dC5vbkR1cGxpY2F0ZSA9IChpbnB1dCA6IEVGX0lucHV0ICkgPT4geyB0aGlzLm9uRHVwbGljYXRlKGlucHV0KSB9O1xuICAgICAgICAgICAgaW5wdXQub25DaGFuZ2VUeXBlID0gKGlucHV0IDogRUZfSW5wdXQpID0+IHsgdGhpcy5vbkNoYW5nZVR5cGUoaW5wdXQpIH07XG4gICAgICAgICAgICBpbnB1dC5vbkRlbGV0ZSA9IChpbnB1dCA6IEVGX0lucHV0KSA9PiB7IHRoaXMub25EZWxldGUoaW5wdXQpIH07XG4gICAgICAgICAgICBpbnB1dC5vbk1vdmUgPSAoaW5wdXQ6ICBFRl9JbnB1dCwgYWN0aW9uIDogc3RyaW5nKSA9PiB7IHRoaXMub25Nb3ZlKGlucHV0LGFjdGlvbikgfTtcblxuICAgICAgICAgICAgaWYocG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0c1twb3NpdGlvbl0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMucHVzaChpbnB1dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKGlucHV0KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogU2hvdyBvciBoaWRlIHRoZSBsb2FkaW5nc1xuICAgICAqXG4gICAgICogQHBhcmFtIGxvYWRpbmdcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGxvYWRpbmcobG9hZGluZyA6IGJvb2xlYW4gPSB0cnVlLCRlbGVtZW50IDogbnVsbHxzdHJpbmcgPSBudWxsKVxuICAgIHtcbiAgICAgICAgLy8gU2hvdyB0aGUgc3Bpbm5lclxuXG4gICAgICAgIHN3aXRjaCAoJGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNhc2UgJ2ZpZWxkcycgOlxuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLWZpZWxkcycpLnRvZ2dsZShsb2FkaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3V0aWxpdHknIDpcbiAgICAgICAgICAgICAgICAkKCcjc3Bpbm5lci11dGlsaXR5JykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAkKCcjc3Bpbm5lci11dGlsaXR5JykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLWZpZWxkcycpLnRvZ2dsZShsb2FkaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBMb2FkIHRoZSBmb3JtIGRhdGEgZnJvbSB0aGUgYmFjayBvZmZpY2VcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZCgpIDogUHJvbWlzZTxhbnk+XG4gICAge1xuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG4gICAgICAgICQuZ2V0SlNPTihhamF4VXJsLCB7XG4gICAgICAgICAgICBmb3JtX2lkIDogRUZfQWRkLmdldFBhcmFtZXRlcigncG9zdCcpLFxuICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF9mb3JtX2RhdGEnXG4gICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBkYXRhIGZvciBhbGwgdGhlIGZvcm1cbiAgICAgICAgICAgIHRoaXMuYWRkRGF0YShkYXRhLmRhdGEuZm9ybSk7XG4gICAgICAgICAgICB0aGlzLmFkZEZvcm1EYXRhKGRhdGEuZGF0YS5mb3JtKTtcblxuXG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUlucHV0cyA9IGRhdGEuZGF0YS5pbnB1dHM7XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUZvcm1zID0gZGF0YS5kYXRhLmZvcm1zO1xuICAgICAgICAgICAgdGhpcy5kZWZhdWx0SW5wdXRUeXBlcyA9IGRhdGEuZGF0YS5kZWZhdWx0X2lucHV0cztcblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBzdWJtaXQgZGF0YVxuICAgICAgICAgICAgaWYoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdCkge1xuICAgICAgICAgICAgICAgIGxldCBzdWJtaXQgPSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkU3VibWl0RGF0YShzdWJtaXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMb2FkIGFsbCB0aGUgaW5wdXRzXG4gICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLDApLnRoZW4oKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dHMuZm9yRWFjaCgodmFsdWUgOiBFRl9JbnB1dCxrZXkgOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dHNba2V5XS5kaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFkZFJlcXVpcmVkRmllbGRzKGRhdGEuZGF0YS5mb3JtLnR5cGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkUG9zc2libGVGaWVsZHMoKTtcbiAgICAgICAgICAgIH0pO1xuXG5cblxuICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgZGF0YSBpbnNpZGUgdGhlIGZvcm0gPGh0bWw+IGVsZW1lbnRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZERhdGEoJGZvcm1EYXRhIDogYW55KSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbEluZm9zKCQoZWxlbSksJGZvcm1EYXRhKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJhdHRyaWJ1dGVzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBldmVudCA6IFRoZSA8c2VsZWN0PiBlbGVtZW50IGZvcm0gdHlwZSBpcyBjaGFuZ2VkXG4gICAgICpcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgOlxuICAgICAqIC0gQWRkIHRoZSBmb3JtIGRhdGEgd2l0aGluIHRoZSBuZXcgZm9ybSBhbmQgbG9hZCB0aGUgcmlnaHQgdGVtcGxhdGVcbiAgICAgKiAtIExvYWQgdGhlIHJlcXVpcmVkIGZpZWxkcyBvZiB0aGUgZm9ybVxuICAgICAqIC0gTG9hZCB0aGUgcG9zc2libGUgZmllbGRzIG9mIHRoZSBmb3JtXG4gICAgICpcbiAgICAgKiBAc2luY2UgMi4wLjBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNoYW5nZUZvcm1UeXBlKHR5cGUpIDogdm9pZFxuICAgIHtcblxuICAgICAgICBFRl9BZGQubG9hZGluZyh0cnVlLCd1dGlsaXR5Jyk7XG5cbiAgICAgICAgbGV0ICRmb3JtRGF0YSA9IHRoaXMuZm9ybVR5cGUudmFsdWU7XG5cbiAgICAgICAgJGZvcm1EYXRhLnR5cGUgPSB0eXBlO1xuXG4gICAgICAgIHRoaXMuYWRkRm9ybURhdGEoJGZvcm1EYXRhKTtcbiAgICAgICAgdGhpcy5hZGRSZXF1aXJlZEZpZWxkcygkZm9ybURhdGEudHlwZSk7XG4gICAgICAgIHRoaXMuYWRkUG9zc2libGVGaWVsZHMoKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogRGlzcGxheSB0aGUgbGlzdCBvZiBwb3NzaWJsZSBmaWVsZHMgYWNjb3JkaW5nIHRvIHRoZSB0eXBlIG9mIGZvcm0gc2VsZWN0ZWQuXG4gICAgICpcbiAgICAgKiBFeGVtcGxlIDogVXNlciBmb3JtIGhhcyB0aGUgZm9sbG93aW5nIGZpZWxkcyBhdmFpbGFibGUgOlxuICAgICAqXG4gICAgICogLSBmaXJzdF9uYW1lXG4gICAgICogLSBsYXN0X25hbWVcbiAgICAgKiAtIGNvbnRlbnRcbiAgICAgKlxuICAgICAqIFRoZXNlIGZpZWxkcyBhcmUgbm90IG1hbmRhdG9yeSBidXQgYXJlIGEgcGx1cyBpbiB0aGUgZm9ybSB0eXBlLlxuICAgICAqXG4gICAgICogRnVydGhlcm1vcmUgdGhleSBhcmUgaGFuZGxlZCBkaWZmZXJlbnRseSB0aGFuIG90aGVyIHR5cGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYWRkUG9zc2libGVGaWVsZHMoKVxuICAgIHtcblxuICAgICAgICBsZXQgY3VycmVudCA9IHRoaXMuYXZhaWxhYmxlRm9ybXNbdGhpcy5nZXRGb3JtVHlwZSgpXTtcblxuICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50LnJlcXVpcmVkKTtcbiAgICAgICAgLy8gU2xpY2UgaXMgdXNlZCBoZXJlIHRvIGNsb25lIHRoZSBvYmplY3RcbiAgICAgICAgbGV0IHBvc3NpYmxlRmllbGRzID0gY3VycmVudC5wb3NzaWJsZS5jb25jYXQoY3VycmVudC5yZXF1aXJlZCk7XG5cbiAgICAgICAgY29uc29sZS5sb2cocG9zc2libGVGaWVsZHMpO1xuXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9IHRoaXMuJGJvZHkuZmluZCgnI3Bvc3NpYmxlLWZpZWxkJykuaHRtbCgpO1xuXG4gICAgICAgIGxldCBlbGVtID0gdGhpcy4kYm9keS5maW5kKCcjcG9zc2libGUtZmllbGRzJyk7XG5cbiAgICAgICAgLy8gUmVzZXQgdGhlIGZpZWxkcyBkaXNwbGF5ZWRcbiAgICAgICAgZWxlbS5odG1sKCcnKTtcblxuICAgICAgICAvLyBJIGRvbid0IHNob3cgdGhlIGlucHV0cyB0aGF0IGFyZSBhbHJlYWR5IGluIHRoZSBmb3JtXG4gICAgICAgIHRoaXMuaW5wdXRzLmZvckVhY2goKGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHBvc3NpYmxlRmllbGRzLmluZGV4T2YoaW5wdXQubmFtZSk7XG5cbiAgICAgICAgICAgIGlmKGluZGV4ICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgcG9zc2libGVGaWVsZHMuc3BsaWNlKGluZGV4LDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZihwb3NzaWJsZUZpZWxkcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgJCgnI3Bvc3NpYmxlLWZpZWxkcy1sYWJlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJyNwb3NzaWJsZS1maWVsZHMtbGFiZWwnKS5zaG93KCk7XG5cblxuICAgICAgICBwb3NzaWJsZUZpZWxkcy5mb3JFYWNoKChpbnB1dF9uYW1lIDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBsZXQgX3RlbXBsYXRlID0gJCh0ZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgIF90ZW1wbGF0ZS5hdHRyKCduYW1lJyxpbnB1dF9uYW1lKTtcbiAgICAgICAgICAgIF90ZW1wbGF0ZS5odG1sKGlucHV0X25hbWUpO1xuXG4gICAgICAgICAgICBlbGVtLmFwcGVuZChfdGVtcGxhdGUpO1xuXG4gICAgICAgICAgICBfdGVtcGxhdGUub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGlucHV0ID0gdGhpcy5nZXRBdmFpbGFibGVJbnB1dERhdGEoaW5wdXRfbmFtZSk7XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5hdHRyaWJ1dGVzLm5hbWUgPSBpbnB1dF9uYW1lO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRJbnB1dChpbnB1dC5hdHRyaWJ1dGVzLnR5cGUsaW5wdXQpLnRoZW4oKGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRQb3NzaWJsZUZpZWxkcygpO1xuICAgICAgICAgICAgICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSwnZmllbGRzJyk7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfSlcblxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCB0aGUgZm9ybSBkYXRhIGluIHRoZSBmb3JtIHR5cGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZm9ybURhdGFcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYWRkRm9ybURhdGEoJGZvcm1EYXRhKSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgdGhpcy5sb2FkRm9ybVRlbXBsYXRlKCRmb3JtRGF0YS50eXBlKS50aGVuKCgkdGVtcGxhdGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybVR5cGUgPSB0aGlzLmdlbmVyYXRlRm9ybSgkZm9ybURhdGEudHlwZSk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9ybVR5cGUuaW5pdCgkdGVtcGxhdGUpO1xuXG4gICAgICAgICAgICAkKCcjZWYtYWRkLXR5cGUnKS5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxJbmZvcygkKGVsZW0pLCRmb3JtRGF0YSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ3V0aWxpdHknKTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGZvcm1UeXBlXG4gICAgICovXG4gICAgcHVibGljIGFkZFJlcXVpcmVkRmllbGRzKGZvcm1UeXBlIDogc3RyaW5nKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBfcmVxdWlyZWQgPSB0aGlzLmF2YWlsYWJsZUZvcm1zW2Zvcm1UeXBlXS5yZXF1aXJlZDtcblxuICAgICAgICAvLyBIZXJlIHdlIGFkZCB0aGUgY29uY2F0IHRvIGNsb25lIHRoZSBvYmplY3RcbiAgICAgICAgbGV0IHJlcXVpcmVkID0gX3JlcXVpcmVkLmNvbmNhdChbXSk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVVbnRvdWNoZWRJbnB1dHMoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICQuZWFjaCh0aGlzLmlucHV0cywoa2V5IDogc3RyaW5nLCBpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSAkLmluQXJyYXkoaW5wdXQudmFsdWUuYXR0cmlidXRlcy5uYW1lLHJlcXVpcmVkKTtcbiAgICAgICAgICAgICAgICBpZihpbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgaW5wdXRzID0gW107XG5cblxuICAgICAgICAgICAgJC5lYWNoKHJlcXVpcmVkLChrZXkgOiBudW1iZXIsaW5wdXROYW1lIDogc3RyaW5nKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIGRlZmF1bHQgdmFsdWVzIGluc2lkZVxuICAgICAgICAgICAgICAgIGxldCBpbnB1dCA9IHRoaXMuZ2V0QXZhaWxhYmxlSW5wdXREYXRhKGlucHV0TmFtZSk7XG5cbiAgICAgICAgICAgICAgICBpbnB1dC5hdHRyaWJ1dGVzLm5hbWUgPSBpbnB1dE5hbWU7XG5cbiAgICAgICAgICAgICAgICBpbnB1dHMucHVzaChpbnB1dCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZihpbnB1dHMgJiYgaW5wdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoaW5wdXRzLCAwKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgRUZfQWRkLnN1Y2Nlc3MgPSAnVGhlIGZpZWxkcyAnICsgcmVxdWlyZWQuam9pbignLCAnKSArICcgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBmb3JtJztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYWxsIHRoZSBpbnB1dHMgYWRkZWQgYnkgY2hhbmdpbmcgdGhlIHR5cGUgb2YgZm9ybVxuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmVVbnRvdWNoZWRJbnB1dHMoKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgbGV0IGlucHV0cyA9IFtdO1xuXG4gICAgICAgICQuZWFjaCh0aGlzLmlucHV0cywoa2V5IDogbnVtYmVyLCBpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChpbnB1dC5kaXJ0eSkge1xuICAgICAgICAgICAgICAgIGlucHV0cy5wdXNoKGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pbnB1dHMgPSBpbnB1dHM7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVvcmdhbmlzZSgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gdGhlIHR5cGUgb2YgaW5wdXQgYWNjb3JkaW5nIHRvIGl0cyBuYW1lXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXROYW1lXG4gICAgICovXG4gICAgcHVibGljIGdldEF2YWlsYWJsZUlucHV0RGF0YShpbnB1dE5hbWUgOiBzdHJpbmcpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgaW5wdXQ7XG5cbiAgICAgICAgbGV0IHR5cGUgPSB0aGlzLmdldERlZmF1bHRUeXBlRnJvbU5hbWUoaW5wdXROYW1lKTtcblxuICAgICAgICBpZih0aGlzLmF2YWlsYWJsZUlucHV0c1t0eXBlXSkge1xuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLmF2YWlsYWJsZUlucHV0c1t0eXBlXS5kYXRhO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBpbnB1dCA9IHRoaXMuYXZhaWxhYmxlSW5wdXRzWyd0ZXh0J10uZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIHRoZSBkZWZhdWx0IHR5cGUgb2YgYSBmaWVsZCBhY2NvcmRpbmcgdG8gaXRzIG5hbWVcbiAgICAgKlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICovXG4gICAgcHVibGljIGdldERlZmF1bHRUeXBlRnJvbU5hbWUobmFtZSA6IHN0cmluZykgOiBzdHJpbmdcbiAgICB7XG4gICAgICAgIC8vIERlZmF1bHQgdHlwZVxuICAgICAgICBsZXQgdHlwZSA9ICd0ZXh0JztcblxuICAgICAgICBpZih0aGlzLmRlZmF1bHRJbnB1dFR5cGVzW25hbWVdKSB7XG4gICAgICAgICAgICB0eXBlID0gdGhpcy5kZWZhdWx0SW5wdXRUeXBlc1tuYW1lXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHVibGljIGxvYWRGb3JtVGVtcGxhdGUodHlwZSA6IHN0cmluZykgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgbGV0IGtleSA9ICdmb3JtLScgKyB0eXBlO1xuXG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlc1trZXldICYmIHRoaXMudGVtcGxhdGVzW2tleV0gIT0gdW5kZWZpbmVkICYmIHRoaXMudGVtcGxhdGVzW2tleV0gIT0gJycpIHtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKHRoaXMudGVtcGxhdGVzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkLmdldChhamF4VXJsLCB7XG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ2FjdGlvbnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlIDogdHlwZSxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX3RlbXBsYXRlJ1xuICAgICAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNba2V5XSA9IGRhdGEuZGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIEkgc2VuZCBiYWNrIHRoZSBkYXRhXG4gICAgICAgICAgICAgICAgZGZkLnJlc29sdmUoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgIH0pLmVycm9yKHRoaXMuaGFuZGxlRXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogRmlsbCBmb3JtIGRhdGEgdGhlIGluZm9zIGluc2lkZSB0aGUgZWRpdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1cbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHVibGljIGZpbGxJbmZvcygkZWxlbSwkZm9ybURhdGEpIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJGVsZW0pO1xuXG4gICAgICAgIGlmKCRmb3JtRGF0YVtwcm9wLmF0dHJdICYmICRmb3JtRGF0YVtwcm9wLmF0dHJdW3Byb3AuaWRdKSB7XG5cbiAgICAgICAgICAgIEVGX0lucHV0LnNldElucHV0VmFsdWUoJGVsZW0sJGZvcm1EYXRhW3Byb3AuYXR0cl1bcHJvcC5pZF0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCB0aGUgZGF0YSBpbnNpZGUgdGhlIHN1Ym1pdCBidXR0b25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdWJtaXRcbiAgICAgKi9cbiAgICBwcml2YXRlIGFkZFN1Ym1pdERhdGEoc3VibWl0KSA6IHZvaWRcbiAgICB7XG4gICAgICAgIEVGX0lucHV0LmFkZERhdGFUb0VsZW1lbnQodGhpcy4kYm9keS5maW5kKCcjZWYtYWRkLXN1Ym1pdCcpLHN1Ym1pdCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIExvYWQgYWxsIHRoZSBpbnB1dHMgZnJvbSB0aGUgbGlzdFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0c1xuICAgICAqIEBwYXJhbSBkZmRcbiAgICAgKiBAcGFyYW0gb3JkZXJcbiAgICAgKi9cbiAgICBwcml2YXRlIGxvYWRJbnB1dHMoaW5wdXRzIDogeyBhdHRyaWJ1dGVzIDoge3R5cGUgOiBzdHJpbmcgfX1bXSxvcmRlciA6IG51bWJlcixkZmQgIDogYW55ID0gbnVsbCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIGlmKCFkZmQpIHtcbiAgICAgICAgICAgIGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKGlucHV0cyk7XG5cbiAgICAgICAgbGV0IGtleSA9IGtleXNbb3JkZXJdO1xuXG4gICAgICAgIGlmKCFrZXkgfHwgIWlucHV0cyB8fCAhaW5wdXRzW2tleV0pe1xuICAgICAgICAgICAgdGhpcy5pc19pbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmFkZElucHV0KGlucHV0c1trZXldLmF0dHJpYnV0ZXMudHlwZSxpbnB1dHNba2V5XSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgb3JkZXIrKztcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoaW5wdXRzLG9yZGVyLGRmZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuXG4gICAgcHVibGljIGdlbmVyYXRlRm9ybSh0eXBlIDogc3RyaW5nKSA6IEVGX0Zvcm1cbiAgICB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBFRl9Gb3JtKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICBsZXQgZm9ybTtcblxuICAgICAgICAgaWYoIXRoaXMuYXZhaWxhYmxlRm9ybXNbdHlwZV0pIHtcbiAgICAgICAgICAgIHR5cGUgPSAncG9zdCc7XG4gICAgICAgIH1cblxuICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdsb2dpbicgOlxuICAgICAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncG9zdCcgOlxuICAgICAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgICBpZighZm9ybSkge1xuICAgICAgICAgICAgZm9ybSA9IG5ldyBFRl9Gb3JtKCk7XG4gICAgICAgIH1cblxuICAgICAgICAgcmV0dXJuIGZvcm07XG4gICAgICAgICAqKi9cblxuICAgIH1cblxuXG5cbiAgICBwdWJsaWMgZ2V0Rm9ybVR5cGUoKSA6IHN0cmluZ1xuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGJvZHkuZmluZCgnKltuYW1lPVwic2V0dGluZ3NbdHlwZV1cIl0nKS52YWwoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHVibGljIGdlbmVyYXRlSW5wdXQodHlwZSA6IHN0cmluZykgOiBFRl9JbnB1dFxuICAgIHtcbiAgICAgICAgbGV0IGlucHV0O1xuXG4gICAgICAgIGlmKCF0aGlzLmF2YWlsYWJsZUlucHV0c1t0eXBlXSkge1xuICAgICAgICAgICAgdHlwZSA9ICd0ZXh0JztcbiAgICAgICAgfVxuXG5cbiAgICAgICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgICAgICAgIGlucHV0ID0gbmV3IEVGX0lucHV0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZighaW5wdXQpIHtcbiAgICAgICAgICAgIGlucHV0ID0gbmV3IEVGX0lucHV0KCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiBpbnB1dDtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBMb2FkIHRoZSBpbnB1dCB0ZW1wbGF0ZSBmcm9tIHRoZSBCT1xuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGUgOiBzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRJbnB1dCh0eXBlIDogc3RyaW5nID0gJ3RleHQnKVxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXNbdHlwZV0gJiYgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gIT0gdW5kZWZpbmVkICYmIHRoaXMudGVtcGxhdGVzW3R5cGVdICE9ICcnKSB7XG4gICAgICAgICAgICBkZmQucmVzb2x2ZSh0aGlzLnRlbXBsYXRlc1t0eXBlXSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQuZ2V0KGFqYXhVcmwsIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnaW5wdXRzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA6IHR5cGUsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF90ZW1wbGF0ZSdcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW3R5cGVdID0gZGF0YS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhLmRhdGEpO1xuICAgICAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIEhUVFAgRXJyb3JzXG4gICAgICpcbiAgICAgKiBAVE9ET1xuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVFcnJvcihkYXRhIDogc3RyaW5nfHtyZXNwb25zZUpTT04gOiB7ZXJyb3J9fSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIGxldCBlcnJvciA6IHN0cmluZztcblxuICAgICAgICBpZih0eXBlb2YgZGF0YSAhPSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBlcnJvciA9IGRhdGEucmVzcG9uc2VKU09OLmVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgRUZfQWRkLmVycm9yID0gZXJyb3I7XG4gICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlKTtcblxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEdldCB0aGUgdXJsIHBhcmFtZXRlclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtZXRlclxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRQYXJhbWV0ZXIocGFyYW1ldGVyIDogc3RyaW5nKTphbnlcbiAgICB7XG4gICAgICAgIHZhciBwYXJhbXNfc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSk7XG5cbiAgICAgICAgdmFyIHBhcmFtc19hcnJheSA9IHBhcmFtc19zdHJpbmcuc3BsaXQoJyYnKTtcblxuICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgIGZvcih2YXIgaSA9MDtpPHBhcmFtc19hcnJheS5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZSA9IHBhcmFtc19hcnJheVtpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgb2JqW2VbMF1dID0gZVsxXVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9ialtwYXJhbWV0ZXJdO1xuICAgIH1cblxuXG5cblxuICAgIC8qKlxuICAgICAqIERpc3BsYXkgYW4gZXJyb3IgbWVzc2FnZSB0aGF0IHdpbGwgZmFkZSBvdXQgaW4gNSBzZWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlcnJvck1lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCBlcnJvcihlcnJvck1lc3NhZ2UgOiBzdHJpbmd8Ym9vbGVhbikge1xuXG4gICAgICAgIEVGX0FkZC5zZXRNZXNzYWdlKCcjZXJyb3ItbWVzc2FnZScsZXJyb3JNZXNzYWdlLGZhbHNlKTtcblxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIERpc3BsYXkgYSBzdWNjZXNzIG1lc3NhZ2UgdGhhdCB3aWxsIGZhZGUgb3V0IGluIDUgc2VjXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3VjY2Vzc01lc3NhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldCBzdWNjZXNzKHN1Y2Nlc3NNZXNzYWdlOiBzdHJpbmd8Ym9vbGVhbikge1xuXG4gICAgICAgIEVGX0FkZC5zZXRNZXNzYWdlKCcjc3VjY2Vzcy1tZXNzYWdlJyxzdWNjZXNzTWVzc2FnZSxmYWxzZSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICogQHBhcmFtIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0gcGVyc2lzdCA6IGJvb2xlYW4sIFdlaXRoZXIgb3Igbm90IHRoZSBtZXNzYWdlIHNob3VsZCBiZSBkaXNwbGF5ZWQgb3Igbm90XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXRNZXNzYWdlKGVsZW1lbnQgOiBzdHJpbmcsbWVzc2FnZSA6IHN0cmluZ3xib29sZWFuLCBwZXJzaXN0IDogYm9vbGVhbnxudW1iZXIgPSBmYWxzZSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgIGlmKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkudGV4dChtZXNzYWdlKS5mYWRlSW4oMjAwKTtcblxuICAgICAgICAgICAgaWYoIXBlcnNpc3QpIHtcblxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHBlcnNpc3QgaXMgbm90IGVxdWFsIHRvIGZhbHNlXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHBlcnNpc3QgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcnNpc3QgPSA1MDAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1lc3NhZ2UoZWxlbWVudCwnJyk7XG4gICAgICAgICAgICAgICAgfSxwZXJzaXN0KTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkuZmFkZU91dCgyMDAsKCkgPT4ge1xuICAgICAgICAgICAgICAgICQoZWxlbWVudCkudGV4dCgnJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG52YXIgRUZfYWRkID0gbmV3IEVGX0FkZCgpO1xuRUZfYWRkLmluaXQoKTsiXX0=
