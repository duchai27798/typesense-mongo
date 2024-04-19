import { CollectionCreateSchema } from 'typesense/src/Typesense/Collections';

import { CollectionName } from '@/modules/product/schemas/collection-name';

export const ProductSearchSchema: CollectionCreateSchema = {
    name: CollectionName,
    fields: [
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'price',
            type: 'float',
        },
        {
            name: 'description',
            type: 'string',
        },
        {
            name: 'adjective',
            type: 'string',
        },
        {
            name: 'material',
            type: 'string',
        },
    ],
};
