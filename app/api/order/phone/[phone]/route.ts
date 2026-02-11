// app/api/order/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/backend/services/order/order.service';
import { withErrorHandler } from '@/backend/uitls/errorhadlers/with_error_handler';

export const runtime = 'nodejs';

const service = new OrderService();

/**
 * GET /api/order/:phone
 */
export const GET = withErrorHandler(async (req: NextRequest,  context: { params: { phone: string } }) => {
 
  const {phone} =  await context.params;

  console.log({phone});
  


  if (!phone) {
    return NextResponse.json({ error: 'Customer Phone is required' }, { status: 400 });
  }

   const orders = await service.getAllOrderByPhone(phone);

  return NextResponse.json({ data: orders }, { status: 200 });
  
});
