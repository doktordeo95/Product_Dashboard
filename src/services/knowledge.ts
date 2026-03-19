
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
    let count = 0;
    for (const kw of c.kw) if (t.includes(kw)) count++;
    if (count > score) { score = count; best = c.key; }
  }

  if (score === 0) {
    const matches = (t.match(/\b(\d+[\.,]?\d*\s?(mm|cm|m|kg|w|v|hz|db|l|m³\/h|m3\/h))\b/gi) || []).length;
    if (matches >= 2) return 'specs';
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
  { field: 'Power', re: /\b(\d{2,4})\s?W\b/i },
  { field: 'Weight', re: /\b(\d{1,3}(?:[\.,]\d{1,2})?)\s?kg\b/i },
  { field: 'Dimensions', re: /\b(\d{2,4})\s?[x×]\s?(\d{2,4})\s?[x×]\s?(\d{2,4})\s?(mm|cm)\b/i },
  { field: 'Capacity', re: /\b(\d{1,4})\s?L\b/i },
  { field: 'Noise', re: /\b(\d{1,3})\s?dB(A)?\b/i },
  { field: 'Airflow', re: /\b(\d{2,4})\s?(m³\/h|m3\/h)\b/i },
  { field: 'IP Rating', re: /\bIP\s?\d{2}\b/i },
  { field: 'Energy Class', re: /\b(A\+{0,3}|B|C|D|E)\b/i },
  { field: 'Model', re: /\bModel[:\s]+([A-Z0-9\-]+)\b/i },
];

export function extractFactsFromExtraction(extraction: {
  pages: { page: number; text: string }[];
}): Fact[] {
  const facts: Fact[] = [];

  for (const p of extraction.pages) {
    const text = p.text;

    for (const pat of FIELD_PATTERNS) {
      const match = text.match(pat.re);
      if (match) {
        const val = match[0].replace(/\s+/g, ' ').trim();
        facts.push({ field: pat.field, value: val, page: p.page });
      }
    }

    const kv = text.match(/(^|\n)\s*([A-Za-z][A-Za-z \-/]{2,30})\s*[:=]\s*([^\n]{1,40})/g);
    if (kv) {
      for (const line of kv) {
        const mm = line.match(/([A-Za-z][A-Za-z \-/]{2,30})\s*[:=]\s*([^\n]{1,40})/);
        if (mm) {
          const field = mm[1].trim();
          const value = mm[2].trim();
          if (field.length <= 30 && value.length <= 40) {
            facts.push({ field, value, page: p.page });
          }
        }
      }
    }
  }

  return dedupFacts(facts);
}

function dedupFacts(f: Fact[]): Fact[] {
  const seen = new Set<string>();
  const out: Fact[] = [];
  for (const fact of f) {
    const key = (fact.field + ':' + fact.value).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(fact);
    }
  }
  return out;
}


