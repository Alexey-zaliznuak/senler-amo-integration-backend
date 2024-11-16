import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './domain/auth/auth.module';
// import { IntegrationModule } from './domain/integration/integration.module';
// import { WebhooksModule } from './domain/integration/webhooks/webhooks.module';
import { AmoCrmModule } from './external/amo-crm/amo-crm.module';
import { SenlerService } from './external/senler/senler.service';
import { AuthGuard } from './infrastructure/auth/auth.guard';
import { AxiosModule } from './infrastructure/axios/axios.module';
import { AppConfig, appConfigValidationSchema } from './infrastructure/config';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import { ProcessTimeInterceptor } from './infrastructure/interceptors';
import { DEFAULT_LOGGING_OPTIONS } from './infrastructure/logging/logging.config';
import { LoggingInterceptor } from './infrastructure/logging/logging.interceptor';
import { LoggingModule } from './infrastructure/logging/logging.module';
import { RequestLoggerMiddleware } from './infrastructure/logging/request-logger.middleware';
import { RequestIdMiddleware } from './infrastructure/middlewares';


@Module({
  imports: [
    LoggingModule.forRoot(DEFAULT_LOGGING_OPTIONS),

    // Resources
    AuthModule,
    // IntegrationModule,
    // WebhooksModule,

    // External services
    AmoCrmModule,

    // Infrastructure modules
    // AxiosModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig,],
      validationSchema: appConfigValidationSchema,
    }),
  ],

  controllers: [
    AppController
  ],

  providers: [
    AppService,

    SenlerService,

    { provide: APP_GUARD, useClass: AuthGuard, },

    { provide: APP_FILTER, useClass: HttpExceptionFilter, },

    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor, },
    { provide: APP_INTERCEPTOR, useClass: ProcessTimeInterceptor, },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        RequestIdMiddleware,
        RequestLoggerMiddleware,
      )
      .forRoutes("*");
  }
}
