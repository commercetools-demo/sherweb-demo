import Link from 'next/link';

const FEATURES = [
  {
    icon: '🗂️',
    title: 'Unified Cloud Catalog',
    description: 'Browse 30+ vendors and thousands of SKUs in one place. Filter by category, region, sector, and vendor with real-time search.',
  },
  {
    icon: '💰',
    title: 'Partner-Specific Pricing',
    description: 'Automatically see your negotiated pricing. Volume discounts, annual commit savings, and promotional codes built right in.',
  },
  {
    icon: '🛒',
    title: 'Multi-Product Orders',
    description: 'Build purchase lists, save favorites, and order multiple products in a single transaction — no more one-product-at-a-time.',
  },
  {
    icon: '🏢',
    title: 'Order for Any Client',
    description: 'Place orders on behalf of specific end customers. Track subscriptions and licenses per organization, all from one portal.',
  },
  {
    icon: '📊',
    title: 'Order Tracking & History',
    description: 'Full order history with real-time status updates. Download invoices, reorder past purchases, and manage subscriptions.',
  },
  {
    icon: '🌍',
    title: 'Multi-Region Support',
    description: 'Serve clients across North America and Europe. Region-specific catalogs, currencies, and compliance-ready product availability.',
  },
];

const PRODUCTS = [
  { name: 'Microsoft 365 Business', from: '$5.00/user/mo', category: 'Productivity', color: '#0078D4', emoji: '📧', slug: 'm365-business-basic' },
  { name: 'Microsoft Copilot', from: '$30.00/user/mo', category: 'AI Productivity', color: '#7B2FBE', emoji: '🤖', slug: 'm365-copilot' },
  { name: 'Bitdefender GravityZone', from: '$45.00/device/yr', category: 'Security', color: '#E60026', emoji: '🛡️', slug: 'bitdefender-gravityzone' },
  { name: 'Azure Virtual Desktop', from: '$50.00/user/mo', category: 'Infrastructure', color: '#0078D4', emoji: '💻', slug: 'azure-virtual-desktop' },
  { name: 'Dynamics 365 Sales', from: '$65.00/user/mo', category: 'Business Apps', color: '#00B4D8', emoji: '📈', slug: 'dynamics-365-sales' },
  { name: 'Acronis Cyber Backup', from: '$49.00/workload/yr', category: 'Backup & DR', color: '#FF6B35', emoji: '💾', slug: 'acronis-cyber-backup' },
];

const STATS = [
  { value: '50,000+', label: 'Partner Organizations' },
  { value: '30+', label: 'Cloud Vendors' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '3', label: 'Global Regions' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#1B2B5E' }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00A9E0' }}>
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">sherweb</span>
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,169,224,0.2)', color: '#00A9E0' }}>Partner Portal</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#products" className="text-sm text-white/70 hover:text-white transition-colors">Catalog</Link>
            <Link href="#features" className="text-sm text-white/70 hover:text-white transition-colors">Features</Link>
            <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">Partners</Link>
            <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">Support</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors" style={{ backgroundColor: '#FF6600', color: 'white' }}>
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #1B2B5E 0%, #0F1E42 50%, #1a3a6b 100%)' }} className="pt-20 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold" style={{ backgroundColor: 'rgba(0,169,224,0.15)', color: '#00A9E0', border: '1px solid rgba(0,169,224,0.3)' }}>
              <span>🚀</span>
              <span>Now with Microsoft Copilot AI add-ons</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              The Cloud Marketplace<br />
              <span style={{ color: '#00A9E0' }}>Built for MSPs</span>
            </h1>
            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
              One platform to buy, manage, and resell Microsoft 365, Azure, security, and 30+ vendor solutions.
              Unified billing, partner-specific pricing, and multi-product ordering — finally.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login" className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90" style={{ backgroundColor: '#FF6600' }}>
                Access Partner Portal →
              </Link>
              <Link href="/login?role=end-customer" className="px-6 py-3 rounded-lg font-semibold transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                Sign in as End Customer
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-8">
          <span className="text-xs font-semibold" style={{ color: '#64748B' }}>TRUSTED BY MSPs WORLDWIDE</span>
          {['Microsoft Gold Partner', 'Azure Expert MSP', 'Microsoft CSP Direct', 'Bitdefender Gold', 'Acronis Platinum'].map((badge) => (
            <span key={badge} className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>
              ✓ {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <section id="products" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1B2B5E' }}>Featured Cloud Solutions</h2>
            <p style={{ color: '#64748B' }}>Microsoft-first catalog with best-in-class security and productivity tools</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <Link key={product.slug} href={`/portal/catalog/${product.slug}`} className="group block bg-white rounded-xl p-6 border hover:shadow-lg transition-all" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${product.color}15` }}>
                    {product.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold mb-1" style={{ color: '#64748B' }}>{product.category}</div>
                    <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors" style={{ color: '#1B2B5E' }}>{product.name}</h3>
                    <div className="mt-2 text-sm font-bold" style={{ color: '#FF6600' }}>From {product.from}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/portal/catalog" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all" style={{ backgroundColor: '#1B2B5E', color: 'white' }}>
              Browse Full Catalog →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1B2B5E' }}>Everything Your Team Needs</h2>
            <p style={{ color: '#64748B' }}>Replacing a 10-year-old monolith should not mean losing what worked.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold mb-2" style={{ color: '#1B2B5E' }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #1B2B5E, #0F1E42)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Modernize Your Cloud Business?</h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Join 50,000+ partners already using Sherweb to simplify their cloud operations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/login" className="px-8 py-3 rounded-lg font-semibold text-white" style={{ backgroundColor: '#FF6600' }}>
              Access Your Portal
            </Link>
            <Link href="https://www.sherweb.com/partners/" target="_blank" rel="noopener" className="px-8 py-3 rounded-lg font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              Learn About Partnership
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0F1E42', color: 'rgba(255,255,255,0.5)' }} className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: '#00A9E0' }}>
                  <span className="text-white font-bold text-xs">S</span>
                </div>
                <span className="text-white font-bold">sherweb</span>
              </div>
              <p className="text-xs leading-relaxed">More than a cloud distributor. Your partner for growth.</p>
            </div>
            {[
              { title: 'Products', links: ['Microsoft 365', 'Azure', 'Security', 'Backup & DR', 'Business Apps'] },
              { title: 'Partners', links: ['Partner Program', 'Become a Partner', 'Partner Tools', 'Training'] },
              { title: 'Company', links: ['About Sherweb', 'Blog', 'Careers', 'Support', 'Contact'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white text-sm font-semibold mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="text-xs hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t pt-8 flex flex-wrap items-center justify-between gap-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <p className="text-xs">© 2026 Sherweb Inc. All rights reserved. Demo powered by commercetools.</p>
            <div className="flex gap-4 text-xs">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
