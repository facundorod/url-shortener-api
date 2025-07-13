export interface EncrypterService {
  sign(text: string): Promise<string>;
  verify(token: string): Promise<string>;
}
