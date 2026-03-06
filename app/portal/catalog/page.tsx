'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

const CATEGORIES = [
  { key: 'all', label: '🌐 All Products', count: 9 },
  { key: 'productivity', label: '📧 Productivity', count: 4 },
  { key: 'security', label: '🛡️ Security', count: 2 },
  { key: 'infrastructure', label: '💻 Infrastructure', count: 1 },
  { key: 'business-apps', label: '📈 Business Apps', count: 1 },
  { key: 'backup', label: '💾 Backup & DR', count: 1 },
];

const VENDORS = ['All Vendors', 'Microsoft', 'Bitdefender', 'Acronis'];

const MOCK_PRODUCTS = [
  {
    id: 'prod-001', key: 'm365-business-basic', slug: 'm365-business-basic',
    name: 'Microsoft 365 Business Basic',
    description: 'Essential cloud productivity with Teams, Exchange, SharePoint & OneDrive.',
    vendor: 'Microsoft', category: 'productivity', emoji: '📧', color: '#0078D4',
    features: ['Microsoft Teams', 'Exchange Online (50GB)', 'SharePoint Online', 'OneDrive 1TB', 'Web Office Apps'],
    variants: [
      { id: 1, sku: 'M365-BASIC-MONTHLY', label: 'Monthly', price: 600, priceDisplay: '$6.00/user/mo' },
      { id: 2, sku: 'M365-BASIC-ANNUAL', label: 'Annual', price: 500, priceDisplay: '$5.00/user/mo', badge: 'Save 17%' },
    ],
    tier: 'basic',
  },
  {
    id: 'prod-002', key: 'm365-business-standard', slug: 'm365-business-standard',
    name: 'Microsoft 365 Business Standard',
    description: 'Full desktop apps + all Basic features. Best for most businesses.',
    vendor: 'Microsoft', category: 'productivity', emoji: '📊', color: '#0078D4',
    features: ['Everything in Basic', 'Desktop Office Apps', 'Outlook', 'Webinar Hosting', 'Standard Security'],
    variants: [
      { id: 1, sku: 'M365-STD-MONTHLY', label: 'Monthly', price: 1250, priceDisplay: '$12.50/user/mo' },
      { id: 2, sku: 'M365-STD-ANNUAL', label: 'Annual', price: 1050, priceDisplay: '$10.50/user/mo', badge: 'Save 16%' },
    ],
    tier: 'standard',
  },
  {
    id: 'prod-003', key: 'm365-business-premium', slug: 'm365-business-premium',
    name: 'Microsoft 365 Business Premium',
    description: 'Advanced security, compliance & identity on top of full productivity.',
    vendor: 'Microsoft', category: 'productivity', emoji: '🔒', color: '#0078D4',
    features: ['Everything in Standard', 'Azure AD Premium P1', 'Intune MDM', 'Advanced Threat Protection', 'Conditional Access'],
    variants: [
      { id: 1, sku: 'M365-PREM-MONTHLY', label: 'Monthly', price: 2200, priceDisplay: '$22.00/user/mo' },
      { id: 2, sku: 'M365-PREM-ANNUAL', label: 'Annual', price: 1850, priceDisplay: '$18.50/user/mo', badge: 'Save 16%' },
    ],
    tier: 'premium',
  },
  {
    id: 'prod-004', key: 'm365-copilot', slug: 'm365-copilot',
    name: 'Microsoft 365 Copilot',
    description: 'AI-powered productivity for every Microsoft 365 user. Requires M365 subscription.',
    vendor: 'Microsoft', category: 'productivity', emoji: '🤖', color: '#7B2FBE',
    features: ['AI in Teams', 'Copilot in Word/Excel/PowerPoint', 'Copilot in Outlook', 'Up to 300 seats'],
    variants: [
      { id: 1, sku: 'M365-COPILOT-MONTHLY', label: 'Monthly', price: 3000, priceDisplay: '$30.00/user/mo' },
    ],
    tier: 'premium', badge: '✨ New',
  },
  {
    id: 'prod-005', key: 'azure-virtual-desktop', slug: 'azure-virtual-desktop',
    name: 'Azure Virtual Desktop',
    description: 'Cloud-hosted Windows desktops for any device. Scalable, secure, optimized for M365.',
    vendor: 'Microsoft', category: 'infrastructure', emoji: '💻', color: '#0078D4',
    features: ['Full Windows 11', 'Multi-session Windows', 'M365 Optimized', 'Azure AD Integration', 'Auto-scaling'],
    variants: [
      { id: 1, sku: 'AZURE-AVD-STD', label: 'Monthly', price: 5000, priceDisplay: '$50.00/user/mo' },
    ],
    tier: 'standard',
  },
  {
    id: 'prod-006', key: 'dynamics-365-sales', slug: 'dynamics-365-sales',
    name: 'Microsoft Dynamics 365 Sales',
    description: 'AI-powered CRM to close deals faster and build stronger customer relationships.',
    vendor: 'Microsoft', category: 'business-apps', emoji: '📈', color: '#00B4D8',
    features: ['CRM & Pipeline', 'Sales Automation', 'AI Insights', 'Mobile App', 'Outlook Integration'],
    variants: [
      { id: 1, sku: 'D365-SALES-PRO', label: 'Professional', price: 6500, priceDisplay: '$65.00/user/mo' },
      { id: 2, sku: 'D365-SALES-ENT', label: 'Enterprise', price: 9500, priceDisplay: '$95.00/user/mo' },
    ],
    tier: 'standard',
  },
  {
    id: 'prod-007', key: 'bitdefender-gravityzone', slug: 'bitdefender-gravityzone',
    name: 'Bitdefender GravityZone Business Security',
    description: 'Advanced multi-layer endpoint protection with centralized management for MSPs.',
    vendor: 'Bitdefender', category: 'security', emoji: '🛡️', color: '#E60026',
    features: ['Threat Prevention', 'Anti-Ransomware', 'Web Filtering', 'Device Control', 'MSP Console'],
    variants: [
      { id: 1, sku: 'BDGZ-STD-ANNUAL', label: 'Business Security', price: 4500, priceDisplay: '$45.00/device/yr' },
      { id: 2, sku: 'BDGZ-PREM-ANNUAL', label: 'Business Security Premium', price: 7800, priceDisplay: '$78.00/device/yr', badge: 'EDR Included' },
    ],
    tier: 'standard',
  },
  {
    id: 'prod-008', key: 'microsoft-defender-business', slug: 'microsoft-defender-business',
    name: 'Microsoft Defender for Business',
    description: 'Enterprise-grade endpoint security built for SMBs. Up to 300 users.',
    vendor: 'Microsoft', category: 'security', emoji: '🔐', color: '#0078D4',
    features: ['Threat & Vulnerability Mgmt', 'Attack Surface Reduction', 'Next-gen Protection', 'EDR', 'Auto Investigation'],
    variants: [
      { id: 1, sku: 'MDFB-MONTHLY', label: 'Monthly', price: 300, priceDisplay: '$3.00/user/mo' },
    ],
    tier: 'standard',
  },
  {
    id: 'prod-009', key: 'acronis-cyber-backup', slug: 'acronis-cyber-backup',
    name: 'Acronis Cyber Backup Cloud',
    description: 'Reliable backup and disaster recovery for physical, virtual, and cloud workloads.',
    vendor: 'Acronis', category: 'backup', emoji: '💾', color: '#FF6B35',
    features: ['Cloud & Local Backup', 'M365 Backup', 'Bare-metal Restore', 'Ransomware Protection', 'Per-workload Billing'],
    variants: [
      { id: 1, sku: 'ACRONIS-STD-ANNUAL', label: 'Standard', price: 4900, priceDisplay: '$49.00/workload/yr' },
    ],
    tier: 'standard',
  },
];

