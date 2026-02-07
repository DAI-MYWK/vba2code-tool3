// CSVデータの型定義（57列）
export type JobRecord = {
  dataKubun: string;           // データ区分
  kyujinCode: string;          // 求人コード
  kyotenCode: string;          // 拠点コード
  kigyoMei: string;            // 企業名
  busho: string;               // 部署
  kyujinTitle: string;         // 求人タイトル
  gyoshuSmallCategoryCode: string; // 業種(職種)小カテゴリコード
  gyoshuBiko: string;          // 業種(職種)備考
  kinmuchiPostalCode: string;  // 勤務地(郵便番号)
  kinmuchiCityCode: string;    // 勤務地(市区町村コード)
  kinmuchiTodofuken: string;   // 勤務地(都道府県)
  kinmuchiShikuchoson: string; // 勤務地(市区町村)
  kinmuchiBanchi: string;      // 勤務地(番地、ビル名)
  kinmuchiBiko: string;        // 勤務地備考
  kinmuchiKigyoJusho: string;  // 勤務地(企業)住所
  kyuyoKubun: string;          // 給与区分
  kyuyoKingakuFrom: string;    // 給与金額(From)
  kyuyoKingakuTo: string;      // 給与金額(To)
  kyuyoKingakuKubun: string;   // 給与金額区分
  kyuyoBiko: string;           // 給与備考
  gesshu: string;              // 月収
  gesshuRei: string;           // 月収例
  moyoriRosenMei: string;      // 最寄駅(路線名)
  moyoriEkiMei: string;        // 最寄駅(駅名)
  kyori: string;               // 距離
  moyoriBiko: string;          // 最寄駅備考
  kinmuJikan1From: string;     // 勤務時間1(From)
  kinmuJikan1To: string;       // 勤務時間1(To)
  kinmuJikan2From: string;     // 勤務時間2(From)
  kinmuJikan2To: string;       // 勤務時間2(To)
  kinmuJikan3From: string;     // 勤務時間3(From)
  kinmuJikan3To: string;       // 勤務時間3(To)
  kinmuJikan4From: string;     // 勤務時間4(From)
  kinmuJikan4To: string;       // 勤務時間4(To)
  kinmuJikanBiko: string;      // 勤務時間備考
  kinmuKeitai: string;         // 勤務形態
  kyujitsu: string;            // 休日
  kyujitsuBiko: string;        // 休日備考
  shikakuKeiken: string;       // 資格・経験
  shikakuBiko: string;         // 資格備考
  koyoKeitai: string;          // 雇用形態
  kikan: string;               // 期間
  kikanBiko: string;           // 期間備考
  shigotoNaiyo: string;        // 仕事内容
  sonotaTitle: string;         // その他タイトル
  sonotaNaiyo: string;         // その他内容
  memo: string;                // メモ
  shokubaDirect: string;       // 職場環境
  tokuchou: string;            // 特徴
  dogaId: string;              // 動画ID
  gakureki: string;            // 学歴
  prShokubaJoho: string;       // PR・職場情報
  jigyoNaiyo: string;          // 事業内容
  saiyoYoteiNinzu: string;     // 採用予定人数
  fukurikoseiSeido: string;    // 福利厚生制度
  kokaiKubun: string;          // 公開区分
  sakujoKubun: string;         // 削除区分
};

// 処理結果の型
export type ProcessingResult = {
  record: JobRecord;
  canPublish: boolean;
  reasonForUnpublished: string;
  ngWords: string[];
  isVocationalIntroduction: boolean;
  isDirectHire: boolean;
  minimumWageViolation: boolean;
  cleanedData: Partial<JobRecord>;
};
