/**
 * generate-codechef.mjs
 *
 * Fetches CodeChef problems from the public CodeChef API and generates
 * src/data/codechef-problems.json with the same schema used by
 * codeforces-problems.json and leetcode-problems.json.
 *
 * Schema per entry:
 *   { code, title, difficulty, topic, url }
 *
 * CodeChef difficulty map (from their API):
 *   school / beginner  → EASY
 *   easy               → EASY
 *   medium             → MEDIUM
 *   hard               → HARD
 *   challenge / extco  → HARD
 *
 * Run: node scripts/generate-codechef.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'codechef-problems.json');

// CodeChef public problem-list API (no auth required)
// category: practice problems, sorted by code, paginated
const BASE_URL = 'https://www.codechef.com/api/list/problems';
const PAGE_SIZE = 20; // CodeChef returns up to 20 per page
const MAX_RETRIES = 4;
const RETRY_DELAY_MS = 2000;

// Difficulty levels supported by CodeChef
const CATEGORIES = ['school', 'beginner', 'easy', 'medium', 'hard', 'challenge', 'extco'];

function mapDifficulty(category) {
  switch (category?.toLowerCase()) {
    case 'school':
    case 'beginner':
    case 'easy':
      return 'EASY';
    case 'medium':
      return 'MEDIUM';
    case 'hard':
    case 'challenge':
    case 'extco':
      return 'HARD';
    default:
      return 'MEDIUM';
  }
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPage(category, page) {
  const url = `${BASE_URL}?category=${category}&page=${page}&limit=${PAGE_SIZE}&search=`;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) recall-app/1.0',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(`  [Attempt ${attempt}/${MAX_RETRIES}] ${err.message} – page ${page} of category '${category}'`);
      if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS * attempt);
      else return null;
    }
  }
}

async function fetchCategory(category) {
  const problems = [];
  let page = 1;

  console.log(`\n[${category}] Fetching page 1...`);
  const first = await fetchPage(category, page);
  if (!first || !first.data) {
    console.warn(`  No data returned for category '${category}'`);
    return problems;
  }

  const totalProblems = first.total ?? first.count ?? 0;
  const totalPages = Math.ceil(totalProblems / PAGE_SIZE) || 1;
  console.log(`  Total: ${totalProblems} problems across ${totalPages} pages`);

  // Process first page
  for (const p of first.data ?? []) {
    const entry = buildEntry(p, category);
    if (entry) problems.push(entry);
  }

  // Fetch remaining pages
  for (page = 2; page <= totalPages; page++) {
    process.stdout.write(`  Page ${page}/${totalPages}...\r`);
    const data = await fetchPage(category, page);
    if (!data?.data) break;
    for (const p of data.data) {
      const entry = buildEntry(p, category);
      if (entry) problems.push(entry);
    }
    await sleep(300); // be polite to the server
  }
  console.log(`  Done – ${problems.length} collected from '${category}'`);
  return problems;
}

/**
 * djb2 hash — fast, deterministic, widely used.
 * Returns a positive 32-bit integer.
 */
function hashCode(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); // hash * 33 + c
    hash |= 0; // force 32-bit int
  }
  return Math.abs(hash);
}

function buildEntry(p, category) {
  const code = p.code || p.problem_code;
  const title = p.name || p.problem_name || p.title;
  if (!code || !title) return null;

  // Pick topic from tags array (first tag) or category as fallback
  let topic = 'General';
  if (Array.isArray(p.tags) && p.tags.length > 0) {
    topic = p.tags[0];
  } else if (p.topic_tags && Array.isArray(p.topic_tags) && p.topic_tags.length > 0) {
    topic = p.topic_tags[0];
  }

  const upperCode = code.toUpperCase();
  return {
    code: upperCode,
    numericId: hashCode(upperCode),
    title,
    difficulty: mapDifficulty(category),
    topic,
    url: `https://www.codechef.com/problems/${upperCode}`,
  };
}

async function main() {
  const allProblems = [];
  const seen = new Set();

  for (const category of CATEGORIES) {
    const problems = await fetchCategory(category);
    for (const p of problems) {
      if (!seen.has(p.code)) {
        seen.add(p.code);
        allProblems.push(p);
      }
    }
  }

  // Sort alphabetically by code
  allProblems.sort((a, b) => a.code.localeCompare(b.code));

  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allProblems, null, 2), 'utf8');
  console.log(`\n✓ Written ${allProblems.length} CodeChef problems to ${OUTPUT_PATH}`);
}

main().catch((e) => {
  console.error('\nFATAL:', e.message);
  process.exit(1);
});
