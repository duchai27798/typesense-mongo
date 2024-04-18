import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { Configuration } from '@/config/configuration';
import { ENV_MODE } from '@/constants';

@Injectable()
export class MongoDatabase implements MongooseOptionsFactory {
    createMongooseOptions(): MongooseModuleOptions {
        const mongoEnv = Configuration.instance.mongo;
        const urlConnection = `mongodb://${mongoEnv.host}:${mongoEnv.port}/${mongoEnv.databaseName}`;
        if (Configuration.instance.env !== ENV_MODE.PRO) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }
        return {
            uri: urlConnection,
            maxPoolSize: 100,
            authSource: mongoEnv.authSource,
            user: mongoEnv.username,
            pass: mongoEnv.password,
        };
    }
}
