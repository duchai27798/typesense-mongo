import { Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { MessageResponseDto, ResponseDto } from '@/dto/core';
import { ProductService } from '@/modules/product/product.service';

@Controller('products')
@ApiTags('Products')
export class ProductController {
    constructor(private readonly _ProductService: ProductService) {}

    @Post('import-data/:filename')
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({
        type: MessageResponseDto,
    })
    @ApiParam({
        name: 'filename',
        type: String,
    })
    async importData(@Param('filename') filename: string) {
        return this._ProductService.importData(filename);
    }

    @Get('filenames')
    @HttpCode(HttpStatus.CREATED)
    @ApiOkResponse({
        type: ResponseDto(String, true),
    })
    async readFileNames() {
        return this._ProductService.readFileNames();
    }
}
