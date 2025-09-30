import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

const BUCKET = 'informes_docentes';
const ALLOW = new Set(['msaltos@uce.edu.ec', 'gghermosa@uce.edu.ec']);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const file = url.searchParams.get('file') || '';

  if (!file) {
    return NextResponse.json({ error: 'Falta "file"' }, { status: 400 });
  }

  const supa = createRouteHandlerClient({ cookies });

  const { data: { user } } = await supa.auth.getUser();
  if (!user || !ALLOW.has(user.email ?? '')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // URL firmada válida por 60 segundos
  const { data, error } = await supa
    .storage
    .from(BUCKET)
    .createSignedUrl(file, 60);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: error?.message || 'No se pudo firmar la URL' }, { status: 500 });
  }

  // redirige al archivo para que el navegador lo descargue
  return NextResponse.redirect(data.signedUrl);
}
