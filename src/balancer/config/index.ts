import * as Settings from '@src/server/settings';
import { REPLICATION_FACTOR } from '../constants';

const ports = new Array<number>(REPLICATION_FACTOR)
  .fill(Settings.FIRST_INSTANCE_PORT)
  .map((port, index) => port + index);

export const config = {
  host: Settings.INTERNAL_HOST,
  ports,
  balancerHost: Settings.BALANCER_HOST,
  balancerPort: Settings.BALANCER_PORT,
  fullUrl: '',
  baseUrl: `http://${Settings.INTERNAL_HOST}`,
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
