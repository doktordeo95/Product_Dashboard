
import React, { useRef, useState } from 'react'
import { addDoc } from '../services/storage'
export default function UploadArea({ productId, onUploaded }:{productId:string|null,onUploaded:()=>void}){
  const fileRef = useRef<HTMLInputElement>(null)
  const [status,setStatus]=useState('')
  const onFiles = async (files: FileList|null)=>{ if(!productId||!files) return; for(const f of Array.from(files)){ addDoc(productId,{id:Date.now().toString()+Math.random(),name:f.name,size:f.size,type:f.type}) } setStatus('Added '+files.length+' file(s).'); onUploaded(); if(fileRef.current) fileRef.current.value='' }
  return (
    <div className='card'>
      <h2 style={{marginTop:0}}>Upload Documentation</h2>
      {!productId? <p style={{color:'var(--coral)'}}>Select a product first.</p> : (
        <>
          <input ref={fileRef} type='file' multiple accept='.pdf,image/*' onChange={e=>onFiles(e.target.files)} />
          <div style={{color:'var(--textLight)',marginTop:8}}>{status}</div>
        </>
      )}
    </div>
  )
}
