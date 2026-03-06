import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByCustomer, createOrderFromCart } from '@/lib/commercetools/orders';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('customerId');
  if (!customerId) return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
  const orders = await getOrdersByCustomer(customerId);
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const { cartId, cartVersion } = await request.json();
  try {
    const order = await createOrderFromCart(cartId, cartVersion);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
