import { SEARCH_TYPE } from '../common/constants';

// GET
export interface BoardListRequest {
    searchType: (typeof SEARCH_TYPE)[keyof typeof SEARCH_TYPE];
    searchValue: string;
    page?: number;
}

// POST
export interface BoardCreateRequest {
    author: string;
    title: string;
    password: string;
    content: string;
}

export interface BoardTitleUpdateRequest {
    id: number;
    title: string;
    password: string;
}

export interface BoardContentUpdateRequest {
    id: number;
    content: string;
    password: string;
}

export interface BoardDeleteRequest {
    id: number;
    password: string;
}

export interface CommentCreateRequest {
    boardId: number;
    parentCommentId: number;
    author: string;
    password: string;
    content: string;
}
