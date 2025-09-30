import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

const BUCKET = 'informes_docentes';
const ALLOW = new Set(['msaltos@uce.edu.ec', 'gghermosa@uce.edu.ec']); // tu lista

export async function GET() {
  const supa = createRouteHandlerClient({ cookies });

  // auth + whitelist
  const { data: { user } } = await supa.auth.getUser();
  if (!user || !ALLOW.has(user.email ?? '')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // como tus archivos están en la raíz, prefix = '' y list() sin carpeta
  const { data, error } = await supa
    .storage
    .from(BUCKET)
    .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // devolvemos solo nombres (p. ej. "informe_Andrea_Jara.pdf")
  const files = (data ?? [])
    .filter(item => item?.name)        // ignora directorios
    .map(item => item.name);

  return NextResponse.json({ files });
}
