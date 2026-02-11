// app/api/order/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/backend/services/order/order.service';
import { withErrorHandler } from '@/backend/uitls/errorhadlers/with_error_handler';

export const runtime = 'nodejs';

const service = new OrderService();

/**
 * GET /api/order/:id
 */
export const GET = withErrorHandler(async (req: NextRequest,  context: { params: { phone: string } }) => {
 
  const {id} =  await context.params;

  console.log({id});
  


  if (!id) {
    return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
  }

   const orders = await service.getOrderById(id);

  return NextResponse.json({ data: orders }, { status: 200 });
  
});
