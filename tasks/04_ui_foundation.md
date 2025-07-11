# 🎨 基礎UI実装

## 📋 タスク一覧

### 1. レイアウト基盤構築
- [ ] **1.1 ルートレイアウト設定**
  - [ ] 1.1.1 `app/layout.tsx` 最適化
    - [ ] 1.1.1.1 HTML基本設定（lang, meta tags）
    - [ ] 1.1.1.2 Tailwind CSS読み込み確認
    - [ ] 1.1.1.3 フォント設定（Inter, 日本語フォント）
    - [ ] 1.1.1.4 Mapbox CSS読み込み設定
  
  - [ ] 1.1.2 `app/globals.css` 全体スタイル設定
    - [ ] 1.1.2.1 CSS変数定義（shadcn/ui対応）
    - [ ] 1.1.2.2 Mapbox GL スタイル読み込み
    - [ ] 1.1.2.3 カスタムCSS変数定義
    - [ ] 1.1.2.4 レスポンシブブレークポイント確認

- [ ] **1.2 共通レイアウトコンポーネント**
  - [ ] 1.2.1 `components/layout/Header.tsx` 作成
    - [ ] 1.2.1.1 ロゴ・タイトル表示
    - [ ] 1.2.1.2 ナビゲーションメニュー
    - [ ] 1.2.1.3 ユーザーアイコン・設定ボタン
    - [ ] 1.2.1.4 スコア表示エリア（ゲーム中）
  
  - [ ] 1.2.2 `components/layout/Footer.tsx` 作成
    - [ ] 1.2.2.1 著作権表示
    - [ ] 1.2.2.2 リンク集（利用規約、プライバシーポリシー）
    - [ ] 1.2.2.3 SNSリンク
    - [ ] 1.2.2.4 楽天トラベルアフィリエイト表示

### 2. ホームページUI
- [ ] **2.1 メインビジュアル**
  - [ ] 2.1.1 `app/page.tsx` ホームページ構造作成
  - [ ] 2.1.2 `components/home/HeroSection.tsx` 作成
    - [ ] 2.1.2.1 メインタイトル・キャッチコピー
    - [ ] 2.1.2.2 ゲーム説明文
    - [ ] 2.1.2.3 背景画像・温泉イメージ
    - [ ] 2.1.2.4 「ゲームを始める」大ボタン

- [ ] **2.2 ゲーム機能紹介**
  - [ ] 2.2.1 `components/home/FeatureSection.tsx` 作成
    - [ ] 2.2.1.1 機能カード1：温泉宿当てゲーム
    - [ ] 2.2.1.2 機能カード2：ランキング機能
    - [ ] 2.2.1.3 機能カード3：お気に入り保存
    - [ ] 2.2.1.4 機能カード4：統計・レポート
  
  - [ ] 2.2.2 `components/home/HowToPlaySection.tsx` 作成
    - [ ] 2.2.2.1 遊び方ステップ1：画像を見る
    - [ ] 2.2.2.2 遊び方ステップ2：地図上にピンを置く
    - [ ] 2.2.2.3 遊び方ステップ3：スコアを確認
    - [ ] 2.2.2.4 遊び方ステップ4：ランキングで競う

### 3. ゲーム基本UI
- [ ] **3.1 ゲーム画面レイアウト**
  - [ ] 3.1.1 `app/(game)/game/page.tsx` ゲームページ作成
  - [ ] 3.1.2 `components/game/GameLayout.tsx` 分割画面レイアウト
    - [ ] 3.1.2.1 左側：画像表示エリア（50%幅）
    - [ ] 3.1.2.2 右側：地図表示エリア（50%幅）
    - [ ] 3.1.2.3 上部：ゲーム情報バー
    - [ ] 3.1.2.4 下部：操作ボタンエリア

- [ ] **3.2 ゲーム情報表示**
  - [ ] 3.2.1 `components/game/GameInfoBar.tsx` 作成
    - [ ] 3.2.1.1 現在ラウンド表示（1/5）
    - [ ] 3.2.1.2 経過時間タイマー
    - [ ] 3.2.1.3 現在スコア表示
    - [ ] 3.2.1.4 ゲームモード表示
  
  - [ ] 3.2.2 `components/game/ProgressIndicator.tsx` 作成
    - [ ] 3.2.2.1 5ラウンド進行状況表示
    - [ ] 3.2.2.2 各ラウンドのスコア表示
    - [ ] 3.2.2.3 完了/未完了の視覚的表示
    - [ ] 3.2.2.4 現在ラウンドのハイライト

### 4. ボタン・操作UI
- [ ] **4.1 基本ボタンコンポーネント**
  - [ ] 4.1.1 `components/ui/game-button.tsx` ゲーム専用ボタン
    - [ ] 4.1.1.1 Primary（推測送信など）
    - [ ] 4.1.1.2 Secondary（次へ進む、戻るなど）
    - [ ] 4.1.1.3 Danger（リセット、やり直しなど）
    - [ ] 4.1.1.4 Loading状態対応

