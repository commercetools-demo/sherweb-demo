'use client';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const DEMO_ACCOUNTS = {
  partner: [
    { label: 'TechPartner Inc. (Premium)', email: 'partner@techpartner.example.com', password: 'Sherweb2026!' },
    { label: 'CloudSolutions MSP (Standard)', email: 'admin@cloudsolutions.example.com', password: 'Sherweb2026!' },
    { label: 'Apex Technologies (Enterprise)', email: 'it@apextech.example.com', password: 'Sherweb2026!' },
  ],
  'end-customer': [
    { label: 'John Smith - Acme Corp', email: 'john.smith@acmecorp.example.com', password: 'Sherweb2026!' },
    { label: 'Lisa Wong - Global Firm', email: 'lisa.wong@globalfirm.example.com', password: 'Sherweb2026!' },
  ],
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') as 'partner' | 'end-customer') || 'partner';

  const [role, setRole] = useState<'partner' | 'end-customer'>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email, password, role,
        redirect: false,
        callbackUrl: '/portal/dashboard',
      });
      if (result?.error) {
        setError('Invalid email or password. Please use the demo credentials below.');
      } else if (result?.ok) {
        router.push('/portal/dashboard');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (acc: { email: string; password: string }) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between p-12" style={{ background: 'linear-gradient(160deg, #1B2B5E 0%, #0F1E42 100%)' }}>
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#00A9E0' }}>
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-white font-bold text-2xl">sherweb</span>
          </Link>
        </div>
        <div>
          <div className="text-5xl mb-6">☁️</div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome back to your cloud marketplace</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-lg leading-relaxed">
            Access your partner portal, browse 30+ cloud vendors, manage orders for your clients, and take advantage of your negotiated pricing.
          </p>
          <div className="mt-8 space-y-4">
            {['Multi-vendor cloud catalog', 'Partner-specific pricing', 'Multi-product ordering', 'Order history & tracking'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#00A9E0' }}>
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Demo powered by commercetools © 2026 Sherweb Inc.
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ backgroundColor: '#F5F7FA' }}>
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1B2B5E' }}>
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-lg" style={{ color: '#1B2B5E' }}>sherweb</span>
          </div>

          <h1 className="text-2xl font-bold mb-2" style={{ color: '#1B2B5E' }}>Sign in to your portal</h1>
          <p className="text-sm mb-8" style={{ color: '#64748B' }}>Select your role to access the right experience</p>

          {/* Role Tabs */}
          <div className="flex rounded-lg p-1 mb-6" style={{ backgroundColor: '#E2E8F0' }}>
            {(['partner', 'end-customer'] as const).map((r) => (
              <button
                key={r}
                onClick={() => { setRole(r); setEmail(''); setPassword(''); setError(''); }}
                className="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all"
                style={{
                  backgroundColor: role === r ? 'white' : 'transparent',
                  color: role === r ? '#1B2B5E' : '#64748B',
                  boxShadow: role === r ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {r === 'partner' ? '🏢 Partner / MSP' : '👤 End Customer'}
              </button>
            ))}
          </div>

          {/* Demo Credentials */}
          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <p className="text-xs font-semibold mb-3" style={{ color: '#1D4ED8' }}>🎯 Demo Accounts — click to autofill:</p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS[role].map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => quickLogin(acc)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all hover:shadow-sm"
                  style={{ backgroundColor: 'white', border: '1px solid #DBEAFE', color: '#1E40AF' }}
                >
                  <span className="font-medium">{acc.label}</span>
                  <span className="block text-gray-500 mt-0.5">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-2.5 rounded-lg text-sm border focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: '#D1D5DB', backgroundColor: 'white', color: '#1E293B' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-lg text-sm border focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: '#D1D5DB', backgroundColor: 'white', color: '#1E293B' }}
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white text-sm transition-all disabled:opacity-70"
              style={{ backgroundColor: '#FF6600' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#E2E8F0' }} />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs" style={{ backgroundColor: '#F5F7FA', color: '#9CA3AF' }}>or continue with</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-3 transition-all"
              style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', color: '#374151' }}
              onClick={() => signIn('azure-ad', { callbackUrl: '/portal/dashboard' }).catch(() => {})}
            >
              <svg width="18" height="18" viewBox="0 0 23 23"><path fill="#f3f3f3" d="M0 0h23v23H0z"/><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
              Sign in with Microsoft
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: '#9CA3AF' }}>
            Don&apos;t have an account?{' '}
            <a href="https://www.sherweb.com/partners/" target="_blank" rel="noopener" className="font-medium hover:underline" style={{ color: '#1B2B5E' }}>
              Become a Sherweb Partner
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
