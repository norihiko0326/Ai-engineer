# Lint チェック設定ガイド

このドキュメントでは、Kanban Task App のコード品質チェックツール（Lint）の設定と使用方法を説明します。

---

## 📋 追加されたツール

### フロントエンド（React/TypeScript）

| ツール | 目的 | 設定ファイル |
|--------|-----|-------------|
| **ESLint** | TypeScript/React コードの静的解析 | `eslint.config.js` |
| **TypeScript** | 型チェック | `tsconfig.json` |

#### 追加ルール

```javascript
// eslint.config.js
rules: {
  // TypeScript 型安全性
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/explicit-function-return-types': 'warn',
  '@typescript-eslint/no-floating-promises': 'error',
  
  // 未使用変数
  '@typescript-eslint/no-unused-vars': ['error', {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
  }],
  
  // React Hooks
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  
  // コンソール出力制御
  'no-console': ['warn', { allow: ['warn', 'error'] }],
}
```

### バックエンド（Spring Boot）

| ツール | 目的 | 設定ファイル |
|--------|-----|-------------|
| **Checkstyle** | Java コード規約チェック | `pom.xml` (checkstyle-plugin) |
| **SpotBugs** | バグ検出 | `pom.xml` (spotbugs-plugin) |

---

## 🚀 セットアップ手順

### フロントエンド

```bash
cd kanban-task-app/frontend

# 依存関係は既にインストール済み
# 以下のコマンドで確認
npm list eslint typescript
```

### バックエンド

```bash
cd kanban-task-app

# Maven プラグインは pom.xml に既に設定済み
# 初回実行時に自動ダウンロード
mvn checkstyle:check  # Checkstyle 自動ダウンロード
mvn spotbugs:check    # SpotBugs 自動ダウンロード
```

---

## 🔍 実行方法

### フロントエンド

#### 1️⃣ **ESLint チェック（警告・エラーを検出）**

```bash
cd kanban-task-app/frontend

# 問題を表示
npm run lint
```

**出力例**:
```
✔ No issues found.
```

#### 2️⃣ **ESLint 自動修正（修正可能な問題を自動修正）**

```bash
npm run lint:fix
```

**修正対象**:
- インデント不正
- セミコロン漏れ
- 未使用変数の削除
- その他 auto-fixable ルール

#### 3️⃣ **TypeScript 型チェック（型エラーを検出）**

```bash
npm run type-check
```

**出力例**:
```
$ tsc --noEmit
(No errors found)
```

#### 4️⃣ **完全ビルド（TypeScript + Lint + Vite ビルド）**

```bash
npm run build
```

このコマンドは以下を実行：
1. `tsc -b` : TypeScript コンパイル（型チェック）
2. `vite build` : Vite ビルド

---

### バックエンド

#### 1️⃣ **Checkstyle チェック（Java コード規約違反を検出）**

```bash
cd kanban-task-app

mvn checkstyle:check
```

**出力例**:
```
[INFO] Starting audit...
[INFO] Audit done.
[INFO] BUILD SUCCESS
```

**エラーが見つかった場合**:
```
[WARNING] There are 3 checkstyle violations.
[INFO] BUILD FAILURE
```

#### 2️⃣ **SpotBugs チェック（バグパターンを検出）**

```bash
mvn spotbugs:check
```

**出力例**:
```
[INFO] BugInstance size is 0
[INFO] BUILD SUCCESS
```

#### 3️⃣ **完全ビルド（全チェック実施）**

```bash
mvn clean package
```

このコマンドは以下を実行：
1. `clean` : 前回のビルド成果物削除
2. `compile` : コンパイル
3. `checkstyle:check` : Checkstyle チェック（validate フェーズで自動実行）
4. `test` : テスト実行
5. `spotbugs:check` : SpotBugs チェック（verify フェーズで自動実行）
6. `package` : JAR パッケージング

---

## ⚙️ CI/CD 統合

### GitHub Actions での実行例

```yaml
# .github/workflows/lint.yml
name: Lint & Code Quality

on: [push, pull_request]

jobs:
  frontend-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd kanban-task-app/frontend && npm install
      - run: npm run lint
      - run: npm run type-check

  backend-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      - run: cd kanban-task-app && mvn clean package
```

