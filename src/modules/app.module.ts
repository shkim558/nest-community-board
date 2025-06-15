import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from '../controllers/board.controller';
import { BoardService } from '../services/board.service';
import { Board } from '../entities/board.entity';
import { Comment } from '../entities/comment.entity';
import { CommonUtil } from '../common/common.util';
import { KeywordAlert } from '../entities/keyword-alert.entity';
import { DefaultController } from '../controllers/default.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}`,
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST', 'localhost'),
                port: configService.get<number>('DB_PORT', 3306),
                username: configService.get('DB_USERNAME', 'test'),
                password: configService.get('DB_PASSWORD', 'test'),
                database: configService.get('DB_DATABASE', 'board'),
                entities: [Board, Comment, KeywordAlert],
                synchronize: configService.get<boolean>('DB_SYNC', true),
                charset: 'utf8mb4',
                collation: 'utf8mb4_bin',
            }),
        }),
        TypeOrmModule.forFeature([Board, Comment, KeywordAlert]),
    ],
    controllers: [BoardController, DefaultController],
    providers: [BoardService, CommonUtil],
})
export class AppModule {}
