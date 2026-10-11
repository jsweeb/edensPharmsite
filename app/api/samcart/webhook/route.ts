import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/app/lib/samcart';
import { createOrder, updateInventory } from '@/app/lib/vineyard';

/**
 * POST /api/samcart/webhook
 *
 * Handles SamCart webhook events. Verifies the signature to ensure the
 * request originates from SamCart. On a successful payment event, this
 * handler creates a corresponding order in Vineyard and decrements
 * inventory for each purchased variant. Responses must return 200 to
 * acknowledge receipt.
 *
 * SamCart redelivers any event that doesn't get a 200, so every side effect
 * is idempotent: each Vineyard call carries an Idempotency-Key derived from
 * the order id, and steps that already succeeded are remembered so a retry
 * after a partial failure only re-runs what failed.
 */

// Completed side effects, keyed by idempotency key. In-process only; the
// Idempotency-Key header lets Vineyard dedupe across restarts.
const completedSteps = new Set<string>();
const MAX_REMEMBERED_STEPS = 10_000;

async function once(key: string, step: () => Promise<unknown>): Promise<void> {
  if (completedSteps.has(key)) return;
  await step();
  if (completedSteps.size >= MAX_REMEMBERED_STEPS) completedSteps.clear();
  completedSteps.add(key);
}

interface LineItem {
  variantId: string;
  qty: number;
}

function isLineItem(value: unknown): value is LineItem {
  if (!value || typeof value !== 'object') return false;
  const { variantId, qty } = value as Record<string, unknown>;
  return typeof variantId === 'string' && variantId.length > 0 && Number.isInteger(qty) && (qty as number) > 0;
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-samcart-signature');
  const payload = await req.text();
  if (!verifyWebhookSignature(signature, payload)) {
    return new NextResponse('Invalid signature', { status: 401 });
  }
  let event: { type?: unknown; data?: Record<string, unknown> };
  try {
    event = JSON.parse(payload);
  } catch {
    return new NextResponse('Malformed payload', { status: 400 });
  }
  if (event.type !== 'payment.success') {
    return new NextResponse('ignored', { status: 200 });
  }
  const data = event.data ?? {};
  const orderId = data.orderId;
  if ((typeof orderId !== 'string' && typeof orderId !== 'number') || String(orderId).length === 0) {
    return new NextResponse('Missing orderId', { status: 400 });
  }
  // Accept either a list of items or a single variantId/qty pair.
  const items: unknown[] = Array.isArray(data.items) ? data.items : [data];
  if (items.length === 0 || !items.every(isLineItem)) {
    return new NextResponse('Missing or invalid line items', { status: 400 });
  }
  try {
    const orderKey = `samcart-order-${orderId}`;
    await once(orderKey, () => createOrder(data, orderKey));
    for (const item of items as LineItem[]) {
      const itemKey = `${orderKey}-inventory-${item.variantId}`;
      await once(itemKey, () => updateInventory(item.variantId, -item.qty, itemKey));
    }
    return new NextResponse('ok', { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse('Webhook error', { status: 500 });
  }
}
