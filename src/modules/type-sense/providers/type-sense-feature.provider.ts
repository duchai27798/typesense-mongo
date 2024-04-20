import { Provider } from '@nestjs/common';
import { Document } from 'bson';
import { Client } from 'typesense';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

import { TYPE_SENSE_CLIENT } from '@/modules/type-sense/constants';
import { TypeSenseFeature } from '@/modules/type-sense/providers/type-sense-feature';

export function TypeSenseFeatureProvider<TSchema extends Document = Document>(
    schema: CollectionCreateSchema,
): Provider[] {
    return [
        {
            provide: schema.name,
            inject: [TYPE_SENSE_CLIENT],
            useFactory: (client: Client) => new TypeSenseFeature<TSchema>(client, schema),
        },
    ];
}
