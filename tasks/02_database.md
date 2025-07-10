# 🗄️ データベース設計・実装

## 📋 タスク一覧

### 1. Drizzle ORM セットアップ
- [ ] **1.1 Drizzle設定ファイル作成**
  - [ ] 1.1.1 `drizzle.config.ts` ファイル作成
  - [ ] 1.1.2 データベース接続設定
  - [ ] 1.1.3 スキーマファイルパス設定
  - [ ] 1.1.4 マイグレーション出力先設定

- [ ] **1.2 データベース接続設定**
  - [ ] 1.2.1 `lib/db/index.ts` データベース接続ファイル作成
  - [ ] 1.2.2 環境変数からの接続設定読み込み
  - [ ] 1.2.3 コネクションプール設定
  - [ ] 1.2.4 データベース接続テスト

### 2. 基本テーブル設計
- [ ] **2.1 温泉宿テーブル (spas)**
  - [ ] 2.1.1 id (UUID) - プライマリキー
  - [ ] 2.1.2 name (TEXT) - 宿名（必須）
  - [ ] 2.1.3 prefecture (TEXT) - 都道府県（必須）
  - [ ] 2.1.4 city (TEXT) - 市区町村
  - [ ] 2.1.5 address (TEXT) - 住所詳細
  - [ ] 2.1.6 lat (DOUBLE PRECISION) - 緯度（必須）
  - [ ] 2.1.7 lng (DOUBLE PRECISION) - 経度（必須）
  - [ ] 2.1.8 description (TEXT) - 宿の説明
  - [ ] 2.1.9 features (TEXT[]) - 特徴タグ配列
  - [ ] 2.1.10 created_at (TIMESTAMP) - 作成日時
  - [ ] 2.1.11 updated_at (TIMESTAMP) - 更新日時

- [ ] **2.2 画像テーブル (spa_images)**
  - [ ] 2.2.1 id (UUID) - プライマリキー
  - [ ] 2.2.2 spa_id (UUID) - 外部キー参照
  - [ ] 2.2.3 image_url (TEXT) - 画像URL（必須）
  - [ ] 2.2.4 image_type (ENUM) - 画像種別（外観、内装、料理、露天風呂など）
  - [ ] 2.2.5 display_order (INTEGER) - 表示順序
  - [ ] 2.2.6 alt_text (TEXT) - 代替テキスト
  - [ ] 2.2.7 created_at (TIMESTAMP) - 作成日時

- [ ] **2.3 ゲームセッションテーブル (game_sessions)**
  - [ ] 2.3.1 id (UUID) - プライマリキー
  - [ ] 2.3.2 user_id (UUID) - ユーザーID（匿名可）
  - [ ] 2.3.3 game_mode (ENUM) - ゲームモード（Classic、NoMove等）
  - [ ] 2.3.4 status (ENUM) - ゲーム状態（playing、completed、abandoned）
  - [ ] 2.3.5 total_score (INTEGER) - 合計スコア
  - [ ] 2.3.6 current_round (INTEGER) - 現在ラウンド（1-5）
  - [ ] 2.3.7 started_at (TIMESTAMP) - 開始日時
  - [ ] 2.3.8 completed_at (TIMESTAMP) - 完了日時
  - [ ] 2.3.9 created_at (TIMESTAMP) - 作成日時

### 3. ゲームロジック用テーブル
- [ ] **3.1 ラウンドテーブル (game_rounds)**
  - [ ] 3.1.1 id (UUID) - プライマリキー
  - [ ] 3.1.2 game_session_id (UUID) - 外部キー参照
  - [ ] 3.1.3 spa_id (UUID) - 外部キー参照
  - [ ] 3.1.4 round_number (INTEGER) - ラウンド番号（1-5）
  - [ ] 3.1.5 guess_lat (DOUBLE PRECISION) - 推測緯度
  - [ ] 3.1.6 guess_lng (DOUBLE PRECISION) - 推測経度
  - [ ] 3.1.7 actual_lat (DOUBLE PRECISION) - 実際の緯度
  - [ ] 3.1.8 actual_lng (DOUBLE PRECISION) - 実際の経度
  - [ ] 3.1.9 distance_km (DOUBLE PRECISION) - 距離（km）
  - [ ] 3.1.10 score (INTEGER) - ラウンドスコア
  - [ ] 3.1.11 time_seconds (INTEGER) - 回答時間（秒）
  - [ ] 3.1.12 created_at (TIMESTAMP) - 作成日時

- [ ] **3.2 推測履歴テーブル (guesses)**
  - [ ] 3.2.1 id (UUID) - プライマリキー
  - [ ] 3.2.2 game_round_id (UUID) - 外部キー参照
  - [ ] 3.2.3 user_id (UUID) - ユーザーID（匿名可）
  - [ ] 3.2.4 spa_id (UUID) - 外部キー参照
  - [ ] 3.2.5 guess_lat (DOUBLE PRECISION) - 推測緯度
  - [ ] 3.2.6 guess_lng (DOUBLE PRECISION) - 推測経度
  - [ ] 3.2.7 distance_km (DOUBLE PRECISION) - 距離（km）
  - [ ] 3.2.8 score (INTEGER) - スコア
  - [ ] 3.2.9 time_seconds (INTEGER) - 回答時間（秒）
  - [ ] 3.2.10 created_at (TIMESTAMP) - 作成日時

