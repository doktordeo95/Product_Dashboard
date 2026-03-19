export const CATEGORIES = [
  { key: 'overview', label: 'Product Overview', kw: ['overview', 'introduction', 'about', 'features', 'description'] },
  { key: 'specs', label: 'Technical Specifications', kw: ['specification', 'specifications', 'technical data', 'rating', 'electrical', 'dimension', 'weight', 'voltage', 'power', 'performance'] },
  { key: 'safety', label: 'Safety', kw: ['safety', 'warning', 'caution', 'danger', 'hazard', 'precaution'] },
  { key: 'install', label: 'Installation', kw: ['install', 'installation', 'mount', 'mounting', 'setup', 'connect', 'wiring', 'unpacking'] },
  { key: 'operation', label: 'Operation', kw: ['operation', 'operate', 'use', 'usage', 'controls', 'settings', 'program', 'mode'] },
  { key: 'maint', label: 'Maintenance & Cleaning', kw: ['maintenance', 'service', 'clean', 'cleaning', 'care', 'replace', 'filter'] },
  { key: 'trouble', label: 'Troubleshooting', kw: ['troubleshoot', 'troubleshooting', 'issue', 'problem', 'error', 'fault', 'code'] },
] as const;

export type Sections = {
  [k: string]: { title: string; body: string; page: number }[];
};

function emptySections(): Sections {
  const out: any = {};
  for (const c of CATEGORIES) out[c.key] = [];
  return out;
}

function firstSentence(s: string) {
  const t = (s || '').replace(/\s+/g, ' ').trim();
  const m = t.match(/[^.!?]+[.!?]/);
  return m ? m[0].trim() : t.slice(0, 180);
}

function detectCategory(text: string) {
  const t = (text || '').toLowerCase();
  let best = 'overview', score = 0;

  for (const c of CATEGORIES) {
    let s = 0;
    for (const k of c.kw) if (t.includes(k)) s++;
    if (s > score) { score = s; best = c.key; }
  }

  if (score === 0) {
    const nums = (t.match(/\b(\d+[\.,]?\d*\s?(mm|cm|m|kg|w|v|hz|db|l|m³\/h|m3\/h))\b/gi) || []).length;
    if (nums >= 2) return 'specs';
  }

  return best;
}

function tryHeading(text: string) {
  const lines = text.split(/\n+/);
  for (const line of lines) {
    const s = line.trim();
    if (!s) continue;
    const isShort = s.length <= 80;
    const isCaps = s === s.toUpperCase() && /[A-Z]/.test(s);
    const isTitle = /^(?:[A-Z][a-z]+)(?:\s+[A-Z][a-z]+)*$/.test(s);
    if (isShort && (isCaps || isTitle)) return s;
  }
  return '';
}

export function buildSectionsFromExtraction(extraction: {
  pages: { page: number; text: string; source: string }[];
}): Sections {
  const sections = emptySections();
  for (const p of extraction.pages) {
    const cat = detectCategory(p.text);
    const title = tryHeading(p.text) || `Page ${p.page}`;
    const a = firstSentence(p.text);
    const b = firstSentence(p.text.slice(a.length));
    const body = (a + ' ' + b).trim();
    sections[cat].push({ title, body, page: p.page });
  }
  return sections;
}

export type Fact = { field: string; value: string; page?: number };

const FIELD_PATTERNS = [
  { field: 'Voltage', re: /\b(\d{2,3})\s?V\b/i },
  { field: 'Frequency', re: /\b(\d{2,3})\s?Hz\b/i },
