import { Provider } from '@nestjs/common';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';

import { TYPE_SENSE_CLIENT, TYPE_SENSE_OPTIONS } from '@/modules/type-sense/constants';
import { TypeSenseCoreSync } from '@/modules/type-sense/providers/type-sense-core-sync';
import { TypeSenseSyncOptions } from '@/modules/type-sense/types';

export const TypeSenseCoreSyncProvider = (options: TypeSenseSyncOptions): Provider[] => [
    {
        provide: TYPE_SENSE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
    },
    {
        inject: [TYPE_SENSE_OPTIONS],
        provide: TYPE_SENSE_CLIENT,
        useFactory: (options: ConfigurationOptions) => new TypeSenseCoreSync(options),
    },
];
