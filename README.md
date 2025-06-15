- mysql은 서버 실행 시 스키마가 자동생성됩니다.(<a href="./readme/query.sql" download>MySQL 쿼리 스크립트 파일</a>)
- 서버나 mysql 포트 설정 수정은 .env.prod(도커) 또는 .env.dev(네이티브) 파일에서 가능합니다.

- 실행방법(도커)
```
// 실행
yarn run build && docker-compose up -d
// 삭제
docker-compose down --rmi all -v
```
- 실행방법(네이티브)
```
// DB실행(도커)
docker-compose up -d mysql
// 서버 실행
yarn run build && cp .env.dev dist/ && yarn run start:prod
```
- api(<a href="./readme/board-api.postman_collection.json" download>API 테스트를 위한 Postman import 파일</a>)

| 기능        | Method | URL                     |
| --------- | ------ | ----------------------- |
| 게시글 목록 조회 | POST   | `/board/list`           |
| 게시글 생성    | POST   | `/board/create`         |
| 게시글 제목 수정 | POST   | `/board/title/update`   |
| 게시글 내용 수정 | POST   | `/board/content/update` |
| 게시글 삭제    | POST   | `/board/delete`         |
| 게시글 상세 조회 | GET    | `/board/:id`            |
| 댓글 생성     | POST   | `/board/comment/create` |