### 4. ユーザー関連テーブル
- [ ] **4.1 ユーザーテーブル (users)**
  - [ ] 4.1.1 id (UUID) - プライマリキー
  - [ ] 4.1.2 username (TEXT) - ユーザー名（ユニーク）
  - [ ] 4.1.3 email (TEXT) - メールアドレス（ユニーク）
  - [ ] 4.1.4 avatar_config (JSONB) - アバター設定
  - [ ] 4.1.5 total_games_played (INTEGER) - 総ゲーム数
  - [ ] 4.1.6 best_score (INTEGER) - 最高スコア
  - [ ] 4.1.7 average_score (DOUBLE PRECISION) - 平均スコア
  - [ ] 4.1.8 is_anonymous (BOOLEAN) - 匿名ユーザーフラグ
  - [ ] 4.1.9 created_at (TIMESTAMP) - 作成日時
  - [ ] 4.1.10 updated_at (TIMESTAMP) - 更新日時

- [ ] **4.2 保存済み宿テーブル (saved_spas)**
  - [ ] 4.2.1 id (UUID) - プライマリキー
  - [ ] 4.2.2 user_id (UUID) - 外部キー参照
  - [ ] 4.2.3 spa_id (UUID) - 外部キー参照
  - [ ] 4.2.4 notes (TEXT) - ユーザーメモ
  - [ ] 4.2.5 created_at (TIMESTAMP) - 保存日時

### 5. ランキング・統計テーブル
- [ ] **5.1 週間ランキングテーブル (weekly_rankings)**
  - [ ] 5.1.1 id (UUID) - プライマリキー
  - [ ] 5.1.2 user_id (UUID) - 外部キー参照
  - [ ] 5.1.3 week_start_date (DATE) - 週開始日
  - [ ] 5.1.4 total_score (INTEGER) - 週間合計スコア
  - [ ] 5.1.5 games_played (INTEGER) - 週間ゲーム数
  - [ ] 5.1.6 average_score (DOUBLE PRECISION) - 週間平均スコア
  - [ ] 5.1.7 rank_position (INTEGER) - ランキング順位
  - [ ] 5.1.8 created_at (TIMESTAMP) - 作成日時

- [ ] **5.2 温泉別統計テーブル (spa_statistics)**
  - [ ] 5.2.1 id (UUID) - プライマリキー
  - [ ] 5.2.2 spa_id (UUID) - 外部キー参照
  - [ ] 5.2.3 total_guesses (INTEGER) - 総推測回数
  - [ ] 5.2.4 average_distance (DOUBLE PRECISION) - 平均距離
  - [ ] 5.2.5 average_score (DOUBLE PRECISION) - 平均スコア
  - [ ] 5.2.6 difficulty_rating (DOUBLE PRECISION) - 難易度レーティング
  - [ ] 5.2.7 perfect_guesses (INTEGER) - 完璧な推測回数
  - [ ] 5.2.8 updated_at (TIMESTAMP) - 更新日時

### 6. Drizzle スキーマファイル作成
- [ ] **6.1 メインスキーマファイル**
  - [ ] 6.1.1 `lib/db/schema/index.ts` - エクスポート集約
  - [ ] 6.1.2 `lib/db/schema/spas.ts` - 温泉宿関連テーブル
  - [ ] 6.1.3 `lib/db/schema/games.ts` - ゲーム関連テーブル
  - [ ] 6.1.4 `lib/db/schema/users.ts` - ユーザー関連テーブル
  - [ ] 6.1.5 `lib/db/schema/rankings.ts` - ランキング関連テーブル

- [ ] **6.2 関連設定・制約**
  - [ ] 6.2.1 外部キー制約設定
  - [ ] 6.2.2 インデックス設定
  - [ ] 6.2.3 ENUM型定義
  - [ ] 6.2.4 デフォルト値設定

### 7. マイグレーション作成・実行
- [ ] **7.1 初期マイグレーション**
  - [ ] 7.1.1 `npm run db:generate` でマイグレーション生成
  - [ ] 7.1.2 生成されたSQLファイル確認
  - [ ] 7.1.3 マイグレーション実行 (`npm run db:push`)
  - [ ] 7.1.4 テーブル作成確認

- [ ] **7.2 テストデータ投入**
  - [ ] 7.2.1 `lib/db/seed.ts` シードファイル作成
  - [ ] 7.2.2 サンプル温泉宿データ作成（10件）
  - [ ] 7.2.3 サンプル画像データ作成（各宿6枚）
  - [ ] 7.2.4 シードデータ実行 (`npm run db:seed`)

