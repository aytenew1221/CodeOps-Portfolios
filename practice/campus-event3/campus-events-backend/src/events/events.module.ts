import { Module } from '@nestjs/common';

import { EventsController } from './events.controller';
import { EventsService } from './events.service';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { TimingInterceptor } from '../common/interceptors/timing.interceptor';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [EventsController],
  providers: [EventsService, ApiKeyGuard, TimingInterceptor],
})
export class EventsModule {}
