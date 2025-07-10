# SpaGuessr 詳細仕様書

本書は開発者向けの詳細仕様書です。プロジェクト概要は [README.md](./README.md) を参照してください。

## 1. システム設計

### 1.1 アーキテクチャ概要

#### 開発環境
- **フロントエンド**: Next.js 14 (App Router) + React
- **バックエンド**: Next.js API Routes
- **データベース**: PostgreSQL 15 (Docker)
- **キャッシュ**: Redis 7 (Docker)
- **メール**: Mailhog (Docker)
- **認証**: NextAuth.js (将来実装)

#### 本番環境
- **データベース**: Neon PostgreSQL
- **キャッシュ**: Upstash Redis
- **デプロイ**: Vercel
- **ストレージ**: Vercel Blob

### 1.2 システム構成図
```
[開発環境]
[ユーザー] → [Next.js App:3000] → [API Routes] → [PostgreSQL:5432 (Docker)]
                ↓                                    ↓
[楽天トラベル API] + [Google Places API]         [Redis:6379 (Docker)]
                ↓                                    ↓
[別システム（スクレイピング）] → [データ連携]     [Mailhog:8025 (Docker)]

[本番環境]
[ユーザー] → [Vercel] → [Neon PostgreSQL]
                ↓           ↓
[外部API群] → [Upstash Redis]
```

## 2. 技術スタック詳細

### 2.1 フロントエンド・バックエンド
- **フレームワーク**: Next.js 14 (App Router)
- **UI/UX**: Tailwind CSS, shadcn/ui
- **3D/地図表示**: Three.js, Mapbox GL JS
- **状態管理**: Zustand
- **認証**: NextAuth.js (将来のGoogle連携用)

### 2.2 データベース・インフラ

#### 開発環境
- **DB**: PostgreSQL 15 (Docker)
- **キャッシュ**: Redis 7 (Docker)
- **メール**: Mailhog (Docker)
- **ORM**: Drizzle ORM + Drizzle Kit
- **コンテナ**: Docker Compose

#### 本番環境
- **DB**: Neon PostgreSQL (無料枠充実)
- **キャッシュ**: Upstash Redis
- **ホスティング**: Vercel (無料枠)
- **ストレージ**: Vercel Blob (画像保存)

### 2.3 外部API
- **楽天トラベル**: 宿情報取得
- **Google Places API**: 衛星画像取得
- **スクレイピング**: 別システムにて実装

### 2.4 テスト
- **E2E**: Playwright
- **単体テスト**: Jest + React Testing Library

## 3. データベース設計

### 3.1 テーブル設計

```sql
-- マスタテーブル：ユーザー
CREATE TABLE m_users (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  total_score INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  avatar_config JSONB DEFAULT '{}'
);

-- マスタテーブル：温泉宿
CREATE TABLE m_spas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  rakuten_hotel_id TEXT,
  rakuten_affiliate_url TEXT,
  images JSONB NOT NULL, -- 画像URL配列
  features JSONB DEFAULT '[]', -- 特徴・特典配列
  satellite_image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- トランザクションテーブル：ゲームセッション
CREATE TABLE t_game_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES m_users(id),
  spa_id TEXT REFERENCES m_spas(id),
  guessed_lat DECIMAL(10,8),
  guessed_lng DECIMAL(11,8),
  distance_km DECIMAL(8,2),
  time_seconds INTEGER,
  base_score INTEGER,
  time_multiplier DECIMAL(3,2),
  final_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- トランザクションテーブル：保存された宿
CREATE TABLE t_saved_spas (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES m_users(id),
  spa_id TEXT REFERENCES m_spas(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, spa_id)
);

-- トランザクションテーブル：週間ランキング
CREATE TABLE t_weekly_rankings (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES m_users(id),
  week_start DATE NOT NULL,
  total_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);
```

### 3.2 環境変数設定

#### 開発環境用 (.env.local)
```env
# データベース（Docker）
DATABASE_URL=postgresql://postgres:password@localhost:5432/spaguessr_dev
REDIS_URL=redis://localhost:6379

# 楽天API
RAKUTEN_APPLICATION_ID=
RAKUTEN_AFFILIATE_ID=

# Google API
GOOGLE_PLACES_API_KEY=

# ゲーム設定
GAME_BASE_SCORE=1000
GAME_TIME_MULTIPLIER_MAX=2.0
GAME_CORRECT_DISTANCE_THRESHOLD=50
GAME_PERFECT_DISTANCE_THRESHOLD=5

# 開発環境設定
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-dev-secret

# メール（開発環境）
EMAIL_SERVER_HOST=localhost
EMAIL_SERVER_PORT=1025
EMAIL_FROM=noreply@spaguessr-dev.local
```

#### 本番環境用 (.env.production)
```env
# データベース（Neon）
DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/spaguessr

# Redis（Upstash）
REDIS_URL=rediss://username:password@xxx.upstash.io:6379

# 本番設定
NODE_ENV=production
NEXTAUTH_URL=https://spaguessr.vercel.app
NEXTAUTH_SECRET=your-production-secret

# その他API（本番用）
# ... 楽天、Googleの本番キー
```

### 3.3 Docker構成

#### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: spaguessr_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI

volumes:
  postgres_data:
  redis_data:
