'use client';

import { useEffect, useState } from 'react';

export default function DescargasPage() {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // SIN prefix porque tus PDFs están en la raíz del bucket
        const res = await fetch('/api/listar', { signal: ac.signal });

        if (res.status === 401) {
          const next = encodeURIComponent('/descargas');
          window.location.href = `/login?next=${next}`;
          return;
        }

        if (!res.ok) {
          throw new Error(`Fallo al listar (${res.status})`);
        }

        const j = await res.json();
        setFiles(Array.isArray(j.files) ? j.files : []);
      } catch (e: any) {
        if (e?.name !== 'AbortError') setError(e?.message || 'Error');
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  return (
    <div style={{padding:24, maxWidth:720, margin:'0 auto'}}>
      <h1>Informes</h1>

      {loading && <p>Cargando…</p>}
      {!loading && error && <p style={{color:'crimson'}}>{error}</p>}

      {!loading && !error && files.length === 0 && <p>No hay archivos.</p>}

      {!loading && !error && files.length > 0 && (
        <ul>
          {files.map((name) => (
            <li key={name} style={{display:'flex', justifyContent:'space-between', gap:12, margin:'8px 0'}}>
              <span>{name}</span>
              <a href={`/api/descarga?file=${encodeURIComponent(name)}`}>Descargar</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
