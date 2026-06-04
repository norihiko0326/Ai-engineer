# バックエンド検索API統合実装 - 検証ドキュメント

## 📋 実装内容

### 1. バックエンド変更

#### `TaskController.java` に `/search` エンドポイント追加

```java
@GetMapping("/search")
public ResponseEntity<List<Task>> searchTasks(@RequestParam String keyword) {
    List<Task> tasks = taskRepository.findByTitleContainingIgnoreCase(keyword);
    return ResponseEntity.ok(tasks);
}
```

**エンドポイント**: `GET /api/tasks/search?keyword={keyword}`

**機能**: タイトルをキーワードで部分一致検索（大文字小文字区別なし）

---

### 2. フロントエンド変更

#### `taskApi.ts` - API 関数追加

```typescript
export const searchTasksByKeyword = async (keyword: string): Promise<Task[]> => {
  const response = await api.get<Task[]>('/api/tasks/search', {
    params: { keyword },
  });
  return response.data;
};
```

#### `TaskContext.tsx` - 状態管理の書き換え

**新規追加の状態フィールド**:
- `debouncedQuery: string` - デバウンス済みの検索クエリ

**新規アクションタイプ**:
- `SET_DEBOUNCED_QUERY` - デバウンス済みクエリを更新

**useEffect 2分割**:

1. **Effect 1 - デバウンス処理**
   - トリガー: `searchQuery` 変化
   - 処理: 400ms 遅延後に `debouncedQuery` を更新
   - 目的: 入力中の連続 API 呼び出しを防止

2. **Effect 2 - API 呼び出し**
   - トリガー: `debouncedQuery` / `statusFilter` 変化
   - ロジック:
     - キーワード有り → `searchTasksByKeyword()` で検索結果取得
     - キーワード無し + ステータス有り → `fetchTasksByStatus()` で取得
     - 両方無し → `fetchAllTasks()` で全件取得
   - クライアント側でステータスフィルター適用（複合検索対応）
   - AbortController で前のリクエストをキャンセル

---

## 🧪 検証手順

### API 動作確認

#### 1. バックエンド API テスト

**全タスク取得**:
```bash
curl "http://localhost:8080/api/tasks"
```

**検索 API テスト**（キーワード: "authentication"）:
```bash
curl "http://localhost:8080/api/tasks/search?keyword=authentication"
```

**レスポンス例**:
```json
[
  {
    "id": 1,
    "title": "ユーザー認証機能の実装",
    "description": "ログインとサインアップの機能を実装する",
    "status": "IN_PROGRESS",
    "priority": 1,
    "createdAt": "2026-06-01T08:40:52.310590",
    "updatedAt": "2026-06-01T08:40:52.310590"
  }
]
```

---

### フロント UI 検証（ブラウザ）

1. `http://localhost:5173` にアクセス
2. **検索テキスト入力**（例: "認証"）
3. **確認事項**:
   - 入力中の API 呼び出しは 400ms デバウンス後に実行される
   - KanbanBoard に検索結果が表示される
   - ブラウザ DevTools Network タブで `/api/tasks/search?keyword=...` 呼び出しを確認
4. **ステータスフィルター変更**（例: "TODO" に変更）
5. **確認事項**:
   - `/api/tasks/status/TODO` が呼ばれる
   - 検索結果がステータスでさらにフィルタリングされる
6. **検索クリア**（テキスト削除）
7. **確認事項**:
   - `/api/tasks` が呼ばれて全件取得される

---

## 🔄 動作フロー

```
SearchBar 入力
     ↓
SET_SEARCH_QUERY アクション
     ↓
Effect 1（デバウンス）
     ↓ 400ms 待機後
SET_DEBOUNCED_QUERY アクション
     ↓
Effect 2（API呼び出し）
     ↓
API 呼び出し（/api/tasks/search）
     ↓
SET_TASKS アクション で displayTasks 更新
     ↓
KanbanBoard 再レンダリング
     ↓
ボード画面に検索結果表示
```

---

## 📊 テスト対象

| 項目 | 説明 | 期待結果 |
|---|---|---|
| キーワード検索 | "認証" で検索 | "ユーザー認証機能" が表示される |
| 複合検索 | "フロント" + ステータス "TODO" | "フロントエンド開発" が TODO 列に表示 |
| デバウンス | 連続入力後 400ms経過 | 複数回の API 呼び出しではなく1回のみ |
| ステータスフィルター単独 | ステータス "DONE" | デプロイメント設定などが DONE 列に表示 |
| クリア | 検索テキスト削除 | 全件表示に戻る |

---

## 🛠️ トラブルシューティング

### API 500 エラー
- リポジトリに `findByTitleContainingIgnoreCase()` が実装されているか確認
- バックエンド ログを確認（`docker logs kanban_backend`）

### フロントが 404
- `npm run dev` が 5173 でリッスンしているか確認
- VITE_API_BASE_URL が `http://localhost:8080` に設定されているか確認

### デバウンスが機能しない
- TaskContext.tsx の Effect 1 が 400ms timeout を設定しているか確認

---

## 📝 Git コミット

**親プロジェクト**:
- [Docs] ポート管理ルールをCLAUDE.mdに追加

**サブモジュール（kanban-task-app）**:
- [Feature] バックエンド検索APIのフロントエンド統合

**ブランチ**: `feature/frontend-search-api-integration`
