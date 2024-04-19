import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChangeStreamDocument } from 'mongodb';
import { Client } from 'typesense';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';

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
        const isExited = await this._TypeSenseClient.collections(schema.name).exists();

        if (isExited) {
            await this._TypeSenseClient.collections(schema.name).delete();
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
