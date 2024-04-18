import { ENV_MODE } from '@/constants';
import { TConfig } from '@/types';

export class Configuration {
    private static _config: TConfig;

    static init(): TConfig {
        if (!Configuration._config) {
            const envMode = (process.env['NODE_ENV'] as ENV_MODE) || ENV_MODE.DEV;
            Configuration._config = {
                env: envMode,
                port: parseInt(process.env['API_PORT'], 10),
                mongo: {
                    host: process.env['MONGO_HOST'],
                    port: parseInt(process.env['MONGO_PORT'], 10),
                    username: process.env['MONGO_USERNAME'],
                    password: process.env['MONGO_PASSWORD'],
                    databaseName: process.env['MONGO_BD_NAME'],
                    authSource: 'admin',
                },
            };
        }
        return Configuration._config;
    }

    static get instance(): TConfig {
        return Configuration._config;
    }
}
