import {InputType, Field} from 'type-graphql';
import {CategoryRelated} from '../../categories/dto/category-related.dto';
import {ThemeImagesRelated} from '../../theme-images/dto/theme-images-related.dto';
import { OpeningHoursInput } from './opening-hours-input';

@InputType()
export class OrganisationUpdateInputDto {

    @Field()
    id: number;

    @Field({nullable: true})
    title?: string;

    @Field({nullable: true})
    description?: string;

    @Field({nullable: true})
    email?: string;

    @Field({nullable: true})
    postcode?: string;

    @Field({nullable: true})
    website?: string;

    @Field({nullable: true})
    phone?: string;

    @Field(() => [CategoryRelated], {nullable: true})
    category?: CategoryRelated[];

    @Field({nullable: true})
    theme?: ThemeImagesRelated;

    @Field({nullable: true})
    photoUrl?: string;

    @Field({nullable: true})
    location?: string;

    @Field(() => [OpeningHoursInput], {nullable: true})
    opening?: OpeningHoursInput[];
}
