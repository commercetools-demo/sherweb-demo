export interface SherwebPartner {
  id: string;
  key: string;
  name: string;
  email: string;
  tier: 'standard' | 'premium' | 'enterprise';
  mrr?: number;
  customerCount?: number;
}

export interface SherwebCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  businessUnitKey?: string;
}

export interface SherwebProduct {
  id: string;
  key?: string;
  name: string;
  description?: string;
  category?: string;
  vendor?: string;
  variants: SherwebVariant[];
  masterVariant: SherwebVariant;
  slug?: string;
}

export interface SherwebVariant {
  id: number;
  sku: string;
  name: string;
  price?: number;
  currency?: string;
  attributes?: Record<string, any>;
  availability?: string;
}

export interface CartState {
  id?: string;
  version?: number;
  items: CartItem[];
  total: number;
  currency: string;
  businessUnitKey?: string;
}

export interface CartItem {
  lineItemId: string;
  productId: string;
  variantId: number;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
}

export type UserRole = 'partner' | 'end-customer' | 'admin';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  businessUnitKey?: string;
  businessUnitName?: string;
}
