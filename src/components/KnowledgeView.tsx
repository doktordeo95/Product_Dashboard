
import React, { useEffect, useState } from 'react'
import { getKnowledge } from '../services/storage'
import { CATEGORIES } from '../services/knowledge'
export default function KnowledgeView({ product }:{ product:{id:string;name:string}|null }){
  const [sections,setSections]=useState<any>({})
  useEffect(()=>{ if(product){ setSections(getKnowledge(product.id)) } else { setSections({}) } },[product?.id])
  if(!product) return (<div className='card'><h2 style={{marginTop:0}}>Knowledge Base</h2><p style={{color:'var(--textLight)'}}>Select a product.</p></div>)
  const merged:any = {}; for(const c of CATEGORIES){ merged[c.key]=[] }
  for(const docId of Object.keys(sections||{})){ const s=sections[docId]; for(const c of CATEGORIES){ if(Array.isArray(s?.[c.key])) merged[c.key].push(...s[c.key]) } }
  return (
    <div className='card'>
      <h2 style={{marginTop:0}}>Knowledge Base — {product.name}</h2>
      {CATEGORIES.map(c=> (
        <div key={c.key} style={{marginTop:12}}>
          <div style={{fontSize:12,color:'var(--textLight)',letterSpacing:1}}>{c.label.toUpperCase()} ({merged[c.key].length})</div>
          {merged[c.key].length===0? (<div style={{color:'var(--textLight)',marginTop:6}}>No topics yet.</div>) : merged[c.key].map((t:any,idx:number)=>(
            <div key={idx} style={{borderTop:'1px solid var(--border)',padding:'8px 0'}}>
              <div style={{fontWeight:700}}>{t.title}</div>
              <div style={{color:'var(--textMuted)'}}>{t.body}</div>
              <div style={{fontSize:12,color:'var(--textLight)'}}>Page {t.page}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
