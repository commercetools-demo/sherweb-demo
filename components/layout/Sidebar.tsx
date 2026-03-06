'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { href: '/portal/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/portal/catalog', label: 'Cloud Catalog', icon: '🛍️' },
  { href: '/portal/cart', label: 'Cart', icon: '🛒' },
  { href: '/portal/purchase-lists', label: 'Purchase Lists', icon: '📋' },
  { href: '/portal/orders', label: 'Orders', icon: '📦' },
];

const PARTNER_ONLY_ITEMS = [
  { href: '/portal/clients', label: 'My Clients', icon: '🏢' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isPartner = role === 'partner' || role === 'admin';
  const businessUnitName = (session?.user as any)?.businessUnitName;

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col" style={{ backgroundColor: '#1B2B5E', minHeight: '100vh' }}>
      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00A9E0' }}>
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-white font-bold text-lg">sherweb</span>
        </Link>
        {businessUnitName && (
          <div className="mt-2 text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
            {businessUnitName}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
              }}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {isPartner && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Partner Tools</p>
            </div>
            {PARTNER_ONLY_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                    color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                  }}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="px-3 py-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: '#00A9E0', color: 'white' }}>
              {session?.user?.name?.[0] ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{session?.user?.name}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {role === 'partner' ? 'Partner Account' : 'End Customer'}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-xs py-1.5 px-3 rounded text-center transition-all"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
