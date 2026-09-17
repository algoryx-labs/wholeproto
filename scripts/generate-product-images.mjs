/**
 * Generates local SVG product images for the mobile app.
 * Run: node scripts/generate-product-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const seedDir = path.join(root, "packages", "data", "src", "seed");
const outDir = path.join(root, "apps", "mobile", "public", "products");

const CATEGORY_META = {
  "cat-produce": { name: "Produce", bg: ["#E8F6E1", "#C8E8B8"], accent: "#3D7A2E" },
  "cat-dairy": { name: "Dairy & Eggs", bg: ["#EAF1FB", "#C9DAF5"], accent: "#2F5FA8" },
  "cat-bakery": { name: "Bakery", bg: ["#F8EEE0", "#EFD4AE"], accent: "#9A6420" },
  "cat-meat": { name: "Meat & Seafood", bg: ["#FBE8E6", "#F0C4BF"], accent: "#A63B34" },
  "cat-beverages": { name: "Beverages", bg: ["#E4F3F5", "#B9E0E6"], accent: "#1F6B75" },
  "cat-snacks": { name: "Snacks", bg: ["#FCF0DC", "#F5D9A8"], accent: "#A66B12" },
  "cat-pantry": { name: "Pantry", bg: ["#F3EEE4", "#E2D5BF"], accent: "#6E5A3A" },
  "cat-frozen": { name: "Frozen", bg: ["#E8F0FA", "#C5D8F0"], accent: "#3A5F96" },
  "cat-household": { name: "Household", bg: ["#F0ECF7", "#D9D0EB"], accent: "#5B4A84" },
  "cat-personal": { name: "Personal Care", bg: ["#F8EAF1", "#EBC9D9"], accent: "#8A4466" },
};

const ILLUSTRATIONS = {
  "cat-produce": `
    <ellipse cx="200" cy="168" rx="62" ry="70" fill="#E85D4C"/>
    <ellipse cx="200" cy="168" rx="52" ry="58" fill="#F07868"/>
    <path d="M200 98c8 18 22 28 22 28s-20 2-28-12c-6-10-2-22 6-16z" fill="#3D7A2E"/>
    <ellipse cx="188" cy="150" rx="14" ry="22" fill="#fff" opacity=".22"/>
  `,
  "cat-dairy": `
    <rect x="155" y="110" width="90" height="120" rx="10" fill="#fff"/>
    <rect x="155" y="110" width="90" height="28" rx="10" fill="#2F5FA8"/>
    <rect x="155" y="128" width="90" height="10" fill="#2F5FA8"/>
    <rect x="172" y="155" width="56" height="48" rx="6" fill="#EAF1FB"/>
    <circle cx="200" cy="179" r="14" fill="#F4C430"/>
  `,
  "cat-bakery": `
    <ellipse cx="200" cy="185" rx="78" ry="38" fill="#C48A3A"/>
    <ellipse cx="200" cy="175" rx="78" ry="38" fill="#E0A85A"/>
    <ellipse cx="200" cy="160" rx="70" ry="32" fill="#F0C27A"/>
    <path d="M145 155c18-22 92-22 110 0" stroke="#C48A3A" stroke-width="4" fill="none" stroke-linecap="round"/>
  `,
  "cat-meat": `
    <ellipse cx="200" cy="170" rx="78" ry="52" fill="#C45A52"/>
    <ellipse cx="200" cy="170" rx="58" ry="36" fill="#E8A8A2"/>
    <ellipse cx="185" cy="160" rx="16" ry="12" fill="#F5D0CC"/>
    <ellipse cx="215" cy="178" rx="12" ry="9" fill="#F5D0CC"/>
  `,
  "cat-beverages": `
    <path d="M175 105h50l12 140c0 12-10 22-25 22h-24c-15 0-25-10-25-22l12-140z" fill="#4DB8C4"/>
    <rect x="180" y="92" width="40" height="18" rx="4" fill="#1F6B75"/>
    <rect x="188" y="82" width="24" height="14" rx="3" fill="#1F6B75"/>
    <ellipse cx="200" cy="155" rx="14" ry="28" fill="#fff" opacity=".25"/>
  `,
  "cat-snacks": `
    <path d="M150 115c0-8 8-14 18-14h64c10 0 18 6 18 14v110c0 10-10 18-22 18h-56c-12 0-22-8-22-18V115z" fill="#F0A83A"/>
    <path d="M150 130h100" stroke="#fff" stroke-width="8" opacity=".35"/>
    <path d="M150 155h100" stroke="#D4891A" stroke-width="6" opacity=".4"/>
    <circle cx="200" cy="185" r="22" fill="#fff" opacity=".3"/>
  `,
  "cat-pantry": `
    <rect x="158" y="125" width="84" height="100" rx="8" fill="#D4B896"/>
    <rect x="168" y="105" width="64" height="28" rx="6" fill="#8B6B45"/>
    <rect x="175" y="145" width="50" height="55" rx="6" fill="#F8F1E6"/>
    <path d="M185 165h30M185 178h30M185 191h20" stroke="#8B6B45" stroke-width="3" stroke-linecap="round"/>
  `,
  "cat-frozen": `
    <rect x="145" y="115" width="110" height="110" rx="14" fill="#7BA3D4"/>
    <rect x="158" y="128" width="84" height="84" rx="10" fill="#E8F0FA"/>
    <path d="M200 145v50M175 170h50M182 155l36 30M218 155l-36 30" stroke="#3A5F96" stroke-width="4" stroke-linecap="round"/>
  `,
  "cat-household": `
    <path d="M185 100h30l8 20h-46l8-20z" fill="#8B7BB8"/>
    <rect x="168" y="120" width="64" height="110" rx="12" fill="#B8A9D9"/>
    <rect x="180" y="145" width="40" height="55" rx="6" fill="#F0ECF7"/>
    <circle cx="230" cy="112" r="8" fill="#5B4A84"/>
    <path d="M230 104v-14" stroke="#5B4A84" stroke-width="3" stroke-linecap="round"/>
  `,
  "cat-personal": `
    <rect x="178" y="100" width="44" height="28" rx="8" fill="#8A4466"/>
    <rect x="170" y="125" width="60" height="105" rx="16" fill="#D489A8"/>
    <rect x="182" y="145" width="36" height="55" rx="8" fill="#F8EAF1"/>
    <circle cx="200" cy="172" r="10" fill="#8A4466" opacity=".35"/>
  `,
};

function escapeXml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrapName(name, maxLen = 18) {
  if (name.length <= maxLen) return [name];
  const words = name.split(" ");
  const lines = [];
  let current = "";
  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (next.length > maxLen && current) {
      lines.push(current);
      current = w;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

function svgFor({ sku, name, categoryId }) {
  const meta = CATEGORY_META[categoryId] ?? CATEGORY_META["cat-pantry"];
  const art = ILLUSTRATIONS[categoryId] ?? ILLUSTRATIONS["cat-pantry"];
  const lines = wrapName(name);
  const nameBlock = lines
    .map(
      (line, i) =>
        `<text x="200" y="${292 + i * 22}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="20" font-weight="600" fill="#0E1A15">${escapeXml(line)}</text>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" role="img" aria-label="${escapeXml(name)}">
  <defs>
    <linearGradient id="bg-${sku}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${meta.bg[0]}"/>
      <stop offset="100%" stop-color="${meta.bg[1]}"/>
    </linearGradient>
    <filter id="soft-${sku}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0E1A15" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="400" height="400" fill="url(#bg-${sku})"/>
  <circle cx="320" cy="60" r="70" fill="#fff" opacity="0.18"/>
  <circle cx="50" cy="320" r="90" fill="#fff" opacity="0.12"/>
  <g filter="url(#soft-${sku})">
    <circle cx="200" cy="168" r="96" fill="#fff"/>
  </g>
  <g>${art}</g>
  <rect x="28" y="250" width="344" height="${48 + lines.length * 22}" rx="18" fill="#fff" opacity="0.72"/>
  <text x="200" y="272" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" letter-spacing="0.08em" fill="${meta.accent}">${escapeXml(meta.name.toUpperCase())}</text>
  ${nameBlock}
</svg>
`;
}

function parseProducts() {
  const files = fs
    .readdirSync(seedDir)
    .filter((f) => f.startsWith("products-") && f.endsWith(".ts"));
  const products = [];
  const re =
    /p\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"[^"]*"\s*,\s*"(cat-[^"]+)"/g;

  for (const file of files) {
    const text = fs.readFileSync(path.join(seedDir, file), "utf8");
    let m;
    while ((m = re.exec(text)) !== null) {
      products.push({ sku: m[1], name: m[2], categoryId: m[3] });
    }
  }
  return products;
}

fs.mkdirSync(outDir, { recursive: true });
const products = parseProducts();
if (products.length === 0) {
  console.error("No products parsed from seed files.");
  process.exit(1);
}

for (const product of products) {
  const file = path.join(outDir, `${product.sku}.svg`);
  fs.writeFileSync(file, svgFor(product), "utf8");
}

console.log(`Generated ${products.length} product images in ${outDir}`);
