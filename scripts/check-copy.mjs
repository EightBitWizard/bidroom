// Copy gate for Bidroom. Three independent checks, run in CI as part of `pnpm gate`:
//   1. No long dash characters anywhere in tracked source, copy, or docs (ASCII hyphen only).
//   2. No prohibited marketing/product phrases in user-facing copy (messages/).
//   3. No occurrence of the old working name in code or copy (the product is Bidroom; ADR 0001).
// Docs may quote prohibited phrases and the old name as negative examples, so checks 2 and 3
// exclude docs/.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

// Code points for the long-dash family: figure dash (2012), en dash (2013), em dash (2014),
// horizontal bar (2015), minus sign (2212). Only the ASCII hyphen-minus (U+002D) is permitted.
// Built from char codes so this script does not trip its own check.
const LONG_DASHES = [0x2012, 0x2013, 0x2014, 0x2015, 0x2212].map((c) => String.fromCharCode(c));
const LONG_DASH_RE = new RegExp(`[${LONG_DASHES.join("")}]`);

const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".json",
  ".jsonc",
  ".css",
  ".md",
  ".mdx",
  ".sql",
]);

const LONG_DASH_ROOTS = ["src", "messages", "scripts", "docs", "e2e"];
const LONG_DASH_ROOT_FILES = ["README.md", "CHANGELOG.md", "wrangler.jsonc"];

// User-facing copy only.
const COPY_ROOTS = ["messages"];

// Code and copy, but not docs (docs/adr/0001 and the decision logs reference the old name).
const OLD_NAME_ROOTS = ["src", "messages", "scripts", "e2e"];
const OLD_NAME_ROOT_FILES = ["README.md", "CHANGELOG.md"];

// Prohibited phrases (PRD + CLAUDE.md). Case-insensitive substring match.
const PROHIBITED_PHRASES = [
  "official simap partner",
  "guaranteed eligible",
  "guaranteed compliant submission",
  "win more tenders automatically",
  "we file the bid for you",
  "no human review needed",
];

// The earlier working name, built from char codes so this script does not flag itself.
const OLD_NAME = String.fromCharCode(111, 102, 102, 101, 114, 108, 97, 110, 101);

function collect(roots, rootFiles = []) {
  const files = [];
  for (const root of roots) {
    const abs = join(ROOT, root);
    walk(abs, files);
  }
  for (const f of rootFiles) {
    const abs = join(ROOT, f);
    try {
      if (statSync(abs).isFile()) files.push(abs);
    } catch {
      // Optional root file may not exist yet.
    }
  }
  return files;
}

function walk(dir, out) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "migrations") continue;
      walk(abs, out);
    } else if (TEXT_EXTENSIONS.has(extname(entry.name))) {
      out.push(abs);
    }
  }
}

function extname(name) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot) : "";
}

function rel(file) {
  return file.startsWith(ROOT) ? file.slice(ROOT.length + 1) : file;
}

const violations = [];

for (const file of collect(LONG_DASH_ROOTS, LONG_DASH_ROOT_FILES)) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (LONG_DASH_RE.test(line)) {
      violations.push(
        `${rel(file)}:${i + 1}: long dash character found; use the ASCII hyphen "-".`,
      );
    }
  });
}

for (const file of collect(COPY_ROOTS)) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const lower = line.toLowerCase();
    for (const phrase of PROHIBITED_PHRASES) {
      if (lower.includes(phrase)) {
        violations.push(
          `${rel(file)}:${i + 1}: prohibited phrase "${phrase}" is not allowed in copy.`,
        );
      }
    }
  });
}

for (const file of collect(OLD_NAME_ROOTS, OLD_NAME_ROOT_FILES)) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (line.toLowerCase().includes(OLD_NAME)) {
      violations.push(
        `${rel(file)}:${i + 1}: old product name "${OLD_NAME}" found; the product is Bidroom (ADR 0001).`,
      );
    }
  });
}

if (violations.length > 0) {
  console.error("check:copy failed:\n" + violations.map((v) => "  " + v).join("\n"));
  process.exit(1);
}

console.log("check:copy passed: no long dashes, prohibited phrases, or old product name in copy.");
