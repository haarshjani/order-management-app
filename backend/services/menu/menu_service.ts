import { MenuItemRepository } from '@/backend/respositories/menu';
import { IllegalArgumentError, NotFoundError } from '@/backend/uitls/errorhadlers/errors';
import { Prisma } from '@/prisma/generated/prisma/client';



export class MenuItemService {
  private repo = new MenuItemRepository();
 
   async getMenuItemById(id: string) {
    const menuItem = await this.repo.findById(id);
    if (!menuItem) throw new NotFoundError(`MenuItem with id ${id} not found`);
    return menuItem;
  }

  async findAll(
    filters: Record<string, any> = {},
    pagination: { page?: number; limit?: number },
    
  ) {
  
    const allowedFields = Object.keys(Prisma.MenuItemScalarFieldEnum);

    const invalidFields = Object.keys(filters).filter(
      (key) => !allowedFields.includes(key)
    );

    console.log({allowedFields, filters});
    
    if (invalidFields.length > 0) {
      throw new IllegalArgumentError(
        `Invalid filter field(s): ${invalidFields.join(', ')}`
      );
    }

  
    const where: Record<string, any> = {};
    for (const [key, value] of Object.entries(filters)) {
      where[key] = value;
    }

  
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    if (page <= 0 || limit <= 0) {
      throw new IllegalArgumentError('Page and limit must be positive numbers');
    }

    const skip = (page - 1) * limit;
    const take = limit;

   
    return this.repo.findAll({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }
}
