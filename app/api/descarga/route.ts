import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

const ALLOW = new Set(['msaltos@uce.edu.ec','gghermosa@uce.edu.ec']);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const file = url.searchParams.get('file'); // ej.: 1S-2025-2025/informe_Pamela_Bravo.pdf
  if (!file) return NextResponse.json({ error: 'Falta ?file' }, { status: 400 });

  const supaAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookies().get(n)?.value } as any }
  );
  const { data: { user } } = await supaAuth.auth.getUser();
  if (!user || !ALLOW.has(user.email || '')) return new Response('No autorizado', { status: 403 });

  const supaSrv = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await supaSrv.storage.from('informes_docentes').createSignedUrl(file, 60 * 5);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.redirect(data.signedUrl);
}
