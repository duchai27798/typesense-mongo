import { Logger } from '@nestjs/common';
import { Client } from 'typesense';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';

export class TypeSenseCoreSync {
    constructor(options: ConfigurationOptions) {
        const _TypeSenseClient: Client = new Client(options);
        return _TypeSenseClient.health
            .retrieve()
            .then((rs) => {
                Logger.log(`TypeSenseClient health check: ${rs.ok}`);
                return _TypeSenseClient;
            })
            .catch((err) => {
                Logger.error(`TypeSenseClient: ${err.errors}`);
                return null;
            });
    }
}
