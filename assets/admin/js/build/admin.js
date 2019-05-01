!function(t) {
    "function" == typeof define && define.amd ? define([ "jquery" ], t) : t(jQuery);
}(function(t) {
    function e(e, s) {
        var o, n, r, a = e.nodeName.toLowerCase();
        return "area" === a ? (o = e.parentNode, n = o.name, e.href && n && "map" === o.nodeName.toLowerCase() ? (r = t("img[usemap='#" + n + "']")[0], 
        !!r && i(r)) : !1) : (/^(input|select|textarea|button|object)$/.test(a) ? !e.disabled : "a" === a ? e.href || s : s) && i(e);
    }
    function i(e) {
        return t.expr.filters.visible(e) && !t(e).parents().addBack().filter(function() {
            return "hidden" === t.css(this, "visibility");
        }).length;
    }
    t.ui = t.ui || {}, t.extend(t.ui, {
        version: "1.11.4",
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    }), t.fn.extend({
        scrollParent: function(e) {
            var i = this.css("position"), s = "absolute" === i, o = e ? /(auto|scroll|hidden)/ : /(auto|scroll)/, n = this.parents().filter(function() {
                var e = t(this);
                return s && "static" === e.css("position") ? !1 : o.test(e.css("overflow") + e.css("overflow-y") + e.css("overflow-x"));
            }).eq(0);
            return "fixed" !== i && n.length ? n : t(this[0].ownerDocument || document);
        },
        uniqueId: function() {
            var t = 0;
            return function() {
                return this.each(function() {
                    this.id || (this.id = "ui-id-" + ++t);
                });
            };
        }(),
        removeUniqueId: function() {
            return this.each(function() {
                /^ui-id-\d+$/.test(this.id) && t(this).removeAttr("id");
            });
        }
    }), t.extend(t.expr[":"], {
        data: t.expr.createPseudo ? t.expr.createPseudo(function(e) {
            return function(i) {
                return !!t.data(i, e);
            };
        }) : function(e, i, s) {
            return !!t.data(e, s[3]);
        },
        focusable: function(i) {
            return e(i, !isNaN(t.attr(i, "tabindex")));
        },
        tabbable: function(i) {
            var s = t.attr(i, "tabindex"), o = isNaN(s);
            return (o || s >= 0) && e(i, !o);
        }
    }), t("<a>").outerWidth(1).jquery || t.each([ "Width", "Height" ], function(e, i) {
        function s(e, i, s, n) {
            return t.each(o, function() {
                i -= parseFloat(t.css(e, "padding" + this)) || 0, s && (i -= parseFloat(t.css(e, "border" + this + "Width")) || 0), 
                n && (i -= parseFloat(t.css(e, "margin" + this)) || 0);
            }), i;
        }
        var o = "Width" === i ? [ "Left", "Right" ] : [ "Top", "Bottom" ], n = i.toLowerCase(), r = {
            innerWidth: t.fn.innerWidth,
            innerHeight: t.fn.innerHeight,
            outerWidth: t.fn.outerWidth,
            outerHeight: t.fn.outerHeight
        };
        t.fn["inner" + i] = function(e) {
            return void 0 === e ? r["inner" + i].call(this) : this.each(function() {
                t(this).css(n, s(this, e) + "px");
            });
        }, t.fn["outer" + i] = function(e, o) {
            return "number" != typeof e ? r["outer" + i].call(this, e) : this.each(function() {
                t(this).css(n, s(this, e, !0, o) + "px");
            });
        };
    }), t.fn.addBack || (t.fn.addBack = function(t) {
        return this.add(null == t ? this.prevObject : this.prevObject.filter(t));
    }), t("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (t.fn.removeData = function(e) {
        return function(i) {
            return arguments.length ? e.call(this, t.camelCase(i)) : e.call(this);
        };
    }(t.fn.removeData)), t.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), 
    t.fn.extend({
        focus: function(e) {
            return function(i, s) {
                return "number" == typeof i ? this.each(function() {
                    var e = this;
                    setTimeout(function() {
                        t(e).focus(), s && s.call(e);
                    }, i);
                }) : e.apply(this, arguments);
            };
        }(t.fn.focus),
        disableSelection: function() {
            var t = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown";
            return function() {
                return this.bind(t + ".ui-disableSelection", function(t) {
                    t.preventDefault();
                });
            };
        }(),
        enableSelection: function() {
            return this.unbind(".ui-disableSelection");
        },
        zIndex: function(e) {
            if (void 0 !== e) return this.css("zIndex", e);
            if (this.length) for (var i, s, o = t(this[0]); o.length && o[0] !== document; ) {
                if (i = o.css("position"), ("absolute" === i || "relative" === i || "fixed" === i) && (s = parseInt(o.css("zIndex"), 10), 
                !isNaN(s) && 0 !== s)) return s;
                o = o.parent();
            }
            return 0;
        }
    }), t.ui.plugin = {
        add: function(e, i, s) {
            var o, n = t.ui[e].prototype;
            for (o in s) n.plugins[o] = n.plugins[o] || [], n.plugins[o].push([ i, s[o] ]);
        },
        call: function(t, e, i, s) {
            var o, n = t.plugins[e];
            if (n && (s || t.element[0].parentNode && 11 !== t.element[0].parentNode.nodeType)) for (o = 0; o < n.length; o++) t.options[n[o][0]] && n[o][1].apply(t.element, i);
        }
    };
}), function(t) {
    "function" == typeof define && define.amd ? define([ "jquery" ], t) : t(jQuery);
}(function(t) {
    var e = 0, i = Array.prototype.slice;
    return t.cleanData = function(e) {
        return function(i) {
            var s, o, n;
            for (n = 0; null != (o = i[n]); n++) try {
                s = t._data(o, "events"), s && s.remove && t(o).triggerHandler("remove");
            } catch (r) {}
            e(i);
        };
    }(t.cleanData), t.widget = function(e, i, s) {
        var o, n, r, a, l = {}, h = e.split(".")[0];
        return e = e.split(".")[1], o = h + "-" + e, s || (s = i, i = t.Widget), t.expr[":"][o.toLowerCase()] = function(e) {
            return !!t.data(e, o);
        }, t[h] = t[h] || {}, n = t[h][e], r = t[h][e] = function(t, e) {
            return this._createWidget ? void (arguments.length && this._createWidget(t, e)) : new r(t, e);
        }, t.extend(r, n, {
            version: s.version,
            _proto: t.extend({}, s),
            _childConstructors: []
        }), a = new i(), a.options = t.widget.extend({}, a.options), t.each(s, function(e, s) {
            return t.isFunction(s) ? void (l[e] = function() {
                var t = function() {
                    return i.prototype[e].apply(this, arguments);
                }, o = function(t) {
                    return i.prototype[e].apply(this, t);
                };
                return function() {
                    var e, i = this._super, n = this._superApply;
                    return this._super = t, this._superApply = o, e = s.apply(this, arguments), this._super = i, 
                    this._superApply = n, e;
                };
            }()) : void (l[e] = s);
        }), r.prototype = t.widget.extend(a, {
            widgetEventPrefix: n ? a.widgetEventPrefix || e : e
        }, l, {
            constructor: r,
            namespace: h,
            widgetName: e,
            widgetFullName: o
        }), n ? (t.each(n._childConstructors, function(e, i) {
            var s = i.prototype;
            t.widget(s.namespace + "." + s.widgetName, r, i._proto);
        }), delete n._childConstructors) : i._childConstructors.push(r), t.widget.bridge(e, r), 
        r;
    }, t.widget.extend = function(e) {
        for (var s, o, n = i.call(arguments, 1), r = 0, a = n.length; a > r; r++) for (s in n[r]) o = n[r][s], 
        n[r].hasOwnProperty(s) && void 0 !== o && (t.isPlainObject(o) ? e[s] = t.isPlainObject(e[s]) ? t.widget.extend({}, e[s], o) : t.widget.extend({}, o) : e[s] = o);
        return e;
    }, t.widget.bridge = function(e, s) {
        var o = s.prototype.widgetFullName || e;
        t.fn[e] = function(n) {
            var r = "string" == typeof n, a = i.call(arguments, 1), l = this;
            return r ? this.each(function() {
                var i, s = t.data(this, o);
                return "instance" === n ? (l = s, !1) : s ? t.isFunction(s[n]) && "_" !== n.charAt(0) ? (i = s[n].apply(s, a), 
                i !== s && void 0 !== i ? (l = i && i.jquery ? l.pushStack(i.get()) : i, !1) : void 0) : t.error("no such method '" + n + "' for " + e + " widget instance") : t.error("cannot call methods on " + e + " prior to initialization; attempted to call method '" + n + "'");
            }) : (a.length && (n = t.widget.extend.apply(null, [ n ].concat(a))), this.each(function() {
                var e = t.data(this, o);
                e ? (e.option(n || {}), e._init && e._init()) : t.data(this, o, new s(n, this));
            })), l;
        };
    }, t.Widget = function() {}, t.Widget._childConstructors = [], t.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            disabled: !1,
            create: null
        },
        _createWidget: function(i, s) {
            s = t(s || this.defaultElement || this)[0], this.element = t(s), this.uuid = e++, 
            this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = t(), this.hoverable = t(), 
            this.focusable = t(), s !== this && (t.data(s, this.widgetFullName, this), this._on(!0, this.element, {
                remove: function(t) {
                    t.target === s && this.destroy();
                }
            }), this.document = t(s.style ? s.ownerDocument : s.document || s), this.window = t(this.document[0].defaultView || this.document[0].parentWindow)), 
            this.options = t.widget.extend({}, this.options, this._getCreateOptions(), i), this._create(), 
            this._trigger("create", null, this._getCreateEventData()), this._init();
        },
        _getCreateOptions: t.noop,
        _getCreateEventData: t.noop,
        _create: t.noop,
        _init: t.noop,
        destroy: function() {
            this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)), 
            this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled"), 
            this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), 
            this.focusable.removeClass("ui-state-focus");
        },
        _destroy: t.noop,
        widget: function() {
            return this.element;
        },
        option: function(e, i) {
            var s, o, n, r = e;
            if (0 === arguments.length) return t.widget.extend({}, this.options);
            if ("string" == typeof e) if (r = {}, s = e.split("."), e = s.shift(), s.length) {
                for (o = r[e] = t.widget.extend({}, this.options[e]), n = 0; n < s.length - 1; n++) o[s[n]] = o[s[n]] || {}, 
                o = o[s[n]];
                if (e = s.pop(), 1 === arguments.length) return void 0 === o[e] ? null : o[e];
                o[e] = i;
            } else {
                if (1 === arguments.length) return void 0 === this.options[e] ? null : this.options[e];
                r[e] = i;
            }
            return this._setOptions(r), this;
        },
        _setOptions: function(t) {
            var e;
            for (e in t) this._setOption(e, t[e]);
            return this;
        },
        _setOption: function(t, e) {
            return this.options[t] = e, "disabled" === t && (this.widget().toggleClass(this.widgetFullName + "-disabled", !!e), 
            e && (this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus"))), 
            this;
        },
        enable: function() {
            return this._setOptions({
                disabled: !1
            });
        },
        disable: function() {
            return this._setOptions({
                disabled: !0
            });
        },
        _on: function(e, i, s) {
            var o, n = this;
            "boolean" != typeof e && (s = i, i = e, e = !1), s ? (i = o = t(i), this.bindings = this.bindings.add(i)) : (s = i, 
            i = this.element, o = this.widget()), t.each(s, function(s, r) {
                function a() {
                    return e || n.options.disabled !== !0 && !t(this).hasClass("ui-state-disabled") ? ("string" == typeof r ? n[r] : r).apply(n, arguments) : void 0;
                }
                "string" != typeof r && (a.guid = r.guid = r.guid || a.guid || t.guid++);
                var l = s.match(/^([\w:-]*)\s*(.*)$/), h = l[1] + n.eventNamespace, c = l[2];
                c ? o.delegate(c, h, a) : i.bind(h, a);
            });
        },
        _off: function(e, i) {
            i = (i || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, 
            e.unbind(i).undelegate(i), this.bindings = t(this.bindings.not(e).get()), this.focusable = t(this.focusable.not(e).get()), 
            this.hoverable = t(this.hoverable.not(e).get());
        },
        _delay: function(t, e) {
            function i() {
                return ("string" == typeof t ? s[t] : t).apply(s, arguments);
            }
            var s = this;
            return setTimeout(i, e || 0);
        },
        _hoverable: function(e) {
            this.hoverable = this.hoverable.add(e), this._on(e, {
                mouseenter: function(e) {
                    t(e.currentTarget).addClass("ui-state-hover");
                },
                mouseleave: function(e) {
                    t(e.currentTarget).removeClass("ui-state-hover");
                }
            });
        },
        _focusable: function(e) {
            this.focusable = this.focusable.add(e), this._on(e, {
                focusin: function(e) {
                    t(e.currentTarget).addClass("ui-state-focus");
                },
                focusout: function(e) {
                    t(e.currentTarget).removeClass("ui-state-focus");
                }
            });
        },
        _trigger: function(e, i, s) {
            var o, n, r = this.options[e];
            if (s = s || {}, i = t.Event(i), i.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(), 
            i.target = this.element[0], n = i.originalEvent) for (o in n) o in i || (i[o] = n[o]);
            return this.element.trigger(i, s), !(t.isFunction(r) && r.apply(this.element[0], [ i ].concat(s)) === !1 || i.isDefaultPrevented());
        }
    }, t.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function(e, i) {
        t.Widget.prototype["_" + e] = function(s, o, n) {
            "string" == typeof o && (o = {
                effect: o
            });
            var r, a = o ? o === !0 || "number" == typeof o ? i : o.effect || i : e;
            o = o || {}, "number" == typeof o && (o = {
                duration: o
            }), r = !t.isEmptyObject(o), o.complete = n, o.delay && s.delay(o.delay), r && t.effects && t.effects.effect[a] ? s[e](o) : a !== e && s[a] ? s[a](o.duration, o.easing, n) : s.queue(function(i) {
                t(this)[e](), n && n.call(s[0]), i();
            });
        };
    }), t.widget;
}), function(t) {
    "function" == typeof define && define.amd ? define([ "jquery", "./widget" ], t) : t(jQuery);
}(function(t) {
    var e = !1;
    return t(document).mouseup(function() {
        e = !1;
    }), t.widget("ui.mouse", {
        version: "1.11.4",
        options: {
            cancel: "input,textarea,button,select,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var e = this;
            this.element.bind("mousedown." + this.widgetName, function(t) {
                return e._mouseDown(t);
            }).bind("click." + this.widgetName, function(i) {
                return !0 === t.data(i.target, e.widgetName + ".preventClickEvent") ? (t.removeData(i.target, e.widgetName + ".preventClickEvent"), 
                i.stopImmediatePropagation(), !1) : void 0;
            }), this.started = !1;
        },
        _mouseDestroy: function() {
            this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && this.document.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
        },
        _mouseDown: function(i) {
            if (!e) {
                this._mouseMoved = !1, this._mouseStarted && this._mouseUp(i), this._mouseDownEvent = i;
                var s = this, o = 1 === i.which, n = "string" == typeof this.options.cancel && i.target.nodeName ? t(i.target).closest(this.options.cancel).length : !1;
                return o && !n && this._mouseCapture(i) ? (this.mouseDelayMet = !this.options.delay, 
                this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                    s.mouseDelayMet = !0;
                }, this.options.delay)), this._mouseDistanceMet(i) && this._mouseDelayMet(i) && (this._mouseStarted = this._mouseStart(i) !== !1, 
                !this._mouseStarted) ? (i.preventDefault(), !0) : (!0 === t.data(i.target, this.widgetName + ".preventClickEvent") && t.removeData(i.target, this.widgetName + ".preventClickEvent"), 
                this._mouseMoveDelegate = function(t) {
                    return s._mouseMove(t);
                }, this._mouseUpDelegate = function(t) {
                    return s._mouseUp(t);
                }, this.document.bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), 
                i.preventDefault(), e = !0, !0)) : !0;
            }
        },
        _mouseMove: function(e) {
            if (this._mouseMoved) {
                if (t.ui.ie && (!document.documentMode || document.documentMode < 9) && !e.button) return this._mouseUp(e);
                if (!e.which) return this._mouseUp(e);
            }
            return (e.which || e.button) && (this._mouseMoved = !0), this._mouseStarted ? (this._mouseDrag(e), 
            e.preventDefault()) : (this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, e) !== !1, 
            this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)), !this._mouseStarted);
        },
        _mouseUp: function(i) {
            return this.document.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), 
            this._mouseStarted && (this._mouseStarted = !1, i.target === this._mouseDownEvent.target && t.data(i.target, this.widgetName + ".preventClickEvent", !0), 
            this._mouseStop(i)), e = !1, !1;
        },
        _mouseDistanceMet: function(t) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - t.pageX), Math.abs(this._mouseDownEvent.pageY - t.pageY)) >= this.options.distance;
        },
        _mouseDelayMet: function() {
            return this.mouseDelayMet;
        },
        _mouseStart: function() {},
        _mouseDrag: function() {},
        _mouseStop: function() {},
        _mouseCapture: function() {
            return !0;
        }
    });
}), function(t) {
    "function" == typeof define && define.amd ? define([ "jquery", "./core", "./mouse", "./widget" ], t) : t(jQuery);
}(function(t) {
    return t.widget("ui.draggable", t.ui.mouse, {
        version: "1.11.4",
        widgetEventPrefix: "drag",
        options: {
            addClasses: !0,
            appendTo: "parent",
            axis: !1,
            connectToSortable: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            iframeFix: !1,
            opacity: !1,
            refreshPositions: !1,
            revert: !1,
            revertDuration: 500,
            scope: "default",
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: !1,
            snapMode: "both",
            snapTolerance: 20,
            stack: !1,
            zIndex: !1,
            drag: null,
            start: null,
            stop: null
        },
        _create: function() {
            "original" === this.options.helper && this._setPositionRelative(), this.options.addClasses && this.element.addClass("ui-draggable"), 
            this.options.disabled && this.element.addClass("ui-draggable-disabled"), this._setHandleClassName(), 
            this._mouseInit();
        },
        _setOption: function(t, e) {
            this._super(t, e), "handle" === t && (this._removeHandleClassName(), this._setHandleClassName());
        },
        _destroy: function() {
            return (this.helper || this.element).is(".ui-draggable-dragging") ? void (this.destroyOnClear = !0) : (this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), 
            this._removeHandleClassName(), void this._mouseDestroy());
        },
        _mouseCapture: function(e) {
            var i = this.options;
            return this._blurActiveElement(e), this.helper || i.disabled || t(e.target).closest(".ui-resizable-handle").length > 0 ? !1 : (this.handle = this._getHandle(e), 
            this.handle ? (this._blockFrames(i.iframeFix === !0 ? "iframe" : i.iframeFix), !0) : !1);
        },
        _blockFrames: function(e) {
            this.iframeBlocks = this.document.find(e).map(function() {
                var e = t(this);
                return t("<div>").css("position", "absolute").appendTo(e.parent()).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()).offset(e.offset())[0];
            });
        },
        _unblockFrames: function() {
            this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks);
        },
        _blurActiveElement: function(e) {
            var i = this.document[0];
            if (this.handleElement.is(e.target)) try {
                i.activeElement && "body" !== i.activeElement.nodeName.toLowerCase() && t(i.activeElement).blur();
            } catch (s) {}
        },
        _mouseStart: function(e) {
            var i = this.options;
            return this.helper = this._createHelper(e), this.helper.addClass("ui-draggable-dragging"), 
            this._cacheHelperProportions(), t.ui.ddmanager && (t.ui.ddmanager.current = this), 
            this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(!0), 
            this.offsetParent = this.helper.offsetParent(), this.hasFixedAncestor = this.helper.parents().filter(function() {
                return "fixed" === t(this).css("position");
            }).length > 0, this.positionAbs = this.element.offset(), this._refreshOffsets(e), 
            this.originalPosition = this.position = this._generatePosition(e, !1), this.originalPageX = e.pageX, 
            this.originalPageY = e.pageY, i.cursorAt && this._adjustOffsetFromHelper(i.cursorAt), 
            this._setContainment(), this._trigger("start", e) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), 
            t.ui.ddmanager && !i.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e), this._normalizeRightBottom(), 
            this._mouseDrag(e, !0), t.ui.ddmanager && t.ui.ddmanager.dragStart(this, e), !0);
        },
        _refreshOffsets: function(t) {
            this.offset = {
                top: this.positionAbs.top - this.margins.top,
                left: this.positionAbs.left - this.margins.left,
                scroll: !1,
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            }, this.offset.click = {
                left: t.pageX - this.offset.left,
                top: t.pageY - this.offset.top
            };
        },
        _mouseDrag: function(e, i) {
            if (this.hasFixedAncestor && (this.offset.parent = this._getParentOffset()), this.position = this._generatePosition(e, !0), 
            this.positionAbs = this._convertPositionTo("absolute"), !i) {
                var s = this._uiHash();
                if (this._trigger("drag", e, s) === !1) return this._mouseUp({}), !1;
                this.position = s.position;
            }
            return this.helper[0].style.left = this.position.left + "px", this.helper[0].style.top = this.position.top + "px", 
            t.ui.ddmanager && t.ui.ddmanager.drag(this, e), !1;
        },
        _mouseStop: function(e) {
            var i = this, s = !1;
            return t.ui.ddmanager && !this.options.dropBehaviour && (s = t.ui.ddmanager.drop(this, e)), 
            this.dropped && (s = this.dropped, this.dropped = !1), "invalid" === this.options.revert && !s || "valid" === this.options.revert && s || this.options.revert === !0 || t.isFunction(this.options.revert) && this.options.revert.call(this.element, s) ? t(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
                i._trigger("stop", e) !== !1 && i._clear();
            }) : this._trigger("stop", e) !== !1 && this._clear(), !1;
        },
        _mouseUp: function(e) {
            return this._unblockFrames(), t.ui.ddmanager && t.ui.ddmanager.dragStop(this, e), 
            this.handleElement.is(e.target) && this.element.focus(), t.ui.mouse.prototype._mouseUp.call(this, e);
        },
        cancel: function() {
            return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(), 
            this;
        },
        _getHandle: function(e) {
            return this.options.handle ? !!t(e.target).closest(this.element.find(this.options.handle)).length : !0;
        },
        _setHandleClassName: function() {
            this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element, 
            this.handleElement.addClass("ui-draggable-handle");
        },
        _removeHandleClassName: function() {
            this.handleElement.removeClass("ui-draggable-handle");
        },
        _createHelper: function(e) {
            var i = this.options, s = t.isFunction(i.helper), o = s ? t(i.helper.apply(this.element[0], [ e ])) : "clone" === i.helper ? this.element.clone().removeAttr("id") : this.element;
            return o.parents("body").length || o.appendTo("parent" === i.appendTo ? this.element[0].parentNode : i.appendTo), 
            s && o[0] === this.element[0] && this._setPositionRelative(), o[0] === this.element[0] || /(fixed|absolute)/.test(o.css("position")) || o.css("position", "absolute"), 
            o;
        },
        _setPositionRelative: function() {
            /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative");
        },
        _adjustOffsetFromHelper: function(e) {
            "string" == typeof e && (e = e.split(" ")), t.isArray(e) && (e = {
                left: +e[0],
                top: +e[1] || 0
            }), "left" in e && (this.offset.click.left = e.left + this.margins.left), "right" in e && (this.offset.click.left = this.helperProportions.width - e.right + this.margins.left), 
            "top" in e && (this.offset.click.top = e.top + this.margins.top), "bottom" in e && (this.offset.click.top = this.helperProportions.height - e.bottom + this.margins.top);
        },
        _isRootNode: function(t) {
            return /(html|body)/i.test(t.tagName) || t === this.document[0];
        },
        _getParentOffset: function() {
            var e = this.offsetParent.offset(), i = this.document[0];
            return "absolute" === this.cssPosition && this.scrollParent[0] !== i && t.contains(this.scrollParent[0], this.offsetParent[0]) && (e.left += this.scrollParent.scrollLeft(), 
            e.top += this.scrollParent.scrollTop()), this._isRootNode(this.offsetParent[0]) && (e = {
                top: 0,
                left: 0
            }), {
                top: e.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: e.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            };
        },
        _getRelativeOffset: function() {
            if ("relative" !== this.cssPosition) return {
                top: 0,
                left: 0
            };
            var t = this.element.position(), e = this._isRootNode(this.scrollParent[0]);
            return {
                top: t.top - (parseInt(this.helper.css("top"), 10) || 0) + (e ? 0 : this.scrollParent.scrollTop()),
                left: t.left - (parseInt(this.helper.css("left"), 10) || 0) + (e ? 0 : this.scrollParent.scrollLeft())
            };
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0,
                right: parseInt(this.element.css("marginRight"), 10) || 0,
                bottom: parseInt(this.element.css("marginBottom"), 10) || 0
            };
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            };
        },
        _setContainment: function() {
            var e, i, s, o = this.options, n = this.document[0];
            return this.relativeContainer = null, o.containment ? "window" === o.containment ? void (this.containment = [ t(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, t(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, t(window).scrollLeft() + t(window).width() - this.helperProportions.width - this.margins.left, t(window).scrollTop() + (t(window).height() || n.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top ]) : "document" === o.containment ? void (this.containment = [ 0, 0, t(n).width() - this.helperProportions.width - this.margins.left, (t(n).height() || n.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top ]) : o.containment.constructor === Array ? void (this.containment = o.containment) : ("parent" === o.containment && (o.containment = this.helper[0].parentNode), 
            i = t(o.containment), s = i[0], void (s && (e = /(scroll|auto)/.test(i.css("overflow")), 
            this.containment = [ (parseInt(i.css("borderLeftWidth"), 10) || 0) + (parseInt(i.css("paddingLeft"), 10) || 0), (parseInt(i.css("borderTopWidth"), 10) || 0) + (parseInt(i.css("paddingTop"), 10) || 0), (e ? Math.max(s.scrollWidth, s.offsetWidth) : s.offsetWidth) - (parseInt(i.css("borderRightWidth"), 10) || 0) - (parseInt(i.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (e ? Math.max(s.scrollHeight, s.offsetHeight) : s.offsetHeight) - (parseInt(i.css("borderBottomWidth"), 10) || 0) - (parseInt(i.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom ], 
            this.relativeContainer = i))) : void (this.containment = null);
        },
        _convertPositionTo: function(t, e) {
            e || (e = this.position);
            var i = "absolute" === t ? 1 : -1, s = this._isRootNode(this.scrollParent[0]);
            return {
                top: e.top + this.offset.relative.top * i + this.offset.parent.top * i - ("fixed" === this.cssPosition ? -this.offset.scroll.top : s ? 0 : this.offset.scroll.top) * i,
                left: e.left + this.offset.relative.left * i + this.offset.parent.left * i - ("fixed" === this.cssPosition ? -this.offset.scroll.left : s ? 0 : this.offset.scroll.left) * i
            };
        },
        _generatePosition: function(t, e) {
            var i, s, o, n, r = this.options, a = this._isRootNode(this.scrollParent[0]), l = t.pageX, h = t.pageY;
            return a && this.offset.scroll || (this.offset.scroll = {
                top: this.scrollParent.scrollTop(),
                left: this.scrollParent.scrollLeft()
            }), e && (this.containment && (this.relativeContainer ? (s = this.relativeContainer.offset(), 
            i = [ this.containment[0] + s.left, this.containment[1] + s.top, this.containment[2] + s.left, this.containment[3] + s.top ]) : i = this.containment, 
            t.pageX - this.offset.click.left < i[0] && (l = i[0] + this.offset.click.left), 
            t.pageY - this.offset.click.top < i[1] && (h = i[1] + this.offset.click.top), t.pageX - this.offset.click.left > i[2] && (l = i[2] + this.offset.click.left), 
            t.pageY - this.offset.click.top > i[3] && (h = i[3] + this.offset.click.top)), r.grid && (o = r.grid[1] ? this.originalPageY + Math.round((h - this.originalPageY) / r.grid[1]) * r.grid[1] : this.originalPageY, 
            h = i ? o - this.offset.click.top >= i[1] || o - this.offset.click.top > i[3] ? o : o - this.offset.click.top >= i[1] ? o - r.grid[1] : o + r.grid[1] : o, 
            n = r.grid[0] ? this.originalPageX + Math.round((l - this.originalPageX) / r.grid[0]) * r.grid[0] : this.originalPageX, 
            l = i ? n - this.offset.click.left >= i[0] || n - this.offset.click.left > i[2] ? n : n - this.offset.click.left >= i[0] ? n - r.grid[0] : n + r.grid[0] : n), 
            "y" === r.axis && (l = this.originalPageX), "x" === r.axis && (h = this.originalPageY)), 
            {
                top: h - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.offset.scroll.top : a ? 0 : this.offset.scroll.top),
                left: l - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.offset.scroll.left : a ? 0 : this.offset.scroll.left)
            };
        },
        _clear: function() {
            this.helper.removeClass("ui-draggable-dragging"), this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(), 
            this.helper = null, this.cancelHelperRemoval = !1, this.destroyOnClear && this.destroy();
        },
        _normalizeRightBottom: function() {
            "y" !== this.options.axis && "auto" !== this.helper.css("right") && (this.helper.width(this.helper.width()), 
            this.helper.css("right", "auto")), "x" !== this.options.axis && "auto" !== this.helper.css("bottom") && (this.helper.height(this.helper.height()), 
            this.helper.css("bottom", "auto"));
        },
        _trigger: function(e, i, s) {
            return s = s || this._uiHash(), t.ui.plugin.call(this, e, [ i, s, this ], !0), /^(drag|start|stop)/.test(e) && (this.positionAbs = this._convertPositionTo("absolute"), 
            s.offset = this.positionAbs), t.Widget.prototype._trigger.call(this, e, i, s);
        },
        plugins: {},
        _uiHash: function() {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            };
        }
    }), t.ui.plugin.add("draggable", "connectToSortable", {
        start: function(e, i, s) {
            var o = t.extend({}, i, {
                item: s.element
            });
            s.sortables = [], t(s.options.connectToSortable).each(function() {
                var i = t(this).sortable("instance");
                i && !i.options.disabled && (s.sortables.push(i), i.refreshPositions(), i._trigger("activate", e, o));
            });
        },
        stop: function(e, i, s) {
            var o = t.extend({}, i, {
                item: s.element
            });
            s.cancelHelperRemoval = !1, t.each(s.sortables, function() {
                var t = this;
                t.isOver ? (t.isOver = 0, s.cancelHelperRemoval = !0, t.cancelHelperRemoval = !1, 
                t._storedCSS = {
                    position: t.placeholder.css("position"),
                    top: t.placeholder.css("top"),
                    left: t.placeholder.css("left")
                }, t._mouseStop(e), t.options.helper = t.options._helper) : (t.cancelHelperRemoval = !0, 
                t._trigger("deactivate", e, o));
            });
        },
        drag: function(e, i, s) {
            t.each(s.sortables, function() {
                var o = !1, n = this;
                n.positionAbs = s.positionAbs, n.helperProportions = s.helperProportions, n.offset.click = s.offset.click, 
                n._intersectsWith(n.containerCache) && (o = !0, t.each(s.sortables, function() {
                    return this.positionAbs = s.positionAbs, this.helperProportions = s.helperProportions, 
                    this.offset.click = s.offset.click, this !== n && this._intersectsWith(this.containerCache) && t.contains(n.element[0], this.element[0]) && (o = !1), 
                    o;
                })), o ? (n.isOver || (n.isOver = 1, s._parent = i.helper.parent(), n.currentItem = i.helper.appendTo(n.element).data("ui-sortable-item", !0), 
                n.options._helper = n.options.helper, n.options.helper = function() {
                    return i.helper[0];
                }, e.target = n.currentItem[0], n._mouseCapture(e, !0), n._mouseStart(e, !0, !0), 
                n.offset.click.top = s.offset.click.top, n.offset.click.left = s.offset.click.left, 
                n.offset.parent.left -= s.offset.parent.left - n.offset.parent.left, n.offset.parent.top -= s.offset.parent.top - n.offset.parent.top, 
                s._trigger("toSortable", e), s.dropped = n.element, t.each(s.sortables, function() {
                    this.refreshPositions();
                }), s.currentItem = s.element, n.fromOutside = s), n.currentItem && (n._mouseDrag(e), 
                i.position = n.position)) : n.isOver && (n.isOver = 0, n.cancelHelperRemoval = !0, 
                n.options._revert = n.options.revert, n.options.revert = !1, n._trigger("out", e, n._uiHash(n)), 
                n._mouseStop(e, !0), n.options.revert = n.options._revert, n.options.helper = n.options._helper, 
                n.placeholder && n.placeholder.remove(), i.helper.appendTo(s._parent), s._refreshOffsets(e), 
                i.position = s._generatePosition(e, !0), s._trigger("fromSortable", e), s.dropped = !1, 
                t.each(s.sortables, function() {
                    this.refreshPositions();
                }));
            });
        }
    }), t.ui.plugin.add("draggable", "cursor", {
        start: function(e, i, s) {
            var o = t("body"), n = s.options;
            o.css("cursor") && (n._cursor = o.css("cursor")), o.css("cursor", n.cursor);
        },
        stop: function(e, i, s) {
            var o = s.options;
            o._cursor && t("body").css("cursor", o._cursor);
        }
    }), t.ui.plugin.add("draggable", "opacity", {
        start: function(e, i, s) {
            var o = t(i.helper), n = s.options;
            o.css("opacity") && (n._opacity = o.css("opacity")), o.css("opacity", n.opacity);
        },
        stop: function(e, i, s) {
            var o = s.options;
            o._opacity && t(i.helper).css("opacity", o._opacity);
        }
    }), t.ui.plugin.add("draggable", "scroll", {
        start: function(t, e, i) {
            i.scrollParentNotHidden || (i.scrollParentNotHidden = i.helper.scrollParent(!1)), 
            i.scrollParentNotHidden[0] !== i.document[0] && "HTML" !== i.scrollParentNotHidden[0].tagName && (i.overflowOffset = i.scrollParentNotHidden.offset());
        },
        drag: function(e, i, s) {
            var o = s.options, n = !1, r = s.scrollParentNotHidden[0], a = s.document[0];
            r !== a && "HTML" !== r.tagName ? (o.axis && "x" === o.axis || (s.overflowOffset.top + r.offsetHeight - e.pageY < o.scrollSensitivity ? r.scrollTop = n = r.scrollTop + o.scrollSpeed : e.pageY - s.overflowOffset.top < o.scrollSensitivity && (r.scrollTop = n = r.scrollTop - o.scrollSpeed)), 
            o.axis && "y" === o.axis || (s.overflowOffset.left + r.offsetWidth - e.pageX < o.scrollSensitivity ? r.scrollLeft = n = r.scrollLeft + o.scrollSpeed : e.pageX - s.overflowOffset.left < o.scrollSensitivity && (r.scrollLeft = n = r.scrollLeft - o.scrollSpeed))) : (o.axis && "x" === o.axis || (e.pageY - t(a).scrollTop() < o.scrollSensitivity ? n = t(a).scrollTop(t(a).scrollTop() - o.scrollSpeed) : t(window).height() - (e.pageY - t(a).scrollTop()) < o.scrollSensitivity && (n = t(a).scrollTop(t(a).scrollTop() + o.scrollSpeed))), 
            o.axis && "y" === o.axis || (e.pageX - t(a).scrollLeft() < o.scrollSensitivity ? n = t(a).scrollLeft(t(a).scrollLeft() - o.scrollSpeed) : t(window).width() - (e.pageX - t(a).scrollLeft()) < o.scrollSensitivity && (n = t(a).scrollLeft(t(a).scrollLeft() + o.scrollSpeed)))), 
            n !== !1 && t.ui.ddmanager && !o.dropBehaviour && t.ui.ddmanager.prepareOffsets(s, e);
        }
    }), t.ui.plugin.add("draggable", "snap", {
        start: function(e, i, s) {
            var o = s.options;
            s.snapElements = [], t(o.snap.constructor !== String ? o.snap.items || ":data(ui-draggable)" : o.snap).each(function() {
                var e = t(this), i = e.offset();
                this !== s.element[0] && s.snapElements.push({
                    item: this,
                    width: e.outerWidth(),
                    height: e.outerHeight(),
                    top: i.top,
                    left: i.left
                });
            });
        },
        drag: function(e, i, s) {
            var o, n, r, a, l, h, c, p, u, f, d = s.options, g = d.snapTolerance, m = i.offset.left, v = m + s.helperProportions.width, _ = i.offset.top, b = _ + s.helperProportions.height;
            for (u = s.snapElements.length - 1; u >= 0; u--) l = s.snapElements[u].left - s.margins.left, 
            h = l + s.snapElements[u].width, c = s.snapElements[u].top - s.margins.top, p = c + s.snapElements[u].height, 
            l - g > v || m > h + g || c - g > b || _ > p + g || !t.contains(s.snapElements[u].item.ownerDocument, s.snapElements[u].item) ? (s.snapElements[u].snapping && s.options.snap.release && s.options.snap.release.call(s.element, e, t.extend(s._uiHash(), {
                snapItem: s.snapElements[u].item
            })), s.snapElements[u].snapping = !1) : ("inner" !== d.snapMode && (o = Math.abs(c - b) <= g, 
            n = Math.abs(p - _) <= g, r = Math.abs(l - v) <= g, a = Math.abs(h - m) <= g, o && (i.position.top = s._convertPositionTo("relative", {
                top: c - s.helperProportions.height,
                left: 0
            }).top), n && (i.position.top = s._convertPositionTo("relative", {
                top: p,
                left: 0
            }).top), r && (i.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: l - s.helperProportions.width
            }).left), a && (i.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: h
            }).left)), f = o || n || r || a, "outer" !== d.snapMode && (o = Math.abs(c - _) <= g, 
            n = Math.abs(p - b) <= g, r = Math.abs(l - m) <= g, a = Math.abs(h - v) <= g, o && (i.position.top = s._convertPositionTo("relative", {
                top: c,
                left: 0
            }).top), n && (i.position.top = s._convertPositionTo("relative", {
                top: p - s.helperProportions.height,
                left: 0
            }).top), r && (i.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: l
            }).left), a && (i.position.left = s._convertPositionTo("relative", {
                top: 0,
                left: h - s.helperProportions.width
            }).left)), !s.snapElements[u].snapping && (o || n || r || a || f) && s.options.snap.snap && s.options.snap.snap.call(s.element, e, t.extend(s._uiHash(), {
                snapItem: s.snapElements[u].item
            })), s.snapElements[u].snapping = o || n || r || a || f);
        }
    }), t.ui.plugin.add("draggable", "stack", {
        start: function(e, i, s) {
            var o, n = s.options, r = t.makeArray(t(n.stack)).sort(function(e, i) {
                return (parseInt(t(e).css("zIndex"), 10) || 0) - (parseInt(t(i).css("zIndex"), 10) || 0);
            });
            r.length && (o = parseInt(t(r[0]).css("zIndex"), 10) || 0, t(r).each(function(e) {
                t(this).css("zIndex", o + e);
            }), this.css("zIndex", o + r.length));
        }
    }), t.ui.plugin.add("draggable", "zIndex", {
        start: function(e, i, s) {
            var o = t(i.helper), n = s.options;
            o.css("zIndex") && (n._zIndex = o.css("zIndex")), o.css("zIndex", n.zIndex);
        },
        stop: function(e, i, s) {
            var o = s.options;
            o._zIndex && t(i.helper).css("zIndex", o._zIndex);
        }
    }), t.ui.draggable;
});

