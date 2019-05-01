var $ = jQuery;

function replace(data, find, replace) {
    var re = new RegExp(find, "g");
    return data.replace(re, replace);
}

function handleHiddenFields(id, type) {
    if ($.inArray(type, inputs) != -1) {
        if (type == "checkbox" || type == "radio") {
            $('input[name="field[' + id + '][form-placeholder]"]').css("visibility", "hidden").val("");
            $('input[name="field[' + id + '][form-autocomplete]"]').parent().parent().remove();
            $('input[name="field[' + id + '][form-required]"]').removeAttr("checked");
        }
        if (type == "hidden") {
            $('input[name="field[' + id + '][form-placeholder]"]').parent().remove();
            $('input[name="field[' + id + '][form-autocomplete]"]').parent().parent().remove();
            $('input[name="field[' + id + '][form-label-after]"]').parent().parent().remove();
            $('input[name="field[' + id + '][form-required]"]').parent().parent().remove();
            $('input[name="field[' + id + '][form-class]"]').parent().parent().remove();
            $('input[name="field[' + id + '][form-id]"]').parent().parent().remove();
            $('input[name="field[' + id + '][form-label]"]').parent().parent().remove();
            $('input[name="field[' + id + '][form-label-class]"]').parent().parent().remove();
        }
    }
}

function updateIds(field, id1, id2) {
    field.attr("id", "field-" + id2);
    field.find("*[data-field=" + id1 + "]").attr("data-field", id2);
    field.find(".options-" + id1).attr("class", "options-" + id2);
    field.find("input,select").each(function() {
        var newName = $(this).attr("name").replace(/field\[[0-9]+\]\[(.+)\]/g, "field[" + id2 + "][$1]");
        $(this).attr("name", newName);
        if ($(this).attr("id")) $(this).attr("id", newName);
    });
    field.find("label").each(function() {
        if ($(this).attr("for")) {
            var newName = $(this).attr("for").replace(/field\[[0-9]+\]\[(.+)\]/g, "field[" + id2 + "][$1]");
            $(this).attr("for", newName);
        }
    });
    field.find(".field-number").text(id2);
}

function switchIds(id1, id2) {
    var thefield = $("#field-" + id1);
    var fieldBefore = $("#field-" + id2);
    if (id1 < id2) fieldBefore.after(thefield); else fieldBefore.before(thefield);
    updateIds(thefield, id1, id2);
    updateIds(fieldBefore, id2, id1);
}

