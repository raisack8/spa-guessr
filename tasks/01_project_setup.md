# 🏗️ プロジェクト初期設定

## 📋 タスク一覧

### 1. Next.js プロジェクト初期化
- [ ] **1.1 Next.js 14 プロジェクト作成**
  - [ ] 1.1.1 `npx create-next-app@latest spa-guessr --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
  - [ ] 1.1.2 プロジェクトディレクトリに移動
  - [ ] 1.1.3 開発サーバー起動確認 (`npm run dev`)
  - [ ] 1.1.4 ブラウザでの表示確認 (`http://localhost:3000`)

- [ ] **1.2 TypeScript設定最適化**
  - [ ] 1.2.1 `tsconfig.json` strict mode有効化
  - [ ] 1.2.2 `"noUncheckedIndexedAccess": true` 追加
  - [ ] 1.2.3 `"exactOptionalPropertyTypes": true` 追加
  - [ ] 1.2.4 型エラーがないことを確認 (`npm run type-check`)

### 2. 依存関係インストール
- [ ] **2.1 UI関連ライブラリ**
  - [ ] 2.1.1 shadcn/ui初期化 (`npx shadcn-ui@latest init`)
  - [ ] 2.1.2 Lucide React インストール (`npm install lucide-react`)
  - [ ] 2.1.3 class-variance-authority インストール (`npm install class-variance-authority`)
  - [ ] 2.1.4 clsx インストール (`npm install clsx`)

- [ ] **2.2 地図関連ライブラリ** 
  - [ ] 2.2.1 Mapbox GL JS インストール (`npm install mapbox-gl`)
  - [ ] 2.2.2 Mapbox GL JS型定義 (`npm install @types/mapbox-gl`)
  - [ ] 2.2.3 Mapbox CSS インポート設定

- [ ] **2.3 データベース関連**
  - [ ] 2.3.1 Drizzle ORM インストール (`npm install drizzle-orm`)
  - [ ] 2.3.2 Drizzle Kit インストール (`npm install -D drizzle-kit`)
  - [ ] 2.3.3 PostgreSQL ドライバー (`npm install postgres`)
  - [ ] 2.3.4 dotenv インストール (`npm install dotenv`)

- [ ] **2.4 状態管理・フォーム**
  - [ ] 2.4.1 Zustand インストール (`npm install zustand`)
  - [ ] 2.4.2 React Hook Form インストール (`npm install react-hook-form`)
  - [ ] 2.4.3 Zod インストール (`npm install zod`)
  - [ ] 2.4.4 React Hook Form Resolvers (`npm install @hookform/resolvers`)

- [ ] **2.5 開発支援ツール**
  - [ ] 2.5.1 ESLint設定強化
  - [ ] 2.5.2 Prettier インストール・設定
  - [ ] 2.5.3 Husky + lint-staged インストール
  - [ ] 2.5.4 @next/bundle-analyzer インストール

### 3. ディレクトリ構造構築
- [ ] **3.1 基本ディレクトリ作成**
  - [ ] 3.1.1 `lib/` ディレクトリ作成
  - [ ] 3.1.2 `lib/actions/` ディレクトリ作成
  - [ ] 3.1.3 `lib/db/` ディレクトリ作成
  - [ ] 3.1.4 `lib/utils/` ディレクトリ作成
  - [ ] 3.1.5 `lib/types/` ディレクトリ作成

- [ ] **3.2 コンポーネントディレクトリ**
  - [ ] 3.2.1 `components/ui/` ディレクトリ作成
  - [ ] 3.2.2 `components/game/` ディレクトリ作成
  - [ ] 3.2.3 `components/map/` ディレクトリ作成
  - [ ] 3.2.4 `components/layout/` ディレクトリ作成

- [ ] **3.3 アプリケーションディレクトリ**
  - [ ] 3.3.1 `app/(game)/` ディレクトリ作成
  - [ ] 3.3.2 `app/api/` ディレクトリ削除（Server Actions使用）
  - [ ] 3.3.3 `public/images/` ディレクトリ作成
  - [ ] 3.3.4 `public/icons/` ディレクトリ作成

### 4. 設定ファイル作成
- [ ] **4.1 環境変数設定**
  - [ ] 4.1.1 `.env.local` ファイル作成
  - [ ] 4.1.2 `.env.example` ファイル作成
  - [ ] 4.1.3 Mapbox アクセストークン設定欄追加
  - [ ] 4.1.4 データベース接続情報設定欄追加
  - [ ] 4.1.5 `.gitignore` に `.env.local` 追加確認

