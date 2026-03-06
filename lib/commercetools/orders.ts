import { apiRoot } from './client';

export async function getOrdersByCustomer(customerId: string) {
  try {
    const response = await apiRoot.orders().get({
      queryArgs: { where: `customerId="${customerId}"`, sort: 'createdAt desc', limit: 50 },
    }).execute();
    return response.body.results;
  } catch { return []; }
}

export async function getOrderById(orderId: string) {
  const response = await apiRoot.orders().withId({ ID: orderId }).get().execute();
  return response.body;
}

export async function createOrderFromCart(cartId: string, cartVersion: number) {
  const response = await apiRoot.orders().post({
    body: { cart: { typeId: 'cart', id: cartId }, version: cartVersion },
  }).execute();
  return response.body;
}
