'use client';

import { useState } from 'react';
import { createStore } from './actions';

export function AddStoreForm() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white px-6 py-2 rounded font-bold hover:bg-primary-dark"
        >
          新規追加
        </button>
      ) : (
        <form
          action={async (formData) => {
            await createStore(formData);
            setIsOpen(false);
          }}
          className="bg-white border border-neutral-300 rounded-lg p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-neutral-900">新規店舗追加</h3>
          <div>
            <label className="block text-sm font-bold text-neutral-800 mb-2">
              店舗名
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="株式会社ホットスタッフ一宮"
              className="w-full border border-neutral-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-800 mb-2">
              拠点コード
            </label>
            <input
              type="text"
              name="branchCode"
              required
              placeholder="[0901]"
              className="w-full border border-neutral-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded font-bold hover:bg-primary-dark"
            >
              追加
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-neutral-200 text-neutral-800 px-4 py-2 rounded font-bold hover:bg-neutral-300"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