function addslashes(string) {
    return string.replace(/\\/g, "\\\\").replace(/\u0008/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function htmlEntities(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

var DraggableArgs = {
    containment: "#container",
    opacity: 1,
    zIndex: 100,
    cursor: "move",
    handle: ".col-sm-7 label",
    start: function(event, ui) {
        $(".minify").each(function() {
            $(this).click();
        });
    },
    drag: function(event, ui) {
        var top = $(this).offset().top - $("#allfields").offset().top;
        var height = $(this).height();
        var nbField = Math.min(Math.max(Math.ceil((top - 50) / height), 1), nbfield);
        var oldnbField = parseInt($(this).attr("id").substr(6));
        $(this).append('<span class="info"></span>');
        $(this).children(".info").html(nbField);
        $('div[id^="field-"]').each(function() {
            $(this).removeClass("hovered");
        });
        if (oldnbField != nbField) {
            $("#field-" + nbField).addClass("hovered");
        }
    },
    stop: function(event, element) {
        var top = $(this).offset().top - $("#allfields").offset().top;
        var height = $(this).height();
        var nbField = Math.min(Math.max(Math.ceil((top - 50) / height), 1), nbfield);
        var oldnbField = parseInt($(this).attr("id").substr(6));
        $(this).attr("style", "position: relative;");
        $('div[id^="field-"]').each(function() {
            $(this).removeClass("hovered");
        });
        if (nbField != oldnbField) {
            if (oldnbField < nbField) {
                for (var k = oldnbField; k < nbField; k++) {
                    switchIds(k, k + 1);
                }
            } else {
                for (var j = oldnbField; j > nbField; j--) {
                    switchIds(j, j - 1);
                }
            }
        }
    }
};

function EF_Form_Actions() {
    var $ = jQuery;
    var $this = this;
    var utilities = {};
    $this.initReset = initReset;
    $this.get = _get;
    function init() {
        return $this;
    }
    function initReset(val) {
        $("#link-password-email").hide();
        $("#reset-password-email").hide();
        $("#" + val).show();
    }
    function _get(val, formSendArgs) {
        if (formSendArgs == undefined) formSendArgs = utilitiesEmpty[val];
        $("#spinner-utility").show();
        _getTemplate(val).done(function(data) {
            switch (val) {
              case "post":
                data = replace(data, 'value="' + formSendArgs.post_type + '"', 'value="' + formSendArgs.post_type + '" selected');
                data = replace(data, 'value="' + formSendArgs.post_status + '"', 'value="' + formSendArgs.post_status + '" selected');
                break;

              case "connexion":
                data = replace(data, "ConnectUserChecked", formSendArgs.remember ? "checked" : "");
                break;

              case "user":
                data = replace(data, 'value="' + formSendArgs.role + '"', 'value="' + formSendArgs.role + '" selected');
                data = replace(data, "ConnectUserChecked", formSendArgs.connectUser ? "checked" : "");
                data = replace(data, "EmailUserChecked", formSendArgs.emailUser ? "checked" : "");
                break;

              case "email":
                data = replace(data, "SubjectValue", 'value="' + formSendArgs.subject + '"');
                data = replace(data, "recipiendNameValue", 'value="' + formSendArgs.recipientName + '"');
                data = replace(data, "recipiendEmailValue", 'value="' + formSendArgs.recipientEmail + '"');
                break;

              case "resetPassword":
                formSendArgs.submitValue = formSendArgs.submitValue == undefined ? "Réinitialiser" : "";
                data = replace(data, "SubjectValue", 'value="' + formSendArgs.subject + '"');
                data = replace(data, "senderEmailValue", 'value="' + formSendArgs.senderEmail + '"');
                data = replace(data, "SenderNameValue", 'value="' + formSendArgs.senderName + '"');
                data = replace(data, "MessageValue", 'value="' + formSendArgs.message + '"');
                data = replace(data, "PageValue", 'value="' + formSendArgs.pageId + '"');
                data = replace(data, "submitValue", 'value="' + formSendArgs.submitValue + '"');
                data = replace(data, 'value="' + formSendArgs.resetAction + '"', 'value="' + formSendArgs.resetAction + '" selected');
                break;
            }
            $(".utilities").html(data);
            if (formSendArgs.resetAction != undefined) displayReinitialiseUtility(formSendArgs.resetAction);
            $("#spinner-utility").hide();
        });
    }
    function _getTemplate(val) {
        var dfd = new $.Deferred();
        if (utilities[val] && utilities[val] != undefined && utilities[val] != "") {
            console.log("input already loaded");
            dfd.resolve(utilities[val]);
        } else {
            $.get(ajaxUrl, {
                form_action: val,
                action: "form_action"
            }, function(data) {}).always(function(data) {
                console.log("load Utility " + val);
                utilities[val] = data;
                dfd.resolve(data);
            });
        }
        return dfd.promise();
    }
    return init();
}

function EF_Event() {
    var $this = this;
    var $ = jQuery;
    $this.init = init;
    function init() {
        _addEvents();
        return $this;
    }
    function _addEvents() {
        var $body = $("body");
        $body.find(".move").off("click").on("click", _move);
        $body.find(".minify").off("click").on("click", _minify);
        $body.find(".delete").off("click").on("click", _delete);
        $body.find(".open").off("click").on("click", _open);
        $body.find(".up").off("click").on("click", _up);
        $body.find(".down").off("click").on("click", _down);
        $body.find(".removeoption").off("click").on("click", _removeOption);
        $body.find(".dupliquer").off("click").on("click", _duplicate);
        $body.find('button[data-action="add"]').off("click").on("click", _add);
        $body.find('button[data-action="add-option"]').off("click").on("click", _addOption());
        $body.find('select[name$="form-type]"]').on("change", _changeFormType);
        $body.find('select[name$="[form-taxonomy]"]').on("change", _changeTaxonomy);
        $body.find('select[name="form-reset-action"]').on("change", _changeResetAction);
        $body.find('input[name$="form-container-class]"]').off("keyup").on("keyup", _putCommentsInYourCode);
        $body.find('select[name="form-utility"]').off("change").on("change", _changeUtility);
    }
    function _changeUtility() {
        var val = $(this).val();
        EF_form_actions.get(val, utilitiesEmpty[val]);
    }
    function _changeResetAction() {
        var val = $(this).val();
        EF_Form_Actions().initReset(val);
    }
    function _changeTaxonomy() {
        var id = parseInt($(this).attr("data-field"));
        var val = $(this).val();
        $('input[name="field[' + id + '][form-name]"]').val("taxonomy_" + val);
    }
    function _putCommentsInYourCode() {
        var id = parseInt($(this).attr("data-field"));
        var input = $('input[name="field[' + id + '][form-name]"');
        input.val($(this).val());
    }
    function _addOption() {
        $("#spinner-fields").show();
        var id = parseInt($(this).attr("data-field"));
        var nbOptions = $("#field-" + id + " .option-select").length;
        var $this = $(this);
        getOption({
            id: id,
            nbOptions: nbOptions,
            option: {
                content: "",
                select: true,
                value: ""
            }
        }).done(function(option) {
            $this.before(option);
            $("#spinner-fields").hide();
        });
        return false;
    }
    function _removeOption() {
        var id = parseInt($(this).attr("data-field"));
        var option = parseInt($(this).attr("data-option"));
        var nbOptions = $("#field-" + id + " .option-select").length;
        $("#option-select" + id + "-" + option).empty();
        return false;
    }
    function _down() {
        var id = parseInt($(this).attr("data-field"));
        if (id != nbfield) switchIds(id, id + 1);
        return false;
    }
    function _duplicate() {
        var id = parseInt($(this).attr("data-field"));
        var thefield = $("#field-" + id);
        var clonedField = thefield.clone();
        $('div[id="field-' + nbfield + '"]').after(clonedField);
        updateIds(clonedField, id, nbfield + 1);
        var val = $('select[name="field[' + id + '][form-type]"]').val();
        $('select[name="field[' + (nbfield + 1) + '][form-type]"]').val(val);
        clonedField.draggable(DraggableArgs);
        nbfield++;
        return false;
    }
    function _up() {
        var id = parseInt($(this).attr("data-field"));
        if (id != 1) switchIds(id, id - 1);
        return false;
    }
    function _open() {
        var id = parseInt($(this).attr("data-field"));
        $(".options-" + id).show(200);
        $(this).removeClass("open").addClass("minify").html("-");
        return false;
    }
    function _changeFormType() {
        $("#spinner-fields").show();
        var type = $(this).val();
        var id = $(this).attr("data-field");
        var name = $('body input[name="field[' + id + '][form-name]"]').val();
        var input = getInput({
            type: type,
            id: id,
            name: name
        });
        getData(input).done(function(data) {
            $("#field-" + id).replaceWith(data);
            handleHiddenFields(id, type);
            $("#spinner-fields").hide();
            $('a[data-field="' + id + '"].open').click();
        });
    }
    function _minify() {
        var id = $(this).attr("data-field");
        $(".options-" + id).hide(200);
        $(this).removeClass("minify").addClass("open").html("+");
        return false;
    }
    function _add() {
        $("#spinner-fields").show();
        $(".minify").each(function() {
            $(this).click();
        });
        var input = getInput({
            type: "text",
            id: fieldIncrement + 1,
            name: ""
        });
        displayData(input, true).done(function() {
            $("#spinner-fields").hide();
        });
        nbfield++;
    }
    function _delete() {
        var id = parseInt($(this).attr("data-field"));
        if (1 === id && 1 === nbfield) return false;
        $("#field-" + id).remove();
        for (var j = id + 1; j <= nbfield; j++) updateIds($("#field-" + j), j, j - 1);
        nbfield--;
        return false;
    }
    function _move() {
        var fieldId = $(this).attr("data-field");
        $("#form-duplicate-field-id").val(fieldId);
        $("#modal-move").modal("show");
        return false;
    }
    return $this.init();
}

var EF_form_actions = new EF_Form_Actions();

var EF_events = new EF_Event();