const TIER_COLORS: Record<string, string> = {
  basic: '#64748B', standard: '#0078D4', premium: '#7B2FBE', enterprise: '#FF6600',
};

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [vendor, setVendor] = useState('All Vendors');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});
  const { addItem, isLoading } = useCart();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const filtered = MOCK_PRODUCTS.filter(p => {
    const matchCat = category === 'all' || p.category === category;
    const matchVendor = vendor === 'All Vendors' || p.vendor === vendor;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()) || p.vendor.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchVendor && matchSearch;
  });

  const handleAddToCart = async (product: typeof MOCK_PRODUCTS[0]) => {
    const variantIndex = selectedVariants[product.id] ?? 0;
    const variant = product.variants[variantIndex];
    await addItem(
      product.id, variant.id, `${product.name} (${variant.label})`,
      variant.sku, variant.price, 'USD', 1
    );
    setAddedItems(prev => new Set([...prev, product.id]));
    setTimeout(() => setAddedItems(prev => { const s = new Set(prev); s.delete(product.id); return s; }), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1B2B5E' }}>Cloud Catalog</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Microsoft-first marketplace with 30+ vendors · Your partner pricing applied</p>
      </div>

      {/* Search + Filters Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-64 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search products, vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border bg-white focus:outline-none"
            style={{ borderColor: '#E2E8F0' }}
          />
        </div>
        <select
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          className="px-3 py-2.5 rounded-lg text-sm border bg-white focus:outline-none"
          style={{ borderColor: '#E2E8F0', color: '#1B2B5E' }}
        >
          {VENDORS.map(v => <option key={v}>{v}</option>)}
        </select>
        <div className="text-sm" style={{ color: '#64748B' }}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Category Sidebar */}
        <aside className="w-48 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-xl border p-3 space-y-1 sticky top-6" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-xs font-semibold px-2 py-1 uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Categories</p>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all text-left"
                style={{
                  backgroundColor: category === cat.key ? '#EFF6FF' : 'transparent',
                  color: category === cat.key ? '#1B2B5E' : '#64748B',
                }}
              >
                <span>{cat.label}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#F1F5F9', color: '#9CA3AF' }}>{cat.count}</span>
              </button>
            ))}

            <div className="pt-3 border-t mt-2" style={{ borderColor: '#F1F5F9' }}>
              <p className="text-xs font-semibold px-2 py-1 uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Discount Codes</p>
              <div className="px-2 py-3 rounded-lg mt-1" style={{ backgroundColor: '#F0FDF4' }}>
                <p className="text-xs font-bold font-mono" style={{ color: '#16A34A' }}>NEWPARTNER15</p>
                <p className="text-xs" style={{ color: '#4B5563' }}>15% off first order</p>
              </div>
              <div className="px-2 py-3 rounded-lg mt-2" style={{ backgroundColor: '#F0FDF4' }}>
                <p className="text-xs font-bold font-mono" style={{ color: '#16A34A' }}>ANNUAL5</p>
                <p className="text-xs" style={{ color: '#4B5563' }}>5% off annual plans</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-medium" style={{ color: '#1B2B5E' }}>No products found</p>
              <p className="text-sm mt-1" style={{ color: '#64748B' }}>Try adjusting your search or category filters</p>
              <button onClick={() => { setSearch(''); setCategory('all'); setVendor('All Vendors'); }} className="mt-4 text-sm font-medium px-4 py-2 rounded-lg" style={{ backgroundColor: '#1B2B5E', color: 'white' }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((product) => {
                const variantIndex = selectedVariants[product.id] ?? 0;
                const selectedVariant = product.variants[variantIndex];
                const isAdded = addedItems.has(product.id);
                return (
                  <div key={product.id} className="bg-white rounded-xl border flex flex-col transition-all hover:shadow-md" style={{ borderColor: '#E2E8F0' }}>
                    {/* Card Header */}
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: `${product.color}15` }}>
                          {product.emoji}
                        </div>
                        <div className="flex gap-1.5 flex-wrap justify-end">
                          {product.badge && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#7B2FBE15', color: '#7B2FBE' }}>
                              {product.badge}
                            </span>
                          )}
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${TIER_COLORS[product.tier]}15`, color: TIER_COLORS[product.tier] }}>
                            {product.tier}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs font-semibold mb-1" style={{ color: product.color }}>{product.vendor}</p>
                      <h3 className="font-semibold text-sm leading-snug mb-2" style={{ color: '#1B2B5E' }}>{product.name}</h3>
                      <p className="text-xs leading-relaxed mb-3" style={{ color: '#64748B' }}>{product.description}</p>

                      {/* Features */}
                      <div className="space-y-1 mb-4">
                        {product.features.slice(0, 3).map(f => (
                          <div key={f} className="flex items-center gap-1.5 text-xs" style={{ color: '#4B5563' }}>
                            <span className="text-green-500 flex-shrink-0">✓</span> {f}
                          </div>
                        ))}
                        {product.features.length > 3 && (
                          <Link href={`/portal/catalog/${product.slug}`} className="text-xs font-medium hover:underline" style={{ color: '#00A9E0' }}>
                            +{product.features.length - 3} more features →
                          </Link>
                        )}
                      </div>

                      {/* Variant Selector */}
                      {product.variants.length > 1 && (
                        <div className="flex gap-2 mb-4">
                          {product.variants.map((v, idx) => (
                            <button
                              key={v.sku}
                              onClick={() => setSelectedVariants(prev => ({ ...prev, [product.id]: idx }))}
                              className="flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all"
                              style={{
                                borderColor: variantIndex === idx ? '#1B2B5E' : '#E2E8F0',
                                backgroundColor: variantIndex === idx ? '#1B2B5E' : 'transparent',
                                color: variantIndex === idx ? 'white' : '#64748B',
                              }}
                            >
                              {v.label}
                              {v.badge && <span className="block text-green-400 text-xs">{v.badge}</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="px-5 pb-5 pt-0 border-t mt-auto" style={{ borderColor: '#F1F5F9' }}>
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <p className="text-lg font-bold" style={{ color: '#1B2B5E' }}>{selectedVariant.priceDisplay}</p>
                          {selectedVariant.badge && (
                            <p className="text-xs font-medium" style={{ color: '#16A34A' }}>{selectedVariant.badge}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/portal/catalog/${product.slug}`} className="px-3 py-2 rounded-lg text-xs font-medium border transition-all" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                            Details
                          </Link>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={isLoading}
                            className="px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                            style={{ backgroundColor: isAdded ? '#16A34A' : '#FF6600' }}
                          >
                            {isAdded ? '✓ Added' : '+ Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
