import { pgTable, serial, varchar, text, timestamp, integer, decimal, boolean, json, index, foreignKey } from 'drizzle-orm/pg-core'
import { v4 as uuidv4 } from 'uuid'

// 温泉テーブル
export const spas = pgTable('spas', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  prefecture: varchar('prefecture', { length: 50 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  address: text('address'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
  description: text('description'),
  features: json('features').$type<string[]>().default([]),
  difficulty: varchar('difficulty', { length: 10 }).notNull().default('medium'), // easy, medium, hard
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  prefectureIdx: index('prefecture_idx').on(table.prefecture),
  difficultyIdx: index('difficulty_idx').on(table.difficulty),
  coordinatesIdx: index('coordinates_idx').on(table.latitude, table.longitude),
}))

// 画像テーブル
export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  spaId: integer('spa_id').notNull().references(() => spas.id, { onDelete: 'cascade' }),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  originalUrl: text('original_url').notNull(),
  optimizedUrl: text('optimized_url'),
  thumbnailUrl: text('thumbnail_url'),
  alt: text('alt').notNull(),
  width: integer('width'),
  height: integer('height'),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 50 }),
  isPrimary: boolean('is_primary').notNull().default(false),
  status: varchar('status', { length: 20 }).notNull().default('ready'), // pending, processing, ready, error
  metadata: json('metadata').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  spaIdIdx: index('spa_id_idx').on(table.spaId),
  isPrimaryIdx: index('is_primary_idx').on(table.isPrimary),
  statusIdx: index('status_idx').on(table.status),
}))

// ゲームセッションテーブル
export const gameSessions = pgTable('game_sessions', {
  id: varchar('id', { length: 50 }).primaryKey().$defaultFn(() => uuidv4()),
  userId: varchar('user_id', { length: 50 }),
  sessionData: json('session_data').$type<{
    rounds: Array<{
      spaId: number
      imageId: number
      userGuess?: { lat: number; lng: number }
      distance?: number
      score?: number
      timeSpent?: number
    }>
    currentRound: number
    totalScore: number
    status: 'playing' | 'completed' | 'abandoned'
  }>().notNull(),
  totalScore: integer('total_score').default(0),
  roundsCompleted: integer('rounds_completed').default(0),
  status: varchar('status', { length: 20 }).notNull().default('playing'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
  statusIdx: index('status_idx').on(table.status),
  scoreIdx: index('score_idx').on(table.totalScore),
  completedAtIdx: index('completed_at_idx').on(table.completedAt),
}))

// ユーザーテーブル（簡易版）
export const users = pgTable('users', {
  id: varchar('id', { length: 50 }).primaryKey().$defaultFn(() => uuidv4()),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }),
  avatar: text('avatar'),
  totalGames: integer('total_games').default(0),
  totalScore: integer('total_score').default(0),
  bestScore: integer('best_score').default(0),
  averageScore: decimal('average_score', { precision: 8, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
  bestScoreIdx: index('best_score_idx').on(table.bestScore),
}))

// ランキングテーブル（日次）
export const rankings = pgTable('rankings', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 50 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionId: varchar('session_id', { length: 50 }).notNull().references(() => gameSessions.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(),
  roundsCompleted: integer('rounds_completed').notNull(),
  averageDistance: decimal('average_distance', { precision: 10, scale: 2 }),
  completedAt: timestamp('completed_at').notNull(),
  rankDate: varchar('rank_date', { length: 10 }).notNull(), // YYYY-MM-DD
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  rankDateIdx: index('rank_date_idx').on(table.rankDate),
  scoreIdx: index('score_ranking_idx').on(table.score),
  userRankDateIdx: index('user_rank_date_idx').on(table.userId, table.rankDate),
}))

// 画像タグテーブル
export const imageTags = pgTable('image_tags', {
  id: serial('id').primaryKey(),
  imageId: integer('image_id').notNull().references(() => images.id, { onDelete: 'cascade' }),
  tag: varchar('tag', { length: 50 }).notNull(),
  confidence: decimal('confidence', { precision: 3, scale: 2 }), // AI生成タグの信頼度
  source: varchar('source', { length: 20 }).notNull().default('manual'), // manual, ai
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  imageIdIdx: index('image_id_tag_idx').on(table.imageId),
  tagIdx: index('tag_idx').on(table.tag),
}))

// 管理者ログテーブル
export const adminLogs = pgTable('admin_logs', {
  id: serial('id').primaryKey(),
  action: varchar('action', { length: 100 }).notNull(),
  targetType: varchar('target_type', { length: 50 }).notNull(), // spa, image, user
  targetId: varchar('target_id', { length: 50 }).notNull(),
  adminId: varchar('admin_id', { length: 50 }),
  details: json('details').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  actionIdx: index('action_idx').on(table.action),
  targetIdx: index('target_idx').on(table.targetType, table.targetId),
  createdAtIdx: index('admin_created_at_idx').on(table.createdAt),
}))

// TypeScript types
export type Spa = typeof spas.$inferSelect
export type NewSpa = typeof spas.$inferInsert
export type Image = typeof images.$inferSelect
export type NewImage = typeof images.$inferInsert
export type GameSession = typeof gameSessions.$inferSelect
export type NewGameSession = typeof gameSessions.$inferInsert
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Ranking = typeof rankings.$inferSelect
export type NewRanking = typeof rankings.$inferInsert
export type ImageTag = typeof imageTags.$inferSelect
export type NewImageTag = typeof imageTags.$inferInsert
export type AdminLog = typeof adminLogs.$inferSelect
export type NewAdminLog = typeof adminLogs.$inferInsert 