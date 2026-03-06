import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Price } from '@commercetools/platform-sdk';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price?: Price | null): string {
  if (!price) return 'Contact for pricing';
  const amount = price.value.centAmount / Math.pow(10, price.value.fractionDigits ?? 2);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.value.currencyCode,
  }).format(amount);
}

export function formatCentAmount(centAmount: number, currencyCode: string = 'USD', fractionDigits: number = 2): string {
  const amount = centAmount / Math.pow(10, fractionDigits);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

export function getProductImageUrl(product: any): string {
  const variant = product.masterVariant ?? product;
  return variant?.images?.[0]?.url ?? '/placeholder-product.png';
}

export function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}
