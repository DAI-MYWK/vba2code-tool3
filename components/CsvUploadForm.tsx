'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import type { JobRecord } from '@/lib/types';
import { useRouter } from 'next/navigation';

export function CsvUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('CSVファイルを選択してください');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('ファイルを選択してください');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // CSVをパース
      Papa.parse<JobRecord>(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          if (results.errors.length > 0) {
            setError(`CSV解析エラー: ${results.errors[0].message}`);
            setIsProcessing(false);
            return;
          }

          // バリデーション
          if (results.data.length === 0) {
            setError('CSVファイルにデータがありません');
            setIsProcessing(false);
            return;
          }

          if (results.data.length > 30000) {
            setError('データ件数が多すぎます（最大30,000件）');
            setIsProcessing(false);
            return;
          }

          // Server Actionで処理
          try {
            const response = await fetch('/api/process-csv', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ data: results.data }),
            });

            if (!response.ok) {
              throw new Error('処理に失敗しました');
            }

            const result = await response.json();
            
            // 結果画面に遷移
            sessionStorage.setItem('processingResults', JSON.stringify(result));
            router.push('/results');
          } catch (err) {
            setError('処理中にエラーが発生しました');
            setIsProcessing(false);
          }
        },
        error: (error) => {
          setError(`CSV読み込みエラー: ${error.message}`);
          setIsProcessing(false);
        },
      });
    } catch (err) {
      setError('ファイル処理中にエラーが発生しました');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center bg-white">
        {!file ? (
          <div>
            <label
              htmlFor="csv-upload"
              className="cursor-pointer inline-block bg-primary text-white px-6 py-3 rounded font-bold hover:bg-primary-dark transition-colors"
            >
              CSVファイルを選択
            </label>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-slate-600 mt-4 text-sm">
              求人管理システムからエクスポートしたCSVファイル（最大30,000件）
            </p>
          </div>
        ) : (
          <div>
            <p className="text-slate-900 font-bold mb-2">{file.name}</p>
            <p className="text-slate-600 text-sm mb-4">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-primary hover:text-primary-dark underline text-sm font-medium"
            >
              ファイルを変更
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 rounded p-4">
          <p className="text-red-800 font-bold">{error}</p>
        </div>
      )}

      {file && (
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-dark disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? '処理中...' : '処理を開始'}
        </button>
      )}

      {isProcessing && (
        <div className="bg-blue-50 border border-blue-300 rounded p-4">
          <p className="text-slate-800 text-sm">
            処理を実行しています。データ量によっては数分かかる場合があります。
          </p>
        </div>
      )}
    </form>
  );
}
