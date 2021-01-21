import { Connection } from 'typeorm';
import { Seeder, Factory } from 'typeorm-seeding';
import { User } from '../src/user/user.entity';
import * as csv from 'csvtojson';
import { PostcodesApiService } from '../src/common/services/postcodes-api/postcodes.service';
import { HttpService } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { PostcodeService } from '../src/postcode/postcode.service';
import { AuthService } from '../src/common/services/auth/auth.service';
import { CategoryTypeDto } from '../src/categories/dto/category.type.dto';
import { Organisation } from '../src/organisation/organisation.entity';
import { ProductCategoryDto } from '../src/product/dto/enums/product-category';
import { Product } from '../src/product/product.entity';


const partners = [
  {
    title: 'British Gas',
    url: '/assets/images/partners/british-gas.png',
    tarifName: 'Bulb Standard eletric',
  },
  {
    title: 'E.ON',
    url: '/assets/images/partners/e-dot-on.png',
    tarifName: 'Pure planet eletric',
  },
  {
    title: 'EDF Energy',
    url: '/assets/images/partners/edf.png',
    tarifName: 'Octupus eletric',
  },
  {
    title: 'npower',
    url: '/assets/images/partners/npower.png',
    tarifName: 'Robin hood eletric',
  },
  {
    title: 'ScottishPower',
    url: '/assets/images/partners/scottishpower.png',
    tarifName: 'Green energy eletric',
  },
  {
    title: 'SSE Southern Electric',
    url: '/assets/images/partners/sse.png',
    tarifName: 'Octupus eletric',
  },
];
const description = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
 has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
 type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
 leap into electronic typesetting, remaining essentially unchanged.`;

export default class MockData implements Seeder {
  postcodesApiService: PostcodesApiService;
  authSrv: AuthService;
  constructor() {
    console.log('constructor');
    this.authSrv = new AuthService();
    this.postcodesApiService = new PostcodesApiService(new HttpService());
  }

  previousValidPostcode;

  async findOrAddPostCode(postcodeString, connection: Connection) {
    postcodeString = postcodeString.replace(/ /g, '').toUpperCase();
    let result = await connection.createQueryBuilder('postcode', 'postcode')
            .select('id', 'id')
            .where({postcode: postcodeString})
            .execute();
    if (result.length) {
      this.previousValidPostcode = result[0].id;
      return result[0].id;
    }
    const postcodeResponce = await this.postcodesApiService.checkPostcode(postcodeString);
    if (!postcodeResponce) {
      console.log('Postcode not found', postcodeString);
      return this.previousValidPostcode;
    }
    const postcode = {
      postcode: postcodeString,
      communityId: postcodeResponce.codes.admin_ward,
      coordinates: {
        type: 'Point',
        coordinates: [postcodeResponce.longitude, postcodeResponce.latitude],
      },
    };
    result = await connection.createQueryBuilder()
          .insert()
          .into('postcode')
          .values(postcode)
          .onConflict(`("postcode") DO UPDATE SET "community_id" = :communityId`)
          .setParameter('communityId', postcode.communityId)
          .execute();
    this.previousValidPostcode = result.identifiers[0];
    return result.identifiers[0];

  }

  public async insertData(data, connection: Connection, name): Promise<any> {
    return (await connection.createQueryBuilder()
          .insert()
          .into(name)
          .values(data)
          .execute()).identifiers;
  }

  category: any[];

  public async getRandomCategory(type: CategoryTypeDto, connection: Connection, maxCount = 3) {

    if (!this.category) {
      this.category = await connection.createQueryBuilder('category', 'category')
        .select(['id', 'parent', 'type'])
        .execute();
    }
    const cats = [];
    const count = Math.floor(Math.random() * 3) + 1;
    const typeCats = this.category.filter(c => c.type === type);
    let i: number = Math.floor(Math.random() * typeCats.length);
    while (cats.length < count) {
      const isParent = typeCats.find(c => c.parent === typeCats[i].id);
      if (!isParent && !cats.find(c => c.id === typeCats[i].id)) {
        cats.push({id: typeCats[i].id});
      } else if (i < typeCats.length - 1) {
        i++;
        continue;
      }
      i = Math.floor(Math.random() * typeCats.length);
    }
    return cats;
  }

  freq;

  public async getRandomOccurance(connection: Connection) {

    if (!this.freq) {
      this.freq = await connection.createQueryBuilder('occurance', 'occurance')
        .select(['id', 'parent', 'name'])
        .execute();
      this.freq = this.freq.filter(c => c.name.indexOf('Week') === -1);
    }
    const rerults = [];
    let i: number = Math.floor(Math.random() * this.freq.length);
    return this.freq[i];
  }

  public async run(factory: Factory, connection: Connection): Promise<any> {
    //clear
    await connection.query('TRUNCATE TABLE "event" CASCADE');
    await connection.query('TRUNCATE TABLE "fund" CASCADE');
    await connection.query('DELETE FROM "deliverysettings" WHERE true');
    await connection.query('TRUNCATE TABLE "organisation" CASCADE');
    await connection.query('DELETE FROM "event_group" WHERE true');
    await connection.query('DELETE FROM "theme_images" WHERE user_id IS NOT NULL');
    await connection.query('DELETE FROM "purchase_product" where true');
    await connection.query('DELETE FROM "transaction" where true');
    await connection.query('DELETE FROM "notification" where true');
    await connection.query('DELETE FROM "fund" where true');
    await connection.query('DELETE FROM "message" where true');
    await connection.query('DELETE FROM "friendship" where true');
    await connection.query('DELETE FROM "product" where true');
    await connection.query('DELETE FROM "review" where true');
    await connection.query('DELETE FROM "update" where true');
    await connection.query('DELETE FROM "user_saving" where true');
    await connection.query('DELETE FROM "user_followers" where true');
    await connection.query('DELETE FROM "user" where true');

    const users = await this.users(connection);

    const orgs = await this.orgs(connection, users);

    await this.event(connection, users, orgs);
    await this.fund(connection, users, orgs);

    await this.partners(connection, users);
  }

  async partners(connection, users: User[]) {
    const orgs: Organisation[] = [];

    for (const {title, url} of partners ) {
      orgs.push({
        title,
        photoUrl: url,
        description,
        postcode: await this.findOrAddPostCode('TW15 1AQ', connection),
        category: await this.getRandomCategory(CategoryTypeDto.ORGANISATION, connection, 4),
        partner: true,
        phone: '',
        owner_id: null,
      });
    }

    const products: Product[] = [];
    let cost = 600;
    const ids = (await this.insertData(orgs, connection, 'organisation') );
    for (const {tarifName} of partners ) {
      const id = ids.shift();
      products.push({
        name: tarifName,
        cost,
        serviceType: ProductCategoryDto.ENERGY_SWITCH,
        contribution: 5,
        org_id: id.id,
        postcode: await this.findOrAddPostCode('TW15 1AQ', connection),
      });
      cost += 50;
    }
    await this.insertData(products, connection, 'product');
  }

  async users(connection) {
    const users = await csv().fromFile(`${__dirname}/data/USER_MOCK_DATA.csv`);

    for (let i = 0; i < users.length; i++) {
      users[i].postcode = await this.findOrAddPostCode(users[i].postcode, connection);
      users[i].passwordHash = await this.authSrv.generatePassword(users[i].password);
      delete users[i].password;
    }
    let ids = await this.insertData(users, connection, 'user');
    users.forEach((u, i) => u.id = ids[i].id);
    return users;
  }

  async orgs(connection: Connection, users) {
    const orgs = await csv().fromFile(`${__dirname}/data/COMPANY_MOCK_DATA.csv`);
    let orgCats = [];
    for (let i = 0; i < orgs.length; i++) {
      orgs[i].postcode = await this.findOrAddPostCode(orgs[i].postcode, connection);
      orgs[i].owner = users.find(u => u.email === orgs[i].owner).id;
      orgs[i].category = await this.getRandomCategory(CategoryTypeDto.ORGANISATION, connection, 4);
    }

    const ids = await this.insertData(orgs, connection, 'organisation');

    orgs.forEach((o, i) => {
      orgCats.push(...o.category.map(c => ({org_id: ids[i].id, category_id: c.id})));
    });
    await this.insertData(orgCats, connection, 'organisation_categories');
    return orgs;
  }

  async event(connection: Connection, users, orgs) {
    const event = [].concat(
      await csv().fromFile(`${__dirname}/data/USER_EVENT_MOCK_DATA.csv`),
      await csv().fromFile(`${__dirname}/data/ORG_EVENT_MOCK_DATA.csv`),
    )

    let eventCats = [];
    for (let i = 0; i < event.length; i++) {
      let org = (orgs.find(o => o.email === event[i].org) || {id: null});
      event[i].postcode = (event[i].postcode) ? await this.findOrAddPostCode(event[i].postcode, connection) : null;
      event[i].owner = (event[i].owner) ? users.find(u => u.email === event[i].owner).id : org.owner;
      event[i].category = await this.getRandomCategory(CategoryTypeDto.EVENT, connection, 4);
      event[i].occurance = await this.getRandomOccurance(connection);
      event[i].isPublic = !!event[i].isPublic;
      event[i].organisation_id = org.id;
    }

    const ids = await this.insertData(event, connection, 'event');

    event.forEach((o, i) => {
      eventCats.push(...o.category.map(c => ({event_id: ids[i].id, category_id: c.id})));
    });
    await this.insertData(eventCats, connection, 'event_categories');

    const freq = [];
    event.forEach((o, i) => {
      freq.push({event_id: ids[i].id, occurance_id: o.occurance.id});
    });
    await this.insertData(freq, connection, 'event_occurance');
  }

  async fund(connection: Connection, users, orgs) {
    const fund = [].concat(
      await csv().fromFile(`${__dirname}/data/USER_FUND_MOCK_DATA.csv`),
      await csv().fromFile(`${__dirname}/data/COMPANY_FUND_MOCK_DATA.csv`),
    )

    let fundCats = [];
    for (let i = 0; i < fund.length; i++) {
      let org = (orgs.find(o => o.email === fund[i].org) || {id: null});
      fund[i].postcode = (fund[i].postcode) ? await this.findOrAddPostCode(fund[i].postcode, connection) : null;
      fund[i].owner = (fund[i].owner) ? users.find(u => u.email === fund[i].owner).id : org.owner;
      fund[i].category = await this.getRandomCategory(CategoryTypeDto.FUND, connection, 4);
      fund[i].occurance = await this.getRandomOccurance(connection);
      fund[i].isPublic = !!fund[i].isPublic;
      fund[i].isPublished = !!fund[i].isPublished;
      fund[i].organisation_id = org.id;
    }

    const ids = await this.insertData(fund, connection, 'fund');

    fund.forEach((o, i) => {
      fundCats.push(...o.category.map(c => ({fund_id: ids[i].id, category_id: c.id})));
    });
    await this.insertData(fundCats, connection, 'fund_categories');
  }
}