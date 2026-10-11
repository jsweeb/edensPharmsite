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
 */

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
  // Accept either a list of items or a single variantId/qty pair.
  const items: unknown[] = Array.isArray(data.items) ? data.items : [data];
  if (items.length === 0 || !items.every(isLineItem)) {
    return new NextResponse('Missing or invalid line items', { status: 400 });
  }
  try {
    await createOrder(data);
    for (const item of items as LineItem[]) {
      await updateInventory(item.variantId, -item.qty);
    }
    return new NextResponse('ok', { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse('Webhook error', { status: 500 });
  }
}
