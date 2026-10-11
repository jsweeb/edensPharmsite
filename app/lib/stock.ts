import { getInventory, type InventoryInfo } from '@/app/lib/vineyard';
import type { CartItem } from '@/app/lib/cart';

/** Whether `qty` units can be bought given this inventory snapshot. */
export function canPurchase(inv: InventoryInfo, qty: number): boolean {
  return inv.preorderAllowed || inv.availableQty >= qty;
}

/**
 * Re-check every cart line against current stock. Lines that are out of
 * stock are dropped and quantities above available stock are reduced.
 * Throws if inventory can't be checked, so callers fail closed.
 */
export async function reconcileCart(cart: CartItem[]): Promise<{ cart: CartItem[]; changed: boolean }> {
  const checked = await Promise.all(
    cart.map(async (item) => {
      const inv = await getInventory(item.variantId);
      if (canPurchase(inv, item.qty)) return item;
      return inv.availableQty > 0 ? { ...item, qty: inv.availableQty } : null;
    }),
  );
  const next = checked.filter((item): item is CartItem => item !== null);
  const changed = next.length !== cart.length || next.some((item, i) => item.qty !== cart[i].qty);
  return { cart: next, changed };
}
