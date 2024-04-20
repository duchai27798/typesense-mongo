import { Document } from 'bson';
import { ChangeStreamDocument } from 'mongodb';
import { Client } from 'typesense';
import Collection, { CollectionFieldSchema } from 'typesense/lib/Typesense/Collection';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { CollectionDropFieldSchema } from 'typesense/src/Typesense/Collection';

import { SearchModel } from '@/modules/type-sense/interfaces';

export class TypeSenseFeature<TSchema extends Document = Document> implements SearchModel<TSchema> {
    private _Collection: Collection<TSchema>;

    constructor(client: Client, schema: CollectionCreateSchema) {
        this.register(client, schema);
    }

    private async register(client: Client, schema: CollectionCreateSchema) {
        const collection = client.collections<TSchema>(schema.name);

        if (await collection.exists()) {
            const updatedFieldNames = schema.fields.map((fields) => fields.name);
            const existedFields = (await collection.retrieve()).fields;
            const existedFieldNames = existedFields.map((fields) => fields.name);
            const deletedFields: CollectionDropFieldSchema[] = existedFields
                .filter((field) => !updatedFieldNames.includes(field.name) && field.name !== 'id')
                .map((field) => ({ name: field.name, drop: true }));
            const newFields: CollectionFieldSchema[] = schema.fields.filter(
                (field) => !existedFieldNames.includes(field.name) && field.name !== 'id',
            );

            if (deletedFields?.length || newFields?.length) {
                await collection.update({
                    fields: [...newFields, ...deletedFields],
                });
            }
        } else {
            await client.collections().create(schema);
        }
        this._Collection = client.collections<TSchema>(schema.name);
    }

    async syncData(record: ChangeStreamDocument<TSchema>) {
        switch (record.operationType) {
            case 'delete':
                await this._Collection.documents(record.documentKey._id.toString()).delete();
                break;
            case 'update':
                await this._Collection
                    .documents(record.documentKey._id.toString())
                    .update(record.updateDescription.updatedFields);
                break;
            case 'insert':
                await this._Collection.documents().upsert(record.fullDocument);
        }
    }
}
