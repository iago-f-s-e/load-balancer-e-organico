import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { InfraModule } from '@src/infra';
import { kafkaConnection } from '@src/infra/kafka/config';
import cors from 'cors';
import helmet from 'helmet';
import { APP_PORT } from './settings';

async function bootstrap(): Promise<INestApplication> {
  const app = await NestFactory.create(InfraModule);

  app.connectMicroservice(kafkaConnection);

  await app.startAllMicroservices();

  app.use(cors());
  app.use(helmet());

  return app.listen(APP_PORT, () => {
    console.log('===============================');
    console.log(`Server running on port: ${APP_PORT} =`);
    console.log('===============================');
  });
}

const server = { bootstrap };

export default server;
