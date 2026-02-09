// app/api/order/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/backend/services/order/order.service';
import { withErrorHandler } from '@/backend/uitls/errorhadlers/with_error_handler';

export const runtime = 'nodejs';

const service = new OrderService();

/**
 * GET /api/order/:id
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  // Extract order ID from the URL
  const { pathname } = new URL(req.url);
  const parts = pathname.split('/');
  const id = parts[parts.length - 1]; // last segment is the order ID

  if (!id) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  const order = await service.getOrder(id);

  return NextResponse.json({ data: order }, { status: 200 });
});
