# デプロイガイド

このアプリケーションを Vercel にデプロイする手順です。

## 前提条件

- GitHub アカウント
- Vercel アカウント
- Neon（Postgres）アカウント（Vercel と統合済み）

## 手順

### 1. GitHub リポジトリの作成

```bash
# リポジトリの初期化
git init
git add .
git commit -m "Initial commit"

# GitHubにプッシュ
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Neon データベースの作成

1. [Neon Console](https://console.neon.tech/)にアクセス
2. 新しいプロジェクトを作成
3. 接続文字列をコピー（`postgresql://...`形式）

### 3. Vercel プロジェクトの作成

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. 「New Project」をクリック
3. GitHub リポジトリを選択
4. 環境変数を設定:

```
POSTGRES_URL=postgresql://[YOUR_NEON_CONNECTION_STRING]
```

5. 「Deploy」をクリック

### 4. データベースマイグレーション

デプロイ後、以下のコマンドでデータベーススキーマを作成:

```bash
# ローカルで実行（環境変数を設定した後）
npm run db:generate
npm run db:migrate
```

または、Vercel CLI を使用:

```bash
vercel env pull .env.local
npm run db:generate
npm run db:migrate
```

### 5. マスタデータの投入

`db/seed.ts`を実際のデータに更新してから実行:

```bash
npx tsx db/seed.ts
```

または、管理画面から手動で CSV アップロード。

## 環境変数

以下の環境変数が必要です:

| 変数名         | 説明                        | 例                               |
| -------------- | --------------------------- | -------------------------------- |
| `POSTGRES_URL` | Neon データベース接続文字列 | `postgresql://user:pass@host/db` |

## デプロイ後の確認事項

- [ ] トップページが正常に表示される
- [ ] 管理画面（/admin/stores, /admin/wages, /admin/phrases）にアクセスできる
- [ ] マスタデータが正しく登録されている
- [ ] CSV アップロードと処理が正常に動作する
- [ ] エクスポート機能が正常に動作する

## Vercel 設定の推奨値

### Functions

- **Max Duration**: 60 秒（Pro プラン）または 10 秒（Hobby プラン）
- **Region**: Tokyo（asia-northeast1）

### Build & Development

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## トラブルシューティング

### データベース接続エラー

環境変数 `POSTGRES_URL` が正しく設定されているか確認:

```bash
vercel env ls
```

### 処理タイムアウト

25,000 件以上の大量データを処理する場合、Vercel Pro プランが必要です。
Hobby プラン（無料）では 10 秒でタイムアウトします。

対応策:

1. Pro プランにアップグレード（月$20）
2. データを分割して複数回に分けて処理

### ビルドエラー

TypeScript のエラーがある場合:

```bash
npm run build
```

でローカルで確認してから再度デプロイ。

## 本番運用の注意点

1. **マスタデータの定期更新**

   - 最低賃金マスタは年次更新が必要（10 月頃）
   - 掲載店舗マスタは新店舗開設・閉鎖時に更新

2. **バックアップ**

   - Neon は自動バックアップがあるが、定期的にエクスポートを推奨

3. **セキュリティ**
   - 管理画面は認証機能がないため、Vercel Authentication などの追加を推奨
   - 本番環境では環境変数を適切に管理

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Drizzle Kit Documentation](https://orm.drizzle.team/kit-docs/overview)
