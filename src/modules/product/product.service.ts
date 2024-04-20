import fs from 'node:fs';

import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import _ from 'lodash';
import { Model } from 'mongoose';

import { ChangeStreamService } from '@/database';
import { PageOptionsDto, SuccessDto } from '@/dto/core';
import { CsvUtils } from '@/helpers';
import { Product } from '@/modules/product/schemas/product.schema';
import { ProductSearchSchema } from '@/modules/product/schemas/product-search.schema';
import { TProduct } from '@/modules/product/types/product';
import { SearchModel } from '@/modules/type-sense';

@Injectable()
export class ProductService extends ChangeStreamService<Product> {
    constructor(
        @InjectModel(Product.name) private readonly _ProductModel: Model<Product>,
        @Inject(ProductSearchSchema.name) private readonly _ProductSearchCollection: SearchModel<Product>,
    ) {
        super(_ProductModel);
        this._ModelChangeStream.on('change', async (e) => {
            await this._ProductSearchCollection.syncData(e);
        });
    }

    async importData(filename: string) {
        const jsonData = await CsvUtils.csvToJson(`./data/${filename}.csv`);

        const products = jsonData.map(
            (product): TProduct => ({
                name: _.get(product, 'name'),
                category: _.get(product, 'main_category'),
                subCategory: _.get(product, 'sub_category'),
                image: _.get(product, 'image'),
                link: _.get(product, 'link'),
                ratings: _.toNumber(_.get(product, 'ratings')) || 0,
                noOfRatings: _.toNumber(_.get(product, 'no_of_ratings')) || 0,
                discountPrice: _.toNumber(_.replace(_.get(product, 'discount_price'), /[^0-9.-]+/g, '')) || 0,
                actualPrice: _.toNumber(_.replace(_.get(product, 'actual_price'), /[^0-9.-]+/g, '')) || 0,
            }),
        );

        await this._ProductModel.deleteMany({ subCategory: filename });
        await this._ProductModel.insertMany(plainToInstance(Product, products));

        return new SuccessDto('Fake products successfully', HttpStatus.CREATED);
    }

    async readFileNames() {
        const filenames = fs.readdirSync('data').map((name) => name.replace(new RegExp(/.csv$/), ''));
        return new SuccessDto(null, HttpStatus.OK, filenames);
    }

    async searchProduct(pageOption: PageOptionsDto) {
        return this._ProductSearchCollection.documents.search({
            q: pageOption.search || '*',
            per_page: pageOption.take,
            page: pageOption.page,
            query_by: 'name,category,subCategory',
        });
    }
}
