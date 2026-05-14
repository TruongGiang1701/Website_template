import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getTemplateSlug(item) {
  return `${slugify(item.title)}-${item.id}`;
}

function parsePriceVnd(price) {
  if (!price) return 0;
  const digits = String(price).replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function escapeSqlString(value) {
  return String(value).replace(/'/g, "''");
}

function loadCatalogItems() {
  const jsonPath = path.resolve(process.cwd(), "scripts/seed-catalog-items.json");
  if (fs.existsSync(jsonPath)) {
    const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    const items = Array.isArray(raw) ? raw : raw?.items;
    if (!Array.isArray(items)) {
      throw new Error(
        "scripts/seed-catalog-items.json phải là mảng hoặc object { items: [...] }",
      );
    }
    if (items.length === 0) {
      throw new Error("scripts/seed-catalog-items.json đang rỗng — không sinh được seed.");
    }
    return items;
  }

  const filePath = path.resolve(
    process.cwd(),
    "src/features/marketing/pages/home/home.data.ts",
  );
  const tsSource = fs.readFileSync(filePath, "utf8");
  const js = ts.transpileModule(tsSource, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
    },
    fileName: "home.data.ts",
  }).outputText;

  const module = { exports: {} };
  const context = {
    module,
    exports: module.exports,
    require,
    console,
  };
  vm.createContext(context);
  vm.runInContext(js, context, { filename: "home.data.ts" });
  const exported = context.module.exports;
  if (!exported?.homeTemplateOption2?.items) {
    throw new Error("Cannot find homeTemplateOption2.items in home.data.ts");
  }
  const items = exported.homeTemplateOption2.items;
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(
      "homeTemplateOption2.items đang rỗng. Tạo scripts/seed-catalog-items.json (mảng mẫu giống HomeTemplateItem) để chạy generate-seed, hoặc tạm thêm item vào home.data khi export SQL.",
    );
  }
  return items;
}

function pickProductImages(items, item, count = 5) {
  const sameGroup = items
    .filter((x) => x.group === item.group && x.id !== item.id)
    .map((x) => x.image);
  const images = [item.image, ...sameGroup].slice(0, count);
  return Array.from(new Set(images));
}

function generateSeedSql(items) {
  const tagsSet = new Map(); // name -> slug
  for (const item of items) {
    for (const tag of item.tags ?? []) {
      const name = String(tag).trim();
      if (!name) continue;
      if (!tagsSet.has(name)) tagsSet.set(name, slugify(name));
    }
  }

  const lines = [];
  lines.push("-- Generated from scripts/seed-catalog-items.json or home.data.ts");
  lines.push("-- Run:");
  lines.push("-- - bash/zsh:    psql \"$DATABASE_URL\" -f db/seed.sql");
  lines.push("-- - PowerShell:  psql \"$env:DATABASE_URL\" -f db/seed.sql");
  lines.push("-- - cmd.exe:     psql \"%DATABASE_URL%\" -f db/seed.sql");
  lines.push("BEGIN;");
  lines.push("");

  // Tags
  lines.push("-- Tags");
  for (const [name, slug] of tagsSet.entries()) {
    lines.push(
      `INSERT INTO tags (name, slug) VALUES ('${escapeSqlString(name)}', '${escapeSqlString(slug)}') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;`,
    );
  }
  lines.push("");

  // Products
  lines.push("-- Products");
  for (const item of items) {
    const slug = getTemplateSlug(item);
    const legacy = item.id;
    const title = item.title;
    const groupName = item.group;
    const price = parsePriceVnd(item.price);
    const featured = item.featured ? "true" : "false";
    const tryUrl = item.tryUrl ?? null;

    lines.push(
      [
        "INSERT INTO products (legacy_key, title, slug, group_name, price_vnd, featured, status, try_url)",
        `VALUES ('${escapeSqlString(legacy)}', '${escapeSqlString(title)}', '${escapeSqlString(slug)}', '${escapeSqlString(groupName)}', ${price}, ${featured}, 'active', ${tryUrl ? `'${escapeSqlString(tryUrl)}'` : "NULL"})`,
        "ON CONFLICT (slug) DO UPDATE SET",
        "  legacy_key = EXCLUDED.legacy_key,",
        "  title = EXCLUDED.title,",
        "  group_name = EXCLUDED.group_name,",
        "  price_vnd = EXCLUDED.price_vnd,",
        "  featured = EXCLUDED.featured,",
        "  status = EXCLUDED.status,",
        "  try_url = EXCLUDED.try_url,",
        "  updated_at = now();",
      ].join("\n"),
    );
  }
  lines.push("");

  // Product images (wipe then reinsert to keep sort_order stable)
  lines.push("-- Product images (re-seed)");
  lines.push(
    "DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE legacy_key IS NOT NULL);",
  );
  for (const item of items) {
    const productSlug = getTemplateSlug(item);
    const images = pickProductImages(items, item, 5);
    images.forEach((url, idx) => {
      lines.push(
        `INSERT INTO product_images (product_id, url, alt, sort_order) VALUES ((SELECT id FROM products WHERE slug='${escapeSqlString(productSlug)}'), '${escapeSqlString(url)}', NULL, ${idx}) ON CONFLICT DO NOTHING;`,
      );
    });
  }
  lines.push("");

  // Product tags (wipe then reinsert)
  lines.push("-- Product tags (re-seed)");
  lines.push(
    "DELETE FROM product_tags WHERE product_id IN (SELECT id FROM products WHERE legacy_key IS NOT NULL);",
  );
  for (const item of items) {
    const productSlug = getTemplateSlug(item);
    for (const tag of item.tags ?? []) {
      const tagName = String(tag).trim();
      if (!tagName) continue;
      const tagSlug = slugify(tagName);
      lines.push(
        `INSERT INTO product_tags (product_id, tag_id) VALUES ((SELECT id FROM products WHERE slug='${escapeSqlString(productSlug)}'), (SELECT id FROM tags WHERE slug='${escapeSqlString(tagSlug)}')) ON CONFLICT DO NOTHING;`,
      );
    }
  }
  lines.push("");
  lines.push("COMMIT;");
  lines.push("");

  return lines.join("\n");
}

const items = loadCatalogItems();
const sql = generateSeedSql(items);

const outPath = path.resolve(process.cwd(), "db/seed.sql");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, sql, "utf8");

console.log(`Generated ${outPath}`);
console.log(`Products: ${items.length}`);
console.log("Run one of the following:");
console.log('  bash/zsh:    psql "$DATABASE_URL" -f db/seed.sql');
console.log('  PowerShell:  psql "$env:DATABASE_URL" -f db/seed.sql');
console.log('  cmd.exe:     psql "%DATABASE_URL%" -f db/seed.sql');

