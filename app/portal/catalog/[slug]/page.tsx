'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

const PRODUCTS: Record<string, any> = {
  'm365-business-basic': {
    id: 'prod-001', name: 'Microsoft 365 Business Basic',
    description: 'Web-based apps and cloud services with Microsoft Teams, Exchange, SharePoint and OneDrive. Best for businesses that need cloud-based apps with email and video conferencing.',
    longDescription: `Microsoft 365 Business Basic gives your team the productivity tools they need to work from anywhere. With cloud-based apps and services, your team can collaborate in real time using Microsoft Teams for meetings and chat, Exchange Online for professional email, SharePoint and OneDrive for secure file storage and sharing.\n\nIdeal for businesses that primarily work in a browser or on mobile devices, Business Basic provides the collaborative backbone without requiring local software installations.`,
    vendor: 'Microsoft', category: 'Productivity', emoji: '📧', color: '#0078D4',
    prerequisites: null,
    maxSeats: 300,
    features: [
      { icon: '💬', name: 'Microsoft Teams', desc: 'Chat, meet, call, and collaborate' },
      { icon: '📨', name: 'Exchange Online', desc: '50GB mailbox per user, custom domain' },
      { icon: '📁', name: 'SharePoint Online', desc: 'Team sites, intranet, document management' },
      { icon: '☁️', name: 'OneDrive (1TB)', desc: 'Personal cloud storage per user' },
      { icon: '🌐', name: 'Web Office Apps', desc: 'Word, Excel, PowerPoint, OneNote (browser)' },
      { icon: '🛡️', name: 'Standard Security', desc: 'MFA, anti-malware, anti-spam' },
    ],
    variants: [
      { id: 1, sku: 'M365-BASIC-MONTHLY', label: 'Monthly', term: 'monthly', price: 600, priceDisplay: '$6.00', unit: 'user/month', annualTotal: null },
      { id: 2, sku: 'M365-BASIC-ANNUAL', label: 'Annual Commitment', term: 'annual', price: 500, priceDisplay: '$5.00', unit: 'user/month', annualTotal: 6000, savings: '17%', badge: '💡 Best Value' },
    ],
    comparison: [
      { feature: 'Microsoft Teams', basic: true, standard: true, premium: true },
      { feature: 'Exchange Online (50GB)', basic: true, standard: true, premium: true },
      { feature: 'SharePoint & OneDrive', basic: true, standard: true, premium: true },
      { feature: 'Desktop Office Apps', basic: false, standard: true, premium: true },
      { feature: 'Webinar Hosting', basic: false, standard: true, premium: true },
      { feature: 'Intune MDM', basic: false, standard: false, premium: true },
      { feature: 'Azure AD P1', basic: false, standard: false, premium: true },
      { feature: 'Advanced Threat Protection', basic: false, standard: false, premium: true },
    ],
    relatedProducts: ['m365-business-standard', 'm365-business-premium', 'm365-copilot'],
  },
  'm365-business-standard': {
    id: 'prod-002', name: 'Microsoft 365 Business Standard',
    description: 'Full desktop and cloud apps plus email, video conferencing, and advanced security for modern businesses.',
    longDescription: `Microsoft 365 Business Standard includes everything in Business Basic plus the full suite of desktop Office applications. Your team gets the latest versions of Word, Excel, PowerPoint, Outlook, and more — installed on up to 5 PCs or Macs per user.\n\nWith webinar hosting capabilities, standard security controls, and the Publisher and Access apps for Windows, Business Standard is the complete productivity solution for businesses that rely on Office apps daily.`,
    vendor: 'Microsoft', category: 'Productivity', emoji: '📊', color: '#0078D4',
    prerequisites: null, maxSeats: 300,
    features: [
      { icon: '💻', name: 'Desktop Office Apps', desc: 'Word, Excel, PowerPoint, Outlook, Publisher, Access' },
      { icon: '💬', name: 'Microsoft Teams', desc: 'Chat, meet, call, collaborate, webinars' },
      { icon: '📨', name: 'Exchange Online', desc: '50GB mailbox, calendar, contacts' },
      { icon: '📁', name: 'SharePoint & OneDrive', desc: '1TB cloud storage per user' },
      { icon: '🎥', name: 'Webinar Hosting', desc: 'Host webinars with registration pages' },
      { icon: '📱', name: 'Mobile Apps', desc: 'Office apps on phone and tablet' },
    ],
    variants: [
      { id: 1, sku: 'M365-STD-MONTHLY', label: 'Monthly', term: 'monthly', price: 1250, priceDisplay: '$12.50', unit: 'user/month' },
      { id: 2, sku: 'M365-STD-ANNUAL', label: 'Annual Commitment', term: 'annual', price: 1050, priceDisplay: '$10.50', unit: 'user/month', savings: '16%', badge: '💡 Best Value' },
    ],
    comparison: null,
    relatedProducts: ['m365-business-basic', 'm365-business-premium', 'm365-copilot'],
  },
  'm365-business-premium': {
    id: 'prod-003', name: 'Microsoft 365 Business Premium',
    description: 'Advanced security, compliance, and identity management on top of the full productivity suite.',
    longDescription: `Microsoft 365 Business Premium is the most complete Microsoft 365 plan for small and medium businesses that need advanced security. On top of everything in Business Standard, Premium adds enterprise-grade security features including Azure AD Premium P1, Microsoft Intune for device management, and Microsoft Defender for Business.\n\nWith conditional access policies, information protection, and advanced threat analytics, Business Premium helps MSPs and resellers build a strong security posture for their clients without the enterprise price tag.`,
    vendor: 'Microsoft', category: 'Productivity', emoji: '🔒', color: '#0078D4',
    prerequisites: null, maxSeats: 300,
    features: [
      { icon: '🔐', name: 'Azure AD Premium P1', desc: 'Conditional access, MFA, SSPR' },
      { icon: '📱', name: 'Microsoft Intune', desc: 'Mobile device and app management' },
      { icon: '🛡️', name: 'Defender for Business', desc: 'Endpoint security with EDR' },
      { icon: '🔍', name: 'Azure Information Protection', desc: 'Classify and protect sensitive data' },
      { icon: '📊', name: 'Advanced Analytics', desc: 'Microsoft 365 Defender security dashboard' },
      { icon: '💻', name: 'All Standard Features', desc: 'Full desktop Office + Teams + Exchange' },
    ],
    variants: [
      { id: 1, sku: 'M365-PREM-MONTHLY', label: 'Monthly', term: 'monthly', price: 2200, priceDisplay: '$22.00', unit: 'user/month' },
      { id: 2, sku: 'M365-PREM-ANNUAL', label: 'Annual Commitment', term: 'annual', price: 1850, priceDisplay: '$18.50', unit: 'user/month', savings: '16%', badge: '💡 Best Value' },
    ],
    comparison: null, relatedProducts: ['m365-business-standard', 'm365-copilot', 'microsoft-defender-business'],
  },
  'm365-copilot': {
    id: 'prod-004', name: 'Microsoft 365 Copilot',
    description: 'AI-powered productivity for every Microsoft 365 user. Requires existing M365 subscription.',
    longDescription: `Microsoft 365 Copilot brings the power of AI to every tool your team uses daily. Copilot works alongside you in Microsoft Teams (summarizing meetings, drafting follow-ups), Outlook (composing emails, summarizing threads), Word (drafting, rewriting), Excel (analyzing data, creating charts), and PowerPoint (creating presentations from a prompt).\n\nAvailable for Business Basic, Standard, and Premium subscribers. Maximum 300 seats per tenant.`,
    vendor: 'Microsoft', category: 'AI Productivity', emoji: '🤖', color: '#7B2FBE',
    prerequisites: 'Requires Microsoft 365 Business Basic, Standard, or Premium subscription', maxSeats: 300,
    features: [
      { icon: '💬', name: 'Copilot in Teams', desc: 'Summarize meetings, generate action items' },
      { icon: '📧', name: 'Copilot in Outlook', desc: 'Draft emails, summarize email threads' },
      { icon: '📝', name: 'Copilot in Word', desc: 'Draft, rewrite, and summarize documents' },
      { icon: '📊', name: 'Copilot in Excel', desc: 'Analyze data, generate formulas and charts' },
      { icon: '🎯', name: 'Copilot in PowerPoint', desc: 'Create presentations from a prompt or document' },
      { icon: '🌐', name: 'Microsoft Copilot', desc: 'Web-based AI with Graph-grounded context' },
    ],
    variants: [
      { id: 1, sku: 'M365-COPILOT-MONTHLY', label: 'Monthly', term: 'monthly', price: 3000, priceDisplay: '$30.00', unit: 'user/month' },
    ],
    comparison: null, relatedProducts: ['m365-business-basic', 'm365-business-standard', 'm365-business-premium'],
  },
  'azure-virtual-desktop': {
    id: 'prod-005', name: 'Azure Virtual Desktop',
    description: 'Cloud-hosted Windows desktops for any device. Scalable, secure, optimized for Microsoft 365.',
    longDescription: `Azure Virtual Desktop (AVD) lets your clients access a full Windows 11 experience from any device, anywhere. Managed in Azure, AVD is optimized for Microsoft 365 and includes multi-session Windows for cost-effective scaling.\n\nSherweb's managed AVD solution includes landing zone setup, Azure AD integration, and ongoing monitoring. Pricing shown is base compute — storage and licenses billed separately.`,
    vendor: 'Microsoft', category: 'Infrastructure', emoji: '💻', color: '#0078D4',
    prerequisites: 'Azure subscription required', maxSeats: null,
    features: [
      { icon: '🖥️', name: 'Full Windows 11 Desktop', desc: 'Complete Windows experience in the cloud' },
      { icon: '👥', name: 'Multi-session Windows', desc: 'Share VMs across users to reduce cost' },
      { icon: '📊', name: 'M365 Optimization', desc: 'Teams AV redirection, OneDrive sync' },
      { icon: '🔐', name: 'Azure AD Integration', desc: 'SSO, Conditional Access, MFA' },
      { icon: '⚡', name: 'Auto-scaling', desc: 'Scale up and down based on demand' },
      { icon: '📱', name: 'Any Device', desc: 'Windows, Mac, iOS, Android, browser' },
    ],
    variants: [
      { id: 1, sku: 'AZURE-AVD-STD', label: 'Standard', term: 'monthly', price: 5000, priceDisplay: '$50.00', unit: 'user/month (base compute)' },
    ],
    comparison: null, relatedProducts: ['m365-business-premium', 'microsoft-defender-business'],
  },
  'dynamics-365-sales': {
    id: 'prod-006', name: 'Microsoft Dynamics 365 Sales',
    description: 'AI-powered CRM to close deals faster and build stronger customer relationships.',
    longDescription: `Microsoft Dynamics 365 Sales empowers your clients' sales teams with AI-powered insights, relationship analytics, and intelligent pipeline management. Built into the Microsoft ecosystem, it integrates natively with Teams, Outlook, and LinkedIn Sales Navigator.`,
    vendor: 'Microsoft', category: 'Business Apps', emoji: '📈', color: '#00B4D8',
    prerequisites: 'Microsoft 365 recommended', maxSeats: null,
    features: [
      { icon: '🤖', name: 'AI Sales Insights', desc: 'Predictive scoring, opportunity health' },
      { icon: '📊', name: 'Pipeline Management', desc: 'Visual pipeline with drag-and-drop' },
      { icon: '📧', name: 'Outlook Integration', desc: 'Track emails and meetings automatically' },
      { icon: '💬', name: 'Teams Integration', desc: 'Call summaries, deal rooms' },
      { icon: '📱', name: 'Mobile App', desc: 'Full CRM on iOS and Android' },
      { icon: '🔄', name: 'Sales Automation', desc: 'Sequences, cadences, follow-up reminders' },
    ],
    variants: [
      { id: 1, sku: 'D365-SALES-PRO', label: 'Professional', term: 'monthly', price: 6500, priceDisplay: '$65.00', unit: 'user/month' },
      { id: 2, sku: 'D365-SALES-ENT', label: 'Enterprise', term: 'monthly', price: 9500, priceDisplay: '$95.00', unit: 'user/month', badge: 'Includes advanced AI' },
    ],
    comparison: null, relatedProducts: ['m365-business-standard', 'm365-copilot'],
  },
  'bitdefender-gravityzone': {
    id: 'prod-007', name: 'Bitdefender GravityZone Business Security',
    description: 'Advanced multi-layer endpoint protection with centralized management for MSPs.',
    longDescription: `Bitdefender GravityZone Business Security delivers industry-leading protection against sophisticated threats including ransomware, fileless attacks, and zero-day exploits. The cloud-hosted GravityZone console gives MSPs a single pane of glass to manage protection across all client environments.\n\nGravityZone Premium adds Endpoint Detection and Response (EDR) for advanced threat investigation and response capabilities.`,
    vendor: 'Bitdefender', category: 'Security', emoji: '🛡️', color: '#E60026',
    prerequisites: null, maxSeats: null,
    features: [
      { icon: '🛡️', name: 'Advanced Threat Prevention', desc: 'Machine learning, behavioral analysis' },
      { icon: '🔒', name: 'Anti-Ransomware', desc: 'Real-time protection + automatic rollback' },
      { icon: '🌐', name: 'Web Filtering', desc: 'Block malicious and inappropriate sites' },
      { icon: '💾', name: 'Device Control', desc: 'Manage USB, Bluetooth, and peripheral access' },
      { icon: '📊', name: 'Centralized Console', desc: 'Single cloud dashboard for all clients' },
      { icon: '🔍', name: 'EDR (Premium)', desc: 'Threat hunting and incident response' },
    ],
    variants: [
      { id: 1, sku: 'BDGZ-STD-ANNUAL', label: 'Business Security', term: 'annual', price: 4500, priceDisplay: '$45.00', unit: 'device/year' },
      { id: 2, sku: 'BDGZ-PREM-ANNUAL', label: 'Business Security Premium', term: 'annual', price: 7800, priceDisplay: '$78.00', unit: 'device/year', badge: '+ EDR' },
    ],
    comparison: null, relatedProducts: ['microsoft-defender-business', 'm365-business-premium'],
  },
  'microsoft-defender-business': {
    id: 'prod-008', name: 'Microsoft Defender for Business',
    description: 'Enterprise-grade endpoint security built for SMBs up to 300 users.',
    longDescription: `Microsoft Defender for Business brings enterprise-class endpoint security to small and medium businesses at an accessible price. It includes threat and vulnerability management, attack surface reduction, next-generation antivirus, EDR, and automated investigation and response — all managed from the Microsoft 365 Defender portal.`,
    vendor: 'Microsoft', category: 'Security', emoji: '🔐', color: '#0078D4',
    prerequisites: null, maxSeats: 300,
    features: [
      { icon: '🔍', name: 'Threat & Vulnerability Management', desc: 'Discover and prioritize vulnerabilities' },
      { icon: '🛡️', name: 'Attack Surface Reduction', desc: 'Rules to prevent common attack vectors' },
      { icon: '🤖', name: 'Next-gen Protection', desc: 'AI-powered antivirus and anti-malware' },
      { icon: '🔎', name: 'EDR', desc: 'Endpoint Detection and Response' },
      { icon: '⚡', name: 'Automated Response', desc: 'Auto-remediate threats without manual intervention' },
      { icon: '📊', name: 'Centralized Management', desc: 'Microsoft 365 Defender portal' },
    ],
    variants: [
      { id: 1, sku: 'MDFB-MONTHLY', label: 'Monthly', term: 'monthly', price: 300, priceDisplay: '$3.00', unit: 'user/month (up to 300)' },
    ],
    comparison: null, relatedProducts: ['bitdefender-gravityzone', 'm365-business-premium'],
  },
  'acronis-cyber-backup': {
    id: 'prod-009', name: 'Acronis Cyber Backup Cloud',
    description: 'Reliable backup and disaster recovery for physical, virtual, cloud workloads and Microsoft 365.',
    longDescription: `Acronis Cyber Backup Cloud offers MSPs a flexible, per-workload backup and recovery solution with centralized management. Protect Windows servers, VMs, cloud workloads, and Microsoft 365 data from a single console. Pricing is per workload per year with no minimum seats.`,
    vendor: 'Acronis', category: 'Backup & DR', emoji: '💾', color: '#FF6B35',
    prerequisites: null, maxSeats: null,
    features: [
      { icon: '☁️', name: 'Cloud & Local Backup', desc: 'Flexible storage destinations' },
      { icon: '📧', name: 'Microsoft 365 Backup', desc: 'Mailbox, Teams, OneDrive, SharePoint' },
      { icon: '💻', name: 'Bare-Metal Restore', desc: 'Full system recovery to any hardware' },
      { icon: '🔒', name: 'Ransomware Protection', desc: 'Active protection with AI threat detection' },
      { icon: '📊', name: 'Centralized Console', desc: 'Manage all client backups from one portal' },
      { icon: '💰', name: 'Per-workload Billing', desc: 'Pay only for what you protect' },
    ],
    variants: [
      { id: 1, sku: 'ACRONIS-STD-ANNUAL', label: 'Standard', term: 'annual', price: 4900, priceDisplay: '$49.00', unit: 'workload/year' },
    ],
    comparison: null, relatedProducts: ['microsoft-defender-business', 'm365-business-premium'],
  },
};

