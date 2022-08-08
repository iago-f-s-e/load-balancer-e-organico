import { Module } from '@nestjs/common';
import { RedisModule } from './redis';

@Module({
  imports: [RedisModule],
  exports: [RedisModule]
})
export class InfraModule {}
