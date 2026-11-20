const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const fmtCents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const formatPrice = (value) => (Number.isInteger(value) ? fmt.format(value) : fmtCents.format(value));

export const FREE_SHIPPING_THRESHOLD = 150;

export const SHIPPING_METHODS = [
  { id: 'standard', label: 'Standard', eta: '3–5 business days', price: 8 },
  { id: 'express', label: 'Express', eta: '1–2 business days', price: 18 },
];

export function shippingCost(subtotal, methodId = 'standard') {
  if (subtotal === 0) return 0;
  const method = SHIPPING_METHODS.find((m) => m.id === methodId) ?? SHIPPING_METHODS[0];
  if (method.id === 'standard' && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return method.price;
}

export const srcSet = (img) => `${img.sm} 600w, ${img.lg} 1000w`;
