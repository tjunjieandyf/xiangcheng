/*!
 * imagesLoaded PACKAGED v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function() {
    function e() {}
    function t(e, t) {
        for (var n = e.length; n--;) if (e[n].listener === t) return n;
        return - 1
    }
    function n(e) {
        return function() {
            return this[e].apply(this, arguments)
        }
    }
    var i = e.prototype,
    r = this,
    o = r.EventEmitter;
    i.getListeners = function(e) {
        var t, n, i = this._getEvents();
        if ("object" == typeof e) {
            t = {};
            for (n in i) i.hasOwnProperty(n) && e.test(n) && (t[n] = i[n])
        } else t = i[e] || (i[e] = []);
        return t
    },
    i.flattenListeners = function(e) {
        var t, n = [];
        for (t = 0; e.length > t; t += 1) n.push(e[t].listener);
        return n
    },
    i.getListenersAsObject = function(e) {
        var t, n = this.getListeners(e);
        return n instanceof Array && (t = {},
        t[e] = n),
        t || n
    },
    i.addListener = function(e, n) {
        var i, r = this.getListenersAsObject(e),
        o = "object" == typeof n;
        for (i in r) r.hasOwnProperty(i) && -1 === t(r[i], n) && r[i].push(o ? n: {
            listener: n,
            once: !1
        });
        return this
    },
    i.on = n("addListener"),
    i.addOnceListener = function(e, t) {
        return this.addListener(e, {
            listener: t,
            once: !0
        })
    },
    i.once = n("addOnceListener"),
    i.defineEvent = function(e) {
        return this.getListeners(e),
        this
    },
    i.defineEvents = function(e) {
        for (var t = 0; e.length > t; t += 1) this.defineEvent(e[t]);
        return this
    },
    i.removeListener = function(e, n) {
        var i, r, o = this.getListenersAsObject(e);
        for (r in o) o.hasOwnProperty(r) && (i = t(o[r], n), -1 !== i && o[r].splice(i, 1));
        return this
    },
    i.off = n("removeListener"),
    i.addListeners = function(e, t) {
        return this.manipulateListeners(!1, e, t)
    },
    i.removeListeners = function(e, t) {
        return this.manipulateListeners(!0, e, t)
    },
    i.manipulateListeners = function(e, t, n) {
        var i, r, o = e ? this.removeListener: this.addListener,
        s = e ? this.removeListeners: this.addListeners;
        if ("object" != typeof t || t instanceof RegExp) for (i = n.length; i--;) o.call(this, t, n[i]);
        else for (i in t) t.hasOwnProperty(i) && (r = t[i]) && ("function" == typeof r ? o.call(this, i, r) : s.call(this, i, r));
        return this
    },
    i.removeEvent = function(e) {
        var t, n = typeof e,
        i = this._getEvents();
        if ("string" === n) delete i[e];
        else if ("object" === n) for (t in i) i.hasOwnProperty(t) && e.test(t) && delete i[t];
        else delete this._events;
        return this
    },
    i.removeAllListeners = n("removeEvent"),
    i.emitEvent = function(e, t) {
        var n, i, r, o, s = this.getListenersAsObject(e);
        for (r in s) if (s.hasOwnProperty(r)) for (i = s[r].length; i--;) n = s[r][i],
        n.once === !0 && this.removeListener(e, n.listener),
        o = n.listener.apply(this, t || []),
        o === this._getOnceReturnValue() && this.removeListener(e, n.listener);
        return this
    },
    i.trigger = n("emitEvent"),
    i.emit = function(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(e, t)
    },
    i.setOnceReturnValue = function(e) {
        return this._onceReturnValue = e,
        this
    },
    i._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue: !0
    },
    i._getEvents = function() {
        return this._events || (this._events = {})
    },
    e.noConflict = function() {
        return r.EventEmitter = o,
        e
    },
    "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [],
    function() {
        return e
    }) : "object" == typeof module && module.exports ? module.exports = e: this.EventEmitter = e
}).call(this),
function(e) {
    function t(t) {
        var n = e.event;
        return n.target = n.target || n.srcElement || t,
        n
    }
    var n = document.documentElement,
    i = function() {};
    n.addEventListener ? i = function(e, t, n) {
        e.addEventListener(t, n, !1)
    }: n.attachEvent && (i = function(e, n, i) {
        e[n + i] = i.handleEvent ?
        function() {
            var n = t(e);
            i.handleEvent.call(i, n)
        }: function() {
            var n = t(e);
            i.call(e, n)
        },
        e.attachEvent("on" + n, e[n + i])
    });
    var r = function() {};
    n.removeEventListener ? r = function(e, t, n) {
        e.removeEventListener(t, n, !1)
    }: n.detachEvent && (r = function(e, t, n) {
        e.detachEvent("on" + t, e[t + n]);
        try {
            delete e[t + n]
        } catch(i) {
            e[t + n] = void 0
        }
    });
    var o = {
        bind: i,
        unbind: r
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", o) : e.eventie = o
} (this),
function(e, t) {
    "function" == typeof define && define.amd ? define(["eventEmitter/EventEmitter", "eventie/eventie"],
    function(n, i) {
        return t(e, n, i)
    }) : "object" == typeof exports ? module.exports = t(e, require("wolfy87-eventemitter"), require("eventie")) : e.imagesLoaded = t(e, e.EventEmitter, e.eventie)
} (window,
function(e, t, n) {
    function i(e, t) {
        for (var n in t) e[n] = t[n];
        return e
    }
    function r(e) {
        return "[object Array]" === d.call(e)
    }
    function o(e) {
        var t = [];
        if (r(e)) t = e;
        else if ("number" == typeof e.length) for (var n = 0,
        i = e.length; i > n; n++) t.push(e[n]);
        else t.push(e);
        return t
    }
    function s(e, t, n) {
        if (! (this instanceof s)) return new s(e, t);
        "string" == typeof e && (e = document.querySelectorAll(e)),
        this.elements = o(e),
        this.options = i({},
        this.options),
        "function" == typeof t ? n = t: i(this.options, t),
        n && this.on("always", n),
        this.getImages(),
        a && (this.jqDeferred = new a.Deferred);
        var r = this;
        setTimeout(function() {
            r.check()
        })
    }
    function f(e) {
        this.img = e
    }
    function c(e) {
        this.src = e,
        v[e] = this
    }
    var a = e.jQuery,
    u = e.console,
    h = u !== void 0,
    d = Object.prototype.toString;
    s.prototype = new t,
    s.prototype.options = {},
    s.prototype.getImages = function() {
        this.images = [];
        for (var e = 0,
        t = this.elements.length; t > e; e++) {
            var n = this.elements[e];
            "IMG" === n.nodeName && this.addImage(n);
            var i = n.nodeType;
            if (i && (1 === i || 9 === i || 11 === i)) for (var r = n.querySelectorAll("img"), o = 0, s = r.length; s > o; o++) {
                var f = r[o];
                this.addImage(f)
            }
        }
    },
    s.prototype.addImage = function(e) {
        var t = new f(e);
        this.images.push(t)
    },
    s.prototype.check = function() {
        function e(e, r) {
            return t.options.debug && h && u.log("confirm", e, r),
            t.progress(e),
            n++,
            n === i && t.complete(),
            !0
        }
        var t = this,
        n = 0,
        i = this.images.length;
        if (this.hasAnyBroken = !1, !i) return this.complete(),
        void 0;
        for (var r = 0; i > r; r++) {
            var o = this.images[r];
            o.on("confirm", e),
            o.check()
        }
    },
    s.prototype.progress = function(e) {
        this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded;
        var t = this;
        setTimeout(function() {
            t.emit("progress", t, e),
            t.jqDeferred && t.jqDeferred.notify && t.jqDeferred.notify(t, e)
        })
    },
    s.prototype.complete = function() {
        var e = this.hasAnyBroken ? "fail": "done";
        this.isComplete = !0;
        var t = this;
        setTimeout(function() {
            if (t.emit(e, t), t.emit("always", t), t.jqDeferred) {
                var n = t.hasAnyBroken ? "reject": "resolve";
                t.jqDeferred[n](t)
            }
        })
    },
    a && (a.fn.imagesLoaded = function(e, t) {
        var n = new s(this, e, t);
        return n.jqDeferred.promise(a(this))
    }),
    f.prototype = new t,
    f.prototype.check = function() {
        var e = v[this.img.src] || new c(this.img.src);
        if (e.isConfirmed) return this.confirm(e.isLoaded, "cached was confirmed"),
        void 0;
        if (this.img.complete && void 0 !== this.img.naturalWidth) return this.confirm(0 !== this.img.naturalWidth, "naturalWidth"),
        void 0;
        var t = this;
        e.on("confirm",
        function(e, n) {
            return t.confirm(e.isLoaded, n),
            !0
        }),
        e.check()
    },
    f.prototype.confirm = function(e, t) {
        this.isLoaded = e,
        this.emit("confirm", this, t)
    };
    var v = {};
    return c.prototype = new t,
    c.prototype.check = function() {
        if (!this.isChecked) {
            var e = new Image;
            n.bind(e, "load", this),
            n.bind(e, "error", this),
            e.src = this.src,
            this.isChecked = !0
        }
    },
    c.prototype.handleEvent = function(e) {
        var t = "on" + e.type;
        this[t] && this[t](e)
    },
    c.prototype.onload = function(e) {
        this.confirm(!0, "onload"),
        this.unbindProxyEvents(e)
    },
    c.prototype.onerror = function(e) {
        this.confirm(!1, "onerror"),
        this.unbindProxyEvents(e)
    },
    c.prototype.confirm = function(e, t) {
        this.isConfirmed = !0,
        this.isLoaded = e,
        this.emit("confirm", this, t)
    },
    c.prototype.unbindProxyEvents = function(e) {
        n.unbind(e.target, "load", this),
        n.unbind(e.target, "error", this)
    },
    s
});

/*!
 * Masonry PACKAGED v3.3.2
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

!
function(a) {
    function b() {}
    function c(a) {
        function c(b) {
            b.prototype.option || (b.prototype.option = function(b) {
                a.isPlainObject(b) && (this.options = a.extend(!0, this.options, b))
            })
        }
        function e(b, c) {
            a.fn[b] = function(e) {
                if ("string" == typeof e) {
                    for (var g = d.call(arguments, 1), h = 0, i = this.length; i > h; h++) {
                        var j = this[h],
                        k = a.data(j, b);
                        if (k) if (a.isFunction(k[e]) && "_" !== e.charAt(0)) {
                            var l = k[e].apply(k, g);
                            if (void 0 !== l) return l
                        } else f("no such method '" + e + "' for " + b + " instance");
                        else f("cannot call methods on " + b + " prior to initialization; attempted to call '" + e + "'")
                    }
                    return this
                }
                return this.each(function() {
                    var d = a.data(this, b);
                    d ? (d.option(e), d._init()) : (d = new c(this, e), a.data(this, b, d))
                })
            }
        }
        if (a) {
            var f = "undefined" == typeof console ? b: function(a) {
                console.error(a)
            };
            return a.bridget = function(a, b) {
                c(b),
                e(a, b)
            },
            a.bridget
        }
    }
    var d = Array.prototype.slice;
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", ["jquery"], c) : c("object" == typeof exports ? require("jquery") : a.jQuery)
} (window),
function(a) {
    function b(b) {
        var c = a.event;
        return c.target = c.target || c.srcElement || b,
        c
    }
    var c = document.documentElement,
    d = function() {};
    c.addEventListener ? d = function(a, b, c) {
        a.addEventListener(b, c, !1)
    }: c.attachEvent && (d = function(a, c, d) {
        a[c + d] = d.handleEvent ?
        function() {
            var c = b(a);
            d.handleEvent.call(d, c)
        }: function() {
            var c = b(a);
            d.call(a, c)
        },
        a.attachEvent("on" + c, a[c + d])
    });
    var e = function() {};
    c.removeEventListener ? e = function(a, b, c) {
        a.removeEventListener(b, c, !1)
    }: c.detachEvent && (e = function(a, b, c) {
        a.detachEvent("on" + b, a[b + c]);
        try {
            delete a[b + c]
        } catch(d) {
            a[b + c] = void 0
        }
    });
    var f = {
        bind: d,
        unbind: e
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", f) : "object" == typeof exports ? module.exports = f: a.eventie = f
} (window),
function() {
    function a() {}
    function b(a, b) {
        for (var c = a.length; c--;) if (a[c].listener === b) return c;
        return - 1
    }
    function c(a) {
        return function() {
            return this[a].apply(this, arguments)
        }
    }
    var d = a.prototype,
    e = this,
    f = e.EventEmitter;
    d.getListeners = function(a) {
        var b, c, d = this._getEvents();
        if (a instanceof RegExp) {
            b = {};
            for (c in d) d.hasOwnProperty(c) && a.test(c) && (b[c] = d[c])
        } else b = d[a] || (d[a] = []);
        return b
    },
    d.flattenListeners = function(a) {
        var b, c = [];
        for (b = 0; b < a.length; b += 1) c.push(a[b].listener);
        return c
    },
    d.getListenersAsObject = function(a) {
        var b, c = this.getListeners(a);
        return c instanceof Array && (b = {},
        b[a] = c),
        b || c
    },
    d.addListener = function(a, c) {
        var d, e = this.getListenersAsObject(a),
        f = "object" == typeof c;
        for (d in e) e.hasOwnProperty(d) && -1 === b(e[d], c) && e[d].push(f ? c: {
            listener: c,
            once: !1
        });
        return this
    },
    d.on = c("addListener"),
    d.addOnceListener = function(a, b) {
        return this.addListener(a, {
            listener: b,
            once: !0
        })
    },
    d.once = c("addOnceListener"),
    d.defineEvent = function(a) {
        return this.getListeners(a),
        this
    },
    d.defineEvents = function(a) {
        for (var b = 0; b < a.length; b += 1) this.defineEvent(a[b]);
        return this
    },
    d.removeListener = function(a, c) {
        var d, e, f = this.getListenersAsObject(a);
        for (e in f) f.hasOwnProperty(e) && (d = b(f[e], c), -1 !== d && f[e].splice(d, 1));
        return this
    },
    d.off = c("removeListener"),
    d.addListeners = function(a, b) {
        return this.manipulateListeners(!1, a, b)
    },
    d.removeListeners = function(a, b) {
        return this.manipulateListeners(!0, a, b)
    },
    d.manipulateListeners = function(a, b, c) {
        var d, e, f = a ? this.removeListener: this.addListener,
        g = a ? this.removeListeners: this.addListeners;
        if ("object" != typeof b || b instanceof RegExp) for (d = c.length; d--;) f.call(this, b, c[d]);
        else for (d in b) b.hasOwnProperty(d) && (e = b[d]) && ("function" == typeof e ? f.call(this, d, e) : g.call(this, d, e));
        return this
    },
    d.removeEvent = function(a) {
        var b, c = typeof a,
        d = this._getEvents();
        if ("string" === c) delete d[a];
        else if (a instanceof RegExp) for (b in d) d.hasOwnProperty(b) && a.test(b) && delete d[b];
        else delete this._events;
        return this
    },
    d.removeAllListeners = c("removeEvent"),
    d.emitEvent = function(a, b) {
        var c, d, e, f, g = this.getListenersAsObject(a);
        for (e in g) if (g.hasOwnProperty(e)) for (d = g[e].length; d--;) c = g[e][d],
        c.once === !0 && this.removeListener(a, c.listener),
        f = c.listener.apply(this, b || []),
        f === this._getOnceReturnValue() && this.removeListener(a, c.listener);
        return this
    },
    d.trigger = c("emitEvent"),
    d.emit = function(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(a, b)
    },
    d.setOnceReturnValue = function(a) {
        return this._onceReturnValue = a,
        this
    },
    d._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue: !0
    },
    d._getEvents = function() {
        return this._events || (this._events = {})
    },
    a.noConflict = function() {
        return e.EventEmitter = f,
        a
    },
    "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [],
    function() {
        return a
    }) : "object" == typeof module && module.exports ? module.exports = a: e.EventEmitter = a
}.call(this),
function(a) {
    function b(a) {
        if (a) {
            if ("string" == typeof d[a]) return a;
            a = a.charAt(0).toUpperCase() + a.slice(1);
            for (var b, e = 0,
            f = c.length; f > e; e++) if (b = c[e] + a, "string" == typeof d[b]) return b
        }
    }
    var c = "Webkit Moz ms Ms O".split(" "),
    d = document.documentElement.style;
    "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [],
    function() {
        return b
    }) : "object" == typeof exports ? module.exports = b: a.getStyleProperty = b
} (window),
function(a) {
    function b(a) {
        var b = parseFloat(a),
        c = -1 === a.indexOf("%") && !isNaN(b);
        return c && b
    }
    function c() {}
    function d() {
        for (var a = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0
        },
        b = 0, c = g.length; c > b; b++) {
            var d = g[b];
            a[d] = 0
        }
        return a
    }
    function e(c) {
        function e() {
            if (!m) {
                m = !0;
                var d = a.getComputedStyle;
                if (j = function() {
                    var a = d ?
                    function(a) {
                        return d(a, null)
                    }: function(a) {
                        return a.currentStyle
                    };
                    return function(b) {
                        var c = a(b);
                        return c || f("Style returned " + c + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),
                        c
                    }
                } (), k = c("boxSizing")) {
                    var e = document.createElement("div");
                    e.style.width = "200px",
                    e.style.padding = "1px 2px 3px 4px",
                    e.style.borderStyle = "solid",
                    e.style.borderWidth = "1px 2px 3px 4px",
                    e.style[k] = "border-box";
                    var g = document.body || document.documentElement;
                    g.appendChild(e);
                    var h = j(e);
                    l = 200 === b(h.width),
                    g.removeChild(e)
                }
            }
        }
        function h(a) {
            if (e(), "string" == typeof a && (a = document.querySelector(a)), a && "object" == typeof a && a.nodeType) {
                var c = j(a);
                if ("none" === c.display) return d();
                var f = {};
                f.width = a.offsetWidth,
                f.height = a.offsetHeight;
                for (var h = f.isBorderBox = !(!k || !c[k] || "border-box" !== c[k]), m = 0, n = g.length; n > m; m++) {
                    var o = g[m],
                    p = c[o];
                    p = i(a, p);
                    var q = parseFloat(p);
                    f[o] = isNaN(q) ? 0 : q
                }
                var r = f.paddingLeft + f.paddingRight,
                s = f.paddingTop + f.paddingBottom,
                t = f.marginLeft + f.marginRight,
                u = f.marginTop + f.marginBottom,
                v = f.borderLeftWidth + f.borderRightWidth,
                w = f.borderTopWidth + f.borderBottomWidth,
                x = h && l,
                y = b(c.width);
                y !== !1 && (f.width = y + (x ? 0 : r + v));
                var z = b(c.height);
                return z !== !1 && (f.height = z + (x ? 0 : s + w)),
                f.innerWidth = f.width - (r + v),
                f.innerHeight = f.height - (s + w),
                f.outerWidth = f.width + t,
                f.outerHeight = f.height + u,
                f
            }
        }
        function i(b, c) {
            if (a.getComputedStyle || -1 === c.indexOf("%")) return c;
            var d = b.style,
            e = d.left,
            f = b.runtimeStyle,
            g = f && f.left;
            return g && (f.left = b.currentStyle.left),
            d.left = c,
            c = d.pixelLeft,
            d.left = e,
            g && (f.left = g),
            c
        }
        var j, k, l, m = !1;
        return h
    }
    var f = "undefined" == typeof console ? c: function(a) {
        console.error(a)
    },
    g = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
    "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], e) : "object" == typeof exports ? module.exports = e(require("desandro-get-style-property")) : a.getSize = e(a.getStyleProperty)
} (window),
function(a) {
    function b(a) {
        "function" == typeof a && (b.isReady ? a() : g.push(a))
    }
    function c(a) {
        var c = "readystatechange" === a.type && "complete" !== f.readyState;
        b.isReady || c || d()
    }
    function d() {
        b.isReady = !0;
        for (var a = 0,
        c = g.length; c > a; a++) {
            var d = g[a];
            d()
        }
    }
    function e(e) {
        return "complete" === f.readyState ? d() : (e.bind(f, "DOMContentLoaded", c), e.bind(f, "readystatechange", c), e.bind(a, "load", c)),
        b
    }
    var f = a.document,
    g = [];
    b.isReady = !1,
    "function" == typeof define && define.amd ? define("doc-ready/doc-ready", ["eventie/eventie"], e) : "object" == typeof exports ? module.exports = e(require("eventie")) : a.docReady = e(a.eventie)
} (window),
function(a) {
    function b(a, b) {
        return a[g](b)
    }
    function c(a) {
        if (!a.parentNode) {
            var b = document.createDocumentFragment();
            b.appendChild(a)
        }
    }
    function d(a, b) {
        c(a);
        for (var d = a.parentNode.querySelectorAll(b), e = 0, f = d.length; f > e; e++) if (d[e] === a) return ! 0;
        return ! 1
    }
    function e(a, d) {
        return c(a),
        b(a, d)
    }
    var f, g = function() {
        if (a.matches) return "matches";
        if (a.matchesSelector) return "matchesSelector";
        for (var b = ["webkit", "moz", "ms", "o"], c = 0, d = b.length; d > c; c++) {
            var e = b[c],
            f = e + "MatchesSelector";
            if (a[f]) return f
        }
    } ();
    if (g) {
        var h = document.createElement("div"),
        i = b(h, "div");
        f = i ? b: e
    } else f = d;
    "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [],
    function() {
        return f
    }) : "object" == typeof exports ? module.exports = f: window.matchesSelector = f
} (Element.prototype),
function(a, b) {
    "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["doc-ready/doc-ready", "matches-selector/matches-selector"],
    function(c, d) {
        return b(a, c, d)
    }) : "object" == typeof exports ? module.exports = b(a, require("doc-ready"), require("desandro-matches-selector")) : a.fizzyUIUtils = b(a, a.docReady, a.matchesSelector)
} (window,
function(a, b, c) {
    var d = {};
    d.extend = function(a, b) {
        for (var c in b) a[c] = b[c];
        return a
    },
    d.modulo = function(a, b) {
        return (a % b + b) % b
    };
    var e = Object.prototype.toString;
    d.isArray = function(a) {
        return "[object Array]" == e.call(a)
    },
    d.makeArray = function(a) {
        var b = [];
        if (d.isArray(a)) b = a;
        else if (a && "number" == typeof a.length) for (var c = 0,
        e = a.length; e > c; c++) b.push(a[c]);
        else b.push(a);
        return b
    },
    d.indexOf = Array.prototype.indexOf ?
    function(a, b) {
        return a.indexOf(b)
    }: function(a, b) {
        for (var c = 0,
        d = a.length; d > c; c++) if (a[c] === b) return c;
        return - 1
    },
    d.removeFrom = function(a, b) {
        var c = d.indexOf(a, b); - 1 != c && a.splice(c, 1)
    },
    d.isElement = "function" == typeof HTMLElement || "object" == typeof HTMLElement ?
    function(a) {
        return a instanceof HTMLElement
    }: function(a) {
        return a && "object" == typeof a && 1 == a.nodeType && "string" == typeof a.nodeName
    },
    d.setText = function() {
        function a(a, c) {
            b = b || (void 0 !== document.documentElement.textContent ? "textContent": "innerText"),
            a[b] = c
        }
        var b;
        return a
    } (),
    d.getParent = function(a, b) {
        for (; a != document.body;) if (a = a.parentNode, c(a, b)) return a
    },
    d.getQueryElement = function(a) {
        return "string" == typeof a ? document.querySelector(a) : a
    },
    d.handleEvent = function(a) {
        var b = "on" + a.type;
        this[b] && this[b](a)
    },
    d.filterFindElements = function(a, b) {
        a = d.makeArray(a);
        for (var e = [], f = 0, g = a.length; g > f; f++) {
            var h = a[f];
            if (d.isElement(h)) if (b) {
                c(h, b) && e.push(h);
                for (var i = h.querySelectorAll(b), j = 0, k = i.length; k > j; j++) e.push(i[j])
            } else e.push(h)
        }
        return e
    },
    d.debounceMethod = function(a, b, c) {
        var d = a.prototype[b],
        e = b + "Timeout";
        a.prototype[b] = function() {
            var a = this[e];
            a && clearTimeout(a);
            var b = arguments,
            f = this;
            this[e] = setTimeout(function() {
                d.apply(f, b),
                delete f[e]
            },
            c || 100)
        }
    },
    d.toDashed = function(a) {
        return a.replace(/(.)([A-Z])/g,
        function(a, b, c) {
            return b + "-" + c
        }).toLowerCase()
    };
    var f = a.console;
    return d.htmlInit = function(c, e) {
        b(function() {
            for (var b = d.toDashed(e), g = document.querySelectorAll(".js-" + b), h = "data-" + b + "-options", i = 0, j = g.length; j > i; i++) {
                var k, l = g[i],
                m = l.getAttribute(h);
                try {
                    k = m && JSON.parse(m)
                } catch(n) {
                    f && f.error("Error parsing " + h + " on " + l.nodeName.toLowerCase() + (l.id ? "#" + l.id: "") + ": " + n);
                    continue
                }
                var o = new c(l, k),
                p = a.jQuery;
                p && p.data(l, e, o)
            }
        })
    },
    d
}),
function(a, b) {
    "function" == typeof define && define.amd ? define("outlayer/item", ["eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property", "fizzy-ui-utils/utils"],
    function(c, d, e, f) {
        return b(a, c, d, e, f)
    }) : "object" == typeof exports ? module.exports = b(a, require("wolfy87-eventemitter"), require("get-size"), require("desandro-get-style-property"), require("fizzy-ui-utils")) : (a.Outlayer = {},
    a.Outlayer.Item = b(a, a.EventEmitter, a.getSize, a.getStyleProperty, a.fizzyUIUtils))
} (window,
function(a, b, c, d, e) {
    function f(a) {
        for (var b in a) return ! 1;
        return b = null,
        !0
    }
    function g(a, b) {
        a && (this.element = a, this.layout = b, this.position = {
            x: 0,
            y: 0
        },
        this._create())
    }
    function h(a) {
        return a.replace(/([A-Z])/g,
        function(a) {
            return "-" + a.toLowerCase()
        })
    }
    var i = a.getComputedStyle,
    j = i ?
    function(a) {
        return i(a, null)
    }: function(a) {
        return a.currentStyle
    },
    k = d("transition"),
    l = d("transform"),
    m = k && l,
    n = !!d("perspective"),
    o = {
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        OTransition: "otransitionend",
        transition: "transitionend"
    } [k],
    p = ["transform", "transition", "transitionDuration", "transitionProperty"],
    q = function() {
        for (var a = {},
        b = 0,
        c = p.length; c > b; b++) {
            var e = p[b],
            f = d(e);
            f && f !== e && (a[e] = f)
        }
        return a
    } ();
    e.extend(g.prototype, b.prototype),
    g.prototype._create = function() {
        this._transn = {
            ingProperties: {},
            clean: {},
            onEnd: {}
        },
        this.css({
            position: "absolute"
        })
    },
    g.prototype.handleEvent = function(a) {
        var b = "on" + a.type;
        this[b] && this[b](a)
    },
    g.prototype.getSize = function() {
        this.size = c(this.element)
    },
    g.prototype.css = function(a) {
        var b = this.element.style;
        for (var c in a) {
            var d = q[c] || c;
            b[d] = a[c]
        }
    },
    g.prototype.getPosition = function() {
        var a = j(this.element),
        b = this.layout.options,
        c = b.isOriginLeft,
        d = b.isOriginTop,
        e = a[c ? "left": "right"],
        f = a[d ? "top": "bottom"],
        g = this.layout.size,
        h = -1 != e.indexOf("%") ? parseFloat(e) / 100 * g.width: parseInt(e, 10),
        i = -1 != f.indexOf("%") ? parseFloat(f) / 100 * g.height: parseInt(f, 10);
        h = isNaN(h) ? 0 : h,
        i = isNaN(i) ? 0 : i,
        h -= c ? g.paddingLeft: g.paddingRight,
        i -= d ? g.paddingTop: g.paddingBottom,
        this.position.x = h,
        this.position.y = i
    },
    g.prototype.layoutPosition = function() {
        var a = this.layout.size,
        b = this.layout.options,
        c = {},
        d = b.isOriginLeft ? "paddingLeft": "paddingRight",
        e = b.isOriginLeft ? "left": "right",
        f = b.isOriginLeft ? "right": "left",
        g = this.position.x + a[d];
        c[e] = this.getXValue(g),
        c[f] = "";
        var h = b.isOriginTop ? "paddingTop": "paddingBottom",
        i = b.isOriginTop ? "top": "bottom",
        j = b.isOriginTop ? "bottom": "top",
        k = this.position.y + a[h];
        c[i] = this.getYValue(k),
        c[j] = "",
        this.css(c),
        this.emitEvent("layout", [this])
    },
    g.prototype.getXValue = function(a) {
        var b = this.layout.options;
        return b.percentPosition && !b.isHorizontal ? a / this.layout.size.width * 100 + "%": a + "px"
    },
    g.prototype.getYValue = function(a) {
        var b = this.layout.options;
        return b.percentPosition && b.isHorizontal ? a / this.layout.size.height * 100 + "%": a + "px"
    },
    g.prototype._transitionTo = function(a, b) {
        this.getPosition();
        var c = this.position.x,
        d = this.position.y,
        e = parseInt(a, 10),
        f = parseInt(b, 10),
        g = e === this.position.x && f === this.position.y;
        if (this.setPosition(a, b), g && !this.isTransitioning) return void this.layoutPosition();
        var h = a - c,
        i = b - d,
        j = {};
        j.transform = this.getTranslate(h, i),
        this.transition({
            to: j,
            onTransitionEnd: {
                transform: this.layoutPosition
            },
            isCleaning: !0
        })
    },
    g.prototype.getTranslate = function(a, b) {
        var c = this.layout.options;
        return a = c.isOriginLeft ? a: -a,
        b = c.isOriginTop ? b: -b,
        n ? "translate3d(" + a + "px, " + b + "px, 0)": "translate(" + a + "px, " + b + "px)"
    },
    g.prototype.goTo = function(a, b) {
        this.setPosition(a, b),
        this.layoutPosition()
    },
    g.prototype.moveTo = m ? g.prototype._transitionTo: g.prototype.goTo,
    g.prototype.setPosition = function(a, b) {
        this.position.x = parseInt(a, 10),
        this.position.y = parseInt(b, 10)
    },
    g.prototype._nonTransition = function(a) {
        this.css(a.to),
        a.isCleaning && this._removeStyles(a.to);
        for (var b in a.onTransitionEnd) a.onTransitionEnd[b].call(this)
    },
    g.prototype._transition = function(a) {
        if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(a);
        var b = this._transn;
        for (var c in a.onTransitionEnd) b.onEnd[c] = a.onTransitionEnd[c];
        for (c in a.to) b.ingProperties[c] = !0,
        a.isCleaning && (b.clean[c] = !0);
        if (a.from) {
            this.css(a.from);
            var d = this.element.offsetHeight;
            d = null
        }
        this.enableTransition(a.to),
        this.css(a.to),
        this.isTransitioning = !0
    };
    var r = "opacity," + h(q.transform || "transform");
    g.prototype.enableTransition = function() {
        this.isTransitioning || (this.css({
            transitionProperty: r,
            transitionDuration: this.layout.options.transitionDuration
        }), this.element.addEventListener(o, this, !1))
    },
    g.prototype.transition = g.prototype[k ? "_transition": "_nonTransition"],
    g.prototype.onwebkitTransitionEnd = function(a) {
        this.ontransitionend(a)
    },
    g.prototype.onotransitionend = function(a) {
        this.ontransitionend(a)
    };
    var s = {
        "-webkit-transform": "transform",
        "-moz-transform": "transform",
        "-o-transform": "transform"
    };
    g.prototype.ontransitionend = function(a) {
        if (a.target === this.element) {
            var b = this._transn,
            c = s[a.propertyName] || a.propertyName;
            if (delete b.ingProperties[c], f(b.ingProperties) && this.disableTransition(), c in b.clean && (this.element.style[a.propertyName] = "", delete b.clean[c]), c in b.onEnd) {
                var d = b.onEnd[c];
                d.call(this),
                delete b.onEnd[c]
            }
            this.emitEvent("transitionEnd", [this])
        }
    },
    g.prototype.disableTransition = function() {
        this.removeTransitionStyles(),
        this.element.removeEventListener(o, this, !1),
        this.isTransitioning = !1
    },
    g.prototype._removeStyles = function(a) {
        var b = {};
        for (var c in a) b[c] = "";
        this.css(b)
    };
    var t = {
        transitionProperty: "",
        transitionDuration: ""
    };
    return g.prototype.removeTransitionStyles = function() {
        this.css(t)
    },
    g.prototype.removeElem = function() {
        this.element.parentNode.removeChild(this.element),
        this.css({
            display: ""
        }),
        this.emitEvent("remove", [this])
    },
    g.prototype.remove = function() {
        if (!k || !parseFloat(this.layout.options.transitionDuration)) return void this.removeElem();
        var a = this;
        this.once("transitionEnd",
        function() {
            a.removeElem()
        }),
        this.hide()
    },
    g.prototype.reveal = function() {
        delete this.isHidden,
        this.css({
            display: ""
        });
        var a = this.layout.options,
        b = {},
        c = this.getHideRevealTransitionEndProperty("visibleStyle");
        b[c] = this.onRevealTransitionEnd,
        this.transition({
            from: a.hiddenStyle,
            to: a.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: b
        })
    },
    g.prototype.onRevealTransitionEnd = function() {
        this.isHidden || this.emitEvent("reveal")
    },
    g.prototype.getHideRevealTransitionEndProperty = function(a) {
        var b = this.layout.options[a];
        if (b.opacity) return "opacity";
        for (var c in b) return c
    },
    g.prototype.hide = function() {
        this.isHidden = !0,
        this.css({
            display: ""
        });
        var a = this.layout.options,
        b = {},
        c = this.getHideRevealTransitionEndProperty("hiddenStyle");
        b[c] = this.onHideTransitionEnd,
        this.transition({
            from: a.visibleStyle,
            to: a.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: b
        })
    },
    g.prototype.onHideTransitionEnd = function() {
        this.isHidden && (this.css({
            display: "none"
        }), this.emitEvent("hide"))
    },
    g.prototype.destroy = function() {
        this.css({
            position: "",
            left: "",
            right: "",
            top: "",
            bottom: "",
            transition: "",
            transform: ""
        })
    },
    g
}),
function(a, b) {
    "function" == typeof define && define.amd ? define("outlayer/outlayer", ["eventie/eventie", "eventEmitter/EventEmitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"],
    function(c, d, e, f, g) {
        return b(a, c, d, e, f, g)
    }) : "object" == typeof exports ? module.exports = b(a, require("eventie"), require("wolfy87-eventemitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : a.Outlayer = b(a, a.eventie, a.EventEmitter, a.getSize, a.fizzyUIUtils, a.Outlayer.Item)
} (window,
function(a, b, c, d, e, f) {
    function g(a, b) {
        var c = e.getQueryElement(a);
        if (!c) return void(h && h.error("Bad element for " + this.constructor.namespace + ": " + (c || a)));
        this.element = c,
        i && (this.$element = i(this.element)),
        this.options = e.extend({},
        this.constructor.defaults),
        this.option(b);
        var d = ++k;
        this.element.outlayerGUID = d,
        l[d] = this,
        this._create(),
        this.options.isInitLayout && this.layout()
    }
    var h = a.console,
    i = a.jQuery,
    j = function() {},
    k = 0,
    l = {};
    return g.namespace = "outlayer",
    g.Item = f,
    g.defaults = {
        containerStyle: {
            position: "relative"
        },
        isInitLayout: !0,
        isOriginLeft: !0,
        isOriginTop: !0,
        isResizeBound: !0,
        isResizingContainer: !0,
        transitionDuration: "0.4s",
        hiddenStyle: {
            opacity: 0,
            transform: "scale(0.001)"
        },
        visibleStyle: {
            opacity: 1,
            transform: "scale(1)"
        }
    },
    e.extend(g.prototype, c.prototype),
    g.prototype.option = function(a) {
        e.extend(this.options, a)
    },
    g.prototype._create = function() {
        this.reloadItems(),
        this.stamps = [],
        this.stamp(this.options.stamp),
        e.extend(this.element.style, this.options.containerStyle),
        this.options.isResizeBound && this.bindResize()
    },
    g.prototype.reloadItems = function() {
        this.items = this._itemize(this.element.children)
    },
    g.prototype._itemize = function(a) {
        for (var b = this._filterFindItemElements(a), c = this.constructor.Item, d = [], e = 0, f = b.length; f > e; e++) {
            var g = b[e],
            h = new c(g, this);
            d.push(h)
        }
        return d
    },
    g.prototype._filterFindItemElements = function(a) {
        return e.filterFindElements(a, this.options.itemSelector)
    },
    g.prototype.getItemElements = function() {
        for (var a = [], b = 0, c = this.items.length; c > b; b++) a.push(this.items[b].element);
        return a
    },
    g.prototype.layout = function() {
        this._resetLayout(),
        this._manageStamps();
        var a = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant: !this._isLayoutInited;
        this.layoutItems(this.items, a),
        this._isLayoutInited = !0
    },
    g.prototype._init = g.prototype.layout,
    g.prototype._resetLayout = function() {
        this.getSize()
    },
    g.prototype.getSize = function() {
        this.size = d(this.element)
    },
    g.prototype._getMeasurement = function(a, b) {
        var c, f = this.options[a];
        f ? ("string" == typeof f ? c = this.element.querySelector(f) : e.isElement(f) && (c = f), this[a] = c ? d(c)[b] : f) : this[a] = 0
    },
    g.prototype.layoutItems = function(a, b) {
        a = this._getItemsForLayout(a),
        this._layoutItems(a, b),
        this._postLayout()
    },
    g.prototype._getItemsForLayout = function(a) {
        for (var b = [], c = 0, d = a.length; d > c; c++) {
            var e = a[c];
            e.isIgnored || b.push(e)
        }
        return b
    },
    g.prototype._layoutItems = function(a, b) {
        if (this._emitCompleteOnItems("layout", a), a && a.length) {
            for (var c = [], d = 0, e = a.length; e > d; d++) {
                var f = a[d],
                g = this._getItemLayoutPosition(f);
                g.item = f,
                g.isInstant = b || f.isLayoutInstant,
                c.push(g)
            }
            this._processLayoutQueue(c)
        }
    },
    g.prototype._getItemLayoutPosition = function() {
        return {
            x: 0,
            y: 0
        }
    },
    g.prototype._processLayoutQueue = function(a) {
        for (var b = 0,
        c = a.length; c > b; b++) {
            var d = a[b];
            this._positionItem(d.item, d.x, d.y, d.isInstant)
        }
    },
    g.prototype._positionItem = function(a, b, c, d) {
        d ? a.goTo(b, c) : a.moveTo(b, c)
    },
    g.prototype._postLayout = function() {
        this.resizeContainer()
    },
    g.prototype.resizeContainer = function() {
        if (this.options.isResizingContainer) {
            var a = this._getContainerSize();
            a && (this._setContainerMeasure(a.width, !0), this._setContainerMeasure(a.height, !1))
        }
    },
    g.prototype._getContainerSize = j,
    g.prototype._setContainerMeasure = function(a, b) {
        if (void 0 !== a) {
            var c = this.size;
            c.isBorderBox && (a += b ? c.paddingLeft + c.paddingRight + c.borderLeftWidth + c.borderRightWidth: c.paddingBottom + c.paddingTop + c.borderTopWidth + c.borderBottomWidth),
            a = Math.max(a, 0),
            this.element.style[b ? "width": "height"] = a + "px"
        }
    },
    g.prototype._emitCompleteOnItems = function(a, b) {
        function c() {
            e.dispatchEvent(a + "Complete", null, [b])
        }
        function d() {
            g++,
            g === f && c()
        }
        var e = this,
        f = b.length;
        if (!b || !f) return void c();
        for (var g = 0,
        h = 0,
        i = b.length; i > h; h++) {
            var j = b[h];
            j.once(a, d)
        }
    },
    g.prototype.dispatchEvent = function(a, b, c) {
        var d = b ? [b].concat(c) : c;
        if (this.emitEvent(a, d), i) if (this.$element = this.$element || i(this.element), b) {
            var e = i.Event(b);
            e.type = a,
            this.$element.trigger(e, c)
        } else this.$element.trigger(a, c)
    },
    g.prototype.ignore = function(a) {
        var b = this.getItem(a);
        b && (b.isIgnored = !0)
    },
    g.prototype.unignore = function(a) {
        var b = this.getItem(a);
        b && delete b.isIgnored
    },
    g.prototype.stamp = function(a) {
        if (a = this._find(a)) {
            this.stamps = this.stamps.concat(a);
            for (var b = 0,
            c = a.length; c > b; b++) {
                var d = a[b];
                this.ignore(d)
            }
        }
    },
    g.prototype.unstamp = function(a) {
        if (a = this._find(a)) for (var b = 0,
        c = a.length; c > b; b++) {
            var d = a[b];
            e.removeFrom(this.stamps, d),
            this.unignore(d)
        }
    },
    g.prototype._find = function(a) {
        return a ? ("string" == typeof a && (a = this.element.querySelectorAll(a)), a = e.makeArray(a)) : void 0
    },
    g.prototype._manageStamps = function() {
        if (this.stamps && this.stamps.length) {
            this._getBoundingRect();
            for (var a = 0,
            b = this.stamps.length; b > a; a++) {
                var c = this.stamps[a];
                this._manageStamp(c)
            }
        }
    },
    g.prototype._getBoundingRect = function() {
        var a = this.element.getBoundingClientRect(),
        b = this.size;
        this._boundingRect = {
            left: a.left + b.paddingLeft + b.borderLeftWidth,
            top: a.top + b.paddingTop + b.borderTopWidth,
            right: a.right - (b.paddingRight + b.borderRightWidth),
            bottom: a.bottom - (b.paddingBottom + b.borderBottomWidth)
        }
    },
    g.prototype._manageStamp = j,
    g.prototype._getElementOffset = function(a) {
        var b = a.getBoundingClientRect(),
        c = this._boundingRect,
        e = d(a),
        f = {
            left: b.left - c.left - e.marginLeft,
            top: b.top - c.top - e.marginTop,
            right: c.right - b.right - e.marginRight,
            bottom: c.bottom - b.bottom - e.marginBottom
        };
        return f
    },
    g.prototype.handleEvent = function(a) {
        var b = "on" + a.type;
        this[b] && this[b](a)
    },
    g.prototype.bindResize = function() {
        this.isResizeBound || (b.bind(a, "resize", this), this.isResizeBound = !0)
    },
    g.prototype.unbindResize = function() {
        this.isResizeBound && b.unbind(a, "resize", this),
        this.isResizeBound = !1
    },
    g.prototype.onresize = function() {
        function a() {
            b.resize(),
            delete b.resizeTimeout
        }
        this.resizeTimeout && clearTimeout(this.resizeTimeout);
        var b = this;
        this.resizeTimeout = setTimeout(a, 100)
    },
    g.prototype.resize = function() {
        this.isResizeBound && this.needsResizeLayout() && this.layout()
    },
    g.prototype.needsResizeLayout = function() {
        var a = d(this.element),
        b = this.size && a;
        return b && a.innerWidth !== this.size.innerWidth
    },
    g.prototype.addItems = function(a) {
        var b = this._itemize(a);
        return b.length && (this.items = this.items.concat(b)),
        b
    },
    g.prototype.appended = function(a) {
        var b = this.addItems(a);
        b.length && (this.layoutItems(b, !0), this.reveal(b))
    },
    g.prototype.prepended = function(a) {
        var b = this._itemize(a);
        if (b.length) {
            var c = this.items.slice(0);
            this.items = b.concat(c),
            this._resetLayout(),
            this._manageStamps(),
            this.layoutItems(b, !0),
            this.reveal(b),
            this.layoutItems(c)
        }
    },
    g.prototype.reveal = function(a) {
        this._emitCompleteOnItems("reveal", a);
        for (var b = a && a.length,
        c = 0; b && b > c; c++) {
            var d = a[c];
            d.reveal()
        }
    },
    g.prototype.hide = function(a) {
        this._emitCompleteOnItems("hide", a);
        for (var b = a && a.length,
        c = 0; b && b > c; c++) {
            var d = a[c];
            d.hide()
        }
    },
    g.prototype.revealItemElements = function(a) {
        var b = this.getItems(a);
        this.reveal(b)
    },
    g.prototype.hideItemElements = function(a) {
        var b = this.getItems(a);
        this.hide(b)
    },
    g.prototype.getItem = function(a) {
        for (var b = 0,
        c = this.items.length; c > b; b++) {
            var d = this.items[b];
            if (d.element === a) return d
        }
    },
    g.prototype.getItems = function(a) {
        a = e.makeArray(a);
        for (var b = [], c = 0, d = a.length; d > c; c++) {
            var f = a[c],
            g = this.getItem(f);
            g && b.push(g)
        }
        return b
    },
    g.prototype.remove = function(a) {
        var b = this.getItems(a);
        if (this._emitCompleteOnItems("remove", b), b && b.length) for (var c = 0,
        d = b.length; d > c; c++) {
            var f = b[c];
            f.remove(),
            e.removeFrom(this.items, f)
        }
    },
    g.prototype.destroy = function() {
        var a = this.element.style;
        a.height = "",
        a.position = "",
        a.width = "";
        for (var b = 0,
        c = this.items.length; c > b; b++) {
            var d = this.items[b];
            d.destroy()
        }
        this.unbindResize();
        var e = this.element.outlayerGUID;
        delete l[e],
        delete this.element.outlayerGUID,
        i && i.removeData(this.element, this.constructor.namespace)
    },
    g.data = function(a) {
        a = e.getQueryElement(a);
        var b = a && a.outlayerGUID;
        return b && l[b]
    },
    g.create = function(a, b) {
        function c() {
            g.apply(this, arguments)
        }
        return Object.create ? c.prototype = Object.create(g.prototype) : e.extend(c.prototype, g.prototype),
        c.prototype.constructor = c,
        c.defaults = e.extend({},
        g.defaults),
        e.extend(c.defaults, b),
        c.prototype.settings = {},
        c.namespace = a,
        c.data = g.data,
        c.Item = function() {
            f.apply(this, arguments)
        },
        c.Item.prototype = new f,
        e.htmlInit(c, a),
        i && i.bridget && i.bridget(a, c),
        c
    },
    g.Item = f,
    g
}),
function(a, b) {
    "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size", "fizzy-ui-utils/utils"], b) : "object" == typeof exports ? module.exports = b(require("outlayer"), require("get-size"), require("fizzy-ui-utils")) : a.Masonry = b(a.Outlayer, a.getSize, a.fizzyUIUtils)
} (window,
function(a, b, c) {
    var d = a.create("masonry");
    return d.prototype._resetLayout = function() {
        this.getSize(),
        this._getMeasurement("columnWidth", "outerWidth"),
        this._getMeasurement("gutter", "outerWidth"),
        this.measureColumns();
        var a = this.cols;
        for (this.colYs = []; a--;) this.colYs.push(0);
        this.maxY = 0
    },
    d.prototype.measureColumns = function() {
        if (this.getContainerWidth(), !this.columnWidth) {
            var a = this.items[0],
            c = a && a.element;
            this.columnWidth = c && b(c).outerWidth || this.containerWidth
        }
        var d = this.columnWidth += this.gutter,
        e = this.containerWidth + this.gutter,
        f = e / d,
        g = d - e % d,
        h = g && 1 > g ? "round": "floor";
        f = Math[h](f),
        this.cols = Math.max(f, 1)
    },
    d.prototype.getContainerWidth = function() {
        var a = this.options.isFitWidth ? this.element.parentNode: this.element,
        c = b(a);
        this.containerWidth = c && c.innerWidth
    },
    d.prototype._getItemLayoutPosition = function(a) {
        a.getSize();
        var b = a.size.outerWidth % this.columnWidth,
        d = b && 1 > b ? "round": "ceil",
        e = Math[d](a.size.outerWidth / this.columnWidth);
        e = Math.min(e, this.cols);
        for (var f = this._getColGroup(e), g = Math.min.apply(Math, f), h = c.indexOf(f, g), i = {
            x: this.columnWidth * h,
            y: g
        },
        j = g + a.size.outerHeight, k = this.cols + 1 - f.length, l = 0; k > l; l++) this.colYs[h + l] = j;
        return i
    },
    d.prototype._getColGroup = function(a) {
        if (2 > a) return this.colYs;
        for (var b = [], c = this.cols + 1 - a, d = 0; c > d; d++) {
            var e = this.colYs.slice(d, d + a);
            b[d] = Math.max.apply(Math, e)
        }
        return b
    },
    d.prototype._manageStamp = function(a) {
        var c = b(a),
        d = this._getElementOffset(a),
        e = this.options.isOriginLeft ? d.left: d.right,
        f = e + c.outerWidth,
        g = Math.floor(e / this.columnWidth);
        g = Math.max(0, g);
        var h = Math.floor(f / this.columnWidth);
        h -= f % this.columnWidth ? 0 : 1,
        h = Math.min(this.cols - 1, h);
        for (var i = (this.options.isOriginTop ? d.top: d.bottom) + c.outerHeight, j = g; h >= j; j++) this.colYs[j] = Math.max(i, this.colYs[j])
    },
    d.prototype._getContainerSize = function() {
        this.maxY = Math.max.apply(Math, this.colYs);
        var a = {
            height: this.maxY
        };
        return this.options.isFitWidth && (a.width = this._getContainerFitWidth()),
        a
    },
    d.prototype._getContainerFitWidth = function() {
        for (var a = 0,
        b = this.cols; --b && 0 === this.colYs[b];) a++;
        return (this.cols - a) * this.columnWidth - this.gutter
    },
    d.prototype.needsResizeLayout = function() {
        var a = this.containerWidth;
        return this.getContainerWidth(),
        a !== this.containerWidth
    },
    d
});

/*! modernizr 3.1.0 (Custom Build) | MIT *
 * http://modernizr.com/download/?-cssanimations-cssfilters-csstransforms3d-csstransitions-fullscreen-touchevents-cssclassprefix:chrg_ !*/
