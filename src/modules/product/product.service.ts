import { faker } from '@faker-js/faker';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import _ from 'lodash';
import { Model } from 'mongoose';

import { ChangeStreamService } from '@/database';
import { SuccessDto } from '@/dto/core';
import { Product } from '@/modules/product/schemas/product.schema';
import { ProductSearchSchema } from '@/modules/product/schemas/product-search.schema';
import { TProduct } from '@/modules/product/types/product';
import { TypeSenseService } from '@/modules/type-sense/type-sense.service';

@Injectable()
export class ProductService extends ChangeStreamService<Product> {
    constructor(@InjectModel(Product.name) private readonly _ProductModel: Model<Product>) {
        super(_ProductModel);
        this._ModelChangeStream.on('change', async (e) => {
            await TypeSenseService.syncData(ProductSearchSchema.name, e);
        });
    }

    async fakeData() {
        const products = _.range(1000).map(
            (): TProduct => ({
                name: faker.commerce.productName(),
                price: parseFloat(faker.commerce.price({ max: 10000, min: 5 })),
                adjective: faker.commerce.productAdjective(),
                material: faker.commerce.productMaterial(),
                description: faker.commerce.productDescription(),
            }),
        );

        await this._ProductModel.deleteMany();
        await this._ProductModel.insertMany(plainToInstance(Product, products));

        return new SuccessDto('Fake products successfully', HttpStatus.CREATED);
    }
}
