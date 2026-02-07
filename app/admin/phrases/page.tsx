import { 
  getRemovalPhrases, 
  getNgFlagPhrases, 
  getAgeNgPhrases,
  getNgWords,
  deleteRemovalPhrase,
  deleteNgFlagPhrase,
  deleteAgeNgPhrase,
  deleteNgWord,
} from './actions';

export default async function PhrasesPage() {
  const [removalPhrases, ngFlagPhrases, ageNgPhrases, ngWords] = await Promise.all([
    getRemovalPhrases(),
    getNgFlagPhrases(),
    getAgeNgPhrases(),
    getNgWords(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">文言マスタ管理</h1>
        <p className="text-neutral-600 mt-1">
          各種文言の管理
        </p>
      </div>

      {/* 抜きたい文言 */}
      <section className="bg-white border border-neutral-300 rounded-lg p-6">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">
          抜きたい文言（テンプレート除去用）
        </h2>
        <p className="text-sm text-neutral-600 mb-4">
          現在: {removalPhrases.length}件
        </p>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-neutral-100 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-bold text-neutral-900">
                  カテゴリ
                </th>
                <th className="px-4 py-2 text-left text-sm font-bold text-neutral-900">
                  文言
                </th>
                <th className="px-4 py-2 text-left text-sm font-bold text-neutral-900">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {removalPhrases.map((phrase) => (
                <tr key={phrase.id} className="border-t border-neutral-200">
                  <td className="px-4 py-2 text-sm text-neutral-800">
                    {phrase.category}
                  </td>
                  <td className="px-4 py-2 text-sm text-neutral-800 max-w-md truncate">
                    {phrase.phrase}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <form action={async () => {
                      'use server';
                      await deleteRemovalPhrase(phrase.id);
                    }}>
                      <button type="submit" className="text-red-600 hover:text-red-800 font-bold">
                        削除
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 非掲載フラグ文言 */}
      <section className="bg-white border border-neutral-300 rounded-lg p-6">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">
          非掲載フラグ文言
        </h2>
        <p className="text-sm text-neutral-600 mb-4">
          現在: {ngFlagPhrases.length}件
        </p>
        <div className="space-y-2">
          {ngFlagPhrases.map((phrase) => (
            <div key={phrase.id} className="flex items-center justify-between border-b border-neutral-200 py-2">
              <span className="text-sm text-neutral-800">{phrase.phrase}</span>
              <form action={async () => {
                'use server';
                await deleteNgFlagPhrase(phrase.id);
              }}>
                <button type="submit" className="text-red-600 hover:text-red-800 font-bold text-sm">
                  削除
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      {/* 年齢制限NG文言 */}
      <section className="bg-white border border-neutral-300 rounded-lg p-6">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">
          年齢制限NG文言
        </h2>
        <p className="text-sm text-neutral-600 mb-4">
          現在: {ageNgPhrases.length}件
        </p>
        <div className="space-y-2">
          {ageNgPhrases.map((phrase) => (
            <div key={phrase.id} className="flex items-center justify-between border-b border-neutral-200 py-2">
              <span className="text-sm text-neutral-800">{phrase.phrase}</span>
              <form action={async () => {
                'use server';
                await deleteAgeNgPhrase(phrase.id);
              }}>
                <button type="submit" className="text-red-600 hover:text-red-800 font-bold text-sm">
                  削除
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      {/* NGワード */}
      <section className="bg-white border border-neutral-300 rounded-lg p-6">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">
          NGワード（仕事内容チェック用）
        </h2>
        <p className="text-sm text-neutral-600 mb-4">
          現在: {ngWords.length}件
        </p>
        <div className="grid grid-cols-3 gap-4">
          {['不可', '規制あり', '同時募集', '他店舗', 'ネイルNG', 'タトゥーNG'].map((category) => {
            const words = ngWords.filter(w => w.category === category);
            return (
              <div key={category} className="border border-neutral-200 rounded p-4">
                <h3 className="font-bold text-sm text-neutral-900 mb-2">{category}</h3>
                <div className="space-y-1">
                  {words.map((word) => (
                    <div key={word.id} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-800">{word.word}</span>
                      <form action={async () => {
                        'use server';
                        await deleteNgWord(word.id);
                      }}>
                        <button type="submit" className="text-red-600 hover:text-red-800 font-bold">
                          削除
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
