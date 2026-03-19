
import React, { useState, useEffect } from 'react'
import { addProduct, listProducts } from '../services/storage'
import type { Product } from '../types'
export default function ProductManager({ onSelect }:{onSelect:(p:Product)=>void}){
  const [items,setItems]=useState<Product[]>([])
  const [name,setName]=useState('')
  useEffect(()=>{ setItems(listProducts()) },[])
  const add=()=>{ if(!name.trim()) return; const p=addProduct(name.trim()); setItems(prev=>[...prev,p]); setName('') }
  return (
    <div className='card'>
      <h2 style={{marginTop:0}}>Products</h2>
      <div className='row'>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder='New product name' style={{flex:1,padding:8,borderRadius:8,border:'1px solid var(--border)'}}/>
        <button className='btn' onClick={add}>+ Add</button>
      </div>
      <ul style={{listStyle:'none',padding:0,marginTop:12}}>
        {items.map(p=> (
          <li key={p.id} style={{padding:'8px 0',borderTop:'1px solid var(--border)',cursor:'pointer'}} onClick={()=>onSelect(p)}>
            <strong>{p.name}</strong>
            <div style={{fontSize:12,color:'var(--textLight)'}}>Created {new Date(p.createdAt).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
