import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Configuration } from '@/config/configuration';
import { DatabaseModule } from '@/database/database.module';
import { ProductModule } from '@/modules/product/product.module';
import { TypeSenseModule } from '@/modules/type-sense';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}`,
            isGlobal: true,
            load: [Configuration.init],
        }),
        DatabaseModule,
        TypeSenseModule.forRootSync({
            useFactory: () => Configuration.instance.typesense,
        }),
        ProductModule,
    ],
})
export class AppModule {}
