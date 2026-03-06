'use client';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DEMO_CLIENTS = [
  { id: 'c1', name: 'Acme Corporation', email: 'it@acmecorp.example.com', users: 47 },
  { id: 'c2', name: 'Global Firm Ltd', email: 'admin@globalfirm.example.com', users: 23 },
  { id: 'c3', name: 'StartupCo', email: 'tech@startupco.example.com', users: 8 },
  { id: 'c4', name: 'Tech Dynamics', email: 'ops@techdynamics.example.com', users: 112 },
];

export default function CheckoutPage() {
  const { items, total, itemCount, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const role = (session?.user as any)?.role;
  const isPartner = role === 'partner' || role === 'admin';

  const [selectedClient, setSelectedClient] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId] = useState(`ORD-2026-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`);
  const [step, setStep] = useState(1);

  const handlePlaceOrder = async () => {
    if (isPartner && !selectedClient) return;
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1500));
    setPlacing(false);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#1B2B5E' }}>Order Placed Successfully!</h2>
        <p className="mb-1" style={{ color: '#64748B' }}>Your order has been submitted to Sherweb.</p>
        <p className="text-sm font-mono font-medium mb-8" style={{ color: '#00A9E0' }}>{orderId}</p>
        <div className="bg-white rounded-xl border p-5 text-left mb-6" style={{ borderColor: '#E2E8F0' }}>
          <h3 className="font-semibold mb-3 text-sm" style={{ color: '#1B2B5E' }}>What happens next:</h3>
          <div className="space-y-2">
            {['Order confirmed and sent to provisioning', 'Licenses provisioned within 24 hours', 'Confirmation email sent to your account', 'View order status in Order History'].map((s, i) => (
              <div key={s} className="flex items-center gap-3 text-sm" style={{ color: '#4B5563' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#1B2B5E', color: 'white' }}>{i + 1}</span>
                {s}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/portal/orders" className="px-6 py-2.5 rounded-lg font-semibold text-white text-sm" style={{ backgroundColor: '#1B2B5E' }}>
            View Orders
          </Link>
          <Link href="/portal/catalog" className="px-6 py-2.5 rounded-lg font-semibold text-sm" style={{ backgroundColor: '#F1F5F9', color: '#1B2B5E' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🛒</div>
        <p className="font-medium mb-4" style={{ color: '#1B2B5E' }}>Your cart is empty</p>
        <Link href="/portal/catalog" className="px-6 py-3 rounded-lg font-semibold text-white text-sm" style={{ backgroundColor: '#FF6600' }}>Browse Catalog</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1B2B5E' }}>Checkout</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Review your order before submitting</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-4">
        {[{ n: 1, label: 'Order Details' }, { n: 2, label: 'Review & Confirm' }].map((s) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold`} style={{ backgroundColor: step >= s.n ? '#1B2B5E' : '#E2E8F0', color: step >= s.n ? 'white' : '#9CA3AF' }}>
              {step > s.n ? '✓' : s.n}
            </div>
            <span className="text-sm font-medium" style={{ color: step >= s.n ? '#1B2B5E' : '#9CA3AF' }}>{s.label}</span>
            {s.n < 2 && <div className="w-12 h-0.5 ml-2" style={{ backgroundColor: step > s.n ? '#1B2B5E' : '#E2E8F0' }} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Steps */}
        <div className="lg:col-span-2 space-y-4">
          {step === 1 && (
            <>
              {/* Client Assignment (partners only) */}
              {isPartner && (
                <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
                  <h3 className="font-semibold mb-4" style={{ color: '#1B2B5E' }}>🏢 Assign to Client</h3>
                  <p className="text-sm mb-4" style={{ color: '#64748B' }}>Select the end customer this order is for. This determines the billing and provisioning target.</p>
                  <div className="space-y-2">
                    {DEMO_CLIENTS.map(client => (
                      <button
                        key={client.id}
                        onClick={() => setSelectedClient(client.id)}
                        className="w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all"
                        style={{
                          borderColor: selectedClient === client.id ? '#1B2B5E' : '#E2E8F0',
                          backgroundColor: selectedClient === client.id ? '#EFF6FF' : 'white',
                        }}
                      >
                        <div>
                          <p className="font-medium text-sm" style={{ color: '#1B2B5E' }}>{client.name}</p>
                          <p className="text-xs" style={{ color: '#64748B' }}>{client.email} · {client.users} users</p>
                        </div>
                        {selectedClient === client.id && <span style={{ color: '#1B2B5E' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                  {isPartner && !selectedClient && (
                    <p className="text-xs mt-2" style={{ color: '#F59E0B' }}>⚠️ Please select a client to continue</p>
                  )}
                </div>
              )}

              {/* Order Notes */}
              <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
                <h3 className="font-semibold mb-3" style={{ color: '#1B2B5E' }}>📝 Order Notes (optional)</h3>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Add any notes for this order (e.g., department, project code, special instructions)..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg text-sm border resize-none focus:outline-none"
                  style={{ borderColor: '#E2E8F0', color: '#1B2B5E' }}
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={isPartner && !selectedClient}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-50"
                style={{ backgroundColor: '#FF6600' }}
              >
                Continue to Review →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
                <h3 className="font-semibold mb-4" style={{ color: '#1B2B5E' }}>Order Items</h3>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.lineItemId} className="flex items-center justify-between py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#1B2B5E' }}>{item.name}</p>
                        <p className="text-xs" style={{ color: '#64748B' }}>{item.sku} · Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-sm" style={{ color: '#FF6600' }}>${(item.totalPrice / 100).toFixed(2)}/mo</span>
                    </div>
                  ))}
                </div>
                {isPartner && selectedClient && (
                  <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                    <p className="text-xs font-medium" style={{ color: '#16A34A' }}>
                      ✓ Ordering for: {DEMO_CLIENTS.find(c => c.id === selectedClient)?.name}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
                <h3 className="font-semibold mb-3" style={{ color: '#1B2B5E' }}>Payment</h3>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#1B2B5E' }}>Net-30 Terms</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>Invoice will be sent to your billing email · Consolidated monthly billing</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl font-medium text-sm" style={{ backgroundColor: '#F1F5F9', color: '#1B2B5E' }}>
                  ← Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="flex-1 py-3 rounded-xl font-semibold text-white text-sm transition-all"
                  style={{ backgroundColor: '#FF6600' }}
                >
                  {placing ? '⏳ Placing Order...' : '✓ Place Order'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl border p-5 sticky top-6" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#1B2B5E' }}>Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span style={{ color: '#64748B' }}>Items ({itemCount})</span>
                <span style={{ color: '#1B2B5E' }}>${(total / 100).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold" style={{ borderColor: '#E2E8F0' }}>
                <span style={{ color: '#1B2B5E' }}>Monthly Total</span>
                <span style={{ color: '#FF6600', fontSize: '1.1rem' }}>${(total / 100).toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-center" style={{ color: '#9CA3AF' }}>Billed monthly via Sherweb consolidated invoice</p>
          </div>
        </div>
      </div>
    </div>
  );
}
