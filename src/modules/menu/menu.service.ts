import { Injectable } from '@nestjs/common';
import { PrismaClient, MenuItem } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    pageSize?: number;
    name?: string;
    cuisine?: string;
    isActive?: boolean;
  }): Promise<{ data: MenuItem[]; total: number }> {
    const { page = 1, pageSize = 10, name, cuisine, isActive } = params;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(cuisine && { cuisine: { equals: cuisine, mode: 'insensitive' } }),
      ...(isActive !== undefined && { isActive: { equals: isActive } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.menuItem.findMany({
        where,
        skip,
        take: pageSize,
      }),
      this.prisma.menuItem.count({ where }),
    ]);

    return { data, total };
  }
}
