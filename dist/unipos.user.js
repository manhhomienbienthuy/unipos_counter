// ==UserScript==
// @name         Unipos counter
// @version      1.1
// @description  Counter for unipos point
// @author       manhhomienbienthuy
// @match        https://unipos.me/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==
!function(n) {
    var e = {};
    function t(o) {
        if (e[o]) return e[o].exports;
        var r = e[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return n[o].call(r.exports, r, r.exports, t), r.l = !0, r.exports;
    }
    t.m = n, t.c = e, t.d = function(n, e, o) {
        t.o(n, e) || Object.defineProperty(n, e, {
            enumerable: !0,
            get: o
        });
    }, t.r = function(n) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(n, "__esModule", {
            value: !0
        });
    }, t.t = function(n, e) {
        if (1 & e && (n = t(n)), 8 & e) return n;
        if (4 & e && "object" == typeof n && n && n.__esModule) return n;
        var o = Object.create(null);
        if (t.r(o), Object.defineProperty(o, "default", {
            enumerable: !0,
            value: n
        }), 2 & e && "string" != typeof n) for (var r in n) t.d(o, r, function(e) {
            return n[e];
        }.bind(null, r));
        return o;
    }, t.n = function(n) {
        var e = n && n.__esModule ? function() {
            return n.default;
        } : function() {
            return n;
        };
        return t.d(e, "a", e), e;
    }, t.o = function(n, e) {
        return Object.prototype.hasOwnProperty.call(n, e);
    }, t.p = "", t(t.s = 1);
}([ function(n, e, t) {
    "use strict";
    t.r(e);
    const o = 5e5, r = "https://unipos.me/q/jsonrpc", i = new RegExp("https://unipos.me/.*?i=([a-f0-9-]+)");
    function c() {
        const n = window.location.href.match(i);
        return n && n[1];
    }
    function a(n) {
        n && n.parentNode.removeChild(n);
    }
    function s(n = "received", e = "") {
        const t = c(), r = {
            offset_card_id: e,
            count: o
        };
        switch (n) {
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
    async function u(n) {
        const e = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "x-unipos-token": window.localStorage.getItem("authnToken")
            },
            cache: "no-cache",
            body: JSON.stringify(n)
        }, t = await fetch(r, e);
        return (await t.json()).result;
    }
    async function d(n = "received") {
        let e, t = [], r = "";
        do {
            const o = s(n, r);
            if (!(e = await u(o)) || !e.length) break;
            t = t.concat(e), r = e[e.length - 1].id;
        } while (e.length < o);
        return t;
    }
    async function l(n) {
        const e = {
            received: 0,
            sent: 0,
            clapped: 0
        }, [t, o, r] = n;
        return t.forEach(n => {
            e.received += n.point, e.received += n.praise_count;
        }), o.forEach(n => {
            e.received += n.praise_count, e.sent += n.point;
        }), e.clapped = await async function(n) {
            const e = c();
            return (await Promise.all(n.map(async n => {
                const t = {
                    jsonrpc: "2.0",
                    method: "Unipos.GetCard2",
                    id: "Unipos.GetCard2",
                    params: {
                        id: n.id
                    }
                };
                return (await u(t)).praises.find(n => n.member.id === e).count;
            }))).reduce((n, e) => n + e, 0);
        }(r), e;
    }
    async function p() {
        const n = await Promise.all([ async function() {
            return d("received");
        }(), async function() {
            return d("sent");
        }(), async function() {
            return d("clapped");
        }() ]);
        !function(n) {
            let e = `\n        <div class="stats received">\n            <span class="highlight">${n.received}</span>\n            <h6>received</h6>\n        </div>\n        <div class="stats sent">\n            <span class="highlight">${n.sent}</span>\n            <h6>sent</h6>\n        </div>\n        <div class="stats clapped">\n            <span class="highlight">${n.clapped}</span>\n            <h6>clapped</h6>\n        </div>\n        <style>\n            #counter {\n                position: absolute;\n                top: 200px;\n                right: 10px;\n                width: 300px;\n                text-align: center;\n            }\n\n            #counter .stats {\n                float: left;\n                width: 33.33%;\n\n            }\n\n            #counter .highlight {\n                font-size: 30px;\n                font-weight: 700;\n            }\n\n\n            #counter .received {\n                color: #1e73be;\n            }\n            #counter .sent {\n                color: #be1eb9;\n            }\n            #counter .clapped {\n                color: #00f3ff;\n            }\n\n            #counter h6 {\n                margin: 0;\n                font-size: 14px;\n                font-weight: normal;\n                color: #4a4a4a;\n            }\n        </style>`;
            const t = document.createElement("div");
            t.setAttribute("id", "counter"), t.innerHTML = e, document.body.appendChild(t);
        }(await l(n));
    }
    let f = void 0, h = !1;
    new MutationObserver(async function() {
        const n = c();
        n ? h || f === n || (h = !0, a(document.getElementById("counter")), await p(), f = n, 
        h = !1) : a(document.getElementById("counter"));
    }).observe(document.body, {
        childList: !0,
        subtree: !0
    });
}, function(n, e, t) {
    n.exports = t(0);
} ]);