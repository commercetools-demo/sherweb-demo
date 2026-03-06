// scripts/seed.mjs
// Sherweb Demo - commercetools Seed Script

const PROJECT_KEY = 'sherweb_demo';
const CLIENT_SECRET = '09KJSN__m3a8clIl-BmmV-_yRwe6sXde';
const CLIENT_ID = 'VmZyoDeGgsINdWPM5uiehHE6';
const AUTH_URL = 'https://auth.us-central1.gcp.commercetools.com';
const API_URL = 'https://api.us-central1.gcp.commercetools.com';

// Get access token
async function getToken() {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${AUTH_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&scope=manage_project:${PROJECT_KEY}`,
  });
  const data = await response.json();
  if (!data.access_token) throw new Error(`Auth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

let token = null;

async function api(method, path, body = null) {
  if (!token) token = await getToken();
  const response = await fetch(`${API_URL}/${PROJECT_KEY}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  if (!response.ok) {
    if (data.statusCode === 409 || data.message?.includes('already exists') || data.message?.includes('duplicate') || data.errors?.some(e => e.code === 'DuplicateField')) {
      console.log(`  ⚠️  Already exists, skipping: ${path}`);
      return null;
    }
    console.error(`API Error ${response.status} for ${method} ${path}:`, JSON.stringify(data, null, 2));
    return null;
  }
  return data;
}

async function getExisting(path, query = '') {
  if (!token) token = await getToken();
  const response = await fetch(`${API_URL}/${PROJECT_KEY}${path}${query}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.ok ? await response.json() : null;
}

// ============================================================
// STEP 1: Create Product Type
// ============================================================
async function createProductType() {
  console.log('\n📦 Creating Product Type...');
  const result = await api('POST', '/product-types', {
    key: 'saas-license',
    name: 'SaaS License',
    description: 'Software as a Service license product type for cloud services',
    attributes: [
      {
        name: 'vendor',
        label: { 'en-US': 'Vendor' },
        isRequired: false,
        type: { name: 'text' },
        attributeConstraint: 'None',
        isSearchable: true,
        inputHint: 'SingleLine',
      },
      {
        name: 'term',
        label: { 'en-US': 'Billing Term' },
        isRequired: false,
        type: { name: 'enum', values: [
          { key: 'monthly', label: 'Monthly' },
          { key: 'annual', label: 'Annual (1 Year)' },
          { key: 'triennial', label: 'Triennial (3 Years)' },
        ]},
        attributeConstraint: 'CombinationUnique',
        isSearchable: true,
        inputHint: 'SingleLine',
      },
      {
        name: 'tier',
        label: { 'en-US': 'Service Tier' },
        isRequired: false,
        type: { name: 'enum', values: [
          { key: 'basic', label: 'Basic' },
          { key: 'standard', label: 'Standard' },
          { key: 'premium', label: 'Premium' },
          { key: 'enterprise', label: 'Enterprise' },
        ]},
        attributeConstraint: 'CombinationUnique',
        isSearchable: true,
        inputHint: 'SingleLine',
      },
      {
        name: 'seats',
        label: { 'en-US': 'Minimum Seats' },
        isRequired: false,
        type: { name: 'number' },
        attributeConstraint: 'None',
        isSearchable: false,
        inputHint: 'SingleLine',
      },
      {
        name: 'shortDescription',
        label: { 'en-US': 'Short Description' },
        isRequired: false,
        type: { name: 'text' },
        attributeConstraint: 'None',
        isSearchable: false,
        inputHint: 'MultiLine',
      },
      {
        name: 'features',
        label: { 'en-US': 'Key Features' },
        isRequired: false,
        type: { name: 'set', elementType: { name: 'text' } },
        attributeConstraint: 'None',
        isSearchable: false,
        inputHint: 'MultiLine',
      },
      {
        name: 'prerequisites',
        label: { 'en-US': 'Prerequisites' },
        isRequired: false,
        type: { name: 'text' },
        attributeConstraint: 'None',
        isSearchable: false,
        inputHint: 'MultiLine',
      },
      {
        name: 'dataResidency',
        label: { 'en-US': 'Data Residency' },
        isRequired: false,
        type: { name: 'enum', values: [
          { key: 'global', label: 'Global' },
          { key: 'us', label: 'United States' },
          { key: 'eu', label: 'European Union' },
          { key: 'ca', label: 'Canada' },
        ]},
        attributeConstraint: 'None',
        isSearchable: true,
        inputHint: 'SingleLine',
      },
      {
        name: 'sector',
        label: { 'en-US': 'Target Sector' },
        isRequired: false,
        type: { name: 'set', elementType: { name: 'enum', values: [
          { key: 'all', label: 'All' },
          { key: 'nonprofit', label: 'Non-Profit' },
          { key: 'public', label: 'Public Sector / Government' },
          { key: 'education', label: 'Education' },
          { key: 'healthcare', label: 'Healthcare' },
          { key: 'smb', label: 'Small & Medium Business' },
          { key: 'enterprise', label: 'Enterprise' },
        ]}},
        attributeConstraint: 'None',
        isSearchable: true,
        inputHint: 'SingleLine',
      },
    ],
  });
  if (result) console.log('  ✅ Product type created:', result.id);
  return result;
}

// ============================================================
// STEP 2: Create Categories
// ============================================================
async function createCategories() {
  console.log('\n📂 Creating Categories...');
  const categories = {};

  const categoryDefs = [
    { key: 'productivity', name: 'Productivity', slug: 'productivity', description: 'Productivity and collaboration solutions', order: '0.1' },
    { key: 'infrastructure', name: 'Infrastructure & Cloud', slug: 'infrastructure', description: 'Cloud infrastructure and platform services', order: '0.2' },
    { key: 'security', name: 'Security & Compliance', slug: 'security', description: 'Cybersecurity and compliance solutions', order: '0.3' },
    { key: 'backup', name: 'Backup & Disaster Recovery', slug: 'backup', description: 'Data protection and recovery solutions', order: '0.4' },
    { key: 'business-apps', name: 'Business Applications', slug: 'business-apps', description: 'CRM, ERP and business applications', order: '0.5' },
    { key: 'professional-services', name: 'Professional Services', slug: 'professional-services', description: 'Implementation and consulting services', order: '0.6' },
  ];

  for (const cat of categoryDefs) {
    const result = await api('POST', '/categories', {
      key: cat.key,
      name: { 'en-US': cat.name },
      slug: { 'en-US': cat.slug },
      description: { 'en-US': cat.description },
      orderHint: cat.order,
    });
    if (result) {
      categories[cat.key] = result.id;
      console.log(`  ✅ Category: ${cat.name}`);
    } else {
      // Try to get existing
      const existing = await getExisting('/categories', `?where=key%3D%22${cat.key}%22`);
      if (existing?.results?.[0]) categories[cat.key] = existing.results[0].id;
    }
  }
  return categories;
}

// ============================================================
// STEP 3: Get Product Type ID
// ============================================================
async function getProductTypeId() {
  const result = await getExisting('/product-types', '?where=key%3D%22saas-license%22');
  return result?.results?.[0]?.id;
}

// ============================================================
// STEP 4: Create Products
// ============================================================
async function createProducts(categories, productTypeId) {
  console.log('\n🛍️ Creating Products...');

  const products = [
    // ---- Microsoft 365 ----
    {
      key: 'm365-business-basic',
      name: { 'en-US': 'Microsoft 365 Business Basic' },
      description: { 'en-US': 'Web-based apps and cloud services. Best for businesses that need cloud-based apps with email and video conferencing.' },
      slug: { 'en-US': 'm365-business-basic' },
      categories: [{ typeId: 'category', id: categories['productivity'] }],
      masterVariant: {
        key: 'm365-business-basic-monthly',
        sku: 'M365-BASIC-MONTHLY',
        prices: [
          { value: { currencyCode: 'USD', centAmount: 600 }, country: 'US' },
          { value: { currencyCode: 'CAD', centAmount: 820 }, country: 'CA' },
          { value: { currencyCode: 'EUR', centAmount: 570 }, country: 'DE' },
        ],
        images: [{ url: 'https://logo.clearbit.com/microsoft.com', label: 'Microsoft 365', dimensions: { w: 200, h: 200 } }],
        attributes: [
          { name: 'vendor', value: 'Microsoft' },
          { name: 'term', value: { key: 'monthly', label: 'Monthly' } },
          { name: 'tier', value: { key: 'basic', label: 'Basic' } },
          { name: 'seats', value: 1 },
          { name: 'features', value: ['Microsoft Teams', 'Exchange Online (50GB)', 'SharePoint Online', 'OneDrive (1TB)', 'Web versions of Office apps'] },
          { name: 'dataResidency', value: { key: 'global', label: 'Global' } },
          { name: 'sector', value: [{ key: 'smb', label: 'Small & Medium Business' }, { key: 'all', label: 'All' }] },
          { name: 'shortDescription', value: 'Essential cloud productivity per user/month (billed monthly)' },
        ],
      },
      variants: [
        {
          key: 'm365-business-basic-annual',
          sku: 'M365-BASIC-ANNUAL',
          prices: [
            { value: { currencyCode: 'USD', centAmount: 500 }, country: 'US' },
            { value: { currencyCode: 'CAD', centAmount: 680 }, country: 'CA' },
            { value: { currencyCode: 'EUR', centAmount: 470 }, country: 'DE' },
          ],
          attributes: [
            { name: 'vendor', value: 'Microsoft' },
            { name: 'term', value: { key: 'annual', label: 'Annual (1 Year)' } },
            { name: 'tier', value: { key: 'basic', label: 'Basic' } },
            { name: 'seats', value: 1 },
            { name: 'features', value: ['Microsoft Teams', 'Exchange Online (50GB)', 'SharePoint Online', 'OneDrive (1TB)', 'Web versions of Office apps'] },
            { name: 'shortDescription', value: 'Essential cloud productivity per user/month (billed annually, save 17%)' },
          ],
        },
      ],
      publish: true,
    },

    {
      key: 'm365-business-standard',
      name: { 'en-US': 'Microsoft 365 Business Standard' },
      description: { 'en-US': 'Full desktop and cloud apps plus email, video conferencing, and advanced security. The complete solution for modern businesses.' },
      slug: { 'en-US': 'm365-business-standard' },
      categories: [{ typeId: 'category', id: categories['productivity'] }],
      masterVariant: {
        key: 'm365-standard-monthly',
        sku: 'M365-STD-MONTHLY',
        prices: [
          { value: { currencyCode: 'USD', centAmount: 1250 }, country: 'US' },
          { value: { currencyCode: 'CAD', centAmount: 1690 }, country: 'CA' },
          { value: { currencyCode: 'EUR', centAmount: 1180 }, country: 'DE' },
        ],
        images: [{ url: 'https://logo.clearbit.com/microsoft.com', label: 'Microsoft 365', dimensions: { w: 200, h: 200 } }],
        attributes: [
          { name: 'vendor', value: 'Microsoft' },
          { name: 'term', value: { key: 'monthly', label: 'Monthly' } },
          { name: 'tier', value: { key: 'standard', label: 'Standard' } },
          { name: 'features', value: ['Everything in Basic', 'Desktop Office apps (Word, Excel, PowerPoint)', 'Outlook', 'Publisher & Access (PC only)', 'Webinar hosting', 'Standard security'] },
          { name: 'dataResidency', value: { key: 'global', label: 'Global' } },
          { name: 'sector', value: [{ key: 'smb', label: 'Small & Medium Business' }, { key: 'all', label: 'All' }] },
          { name: 'shortDescription', value: 'Full productivity suite with desktop apps per user/month' },
        ],
      },
      variants: [
        {
          key: 'm365-standard-annual',
          sku: 'M365-STD-ANNUAL',
          prices: [
            { value: { currencyCode: 'USD', centAmount: 1050 }, country: 'US' },
            { value: { currencyCode: 'CAD', centAmount: 1420 }, country: 'CA' },
            { value: { currencyCode: 'EUR', centAmount: 990 }, country: 'DE' },
          ],
          attributes: [
            { name: 'vendor', value: 'Microsoft' },
            { name: 'term', value: { key: 'annual', label: 'Annual (1 Year)' } },
            { name: 'tier', value: { key: 'standard', label: 'Standard' } },
            { name: 'shortDescription', value: 'Full productivity suite with desktop apps (billed annually, save 16%)' },
          ],
        },
      ],
      publish: true,
    },

    {
      key: 'm365-business-premium',
      name: { 'en-US': 'Microsoft 365 Business Premium' },
      description: { 'en-US': 'Advanced security, compliance and identity management on top of full productivity suite. Best for businesses with advanced security needs.' },
      slug: { 'en-US': 'm365-business-premium' },
      categories: [{ typeId: 'category', id: categories['productivity'] }],
      masterVariant: {
        key: 'm365-premium-monthly',
        sku: 'M365-PREM-MONTHLY',
        prices: [
          { value: { currencyCode: 'USD', centAmount: 2200 }, country: 'US' },
          { value: { currencyCode: 'CAD', centAmount: 2980 }, country: 'CA' },
          { value: { currencyCode: 'EUR', centAmount: 2100 }, country: 'DE' },
        ],
        images: [{ url: 'https://logo.clearbit.com/microsoft.com', label: 'Microsoft 365', dimensions: { w: 200, h: 200 } }],
        attributes: [
          { name: 'vendor', value: 'Microsoft' },
          { name: 'term', value: { key: 'monthly', label: 'Monthly' } },
          { name: 'tier', value: { key: 'premium', label: 'Premium' } },
          { name: 'features', value: ['Everything in Standard', 'Azure AD Premium P1', 'Intune device management', 'Advanced Threat Protection', 'Azure Information Protection', 'Conditional Access'] },
          { name: 'dataResidency', value: { key: 'global', label: 'Global' } },
          { name: 'sector', value: [{ key: 'smb', label: 'Small & Medium Business' }, { key: 'all', label: 'All' }] },
          { name: 'shortDescription', value: 'Premium security + full Office suite per user/month' },
        ],
      },
      variants: [
        {
          key: 'm365-premium-annual',
          sku: 'M365-PREM-ANNUAL',
          prices: [
            { value: { currencyCode: 'USD', centAmount: 1850 }, country: 'US' },
            { value: { currencyCode: 'CAD', centAmount: 2510 }, country: 'CA' },
            { value: { currencyCode: 'EUR', centAmount: 1760 }, country: 'DE' },
          ],
          attributes: [
            { name: 'vendor', value: 'Microsoft' },
            { name: 'term', value: { key: 'annual', label: 'Annual (1 Year)' } },
            { name: 'tier', value: { key: 'premium', label: 'Premium' } },
            { name: 'shortDescription', value: 'Premium security + full Office suite (billed annually, save 16%)' },
          ],
        },
      ],
      publish: true,
    },

    // ---- Microsoft 365 Copilot ----
    {
      key: 'm365-copilot',
      name: { 'en-US': 'Microsoft 365 Copilot' },
      description: { 'en-US': 'AI-powered productivity for every Microsoft 365 user. Copilot works alongside you in Teams, Word, Excel, PowerPoint, Outlook and more.' },
      slug: { 'en-US': 'm365-copilot' },
      categories: [{ typeId: 'category', id: categories['productivity'] }],
      masterVariant: {
        key: 'm365-copilot-monthly',
        sku: 'M365-COPILOT-MONTHLY',
        prices: [
          { value: { currencyCode: 'USD', centAmount: 3000 }, country: 'US' },
          { value: { currencyCode: 'CAD', centAmount: 4060 }, country: 'CA' },
          { value: { currencyCode: 'EUR', centAmount: 2850 }, country: 'DE' },
        ],
        images: [{ url: 'https://logo.clearbit.com/microsoft.com', label: 'Microsoft Copilot', dimensions: { w: 200, h: 200 } }],
        attributes: [
          { name: 'vendor', value: 'Microsoft' },
          { name: 'term', value: { key: 'monthly', label: 'Monthly' } },
          { name: 'tier', value: { key: 'premium', label: 'Premium' } },
          { name: 'prerequisites', value: 'Requires Microsoft 365 Business Basic, Standard, or Premium' },
          { name: 'features', value: ['AI in Teams meetings & chats', 'Copilot in Word, Excel, PowerPoint', 'Copilot in Outlook', 'Microsoft Copilot (web)', 'Up to 300 seats'] },
          { name: 'shortDescription', value: 'AI assistant add-on for Microsoft 365 per user/month' },
        ],
      },
      variants: [],
      publish: true,
    },

    // ---- Azure ----
    {
      key: 'azure-virtual-desktop',
      name: { 'en-US': 'Azure Virtual Desktop' },
      description: { 'en-US': 'Deliver secure, scalable virtual desktop experiences for your clients. Azure Virtual Desktop (AVD) lets users access a full Windows experience from any device.' },
      slug: { 'en-US': 'azure-virtual-desktop' },
      categories: [{ typeId: 'category', id: categories['infrastructure'] }],
      masterVariant: {
        key: 'avd-standard',
        sku: 'AZURE-AVD-STD',
        prices: [
          { value: { currencyCode: 'USD', centAmount: 5000 }, country: 'US' },
        ],
        images: [{ url: 'https://logo.clearbit.com/azure.microsoft.com', label: 'Azure', dimensions: { w: 200, h: 200 } }],
        attributes: [
          { name: 'vendor', value: 'Microsoft' },
          { name: 'term', value: { key: 'monthly', label: 'Monthly' } },
          { name: 'features', value: ['Full Windows 11 desktop', 'Multi-session Windows', 'Optimized for Microsoft 365', 'Azure AD integration', 'Automatic scaling'] },
          { name: 'shortDescription', value: 'Cloud-hosted Windows desktops per user/month (base price, usage-based)' },
        ],
      },
      variants: [],
      publish: true,
    },

    // ---- Dynamics 365 ----
    {
      key: 'dynamics-365-sales',
      name: { 'en-US': 'Microsoft Dynamics 365 Sales' },
      description: { 'en-US': 'Empower sellers to build relationships, boost productivity, and close deals faster with AI-powered insights and automated processes.' },
      slug: { 'en-US': 'dynamics-365-sales' },
      categories: [{ typeId: 'category', id: categories['business-apps'] }],
      masterVariant: {
        key: 'dynamics-sales-professional',
        sku: 'D365-SALES-PRO',
        prices: [
          { value: { currencyCode: 'USD', centAmount: 6500 }, country: 'US' },
          { value: { currencyCode: 'EUR', centAmount: 6150 }, country: 'DE' },
        ],
        images: [{ url: 'https://logo.clearbit.com/microsoft.com', label: 'Dynamics 365', dimensions: { w: 200, h: 200 } }],
        attributes: [
          { name: 'vendor', value: 'Microsoft' },
          { name: 'term', value: { key: 'monthly', label: 'Monthly' } },
          { name: 'tier', value: { key: 'standard', label: 'Standard' } },
          { name: 'features', value: ['CRM capabilities', 'Sales automation', 'Pipeline management', 'AI insights', 'Mobile app', 'Outlook integration'] },
          { name: 'shortDescription', value: 'CRM and sales automation per user/month' },
        ],
      },
      variants: [
        {
          key: 'dynamics-sales-enterprise',
          sku: 'D365-SALES-ENT',
          prices: [
            { value: { currencyCode: 'USD', centAmount: 9500 }, country: 'US' },
            { value: { currencyCode: 'EUR', centAmount: 8980 }, country: 'DE' },
          ],
          attributes: [
            { name: 'vendor', value: 'Microsoft' },
            { name: 'term', value: { key: 'monthly', label: 'Monthly' } },
            { name: 'tier', value: { key: 'enterprise', label: 'Enterprise' } },
            { name: 'features', value: ['All Professional features', 'Advanced AI & analytics', 'Custom workflows', 'Premium support', 'Unlimited API calls'] },
            { name: 'shortDescription', value: 'Enterprise CRM with advanced AI per user/month' },
          ],
        },
      ],
      publish: true,
    },

    // ---- Security ----
    {
      key: 'bitdefender-gravityzone',
      name: { 'en-US': 'Bitdefender GravityZone Business Security' },
      description: { 'en-US': 'Advanced endpoint security with multi-layered protection, anti-ransomware, and centralized management for MSPs.' },
      slug: { 'en-US': 'bitdefender-gravityzone' },
      categories: [{ typeId: 'category', id: categories['security'] }],
      masterVariant: {
        key: 'bitdefender-gz-standard',
        sku: 'BDGZ-STD-ANNUAL',
        prices: [
          { value: { currencyCode: 'USD', centAmount: 4500 }, country: 'US' },
          { value: { currencyCode: 'EUR', centAmount: 4200 }, country: 'DE' },
        ],
        images: [{ url: 'https://logo.clearbit.com/bitdefender.com', label: 'Bitdefender', dimensions: { w: 200, h: 200 } }],
        attributes: [
          { name: 'vendor', value: 'Bitdefender' },
          { name: 'term', value: { key: 'annual', label: 'Annual (1 Year)' } },
          { name: 'tier', value: { key: 'standard', label: 'Standard' } },
          { name: 'features', value: ['Advanced threat prevention', 'Anti-ransomware', 'Web filtering', 'Device control', 'Centralized cloud console', 'Multi-client management'] },
          { name: 'shortDescription', value: 'Endpoint security per device/year' },
        ],
      },
      variants: [
        {
          key: 'bitdefender-gz-premium',
          sku: 'BDGZ-PREM-ANNUAL',
          prices: [
            { value: { currencyCode: 'USD', centAmount: 7800 }, country: 'US' },
            { value: { currencyCode: 'EUR', centAmount: 7350 }, country: 'DE' },
          ],
          attributes: [
            { name: 'vendor', value: 'Bitdefender' },
            { name: 'term', value: { key: 'annual', label: 'Annual (1 Year)' } },
            { name: 'tier', value: { key: 'premium', label: 'Premium' } },
            { name: 'features', value: ['All Standard features', 'EDR (Endpoint Detection & Response)', 'Advanced analytics', 'Threat hunting', 'Integrity monitoring', 'Patch management'] },
            { name: 'shortDescription', value: 'Enterprise endpoint security with EDR per device/year' },
          ],
        },
      ],
      publish: true,
    },

    // ---- Microsoft Defender ----
    {
      key: 'microsoft-defender-business',
      name: { 'en-US': 'Microsoft Defender for Business' },
      description: { 'en-US': 'Enterprise-grade endpoint security solution built for small and medium businesses. Protect against ransomware, malware, phishing, and more.' },
      slug: { 'en-US': 'microsoft-defender-business' },
      categories: [{ typeId: 'category', id: categories['security'] }],
      masterVariant: {
        key: 'defender-business-monthly',
        sku: 'MDFB-MONTHLY',
        prices: [
          { value: { currencyCode: 'USD', centAmount: 300 }, country: 'US' },
          { value: { currencyCode: 'EUR', centAmount: 285 }, country: 'DE' },
        ],
        images: [{ url: 'https://logo.clearbit.com/microsoft.com', label: 'Microsoft Defender', dimensions: { w: 200, h: 200 } }],
        attributes: [
          { name: 'vendor', value: 'Microsoft' },
          { name: 'term', value: { key: 'monthly', label: 'Monthly' } },
          { name: 'features', value: ['Threat & vulnerability management', 'Attack surface reduction', 'Next-gen protection', 'EDR', 'Automated investigation & response'] },
          { name: 'shortDescription', value: 'Enterprise endpoint security per user/month (up to 300 users)' },
        ],
      },
      variants: [],
      publish: true,
    },

    // ---- Backup ----
    {
      key: 'acronis-cyber-backup',
      name: { 'en-US': 'Acronis Cyber Backup Cloud' },
      description: { 'en-US': 'Reliable backup and disaster recovery for your clients. Protect physical, virtual, cloud workloads and Office 365 data.' },
      slug: { 'en-US': 'acronis-cyber-backup' },
      categories: [{ typeId: 'category', id: categories['backup'] }],
      masterVariant: {
        key: 'acronis-backup-standard',
        sku: 'ACRONIS-STD-ANNUAL',
        prices: [
          { value: { currencyCode: 'USD', centAmount: 4900 }, country: 'US' },
        ],
        images: [{ url: 'https://logo.clearbit.com/acronis.com', label: 'Acronis', dimensions: { w: 200, h: 200 } }],
        attributes: [
          { name: 'vendor', value: 'Acronis' },
          { name: 'term', value: { key: 'annual', label: 'Annual (1 Year)' } },
          { name: 'tier', value: { key: 'standard', label: 'Standard' } },
          { name: 'features', value: ['Cloud and local backup', 'Microsoft 365 backup', 'Bare-metal restore', 'Ransomware protection', 'Centralized management', 'Per-workload billing'] },
          { name: 'shortDescription', value: 'Cloud backup and DR per workload/year' },
        ],
      },
      variants: [],
      publish: true,
    },
  ];

  for (const product of products) {
    const result = await api('POST', '/products', {
      productType: { typeId: 'product-type', id: productTypeId },
      key: product.key,
      name: product.name,
      description: product.description,
      slug: product.slug,
      categories: product.categories,
      masterVariant: product.masterVariant,
      variants: product.variants,
      publish: product.publish,
    });
    if (result) console.log(`  ✅ Product: ${product.name['en-US']}`);
  }
}

// ============================================================
// STEP 5: Create Channels (for pricing)
// ============================================================
async function createChannels() {
  console.log('\n📡 Creating Channels...');
  const channels = {};

  const channelDefs = [
    { key: 'sherweb-na', name: 'Sherweb North America', roles: ['ProductDistribution', 'InventorySupply'] },
    { key: 'sherweb-eu', name: 'Sherweb Europe', roles: ['ProductDistribution', 'InventorySupply'] },
    { key: 'partner-standard', name: 'Standard Partner Pricing', roles: ['ProductDistribution'] },
    { key: 'partner-premium', name: 'Premium Partner Pricing', roles: ['ProductDistribution'] },
    { key: 'partner-enterprise', name: 'Enterprise Partner Pricing', roles: ['ProductDistribution'] },
  ];

  for (const ch of channelDefs) {
    const result = await api('POST', '/channels', {
      key: ch.key,
      roles: ch.roles,
      name: { 'en-US': ch.name },
    });
    if (result) {
      channels[ch.key] = result.id;
      console.log(`  ✅ Channel: ${ch.name}`);
    } else {
      const existing = await getExisting('/channels', `?where=key%3D%22${ch.key}%22`);
      if (existing?.results?.[0]) channels[ch.key] = existing.results[0].id;
    }
  }
  return channels;
}

// ============================================================
// STEP 6: Create Stores
// ============================================================
async function createStores() {
  console.log('\n🏪 Creating Stores...');

  const stores = [
    {
      key: 'sherweb-portal',
      name: { 'en-US': 'Sherweb Partner Portal' },
      languages: ['en-US'],
      countries: [{ code: 'US' }, { code: 'CA' }],
    },
    {
      key: 'sherweb-eu',
      name: { 'en-US': 'Sherweb EU Portal' },
      languages: ['en-US'],
      countries: [{ code: 'GB' }, { code: 'FR' }, { code: 'DE' }, { code: 'NL' }, { code: 'BE' }],
    },
  ];

  for (const store of stores) {
    const result = await api('POST', '/stores', store);
    if (result) console.log(`  ✅ Store: ${store.name['en-US']}`);
  }
}

// ============================================================
// STEP 7: Create Customer Custom Type
// ============================================================
async function createCustomerType() {
  console.log('\n🏷️ Creating Customer Custom Type...');
  const result = await api('POST', '/types', {
    key: 'customer-b2b-fields',
    name: { 'en-US': 'Customer B2B Fields' },
    description: { 'en-US': 'Additional fields for B2B customers' },
    resourceTypeIds: ['customer'],
    fieldDefinitions: [
      {
        name: 'role',
        label: { 'en-US': 'Role' },
        required: false,
        type: { name: 'Enum', values: [
          { key: 'partner', label: 'Partner (MSP/Reseller)' },
          { key: 'end-customer', label: 'End Customer' },
          { key: 'admin', label: 'Sherweb Admin' },
        ]},
        inputHint: 'SingleLine',
      },
      {
        name: 'businessUnitKey',
        label: { 'en-US': 'Business Unit Key' },
        required: false,
        type: { name: 'String' },
        inputHint: 'SingleLine',
      },
      {
        name: 'businessUnitName',
        label: { 'en-US': 'Business Unit Name' },
        required: false,
        type: { name: 'String' },
        inputHint: 'SingleLine',
      },
      {
        name: 'partnerTier',
        label: { 'en-US': 'Partner Tier' },
        required: false,
        type: { name: 'Enum', values: [
          { key: 'standard', label: 'Standard' },
          { key: 'premium', label: 'Premium' },
          { key: 'enterprise', label: 'Enterprise' },
        ]},
        inputHint: 'SingleLine',
      },
    ],
  });
  if (result) console.log('  ✅ Customer custom type created');
}

// ============================================================
// STEP 8: Create Business Units (Partners)
// ============================================================
async function createBusinessUnits() {
  console.log('\n🏢 Creating Business Units (Partners)...');

  const partners = [
    {
      key: 'techpartner-inc',
      name: 'TechPartner Inc.',
      unitType: 'Company',
      status: 'Active',
      contactEmail: 'orders@techpartner.example.com',
      addresses: [{
        key: 'hq',
        firstName: 'Admin',
        lastName: 'TechPartner',
        streetName: '100 Tech Blvd',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        country: 'US',
        email: 'orders@techpartner.example.com',
        company: 'TechPartner Inc.',
      }],
    },
    {
      key: 'cloudsolutions-msp',
      name: 'CloudSolutions MSP',
      unitType: 'Company',
      status: 'Active',
      contactEmail: 'admin@cloudsolutions.example.com',
      addresses: [{
        key: 'hq',
        firstName: 'Admin',
        lastName: 'CloudSolutions',
        streetName: '250 Cloud Way',
        city: 'Toronto',
        state: 'ON',
        postalCode: 'M5V 3A8',
        country: 'CA',
        email: 'admin@cloudsolutions.example.com',
        company: 'CloudSolutions MSP',
      }],
    },
    {
      key: 'digital-ventures-eu',
      name: 'Digital Ventures EU',
      unitType: 'Company',
      status: 'Active',
      contactEmail: 'procurement@digitalventures.example.com',
      addresses: [{
        key: 'hq',
        firstName: 'Admin',
        lastName: 'DigitalVentures',
        streetName: '15 Tech Strasse',
        city: 'Berlin',
        postalCode: '10115',
        country: 'DE',
        email: 'procurement@digitalventures.example.com',
        company: 'Digital Ventures EU',
      }],
    },
    {
      key: 'apex-technologies',
      name: 'Apex Technologies LLC',
      unitType: 'Company',
      status: 'Active',
      contactEmail: 'it@apextech.example.com',
      addresses: [{
        key: 'hq',
        firstName: 'Admin',
        lastName: 'ApexTech',
        streetName: '500 Innovation Dr',
        city: 'Boston',
        state: 'MA',
        postalCode: '02101',
        country: 'US',
        email: 'it@apextech.example.com',
        company: 'Apex Technologies LLC',
      }],
    },
  ];

  for (const partner of partners) {
    const result = await api('POST', '/business-units', {
      key: partner.key,
      name: partner.name,
      unitType: partner.unitType,
      status: partner.status,
      contactEmail: partner.contactEmail,
      addresses: partner.addresses,
      defaultShippingAddressId: partner.addresses[0].key,
    });
    if (result) console.log(`  ✅ Business Unit: ${partner.name}`);
  }
}

// ============================================================
// STEP 9: Create Customers
// ============================================================
async function createCustomers() {
  console.log('\n👤 Creating Customer Accounts...');

  const customers = [
    // Partner accounts
    {
      email: 'partner@techpartner.example.com',
      password: 'Sherweb2026!',
      firstName: 'Alex',
      lastName: 'Johnson',
      companyName: 'TechPartner Inc.',
      custom: { type: { typeId: 'type', key: 'customer-b2b-fields' }, fields: { role: 'partner', businessUnitKey: 'techpartner-inc', businessUnitName: 'TechPartner Inc.', partnerTier: 'premium' } },
    },
    {
      email: 'admin@cloudsolutions.example.com',
      password: 'Sherweb2026!',
      firstName: 'Sarah',
      lastName: 'Chen',
      companyName: 'CloudSolutions MSP',
      custom: { type: { typeId: 'type', key: 'customer-b2b-fields' }, fields: { role: 'partner', businessUnitKey: 'cloudsolutions-msp', businessUnitName: 'CloudSolutions MSP', partnerTier: 'standard' } },
    },
    {
      email: 'procurement@digitalventures.example.com',
      password: 'Sherweb2026!',
      firstName: 'Marc',
      lastName: 'Dupont',
      companyName: 'Digital Ventures EU',
      custom: { type: { typeId: 'type', key: 'customer-b2b-fields' }, fields: { role: 'partner', businessUnitKey: 'digital-ventures-eu', businessUnitName: 'Digital Ventures EU', partnerTier: 'standard' } },
    },
    {
      email: 'it@apextech.example.com',
      password: 'Sherweb2026!',
      firstName: 'Maria',
      lastName: 'Rodriguez',
      companyName: 'Apex Technologies LLC',
      custom: { type: { typeId: 'type', key: 'customer-b2b-fields' }, fields: { role: 'partner', businessUnitKey: 'apex-technologies', businessUnitName: 'Apex Technologies LLC', partnerTier: 'enterprise' } },
    },
    // End customer accounts
    {
      email: 'john.smith@acmecorp.example.com',
      password: 'Sherweb2026!',
      firstName: 'John',
      lastName: 'Smith',
      companyName: 'Acme Corporation',
      custom: { type: { typeId: 'type', key: 'customer-b2b-fields' }, fields: { role: 'end-customer', businessUnitKey: 'techpartner-inc', businessUnitName: 'TechPartner Inc.' } },
    },
    {
      email: 'lisa.wong@globalfirm.example.com',
      password: 'Sherweb2026!',
      firstName: 'Lisa',
      lastName: 'Wong',
      companyName: 'Global Firm Ltd',
      custom: { type: { typeId: 'type', key: 'customer-b2b-fields' }, fields: { role: 'end-customer', businessUnitKey: 'cloudsolutions-msp', businessUnitName: 'CloudSolutions MSP' } },
    },
    {
      email: 'tom.baker@startupco.example.com',
      password: 'Sherweb2026!',
      firstName: 'Tom',
      lastName: 'Baker',
      companyName: 'StartupCo',
      custom: { type: { typeId: 'type', key: 'customer-b2b-fields' }, fields: { role: 'end-customer', businessUnitKey: 'apex-technologies', businessUnitName: 'Apex Technologies LLC' } },
    },
  ];

  for (const customer of customers) {
    const result = await api('POST', '/customers', customer);
    if (result) console.log(`  ✅ Customer: ${customer.firstName} ${customer.lastName} (${customer.email})`);
  }
}

// ============================================================
// STEP 10: Create Discount Codes (Promotions)
// ============================================================
async function createDiscounts() {
  console.log('\n🏷️ Creating Discounts & Promotions...');

  // Cart discount - volume discount
  const volumeDiscount = await api('POST', '/cart-discounts', {
    name: { 'en-US': 'Partner Volume Discount 10%' },
    description: { 'en-US': '10% discount for orders over $500' },
    key: 'volume-discount-10',
    value: { type: 'relative', permyriad: 1000 },
    cartPredicate: 'totalPrice >= "50000 USD"',
    target: { type: 'lineItems', predicate: 'true' },
    sortOrder: '0.9',
    isActive: true,
    requiresDiscountCode: false,
    stackingMode: 'Stacking',
  });
  if (volumeDiscount) console.log('  ✅ Volume Discount 10% (orders over $500)');

  // Discount code - new partner
  const newPartnerDisc = await api('POST', '/cart-discounts', {
    name: { 'en-US': 'New Partner Welcome Discount' },
    description: { 'en-US': '15% off first order for new partners' },
    key: 'new-partner-welcome',
    value: { type: 'relative', permyriad: 1500 },
    cartPredicate: 'true',
    target: { type: 'lineItems', predicate: 'true' },
    sortOrder: '0.8',
    isActive: true,
    requiresDiscountCode: true,
    stackingMode: 'Stacking',
  });
  if (newPartnerDisc) {
    console.log('  ✅ New Partner Welcome Discount (15%)');
    await api('POST', '/discount-codes', {
      name: { 'en-US': 'NEWPARTNER15' },
      code: 'NEWPARTNER15',
      cartDiscounts: [{ typeId: 'cart-discount', id: newPartnerDisc.id }],
      isActive: true,
      maxApplications: 1000,
    });
    console.log('  ✅ Discount Code: NEWPARTNER15');
  }

  // Annual commitment discount
  const annualDisc = await api('POST', '/cart-discounts', {
    name: { 'en-US': 'Annual Commitment Bonus' },
    description: { 'en-US': '5% additional discount on annual subscriptions' },
    key: 'annual-commitment-5',
    value: { type: 'relative', permyriad: 500 },
    cartPredicate: 'true',
    target: { type: 'lineItems', predicate: 'sku in ("M365-BASIC-ANNUAL", "M365-STD-ANNUAL", "M365-PREM-ANNUAL", "BDGZ-STD-ANNUAL", "BDGZ-PREM-ANNUAL", "ACRONIS-STD-ANNUAL")' },
    sortOrder: '0.7',
    isActive: true,
    requiresDiscountCode: true,
    stackingMode: 'Stacking',
  });
  if (annualDisc) {
    console.log('  ✅ Annual Commitment Discount (5%)');
    await api('POST', '/discount-codes', {
      name: { 'en-US': 'ANNUAL5' },
      code: 'ANNUAL5',
      cartDiscounts: [{ typeId: 'cart-discount', id: annualDisc.id }],
      isActive: true,
    });
    console.log('  ✅ Discount Code: ANNUAL5');
  }
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log('🚀 Starting Sherweb Demo Seed Script');
  console.log('=====================================\n');

  try {
    // Test connection
    console.log('🔑 Testing commercetools connection...');
    token = await getToken();
    console.log('  ✅ Connected to commercetools');

    await createProductType();
    const categories = await createCategories();
    const productTypeId = await getProductTypeId();
    if (!productTypeId) throw new Error('Product type not found!');
    
    await createChannels();
    await createStores();
    await createCustomerType();
    await createProducts(categories, productTypeId);
    await createBusinessUnits();
    await createCustomers();
    await createDiscounts();

    console.log('\n=====================================');
    console.log('✅ Seed complete! Sherweb demo data created.');
    console.log('\n📋 Demo Accounts:');
    console.log('  Partner: partner@techpartner.example.com / Sherweb2026!');
    console.log('  Partner: admin@cloudsolutions.example.com / Sherweb2026!');
    console.log('  Partner: it@apextech.example.com / Sherweb2026!');
    console.log('  End Customer: john.smith@acmecorp.example.com / Sherweb2026!');
    console.log('  End Customer: lisa.wong@globalfirm.example.com / Sherweb2026!');
    console.log('\n🎟️ Discount Codes:');
    console.log('  NEWPARTNER15 - 15% off first order');
    console.log('  ANNUAL5 - 5% off annual subscriptions');
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    process.exit(1);
  }
}

main();
