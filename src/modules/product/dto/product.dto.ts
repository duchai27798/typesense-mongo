import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { DefaultDataDto } from '@/dto/core';

@Exclude()
export class ProductDto extends DefaultDataDto {
    @Expose()
    @ApiProperty()
    name: string;

    @Expose()
    @ApiProperty()
    category: string;

    @Expose()
    @ApiProperty()
    subCategory: string;

    @Expose()
    @ApiProperty()
    image: string;

    @Expose()
    @ApiProperty()
    link: string;

    @Expose()
    @ApiProperty()
    ratings: number;

    @Expose()
    @ApiProperty()
    noOfRatings: number;

    @Expose()
    @ApiProperty()
    discountPrice: number;

    @Expose()
    @ApiProperty()
    actualPrice: number;
}
