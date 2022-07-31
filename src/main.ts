import 'dotenv/config';

import server from './server';
import balancer from './balancer';

balancer.bootstrap();
server.bootstrap();
