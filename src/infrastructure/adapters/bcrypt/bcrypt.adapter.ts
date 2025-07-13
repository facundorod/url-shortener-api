import { ConfigurationService } from '@/domain/ports/configurationService.port';
import { HashService } from '@/domain/ports/hashService.port';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BCryptService implements HashService {
  constructor(private readonly configService: ConfigurationService) {}
  async hash(password: string): Promise<string> {
    const saltValue = this.configService.getSaltValue();
    const generatedSalt = await bcrypt.genSalt(+saltValue);
    return bcrypt.hash(password, generatedSalt);
  }

  compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
