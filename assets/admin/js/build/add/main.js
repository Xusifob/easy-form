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
                 */
                EF_Input.prototype.init = function($element, id, $data) {
                    this.id = id;
                    $element = $element.replace(/fieldId/g, id);
                    this.element = $($element);
                    this.optionsElement = this.element.find(".ef-table");
                    this.container.append(this.element);
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

System.register("EF_Add", [ "inputs/EF_Input" ], function(exports_2, context_2) {
    "use strict";
    var EF_Input_1, EF_Add, EF_add;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [ function(EF_Input_1_1) {
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
                     * If the editor is init
                     */
                    this.is_init = false;
                    this.$body = $("body");
                    this.setEvents();
                    this.load().then(function(data) {});
                }
                EF_Add.prototype.init = function(form) {
                    console.log(form);
                };
                EF_Add.prototype.setEvents = function() {
                    /*
                    this.$body
                        .on('click','.move',_move);
            
                    // Delete a field
                    this.$body
                        .on('click','.delete',_delete);
            
            
                    this.$body
                        .on('click','.up',_up);
            
                    this.$body
                        .on('click','.down',_down);
            
                    this.$body
                        .on('click','.removeoption',_removeOption);
            
                    this.$body
                        .on('click','.dupliquer',_duplicate);*/
                    // Add a new field
                    this.$body.on("click", 'button[data-action="add"]', this.addInput);
                };
                /**
                 * Add an input to the editor
                 */
                EF_Add.prototype.addInput = function(type, $data) {
                    var _this = this;
                    if (type === void 0) {
                        type = "text";
                    }
                    // Create a promise
                    var dfd = new $.Deferred();
                    this.loading(true);
                    // Close all the inputs
                    $.each(this.inputs, function(key, input) {
                        input.close();
                    });
                    this.getInput(type).then(function(data) {
                        var input;
                        input = _this.generateInput(type);
                        input.init(data.data, _this.inputs.length, $data);
                        _this.inputs.push(input);
                        dfd.resolve(input);
                    });
                    // Return a promise
                    return dfd.promise();
                };
                /**
                 *
                 * @param loading
                 */
                EF_Add.prototype.loading = function(loading) {
                    if (loading === void 0) {
                        loading = true;
                    }
                    // Show the spinner
                    $("#spinner-fields").toggle(loading);
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
                        _this.addData(data.data.form);
                        $.each(data.data.inputs, function(type, input) {
                            _this.availableInputs[type] = input;
                        });
                        if (data.data.form.inputs.submit) {
                            var submit = data.data.form.inputs.submit;
                            delete data.data.form.inputs.submit;
                            _this.addSubmitData(submit);
                        }
                        _this.loadInputs(data.data.form.inputs, 0);
                        // I send back the data
                        dfd.resolve(data);
                    }).error(this.handleError);
                    // Return a promise
                    return dfd.promise();
                };
                /**
                 * Add the data inside the form itself
                 */
                EF_Add.prototype.addData = function($form) {
                    var _this = this;
                    console.log($form);
                    $("#ef-add-main-info").find('[name^="settings"]').each(function(key, elem) {
                        _this.fillInfos($(elem), $form);
                    });
                    $("#ef-add-main-info").find('[name^="attributes"]').each(function(key, elem) {
                        _this.fillInfos($(elem), $form);
                    });
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
                        this.loading(false);
                        return;
                    } else {
                        this.addInput(inputs[key].attributes.type, inputs[key]).then(function() {
                            order++;
                            _this.loadInputs(inputs, order);
                        });
                    }
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
                            _this.templates[type] = data;
                            // I send back the data
                            dfd.resolve(data);
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
        }
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2lucHV0cy9FRl9JbnB1dC50cyIsImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL0VGX0FkZC50cyJdLCJuYW1lcyI6WyJFRl9JbnB1dCIsInRoaXMiLCJjb250YWluZXIiLCIkIiwicHJvdG90eXBlIiwiaW5pdCIsIiRlbGVtZW50IiwiaWQiLCIkZGF0YSIsInJlcGxhY2UiLCJlbGVtZW50Iiwib3B0aW9uc0VsZW1lbnQiLCJmaW5kIiwiYXBwZW5kIiwic2V0RXZlbnRzIiwiYWRkRGF0YSIsIl90aGlzIiwib24iLCJ0b2dnbGUiLCJlbGVtIiwiaGFzQ2xhc3MiLCJjbG9zZSIsIm9wZW4iLCJhZGREYXRhVG9FbGVtZW50IiwiZWFjaCIsImtleSIsInByb3AiLCJnZXRJbnB1dFByb3BlcnRpZXMiLCJuYW1lIiwic2V0SW5wdXRWYWx1ZSIsImlucHV0IiwidmFsdWUiLCJpcyIsInZhbCIsImF0dHIiLCJkYXRhIiwic3BsaXQiLCJoaWRlIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImh0bWwiLCJzaG93IiwidHlwZSIsIkVGX0FkZCIsInRlbXBsYXRlcyIsImlucHV0cyIsImF2YWlsYWJsZUlucHV0cyIsImlzX2luaXQiLCIkYm9keSIsImxvYWQiLCJ0aGVuIiwiZm9ybSIsImNvbnNvbGUiLCJsb2ciLCJhZGRJbnB1dCIsImRmZCIsIkRlZmVycmVkIiwibG9hZGluZyIsImdldElucHV0IiwiZ2VuZXJhdGVJbnB1dCIsImxlbmd0aCIsInB1c2giLCJyZXNvbHZlIiwicHJvbWlzZSIsImdldEpTT04iLCJhamF4VXJsIiwiZm9ybV9pZCIsImdldFBhcmFtZXRlciIsImFjdGlvbiIsInN1Y2Nlc3MiLCJzdWJtaXQiLCJhZGRTdWJtaXREYXRhIiwibG9hZElucHV0cyIsImVycm9yIiwiaGFuZGxlRXJyb3IiLCIkZm9ybSIsImZpbGxJbmZvcyIsIiRlbGVtIiwiRUZfSW5wdXRfMSIsIm9yZGVyIiwia2V5cyIsIk9iamVjdCIsImF0dHJpYnV0ZXMiLCJ1bmRlZmluZWQiLCJnZXQiLCJ0ZW1wbGF0ZSIsInBhcmFtZXRlciIsInBhcmFtc19zdHJpbmciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInNlYXJjaCIsInN1YnN0ciIsInBhcmFtc19hcnJheSIsIm9iaiIsImkiLCJlIiwiRUZfYWRkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztnQkEwQ0ksU0FBQUE7b0JBRUlDLEtBQUtDLFlBQVlDLEVBQUU7Ozs7Ozs7O2dCQVdoQkgsU0FBQUksVUFBQUMsT0FBUCxTQUFZQyxVQUFnQkMsSUFBWUM7b0JBRXBDUCxLQUFLTSxLQUFLQTtvQkFFVkQsV0FBV0EsU0FBU0csUUFBUSxZQUFXRjtvQkFFdkNOLEtBQUtTLFVBQVVQLEVBQUVHO29CQUNqQkwsS0FBS1UsaUJBQWlCVixLQUFLUyxRQUFRRSxLQUFLO29CQUV4Q1gsS0FBS0MsVUFBVVcsT0FBT1osS0FBS1M7b0JBRTNCVCxLQUFLYTtvQkFFTGIsS0FBS2MsUUFBUVA7O2dCQU1WUixTQUFBSSxVQUFBVSxZQUFQO29CQUFBLElBQUFFLFFBQUFmO29CQUVJQSxLQUFLUyxRQUFRRSxLQUFLLDhCQUE4QkssR0FBRyxTQUFRO3dCQUFPLE9BQU9ELE1BQUtFOzs7Ozs7Z0JBTzNFbEIsU0FBQUksVUFBQWMsU0FBUDtvQkFHSSxJQUFJQyxPQUFPbEIsS0FBS1MsUUFBUUUsS0FBSztvQkFFN0IsSUFBR1QsRUFBRWdCLE1BQU1DLFNBQVMsV0FBVzt3QkFDM0IsT0FBT25CLEtBQUtvQjsyQkFDVjt3QkFDRixPQUFPcEIsS0FBS3FCOzs7Ozs7OztnQkFXYnRCLFNBQUFJLFVBQUFXLFVBQVAsU0FBZVA7b0JBRVhSLFNBQVN1QixpQkFBaUJ0QixLQUFLUyxTQUFRRjs7Ozs7OztnQkFTN0JSLFNBQUF1QixtQkFBZCxTQUErQmpCLFVBQWdCRTtvQkFFM0NGLFNBQVNNLEtBQUssbUJBQW1CWSxLQUFLLFNBQUNDLEtBQWFOO3dCQUVoRCxJQUFJTyxPQUFPMUIsU0FBUzJCLG1CQUFtQnhCLEVBQUVnQjt3QkFFekMsSUFBR1gsTUFBTWtCLEtBQUtBLFNBQVNsQixNQUFNa0IsS0FBS0EsTUFBTUEsS0FBS0UsT0FBTzs0QkFDaEQ1QixTQUFTNkIsY0FBYzFCLEVBQUVnQixPQUFNWCxNQUFNa0IsS0FBS0EsTUFBTUEsS0FBS0U7Ozs7Ozs7Ozs7O2dCQWVuRDVCLFNBQUE2QixnQkFBZCxTQUE0QkMsT0FBYUM7b0JBRXJDLElBQUdELE1BQU1FLEdBQUcsY0FBYTt3QkFDckIsSUFBR0QsU0FBUyxNQUFNOzRCQUNkQSxRQUFROzt3QkFFWkQsTUFBTUosS0FBSyxXQUFVSzsyQkFDbkIsSUFBR0QsTUFBTUUsR0FBRyxXQUFVO3dCQUN4QkYsTUFBTWxCLEtBQUssbUJBQWtCbUIsUUFBTyxNQUFNTCxLQUFLLFlBQVc7MkJBRTFEO3dCQUNBSSxNQUFNRyxJQUFJRjs7Ozs7Ozs7O2dCQVdKL0IsU0FBQTJCLHFCQUFkLFNBQWlDUjtvQkFHN0IsSUFBSVMsT0FBT1QsS0FBS2UsS0FBSztvQkFFckIsSUFBSUMsT0FBT1AsS0FBS1EsTUFBTTtvQkFFdEI7d0JBQ0lGLE1BQU9DLEtBQUssR0FBRzFCLFFBQVEsS0FBSTt3QkFDM0JGLElBQUs0QixLQUFLLEdBQUcxQixRQUFRLEtBQUk7d0JBQ3pCaUIsTUFBT1MsS0FBSyxLQUFLQSxLQUFLLEdBQUcxQixRQUFRLEtBQUksTUFBTTt3QkFDM0NtQixNQUFPTyxLQUFLLEtBQUtBLEtBQUssR0FBRzFCLFFBQVEsS0FBSSxNQUFNOzs7Ozs7Ozs7Ozs7Z0JBYzVDVCxTQUFBSSxVQUFBaUIsUUFBUDtvQkFFSXBCLEtBQUtVLGVBQWUwQixLQUFLO29CQUN6QnBDLEtBQUtTLFFBQVFFLEtBQUssV0FDYjBCLFlBQVksVUFDWkMsU0FBUyxRQUNUQyxLQUFLO29CQUVWLE9BQU87Ozs7Ozs7Ozs7Ozs7Z0JBZUp4QyxTQUFBSSxVQUFBa0IsT0FBUDtvQkFFSXJCLEtBQUtVLGVBQWU4QixLQUFLO29CQUN6QnhDLEtBQUtTLFFBQVFFLEtBQUssU0FDYjBCLFlBQVksUUFDWkMsU0FBUyxVQUNUQyxLQUFLO29CQUVWLE9BQU87Ozs7Ozs7Z0JBMU1HeEMsU0FBQTBDLE9BQWdCO2dCQTZNbEMsT0FBQTFDOzs7Ozs7Ozs7Ozs7Ozs7O1lDbE5BMkMsdUJBQUE7Z0JBK0JJLFNBQUFBOzs7O29CQW5CTzFDLEtBQUEyQzs7OztvQkFLQTNDLEtBQUE0Qzs7OztvQkFNQTVDLEtBQUE2Qzs7OztvQkFNQTdDLEtBQUE4QyxVQUFvQjtvQkFJdkI5QyxLQUFLK0MsUUFBUTdDLEVBQUU7b0JBRWZGLEtBQUthO29CQUVMYixLQUFLZ0QsT0FBT0MsS0FBSyxTQUFDZjs7Z0JBT2ZRLE9BQUF2QyxVQUFBQyxPQUFQLFNBQVk4QztvQkFFUkMsUUFBUUMsSUFBSUY7O2dCQUtOUixPQUFBdkMsVUFBQVUsWUFBVjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkF3QkliLEtBQUsrQyxNQUNBL0IsR0FBRyxTQUFRLDZCQUE0QmhCLEtBQUtxRDs7Ozs7Z0JBeUI5Q1gsT0FBQXZDLFVBQUFrRCxXQUFQLFNBQWdCWixNQUF1QmxDO29CQUF2QyxJQUFBUSxRQUFBZjtvQkFBZ0IsSUFBQXlDLGNBQUEsR0FBQTt3QkFBQUEsT0FBQTs7O29CQUlaLElBQUlhLE1BQU0sSUFBSXBELEVBQUVxRDtvQkFHaEJ2RCxLQUFLd0QsUUFBUTs7b0JBR2J0RCxFQUFFcUIsS0FBS3ZCLEtBQUs0QyxRQUFPLFNBQUNwQixLQUFjSzt3QkFDOUJBLE1BQU1UOztvQkFHVnBCLEtBQUt5RCxTQUFTaEIsTUFBTVEsS0FBSyxTQUFDZjt3QkFFdEIsSUFBSUw7d0JBRUpBLFFBQVFkLE1BQUsyQyxjQUFjakI7d0JBRTNCWixNQUFNekIsS0FBSzhCLEtBQUtBLE1BQUtuQixNQUFLNkIsT0FBT2UsUUFBT3BEO3dCQUV4Q1EsTUFBSzZCLE9BQU9nQixLQUFLL0I7d0JBRWpCeUIsSUFBSU8sUUFBUWhDOzs7b0JBS2hCLE9BQU95QixJQUFJUTs7Ozs7O2dCQVVScEIsT0FBQXZDLFVBQUFxRCxVQUFQLFNBQWVBO29CQUFBLElBQUFBLGlCQUFBLEdBQUE7d0JBQUFBLFVBQUE7OztvQkFHWHRELEVBQUUsbUJBQW1CZSxPQUFPdUM7Ozs7O2dCQVF6QmQsT0FBQXZDLFVBQUE2QyxPQUFQO29CQUFBLElBQUFqQyxRQUFBZjs7b0JBR0ksSUFBSXNELE1BQU0sSUFBSXBELEVBQUVxRDtvQkFHaEJyRCxFQUFFNkQsUUFBUUM7d0JBQ05DLFNBQVV2QixPQUFPd0IsYUFBYTt3QkFDOUJDLFFBQVE7dUJBQ1RDLFFBQVEsU0FBQ2xDO3dCQUVSbkIsTUFBS0QsUUFBUW9CLEtBQUtBLEtBQUtnQjt3QkFFdkJoRCxFQUFFcUIsS0FBS1csS0FBS0EsS0FBS1UsUUFBTyxTQUFDSCxNQUFLWjs0QkFDMUJkLE1BQUs4QixnQkFBZ0JKLFFBQVFaOzt3QkFHakMsSUFBR0ssS0FBS0EsS0FBS2dCLEtBQUtOLE9BQU95QixRQUFROzRCQUM3QixJQUFJQSxTQUFTbkMsS0FBS0EsS0FBS2dCLEtBQUtOLE9BQU95QjttQ0FDNUJuQyxLQUFLQSxLQUFLZ0IsS0FBS04sT0FBT3lCOzRCQUM3QnRELE1BQUt1RCxjQUFjRDs7d0JBR3ZCdEQsTUFBS3dELFdBQVdyQyxLQUFLQSxLQUFLZ0IsS0FBS04sUUFBTzs7d0JBS3RDVSxJQUFJTyxRQUFRM0I7dUJBQ2JzQyxNQUFNeEUsS0FBS3lFOztvQkFJZCxPQUFPbkIsSUFBSVE7Ozs7O2dCQVFMcEIsT0FBQXZDLFVBQUFXLFVBQVYsU0FBa0I0RDtvQkFBbEIsSUFBQTNELFFBQUFmO29CQUdJbUQsUUFBUUMsSUFBSXNCO29CQUVaeEUsRUFBRSxxQkFBcUJTLEtBQUssc0JBQXNCWSxLQUFLLFNBQUNDLEtBQWFOO3dCQUVqRUgsTUFBSzRELFVBQVV6RSxFQUFFZ0IsT0FBTXdEOztvQkFHM0J4RSxFQUFFLHFCQUFxQlMsS0FBSyx3QkFBd0JZLEtBQUssU0FBQ0MsS0FBYU47d0JBRW5FSCxNQUFLNEQsVUFBVXpFLEVBQUVnQixPQUFNd0Q7OztnQkFNeEJoQyxPQUFBdkMsVUFBQXdFLFlBQVAsU0FBaUJDLE9BQU1GO29CQUVuQixJQUFJakQsT0FBT29ELFdBQUE5RSxTQUFTMkIsbUJBQW1Ca0Q7b0JBRXZDLElBQUdGLE1BQU1qRCxLQUFLUSxTQUFTeUMsTUFBTWpELEtBQUtRLE1BQU1SLEtBQUtuQixLQUFLO3dCQUU5Q3VFLFdBQUE5RSxTQUFTNkIsY0FBY2dELE9BQU1GLE1BQU1qRCxLQUFLUSxNQUFNUixLQUFLbkI7Ozs7Ozs7OztnQkFXbkRvQyxPQUFBdkMsVUFBQW1FLGdCQUFSLFNBQXNCRDtvQkFFbEJRLFdBQUE5RSxTQUFTdUIsaUJBQWlCdEIsS0FBSytDLE1BQU1wQyxLQUFLLG1CQUFrQjBEOzs7Ozs7O2dCQVN4RDNCLE9BQUF2QyxVQUFBb0UsYUFBUixTQUFtQjNCLFFBQU9rQztvQkFBMUIsSUFBQS9ELFFBQUFmO29CQUdJLElBQUkrRSxPQUFPQyxPQUFPRCxLQUFLbkM7b0JBRXZCLElBQUlwQixNQUFNdUQsS0FBS0Q7b0JBRWYsS0FBSXRELFFBQVFvQixXQUFXQSxPQUFPcEIsTUFBSzt3QkFDL0J4QixLQUFLOEMsVUFBVTt3QkFDZjlDLEtBQUt3RCxRQUFRO3dCQUNiOzJCQUNDO3dCQUNEeEQsS0FBS3FELFNBQVNULE9BQU9wQixLQUFLeUQsV0FBV3hDLE1BQUtHLE9BQU9wQixNQUFNeUIsS0FBSzs0QkFDeEQ2Qjs0QkFDQS9ELE1BQUt3RCxXQUFXM0IsUUFBT2tDOzs7Ozs7OztnQkFZNUJwQyxPQUFBdkMsVUFBQXVELGdCQUFQLFNBQXFCakI7b0JBRWpCLElBQUlaO29CQUVKLEtBQUk3QixLQUFLNkMsZ0JBQWdCSixPQUFPO3dCQUM1QkEsT0FBTzs7b0JBSVgsUUFBT0E7c0JBQ0g7d0JBQ0laLFFBQVEsSUFBSWdELFdBQUE5RTs7b0JBSXBCLE9BQU84Qjs7Ozs7Ozs7O2dCQVlKYSxPQUFBdkMsVUFBQXNELFdBQVAsU0FBZ0JoQjtvQkFBaEIsSUFBQTFCLFFBQUFmO29CQUFnQixJQUFBeUMsY0FBQSxHQUFBO3dCQUFBQSxPQUFBOzs7b0JBR1osSUFBSWEsTUFBTSxJQUFJcEQsRUFBRXFEO29CQUVoQixJQUFJdkQsS0FBSzJDLFVBQVVGLFNBQVN6QyxLQUFLMkMsVUFBVUYsU0FBU3lDLGFBQWFsRixLQUFLMkMsVUFBVUYsU0FBUyxJQUFJO3dCQUN6RmEsSUFBSU8sUUFBUTdELEtBQUsyQyxVQUFVRjsyQkFDeEI7d0JBRUh2QyxFQUFFaUYsSUFBSW5COzRCQUNGdkQsU0FBUzs0QkFDVDJFLFVBQVczQzs0QkFDWDBCLFFBQVE7MkJBQ1RDLFFBQVEsU0FBQ2xDOzRCQUVSbkIsTUFBSzRCLFVBQVVGLFFBQVFQOzs0QkFHdkJvQixJQUFJTyxRQUFRM0I7MkJBQ2JzQyxNQUFNeEUsS0FBS3lFOzs7b0JBS2xCLE9BQU9uQixJQUFJUTs7Ozs7OztnQkFTUnBCLE9BQUF2QyxVQUFBc0UsY0FBUDs7Ozs7Ozs7Z0JBYWMvQixPQUFBd0IsZUFBZCxTQUEyQm1CO29CQUV2QixJQUFJQyxnQkFBZ0JDLE9BQU9DLFNBQVNDLE9BQU9DLE9BQU87b0JBRWxELElBQUlDLGVBQWVMLGNBQWNuRCxNQUFNO29CQUV2QyxJQUFJeUQ7b0JBQ0osS0FBSSxJQUFJQyxJQUFHLEdBQUVBLElBQUVGLGFBQWFoQyxRQUFPa0MsS0FDbkM7d0JBQ0ksSUFBSUMsSUFBSUgsYUFBYUUsR0FBRzFELE1BQU07d0JBQzlCeUQsSUFBSUUsRUFBRSxNQUFNQSxFQUFFOztvQkFHbEIsT0FBT0YsSUFBSVA7O2dCQUduQixPQUFBM0M7O1lBRUlxRCxTQUFTLElBQUlyRCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5kZWNsYXJlIHZhciAkIDogYW55O1xuXG5leHBvcnQgY2xhc3MgRUZfSW5wdXRcbntcblxuICAgIC8qKlxuICAgICAqIEB2YXIgc3RyaW5nXG4gICAgICpcbiAgICAgKiBUaGUgdHlwZSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHR5cGUgOiBzdHJpbmcgPSAndGV4dCc7XG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgSFRNTCBFbGVtZW50XG4gICAgICpcbiAgICAgKiBUaGUgaHRtbCBlbGVtZW50IG9mIHRoZSBpbnB1dFxuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGVsZW1lbnQgOiBhbnk7XG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgSFRNTCBFbGVtZW50XG4gICAgICpcbiAgICAgKiBUaGUgaHRtbCBlbGVtZW50IGZvciB0aGUgb3B0aW9uXG4gICAgICovXG4gICAgcHVibGljIG9wdGlvbnNFbGVtZW50IDogYW55O1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgaWQgKHBvc2l0aW9uKSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgaWQgOiBudW1iZXI7XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBIVE1MIGVsZW1lbnQgb2YgdGhlIGNvbnRhaW5lclxuICAgICAqL1xuICAgIHB1YmxpYyBjb250YWluZXIgOiBhbnk7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIgPSAkKCcjZmxkJyk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICogQHBhcmFtIGlkXG4gICAgICovXG4gICAgcHVibGljIGluaXQoJGVsZW1lbnQgOiBhbnksIGlkIDogbnVtYmVyLCRkYXRhIDogYW55KVxuICAgIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgICAgICRlbGVtZW50ID0gJGVsZW1lbnQucmVwbGFjZSgvZmllbGRJZC9nLGlkKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKCRlbGVtZW50KTtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudCA9IHRoaXMuZWxlbWVudC5maW5kKCcuZWYtdGFibGUnKTtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmQodGhpcy5lbGVtZW50KTtcblxuICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuXG4gICAgICAgIHRoaXMuYWRkRGF0YSgkZGF0YSk7XG4gICAgfVxuXG5cblxuXG4gICAgcHVibGljIHNldEV2ZW50cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cIm9wZW4tY2xvc2VcIl0nKS5vbignY2xpY2snLCgpID0+IHtyZXR1cm4gdGhpcy50b2dnbGUoKX0pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQ2xvc2UgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlKCk6IGJvb2xlYW5cbiAgICB7XG5cbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwib3Blbi1jbG9zZVwiXScpO1xuXG4gICAgICAgIGlmKCQoZWxlbSkuaGFzQ2xhc3MoJ21pbmlmeScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9zZSgpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0IHRoZSBkYXRhIGluIHRoZSB0ZW1wbGF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICovXG4gICAgcHVibGljIGFkZERhdGEoJGRhdGEpIDogdm9pZFxuICAgIHtcbiAgICAgICAgRUZfSW5wdXQuYWRkRGF0YVRvRWxlbWVudCh0aGlzLmVsZW1lbnQsJGRhdGEpXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAqIEBwYXJhbSAkZGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYWRkRGF0YVRvRWxlbWVudCgkZWxlbWVudCA6IGFueSwgJGRhdGEgOiBhbnkpIDogdm9pZFxuICAgIHtcbiAgICAgICAgJGVsZW1lbnQuZmluZCgnW25hbWVePVwiZmllbGRcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgcHJvcCA9IEVGX0lucHV0LmdldElucHV0UHJvcGVydGllcygkKGVsZW0pKTtcblxuICAgICAgICAgICAgaWYoJGRhdGFbcHJvcC5wcm9wXSAmJiAkZGF0YVtwcm9wLnByb3BdW3Byb3AubmFtZV0pIHtcbiAgICAgICAgICAgICAgICBFRl9JbnB1dC5zZXRJbnB1dFZhbHVlKCQoZWxlbSksJGRhdGFbcHJvcC5wcm9wXVtwcm9wLm5hbWVdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCBhIHZhbHVlIHRvIGFuIGlucHV0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKiBAcGFyYW0gdmFsdWVcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNldElucHV0VmFsdWUoaW5wdXQgOiBhbnksIHZhbHVlIDogc3RyaW5nfGJvb2xlYW4pXG4gICAge1xuICAgICAgICBpZihpbnB1dC5pcygnOmNoZWNrYm94Jykpe1xuICAgICAgICAgICAgaWYodmFsdWUgPT0gJ29uJykge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlucHV0LnByb3AoJ2NoZWNrZWQnLHZhbHVlKTtcbiAgICAgICAgfWVsc2UgaWYoaW5wdXQuaXMoJ3NlbGVjdCcpKXtcbiAgICAgICAgICAgIGlucHV0LmZpbmQoJ29wdGlvblt2YWx1ZT1cIicrIHZhbHVlICsnXCJdJykucHJvcCgnc2VsZWN0ZWQnLHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBpbnB1dC52YWwodmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJldHVybiBhbGwgdGhlIHByb3BlcnRpZXMgb2YgYW4gaW5wdXRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnB1dFByb3BlcnRpZXMoZWxlbSA6IGFueSkgOiB7YXR0cixpZCxwcm9wLG5hbWV9XG4gICAge1xuXG4gICAgICAgIGxldCBuYW1lID0gZWxlbS5hdHRyKCduYW1lJyk7XG5cbiAgICAgICAgbGV0IGRhdGEgPSBuYW1lLnNwbGl0KCdbJyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGF0dHIgOiBkYXRhWzBdLnJlcGxhY2UoJ10nLCcnKSxcbiAgICAgICAgICAgIGlkIDogZGF0YVsxXS5yZXBsYWNlKCddJywnJyksXG4gICAgICAgICAgICBwcm9wIDogZGF0YVsyXSA/IGRhdGFbMl0ucmVwbGFjZSgnXScsJycpIDogJycsXG4gICAgICAgICAgICBuYW1lIDogZGF0YVszXSA/IGRhdGFbM10ucmVwbGFjZSgnXScsJycpIDogJycsXG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBzaW5jZSAxLjEuMFxuICAgICAqXG4gICAgICogQGV2ZW50IDogQ2xpY2sgb24gbWluaWZ5IGJ1dHRvbiA6IGhpZGUgdGhlIG9wdGlvbnMgb2YgdGhlIGZpZWxkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBjbG9zZSgpIDogYm9vbGVhblxuICAgIHtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudC5oaWRlKDIwMCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcubWluaWZ5JylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWluaWZ5JylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnb3BlbicpXG4gICAgICAgICAgICAuaHRtbCgnKycpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHNpbmNlIDEuMS4wXG4gICAgICpcbiAgICAgKiBPcGVuIGEgZmllbGRcbiAgICAgKlxuICAgICAqIEBldmVudCA6IENsaWNrIG9uIG9wZW4gYnV0dG9uLCBzaG93IHRoZSBmaWVsZCBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBvcGVuKCkgOiBib29sZWFuXG4gICAge1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50LnNob3coMjAwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5vcGVuJylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnb3BlbicpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ21pbmlmeScpXG4gICAgICAgICAgICAuaHRtbCgnLScpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbn0iLCJkZWNsYXJlIHZhciAkO1xuXG5kZWNsYXJlIHZhciBhamF4VXJsIDogc3RyaW5nO1xuXG5pbXBvcnQge0VGX0lucHV0fSBmcm9tICcuL2lucHV0cy9FRl9JbnB1dCc7XG5cbmNsYXNzIEVGX0FkZFxue1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBCb2R5IG9mIHRoZSBwYWdlXG4gICAgICovXG4gICAgcHVibGljICRib2R5O1xuXG4gICAgLyoqXG4gICAgICpBbiBvYmplY3Qgb2YgYWxsIHRoZSBpbnB1dCB0ZW1wbGF0ZXMgY2FjaGVkIHRvIGF2b2lkIGxhdGVuY3lcbiAgICAgKi9cbiAgICBwdWJsaWMgdGVtcGxhdGVzIDogYW55ID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBhbGwgdGhlIGlucHV0cyBhdmFpbGFibGUgb24gdGhlIHBhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5wdXRzIDogRUZfSW5wdXRbXSA9IFtdO1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGF2YWlsYWJsZSBpbnB1dHNcbiAgICAgKi9cbiAgICBwdWJsaWMgYXZhaWxhYmxlSW5wdXRzIDoge30gPSB7fTtcblxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIGVkaXRvciBpcyBpbml0XG4gICAgICovXG4gICAgcHVibGljIGlzX2luaXQgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy4kYm9keSA9ICQoJ2JvZHknKTtcblxuICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuXG4gICAgICAgIHRoaXMubG9hZCgpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICB9KVxuXG4gICAgfVxuXG5cbiAgICBwdWJsaWMgaW5pdChmb3JtIDogYW55KSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coZm9ybSk7XG5cbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCBzZXRFdmVudHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIC8qXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcubW92ZScsX21vdmUpO1xuXG4gICAgICAgIC8vIERlbGV0ZSBhIGZpZWxkXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcuZGVsZXRlJyxfZGVsZXRlKTtcblxuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcudXAnLF91cCk7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5kb3duJyxfZG93bik7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5yZW1vdmVvcHRpb24nLF9yZW1vdmVPcHRpb24pO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcuZHVwbGlxdWVyJyxfZHVwbGljYXRlKTsqL1xuXG4gICAgICAgIC8vIEFkZCBhIG5ldyBmaWVsZFxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnYnV0dG9uW2RhdGEtYWN0aW9uPVwiYWRkXCJdJyx0aGlzLmFkZElucHV0KTtcbiAgICAgICAgLypcbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGQtb3B0aW9uXCJdJyxfYWRkT3B0aW9uKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZSQ9XCJhdHRyaWJ1dGVzW3R5cGVdXCJdJyxfY2hhbmdlRmllbGRUeXBlKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZSQ9XCJbZm9ybS10YXhvbm9teV1cIl0nLF9jaGFuZ2VUYXhvbm9teSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWU9XCJmb3JtLXJlc2V0LWFjdGlvblwiXScsX2NoYW5nZVJlc2V0QWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cInNldHRpbmdzW3R5cGVdXCJdJyxfY2hhbmdlVXRpbGl0eSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCcucGFuZWwgaGVhZGVyJyxfdG9nZ2xlUGFuZWwpOyovXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYW4gaW5wdXQgdG8gdGhlIGVkaXRvclxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRJbnB1dCh0eXBlIDogc3RyaW5nID0gJ3RleHQnLCRkYXRhKSA6IFByb21pc2U8YW55PlxuICAgIHtcblxuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG5cbiAgICAgICAgdGhpcy5sb2FkaW5nKHRydWUpO1xuXG4gICAgICAgIC8vIENsb3NlIGFsbCB0aGUgaW5wdXRzXG4gICAgICAgICQuZWFjaCh0aGlzLmlucHV0cywoa2V5IDogbnVtYmVyLCBpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICBpbnB1dC5jbG9zZSgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZ2V0SW5wdXQodHlwZSkudGhlbigoZGF0YSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgaW5wdXQgOiBFRl9JbnB1dDtcblxuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLmdlbmVyYXRlSW5wdXQodHlwZSk7XG5cbiAgICAgICAgICAgIGlucHV0LmluaXQoZGF0YS5kYXRhLHRoaXMuaW5wdXRzLmxlbmd0aCwkZGF0YSk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXRzLnB1c2goaW5wdXQpO1xuXG4gICAgICAgICAgICBkZmQucmVzb2x2ZShpbnB1dCk7XG5cbiAgICAgICAgfSlcblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGxvYWRpbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZGluZyhsb2FkaW5nIDogYm9vbGVhbiA9IHRydWUpXG4gICAge1xuICAgICAgICAvLyBTaG93IHRoZSBzcGlubmVyXG4gICAgICAgICQoJyNzcGlubmVyLWZpZWxkcycpLnRvZ2dsZShsb2FkaW5nKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogTG9hZCB0aGUgZm9ybSBkYXRhIGZyb20gdGhlIGJhY2sgb2ZmaWNlXG4gICAgICovXG4gICAgcHVibGljIGxvYWQoKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuXG4gICAgICAgICQuZ2V0SlNPTihhamF4VXJsLCB7XG4gICAgICAgICAgICBmb3JtX2lkIDogRUZfQWRkLmdldFBhcmFtZXRlcigncG9zdCcpLFxuICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF9mb3JtX2RhdGEnXG4gICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5hZGREYXRhKGRhdGEuZGF0YS5mb3JtKTtcblxuICAgICAgICAgICAgJC5lYWNoKGRhdGEuZGF0YS5pbnB1dHMsKHR5cGUsaW5wdXQgOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUlucHV0c1t0eXBlXSA9IGlucHV0O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmKGRhdGEuZGF0YS5mb3JtLmlucHV0cy5zdWJtaXQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3VibWl0ID0gZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdDtcbiAgICAgICAgICAgICAgICBkZWxldGUgZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdDtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFN1Ym1pdERhdGEoc3VibWl0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGRhdGEuZGF0YS5mb3JtLmlucHV0cywwKTtcblxuXG5cbiAgICAgICAgICAgIC8vIEkgc2VuZCBiYWNrIHRoZSBkYXRhXG4gICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG5cblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBBZGQgdGhlIGRhdGEgaW5zaWRlIHRoZSBmb3JtIGl0c2VsZlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhZGREYXRhKCRmb3JtIDogYW55KSA6IHZvaWRcbiAgICB7XG5cbiAgICAgICAgY29uc29sZS5sb2coJGZvcm0pO1xuXG4gICAgICAgICQoJyNlZi1hZGQtbWFpbi1pbmZvJykuZmluZCgnW25hbWVePVwic2V0dGluZ3NcIl0nKS5lYWNoKChrZXkgOiBudW1iZXIsZWxlbSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLmZpbGxJbmZvcygkKGVsZW0pLCRmb3JtKTtcblxuICAgICAgICB9KTtcbiAgICAgICAgJCgnI2VmLWFkZC1tYWluLWluZm8nKS5maW5kKCdbbmFtZV49XCJhdHRyaWJ1dGVzXCJdJykuZWFjaCgoa2V5IDogbnVtYmVyLGVsZW0gOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgdGhpcy5maWxsSW5mb3MoJChlbGVtKSwkZm9ybSk7XG5cbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIHB1YmxpYyBmaWxsSW5mb3MoJGVsZW0sJGZvcm0pIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IHByb3AgPSBFRl9JbnB1dC5nZXRJbnB1dFByb3BlcnRpZXMoJGVsZW0pO1xuXG4gICAgICAgIGlmKCRmb3JtW3Byb3AuYXR0cl0gJiYgJGZvcm1bcHJvcC5hdHRyXVtwcm9wLmlkXSkge1xuXG4gICAgICAgICAgICBFRl9JbnB1dC5zZXRJbnB1dFZhbHVlKCRlbGVtLCRmb3JtW3Byb3AuYXR0cl1bcHJvcC5pZF0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCB0aGUgZGF0YSBpbnNpZGUgdGhlIHN1Ym1pdCBidXR0b25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdWJtaXRcbiAgICAgKi9cbiAgICBwcml2YXRlIGFkZFN1Ym1pdERhdGEoc3VibWl0KSA6IHZvaWRcbiAgICB7XG4gICAgICAgIEVGX0lucHV0LmFkZERhdGFUb0VsZW1lbnQodGhpcy4kYm9keS5maW5kKCcjZWYtYWRkLXN1Ym1pdCcpLHN1Ym1pdCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnB1dHNcbiAgICAgKiBAcGFyYW0gb3JkZXJcbiAgICAgKi9cbiAgICBwcml2YXRlIGxvYWRJbnB1dHMoaW5wdXRzLG9yZGVyIDogbnVtYmVyKVxuICAgIHtcblxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKGlucHV0cyk7XG5cbiAgICAgICAgbGV0IGtleSA9IGtleXNbb3JkZXJdO1xuXG4gICAgICAgIGlmKCFrZXkgfHwgIWlucHV0cyB8fCAhaW5wdXRzW2tleV0pe1xuICAgICAgICAgICAgdGhpcy5pc19pbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZyhmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5hZGRJbnB1dChpbnB1dHNba2V5XS5hdHRyaWJ1dGVzLnR5cGUsaW5wdXRzW2tleV0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9yZGVyKys7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkSW5wdXRzKGlucHV0cyxvcmRlcik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2VuZXJhdGVJbnB1dCh0eXBlIDogc3RyaW5nKSA6IEVGX0lucHV0XG4gICAge1xuICAgICAgICBsZXQgaW5wdXQ7XG5cbiAgICAgICAgaWYoIXRoaXMuYXZhaWxhYmxlSW5wdXRzW3R5cGVdKSB7XG4gICAgICAgICAgICB0eXBlID0gJ3RleHQnO1xuICAgICAgICB9XG5cblxuICAgICAgICBzd2l0Y2godHlwZSkge1xuICAgICAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBuZXcgRUZfSW5wdXQoKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcmV0dXJuIGlucHV0O1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIExvYWQgdGhlIGlucHV0IHRlbXBsYXRlIGZyb20gdGhlIEJPXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZSA6IHN0cmluZ1xuICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICovXG4gICAgcHVibGljIGdldElucHV0KHR5cGUgOiBzdHJpbmcgPSAndGV4dCcpXG4gICAge1xuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlc1t0eXBlXSAmJiB0aGlzLnRlbXBsYXRlc1t0eXBlXSAhPSB1bmRlZmluZWQgJiYgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gIT0gJycpIHtcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKHRoaXMudGVtcGxhdGVzW3R5cGVdKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJC5nZXQoYWpheFVybCwge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICdpbnB1dHMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlIDogdHlwZSxcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdFRi9sb2FkX3RlbXBsYXRlJ1xuICAgICAgICAgICAgfSkuc3VjY2VzcygoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gPSBkYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICBkZmQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgIH0pLmVycm9yKHRoaXMuaGFuZGxlRXJyb3IpO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBIVFRQIEVycm9yc1xuICAgICAqXG4gICAgICogQFRPRE9cbiAgICAgKi9cbiAgICBwdWJsaWMgaGFuZGxlRXJyb3IoKSA6IHZvaWRcbiAgICB7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogR2V0IHRoZSB1cmwgcGFyYW1ldGVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW1ldGVyXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldFBhcmFtZXRlcihwYXJhbWV0ZXIgOiBzdHJpbmcpOmFueVxuICAgIHtcbiAgICAgICAgdmFyIHBhcmFtc19zdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKTtcblxuICAgICAgICB2YXIgcGFyYW1zX2FycmF5ID0gcGFyYW1zX3N0cmluZy5zcGxpdCgnJicpO1xuXG4gICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgZm9yKHZhciBpID0wO2k8cGFyYW1zX2FycmF5Lmxlbmd0aDtpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBlID0gcGFyYW1zX2FycmF5W2ldLnNwbGl0KCc9Jyk7XG4gICAgICAgICAgICBvYmpbZVswXV0gPSBlWzFdXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JqW3BhcmFtZXRlcl07XG4gICAgfVxuXG59XG5cbnZhciBFRl9hZGQgPSBuZXcgRUZfQWRkKCk7Il19
