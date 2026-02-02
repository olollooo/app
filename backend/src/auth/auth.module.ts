import { Module } from '@nestjs/common';
import { RequiredUserGuard } from './required-user.guard';
import { OptionalUserGuard } from './optional-user.guard';

@Module({
  providers: [RequiredUserGuard, OptionalUserGuard],
  exports: [RequiredUserGuard, OptionalUserGuard],
})
export class AuthModule {}
