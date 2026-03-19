
import React, { useState } from 'react'
import ProductManager from './components/ProductManager'
import UploadArea from './components/UploadArea'
import DocumentList from './components/DocumentList'
import KnowledgeView from './components/KnowledgeView'
import ConflictsView from './components/ConflictsView'
import NotesView from './components/NotesView'
import type { Product } from './types'
const C={ headerBg:'#0a2e2a', green2:'#00a878' }
export default function App(){
  const [product,setProduct]=useState<Product|null>(null)
  const [tab,setTab]=useState<'docs'|'knowledge'|'conflicts'|'notes'>('docs')
  return (
    <div>
      <div style={{background:C.headerBg,color:'#fff',padding:'14px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontWeight:700}}>Product Information Hub</div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setTab('docs')} className='btn' style={{background: tab==='docs'? C.green2 : 'rgba(255,255,255,0.2)'}}>Documents</button>
          <button onClick={()=>setTab('knowledge')} className='btn' style={{background: tab==='knowledge'? C.green2 : 'rgba(255,255,255,0.2)'}}>Knowledge</button>
          <button onClick={()=>setTab('conflicts')} className='btn' style={{background: tab==='conflicts'? C.green2 : 'rgba(255,255,255,0.2)'}}>Conflicts</button>
          <button onClick={()=>setTab('notes')} className='btn' style={{background: tab==='notes'? C.green2 : 'rgba(255,255,255,0.2)'}}>Notes</button>
        </div>
      </div>
      <div style={{padding:20, display:'grid', gridTemplateColumns:'320px 1fr', gap:16}}>
        <div style={{display:'flex', flexDirection:'column', gap:16}}>
          <ProductManager onSelect={setProduct} />
          <UploadArea productId={product?.id||null} onUploaded={()=>{}} />
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:16}}>
          {tab==='docs' && <DocumentList product={product} />}
          {tab==='knowledge' && <KnowledgeView product={product} />}
          {tab==='conflicts' && <ConflictsView product={product} />}
          {tab==='notes' && <NotesView />}
        </div>
      </div>
    </div>
  )
}
