// ==UserScript==
// @name         Unipos counter
// @version      1.0.2
// @description  Counter for unipos point
// @author       manhhomienbienthuy
// @match        https://unipos.me/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==
!function(e) {
    var n = {};
    function t(o) {
        if (n[o]) return n[o].exports;
        var r = n[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(r.exports, r, r.exports, t), r.l = !0, r.exports;
    }
    t.m = e, t.c = n, t.d = function(e, n, o) {
        t.o(e, n) || Object.defineProperty(e, n, {
            enumerable: !0,
            get: o
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
        var o = Object.create(null);
        if (t.r(o), Object.defineProperty(o, "default", {
            enumerable: !0,
            value: e
        }), 2 & n && "string" != typeof e) for (var r in e) t.d(o, r, function(n) {
            return e[n];
        }.bind(null, r));
        return o;
    }, t.n = function(e) {
        var n = e && e.__esModule ? function() {
            return e.default;
        } : function() {
            return e;
        };
        return t.d(n, "a", n), n;
    }, t.o = function(e, n) {
        return Object.prototype.hasOwnProperty.call(e, n);
    }, t.p = "", t(t.s = 1);
}([ function(e, n, t) {
    "use strict";
    t.r(n);
    const o = 5e5, r = "https://unipos.me/q/jsonrpc", c = new RegExp("https://unipos.me/.*?i=([a-f0-9-]+)");
    function i() {
        const e = window.location.href.match(c);
        return e && e[1];
    }
    function a(e) {
        e && e.parentNode.removeChild(e);
    }
    function s(e = "received", n = "") {
        const t = i(), r = {
            offset_card_id: n,
            count: o
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
    async function u(e) {
        const n = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "x-unipos-token": window.localStorage.getItem("authnToken")
            },
            cache: "no-cache",
            body: JSON.stringify(e)
        }, t = await fetch(r, n);
        return (await t.json()).result;
    }
    async function d(e = "received") {
        let n, t = [], r = "";
        do {
            const o = s(e, r);
            if (!(n = await u(o)) || !n.length) break;
            t = t.concat(n), r = n[n.length - 1].id;
        } while (n.length < o);
        return t;
    }
    async function l() {
        !function(e) {
            let n = `\n        <div class="stats received">\n            <span class="highlight">${e.received}</span>\n            <h6>received</h6>\n        </div>\n        <div class="stats sent">\n            <span class="highlight">${e.sent}</span>\n            <h6>sent</h6>\n        </div>\n        <div class="stats clapped">\n            <span class="highlight">${e.clapped}</span>\n            <h6>clapped</h6>\n        </div>\n        <style>\n            #counter {\n                position: absolute;\n                top: 200px;\n                right: 10px;\n                width: 300px;\n                text-align: center;\n            }\n\n            #counter .stats {\n                float: left;\n                width: 33.33%;\n\n            }\n\n            #counter .highlight {\n                font-size: 30px;\n                font-weight: 700;\n            }\n\n\n            #counter .received {\n                color: #1e73be;\n            }\n            #counter .sent {\n                color: #be1eb9;\n            }\n            #counter .clapped {\n                color: #00f3ff;\n            }\n\n            #counter h6 {\n                margin: 0;\n                font-size: 14px;\n                font-weight: normal;\n                color: #4a4a4a;\n            }\n        </style>`;
            const t = document.createElement("div");
            t.setAttribute("id", "counter"), t.innerHTML = n, document.body.appendChild(t);
        }(function(e) {
            const n = {
                received: 0,
                sent: 0,
                clapped: 0
            }, [t, o, r] = e;
            return t.forEach(e => {
                n.received += e.point, n.received += e.praise_count;
            }), o.forEach(e => {
                n.received += e.praise_count, n.sent += e.point;
            }), r.forEach(e => {
                n.clapped += 2 * e.praise_count, n.sent += 2 * e.praise_count;
            }), n;
        }(await Promise.all([ d("received"), d("sent"), d("clapped") ])));
    }
    let p = void 0, f = !1;
    new MutationObserver(async function() {
        const e = i();
        e ? f || p === e || (f = !0, a(document.getElementById("counter")), await l(), p = e, 
        f = !1) : a(document.getElementById("counter"));
    }).observe(document.body, {
        childList: !0,
        subtree: !0
    });
}, function(e, n, t) {
    e.exports = t(0);
} ]);