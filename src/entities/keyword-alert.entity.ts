import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Entity('KeywordAlert')
@Index(['author', 'keywordType', 'keyword'])
export class KeywordAlert {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ length: 100 })
    author: string;

    @Column({
        type: 'int',
        comment:
            '1: 게시글 제목, 2: 게시글 작성자, 3: 게시글 내용, 4: 댓글 작성자, 5: 댓글 내용',
    })
    keywordType: number;

    @Column({ length: 100 })
    keyword: string;

    @CreateDateColumn()
    createdAt: Date;
}
