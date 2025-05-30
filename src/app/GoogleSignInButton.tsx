// components/GoogleSignInButton.tsx
'use client';

import { supabase } from '../supabaseClient';

export default function GoogleSignInButton() {
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/',
      },
    });
    if (error) console.error('Error al iniciar sesión:', error.message);
  };

  return (
    <button onClick={handleSignIn}>
      Iniciar sesión con Google
    </button>
  );
}