```

## 4. 機能仕様

### 4.1 ユーザー管理
- **ローカルストレージ**: 初回アクセス時に一意のユーザーIDを生成
- **永続化**: ユーザー情報をDBに保存
- **将来拡張**: Google OAuth連携でアカウント統合

### 4.2 ゲームフロー

#### 4.2.1 ゲーム開始
1. スタートボタン押下
2. ランダムな温泉宿を選択
3. 画像スライドショー開始（5秒間隔、6枚）

#### 4.2.2 画像表示段階
- **段階1**: 宿の内装・外観画像（6枚、各5秒）
- **段階2**: 上空300m衛星画像からズームアウト（10秒）
- **段階3**: 正解地図表示（答え合わせ）

#### 4.2.3 回答システム
- **地図UI**: 日本地図（衛星画像なし）
- **ピン配置**: クリックで推測地点を指定
- **即時判定**: ピン配置と同時に答え合わせ

### 4.3 得点システム

#### 4.3.1 得点計算
```javascript
// 距離による基本得点
const baseScore = Math.max(0, GAME_BASE_SCORE - (distance_km * 10));

// 時間による倍率（早いほど高倍率）
const timeMultiplier = Math.max(1.0, 
  GAME_TIME_MULTIPLIER_MAX - (time_seconds / 60) * 0.1
);

// 最終得点
const finalScore = Math.floor(baseScore * timeMultiplier);
```

#### 4.3.2 正解判定
- **距離閾値**: 50km以内で「正解」
- **完璧判定**: 5km以内で「完璧」
- **初回ボーナス**: 宿ごとに初回正解時にポイント付与

### 4.4 答え合わせ画面
- **地図表示**: 正解位置と推測位置
- **宿情報**: 名前、地域、特徴
- **アフィリエイトリンク**: 楽天トラベル予約ページ
- **特典ランキング**: その宿の人気特典TOP5
- **保存機能**: 気に入った宿を保存

### 4.5 ランキングシステム
- **週間ランキング**: 直近1週間の累計得点
- **宿別ランキング**: 宿ごとの最高得点
- **更新頻度**: リアルタイム更新

### 4.6 アバターシステム
- **ポイント制**: ゲーム得点とは別のポイント
- **カスタマイズ**: 服装、アクセサリー等
- **ショップ**: ポイント消費でアイテム購入

## 5. バッチ処理仕様

### 5.1 データ収集
- **スクレイピング**: 別システムにて実装
- **楽天トラベル API**: 宿基本情報取得
- **Google Places API**: 衛星画像取得
- **データ連携**: 別システムからAPIまたはDB連携でデータ取得

### 5.2 ランキング更新バッチ
```javascript
// 週間ランキング集計
const rankingUpdate = {
  interval: '0 1 * * 1', // 毎週月曜AM1:00
  process: '過去1週間のスコア集計・ランキング更新'
};
```

## 6. 開発段階

### 6.1 Phase 1: 基本機能（MVP）
- [ ] プロジェクト初期設定
  - [ ] Next.js プロジェクト作成
  - [ ] Docker環境構築（PostgreSQL, Redis, Mailhog）
  - [ ] Drizzle ORM セットアップ
- [ ] データベース設計・セットアップ
  - [ ] スキーマ定義
  - [ ] マイグレーション実行
  - [ ] シードデータ作成
- [ ] 基本的なゲームフロー
  - [ ] 画像表示コンポーネント
  - [ ] タイマー機能
  - [ ] ゲーム状態管理
- [ ] 地図UI実装
  - [ ] Mapbox統合
  - [ ] ピン配置機能
  - [ ] 座標取得
- [ ] 得点システム
  - [ ] 距離計算
  - [ ] 時間倍率計算
  - [ ] スコア保存
- [ ] 答え合わせ画面
  - [ ] 結果表示
  - [ ] 地図での位置表示

### 6.2 Phase 2: データ収集・拡張
- [ ] 楽天API連携
- [ ] Google Places API連携
- [ ] 別システムとのデータ連携
- [ ] ランキング更新バッチ処理

### 6.3 Phase 3: UX向上・収益化
- [ ] アバターシステム
- [ ] ランキング機能
- [ ] 保存機能
- [ ] アフィリエイト連携

### 6.4 Phase 4: 高度な機能
- [ ] Google OAuth連携
- [ ] Playwright テスト
- [ ] パフォーマンス最適化
- [ ] SEO対策

## 7. API仕様

### 7.1 ゲームAPI
```typescript
// ゲーム開始
POST /api/game/start
Response: { gameId: string, spa: SpaData }

// 回答送信
POST /api/game/answer
Body: { gameId: string, lat: number, lng: number, timeSeconds: number }
Response: { score: number, distance: number, correct: boolean }

// 保存
POST /api/spas/save
Body: { spaId: string }
```

### 7.2 ランキングAPI
```typescript
// 週間ランキング
GET /api/rankings/weekly
Response: { rankings: UserRanking[] }

// 宿別ランキング
GET /api/rankings/spa/:spaId
Response: { rankings: SpaRanking[] }
```

## 8. セキュリティ・パフォーマンス

### 8.1 セキュリティ
- **API制限**: レート制限実装
- **データ検証**: Zod によるバリデーション
- **SQL インジェクション対策**: Drizzle ORM使用

### 8.2 パフォーマンス
- **画像最適化**: Next.js Image コンポーネント
- **キャッシュ**: Redis（将来的に）
- **CDN**: Vercel Edge Network活用

## 9. 運用・監視

### 9.1 ログ・監視
- **エラー監視**: Sentry
- **アクセス解析**: Google Analytics
- **パフォーマンス**: Vercel Analytics

### 9.2 バックアップ
- **データベース**: Neon自動バックアップ
- **画像**: Vercel Blob冗長化

## 10. 今後の拡張可能性

- **多言語対応**: 海外ユーザー向け
- **モバイルアプリ**: React Native
- **ソーシャル機能**: 友達対戦
- **AR機能**: 位置情報連携