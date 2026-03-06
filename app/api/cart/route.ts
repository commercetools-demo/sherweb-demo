import { NextRequest, NextResponse } from 'next/server';
import { createCart, getCart, addToCart, removeFromCart, updateLineItemQuantity } from '@/lib/commercetools/cart';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, cartId, version, ...data } = body;

    if (action === 'create') {
      const cart = await createCart(data.currency ?? 'USD', data.customerId, data.businessUnitKey);
      return NextResponse.json(cart);
    }
    if (action === 'add') {
      const cart = await addToCart(cartId, version, data.productId, data.variantId, data.quantity);
      return NextResponse.json(cart);
    }
    if (action === 'remove') {
      const cart = await removeFromCart(cartId, version, data.lineItemId);
      return NextResponse.json(cart);
    }
    if (action === 'update') {
      const cart = await updateLineItemQuantity(cartId, version, data.lineItemId, data.quantity);
      return NextResponse.json(cart);
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Cart error:', error);
    return NextResponse.json({ error: 'Cart operation failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get('cartId');
  if (!cartId) return NextResponse.json({ error: 'Cart ID required' }, { status: 400 });
  try {
    const cart = await getCart(cartId);
    return NextResponse.json(cart);
  } catch {
    return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
  }
}
