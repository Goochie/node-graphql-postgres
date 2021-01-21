import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository, In, EntityManager, getManager, getConnection } from 'typeorm';

const submenuCategories = ['Learning & School','Food & Drink', 'Home', 'Health and fitness']

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly manager: EntityManager,
    private readonly logger: Logger,
  ) {}

  getCategories(type?: string) {
    return this.categoryRepository.find({where: {type}});
  }

  getPopularCategories(type?: string) {
    return this.categoryRepository.find({where: {type: type, name: In(['Charity', 'Community', 'Faith', 'Children activitys'])}});
  }

  async getCategoriesBy(findOptions){
    return this.categoryRepository.find(findOptions)
  }

  async getStoreSearchSubmenuCategories(){
    const manager = getManager();

    const result = await manager.query(`select id, parent, "name", "type", count(p_id) as products_count from (with recursive subcategories as (
      select
        category.id,
        category.parent,
        category."name",
        category."type",
        pc.category_id,
        p.id as p_id
      from
        category
      left join product_categories pc on
        pc.category_id = category.id
      left join product p on
        pc.product_id = p.id
      where
        category.name = any($1)
        and category.type in ('STORE_PRODUCT',
        'SERVICE')
      union
      select
        c.id,
        c.parent,
        c."name",
        c."type",
        pc.category_id,
        p.id as p_id
      from
        category c
      inner join subcategories s on
        s.id = c.parent
      left join product_categories pc on
        pc.category_id = c.id
      left join product p on
        pc.product_id = p.id)
      select
        *
      from
        subcategories) sub
    group by id, parent, "name", "type";`, [submenuCategories])

    return result;
  }

  getCategoriesByParams(findOptions) {
    return this.categoryRepository.find(findOptions);
  }
}
