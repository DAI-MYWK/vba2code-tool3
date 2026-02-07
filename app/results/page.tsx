'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ProcessingResult } from '@/lib/types';

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'canPublish' | 'cannotPublish'>('all');
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
      setStats(parsed.stats || {});
    } catch (error) {
      console.error('Failed to parse results:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-neutral-600">読み込み中...</p>
      </div>
    );
  }

  const filteredResults = results.filter(r => {
    if (filter === 'canPublish') return r.canPublish;
    if (filter === 'cannotPublish') return !r.canPublish;
    return true;
  });

  const unpublishedResults = results.filter(r => !r.canPublish);

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-primary py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">処理結果</h1>
          <div className="flex gap-4">
            <Link href="/" className="text-white hover:underline">
              ホームに戻る
            </Link>
            <Link href="/results/export" className="bg-white text-primary px-4 py-2 rounded font-bold hover:bg-neutral-100">
              エクスポート
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* 統計情報 */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-neutral-300 rounded-lg p-6">
              <p className="text-neutral-600 text-sm mb-1">総件数</p>
              <p className="text-3xl font-bold text-neutral-900">{stats.total}</p>
            </div>
            <div className="bg-white border border-green-300 rounded-lg p-6">
              <p className="text-neutral-600 text-sm mb-1">掲載可能</p>
              <p className="text-3xl font-bold text-green-600">{stats.canPublish}</p>
            </div>
            <div className="bg-white border border-red-300 rounded-lg p-6">
              <p className="text-neutral-600 text-sm mb-1">非掲載</p>
              <p className="text-3xl font-bold text-red-600">{stats.cannotPublish}</p>
            </div>
          </div>
        )}

        {/* フィルター */}
        <div className="bg-white border border-neutral-300 rounded-lg p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded font-bold ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              すべて ({results.length})
            </button>
            <button
              onClick={() => setFilter('canPublish')}
              className={`px-4 py-2 rounded font-bold ${
                filter === 'canPublish'
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              掲載可能 ({results.filter(r => r.canPublish).length})
            </button>
            <button
              onClick={() => setFilter('cannotPublish')}
              className={`px-4 py-2 rounded font-bold ${
                filter === 'cannotPublish'
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              非掲載 ({unpublishedResults.length})
            </button>
          </div>
        </div>

        {/* 非掲載案件テーブル */}
        {filter === 'cannotPublish' && (
          <div className="bg-white border border-neutral-300 rounded-lg overflow-hidden mb-8">
            <div className="bg-red-50 border-b border-red-200 px-6 py-4">
              <h2 className="text-lg font-bold text-neutral-900">非掲載案件一覧</h2>
              <p className="text-sm text-neutral-600 mt-1">
                以下の案件は掲載不可と判定されました
              </p>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full">
                <thead className="bg-neutral-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
                      求人コード
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
                      企業名
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
                      求人タイトル
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
                      非掲載理由
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
                      NGワード
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {unpublishedResults.map((result, idx) => (
                    <tr key={idx} className="border-t border-neutral-200 hover:bg-neutral-50">
                      <td className="px-4 py-3 text-sm text-neutral-800 font-mono">
                        {result.record.kyujinCode}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-800">
                        {result.record.kigyoMei}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-800 max-w-xs truncate">
                        {result.record.kyujinTitle}
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600">
                        {result.reasonForUnpublished}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {result.ngWords.length > 0 ? (
                          <span className="text-orange-600 font-bold">
                            {result.ngWords.join(', ')}
                          </span>
                        ) : (
                          <span className="text-neutral-400">なし</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 全件表示 */}
        {filter === 'all' && (
          <div className="bg-white border border-neutral-300 rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full">
                <thead className="bg-neutral-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
                      求人コード
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
                      企業名
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
                      判定
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
                      雇用形態
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result, idx) => (
                    <tr
                      key={idx}
                      className={`border-t border-neutral-200 ${
                        result.canPublish ? 'hover:bg-green-50' : 'hover:bg-red-50'
                      }`}
                    >
                      <td className="px-4 py-3 text-sm text-neutral-800 font-mono">
                        {result.record.kyujinCode}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-800">
                        {result.record.kigyoMei}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {result.canPublish ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-bold text-xs">
                            掲載可能
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded font-bold text-xs">
                            非掲載
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-800">
                        {result.record.koyoKeitai}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 掲載可能のみ */}
        {filter === 'canPublish' && (
          <div className="bg-white border border-neutral-300 rounded-lg overflow-hidden">
            <div className="bg-green-50 border-b border-green-200 px-6 py-4">
              <h2 className="text-lg font-bold text-neutral-900">掲載可能案件一覧</h2>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full">
                <thead className="bg-neutral-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
                      求人コード
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
                      企業名
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
                      求人タイトル
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
                      雇用形態
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result, idx) => (
                    <tr key={idx} className="border-t border-neutral-200 hover:bg-neutral-50">
                      <td className="px-4 py-3 text-sm text-neutral-800 font-mono">
                        {result.record.kyujinCode}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-800">
                        {result.record.kigyoMei}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-800 max-w-md truncate">
                        {result.record.kyujinTitle}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-800">
                        {result.record.koyoKeitai}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
