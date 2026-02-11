import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  getMenuItems,
  GetMenuItemsParams,
} from '@/axios/menu/menu.axios';
import { MenuItem } from '@prisma/client';

// ---- GET ----
export const useMenuItems = (params:Partial<GetMenuItemsParams>) => {
  return useQuery<MenuItem[], Error, MenuItem[], ['menu-items', GetMenuItemsParams?]>({
    queryKey: ['menu-items', params],
    queryFn: () => getMenuItems(params),
    keepPreviousData: true, 
  }as UseQueryOptions<MenuItem[], Error, MenuItem[], ['menu-items', GetMenuItemsParams?]>);
};
