import { Module } from '@nestjs/common';
import { ContainerModule } from './container';
import { KafkaModule } from './kafka';
import { RedisModule } from './redis';

@Module({
  imports: [RedisModule, KafkaModule, ContainerModule],
  exports: [RedisModule, KafkaModule, ContainerModule]
})
export class InfraModule {}
