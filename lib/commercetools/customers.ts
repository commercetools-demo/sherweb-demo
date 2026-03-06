import { apiRoot } from './client';

export async function getCustomerByEmail(email: string) {
  try {
    const response = await apiRoot.customers().get({
      queryArgs: { where: `email="${email}"`, limit: 1 },
    }).execute();
    return response.body.results[0] ?? null;
  } catch { return null; }
}

export async function authenticateCustomer(email: string, password: string) {
  try {
    const response = await apiRoot.login().post({
      body: { email, password },
    }).execute();
    return response.body.customer;
  } catch { return null; }
}

export async function getBusinessUnits() {
  try {
    const response = await apiRoot.businessUnits().get({ queryArgs: { limit: 100 } }).execute();
    return response.body.results;
  } catch { return []; }
}

export async function getBusinessUnitByKey(key: string) {
  try {
    const response = await apiRoot.businessUnits().withKey({ key }).get().execute();
    return response.body;
  } catch { return null; }
}
