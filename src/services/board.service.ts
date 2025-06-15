import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Board } from '../entities/board.entity';
import { Comment } from '../entities/comment.entity';
import { ERROR_CODES, ERROR_MESSAGES, SEARCH_TYPE } from '../common/constants';
import {
    BoardContentUpdateRequest,
    BoardCreateRequest,
    BoardDeleteRequest,
    BoardTitleUpdateRequest,
    CommentCreateRequest,
} from '../dto/board.dto';
import { CommonUtil } from '../common/common.util';
import { KeywordAlert } from '../entities/keyword-alert.entity';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        private readonly commonUtil: CommonUtil,
        @InjectRepository(KeywordAlert)
        private readonly keywordAlertRepository: Repository<KeywordAlert>,
    ) {}

    async getBoardList(
        searchType: (typeof SEARCH_TYPE)[keyof typeof SEARCH_TYPE],
        searchValue: string,
        page: number = 1,
    ): Promise<{ dbBoards: Board[]; currentPage: number; totalPages: number }> {
        const take = 10;
        const skip = (page - 1) * take;

        let where = {};
        if (searchValue) {
            if (searchType === SEARCH_TYPE.AUTHOR)
                where = { author: searchValue };
            else if (searchType === SEARCH_TYPE.TITLE)
                where = { title: Like(`%${searchValue}%`) };
        }

        const [dbBoards, total] = await this.boardRepository.findAndCount({
            where,
            order: {
                createdAt: 'DESC',
            },
            take,
            skip,
        });

        return {
            dbBoards,
            currentPage: page,
            totalPages: Math.ceil(total / take),
        };
    }

    async getBoardDetail(id: number): Promise<Board & { comments: Comment[] }> {
        const dbBoard = await this.boardRepository.findOne({
            select: {
                id: true,
                title: true,
                content: true,
                author: true,
                commentCount: true,
                createdAt: true,
                updatedAt: true,
            },
            where: { id },
        });

        if (!dbBoard) {
            throw new NotFoundException({
                code: ERROR_CODES.ID_NOT_FOUND,
                message: ERROR_MESSAGES[ERROR_CODES.ID_NOT_FOUND],
            });
        }

        const dbComments = await this.commentRepository.find({
            select: {
                id: true,
                boardId: true,
                parentCommentId: true,
                author: true,
                content: true,
                createdAt: true,
            },
            where: { boardId: id },
            order: { createdAt: 'ASC' },
        });

        return {
            ...dbBoard,
            comments: dbComments,
        };
    }

    async createBoard(board: BoardCreateRequest): Promise<Board> {
        const hashedPassword = await this.commonUtil.hashPassword(
            board.password,
        );
        const newBoard = await this.boardRepository.save({
            ...board,
            password: hashedPassword,
        });

        await Promise.all([
            this.sendKeywordAlert(board.title, 1),
            this.sendKeywordAlert(board.author, 2),
            this.sendKeywordAlert(board.content, 3),
        ]);

        const { password, ...responseBoard } = newBoard;
        return responseBoard as Board;
    }

    async updateBoardTitle(board: BoardTitleUpdateRequest): Promise<Board> {
        const dbBoard = await this.boardRepository.findOne({
            where: { id: board.id },
        });
        if (!dbBoard) {
            throw new NotFoundException({
                code: ERROR_CODES.ID_NOT_FOUND,
                message: ERROR_MESSAGES[ERROR_CODES.ID_NOT_FOUND],
            });
        }

        const isPasswordValid = await this.commonUtil.comparePassword(
            board.password,
            dbBoard.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException({
                code: ERROR_CODES.PASSWORD_MISMATCH,
                message: ERROR_MESSAGES[ERROR_CODES.PASSWORD_MISMATCH],
            });
        }

        dbBoard.title = board.title;
        const updatedBoard = await this.boardRepository.save(dbBoard);
        const { password, ...responseBoard } = updatedBoard;
        return responseBoard as Board;
    }

    async updateBoardContent(board: BoardContentUpdateRequest): Promise<Board> {
        const dbBoard = await this.boardRepository.findOne({
            where: { id: board.id },
        });
        if (!dbBoard) {
            throw new NotFoundException({
                code: ERROR_CODES.ID_NOT_FOUND,
                message: ERROR_MESSAGES[ERROR_CODES.ID_NOT_FOUND],
            });
        }

        const isPasswordValid = await this.commonUtil.comparePassword(
            board.password,
            dbBoard.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException({
                code: ERROR_CODES.PASSWORD_MISMATCH,
                message: ERROR_MESSAGES[ERROR_CODES.PASSWORD_MISMATCH],
            });
        }

        dbBoard.content = board.content;
        const updatedBoard = await this.boardRepository.save(dbBoard);
        const { password, ...responseBoard } = updatedBoard;
        return responseBoard as Board;
    }

    async deleteBoard(board: BoardDeleteRequest): Promise<void> {
        const dbBoard = await this.boardRepository.findOne({
            where: { id: board.id },
        });
        if (!dbBoard) {
            throw new NotFoundException({
                code: ERROR_CODES.ID_NOT_FOUND,
                message: ERROR_MESSAGES[ERROR_CODES.ID_NOT_FOUND],
            });
        }

        const isPasswordValid = await this.commonUtil.comparePassword(
            board.password,
            dbBoard.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException({
                code: ERROR_CODES.PASSWORD_MISMATCH,
                message: ERROR_MESSAGES[ERROR_CODES.PASSWORD_MISMATCH],
            });
        }

        await this.boardRepository.manager.transaction(async (transaction) => {
            await transaction.delete(Board, { id: board.id });
            await transaction.delete(Comment, { boardId: board.id });
        });
    }

    async createComment(comment: CommentCreateRequest): Promise<Comment> {
        const dbBoard = await this.boardRepository.findOne({
            where: { id: comment.boardId },
        });

        if (!dbBoard) {
            throw new NotFoundException({
                code: ERROR_CODES.ID_NOT_FOUND,
                message: ERROR_MESSAGES[ERROR_CODES.ID_NOT_FOUND],
            });
        }

        if (comment.password.length < 4) {
            throw new UnauthorizedException({
                code: ERROR_CODES.PASSWORD_INVALID,
                message: ERROR_MESSAGES[ERROR_CODES.PASSWORD_INVALID],
            });
        }

        if (comment.author.length > 100) {
            throw new UnauthorizedException({
                code: ERROR_CODES.AUTHOR_INVALID,
                message: ERROR_MESSAGES[ERROR_CODES.AUTHOR_INVALID],
            });
        }

        if (comment.parentCommentId) {
            const dbParentComment = await this.commentRepository.findOne({
                where: { id: comment.parentCommentId },
            });

            if (!dbParentComment) {
                throw new NotFoundException({
                    code: ERROR_CODES.COMMENT_ID_NOT_FOUND,
                    message: ERROR_MESSAGES[ERROR_CODES.COMMENT_ID_NOT_FOUND],
                });
            }
        }

        const hashedPassword = await this.commonUtil.hashPassword(
            comment.password,
        );

        const responseComment =
            await this.commentRepository.manager.transaction(
                async (transaction) => {
                    const dbComment = await transaction.save(Comment, {
                        boardId: comment.boardId,
                        parentCommentId: comment.parentCommentId ?? 0,
                        author: comment.author,
                        password: hashedPassword,
                        content: comment.content,
                    });

                    await transaction.increment(
                        Board,
                        { id: comment.boardId },
                        'commentCount',
                        1,
                    );

                    const { password, ...responseComment } = dbComment;
                    return responseComment as Comment;
                },
            );

        await Promise.all([
            this.sendKeywordAlert(comment.author, 4),
            this.sendKeywordAlert(comment.content, 5),
        ]);

        return responseComment;
    }

    // 키워드는 인당 10개로 제한
    // 카프카, 레디스 또는 레빗MQ 메세지큐로 구현
    // 구독하고 있는 모든 클라이언트에 토픽 발행
    // 구독: KeywordAlert 테이블의 keyword, keywordType 기준
    async sendKeywordAlert(
        keyword: string,
        keywordType: number,
    ): Promise<void> {
        console.log('sendKeywordAlert: ', keywordType, keyword);
    }
}
