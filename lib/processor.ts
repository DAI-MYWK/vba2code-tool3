import { db } from '@/db';
import { stores, minimumWages, removalPhrases, ngFlagPhrases, ageNgPhrases, ngWords } from '@/db/schema';
import type { JobRecord, ProcessingResult } from './types';

// マスタデータのキャッシュ
let mastersCache: {
  stores: Array<{ branchCode: string }>;
  wages: Array<{ prefecture: string; newWage: number; effectiveDate: string; oldWage: number }>;
  removalPhrases: Array<{ phrase: string }>;
  ngFlagPhrases: Array<{ phrase: string }>;
  ageNgPhrases: Array<{ phrase: string }>;
  ngWords: Array<{ word: string; category: string }>;
} | null = null;

async function loadMasters() {
  if (mastersCache) return mastersCache;

  const [storesData, wagesData, removalData, ngFlagData, ageNgData, ngWordsData] = await Promise.all([
    db.select({ branchCode: stores.branchCode }).from(stores),
    db.select({
      prefecture: minimumWages.prefecture,
      newWage: minimumWages.newWage,
      effectiveDate: minimumWages.effectiveDate,
      oldWage: minimumWages.oldWage,
    }).from(minimumWages),
    db.select({ phrase: removalPhrases.phrase }).from(removalPhrases),
    db.select({ phrase: ngFlagPhrases.phrase }).from(ngFlagPhrases),
    db.select({ phrase: ageNgPhrases.phrase }).from(ageNgPhrases),
    db.select({ word: ngWords.word, category: ngWords.category }).from(ngWords),
  ]);

  mastersCache = {
    stores: storesData,
    wages: wagesData,
    removalPhrases: removalData,
    ngFlagPhrases: ngFlagData,
    ageNgPhrases: ageNgData,
    ngWords: ngWordsData,
  };

  return mastersCache;
}

// 掲載可否判定
function checkCanPublish(record: JobRecord, masters: Awaited<ReturnType<typeof loadMasters>>): boolean {
  const koyoKeitai = record.koyoKeitai?.trim();
  const targetKeitai = ['TS', 'PS', 'TP', 'PL', 'SL'];

  if (targetKeitai.includes(koyoKeitai)) {
    // 掲載店舗マスタに存在するかチェック
    return masters.stores.some(s => s.branchCode === record.kyotenCode);
  } else {
    // 直雇用の場合は別ルート（掲載店舗に含まれない場合）
    return !masters.stores.some(s => s.branchCode === record.kyotenCode);
  }
}

// 最低賃金チェック
function checkMinimumWage(record: JobRecord, masters: Awaited<ReturnType<typeof loadMasters>>): boolean {
  const prefecture = record.kinmuchiTodofuken?.trim();
  const kyuyoFrom = parseInt(record.kyuyoKingakuFrom);

  if (!prefecture || isNaN(kyuyoFrom)) return true;

  const wageData = masters.wages.find(w => w.prefecture === prefecture);
  if (!wageData) return true;

  // 発効日チェック
  const today = new Date();
  const effectiveDate = new Date(wageData.effectiveDate);
  const applicableWage = effectiveDate <= today ? wageData.newWage : wageData.oldWage;

  return kyuyoFrom >= applicableWage;
}

// 企業名チェック（有料職業紹介）
function checkCompanyName(record: JobRecord): boolean {
  const koyoKeitai = record.koyoKeitai?.trim();
  if (koyoKeitai !== 'PL' && koyoKeitai !== 'SL') return true;

  const kigyoMei = record.kigyoMei || '';
  const ngPatterns = ['(', '（', '有職'];

  return !ngPatterns.some(pattern => kigyoMei.includes(pattern));
}

// NGワード検出
function detectNgWords(record: JobRecord, masters: Awaited<ReturnType<typeof loadMasters>>): string[] {
  const content = record.shigotoNaiyo || '';
  const detected: string[] = [];

  masters.ngWords.forEach(ng => {
    if (content.includes(ng.word)) {
      detected.push(ng.category);
    }
  });

  return [...new Set(detected)];
}

