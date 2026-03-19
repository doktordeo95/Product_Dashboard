
import React, { useEffect, useState } from 'react'
import { listDocs, getExtract, saveExtract, saveKnowledge, saveFacts } from '../services/storage'
import { processFile } from '../services/ocr'
import { buildSectionsFromExtraction, extractFactsFromExtraction } from '../services/knowledge'
export default function DocumentList({ product }:{product:{id:string;name:string}|null}){
  const [docs,setDocs]=useState<{id:string;name:string;size:number;type:string}[]>([])
  const [status,setStatus]=useState('')
  const [active,setActive]=useState<string|null>(null)
  const [result,setResult]=useState<any>(null)
  useEffect(()=>{ if(product){ setDocs(listDocs(product.id)); setResult(null); setActive(null) } },[product?.id])
  const onProcessLocal = async (d:{id:string;name:string})=>{ try{ setActive(d.id); setStatus('Pick the same file to process (local-only POC)...'); const picker=document.createElement('input'); picker.type='file'; picker.accept='.pdf'; picker.onchange=async()=>{ const file=picker.files?.[0]; if(!file){ setStatus('No file selected.'); return } setStatus('Processing...'); const out=await processFile(file,(s)=>setStatus(s)); saveExtract(product!.id,d.id,out); setResult(out); setStatus('Done.') }; picker.click() }catch(e:any){ setStatus('Failed: '+(e?.message||'unknown')) } }
  const openSaved=(d:{id:string;name:string})=>{ const out=getExtract(product!.id,d.id); setResult(out); setStatus(out? 'Loaded saved extraction.' : 'No saved result.'); setActive(d.id) }
  return (
    <div className='card'>
      <h2 style={{marginTop:0}}>Documents</h2>
      {!product? <p style={{color:'var(--coral)'}}>Select a product.</p> : (
        <div style={{display:'flex',gap:16}}>
          <div style={{width:'40%'}}>
            <ul style={{listStyle:'none',padding:0}}>
              {docs.map(d=> (
                <li key={d.id} style={{padding:'8px 0',borderTop:'1px solid var(--border)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
                    <div>
                      <strong>{d.name}</strong>
                      <div style={{fontSize:12,color:'var(--textLight)'}}>{(d.size/1024).toFixed(1)} KB</div>
                    </div>
                    <div className='row'>
                      <button className='btn' onClick={()=>onProcessLocal(d)}>Process</button>
                      <button className='btn' style={{background:'#666'}} onClick={()=>openSaved(d)}>Open saved</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div style={{color:'var(--textLight)',marginTop:8}}>{status}</div>
          </div>
          <div style={{flex:1}}>
            {!result? <p style={{color:'var(--textLight)'}}>No result yet.</p> : (
              <div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <h3 style={{margin:0}}>Extraction Result</h3>
                  <div style={{display:'flex',gap:8}}>
                    <button className='btn' onClick={()=>{ const blob=new Blob([JSON.stringify(result,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='extraction.json'; a.click(); }}>Download JSON</button>
                    <button className='btn' style={{background:'#225'}} onClick={()=>{ if(!product||!active||!result) return; const sections=buildSectionsFromExtraction(result); saveKnowledge(product.id, active, sections); const facts=extractFactsFromExtraction(result); const doc=docs.find(x=>x.id===active); saveFacts(product.id, active, (doc?.name||'doc'), facts.map(f=>({field:f.field,value:f.value,page:f.page,source:undefined}))); setStatus('Knowledge & facts saved. Open Knowledge/Conflicts tabs.'); }}>Build Knowledge</button>
                  </div>
                </div>
                <div style={{marginTop:8}}>
                  {result.pages.map((p:any,idx:number)=> (
                    <div key={idx} style={{borderTop:'1px solid var(--border)',padding:'10px 0',display:'flex',gap:12}}>
                      {result.thumbnails?.[idx] && <img src={result.thumbnails[idx]} style={{width:120,border:'1px solid var(--border)',borderRadius:6}}/>}
                      <div>
                        <div style={{fontWeight:700,color:'var(--green1)'}}>Page {p.page} • {p.source.toUpperCase()} {typeof p.confidence==='number'? `• ${Math.round(p.confidence)}%`:''}</div>
                        <div style={{color:'var(--textMuted)',marginTop:6}}>{p.text? (p.text.length>600? p.text.slice(0,600)+'…':p.text) : <em style={{color:'var(--coral)'}}>No text</em>}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