---

## 📊 チェック結果の解釈

### ESLint/TypeScript

| レベル | 説明 | 対応 |
|--------|-----|-----|
| ❌ **error** | ビルド失敗 | 修正必須 |
| ⚠️ **warning** | ビルド成功だが問題あり | 修正推奨 |
| ℹ️ **info** | 情報のみ | 参考 |

### Checkstyle

| 違反度 | 説明 |
|--------|-----|
| 🔴 **error** | コード規約に大きく違反 |
| 🟡 **warning** | コード規約の軽微な違反 |

### SpotBugs

| バグパターン | 例 |
|-------------|-----|
| 🔴 **High** | Null ポインタ参照、SQL インジェクション |
| 🟡 **Medium** | 不正な型キャスト |
| 🔵 **Low** | パフォーマンス問題 |

---

## 🛠️ トラブルシューティング

### フロントエンド

#### Q: `npm run lint` で "command not found" エラー

```bash
# 解決方法
cd kanban-task-app/frontend
npm install
npm run lint
```

#### Q: ESLint が `@typescript-eslint` プラグインを見つけない

```bash
# 解決方法
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm run lint
```

#### Q: TypeScript が strict mode で型エラーが多い

現在の `tsconfig.json` を確認し、必要に応じて strict オプションを調整：

```json
{
  "compilerOptions": {
    "strict": true,          // 厳密モード
    "noImplicitAny": true,   // any 型禁止
    "strictNullChecks": true // null チェック強制
  }
}
```

### バックエンド

#### Q: `mvn checkstyle:check` で "Goal could not be found"

```bash
# 解決方法：プラグインバージョン指定
mvn org.apache.maven.plugins:maven-checkstyle-plugin:3.3.1:check
```

#### Q: Checkstyle が実行されない

`pom.xml` の `<executions>` セクションを確認：

```xml
<executions>
  <execution>
    <id>validate</id>
    <phase>validate</phase>  <!-- 正しいフェーズ -->
    <goals>
      <goal>check</goal>
    </goals>
  </execution>
</executions>
```

#### Q: SpotBugs がメモリ不足でクラッシュ

```bash
# Java ヒープサイズを増やす
MAVEN_OPTS="-Xmx1024m" mvn spotbugs:check
```

---

## 📝 ベストプラクティス

### 開発時

```bash
# コーディング前に既存の問題を確認
npm run lint          # フロントエンド
mvn checkstyle:check  # バックエンド

# コーディング後、自動修正を試す
npm run lint:fix

# コミット前に型チェック
npm run type-check
```

### コミットメッセージ

```bash
git commit -m "feat: 新機能追加

- Lint チェック: OK
- 型チェック: OK
- テスト: OK"
```

### PR レビュー前

```bash
# 全てのチェックを実行
npm run build        # フロントエンド完全チェック
mvn clean package    # バックエンド完全チェック
```

---

## 📚 参考資料

### フロントエンド
- [ESLint 公式ドキュメント](https://eslint.org/docs/)
- [typescript-eslint](https://typescript-eslint.io/)
- [TypeScript ハンドブック](https://www.typescriptlang.org/docs/)

### バックエンド
- [Checkstyle Google スタイル](https://checkstyle.org/styleguides/google-java-style/)
- [SpotBugs Manual](https://spotbugs.readthedocs.io/)
- [Maven プラグイン](https://maven.apache.org/plugins/)

---

## ✅ チェックリスト

開発完了時に確認：

- [ ] `npm run lint` が通っている（フロントエンド）
- [ ] `npm run type-check` が通っている
- [ ] `npm run build` が成功している
- [ ] `mvn checkstyle:check` が通っている（バックエンド）
- [ ] `mvn spotbugs:check` が通っている
- [ ] `mvn clean package` が成功している
- [ ] コミットメッセージに Issue 番号が含まれている
- [ ] PR が作成されている

---

**最終更新**: 2026-06-04  
**設定バージョン**: 1.0.0
