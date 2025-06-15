import {
    Controller,
    Body,
    Post,
    Get,
    Param,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import {
    BoardContentUpdateRequest,
    BoardDeleteRequest,
    BoardListRequest,
    BoardCreateRequest,
    BoardTitleUpdateRequest,
    CommentCreateRequest,
} from '../dto/board.dto';
import { ERROR_CODES, ERROR_MESSAGES } from '../common/constants';
import { BoardService } from '../services/board.service';

@Controller('board')
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

    @Post('list')
    async getBoardList(@Body() body: BoardListRequest) {
        if (body.searchValue.length > 100) {
            throw new HttpException(
                {
                    code: ERROR_CODES.SEARCH_VALUE_TOO_LONG,
                    message: ERROR_MESSAGES[ERROR_CODES.SEARCH_VALUE_TOO_LONG],
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        return await this.boardService.getBoardList(
            body.searchType,
            body.searchValue,
            body.page,
        );
    }

    @Post('create')
    async createBoard(@Body() body: BoardCreateRequest) {
        if (
            !body.password ||
            body.password.length < 4 ||
            body.password.length > 20
        ) {
            throw new HttpException(
                {
                    code: ERROR_CODES.PASSWORD_INVALID,
                    message: ERROR_MESSAGES[ERROR_CODES.PASSWORD_INVALID],
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!body.author || body.author.length > 50) {
            throw new HttpException(
                {
                    code: ERROR_CODES.AUTHOR_INVALID,
                    message: ERROR_MESSAGES[ERROR_CODES.AUTHOR_INVALID],
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!body.title || body.title.length > 200) {
            throw new HttpException(
                {
                    code: ERROR_CODES.TITLE_INVALID,
                    message: ERROR_MESSAGES[ERROR_CODES.TITLE_INVALID],
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!body.content || body.content.length > 4000) {
            throw new HttpException(
                {
                    code: ERROR_CODES.CONTENT_INVALID,
                    message: ERROR_MESSAGES[ERROR_CODES.CONTENT_INVALID],
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        return await this.boardService.createBoard(body);
    }

    @Post('title/update')
    async updateBoardTitle(@Body() body: BoardTitleUpdateRequest) {
        if (!body.password) {
            throw new HttpException(
                {
                    code: ERROR_CODES.PASSWORD_MISMATCH,
                    message: ERROR_MESSAGES[ERROR_CODES.PASSWORD_MISMATCH],
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!body.title || body.title.length > 200) {
            throw new HttpException(
                {
                    code: ERROR_CODES.TITLE_INVALID,
                    message: ERROR_MESSAGES[ERROR_CODES.TITLE_INVALID],
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        return await this.boardService.updateBoardTitle(body);
    }

    @Post('content/update')
    async updateBoardContent(@Body() body: BoardContentUpdateRequest) {
        if (!body.password) {
            throw new HttpException(
                {
                    code: ERROR_CODES.PASSWORD_MISMATCH,
                    message: ERROR_MESSAGES[ERROR_CODES.PASSWORD_MISMATCH],
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!body.content || body.content.length > 4000) {
            throw new HttpException(
                {
                    code: ERROR_CODES.CONTENT_INVALID,
                    message: ERROR_MESSAGES[ERROR_CODES.CONTENT_INVALID],
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        return await this.boardService.updateBoardContent(body);
    }

    @Post('delete')
    async deleteBoard(@Body() body: BoardDeleteRequest) {
        if (!body.password) {
            throw new HttpException(
                {
                    code: ERROR_CODES.PASSWORD_MISMATCH,
                    message: ERROR_MESSAGES[ERROR_CODES.PASSWORD_MISMATCH],
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        await this.boardService.deleteBoard(body);
        return { message: 'success' };
    }

    @Get(':id')
    async getBoardDetail(@Param('id') id: string) {
        return await this.boardService.getBoardDetail(parseInt(id));
    }

    @Post('comment/create')
    async createComment(@Body() body: CommentCreateRequest) {
        if (!body.password || body.password.length > 20) {
            throw new HttpException(
                {
                    code: ERROR_CODES.COMMENT_PASSWORD_INVALID,
                    message:
                        ERROR_MESSAGES[ERROR_CODES.COMMENT_PASSWORD_INVALID],
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!body.author || body.author.length > 50) {
            throw new HttpException(
                {
                    code: ERROR_CODES.COMMENT_AUTHOR_INVALID,
                    message: ERROR_MESSAGES[ERROR_CODES.COMMENT_AUTHOR_INVALID],
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!body.content || body.content.length > 1000) {
            throw new HttpException(
                {
                    code: ERROR_CODES.COMMENT_CONTENT_INVALID,
                    message:
                        ERROR_MESSAGES[ERROR_CODES.COMMENT_CONTENT_INVALID],
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        return await this.boardService.createComment(body);
    }
}
