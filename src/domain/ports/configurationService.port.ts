export interface ConfigurationService {
  getRedisHost(): string;
  getRedisPort(): number;
  getDomain(): string;
  getIncrementKey(): string;
  getDatabaseUrl(): string;
}
