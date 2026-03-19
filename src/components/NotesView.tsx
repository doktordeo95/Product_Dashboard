
import React, { useState } from 'react'
export default function NotesView(){
  const [items,setItems]=useState<{title:string;body:string}[]>([])
  const [title,setTitle]=useState('')
  const [body,setBody]=useState('')
  const add=()=>{ if(!title.trim()) return; setItems(prev=>[...prev,{title,body}]); setTitle(''); setBody('') }
  return (
    <div className='card'>
      <h2 style={{marginTop:0}}>My Notes</h2>
      <div style={{display:'flex',gap:8,marginBottom:8}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder='Title' style={{flex:1,padding:8,border:'1px solid var(--border)',borderRadius:8}}/>
        <button className='btn' onClick={add}>+ Add</button>
      </div>
      <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder='Write your note…' rows={4} style={{width:'100%',padding:8,border:'1px solid var(--border)',borderRadius:8}}/>
      <ul style={{listStyle:'none',padding:0,marginTop:12}}>
        {items.map((n,idx)=> (
          <li key={idx} style={{borderTop:'1px solid var(--border)',padding:'8px 0'}}>
            <strong>{n.title}</strong>
            <div style={{color:'var(--textMuted)'}}>{n.body}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
