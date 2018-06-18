// ==UserScript==
// @name         Unipos counter
// @version      1.2
// @description  Counter for unipos point
// @author       manhhomienbienthuy
// @match        https://unipos.me/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==
!function(e) {
    var n = {};
    function t(r) {
        if (n[r]) return n[r].exports;
        var o = n[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return e[r].call(o.exports, o, o.exports, t), o.l = !0, o.exports;
    }
    t.m = e, t.c = n, t.d = function(e, n, r) {
        t.o(e, n) || Object.defineProperty(e, n, {
            enumerable: !0,
            get: r
        });
    }, t.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        });
    }, t.t = function(e, n) {
        if (1 & n && (e = t(e)), 8 & n) return e;
        if (4 & n && "object" == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (t.r(r), Object.defineProperty(r, "default", {
            enumerable: !0,
            value: e
        }), 2 & n && "string" != typeof e) for (var o in e) t.d(r, o, function(n) {
            return e[n];
        }.bind(null, o));
        return r;
    }, t.n = function(e) {
        var n = e && e.__esModule ? function() {
            return e.default;
        } : function() {
            return e;
        };
        return t.d(n, "a", n), n;
    }, t.o = function(e, n) {
        return Object.prototype.hasOwnProperty.call(e, n);
    }, t.p = "", t(t.s = 5);
}([ function(e, n, t) {
    "use strict";
    Object.defineProperty(n, "__esModule", {
        value: !0
    });
    n.MAX_REQUEST_RESULT = 5e5, n.API_URL = "https://unipos.me/q/jsonrpc", n.USER_ID_REGEX = new RegExp("https://unipos.me/.*?i=([a-f0-9-]+)");
}, function(e, n, t) {
    "use strict";
    Object.defineProperty(n, "__esModule", {
        value: !0
    }), n.getUserId = function() {
        var e = window.location.href.match(r.USER_ID_REGEX);
        return e && e[1];
    }, n.getToken = function() {
        return window.localStorage.getItem("authnToken");
    }, n.removeElement = function(e) {
        e && e.parentNode.removeChild(e);
    };
    var r = t(0);
}, function(e, n, t) {
    "use strict";
    Object.defineProperty(n, "__esModule", {
        value: !0
    }), n.getClappedPoint = n.getPosts = void 0;
    var r, o, i, u = (r = s(regeneratorRuntime.mark(function e(n) {
        var t, r, o;
        return regeneratorRuntime.wrap(function(e) {
            for (;;) switch (e.prev = e.next) {
              case 0:
                return t = {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "x-unipos-token": (0, a.getToken)()
                    },
                    cache: "no-cache",
                    body: JSON.stringify(n)
                }, e.next = 3, fetch(c.API_URL, t);

              case 3:
                return r = e.sent, e.next = 6, r.json();

              case 6:
                return o = e.sent, e.abrupt("return", o.result);

              case 8:
              case "end":
                return e.stop();
            }
        }, e, this);
    })), function(e) {
        return r.apply(this, arguments);
    }), a = (n.getPosts = (o = s(regeneratorRuntime.mark(function e() {
        var n, t, r, o, i = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "received";
        return regeneratorRuntime.wrap(function(e) {
            for (;;) switch (e.prev = e.next) {
              case 0:
                n = [], t = "", r = void 0;

              case 3:
                return o = p(i, t), e.next = 6, u(o);

              case 6:
                if ((r = e.sent) && r.length) {
                    e.next = 9;
                    break;
                }
                return e.abrupt("break", 12);

              case 9:
                n = n.concat(r), t = r[r.length - 1].id;

              case 11:
                if (r.length < c.MAX_REQUEST_RESULT) {
                    e.next = 3;
                    break;
                }

              case 12:
                return e.abrupt("return", n);

              case 13:
              case "end":
                return e.stop();
            }
        }, e, this);
    })), function() {
        return o.apply(this, arguments);
    }), n.getClappedPoint = (i = s(regeneratorRuntime.mark(function e(n) {
        var t, r, o = this;
        return regeneratorRuntime.wrap(function(e) {
            for (;;) switch (e.prev = e.next) {
              case 0:
                return t = (0, a.getUserId)(), e.next = 3, Promise.all(n.map(function() {
                    var e = s(regeneratorRuntime.mark(function e(n) {
                        var r, i, a;
                        return regeneratorRuntime.wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                              case 0:
                                return r = {
                                    id: n.id
                                }, i = {
                                    jsonrpc: "2.0",
                                    method: "Unipos.GetCard2",
                                    id: "Unipos.GetCard2",
                                    params: r
                                }, e.next = 4, u(i);

                              case 4:
                                return a = e.sent, e.abrupt("return", a.praises.find(function(e) {
                                    return e.member.id === t;
                                }).count);

                              case 6:
                              case "end":
                                return e.stop();
                            }
                        }, e, o);
                    }));
                    return function(n) {
                        return e.apply(this, arguments);
                    };
                }()));

              case 3:
                return r = e.sent, e.abrupt("return", r.reduce(function(e, n) {
                    return e + n;
                }, 0));

              case 5:
              case "end":
                return e.stop();
            }
        }, e, this);
    })), function(e) {
        return i.apply(this, arguments);
    }), t(1)), c = t(0);
    function s(e) {
        return function() {
            var n = e.apply(this, arguments);
            return new Promise(function(e, t) {
                return function r(o, i) {
                    try {
                        var u = n[o](i), a = u.value;
                    } catch (e) {
                        return void t(e);
                    }
                    if (!u.done) return Promise.resolve(a).then(function(e) {
                        r("next", e);
                    }, function(e) {
                        r("throw", e);
                    });
                    e(a);
                }("next");
            });
        };
    }
    function p() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "received", n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", t = (0, 
        a.getUserId)(), r = {
            offset_card_id: n,
            count: c.MAX_REQUEST_RESULT
        };
        switch (e) {
          case "received":
            r.to_member_id = t;
            break;

          case "sent":
            r.from_member_id = t;
            break;

          case "clapped":
            r.praised_member_id = t;
        }
        return {
            jsonrpc: "2.0",
            method: "Unipos.GetCards2",
            id: "Unipos.GetCards2",
            params: r
        };
    }
}, function(e, n, t) {
    "use strict";
    Object.defineProperty(n, "__esModule", {
        value: !0
    }), n.counter = void 0;
    var r, o, i = function() {
        return function(e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return function(e, n) {
                var t = [], r = !0, o = !1, i = void 0;
                try {
                    for (var u, a = e[Symbol.iterator](); !(r = (u = a.next()).done) && (t.push(u.value), 
                    !n || t.length !== n); r = !0) ;
                } catch (e) {
                    o = !0, i = e;
                } finally {
                    try {
                        !r && a.return && a.return();
                    } finally {
                        if (o) throw i;
                    }
                }
                return t;
            }(e, n);
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
        };
    }(), u = (r = c(regeneratorRuntime.mark(function e(n) {
        var t, r, o, u, c;
        return regeneratorRuntime.wrap(function(e) {
            for (;;) switch (e.prev = e.next) {
              case 0:
                return t = {
                    received: 0,
                    sent: 0,
                    clapped: 0
                }, r = i(n, 3), o = r[0], u = r[1], c = r[2], o.forEach(function(e) {
                    t.received += e.point, t.received += e.praise_count;
                }), u.forEach(function(e) {
                    t.received += e.praise_count, t.sent += e.point;
                }), e.next = 6, (0, a.getClappedPoint)(c);

              case 6:
                return t.clapped = e.sent, e.abrupt("return", t);

              case 8:
              case "end":
                return e.stop();
            }
        }, e, this);
    })), function(e) {
        return r.apply(this, arguments);
    }), a = (n.counter = (o = c(regeneratorRuntime.mark(function e() {
        var n;
        return regeneratorRuntime.wrap(function(e) {
            for (;;) switch (e.prev = e.next) {
              case 0:
                return e.next = 2, Promise.all([ (0, a.getPosts)("received"), (0, a.getPosts)("sent"), (0, 
                a.getPosts)("clapped") ]);

              case 2:
                return n = e.sent, e.next = 5, u(n);

              case 5:
                s(e.sent);

              case 7:
              case "end":
                return e.stop();
            }
        }, e, this);
    })), function() {
        return o.apply(this, arguments);
    }), t(2));
    function c(e) {
        return function() {
            var n = e.apply(this, arguments);
            return new Promise(function(e, t) {
                return function r(o, i) {
                    try {
                        var u = n[o](i), a = u.value;
                    } catch (e) {
                        return void t(e);
                    }
                    if (!u.done) return Promise.resolve(a).then(function(e) {
                        r("next", e);
                    }, function(e) {
                        r("throw", e);
                    });
                    e(a);
                }("next");
            });
        };
    }
    function s(e) {
        var n = '\n        <div class="stats received">\n            <span class="highlight">' + e.received + '</span>\n            <h6>received</h6>\n        </div>\n        <div class="stats sent">\n            <span class="highlight">' + e.sent + '</span>\n            <h6>sent</h6>\n        </div>\n        <div class="stats clapped">\n            <span class="highlight">' + e.clapped + "</span>\n            <h6>clapped</h6>\n        </div>\n        <style>\n            #counter {\n                position: absolute;\n                top: 200px;\n                right: 10px;\n                width: 300px;\n                text-align: center;\n            }\n\n            #counter .stats {\n                float: left;\n                width: 33.33%;\n\n            }\n\n            #counter .highlight {\n                font-size: 30px;\n                font-weight: 700;\n            }\n\n\n            #counter .received {\n                color: #1e73be;\n            }\n            #counter .sent {\n                color: #be1eb9;\n            }\n            #counter .clapped {\n                color: #00f3ff;\n            }\n\n            #counter h6 {\n                margin: 0;\n                font-size: 14px;\n                font-weight: normal;\n                color: #4a4a4a;\n            }\n        </style>", t = document.createElement("div");
        t.setAttribute("id", "counter"), t.innerHTML = n, document.body.appendChild(t);
    }
}, function(e, n, t) {
    "use strict";
    var r, o, i = (r = regeneratorRuntime.mark(function e() {
        var n;
        return regeneratorRuntime.wrap(function(e) {
            for (;;) switch (e.prev = e.next) {
              case 0:
                if (n = (0, u.getUserId)()) {
                    e.next = 5;
                    break;
                }
                return (0, u.removeElement)(document.getElementById("counter")), c = null, e.abrupt("return");

              case 5:
                if (!s && c !== n) {
                    e.next = 7;
                    break;
                }
                return e.abrupt("return");

              case 7:
                return s = !0, (0, u.removeElement)(document.getElementById("counter")), e.next = 11, 
                (0, a.counter)();

              case 11:
                c = n, s = !1;

              case 13:
              case "end":
                return e.stop();
            }
        }, e, this);
    }), o = function() {
        var e = r.apply(this, arguments);
        return new Promise(function(n, t) {
            return function r(o, i) {
                try {
                    var u = e[o](i), a = u.value;
                } catch (e) {
                    return void t(e);
                }
                if (!u.done) return Promise.resolve(a).then(function(e) {
                    r("next", e);
                }, function(e) {
                    r("throw", e);
                });
                n(a);
            }("next");
        });
    }, function() {
        return o.apply(this, arguments);
    }), u = t(1), a = t(3);
    var c = null, s = !1;
    new MutationObserver(i).observe(document.body, {
        childList: !0,
        subtree: !0
    });
}, function(e, n, t) {
    e.exports = t(4);
} ]);