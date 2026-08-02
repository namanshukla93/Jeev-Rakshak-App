'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Shield, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NGOLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      
      // Redirect to dashboard on success
      router.push('/ngo/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // After Google auth, Supabase redirects here to exchange the code for a session
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (oAuthError) throw oAuthError;
    } catch (err) {
      setError(err.message || 'Failed to login with Google. Make sure Google OAuth is configured in Supabase.');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '6rem 0', backgroundColor: 'var(--bg-secondary)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        
        <div className="card" style={{ padding: '3rem', borderTop: '6px solid var(--accent-color)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Shield size={48} color="var(--bg-primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h1 style={{ color: 'var(--bg-primary)', fontSize: '2rem', marginBottom: '0.5rem' }}>NGO Partner Login</h1>
            <p style={{ color: 'var(--text-muted)' }}>Secure access to the emergency dispatch network.</p>
          </div>

          {error && (
            <div style={{ padding: '1rem', backgroundColor: '#FEF2F2', color: '#991B1B', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Registered Email</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="partner@ngo.org" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            className="btn btn-outline" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Don't have an account? <Link href="/ngo/signup" style={{ color: 'var(--accent-color)', fontWeight: 600, textDecoration: 'underline' }}>Sign up here</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
