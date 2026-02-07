import { getWages } from './actions';
import { WageTable } from '@/components/WageTable';

export default async function WagesPage() {
  const wages = await getWages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">最低賃金マスタ</h1>
        <p className="text-neutral-600 mt-1">
          都道府県別の最低賃金管理（現在: {wages.length}件）
        </p>
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-sm text-neutral-800">
            <span className="font-bold">適用額</span>は発効日に基づいて自動計算されます。
            発効日が到来していれば新最低賃金、未到来であれば旧最低賃金が適用されます。
          </p>
        </div>
      </div>
      <WageTable wages={wages} />
    </div>
  );
}
