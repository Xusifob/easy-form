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
                 * @param type
                 */
                EF_Add.prototype.addRequiredFields = function(type) {
                    var required = this.availableForms[type].required;
                    console.log(this.inputs);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2lucHV0cy9FRl9JbnB1dC50cyIsImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2Zvcm1zL0VGX0Zvcm0udHMiLCJhc3NldHMvYWRtaW4vanMvc3JjL2FkZC9FRl9BZGQudHMiXSwibmFtZXMiOlsiRUZfSW5wdXQiLCJ0aGlzIiwiY29udGFpbmVyIiwiJCIsInByb3RvdHlwZSIsImluaXQiLCIkZWxlbWVudCIsImlkIiwiJGRhdGEiLCJwb3NpdGlvbiIsInJlcGxhY2UiLCJlbGVtZW50Iiwib3B0aW9uc0VsZW1lbnQiLCJmaW5kIiwiYXBwZW5kIiwicmVwbGFjZVdpdGgiLCJzZXRFdmVudHMiLCJhZGREYXRhIiwiX3RoaXMiLCJvZmYiLCJvbiIsInRvZ2dsZSIsIm9uRHVwbGljYXRlIiwib25DaGFuZ2VUeXBlIiwib25EZWxldGUiLCJvbk1vdmUiLCJlbGVtIiwiaGFzQ2xhc3MiLCJjbG9zZSIsIm9wZW4iLCJhZGREYXRhVG9FbGVtZW50IiwiZWFjaCIsImtleSIsInByb3AiLCJnZXRJbnB1dFByb3BlcnRpZXMiLCJuYW1lIiwic2V0SW5wdXRWYWx1ZSIsImlucHV0IiwidmFsdWUiLCJpcyIsInZhbCIsImdldElucHV0VmFsdWUiLCJhdHRyIiwiZGF0YSIsInNwbGl0IiwiaGlkZSIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJodG1sIiwic2hvdyIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwidHlwZSIsIkVGX0Zvcm0iLCJFRl9JbnB1dF8xIiwiRUZfQWRkIiwidGVtcGxhdGVzIiwiaW5wdXRzIiwiYXZhaWxhYmxlSW5wdXRzIiwiYXZhaWxhYmxlRm9ybXMiLCJpc19pbml0IiwiJGJvZHkiLCJsb2FkIiwidGhlbiIsImFkZElucHV0IiwibG9hZGluZyIsIiRldmVudCIsInRhcmdldCIsImNoYW5nZUZvcm1UeXBlIiwicmVvcmdhbmlzZSIsInB1c2giLCJyZW1vdmVBbGxJbnB1dHMiLCJsb2FkSW5wdXRzIiwiZGlyZWN0aW9uIiwiaW5kZXhPZiIsIm5ld3BvcyIsImNvbnNvbGUiLCJsb2ciLCJsZW5ndGgiLCJzd2l0Y2giLCJwb3MxIiwicG9zMiIsImlucHV0MSIsImF0dHJpYnV0ZXMiLCJzdWNjZXNzIiwic3BsaWNlIiwiZGZkIiwiRGVmZXJyZWQiLCJnZXRJbnB1dCIsImdlbmVyYXRlSW5wdXQiLCJhY3Rpb24iLCJyZXNvbHZlIiwicHJvbWlzZSIsImdldEpTT04iLCJhamF4VXJsIiwiZm9ybV9pZCIsImdldFBhcmFtZXRlciIsImZvcm0iLCJhZGRGb3JtRGF0YSIsImZvcm1zIiwic3VibWl0IiwiYWRkU3VibWl0RGF0YSIsImFkZFJlcXVpcmVkRmllbGRzIiwiZXJyb3IiLCJoYW5kbGVFcnJvciIsIiRmb3JtRGF0YSIsImZpbGxJbmZvcyIsImZvcm1UeXBlIiwibG9hZEZvcm1UZW1wbGF0ZSIsIiR0ZW1wbGF0ZSIsImdlbmVyYXRlRm9ybSIsInJlcXVpcmVkIiwiaW5kZXgiLCJpbkFycmF5Iiwiam9pbiIsInVuZGVmaW5lZCIsImdldCIsInRlbXBsYXRlIiwiJGVsZW0iLCIkZm9ybSIsIkVGX0lucHV0XzIiLCJvcmRlciIsImtleXMiLCJFRl9Gb3JtXzEiLCJyZXNwb25zZUpTT04iLCJwYXJhbWV0ZXIiLCJwYXJhbXNfc3RyaW5nIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJzdWJzdHIiLCJwYXJhbXNfYXJyYXkiLCJvYmoiLCJpIiwiZSIsImVycm9yTWVzc2FnZSIsInNldE1lc3NhZ2UiLCJzdWNjZXNzTWVzc2FnZSIsIm1lc3NhZ2UiLCJwZXJzaXN0IiwidGV4dCIsImZhZGVJbiIsInNldFRpbWVvdXQiLCJmYWRlT3V0IiwiRUZfYWRkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztnQkFtREksU0FBQUE7b0JBRUlDLEtBQUtDLFlBQVlDLEVBQUU7Ozs7Ozs7OztnQkFZaEJILFNBQUFJLFVBQUFDLE9BQVAsU0FBWUMsVUFBZ0JDLElBQVlDLE9BQVlDO29CQUFBLElBQUFBLGtCQUFBLEdBQUE7d0JB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QyxlQUFrQkksUUFBQTs7Ozs7Ozt5QkFBbEIsU0FBMEJrRjt3QkFFdEJsRixPQUFPaUYsV0FBVyxvQkFBbUJDLGdCQUFlOzs7Ozs7Ozs7OztnQkFVMUNsRixPQUFBaUYsYUFBZCxTQUF5QjdILFNBQWlCK0gsU0FBMEJDO29CQUFwRSxJQUFBekgsUUFBQWpCO29CQUFvRSxJQUFBMEksaUJBQUEsR0FBQTt3QkFBQUEsVUFBQTs7b0JBR2hFLElBQUdELFNBQVM7d0JBQ1J2SSxFQUFFUSxTQUFTaUksS0FBS0YsU0FBU0csT0FBTzt3QkFFaEMsS0FBSUYsU0FBUzs7NEJBR1QsV0FBVUEsWUFBWSxXQUFXO2dDQUM3QkEsVUFBVTs7NEJBR2RHLFdBQVc7Z0NBQ1A1SCxNQUFLc0gsV0FBVzdILFNBQVE7K0JBQzFCZ0k7OzJCQUlKO3dCQUNGeEksRUFBRVEsU0FBU29JLFFBQVEsS0FBSTs0QkFDbkI1SSxFQUFFUSxTQUFTaUksS0FBSzs7OztnQkFLaEMsT0FBQXJGOztZQUVJeUYsU0FBUyxJQUFJekY7WUFDakJ5RixPQUFPM0kiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuZGVjbGFyZSB2YXIgJCA6IGFueTtcblxuZXhwb3J0IGNsYXNzIEVGX0lucHV0XG57XG5cbiAgICAvKipcbiAgICAgKiBAdmFyIHN0cmluZ1xuICAgICAqXG4gICAgICogVGhlIHR5cGUgb2YgdGhlIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyB0eXBlIDogc3RyaW5nID0gJ3RleHQnO1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIEhUTUwgRWxlbWVudFxuICAgICAqXG4gICAgICogVGhlIGh0bWwgZWxlbWVudCBvZiB0aGUgaW5wdXRcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBlbGVtZW50IDogYW55O1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIEhUTUwgRWxlbWVudFxuICAgICAqXG4gICAgICogVGhlIGh0bWwgZWxlbWVudCBmb3IgdGhlIG9wdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBvcHRpb25zRWxlbWVudCA6IGFueTtcblxuXG4gICAgLyoqXG4gICAgICogVGhlIGlkIChwb3NpdGlvbikgb2YgdGhlIGlucHV0XG4gICAgICovXG4gICAgcHVibGljIGlkIDogbnVtYmVyO1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBlbGVtZW50IG9mIHRoZSBjb250YWluZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgY29udGFpbmVyIDogYW55O1xuXG5cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiBjYWxsZWQgb24gZHVwbGljYXRlXG4gICAgICovXG4gICAgcHVibGljIG9uRHVwbGljYXRlIDogYW55O1xuICAgIHB1YmxpYyBvbkNoYW5nZVR5cGUgOiBhbnk7XG4gICAgcHVibGljIG9uRGVsZXRlIDogYW55O1xuICAgIHB1YmxpYyBvbk1vdmUgOiBhbnk7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIgPSAkKCcjZmxkJyk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICogQHBhcmFtIGlkXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIDogbnVtYmVyXG4gICAgICovXG4gICAgcHVibGljIGluaXQoJGVsZW1lbnQgOiBhbnksIGlkIDogbnVtYmVyLCRkYXRhIDogYW55LHBvc2l0aW9uIDogbnVsbHxudW1iZXIgPSBudWxsKVxuICAgIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgICAgICRlbGVtZW50ID0gJGVsZW1lbnQucmVwbGFjZSgvZmllbGRVbklkL2csaWQrMSk7XG4gICAgICAgICRlbGVtZW50ID0gJGVsZW1lbnQucmVwbGFjZSgvZmllbGRJZC9nLGlkKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKCRlbGVtZW50KTtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudCA9IHRoaXMuZWxlbWVudC5maW5kKCcuZWYtdGFibGUnKTtcblxuICAgICAgICBpZihudWxsID09PSBwb3NpdGlvbikge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmZpbmQoJyNmaWVsZC0nICsgcG9zaXRpb24pLnJlcGxhY2VXaXRoKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuXG4gICAgICAgIHRoaXMuYWRkRGF0YSgkZGF0YSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBTZXQgYWxsIHRoZSBldmVudHMgbGlua2VkIHRvIHRoaXMgZWxlbWVudFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRFdmVudHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJvcGVuLWNsb3NlXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3JldHVybiB0aGlzLnRvZ2dsZSgpfSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJkdXBsaWNhdGVcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7dGhpcy5vbkR1cGxpY2F0ZSh0aGlzKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwiY2hhbmdlLXR5cGVcIl0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywoKSA9PiB7dGhpcy5vbkNoYW5nZVR5cGUodGhpcyk7IHJldHVybiBmYWxzZTt9KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cImRlbGV0ZVwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHt0aGlzLm9uRGVsZXRlKHRoaXMpOyByZXR1cm4gZmFsc2U7fSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJ1cFwiXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCgpID0+IHt0aGlzLm9uTW92ZSh0aGlzLCd1cCcpOyByZXR1cm4gZmFsc2U7fSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJkb3duXCJdJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsKCkgPT4ge3RoaXMub25Nb3ZlKHRoaXMsJ2Rvd24nKTsgcmV0dXJuIGZhbHNlO30pO1xuICAgIH1cblxuXG5cblxuICAgIC8qKlxuICAgICAqIENsb3NlIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgcHVibGljIHRvZ2dsZSgpOiBib29sZWFuXG4gICAge1xuXG4gICAgICAgIGxldCBlbGVtID0gdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cIm9wZW4tY2xvc2VcIl0nKTtcblxuICAgICAgICBpZigkKGVsZW0pLmhhc0NsYXNzKCdtaW5pZnknKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3BlbigpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEluc2VydCB0aGUgZGF0YSBpbiB0aGUgdGVtcGxhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBhZGREYXRhKCRkYXRhKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIEVGX0lucHV0LmFkZERhdGFUb0VsZW1lbnQodGhpcy5lbGVtZW50LCRkYXRhKVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gJGRhdGFcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFkZERhdGFUb0VsZW1lbnQoJGVsZW1lbnQgOiBhbnksICRkYXRhIDogYW55KSA6IHZvaWRcbiAgICB7XG4gICAgICAgICRlbGVtZW50LmZpbmQoJ1tuYW1lXj1cImZpZWxkXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJChlbGVtKSk7XG5cbiAgICAgICAgICAgIGlmKCRkYXRhW3Byb3AucHJvcF0gJiYgJGRhdGFbcHJvcC5wcm9wXVtwcm9wLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgRUZfSW5wdXQuc2V0SW5wdXRWYWx1ZSgkKGVsZW0pLCRkYXRhW3Byb3AucHJvcF1bcHJvcC5uYW1lXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgYSB2YWx1ZSB0byBhbiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXRJbnB1dFZhbHVlKGlucHV0IDogYW55LCB2YWx1ZSA6IHN0cmluZ3xib29sZWFuKVxuICAgIHtcbiAgICAgICAgaWYoaW5wdXQuaXMoJzpjaGVja2JveCcpKXtcbiAgICAgICAgICAgIGlmKHZhbHVlID09ICdvbicpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnB1dC5wcm9wKCdjaGVja2VkJyx2YWx1ZSk7XG4gICAgICAgIH1lbHNlIGlmKGlucHV0LmlzKCdzZWxlY3QnKSl7XG4gICAgICAgICAgICBpbnB1dC5maW5kKCdvcHRpb25bdmFsdWU9XCInKyB2YWx1ZSArJ1wiXScpLnByb3AoJ3NlbGVjdGVkJyx0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgaW5wdXQudmFsKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBHZXQgdGhlIHZhbHVlIG9mIGFuIGlucHV0XG4gICAgICpcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqIEByZXR1cm5zIGFueVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5wdXRWYWx1ZShpbnB1dCA6IGFueSlcbiAgICB7XG5cbiAgICAgICAgaWYodHlwZW9mIGlucHV0LnZhbCAhPSAnZnVuY3Rpb24nKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYoaW5wdXQuaXMoJzpjaGVja2JveCcpKXtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5pcygnOmNoZWNrZWQnKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQudmFsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gYWxsIHRoZSBwcm9wZXJ0aWVzIG9mIGFuIGlucHV0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5wdXRQcm9wZXJ0aWVzKGVsZW0gOiBhbnkpIDoge2F0dHIsaWQscHJvcCxuYW1lfVxuICAgIHtcblxuICAgICAgICBsZXQgbmFtZSA9IGVsZW0uYXR0cignbmFtZScpO1xuXG4gICAgICAgIGxldCBkYXRhID0gbmFtZS5zcGxpdCgnWycpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhdHRyIDogZGF0YVswXS5yZXBsYWNlKCddJywnJyksXG4gICAgICAgICAgICBpZCA6IGRhdGFbMV0ucmVwbGFjZSgnXScsJycpLFxuICAgICAgICAgICAgcHJvcCA6IGRhdGFbMl0gPyBkYXRhWzJdLnJlcGxhY2UoJ10nLCcnKSA6ICcnLFxuICAgICAgICAgICAgbmFtZSA6IGRhdGFbM10gPyBkYXRhWzNdLnJlcGxhY2UoJ10nLCcnKSA6ICcnLFxuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAc2luY2UgMS4xLjBcbiAgICAgKlxuICAgICAqIEBldmVudCA6IENsaWNrIG9uIG1pbmlmeSBidXR0b24gOiBoaWRlIHRoZSBvcHRpb25zIG9mIHRoZSBmaWVsZFxuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xvc2UoKSA6IGJvb2xlYW5cbiAgICB7XG4gICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQuaGlkZSgyMDApO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLm1pbmlmeScpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ21pbmlmeScpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ29wZW4nKVxuICAgICAgICAgICAgLmh0bWwoJysnKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBzaW5jZSAxLjEuMFxuICAgICAqXG4gICAgICogT3BlbiBhIGZpZWxkXG4gICAgICpcbiAgICAgKiBAZXZlbnQgOiBDbGljayBvbiBvcGVuIGJ1dHRvbiwgc2hvdyB0aGUgZmllbGQgb3B0aW9uc1xuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgb3BlbigpIDogYm9vbGVhblxuICAgIHtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudC5zaG93KDIwMCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcub3BlbicpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ29wZW4nKVxuICAgICAgICAgICAgLmFkZENsYXNzKCdtaW5pZnknKVxuICAgICAgICAgICAgLmh0bWwoJy0nKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJldHVybiB0aGUgdmFsdWUgb2YgYWxsIHRoZSBpbnB1dHMgaW4gdGhlIGZpZWxkXG4gICAgICpcbiAgICAgKi9cbiAgICBnZXQgdmFsdWUoKTogYW55IHtcblxuICAgICAgICBsZXQgdmFsdWUgPSB7fTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW25hbWVePVwiZmllbGRcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsaW5wdXQgOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJChpbnB1dCkpO1xuICAgICAgICAgICAgbGV0IHZhbCA9IEVGX0lucHV0LmdldElucHV0VmFsdWUoJChpbnB1dCkpO1xuXG4gICAgICAgICAgICBpZihwcm9wLnByb3AgJiYgIXZhbHVlW3Byb3AucHJvcF0gJiYgcHJvcC5uYW1lKXtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLnByb3BdID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHZhbHVlW3Byb3AucHJvcF0pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLnByb3BdW3Byb3AubmFtZV0gPSB2YWw7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5wcm9wXSA9IHZhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgIH1cblxuXG4gICAgLy8gVm9pZFxuICAgIHNldCB2YWx1ZSh2YWx1ZSA6IGFueSkgeyB9XG5cbn0iLCJpbXBvcnQge0VGX0lucHV0fSBmcm9tIFwiLi4vaW5wdXRzL0VGX0lucHV0XCI7XG5cbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBFRl9Gb3JtIHtcblxuICAgIC8qKlxuICAgICAqIEB2YXIgc3RyaW5nXG4gICAgICpcbiAgICAgKiBUaGUgdHlwZSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHR5cGU6IHN0cmluZyA9ICd0ZXh0JztcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgb2YgdGhlIGlucHV0XG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgZWxlbWVudDogYW55O1xuXG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgY29udGFpbmVyXG4gICAgICovXG4gICAgcHVibGljIGNvbnRhaW5lciA6IGFueTtcblxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gJCgnI3V0aWxpdGllcycpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdCgkZWxlbWVudCA6IGFueSlcbiAgICB7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJCgkZWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuaHRtbCh0aGlzLmVsZW1lbnQpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gdGhlIHZhbHVlIG9mIGFsbCB0aGUgaW5wdXRzIGluIHRoZSBmaWVsZFxuICAgICAqXG4gICAgICovXG4gICAgZ2V0IHZhbHVlKCk6IGFueSB7XG5cbiAgICAgICAgbGV0IHZhbHVlID0ge307XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tuYW1lXj1cInNldHRpbmdzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGlucHV0IDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoaW5wdXQpKTtcbiAgICAgICAgICAgIGxldCB2YWwgPSBFRl9JbnB1dC5nZXRJbnB1dFZhbHVlKCQoaW5wdXQpKTtcblxuICAgICAgICAgICAgaWYocHJvcC5hdHRyICYmICF2YWx1ZVtwcm9wLmF0dHJdICYmIHByb3AuaWQpe1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AuYXR0cl0gPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodmFsdWVbcHJvcC5hdHRyXSkge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AuYXR0cl1bcHJvcC5pZF0gPSB2YWw7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5hdHRyXSA9IHZhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgIH1cblxuXG5cblxufSIsImltcG9ydCB7RUZfRm9ybX0gZnJvbSBcIi4vZm9ybXMvRUZfRm9ybVwiO1xuXG5kZWNsYXJlIHZhciAkO1xuXG5kZWNsYXJlIHZhciBhamF4VXJsIDogc3RyaW5nO1xuXG5pbXBvcnQge0VGX0lucHV0fSBmcm9tICcuL2lucHV0cy9FRl9JbnB1dCc7XG5cbmNsYXNzIEVGX0FkZFxue1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBCb2R5IG9mIHRoZSBwYWdlXG4gICAgICovXG4gICAgcHVibGljICRib2R5O1xuXG4gICAgLyoqXG4gICAgICpBbiBvYmplY3Qgb2YgYWxsIHRoZSBpbnB1dCB0ZW1wbGF0ZXMgY2FjaGVkIHRvIGF2b2lkIGxhdGVuY3lcbiAgICAgKi9cbiAgICBwdWJsaWMgdGVtcGxhdGVzIDogYW55ID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBhbGwgdGhlIGlucHV0cyBhdmFpbGFibGUgb24gdGhlIHBhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5wdXRzIDogRUZfSW5wdXRbXSA9IFtdO1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGF2YWlsYWJsZSBpbnB1dHNcbiAgICAgKi9cbiAgICBwdWJsaWMgYXZhaWxhYmxlSW5wdXRzIDoge30gPSB7fTtcblxuXG4gICAgLyoqXG4gICAgICogQWxsIHRoZSBhdmFpbGFibGUgaW5wdXRzXG4gICAgICovXG4gICAgcHVibGljIGF2YWlsYWJsZUZvcm1zIDoge30gPSB7fTtcblxuXG4gICAgcHVibGljIGZvcm1UeXBlIDogRUZfRm9ybTtcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBlZGl0b3IgaXMgaW5pdFxuICAgICAqL1xuICAgIHB1YmxpYyBpc19pbml0IDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuJGJvZHkgPSAkKCdib2R5Jyk7XG5cbiAgICB9XG5cblxuICAgIHB1YmxpYyBpbml0KCkge1xuXG4gICAgICAgIHRoaXMuc2V0RXZlbnRzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkKCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgLypcbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5tb3ZlJyxfbW92ZSk7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy51cCcsX3VwKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLmRvd24nLF9kb3duKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLnJlbW92ZW9wdGlvbicsX3JlbW92ZU9wdGlvbik7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5kdXBsaXF1ZXInLF9kdXBsaWNhdGUpOyovXG5cbiAgICAgICAgLy8gQWRkIGEgbmV3IGZpZWxkXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vZmYoJ2NsaWNrJywnYnV0dG9uW2RhdGEtYWN0aW9uPVwiYWRkXCJdJylcbiAgICAgICAgICAgIC5vbignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGRcIl0nLCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZElucHV0KCd0ZXh0Jyx7fSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgICAgICB9KSB9KTtcblxuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vZmYoJ2NsaWNrJywnc2VsZWN0W25hbWU9XCJzZXR0aW5nc1t0eXBlXVwiXScpXG4gICAgICAgICAgICAub24oJ2NoYW5nZScsJ3NlbGVjdFtuYW1lPVwic2V0dGluZ3NbdHlwZV1cIl0nLCgkZXZlbnQgOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gJCgkZXZlbnQudGFyZ2V0KS52YWwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUZvcm1UeXBlKHR5cGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGQtb3B0aW9uXCJdJyxfYWRkT3B0aW9uKTtcblxuXG4gICAgICAgICAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsJ3NlbGVjdFtuYW1lJD1cIltmb3JtLXRheG9ub215XVwiXScsX2NoYW5nZVRheG9ub215KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cImZvcm0tcmVzZXQtYWN0aW9uXCJdJyxfY2hhbmdlUmVzZXRBY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAqL1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVvcmdhbmlzZSBhbGwgdGhlIGlucHV0cyBvbiB0aGUgcGFnZSBhY2NvcmRpbmcgdG8gdGhlIG9uZXNcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVvcmdhbmlzZSgpIDogYW55XG4gICAge1xuXG4gICAgICAgIEVGX0FkZC5sb2FkaW5nKHRydWUsJ2ZpZWxkcycpO1xuXG5cbiAgICAgICAgbGV0IGlucHV0cyA9IFtdO1xuXG4gICAgICAgICQuZWFjaCh0aGlzLmlucHV0cywoa2V5LGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgIGlucHV0cy5wdXNoKGlucHV0LnZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVBbGxJbnB1dHMoKTtcblxuICAgICAgICB0aGlzLmxvYWRJbnB1dHMoaW5wdXRzLDApLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ2ZpZWxkcycpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIHdoZW4gMiBpbnB1dHMgYXJlIG1vdmVkXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKiBAcGFyYW0gZGlyZWN0aW9uXG4gICAgICovXG4gICAgcHVibGljIG9uTW92ZShpbnB1dCA6IEVGX0lucHV0LGRpcmVjdGlvbiA6IHN0cmluZyA9ICd1cCcpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmlucHV0cy5pbmRleE9mKGlucHV0KTtcblxuICAgICAgICBsZXQgbmV3cG9zID0gZGlyZWN0aW9uID09ICd1cCcgPyBwb3NpdGlvbi0xIDogcG9zaXRpb24gKzE7XG5cbiAgICAgICAgY29uc29sZS5sb2coZGlyZWN0aW9uLG5ld3Bvcyxwb3NpdGlvbik7XG5cbiAgICAgICAgaWYobmV3cG9zID09IC0xIHx8IG5ld3BvcyA9PSB0aGlzLmlucHV0cy5sZW5ndGggfHwgIXRoaXMuaW5wdXRzW25ld3Bvc10pIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zd2l0Y2gocG9zaXRpb24sbmV3cG9zKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogU3dpdGNoIDIgaW5wdXRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcG9zMVxuICAgICAqIEBwYXJhbSBwb3MyXG4gICAgICovXG4gICAgcHVibGljIHN3aXRjaChwb3MxIDogbnVtYmVyLCBwb3MyOiBudW1iZXIpXG4gICAge1xuICAgICAgICBsZXQgaW5wdXQxID0gdGhpcy5pbnB1dHNbcG9zMV07XG5cbiAgICAgICAgdGhpcy5pbnB1dHNbcG9zMV0gPSB0aGlzLmlucHV0c1twb3MyXTtcblxuICAgICAgICB0aGlzLmlucHV0c1twb3MyXSA9IGlucHV0MTtcblxuICAgICAgICB0aGlzLnJlb3JnYW5pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbGwgaW5wdXRzIGZyb20gdHJhY2tcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlQWxsSW5wdXRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmlucHV0cyA9IFtdO1xuICAgICAgICB0aGlzLiRib2R5LmZpbmQoJyNmbGQnKS5odG1sKCcnKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIG9uIGNsaWNrIG9uIHRoZSBkdXBsaWNhdGUgYnV0dG9uXG4gICAgICpcbiAgICAgKiBARXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBvbkR1cGxpY2F0ZShpbnB1dCA6IEVGX0lucHV0KSA6IGFueVxuICAgIHtcblxuICAgICAgICB0aGlzLmFkZElucHV0KGlucHV0LnZhbHVlLmF0dHJpYnV0ZXMudHlwZSxpbnB1dC52YWx1ZSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBFRl9BZGQuc3VjY2VzcyAgPSAnVGhlbSBpbnB1dCBoYXMgYmVlbiBkdXBsaWNhdGVkJztcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIGNoYW5nZSBvZiB0eXBlIGlzIHRyaWdnZXJlZFxuICAgICAqXG4gICAgICogQEV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgb25DaGFuZ2VUeXBlKGlucHV0IDogRUZfSW5wdXQpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmlucHV0cy5pbmRleE9mKGlucHV0KTtcblxuICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dC52YWx1ZTtcblxuICAgICAgICB0aGlzLmFkZElucHV0KHZhbHVlLmF0dHJpYnV0ZXMudHlwZSx2YWx1ZSxwb3NpdGlvbikudGhlbigoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgIGlucHV0Lm9wZW4oKTtcbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbGVkIG9uIGRlbGV0ZSBvZiBhbiBpbnB1dFxuICAgICAqXG4gICAgICogQEV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgb25EZWxldGUoaW5wdXQgOiBFRl9JbnB1dCkgOiBhbnlcbiAgICB7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IHRoaXMuaW5wdXRzLmluZGV4T2YoaW5wdXQpO1xuXG4gICAgICAgIHRoaXMuaW5wdXRzLnNwbGljZShwb3NpdGlvbiwxKTtcblxuICAgICAgICB0aGlzLnJlb3JnYW5pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEFkZCBhbiBpbnB1dCB0byB0aGUgZWRpdG9yXG4gICAgICovXG4gICAgcHVibGljIGFkZElucHV0KHR5cGUgOiBzdHJpbmcgPSAndGV4dCcsJGRhdGEscG9zaXRpb24gOiBudW1iZXJ8bnVsbCA9IG51bGwpIDogUHJvbWlzZTxhbnk+XG4gICAge1xuXG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cblxuICAgICAgICBFRl9BZGQubG9hZGluZyh0cnVlLCdmaWVsZHMnKTtcblxuICAgICAgICAvLyBDbG9zZSBhbGwgdGhlIGlucHV0c1xuICAgICAgICAkLmVhY2godGhpcy5pbnB1dHMsKGtleSA6IG51bWJlciwgaW5wdXQgOiBFRl9JbnB1dCkgPT4ge1xuICAgICAgICAgICAgaW5wdXQuY2xvc2UoKVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmdldElucHV0KHR5cGUpLnRoZW4oKGRhdGEgOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IGlucHV0IDogRUZfSW5wdXQ7XG5cbiAgICAgICAgICAgIGlucHV0ID0gdGhpcy5nZW5lcmF0ZUlucHV0KHR5cGUpO1xuXG4gICAgICAgICAgICBpbnB1dC5pbml0KGRhdGEscG9zaXRpb24gPyBwb3NpdGlvbiA6IHRoaXMuaW5wdXRzLmxlbmd0aCwkZGF0YSxwb3NpdGlvbik7XG5cbiAgICAgICAgICAgIGlucHV0Lm9uRHVwbGljYXRlID0gKGlucHV0IDogRUZfSW5wdXQgKSA9PiB7IHRoaXMub25EdXBsaWNhdGUoaW5wdXQpIH07XG4gICAgICAgICAgICBpbnB1dC5vbkNoYW5nZVR5cGUgPSAoaW5wdXQgOiBFRl9JbnB1dCkgPT4geyB0aGlzLm9uQ2hhbmdlVHlwZShpbnB1dCkgfTtcbiAgICAgICAgICAgIGlucHV0Lm9uRGVsZXRlID0gKGlucHV0IDogRUZfSW5wdXQpID0+IHsgdGhpcy5vbkRlbGV0ZShpbnB1dCkgfTtcbiAgICAgICAgICAgIGlucHV0Lm9uTW92ZSA9IChpbnB1dDogIEVGX0lucHV0LCBhY3Rpb24gOiBzdHJpbmcpID0+IHsgdGhpcy5vbk1vdmUoaW5wdXQsYWN0aW9uKSB9O1xuXG4gICAgICAgICAgICBpZihwb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzW3Bvc2l0aW9uXSA9IGlucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5wdXNoKGlucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGZkLnJlc29sdmUoaW5wdXQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTaG93IG9yIGhpZGUgdGhlIGxvYWRpbmdzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbG9hZGluZ1xuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbG9hZGluZyhsb2FkaW5nIDogYm9vbGVhbiA9IHRydWUsJGVsZW1lbnQgOiBudWxsfHN0cmluZyA9IG51bGwpXG4gICAge1xuICAgICAgICAvLyBTaG93IHRoZSBzcGlubmVyXG5cbiAgICAgICAgc3dpdGNoICgkZWxlbWVudCkge1xuICAgICAgICAgICAgY2FzZSAnZmllbGRzJyA6XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItZmllbGRzJykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndXRpbGl0eScgOlxuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLXV0aWxpdHknKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLXV0aWxpdHknKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItZmllbGRzJykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIExvYWQgdGhlIGZvcm0gZGF0YSBmcm9tIHRoZSBiYWNrIG9mZmljZVxuICAgICAqL1xuICAgIHB1YmxpYyBsb2FkKCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgJC5nZXRKU09OKGFqYXhVcmwsIHtcbiAgICAgICAgICAgIGZvcm1faWQgOiBFRl9BZGQuZ2V0UGFyYW1ldGVyKCdwb3N0JyksXG4gICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX2Zvcm1fZGF0YSdcbiAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAvLyBBZGQgdGhlIGRhdGEgZm9yIGFsbCB0aGUgZm9ybVxuICAgICAgICAgICAgdGhpcy5hZGREYXRhKGRhdGEuZGF0YS5mb3JtKTtcbiAgICAgICAgICAgIHRoaXMuYWRkRm9ybURhdGEoZGF0YS5kYXRhLmZvcm0pO1xuXG5cbiAgICAgICAgICAgICQuZWFjaChkYXRhLmRhdGEuaW5wdXRzLCh0eXBlLGlucHV0IDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVJbnB1dHNbdHlwZV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5kYXRhLmZvcm1zLCh0eXBlLGlucHV0IDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVGb3Jtc1t0eXBlXSA9IGlucHV0O1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBzdWJtaXQgZGF0YVxuICAgICAgICAgICAgaWYoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdCkge1xuICAgICAgICAgICAgICAgIGxldCBzdWJtaXQgPSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkU3VibWl0RGF0YShzdWJtaXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMb2FkIGFsbCB0aGUgaW5wdXRzXG4gICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLDApLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkUmVxdWlyZWRGaWVsZHMoZGF0YS5kYXRhLmZvcm0udHlwZSk7XG4gICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgIC8vIEkgc2VuZCBiYWNrIHRoZSBkYXRhXG4gICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG5cblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBBZGQgdGhlIGRhdGEgaW5zaWRlIHRoZSBmb3JtIGl0c2VsZlxuICAgICAqXG4gICAgICogQHBhcmFtICRmb3JtRGF0YVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhZGREYXRhKCRmb3JtRGF0YSA6IGFueSkgOiB2b2lkXG4gICAge1xuXG4gICAgICAgICQoJyNlZi1hZGQtbWFpbi1pbmZvJykuZmluZCgnW25hbWVePVwic2V0dGluZ3NcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxJbmZvcygkKGVsZW0pLCRmb3JtRGF0YSk7XG5cbiAgICAgICAgfSk7XG4gICAgICAgICQoJyNlZi1hZGQtbWFpbi1pbmZvJykuZmluZCgnW25hbWVePVwiYXR0cmlidXRlc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbEluZm9zKCQoZWxlbSksJGZvcm1EYXRhKTtcblxuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBjaGFuZ2VGb3JtVHlwZSh0eXBlKSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgRUZfQWRkLmxvYWRpbmcodHJ1ZSwndXRpbGl0eScpO1xuXG4gICAgICAgIGxldCAkZm9ybURhdGEgPSB0aGlzLmZvcm1UeXBlLnZhbHVlO1xuXG4gICAgICAgICRmb3JtRGF0YS50eXBlID0gdHlwZTtcblxuICAgICAgICB0aGlzLmFkZEZvcm1EYXRhKCRmb3JtRGF0YSk7XG4gICAgICAgIHRoaXMuYWRkUmVxdWlyZWRGaWVsZHMoJGZvcm1EYXRhLnR5cGUpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCB0aGUgZm9ybSBkYXRhIGluIHRoZSBmb3JtIHR5cGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZm9ybURhdGFcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYWRkRm9ybURhdGEoJGZvcm1EYXRhKSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgdGhpcy5sb2FkRm9ybVRlbXBsYXRlKCRmb3JtRGF0YS50eXBlKS50aGVuKCgkdGVtcGxhdGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybVR5cGUgPSB0aGlzLmdlbmVyYXRlRm9ybSgkZm9ybURhdGEudHlwZSk7XG5cbiAgICAgICAgICAgIHRoaXMuZm9ybVR5cGUuaW5pdCgkdGVtcGxhdGUpO1xuXG4gICAgICAgICAgICAkKCcjZWYtYWRkLXR5cGUnKS5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxJbmZvcygkKGVsZW0pLCRmb3JtRGF0YSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ3V0aWxpdHknKTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkUmVxdWlyZWRGaWVsZHModHlwZSA6IHN0cmluZykgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgcmVxdWlyZWQgPSB0aGlzLmF2YWlsYWJsZUZvcm1zW3R5cGVdLnJlcXVpcmVkO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuaW5wdXRzKTtcblxuICAgICAgICAkLmVhY2godGhpcy5pbnB1dHMsKGtleSA6IHN0cmluZywgaW5wdXQgOiBFRl9JbnB1dCkgPT4ge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gJC5pbkFycmF5KGlucHV0LnZhbHVlLmF0dHJpYnV0ZXMubmFtZSxyZXF1aXJlZCk7XG4gICAgICAgICAgICBpZihpbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVkLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGlucHV0cyA9IFtdO1xuXG4gICAgICAgICQuZWFjaChyZXF1aXJlZCwoa2V5IDogbnVtYmVyLGlucHV0IDogc3RyaW5nKSA9PiB7XG5cbiAgICAgICAgICAgIGlucHV0cy5wdXNoKHthdHRyaWJ1dGVzIDp7dHlwZSA6ICd0ZXh0JyxuYW1lIDogaW5wdXR9fSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYoaW5wdXRzICYmIGlucHV0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoaW5wdXRzLCAwKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBFRl9BZGQuc3VjY2VzcyA9ICdUaGUgZmllbGRzICcgKyByZXF1aXJlZC5qb2luKCcsICcpICsgJyBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIGZvcm0nO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBsb2FkRm9ybVRlbXBsYXRlKHR5cGUgOiBzdHJpbmcpIDogUHJvbWlzZTxhbnk+XG4gICAge1xuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG4gICAgICAgIGxldCBrZXkgPSAnZm9ybS0nICsgdHlwZTtcblxuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXNba2V5XSAmJiB0aGlzLnRlbXBsYXRlc1trZXldICE9IHVuZGVmaW5lZCAmJiB0aGlzLnRlbXBsYXRlc1trZXldICE9ICcnKSB7XG4gICAgICAgICAgICBkZmQucmVzb2x2ZSh0aGlzLnRlbXBsYXRlc1trZXldKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJC5nZXQoYWpheFVybCwge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdhY3Rpb25zJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA6IHR5cGUsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF90ZW1wbGF0ZSdcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW2tleV0gPSBkYXRhLmRhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBJIHNlbmQgYmFjayB0aGUgZGF0YVxuICAgICAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEuZGF0YSk7XG4gICAgICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgZmlsbEluZm9zKCRlbGVtLCRmb3JtKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCRlbGVtKTtcblxuICAgICAgICBpZigkZm9ybVtwcm9wLmF0dHJdICYmICRmb3JtW3Byb3AuYXR0cl1bcHJvcC5pZF0pIHtcblxuICAgICAgICAgICAgRUZfSW5wdXQuc2V0SW5wdXRWYWx1ZSgkZWxlbSwkZm9ybVtwcm9wLmF0dHJdW3Byb3AuaWRdKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgdGhlIGRhdGEgaW5zaWRlIHRoZSBzdWJtaXQgYnV0dG9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3VibWl0XG4gICAgICovXG4gICAgcHJpdmF0ZSBhZGRTdWJtaXREYXRhKHN1Ym1pdCkgOiB2b2lkXG4gICAge1xuICAgICAgICBFRl9JbnB1dC5hZGREYXRhVG9FbGVtZW50KHRoaXMuJGJvZHkuZmluZCgnI2VmLWFkZC1zdWJtaXQnKSxzdWJtaXQpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBMb2FkIGFsbCB0aGUgaW5wdXRzIGZyb20gdGhlIGxpc3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dHNcbiAgICAgKiBAcGFyYW0gZGZkXG4gICAgICogQHBhcmFtIG9yZGVyXG4gICAgICovXG4gICAgcHJpdmF0ZSBsb2FkSW5wdXRzKGlucHV0cyA6IHsgYXR0cmlidXRlcyA6IHt0eXBlIDogc3RyaW5nIH19W10sb3JkZXIgOiBudW1iZXIsZGZkICA6IGFueSA9IG51bGwpIDogUHJvbWlzZTxhbnk+XG4gICAge1xuICAgICAgICBpZighZGZkKSB7XG4gICAgICAgICAgICBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhpbnB1dHMpO1xuXG4gICAgICAgIGxldCBrZXkgPSBrZXlzW29yZGVyXTtcblxuICAgICAgICBpZigha2V5IHx8ICFpbnB1dHMgfHwgIWlucHV0c1trZXldKXtcbiAgICAgICAgICAgIHRoaXMuaXNfaW5pdCA9IHRydWU7XG4gICAgICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSwnZmllbGRzJyk7XG4gICAgICAgICAgICBkZmQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5hZGRJbnB1dChpbnB1dHNba2V5XS5hdHRyaWJ1dGVzLnR5cGUsaW5wdXRzW2tleV0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9yZGVyKys7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cyxvcmRlcixkZmQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG4gICAgfVxuXG5cblxuICAgIHB1YmxpYyBnZW5lcmF0ZUZvcm0odHlwZSA6IHN0cmluZykgOiBFRl9Gb3JtXG4gICAge1xuICAgICAgICBsZXQgZm9ybTtcblxuICAgICAgICBpZighdGhpcy5hdmFpbGFibGVGb3Jtc1t0eXBlXSkge1xuICAgICAgICAgICAgdHlwZSA9ICdwb3N0JztcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnbG9naW4nIDpcbiAgICAgICAgICAgICAgICBmb3JtID0gbmV3IEVGX0Zvcm0oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Bvc3QnIDpcbiAgICAgICAgICAgICAgICBmb3JtID0gbmV3IEVGX0Zvcm0oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZighZm9ybSkge1xuICAgICAgICAgICAgZm9ybSA9IG5ldyBFRl9Gb3JtKCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiBmb3JtO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZW5lcmF0ZUlucHV0KHR5cGUgOiBzdHJpbmcpIDogRUZfSW5wdXRcbiAgICB7XG4gICAgICAgIGxldCBpbnB1dDtcblxuICAgICAgICBpZighdGhpcy5hdmFpbGFibGVJbnB1dHNbdHlwZV0pIHtcbiAgICAgICAgICAgIHR5cGUgPSAndGV4dCc7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHN3aXRjaCh0eXBlKSB7XG4gICAgICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG5ldyBFRl9JbnB1dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIWlucHV0KSB7XG4gICAgICAgICAgICBpbnB1dCA9IG5ldyBFRl9JbnB1dCgpO1xuICAgICAgICB9XG5cblxuICAgICAgICByZXR1cm4gaW5wdXQ7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogTG9hZCB0aGUgaW5wdXQgdGVtcGxhdGUgZnJvbSB0aGUgQk9cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlIDogc3RyaW5nXG4gICAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0SW5wdXQodHlwZSA6IHN0cmluZyA9ICd0ZXh0JylcbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGVzW3R5cGVdICYmIHRoaXMudGVtcGxhdGVzW3R5cGVdICE9IHVuZGVmaW5lZCAmJiB0aGlzLnRlbXBsYXRlc1t0eXBlXSAhPSAnJykge1xuICAgICAgICAgICAgZGZkLnJlc29sdmUodGhpcy50ZW1wbGF0ZXNbdHlwZV0pO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkLmdldChhamF4VXJsLCB7XG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ2lucHV0cycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgOiB0eXBlLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ0VGL2xvYWRfdGVtcGxhdGUnXG4gICAgICAgICAgICB9KS5zdWNjZXNzKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlc1t0eXBlXSA9IGRhdGEuZGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIEkgc2VuZCBiYWNrIHRoZSBkYXRhXG4gICAgICAgICAgICAgICAgZGZkLnJlc29sdmUoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgIH0pLmVycm9yKHRoaXMuaGFuZGxlRXJyb3IpO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBIVFRQIEVycm9yc1xuICAgICAqXG4gICAgICogQFRPRE9cbiAgICAgKi9cbiAgICBwdWJsaWMgaGFuZGxlRXJyb3IoZGF0YSA6IHN0cmluZ3x7cmVzcG9uc2VKU09OIDoge2Vycm9yfX0pIDogdm9pZFxuICAgIHtcblxuICAgICAgICBsZXQgZXJyb3IgOiBzdHJpbmc7XG5cbiAgICAgICAgaWYodHlwZW9mIGRhdGEgIT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgZXJyb3IgPSBkYXRhLnJlc3BvbnNlSlNPTi5lcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIEVGX0FkZC5lcnJvciA9IGVycm9yO1xuICAgICAgICBFRl9BZGQubG9hZGluZyhmYWxzZSk7XG5cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBHZXQgdGhlIHVybCBwYXJhbWV0ZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbWV0ZXJcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UGFyYW1ldGVyKHBhcmFtZXRlciA6IHN0cmluZyk6YW55XG4gICAge1xuICAgICAgICB2YXIgcGFyYW1zX3N0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpO1xuXG4gICAgICAgIHZhciBwYXJhbXNfYXJyYXkgPSBwYXJhbXNfc3RyaW5nLnNwbGl0KCcmJyk7XG5cbiAgICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgICBmb3IodmFyIGkgPTA7aTxwYXJhbXNfYXJyYXkubGVuZ3RoO2krKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGUgPSBwYXJhbXNfYXJyYXlbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgICAgIG9ialtlWzBdXSA9IGVbMV1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYmpbcGFyYW1ldGVyXTtcbiAgICB9XG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBEaXNwbGF5IGFuIGVycm9yIG1lc3NhZ2UgdGhhdCB3aWxsIGZhZGUgb3V0IGluIDUgc2VjXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXJyb3JNZXNzYWdlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXQgZXJyb3IoZXJyb3JNZXNzYWdlIDogc3RyaW5nfGJvb2xlYW4pIHtcblxuICAgICAgICBFRl9BZGQuc2V0TWVzc2FnZSgnI2Vycm9yLW1lc3NhZ2UnLGVycm9yTWVzc2FnZSxmYWxzZSk7XG5cbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBEaXNwbGF5IGEgc3VjY2VzcyBtZXNzYWdlIHRoYXQgd2lsbCBmYWRlIG91dCBpbiA1IHNlY1xuICAgICAqXG4gICAgICogQHBhcmFtIHN1Y2Nlc3NNZXNzYWdlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXQgc3VjY2VzcyhzdWNjZXNzTWVzc2FnZTogc3RyaW5nfGJvb2xlYW4pIHtcblxuICAgICAgICBFRl9BZGQuc2V0TWVzc2FnZSgnI3N1Y2Nlc3MtbWVzc2FnZScsc3VjY2Vzc01lc3NhZ2UsZmFsc2UpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbWVudFxuICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICogQHBhcmFtIHBlcnNpc3QgOiBib29sZWFuLCBXZWl0aGVyIG9yIG5vdCB0aGUgbWVzc2FnZSBzaG91bGQgYmUgZGlzcGxheWVkIG9yIG5vdFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0TWVzc2FnZShlbGVtZW50IDogc3RyaW5nLG1lc3NhZ2UgOiBzdHJpbmd8Ym9vbGVhbiwgcGVyc2lzdCA6IGJvb2xlYW58bnVtYmVyID0gZmFsc2UpIDogdm9pZFxuICAgIHtcblxuICAgICAgICBpZihtZXNzYWdlKSB7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLnRleHQobWVzc2FnZSkuZmFkZUluKDIwMCk7XG5cbiAgICAgICAgICAgIGlmKCFwZXJzaXN0KSB7XG5cbiAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCBwZXJzaXN0IGlzIG5vdCBlcXVhbCB0byBmYWxzZVxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBwZXJzaXN0ID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgICAgICAgICBwZXJzaXN0ID0gNTAwMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRNZXNzYWdlKGVsZW1lbnQsJycpO1xuICAgICAgICAgICAgICAgIH0scGVyc2lzdCk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLmZhZGVPdXQoMjAwLCgpID0+IHtcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnRleHQoJycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxudmFyIEVGX2FkZCA9IG5ldyBFRl9BZGQoKTtcbkVGX2FkZC5pbml0KCk7Il19
