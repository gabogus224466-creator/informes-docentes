'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/descargas';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'Error de autenticación');
      // cookie creada → ya podemos ir a next
      router.push(next);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display:'grid',placeItems:'center',minHeight:'70vh'}}>
      <form onSubmit={onSubmit} style={{padding:24, border:'1px solid #ddd', borderRadius:10, minWidth:360}}>
        <h2>Ingreso</h2>
        <input
          value={email}
          onChange={e=>setEmail(e.target.value)}
          type="email"
          placeholder="correo@uce.edu.ec"
          style={{width:'100%', padding:10, margin:'8px 0'}}
        />
        <input
          value={password}
          onChange={e=>setPassword(e.target.value)}
          type="password"
          placeholder="Contraseña"
          style={{width:'100%', padding:10, margin:'8px 0'}}
        />
        <button disabled={loading} style={{padding:'10px 16px'}}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
        {error && <p style={{color:'crimson', marginTop:8}}>Error: {error}</p>}
      </form>
    </div>
  );
}

export default function LoginPage() {
  // Suspense evita el error de "useSearchParams needs a suspense boundary"
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

// evita pre-render con datos vacíos que causaba el warning en build
export const dynamic = 'force-dynamic';