- [ ] **4.2 ゲーム操作ボタン**
  - [ ] 4.2.1 `components/game/ControlButtons.tsx` 作成
    - [ ] 4.2.1.1 「推測を送信」ボタン
    - [ ] 4.2.1.2 「次のラウンドへ」ボタン
    - [ ] 4.2.1.3 「ゲームをやり直す」ボタン
    - [ ] 4.2.1.4 「お気に入りに保存」ボタン

### 5. カード・パネルUI
- [ ] **5.1 結果表示カード**
  - [ ] 5.1.1 `components/game/ResultCard.tsx` 作成
    - [ ] 5.1.1.1 ラウンド結果表示カード
    - [ ] 5.1.1.2 スコア・距離表示
    - [ ] 5.1.1.3 正解位置・推測位置表示
    - [ ] 5.1.1.4 温泉宿詳細情報表示
  
  - [ ] 5.1.2 `components/game/FinalResultCard.tsx` 作成
    - [ ] 5.1.2.1 最終スコア表示
    - [ ] 5.1.2.2 全ラウンド結果一覧
    - [ ] 5.1.2.3 ランキング順位表示
    - [ ] 5.1.2.4 シェア機能ボタン

- [ ] **5.2 温泉宿情報カード**
  - [ ] 5.2.1 `components/spa/SpaInfoCard.tsx` 作成
    - [ ] 5.2.1.1 宿名・所在地表示
    - [ ] 5.2.1.2 特徴タグ表示
    - [ ] 5.2.1.3 楽天トラベルリンク
    - [ ] 5.2.1.4 お気に入り保存ボタン

### 6. フォームUI
- [ ] **6.1 基本フォームコンポーネント**
  - [ ] 6.1.1 `components/ui/form-input.tsx` 作成
    - [ ] 6.1.1.1 テキスト入力フィールド
    - [ ] 6.1.1.2 バリデーション表示
    - [ ] 6.1.1.3 エラーメッセージ表示
    - [ ] 6.1.1.4 ラベル・ヘルプテキスト

- [ ] **6.2 ユーザー情報フォーム**
  - [ ] 6.2.1 `components/user/UserProfileForm.tsx` 作成
    - [ ] 6.2.1.1 ユーザー名入力
    - [ ] 6.2.1.2 アバター選択
    - [ ] 6.2.1.3 設定項目（通知など）
    - [ ] 6.2.1.4 保存・キャンセルボタン

### 7. ローディング・エラーUI
- [ ] **7.1 ローディング状態**
  - [ ] 7.1.1 `components/ui/loading-spinner.tsx` 作成
    - [ ] 7.1.1.1 基本スピナーアニメーション
    - [ ] 7.1.1.2 サイズバリエーション（sm, md, lg）
    - [ ] 7.1.1.3 カラーバリエーション
    - [ ] 7.1.1.4 テキスト付きローディング
  
  - [ ] 7.1.2 `components/game/GameLoading.tsx` 作成
    - [ ] 7.1.2.1 ゲーム開始時ローディング
    - [ ] 7.1.2.2 「温泉宿を選択中...」表示
    - [ ] 7.1.2.3 進行状況インジケーター
    - [ ] 7.1.2.4 スケルトンUI表示

- [ ] **7.2 エラー状態**
  - [ ] 7.2.1 `components/ui/error-message.tsx` 作成
    - [ ] 7.2.1.1 基本エラーメッセージ表示
    - [ ] 7.2.1.2 エラーレベル（info, warning, error）
    - [ ] 7.2.1.3 アクションボタン付きエラー
    - [ ] 7.2.1.4 閉じるボタン機能
  
  - [ ] 7.2.2 `app/error.tsx` エラー境界作成
    - [ ] 7.2.2.1 予期しないエラー画面
    - [ ] 7.2.2.2 エラー詳細表示（開発環境）
    - [ ] 7.2.2.3 「再試行」ボタン
    - [ ] 7.2.2.4 ホームに戻るボタン

### 8. ナビゲーション・モーダル
- [ ] **8.1 ナビゲーションUI**
  - [ ] 8.1.1 `components/layout/Navigation.tsx` 作成
    - [ ] 8.1.1.1 メインメニュー（ホーム、ゲーム、ランキング）
    - [ ] 8.1.1.2 ユーザーメニュー（プロフィール、設定）
    - [ ] 8.1.1.3 モバイル対応ハンバーガーメニュー
    - [ ] 8.1.1.4 アクティブ状態表示

- [ ] **8.2 モーダル・ダイアログ**
  - [ ] 8.2.1 `components/ui/confirmation-dialog.tsx` 作成
    - [ ] 8.2.1.1 確認ダイアログ基本形
    - [ ] 8.2.1.2 「はい」「いいえ」ボタン
    - [ ] 8.2.1.3 カスタムメッセージ対応
    - [ ] 8.2.1.4 ESCキー・背景クリックで閉じる
  
  - [ ] 8.2.2 `components/game/GameSettingsModal.tsx` 作成
    - [ ] 8.2.2.1 ゲーム設定変更
    - [ ] 8.2.2.2 音声設定オン/オフ
    - [ ] 8.2.2.3 難易度設定
    - [ ] 8.2.2.4 設定保存・適用

