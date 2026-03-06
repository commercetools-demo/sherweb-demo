'use client';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function PortalHeader() {
  const { data: session } = useSession();
  const { itemCount, openCart } = useCart();
  const role = (session?.user as any)?.role;

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b bg-white flex-shrink-0" style={{ borderColor: '#E2E8F0' }}>
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-sm font-semibold" style={{ color: '#1B2B5E' }}>
            {role === 'partner' ? '🏢 Partner Portal' : '👤 Customer Portal'}
          </h1>
          <p className="text-xs" style={{ color: '#64748B' }}>
            Powered by commercetools
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <Link href="/portal/catalog" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
          <span>🔍</span>
          <span className="hidden sm:inline">Search catalog...</span>
        </Link>

        {/* Cart */}
        <button
          onClick={openCart}
          className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ backgroundColor: '#FF6600', color: 'white' }}
        >
          <span>🛒</span>
          <span className="hidden sm:inline">Cart</span>
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#1B2B5E', color: 'white' }}>
              {itemCount}
            </span>
          )}
        </button>

        {/* Discount badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>
          <span>🏷️</span>
          <span>NEWPARTNER15</span>
        </div>
      </div>
    </header>
  );
}
