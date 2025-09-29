import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const ALLOW = new Set(['msaltos@uce.edu.ec','gghermosa@uce.edu.ec']);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const prefix = url.searchParams.get('prefix') || '1S-2025-2025/';

  // Auth (App Router - Route Handler)
  const supaAuth = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supaAuth.auth.getUser();
  if (!user || !ALLOW.has(user.email || '')) {
    return new Response('No autorizado', { status: 403 });
  }

  // Listar archivos desde Storage (server-side, Service Role)
  const supaSrv = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data, error } = await supaSrv
    .storage.from('informes_docentes')
    .list(prefix, { limit: 500 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const files = (data || [])
    .filter(o => o.name?.toLowerCase().endswith('.pdf'))
    .map(o => `${prefix}${o.name}`);

  return NextResponse.json({ files });
}
