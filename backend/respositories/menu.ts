import {db} from '@/lib/db';
import { MenuItem, Prisma } from '@prisma/client';


export class MenuItemRepository {

  async findAll(prismaArgs: Prisma.MenuItemFindManyArgs) {
    return db.menuItem.findMany(prismaArgs);
  }
  
  async findById(id: string): Promise<MenuItem | null> {
    return db.menuItem.findUnique({
      where: { id },
    });
  }
}
