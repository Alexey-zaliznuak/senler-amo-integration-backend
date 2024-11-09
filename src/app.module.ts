import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import { DEFAULT_LOGGING_OPTIONS } from './infrastructure/logging/logging.config';
import { LoggingModule } from './infrastructure/logging/logging.module';
import { AuthGuard } from './infrastructure/auth/auth.guard';
import { RequestIdMiddleware } from './infrastructure/middlewares';
import { RequestLoggerMiddleware } from './infrastructure/logging/request-logger.middleware';
import { ProcessTimeInterceptor } from './infrastructure/interceptors';
import { LoggingInterceptor } from './infrastructure/logging/logging.interceptor';
import { UsersModule } from './domain/users/users.module';
import { AmoCrmService } from './external/amo-crm/amo-crm.service';
import { AmoCrmModule } from './external/amo-crm/amo-crm.module';
import { AxiosModule } from './infrastructure/axios/axios.module';
import { IntegrationModule } from './domain/integration/integration.module';
import { ConfigModule } from '@nestjs/config';
import { SenlerService } from './external/senler/senler.service';
import { WebhooksModule } from './domain/integration/webhooks/webhooks.module';


@Module({
  imports: [
    // Resources
    UsersModule,
    IntegrationModule,
    WebhooksModule,

    // External services
    AmoCrmModule,

    // Infrastructure modules
    LoggingModule.forRoot(DEFAULT_LOGGING_OPTIONS),
    AxiosModule.forRoot(),

    ConfigModule.forRoot({isGlobal: true,}),
  ],

  controllers: [
    AppController
  ],

  providers: [
    AppService,

    // AmoCrmService,
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
