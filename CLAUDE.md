# Claude Code ワークフロー & 開発ルール

このプロジェクトではGitHubを使った統制されたワークフローを実施します。
Claude Codeが作業を行う際は、以下のルールに従うこと。

---

## Issue ファースト

新しい作業（機能追加・バグ修正・リファクタリング）を開始する前に、**必ずGitHub Issueを作成する**。

```bash
gh issue create --title "機能名の説明" --body "詳細な説明"
```

- Issueが自動的に番号（例：`#1`, `#5`）で識別される
- その番号をブランチ・PRで参照することで、Issue↔ブランチ↔PR全体を関連付ける

---

## ブランチ戦略

### ルール
- **mainブランチへの直接コミット・プッシュは禁止**
- 全ての作業は **feature/fix ブランチ** で行う
- GitHub上でブランチ保護ルールが有効 → PRなしではmainへマージできない

### ブランチ名の付け方
```
feature/issue-{Issue番号}-{簡潔な説明}
fix/issue-{Issue番号}-{簡潔な説明}
```

例：
- `feature/issue-3-add-user-authentication`
- `fix/issue-7-resolve-database-connection-error`

### ブランチ作成方法
```bash
# Issue #5を扱う場合
git checkout -b feature/issue-5-add-kanban-board
git push -u origin feature/issue-5-add-kanban-board
```

---

## Pull Request ワークフロー

作業完了後、以下のフローに従う：

1. **コミットメッセージをクリアに書く**
   ```bash
   git commit -m "[#5] Kanban board コンポーネント追加

   - Board、Lane、Card コンポーネントの実装
   - ドラッグ&ドロップ機能の統合
   - Closes #5"
   ```

2. **PR を作成する**
   ```bash
   gh pr create \
     --title "[#5] Kanban board コンポーネント追加" \
     --body "このPRは Issue #5 を解決します。

   ## 変更内容
   - Board、Lane、Card コンポーネントの実装
   - ドラッグ&ドロップ機能

   Closes #5"
   ```

3. **コミットメッセージまたはPR本文に `Closes #番号` を含める**
   - PRがマージされるとIssueが自動でクローズされる

4. **PRがマージされたらブランチを削除**
   ```bash
   git branch -d feature/issue-5-add-kanban-board
   ```

---

## 禁止事項

❌ **以下は絶対に実行しないこと：**

- `git push origin main`
- `git commit -m "..." --amend` （mainへのcommit）
- `git push --force` （特にmainへ）
- mainブランチへの直接コミット

✅ **必ず以下に従うこと：**

- Issue → ブランチ → PR → マージ の一連のフロー
- PRはmainへマージする前に作成する
- コミットメッセージに Issue 番号を含める

---

## 設定

### GitHub リポジトリ設定

#### ブランチ保護ルール
- **mainへのpushと direct commits を禁止**
- PRなしではmainへマージ不可

#### 自動化設定
1. **PR マージ時のブランチ自動削除**
   - Settings → General → "Delete head branches" を **有効化**
   - マージ後、自動的にfeature/fix ブランチが削除される

2. **イシューの自動クローズ**
   - PR説明に `Closes #番号` を記述することで、PRマージ時にIssueが自動でクローズ
   - 例：`Closes #5`、`Fixes #10` など

3. **gh CLI の設定**
   ```bash
   # PR作成時にブランチ削除オプション付き
   gh pr create --title "..." --body "Closes #番号"
   
   # マージ時に自動削除（--delete-branch フラグ）
   gh pr merge <PR番号> --merge --delete-branch
   ```

### Claude Code 設定
- **.claude/settings.json**: git push origin main の実行を検出して警告
- このCLAUDE.mdファイルがClaude Codeの行動を規定する

### ポート管理
**Claude Codeはサーバー起動時に必ず以下を実施する：**

| ポート | 用途 | デフォルト | 対応 |
|---|---|---|---|
| 8080 | バックエンド（Spring Boot） | `docker-compose up` | 競合時：既存プロセスを `kill -9 <PID>` で停止後に起動 |
| 5173 | フロント開発サーバー（Vite） | `npm run dev` | 競合時：既存プロセスを停止後に起動 |

**手順**:
```bash
# ポート使用状況確認
lsof -i :8080  # バックエンドのポート確認
lsof -i :5173  # フロントのポート確認

# 既存プロセスを強制終了（PIDを確認してから）
kill -9 <PID>

# 指定ポートで起動
cd kanban-task-app && docker-compose up       # バックエンド
cd kanban-task-app/frontend && npm run dev    # フロント
```

**重要**: 異なるポートでの起動は許さない。常に設定されたポートを使用すること。

---

## 例：新機能追加のフロー

```bash
# 1. Issue 作成
gh issue create --title "ユーザー認証機能の追加" --body "JWT/OAuth対応"

# 2. Issue #8 が作成されたとする → ブランチ切り
git checkout -b feature/issue-8-add-user-auth
git push -u origin feature/issue-8-add-user-auth

# 3. コード作成
# ... src/auth.ts など編集 ...
git add .
git commit -m "[#8] 認証機能の実装

- JWT トークン生成・検証
- ユーザーログイン エンドポイント

Closes #8"

# 4. PR 作成
gh pr create --title "[#8] ユーザー認証機能の追加" \
  --body "Closes #8"

# 5. PR マージ（自動ブランチ削除）
gh pr merge <PR番号> --merge --delete-branch

# または、web UI でマージ後に自動削除される（Settings で有効化した場合）
```

## gh CLI でのマージコマンド詳細

```bash
# マージ種別と自動削除
gh pr merge 3 --merge --delete-branch          # Merge コミット + ブランチ削除
gh pr merge 3 --squash --delete-branch         # Squash マージ + ブランチ削除
gh pr merge 3 --rebase --delete-branch         # Rebase + ブランチ削除

# イシュー自動クローズも同時に行われる
# （PR説明に Closes #番号 がある場合）
```

---

## 参考資料

- GitHub Branch Protection Rules: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches
- gh CLI Documentation: https://cli.github.com/
