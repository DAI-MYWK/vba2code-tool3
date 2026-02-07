'use server';

import { db } from '@/db';
import { minimumWages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getWages() {
  return await db.select().from(minimumWages).orderBy(minimumWages.prefecture);
}

export async function createWage(formData: FormData) {
  const prefecture = formData.get('prefecture') as string;
  const newWage = parseInt(formData.get('newWage') as string);
  const effectiveDate = formData.get('effectiveDate') as string;
  const oldWage = parseInt(formData.get('oldWage') as string);

  if (!prefecture || !newWage || !effectiveDate || !oldWage) {
    throw new Error('全ての項目は必須です');
  }

  await db.insert(minimumWages).values({ prefecture, newWage, effectiveDate, oldWage });
  revalidatePath('/admin/wages');
}

export async function updateWage(id: number, formData: FormData) {
  const prefecture = formData.get('prefecture') as string;
  const newWage = parseInt(formData.get('newWage') as string);
  const effectiveDate = formData.get('effectiveDate') as string;
  const oldWage = parseInt(formData.get('oldWage') as string);

  if (!prefecture || !newWage || !effectiveDate || !oldWage) {
    throw new Error('全ての項目は必須です');
  }

  await db.update(minimumWages)
    .set({ prefecture, newWage, effectiveDate, oldWage, updatedAt: new Date() })
    .where(eq(minimumWages.id, id));
  revalidatePath('/admin/wages');
}

export async function deleteWage(id: number) {
  await db.delete(minimumWages).where(eq(minimumWages.id, id));
  revalidatePath('/admin/wages');
}
