"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatVndLabel = formatVndLabel;
function formatVndLabel(priceVnd) {
    const n = Number.isFinite(priceVnd) ? Math.max(0, Math.floor(priceVnd)) : 0;
    return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`;
}
