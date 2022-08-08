export const BALANCER_HOST = '0.0.0.0';

export const INTERNAL_HOST = 'host.docker.internal';

export const BALANCER_PORT = Number(process.env.PORT) ?? 8080;

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
