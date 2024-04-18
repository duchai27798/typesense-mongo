import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

import { TYPE_SENSE_CLIENT } from '@/modules/type-sense/constants';
import { TypeSenseClientSyncProvider } from '@/modules/type-sense/providers';
import { TypeSenseService } from '@/modules/type-sense/type-sense.service';
import { TypeSenseSyncOptions } from '@/modules/type-sense/types';

@Global()
@Module({})
export class TypeSenseModule {
    static forRootSync(options: TypeSenseSyncOptions): DynamicModule {
        const provider: Provider[] = TypeSenseClientSyncProvider(options);
        return {
            module: TypeSenseModule,
            imports: options.imports,
            providers: provider,
            exports: provider,
        };
    }
    static forFeature(schema: CollectionCreateSchema): DynamicModule {
        const provider: Provider[] = [
            {
                provide: schema.name,
                inject: [TYPE_SENSE_CLIENT],
                useFactory: () => TypeSenseService.register(schema),
            },
        ];
        return {
            module: TypeSenseModule,
            providers: provider,
            exports: provider,
        };
    }
}
