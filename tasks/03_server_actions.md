# ⚡ Server Actions実装

## 📋 タスク一覧

### 1. Server Actions基盤構築
- [ ] **1.1 基本設定・型定義**
  - [ ] 1.1.1 `lib/actions/types.ts` - 共通型定義作成
  - [ ] 1.1.2 統一レスポンス型定義 (`ActionState<T>`)
  - [ ] 1.1.3 エラーハンドリング型定義
  - [ ] 1.1.4 フォームデータバリデーション型定義

- [ ] **1.2 共通ユーティリティ**
  - [ ] 1.2.1 `lib/actions/utils.ts` - 共通ユーティリティ作成
  - [ ] 1.2.2 エラーハンドリング関数 (`handleActionError`)
  - [ ] 1.2.3 フォームデータパース関数 (`parseFormData`)
  - [ ] 1.2.4 バリデーション関数 (`validateActionInput`)

### 2. ゲーム関連 Server Actions
- [ ] **2.1 ゲーム開始Actions**
  - [ ] 2.1.1 `lib/actions/game.ts` ファイル作成
  - [ ] 2.1.2 `startGameAction()` - 新ゲーム開始
    - [ ] 2.1.2.1 `'use server'` ディレクティブ設定
    - [ ] 2.1.2.2 ランダム温泉宿取得ロジック
    - [ ] 2.1.2.3 ゲームセッション作成ロジック
    - [ ] 2.1.2.4 初期ラウンド設定
    - [ ] 2.1.2.5 エラーハンドリング実装

- [ ] **2.2 推測送信Actions（フォーム用）**
  - [ ] 2.2.1 `submitGuessAction()` - 推測送信処理
    - [ ] 2.2.1.1 FormData から座標・時間データ取得
    - [ ] 2.2.1.2 入力データバリデーション (Zod)
    - [ ] 2.2.1.3 距離計算実装 (Haversine formula)
    - [ ] 2.2.1.4 スコア計算実装 (GeoGuessr式)
    - [ ] 2.2.1.5 ゲームラウンドデータ保存
    - [ ] 2.2.1.6 ゲームセッション更新
    - [ ] 2.2.1.7 結果データ返却

- [ ] **2.3 ゲーム進行Actions（フォーム用）**
  - [ ] 2.3.1 `nextRoundAction()` - 次ラウンド進行
    - [ ] 2.3.1.1 現在ラウンド状態確認
    - [ ] 2.3.1.2 次の温泉宿選択
    - [ ] 2.3.1.3 ラウンド番号更新
    - [ ] 2.3.1.4 新ラウンドデータ返却
  
  - [ ] 2.3.2 `finishGameAction()` - ゲーム終了処理
    - [ ] 2.3.2.1 最終スコア計算
    - [ ] 2.3.2.2 ゲームステータス更新
    - [ ] 2.3.2.3 ユーザー統計更新
    - [ ] 2.3.2.4 ランキング更新
    - [ ] 2.3.2.5 最終結果データ返却

### 3. 初期データ取得Actions
- [ ] **3.1 ゲームデータ取得Actions**
  - [ ] 3.1.1 `getGameDataAction()` - ゲーム初期データ取得
    - [ ] 3.1.1.1 ゲームセッション情報取得
    - [ ] 3.1.1.2 現在ラウンド情報取得
    - [ ] 3.1.1.3 温泉宿データ取得
    - [ ] 3.1.1.4 画像データ取得
    - [ ] 3.1.1.5 レスポンスデータ形成

  - [ ] 3.1.2 `getCurrentRoundAction()` - 現在ラウンドデータ取得
    - [ ] 3.1.2.1 ラウンド情報確認
    - [ ] 3.1.2.2 温泉宿詳細取得
    - [ ] 3.1.2.3 画像リスト取得
    - [ ] 3.1.2.4 進行状況取得

### 4. ユーザー関連 Server Actions
- [ ] **4.1 ユーザー作成・更新Actions（フォーム用）**
  - [ ] 4.1.1 `lib/actions/user.ts` ファイル作成
  - [ ] 4.1.2 `createUserAction()` - ユーザー作成
    - [ ] 4.1.2.1 FormData からユーザー情報取得
    - [ ] 4.1.2.2 ユーザー名重複チェック
    - [ ] 4.1.2.3 ユーザーレコード作成
    - [ ] 4.1.2.4 初期統計設定
    - [ ] 4.1.2.5 `revalidatePath('/profile')` 実行

  - [ ] 4.1.3 `updateAvatarAction()` - アバター更新
    - [ ] 4.1.3.1 アバター設定バリデーション
    - [ ] 4.1.3.2 ユーザーレコード更新
    - [ ] 4.1.3.3 キャッシュ無効化実行

