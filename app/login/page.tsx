'use client'

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/app/lib/supabase/client';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const redirectTo = useMemo(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/auth/callback`;
    }
    return undefined;
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (session) {
        router.push('/');
        //return NextResponse.redirect('/',request.url)
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);
  
  return (
    <div style={{ width: '100%', maxWidth: '420px', margin: 'auto', paddingTop: '100px' }}>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google', 'github']}
        redirectTo={redirectTo}
      />
    </div>
  );
}