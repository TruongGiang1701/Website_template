"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUEST_CART_COOKIE_MAX_AGE = exports.GUEST_CART_COOKIE = void 0;
exports.readGuestCartSessionId = readGuestCartSessionId;
exports.getOrCreateGuestSessionId = getOrCreateGuestSessionId;
exports.setGuestCartSessionCookie = setGuestCartSessionCookie;
const node_crypto_1 = require("node:crypto");
exports.GUEST_CART_COOKIE = "visstemp_guest_cart_sid";
exports.GUEST_CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 90;
function readGuestCartSessionId(cookies) {
    const v = cookies[exports.GUEST_CART_COOKIE]?.trim();
    return v && v.length > 0 ? v : undefined;
}
function getOrCreateGuestSessionId(cookies) {
    const existing = readGuestCartSessionId(cookies);
    if (existing)
        return { sessionId: existing, isNew: false };
    return { sessionId: (0, node_crypto_1.randomUUID)(), isNew: true };
}
function setGuestCartSessionCookie(res, sessionId, secure) {
    res.cookie(exports.GUEST_CART_COOKIE, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: exports.GUEST_CART_COOKIE_MAX_AGE * 1000,
        secure,
    });
}
