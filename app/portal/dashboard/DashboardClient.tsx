'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const RECENT_ORDERS = [
  { id: 'ORD-2026-001', date: 'Mar 4, 2026', product: 'M365 Business Premium × 25 seats', client: 'Acme Corporation', status: 'Completed', total: '$646.25', statusColor: '#16A34A' },
  { id: 'ORD-2026-002', date: 'Mar 2, 2026', product: 'Bitdefender GravityZone × 50 devices', client: 'Global Firm Ltd', status: 'Processing', total: '$225.00', statusColor: '#F59E0B' },
  { id: 'ORD-2026-003', date: 'Feb 28, 2026', product: 'M365 Business Basic × 10 seats', client: 'StartupCo', status: 'Completed', total: '$50.00', statusColor: '#16A34A' },
  { id: 'ORD-2026-004', date: 'Feb 25, 2026', product: 'M365 Copilot × 5 seats', client: 'Acme Corporation', status: 'Completed', total: '$150.00', statusColor: '#16A34A' },
];

const QUICK_PRODUCTS = [
  { name: 'M365 Business Basic', price: '$5.00/user', slug: 'm365-business-basic', emoji: '📧' },
  { name: 'M365 Business Standard', price: '$10.50/user', slug: 'm365-business-standard', emoji: '📊' },
  { name: 'M365 Business Premium', price: '$18.50/user', slug: 'm365-business-premium', emoji: '🔒' },
  { name: 'Microsoft Copilot', price: '$30.00/user', slug: 'm365-copilot', emoji: '🤖' },
];

export default function DashboardClient() {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? 'Partner';
  const role = (session?.user as any)?.role ?? 'partner';
  const businessUnitName = (session?.user as any)?.businessUnitName ?? '';
  const isPartner = role === 'partner' || role === 'admin';

  const kpis = isPartner
    ? [
        { label: 'Active Subscriptions', value: '247', icon: '📋', change: '+12 this month', changeUp: true },
        { label: 'Monthly Spend (MRR)', value: '$18,432', icon: '💰', change: '+8.2% vs last month', changeUp: true },
        { label: 'Client Organizations', value: '34', icon: '🏢', change: '3 new this quarter', changeUp: true },
        { label: 'Pending Orders', value: '2', icon: '⏳', change: 'Processing', changeUp: false },
      ]
    : [
        { label: 'Active Licenses', value: '12', icon: '📋', change: '+2 this month', changeUp: true },
        { label: 'Monthly Spend', value: '$186.00', icon: '💰', change: 'Stable', changeUp: true },
        { label: 'Pending Orders', value: '0', icon: '⏳', change: 'Up to date', changeUp: true },
        { label: 'Saved Lists', value: '3', icon: '📌', change: '1 needs renewal', changeUp: false },
      ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1B2B5E' }}>
            Welcome back, {userName.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            {businessUnitName && <span className="font-medium">{businessUnitName} · </span>}
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/portal/catalog" className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center gap-2" style={{ backgroundColor: '#FF6600' }}>
            <span>🛍️</span> Browse Catalog
          </Link>
          {isPartner && (
            <Link href="/portal/purchase-lists" className="px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2" style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', color: '#1B2B5E' }}>
              <span>📋</span> Purchase Lists
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl p-5 border" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{kpi.icon}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: kpi.changeUp ? '#F0FDF4' : '#FFFBEB', color: kpi.changeUp ? '#16A34A' : '#D97706' }}>
                {kpi.changeUp ? '↑' : '→'} {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#1B2B5E' }}>{kpi.value}</p>
            <p className="text-xs mt-1" style={{ color: '#64748B' }}>{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="font-semibold" style={{ color: '#1B2B5E' }}>Recent Orders</h2>
            <Link href="/portal/orders" className="text-xs font-medium" style={{ color: '#00A9E0' }}>View all →</Link>
          </div>
          <div>
            {RECENT_ORDERS.map((order) => (
              <div key={order.id} className="px-6 py-4 border-b hover:bg-slate-50" style={{ borderColor: '#F1F5F9' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-medium" style={{ color: '#64748B' }}>{order.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${order.statusColor}15`, color: order.statusColor }}>{order.status}</span>
                    </div>
                    <p className="text-sm font-medium truncate" style={{ color: '#1B2B5E' }}>{order.product}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{order.client} · {order.date}</p>
                  </div>
                  <span className="font-bold text-sm flex-shrink-0" style={{ color: '#FF6600' }}>{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: 'linear-gradient(135deg, #1B2B5E, #2D4580)' }}>
            <div className="text-2xl mb-2">🏷️</div>
            <h3 className="font-semibold text-white mb-1">Active Promotions</h3>
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <span className="text-xs font-bold text-white font-mono">NEWPARTNER15</span>
                <span className="text-xs font-bold" style={{ color: '#00A9E0' }}>15% OFF</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <span className="text-xs font-bold text-white font-mono">ANNUAL5</span>
                <span className="text-xs font-bold" style={{ color: '#00A9E0' }}>5% OFF annual</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: '#E2E8F0' }}>
              <h3 className="font-semibold text-sm" style={{ color: '#1B2B5E' }}>⚡ Quick Order</h3>
            </div>
            <div className="p-4 space-y-2">
              {QUICK_PRODUCTS.map((product) => (
                <Link key={product.slug} href={`/portal/catalog/${product.slug}`} className="flex items-center justify-between p-3 rounded-lg hover:shadow-sm transition-all" style={{ border: '1px solid #E2E8F0' }}>
                  <div className="flex items-center gap-2">
                    <span>{product.emoji}</span>
                    <div>
                      <p className="text-xs font-medium" style={{ color: '#1B2B5E' }}>{product.name}</p>
                      <p className="text-xs" style={{ color: '#64748B' }}>{product.price}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold" style={{ color: '#FF6600' }}>Add →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
