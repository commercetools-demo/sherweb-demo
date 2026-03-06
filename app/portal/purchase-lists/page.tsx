'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

const SAVED_LISTS = [
  {
    id: 'list-001',
    name: 'Standard SMB Onboarding Package',
    description: 'Default setup for new small business clients',
    createdAt: 'Feb 15, 2026',
    lastUsed: 'Mar 3, 2026',
    items: [
      { name: 'M365 Business Standard', sku: 'M365-STD-ANNUAL', price: 1050, qty: 10 },
      { name: 'Microsoft Defender for Business', sku: 'MDFB-MONTHLY', price: 300, qty: 10 },
      { name: 'Acronis Cyber Backup', sku: 'ACRONIS-STD-ANNUAL', price: 4900, qty: 1 },
    ],
  },
  {
    id: 'list-002',
    name: 'Enterprise Security Bundle',
    description: 'Full security stack for compliance-sensitive clients',
    createdAt: 'Jan 20, 2026',
    lastUsed: 'Feb 25, 2026',
    items: [
      { name: 'M365 Business Premium', sku: 'M365-PREM-ANNUAL', price: 1850, qty: 25 },
      { name: 'Bitdefender GravityZone Premium', sku: 'BDGZ-PREM-ANNUAL', price: 7800, qty: 25 },
      { name: 'Microsoft Copilot', sku: 'M365-COPILOT-MONTHLY', price: 3000, qty: 10 },
    ],
  },
  {
    id: 'list-003',
    name: 'Microsoft 365 Migration Kit',
    description: 'Products for clients migrating from Google Workspace',
    createdAt: 'Mar 1, 2026',
    lastUsed: 'Mar 4, 2026',
    items: [
      { name: 'M365 Business Standard', sku: 'M365-STD-MONTHLY', price: 1250, qty: 20 },
      { name: 'Azure Virtual Desktop', sku: 'AZURE-AVD-STD', price: 5000, qty: 5 },
    ],
  },
];

export default function PurchaseListsPage() {
  const { addItem } = useCart();
  const [addingList, setAddingList] = useState<string | null>(null);
  const [addedList, setAddedList] = useState<string | null>(null);

  const handleAddListToCart = async (list: typeof SAVED_LISTS[0]) => {
    setAddingList(list.id);
    for (const item of list.items) {
      await addItem(`prod-${Math.random()}`, 1, item.name, item.sku, item.price, 'USD', item.qty);
    }
    setAddingList(null);
    setAddedList(list.id);
    setTimeout(() => setAddedList(null), 2000);
  };

  const listTotal = (list: typeof SAVED_LISTS[0]) =>
    list.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1B2B5E' }}>Purchase Lists</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Saved product bundles for quick reordering</p>
        </div>
        <Link href="/portal/cart" className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#FF6600' }}>
          + Create from Cart
        </Link>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
        <span className="text-xl">💡</span>
        <div>
          <p className="font-medium text-sm" style={{ color: '#1D4ED8' }}>What are Purchase Lists?</p>
          <p className="text-xs mt-1" style={{ color: '#3B82F6' }}>Save product bundles to quickly re-order for new clients. Perfect for onboarding packages, standard security setups, or compliance bundles. Add all items to cart with one click.</p>
        </div>
      </div>

      {/* Lists */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {SAVED_LISTS.map(list => (
          <div key={list.id} className="bg-white rounded-xl border flex flex-col" style={{ borderColor: '#E2E8F0' }}>
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#EFF6FF' }}>
                  📋
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>Last used: {list.lastUsed}</p>
                </div>
              </div>
              <h3 className="font-semibold mb-1" style={{ color: '#1B2B5E' }}>{list.name}</h3>
              <p className="text-xs mb-4" style={{ color: '#64748B' }}>{list.description}</p>

              <div className="space-y-2">
                {list.items.map(item => (
                  <div key={item.sku} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>×{item.qty}</span>
                      <span className="text-xs" style={{ color: '#4B5563' }}>{item.name}</span>
                    </div>
                    <span className="text-xs font-medium" style={{ color: '#1B2B5E' }}>${(item.price * item.qty / 100).toFixed(0)}/mo</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                <div>
                  <p className="text-xs" style={{ color: '#64748B' }}>Total</p>
                  <p className="text-lg font-bold" style={{ color: '#FF6600' }}>${(listTotal(list) / 100).toFixed(2)}/mo</p>
                </div>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>{list.items.length} products</p>
              </div>
            </div>

            <div className="px-5 pb-5 flex gap-2">
              <button
                onClick={() => handleAddListToCart(list)}
                disabled={!!addingList}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                style={{ backgroundColor: addedList === list.id ? '#16A34A' : '#FF6600' }}
              >
                {addingList === list.id ? '⏳ Adding...' : addedList === list.id ? '✓ Added to Cart!' : '+ Add All to Cart'}
              </button>
              <button className="px-3 py-2.5 rounded-lg text-sm border transition-all hover:bg-gray-50" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                ✏️
              </button>
              <button className="px-3 py-2.5 rounded-lg text-sm border transition-all hover:bg-gray-50" style={{ borderColor: '#E2E8F0', color: '#EF4444' }}>
                🗑️
              </button>
            </div>
          </div>
        ))}

        {/* Add New List Card */}
        <div className="bg-white rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: '#E2E8F0' }}>
          <div className="text-4xl mb-3">➕</div>
          <p className="font-medium text-center" style={{ color: '#1B2B5E' }}>Create New List</p>
          <p className="text-xs text-center mt-1 mb-4" style={{ color: '#64748B' }}>Save your current cart or build a new bundle</p>
          <Link href="/portal/cart" className="text-xs font-medium px-4 py-2 rounded-lg" style={{ backgroundColor: '#1B2B5E', color: 'white' }}>
            Go to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
