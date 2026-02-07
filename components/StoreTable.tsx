'use client';

import { useState } from 'react';
import { deleteStore } from '../app/admin/stores/actions';

type Store = {
  id: number;
  name: string;
  branchCode: string;
};

export function StoreTable({ stores }: { stores: Store[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="bg-white border border-neutral-300 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
              ID
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
              店舗名
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
              拠点コード
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id} className="border-t border-neutral-200 hover:bg-neutral-50">
              <td className="px-4 py-3 text-sm text-neutral-800">{store.id}</td>
              <td className="px-4 py-3 text-sm text-neutral-800">{store.name}</td>
              <td className="px-4 py-3 text-sm text-neutral-800 font-mono">{store.branchCode}</td>
              <td className="px-4 py-3 text-sm">
                <button
                  onClick={async () => {
                    if (confirm('この店舗を削除してもよろしいですか?')) {
                      await deleteStore(store.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {stores.length === 0 && (
        <div className="p-8 text-center text-neutral-600">
          店舗データがありません
        </div>
      )}
    </div>
  );
}
