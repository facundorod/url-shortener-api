export interface EncrypterService {
  sign(key: object): Promise<string>;
  verify(token: string): Promise<object>;
}
