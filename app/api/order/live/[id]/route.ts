import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/backend/services/order/order.service';

export const runtime = 'nodejs';

const service = new OrderService();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  
  console.log("inside live");
  
  const {id: orderId} = await params;

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const send = async (data: unknown) => {
    await writer.write(
      encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
    );
  };

  try {
    
    const order = await service.getOrderById(orderId);
    await send(order);


    const unsubscribe = await service.getOrderByIdLive(
      orderId,
      async (event) => {
        await send(event);
      }
    );

 
    req.signal.addEventListener('abort', () => {
      unsubscribe();
      writer.close();
    });
  } catch (err) {
    await send({ error: 'Order not found' });
    writer.close();
  }

  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
