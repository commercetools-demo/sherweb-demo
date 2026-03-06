'use client';
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface CartItem {
  lineItemId: string;
  productId: string;
  variantId: number;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  imageUrl?: string;
}

interface CartContextType {
  cartId: string | null;
  cartVersion: number;
  items: CartItem[];
  itemCount: number;
  total: number;
  currency: string;
  isOpen: boolean;
  isLoading: boolean;
  addItem: (productId: string, variantId: number, name: string, sku: string, price: number, currency: string, quantity?: number, imageUrl?: string) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyDiscount: (code: string) => Promise<boolean>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [cartVersion, setCartVersion] = useState(1);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem('sherweb-cart-id');
    const savedCartVersion = localStorage.getItem('sherweb-cart-version');
    const savedItems = localStorage.getItem('sherweb-cart-items');
    if (savedCartId) setCartId(savedCartId);
    if (savedCartVersion) setCartVersion(parseInt(savedCartVersion));
    if (savedItems) {
      try { setItems(JSON.parse(savedItems)); } catch {}
    }
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    if (cartId) {
      localStorage.setItem('sherweb-cart-id', cartId);
      localStorage.setItem('sherweb-cart-version', cartVersion.toString());
      localStorage.setItem('sherweb-cart-items', JSON.stringify(items));
    }
  }, [cartId, cartVersion, items]);

  const ensureCart = useCallback(async () => {
    if (cartId) return cartId;
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', currency: 'USD' }),
    });
    if (!res.ok) throw new Error('Failed to create cart');
    const cart = await res.json();
    setCartId(cart.id);
    setCartVersion(cart.version);
    return cart.id;
  }, [cartId]);

  const addItem = useCallback(async (productId: string, variantId: number, name: string, sku: string, price: number, currency: string, quantity = 1, imageUrl?: string) => {
    setIsLoading(true);
    try {
      // Check if item already in local state
      const existing = items.find(i => i.sku === sku);
      if (existing) {
        setItems(prev => prev.map(i => i.sku === sku ? { ...i, quantity: i.quantity + quantity, totalPrice: (i.quantity + quantity) * i.unitPrice } : i));
        setIsOpen(true);
        return;
      }
      const id = await ensureCart();
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', cartId: id, version: cartVersion, productId, variantId, quantity }),
      });
      if (res.ok) {
        const cart = await res.json();
        setCartVersion(cart.version);
        const lineItem = cart.lineItems?.find((li: any) => li.productId === productId && li.variant?.id === variantId);
        const newItem: CartItem = {
          lineItemId: lineItem?.id ?? crypto.randomUUID(),
          productId, variantId, name, sku, quantity,
          unitPrice: price, totalPrice: price * quantity, currency, imageUrl,
        };
        setItems(prev => [...prev, newItem]);
        setIsOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [cartId, cartVersion, items, ensureCart]);

  const removeItem = useCallback(async (lineItemId: string) => {
    setIsLoading(true);
    try {
      if (cartId) {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'remove', cartId, version: cartVersion, lineItemId }),
        });
      }
      setItems(prev => prev.filter(i => i.lineItemId !== lineItemId));
    } finally {
      setIsLoading(false);
    }
  }, [cartId, cartVersion]);

  const updateQuantity = useCallback(async (lineItemId: string, quantity: number) => {
    if (quantity <= 0) { removeItem(lineItemId); return; }
    setItems(prev => prev.map(i => i.lineItemId === lineItemId ? { ...i, quantity, totalPrice: quantity * i.unitPrice } : i));
    if (cartId) {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', cartId, version: cartVersion, lineItemId, quantity }),
      });
    }
  }, [cartId, cartVersion, removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setCartId(null);
    setCartVersion(1);
    localStorage.removeItem('sherweb-cart-id');
    localStorage.removeItem('sherweb-cart-version');
    localStorage.removeItem('sherweb-cart-items');
  }, []);

  const applyDiscount = useCallback(async (code: string): Promise<boolean> => {
    // In real implementation, would call commercetools API
    const validCodes = ['NEWPARTNER15', 'ANNUAL5'];
    if (validCodes.includes(code.toUpperCase())) {
      setDiscountCode(code.toUpperCase());
      return true;
    }
    return false;
  }, []);

  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartId, cartVersion, items, itemCount, total, currency: 'USD',
      isOpen, isLoading,
      addItem, removeItem, updateQuantity, clearCart,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      applyDiscount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
