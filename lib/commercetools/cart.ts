import { apiRoot } from './client';
import type { Cart, LineItem } from '@commercetools/platform-sdk';

export async function createCart(currency: string = 'USD', customerId?: string, businessUnitKey?: string) {
  const response = await apiRoot.carts().post({
    body: {
      currency,
      country: 'US',
      ...(customerId ? { customerId } : {}),
      ...(businessUnitKey ? { businessUnit: { typeId: 'business-unit', key: businessUnitKey } } : {}),
    },
  }).execute();
  return response.body;
}

export async function getCart(cartId: string) {
  const response = await apiRoot.carts().withId({ ID: cartId }).get().execute();
  return response.body;
}

export async function addToCart(cartId: string, version: number, productId: string, variantId: number, quantity: number) {
  const response = await apiRoot.carts().withId({ ID: cartId }).post({
    body: {
      version,
      actions: [{ action: 'addLineItem', productId, variantId, quantity }],
    },
  }).execute();
  return response.body;
}

export async function removeFromCart(cartId: string, version: number, lineItemId: string) {
  const response = await apiRoot.carts().withId({ ID: cartId }).post({
    body: {
      version,
      actions: [{ action: 'removeLineItem', lineItemId }],
    },
  }).execute();
  return response.body;
}

export async function updateLineItemQuantity(cartId: string, version: number, lineItemId: string, quantity: number) {
  const response = await apiRoot.carts().withId({ ID: cartId }).post({
    body: {
      version,
      actions: [{ action: 'changeLineItemQuantity', lineItemId, quantity }],
    },
  }).execute();
  return response.body;
}
