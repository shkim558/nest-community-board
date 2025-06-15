import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Entity('Comments')
export class Comment {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'bigint' })
    @Index('idx_board_id')
    boardId: number;

    @Column({ type: 'bigint' })
    @Index('idx_parent_comment_id')
    parentCommentId: number;

    @Column({ length: 100 })
    @Index('idx_author')
    author: string;

    @Column({ length: 255 })
    @Index('idx_password')
    password: string;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;

    @Column('mediumtext')
    content: string;

    @CreateDateColumn()
    createdAt: Date;
}
