import { OnApplicationShutdown } from '@nestjs/common';
import { Document } from 'bson';
import { ChangeStream, ChangeStreamDocument } from 'mongodb';
import { Model } from 'mongoose';

export class ChangeStreamService<TSchema extends Document = Document> implements OnApplicationShutdown {
    protected readonly _ModelChangeStream: ChangeStream<TSchema, ChangeStreamDocument<TSchema>>;

    constructor(_Model: Model<TSchema>) {
        this._ModelChangeStream = _Model.watch<TSchema>();
    }

    async onApplicationShutdown() {
        if (this._ModelChangeStream) {
            await this._ModelChangeStream.close();
        }
    }
}