const RELATED_SLUGS: Record<string, { slug: string; name: string; emoji: string; price: string }> = {
  'm365-business-basic': { slug: 'm365-business-basic', name: 'M365 Business Basic', emoji: '📧', price: '$5/user/mo' },
  'm365-business-standard': { slug: 'm365-business-standard', name: 'M365 Business Standard', emoji: '📊', price: '$10.50/user/mo' },
  'm365-business-premium': { slug: 'm365-business-premium', name: 'M365 Business Premium', emoji: '🔒', price: '$18.50/user/mo' },
  'm365-copilot': { slug: 'm365-copilot', name: 'M365 Copilot', emoji: '🤖', price: '$30/user/mo' },
  'azure-virtual-desktop': { slug: 'azure-virtual-desktop', name: 'Azure Virtual Desktop', emoji: '💻', price: '$50/user/mo' },
  'dynamics-365-sales': { slug: 'dynamics-365-sales', name: 'Dynamics 365 Sales', emoji: '📈', price: '$65/user/mo' },
  'bitdefender-gravityzone': { slug: 'bitdefender-gravityzone', name: 'Bitdefender GravityZone', emoji: '🛡️', price: '$45/device/yr' },
  'microsoft-defender-business': { slug: 'microsoft-defender-business', name: 'Defender for Business', emoji: '🔐', price: '$3/user/mo' },
  'acronis-cyber-backup': { slug: 'acronis-cyber-backup', name: 'Acronis Cyber Backup', emoji: '💾', price: '$49/workload/yr' },
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const product = PRODUCTS[slug];
  const { addItem, isLoading } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(product?.variants.length > 1 ? 1 : 0);
  const [seats, setSeats] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'comparison'>('overview');

  if (!product) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#1B2B5E' }}>Product not found</h2>
        <Link href="/portal/catalog" className="text-sm font-medium" style={{ color: '#00A9E0' }}>← Back to catalog</Link>
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];
  const totalPrice = (selectedVariant.price * seats) / 100;

  const handleAddToCart = async () => {
    await addItem(
      product.id, selectedVariant.id,
      `${product.name} (${selectedVariant.label}) × ${seats}`,
      selectedVariant.sku, selectedVariant.price * seats, 'USD', 1
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
        <Link href="/portal/catalog" className="hover:text-blue-600 transition-colors">Cloud Catalog</Link>
        <span>›</span>
        <span style={{ color: '#1B2B5E' }}>{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Product Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0" style={{ backgroundColor: `${product.color}15` }}>
                {product.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold" style={{ color: product.color }}>{product.vendor}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>{product.category}</span>
                </div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: '#1B2B5E' }}>{product.name}</h1>
                <p style={{ color: '#64748B' }}>{product.description}</p>
                {product.prerequisites && (
                  <div className="mt-3 flex items-center gap-2 p-3 rounded-lg text-sm" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E' }}>
                    <span>⚠️</span> <span>{product.prerequisites}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-6 border-b" style={{ borderColor: '#E2E8F0' }}>
              {(['overview', 'features', ...(product.comparison ? ['comparison'] : [])] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className="px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-all"
                  style={{
                    borderColor: activeTab === tab ? '#1B2B5E' : 'transparent',
                    color: activeTab === tab ? '#1B2B5E' : '#64748B',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-5">
              {activeTab === 'overview' && (
                <div className="prose text-sm max-w-none" style={{ color: '#4B5563' }}>
                  {product.longDescription.split('\n\n').map((para: string, i: number) => (
                    <p key={i} className="mb-3 leading-relaxed">{para}</p>
                  ))}
                </div>
              )}
              {activeTab === 'features' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {product.features.map((f: any) => (
                    <div key={f.name} className="flex gap-3 p-4 rounded-xl" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <span className="text-2xl flex-shrink-0">{f.icon}</span>
                      <div>
                        <p className="font-medium text-sm" style={{ color: '#1B2B5E' }}>{f.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'comparison' && product.comparison && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                        <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#1B2B5E' }}>Feature</th>
                        <th className="text-center py-2 px-3 font-semibold" style={{ color: '#64748B' }}>Basic</th>
                        <th className="text-center py-2 px-3 font-semibold" style={{ color: '#0078D4' }}>Standard</th>
                        <th className="text-center py-2 px-3 font-semibold" style={{ color: '#7B2FBE' }}>Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.comparison.map((row: any) => (
                        <tr key={row.feature} className="border-b" style={{ borderColor: '#F1F5F9' }}>
                          <td className="py-3 pr-4" style={{ color: '#4B5563' }}>{row.feature}</td>
                          <td className="text-center py-3 px-3">{row.basic ? '✓' : <span style={{ color: '#D1D5DB' }}>—</span>}</td>
                          <td className="text-center py-3 px-3">{row.standard ? '✓' : <span style={{ color: '#D1D5DB' }}>—</span>}</td>
                          <td className="text-center py-3 px-3">{row.premium ? '✓' : <span style={{ color: '#D1D5DB' }}>—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {product.relatedProducts && (
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1B2B5E' }}>Related Products</h3>
              <div className="flex flex-wrap gap-3">
                {product.relatedProducts.filter((r: string) => r !== slug).map((relSlug: string) => {
                  const rel = RELATED_SLUGS[relSlug];
                  if (!rel) return null;
                  return (
                    <Link key={relSlug} href={`/portal/catalog/${relSlug}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border hover:shadow-sm transition-all" style={{ borderColor: '#E2E8F0', color: '#1B2B5E' }}>
                      <span>{rel.emoji}</span>
                      <div>
                        <p className="text-xs font-medium">{rel.name}</p>
                        <p className="text-xs" style={{ color: '#FF6600' }}>{rel.price}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Purchase Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-5 sticky top-6" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#1B2B5E' }}>Configure & Purchase</h3>

            {/* Variant Selection */}
            {product.variants.length > 1 && (
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#64748B' }}>Billing Term</label>
                <div className="space-y-2">
                  {product.variants.map((v: any, idx: number) => (
                    <button
                      key={v.sku}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all"
                      style={{
                        borderColor: selectedVariantIndex === idx ? '#1B2B5E' : '#E2E8F0',
                        backgroundColor: selectedVariantIndex === idx ? '#EFF6FF' : 'white',
                      }}
                    >
                      <div>
                        <span className="text-sm font-medium" style={{ color: '#1B2B5E' }}>{v.label}</span>
                        {v.badge && <span className="ml-2 text-xs font-medium" style={{ color: '#16A34A' }}>{v.badge}</span>}
                      </div>
                      <span className="font-bold text-sm" style={{ color: '#FF6600' }}>{v.priceDisplay}/{v.unit}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Seat Count */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#64748B' }}>
                {product.name.includes('device') || selectedVariant.unit?.includes('device') ? 'Number of Devices' : 'Number of Users'}
              </label>
              <div className="flex items-center gap-3">
                <button onClick={() => setSeats(s => Math.max(1, s - 1))} className="w-9 h-9 rounded-lg border font-bold transition-all hover:bg-gray-50 flex items-center justify-center" style={{ borderColor: '#E2E8F0' }}>−</button>
                <input
                  type="number"
                  min={1}
                  max={product.maxSeats ?? 9999}
                  value={seats}
                  onChange={(e) => setSeats(Math.max(1, Math.min(product.maxSeats ?? 9999, parseInt(e.target.value) || 1)))}
                  className="flex-1 text-center py-2 border rounded-lg font-semibold focus:outline-none"
                  style={{ borderColor: '#E2E8F0', color: '#1B2B5E' }}
                />
                <button onClick={() => setSeats(s => Math.min(product.maxSeats ?? 9999, s + 1))} className="w-9 h-9 rounded-lg border font-bold transition-all hover:bg-gray-50 flex items-center justify-center" style={{ borderColor: '#E2E8F0' }}>+</button>
              </div>
              {product.maxSeats && <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Maximum {product.maxSeats} {selectedVariant.unit?.includes('device') ? 'devices' : 'users'}</p>}
            </div>

            {/* Total */}
            <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm" style={{ color: '#64748B' }}>Unit price</span>
                <span className="font-medium text-sm" style={{ color: '#1B2B5E' }}>{selectedVariant.priceDisplay}/{selectedVariant.unit}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm" style={{ color: '#64748B' }}>Quantity</span>
                <span className="font-medium text-sm" style={{ color: '#1B2B5E' }}>× {seats}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between items-center" style={{ borderColor: '#E2E8F0' }}>
                <span className="font-semibold" style={{ color: '#1B2B5E' }}>Total</span>
                <span className="text-xl font-bold" style={{ color: '#FF6600' }}>${totalPrice.toFixed(2)}</span>
              </div>
              <p className="text-xs mt-1 text-right" style={{ color: '#9CA3AF' }}>per {selectedVariant.unit?.includes('year') ? 'year' : 'month'}</p>
            </div>

            {/* Discount Code */}
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <p className="text-xs font-medium" style={{ color: '#16A34A' }}>🏷️ Apply discount code at checkout</p>
              <p className="text-xs mt-1" style={{ color: '#4B5563' }}>Try <strong>NEWPARTNER15</strong> for 15% off your first order</p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all"
              style={{ backgroundColor: addedToCart ? '#16A34A' : '#FF6600' }}
            >
              {addedToCart ? '✓ Added to Cart!' : 'Add to Cart →'}
            </button>

            <Link href="/portal/cart" className="block w-full py-2.5 rounded-xl font-medium text-sm text-center mt-3 transition-all" style={{ backgroundColor: '#F1F5F9', color: '#1B2B5E' }}>
              View Cart
            </Link>
          </div>

          {/* Support Box */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#E2E8F0' }}>
            <h4 className="font-semibold text-sm mb-3" style={{ color: '#1B2B5E' }}>Need Help?</h4>
            <div className="space-y-2 text-xs" style={{ color: '#64748B' }}>
              <p>💬 Live chat with your Sherweb account manager</p>
              <p>📞 24/7 Technical support for partners</p>
              <p>📚 Microsoft 365 documentation & training</p>
            </div>
            <a href="https://www.sherweb.com/partners/" target="_blank" rel="noopener" className="mt-3 block text-xs font-medium text-center py-2 rounded-lg transition-all" style={{ backgroundColor: '#EFF6FF', color: '#1B2B5E' }}>
              Contact Support →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
