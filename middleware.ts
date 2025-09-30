// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  // Response que usará el helper para setear cookies
  const res = NextResponse.next();

  // Cliente de Supabase para middleware
  const supabase = createMiddlewareClient({ req, res });

  // Usuario actual (si existe)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;
  const isLogin = pathname.startsWith('/login');
  const needsAuth = pathname.startsWith('/descargas');

  // Si no está logueado y quiere entrar a /descargas → enviar a /login con ?next=
  if (!user && needsAuth) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // Si está logueado e intenta /login → enviarlo a /descargas
  if (user && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = '/descargas';
    return NextResponse.redirect(url);
  }

  // Dejar pasar
  return res;
}

// Rutas donde corre el middleware
export const config = {
  matcher: ['/descargas/:path*', '/login'],
};
