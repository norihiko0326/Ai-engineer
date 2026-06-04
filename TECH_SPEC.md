# 技術仕様書 - Kanban Task App

## 1. プロジェクト概要

Kanban Task Appは、タスク管理機能を備えたフルスタックアプリケーションです。
ユーザーはタスクをTodo、In Progress、Doneの3つの段階で管理できます。

---

## 2. 技術スタック

### 2.1 バックエンド

| 項目 | 技術仕様 | バージョン |
|------|---------|---------|
| **プログラミング言語** | Java | 21 |
| **フレームワーク** | Spring Boot | 3.2.0 |
| **API設計** | REST API (JSON) | - |
| **ORM** | Spring Data JPA | 3.2.0 |
| **データベースドライバ** | PostgreSQL JDBC | 42.7.1 |
| **マイグレーション** | Flyway | 9.22.3 |
| **ヘルスチェック** | Spring Boot Actuator | 3.2.0 |
| **バージョン管理** | Git | - |
| **開発ツール** | Spring Boot DevTools | 3.2.0 |

### 2.2 フロントエンド

| 項目 | 技術仕様 | バージョン |
|------|---------|---------|
| **フレームワーク** | React | 19.2.6 |
| **プログラミング言語** | TypeScript | 6.0.2 |
| **ビルドツール** | Vite | 8.0.12 |
| **UI/UXライブラリ** | Material-UI (MUI) | 9.0.1 |
| **UI Icons** | MUI Icons Material | 9.0.1 |
| **スタイリング** | Emotion (CSS-in-JS) | 11.14.0 / 11.14.1 |
| **HTTP通信** | Axios | 1.16.1 |
| **言語構文検査** | ESLint | 10.3.0 |
| **ESLint パーサー** | TypeScript ESLint | 8.59.2 |
| **バージョン管理** | Git + npm |

### 2.3 データベース

| 項目 | 技術仕様 | バージョン |
|------|---------|---------|
| **DBMS** | PostgreSQL | 15-alpine (Docker) |
| **ORM** | JPA/Hibernate (Spring Data JPA) | 3.2.0 |
| **マイグレーション** | Flyway | 9.22.3 |
| **コネクションプール** | HikariCP (Spring Boot デフォルト) | - |

### 2.4 インフラ・デプロイ

| 項目 | 技術仕様 | バージョン |
|------|---------|---------|
| **コンテナ化** | Docker | - |
| **オーケストレーション** | Docker Compose | - |
| **ログ管理** | SLF4J + Logback | - |

---

## 3. バックエンド仕様

### 3.1 プロジェクト構成

```
kanban-task-app/
├── backend/
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/taskapp/
│   │   │   │   ├── KanbanTaskAppApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   └── JpaConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   └── TaskController.java
│   │   │   │   ├── service/
│   │   │   │   │   └── TaskService.java
│   │   │   │   ├── repository/
│   │   │   │   │   └── TaskRepository.java
│   │   │   │   ├── entity/
│   │   │   │   │   └── Task.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── TaskRequest.java
│   │   │   │   │   └── TaskResponse.java
│   │   │   │   ├── exception/
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   └── ResourceNotFoundException.java
│   │   │   │   └── util/
│   │   │   │       └── ApiResponse.java
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── application-dev.yml
│   │   │       ├── application-prod.yml
│   │   │       └── db/migration/
│   │   │           ├── V1__initial_schema.sql
│   │   │           └── V2__add_indexes.sql
│   │   └── test/java/com/taskapp/
│   │       ├── controller/
│   │       │   └── TaskControllerTest.java
│   │       ├── service/
│   │       │   └── TaskServiceTest.java
│   │       └── repository/
│   │           └── TaskRepositoryTest.java
│   ├── Dockerfile
│   └── .dockerignore
```

### 3.2 主要依存関係 (pom.xml)

