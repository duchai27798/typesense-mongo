import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { Document } from 'bson';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

import { TypeSenseCoreSyncProvider } from '@/modules/type-sense/providers';
import { TypeSenseFeatureProvider } from '@/modules/type-sense/providers/type-sense-feature.provider';
import { TypeSenseSyncOptions } from '@/modules/type-sense/types';

@Global()
@Module({})
export class TypeSenseModule {
    static forRootSync(options: TypeSenseSyncOptions): DynamicModule {
        const provider: Provider[] = TypeSenseCoreSyncProvider(options);
        return {
            module: TypeSenseModule,
            imports: options.imports,
            providers: provider,
            exports: provider,
        };
    }
    static forFeature<TSchema extends Document = Document>(schema: CollectionCreateSchema): DynamicModule {
        const provider: Provider[] = TypeSenseFeatureProvider<TSchema>(schema);
        return {
            module: TypeSenseModule,
            providers: provider,
            exports: provider,
        };
    }
}
