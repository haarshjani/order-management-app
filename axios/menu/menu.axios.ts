

import { api } from '../api';


export interface GetMenuItemsParams {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    cuisine: string;
    isActive: boolean;
    maxAllowedQuantity: number;
    createdAt: Date;
    updatedAt: Date;
    page: number;
    limit: number;
    search?: string;
}


export const getMenuItems = async (params?: Partial<GetMenuItemsParams>) => {
  const response = await api.get('/menu-items', { params });
  console.log({response});
  
  return response.data;
};

