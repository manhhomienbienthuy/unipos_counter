// ==UserScript==
// @name         Unipos counter
// @version      1.0.1
// @description  Counter for unipos point
// @author       manhhomienbienthuy
// @match        https://unipos.me/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==
!function(t) {
    var e = {};
    function n(r) {
        if (e[r]) return e[r].exports;
        var o = e[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports;
    }
    n.m = t, n.c = e, n.d = function(t, e, r) {
        n.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: r
        });
    }, n.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        });
    }, n.t = function(t, e) {
        if (1 & e && (t = n(t)), 8 & e) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var r = Object.create(null);
        if (n.r(r), Object.defineProperty(r, "default", {
            enumerable: !0,
            value: t
        }), 2 & e && "string" != typeof t) for (var o in t) n.d(r, o, function(e) {
            return t[e];
        }.bind(null, o));
        return r;
    }, n.n = function(t) {
        var e = t && t.__esModule ? function() {
            return t.default;
        } : function() {
            return t;
        };
        return n.d(e, "a", e), e;
    }, n.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
    }, n.p = "", n(n.s = 6);
}([ function(t, e, n) {
    "use strict";
    n.r(e);
    var r = {
        MAX_REQUEST_RESULT: 5e5,
        API_URL: "https://unipos.me/q/jsonrpc",
        USER_ID_REGEX: /https:\/\/unipos.me\/.*?i=([a-f0-9-]+)/
    };
    var o = {
        getUserId() {
            const t = window.location.href.match(r.USER_ID_REGEX);
            return t && t[1];
        },
        getToken: () => window.localStorage.getItem("authnToken"),
        removeElement(t) {
            t && t.parentNode.removeChild(t);
        }
    };
    var i = {
        received() {
            return this._doRequest("received");
        },
        sent() {
            return this._doRequest("sent");
        },
        clapped() {
            return this._doRequest("clapped");
        },
        async _doRequest(t = "received") {
            let e, n = [], o = "";
            do {
                const r = this._getRequestData(t, o);
                if (!(e = await this._makeRequest(r)) || !e.length) break;
                n = n.concat(e), o = e[e.length - 1].id;
            } while (e.length < r.MAX_REQUEST_RESULT);
            return n;
        },
        async _makeRequest(t) {
            const e = {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "x-unipos-token": o.getToken()
                },
                cache: "no-cache",
                body: JSON.stringify(t)
            }, n = await fetch(r.API_URL, e);
            return (await n.json()).result;
        },
        _getRequestData(t = "received", e = "") {
            const n = o.getUserId(), i = {
                offset_card_id: e,
                count: r.MAX_REQUEST_RESULT
            };
            switch (t) {
              case "received":
                i.to_member_id = n;
                break;

              case "sent":
                i.from_member_id = n;
                break;

              case "clapped":
                i.praised_member_id = n;
            }
            return {
                jsonrpc: "2.0",
                method: "Unipos.GetCards2",
                id: "Unipos.GetCards2",
                params: i
            };
        }
    };
    class s {
        constructor() {
            this.totalReceivedPoint = 0, this.totalSentPoint = 0, this.totalClappedPoint = 0;
        }
        async count() {
            const t = await Promise.all([ i.received(), i.sent(), i.clapped() ]);
            this._calc(t), this._display();
        }
        _calc(t) {
            const e = t[0], n = t[1], r = t[2];
            e.forEach(t => {
                this.totalReceivedPoint += t.point, this.totalReceivedPoint += t.praise_count;
            }), n.forEach(t => {
                this.totalReceivedPoint += t.praise_count, this.totalSentPoint += t.point;
            }), r.forEach(t => {
                this.totalClappedPoint += 2 * t.praise_count, this.totalSentPoint += 2 * t.praise_count;
            });
        }
        _display() {
            let t = `\n            <div class="stats received">\n                <span class="highlight">${this.totalReceivedPoint}</span>\n                <h6>received</h6>\n            </div>\n            <div class="stats sent">\n                <span class="highlight">${this.totalSentPoint}</span>\n                <h6>sent</h6>\n            </div>\n            <div class="stats clapped">\n                <span class="highlight">${this.totalClappedPoint}</span>\n                <h6>clapped</h6>\n            </div>`;
            const e = document.createElement("div");
            e.setAttribute("id", "counter"), e.innerHTML = t, document.body.appendChild(e);
        }
    }
    let a = void 0, c = !1;
    new MutationObserver(async function() {
        const t = o.getUserId();
        if (!t) return void o.removeElement(document.getElementById("counter"));
        if (c || a === t) return;
        c = !0, o.removeElement(document.getElementById("counter"));
        const e = new s();
        await e.count(), a = t, c = !1;
    }).observe(document.body, {
        childList: !0,
        subtree: !0
    });
}, function(t, e) {
    t.exports = function(t) {
        var e = "undefined" != typeof window && window.location;
        if (!e) throw new Error("fixUrls requires window.location");
        if (!t || "string" != typeof t) return t;
        var n = e.protocol + "//" + e.host, r = n + e.pathname.replace(/\/[^\/]*$/, "/");
        return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(t, e) {
            var o, i = e.trim().replace(/^"(.*)"$/, function(t, e) {
                return e;
            }).replace(/^'(.*)'$/, function(t, e) {
                return e;
            });
            return /^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(i) ? t : (o = 0 === i.indexOf("//") ? i : 0 === i.indexOf("/") ? n + i : r + i.replace(/^\.\//, ""), 
            "url(" + JSON.stringify(o) + ")");
        });
    };
}, function(t, e, n) {
    var r, o, i = {}, s = (r = function() {
        return window && document && document.all && !window.atob;
    }, function() {
        return void 0 === o && (o = r.apply(this, arguments)), o;
    }), a = function(t) {
        var e = {};
        return function(t) {
            if ("function" == typeof t) return t();
            if (void 0 === e[t]) {
                var n = function(t) {
                    return document.querySelector(t);
                }.call(this, t);
                if (window.HTMLIFrameElement && n instanceof window.HTMLIFrameElement) try {
                    n = n.contentDocument.head;
                } catch (t) {
                    n = null;
                }
                e[t] = n;
            }
            return e[t];
        };
    }(), c = null, u = 0, l = [], f = n(1);
    function d(t, e) {
        for (var n = 0; n < t.length; n++) {
            var r = t[n], o = i[r.id];
            if (o) {
                o.refs++;
                for (var s = 0; s < o.parts.length; s++) o.parts[s](r.parts[s]);
                for (;s < r.parts.length; s++) o.parts.push(y(r.parts[s], e));
            } else {
                var a = [];
                for (s = 0; s < r.parts.length; s++) a.push(y(r.parts[s], e));
                i[r.id] = {
                    id: r.id,
                    refs: 1,
                    parts: a
                };
            }
        }
    }
    function p(t, e) {
        for (var n = [], r = {}, o = 0; o < t.length; o++) {
            var i = t[o], s = e.base ? i[0] + e.base : i[0], a = {
                css: i[1],
                media: i[2],
                sourceMap: i[3]
            };
            r[s] ? r[s].parts.push(a) : n.push(r[s] = {
                id: s,
                parts: [ a ]
            });
        }
        return n;
    }
    function h(t, e) {
        var n = a(t.insertInto);
        if (!n) throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
        var r = l[l.length - 1];
        if ("top" === t.insertAt) r ? r.nextSibling ? n.insertBefore(e, r.nextSibling) : n.appendChild(e) : n.insertBefore(e, n.firstChild), 
        l.push(e); else if ("bottom" === t.insertAt) n.appendChild(e); else {
            if ("object" != typeof t.insertAt || !t.insertAt.before) throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
            var o = a(t.insertInto + " " + t.insertAt.before);
            n.insertBefore(e, o);
        }
    }
    function v(t) {
        if (null === t.parentNode) return !1;
        t.parentNode.removeChild(t);
        var e = l.indexOf(t);
        e >= 0 && l.splice(e, 1);
    }
    function m(t) {
        var e = document.createElement("style");
        return void 0 === t.attrs.type && (t.attrs.type = "text/css"), b(e, t.attrs), h(t, e), 
        e;
    }
    function b(t, e) {
        Object.keys(e).forEach(function(n) {
            t.setAttribute(n, e[n]);
        });
    }
    function y(t, e) {
        var n, r, o, i;
        if (e.transform && t.css) {
            if (!(i = e.transform(t.css))) return function() {};
            t.css = i;
        }
        if (e.singleton) {
            var s = u++;
            n = c || (c = m(e)), r = R.bind(null, n, s, !1), o = R.bind(null, n, s, !0);
        } else t.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (n = function(t) {
            var e = document.createElement("link");
            return void 0 === t.attrs.type && (t.attrs.type = "text/css"), t.attrs.rel = "stylesheet", 
            b(e, t.attrs), h(t, e), e;
        }(e), r = function(t, e, n) {
            var r = n.css, o = n.sourceMap, i = void 0 === e.convertToAbsoluteUrls && o;
            (e.convertToAbsoluteUrls || i) && (r = f(r));
            o && (r += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(o)))) + " */");
            var s = new Blob([ r ], {
                type: "text/css"
            }), a = t.href;
            t.href = URL.createObjectURL(s), a && URL.revokeObjectURL(a);
        }.bind(null, n, e), o = function() {
            v(n), n.href && URL.revokeObjectURL(n.href);
        }) : (n = m(e), r = function(t, e) {
            var n = e.css, r = e.media;
            r && t.setAttribute("media", r);
            if (t.styleSheet) t.styleSheet.cssText = n; else {
                for (;t.firstChild; ) t.removeChild(t.firstChild);
                t.appendChild(document.createTextNode(n));
            }
        }.bind(null, n), o = function() {
            v(n);
        });
        return r(t), function(e) {
            if (e) {
                if (e.css === t.css && e.media === t.media && e.sourceMap === t.sourceMap) return;
                r(t = e);
            } else o();
        };
    }
    t.exports = function(t, e) {
        if ("undefined" != typeof DEBUG && DEBUG && "object" != typeof document) throw new Error("The style-loader cannot be used in a non-browser environment");
        (e = e || {}).attrs = "object" == typeof e.attrs ? e.attrs : {}, e.singleton || "boolean" == typeof e.singleton || (e.singleton = s()), 
        e.insertInto || (e.insertInto = "head"), e.insertAt || (e.insertAt = "bottom");
        var n = p(t, e);
        return d(n, e), function(t) {
            for (var r = [], o = 0; o < n.length; o++) {
                var s = n[o];
                (a = i[s.id]).refs--, r.push(a);
            }
            t && d(p(t, e), e);
            for (o = 0; o < r.length; o++) {
                var a;
                if (0 === (a = r[o]).refs) {
                    for (var c = 0; c < a.parts.length; c++) a.parts[c]();
                    delete i[a.id];
                }
            }
        };
    };
    var g, w = (g = [], function(t, e) {
        return g[t] = e, g.filter(Boolean).join("\n");
    });
    function R(t, e, n, r) {
        var o = n ? "" : r.css;
        if (t.styleSheet) t.styleSheet.cssText = w(e, o); else {
            var i = document.createTextNode(o), s = t.childNodes;
            s[e] && t.removeChild(s[e]), s.length ? t.insertBefore(i, s[e]) : t.appendChild(i);
        }
    }
}, function(t, e) {
    t.exports = function(t) {
        var e = [];
        return e.toString = function() {
            return this.map(function(e) {
                var n = function(t, e) {
                    var n = t[1] || "", r = t[3];
                    if (!r) return n;
                    if (e && "function" == typeof btoa) {
                        var o = (s = r, "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(s)))) + " */"), i = r.sources.map(function(t) {
                            return "/*# sourceURL=" + r.sourceRoot + t + " */";
                        });
                        return [ n ].concat(i).concat([ o ]).join("\n");
                    }
                    var s;
                    return [ n ].join("\n");
                }(e, t);
                return e[2] ? "@media " + e[2] + "{" + n + "}" : n;
            }).join("");
        }, e.i = function(t, n) {
            "string" == typeof t && (t = [ [ null, t, "" ] ]);
            for (var r = {}, o = 0; o < this.length; o++) {
                var i = this[o][0];
                "number" == typeof i && (r[i] = !0);
            }
            for (o = 0; o < t.length; o++) {
                var s = t[o];
                "number" == typeof s[0] && r[s[0]] || (n && !s[2] ? s[2] = n : n && (s[2] = "(" + s[2] + ") and (" + n + ")"), 
                e.push(s));
            }
        }, e;
    };
}, function(t, e, n) {
    (t.exports = n(3)(!1)).push([ t.i, "#counter {\n  position: absolute;\n  top: 200px;\n  right: 10px;\n  width: 300px;\n  text-align: center; }\n  #counter .stats {\n    float: left;\n    width: 33.33%; }\n  #counter .highlight {\n    font-size: 30px;\n    font-weight: 700; }\n  #counter .received {\n    color: #1e73be; }\n  #counter .sent {\n    color: #be1eb9; }\n  #counter .clapped {\n    color: #00f3ff; }\n  #counter h6 {\n    margin: 0;\n    font-size: 14px;\n    font-weight: 400;\n    color: #4a4a4a; }\n", "" ]);
}, function(t, e, n) {
    var r = n(4);
    "string" == typeof r && (r = [ [ t.i, r, "" ] ]);
    var o = {
        hmr: !0,
        transform: void 0,
        insertInto: void 0
    };
    n(2)(r, o);
    r.locals && (t.exports = r.locals);
}, function(t, e, n) {
    n(0), t.exports = n(5);
} ]);