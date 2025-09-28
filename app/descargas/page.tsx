'use client';
import { useEffect, useState } from 'react';

export default function DescargasPage() {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    const r = await fetch('/api/listar?prefix=1S-2025-2025/');
    const j = await r.json();
    setFiles(j.files || []);
    setLoading(false);
  })(); }, []);

  return (
    <div style={{padding:24, maxWidth:720, margin:'0 auto'}}>
      <h1>Informes 1S-2025-2025</h1>
      {loading ? <p>Cargando…</p> : (
        <ul>
          {files.map(f => (
            <li key={f} style={{display:'flex', justifyContent:'space-between', margin:'6px 0'}}>
              <span>{f.replace('1S-2025-2025/','')}</span>
              <a href={`/api/descarga?file=${encodeURIComponent(f)}`}>Descargar</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
