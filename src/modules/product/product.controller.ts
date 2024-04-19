import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { MessageResponseDto } from '@/dto/core';
import { ProductService } from '@/modules/product/product.service';

@Controller('products')
@ApiTags('Products')
export class ProductController {
    constructor(private readonly _ProductService: ProductService) {}

    @Post('fake-data')
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({
        type: MessageResponseDto,
    })
    async fake() {
        return this._ProductService.fakeData();
    }
}
