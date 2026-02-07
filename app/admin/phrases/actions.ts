'use server';

import { db } from '@/db';
import { removalPhrases, ngFlagPhrases, ageNgPhrases, ngWords } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getRemovalPhrases() {
  return await db.select().from(removalPhrases).orderBy(removalPhrases.category);
}

export async function getNgFlagPhrases() {
  return await db.select().from(ngFlagPhrases);
}

export async function getAgeNgPhrases() {
  return await db.select().from(ageNgPhrases);
}

export async function getNgWords() {
  return await db.select().from(ngWords);
}

export async function createRemovalPhrase(formData: FormData) {
  const category = formData.get('category') as string;
  const phrase = formData.get('phrase') as string;

  if (!category || !phrase) {
    throw new Error('カテゴリと文言は必須です');
  }

  await db.insert(removalPhrases).values({ category, phrase });
  revalidatePath('/admin/phrases');
}

export async function deleteRemovalPhrase(id: number) {
  await db.delete(removalPhrases).where(eq(removalPhrases.id, id));
  revalidatePath('/admin/phrases');
}

export async function createNgFlagPhrase(formData: FormData) {
  const phrase = formData.get('phrase') as string;
  if (!phrase) throw new Error('文言は必須です');
  await db.insert(ngFlagPhrases).values({ phrase });
  revalidatePath('/admin/phrases');
}

export async function deleteNgFlagPhrase(id: number) {
  await db.delete(ngFlagPhrases).where(eq(ngFlagPhrases.id, id));
  revalidatePath('/admin/phrases');
}

export async function createAgeNgPhrase(formData: FormData) {
  const phrase = formData.get('phrase') as string;
  if (!phrase) throw new Error('文言は必須です');
  await db.insert(ageNgPhrases).values({ phrase });
  revalidatePath('/admin/phrases');
}

export async function deleteAgeNgPhrase(id: number) {
  await db.delete(ageNgPhrases).where(eq(ageNgPhrases.id, id));
  revalidatePath('/admin/phrases');
}

export async function createNgWord(formData: FormData) {
  const word = formData.get('word') as string;
  const category = formData.get('category') as string;
  if (!word || !category) throw new Error('全ての項目は必須です');
  await db.insert(ngWords).values({ word, category });
  revalidatePath('/admin/phrases');
}

export async function deleteNgWord(id: number) {
  await db.delete(ngWords).where(eq(ngWords.id, id));
  revalidatePath('/admin/phrases');
}