!
function(e, n, t) {
    function r(e) {
        var n = S.className,
        t = Modernizr._config.classPrefix || "";
        if (_ && (n = n.baseVal), Modernizr._config.enableJSClass) {
            var r = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");
            n = n.replace(r, "$1" + t + "js$2")
        }
        Modernizr._config.enableClasses && (n += " " + t + e.join(" " + t), _ ? S.className.baseVal = n: S.className = n)
    }
    function s(e, n) {
        return typeof e === n
    }
    function o() {
        var e, n, t, r, o, i, a;
        for (var f in x) if (x.hasOwnProperty(f)) {
            if (e = [], n = x[f], n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length)) for (t = 0; t < n.options.aliases.length; t++) e.push(n.options.aliases[t].toLowerCase());
            for (r = s(n.fn, "function") ? n.fn() : n.fn, o = 0; o < e.length; o++) i = e[o],
            a = i.split("."),
            1 === a.length ? Modernizr[a[0]] = r: (!Modernizr[a[0]] || Modernizr[a[0]] instanceof Boolean || (Modernizr[a[0]] = new Boolean(Modernizr[a[0]])), Modernizr[a[0]][a[1]] = r),
            y.push((r ? "": "no-") + a.join("-"))
        }
    }
    function i() {
        return "function" != typeof n.createElement ? n.createElement(arguments[0]) : _ ? n.createElementNS.call(n, "http://www.w3.org/2000/svg", arguments[0]) : n.createElement.apply(n, arguments)
    }
    function a(e) {
        return e.replace(/([a-z])-([a-z])/g,
        function(e, n, t) {
            return n + t.toUpperCase()
        }).replace(/^-/, "")
    }
    function f() {
        var e = n.body;
        return e || (e = i(_ ? "svg": "body"), e.fake = !0),
        e
    }
    function u(e, t, r, s) {
        var o, a, u, l, p = "modernizr",
        d = i("div"),
        c = f();
        if (parseInt(r, 10)) for (; r--;) u = i("div"),
        u.id = s ? s[r] : p + (r + 1),
        d.appendChild(u);
        return o = i("style"),
        o.type = "text/css",
        o.id = "s" + p,
        (c.fake ? c: d).appendChild(o),
        c.appendChild(d),
        o.styleSheet ? o.styleSheet.cssText = e: o.appendChild(n.createTextNode(e)),
        d.id = p,
        c.fake && (c.style.background = "", c.style.overflow = "hidden", l = S.style.overflow, S.style.overflow = "hidden", S.appendChild(c)),
        a = t(d, e),
        c.fake ? (c.parentNode.removeChild(c), S.style.overflow = l, S.offsetHeight) : d.parentNode.removeChild(d),
        !!a
    }
    function l(e, n) {
        return !! ~ ("" + e).indexOf(n)
    }
    function p(e, n) {
        return function() {
            return e.apply(n, arguments)
        }
    }
    function d(e, n, t) {
        var r;
        for (var o in e) if (e[o] in n) return t === !1 ? e[o] : (r = n[e[o]], s(r, "function") ? p(r, t || n) : r);
        return ! 1
    }
    function c(e) {
        return e.replace(/([A-Z])/g,
        function(e, n) {
            return "-" + n.toLowerCase()
        }).replace(/^ms-/, "-ms-")
    }
    function m(n, r) {
        var s = n.length;
        if ("CSS" in e && "supports" in e.CSS) {
            for (; s--;) if (e.CSS.supports(c(n[s]), r)) return ! 0;
            return ! 1
        }
        if ("CSSSupportsRule" in e) {
            for (var o = []; s--;) o.push("(" + c(n[s]) + ":" + r + ")");
            return o = o.join(" or "),
            u("@supports (" + o + ") { #modernizr { position: absolute; } }",
            function(e) {
                return "absolute" == getComputedStyle(e, null).position
            })
        }
        return t
    }
    function v(e, n, r, o) {
        function f() {
            p && (delete L.style, delete L.modElem)
        }
        if (o = s(o, "undefined") ? !1 : o, !s(r, "undefined")) {
            var u = m(e, r);
            if (!s(u, "undefined")) return u
        }
        for (var p, d, c, v, h, g = ["modernizr", "tspan"]; ! L.style;) p = !0,
        L.modElem = i(g.shift()),
        L.style = L.modElem.style;
        for (c = e.length, d = 0; c > d; d++) if (v = e[d], h = L.style[v], l(v, "-") && (v = a(v)), L.style[v] !== t) {
            if (o || s(r, "undefined")) return f(),
            "pfx" == n ? v: !0;
            try {
                L.style[v] = r
            } catch(y) {}
            if (L.style[v] != h) return f(),
            "pfx" == n ? v: !0
        }
        return f(),
        !1
    }
    function h(e, n, t, r, o) {
        var i = e.charAt(0).toUpperCase() + e.slice(1),
        a = (e + " " + E.join(i + " ") + i).split(" ");
        return s(n, "string") || s(n, "undefined") ? v(a, n, r, o) : (a = (e + " " + N.join(i + " ") + i).split(" "), d(a, n, t))
    }
    function g(e, n, r) {
        return h(e, t, t, n, r)
    }
    var y = [],
    x = [],
    C = {
        _version: "3.1.0",
        _config: {
            classPrefix: "chrg_",
            enableClasses: !0,
            enableJSClass: !0,
            usePrefixes: !0
        },
        _q: [],
        on: function(e, n) {
            var t = this;
            setTimeout(function() {
                n(t[e])
            },
            0)
        },
        addTest: function(e, n, t) {
            x.push({
                name: e,
                fn: n,
                options: t
            })
        },
        addAsyncTest: function(e) {
            x.push({
                name: null,
                fn: e
            })
        }
    },
    Modernizr = function() {};
    Modernizr.prototype = C,
    Modernizr = new Modernizr;
    var S = n.documentElement,
    _ = "svg" === S.nodeName.toLowerCase(),
    w = C._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : [];
    C._prefixes = w;
    var b = "CSS" in e && "supports" in e.CSS,
    T = "supportsCSS" in e;
    Modernizr.addTest("supports", b || T);
    var z = C.testStyles = u;
    Modernizr.addTest("touchevents",
    function() {
        var t;
        if ("ontouchstart" in e || e.DocumentTouch && n instanceof DocumentTouch) t = !0;
        else {
            var r = ["@media (", w.join("touch-enabled),("), "heartz", ")", "{#modernizr{top:9px;position:absolute}}"].join("");
            z(r,
            function(e) {
                t = 9 === e.offsetTop
            })
        }
        return t
    });
    var P = "Moz O ms Webkit",
    E = C._config.usePrefixes ? P.split(" ") : [];
    C._cssomPrefixes = E;
    var j = function(n) {
        var r, s = w.length,
        o = e.CSSRule;
        if ("undefined" == typeof o) return t;
        if (!n) return ! 1;
        if (n = n.replace(/^@/, ""), r = n.replace(/-/g, "_").toUpperCase() + "_RULE", r in o) return "@" + n;
        for (var i = 0; s > i; i++) {
            var a = w[i],
            f = a.toUpperCase() + "_" + r;
            if (f in o) return "@-" + a.toLowerCase() + "-" + n
        }
        return ! 1
    };
    C.atRule = j;
    var N = C._config.usePrefixes ? P.toLowerCase().split(" ") : [];
    C._domPrefixes = N;
    var k = {
        elem: i("modernizr")
    };
    Modernizr._q.push(function() {
        delete k.elem
    });
    var L = {
        style: k.elem.style
    };
    Modernizr._q.unshift(function() {
        delete L.style
    }),
    C.testAllProps = h;
    var A = C.prefixed = function(e, n, t) {
        return 0 === e.indexOf("@") ? j(e) : ( - 1 != e.indexOf("-") && (e = a(e)), n ? h(e, n, t) : h(e, "pfx"))
    };
    Modernizr.addTest("fullscreen", !(!A("exitFullscreen", n, !1) && !A("cancelFullScreen", n, !1))),
    C.testAllProps = g,
    Modernizr.addTest("cssanimations", g("animationName", "a", !0)),
    Modernizr.addTest("cssfilters",
    function() {
        if (Modernizr.supports) return g("filter", "blur(2px)");
        var e = i("a");
        return e.style.cssText = w.join("filter:blur(2px); "),
        !!e.style.length && (n.documentMode === t || n.documentMode > 9)
    }),
    Modernizr.addTest("csstransforms3d",
    function() {
        var e = !!g("perspective", "1px", !0),
        n = Modernizr._config.usePrefixes;
        if (e && (!n || "webkitPerspective" in S.style)) {
            var t;
            Modernizr.supports ? t = "@supports (perspective: 1px)": (t = "@media (transform-3d)", n && (t += ",(-webkit-transform-3d)")),
            t += "{#modernizr{left:9px;position:absolute;height:5px;margin:0;padding:0;border:0}}",
            z(t,
            function(n) {
                e = 9 === n.offsetLeft && 5 === n.offsetHeight
            })
        }
        return e
    }),
    Modernizr.addTest("csstransitions", g("transition", "all", !0)),
    o(),
    r(y),
    delete C.addTest,
    delete C.addAsyncTest;
    for (var O = 0; O < Modernizr._q.length; O++) Modernizr._q[O]();
    e.Modernizr = Modernizr
} (window, document);

