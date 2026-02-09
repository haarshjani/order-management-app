import {db} from '@/lib/db';
import { MenuItem } from '@/prisma/generated/prisma/client';

export class MenuItemRepository {

  async findAll(prismaArgs: any) {
    return db.menuItem.findMany(prismaArgs);
  }
  
  async findById(id: string): Promise<MenuItem | null> {
    return db.menuItem.findUnique({
      where: { id },
    });
  }
}
