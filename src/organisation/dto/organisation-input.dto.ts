import {InputType, Field} from 'type-graphql';
import {CategoryRelated} from '../../categories/dto/category-related.dto';
import {ThemeImagesRelated} from '../../theme-images/dto/theme-images-related.dto';
import { OpeningHoursInput } from './opening-hours-input';

@InputType()
export class OrganisationInputDto {

    @Field({nullable: true})
    id?: number;

    @Field()
    title: string;

    @Field()
    description: string;

    @Field({nullable: true})
    email?: string;

    @Field()
    postcode: string;

    @Field({nullable: true})
    website: string;

    @Field()
    phone: string;

    @Field(() => [CategoryRelated], {nullable: true})
    category: CategoryRelated[];

    @Field({nullable: true})
    theme?: ThemeImagesRelated;

    @Field({nullable: true})
    photoUrl?: string;

    @Field({nullable: true})
    defaultFund?: number;

    @Field({nullable: true})
    location?: string;

    @Field(() => [OpeningHoursInput], {nullable: true})
    opening?: OpeningHoursInput[];
}
