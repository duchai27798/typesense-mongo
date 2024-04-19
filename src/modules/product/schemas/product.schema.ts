import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { AbstractSchema } from '@/database/schemas/abstract.schema';
import { CollectionName } from '@/modules/product/schemas/collection-name';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ collection: CollectionName })
export class Product extends AbstractSchema {
    @Prop({ trim: true, required: true })
    name: string;

    @Prop({ trim: true, required: true })
    price: number;

    @Prop({ trim: true })
    description: string;

    @Prop({ trim: true })
    adjective: string;

    @Prop({ trim: true })
    material: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
