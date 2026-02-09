import {  NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/backend/services/order/order.service';
import { withErrorHandler } from '@/backend/uitls/errorhadlers/with_error_handler';
import { Order } from '@/prisma/generated/prisma/client';

export const runtime = "nodejs";

const service = new OrderService();

/**
 * POST /api/order
 */
export const POST = withErrorHandler(async (req: NextRequest) => {

  const body: Order = await req.json();
  const res = await service.createOrder({data:body});

  return NextResponse.json({ data: res }, { status: 201 });
});
