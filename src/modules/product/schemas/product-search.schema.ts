import { CollectionCreateSchema } from 'typesense/src/Typesense/Collections';

import { CollectionName } from '@/modules/product/schemas/collection-name';

export const ProductSearchSchema: CollectionCreateSchema = {
    name: CollectionName,
    fields: [
        {
            name: 'id',
            type: 'string',
            facet: false,
        },
        {
            name: 'name',
            type: 'string',
            facet: false,
        },
        {
            name: 'category',
            type: 'string',
            facet: false,
        },
        {
            name: 'subCategory',
            type: 'string',
            facet: false,
        },
        {
            name: 'image',
            type: 'string',
            index: false,
        },
        {
            name: 'link',
            type: 'string',
            index: false,
        },
        {
            name: 'ratings',
            type: 'float',
            facet: true,
        },
        {
            name: 'noOfRatings',
            type: 'int32',
            facet: true,
        },
        {
            name: 'discountPrice',
            type: 'float',
            facet: true,
        },
        {
            name: 'actualPrice',
            type: 'float',
            facet: true,
        },
    ],
};
