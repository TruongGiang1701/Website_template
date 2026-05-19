"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugifyTag = slugifyTag;
/** Slug dùng cho `tags.slug` và chuẩn hóa tên tag. */
function slugifyTag(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}
