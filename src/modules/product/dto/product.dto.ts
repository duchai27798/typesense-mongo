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
    price: number;

    @Expose()
    @ApiProperty()
    description: string;

    @Expose()
    @ApiProperty()
    adjective: string;

    @Expose()
    @ApiProperty()
    material: string;
}
