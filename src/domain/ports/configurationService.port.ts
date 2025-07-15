export interface ConfigurationService {
  getAppEnv(): string;
  getRedisHost(): string;
  getRedisPort(): number;
  getDomain(): string;
  getIncrementKey(): string;
  getDatabaseUrl(): string;
  getSaltValue(): string;
  getJwtSecret(): string;
  getJwtExpiresIn(): string;
  getFrontendUrl(): string;
}