### 9. アニメーション・視覚効果
- [ ] **9.1 基本アニメーション**
  - [ ] 9.1.1 Tailwind CSS アニメーション活用設定
  - [ ] 9.1.2 フェードイン・フェードアウト
  - [ ] 9.1.3 スライドイン・スライドアウト
  - [ ] 9.1.4 スケール変化アニメーション

- [ ] **9.2 ゲーム特化アニメーション**
  - [ ] 9.2.1 スコア表示時のカウントアップ
  - [ ] 9.2.2 ピン配置時のバウンス効果
  - [ ] 9.2.3 結果発表時の演出
  - [ ] 9.2.4 ラウンド進行時のトランジション

## 🔄 実装順序

### Phase 1: 基盤レイアウト (3時間)
1. ルートレイアウト設定・共通スタイル
2. Header・Footer共通コンポーネント
3. ホームページ基本構造
4. ナビゲーション・基本UI

### Phase 2: ゲーム画面UI (4時間)
1. ゲーム画面レイアウト構築
2. ゲーム情報表示コンポーネント
3. 操作ボタン・フォームUI
4. 結果表示カード・パネル

### Phase 3: 詳細UI・UX (3時間)
1. ローディング・エラー状態UI
2. モーダル・ダイアログUI
3. アニメーション・視覚効果
4. レスポンシブ対応調整

### Phase 4: 最終調整 (2時間)
1. 全体デザイン統一性確認
2. アクセシビリティ対応
3. パフォーマンス最適化
4. 総合テスト・調整

## 🎯 完了条件

### 視覚確認項目
- [ ] ホームページが美しく表示される
- [ ] ゲーム画面のレイアウトが正常に機能する
- [ ] 全てのボタンが適切にスタイリングされている
- [ ] カード・パネルが統一されたデザインで表示される

### 機能確認項目
- [ ] レスポンシブデザインが正常に動作する
- [ ] ナビゲーションが正常に機能する
- [ ] モーダル・ダイアログが正常に動作する
- [ ] ローディング・エラー状態が適切に表示される

### アクセシビリティ確認項目
- [ ] キーボードナビゲーションが可能
- [ ] スクリーンリーダー対応完了
- [ ] カラーコントラストが適切
- [ ] フォーカス表示が明確

## 📝 実装メモ

### 重要なデザイン指針

#### 1. カラーパレット
```css
/* globals.css */
:root {
  /* Primary Colors */
  --primary: 210 40% 20%;
  --primary-foreground: 0 0% 98%;
  
  /* Spa Theme Colors */
  --spa-blue: 195 100% 85%;
  --spa-green: 120 40% 70%;
  --hot-spring: 25 80% 60%;
  
  /* Game Colors */
  --guess-pin: 215 100% 50%; /* 青：推測ピン */
  --answer-pin: 0 100% 50%;  /* 赤：正解ピン */
  --score-good: 120 60% 50%; /* 緑：高スコア */
  --score-bad: 0 60% 50%;    /* 赤：低スコア */
}
```

#### 2. レイアウト定数
```typescript
// lib/constants.ts
export const LAYOUT = {
  HEADER_HEIGHT: '64px',
  FOOTER_HEIGHT: '60px',
  SIDEBAR_WIDTH: '280px',
  GAME_IMAGE_WIDTH: '50%',
  GAME_MAP_WIDTH: '50%',
  MOBILE_BREAKPOINT: '768px',
} as const;
```

#### 3. コンポーネント設計原則
```typescript
// components/ui/game-button.tsx
interface GameButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

### GeoGuessr風デザイン要素

#### 1. 分割画面レイアウト
```css
/* ゲーム画面の50/50分割 */
.game-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: calc(100vh - 64px); /* ヘッダー分引く */
}

.image-panel {
  background: black;
  position: relative;
}

.map-panel {
  position: relative;
  overflow: hidden;
}
```

#### 2. ゲーム情報バー
```typescript
// components/game/GameInfoBar.tsx
export function GameInfoBar({ round, score, time }: GameInfoProps) {
  return (
    <div className="bg-black/80 text-white px-4 py-2 flex justify-between">
      <span>Round {round}/5</span>
      <span className="font-mono">{formatTime(time)}</span>
      <span className="font-bold">{score.toLocaleString()} pts</span>
    </div>
  );
}
```

#### 3. 結果表示カード
```typescript
// components/game/ResultCard.tsx
export function ResultCard({ distance, score }: ResultProps) {
  return (
    <Card className="p-6 text-center">
      <div className="text-3xl font-bold text-green-600">
        {score.toLocaleString()}
      </div>
      <div className="text-sm text-muted-foreground">
        {distance.toFixed(1)} km away
      </div>
    </Card>
  );
}
```

### パフォーマンス最適化

#### 1. 画像最適化
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
};
```

#### 2. コンポーネント最適化
```typescript
// React.memo使用例
export const GameInfoBar = React.memo(function GameInfoBar({ 
  round, score, time 
}: GameInfoProps) {
  // ... コンポーネント実装
});
```

---

**完了後の次のアクション:** [05_map_integration.md](./05_map_integration.md) でMapbox統合開始 