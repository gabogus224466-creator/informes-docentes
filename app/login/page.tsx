// app/login/page.tsx  (SERVER)
import { Suspense } from 'react';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

