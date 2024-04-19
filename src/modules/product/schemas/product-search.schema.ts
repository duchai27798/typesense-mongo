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
            name: 'price',
            type: 'float',
            facet: true,
        },
        {
            name: 'description',
            type: 'string',
            facet: false,
        },
        {
            name: 'adjective',
            type: 'string',
            facet: false,
        },
        {
            name: 'material',
            type: 'string',
            facet: false,
        },
    ],
};
