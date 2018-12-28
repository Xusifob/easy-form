System.register("forms/EF_Form", [], function(exports_1, context_1) {
    "use strict";
    var EF_Form;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function() {
            EF_Form = /** @class */ function() {
                function EF_Form() {
                    this.container = $("#utilities");
                }
                /**
                 *
                 * @param $element
                 * @param $data
                 */
                EF_Form.prototype.init = function($element, $data) {
                    this.element = $($element);
                    console.log(this.container);
                    console.log(this.element);
                    this.container.html(this.element);
                    this.addData($data);
                };
                /**
                 *
                 * @param $data
                 */
                EF_Form.prototype.addData = function($data) {};
                /**
                 * @var string
                 *
                 * The type of the input
                 */
                EF_Form.type = "text";
                return EF_Form;
            }();
            exports_1("EF_Form", EF_Form);
        }
    };
});

System.register("inputs/EF_Input", [], function(exports_2, context_2) {
    "use strict";
    var EF_Input;
    var __moduleName = context_2 && context_2.id;
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
            exports_2("EF_Input", EF_Input);
        }
    };
});

System.register("EF_Add", [ "forms/EF_Form", "inputs/EF_Input" ], function(exports_3, context_3) {
    "use strict";
    var EF_Form_1, EF_Input_1, EF_Add, EF_add;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [ function(EF_Form_1_1) {
            EF_Form_1 = EF_Form_1_1;
        }, function(EF_Input_1_1) {
            EF_Input_1 = EF_Input_1_1;
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
                    var _this = this;
                    this.setEvents();
                    this.load().then(function(data) {
                        _this.loading(false);
                    });
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
                            _this.loading(false, "fields");
                        });
                    });
                    this.$body.on("change", 'select[name$="[attributes][type]"]', function($event) {
                        var type = $($event.target).val();
                        var prop = EF_Input_1.EF_Input.getInputProperties($($event.target));
                        _this.changeInput(type, _this.inputs[prop.id], prop.id);
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
                    var _this = this;
                    if ($position === void 0) {
                        $position = null;
                    }
                    var value = $input.value;
                    this.addInput(type, value, $position).then(function(input) {
                        _this.loading(false, "fields");
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
                    this.loading(true, "fields");
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
                EF_Add.prototype.loading = function(loading, $element) {
                    // Show the spinner
                    if (loading === void 0) {
                        loading = true;
                    }
                    if ($element === void 0) {
                        $element = null;
                    }
                    switch ($element) {
                      case "fields":
                        this.$body.find("#spinner-fields").toggle(loading);
                        break;

                      case "utility":
                        this.$body.find("#spinner-utility").toggle(loading);
                        break;

                      default:
                        this.$body.find("#spinner-utility").toggle(loading);
                        this.$body.find("#spinner-fields").toggle(loading);
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
                EF_Add.prototype.addFormData = function($formData) {
                    var _this = this;
                    this.loadFormTemplate($formData.type).then(function($template) {
                        var $form = _this.generateForm($formData.type);
                        $form.init($template, $form);
                        $("#ef-add-type").find('[name^="settings"]').each(function(key, elem) {
                            _this.fillInfos($(elem), $formData);
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
                    var prop = EF_Input_1.EF_Input.getInputProperties($elem);
                    if ($form[prop.attr] && $form[prop.attr][prop.id]) {
                        EF_Input_1.EF_Input.setInputValue($elem, $form[prop.attr][prop.id]);
                    }
                };
                /**
                 *
                 * Add the data inside the submit button
                 *
                 * @param submit
                 */
                EF_Add.prototype.addSubmitData = function(submit) {
                    EF_Input_1.EF_Input.addDataToElement(this.$body.find("#ef-add-submit"), submit);
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
                        this.loading(false, "fields");
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
                        input = new EF_Input_1.EF_Input();
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
                EF_Add.prototype.handleError = function() {};
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
                return EF_Add;
            }();
            EF_add = new EF_Add();
            EF_add.init();
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2Zvcm1zL0VGX0Zvcm0udHMiLCJhc3NldHMvYWRtaW4vanMvc3JjL2FkZC9pbnB1dHMvRUZfSW5wdXQudHMiLCJhc3NldHMvYWRtaW4vanMvc3JjL2FkZC9FRl9BZGQudHMiXSwibmFtZXMiOlsiRUZfRm9ybSIsInRoaXMiLCJjb250YWluZXIiLCIkIiwicHJvdG90eXBlIiwiaW5pdCIsIiRlbGVtZW50IiwiJGRhdGEiLCJlbGVtZW50IiwiY29uc29sZSIsImxvZyIsImh0bWwiLCJhZGREYXRhIiwidHlwZSIsIkVGX0lucHV0IiwiaWQiLCJwb3NpdGlvbiIsInJlcGxhY2UiLCJvcHRpb25zRWxlbWVudCIsImZpbmQiLCJhcHBlbmQiLCJyZXBsYWNlV2l0aCIsInNldEV2ZW50cyIsIl90aGlzIiwib24iLCJ0b2dnbGUiLCJlbGVtIiwiaGFzQ2xhc3MiLCJjbG9zZSIsIm9wZW4iLCJhZGREYXRhVG9FbGVtZW50IiwiZWFjaCIsImtleSIsInByb3AiLCJnZXRJbnB1dFByb3BlcnRpZXMiLCJuYW1lIiwic2V0SW5wdXRWYWx1ZSIsImlucHV0IiwidmFsdWUiLCJpcyIsInZhbCIsImdldElucHV0VmFsdWUiLCJhdHRyIiwiZGF0YSIsInNwbGl0IiwiaGlkZSIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJzaG93IiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJFRl9BZGQiLCJ0ZW1wbGF0ZXMiLCJpbnB1dHMiLCJhdmFpbGFibGVJbnB1dHMiLCJhdmFpbGFibGVGb3JtcyIsImlzX2luaXQiLCIkYm9keSIsImxvYWQiLCJ0aGVuIiwibG9hZGluZyIsImFkZElucHV0IiwiJGV2ZW50IiwidGFyZ2V0IiwiRUZfSW5wdXRfMSIsImNoYW5nZUlucHV0IiwiJGlucHV0IiwiJHBvc2l0aW9uIiwiZGZkIiwiRGVmZXJyZWQiLCJnZXRJbnB1dCIsImdlbmVyYXRlSW5wdXQiLCJsZW5ndGgiLCJwdXNoIiwicmVzb2x2ZSIsInByb21pc2UiLCJnZXRKU09OIiwiYWpheFVybCIsImZvcm1faWQiLCJnZXRQYXJhbWV0ZXIiLCJhY3Rpb24iLCJzdWNjZXNzIiwiZm9ybSIsImFkZEZvcm1EYXRhIiwiZm9ybXMiLCJzdWJtaXQiLCJhZGRTdWJtaXREYXRhIiwibG9hZElucHV0cyIsImVycm9yIiwiaGFuZGxlRXJyb3IiLCIkZm9ybURhdGEiLCJmaWxsSW5mb3MiLCJsb2FkRm9ybVRlbXBsYXRlIiwiJHRlbXBsYXRlIiwiJGZvcm0iLCJnZW5lcmF0ZUZvcm0iLCJ1bmRlZmluZWQiLCJnZXQiLCJ0ZW1wbGF0ZSIsIiRlbGVtIiwib3JkZXIiLCJrZXlzIiwiYXR0cmlidXRlcyIsIkVGX0Zvcm1fMSIsInBhcmFtZXRlciIsInBhcmFtc19zdHJpbmciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInNlYXJjaCIsInN1YnN0ciIsInBhcmFtc19hcnJheSIsIm9iaiIsImkiLCJlIiwiRUZfYWRkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztnQkEyQkksU0FBQUE7b0JBRUlDLEtBQUtDLFlBQVlDLEVBQUU7Ozs7Ozs7Z0JBU2hCSCxRQUFBSSxVQUFBQyxPQUFQLFNBQVlDLFVBQWdCQztvQkFHeEJOLEtBQUtPLFVBQVVMLEVBQUVHO29CQUVqQkcsUUFBUUMsSUFBSVQsS0FBS0M7b0JBQ2pCTyxRQUFRQyxJQUFJVCxLQUFLTztvQkFFakJQLEtBQUtDLFVBQVVTLEtBQUtWLEtBQUtPO29CQUV6QlAsS0FBS1csUUFBUUw7Ozs7OztnQkFRVlAsUUFBQUksVUFBQVEsVUFBUCxTQUFlTDs7Ozs7O2dCQTlDRFAsUUFBQWEsT0FBZTtnQkFtRGpDLE9BQUFiOzs7Ozs7Ozs7Ozs7Ozs7Z0JDbEJJLFNBQUFjO29CQUVJYixLQUFLQyxZQUFZQyxFQUFFOzs7Ozs7Ozs7Z0JBWWhCVyxTQUFBVixVQUFBQyxPQUFQLFNBQVlDLFVBQWdCUyxJQUFZUixPQUFZUztvQkFBQSxJQUFBQSxrQkFBQSxHQUFBO3dCQUFBQSxXQUFBOztvQkFFaERmLEtBQUtjLEtBQUtBO29CQUVWVCxXQUFX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QUltRTtvQkFDSixLQUFJLElBQUlDLElBQUcsR0FBRUEsSUFBRUYsYUFBYXRDLFFBQU93QyxLQUNuQzt3QkFDSSxJQUFJQyxJQUFJSCxhQUFhRSxHQUFHcEUsTUFBTTt3QkFDOUJtRSxJQUFJRSxFQUFFLE1BQU1BLEVBQUU7O29CQUdsQixPQUFPRixJQUFJUDs7Z0JBR25CLE9BQUFyRDs7WUFFSStELFNBQVMsSUFBSS9EO1lBQ2pCK0QsT0FBTzdHIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBFRl9Gb3JtIHtcblxuICAgIC8qKlxuICAgICAqIEB2YXIgc3RyaW5nXG4gICAgICpcbiAgICAgKiBUaGUgdHlwZSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHR5cGU6IHN0cmluZyA9ICd0ZXh0JztcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgb2YgdGhlIGlucHV0XG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgZWxlbWVudDogYW55O1xuXG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgY29udGFpbmVyXG4gICAgICovXG4gICAgcHVibGljIGNvbnRhaW5lciA6IGFueTtcblxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gJCgnI3V0aWxpdGllcycpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gJGRhdGFcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdCgkZWxlbWVudCA6IGFueSwgJGRhdGEgOiBhbnkpXG4gICAge1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoJGVsZW1lbnQpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5lbGVtZW50KTtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5odG1sKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5hZGREYXRhKCRkYXRhKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICovXG4gICAgcHVibGljIGFkZERhdGEoJGRhdGEgOiBhbnkpXG4gICAge1xuXG4gICAgfVxuXG59IiwiXG5kZWNsYXJlIHZhciAkIDogYW55O1xuXG5leHBvcnQgY2xhc3MgRUZfSW5wdXRcbntcblxuICAgIC8qKlxuICAgICAqIEB2YXIgc3RyaW5nXG4gICAgICpcbiAgICAgKiBUaGUgdHlwZSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHR5cGUgOiBzdHJpbmcgPSAndGV4dCc7XG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgSFRNTCBFbGVtZW50XG4gICAgICpcbiAgICAgKiBUaGUgaHRtbCBlbGVtZW50IG9mIHRoZSBpbnB1dFxuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGVsZW1lbnQgOiBhbnk7XG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgSFRNTCBFbGVtZW50XG4gICAgICpcbiAgICAgKiBUaGUgaHRtbCBlbGVtZW50IGZvciB0aGUgb3B0aW9uXG4gICAgICovXG4gICAgcHVibGljIG9wdGlvbnNFbGVtZW50IDogYW55O1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgaWQgKHBvc2l0aW9uKSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgaWQgOiBudW1iZXI7XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBIVE1MIGVsZW1lbnQgb2YgdGhlIGNvbnRhaW5lclxuICAgICAqL1xuICAgIHB1YmxpYyBjb250YWluZXIgOiBhbnk7XG5cblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9ICQoJyNmbGQnKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gJGRhdGFcbiAgICAgKiBAcGFyYW0gaWRcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gOiBudW1iZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdCgkZWxlbWVudCA6IGFueSwgaWQgOiBudW1iZXIsJGRhdGEgOiBhbnkscG9zaXRpb24gOiBudWxsfG51bWJlciA9IG51bGwpXG4gICAge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG5cbiAgICAgICAgJGVsZW1lbnQgPSAkZWxlbWVudC5yZXBsYWNlKC9maWVsZElkL2csaWQpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoJGVsZW1lbnQpO1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5lZi10YWJsZScpO1xuXG4gICAgICAgIGlmKG51bGwgPT09IHBvc2l0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmQodGhpcy5lbGVtZW50KTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuZmluZCgnI2ZpZWxkLScgKyBwb3NpdGlvbikucmVwbGFjZVdpdGgodGhpcy5lbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0RXZlbnRzKCk7XG5cbiAgICAgICAgdGhpcy5hZGREYXRhKCRkYXRhKTtcbiAgICB9XG5cblxuXG5cbiAgICBwdWJsaWMgc2V0RXZlbnRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwib3Blbi1jbG9zZVwiXScpLm9uKCdjbGljaycsKCkgPT4ge3JldHVybiB0aGlzLnRvZ2dsZSgpfSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBDbG9zZSB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGUoKTogYm9vbGVhblxuICAgIHtcblxuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJvcGVuLWNsb3NlXCJdJyk7XG5cbiAgICAgICAgaWYoJChlbGVtKS5oYXNDbGFzcygnbWluaWZ5JykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wZW4oKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgdGhlIGRhdGEgaW4gdGhlIHRlbXBsYXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGRhdGFcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkRGF0YSgkZGF0YSkgOiB2b2lkXG4gICAge1xuICAgICAgICBFRl9JbnB1dC5hZGREYXRhVG9FbGVtZW50KHRoaXMuZWxlbWVudCwkZGF0YSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGREYXRhVG9FbGVtZW50KCRlbGVtZW50IDogYW55LCAkZGF0YSA6IGFueSkgOiB2b2lkXG4gICAge1xuICAgICAgICAkZWxlbWVudC5maW5kKCdbbmFtZV49XCJmaWVsZFwiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoZWxlbSkpO1xuXG4gICAgICAgICAgICBpZigkZGF0YVtwcm9wLnByb3BdICYmICRkYXRhW3Byb3AucHJvcF1bcHJvcC5uYW1lXSkge1xuICAgICAgICAgICAgICAgIEVGX0lucHV0LnNldElucHV0VmFsdWUoJChlbGVtKSwkZGF0YVtwcm9wLnByb3BdW3Byb3AubmFtZV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQWRkIGEgdmFsdWUgdG8gYW4gaW5wdXRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0SW5wdXRWYWx1ZShpbnB1dCA6IGFueSwgdmFsdWUgOiBzdHJpbmd8Ym9vbGVhbilcbiAgICB7XG4gICAgICAgIGlmKGlucHV0LmlzKCc6Y2hlY2tib3gnKSl7XG4gICAgICAgICAgICBpZih2YWx1ZSA9PSAnb24nKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5wdXQucHJvcCgnY2hlY2tlZCcsdmFsdWUpO1xuICAgICAgICB9ZWxzZSBpZihpbnB1dC5pcygnc2VsZWN0Jykpe1xuICAgICAgICAgICAgaW5wdXQuZmluZCgnb3B0aW9uW3ZhbHVlPVwiJysgdmFsdWUgKydcIl0nKS5wcm9wKCdzZWxlY3RlZCcsdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGlucHV0LnZhbCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiBhbiBpbnB1dFxuICAgICAqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKiBAcmV0dXJucyBhbnlcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldElucHV0VmFsdWUoaW5wdXQgOiBhbnkpXG4gICAge1xuXG4gICAgICAgIGlmKHR5cGVvZiBpbnB1dC52YWwgIT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmKGlucHV0LmlzKCc6Y2hlY2tib3gnKSl7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQuaXMoJzpjaGVja2VkJyk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnZhbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJuIGFsbCB0aGUgcHJvcGVydGllcyBvZiBhbiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIGVsZW1cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldElucHV0UHJvcGVydGllcyhlbGVtIDogYW55KSA6IHthdHRyLGlkLHByb3AsbmFtZX1cbiAgICB7XG5cbiAgICAgICAgbGV0IG5hbWUgPSBlbGVtLmF0dHIoJ25hbWUnKTtcblxuICAgICAgICBsZXQgZGF0YSA9IG5hbWUuc3BsaXQoJ1snKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXR0ciA6IGRhdGFbMF0ucmVwbGFjZSgnXScsJycpLFxuICAgICAgICAgICAgaWQgOiBkYXRhWzFdLnJlcGxhY2UoJ10nLCcnKSxcbiAgICAgICAgICAgIHByb3AgOiBkYXRhWzJdID8gZGF0YVsyXS5yZXBsYWNlKCddJywnJykgOiAnJyxcbiAgICAgICAgICAgIG5hbWUgOiBkYXRhWzNdID8gZGF0YVszXS5yZXBsYWNlKCddJywnJykgOiAnJyxcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHNpbmNlIDEuMS4wXG4gICAgICpcbiAgICAgKiBAZXZlbnQgOiBDbGljayBvbiBtaW5pZnkgYnV0dG9uIDogaGlkZSB0aGUgb3B0aW9ucyBvZiB0aGUgZmllbGRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcHVibGljIGNsb3NlKCkgOiBib29sZWFuXG4gICAge1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50LmhpZGUoMjAwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5taW5pZnknKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdtaW5pZnknKVxuICAgICAgICAgICAgLmFkZENsYXNzKCdvcGVuJylcbiAgICAgICAgICAgIC5odG1sKCcrJyk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAc2luY2UgMS4xLjBcbiAgICAgKlxuICAgICAqIE9wZW4gYSBmaWVsZFxuICAgICAqXG4gICAgICogQGV2ZW50IDogQ2xpY2sgb24gb3BlbiBidXR0b24sIHNob3cgdGhlIGZpZWxkIG9wdGlvbnNcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcHVibGljIG9wZW4oKSA6IGJvb2xlYW5cbiAgICB7XG4gICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQuc2hvdygyMDApO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnLm9wZW4nKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdvcGVuJylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnbWluaWZ5JylcbiAgICAgICAgICAgIC5odG1sKCctJyk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gdGhlIHZhbHVlIG9mIGFsbCB0aGUgaW5wdXRzIGluIHRoZSBmaWVsZFxuICAgICAqXG4gICAgICovXG4gICAgZ2V0IHZhbHVlKCk6IGFueSB7XG5cbiAgICAgICAgbGV0IHZhbHVlID0ge307XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tuYW1lXj1cImZpZWxkXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGlucHV0IDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gRUZfSW5wdXQuZ2V0SW5wdXRQcm9wZXJ0aWVzKCQoaW5wdXQpKTtcbiAgICAgICAgICAgIGxldCB2YWwgPSBFRl9JbnB1dC5nZXRJbnB1dFZhbHVlKCQoaW5wdXQpKTtcblxuICAgICAgICAgICAgaWYocHJvcC5wcm9wICYmICF2YWx1ZVtwcm9wLnByb3BdICYmIHByb3AubmFtZSl7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5wcm9wXSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih2YWx1ZVtwcm9wLnByb3BdKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbcHJvcC5wcm9wXVtwcm9wLm5hbWVdID0gdmFsO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlW3Byb3AucHJvcF0gPSB2YWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG5cbiAgICB9XG5cblxuICAgIC8vIFZvaWRcbiAgICBzZXQgdmFsdWUodmFsdWUgOiBhbnkpIHsgfVxuXG59IiwiaW1wb3J0IHtFRl9Gb3JtfSBmcm9tIFwiLi9mb3Jtcy9FRl9Gb3JtXCI7XG5cbmRlY2xhcmUgdmFyICQ7XG5cbmRlY2xhcmUgdmFyIGFqYXhVcmwgOiBzdHJpbmc7XG5cbmltcG9ydCB7RUZfSW5wdXR9IGZyb20gJy4vaW5wdXRzL0VGX0lucHV0JztcblxuY2xhc3MgRUZfQWRkXG57XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBIVE1MIEJvZHkgb2YgdGhlIHBhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgJGJvZHk7XG5cbiAgICAvKipcbiAgICAgKkFuIG9iamVjdCBvZiBhbGwgdGhlIGlucHV0IHRlbXBsYXRlcyBjYWNoZWQgdG8gYXZvaWQgbGF0ZW5jeVxuICAgICAqL1xuICAgIHB1YmxpYyB0ZW1wbGF0ZXMgOiBhbnkgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIGFsbCB0aGUgaW5wdXRzIGF2YWlsYWJsZSBvbiB0aGUgcGFnZVxuICAgICAqL1xuICAgIHB1YmxpYyBpbnB1dHMgOiBFRl9JbnB1dFtdID0gW107XG5cblxuICAgIC8qKlxuICAgICAqIEFsbCB0aGUgYXZhaWxhYmxlIGlucHV0c1xuICAgICAqL1xuICAgIHB1YmxpYyBhdmFpbGFibGVJbnB1dHMgOiB7fSA9IHt9O1xuXG5cbiAgLyoqXG4gICAgICogQWxsIHRoZSBhdmFpbGFibGUgaW5wdXRzXG4gICAgICovXG4gICAgcHVibGljIGF2YWlsYWJsZUZvcm1zIDoge30gPSB7fTtcblxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIGVkaXRvciBpcyBpbml0XG4gICAgICovXG4gICAgcHVibGljIGlzX2luaXQgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy4kYm9keSA9ICQoJ2JvZHknKTtcblxuICAgIH1cblxuXG4gICAgcHVibGljIGluaXQoKSB7XG5cbiAgICAgICAgdGhpcy5zZXRFdmVudHMoKTtcblxuICAgICAgICB0aGlzLmxvYWQoKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmcoZmFsc2UpO1xuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIHNldEV2ZW50cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgLypcbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5tb3ZlJyxfbW92ZSk7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy51cCcsX3VwKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLmRvd24nLF9kb3duKTtcblxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnLnJlbW92ZW9wdGlvbicsX3JlbW92ZU9wdGlvbik7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5kdXBsaXF1ZXInLF9kdXBsaWNhdGUpOyovXG5cbiAgICAgICAgLy8gQWRkIGEgbmV3IGZpZWxkXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGRcIl0nLCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZElucHV0KCd0ZXh0Jyx7fSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZyhmYWxzZSwnZmllbGRzJyk7XG4gICAgICAgICAgICAgICAgfSkgfSk7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZSQ9XCJbYXR0cmlidXRlc11bdHlwZV1cIl0nLCgkZXZlbnQgOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gJCgkZXZlbnQudGFyZ2V0KS52YWwoKTtcbiAgICAgICAgICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkKCRldmVudC50YXJnZXQpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZUlucHV0KHR5cGUsdGhpcy5pbnB1dHNbcHJvcC5pZF0scHJvcC5pZClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8qXG4gICAgICAgICAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywnYnV0dG9uW2RhdGEtYWN0aW9uPVwiYWRkLW9wdGlvblwiXScsX2FkZE9wdGlvbik7XG5cblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZSQ9XCJbZm9ybS10YXhvbm9teV1cIl0nLF9jaGFuZ2VUYXhvbm9teSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWU9XCJmb3JtLXJlc2V0LWFjdGlvblwiXScsX2NoYW5nZVJlc2V0QWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cInNldHRpbmdzW3R5cGVdXCJdJyxfY2hhbmdlVXRpbGl0eSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCcucGFuZWwgaGVhZGVyJyxfdG9nZ2xlUGFuZWwpOyovXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIENoYW5nZSB0aGUgdHlwZSBvZiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKiBAcGFyYW0gJGlucHV0XG4gICAgICogQHBhcmFtICRwb3NpdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBjaGFuZ2VJbnB1dCh0eXBlIDogc3RyaW5nLCRpbnB1dCA6IEVGX0lucHV0LCRwb3NpdGlvbiA6IG51bWJlcnxudWxsID0gbnVsbClcbiAgICB7XG4gICAgICAgIGxldCB2YWx1ZSA9ICRpbnB1dC52YWx1ZTtcblxuICAgICAgICB0aGlzLmFkZElucHV0KHR5cGUsdmFsdWUsJHBvc2l0aW9uKS50aGVuKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nKGZhbHNlLCdmaWVsZHMnKTtcbiAgICAgICAgICAgIGlucHV0Lm9wZW4oKTtcbiAgICAgICAgfSlcbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICogQWRkIGFuIGlucHV0IHRvIHRoZSBlZGl0b3JcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkSW5wdXQodHlwZSA6IHN0cmluZyA9ICd0ZXh0JywkZGF0YSxwb3NpdGlvbiA6IG51bWJlcnxudWxsID0gbnVsbCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuXG4gICAgICAgIHRoaXMubG9hZGluZyh0cnVlLCdmaWVsZHMnKTtcblxuICAgICAgICAvLyBDbG9zZSBhbGwgdGhlIGlucHV0c1xuICAgICAgICAkLmVhY2godGhpcy5pbnB1dHMsKGtleSA6IG51bWJlciwgaW5wdXQgOiBFRl9JbnB1dCkgPT4ge1xuICAgICAgICAgICAgaW5wdXQuY2xvc2UoKVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmdldElucHV0KHR5cGUpLnRoZW4oKGRhdGEgOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgbGV0IGlucHV0IDogRUZfSW5wdXQ7XG5cbiAgICAgICAgICAgIGlucHV0ID0gdGhpcy5nZW5lcmF0ZUlucHV0KHR5cGUpO1xuXG4gICAgICAgICAgICBpbnB1dC5pbml0KGRhdGEscG9zaXRpb24gPyBwb3NpdGlvbiA6IHRoaXMuaW5wdXRzLmxlbmd0aCwkZGF0YSxwb3NpdGlvbik7XG5cbiAgICAgICAgICAgIGlmKHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dHNbcG9zaXRpb25dID0gaW5wdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRzLnB1c2goaW5wdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZmQucmVzb2x2ZShpbnB1dCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcblxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFNob3cgb3IgaGlkZSB0aGUgbG9hZGluZ3NcbiAgICAgKlxuICAgICAqIEBwYXJhbSBsb2FkaW5nXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICovXG4gICAgcHVibGljIGxvYWRpbmcobG9hZGluZyA6IGJvb2xlYW4gPSB0cnVlLCRlbGVtZW50IDogbnVsbHxzdHJpbmcgPSBudWxsKVxuICAgIHtcbiAgICAgICAgLy8gU2hvdyB0aGUgc3Bpbm5lclxuXG4gICAgICAgIHN3aXRjaCAoJGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNhc2UgJ2ZpZWxkcycgOlxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHkuZmluZCgnI3NwaW5uZXItZmllbGRzJykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndXRpbGl0eScgOlxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHkuZmluZCgnI3NwaW5uZXItdXRpbGl0eScpLnRvZ2dsZShsb2FkaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy4kYm9keS5maW5kKCcjc3Bpbm5lci11dGlsaXR5JykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHkuZmluZCgnI3NwaW5uZXItZmllbGRzJykudG9nZ2xlKGxvYWRpbmcpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIExvYWQgdGhlIGZvcm0gZGF0YSBmcm9tIHRoZSBiYWNrIG9mZmljZVxuICAgICAqL1xuICAgIHB1YmxpYyBsb2FkKCkgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgJC5nZXRKU09OKGFqYXhVcmwsIHtcbiAgICAgICAgICAgIGZvcm1faWQgOiBFRl9BZGQuZ2V0UGFyYW1ldGVyKCdwb3N0JyksXG4gICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX2Zvcm1fZGF0YSdcbiAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAvLyBBZGQgdGhlIGRhdGEgZm9yIGFsbCB0aGUgZm9ybVxuICAgICAgICAgICAgdGhpcy5hZGREYXRhKGRhdGEuZGF0YS5mb3JtKTtcbiAgICAgICAgICAgIHRoaXMuYWRkRm9ybURhdGEoZGF0YS5kYXRhLmZvcm0pO1xuXG5cbiAgICAgICAgICAgICQuZWFjaChkYXRhLmRhdGEuaW5wdXRzLCh0eXBlLGlucHV0IDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVJbnB1dHNbdHlwZV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5kYXRhLmZvcm1zLCh0eXBlLGlucHV0IDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVGb3Jtc1t0eXBlXSA9IGlucHV0O1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBzdWJtaXQgZGF0YVxuICAgICAgICAgICAgaWYoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdCkge1xuICAgICAgICAgICAgICAgIGxldCBzdWJtaXQgPSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkU3VibWl0RGF0YShzdWJtaXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMb2FkIGFsbCB0aGUgaW5wdXRzXG4gICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLDApO1xuXG5cblxuICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgZGF0YSBpbnNpZGUgdGhlIGZvcm0gaXRzZWxmXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGZvcm1EYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZERhdGEoJGZvcm1EYXRhIDogYW55KSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbEluZm9zKCQoZWxlbSksJGZvcm1EYXRhKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJhdHRyaWJ1dGVzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybURhdGEpO1xuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgYWRkRm9ybURhdGEoJGZvcm1EYXRhKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMubG9hZEZvcm1UZW1wbGF0ZSgkZm9ybURhdGEudHlwZSkudGhlbigoJHRlbXBsYXRlKSA9PiB7XG4gICAgICAgICAgICBsZXQgJGZvcm0gOiBFRl9Gb3JtID0gdGhpcy5nZW5lcmF0ZUZvcm0oJGZvcm1EYXRhLnR5cGUpO1xuICAgICAgICAgICAgJGZvcm0uaW5pdCgkdGVtcGxhdGUsJGZvcm0pO1xuXG4gICAgICAgICAgICAkKCcjZWYtYWRkLXR5cGUnKS5maW5kKCdbbmFtZV49XCJzZXR0aW5nc1wiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxJbmZvcygkKGVsZW0pLCRmb3JtRGF0YSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHVibGljIGxvYWRGb3JtVGVtcGxhdGUodHlwZSA6IHN0cmluZykgOiBQcm9taXNlPGFueT5cbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgbGV0IGtleSA9ICdmb3JtLScgKyB0eXBlO1xuXG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlc1trZXldICYmIHRoaXMudGVtcGxhdGVzW2tleV0gIT0gdW5kZWZpbmVkICYmIHRoaXMudGVtcGxhdGVzW2tleV0gIT0gJycpIHtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKHRoaXMudGVtcGxhdGVzW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkLmdldChhamF4VXJsLCB7XG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ2FjdGlvbnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlIDogdHlwZSxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX3RlbXBsYXRlJ1xuICAgICAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNba2V5XSA9IGRhdGEuZGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIEkgc2VuZCBiYWNrIHRoZSBkYXRhXG4gICAgICAgICAgICAgICAgZGZkLnJlc29sdmUoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgIH0pLmVycm9yKHRoaXMuaGFuZGxlRXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcbiAgICB9XG5cblxuICAgIHB1YmxpYyBmaWxsSW5mb3MoJGVsZW0sJGZvcm0pIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJGVsZW0pO1xuXG4gICAgICAgIGlmKCRmb3JtW3Byb3AuYXR0cl0gJiYgJGZvcm1bcHJvcC5hdHRyXVtwcm9wLmlkXSkge1xuXG4gICAgICAgICAgICBFRl9JbnB1dC5zZXRJbnB1dFZhbHVlKCRlbGVtLCRmb3JtW3Byb3AuYXR0cl1bcHJvcC5pZF0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCB0aGUgZGF0YSBpbnNpZGUgdGhlIHN1Ym1pdCBidXR0b25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdWJtaXRcbiAgICAgKi9cbiAgICBwcml2YXRlIGFkZFN1Ym1pdERhdGEoc3VibWl0KSA6IHZvaWRcbiAgICB7XG4gICAgICAgIEVGX0lucHV0LmFkZERhdGFUb0VsZW1lbnQodGhpcy4kYm9keS5maW5kKCcjZWYtYWRkLXN1Ym1pdCcpLHN1Ym1pdCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dHNcbiAgICAgKiBAcGFyYW0gb3JkZXJcbiAgICAgKi9cbiAgICBwcml2YXRlIGxvYWRJbnB1dHMoaW5wdXRzLG9yZGVyIDogbnVtYmVyKVxuICAgIHtcblxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKGlucHV0cyk7XG5cbiAgICAgICAgbGV0IGtleSA9IGtleXNbb3JkZXJdO1xuXG4gICAgICAgIGlmKCFrZXkgfHwgIWlucHV0cyB8fCAhaW5wdXRzW2tleV0pe1xuICAgICAgICAgICAgdGhpcy5pc19pbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZyhmYWxzZSwnZmllbGRzJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5hZGRJbnB1dChpbnB1dHNba2V5XS5hdHRyaWJ1dGVzLnR5cGUsaW5wdXRzW2tleV0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9yZGVyKys7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cyxvcmRlcik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG4gICAgcHVibGljIGdlbmVyYXRlRm9ybSh0eXBlIDogc3RyaW5nKSA6IEVGX0Zvcm1cbiAgICB7XG4gICAgICAgIGxldCBmb3JtO1xuXG4gICAgICAgIGlmKCF0aGlzLmF2YWlsYWJsZUZvcm1zW3R5cGVdKSB7XG4gICAgICAgICAgICB0eXBlID0gJ3Bvc3QnO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdsb2dpbicgOlxuICAgICAgICAgICAgICAgIGZvcm0gPSBuZXcgRUZfRm9ybSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cblxuICAgICAgICByZXR1cm4gZm9ybTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2VuZXJhdGVJbnB1dCh0eXBlIDogc3RyaW5nKSA6IEVGX0lucHV0XG4gICAge1xuICAgICAgICBsZXQgaW5wdXQ7XG5cbiAgICAgICAgaWYoIXRoaXMuYXZhaWxhYmxlSW5wdXRzW3R5cGVdKSB7XG4gICAgICAgICAgICB0eXBlID0gJ3RleHQnO1xuICAgICAgICB9XG5cblxuICAgICAgICBzd2l0Y2godHlwZSkge1xuICAgICAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBuZXcgRUZfSW5wdXQoKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcmV0dXJuIGlucHV0O1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIExvYWQgdGhlIGlucHV0IHRlbXBsYXRlIGZyb20gdGhlIEJPXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZSA6IHN0cmluZ1xuICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICovXG4gICAgcHVibGljIGdldElucHV0KHR5cGUgOiBzdHJpbmcgPSAndGV4dCcpXG4gICAge1xuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlc1t0eXBlXSAmJiB0aGlzLnRlbXBsYXRlc1t0eXBlXSAhPSB1bmRlZmluZWQgJiYgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gIT0gJycpIHtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKHRoaXMudGVtcGxhdGVzW3R5cGVdKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJC5nZXQoYWpheFVybCwge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdpbnB1dHMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlIDogdHlwZSxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX3RlbXBsYXRlJ1xuICAgICAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gPSBkYXRhLmRhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBJIHNlbmQgYmFjayB0aGUgZGF0YVxuICAgICAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEuZGF0YSk7XG4gICAgICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgSFRUUCBFcnJvcnNcbiAgICAgKlxuICAgICAqIEBUT0RPXG4gICAgICovXG4gICAgcHVibGljIGhhbmRsZUVycm9yKCkgOiB2b2lkXG4gICAge1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEdldCB0aGUgdXJsIHBhcmFtZXRlclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtZXRlclxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRQYXJhbWV0ZXIocGFyYW1ldGVyIDogc3RyaW5nKTphbnlcbiAgICB7XG4gICAgICAgIHZhciBwYXJhbXNfc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSk7XG5cbiAgICAgICAgdmFyIHBhcmFtc19hcnJheSA9IHBhcmFtc19zdHJpbmcuc3BsaXQoJyYnKTtcblxuICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgIGZvcih2YXIgaSA9MDtpPHBhcmFtc19hcnJheS5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZSA9IHBhcmFtc19hcnJheVtpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgb2JqW2VbMF1dID0gZVsxXVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9ialtwYXJhbWV0ZXJdO1xuICAgIH1cblxufVxuXG52YXIgRUZfYWRkID0gbmV3IEVGX0FkZCgpO1xuRUZfYWRkLmluaXQoKTsiXX0=
