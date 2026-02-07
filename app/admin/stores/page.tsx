import { getStores } from './actions';
import { AddStoreForm } from '@/components/AddStoreForm';
import { StoreTable } from '@/components/StoreTable';

export default async function StoresPage() {
  const stores = await getStores();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">掲載店舗マスタ</h1>
          <p className="text-slate-600 mt-1">
            掲載対象店舗の管理（現在: {stores.length}件）
          </p>
        </div>
        <AddStoreForm />
      </div>
      <StoreTable stores={stores} />
    </div>
  );
}
