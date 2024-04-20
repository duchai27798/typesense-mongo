import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import { TypeSenseCoreSyncProvider } from '@/modules/type-sense/providers';
import { TypeSenseSyncOptions } from '@/modules/type-sense/types';

@Global()
@Module({})
export class TypeSenseCoreModule {
    static forRootSync(options: TypeSenseSyncOptions): DynamicModule {
        const provider: Provider[] = TypeSenseCoreSyncProvider(options);
        return {
            module: TypeSenseCoreModule,
            imports: options.imports,
            providers: provider,
            exports: provider,
        };
    }
}
