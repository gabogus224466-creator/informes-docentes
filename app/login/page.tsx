// app/login/page.tsx
import { Suspense } from 'react';
import LoginForm from './LoginForm';

// evita el prerender/SSG de esta página
export const dynamic = 'force-dynamic'; 
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
