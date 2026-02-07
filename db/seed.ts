import { db } from '../db';
import { stores, minimumWages, removalPhrases, ngFlagPhrases, ageNgPhrases, ngWords } from '../db/schema';

// このスクリプトは実際のデータでマスタテーブルにデータを投入するためのテンプレートです
// Excelレポートから抽出したデータに置き換えて使用してください

async function seed() {
  console.log('Starting seed...');

  // 掲載店舗マスタ（126件）のサンプル
  // 実際のデータに置き換えてください
  await db.insert(stores).values([
    { name: '株式会社ホットスタッフ一宮', branchCode: '[0901]' },
    { name: '株式会社ホットスタッフ岐阜', branchCode: '[0902]' },
    // ... 残り124件を追加
  ]);
  console.log('Stores seeded');

  // 最低賃金マスタ（47都道府県）
  await db.insert(minimumWages).values([
    { prefecture: '北海道', newWage: 1010, effectiveDate: '2024-10-01', oldWage: 960 },
    { prefecture: '青森県', newWage: 953, effectiveDate: '2024-10-01', oldWage: 898 },
    { prefecture: '岩手県', newWage: 953, effectiveDate: '2024-10-01', oldWage: 893 },
    { prefecture: '宮城県', newWage: 973, effectiveDate: '2024-10-01', oldWage: 923 },
    { prefecture: '秋田県', newWage: 951, effectiveDate: '2024-10-01', oldWage: 897 },
    { prefecture: '山形県', newWage: 951, effectiveDate: '2024-10-01', oldWage: 900 },
    { prefecture: '福島県', newWage: 960, effectiveDate: '2024-10-01', oldWage: 900 },
    { prefecture: '茨城県', newWage: 1003, effectiveDate: '2024-10-01', oldWage: 953 },
    { prefecture: '栃木県', newWage: 1004, effectiveDate: '2024-10-01', oldWage: 954 },
    { prefecture: '群馬県', newWage: 985, effectiveDate: '2024-10-01', oldWage: 935 },
    { prefecture: '埼玉県', newWage: 1078, effectiveDate: '2024-10-01', oldWage: 1028 },
    { prefecture: '千葉県', newWage: 1076, effectiveDate: '2024-10-01', oldWage: 1026 },
    { prefecture: '東京都', newWage: 1226, effectiveDate: '2024-10-01', oldWage: 1113 },
    { prefecture: '神奈川県', newWage: 1206, effectiveDate: '2024-10-01', oldWage: 1112 },
    { prefecture: '新潟県', newWage: 981, effectiveDate: '2024-10-01', oldWage: 931 },
    { prefecture: '富山県', newWage: 988, effectiveDate: '2024-10-01', oldWage: 948 },
    { prefecture: '石川県', newWage: 988, effectiveDate: '2024-10-01', oldWage: 948 },
    { prefecture: '福井県', newWage: 979, effectiveDate: '2024-10-01', oldWage: 931 },
    { prefecture: '山梨県', newWage: 987, effectiveDate: '2024-10-01', oldWage: 938 },
    { prefecture: '長野県', newWage: 1003, effectiveDate: '2024-10-01', oldWage: 948 },
    { prefecture: '岐阜県', newWage: 1001, effectiveDate: '2024-10-01', oldWage: 950 },
    { prefecture: '静岡県', newWage: 1034, effectiveDate: '2024-10-01', oldWage: 984 },
    { prefecture: '愛知県', newWage: 1077, effectiveDate: '2024-10-01', oldWage: 1027 },
    { prefecture: '三重県', newWage: 1023, effectiveDate: '2024-10-01', oldWage: 973 },
    { prefecture: '滋賀県', newWage: 1017, effectiveDate: '2024-10-01', oldWage: 967 },
    { prefecture: '京都府', newWage: 1086, effectiveDate: '2024-10-01', oldWage: 1008 },
    { prefecture: '大阪府', newWage: 1159, effectiveDate: '2024-10-01', oldWage: 1064 },
    { prefecture: '兵庫県', newWage: 1064, effectiveDate: '2024-10-01', oldWage: 1001 },
    { prefecture: '奈良県', newWage: 1016, effectiveDate: '2024-10-01', oldWage: 936 },
    { prefecture: '和歌山県', newWage: 988, effectiveDate: '2024-10-01', oldWage: 929 },
    { prefecture: '鳥取県', newWage: 951, effectiveDate: '2024-10-01', oldWage: 900 },
    { prefecture: '島根県', newWage: 951, effectiveDate: '2024-10-01', oldWage: 904 },
    { prefecture: '岡山県', newWage: 992, effectiveDate: '2024-10-01', oldWage: 932 },
    { prefecture: '広島県', newWage: 1045, effectiveDate: '2024-10-01', oldWage: 970 },
    { prefecture: '山口県', newWage: 978, effectiveDate: '2024-10-01', oldWage: 928 },
    { prefecture: '徳島県', newWage: 960, effectiveDate: '2024-10-01', oldWage: 896 },
    { prefecture: '香川県', newWage: 970, effectiveDate: '2024-10-01', oldWage: 918 },
    { prefecture: '愛媛県', newWage: 960, effectiveDate: '2024-10-01', oldWage: 897 },
    { prefecture: '高知県', newWage: 952, effectiveDate: '2024-10-01', oldWage: 897 },
    { prefecture: '福岡県', newWage: 1029, effectiveDate: '2024-10-01', oldWage: 941 },
    { prefecture: '佐賀県', newWage: 951, effectiveDate: '2024-10-01', oldWage: 900 },
    { prefecture: '長崎県', newWage: 951, effectiveDate: '2024-10-01', oldWage: 898 },
    { prefecture: '熊本県', newWage: 951, effectiveDate: '2024-10-01', oldWage: 898 },
    { prefecture: '大分県', newWage: 952, effectiveDate: '2024-10-01', oldWage: 899 },
    { prefecture: '宮崎県', newWage: 951, effectiveDate: '2024-10-01', oldWage: 897 },
    { prefecture: '鹿児島県', newWage: 951, effectiveDate: '2024-10-01', oldWage: 897 },
    { prefecture: '沖縄県', newWage: 952, effectiveDate: '2024-10-01', oldWage: 896 },
  ]);
  console.log('Minimum wages seeded');

  // 抜きたい文言マスタ（サンプル）
  // 実際のExcelから1,130件を抽出して追加してください
  await db.insert(removalPhrases).values([
    { category: '福利厚生', phrase: 'WEBエントリー24時間受付中' },
    { category: 'PR・職場情報', phrase: 'LINE公式アカウント案内' },
    { category: '応募資格', phrase: 'かんたんWEB登録' },
    // ... 残りを追加
  ]);
  console.log('Removal phrases seeded');

  // 非掲載フラグ文言
  await db.insert(ngFlagPhrases).values([
    { phrase: '入社祝い金' },
    { phrase: '祝い金' },
    // ... 追加
  ]);
  console.log('NG flag phrases seeded');

  // 年齢制限NG文言
  await db.insert(ageNgPhrases).values([
    { phrase: '歳以上の方大歓迎' },
    { phrase: '歳以下の方大歓迎' },
    // ... 追加
  ]);
  console.log('Age NG phrases seeded');

  // NGワードマスタ
  await db.insert(ngWords).values([
    { word: '不可', category: '不可' },
    { word: '規制あり', category: '規制あり' },
    { word: '同時募集', category: '同時募集' },
    { word: '他店舗', category: '他店舗' },
    { word: 'ネイルNG', category: 'ネイルNG' },
    { word: 'タトゥーNG', category: 'タトゥーNG' },
  ]);
  console.log('NG words seeded');

  console.log('Seed completed!');
}

seed()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  });
