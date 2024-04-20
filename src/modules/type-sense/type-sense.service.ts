import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChangeStreamDocument } from 'mongodb';
import { Client } from 'typesense';
import { CollectionFieldSchema } from 'typesense/lib/Typesense/Collection';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';
import { CollectionDropFieldSchema } from 'typesense/src/Typesense/Collection';

import { TYPE_SENSE_OPTIONS } from '@/modules/type-sense/constants';

@Injectable()
export class TypeSenseService {
    private static _TypeSenseClient: Client;

    static async init(@Inject(TYPE_SENSE_OPTIONS) options: ConfigurationOptions) {
        this._TypeSenseClient = new Client(options);
        await this._TypeSenseClient.health
            .retrieve()
            .then((rs) => {
                Logger.log(`TypeSenseClient health check: ${rs.ok}`);
            })
            .catch((err) => {
                Logger.error(`TypeSenseClient: ${err.errors}`);
            });
        return this._TypeSenseClient;
    }

    static async register(schema: CollectionCreateSchema) {
        const collection = this._TypeSenseClient.collections(schema.name);

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
                await this._TypeSenseClient.collections(schema.name).update({
                    fields: [...newFields, ...deletedFields],
                });
            }
            return;
        }

        await this._TypeSenseClient.collections().create(schema);
    }

    static async syncData(schemaName: string, record: ChangeStreamDocument) {
        const collection = this._TypeSenseClient.collections(schemaName);
        switch (record.operationType) {
            case 'delete':
                return collection.documents(record.documentKey._id.toString()).delete();
            case 'update':
                return collection
                    .documents(record.documentKey._id.toString())
                    .update(record.updateDescription.updatedFields);
            case 'insert':
                const { _id, ...data } = record.fullDocument;
                return collection.documents().upsert({
                    id: _id.toString(),
                    ...data,
                });
        }
    }
}
