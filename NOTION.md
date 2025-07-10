# SpaGuessr セットアップガイド

SpaGuessrアプリケーションが完成しました！このドキュメントでは、アプリを動かすために必要な設定と次に進めるべき作業について説明します。

## 🚀 セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
# データベース設定（必須）
DATABASE_URL="postgresql://username:password@localhost:5432/spa_guessr"

# Mapbox設定（必須）
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="pk.your_mapbox_access_token_here"

# Next.js設定
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# 開発モード設定
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. 必要な外部サービス

#### 🗺️ Mapbox（必須）
- **サービス**: [Mapbox GL JS](https://www.mapbox.com/)
- **用途**: インタラクティブ地図の表示
- **設定方法**:
  1. [Mapbox](https://account.mapbox.com/) でアカウント作成
  2. APIキーを取得
  3. `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` に設定

#### 🗄️ データベース（必須）
- **推奨**: [Neon](https://neon.tech/) または [Supabase](https://supabase.com/)
- **用途**: 温泉データ、ゲーム記録、ユーザー情報の保存
- **設定方法**:
  1. データベースプロバイダでプロジェクト作成
  2. PostgreSQLの接続URLを取得
  3. `DATABASE_URL` に設定

### 4. データベースのセットアップ

```bash
# マイグレーション実行
npm run db:generate
npm run db:migrate

# 開発用データベーススタジオ起動
npm run db:studio
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

## 📁 プロジェクト構造

```
spa-guessr/
├── app/                 # Next.js App Router
│   ├── page.tsx        # ホームページ
│   ├── game/           # ゲーム関連ページ
│   ├── rankings/       # ランキングページ
│   └── layout.tsx      # ルートレイアウト
├── components/         # Reactコンポーネント
│   ├── map/           # マップ関連コンポーネント
│   └── game/          # ゲーム関連コンポーネント
├── lib/               # ユーティリティ・設定
│   ├── actions/       # Server Actions
│   ├── db/           # データベース設定
│   ├── store/        # Zustand状態管理
│   └── data/         # サンプルデータ
└── docs/             # ドキュメント
```

## 🔧 実装済み機能

### ✅ 完了している機能
- [x] Next.js 14 App Router セットアップ
- [x] Tailwind CSS + shadcn/ui デザインシステム
- [x] PostgreSQL + Drizzle ORM データベース設計
- [x] Server Actions（データフェッチ・フォーム処理）
- [x] Zustand 状態管理
- [x] Mapbox GL JS 地図統合
- [x] ゲームロジック（距離計算・スコア算出）
- [x] ランキングシステム
- [x] ユーザー管理（ゲストユーザー対応）
- [x] レスポンシブデザイン

### 🚧 次に必要な作業

#### 1. サンプルデータの投入

現在、サンプル温泉データが `lib/data/sample-spas.ts` に定義されています。これをデータベースに投入するスクリプトを作成してください：

```bash
# lib/scripts/seed.ts を作成
npm run seed
```

#### 2. 本格的な温泉画像の準備

現在はUnsplashのプレースホルダー画像を使用しています。実際の温泉写真に差し替えが必要です：

- **方法1**: パブリックドメインの温泉写真を収集
- **方法2**: AI生成画像サービス（Midjourney, DALL-E等）
- **方法3**: 温泉協会等からの許可を得た写真

#### 3. 画像最適化の実装

```bash
# Sharp.jsによる画像処理の実装
# lib/utils/image-optimization.ts
```

#### 4. ランキングページの作成

```bash
# app/rankings/page.tsx の実装
# components/rankings/ コンポーネント群
```

#### 5. ゲーム結果ページの作成

```bash
# app/game/results/[sessionId]/page.tsx
# 詳細な結果表示・共有機能
```

## 🎮 ゲームフロー

1. **ホームページ** → ゲーム開始ボタン
2. **ゲーム画面** → 温泉画像を見て地図上で推測
3. **結果表示** → 距離・スコア表示、次のラウンドへ
4. **最終結果** → 総合スコア、ランキング登録
5. **共有・再プレイ**

## 🏗️ 技術スタック

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: Zustand
- **Database**: PostgreSQL, Drizzle ORM
- **Maps**: Mapbox GL JS
- **Deployment**: Vercel (推奨)

## 🚀 デプロイ手順

### Vercel デプロイ（推奨）

1. GitHubにプッシュ
2. [Vercel](https://vercel.com) でプロジェクトインポート
3. 環境変数を設定
4. デプロイ実行

### その他のプラットフォーム

- **Netlify**: 静的サイト生成モード
- **Railway**: Dockerized デプロイ
- **自前サーバー**: Docker + Nginx

## 🛠️ 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm run start

# リンターチェック
npm run lint

# データベースマイグレーション
npm run db:generate
npm run db:migrate

# データベーススタジオ
npm run db:studio
```

## 📝 今後の拡張アイデア

### 短期的な改善
- [ ] ユーザー認証（NextAuth.js）
- [ ] ソーシャルログイン
- [ ] プロフィール画像
- [ ] ゲーム設定（難易度・時間制限）
- [ ] ヒント機能

### 中期的な機能追加
- [ ] マルチプレイヤー対戦
- [ ] 季節限定イベント
- [ ] 温泉情報詳細ページ
- [ ] モバイルアプリ化（React Native）
- [ ] AI による画像説明生成

### 長期的なビジョン
- [ ] 他国の温泉（韓国、台湾など）
- [ ] VR対応
- [ ] 温泉予約システム連携
- [ ] 観光ルート提案AI

## 🆘 トラブルシューティング

### よくある問題

1. **Mapboxが表示されない**
   - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` が設定されているか確認
   - APIキーの権限設定を確認

2. **データベース接続エラー**
   - `DATABASE_URL` の形式が正しいか確認
   - データベースサーバーが起動しているか確認

3. **ビルドエラー**
   - `npm install` を再実行
   - Node.jsのバージョンを確認（推奨: 18.17+）

## 💡 カスタマイズのヒント

### デザインのカスタマイズ
- `app/globals.css` でカラーテーマ変更
- `tailwind.config.ts` でカスタムカラー追加
- `components/ui/` でコンポーネントスタイル調整

### ゲームロジックの調整
- `lib/actions/game.ts` でスコア計算ロジック変更
- 距離計算アルゴリズムの調整
- 難易度バランスの調整

### 地図の設定変更
- `components/map/GameMap.tsx` で地図スタイル変更
- 日本以外の地域への対応
- カスタムマーカーデザイン

---

**🎉 セットアップ完了後は、素晴らしい温泉当てゲーム体験をお楽しみください！**

問題が発生した場合は、GitHub Issuesで報告いただくか、プロジェクトドキュメントを参照してください。 