/*
 *  Project: Chroma Gallery
 *  Description: A Gallery that shows the colors of the pictures
 *  Author: codecrafting.net
 *  License:under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * Color Thief v2.0
 * by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * License
 * -------
 * Creative Commons Attribution 2.5 License:
 * http://creativecommons.org/licenses/by/2.5/
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 * quantize.js Copyright 2008 Nick Rabinowitz.
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * Block below copied from Protovis: http://mbostock.github.com/protovis/
 * Copyright 2010 Stanford Visualization Group
 * Licensed under the BSD License: http://www.opensource.org/licenses/bsd-license.php
 */

!
function(t, e, i, n) {
    function r() {
        for (var t, e = ["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"], n = 0; n < e.length; n++) if ("undefined" != typeof i.body.style[e[n]]) {
            t = e[n];
            break
        }
        switch (t) {
        case "msTransform":
            return "-ms-";
        case "webkitTransform":
            return "-webkit-";
        case "mozTransform":
            return "-moz-";
        case "oTransform":
            return "-o-";
        default:
            return ""
        }
    }
    function s(t) {
        var n, r = i.createElement("div");
        return r.style.color = t,
        i.body.appendChild(r),
        n = e.getComputedStyle(r).color,
        i.body.removeChild(r),
        n
    }
    function o(t) {
        return "string" == typeof t ? t.split(/[?#]/)[0].split("/").pop() : n
    }
    function c(t) {
        for (var e in t) if (t.hasOwnProperty(e)) {
            var i = t[e];
            switch (e) {
            case "color":
                "string" != typeof i && (t[e] = w[e]);
                break;
            case "maxColumns":
                var n = parseInt(i, 10);
                n != i ? t[e] = w[e] : 0 == n && (t[e] = w[e]);
                break;
            case "items":
                null === i || Array.isArray(i) || (t[e] = []);
                break;
            case "dof":
                "boolean" == typeof i && Modernizr.cssfilters || (t[e] = w[e]);
                break;
            case "screenOpacity":
                "number" != typeof i && (t[e] = w[e]);
                break;
            case "lazyLoad":
                "boolean" != typeof i && (t[e] = w[e]);
                break;
            case "gridMargin":
                var n = parseInt(i, 10);
                n != i && (t[e] = w[e]);
                break;
            case "fullscreen":
                "boolean" != typeof i && (t[e] = w[e]),
                Modernizr.fullscreen || (t[e] = !1);
                break;
            case "easing":
                "string" != typeof i && (t[e] = w[e]);
                break;
            case "onLoad":
                "function" != typeof i && (t[e] = w[e]);
                break;
            case "onOpen":
                "function" != typeof i && (t[e] = w[e]);
                break;
            case "onClose":
                "function" != typeof i && (t[e] = w[e]);
                break;
            case "onNext":
                "function" != typeof i && (t[e] = w[e]);
                break;
            case "onPrevious":
                "function" != typeof i && (t[e] = w[e]);
                break;
            case "onFullscreen":
                "function" != typeof i && (t[e] = w[e])
            }
        }
    }
    function a(e, i) {
        var n = this;
        this.$el = t(e),
        this.isLoaded = !1,
        this.grid = null,
        this.settings = t.extend({},
        w, i),
        c(this.settings),
        "chroma" != this.settings.color && (this.settings.color = s(this.settings.color)),
        null == y && (y = new l, this.$el.append("<span class='chrg-loadicon chrgi-image'></span>"), setTimeout(function() {
            n.$el.find(".chrg-loadicon").remove()
        },
        100)),
        this._init()
    }
    function l() {
        this.colorThief = new u,
        this.settings = null,
        this.isOpen = !1,
        this.isFullscreen = !1,
        this.curItem = null,
        this.curGallery = null,
        this.init()
    }
    var h = function(t) {
        this.canvas = i.createElement("canvas"),
        this.context = this.canvas.getContext("2d"),
        i.body.appendChild(this.canvas),
        this.width = this.canvas.width = t.width,
        this.height = this.canvas.height = t.height,
        this.context.drawImage(t, 0, 0, this.width, this.height)
    };
    h.prototype.clear = function() {
        this.context.clearRect(0, 0, this.width, this.height)
    },
    h.prototype.update = function(t) {
        this.context.putImageData(t, 0, 0)
    },
    h.prototype.getPixelCount = function() {
        return this.width * this.height
    },
    h.prototype.getImageData = function() {
        return this.context.getImageData(0, 0, this.width, this.height)
    },
    h.prototype.removeCanvas = function() {
        this.canvas.parentNode.removeChild(this.canvas)
    };
    var u = function() {};
    if (u.prototype.getColor = function(t, e) {
        var i = this.getPalette(t, 5, e),
        n = i[0];
        return n
    },
    u.prototype.getPalette = function(t, e, i) {
        "undefined" == typeof e && (e = 10),
        ("undefined" == typeof i || 1 > i) && (i = 10);
        for (var n, r, s, o, c, a = new h(t), l = a.getImageData(), u = l.data, g = a.getPixelCount(), f = [], p = 0; g > p; p += i) n = 4 * p,
        r = u[n + 0],
        s = u[n + 1],
        o = u[n + 2],
        c = u[n + 3],
        c >= 125 && (r > 250 && s > 250 && o > 250 || f.push([r, s, o]));
        var m = d.quantize(f, e),
        v = m ? m.palette() : null;
        return a.removeCanvas(),
        v
    },
    !g) var g = {
        map: function(t, e) {
            var i = {};
            return e ? t.map(function(t, n) {
                return i.index = n,
                e.call(i, t)
            }) : t.slice()
        },
        naturalOrder: function(t, e) {
            return e > t ? -1 : t > e ? 1 : 0
        },
        sum: function(t, e) {
            var i = {};
            return t.reduce(e ?
            function(t, n, r) {
                return i.index = r,
                t + e.call(i, n)
            }: function(t, e) {
                return t + e
            },
            0)
        },
        max: function(t, e) {
            return Math.max.apply(null, e ? g.map(t, e) : t)
        }
    };
    var d = function() {
        function t(t, e, i) {
            return (t << 2 * a) + (e << a) + i
        }
        function e(t) {
            function e() {
                i.sort(t),
                n = !0
            }
            var i = [],
            n = !1;
            return {
                push: function(t) {
                    i.push(t),
                    n = !1
                },
                peek: function(t) {
                    return n || e(),
                    void 0 === t && (t = i.length - 1),
                    i[t]
                },
                pop: function() {
                    return n || e(),
                    i.pop()
                },
                size: function() {
                    return i.length
                },
                map: function(t) {
                    return i.map(t)
                },
                debug: function() {
                    return n || e(),
                    i
                }
            }
        }
        function i(t, e, i, n, r, s, o) {
            var c = this;
            c.r1 = t,
            c.r2 = e,
            c.g1 = i,
            c.g2 = n,
            c.b1 = r,
            c.b2 = s,
            c.histo = o
        }
        function n() {
            this.vboxes = new e(function(t, e) {
                return g.naturalOrder(t.vbox.count() * t.vbox.volume(), e.vbox.count() * e.vbox.volume())
            })
        }
        function r(e) {
            var i, n, r, s, o = 1 << 3 * a,
            c = new Array(o);
            return e.forEach(function(e) {
                n = e[0] >> l,
                r = e[1] >> l,
                s = e[2] >> l,
                i = t(n, r, s),
                c[i] = (c[i] || 0) + 1
            }),
            c
        }
        function s(t, e) {
            var n, r, s, o = 1e6,
            c = 0,
            a = 1e6,
            h = 0,
            u = 1e6,
            g = 0;
            return t.forEach(function(t) {
                n = t[0] >> l,
                r = t[1] >> l,
                s = t[2] >> l,
                o > n ? o = n: n > c && (c = n),
                a > r ? a = r: r > h && (h = r),
                u > s ? u = s: s > g && (g = s)
            }),
            new i(o, c, a, h, u, g, e)
        }
        function o(e, i) {
            function n(t) {
                var e, n, r, s, o, c = t + "1",
                l = t + "2",
                h = 0;
                for (a = i[c]; a <= i[l]; a++) if (p[a] > f / 2) {
                    for (r = i.copy(), s = i.copy(), e = a - i[c], n = i[l] - a, o = n >= e ? Math.min(i[l] - 1, ~~ (a + n / 2)) : Math.max(i[c], ~~ (a - 1 - e / 2)); ! p[o];) o++;
                    for (h = m[o]; ! h && p[o - 1];) h = m[--o];
                    return r[l] = o,
                    s[c] = r[l] + 1,
                    [r, s]
                }
            }
            if (i.count()) {
                var r = i.r2 - i.r1 + 1,
                s = i.g2 - i.g1 + 1,
                o = i.b2 - i.b1 + 1,
                c = g.max([r, s, o]);
                if (1 == i.count()) return [i.copy()];
                var a, l, h, u, d, f = 0,
                p = [],
                m = [];
                if (c == r) for (a = i.r1; a <= i.r2; a++) {
                    for (u = 0, l = i.g1; l <= i.g2; l++) for (h = i.b1; h <= i.b2; h++) d = t(a, l, h),
                    u += e[d] || 0;
                    f += u,
                    p[a] = f
                } else if (c == s) for (a = i.g1; a <= i.g2; a++) {
                    for (u = 0, l = i.r1; l <= i.r2; l++) for (h = i.b1; h <= i.b2; h++) d = t(l, a, h),
                    u += e[d] || 0;
                    f += u,
                    p[a] = f
                } else for (a = i.b1; a <= i.b2; a++) {
                    for (u = 0, l = i.r1; l <= i.r2; l++) for (h = i.g1; h <= i.g2; h++) d = t(l, h, a),
                    u += e[d] || 0;
                    f += u,
                    p[a] = f
                }
                return p.forEach(function(t, e) {
                    m[e] = f - t
                }),
                n(c == r ? "r": c == s ? "g": "b")
            }
        }
        function c(t, i) {
            function c(t, e) {
                for (var i, n = 1,
                r = 0; h > r;) if (i = t.pop(), i.count()) {
                    var s = o(a, i),
                    c = s[0],
                    l = s[1];
                    if (!c) return;
                    if (t.push(c), l && (t.push(l), n++), n >= e) return;
                    if (r++>h) return
                } else t.push(i),
                r++
            }
            if (!t.length || 2 > i || i > 256) return ! 1;
            var a = r(t),
            l = 0;
            a.forEach(function() {
                l++
            });
            var d = s(t, a),
            f = new e(function(t, e) {
                return g.naturalOrder(t.count(), e.count())
            });
            f.push(d),
            c(f, u * i);
            for (var p = new e(function(t, e) {
                return g.naturalOrder(t.count() * t.volume(), e.count() * e.volume())
            }); f.size();) p.push(f.pop());
            c(p, i - p.size());
            for (var m = new n; p.size();) m.push(p.pop());
            return m
        }
        var a = 5,
        l = 8 - a,
        h = 1e3,
        u = .75;
        return i.prototype = {
            volume: function(t) {
                var e = this;
                return (!e._volume || t) && (e._volume = (e.r2 - e.r1 + 1) * (e.g2 - e.g1 + 1) * (e.b2 - e.b1 + 1)),
                e._volume
            },
            count: function(e) {
                var i = this,
                n = i.histo;
                if (!i._count_set || e) {
                    var r, s, o, c = 0;
                    for (r = i.r1; r <= i.r2; r++) for (s = i.g1; s <= i.g2; s++) for (o = i.b1; o <= i.b2; o++) index = t(r, s, o),
                    c += n[index] || 0;
                    i._count = c,
                    i._count_set = !0
                }
                return i._count
            },
            copy: function() {
                var t = this;
                return new i(t.r1, t.r2, t.g1, t.g2, t.b1, t.b2, t.histo)
            },
            avg: function(e) {
                var i = this,
                n = i.histo;
                if (!i._avg || e) {
                    var r, s, o, c, l, h = 0,
                    u = 1 << 8 - a,
                    g = 0,
                    d = 0,
                    f = 0;
                    for (s = i.r1; s <= i.r2; s++) for (o = i.g1; o <= i.g2; o++) for (c = i.b1; c <= i.b2; c++) l = t(s, o, c),
                    r = n[l] || 0,
                    h += r,
                    g += r * (s + .5) * u,
                    d += r * (o + .5) * u,
                    f += r * (c + .5) * u;
                    i._avg = h ? [~~ (g / h), ~~ (d / h), ~~ (f / h)] : [~~ (u * (i.r1 + i.r2 + 1) / 2), ~~ (u * (i.g1 + i.g2 + 1) / 2), ~~ (u * (i.b1 + i.b2 + 1) / 2)]
                }
                return i._avg
            },
            contains: function(t) {
                var e = this,
                i = t[0] >> l;
                return gval = t[1] >> l,
                bval = t[2] >> l,
                i >= e.r1 && i <= e.r2 && gval >= e.g1 && gval <= e.g2 && bval >= e.b1 && bval <= e.b2
            }
        },
        n.prototype = {
            push: function(t) {
                this.vboxes.push({
                    vbox: t,
                    color: t.avg()
                })
            },
            palette: function() {
                return this.vboxes.map(function(t) {
                    return t.color
                })
            },
            size: function() {
                return this.vboxes.size()
            },
            map: function(t) {
                for (var e = this.vboxes,
                i = 0; i < e.size(); i++) if (e.peek(i).vbox.contains(t)) return e.peek(i).color;
                return this.nearest(t)
            },
            nearest: function(t) {
                for (var e, i, n, r = this.vboxes,
                s = 0; s < r.size(); s++) i = Math.sqrt(Math.pow(t[0] - r.peek(s).color[0], 2) + Math.pow(t[1] - r.peek(s).color[1], 2) + Math.pow(t[2] - r.peek(s).color[2], 2)),
                (e > i || void 0 === e) && (e = i, n = r.peek(s).color);
                return n
            },
            forcebw: function() {
                var t = this.vboxes;
                t.sort(function(t, e) {
                    return g.naturalOrder(g.sum(t.color), g.sum(e.color))
                });
                var e = t[0].color;
                e[0] < 5 && e[1] < 5 && e[2] < 5 && (t[0].color = [0, 0, 0]);
                var i = t.length - 1,
                n = t[i].color;
                n[0] > 251 && n[1] > 251 && n[2] > 251 && (t[i].color = [255, 255, 255])
            }
        },
        {
            quantize: c
        }
    } (),
    f = "chromaGallery",
    p = t(e),
    m = t("body"),
    v = 350,
    y = null,
    b = r(),
    w = (e.location.protocol + "//" + e.location.host + e.location.pathname, {
        color: "chroma",
        maxColumns: 4,
        items: null,
        dof: !1,
        screenOpacity: .98,
        lazyLoad: !0,
        gridMargin: 7,
        fullscreen: !0,
        easing: "easeInOutQuart",
        onLoad: function() {},
        onOpen: function() {},
        onClose: function() {},
        onNext: function() {},
        onPrev: function() {},
        onFullscreen: function() {}
    }),
    x = {
        next: 39,
        prev: 37,
        fullscreen: 70,
        close: 27
    };
    t.extend(a.prototype, {
        _init: function() {
            var e = this;
            this.$el.hasClass("chroma-gallery") || this.$el.addClass("chroma-gallery"),
            this.$el.show(),
            setTimeout(function() {
                var i = 0;
                e._createGrid(),
                e._setEvents(),
                e.grid.find("img").imagesLoaded().always(function() {
                    e.isLoaded = !0,
                    e.$el.trigger("chrg.load")
                }).progress(function(r, s) {
                    var c = t(s.img),
                    a = e.settings.lazyLoad ? 150 * i: 0;
                    if (i++, s.isLoaded) {
                        var l = c.attr("alt") !== n ? c.attr("alt").substring(0, 144) : "";
                        c.parent().attr("data-isloaded", "true"),
                        c.parent().find("p").append(l),
                        setTimeout(function() {
                            c.parent().css({
                                opacity: "1"
                            }),
                            e.grid.masonry("layout")
                        },
                        a)
                    } else c.parent().find("p").append("<span class='chrgi-image'></span><br>" + o(c.attr("src")) + " failed to load"),
                    c.parent().attr("data-isloaded", "false").css({
                        cursor: "default"
                    }),
                    c.css({
                        height: "200px",
                        opacity: "0"
                    }),
                    setTimeout(function() {
                        c.parent().css({
                            opacity: "1"
                        }),
                        c.parent().find(".chrg-description").css({
                            opacity: "1"
                        }),
                        e.grid.masonry("layout")
                    },
                    a)
                })
            },
            50)
        },
        _getColumnWidth: function(t) {
            var e, i = this.$el.width();
            return e = 400 >= i ? 2 : i / this.settings.maxColumns >= 200 ? Math.min(this.settings.maxColumns, t) : Math.floor(i / 200),
            this.settings.gridMargin > 0 ? 100 / e * ((i - e * this.settings.gridMargin) / i) : 100 / e
        },
        _createGrid: function() {
            var t = this;
            if (this.settings.items) {
                var e = this._getColumnWidth(this.settings.items.length);
                this.$el.html("<div class='chrg-grid'></div>"),
                this.grid = this.$el.find(".chrg-grid");
                for (var i = 0; i < this.settings.items.length; i++) this.settings.items[i].src && this.settings.items[i].alt && this.settings.items[i].largesrc && this.grid.append("<div class='chrg-item chrg-no-select' style='width:" + e + "%; margin-bottom:" + this.settings.gridMargin + "px;'><img src='" + this.settings.items[i].src + "' alt='" + this.settings.items[i].alt + "' data-largesrc='" + this.settings.items[i].largesrc + "'/><div class='chrg-description'><p></p></div></div>")
            } else {
                var e = this._getColumnWidth(this.$el.find("img").length);
                this.$el.append("<div class='chrg-grid'></div>"),
                this.grid = this.$el.find(".chrg-grid"),
                this.$el.find("img").wrap("<div class='chrg-item chrg-no-select' style='width:" + e + "%; margin-bottom:" + this.settings.gridMargin + "px;'></div>").parent().append("<div class='chrg-description'><p></p></div>"),
                this.grid.append(this.$el.find(".chrg-item"))
            }
            this.grid.masonry({
                itemSelector: ".chrg-item",
                gutter: t.settings.gridMargin,
                percentPosition: !0
            })
        },
        _reloadGrid: function() {
            var t = this._getColumnWidth(this.grid.find(".chrg-item").length);
            this.grid.find(".chrg-item").css("width", t + "%"),
            this.grid.masonry("layout")
        },
        _setEvents: function() {
            var i = this;
            this.grid.find(".chrg-item").on("click",function() {
                i.openImg(t(i).index())
            }),
            this.$el.on("chrg.load",function() {
                i.settings.onLoad.call(i.$el)
            }),
            this.$el.on("chrg.openImg", function() {
                i.settings.onOpen.call(i.$el)
            }),
            this.$el.on("chrg.closeImg",function() {
                i.settings.onClose.call(i.$el)
            }),
            this.$el.on("chrg.next", function() {
                i.settings.onNext.call(i.$el)
            }),
            this.$el.on("chrg.prev", function() {
                i.settings.onPrev.call(i.$el)
            }),
            this.$el.on("chrg.fullscreen", function() {
                i.settings.onFullscreen.call(i.$el)
            }),
            p.resize(function() {
                i.isLoaded && i._reloadGrid()
            }),
            e.addEventListener("orientationchange",
            function() {
                i.isLoaded && i._reloadGrid()
            })
        },
        openImg: function(e) {
            if (!y.isOpen && this.isLoaded) {
                var i = t(this.grid.find(".chrg-item").get(e));
                i.length > 0 && i.data("isloaded") && (y.curGallery = this.$el, y.curItem = i, y.settings = {
                    color: this.settings.color,
                    dof: this.settings.dof,
                    screenOpacity: this.settings.screenOpacity,
                    fullscreen: this.settings.fullscreen,
                    easing: this.settings.easing
                },
                y.openImg())
            }
        },
        closeImg: function() {
            y.isOpen && y.closeImg()
        },
        goTo: function(e) {
            if (y.isOpen && !y.lock) {
                var i = t(this.grid.find(".chrg-item").get(e));
                i.length > 0 && i.data("isloaded") && y.goTo(i)
            }
        },
        next: function() {
            y.isOpen && !y.lock && y.next()
        },
        prev: function() {
            y.isOpen && !y.lock && y.prev()
        }
    }),
    t.extend(l.prototype, {
        init: function() {debugger
        	parent.$(".chroma-screen").remove();
        	m = $(window.parent.document.body);
        	m.append("<div class='chroma-screen'><div class='chrg-bg'></div><div class='chrg-wrap'><div class='chrg-content'><div class='chrg-imgwrap'></div></div><div class='chrg-ui'><button class='chrgi-close chrg-no-select'></button><button class='chrg-fullscreen chrgi-maximize chrg-no-select'></button><button class='chrgi-next chrg-no-select'></button><button class='chrgi-previous chrg-no-select'></button><div class='chrg-loader'><div class='chrg-loader-line-wrap-wrap'><div class='chrg-loader-line-wrap'></div></div><div class='chrg-loader-line-wrap-wrap'><div class='chrg-loader-line-wrap'></div></div><div class='chrg-loader-line-wrap-wrap'><div class='chrg-loader-line-wrap'></div></div><div class='chrg-loader-line-wrap-wrap'><div class='chrg-loader-line-wrap'></div></div><div class='chrg-loader-line-wrap-wrap'><div class='chrg-loader-line-wrap'></div></div></div></div></div></div>"),
            this.$screen = m.find(".chroma-screen");
            this.$imgWrap = this.$screen.find(".chrg-imgwrap");
            this.$fullscreenBtn = this.$screen.find(".chrg-fullscreen");
            this.$loader = this.$screen.find(".chrg-loader");
            this.$ui = this.$screen.find(".chrg-ui");
            this.$bg = this.$screen.find(".chrg-bg");
            this.lock = !1,
            this.setEvents()
        },
        setEvents: function() {
            var t = this;
            this.$screen.find(".chrgi-close").on("click",function(e) {
                e.stopPropagation(),
                t.closeImg()
            }),
            this.$screen.find(".chrgi-next").on("click",function(e) {
                e.stopPropagation(),
                t.next()
            }),
            this.$imgWrap.on("click",function(t) {
                t.stopPropagation()
            }),
            this.$screen.find(".chrgi-previous").on("click",function(e) {
                e.stopPropagation(),
                t.prev()
            }),
            p.resize(function() {
                t.isOpen && t.resizeImgWrap()
            }),
            e.addEventListener("orientationchange",
            function() {
                t.isOpen && t.resizeImgWrap()
            }),
            p.keydown(function(e) {
                if (t.isOpen) switch (e.keyCode) {
                case x.next:
                    t.next();
                    break;
                case x.prev:
                    t.prev();
                    break;
                case x.close:
                    t.closeImg()
                }
            }),
            Modernizr.touchevents || this.$screen.find(".chrg-wrap").on("click",
            function() {
                t.closeImg()
            }),
            Modernizr.fullscreen && this.$fullscreenBtn.on("click",function(e) {
                top.e.stopPropagation(),
                top.t.toggleFullscreen()
            })
        },
        toggleFullscreen: function() {
            i.fullscreenElement || i.mozFullScreenElement || i.webkitFullscreenElement || i.msFullscreenElement ? (this.isFullscreen = !1, this.$fullscreenBtn.removeClass("chrgi-minimize").addClass("chrgi-maximize"), i.exitFullscreen ? i.exitFullscreen() : i.msExitFullscreen ? i.msExitFullscreen() : i.mozCancelFullScreen ? i.mozCancelFullScreen() : i.webkitExitFullscreen && i.webkitExitFullscreen()) : (this.isFullscreen = !0, this.$fullscreenBtn.removeClass("chrgi-maximize").addClass("chrgi-minimize"), this.curGallery.trigger("chrg.fullscreen"), i.documentElement.requestFullscreen ? i.documentElement.requestFullscreen() : i.documentElement.msRequestFullscreen ? i.documentElement.msRequestFullscreen() : i.documentElement.mozRequestFullScreen ? i.documentElement.mozRequestFullScreen() : i.documentElement.webkitRequestFullscreen && i.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT))
        },
        resizeImgWrap: function() {
            var t, e = {
                w: this.curItem.width(),
                h: this.curItem.height()
            },
            i = Math.min(.92 * p.width() / e.w, .92 * p.height() / e.h),
            n = {
                x: (p.width() - e.w * i) / 2,
                y: (p.height() - e.h * i) / 2
            };
            t = {
                width: e.w * i,
                height: e.h * i
            },
            t[b + "transform"] = Modernizr.csstransforms3d ? "translate3d(" + n.x + "px," + n.y + "px,0) scale(1)": "translate(" + n.x + "px," + n.y + "px) scale(1)",
            this.$imgWrap.css(t)
        },
        loadImg: function(t) {
            var e = this,
            i = new Image;
            Modernizr.cssanimations && this.$loader.show(),
            i.onload = function() {
                e.$imgWrap.append(this),
                Modernizr.cssanimations && e.$loader.hide()
            },
            i.onerror = function() {
                e.$loader.hide()
            },
            i.src = t.data("largesrc")
        },
        getRGBColor: function(t) {
            if ("chroma" == this.settings.color) {
                if (t.data("color") === n) {
                    var e, i = this.colorThief.getColor(t[0]);
                    return e = i && 3 == i.length ? "rgb(" + i[0] + "," + i[1] + "," + i[2] + ")": "rgb(0,0,0)",
                    t.attr("data-color", e),
                    e
                }
                return t.data("color")
            }
            return this.settings.color
        },
        openImg: function() {
            if (!this.lock) {
                this.lock = !0;
                var t, e, i = this,
                n = this.curItem.offset(),
                r = this.getRGBColor(this.curItem.find("img")),
                s = {
                    width: .92 * p.width(),
                    height: .92 * p.height()
                },
                o = this.curItem.find("img").clone();
                this.$imgWrap.html(""),
                this.settings.fullscreen ? this.$fullscreenBtn.show() : this.$fullscreenBtn.hide(),
                t = Math.min(s.width / this.curItem.width(), s.height / this.curItem.height()),
                e = {
                    x: n.left - p.scrollLeft(),
                    y: n.top - p.scrollTop(),
                    width: this.curItem.width() * t,
                    height: this.curItem.height() * t
                },
                this.$imgWrap.css({
                    width: e.width,
                    height: e.height
                }),
                Modernizr.csstransforms3d ? this.$imgWrap.css(b + "transform", "translate3d(" + e.x + "px," + e.y + "px,0) scale(" + 1 / t + ")") : this.$imgWrap.css(b + "transform", "translate(" + e.x + "px," + e.y + "px) scale(" + 1 / t + ")"),
                this.settings.dof && (m.wrapInner("<div class='chrg-dof-body'></div>"), this.$screen.appendTo(m)),
                e.x = (p.width() - e.width) / 2,
                e.y = (p.height() - e.height) / 2,
                this.$imgWrap.addClass("chrg-animation chrg-easing-" + this.settings.easing),
                this.$imgWrap.append(o),
                this.$screen.show(),
                this.isOpen = !0,
                setTimeout(function() {
                	i.curItem.css("visibility", "hidden"),
                    i.$ui.css("opacity", .01),
                    i.$ui.css("opacity", 1),
                    i.$bg.css("opacity", .01),
                    i.$bg.css({
                        opacity: i.settings.screenOpacity,
                        "background-color": r
                    }),
                    i.settings.dof && m.find(".chrg-dof-body").addClass("chrg-dof-effect"),
                    Modernizr.cssanimations && i.$loader.show(),
                    Modernizr.csstransforms3d ? i.$imgWrap.css(b + "transform", "translate3d(" + e.x + "px," + e.y + "px,0) scale(1)") : i.$imgWrap.css(b + "transform", "translate(" + e.x + "px," + e.y + "px) scale(1)"),
                    setTimeout(function() {
                        i.lock = !1,
                        i.curGallery.trigger("chrg.openImg"),
                        i.loadImg(o)
                    },
                    v + 50)
                },
                80)
            }
        },
        closeImg: function() {
            if (this.isOpen && !this.lock) {
                this.lock = !0;
                var t = this,
                e = this.curItem.width() / this.$imgWrap.width(),
                i = this.curItem.offset(),
                n = {
                    x: i.left - p.scrollLeft(),
                    y: i.top - p.scrollTop()
                };
                this.$imgWrap.find("img:nth-child(2)").hide(),
                this.$ui.css("opacity", ""),
                this.$bg.css("opacity", ""),
                this.settings.dof && m.find(".chrg-dof-body").contents().unwrap(),
                setTimeout(function() {
                    Modernizr.csstransforms3d ? t.$imgWrap.css(b + "transform", "translate3d(" + n.x + "px," + n.y + "px,0) scale(" + e + ")") : t.$imgWrap.css(b + "transform", "translate(" + n.x + "px," + n.y + "px) scale(" + e + ")"),
                    setTimeout(function() {
                        t.curItem.css("visibility", ""),
                        t.$imgWrap.attr("class", "chrg-imgwrap"),
                        t.curGallery.trigger("chrg.closeImg"),
                        setTimeout(function() {
                            t.curItem = null,
                            t.$screen.hide(),
                            Modernizr.fullscreen && t.isFullscreen && t.toggleFullscreen(),
                            t.curGallery = null,
                            t.isOpen = !1,
                            t.lock = !1
                        },
                        50)
                    },
                    v + 50)
                },
                50)
            }
        },
        next: function() {
            if (!this.lock) {
                this.lock = !0;
                var t = this,
                e = this.curItem.index(),
                i = e + 1 == this.curGallery.find(".chrg-item").length ? 0 : e + 1,
                n = this.curGallery.find(".chrg-item:eq(" + i + ")");
                this.goTo(n),
                t.curGallery.trigger("chrg.next")
            }
        },
        swipeNext: function() {},
        prev: function() {
            if (!this.lock) {
                this.lock = !0;
                var t = this,
                e = this.curItem.index(),
                i = 0 == e ? this.curGallery.find(".chrg-item").length - 1 : e - 1,
                n = this.curGallery.find(".chrg-item:eq(" + i + ")");
                this.goTo(n),
                t.curGallery.trigger("chrg.prev")
            }
        },
        swipePrev: function() {},
        goTo: function(t) {
            var e, i, n, r = this,
            s = t.find("img").clone(),
            o = this.getRGBColor(t.find("img")),
            c = {
                width: .92 * p.width(),
                height: .92 * p.height()
            };
            e = Math.min(c.width / t.width(), c.height / t.height()),
            i = {
                width: t.width() * e,
                height: t.height() * e,
                x: (p.width() - t.width() * e) / 2,
                y: (p.height() - t.height() * e) / 2
            },
            n = {
                width: i.width,
                height: i.height
            },
            n[b + "transform"] = Modernizr.csstransforms3d ? "translate3d(" + i.x + "px," + i.y + "px,0) scale(1)": "translate(" + i.x + "px," + i.y + "px) scale(1)",
            this.$imgWrap.removeClass("chrg-animation"),
            r.curItem.css("visibility", "visible"),
            r.$imgWrap.css(n),
            r.$imgWrap.html(""),
            r.$imgWrap.append(s),
            r.$bg.css({
                "background-color": o
            }),
            r.curItem = t,
            r.curItem.css("visibility", "hidden"),
            r.loadImg(s),
            setTimeout(function() {
                r.$imgWrap.addClass("chrg-animation"),
                r.lock = !1
            },
            50)
        }
    }),
    t.fn[f] = function(e) {
        var i = arguments;
        if (e === n || "object" == typeof e) return this.each(function() {
            t.data(this, "plugin_" + f) || t.data(this, "plugin_" + f, new a(this, e))
        });
        if ("string" == typeof e && "_" !== e[0] && "init" !== e) {
            var r;
            return this.each(function() {
                var n = t.data(this, "plugin_" + f);
                n instanceof a && "function" == typeof n[e] && (r = n[e].apply(n, Array.prototype.slice.call(i, 1))),
                "destroy" === e && t.data(this, "plugin_" + f, null)
            }),
            r !== n ? r: this
        }
    }
} (jQuery, window, document);