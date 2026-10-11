import { NextRequest } from 'next/server';

jest.mock('../app/lib/vineyard', () => ({
  createOrder: jest.fn(),
  updateInventory: jest.fn(),
}));

import { POST } from '../app/api/samcart/webhook/route';
import { createOrder, updateInventory } from '../app/lib/vineyard';

const SECRET = 'test-secret';

function webhook(body: unknown) {
  return new NextRequest('http://localhost/api/samcart/webhook', {
    method: 'POST',
    headers: { 'x-samcart-signature': SECRET },
    body: JSON.stringify(body),
  });
}

describe('SamCart webhook', () => {
  beforeAll(() => {
    process.env.SAMCART_WEBHOOK_SECRET = SECRET;
  });

  beforeEach(() => {
    jest.mocked(createOrder).mockReset().mockResolvedValue({});
    jest.mocked(updateInventory).mockReset().mockResolvedValue({});
  });

  test('rejects a bad signature', async () => {
    const req = new NextRequest('http://localhost/api/samcart/webhook', {
      method: 'POST',
      headers: { 'x-samcart-signature': 'wrong' },
      body: '{}',
    });
    expect((await POST(req)).status).toBe(401);
  });

  test('requires an orderId', async () => {
    const res = await POST(webhook({ type: 'payment.success', data: { variantId: 'a', qty: 1 } }));
    expect(res.status).toBe(400);
  });

  test('a redelivery after a partial failure only retries the failed step', async () => {
    const event = {
      type: 'payment.success',
      data: {
        orderId: 'order-retry-1',
        items: [
          { variantId: 'a', qty: 1 },
          { variantId: 'b', qty: 2 },
        ],
      },
    };
    jest.mocked(updateInventory).mockImplementation(async (variantId) => {
      if (variantId === 'b') throw new Error('Vineyard down');
      return {};
    });
    expect((await POST(webhook(event))).status).toBe(500);

    jest.mocked(updateInventory).mockResolvedValue({});
    expect((await POST(webhook(event))).status).toBe(200);

    expect(createOrder).toHaveBeenCalledTimes(1);
    const calls = jest.mocked(updateInventory).mock.calls;
    expect(calls.filter(([id]) => id === 'a')).toHaveLength(1);
    expect(calls.filter(([id]) => id === 'b')).toHaveLength(2);
    expect(calls[0][2]).toBe('samcart-order-order-retry-1-inventory-a');
  });

  test('a duplicate delivery of a processed event is a no-op', async () => {
    const event = { type: 'payment.success', data: { orderId: 'order-dup-1', variantId: 'c', qty: 1 } };
    expect((await POST(webhook(event))).status).toBe(200);
    expect((await POST(webhook(event))).status).toBe(200);
    expect(createOrder).toHaveBeenCalledTimes(1);
    expect(updateInventory).toHaveBeenCalledTimes(1);
  });
});
