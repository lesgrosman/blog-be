import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesResponse } from './swagger/responses';

@ApiTags('Post categries')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOkResponse({ type: CategoriesResponse, isArray: true })
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }
}
