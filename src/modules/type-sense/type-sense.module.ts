import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Document } from 'bson';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

import { TypeSenseFeatureProvider } from '@/modules/type-sense/providers/type-sense-feature.provider';
import { TypeSenseCoreModule } from '@/modules/type-sense/type-sense-core.module';
import { TypeSenseSyncOptions } from '@/modules/type-sense/types';

@Module({})
export class TypeSenseModule {
    static forRootSync(options: TypeSenseSyncOptions): DynamicModule {
        return {
            module: TypeSenseModule,
            imports: [TypeSenseCoreModule.forRootSync(options)],
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
