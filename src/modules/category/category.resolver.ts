import { CategoryService } from './category.service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CategoryModel } from './models/category.model';

@Resolver('Category')
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) { }

  @Query(() => [CategoryModel], { name: 'getAllCategories' })
  async getAll() {
    return this.categoryService.getAll()
  }

  @Query(() => [CategoryModel], { name: 'getRandomCategories' })
  async getRandomCategories() {
    return this.categoryService.getRandomCategories()
  }

  @Query(() => CategoryModel, { name: 'getCategoryBySlug' })
  async getBySlug(@Args('slug') slug: string) {
    return this.categoryService.getBySlug(slug)
  }
}