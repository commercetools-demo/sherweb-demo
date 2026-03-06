import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/commercetools/products';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const limit = parseInt(searchParams.get('limit') ?? '20');
  const offset = parseInt(searchParams.get('offset') ?? '0');

  try {
    const products = await getProducts({ categoryId, search, limit, offset });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
