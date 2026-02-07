# 個別キャンペーン機能（今後の拡張）

## 概要

個別キャンペーン案件の管理と差分チェック機能です。現在のバージョンでは未実装ですが、将来的に追加できます。

## 要件

### 派遣案件の管理

- 支社別の依頼件数を管理
- CSV の実際の件数と比較
- 差分がある場合は黄色でハイライト表示

### 直雇用案件の管理

- 個別の案件番号（12 桁）を管理
- CSV に存在するかチェック
- 存在しない場合は黄色でハイライト表示

## 実装案

### データベーススキーマ

```typescript
// 個別キャンペーン（派遣）
export const campaignDispatch = pgTable("campaign_dispatch", {
  id: serial("id").primaryKey(),
  branchName: text("branch_name").notNull(),
  requestCount: integer("request_count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 個別キャンペーン（直雇用）
export const campaignDirectHire = pgTable("campaign_direct_hire", {
  id: serial("id").primaryKey(),
  caseNumber: text("case_number").notNull(),
  branchName: text("branch_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 画面構成

#### `/admin/campaigns` - キャンペーン管理画面

- 派遣案件のアップロード（支社名、依頼件数）
- 直雇用案件のアップロード（案件番号、支社名）
- 一覧表示と CRUD 操作

#### `/results` - 差分チェック表示

処理結果画面に以下のセクションを追加:

- 支社別の依頼件数 vs CSV 件数の比較テーブル
- 差分がある行を黄色でハイライト
- 直雇用案件の存在チェック結果

### 処理ロジック

```typescript
// 支社別の件数集計
function countByCampaign(results: ProcessingResult[]) {
  const counts = new Map<string, number>();

  results.forEach((r) => {
    const branchName = r.record.branchName; // dataシートから取得する支社名
    if (counts.has(branchName)) {
      counts.set(branchName, counts.get(branchName)! + 1);
    } else {
      counts.set(branchName, 1);
    }
  });

  return counts;
}

// 差分チェック
function checkCampaignDiff(
  campaigns: Campaign[],
  csvCounts: Map<string, number>
) {
  return campaigns.map((c) => ({
    ...c,
    csvCount: csvCounts.get(c.branchName) || 0,
    hasDiff: c.requestCount !== (csvCounts.get(c.branchName) || 0),
  }));
}
```

## CSV フォーマット

### 派遣案件用 CSV

```csv
支社名,依頼件数
一宮支店,50
岐阜支店,30
```

### 直雇用案件用 CSV

```csv
案件番号,支社名
123456789012,一宮支店
234567890123,岐阜支店
```

## 実装の優先度

- 現在のバージョンでは基本機能のみを実装
- 本機能は今後の拡張として追加可能
- 必要に応じてユーザーのフィードバックを元に実装

## 参考

Excel ツールの「個別案件」シートの仕様を参照:

- 左側ブロック（A-F 列）: 支社別依頼管理
- 右側ブロック（P-U 列）: 直雇用個別案件
- 条件付き書式で差分をハイライト表示
