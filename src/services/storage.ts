
const KEY_PRODUCTS='pih.products.v1'
const KEY_DOCS_PREFIX='pih.docs.'
const KEY_EXTRACT_PREFIX='pih.extract.'
export type StoredDoc={id:string;name:string;size:number;type:string}
export function listProducts(){ const raw=localStorage.getItem(KEY_PRODUCTS); return raw? JSON.parse(raw):[] }
export function addProduct(name:string){ const all=listProducts(); const p={id:Date.now().toString(),name,createdAt:new Date().toISOString()}; all.push(p); localStorage.setItem(KEY_PRODUCTS,JSON.stringify(all)); return p }
export function listDocs(productId:string){ const raw=localStorage.getItem(KEY_DOCS_PREFIX+productId); return raw? JSON.parse(raw):[] }
export function addDoc(productId:string,d:StoredDoc){ const list=listDocs(productId); list.push(d); localStorage.setItem(KEY_DOCS_PREFIX+productId,JSON.stringify(list)) }
export function saveExtract(productId:string, docId:string, extract:any){ localStorage.setItem(`${KEY_EXTRACT_PREFIX}${productId}.${docId}`, JSON.stringify(extract)) }
export function getExtract(productId:string, docId:string){ const raw=localStorage.getItem(`${KEY_EXTRACT_PREFIX}${productId}.${docId}`); return raw? JSON.parse(raw): null }
const KEY_KNOW_PREFIX='pih.knowledge.'
const KEY_FACTS_PREFIX='pih.facts.'
export function saveKnowledge(productId:string, docId:string, sections:any){ const key=KEY_KNOW_PREFIX+productId; const ex=JSON.parse(localStorage.getItem(key)||'{}'); ex[docId]=sections; localStorage.setItem(key, JSON.stringify(ex)) }
export function getKnowledge(productId:string){ const key=KEY_KNOW_PREFIX+productId; try{ return JSON.parse(localStorage.getItem(key)||'{}') }catch{ return {} } }
export type Fact = { field:string; value:string; source:{docId:string;docName?:string;page?:number} }
export function saveFacts(productId:string, docId:string, docName:string, facts:Fact[]){ const key=KEY_FACTS_PREFIX+productId; const ex=JSON.parse(localStorage.getItem(key)||'{}'); ex[docId]={docName,facts}; localStorage.setItem(key, JSON.stringify(ex)) }
export function getAllFacts(productId:string){ const key=KEY_FACTS_PREFIX+productId; try{ return JSON.parse(localStorage.getItem(key)||'{}') }catch{ return {} } }
