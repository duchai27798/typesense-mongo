import { Inject, Injectable, Logger } from '@nestjs/common';
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
        const isExited = this._TypeSenseClient.collections(schema.name).exists();

        if (!isExited) {
            await this._TypeSenseClient.collections().create(schema);
        }
    }
}
