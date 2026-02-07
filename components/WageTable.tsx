'use client';

import { useState } from 'react';
import { deleteWage, updateWage } from '../app/admin/wages/actions';

type Wage = {
  id: number;
  prefecture: string;
  newWage: number;
  effectiveDate: string;
  oldWage: number;
};

export function WageTable({ wages }: { wages: Wage[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const getApplicableWage = (wage: Wage) => {
    return wage.effectiveDate <= today ? wage.newWage : wage.oldWage;
  };

  return (
    <div className="bg-white border border-neutral-300 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
              都道府県
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
              新最低賃金
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
              発効日
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
              旧最低賃金
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
              適用額
            </th>
            <th className="px-4 py-3 text-left text-sm font-bold text-neutral-900">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {wages.map((wage) => {
            const applicableWage = getApplicableWage(wage);
            return (
              <tr key={wage.id} className="border-t border-neutral-200 hover:bg-neutral-50">
                <td className="px-4 py-3 text-sm text-neutral-800">{wage.prefecture}</td>
                <td className="px-4 py-3 text-sm text-neutral-800">{wage.newWage}円</td>
                <td className="px-4 py-3 text-sm text-neutral-800">{wage.effectiveDate}</td>
                <td className="px-4 py-3 text-sm text-neutral-800">{wage.oldWage}円</td>
                <td className="px-4 py-3 text-sm font-bold text-primary">
                  {applicableWage}円
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={async () => {
                      if (confirm('この最低賃金データを削除してもよろしいですか?')) {
                        await deleteWage(wage.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-800 font-bold"
                  >
                    削除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {wages.length === 0 && (
        <div className="p-8 text-center text-neutral-600">
          最低賃金データがありません
        </div>
      )}
    </div>
  );
}
