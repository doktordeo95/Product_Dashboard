
import React, { useEffect, useState } from 'react'
import { detectConflicts } from '../services/conflicts'
export default function ConflictsView({ product }:{ product:{id:string;name:string}|null }){
  const [conflicts,setConflicts]=useState<any[]>([])
  useEffect(()=>{ if(product){ setConflicts(detectConflicts(product.id)) } else { setConflicts([]) } },[product?.id])
  if(!product) return (<div className='card'><h2 style={{marginTop:0}}>Conflicts</h2><p style={{color:'var(--textLight)'}}>Select a product.</p></div>)
  return (
    <div className='card'>
      <h2 style={{marginTop:0}}>Conflicts — {product.name}</h2>
      {conflicts.length===0? (<div style={{color:'var(--textLight)'}}>No conflicts detected yet.</div>) : conflicts.map((c,idx)=> (
        <div key={idx} style={{border:'1px solid var(--border)',borderRadius:8,padding:12,marginBottom:8}}>
          <div style={{fontWeight:700}}>{c.field}</div>
          {c.values.map((v:any,i:number)=> (
            <div key={i} style={{display:'flex',gap:8,alignItems:'center',marginTop:6}}>
              <span style={{fontWeight:700}}>{v.value}</span>
              <span style={{color:'var(--textLight)'}}>in {v.source?.docName||v.source?.docId}</span>
              {v.source?.page? <span style={{color:'var(--textLight)'}}>p.{v.source.page}</span>: null}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
