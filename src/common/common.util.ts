import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';

@Injectable()
export class CommonUtil {
    constructor(private readonly configService: ConfigService) {}

    async hashPassword(password: string): Promise<string> {
        const bcryptRound = Number(
            this.configService.get<number>('BCRYPT_ROUNDS', 12),
        );
        return await hash(password, bcryptRound);
    }

    async comparePassword(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await compare(password, hashedPassword);
    }
}