- [ ] **4.2 Next.js設定**
  - [ ] 4.2.1 `next.config.js` でServer Actions有効化
  - [ ] 4.2.2 画像最適化設定追加
  - [ ] 4.2.3 Mapbox ドメイン許可設定
  - [ ] 4.2.4 実験的機能有効化設定

- [ ] **4.3 Tailwind CSS設定**
  - [ ] 4.3.1 `tailwind.config.js` カスタムテーマ設定
  - [ ] 4.3.2 shadcn/ui カラー変数設定
  - [ ] 4.3.3 カスタムアニメーション設定
  - [ ] 4.3.4 レスポンシブブレークポイント設定

- [ ] **4.4 ESLint・Prettier設定**
  - [ ] 4.4.1 `.eslintrc.json` ルール強化
  - [ ] 4.4.2 `.prettierrc` フォーマットルール設定
  - [ ] 4.4.3 `.eslintignore` ファイル作成
  - [ ] 4.4.4 VS Code設定 (`.vscode/settings.json`)

### 5. 基本ファイル作成
- [ ] **5.1 ユーティリティファイル**
  - [ ] 5.1.1 `lib/utils.ts` - cn関数、共通ユーティリティ
  - [ ] 5.1.2 `lib/constants.ts` - プロジェクト定数
  - [ ] 5.1.3 `lib/types/index.ts` - 基本型定義
  - [ ] 5.1.4 `lib/env.ts` - 環境変数バリデーション

- [ ] **5.2 レイアウトファイル**
  - [ ] 5.2.1 `app/layout.tsx` - ルートレイアウト更新
  - [ ] 5.2.2 `app/globals.css` - グローバルスタイル設定
  - [ ] 5.2.3 `app/page.tsx` - ホームページ基本構造
  - [ ] 5.2.4 `app/loading.tsx` - 共通ローディング画面

- [ ] **5.3 shadcn/ui コンポーネント**
  - [ ] 5.3.1 Button コンポーネント追加 (`npx shadcn-ui add button`)
  - [ ] 5.3.2 Card コンポーネント追加 (`npx shadcn-ui add card`)
  - [ ] 5.3.3 Dialog コンポーネント追加 (`npx shadcn-ui add dialog`)
  - [ ] 5.3.4 Progress コンポーネント追加 (`npx shadcn-ui add progress`)

## 🔄 実装順序

### Step 1: プロジェクト基盤 (30分)
1. Next.js プロジェクト作成
2. TypeScript設定最適化
3. 基本ディレクトリ構造作成

### Step 2: 依存関係 (45分)
1. UI関連ライブラリインストール
2. 地図関連ライブラリインストール  
3. データベース関連ライブラリインストール
4. 状態管理・フォーム関連インストール

### Step 3: 設定ファイル (30分)
1. 環境変数設定
2. Next.js設定最適化
3. Tailwind CSS設定
4. ESLint・Prettier設定

### Step 4: 基本ファイル (30分)
1. ユーティリティファイル作成
2. レイアウトファイル作成
3. shadcn/ui コンポーネント追加

## 🎯 完了条件

### 動作確認項目
- [ ] `npm run dev` でローカルサーバーが起動する
- [ ] `npm run build` でビルドが成功する  
- [ ] `npm run type-check` で型エラーがない
- [ ] `npm run lint` でlintエラーがない
- [ ] shadcn/ui コンポーネントが正常に表示される

### ファイル確認項目
- [ ] 必要なディレクトリがすべて作成されている
- [ ] `.env.example` にすべての環境変数が記載されている
- [ ] `package.json` に必要な依存関係がすべて含まれている
- [ ] 設定ファイルがすべて適切に設定されている

### 準備確認項目
- [ ] Mapbox アカウント作成・アクセストークン取得済み
- [ ] PostgreSQL データベース準備済み（ローカルまたはクラウド）
- [ ] 開発環境（Node.js, npm, Git）設定済み

## 📝 実装メモ

### 重要な設定値

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
  env: {
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  },
}

module.exports = nextConfig
```

#### .env.example
```env
# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token_here

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/spa_guessr
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DB=spa_guessr

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### トラブルシューティング

#### Node.js バージョン
- Node.js 18.17.0以上が必要
- `node --version` で確認

#### Mapbox設定エラー
- アクセストークンの形式: `pk.` で始まる
- 環境変数名: `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`

#### TypeScript エラー
- `npm run type-check` で詳細確認
- strict mode対応必須

---

**完了後の次のアクション:** [02_database.md](./02_database.md) でデータベース設計開始 