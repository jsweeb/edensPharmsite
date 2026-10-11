import { NextRequest, NextResponse } from 'next/server';
import { getInventory } from '@/app/lib/vineyard';

/**
 * API Route: GET /api/vineyard/inventory/[variantId]
 *
 * Returns inventory information for a given variant ID. This endpoint is
 * intended for client-side fetching when users select different variants on
 * the product detail page. It proxies the request to the server-only
 * Vineyard adapter.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ variantId: string }> },
) {
  const { variantId } = await params;
  try {
    const info = await getInventory(variantId);
    return NextResponse.json(info, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 },
    );
  }
}
