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
                    console.log(this.container);
                    console.log(this.element);
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
                            console.log(prop, val);
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
                            EF_Add.loading(false, "utility");
                        });
                    });
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
                 * @param inputs
                 * @param order
                 */
                EF_Add.prototype.loadInputs = function(inputs, order) {
                    var _this = this;
                    var keys = Object.keys(inputs);
                    var key = keys[order];
                    if (!key || !inputs || !inputs[key]) {
                        this.is_init = true;
                        EF_Add.loading(false, "fields");
                        return;
                    } else {
                        this.addInput(inputs[key].attributes.type, inputs[key]).then(function() {
                            order++;
                            _this.loadInputs(inputs, order);
                        });
                    }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2lucHV0cy9FRl9JbnB1dC50cyIsImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2Zvcm1zL0VGX0Zvcm0udHMiLCJhc3NldHMvYWRtaW4vanMvc3JjL2FkZC9FRl9BZGQudHMiXSwibmFtZXMiOlsiRUZfSW5wdXQiLCJ0aGlzIiwiY29udGFpbmVyIiwiJCIsInByb3RvdHlwZSIsImluaXQiLCIkZWxlbWVudCIsImlkIiwiJGRhdGEiLCJwb3NpdGlvbiIsInJlcGxhY2UiLCJlbGVtZW50Iiwib3B0aW9uc0VsZW1lbnQiLCJmaW5kIiwiYXBwZW5kIiwicmVwbGFjZVdpdGgiLCJzZXRFdmVudHMiLCJhZGREYXRhIiwiX3RoaXMiLCJvbiIsInRvZ2dsZSIsImVsZW0iLCJoYXNDbGFzcyIsImNsb3NlIiwib3BlbiIsImFkZERhdGFUb0VsZW1lbnQiLCJlYWNoIiwia2V5IiwicHJvcCIsImdldElucHV0UHJvcGVydGllcyIsIm5hbWUiLCJzZXRJbnB1dFZhbHVlIiwiaW5wdXQiLCJ2YWx1ZSIsImlzIiwidmFsIiwiZ2V0SW5wdXRWYWx1ZSIsImF0dHIiLCJkYXRhIiwic3BsaXQiLCJoaWRlIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImh0bWwiLCJzaG93IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJ0eXBlIiwiRUZfRm9ybSIsImNvbnNvbGUiLCJsb2ciLCJFRl9JbnB1dF8xIiwiRUZfQWRkIiwidGVtcGxhdGVzIiwiaW5wdXRzIiwiYXZhaWxhYmxlSW5wdXRzIiwiYXZhaWxhYmxlRm9ybXMiLCJpc19pbml0IiwiJGJvZHkiLCJsb2FkIiwidGhlbiIsImFkZElucHV0IiwibG9hZGluZyIsIiRldmVudCIsInRhcmdldCIsIkVGX0lucHV0XzIiLCJjaGFuZ2VJbnB1dCIsImV2ZW50IiwiY2hhbmdlRm9ybVR5cGUiLCIkaW5wdXQiLCIkcG9zaXRpb24iLCJkZmQiLCJEZWZlcnJlZCIsImdldElucHV0IiwiZ2VuZXJhdGVJbnB1dCIsImxlbmd0aCIsInB1c2giLCJyZXNvbHZlIiwicHJvbWlzZSIsImdldEpTT04iLCJhamF4VXJsIiwiZm9ybV9pZCIsImdldFBhcmFtZXRlciIsImFjdGlvbiIsInN1Y2Nlc3MiLCJmb3JtIiwiYWRkRm9ybURhdGEiLCJmb3JtcyIsInN1Ym1pdCIsImFkZFN1Ym1pdERhdGEiLCJsb2FkSW5wdXRzIiwiZXJyb3IiLCJoYW5kbGVFcnJvciIsIiRmb3JtRGF0YSIsImZpbGxJbmZvcyIsImZvcm1UeXBlIiwibG9hZEZvcm1UZW1wbGF0ZSIsIiR0ZW1wbGF0ZSIsImdlbmVyYXRlRm9ybSIsInVuZGVmaW5lZCIsImdldCIsInRlbXBsYXRlIiwiJGVsZW0iLCIkZm9ybSIsIm9yZGVyIiwia2V5cyIsImF0dHJpYnV0ZXMiLCJFRl9Gb3JtXzEiLCJyZXNwb25zZUpTT04iLCJwYXJhbWV0ZXIiLCJwYXJhbXNfc3RyaW5nIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJzdWJzdHIiLCJwYXJhbXNfYXJyYXkiLCJvYmoiLCJpIiwiZSIsImVycm9yTWVzc2FnZSIsInNldE1lc3NhZ2UiLCJzdWNjZXNzTWVzc2FnZSIsIm1lc3NhZ2UiLCJwZXJzaXN0IiwidGV4dCIsImZhZGVJbiIsInNldFRpbWVvdXQiLCJmYWRlT3V0IiwiRUZfYWRkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztnQkEyQ0ksU0FBQUE7b0JBRUlDLEtBQUtDLFlBQVlDLEVBQUU7Ozs7Ozs7OztnQkFZaEJILFNBQUFJLFVBQUFDLE9BQVAsU0FBWUMsVUFBZ0JDLElBQVlDLE9BQVlDO29CQUFBLElBQUFBLGtCQUFBLEdBQUE7d0JBQUFBLFdBQUE7O29CQUVoRFIsS0FBS00sS0FBS0E7b0JBRVZELFdBQVdBLFNBQVNJLFFBQVEsWUFBV0g7b0JBRXZDTixLQUFLVSxVQUFVUixFQUFFRztvQkFDakJMLEtBQUtXLGlCQUFpQlgsS0FBS1UsUUFBUUUsS0FBSztvQkFFeEMsSUFBRyxTQUFTSixVQUFVO3dCQUNsQlIsS0FBS0MsVUFBVVksT0FB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SUMsZUFBZUwsY0FBY3ZFLE1BQU07b0JBRXZDLElBQUk2RTtvQkFDSixLQUFJLElBQUlDLElBQUcsR0FBRUEsSUFBRUYsYUFBYXhDLFFBQU8wQyxLQUNuQzt3QkFDSSxJQUFJQyxJQUFJSCxhQUFhRSxHQUFHOUUsTUFBTTt3QkFDOUI2RSxJQUFJRSxFQUFFLE1BQU1BLEVBQUU7O29CQUdsQixPQUFPRixJQUFJUDs7Z0JBV2ZoRSxPQUFBQyxlQUFrQk0sUUFBQTs7Ozs7O3lCQUFsQixTQUF3Qm1FO3dCQUVwQm5FLE9BQU9vRSxXQUFXLGtCQUFpQkQsY0FBYTs7Ozs7Z0JBWXBEMUUsT0FBQUMsZUFBa0JNLFFBQUE7Ozs7Ozs7eUJBQWxCLFNBQTBCcUU7d0JBRXZCckUsT0FBT29FLFdBQVcsb0JBQW1CQyxnQkFBZTs7Ozs7Ozs7Ozs7Z0JBVXpDckUsT0FBQW9FLGFBQWQsU0FBeUI3RyxTQUFpQitHLFNBQTBCQztvQkFBcEUsSUFBQXpHLFFBQUFqQjtvQkFBb0UsSUFBQTBILGlCQUFBLEdBQUE7d0JBQUFBLFVBQUE7O29CQUdoRSxJQUFHRCxTQUFTO3dCQUNSdkgsRUFBRVEsU0FBU2lILEtBQUtGLFNBQVNHLE9BQU87d0JBRWhDLEtBQUlGLFNBQVM7OzRCQUdULFdBQVVBLFlBQVksV0FBVztnQ0FDN0JBLFVBQVU7OzRCQUdkRyxXQUFXO2dDQUNQNUcsTUFBS3NHLFdBQVc3RyxTQUFROytCQUMxQmdIOzsyQkFJSjt3QkFDRnhILEVBQUVRLFNBQVNvSCxRQUFRLEtBQUk7NEJBQ25CNUgsRUFBRVEsU0FBU2lILEtBQUs7Ozs7Z0JBS2hDLE9BQUF4RTs7WUFFSTRFLFNBQVMsSUFBSTVFO1lBQ2pCNEUsT0FBTzNIIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBFRl9JbnB1dFxue1xuXG4gICAgLyoqXG4gICAgICogQHZhciBzdHJpbmdcbiAgICAgKlxuICAgICAqIFRoZSB0eXBlIG9mIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdHlwZSA6IHN0cmluZyA9ICd0ZXh0JztcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgb2YgdGhlIGlucHV0XG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgZWxlbWVudCA6IGFueTtcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgZm9yIHRoZSBvcHRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgb3B0aW9uc0VsZW1lbnQgOiBhbnk7XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBpZCAocG9zaXRpb24pIG9mIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBpZCA6IG51bWJlcjtcblxuXG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgY29udGFpbmVyXG4gICAgICovXG4gICAgcHVibGljIGNvbnRhaW5lciA6IGFueTtcblxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gJCgnI2ZsZCcpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqIEBwYXJhbSAkZGF0YVxuICAgICAqIEBwYXJhbSBpZFxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiA6IG51bWJlclxuICAgICAqL1xuICAgIHB1YmxpYyBpbml0KCRlbGVtZW50IDogYW55LCBpZCA6IG51bWJlciwkZGF0YSA6IGFueSxwb3NpdGlvbiA6IG51bGx8bnVtYmVyID0gbnVsbClcbiAgICB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcblxuICAgICAgICAkZWxlbWVudCA9ICRlbGVtZW50LnJlcGxhY2UoL2ZpZWxkSWQvZyxpZCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJCgkZWxlbWVudCk7XG4gICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQgPSB0aGlzLmVsZW1lbnQuZmluZCgnLmVmLXRhYmxlJyk7XG5cbiAgICAgICAgaWYobnVsbCA9PT0gcG9zaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5maW5kKCcjZmllbGQtJyArIHBvc2l0aW9uKS5yZXBsYWNlV2l0aCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRFdmVudHMoKTtcblxuICAgICAgICB0aGlzLmFkZERhdGEoJGRhdGEpO1xuICAgIH1cblxuXG5cblxuICAgIHB1YmxpYyBzZXRFdmVudHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJvcGVuLWNsb3NlXCJdJykub24oJ2NsaWNrJywoKSA9PiB7cmV0dXJuIHRoaXMudG9nZ2xlKCl9KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIENsb3NlIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgcHVibGljIHRvZ2dsZSgpOiBib29sZWFuXG4gICAge1xuXG4gICAgICAgIGxldCBlbGVtID0gdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cIm9wZW4tY2xvc2VcIl0nKTtcblxuICAgICAgICBpZigkKGVsZW0pLmhhc0NsYXNzKCdtaW5pZnknKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3BlbigpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEluc2VydCB0aGUgZGF0YSBpbiB0aGUgdGVtcGxhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBhZGREYXRhKCRkYXRhKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIEVGX0lucHV0LmFkZERhdGFUb0VsZW1lbnQodGhpcy5lbGVtZW50LCRkYXRhKVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gJGRhdGFcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGFkZERhdGFUb0VsZW1lbnQoJGVsZW1lbnQgOiBhbnksICRkYXRhIDogYW55KSA6IHZvaWRcbiAgICB7XG4gICAgICAgICRlbGVtZW50LmZpbmQoJ1tuYW1lXj1cImZpZWxkXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJChlbGVtKSk7XG5cbiAgICAgICAgICAgIGlmKCRkYXRhW3Byb3AucHJvcF0gJiYgJGRhdGFbcHJvcC5wcm9wXVtwcm9wLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgRUZfSW5wdXQuc2V0SW5wdXRWYWx1ZSgkKGVsZW0pLCRkYXRhW3Byb3AucHJvcF1bcHJvcC5uYW1lXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgYSB2YWx1ZSB0byBhbiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXRJbnB1dFZhbHVlKGlucHV0IDogYW55LCB2YWx1ZSA6IHN0cmluZ3xib29sZWFuKVxuICAgIHtcbiAgICAgICAgaWYoaW5wdXQuaXMoJzpjaGVja2JveCcpKXtcbiAgICAgICAgICAgIGlmKHZhbHVlID09ICdvbicpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnB1dC5wcm9wKCdjaGVja2VkJyx2YWx1ZSk7XG4gICAgICAgIH1lbHNlIGlmKGlucHV0LmlzKCdzZWxlY3QnKSl7XG4gICAgICAgICAgICBpbnB1dC5maW5kKCdvcHRpb25bdmFsdWU9XCInKyB2YWx1ZSArJ1wiXScpLnByb3AoJ3NlbGVjdGVkJyx0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgaW5wdXQudmFsKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBHZXQgdGhlIHZhbHVlIG9mIGFuIGlucHV0XG4gICAgICpcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqIEByZXR1cm5zIGFueVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5wdXRWYWx1ZShpbnB1dCA6IGFueSlcbiAgICB7XG5cbiAgICAgICAgaWYodHlwZW9mIGlucHV0LnZhbCAhPSAnZnVuY3Rpb24nKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYoaW5wdXQuaXMoJzpjaGVja2JveCcpKXtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5pcygnOmNoZWNrZWQnKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQudmFsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gYWxsIHRoZSBwcm9wZXJ0aWVzIG9mIGFuIGlucHV0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5wdXRQcm9wZXJ0aWVzKGVsZW0gOiBhbnkpIDoge2F0dHIsaWQscHJvcCxuYW1lfVxuICAgIHtcblxuICAgICAgICBsZXQgbmFtZSA9IGVsZW0uYXR0cignbmFtZScpO1xuXG4gICAgICAgIGxldCBkYXRhID0gbmFtZS5zcGxpdCgnWycpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhdHRyIDogZGF0YVswXS5yZXBsYWNlKCddJywnJyksXG4gICAgICAgICAgICBpZCA6IGRhdGFbMV0ucmVwbGFjZSgnXScsJycpLFxuICAgICAgICAgICAgcHJvcCA6IGRhdGFbMl0gPyBkYXRhWzJdLnJlcGxhY2UoJ10nLCcnKSA6ICcnLFxuICAgICAgICAgICAgbmFtZSA6IGRhdGFbM10gPyBkYXRhWzNdLnJlcGxhY2UoJ10nLCcnKSA6ICcnLFxuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAc2luY2UgMS4xLjBcbiAgICAgKlxuICAgICAqIEBldmVudCA6IENsaWNrIG9uIG1pbmlmeSBidXR0b24gOiBoaWRlIHRoZSBvcHRpb25zIG9mIHRoZSBmaWVsZFxuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xvc2UoKSA6IGJvb2xlYW5cbiAgICB7XG4gICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQuaGlkZSgyMDApO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLm1pbmlmeScpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ21pbmlmeScpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ29wZW4nKVxuICAgICAgICAgICAgLmh0bWwoJysnKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBzaW5jZSAxLjEuMFxuICAgICAqXG4gICAgICogT3BlbiBhIGZpZWxkXG4gICAgICpcbiAgICAgKiBAZXZlbnQgOiBDbGljayBvbiBvcGVuIGJ1dHRvbiwgc2hvdyB0aGUgZmllbGQgb3B0aW9uc1xuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgb3BlbigpIDogYm9vbGVhblxuICAgIHtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudC5zaG93KDIwMCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcub3BlbicpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ29wZW4nKVxuICAgICAgICAgICAgLmFkZENsYXNzKCdtaW5pZnknKVxuICAgICAgICAgICAgLmh0bWwoJy0nKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJldHVybiB0aGUgdmFsdWUgb2YgYWxsIHRoZSBpbnB1dHMgaW4gdGhlIGZpZWxkXG4gICAgICpcbiAgICAgKi9cbiAgICBnZXQgdmFsdWUoKTogYW55IHtcblxuICAgICAgICBsZXQgdmFsdWUgPSB7fTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW25hbWVePVwiZmllbGRcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsaW5wdXQgOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJChpbnB1dCkpO1xuICAgICAgICAgICAgbGV0IHZhbCA9IEVGX0lucHV0LmdldElucHV0VmFsdWUoJChpbnB1dCkpO1xuXG4gICAgICAgICAgICBpZihwcm9wLnByb3AgJiYgIXZhbHVlW3Byb3AucHJvcF0gJiYgcHJvcC5uYW1lKXtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLnByb3BdID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHZhbHVlW3Byb3AucHJvcF0pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtwcm9wLnByb3BdW3Byb3AubmFtZV0gPSB2YWw7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5wcm9wXSA9IHZhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgIH1cblxuXG4gICAgLy8gVm9pZFxuICAgIHNldCB2YWx1ZSh2YWx1ZSA6IGFueSkgeyB9XG5cbn0iLCJpbXBvcnQge0VGX0lucHV0fSBmcm9tIFwiLi4vaW5wdXRzL0VGX0lucHV0XCI7XG5cbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBFRl9Gb3JtIHtcblxuICAgIC8qKlxuICAgICAqIEB2YXIgc3RyaW5nXG4gICAgICpcbiAgICAgKiBUaGUgdHlwZSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHR5cGU6IHN0cmluZyA9ICd0ZXh0JztcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgb2YgdGhlIGlucHV0XG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgZWxlbWVudDogYW55O1xuXG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgY29udGFpbmVyXG4gICAgICovXG4gICAgcHVibGljIGNvbnRhaW5lciA6IGFueTtcblxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gJCgnI3V0aWxpdGllcycpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdCgkZWxlbWVudCA6IGFueSlcbiAgICB7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJCgkZWxlbWVudCk7XG5cbiAgICAgICAgY29uc29sZS5sb2codGhpcy5jb250YWluZXIpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmh0bWwodGhpcy5lbGVtZW50KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIHRoZSB2YWx1ZSBvZiBhbGwgdGhlIGlucHV0cyBpbiB0aGUgZmllbGRcbiAgICAgKlxuICAgICAqL1xuICAgIGdldCB2YWx1ZSgpOiBhbnkge1xuXG4gICAgICAgIGxldCB2YWx1ZSA9IHt9O1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixpbnB1dCA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkKGlucHV0KSk7XG4gICAgICAgICAgICBsZXQgdmFsID0gRUZfSW5wdXQuZ2V0SW5wdXRWYWx1ZSgkKGlucHV0KSk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb3AsdmFsKTtcblxuICAgICAgICAgICAgaWYocHJvcC5hdHRyICYmICF2YWx1ZVtwcm9wLmF0dHJdICYmIHByb3AuaWQpe1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AuYXR0cl0gPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodmFsdWVbcHJvcC5hdHRyXSkge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AuYXR0cl1bcHJvcC5pZF0gPSB2YWw7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5hdHRyXSA9IHZhbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgIH1cblxuXG5cblxufSIsImltcG9ydCB7RUZfRm9ybX0gZnJvbSBcIi4vZm9ybXMvRUZfRm9ybVwiO1xuXG5kZWNsYXJlIHZhciAkO1xuXG5kZWNsYXJlIHZhciBhamF4VXJsIDogc3RyaW5nO1xuXG5pbXBvcnQge0VGX0lucHV0fSBmcm9tICcuL2lucHV0cy9FRl9JbnB1dCc7XG5cbmNsYXNzIEVGX0FkZFxue1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBCb2R5IG9mIHRoZSBwYWdlXG4gICAgICovXG4gICAgcHVibGljICRib2R5O1xuXG4gICAgLyoqXG4gICAgICpBbiBvYmplY3Qgb2YgYWxsIHRoZSBpbnB1dCB0ZW1wbGF0ZXMgY2FjaGVkIHRvIGF2b2lkIGxhdGVuY3lcbiAgICAgKi9cbiAgICBwdWJsaWMgdGVtcGxhdGVzIDogYW55ID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBhbGwgdGhlIGlucHV0cyBhdmFpbGFibGUgb24gdGhlIHBhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5wdXRzIDogRUZfSW5wdXRbXSA9IFtdO1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGF2YWlsYWJsZSBpbnB1dHNcbiAgICAgKi9cbiAgICBwdWJsaWMgYXZhaWxhYmxlSW5wdXRzIDoge30gPSB7fTtcblxuXG4gICAgLyoqXG4gICAgICogQWxsIHRoZSBhdmFpbGFibGUgaW5wdXRzXG4gICAgICovXG4gICAgcHVibGljIGF2YWlsYWJsZUZvcm1zIDoge30gPSB7fTtcblxuXG4gICAgcHVibGljIGZvcm1UeXBlIDogRUZfRm9ybTtcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBlZGl0b3IgaXMgaW5pdFxuICAgICAqL1xuICAgIHB1YmxpYyBpc19pbml0IDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuJGJvZHkgPSAkKCdib2R5Jyk7XG5cbiAgICB9XG5cblxuICAgIHB1YmxpYyBpbml0KCkge1xuXG4gICAgICAgIHRoaXMuc2V0RXZlbnRzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkKCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgLypcbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5tb3ZlJyxfbW92ZSk7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy51cCcsX3VwKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLmRvd24nLF9kb3duKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLnJlbW92ZW9wdGlvbicsX3JlbW92ZU9wdGlvbik7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5kdXBsaXF1ZXInLF9kdXBsaWNhdGUpOyovXG5cbiAgICAgICAgLy8gQWRkIGEgbmV3IGZpZWxkXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGRcIl0nLCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZElucHV0KCd0ZXh0Jyx7fSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgICAgICB9KSB9KTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NoYW5nZScsJ3NlbGVjdFtuYW1lJD1cIlthdHRyaWJ1dGVzXVt0eXBlXVwiXScsKCRldmVudCA6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSAkKCRldmVudC50YXJnZXQpLnZhbCgpO1xuICAgICAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoJGV2ZW50LnRhcmdldCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlSW5wdXQodHlwZSx0aGlzLmlucHV0c1twcm9wLmlkXSxwcm9wLmlkKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cInNldHRpbmdzW3R5cGVdXCJdJywoJGV2ZW50IDogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9ICQoZXZlbnQudGFyZ2V0KS52YWwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUZvcm1UeXBlKHR5cGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGQtb3B0aW9uXCJdJyxfYWRkT3B0aW9uKTtcblxuXG4gICAgICAgICAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsJ3NlbGVjdFtuYW1lJD1cIltmb3JtLXRheG9ub215XVwiXScsX2NoYW5nZVRheG9ub215KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cImZvcm0tcmVzZXQtYWN0aW9uXCJdJyxfY2hhbmdlUmVzZXRBY3Rpb24pO1xuXG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCcucGFuZWwgaGVhZGVyJyxfdG9nZ2xlUGFuZWwpOyovXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIENoYW5nZSB0aGUgdHlwZSBvZiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKiBAcGFyYW0gJGlucHV0XG4gICAgICogQHBhcmFtICRwb3NpdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBjaGFuZ2VJbnB1dCh0eXBlIDogc3RyaW5nLCRpbnB1dCA6IEVGX0lucHV0LCRwb3NpdGlvbiA6IG51bWJlcnxudWxsID0gbnVsbClcbiAgICB7XG4gICAgICAgIGxldCB2YWx1ZSA9ICRpbnB1dC52YWx1ZTtcblxuICAgICAgICB0aGlzLmFkZElucHV0KHR5cGUsdmFsdWUsJHBvc2l0aW9uKS50aGVuKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UsJ2ZpZWxkcycpO1xuICAgICAgICAgICAgaW5wdXQub3BlbigpO1xuICAgICAgICB9KVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYW4gaW5wdXQgdG8gdGhlIGVkaXRvclxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRJbnB1dCh0eXBlIDogc3RyaW5nID0gJ3RleHQnLCRkYXRhLHBvc2l0aW9uIDogbnVtYmVyfG51bGwgPSBudWxsKSA6IFByb21pc2U8YW55PlxuICAgIHtcblxuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG5cbiAgICAgICAgRUZfQWRkLmxvYWRpbmcodHJ1ZSwnZmllbGRzJyk7XG5cbiAgICAgICAgLy8gQ2xvc2UgYWxsIHRoZSBpbnB1dHNcbiAgICAgICAgJC5lYWNoKHRoaXMuaW5wdXRzLChrZXkgOiBudW1iZXIsIGlucHV0IDogRUZfSW5wdXQpID0+IHtcbiAgICAgICAgICAgIGlucHV0LmNsb3NlKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5nZXRJbnB1dCh0eXBlKS50aGVuKChkYXRhIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBpbnB1dCA6IEVGX0lucHV0O1xuXG4gICAgICAgICAgICBpbnB1dCA9IHRoaXMuZ2VuZXJhdGVJbnB1dCh0eXBlKTtcblxuICAgICAgICAgICAgaW5wdXQuaW5pdChkYXRhLHBvc2l0aW9uID8gcG9zaXRpb24gOiB0aGlzLmlucHV0cy5sZW5ndGgsJGRhdGEscG9zaXRpb24pO1xuXG4gICAgICAgICAgICBpZihwb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzW3Bvc2l0aW9uXSA9IGlucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0cy5wdXNoKGlucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGZkLnJlc29sdmUoaW5wdXQpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTaG93IG9yIGhpZGUgdGhlIGxvYWRpbmdzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbG9hZGluZ1xuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbG9hZGluZyhsb2FkaW5nIDogYm9vbGVhbiA9IHRydWUsJGVsZW1lbnQgOiBudWxsfHN0cmluZyA9IG51bGwpXG4gICAge1xuICAgICAgICAvLyBTaG93IHRoZSBzcGlubmVyXG5cbiAgICAgICAgc3dpdGNoICgkZWxlbWVudCkge1xuICAgICAgICAgICAgY2FzZSAnZmllbGRzJyA6XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItZmllbGRzJykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndXRpbGl0eScgOlxuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLXV0aWxpdHknKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICQoJyNzcGlubmVyLXV0aWxpdHknKS50b2dnbGUobG9hZGluZyk7XG4gICAgICAgICAgICAgICAgJCgnI3NwaW5uZXItZmllbGRzJykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIExvYWQgdGhlIGZvcm0gZGF0YSBmcm9tIHRoZSBiYWNrIG9mZmljZVxuICAgICAqL1xuICAgIHB1YmxpYyBsb2FkKCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgJC5nZXRKU09OKGFqYXhVcmwsIHtcbiAgICAgICAgICAgIGZvcm1faWQgOiBFRl9BZGQuZ2V0UGFyYW1ldGVyKCdwb3N0JyksXG4gICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX2Zvcm1fZGF0YSdcbiAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAvLyBBZGQgdGhlIGRhdGEgZm9yIGFsbCB0aGUgZm9ybVxuICAgICAgICAgICAgdGhpcy5hZGREYXRhKGRhdGEuZGF0YS5mb3JtKTtcbiAgICAgICAgICAgIHRoaXMuYWRkRm9ybURhdGEoZGF0YS5kYXRhLmZvcm0pO1xuXG5cbiAgICAgICAgICAgICQuZWFjaChkYXRhLmRhdGEuaW5wdXRzLCh0eXBlLGlucHV0IDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVJbnB1dHNbdHlwZV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5kYXRhLmZvcm1zLCh0eXBlLGlucHV0IDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVGb3Jtc1t0eXBlXSA9IGlucHV0O1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBzdWJtaXQgZGF0YVxuICAgICAgICAgICAgaWYoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdCkge1xuICAgICAgICAgICAgICAgIGxldCBzdWJtaXQgPSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkU3VibWl0RGF0YShzdWJtaXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMb2FkIGFsbCB0aGUgaW5wdXRzXG4gICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLDApO1xuXG5cblxuICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgZGF0YSBpbnNpZGUgdGhlIGZvcm0gaXRzZWxmXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZERhdGEoJGZvcm1EYXRhIDogYW55KSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbEluZm9zKCQoZWxlbSksJGZvcm1EYXRhKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJhdHRyaWJ1dGVzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNoYW5nZUZvcm1UeXBlKHR5cGUpIDogdm9pZFxuICAgIHtcblxuICAgICAgICBFRl9BZGQubG9hZGluZyh0cnVlLCd1dGlsaXR5Jyk7XG5cbiAgICAgICBsZXQgJGZvcm1EYXRhID0gdGhpcy5mb3JtVHlwZS52YWx1ZTtcblxuICAgICAgICRmb3JtRGF0YS50eXBlID0gdHlwZTtcblxuICAgICAgIHRoaXMuYWRkRm9ybURhdGEoJGZvcm1EYXRhKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgdGhlIGZvcm0gZGF0YSBpbiB0aGUgZm9ybSB0eXBlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZEZvcm1EYXRhKCRmb3JtRGF0YSkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmxvYWRGb3JtVGVtcGxhdGUoJGZvcm1EYXRhLnR5cGUpLnRoZW4oKCR0ZW1wbGF0ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtVHlwZSA9IHRoaXMuZ2VuZXJhdGVGb3JtKCRmb3JtRGF0YS50eXBlKTtcblxuICAgICAgICAgICAgdGhpcy5mb3JtVHlwZS5pbml0KCR0ZW1wbGF0ZSk7XG5cbiAgICAgICAgICAgICQoJyNlZi1hZGQtdHlwZScpLmZpbmQoJ1tuYW1lXj1cInNldHRpbmdzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbEluZm9zKCQoZWxlbSksJGZvcm1EYXRhKTtcblxuICAgICAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCd1dGlsaXR5Jyk7XG5cbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHVibGljIGxvYWRGb3JtVGVtcGxhdGUodHlwZSA6IHN0cmluZykgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgbGV0IGtleSA9ICdmb3JtLScgKyB0eXBlO1xuXG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlc1trZXldICYmIHRoaXMudGVtcGxhdGVzW2tleV0gIT0gdW5kZWZpbmVkICYmIHRoaXMudGVtcGxhdGVzW2tleV0gIT0gJycpIHtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKHRoaXMudGVtcGxhdGVzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkLmdldChhamF4VXJsLCB7XG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ2FjdGlvbnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlIDogdHlwZSxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX3RlbXBsYXRlJ1xuICAgICAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNba2V5XSA9IGRhdGEuZGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIEkgc2VuZCBiYWNrIHRoZSBkYXRhXG4gICAgICAgICAgICAgICAgZGZkLnJlc29sdmUoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgIH0pLmVycm9yKHRoaXMuaGFuZGxlRXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcbiAgICB9XG5cblxuICAgIHB1YmxpYyBmaWxsSW5mb3MoJGVsZW0sJGZvcm0pIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJGVsZW0pO1xuXG4gICAgICAgIGlmKCRmb3JtW3Byb3AuYXR0cl0gJiYgJGZvcm1bcHJvcC5hdHRyXVtwcm9wLmlkXSkge1xuXG4gICAgICAgICAgICBFRl9JbnB1dC5zZXRJbnB1dFZhbHVlKCRlbGVtLCRmb3JtW3Byb3AuYXR0cl1bcHJvcC5pZF0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCB0aGUgZGF0YSBpbnNpZGUgdGhlIHN1Ym1pdCBidXR0b25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdWJtaXRcbiAgICAgKi9cbiAgICBwcml2YXRlIGFkZFN1Ym1pdERhdGEoc3VibWl0KSA6IHZvaWRcbiAgICB7XG4gICAgICAgIEVGX0lucHV0LmFkZERhdGFUb0VsZW1lbnQodGhpcy4kYm9keS5maW5kKCcjZWYtYWRkLXN1Ym1pdCcpLHN1Ym1pdCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dHNcbiAgICAgKiBAcGFyYW0gb3JkZXJcbiAgICAgKi9cbiAgICBwcml2YXRlIGxvYWRJbnB1dHMoaW5wdXRzLG9yZGVyIDogbnVtYmVyKVxuICAgIHtcblxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKGlucHV0cyk7XG5cbiAgICAgICAgbGV0IGtleSA9IGtleXNbb3JkZXJdO1xuXG4gICAgICAgIGlmKCFrZXkgfHwgIWlucHV0cyB8fCAhaW5wdXRzW2tleV0pe1xuICAgICAgICAgICAgdGhpcy5pc19pbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIEVGX0FkZC5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmFkZElucHV0KGlucHV0c1trZXldLmF0dHJpYnV0ZXMudHlwZSxpbnB1dHNba2V5XSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgb3JkZXIrKztcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoaW5wdXRzLG9yZGVyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuXG5cbiAgICBwdWJsaWMgZ2VuZXJhdGVGb3JtKHR5cGUgOiBzdHJpbmcpIDogRUZfRm9ybVxuICAgIHtcbiAgICAgICAgbGV0IGZvcm07XG5cbiAgICAgICAgaWYoIXRoaXMuYXZhaWxhYmxlRm9ybXNbdHlwZV0pIHtcbiAgICAgICAgICAgIHR5cGUgPSAncG9zdCc7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2xvZ2luJyA6XG4gICAgICAgICAgICAgICAgZm9ybSA9IG5ldyBFRl9Gb3JtKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdwb3N0JyA6XG4gICAgICAgICAgICAgICAgZm9ybSA9IG5ldyBFRl9Gb3JtKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIWZvcm0pIHtcbiAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICB9XG5cblxuICAgICAgICByZXR1cm4gZm9ybTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2VuZXJhdGVJbnB1dCh0eXBlIDogc3RyaW5nKSA6IEVGX0lucHV0XG4gICAge1xuICAgICAgICBsZXQgaW5wdXQ7XG5cbiAgICAgICAgaWYoIXRoaXMuYXZhaWxhYmxlSW5wdXRzW3R5cGVdKSB7XG4gICAgICAgICAgICB0eXBlID0gJ3RleHQnO1xuICAgICAgICB9XG5cblxuICAgICAgICBzd2l0Y2godHlwZSkge1xuICAgICAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBuZXcgRUZfSW5wdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFpbnB1dCkge1xuICAgICAgICAgICAgaW5wdXQgPSBuZXcgRUZfSW5wdXQoKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcmV0dXJuIGlucHV0O1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIExvYWQgdGhlIGlucHV0IHRlbXBsYXRlIGZyb20gdGhlIEJPXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZSA6IHN0cmluZ1xuICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICovXG4gICAgcHVibGljIGdldElucHV0KHR5cGUgOiBzdHJpbmcgPSAndGV4dCcpXG4gICAge1xuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlc1t0eXBlXSAmJiB0aGlzLnRlbXBsYXRlc1t0eXBlXSAhPSB1bmRlZmluZWQgJiYgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gIT0gJycpIHtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKHRoaXMudGVtcGxhdGVzW3R5cGVdKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJC5nZXQoYWpheFVybCwge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdpbnB1dHMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlIDogdHlwZSxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX3RlbXBsYXRlJ1xuICAgICAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gPSBkYXRhLmRhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBJIHNlbmQgYmFjayB0aGUgZGF0YVxuICAgICAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEuZGF0YSk7XG4gICAgICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgSFRUUCBFcnJvcnNcbiAgICAgKlxuICAgICAqIEBUT0RPXG4gICAgICovXG4gICAgcHVibGljIGhhbmRsZUVycm9yKGRhdGEgOiBzdHJpbmd8e3Jlc3BvbnNlSlNPTiA6IHtlcnJvcn19KSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgbGV0IGVycm9yIDogc3RyaW5nO1xuXG4gICAgICAgIGlmKHR5cGVvZiBkYXRhICE9IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGVycm9yID0gZGF0YS5yZXNwb25zZUpTT04uZXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBFRl9BZGQuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgRUZfQWRkLmxvYWRpbmcoZmFsc2UpO1xuXG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogR2V0IHRoZSB1cmwgcGFyYW1ldGVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW1ldGVyXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldFBhcmFtZXRlcihwYXJhbWV0ZXIgOiBzdHJpbmcpOmFueVxuICAgIHtcbiAgICAgICAgdmFyIHBhcmFtc19zdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKTtcblxuICAgICAgICB2YXIgcGFyYW1zX2FycmF5ID0gcGFyYW1zX3N0cmluZy5zcGxpdCgnJicpO1xuXG4gICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgZm9yKHZhciBpID0wO2k8cGFyYW1zX2FycmF5Lmxlbmd0aDtpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBlID0gcGFyYW1zX2FycmF5W2ldLnNwbGl0KCc9Jyk7XG4gICAgICAgICAgICBvYmpbZVswXV0gPSBlWzFdXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JqW3BhcmFtZXRlcl07XG4gICAgfVxuXG5cblxuXG4gICAgLyoqXG4gICAgICogRGlzcGxheSBhbiBlcnJvciBtZXNzYWdlIHRoYXQgd2lsbCBmYWRlIG91dCBpbiA1IHNlY1xuICAgICAqXG4gICAgICogQHBhcmFtIGVycm9yTWVzc2FnZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0IGVycm9yKGVycm9yTWVzc2FnZSA6IHN0cmluZ3xib29sZWFuKSB7XG5cbiAgICAgICAgRUZfQWRkLnNldE1lc3NhZ2UoJyNlcnJvci1tZXNzYWdlJyxlcnJvck1lc3NhZ2UsZmFsc2UpO1xuXG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogRGlzcGxheSBhIHN1Y2Nlc3MgbWVzc2FnZSB0aGF0IHdpbGwgZmFkZSBvdXQgaW4gNSBzZWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdWNjZXNzTWVzc2FnZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0IHN1Y2Nlc3Moc3VjY2Vzc01lc3NhZ2U6IHN0cmluZ3xib29sZWFuKSB7XG5cbiAgICAgICBFRl9BZGQuc2V0TWVzc2FnZSgnI3N1Y2Nlc3MtbWVzc2FnZScsc3VjY2Vzc01lc3NhZ2UsZmFsc2UpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbWVudFxuICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICogQHBhcmFtIHBlcnNpc3QgOiBib29sZWFuLCBXZWl0aGVyIG9yIG5vdCB0aGUgbWVzc2FnZSBzaG91bGQgYmUgZGlzcGxheWVkIG9yIG5vdFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0TWVzc2FnZShlbGVtZW50IDogc3RyaW5nLG1lc3NhZ2UgOiBzdHJpbmd8Ym9vbGVhbiwgcGVyc2lzdCA6IGJvb2xlYW58bnVtYmVyID0gZmFsc2UpIDogdm9pZFxuICAgIHtcblxuICAgICAgICBpZihtZXNzYWdlKSB7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLnRleHQobWVzc2FnZSkuZmFkZUluKDIwMCk7XG5cbiAgICAgICAgICAgIGlmKCFwZXJzaXN0KSB7XG5cbiAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCBwZXJzaXN0IGlzIG5vdCBlcXVhbCB0byBmYWxzZVxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBwZXJzaXN0ID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgICAgICAgICBwZXJzaXN0ID0gNTAwMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRNZXNzYWdlKGVsZW1lbnQsJycpO1xuICAgICAgICAgICAgICAgIH0scGVyc2lzdCk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLmZhZGVPdXQoMjAwLCgpID0+IHtcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnRleHQoJycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxudmFyIEVGX2FkZCA9IG5ldyBFRl9BZGQoKTtcbkVGX2FkZC5pbml0KCk7Il19
