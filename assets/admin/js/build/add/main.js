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
                    var _this = this;
                    console.log($data);
                    this.element.find('[name^="field"]').each(function(key, elem) {
                        var prop = _this.getProperties(elem);
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
                EF_Input.prototype.getProperties = function(elem) {
                    var name = $(elem).attr("name").replace(/field/gi, "");
                    var data = name.split("]");
                    var props = {
                        id: data[0].replace("[", ""),
                        prop: data[1].replace("[", ""),
                        name: data[2].replace("[", "")
                    };
                    return props;
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
                        $.each(data.data.inputs, function(type, input) {
                            _this.availableInputs[type] = input;
                        });
                        _this.loadInputs(data.data.form.inputs, 0);
                        // I send back the data
                        dfd.resolve(data);
                    }).error(this.handleError);
                    // Return a promise
                    return dfd.promise();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2lucHV0cy9FRl9JbnB1dC50cyIsImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL0VGX0FkZC50cyJdLCJuYW1lcyI6WyJFRl9JbnB1dCIsInRoaXMiLCJjb250YWluZXIiLCIkIiwicHJvdG90eXBlIiwiaW5pdCIsIiRlbGVtZW50IiwiaWQiLCIkZGF0YSIsInJlcGxhY2UiLCJlbGVtZW50Iiwib3B0aW9uc0VsZW1lbnQiLCJmaW5kIiwiYXBwZW5kIiwic2V0RXZlbnRzIiwiYWRkRGF0YSIsIl90aGlzIiwib24iLCJ0b2dnbGUiLCJlbGVtIiwiaGFzQ2xhc3MiLCJjbG9zZSIsIm9wZW4iLCJjb25zb2xlIiwibG9nIiwiZWFjaCIsImtleSIsInByb3AiLCJnZXRQcm9wZXJ0aWVzIiwibmFtZSIsInNldElucHV0VmFsdWUiLCJpbnB1dCIsInZhbHVlIiwiaXMiLCJ2YWwiLCJhdHRyIiwiZGF0YSIsInNwbGl0IiwicHJvcHMiLCJoaWRlIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImh0bWwiLCJzaG93IiwidHlwZSIsIkVGX0FkZCIsInRlbXBsYXRlcyIsImlucHV0cyIsImF2YWlsYWJsZUlucHV0cyIsImlzX2luaXQiLCIkYm9keSIsImxvYWQiLCJ0aGVuIiwiZm9ybSIsImFkZElucHV0IiwiZGZkIiwiRGVmZXJyZWQiLCJsb2FkaW5nIiwiZ2V0SW5wdXQiLCJnZW5lcmF0ZUlucHV0IiwibGVuZ3RoIiwicHVzaCIsInJlc29sdmUiLCJwcm9taXNlIiwiZ2V0SlNPTiIsImFqYXhVcmwiLCJmb3JtX2lkIiwiZ2V0UGFyYW1ldGVyIiwiYWN0aW9uIiwic3VjY2VzcyIsImxvYWRJbnB1dHMiLCJlcnJvciIsImhhbmRsZUVycm9yIiwib3JkZXIiLCJrZXlzIiwiT2JqZWN0IiwiYXR0cmlidXRlcyIsIkVGX0lucHV0XzEiLCJ1bmRlZmluZWQiLCJnZXQiLCJ0ZW1wbGF0ZSIsInBhcmFtZXRlciIsInBhcmFtc19zdHJpbmciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInNlYXJjaCIsInN1YnN0ciIsInBhcmFtc19hcnJheSIsIm9iaiIsImkiLCJlIiwiRUZfYWRkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztnQkEwQ0ksU0FBQUE7b0JBRUlDLEtBQUtDLFlBQVlDLEVBQUU7Ozs7Ozs7O2dCQVdoQkgsU0FBQUksVUFBQUMsT0FBUCxTQUFZQyxVQUFnQkMsSUFBWUM7b0JBRXBDUCxLQUFLTSxLQUFLQTtvQkFFVkQsV0FBV0EsU0FBU0csUUFBUSxZQUFXRjtvQkFFdkNOLEtBQUtTLFVBQVVQLEVBQUVHO29CQUNqQkwsS0FBS1UsaUJBQWlCVixLQUFLUyxRQUFRRSxLQUFLO29CQUV4Q1gsS0FBS0MsVUFBVVcsT0FBT1osS0FBS1M7b0JBRTNCVCxLQUFLYTtvQkFFTGIsS0FBS2MsUUFBUVA7O2dCQU1WUixTQUFBSSxVQUFBVSxZQUFQO29CQUFBLElBQUFFLFFBQUFmO29CQUVJQSxLQUFLUyxRQUFRRSxLQUFLLDhCQUE4QkssR0FBRyxTQUFRO3dCQUFPLE9BQU9ELE1BQUtFOzs7Ozs7Z0JBTzNFbEIsU0FBQUksVUFBQWMsU0FBUDtvQkFHSSxJQUFJQyxPQUFPbEIsS0FBS1MsUUFBUUUsS0FBSztvQkFFN0IsSUFBR1QsRUFBRWdCLE1BQU1DLFNBQVMsV0FBVzt3QkFDM0IsT0FBT25CLEtBQUtvQjsyQkFDVjt3QkFDRixPQUFPcEIsS0FBS3FCOzs7Ozs7OztnQkFXYnRCLFNBQUFJLFVBQUFXLFVBQVAsU0FBZVA7b0JBQWYsSUFBQVEsUUFBQWY7b0JBRUlzQixRQUFRQyxJQUFJaEI7b0JBRVpQLEtBQUtTLFFBQVFFLEtBQUssbUJBQW1CYSxLQUFLLFNBQUNDLEtBQWFQO3dCQUVwRCxJQUFJUSxPQUFPWCxNQUFLWSxjQUFjVDt3QkFFOUIsSUFBR1gsTUFBTW1CLEtBQUtBLFNBQVNuQixNQUFNbUIsS0FBS0EsTUFBTUEsS0FBS0UsT0FBTzs0QkFDaEQ3QixTQUFTOEIsY0FBYzNCLEVBQUVnQixPQUFNWCxNQUFNbUIsS0FBS0EsTUFBTUEsS0FBS0U7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LElBQUk7d0JBQ3pGVyxJQUFJTyxRQUFRN0QsS0FBSzZDLFVBQVVGOzJCQUN4Qjt3QkFFSHpDLEVBQUU0RSxJQUFJZDs0QkFDRnZELFNBQVM7NEJBQ1RzRSxVQUFXcEM7NEJBQ1h3QixRQUFROzJCQUNUQyxRQUFRLFNBQUNqQzs0QkFFUnBCLE1BQUs4QixVQUFVRixRQUFRUjs7NEJBR3ZCbUIsSUFBSU8sUUFBUTFCOzJCQUNibUMsTUFBTXRFLEtBQUt1RTs7O29CQUtsQixPQUFPakIsSUFBSVE7Ozs7Ozs7Z0JBU1JsQixPQUFBekMsVUFBQW9FLGNBQVA7Ozs7Ozs7O2dCQWFjM0IsT0FBQXNCLGVBQWQsU0FBMkJjO29CQUV2QixJQUFJQyxnQkFBZ0JDLE9BQU9DLFNBQVNDLE9BQU9DLE9BQU87b0JBRWxELElBQUlDLGVBQWVMLGNBQWM3QyxNQUFNO29CQUV2QyxJQUFJbUQ7b0JBQ0osS0FBSSxJQUFJQyxJQUFHLEdBQUVBLElBQUVGLGFBQWEzQixRQUFPNkIsS0FDbkM7d0JBQ0ksSUFBSUMsSUFBSUgsYUFBYUUsR0FBR3BELE1BQU07d0JBQzlCbUQsSUFBSUUsRUFBRSxNQUFNQSxFQUFFOztvQkFHbEIsT0FBT0YsSUFBSVA7O2dCQUduQixPQUFBcEM7O1lBRUk4QyxTQUFTLElBQUk5QyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5kZWNsYXJlIHZhciAkIDogYW55O1xuXG5leHBvcnQgY2xhc3MgRUZfSW5wdXRcbntcblxuICAgIC8qKlxuICAgICAqIEB2YXIgc3RyaW5nXG4gICAgICpcbiAgICAgKiBUaGUgdHlwZSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHR5cGUgOiBzdHJpbmcgPSAndGV4dCc7XG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgSFRNTCBFbGVtZW50XG4gICAgICpcbiAgICAgKiBUaGUgaHRtbCBlbGVtZW50IG9mIHRoZSBpbnB1dFxuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGVsZW1lbnQgOiBhbnk7XG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgSFRNTCBFbGVtZW50XG4gICAgICpcbiAgICAgKiBUaGUgaHRtbCBlbGVtZW50IGZvciB0aGUgb3B0aW9uXG4gICAgICovXG4gICAgcHVibGljIG9wdGlvbnNFbGVtZW50IDogYW55O1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgaWQgKHBvc2l0aW9uKSBvZiB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBwdWJsaWMgaWQgOiBudW1iZXI7XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBIVE1MIGVsZW1lbnQgb2YgdGhlIGNvbnRhaW5lclxuICAgICAqL1xuICAgIHB1YmxpYyBjb250YWluZXIgOiBhbnk7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIgPSAkKCcjZmxkJyk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICogQHBhcmFtIGlkXG4gICAgICovXG4gICAgcHVibGljIGluaXQoJGVsZW1lbnQgOiBhbnksIGlkIDogbnVtYmVyLCRkYXRhIDogYW55KVxuICAgIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgICAgICRlbGVtZW50ID0gJGVsZW1lbnQucmVwbGFjZSgvZmllbGRJZC9nLGlkKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKCRlbGVtZW50KTtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudCA9IHRoaXMuZWxlbWVudC5maW5kKCcuZWYtdGFibGUnKTtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmQodGhpcy5lbGVtZW50KTtcblxuICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuXG4gICAgICAgIHRoaXMuYWRkRGF0YSgkZGF0YSk7XG4gICAgfVxuXG5cblxuXG4gICAgcHVibGljIHNldEV2ZW50cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJ1tkYXRhLWFjdGlvbj1cIm9wZW4tY2xvc2VcIl0nKS5vbignY2xpY2snLCgpID0+IHtyZXR1cm4gdGhpcy50b2dnbGUoKX0pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQ2xvc2UgdGhlIGVsZW1lbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9nZ2xlKCk6IGJvb2xlYW5cbiAgICB7XG5cbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwib3Blbi1jbG9zZVwiXScpO1xuXG4gICAgICAgIGlmKCQoZWxlbSkuaGFzQ2xhc3MoJ21pbmlmeScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9zZSgpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGVuKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSW5zZXJ0IHRoZSBkYXRhIGluIHRoZSB0ZW1wbGF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICovXG4gICAgcHVibGljIGFkZERhdGEoJGRhdGEpIDogdm9pZFxuICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coJGRhdGEpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdbbmFtZV49XCJmaWVsZFwiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gdGhpcy5nZXRQcm9wZXJ0aWVzKGVsZW0pO1xuXG4gICAgICAgICAgICBpZigkZGF0YVtwcm9wLnByb3BdICYmICRkYXRhW3Byb3AucHJvcF1bcHJvcC5uYW1lXSkge1xuICAgICAgICAgICAgICAgIEVGX0lucHV0LnNldElucHV0VmFsdWUoJChlbGVtKSwkZGF0YVtwcm9wLnByb3BdW3Byb3AubmFtZV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgYSB2YWx1ZSB0byBhbiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXRJbnB1dFZhbHVlKGlucHV0IDogYW55LCB2YWx1ZSA6IHN0cmluZylcbiAgICB7XG4gICAgICAgIGlmKGlucHV0LmlzKCc6Y2hlY2tib3gnKSl7XG4gICAgICAgICAgICBpbnB1dC5wcm9wKCdjaGVja2VkJyx2YWx1ZSk7XG4gICAgICAgIH1lbHNlIGlmKGlucHV0LmlzKCdzZWxlY3QnKSl7XG4gICAgICAgICAgICBpbnB1dC5maW5kKCdvcHRpb25bdmFsdWU9XCInKyB2YWx1ZSArJ1wiXScpLnByb3AoJ3NlbGVjdGVkJyx0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgaW5wdXQudmFsKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gYWxsIHRoZSBwcm9wZXJ0aWVzIG9mIGFuIGlucHV0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRQcm9wZXJ0aWVzKGVsZW0gOiBzdHJpbmcpIDoge2lkLHByb3AsbmFtZX1cbiAgICB7XG5cbiAgICAgICAgbGV0IG5hbWUgPSAkKGVsZW0pLmF0dHIoJ25hbWUnKS5yZXBsYWNlKC9maWVsZC9naSwnJyk7XG5cbiAgICAgICAgbGV0IGRhdGEgPSBuYW1lLnNwbGl0KCddJyk7XG5cbiAgICAgICAgbGV0IHByb3BzID0ge1xuICAgICAgICAgICAgaWQgOiBkYXRhWzBdLnJlcGxhY2UoJ1snLCcnKSxcbiAgICAgICAgICAgIHByb3AgOiBkYXRhWzFdLnJlcGxhY2UoJ1snLCcnKSxcbiAgICAgICAgICAgIG5hbWUgOiBkYXRhWzJdLnJlcGxhY2UoJ1snLCcnKSxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBzaW5jZSAxLjEuMFxuICAgICAqXG4gICAgICogQGV2ZW50IDogQ2xpY2sgb24gbWluaWZ5IGJ1dHRvbiA6IGhpZGUgdGhlIG9wdGlvbnMgb2YgdGhlIGZpZWxkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBjbG9zZSgpIDogYm9vbGVhblxuICAgIHtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudC5oaWRlKDIwMCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcubWluaWZ5JylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWluaWZ5JylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnb3BlbicpXG4gICAgICAgICAgICAuaHRtbCgnKycpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHNpbmNlIDEuMS4wXG4gICAgICpcbiAgICAgKiBPcGVuIGEgZmllbGRcbiAgICAgKlxuICAgICAqIEBldmVudCA6IENsaWNrIG9uIG9wZW4gYnV0dG9uLCBzaG93IHRoZSBmaWVsZCBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBvcGVuKCkgOiBib29sZWFuXG4gICAge1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50LnNob3coMjAwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5vcGVuJylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnb3BlbicpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ21pbmlmeScpXG4gICAgICAgICAgICAuaHRtbCgnLScpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbn0iLCJkZWNsYXJlIHZhciAkO1xuXG5kZWNsYXJlIHZhciBhamF4VXJsIDogc3RyaW5nO1xuXG5pbXBvcnQge0VGX0lucHV0fSBmcm9tICcuL2lucHV0cy9FRl9JbnB1dCc7XG5cbmNsYXNzIEVGX0FkZFxue1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBCb2R5IG9mIHRoZSBwYWdlXG4gICAgICovXG4gICAgcHVibGljICRib2R5O1xuXG4gICAgLyoqXG4gICAgICpBbiBvYmplY3Qgb2YgYWxsIHRoZSBpbnB1dCB0ZW1wbGF0ZXMgY2FjaGVkIHRvIGF2b2lkIGxhdGVuY3lcbiAgICAgKi9cbiAgICBwdWJsaWMgdGVtcGxhdGVzIDogYW55ID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBhbGwgdGhlIGlucHV0cyBhdmFpbGFibGUgb24gdGhlIHBhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5wdXRzIDogRUZfSW5wdXRbXSA9IFtdO1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGF2YWlsYWJsZSBpbnB1dHNcbiAgICAgKi9cbiAgICBwdWJsaWMgYXZhaWxhYmxlSW5wdXRzIDoge30gPSB7fTtcblxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIGVkaXRvciBpcyBpbml0XG4gICAgICovXG4gICAgcHVibGljIGlzX2luaXQgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy4kYm9keSA9ICQoJ2JvZHknKTtcblxuICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuXG4gICAgICAgIHRoaXMubG9hZCgpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICB9KVxuXG4gICAgfVxuXG5cbiAgICBwdWJsaWMgaW5pdChmb3JtIDogYW55KSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coZm9ybSk7XG5cbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCBzZXRFdmVudHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIC8qXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcubW92ZScsX21vdmUpO1xuXG4gICAgICAgIC8vIERlbGV0ZSBhIGZpZWxkXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcuZGVsZXRlJyxfZGVsZXRlKTtcblxuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcudXAnLF91cCk7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5kb3duJyxfZG93bik7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5yZW1vdmVvcHRpb24nLF9yZW1vdmVPcHRpb24pO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcuZHVwbGlxdWVyJyxfZHVwbGljYXRlKTsqL1xuXG4gICAgICAgIC8vIEFkZCBhIG5ldyBmaWVsZFxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnYnV0dG9uW2RhdGEtYWN0aW9uPVwiYWRkXCJdJyx0aGlzLmFkZElucHV0KTtcbiAgICAgICAgLypcbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGQtb3B0aW9uXCJdJyxfYWRkT3B0aW9uKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZSQ9XCJhdHRyaWJ1dGVzW3R5cGVdXCJdJyxfY2hhbmdlRmllbGRUeXBlKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZSQ9XCJbZm9ybS10YXhvbm9teV1cIl0nLF9jaGFuZ2VUYXhvbm9teSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWU9XCJmb3JtLXJlc2V0LWFjdGlvblwiXScsX2NoYW5nZVJlc2V0QWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cInNldHRpbmdzW3R5cGVdXCJdJyxfY2hhbmdlVXRpbGl0eSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCcucGFuZWwgaGVhZGVyJyxfdG9nZ2xlUGFuZWwpOyovXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYW4gaW5wdXQgdG8gdGhlIGVkaXRvclxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRJbnB1dCh0eXBlIDogc3RyaW5nID0gJ3RleHQnLCRkYXRhKSA6IFByb21pc2U8YW55PlxuICAgIHtcblxuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG5cbiAgICAgICAgdGhpcy5sb2FkaW5nKHRydWUpO1xuXG4gICAgICAgIC8vIENsb3NlIGFsbCB0aGUgaW5wdXRzXG4gICAgICAgICQuZWFjaCh0aGlzLmlucHV0cywoa2V5IDogbnVtYmVyLCBpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICBpbnB1dC5jbG9zZSgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZ2V0SW5wdXQodHlwZSkudGhlbigoZGF0YSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgaW5wdXQgOiBFRl9JbnB1dDtcblxuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLmdlbmVyYXRlSW5wdXQodHlwZSk7XG5cbiAgICAgICAgICAgIGlucHV0LmluaXQoZGF0YS5kYXRhLHRoaXMuaW5wdXRzLmxlbmd0aCwkZGF0YSk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXRzLnB1c2goaW5wdXQpO1xuXG4gICAgICAgICAgICBkZmQucmVzb2x2ZShpbnB1dCk7XG5cbiAgICAgICAgfSlcblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGxvYWRpbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZGluZyhsb2FkaW5nIDogYm9vbGVhbiA9IHRydWUpXG4gICAge1xuICAgICAgICAvLyBTaG93IHRoZSBzcGlubmVyXG4gICAgICAgICQoJyNzcGlubmVyLWZpZWxkcycpLnRvZ2dsZShsb2FkaW5nKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogTG9hZCB0aGUgZm9ybSBkYXRhIGZyb20gdGhlIGJhY2sgb2ZmaWNlXG4gICAgICovXG4gICAgcHVibGljIGxvYWQoKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuXG4gICAgICAgICQuZ2V0SlNPTihhamF4VXJsLCB7XG4gICAgICAgICAgICBmb3JtX2lkIDogRUZfQWRkLmdldFBhcmFtZXRlcigncG9zdCcpLFxuICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF9mb3JtX2RhdGEnXG4gICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5kYXRhLmlucHV0cywodHlwZSxpbnB1dCA6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlSW5wdXRzW3R5cGVdID0gaW5wdXQ7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLDApO1xuXG5cblxuICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0c1xuICAgICAqIEBwYXJhbSBvcmRlclxuICAgICAqL1xuICAgIHByaXZhdGUgbG9hZElucHV0cyhpbnB1dHMsb3JkZXIgOiBudW1iZXIpXG4gICAge1xuXG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMoaW5wdXRzKTtcblxuICAgICAgICBsZXQga2V5ID0ga2V5c1tvcmRlcl07XG5cbiAgICAgICAgaWYoIWtleSB8fCAhaW5wdXRzIHx8ICFpbnB1dHNba2V5XSl7XG4gICAgICAgICAgICB0aGlzLmlzX2luaXQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmFkZElucHV0KGlucHV0c1trZXldLmF0dHJpYnV0ZXMudHlwZSxpbnB1dHNba2V5XSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgb3JkZXIrKztcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoaW5wdXRzLG9yZGVyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZW5lcmF0ZUlucHV0KHR5cGUgOiBzdHJpbmcpIDogRUZfSW5wdXRcbiAgICB7XG4gICAgICAgIGxldCBpbnB1dDtcblxuICAgICAgICBpZighdGhpcy5hdmFpbGFibGVJbnB1dHNbdHlwZV0pIHtcbiAgICAgICAgICAgIHR5cGUgPSAndGV4dCc7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHN3aXRjaCh0eXBlKSB7XG4gICAgICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG5ldyBFRl9JbnB1dCgpO1xuICAgICAgICB9XG5cblxuICAgICAgICByZXR1cm4gaW5wdXQ7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogTG9hZCB0aGUgaW5wdXQgdGVtcGxhdGUgZnJvbSB0aGUgQk9cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlIDogc3RyaW5nXG4gICAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0SW5wdXQodHlwZSA6IHN0cmluZyA9ICd0ZXh0JylcbiAgICB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2VcbiAgICAgICAgbGV0IGRmZCA9IG5ldyAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGVzW3R5cGVdICYmIHRoaXMudGVtcGxhdGVzW3R5cGVdICE9IHVuZGVmaW5lZCAmJiB0aGlzLnRlbXBsYXRlc1t0eXBlXSAhPSAnJykge1xuICAgICAgICAgICAgZGZkLnJlc29sdmUodGhpcy50ZW1wbGF0ZXNbdHlwZV0pO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkLmdldChhamF4VXJsLCB7XG4gICAgICAgICAgICAgICAgZWxlbWVudDogJ2lucHV0cycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgOiB0eXBlLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ0VGL2xvYWRfdGVtcGxhdGUnXG4gICAgICAgICAgICB9KS5zdWNjZXNzKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlc1t0eXBlXSA9IGRhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBJIHNlbmQgYmFjayB0aGUgZGF0YVxuICAgICAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgfSkuZXJyb3IodGhpcy5oYW5kbGVFcnJvcik7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIEhUVFAgRXJyb3JzXG4gICAgICpcbiAgICAgKiBAVE9ET1xuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVFcnJvcigpIDogdm9pZFxuICAgIHtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBHZXQgdGhlIHVybCBwYXJhbWV0ZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbWV0ZXJcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UGFyYW1ldGVyKHBhcmFtZXRlciA6IHN0cmluZyk6YW55XG4gICAge1xuICAgICAgICB2YXIgcGFyYW1zX3N0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpO1xuXG4gICAgICAgIHZhciBwYXJhbXNfYXJyYXkgPSBwYXJhbXNfc3RyaW5nLnNwbGl0KCcmJyk7XG5cbiAgICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgICBmb3IodmFyIGkgPTA7aTxwYXJhbXNfYXJyYXkubGVuZ3RoO2krKylcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGUgPSBwYXJhbXNfYXJyYXlbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgICAgIG9ialtlWzBdXSA9IGVbMV1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYmpbcGFyYW1ldGVyXTtcbiAgICB9XG5cbn1cblxudmFyIEVGX2FkZCA9IG5ldyBFRl9BZGQoKTsiXX0=
