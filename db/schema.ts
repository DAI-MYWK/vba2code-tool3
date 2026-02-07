import { pgTable, serial, text, integer, date, timestamp } from 'drizzle-orm/pg-core';

// 掲載店舗マスタ
export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  branchCode: text('branch_code').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 最低賃金マスタ
export const minimumWages = pgTable('minimum_wages', {
  id: serial('id').primaryKey(),
  prefecture: text('prefecture').notNull().unique(),
  newWage: integer('new_wage').notNull(),
  effectiveDate: date('effective_date').notNull(),
  oldWage: integer('old_wage').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 抜きたい文言マスタ
export const removalPhrases = pgTable('removal_phrases', {
  id: serial('id').primaryKey(),
  category: text('category').notNull(), // 福利厚生、PR・職場情報、応募資格など
  phrase: text('phrase').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 非掲載フラグ文言
export const ngFlagPhrases = pgTable('ng_flag_phrases', {
  id: serial('id').primaryKey(),
  phrase: text('phrase').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 年齢制限NG文言
export const ageNgPhrases = pgTable('age_ng_phrases', {
  id: serial('id').primaryKey(),
  phrase: text('phrase').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// NGワードマスタ（仕事内容チェック用）
export const ngWords = pgTable('ng_words', {
  id: serial('id').primaryKey(),
  word: text('word').notNull(),
  category: text('category').notNull(), // 不可、規制あり、同時募集、他店舗、ネイルNG、タトゥーNG
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
