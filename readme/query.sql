CREATE DATABASE IF NOT EXISTS board
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_bin;

DROP TABLE IF EXISTS `KeywordAlert`;
DROP TABLE IF EXISTS `Comments`;
DROP TABLE IF EXISTS `Board`;

CREATE TABLE `Board` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_bin NOT NULL,
  `author` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `content` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `commentCount` int NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_title` (`title`),
  KEY `idx_author` (`author`),
  KEY `idx_password` (`password`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE `Comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `boardId` bigint NOT NULL,
  `parentCommentId` bigint NOT NULL,
  `author` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `content` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_board_id` (`boardId`),
  KEY `idx_parent_comment_id` (`parentCommentId`),
  KEY `idx_author` (`author`),
  KEY `idx_password` (`password`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE `KeywordAlert` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `author` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `keywordType` int NOT NULL COMMENT '1: 게시글 제목, 2: 게시글 작성자, 3: 게시글 내용, 4: 댓글 작성자, 5: 댓글 내용',
  `keyword` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_author_keywordType_keyword` (`author`,`keywordType`,`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;