import { Provider } from '@nestjs/common';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';

import { TYPE_SENSE_CLIENT, TYPE_SENSE_OPTIONS } from '@/modules/type-sense/constants';
import { TypeSenseService } from '@/modules/type-sense/type-sense.service';
import { TypeSenseSyncOptions } from '@/modules/type-sense/types';

export const TypeSenseClientSyncProvider = (options: TypeSenseSyncOptions): Provider[] => [
    {
        provide: TYPE_SENSE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
    },
    {
        inject: [TYPE_SENSE_OPTIONS],
        provide: TYPE_SENSE_CLIENT,
        useFactory: (options: ConfigurationOptions) => TypeSenseService.init(options),
    },
];
