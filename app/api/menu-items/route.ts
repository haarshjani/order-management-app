import {  NextRequest, NextResponse } from 'next/server';
import { MenuItemService } from '@/backend/services/menu/menu_service';
import { withErrorHandler } from '@/backend/uitls/errorhadlers/with_error_handler';

export const runtime = "nodejs";

const service = new MenuItemService();

/**
 * GET /api/menu-items
 * ?cuisine=panjabi&isActive=true&page=1&limit=10
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const filters: Record<string, any> = {
    isActive: searchParams.get('isActive') || true,
  };

  searchParams.forEach((value, key) => {
    if (key !== 'page' && key !== 'limit') {
      filters[key] = value;
    }
  });

  const data = await service.findAll(filters, {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  return NextResponse.json({ data }, { status: 200 });
});

