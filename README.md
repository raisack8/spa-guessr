# SpaGuessr

日本の温泉宿の画像を見て、所在地を推測するWebゲーム。GeoGuessrの温泉版です。

## 🎯 概要

- 温泉宿の画像6枚を5秒ずつ表示
- 衛星画像からのヒント
- 日本地図でピンを刺して回答
- 距離と時間による得点システム
- 楽天トラベルのアフィリエイト連携

## 🚀 技術スタック

### 開発環境
- **コンテナ**: Docker + Docker Compose
- **データベース**: PostgreSQL 15 (Docker)
- **キャッシュ**: Redis 7 (Docker)
- **メール**: Mailhog (開発用SMTPサーバー)

### アプリケーション
- **Frontend & Backend**: Next.js 14 (App Router)
- **Database ORM**: Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Maps**: Mapbox GL JS
- **3D**: Three.js

### 本番環境
- **Database**: Neon PostgreSQL
- **Hosting**: Vercel
- **Storage**: Vercel Blob

## 📋 セットアップ

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd spaguessr
```

### 2. 環境変数の設定
```bash
cp .env.example .env.local
# 必要なAPI keyを設定
```

### 3. Docker環境の起動
```bash
# 開発環境全体を起動（DB、Redis等）
docker-compose up -d

# 初回のみ：データベースの初期化
npm run db:generate
npm run db:push
npm run db:seed  # サンプルデータの投入
```

### 4. 依存関係のインストールと開発サーバー起動
```bash
npm install
npm run dev
```

### 5. アクセス
- **アプリケーション**: http://localhost:3000
- **データベース管理**: http://localhost:5432 (PostgreSQL)
- **Drizzle Studio**: http://localhost:4983
- **Mailhog** (メール確認): http://localhost:8025

## 🗂️ プロジェクト構成

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── game/           # ゲーム画面
│   └── rankings/       # ランキング画面
├── components/         # Reactコンポーネント
│   ├── game/          # ゲーム関連
│   ├── map/           # 地図関連
│   └── ui/            # UI部品
├── lib/               # ユーティリティ
│   ├── db/            # データベース
│   └── utils/         # 共通関数
└── types/             # TypeScript型定義
```

## 📊 データベース構成

### マスタテーブル
- `m_users`: ユーザー情報
- `m_spas`: 温泉宿情報

### トランザクションテーブル
- `t_game_sessions`: ゲームセッション
- `t_saved_spas`: 保存された宿
- `t_weekly_rankings`: 週間ランキング

## 🎮 ゲームフロー

1. スタートボタン押下
2. 温泉宿画像を6枚表示（各5秒）
3. 衛星画像ヒント表示
4. 日本地図でピンを刺す
5. 距離と時間で得点計算
6. 答え合わせ・アフィリエイトリンク表示

## 🏆 得点システム

```javascript
// 基本得点（距離による）
const baseScore = Math.max(0, 1000 - (distance_km * 10));

// 時間倍率（早いほど高倍率）
const timeMultiplier = Math.max(1.0, 2.0 - (time_seconds / 60) * 0.1);

// 最終得点
const finalScore = Math.floor(baseScore * timeMultiplier);
```

## 🔧 開発コマンド

### Docker関連
```bash
# 開発環境の起動
docker-compose up -d

# 開発環境の停止
docker-compose down

# ログの確認
docker-compose logs -f

# コンテナの再ビルド
docker-compose build --no-cache
```

### アプリケーション
```bash
# 開発サーバー
npm run dev

# ビルド
npm run build
npm run start
```

### データベース
```bash
# マイグレーション生成
npm run db:generate

# マイグレーション実行
npm run db:push

# シード実行
npm run db:seed

# Drizzle Studio（DB管理画面）
npm run db:studio
```

### テスト
```bash
# Unit tests
npm run test
npm run test:watch

# E2E tests (Playwright)
npm run test:e2e
npm run test:e2e:ui
```

## 🌟 主な機能

- **ゲームプレイ**: 画像から温泉地を推測
- **ランキング**: 週間・宿別ランキング
- **保存機能**: 気に入った宿をブックマーク
- **アバター**: ポイントでカスタマイズ
- **アフィリエイト**: 楽天トラベル連携

## 📖 詳細仕様

詳細な仕様書は [SPEC.md](./SPEC.md) を参照してください。

## 🚀 デプロイ

Vercelに自動デプロイ設定済み。`main`ブランチにpushすると自動でビルド・デプロイされます。

## 🤝 開発ガイド

1. **Phase 1**: 基本機能（MVP）
2. **Phase 2**: データ収集・拡張
3. **Phase 3**: UX向上・収益化
4. **Phase 4**: 高度な機能

各フェーズの詳細は [SPEC.md](./SPEC.md) を参照してください。

## 📝 License

MIT License