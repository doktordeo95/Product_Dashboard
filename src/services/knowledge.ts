
export const CATEGORIES = [
  { key:'overview', label:'Product Overview', kw:['overview','introduction','about','features','description'] },
  { key:'specs', label:'Technical Specifications', kw:['specification','specifications','technical data','rating','electrical','dimension','weight','voltage','power','performance'] },
  { key:'safety', label:'Safety', kw:['safety','warning','caution','danger','hazard','precaution'] },
  { key:'install', label:'Installation', kw:['install','installation','mount','mounting','setup','connect','wiring','unpacking'] },
  { key:'operation', label:'Operation', kw:['operation','operate','use','usage','controls','settings','program','mode'] },
  { key:'maint', label:'Maintenance & Cleaning', kw:['maintenance','service','clean','cleaning','care','replace','filter'] },
  { key:'trouble', label:'Troubleshooting', kw:['troubleshoot','troubleshooting','issue','problem','error','fault','code'] },
] as const
export type Sections = { [k:string]: {title:string;body:string;page:number}[] }
function emptySections():Sections{ const out:any={}; for(const c of CATEGORIES) out[c.key]=[]; return out }
function firstSentence(s:string){ const t=(s||'').replace(/\s+/g,' ').trim(); const m=t.match(/[^.!?]+[.!?]/); return m? m[0].trim(): t.slice(0,180) }

function detectCategory(text:string){
  const t=(text||'').toLowerCase();
  let best='overview', score=0;

  for(const c of CATEGORIES){
    let s=0;
    for(const k of c.kw){
      if(t.includes(k)) s++;
    }
    if(s>score){
      score=s;
      best=c.key;
    }
  }

  if(score===0){
    // clean safe regex — counts numeric technical data
    const nums = (t.match(/\b(\d+[\.,]?\d*\s?(mm|cm|m|kg|w|v|hz|db|l|m³\/h|m3\/h))\b/gi) || []).length;
    if(nums >= 2) return 'specs';
  }

  return best;
}

function tryHeading(text:string){ const lines=text.split(/
+/); for(const line of lines){ const s=line.trim(); if(!s) continue; const isShort=s.length<=80; const isCaps=s===s.toUpperCase() && /[A-Z]/.test(s); const isTitle=/^(?:[A-Z][a-z]+)(?:\s+[A-Z][a-z]+)*$/.test(s); if(isShort && (isCaps||isTitle)) return s } return '' }
export function buildSectionsFromExtraction(extraction:{pages:{page:number;text:string;source:string}[]}):Sections{ const sections=emptySections(); for(const p of extraction.pages){ const cat=detectCategory(p.text); const title=tryHeading(p.text)||`Page ${p.page}`; const a=firstSentence(p.text); const b=firstSentence(p.text.slice(a.length)); const body=(a+' '+b).trim(); sections[cat].push({title,body,page:p.page}) } return sections }
export type Fact = { field:string; value:string; page?:number }
const FIELD_PATTERNS = [
  { field:'Voltage', re:/(\d{2,3})\s?V/i },
  { field:'Frequency', re:/(\d{2,3})\s?Hz/i },
  { field:'Power', re:/(\d{2,4})\s?W/i },
  { field:'Weight', re:/(\d{1,3}(?:[\.,]\d{1,2})?)\s?kg/i },
  { field:'Dimensions', re:/(\d{2,4})\s?[x×]\s?(\d{2,4})\s?[x×]\s?(\d{2,4})\s?(mm|cm)/i },
  { field:'Capacity', re:/(\d{1,4})\s?L/i },
  { field:'Noise', re:/(\d{1,3})\s?dB(A)?/i },
  { field:'Airflow', re:/(\d{2,4})\s?(m³\/h|m3\/h)/i },
  { field:'IP Rating', re:/IP\s?\d{2}/i },
  { field:'Energy Class', re:/A\+{0,3}|B|C|D|E(?![a-z])/i },
  { field:'Model', re:/Model[:\s]+([A-Z0-9\-]+)/i },
]
export function extractFactsFromExtraction(extraction:{pages:{page:number;text:string}[]}):Fact[]{ const facts:Fact[]=[]; for(const p of extraction.pages){ const t=p.text; for(const pat of FIELD_PATTERNS as any){ const m=t.match(pat.re); if(m){ const val=m[0].replace(/\s+/g,' ').trim(); facts.push({field:pat.field, value:val, page:p.page}) } } const kv=t.match(/(^|
)\s*([A-Za-z][A-Za-z \-/]{2,30})\s*[:=]\s*([^
]{1,40})/g); if(kv){ for(const line of kv){ const mm=line.match(/([A-Za-z][A-Za-z \-/]{2,30})\s*[:=]\s*([^
]{1,40})/); if(mm){ const field=mm[1].trim(); const value=mm[2].trim(); if(field.length<=30 && value.length>0 && value.length<=40){ facts.push({field,value,page:p.page}) } } } } } return dedupFacts(facts) }
function dedupFacts(f:Fact[]):Fact[]{ const seen=new Set<string>(); const out:Fact[]=[]; for(const x of f){ const k=(x.field+':'+x.value).toLowerCase(); if(seen.has(k)) continue; seen.add(k); out.push(x) } return out }