// 非掲載フラグ文言チェック
function checkNgFlagPhrases(record: JobRecord, masters: Awaited<ReturnType<typeof loadMasters>>): boolean {
  const allText = [
    record.kyujinTitle,
    record.shigotoNaiyo,
    record.prShokubaJoho,
    record.fukurikoseiSeido,
  ].join(' ');

  return masters.ngFlagPhrases.some(ng => allText.includes(ng.phrase));
}

// 年齢制限NG文言チェック
function checkAgeNgPhrases(record: JobRecord, masters: Awaited<ReturnType<typeof loadMasters>>): boolean {
  const allText = [
    record.kyujinTitle,
    record.shigotoNaiyo,
    record.shikakuBiko,
    record.prShokubaJoho,
  ].join(' ');

  return masters.ageNgPhrases.some(ng => allText.includes(ng.phrase));
}

// 非掲載理由の生成
function generateUnpublishedReason(
  record: JobRecord,
  canPublish: boolean,
  minimumWageOk: boolean,
  companyNameOk: boolean,
  hasNgFlag: boolean,
  hasAgeNg: boolean
): string {
  if (canPublish) return '';

  const reasons: string[] = [];

  // 優先順位付き判定
  if (!companyNameOk) {
    reasons.push('有料職業紹介案件だが、企業名が正確ではないため');
  }

  const gyoshuBiko = record.gyoshuBiko || '';
  if (gyoshuBiko.length > 16) {
    reasons.push('職種名が適切でないため（16文字超過）');
  }

  if (hasNgFlag) {
    reasons.push('入社祝い金等のNGワードを含むため');
  }

  if (hasAgeNg) {
    reasons.push('年齢表記を含むため');
  }

  if (!minimumWageOk) {
    reasons.push('最低賃金を下回っているため');
  }

  if (reasons.length === 0) {
    reasons.push('非掲載フラグ文言に該当するため');
  }

  return reasons.join('、');
}

// テキストクリーニング
function cleanText(text: string, masters: Awaited<ReturnType<typeof loadMasters>>): string {
  let cleaned = text;

  // テンプレート文言を除去
  masters.removalPhrases.forEach(phrase => {
    cleaned = cleaned.replaceAll(phrase.phrase, '');
  });

  // 改行コードの正規化
  cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  return cleaned.trim();
}

// メイン処理
export async function processJobRecords(records: JobRecord[]): Promise<ProcessingResult[]> {
  const masters = await loadMasters();
  
  return records.map(record => {
    const canPublish = checkCanPublish(record, masters);
    const minimumWageOk = checkMinimumWage(record, masters);
    const companyNameOk = checkCompanyName(record);
    const ngWordsDetected = detectNgWords(record, masters);
    const hasNgFlag = checkNgFlagPhrases(record, masters);
    const hasAgeNg = checkAgeNgPhrases(record, masters);

    const reasonForUnpublished = generateUnpublishedReason(
      record,
      canPublish,
      minimumWageOk,
      companyNameOk,
      hasNgFlag,
      hasAgeNg
    );

    const koyoKeitai = record.koyoKeitai?.trim();
    const isVocationalIntroduction = koyoKeitai === 'PL' || koyoKeitai === 'SL';
    const isDirectHire = !['TS', 'PS', 'TP', 'PL', 'SL'].includes(koyoKeitai);

    // クリーニング済みデータ
    const cleanedData: Partial<JobRecord> = {
      shigotoNaiyo: cleanText(record.shigotoNaiyo || '', masters),
      shikakuBiko: cleanText(record.shikakuBiko || '', masters),
      prShokubaJoho: cleanText(record.prShokubaJoho || '', masters),
      fukurikoseiSeido: cleanText(record.fukurikoseiSeido || '', masters),
    };

    return {
      record,
      canPublish: canPublish && reasonForUnpublished === '',
      reasonForUnpublished,
      ngWords: ngWordsDetected,
      isVocationalIntroduction,
      isDirectHire,
      minimumWageViolation: !minimumWageOk,
      cleanedData,
    };
  });
}
