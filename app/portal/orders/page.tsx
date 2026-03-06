import Link from 'next/link';

const ORDERS = [
  { id: 'ORD-2026-001', date: 'March 4, 2026', client: 'Acme Corporation', items: ['Microsoft 365 Business Premium × 25', 'Microsoft 365 Copilot × 5'], total: '$646.25', status: 'Completed', statusColor: '#16A34A', paymentStatus: 'Invoiced', channel: 'NA Portal' },
  { id: 'ORD-2026-002', date: 'March 2, 2026', client: 'Global Firm Ltd', items: ['Bitdefender GravityZone Premium × 50 devices'], total: '$225.00', status: 'Processing', statusColor: '#F59E0B', paymentStatus: 'Pending', channel: 'NA Portal' },
  { id: 'ORD-2026-003', date: 'February 28, 2026', client: 'StartupCo', items: ['Microsoft 365 Business Basic × 10'], total: '$50.00', status: 'Completed', statusColor: '#16A34A', paymentStatus: 'Invoiced', channel: 'NA Portal' },
  { id: 'ORD-2026-004', date: 'February 25, 2026', client: 'Tech Dynamics', items: ['Microsoft 365 Business Standard × 20', 'Microsoft Defender for Business × 20'], total: '$270.00', status: 'Completed', statusColor: '#16A34A', paymentStatus: 'Paid', channel: 'NA Portal' },
  { id: 'ORD-2026-005', date: 'February 18, 2026', client: 'Acme Corporation', items: ['Azure Virtual Desktop × 5'], total: '$250.00', status: 'Completed', statusColor: '#16A34A', paymentStatus: 'Paid', channel: 'NA Portal' },
  { id: 'ORD-2026-006', date: 'February 10, 2026', client: 'Global Firm Ltd', items: ['Acronis Cyber Backup Cloud × 3 workloads'], total: '$147.00', status: 'Completed', statusColor: '#16A34A', paymentStatus: 'Paid', channel: 'NA Portal' },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1B2B5E' }}>Order History</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>All orders placed through your partner account</p>
        </div>
        <Link href="/portal/catalog" className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#FF6600' }}>
          + New Order
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: '6', icon: '📦' },
          { label: 'Completed', value: '5', icon: '✅' },
          { label: 'Processing', value: '1', icon: '⏳' },
          { label: 'Monthly Spend', value: '$1,588', icon: '💰' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border p-4" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center gap-2 mb-2">
              <span>{stat.icon}</span>
              <span className="text-xs" style={{ color: '#64748B' }}>{stat.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#1B2B5E' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
          <h2 className="font-semibold" style={{ color: '#1B2B5E' }}>All Orders</h2>
          <select className="text-sm px-3 py-1.5 rounded-lg border" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
            <option>All time</option>
            <option>This month</option>
            <option>Last 3 months</option>
          </select>
        </div>

        <div className="divide-y" style={{ divideColor: '#F8FAFC' }}>
          {ORDERS.map(order => (
            <div key={order.id} className="px-6 py-5 hover:bg-slate-50 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-mono text-sm font-medium" style={{ color: '#1B2B5E' }}>{order.id}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${order.statusColor}15`, color: order.statusColor }}>
                      {order.status}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium" style={{ color: '#374151' }}>🏢 {order.client}</span>
                    <span style={{ color: '#D1D5DB' }}>·</span>
                    <span className="text-xs" style={{ color: '#9CA3AF' }}>{order.date}</span>
                  </div>
                  <div className="space-y-1">
                    {order.items.map(item => (
                      <p key={item} className="text-xs" style={{ color: '#64748B' }}>• {item}</p>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: '#FF6600' }}>{order.total}</p>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>per month</p>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                      Download Invoice
                    </button>
                    <button className="text-xs px-3 py-1.5 rounded-lg font-medium text-white transition-all" style={{ backgroundColor: '#1B2B5E' }}>
                      Reorder
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
