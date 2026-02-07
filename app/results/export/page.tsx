'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Papa from 'papaparse';
import type { ProcessingResult, JobRecord } from '@/lib/types';

export default function ExportPage() {
  const router = useRouter();
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = sessionStorage.getItem('processingResults');
    if (!data) {
      router.push('/');
      return;
    }

    try {
      const parsed = JSON.parse(data);
      setResults(parsed.results || []);
    } catch (error) {
      console.error('Failed to parse results:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // 派遣案件のエクスポート（TS/PS/TP/PL/SL）
  const exportDispatchJobs = () => {
    const dispatchJobs = results.filter(r => {
      const koyoKeitai = r.record.koyoKeitai?.trim();
      return ['TS', 'PS', 'TP', 'PL', 'SL'].includes(koyoKeitai) && r.canPublish;
    });

    const cleanedRecords = dispatchJobs.map(r => ({
      ...r.record,
      shigotoNaiyo: r.cleanedData.shigotoNaiyo || r.record.shigotoNaiyo,
      shikakuBiko: r.cleanedData.shikakuBiko || r.record.shikakuBiko,
      prShokubaJoho: r.cleanedData.prShokubaJoho || r.record.prShokubaJoho,
      fukurikoseiSeido: r.cleanedData.fukurikoseiSeido || r.record.fukurikoseiSeido,
    }));

    downloadCsv(cleanedRecords, '派遣案件_エクスポート.csv');
  };

  // 直雇用案件のエクスポート
  const exportDirectHireJobs = () => {
    const directHireJobs = results.filter(r => r.isDirectHire && r.canPublish);

    const cleanedRecords = directHireJobs.map(r => ({
      ...r.record,
      shigotoNaiyo: r.cleanedData.shigotoNaiyo || r.record.shigotoNaiyo,
      shikakuBiko: r.cleanedData.shikakuBiko || r.record.shikakuBiko,
      prShokubaJoho: r.cleanedData.prShokubaJoho || r.record.prShokubaJoho,
      fukurikoseiSeido: r.cleanedData.fukurikoseiSeido || r.record.fukurikoseiSeido,
    }));

    downloadCsv(cleanedRecords, '直雇用案件_エクスポート.csv');
  };

  // 有料職業紹介案件のエクスポート
  const exportVocationalJobs = () => {
    const vocationalJobs = results.filter(r => r.isVocationalIntroduction);

    const records = vocationalJobs.map(r => r.record);
    downloadCsv(records, '有料職業紹介_確認用.csv');
  };

  // CSV生成とダウンロード
  const downloadCsv = (data: JobRecord[], filename: string) => {
    const csv = Papa.unparse(data, {
      header: true,
      quotes: true,
    });

    // BOM付きUTF-8でエンコード（Excelで正しく開くため）
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-neutral-600">読み込み中...</p>
      </div>
    );
  }

  const dispatchCount = results.filter(r => {
    const koyoKeitai = r.record.koyoKeitai?.trim();
    return ['TS', 'PS', 'TP', 'PL', 'SL'].includes(koyoKeitai) && r.canPublish;
  }).length;

  const directHireCount = results.filter(r => r.isDirectHire && r.canPublish).length;
  const vocationalCount = results.filter(r => r.isVocationalIntroduction).length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-primary py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">CSVエクスポート</h1>
          <Link href="/results" className="text-white hover:underline">
            結果画面に戻る
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="space-y-6">
          {/* 派遣案件 */}
          <div className="bg-white border border-neutral-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 mb-2">
                  派遣案件（TS/PS/TP/PL/SL）
                </h2>
                <p className="text-neutral-600 text-sm">
                  掲載可能な派遣案件のクリーニング済みデータをエクスポート
                </p>
                <p className="text-neutral-900 font-bold mt-2">
                  対象件数: {dispatchCount}件
                </p>
              </div>
              <button
                onClick={exportDispatchJobs}
                disabled={dispatchCount === 0}
                className="bg-primary text-white px-6 py-3 rounded font-bold hover:bg-primary-dark disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                ダウンロード
              </button>
            </div>
          </div>

          {/* 直雇用案件 */}
          <div className="bg-white border border-neutral-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 mb-2">
                  直雇用案件
                </h2>
                <p className="text-neutral-600 text-sm">
                  掲載可能な直雇用案件のクリーニング済みデータをエクスポート
                </p>
                <p className="text-neutral-900 font-bold mt-2">
                  対象件数: {directHireCount}件
                </p>
              </div>
              <button
                onClick={exportDirectHireJobs}
                disabled={directHireCount === 0}
                className="bg-primary text-white px-6 py-3 rounded font-bold hover:bg-primary-dark disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                ダウンロード
              </button>
            </div>
          </div>

          {/* 有料職業紹介 */}
          <div className="bg-white border border-neutral-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 mb-2">
                  有料職業紹介案件（PL/SL）
                </h2>
                <p className="text-neutral-600 text-sm">
                  有料職業紹介案件の確認用一覧をエクスポート
                </p>
                <p className="text-neutral-900 font-bold mt-2">
                  対象件数: {vocationalCount}件
                </p>
              </div>
              <button
                onClick={exportVocationalJobs}
                disabled={vocationalCount === 0}
                className="bg-primary text-white px-6 py-3 rounded font-bold hover:bg-primary-dark disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                ダウンロード
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-neutral-900 mb-2">注意事項</h3>
          <ul className="space-y-1 text-sm text-neutral-800">
            <li>エクスポートされるCSVはBOM付きUTF-8形式で、Excelで直接開けます</li>
            <li>テキストフィールド（仕事内容、資格備考、PR・職場情報、福利厚生制度）はテンプレート文言が除去されています</li>
            <li>派遣案件と直雇用案件は掲載可能な案件のみが含まれます</li>
            <li>有料職業紹介案件は企業名の確認用として全件含まれます</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
