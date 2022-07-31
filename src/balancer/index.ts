import 'dotenv/config';
import { RedisService } from '@src/infra/redis/services';

import http from 'http';
import fetch from 'node-fetch';

import { config } from './config';

const alreadyBeenCalled = async (port: number) => {
  const cache = new RedisService();
  const key = `PORT=${port}`;

  const portInUse = await cache.get<number>(key);

  return !!portInUse;
};

const toBalancer = (req: http.IncomingMessage, res: http.ServerResponse, request: any) => { // eslint-disable-line 
  const connector = http.request(request, resp => resp.pipe(res));

  return req.pipe(connector);
};

const balanceOrRetry = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  retryCount: number,
  countToQueue: number
): Promise<any> => { // eslint-disable-line 

  const multiplier = 10;
  const equalAttempts = config.ports.length * config.ports.length;
  const retryMax = equalAttempts * multiplier;
  const serverIsNotAvailable = retryCount >= retryMax;

  if (serverIsNotAvailable) {
    res.statusCode = 503;
    res.statusMessage = 'Server is not available';

    res.end('Server is not available, please try again later');

    return;
  }

  const port = config.getPort();

  const request = {
    host: config.host,
    port,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const portAlreadyBeenCalled = await alreadyBeenCalled(port);

  if (portAlreadyBeenCalled) {
    const lastTryBeforeInsertInTheQueue = (multiplier - 2) * multiplier;
    const canInsertInTheQueue = countToQueue >= lastTryBeforeInsertInTheQueue;

    if (canInsertInTheQueue) return toBalancer(req, res, request);

    return balanceOrRetry(req, res, retryCount, countToQueue + 1);
  }

  fetch(`${config.fullUrl}/ping`)
    .then(() => toBalancer(req, res, request))
    .catch(() => balanceOrRetry(req, res, retryCount + 1, countToQueue));
};

const bootstrap = (): void => {
  const balancer = http.createServer();

  balancer.listen(config.balancerPort, config.balancerHost, () => {
    console.log('======================================');
    console.log(`Load Balancer running on port: ${config.balancerPort} =`);
    console.log('======================================');
  });

  balancer.on('request', (req, res) => {
    const isPing = config.isPing(req.url || '');

    if (isPing) {
      res.statusCode = 200;
      res.statusMessage = 'OK';

      res.end('OK');
      return;
    }

    const initialRetryCount = 0;
    const initialCountToQueue = 0;

    balanceOrRetry(req, res, initialRetryCount, initialCountToQueue);
  });
};

const balancer = { bootstrap };

export default balancer;
