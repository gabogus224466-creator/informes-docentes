// app/login/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supaBrowser } from '@/lib/supabase-browser';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const params = useSearchParams();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const supabase = supaBrowser();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) setMsg(error.message);
    else router.push(params.get('next') || '/descargas');
  };

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <form onSubmit={onSubmit} style={{width:360, background:'#fff', padding:24, borderRadius:12, boxShadow:'0 2px 10px rgba(0,0,0,.08)'}}>
        <h2>Ingreso</h2>
        <input placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',margin:'8px 0',padding:8}} />
        <input type="password" placeholder="Contraseña" value={pass} onChange={e=>setPass(e.target.value)} style={{width:'100%',margin:'8px 0',padding:8}} />
        <button type="submit" style={{padding:'8px 12px'}}>Entrar</button>
        {msg && <p style={{color:'crimson'}}>{msg}</p>}
      </form>
    </div>
  );
}
