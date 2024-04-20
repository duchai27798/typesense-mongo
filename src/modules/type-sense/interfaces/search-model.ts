import { Document } from 'bson';
import { ChangeStreamDocument } from 'mongodb';

export interface SearchModel<TSchema extends Document = Document> {
    syncData(record: ChangeStreamDocument<TSchema>): Promise<void>;
}
