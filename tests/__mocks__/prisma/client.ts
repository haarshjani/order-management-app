
export const PrismaClient = jest.fn().mockImplementation(() => ({
  menuItem: {
    findMany: jest.fn().mockResolvedValue([{ id: 1, name: 'Dhokla', description: 'Steamed gram flour snack', price: 2.99, image_url: '', cuisine: 'gujarati', isActive: true },
                                              {id: 2, name: 'Khandvi', description: 'Rolled gram flour snack with spices', price: 3.49, image_url: '', cuisine: 'gujarati', isActive: true },]),
    create: jest.fn(),
    update: jest.fn(),
  },
}));