var $ = jQuery;

function replace(data, find, replace) {
    var re = new RegExp(find, "g");
    return data.replace(re, replace);
}

function updateIds(field, id1, id2) {
    field.attr("id", "field-" + id2);
    field.find("*[data-field=" + id1 + "]").attr("data-field", id2);
    field.find(".options-" + id1).removeClass("options-" + id1).addClass("options-" + id2);
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
    handle: ".field-number",
    start: function(event, ui) {
        $(".minify").each(function() {
            $(this).click();
        });
    },
    drag: function(event, ui) {
        var top = $(this).offset().top - $("#fld").offset().top;
        var height = $(this).height();
        var nbField = Math.min(Math.max(Math.ceil((top - 50) / height), 1), $(".ef-field").length);
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
        var top = $(this).offset().top - $("#fld").offset().top;
        var height = $(this).height();
        var nbField = Math.min(Math.max(Math.ceil((top - 50) / height), 1), $(".ef-field").length);
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

function EF_Form_Actions(empty_inputs) {
    var $ = jQuery;
    var $this = this;
    var utilities = {};
    var templates = {};
    var fieldIncrement = 0;
    var inputs = [ "text", "email", "password", "number", "tel", "date", "checkbox", "radio", "url", "range", "color", "search", "hidden", "textarea", "wp_editor" ];
    $this.initReset = initReset;
    $this.getUtilities = getUtilities;
    $this.getOption = getOption;
    $this.loadFields = loadFields;
    $this.getField = getField;
    $this.getInput = getInput;
    $this.getNumberOfFields = getNumberOfFields;
    $this.getFieldTemplate = getFieldTemplate;
    $this.addDataToField = addDataToField;
    function getOption(field) {
        var dfd = new $.Deferred();
        $this.getField("options").done(function(optionTemplate) {
            optionTemplate = replace(optionTemplate, "fieldSubId", field.nbOptions);
            optionTemplate = replace(optionTemplate, "fieldId", field.id);
            optionTemplate = replace(optionTemplate, "OptionName", field.option.content);
            optionTemplate = replace(optionTemplate, "OptionValue", field.option.value);
            optionTemplate = replace(optionTemplate, "OptionSelected", field.option.select === true ? "selected" : "");
            dfd.resolve(optionTemplate);
        });
        return dfd.promise();
    }
    function loadFields(fields) {
        if (fields) {
            $this.fields = fields;
        }
        var _fields = jQuery.extend({}, $this.fields);
        delete _fields.submit;
        var keys = Object.keys(_fields);
        if (getNumberOfFields() < keys.length) {
            getField($this.fields[keys[getNumberOfFields()]]);
        } else $("#spinner-fields").hide();
    }
    function getField(field, expand) {
        var dfd = new $.Deferred();
        _getFieldTemplate(field).done(function(data) {
            $("#fld").append(data);
            $("#field-" + field.id).draggable(DraggableArgs);
            _handleHiddenFields(field.id, field.type);
            addDataToField(field);
            if (expand === true) $('a[data-field="' + field.id + '"].open').click();
            loadFields();
            dfd.resolve(data);
        });
        return dfd.promise();
    }
    function addDataToField(field) {
        if (field.attributes) {
            $.each(field.attributes, function(key, value) {
                if (input = document.getElementById("field[" + field.id + "][attributes][" + key + "]")) {
                    if (input.type == "checkbox" || input.type == "radio") {
                        input.checked = value;
                    } else {
                        input.value = value;
                    }
                }
            });
        }
        if (field.settings) {
            $.each(field.settings, function(key, value) {
                if (input = document.getElementById("field[" + field.id + "][settings][" + key + "]")) {
                    if (input.type == "checkbox" || input.type == "radio") {
                        input.checked = value;
                    } else {
                        input.value = value;
                    }
                }
            });
        }
    }
    function getFieldTemplate(template) {
        var dfd = new $.Deferred();
        if (templates[template] && templates[template] != undefined && templates[template] != "") {
            dfd.resolve(templates[template]);
        } else {
            $.get(ajaxUrl, {
                element: "inputs",
                template: template,
                action: "EF/load_template"
            }).always(function(data) {
                templates[template] = data;
                dfd.resolve(data);
            });
        }
        return dfd.promise();
    }
    function init() {
        return $this;
    }
    function initReset(val) {
        $("#link-password-email").hide();
        $("#reset-password-email").hide();
        $("#" + val).show();
    }
    function getUtilities(val) {
        var q = $.Deferred();
        $("#spinner-utility").show();
        _getUtilityTemplate(val).done(function(data) {
            $(".utilities").html(data);
            $("#spinner-utility").hide();
            q.resolve();
        });
        return q.promise();
    }
    function _getUtilityTemplate(val) {
        var dfd = new $.Deferred();
        if (utilities[val] && utilities[val] != undefined && utilities[val] != "") {
            dfd.resolve(utilities[val]);
        } else {
            $.get(ajaxUrl, {
                element: "actions",
                template: val,
                action: "EF/load_template"
            }, function(data) {}).always(function(data) {
                utilities[val] = data.data;
                dfd.resolve(data.data);
            });
        }
        return dfd.promise();
    }
    function _getFieldTemplate(field) {
        var dfd = new $.Deferred();
        getFieldTemplate("base").done(function(base) {
            getFieldTemplate(field.attributes.type).done(function(data) {
                data = replace(base.data, "input-content", data.data);
                data = replace(data, "fieldId", field.id);
                dfd.resolve(data);
            });
        });
        return dfd.promise();
    }
    function _handleHiddenFields(id, type) {
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
    function getInput(args) {
        var input = empty_inputs[args.type];
        input.attributes.name = args.name;
        input.id = args.id;
        return input;
    }
    function getNumberOfFields() {
        return $(".ef-field").length;
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
        $body.on("click", ".move", _move);
        $body.on("click", ".minify", _minify);
        $body.on("click", ".delete", _delete);
        $body.on("click", ".open", _open);
        $body.on("click", ".up", _up);
        $body.on("click", ".down", _down);
        $body.on("click", ".removeoption", _removeOption);
        $body.on("click", ".dupliquer", _duplicate);
        $body.on("click", 'button[data-action="add"]', _add);
        $body.on("click", 'button[data-action="add-option"]', _addOption);
        $body.on("change", 'select[name$="attributes[type]"]', _changeFieldType);
        $body.on("change", 'select[name$="[form-taxonomy]"]', _changeTaxonomy);
        $body.on("change", 'select[name="form-reset-action"]', _changeResetAction);
        $body.on("change", 'select[name="settings[type]"]', _changeUtility);
        $body.on("click", ".panel header", _togglePanel);
    }
    function _togglePanel() {
        var panel = $(this).parent(".panel");
        panel.toggleClass("panel--open");
    }
    function _changeUtility() {
        var val = $(this).val();
        EF_form_actions.getUtilities(val);
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
    function _addOption(event) {
        $("#spinner-fields").show();
        var id = parseInt($(this).attr("data-field"));
        var nbOptions = $("#field-" + id + " .option-select").length;
        var $_this = $(this);
        EF_form_actions.getOption({
            id: id,
            nbOptions: nbOptions,
            option: {
                content: "",
                select: true,
                value: ""
            }
        }).done(function(option) {
            $_this.before(option);
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
        if (id != EF_form_actions.getNumberOfFields()) switchIds(id, id + 1);
        return false;
    }
    function _duplicate() {
        var id = parseInt($(this).attr("data-field"));
        var the_field = $("#field-" + id);
        var nb_field = EF_form_actions.getNumberOfFields();
        var clonedField = the_field.clone();
        $('div[id="field-' + nb_field + '"]').after(clonedField);
        updateIds(clonedField, id, nb_field + 1);
        var val = $('select[name="field[' + id + '][attributes][type]"]').val();
        $('select[name="field[' + (nb_field + 1) + '][attributes][type]"]').val(val);
        clonedField.draggable(DraggableArgs);
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
    function _changeFieldType() {
        $("#spinner-fields").show();
        var type = $(this).val();
        var id = $(this).attr("data-field");
        var name = $('body input[name="field[' + id + '][form-name]"]').val();
        var input = EF_form_actions.getInput({
            type: type,
            id: id,
            name: name
        });
        EF_form_actions.getFieldTemplate(type).done(function(data) {
            if (!data.data) {
                $("#spinner-fields").hide();
                return;
            }
            data = replace(data.data, "fieldId", id);
            $("#options-" + id).replaceWith(data);
            EF_form_actions.addDataToField(input);
            $("#spinner-fields").hide();
            $('a[data-field="' + id + '"].minify').removeClass("minify").addClass("open");
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
        var input = EF_form_actions.getInput({
            type: "text",
            id: EF_form_actions.getNumberOfFields() + 1,
            name: ""
        });
        EF_form_actions.getField(input, true).done(function() {
            $("#spinner-fields").hide();
        });
    }
    function _delete() {
        var id = parseInt($(this).attr("data-field"));
        var nb_field = EF_form_actions.getNumberOfFields();
        if (1 === id && 1 === nb_field) return false;
        $("#field-" + id).remove();
        for (var j = id + 1; j <= nb_field; j++) updateIds($("#field-" + j), j, j - 1);
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

function EF_Add(form) {
    var $this = this;
    var $ = jQuery;
    function init() {
        _loadUtilities();
        _loadInputs();
        var field = form.inputs.submit;
        field.id = "submit";
        EF_form_actions.addDataToField(field);
        return $this;
    }
    function _loadUtilities() {
        $("#title").val(form.title);
        EF_form_actions.getUtilities(form.settings.type).then(function() {
            _setSettings();
            _setAttributes();
        });
    }
    function _loadInputs() {
        i = 0;
        $.each(form.inputs, function(key) {
            form.inputs[key].id = i + 1;
            i++;
        });
        EF_form_actions.loadFields(form.inputs);
    }
    function _setSettings() {
        if (!form.settings) return;
        $.each(form.settings, function(key, val) {
            if (input = document.getElementById("settings[" + key + "]")) {
                input.value = val;
            }
        });
    }
    function _setAttributes() {
        if (!form.attributes) return;
        $.each(form.attributes, function(key, val) {
            if (input = document.getElementById("attributes[" + key + "]")) {
                input.value = val;
            }
        });
    }
    return init();
}

var EF_form_actions = new EF_Form_Actions(inputs_empty);

var EF_events = new EF_Event();