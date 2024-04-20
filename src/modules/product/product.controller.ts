import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { MessageResponseDto, PageOptionsDto, ResponseDto } from '@/dto/core';
import { ProductService } from '@/modules/product/product.service';

class ReadFilenamesResponseDto extends ResponseDto(String, true) {}

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
        type: ReadFilenamesResponseDto,
    })
    async readFileNames() {
        return this._ProductService.readFileNames();
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    searchProduct(@Query(new ValidationPipe({ transform: true })) pageOption: PageOptionsDto) {
        return this._ProductService.searchProduct(pageOption);
    }
}
