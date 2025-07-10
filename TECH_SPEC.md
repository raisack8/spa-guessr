# SpaGuessr 技術仕様書

本書はSpaGuessrの技術的な実装詳細を定義します。機能仕様は [SPEC.md](./SPEC.md) を参照してください。

## 📚 目次

### 📋 概要ドキュメント
- **[機能仕様書](./SPEC.md)** - 何を作るか（機能要件）
- **[技術仕様書](./TECH_SPEC.md)** - どう作るか（本書）

### 🏗️ 設計ドキュメント
- **[アーキテクチャ設計](./docs/ARCHITECTURE.md)** - システム全体の構成
- **[データベース設計](./docs/DATABASE.md)** - DB設計とスキーマ
- **[コンポーネント設計](./docs/COMPONENTS.md)** - UI/UXコンポーネント

### 🛠️ 実装ドキュメント
- **[Server Actions](./docs/SERVER_ACTIONS.md)** - サーバーサイド実装
- **[Mapbox実装](./docs/MAPBOX.md)** - 地図機能の実装
- **[フォーム実装](./docs/FORMS.md)** - フォーム処理の実装

### 🚀 運用ドキュメント
- **[デプロイ・運用](./docs/DEPLOYMENT.md)** - 本番環境とCI/CD
- **[開発環境](./docs/DEVELOPMENT.md)** - ローカル開発環境
- **[セキュリティ](./docs/SECURITY.md)** - セキュリティ要件

## 🎯 技術スタック概要

### フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **UI/UX**: Tailwind CSS + shadcn/ui
- **地図**: Mapbox GL JS
- **状態管理**: Zustand + Server Actions
- **型システム**: TypeScript

### バックエンド
- **アーキテクチャ**: Server Actions（API Routes不使用）
- **データベース**: PostgreSQL + Drizzle ORM
- **キャッシュ**: Redis
- **認証**: NextAuth.js（将来実装）

### インフラ
- **開発環境**: Docker Compose
- **本番環境**: Vercel + Neon + Upstash
- **CI/CD**: GitHub Actions

## 🚀 クイックスタート

### 1. 環境構築
```bash
# リポジトリクローン
git clone <repository-url>
cd spa-guessr

# 依存関係インストール
npm install

# Docker環境起動
docker-compose up -d

# 環境変数設定
cp .env.example .env.local
# 必要なAPI keyを設定

# データベース初期化
npm run db:generate
npm run db:push
npm run db:seed

# 開発サーバー起動
npm run dev
```

### 2. 重要なファイル
```
src/
├── app/                    # Next.js App Router
├── components/             # Reactコンポーネント
│   ├── game/              # ゲーム関連
│   ├── map/               # 地図関連
│   └── ui/                # UI部品
├── lib/
│   ├── actions/           # Server Actions
│   ├── db/                # データベース
│   └── stores/            # Zustand stores
└── types/                 # TypeScript型定義
```

## 📝 開発フェーズ

### Phase 1: MVP（基本機能）
- [x] プロジェクト初期設定
- [ ] データベース設計
- [ ] Server Actions実装
- [ ] 地図UI実装
- [ ] 基本ゲーム機能

### Phase 2: 機能拡張
- [ ] ランキング機能
- [ ] 保存機能
- [ ] 外部API連携

### Phase 3: UX向上
- [ ] アバターシステム
- [ ] アニメーション
- [ ] 楽観的更新

### Phase 4: 運用最適化
- [ ] 認証システム
- [ ] パフォーマンス最適化
- [ ] セキュリティ強化

## 🔗 関連リンク

- **リポジトリ**: GitHub Repository
- **デプロイ**: Vercel App
- **データベース**: Neon Console
- **API仕様**: Mapbox Docs

---

詳細な実装方法については、各ドキュメントを参照してください。
