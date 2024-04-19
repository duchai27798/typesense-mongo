import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Product, ProductSchema } from '@/modules/product/schemas/product.schema';
import { ProductSearchSchema } from '@/modules/product/schemas/product-search.schema';
import { TypeSenseModule } from '@/modules/type-sense/type-sense.module';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    providers: [ProductService],
    controllers: [ProductController],
    imports: [
        MongooseModule.forFeature([
            {
                name: Product.name,
                schema: ProductSchema,
            },
        ]),
        TypeSenseModule.forFeature(ProductSearchSchema),
    ],
})
export class ProductModule {}
