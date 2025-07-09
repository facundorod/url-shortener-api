export class Base62Util {
  static generateBase62(number: number): string {
    const base62 =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    while (number > 0) {
      result = base62[number % 62] + result;
      number = Math.floor(number / 62);
    }
    return result;
  }
}
