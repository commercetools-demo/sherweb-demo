import { apiRoot } from './client';
import type { ProductProjection, Category } from '@commercetools/platform-sdk';

export async function getProducts(params?: {
  categoryId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const query = apiRoot.productProjections().search();
    const queryArgs: Record<string, any> = {
      limit: params?.limit ?? 20,
      offset: params?.offset ?? 0,
      expand: ['categories[*]'],
      priceCurrency: 'USD',
      priceCountry: 'US',
    };
    if (params?.search) queryArgs['text.en-US'] = params.search;
    if (params?.categoryId) queryArgs.filter = `categories.id:"${params.categoryId}"`;
    const response = await query.get({ queryArgs }).execute();
    return response.body;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { results: [], total: 0, count: 0, offset: 0 };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const response = await apiRoot.productProjections().withKey({ key: slug }).get({
      queryArgs: { expand: ['categories[*]'], priceCurrency: 'USD', priceCountry: 'US' },
    }).execute();
    return response.body;
  } catch {
    try {
      const response = await apiRoot.productProjections().search().get({
        queryArgs: { filter: `slug.en-US:"${slug}"`, expand: ['categories[*]'], priceCurrency: 'USD', priceCountry: 'US', limit: 1 },
      }).execute();
      return response.body.results[0] ?? null;
    } catch {
      return null;
    }
  }
}

export async function getCategories() {
  try {
    const response = await apiRoot.categories().get({ queryArgs: { limit: 100, expand: ['parent'] } }).execute();
    return response.body.results;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
