// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const supa = createRouteHandlerClient({ cookies });

  const { data, error } = await supa.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  // éxito: cookie de sesión queda seteada por el helper
  return NextResponse.json({ ok: true });
}