- [ ] **4.2 宿保存Actions（フォーム用）**
  - [ ] 4.2.1 `saveSpaAction()` - 宿保存処理
    - [ ] 4.2.1.1 ユーザーID・宿ID取得
    - [ ] 4.2.1.2 重複チェック実装
    - [ ] 4.2.1.3 保存レコード作成
    - [ ] 4.2.1.4 `revalidatePath('/profile')` 実行

  - [ ] 4.2.2 `removeSavedSpaAction()` - 保存宿削除
    - [ ] 4.2.2.1 削除対象確認
    - [ ] 4.2.2.2 削除処理実行
    - [ ] 4.2.2.3 キャッシュ無効化実行

### 5. ランキング・統計関連Actions
- [ ] **5.1 ランキングデータ取得Actions**
  - [ ] 5.1.1 `lib/actions/rankings.ts` ファイル作成
  - [ ] 5.1.2 `getWeeklyRankingsAction()` - 週間ランキング取得
    - [ ] 5.1.2.1 現在週の開始日計算
    - [ ] 5.1.2.2 ランキングデータクエリ
    - [ ] 5.1.2.3 順位付けロジック
    - [ ] 5.1.2.4 キャッシュ設定（5分間）

  - [ ] 5.1.3 `getSpaRankingsAction()` - 温泉別ランキング取得
    - [ ] 5.1.3.1 難易度別ソート
    - [ ] 5.1.3.2 人気度ランキング
    - [ ] 5.1.3.3 統計データ集計

### 6. バリデーション・エラーハンドリング
- [ ] **6.1 入力バリデーション**
  - [ ] 6.1.1 `lib/actions/validation.ts` - バリデーション関数
  - [ ] 6.1.2 座標バリデーション (日本国内限定)
  - [ ] 6.1.3 ゲームIDバリデーション (UUID形式)
  - [ ] 6.1.4 時間バリデーション (0-3600秒)
  - [ ] 6.1.5 スコアバリデーション (0-5000点)

- [ ] **6.2 エラーハンドリング強化**
  - [ ] 6.2.1 統一エラーレスポンス形式
  - [ ] 6.2.2 データベースエラー処理
  - [ ] 6.2.3 バリデーションエラー処理
  - [ ] 6.2.4 予期しないエラー処理
  - [ ] 6.2.5 クライアント向けエラーメッセージ

### 7. フォーム統合用スキーマ
- [ ] **7.1 Zodスキーマ定義**
  - [ ] 7.1.1 `lib/actions/schemas.ts` - バリデーションスキーマ
  - [ ] 7.1.2 `GuessSubmissionSchema` - 推測送信用
  - [ ] 7.1.3 `UserCreationSchema` - ユーザー作成用
  - [ ] 7.1.4 `AvatarUpdateSchema` - アバター更新用
  - [ ] 7.1.5 `GameSessionSchema` - ゲームセッション用

### 8. パフォーマンス最適化
- [ ] **8.1 キャッシュ戦略実装**
  - [ ] 8.1.1 `unstable_cache` でデータ取得最適化
  - [ ] 8.1.2 ランキングデータ5分間キャッシュ
  - [ ] 8.1.3 温泉宿データ1時間キャッシュ
  - [ ] 8.1.4 `revalidateTag` によるタグベース無効化

- [ ] **8.2 データベースクエリ最適化**
  - [ ] 8.2.1 必要なフィールドのみ取得
  - [ ] 8.2.2 適切なJOIN使用
  - [ ] 8.2.3 インデックス活用確認
  - [ ] 8.2.4 N+1クエリ防止

## 🔄 実装順序

### Phase 1: 基盤構築 (2時間)
1. 基本設定・型定義作成
2. 共通ユーティリティ実装
3. バリデーションスキーマ作成

