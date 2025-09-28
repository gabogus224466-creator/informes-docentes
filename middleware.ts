import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextRequest } from 'next/server';

const ALLOW = new Set(['msaltos@uce.edu.ec','gghermosa@uce.edu.ec']);

export async function middleware(req: NextRequest) {
  const publicPaths = new Set<string>(['/login', '/api/health']);
  const { pathname } = req.nextUrl;
  if (publicPaths.has(pathname)) return NextResponse.next();

  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (k: string) => req.cookies.get(k)?.value,
        set: () => {},
        remove: () => {}
      } as any
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  if (!ALLOW.has(user.email || '')) return new NextResponse('No autorizado', { status: 403 });
  return res;
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
