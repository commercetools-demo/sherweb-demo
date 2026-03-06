import Link from 'next/link';

const CLIENTS = [
  { id: 'c1', name: 'Acme Corporation', contact: 'John Smith', email: 'john.smith@acmecorp.example.com', users: 47, mrr: '$1,241.50', status: 'Active', products: ['M365 Business Premium', 'M365 Copilot', 'Azure AVD'], tier: 'Enterprise' },
  { id: 'c2', name: 'Global Firm Ltd', contact: 'Lisa Wong', email: 'lisa.wong@globalfirm.example.com', users: 23, mrr: '$535.00', status: 'Active', products: ['M365 Business Standard', 'Bitdefender GravityZone'], tier: 'Standard' },
  { id: 'c3', name: 'StartupCo', contact: 'Tom Baker', email: 'tom.baker@startupco.example.com', users: 8, mrr: '$100.00', status: 'Active', products: ['M365 Business Basic'], tier: 'Basic' },
  { id: 'c4', name: 'Tech Dynamics', contact: 'Emma Foster', email: 'emma@techdynamics.example.com', users: 112, mrr: '$3,892.00', status: 'Active', products: ['M365 Business Standard', 'Defender for Business', 'Dynamics 365 Sales'], tier: 'Enterprise' },
  { id: 'c5', name: 'Bright Solutions Inc', contact: 'Chris Park', email: 'cpark@brightsolutions.example.com', users: 34, mrr: '$816.00', status: 'Onboarding', products: ['M365 Business Premium', 'Bitdefender GravityZone Premium'], tier: 'Premium' },
];

const TIER_COLORS: Record<string, string> = { Basic: '#64748B', Standard: '#0078D4', Premium: '#7B2FBE', Enterprise: '#FF6600' };

export default function ClientsPage() {
  const totalMRR = CLIENTS.reduce((sum, c) => sum + parseFloat(c.mrr.replace(/[$,]/g, '')), 0);
  const totalUsers = CLIENTS.reduce((sum, c) => sum + c.users, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1B2B5E' }}>My Clients</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>End customers managed under your partner account</p>
        </div>
        <Link href="/portal/catalog" className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#FF6600' }}>
          + Order for Client
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: CLIENTS.length, icon: '🏢' },
          { label: 'Total Users', value: totalUsers, icon: '👥' },
          { label: 'Monthly Revenue', value: `$${totalMRR.toLocaleString()}`, icon: '💰' },
          { label: 'Active Products', value: '14', icon: '📋' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border p-4" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center gap-2 mb-2">
              <span>{stat.icon}</span>
              <span className="text-xs" style={{ color: '#64748B' }}>{stat.label}</span>
            </div>
            <p className="text-xl font-bold" style={{ color: '#1B2B5E' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Client Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: '#1B2B5E' }}>Client Accounts</h2>
            <input
              type="text"
              placeholder="🔍 Search clients..."
              className="px-3 py-2 rounded-lg text-sm border focus:outline-none"
              style={{ borderColor: '#E2E8F0', width: '220px' }}
            />
          </div>
        </div>

        <div className="divide-y">
          {CLIENTS.map(client => (
            <div key={client.id} className="px-6 py-5 hover:bg-slate-50 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <p className="font-semibold" style={{ color: '#1B2B5E' }}>{client.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${TIER_COLORS[client.tier]}15`, color: TIER_COLORS[client.tier] }}>
                      {client.tier}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: client.status === 'Active' ? '#F0FDF4' : '#FFFBEB', color: client.status === 'Active' ? '#16A34A' : '#92400E' }}>
                      {client.status}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: '#64748B' }}>{client.contact} · {client.email}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {client.products.map(p => (
                      <span key={p} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>{p}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg" style={{ color: '#FF6600' }}>{client.mrr}</p>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>MRR · {client.users} users</p>
                  <div className="flex gap-2 mt-3">
                    <Link href="/portal/catalog" className="text-xs px-3 py-1.5 rounded-lg font-medium text-white" style={{ backgroundColor: '#1B2B5E' }}>
                      Order
                    </Link>
                    <button className="text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
