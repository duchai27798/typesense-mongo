import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import _ from 'lodash';
import mongoose from 'mongoose';

enum OrderType {
    ASC = 1,
    DESC = -1,
}

type OrderObjectType = {
    [key: string]: OrderType;
};

export class PageOptionsDto {
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    @IsOptional()
    @ApiPropertyOptional()
    readonly page: number = 1;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    @IsOptional()
    @ApiPropertyOptional()
    readonly take: number = 10;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    readonly search: string = '';

    @IsOptional()
    @Transform(({ value }) => JSON.parse(Buffer.from(value, 'base64').toString()))
    readonly order: OrderObjectType = {};

    get skip() {
        return (this.page - 1) * this.take;
    }

    get facetPipelines() {
        const facet: mongoose.PipelineStage.FacetPipelineStage[] = [{ $skip: this.skip }, { $limit: this.take }];

        if (_.size(_.keys(this.order))) {
            facet.push({ $sort: this.order });
        }

        return facet;
    }
}
