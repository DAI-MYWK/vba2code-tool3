import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-primary py-4 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white text-xl font-bold hover:underline">
            ホットスタッフ対象案件抽出ツール
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-white hover:underline">
              ホーム
            </Link>
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
      <main className="max-w-7xl mx-auto px-8 py-8">
        {children}
      </main>
    </div>
  );
}
