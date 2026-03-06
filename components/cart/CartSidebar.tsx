'use client';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CartSidebar() {
  const { items, isOpen, closeCart, itemCount, total, removeItem, updateQuantity } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={closeCart} />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E2E8F0', backgroundColor: '#1B2B5E' }}>
          <h2 className="font-semibold text-white">Shopping Cart ({itemCount})</h2>
          <button onClick={closeCart} className="text-white/70 hover:text-white text-xl leading-none">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🛒</div>
              <p className="font-medium" style={{ color: '#1B2B5E' }}>Your cart is empty</p>
              <p className="text-sm mt-1 mb-6" style={{ color: '#64748B' }}>Browse the catalog to add cloud solutions</p>
              <button onClick={closeCart} className="text-sm font-medium px-4 py-2 rounded-lg" style={{ backgroundColor: '#1B2B5E', color: 'white' }}>
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.lineItemId} className="flex gap-4 p-4 rounded-xl" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: '#1B2B5E' }}>{item.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{item.sku}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: '#E2E8F0' }}>
                        <button
                          onClick={() => updateQuantity(item.lineItemId, item.quantity - 1)}
                          className="px-2.5 py-1 text-sm font-bold hover:bg-gray-100 transition-colors"
                          style={{ color: '#1B2B5E' }}
                        >−</button>
                        <span className="px-3 py-1 text-sm font-medium border-x" style={{ borderColor: '#E2E8F0' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.lineItemId, item.quantity + 1)}
                          className="px-2.5 py-1 text-sm font-bold hover:bg-gray-100 transition-colors"
                          style={{ color: '#1B2B5E' }}
                        >+</button>
                      </div>
                      <span className="text-sm font-bold" style={{ color: '#FF6600' }}>
                        ${(item.totalPrice / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.lineItemId)}
                    className="text-red-400 hover:text-red-600 transition-colors self-start mt-1"
                  >🗑️</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-6 py-5" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm" style={{ color: '#64748B' }}>Subtotal ({itemCount} items)</span>
              <span className="font-bold" style={{ color: '#1B2B5E' }}>${(total / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs" style={{ color: '#64748B' }}>per month (licenses)</span>
            </div>
            <div className="space-y-3">
              <Link
                href="/portal/checkout"
                onClick={closeCart}
                className="block w-full py-3 rounded-lg font-semibold text-white text-sm text-center transition-all"
                style={{ backgroundColor: '#FF6600' }}
              >
                Proceed to Checkout →
              </Link>
              <Link
                href="/portal/cart"
                onClick={closeCart}
                className="block w-full py-2 rounded-lg font-medium text-sm text-center transition-all"
                style={{ backgroundColor: '#F1F5F9', color: '#1B2B5E' }}
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
