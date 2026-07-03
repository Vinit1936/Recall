/**
 * download-leetcode-dataset.mjs
 *
 * Downloads the kaysss/leetcode-problem-set dataset from HuggingFace
 * datasets-server API (JSON rows endpoint) and processes it into
 * src/data/leetcode-problems.json with the required schema.
 *
 * Supports resuming from a checkpoint offset and retries on failure.
 *
 * Run: node scripts/download-leetcode-dataset.mjs [startOffset]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '../src/data/leetcode-problems.json');
const CHECKPOINT_PATH = path.join(__dirname, '../src/data/leetcode-problems.checkpoint.json');

const API_BASE = 'https://datasets-server.huggingface.co/rows';
const DATASET = 'kaysss/leetcode-problem-set';
const CONFIG = 'default';
const SPLIT = 'train';
const BATCH_SIZE = 100;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

// Allow resuming from a specific offset via CLI argument
const START_OFFSET = parseInt(process.argv[2] ?? '0', 10) || 0;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchBatch(offset) {
  const url = `${API_BASE}?dataset=${encodeURIComponent(DATASET)}&config=${CONFIG}&split=${SPLIT}&offset=${offset}&limit=${BATCH_SIZE}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(url);
    if (res.ok) return res.json();

    const body = await res.text();
    console.error(`\n[Attempt ${attempt}/${MAX_RETRIES}] HTTP ${res.status} at offset ${offset}`);

    if (attempt < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * attempt;
      console.error(`Retrying in ${delay / 1000}s...`);
      await sleep(delay);
    } else {
      throw new Error(`HTTP ${res.status} after ${MAX_RETRIES} attempts: ${body.slice(0, 200)}`);
    }
  }
}

function processRow(row) {
  const r = row.row;

  if (r.paidOnly === true) return null;

  const id = parseInt(r.frontendQuestionId, 10);
  if (isNaN(id) || r.frontendQuestionId == null) return null;

  const difficulty = (r.difficulty || '').toUpperCase();
  if (!['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) return null;

  let topic = 'General';
  if (Array.isArray(r.topicTags) && r.topicTags.length > 0) {
    const first = r.topicTags[0];
    topic = typeof first === 'string' ? first : (first?.name ?? 'General');
  } else if (typeof r.topicTags === 'string' && r.topicTags.length > 0) {
    try {
      const parsed = JSON.parse(r.topicTags);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const first = parsed[0];
        topic = typeof first === 'string' ? first : (first?.name ?? 'General');
      }
    } catch { /* leave as General */ }
  }

  const slug = r.titleSlug || '';
  return {
    id,
    title: r.title || '',
    slug,
    difficulty,
    topic,
    url: `https://leetcode.com/problems/${slug}/`,
  };
}

async function main() {
  // Ensure output dir exists
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Load existing data if resuming
  let problems = [];
  if (START_OFFSET > 0 && fs.existsSync(CHECKPOINT_PATH)) {
    problems = JSON.parse(fs.readFileSync(CHECKPOINT_PATH, 'utf8'));
    console.log(`Resuming from offset ${START_OFFSET} with ${problems.length} problems already collected.`);
  } else {
    console.log('Starting fresh download...');
  }

  console.log('Fetching total row count...');
  const first = await fetchBatch(START_OFFSET === 0 ? 0 : START_OFFSET);
  const total = first.num_rows_total;
  console.log(`Total rows in dataset: ${total}`);

  // Process the first fetched batch
  for (const row of first.rows) {
    const p = processRow(row);
    if (p) problems.push(p);
  }

  // Fetch remaining batches
  const startBatch = Math.ceil((START_OFFSET > 0 ? START_OFFSET : 0) / BATCH_SIZE) + 1;
  const totalBatches = Math.ceil(total / BATCH_SIZE);

  for (let i = startBatch; i < totalBatches; i++) {
    const offset = i * BATCH_SIZE;
    process.stdout.write(`\rFetching rows ${offset}–${Math.min(offset + BATCH_SIZE, total)} of ${total}...`);

    const batch = await fetchBatch(offset);
    for (const row of batch.rows) {
      const p = processRow(row);
      if (p) problems.push(p);
    }

    // Save checkpoint every 500 rows in case of interruption
    if (i % 5 === 0) {
      fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(problems, null, 2), 'utf8');
    }
  }

  console.log(`\nDone. Total kept after filtering: ${problems.length}`);

  // Sort by id
  problems.sort((a, b) => a.id - b.id);

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(problems, null, 2), 'utf8');
  console.log(`Written to: ${OUTPUT_PATH}`);
  console.log(`Final problem count: ${problems.length}`);

  // Clean up checkpoint
  if (fs.existsSync(CHECKPOINT_PATH)) fs.unlinkSync(CHECKPOINT_PATH);
}

main().catch((e) => {
  console.error('\nFATAL:', e.message);
  process.exit(1);
});
