import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { Configuration } from '@/config/configuration';
import { ENV_MODE } from '@/constants';
import { LoggerServerHelper } from '@/helpers';
import { setupSwagger } from '@/setup-swagger';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    // init logger
    LoggerServerHelper.init();
    app.useLogger(LoggerServerHelper.instance);

    // apply http logger
    app.use(LoggerServerHelper.morganMiddleware);

    // validate input before jump into controller
    app.useGlobalPipes(new ValidationPipe());

    if (Configuration.instance.env !== ENV_MODE.PRO) {
        setupSwagger(app);
    }

    await app.listen(Configuration.instance.port);
}

bootstrap().then(() => {
    LoggerServerHelper.log(`Server running at: http://localhost:${Configuration.instance.port}`);
});
