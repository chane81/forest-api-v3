// config 들
const env = {
  SERVER_PORT: process.env.SERVER_PORT || 4000,
  DB_SERVER: process.env.DB_SERVER || '',
  DB_NAME: process.env.DB_NAME || '',
  DB_USER: process.env.DB_USER || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_INSTANCE_NAME: process.env.DB_INSTANCE_NAME || '',
  DB_PORT: Number(process.env.DB_PORT) || 1433,
  SESSION_EXPIRES: Number(process.env.SESSION_EXPIRES) || 86400000,
  SESSION_SECRET: process.env.SESSION_SECRET || '',
  SESSION_NAME: process.env.SESSION_NAME || '',
  SESSION_TABLE: process.env.SESSION_TABLE || '',
  SESSION_DOMAIN: process.env.SESSION_DOMAIN || '',
  ORIGIN_URL: process.env.ORIGIN_URL || '',
  S3_BUCKET: process.env.S3_BUCKET || '',
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY || '',
  S3_SECRET_KEY: process.env.S3_SECRET_KEY || '',
  S3_REGION: process.env.S3_REGION || ''
};

export default env;
