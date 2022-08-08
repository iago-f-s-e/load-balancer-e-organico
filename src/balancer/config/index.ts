import * as Config from '@src/config';
import { REPLICATION_FACTOR } from '../constants';

const ports = new Array<number>(REPLICATION_FACTOR)
  .fill(Config.FIRST_INSTANCE_PORT)
  .map((port, index) => port + index);

export const config = {
  host: Config.INTERNAL_HOST,
  ports,
  balancerHost: Config.BALANCER_HOST,
  balancerPort: Config.BALANCER_PORT,
  fullUrl: '',
  baseUrl: `http://${Config.INTERNAL_HOST}`,
  currentServerPortIndex: 0,
  getPort: (): number => {
    const firstPortIndex = 0;
    const lastPortIndex = config.ports.length - 1;

    const cantIncreaseServerPort = config.currentServerPortIndex < lastPortIndex;

    const nextPortIndex = cantIncreaseServerPort
      ? config.currentServerPortIndex + 1
      : firstPortIndex;

    const port = config.ports[nextPortIndex];

    config.currentServerPortIndex = nextPortIndex;

    config.fullUrl = `${config.baseUrl}:${port}`;

    return config.ports[nextPortIndex];
  },
  isPing: (url: string): boolean => url.startsWith('/ping')
};