### 8. データベース操作関数作成
- [ ] **8.1 温泉宿操作関数**
  - [ ] 8.1.1 `lib/db/queries/spas.ts` - 温泉宿クエリ関数
  - [ ] 8.1.2 `getRandomSpa()` - ランダム温泉宿取得
  - [ ] 8.1.3 `getSpaById()` - ID指定温泉宿取得
  - [ ] 8.1.4 `getSpasByPrefecture()` - 都道府県別取得
  - [ ] 8.1.5 `getSpaImages()` - 温泉宿画像取得

- [ ] **8.2 ゲーム操作関数**
  - [ ] 8.2.1 `lib/db/queries/games.ts` - ゲームクエリ関数
  - [ ] 8.2.2 `createGameSession()` - ゲームセッション作成
  - [ ] 8.2.3 `updateGameSession()` - ゲームセッション更新
  - [ ] 8.2.4 `createGameRound()` - ラウンド作成
  - [ ] 8.2.5 `saveGuess()` - 推測保存
  - [ ] 8.2.6 `getGameHistory()` - ゲーム履歴取得

- [ ] **8.3 ユーザー操作関数**
  - [ ] 8.3.1 `lib/db/queries/users.ts` - ユーザークエリ関数
  - [ ] 8.3.2 `createUser()` - ユーザー作成
  - [ ] 8.3.3 `updateUserStats()` - ユーザー統計更新
  - [ ] 8.3.4 `saveSpaForUser()` - 宿保存
  - [ ] 8.3.5 `getUserSavedSpas()` - 保存済み宿取得

### 9. 型定義作成
- [ ] **9.1 テーブル型定義**
  - [ ] 9.1.1 `lib/types/database.ts` - データベース型定義
  - [ ] 9.1.2 Drizzleからの型エクスポート設定
  - [ ] 9.1.3 Insert/Select型の再定義
  - [ ] 9.1.4 関連テーブル結合型定義

- [ ] **9.2 ENUM型定義**
  - [ ] 9.2.1 `GameMode` - ゲームモード列挙型
  - [ ] 9.2.2 `GameStatus` - ゲーム状態列挙型
  - [ ] 9.2.3 `ImageType` - 画像種別列挙型
  - [ ] 9.2.4 型ガード関数作成

## 🔄 実装順序

### Phase 1: 基盤設定 (2時間)
1. Drizzle ORM セットアップ
2. データベース接続設定
3. 基本設定ファイル作成

### Phase 2: スキーマ設計 (3時間)
1. 基本テーブル設計（spas, spa_images）
2. ゲームロジック用テーブル設計
3. ユーザー関連テーブル設計
4. ランキング・統計テーブル設計

### Phase 3: 実装・マイグレーション (2時間)
1. Drizzleスキーマファイル作成
2. マイグレーション作成・実行
3. テストデータ投入

### Phase 4: 操作関数作成 (3時間)
1. 温泉宿操作関数作成
2. ゲーム操作関数作成
3. ユーザー操作関数作成
4. 型定義作成

## 🎯 完了条件

### データベース確認項目
- [ ] すべてのテーブルが正常に作成されている
- [ ] 外部キー制約が正しく設定されている
- [ ] インデックスが適切に設定されている
- [ ] シードデータが正常に投入されている

### 機能確認項目
- [ ] ランダム温泉宿取得が動作する
- [ ] ゲームセッション作成・更新が動作する
- [ ] 推測データの保存・取得が動作する
- [ ] ユーザー統計の更新が動作する

### 型安全性確認項目
- [ ] TypeScript型エラーがない
- [ ] Drizzle型推論が正常に動作する
- [ ] 関連テーブル結合型が正確である

## 📝 実装メモ

### 重要な設定値

#### drizzle.config.ts
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema/index.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

#### lib/db/index.ts
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
```

### パフォーマンス最適化

#### インデックス設定
```sql
-- 座標検索用
CREATE INDEX idx_spas_coordinates ON spas(lat, lng);

-- ゲーム検索用
CREATE INDEX idx_game_sessions_user_created ON game_sessions(user_id, created_at);

-- ランキング検索用
CREATE INDEX idx_weekly_rankings_week ON weekly_rankings(week_start_date, rank_position);
```

#### 複合インデックス
```sql
-- ゲームラウンド検索用
CREATE INDEX idx_game_rounds_session_round ON game_rounds(game_session_id, round_number);

-- ユーザー保存済み宿検索用
CREATE INDEX idx_saved_spas_user_created ON saved_spas(user_id, created_at);
```

### セキュリティ考慮事項

#### 制約設定
- ユーザーIDのUUID形式バリデーション
- 緯度・経度の範囲制限（日本国内）
- スコアの範囲制限（0-5000）
- 時間制限の妥当性チェック

#### データ整合性
- 外部キー制約による参照整合性
- NOT NULL制約による必須データ保証
- UNIQUE制約による重複防止

---

**完了後の次のアクション:** [03_server_actions.md](./03_server_actions.md) でServer Actions実装開始 