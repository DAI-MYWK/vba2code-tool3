import Link from 'next/link';
import { CsvUploadForm } from '@/components/CsvUploadForm';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-primary py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">
            ホットスタッフ対象案件抽出ツール
          </h1>
          <nav className="flex gap-6">
            <Link href="/admin/stores" className="text-white hover:underline">
              掲載店舗
            </Link>
            <Link href="/admin/wages" className="text-white hover:underline">
              最低賃金
            </Link>
            <Link href="/admin/phrases" className="text-white hover:underline">
              抜きたい文言
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-8 py-12">
        <div className="bg-white border border-slate-300 rounded-lg p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            CSVファイルをアップロード
          </h2>
          <p className="text-slate-700 mb-6">
            求人管理システムからエクスポートしたCSVファイル（57列）をアップロードしてください。
            掲載可否を自動判定し、非掲載案件を抽出します。
          </p>
          <CsvUploadForm />
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-slate-900 mb-3">処理内容</h3>
          <ul className="space-y-2 text-sm text-slate-800">
            <li className="flex items-start">
              <span className="font-bold mr-2 text-primary">1.</span>
              <span>掲載可否判定（雇用形態 x 掲載店舗マスタ突合）</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2 text-primary">2.</span>
              <span>最低賃金チェック（都道府県別）</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2 text-primary">3.</span>
              <span>企業名チェック（有料職業紹介案件）</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2 text-primary">4.</span>
              <span>NGワード検出（6種類）</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2 text-primary">5.</span>
              <span>テキストクリーニング（テンプレート文言除去）</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2 text-primary">6.</span>
              <span>非掲載理由の自動生成</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
