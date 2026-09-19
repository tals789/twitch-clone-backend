import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@root/core/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) { }

  async getAll() {
    return await this.prisma.category.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async getRandomCategories() {
    const total = await this.prisma.category.count()

    const randomIndexes = new Set<number>()

    while (randomIndexes.size < 7) {
      const randomIndex = Math.floor(Math.random() * total)

      randomIndexes.add(randomIndex)
    }

    const categories = await this.prisma.category.findMany({
      skip: 0,
      take: total
    })

    return Array.from(randomIndexes).map(index => categories[index])
  }

  async getBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: { streams: { include: { user: true, category: true } } }
    })

    if (!category) {
      throw new NotFoundException('Категория не найдена')
    }

    return category
  }
}