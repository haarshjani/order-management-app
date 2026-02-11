import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '@/backend/uitls/errorhadlers/central_error';

export function withErrorHandler<P extends Record<string, string>>(
  handler: (req: NextRequest, context: { params: P }) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: { params: Record<string, string> }) => {
    try {
      return await handler(req, context as { params: P });
    } catch (error: any) {
      console.error(error);

      if (error instanceof AppError) {
        return NextResponse.json(error, { status: error.statusCode ?? 400 });
      }

      return NextResponse.json(
        {
          message: 'Internal Server Error',
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
        { status: 500 }
      );
    }
  };
}
