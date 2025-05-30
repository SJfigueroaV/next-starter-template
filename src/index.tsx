import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import GoogleSignInButton from './app/GoogleSignInButton';
import { User } from '@supabase/supabase-js';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <div>
      {user ? (
        <p>Bienvenido, {user.email}</p>
      ) : (
        <GoogleSignInButton />
      )}
    </div>
  );
}

