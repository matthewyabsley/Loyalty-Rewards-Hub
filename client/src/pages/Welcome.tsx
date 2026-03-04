import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UtensilsCrossed, Mail, Chrome, Apple, Facebook } from 'lucide-react';

export default function Welcome() {
  const { signIn } = useAuth();
  const [showEmail, setShowEmail] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function handleSocial(provider: string) {
    signIn(provider, 'Guest User', `guest@${provider}.com`);
  }

  function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    signIn('email', name.trim(), email.trim());
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 50%, var(--primary-light) 100%)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20, background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', backdropFilter: 'blur(10px)',
        }}>
          <UtensilsCrossed size={36} color="var(--accent)" />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Tap Yard</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)' }}>Your loyalty, rewarded</p>
      </div>

      <div style={{ width: '100%', maxWidth: 360 }}>
        {!showEmail ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {[
                { provider: 'google', label: 'Continue with Google', icon: <Chrome size={20} />, bg: '#fff', color: '#333' },
                { provider: 'apple', label: 'Continue with Apple', icon: <Apple size={20} />, bg: '#000', color: '#fff' },
                { provider: 'facebook', label: 'Continue with Facebook', icon: <Facebook size={20} />, bg: '#1877F2', color: '#fff' },
              ].map(s => (
                <button key={s.provider} onClick={() => handleSocial(s.provider)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '14px 20px', borderRadius: 12, fontSize: 15, fontWeight: 600,
                  background: s.bg, color: s.color, border: 'none', cursor: 'pointer',
                  transition: 'transform 0.1s', width: '100%',
                }}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.25)' }} />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.25)' }} />
            </div>

            <button onClick={() => setShowEmail(true)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px 20px', borderRadius: 12, fontSize: 15, fontWeight: 600,
              background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.3)',
              cursor: 'pointer', width: '100%',
            }}>
              <Mail size={20} /> Sign up with Email
            </button>
          </>
        ) : (
          <form onSubmit={handleEmail} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
              style={{
                padding: '14px 16px', borderRadius: 12, border: 'none', fontSize: 15,
                background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(10px)',
              }}
            />
            <input
              type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
              style={{
                padding: '14px 16px', borderRadius: 12, border: 'none', fontSize: 15,
                background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(10px)',
              }}
            />
            <button type="submit" style={{
              padding: '14px 20px', borderRadius: 12, fontSize: 15, fontWeight: 600,
              background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
              marginTop: 4,
            }}>
              Create Account
            </button>
            <button type="button" onClick={() => setShowEmail(false)} style={{
              padding: '12px', background: 'transparent', color: 'rgba(255,255,255,0.7)',
              border: 'none', cursor: 'pointer', fontSize: 14,
            }}>
              Back to sign in options
            </button>
          </form>
        )}
      </div>

      <div style={{ marginTop: 40, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Book Tables', 'Order Food', 'Earn Rewards', 'Local Events'].map(f => (
          <div key={f} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 500,
          }}>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: 'var(--accent)' }} />
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}
