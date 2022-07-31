const SERVICE = process.env.SERVICE || '';

export const SERVICE_TOPIC = SERVICE.split('-')
  .map(slice => slice.toLowerCase())
  .join('_');

export const SERVICE_ID = process.env.SERVICE_ID || '0';
