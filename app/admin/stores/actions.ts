'use server';

import { db } from '@/db';
import { stores } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getStores() {
  return await db.select().from(stores).orderBy(stores.branchCode);
}

export async function createStore(formData: FormData) {
  const name = formData.get('name') as string;
  const branchCode = formData.get('branchCode') as string;

  if (!name || !branchCode) {
    throw new Error('名前と拠点コードは必須です');
  }

  await db.insert(stores).values({ name, branchCode });
  revalidatePath('/admin/stores');
}

export async function updateStore(id: number, formData: FormData) {
  const name = formData.get('name') as string;
  const branchCode = formData.get('branchCode') as string;

  if (!name || !branchCode) {
    throw new Error('名前と拠点コードは必須です');
  }

  await db.update(stores).set({ name, branchCode }).where(eq(stores.id, id));
  revalidatePath('/admin/stores');
}

export async function deleteStore(id: number) {
  await db.delete(stores).where(eq(stores.id, id));
  revalidatePath('/admin/stores');
}
