# GitHub ブランチ保護ルール設定ガイド

`gh` CLI がインストールされていないため、GitHub のウェブUI経由で手動設定してください。

---

## 1. GitHub リポジトリにアクセス

**リポジトリ:** https://github.com/norihiko0326/Ai-engineer

---

## 2. ブランチ保護ルールの設定

### 手順

1. リポジトリの **Settings** タブをクリック
2. 左サイドバーから **Branches** をクリック
3. **Add rule** ボタンをクリック
4. 以下の設定を入力：

### 設定項目

| 項目 | 値 | 説明 |
|---|---|---|
| **Branch name pattern** | `main` | 保護対象ブランチ |
| **Require a pull request before merging** | ✅ オン | PRなしではマージ不可 |
| → Require approvals | ❌ オフ | 承認者不要（PR作成は必須） |
| **Dismiss stale pull request approvals when new commits are pushed** | ✅ オン | 新コミット時に承認をリセット |
| **Require status checks to pass before merging** | ❌ オフ | 初期段階では不要 |
| **Require branches to be up to date before merging** | ❌ オフ | 初期段階では不要 |
| **Enforce all configured restrictions for administrators** | ✅ オン | 管理者にも同じルール適用 |
| **Restrict who can push to matching branches** | ❌ オフ | 全員がpush可能 |
| **Allow force pushes** | ❌ オフ | Force push 禁止 |
| **Allow deletions** | ❌ オフ | ブランチ削除禁止 |

5. **Create** をクリック

---

## 3. 設定確認

### GitHub UI で確認

1. リポジトリの Settings → Branches へ
2. "main" の保護ルールが表示されることを確認

### gh CLI で確認（インストール後）

```bash
gh api repos/norihiko0326/Ai-engineer/branches/main/protection
```

---

## 次のステップ

ブランチ保護ルール設定後、以下を実施：

1. **gh CLI のインストール** （オプション）
   ```powershell
   winget install --id GitHub.cli
   ```

2. **CLAUDE.md のルールに従って開発開始**
   - Issue を作成
   - Feature ブランチを切る
   - PR経由でマージ

---

## トラブルシューティング

### 「Push が拒否される」
→ mainブランチへの直接pushはブランチ保護ルールで禁止。
CLAUDE.md に従って PR経由でマージしてください。

### 「Force push したい」
→ ブランチ保護ルールで禁止されています。
必要な場合は GitHub の Settings から一時的に無効化してから実施してください。

---

## 参考

- GitHub Docs: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
