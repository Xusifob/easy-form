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
                    var _this = this;
                    $element.find('[name^="field"]').each(function(key, elem) {
                        var prop = _this.getInputProperties($(elem));
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
                EF_Input.getInputProperties = function(elem) {
                    var name = elem.attr("name").replace(/field/gi, "");
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
                EF_Add.prototype.addSubmitData = function(submit) {
                    console.log(submit);
                    EF_Input_1.EF_Input.addDataToElement(this.$body.find("#submit-content"), submit);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL2lucHV0cy9FRl9JbnB1dC50cyIsImFzc2V0cy9hZG1pbi9qcy9zcmMvYWRkL0VGX0FkZC50cyJdLCJuYW1lcyI6WyJFRl9JbnB1dCIsInRoaXMiLCJjb250YWluZXIiLCIkIiwicHJvdG90eXBlIiwiaW5pdCIsIiRlbGVtZW50IiwiaWQiLCIkZGF0YSIsInJlcGxhY2UiLCJlbGVtZW50Iiwib3B0aW9uc0VsZW1lbnQiLCJmaW5kIiwiYXBwZW5kIiwic2V0RXZlbnRzIiwiYWRkRGF0YSIsIl90aGlzIiwib24iLCJ0b2dnbGUiLCJlbGVtIiwiaGFzQ2xhc3MiLCJjbG9zZSIsIm9wZW4iLCJhZGREYXRhVG9FbGVtZW50IiwiZWFjaCIsImtleSIsInByb3AiLCJnZXRJbnB1dFByb3BlcnRpZXMiLCJuYW1lIiwic2V0SW5wdXRWYWx1ZSIsImlucHV0IiwidmFsdWUiLCJpcyIsInZhbCIsImF0dHIiLCJkYXRhIiwic3BsaXQiLCJwcm9wcyIsImhpZGUiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiaHRtbCIsInNob3ciLCJ0eXBlIiwiRUZfQWRkIiwidGVtcGxhdGVzIiwiaW5wdXRzIiwiYXZhaWxhYmxlSW5wdXRzIiwiaXNfaW5pdCIsIiRib2R5IiwibG9hZCIsInRoZW4iLCJmb3JtIiwiY29uc29sZSIsImxvZyIsImFkZElucHV0IiwiZGZkIiwiRGVmZXJyZWQiLCJsb2FkaW5nIiwiZ2V0SW5wdXQiLCJnZW5lcmF0ZUlucHV0IiwibGVuZ3RoIiwicHVzaCIsInJlc29sdmUiLCJwcm9taXNlIiwiZ2V0SlNPTiIsImFqYXhVcmwiLCJmb3JtX2lkIiwiZ2V0UGFyYW1ldGVyIiwiYWN0aW9uIiwic3VjY2VzcyIsInN1Ym1pdCIsImFkZFN1Ym1pdERhdGEiLCJsb2FkSW5wdXRzIiwiZXJyb3IiLCJoYW5kbGVFcnJvciIsIkVGX0lucHV0XzEiLCJvcmRlciIsImtleXMiLCJPYmplY3QiLCJhdHRyaWJ1dGVzIiwidW5kZWZpbmVkIiwiZ2V0IiwidGVtcGxhdGUiLCJwYXJhbWV0ZXIiLCJwYXJhbXNfc3RyaW5nIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJzdWJzdHIiLCJwYXJhbXNfYXJyYXkiLCJvYmoiLCJpIiwiZSIsIkVGX2FkZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Z0JBMENJLFNBQUFBO29CQUVJQyxLQUFLQyxZQUFZQyxFQUFFOzs7Ozs7OztnQkFXaEJILFNBQUFJLFVBQUFDLE9BQVAsU0FBWUMsVUFBZ0JDLElBQVlDO29CQUVwQ1AsS0FBS00sS0FBS0E7b0JBRVZELFdBQVdBLFNBQVNHLFFBQVEsWUFBV0Y7b0JBRXZDTixLQUFLUyxVQUFVUCxFQUFFRztvQkFDakJMLEtBQUtVLGlCQUFpQlYsS0FBS1MsUUFBUUUsS0FBSztvQkFFeENYLEtBQUtDLFVBQVVXLE9BQU9aLEtBQUtTO29CQUUzQlQsS0FBS2E7b0JBRUxiLEtBQUtjLFFBQVFQOztnQkFNVlIsU0FBQUksVUFBQVUsWUFBUDtvQkFBQSxJQUFBRSxRQUFBZjtvQkFFSUEsS0FBS1MsUUFBUUUsS0FBSyw4QkFBOEJLLEdBQUcsU0FBUTt3QkFBTyxPQUFPRCxNQUFLRTs7Ozs7O2dCQU8zRWxCLFNBQUFJLFVBQUFjLFNBQVA7b0JBR0ksSUFBSUMsT0FBT2xCLEtBQUtTLFFBQVFFLEtBQUs7b0JBRTdCLElBQUdULEVBQUVnQixNQUFNQyxTQUFTLFdBQVc7d0JBQzNCLE9BQU9uQixLQUFLb0I7MkJBQ1Y7d0JBQ0YsT0FBT3BCLEtBQUtxQjs7Ozs7Ozs7Z0JBV2J0QixTQUFBSSxVQUFBVyxVQUFQLFNBQWVQO29CQUVYUixTQUFTdUIsaUJBQWlCdEIsS0FBS1MsU0FBUUY7Ozs7Ozs7Z0JBUzdCUixTQUFBdUIsbUJBQWQsU0FBK0JqQixVQUFnQkU7b0JBQS9DLElBQUFRLFFBQUFmO29CQUVJSyxTQUFTTSxLQUFLLG1CQUFtQlksS0FBSyxTQUFDQyxLQUFhTjt3QkFFaEQsSUFBSU8sT0FBT1YsTUFBS1csbUJBQW1CeEIsRUFBRWdCO3dCQUVyQyxJQUFHWCxN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WUFFSWtELFNBQVMsSUFBSWxEIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmRlY2xhcmUgdmFyICQgOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBFRl9JbnB1dFxue1xuXG4gICAgLyoqXG4gICAgICogQHZhciBzdHJpbmdcbiAgICAgKlxuICAgICAqIFRoZSB0eXBlIG9mIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdHlwZSA6IHN0cmluZyA9ICd0ZXh0JztcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgb2YgdGhlIGlucHV0XG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgZWxlbWVudCA6IGFueTtcblxuXG4gICAgLyoqXG4gICAgICogQHZhciBIVE1MIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIFRoZSBodG1sIGVsZW1lbnQgZm9yIHRoZSBvcHRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgb3B0aW9uc0VsZW1lbnQgOiBhbnk7XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBpZCAocG9zaXRpb24pIG9mIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIHB1YmxpYyBpZCA6IG51bWJlcjtcblxuXG4gICAgLyoqXG4gICAgICogVGhlIEhUTUwgZWxlbWVudCBvZiB0aGUgY29udGFpbmVyXG4gICAgICovXG4gICAgcHVibGljIGNvbnRhaW5lciA6IGFueTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9ICQoJyNmbGQnKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gJGRhdGFcbiAgICAgKiBAcGFyYW0gaWRcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdCgkZWxlbWVudCA6IGFueSwgaWQgOiBudW1iZXIsJGRhdGEgOiBhbnkpXG4gICAge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG5cbiAgICAgICAgJGVsZW1lbnQgPSAkZWxlbWVudC5yZXBsYWNlKC9maWVsZElkL2csaWQpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoJGVsZW1lbnQpO1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50ID0gdGhpcy5lbGVtZW50LmZpbmQoJy5lZi10YWJsZScpO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZCh0aGlzLmVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuc2V0RXZlbnRzKCk7XG5cbiAgICAgICAgdGhpcy5hZGREYXRhKCRkYXRhKTtcbiAgICB9XG5cblxuXG5cbiAgICBwdWJsaWMgc2V0RXZlbnRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnW2RhdGEtYWN0aW9uPVwib3Blbi1jbG9zZVwiXScpLm9uKCdjbGljaycsKCkgPT4ge3JldHVybiB0aGlzLnRvZ2dsZSgpfSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBDbG9zZSB0aGUgZWxlbWVudFxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGUoKTogYm9vbGVhblxuICAgIHtcblxuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuZWxlbWVudC5maW5kKCdbZGF0YS1hY3Rpb249XCJvcGVuLWNsb3NlXCJdJyk7XG5cbiAgICAgICAgaWYoJChlbGVtKS5oYXNDbGFzcygnbWluaWZ5JykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wZW4oKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgdGhlIGRhdGEgaW4gdGhlIHRlbXBsYXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJGRhdGFcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkRGF0YSgkZGF0YSkgOiB2b2lkXG4gICAge1xuICAgICAgICBFRl9JbnB1dC5hZGREYXRhVG9FbGVtZW50KHRoaXMuZWxlbWVudCwkZGF0YSlcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICogQHBhcmFtICRkYXRhXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGREYXRhVG9FbGVtZW50KCRlbGVtZW50IDogYW55LCAkZGF0YSA6IGFueSkgOiB2b2lkXG4gICAge1xuICAgICAgICAkZWxlbWVudC5maW5kKCdbbmFtZV49XCJmaWVsZFwiXScpLmVhY2goKGtleSA6IG51bWJlcixlbGVtIDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gdGhpcy5nZXRJbnB1dFByb3BlcnRpZXMoJChlbGVtKSk7XG5cbiAgICAgICAgICAgIGlmKCRkYXRhW3Byb3AucHJvcF0gJiYgJGRhdGFbcHJvcC5wcm9wXVtwcm9wLm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgRUZfSW5wdXQuc2V0SW5wdXRWYWx1ZSgkKGVsZW0pLCRkYXRhW3Byb3AucHJvcF1bcHJvcC5uYW1lXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgYSB2YWx1ZSB0byBhbiBpbnB1dFxuICAgICAqXG4gICAgICogQHBhcmFtIGlucHV0XG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzZXRJbnB1dFZhbHVlKGlucHV0IDogYW55LCB2YWx1ZSA6IHN0cmluZylcbiAgICB7XG4gICAgICAgIGlmKGlucHV0LmlzKCc6Y2hlY2tib3gnKSl7XG4gICAgICAgICAgICBpbnB1dC5wcm9wKCdjaGVja2VkJyx2YWx1ZSk7XG4gICAgICAgIH1lbHNlIGlmKGlucHV0LmlzKCdzZWxlY3QnKSl7XG4gICAgICAgICAgICBpbnB1dC5maW5kKCdvcHRpb25bdmFsdWU9XCInKyB2YWx1ZSArJ1wiXScpLnByb3AoJ3NlbGVjdGVkJyx0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgaW5wdXQudmFsKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm4gYWxsIHRoZSBwcm9wZXJ0aWVzIG9mIGFuIGlucHV0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5wdXRQcm9wZXJ0aWVzKGVsZW0gOiBhbnkpIDoge2lkLHByb3AsbmFtZX1cbiAgICB7XG5cbiAgICAgICAgbGV0IG5hbWUgPSBlbGVtLmF0dHIoJ25hbWUnKS5yZXBsYWNlKC9maWVsZC9naSwnJyk7XG5cbiAgICAgICAgbGV0IGRhdGEgPSBuYW1lLnNwbGl0KCddJyk7XG5cbiAgICAgICAgbGV0IHByb3BzID0ge1xuICAgICAgICAgICAgaWQgOiBkYXRhWzBdLnJlcGxhY2UoJ1snLCcnKSxcbiAgICAgICAgICAgIHByb3AgOiBkYXRhWzFdLnJlcGxhY2UoJ1snLCcnKSxcbiAgICAgICAgICAgIG5hbWUgOiBkYXRhWzJdLnJlcGxhY2UoJ1snLCcnKSxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBzaW5jZSAxLjEuMFxuICAgICAqXG4gICAgICogQGV2ZW50IDogQ2xpY2sgb24gbWluaWZ5IGJ1dHRvbiA6IGhpZGUgdGhlIG9wdGlvbnMgb2YgdGhlIGZpZWxkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBjbG9zZSgpIDogYm9vbGVhblxuICAgIHtcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudC5oaWRlKDIwMCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCcubWluaWZ5JylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnbWluaWZ5JylcbiAgICAgICAgICAgIC5hZGRDbGFzcygnb3BlbicpXG4gICAgICAgICAgICAuaHRtbCgnKycpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHNpbmNlIDEuMS4wXG4gICAgICpcbiAgICAgKiBPcGVuIGEgZmllbGRcbiAgICAgKlxuICAgICAqIEBldmVudCA6IENsaWNrIG9uIG9wZW4gYnV0dG9uLCBzaG93IHRoZSBmaWVsZCBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBvcGVuKCkgOiBib29sZWFuXG4gICAge1xuICAgICAgICB0aGlzLm9wdGlvbnNFbGVtZW50LnNob3coMjAwKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5vcGVuJylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnb3BlbicpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ21pbmlmeScpXG4gICAgICAgICAgICAuaHRtbCgnLScpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbn0iLCJkZWNsYXJlIHZhciAkO1xuXG5kZWNsYXJlIHZhciBhamF4VXJsIDogc3RyaW5nO1xuXG5pbXBvcnQge0VGX0lucHV0fSBmcm9tICcuL2lucHV0cy9FRl9JbnB1dCc7XG5cbmNsYXNzIEVGX0FkZFxue1xuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTCBCb2R5IG9mIHRoZSBwYWdlXG4gICAgICovXG4gICAgcHVibGljICRib2R5O1xuXG4gICAgLyoqXG4gICAgICpBbiBvYmplY3Qgb2YgYWxsIHRoZSBpbnB1dCB0ZW1wbGF0ZXMgY2FjaGVkIHRvIGF2b2lkIGxhdGVuY3lcbiAgICAgKi9cbiAgICBwdWJsaWMgdGVtcGxhdGVzIDogYW55ID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBhbGwgdGhlIGlucHV0cyBhdmFpbGFibGUgb24gdGhlIHBhZ2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5wdXRzIDogRUZfSW5wdXRbXSA9IFtdO1xuXG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGF2YWlsYWJsZSBpbnB1dHNcbiAgICAgKi9cbiAgICBwdWJsaWMgYXZhaWxhYmxlSW5wdXRzIDoge30gPSB7fTtcblxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIGVkaXRvciBpcyBpbml0XG4gICAgICovXG4gICAgcHVibGljIGlzX2luaXQgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy4kYm9keSA9ICQoJ2JvZHknKTtcblxuICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuXG4gICAgICAgIHRoaXMubG9hZCgpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICB9KVxuXG4gICAgfVxuXG5cbiAgICBwdWJsaWMgaW5pdChmb3JtIDogYW55KSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coZm9ybSk7XG5cbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCBzZXRFdmVudHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIC8qXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcubW92ZScsX21vdmUpO1xuXG4gICAgICAgIC8vIERlbGV0ZSBhIGZpZWxkXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcuZGVsZXRlJyxfZGVsZXRlKTtcblxuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcudXAnLF91cCk7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5kb3duJyxfZG93bik7XG5cbiAgICAgICAgdGhpcy4kYm9keVxuICAgICAgICAgICAgLm9uKCdjbGljaycsJy5yZW1vdmVvcHRpb24nLF9yZW1vdmVPcHRpb24pO1xuXG4gICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCcuZHVwbGlxdWVyJyxfZHVwbGljYXRlKTsqL1xuXG4gICAgICAgIC8vIEFkZCBhIG5ldyBmaWVsZFxuICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAub24oJ2NsaWNrJywnYnV0dG9uW2RhdGEtYWN0aW9uPVwiYWRkXCJdJyx0aGlzLmFkZElucHV0KTtcbiAgICAgICAgLypcbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCdidXR0b25bZGF0YS1hY3Rpb249XCJhZGQtb3B0aW9uXCJdJyxfYWRkT3B0aW9uKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZSQ9XCJhdHRyaWJ1dGVzW3R5cGVdXCJdJyxfY2hhbmdlRmllbGRUeXBlKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZSQ9XCJbZm9ybS10YXhvbm9teV1cIl0nLF9jaGFuZ2VUYXhvbm9teSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywnc2VsZWN0W25hbWU9XCJmb3JtLXJlc2V0LWFjdGlvblwiXScsX2NoYW5nZVJlc2V0QWN0aW9uKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCdzZWxlY3RbbmFtZT1cInNldHRpbmdzW3R5cGVdXCJdJyxfY2hhbmdlVXRpbGl0eSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRib2R5XG4gICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCcucGFuZWwgaGVhZGVyJyxfdG9nZ2xlUGFuZWwpOyovXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBBZGQgYW4gaW5wdXQgdG8gdGhlIGVkaXRvclxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRJbnB1dCh0eXBlIDogc3RyaW5nID0gJ3RleHQnLCRkYXRhKSA6IFByb21pc2U8YW55PlxuICAgIHtcblxuICAgICAgICAvLyBDcmVhdGUgYSBwcm9taXNlXG4gICAgICAgIGxldCBkZmQgPSBuZXcgJC5EZWZlcnJlZCgpO1xuXG5cbiAgICAgICAgdGhpcy5sb2FkaW5nKHRydWUpO1xuXG4gICAgICAgIC8vIENsb3NlIGFsbCB0aGUgaW5wdXRzXG4gICAgICAgICQuZWFjaCh0aGlzLmlucHV0cywoa2V5IDogbnVtYmVyLCBpbnB1dCA6IEVGX0lucHV0KSA9PiB7XG4gICAgICAgICAgICBpbnB1dC5jbG9zZSgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZ2V0SW5wdXQodHlwZSkudGhlbigoZGF0YSA6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgaW5wdXQgOiBFRl9JbnB1dDtcblxuICAgICAgICAgICAgaW5wdXQgPSB0aGlzLmdlbmVyYXRlSW5wdXQodHlwZSk7XG5cbiAgICAgICAgICAgIGlucHV0LmluaXQoZGF0YS5kYXRhLHRoaXMuaW5wdXRzLmxlbmd0aCwkZGF0YSk7XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXRzLnB1c2goaW5wdXQpO1xuXG4gICAgICAgICAgICBkZmQucmVzb2x2ZShpbnB1dCk7XG5cbiAgICAgICAgfSlcblxuICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlXG4gICAgICAgIHJldHVybiBkZmQucHJvbWlzZSgpO1xuXG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGxvYWRpbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZGluZyhsb2FkaW5nIDogYm9vbGVhbiA9IHRydWUpXG4gICAge1xuICAgICAgICAvLyBTaG93IHRoZSBzcGlubmVyXG4gICAgICAgICQoJyNzcGlubmVyLWZpZWxkcycpLnRvZ2dsZShsb2FkaW5nKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogTG9hZCB0aGUgZm9ybSBkYXRhIGZyb20gdGhlIGJhY2sgb2ZmaWNlXG4gICAgICovXG4gICAgcHVibGljIGxvYWQoKSA6IFByb21pc2U8YW55PlxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuXG4gICAgICAgICQuZ2V0SlNPTihhamF4VXJsLCB7XG4gICAgICAgICAgICBmb3JtX2lkIDogRUZfQWRkLmdldFBhcmFtZXRlcigncG9zdCcpLFxuICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF9mb3JtX2RhdGEnXG4gICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5kYXRhLmlucHV0cywodHlwZSxpbnB1dCA6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlSW5wdXRzW3R5cGVdID0gaW5wdXQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLnN1Ym1pdCkge1xuICAgICAgICAgICAgICAgIGxldCBzdWJtaXQgPSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhLmRhdGEuZm9ybS5pbnB1dHMuc3VibWl0O1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkU3VibWl0RGF0YShzdWJtaXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmxvYWRJbnB1dHMoZGF0YS5kYXRhLmZvcm0uaW5wdXRzLDApO1xuXG5cblxuICAgICAgICAgICAgLy8gSSBzZW5kIGJhY2sgdGhlIGRhdGFcbiAgICAgICAgICAgIGRmZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcblxuXG4gICAgICAgIC8vIFJldHVybiBhIHByb21pc2VcbiAgICAgICAgcmV0dXJuIGRmZC5wcm9taXNlKCk7XG5cbiAgICB9XG5cblxuXG4gICAgcHJpdmF0ZSBhZGRTdWJtaXREYXRhKHN1Ym1pdCkgOiB2b2lkXG4gICAge1xuICAgICAgICBjb25zb2xlLmxvZyhzdWJtaXQpO1xuXG4gICAgICAgIEVGX0lucHV0LmFkZERhdGFUb0VsZW1lbnQodGhpcy4kYm9keS5maW5kKCcjc3VibWl0LWNvbnRlbnQnKSxzdWJtaXQpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5wdXRzXG4gICAgICogQHBhcmFtIG9yZGVyXG4gICAgICovXG4gICAgcHJpdmF0ZSBsb2FkSW5wdXRzKGlucHV0cyxvcmRlciA6IG51bWJlcilcbiAgICB7XG5cbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhpbnB1dHMpO1xuXG4gICAgICAgIGxldCBrZXkgPSBrZXlzW29yZGVyXTtcblxuICAgICAgICBpZigha2V5IHx8ICFpbnB1dHMgfHwgIWlucHV0c1trZXldKXtcbiAgICAgICAgICAgIHRoaXMuaXNfaW5pdCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmcoZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuYWRkSW5wdXQoaW5wdXRzW2tleV0uYXR0cmlidXRlcy50eXBlLGlucHV0c1trZXldKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBvcmRlcisrO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZElucHV0cyhpbnB1dHMsb3JkZXIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgcHVibGljIGdlbmVyYXRlSW5wdXQodHlwZSA6IHN0cmluZykgOiBFRl9JbnB1dFxuICAgIHtcbiAgICAgICAgbGV0IGlucHV0O1xuXG4gICAgICAgIGlmKCF0aGlzLmF2YWlsYWJsZUlucHV0c1t0eXBlXSkge1xuICAgICAgICAgICAgdHlwZSA9ICd0ZXh0JztcbiAgICAgICAgfVxuXG5cbiAgICAgICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgICAgICAgIGlucHV0ID0gbmV3IEVGX0lucHV0KCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiBpbnB1dDtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBMb2FkIHRoZSBpbnB1dCB0ZW1wbGF0ZSBmcm9tIHRoZSBCT1xuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGUgOiBzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRJbnB1dCh0eXBlIDogc3RyaW5nID0gJ3RleHQnKVxuICAgIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgcHJvbWlzZVxuICAgICAgICBsZXQgZGZkID0gbmV3ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXNbdHlwZV0gJiYgdGhpcy50ZW1wbGF0ZXNbdHlwZV0gIT0gdW5kZWZpbmVkICYmIHRoaXMudGVtcGxhdGVzW3R5cGVdICE9ICcnKSB7XG4gICAgICAgICAgICBkZmQucmVzb2x2ZSh0aGlzLnRlbXBsYXRlc1t0eXBlXSk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQuZ2V0KGFqYXhVcmwsIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnaW5wdXRzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA6IHR5cGUsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnRUYvbG9hZF90ZW1wbGF0ZSdcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzW3R5cGVdID0gZGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIEkgc2VuZCBiYWNrIHRoZSBkYXRhXG4gICAgICAgICAgICAgICAgZGZkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICB9KS5lcnJvcih0aGlzLmhhbmRsZUVycm9yKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZVxuICAgICAgICByZXR1cm4gZGZkLnByb21pc2UoKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgSFRUUCBFcnJvcnNcbiAgICAgKlxuICAgICAqIEBUT0RPXG4gICAgICovXG4gICAgcHVibGljIGhhbmRsZUVycm9yKCkgOiB2b2lkXG4gICAge1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEdldCB0aGUgdXJsIHBhcmFtZXRlclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmFtZXRlclxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRQYXJhbWV0ZXIocGFyYW1ldGVyIDogc3RyaW5nKTphbnlcbiAgICB7XG4gICAgICAgIHZhciBwYXJhbXNfc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSk7XG5cbiAgICAgICAgdmFyIHBhcmFtc19hcnJheSA9IHBhcmFtc19zdHJpbmcuc3BsaXQoJyYnKTtcblxuICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgIGZvcih2YXIgaSA9MDtpPHBhcmFtc19hcnJheS5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZSA9IHBhcmFtc19hcnJheVtpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgb2JqW2VbMF1dID0gZVsxXVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9ialtwYXJhbWV0ZXJdO1xuICAgIH1cblxufVxuXG52YXIgRUZfYWRkID0gbmV3IEVGX0FkZCgpOyJdfQ==
