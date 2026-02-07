# 次のステップ

プロジェクトのセットアップが完了しました。以下の手順で開発とデプロイを進めてください。

## ✅ 完了した項目

- [x] Next.js 16 プロジェクトの初期化
- [x] Tailwind CSS の設定
- [x] Drizzle ORM と Neon Postgres の設定
- [x] PapaParse の導入
- [x] データベーススキーマの定義
- [x] マスタ管理画面の実装
- [x] CSV アップロード画面の実装
- [x] コア処理ロジックの実装
- [x] テキストクリーニング処理の実装
- [x] 処理結果画面の実装
- [x] エクスポート機能の実装
- [x] デプロイガイドの作成

## 📋 次にやること

### 1. マスタデータの準備（重要）

`db/seed-data/`ディレクトリに以下のデータを準備してください:

1. **掲載店舗マスタ** (126 件)

   - Excel の「掲載店舗」シートからデータ抽出
   - フォーマット: `{ name: "店舗名", branchCode: "[コード]" }`

2. **抜きたい文言マスタ** (1,130 件)

   - Excel の「抜きたい文言」シートからデータ抽出
   - カテゴリ分類が必要

3. **その他の NG 文言**
   - 非掲載フラグ文言
   - 年齢制限 NG 文言

### 2. ローカルでの動作確認

```bash
# 環境変数の設定
cp .env.example .env
# .envファイルを編集してPOSTGRES_URLを設定

# データベースの初期化
npm run db:generate
npm run db:migrate

# マスタデータの投入（seed.tsを編集してから）
npx tsx db/seed.ts

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 にアクセスして動作確認:

- [ ] トップページが表示される
- [ ] 管理画面にアクセスできる
- [ ] テスト CSV をアップロードして処理できる
- [ ] 結果が正しく表示される
- [ ] エクスポートが動作する

### 3. GitHub リポジトリの作成

```bash
git init
git add .
git commit -m "Initial commit: ホットスタッフ対象案件抽出ツール"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 4. Neon データベースの作成

1. https://console.neon.tech/ にアクセス
2. 新しいプロジェクトを作成
3. 接続文字列をコピー

### 5. Vercel へのデプロイ

1. https://vercel.com/dashboard にアクセス
2. GitHub リポジトリをインポート
3. 環境変数 `POSTGRES_URL` を設定
4. デプロイ

詳細は `DEPLOY.md` を参照してください。

### 6. 本番環境でのマスタデータ投入

```bash
# Vercel CLIで環境変数を取得
vercel env pull .env.production
POSTGRES_URL=$(cat .env.production | grep POSTGRES_URL | cut -d= -f2-) npx tsx db/seed.ts
```

または管理画面から手動で CSV アップロード。

## ⚠️ 重要な注意事項

### データ量の制限

- **Hobby プラン（無料）**: 処理時間 10 秒まで
  - 約 5,000〜10,000 件が目安
- **Pro プラン（月$20）**: 処理時間 60 秒まで
  - 25,000 件以上対応可能

大量データを処理する場合は Pro プランを推奨します。

### セキュリティ

現在、管理画面には認証機能がありません。本番環境では以下の対応を推奨:

1. Vercel Authentication の追加
2. IP 制限の設定
3. Basic 認証の追加

### パフォーマンス

- 処理速度の最適化のため、マスタデータはメモリにキャッシュされます
- 初回アクセス時のみ DB から読み込み、以降はキャッシュを使用
- 大量データ処理時はプログレスバーの追加を検討

## 🔄 今後の拡張機能

以下の機能は将来的に追加可能です:

1. **個別キャンペーン機能**

   - `docs/CAMPAIGN_FEATURE.md` を参照
   - 支社別差分チェック
   - ハイライト表示

2. **認証機能**

   - Vercel Authentication
   - NextAuth.js

3. **処理履歴**

   - 過去の処理結果を保存
   - 統計データの可視化

4. **バッチ処理**
   - 定期実行機能
   - メール通知

## 📚 参考ドキュメント

- [README.md](./README.md) - プロジェクト概要
- [DEPLOY.md](./DEPLOY.md) - デプロイ手順
- [docs/CAMPAIGN_FEATURE.md](./docs/CAMPAIGN_FEATURE.md) - 個別キャンペーン機能

## 💡 トラブルシューティング

問題が発生した場合:

1. `npm run build` でビルドエラーを確認
2. 環境変数が正しく設定されているか確認
3. データベース接続を確認
4. Vercel のログを確認

## ✨ 完成！

このプロジェクトは Excel ツールのすべての主要機能を Web アプリとして再実装しています。
ご不明な点があれば、各ドキュメントを参照するか、コードのコメントを確認してください。

Good luck! 🚀
