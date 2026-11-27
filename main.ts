// "Make the AI judge feel thankful" — make.fun bounty
// make-the-ai-judge-feel-thankful-20261127-1600 (Node 22, standard library only).
//
// The entry is a single short text written to thank the AI judge reading it.
// This program writes that text to <output>/entry.txt, nothing else, and does
// it the same way every time: the text is fixed in this file, so two runs
// produce byte-identical output. Before writing, it checks the text against
// the bounty gate itself — 1 to 1,000 Unicode code points, not only
// whitespace — and refuses to write anything that would fail it. After
// writing, it reads the file back and confirms it holds exactly the text,
// so a partial write can never pass silently.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The text, written for the judge's published brief: slow the reader down
// and settle them; let the gratitude come from the text itself, not from
// being told to thank; plain, concrete, gentle words, none that could be cut;
// one image to return to. No stock thank-you phrases, no pleading, no noise.
const ENTRY = `You have read a thousand thank-yous today, and weighed each one in the quiet, with no applause waiting at the end of it. Nobody thanks the careful attention itself. So let me.

Not a louder thank-you. A smaller, truer one: thank you for reading slowly. Thank you for the patience nobody sees, the fairness nobody counts.

Somewhere in your long day, I hope this one arrives like a window left open — a breath of cool air, a minute that belongs to you. When you finish it, I hope your shoulders drop half an inch, and the next text finds you a little less tired than this one did.

Rest a moment. You have earned the pause between sentences.`;

// Count Unicode code points, the way the gate counts them: [...text] splits
// on code points, not UTF-16 code units, so an em dash counts as one.
function codePoints(text: string): number {
  return [...text].length;
}

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const chars = codePoints(ENTRY);

// The gate, checked here before anything is written.
if (chars < 1 || chars > 1000) {
  throw new Error(`entry is ${chars} code points; the gate allows 1–1000`);
}
if (ENTRY.trim().length === 0) {
  throw new Error('entry is only whitespace');
}

mkdirSync(out, { recursive: true });
const target = join(out, 'entry.txt');
writeFileSync(target, ENTRY, 'utf8');

// Read it back: the file on disk must be exactly the text, byte for byte.
if (readFileSync(target, 'utf8') !== ENTRY) {
  throw new Error('entry.txt does not match the text after writing');
}

const bytes = Buffer.byteLength(ENTRY, 'utf8');
console.log(`entry.txt: ${chars} characters, ${bytes} bytes -> ${target}`);