```xml
<dependencies>
  <!-- Spring Boot Starters -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.1.5</version>
  </dependency>
  
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
    <version>3.1.5</version>
  </dependency>
  
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
    <version>3.1.5</version>
  </dependency>
  
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <version>3.1.5</version>
    <scope>runtime</scope>
    <optional>true</optional>
  </dependency>
  
  <!-- Database -->
  <dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.6.0</version>
    <scope>runtime</scope>
  </dependency>
  
  <!-- Migration -->
  <dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
    <version>9.22.3</version>
  </dependency>
  
  <!-- Utilities -->
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
  </dependency>
  
  <!-- Testing -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <version>3.1.5</version>
    <scope>test</scope>
  </dependency>
  
  <dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>testcontainers</artifactId>
    <version>1.19.3</version>
    <scope>test</scope>
  </dependency>
  
  <dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <version>1.19.3</version>
    <scope>test</scope>
  </dependency>
</dependencies>
```

### 3.3 主要クラス仕様

#### Task エンティティ
```java
@Entity
@Table(name = "tasks")
public class Task {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column(nullable = false)
  private String title;
  
  @Column(columnDefinition = "TEXT")
  private String description;
  
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TaskStatus status; // TODO, IN_PROGRESS, DONE
  
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;
  
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
  
  @Column(name = "due_date")
  private LocalDateTime dueDate;
  
  @Column(name = "priority")
  private Integer priority; // 1(Low) ~ 5(High)
}
```

#### API エンドポイント

| HTTPメソッド | エンドポイント | 説明 |
|------------|--------------|------|
| GET | `/api/v1/tasks` | タスク一覧取得 |
| GET | `/api/v1/tasks/{id}` | 単一タスク取得 |
| POST | `/api/v1/tasks` | タスク作成 |
| PUT | `/api/v1/tasks/{id}` | タスク更新 |
| DELETE | `/api/v1/tasks/{id}` | タスク削除 |

### 3.4 設定ファイル (application.yml)

```yaml
spring:
  application:
    name: kanban-task-app
  
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:kanban_db}
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:password}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  flyway:
    enabled: true
    locations: classpath:db/migration

server:
  port: 8080
  servlet:
    context-path: /

logging:
  level:
    root: INFO
    com.taskapp: DEBUG
```

---

## 4. フロントエンド仕様

### 4.1 プロジェクト構成

```
kanban-task-app/
├── frontend/
│   ├── package.json
│   ├── vite.config.js (または next.config.js)
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx (または App.tsx)
│   │   ├── components/
│   │   │   ├── TaskBoard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   ├── Column.jsx
│   │   │   └── common/
│   │   │       ├── Header.jsx
│   │   │       ├── Footer.jsx
│   │   │       └── Loading.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   └── api.js (Axios設定)
│   │   ├── store/
│   │   │   ├── taskSlice.js (Redux)
│   │   │   └── store.js
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── TaskBoard.css
│   │   │   └── variables.css
│   │   ├── hooks/
│   │   │   └── useTasks.js
│   │   ├── utils/
│   │   │   ├── date.js
│   │   │   └── validators.js
│   │   └── App.jsx
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── tests/
│   │   ├── components/
│   │   │   └── TaskBoard.test.jsx
│   │   ├── services/
│   │   │   └── api.test.js
│   │   └── setup.js
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── .eslintrc.json
```

### 4.2 package.json 主要依存関係

```json
{
  "name": "kanban-task-app-frontend",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "@mui/material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "react-beautiful-dnd": "^13.1.1",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.1.0",
    "vite": "^4.5.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.4",
    "eslint": "^8.52.0",
    "eslint-plugin-react": "^7.33.2"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest",
    "lint": "eslint src/"
  }
}
```

### 4.3 環境変数設定 (.env.example)

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_NAME=Kanban Task App
VITE_LOG_LEVEL=info
```

---

## 5. データベース仕様

### 5.1 PostgreSQL テーブル設計

#### tasks テーブル
```sql
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'TODO',
  priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  due_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255)
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

### 5.2 初期化スクリプト (Flyway)

**ファイル**: `src/main/resources/db/migration/V1__initial_schema.sql`