### Phase 2: ゲーム機能Actions (4時間)
1. ゲーム開始Actions実装
2. 推測送信Actions実装（フォーム用）
3. ゲーム進行Actions実装
4. 初期データ取得Actions実装

### Phase 3: ユーザー機能Actions (2時間)
1. ユーザー作成・更新Actions実装
2. 宿保存Actions実装
3. プロフィール関連Actions実装

### Phase 4: ランキング・最適化 (2時間)
1. ランキング・統計Actions実装
2. パフォーマンス最適化実装
3. エラーハンドリング強化

## 🎯 完了条件

### 動作確認項目
- [ ] 全てのServer Actionsがエラーなく実行される
- [ ] フォーム送信が正常に動作する
- [ ] 初期データ取得が正常に動作する
- [ ] エラーハンドリングが適切に動作する

### 型安全性確認項目
- [ ] TypeScript型エラーがない
- [ ] Zodバリデーションが正常に動作する
- [ ] FormDataの型安全な取得ができる
- [ ] レスポンス型が統一されている

### セキュリティ確認項目
- [ ] 入力データバリデーション完了
- [ ] SQLインジェクション対策完了
- [ ] 不正アクセス防止対策完了

## 📝 実装メモ

### 重要な実装パターン

#### 1. Server Actions基本形式
```typescript
// lib/actions/game.ts
'use server';

import { ActionState } from './types';
import { GuessSubmissionSchema } from './schemas';

export async function submitGuessAction(
  prevState: ActionState<any>,
  formData: FormData
): Promise<ActionState<{ score: number; distance: number }>> {
  try {
    // FormDataから安全にデータ取得
    const rawData = {
      gameId: formData.get('gameId') as string,
      lat: parseFloat(formData.get('lat') as string),
      lng: parseFloat(formData.get('lng') as string),
      timeSeconds: parseInt(formData.get('timeSeconds') as string),
    };

    // バリデーション
    const validatedData = GuessSubmissionSchema.parse(rawData);

    // ビジネスロジック実行
    const result = await processGuess(validatedData);

    // キャッシュ無効化
    revalidatePath('/game');

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return handleActionError(error);
  }
}
```

#### 2. 初期データ取得Actions
```typescript
// Server Componentで直接呼び出し
export async function getGameDataAction(gameId: string) {
  'use server';
  
  try {
    const gameData = await db.query.gameSession.findFirst({
      where: eq(gameSession.id, gameId),
      with: {
        currentRound: {
          with: {
            spa: {
              with: {
                images: true
              }
            }
          }
        }
      }
    });

    return gameData;
  } catch (error) {
    throw new Error('Failed to fetch game data');
  }
}
```

#### 3. 統一型定義
```typescript
// lib/actions/types.ts
export interface ActionState<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export type ActionFunction<T> = (
  prevState: ActionState<any>,
  formData: FormData
) => Promise<ActionState<T>>;
```

### 使用方法パターン

#### 1. フォームアクション（useActionState）
```typescript
// components/game/GuessForm.tsx
import { useActionState } from 'react';
import { submitGuessAction } from '@/lib/actions/game';

export function GuessForm() {
  const [state, action] = useActionState(submitGuessAction, {
    success: false
  });

  return (
    <form action={action}>
      <input type="hidden" name="gameId" value={gameId} />
      <input type="hidden" name="lat" value={lat} />
      <input type="hidden" name="lng" value={lng} />
      <button type="submit">Submit Guess</button>
    </form>
  );
}
```

#### 2. Server Component（初期データ取得）
```typescript
// app/game/[gameId]/page.tsx
import { getGameDataAction } from '@/lib/actions/game';

export default async function GamePage({ 
  params 
}: { 
  params: { gameId: string } 
}) {
  const gameData = await getGameDataAction(params.gameId);
  
  return <GameBoard data={gameData} />;
}
```

### 禁止パターン

#### ❌ onClick等での直接呼び出し
```typescript
// ❌ これはやってはいけない
function handleClick() {
  submitGuessAction(formData); // 直接呼び出し禁止
}
```

#### ❌ useEffect内での呼び出し
```typescript
// ❌ これもやってはいけない
useEffect(() => {
  getGameDataAction(); // useEffect内での呼び出し禁止
}, []);
```

---

**完了後の次のアクション:** [04_ui_foundation.md](./04_ui_foundation.md) で基礎UI実装開始 