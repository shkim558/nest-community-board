import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('Board')
export class Board {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ length: 200 })
    @Index('idx_title')
    title: string;

    @Column({ length: 100 })
    @Index('idx_author')
    author: string;

    @Column({ length: 255 })
    @Index('idx_password')
    password: string;

    @Column('mediumtext')
    content: string;

    @Column({ type: 'int', default: 0 })
    commentCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