```sql
-- TaskStatus Enum Type
CREATE TYPE task_status AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- Tasks テーブル
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'TODO',
  priority INTEGER NOT NULL DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  due_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

---

## 6. Docker & Docker Compose

### 6.1 docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: kanban_postgres
    environment:
      POSTGRES_DB: kanban_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: kanban_backend
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/kanban_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_JPA_HIBERNATE_DDL_AUTO: validate
    ports:
      - "8080:8080"
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: kanban_frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    environment:
      VITE_API_BASE_URL: http://localhost:8080/api/v1
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: kanban_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend
      - frontend
    restart: unless-stopped

volumes:
  postgres_data:
```

---

## 7. セキュリティ要件

- [ ] Spring Security設定
- [ ] CORS設定 (フロントエンドのオリジン許可)
- [ ] HTTPS/TLS対応
- [ ] CSRF保護
- [ ] SQLインジェクション対策 (JPA Parameterized Queries)
- [ ] XSS対策 (React自動エスケープ)
- [ ] レート制限 (Spring Cloud Gateway)
- [ ] 入力値検証 (@Valid, @NotNull等)

---

## 8. テスト戦略

### 8.1 バックエンド

- **ユニットテスト**: JUnit 5 + Mockito
- **インテグレーションテスト**: TestContainers + PostgreSQL
- **APIテスト**: MockMvc
- **カバレッジ目標**: 70%以上

### 8.2 フロントエンド

- **ユニットテスト**: Jest
- **コンポーネントテスト**: React Testing Library
- **E2Eテスト**: Cypress (オプション)
- **カバレッジ目標**: 60%以上

---

## 9. CI/CD パイプライン

### 9.1 GitHub Actions ワークフロー

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: kanban_db
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      - name: Run tests
        run: cd backend && mvn clean test
      - name: Build
        run: cd backend && mvn clean package

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd frontend && npm install
      - name: Run tests
        run: cd frontend && npm test
      - name: Build
        run: cd frontend && npm run build
```

---

## 10. デプロイメント戦略

- **本番環境**: Docker + Kubernetes または Docker Swarm
- **ステージング環境**: Docker Compose
- **開発環境**: ローカル Docker Compose
- **ロードバランサー**: Nginx
- **リバースプロキシ**: Nginx

---

## 11. 運用・監視

| 項目 | 技術 |
|------|------|
| **ログ管理** | SLF4J + Logback / ELK Stack |
| **メトリクス監視** | Micrometer + Prometheus |
| **トレーシング** | Spring Cloud Sleuth |
| **ヘルスチェック** | Spring Boot Actuator |
| **APM** | New Relic または DataDog (オプション) |

---

## 12. 開発環境セットアップ

### 前提条件

- Java 17以上
- Node.js 18以上
- PostgreSQL 14以上 (Docker推奨)
- Maven 3.8.1以上
- Git

### セットアップ手順

```bash
# リポジトリクローン
git clone <repository-url>
cd kanban-task-app

# PostgreSQL起動 (Docker)
docker-compose up -d postgres

# バックエンド起動
cd backend
mvn clean install
mvn spring-boot:run

# フロントエンド起動 (別ターミナル)
cd frontend
npm install
npm run dev
```

---

## 13. ロードマップ

| フェーズ | 期間 | 目標 |
|---------|------|------|
| **Phase 1** | 2週間 | バックエンド基盤構築、PostgreSQL連携 |
| **Phase 2** | 2週間 | Reactフロントエンド開発 |
| **Phase 3** | 1週間 | テスト実装、CI/CD設定 |
| **Phase 4** | 1週間 | Docker化、本番デプロイ |

---

## 14. 主なリソース・リンク

- [Spring Boot 公式ドキュメント](https://spring.io/projects/spring-boot)
- [React 公式ドキュメント](https://react.dev)
- [PostgreSQL 公式ドキュメント](https://www.postgresql.org/docs/)
- [Docker 公式ドキュメント](https://docs.docker.com/)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

**最終更新**: 2026年5月28日
