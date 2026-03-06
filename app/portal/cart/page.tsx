'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, total, itemCount, removeItem, updateQuantity, clearCart, applyDiscount } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountPct, setDiscountPct] = useState(0);
  const [discountError, setDiscountError] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);
  const router = useRouter();

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountLoading(true);
    setDiscountError('');
    const success = await applyDiscount(discountCode.trim());
    if (success) {
      setAppliedCode(discountCode.toUpperCase());
      setDiscountPct(discountCode.toUpperCase() === 'NEWPARTNER15' ? 15 : discountCode.toUpperCase() === 'ANNUAL5' ? 5 : 0);
      setDiscountCode('');
    } else {
      setDiscountError('Invalid discount code. Try NEWPARTNER15 or ANNUAL5');
    }
    setDiscountLoading(false);
  };

  const discountAmount = Math.round(total * discountPct / 100);
  const finalTotal = total - discountAmount;

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#1B2B5E' }}>Your cart is empty</h2>
        <p className="mb-8" style={{ color: '#64748B' }}>Browse the cloud catalog to add products for your clients</p>
        <Link href="/portal/catalog" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white" style={{ backgroundColor: '#FF6600' }}>
          🛍️ Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: '#1B2B5E' }}>Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 transition-colors">Clear all</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>
            <div className="col-span-5">Product</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-2 text-right">Unit Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {items.map((item) => (
            <div key={item.lineItemId} className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0' }}>
              <div className="grid md:grid-cols-12 gap-4 items-center">
                {/* Product Info */}
                <div className="md:col-span-5">
                  <p className="font-medium text-sm" style={{ color: '#1B2B5E' }}>{item.name}</p>
                  <p className="text-xs mt-0.5 font-mono" style={{ color: '#9CA3AF' }}>{item.sku}</p>
                </div>

                {/* Quantity */}
                <div className="md:col-span-3 flex items-center justify-center">
                  <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
                    <button
                      onClick={() => updateQuantity(item.lineItemId, item.quantity - 1)}
                      className="px-3 py-2 text-sm font-bold hover:bg-gray-50 transition-colors"
                      style={{ color: '#1B2B5E' }}
                    >−</button>
                    <span className="px-4 py-2 text-sm font-semibold border-x" style={{ borderColor: '#E2E8F0', minWidth: '3rem', textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.lineItemId, item.quantity + 1)}
                      className="px-3 py-2 text-sm font-bold hover:bg-gray-50 transition-colors"
                      style={{ color: '#1B2B5E' }}
                    >+</button>
                  </div>
                </div>

                {/* Unit Price */}
                <div className="md:col-span-2 text-right">
                  <span className="text-sm font-medium" style={{ color: '#64748B' }}>${(item.unitPrice / 100).toFixed(2)}</span>
                </div>

                {/* Total */}
                <div className="md:col-span-2 text-right">
                  <span className="font-bold" style={{ color: '#1B2B5E' }}>${(item.totalPrice / 100).toFixed(2)}</span>
                  <button onClick={() => removeItem(item.lineItemId)} className="block ml-auto mt-1 text-xs text-red-400 hover:text-red-600">Remove</button>
                </div>
              </div>
            </div>
          ))}

          {/* Purchase List Save */}
          <div className="p-4 rounded-xl border-2 border-dashed flex items-center justify-between" style={{ borderColor: '#E2E8F0', backgroundColor: '#FAFBFC' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: '#1B2B5E' }}>💾 Save as Purchase List</p>
              <p className="text-xs" style={{ color: '#64748B' }}>Reorder these products quickly in the future</p>
            </div>
            <Link href="/portal/purchase-lists" className="text-sm font-semibold px-4 py-2 rounded-lg transition-all" style={{ backgroundColor: '#1B2B5E', color: 'white' }}>
              Save List
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl border p-5 sticky top-6" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="font-semibold mb-5" style={{ color: '#1B2B5E' }}>Order Summary</h3>

            {/* Line items summary */}
            <div className="space-y-2 pb-4 border-b mb-4" style={{ borderColor: '#F1F5F9' }}>
              {items.map(item => (
                <div key={item.lineItemId} className="flex justify-between text-sm">
                  <span className="truncate pr-2" style={{ color: '#64748B' }}>{item.name.split(' (')[0]} × {item.quantity}</span>
                  <span className="font-medium flex-shrink-0" style={{ color: '#1B2B5E' }}>${(item.totalPrice / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Discount Code */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#64748B' }}>Discount Code</label>
              {appliedCode ? (
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <span className="text-sm font-bold font-mono" style={{ color: '#16A34A' }}>✓ {appliedCode}</span>
                  <button onClick={() => { setAppliedCode(null); setDiscountPct(0); }} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => { setDiscountCode(e.target.value); setDiscountError(''); }}
                      placeholder="Enter code..."
                      className="flex-1 px-3 py-2 rounded-lg text-sm border focus:outline-none"
                      style={{ borderColor: '#E2E8F0' }}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
                    />
                    <button onClick={handleApplyDiscount} disabled={discountLoading} className="px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#1B2B5E' }}>
                      Apply
                    </button>
                  </div>
                  {discountError && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{discountError}</p>}
                  <p className="text-xs mt-1.5" style={{ color: '#9CA3AF' }}>Try NEWPARTNER15 or ANNUAL5</p>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-sm">
                <span style={{ color: '#64748B' }}>Subtotal ({itemCount} items)</span>
                <span style={{ color: '#1B2B5E' }}>${(total / 100).toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#16A34A' }}>Discount ({discountPct}%)</span>
                  <span style={{ color: '#16A34A' }}>−${(discountAmount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold" style={{ borderColor: '#E2E8F0' }}>
                <span style={{ color: '#1B2B5E' }}>Total</span>
                <span style={{ color: '#FF6600', fontSize: '1.1rem' }}>${(finalTotal / 100).toFixed(2)}</span>
              </div>
              <p className="text-xs text-center" style={{ color: '#9CA3AF' }}>Per month · All prices in USD</p>
            </div>

            <Link href="/portal/checkout" className="block w-full py-3 rounded-xl font-semibold text-white text-sm text-center transition-all" style={{ backgroundColor: '#FF6600' }}>
              Proceed to Checkout →
            </Link>
            <Link href="/portal/catalog" className="block w-full py-2.5 rounded-xl font-medium text-sm text-center mt-3 transition-all" style={{ backgroundColor: '#F1F5F9', color: '#1B2B5E' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
