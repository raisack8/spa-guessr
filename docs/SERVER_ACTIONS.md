# Server Actions 実装ガイド

SpaGuessrでのServer Actions実装の詳細ガイドです。Next.js 14の正しいServer Actions使用方法に従います。

## 📋 目次
- [基本概念](#基本概念)
- [使用パターン](#使用パターン)
- [ゲーム関連Actions](#ゲーム関連actions)
- [フォームベース実装](#フォームベース実装)
- [エラーハンドリング](#エラーハンドリング)
- [パフォーマンス最適化](#パフォーマンス最適化)

## 基本概念

### 🎯 Server Actions の正しい使用方法

Server ActionsはNext.js 14で導入された機能で、**2つの用途のみ**で使用します：

#### 1. 画面表示時のデータfetch（Server Component）
```typescript
// Server Componentでの初期データ取得
export async function GamePage() {
  // 直接Server Actionを呼び出し
  const randomSpa = await getRandomSpaAction();
  
  return (
    <GameBoard initialSpa={randomSpa} />
  );
}
```

#### 2. Form Action（フォーム送信）
```typescript
// Server Action定義
export async function submitGuessAction(formData: FormData) {
  'use server'; // 必須ディレクティブ
  
  const gameId = formData.get('gameId') as string;
  const lat = parseFloat(formData.get('lat') as string);
  const lng = parseFloat(formData.get('lng') as string);
  
  // サーバーサイド処理
  const result = await processGuess(gameId, lat, lng);
  return result;
}

// フォームでの使用
function GuessForm() {
  return (
    <form action={submitGuessAction}>
      <input type="hidden" name="gameId" value={gameId} />
      <input type="hidden" name="lat" value={lat} />
      <input type="hidden" name="lng" value={lng} />
      <button type="submit">推測を送信</button>
    </form>
  );
}
```

### ❌ 間違った使用方法

```typescript
// ❌ onClick等で直接呼び出し（やってはいけない）
function BadExample() {
  const handleClick = async () => {
    const result = await someServerAction(); // 間違い！
  };
  
  return <button onClick={handleClick}>Submit</button>;
}

// ❌ 状態管理ライブラリで直接呼び出し（やってはいけない）
const useStore = create((set) => ({
  submitData: async () => {
    const result = await serverAction(); // 間違い！
  }
}));
```

### ✅ 正しい使用方法の比較

| 用途 | Server Actions | 従来の方法 |
|---|---|---|
| **初期データ取得** | Server Componentで直接呼び出し | API Routes + fetch |
| **フォーム送信** | form action プロパティ | API Routes + fetch |
| **型安全性** | ✅ 完全な型安全性 | ❌ 手動型定義 |
| **エラーハンドリング** | ✅ useActionStateで統合 | ❌ 手動実装 |

## 使用パターン

### 📁 ファイル構成

```
lib/actions/
├── game.ts          # ゲーム関連Server Actions
├── user.ts          # ユーザー関連Server Actions
├── rankings.ts      # ランキング関連Server Actions
└── types.ts         # 共通型定義
```

### 🔧 基本パターン

#### パターン1: Server Component用（データfetch）
```typescript
// Server Componentで直接呼び出し用
export async function getGameDataAction(gameId: string): Promise<GameData> {
  'use server';
  
  // サーバーサイド処理
  const gameData = await db.select().from(gameTable).where(eq(gameTable.id, gameId));
  return gameData[0];
}

// Server Componentでの使用
export async function GamePage({ gameId }: { gameId: string }) {
  const gameData = await getGameDataAction(gameId);
  
  return <GameBoard data={gameData} />;
}
```

#### パターン2: Form Action用（フォーム送信）
```typescript
// フォーム送信用Action
export async function submitGuessAction(formData: FormData) {
  'use server';
  
  // FormDataから値を取得
  const gameId = formData.get('gameId') as string;
  const lat = parseFloat(formData.get('lat') as string);
  const lng = parseFloat(formData.get('lng') as string);
  
  // バリデーション
  if (!gameId || isNaN(lat) || isNaN(lng)) {
    return { error: 'Invalid input data' };
  }
  
  // ビジネスロジック実行
  const result = await processGuess(gameId, lat, lng);
  
  // 関連ページのキャッシュ更新
  revalidatePath('/game');
  revalidatePath('/rankings');
  
  return { success: true, data: result };
}
```

## ゲーム関連Actions

### 🎮 ゲーム開始用Actions（Server Component用）

```typescript
// lib/actions/game.ts
'use server';

import { db } from '@/lib/db';
import { gameSessionsTable, spasTable } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { redirect } from 'next/navigation';

// Server Component用: 新しいゲームを開始
export async function startNewGameAction(): Promise<{ gameId: string; spa: Spa }> {
  'use server';
  
  // 1. ランダムな温泉宿を取得
  const randomSpa = await db
    .select()
    .from(spasTable)
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!randomSpa[0]) {
    throw new Error('No spa data available');
  }

  // 2. ゲームセッションを作成
  const gameId = crypto.randomUUID();
  await db.insert(gameSessionsTable).values({
    id: gameId,
    spaId: randomSpa[0].id,
    createdAt: new Date()
  });

  return {
    gameId,
    spa: randomSpa[0]
  };
}

// Server Component用: ゲームデータ取得
export async function getGameDataAction(gameId: string): Promise<{
  session: GameSession;
  spa: Spa;
} | null> {
  'use server';
  
  const result = await db
    .select()
    .from(gameSessionsTable)
    .leftJoin(spasTable, eq(gameSessionsTable.spaId, spasTable.id))
    .where(eq(gameSessionsTable.id, gameId))
    .limit(1);

  if (!result[0]) return null;

  return {
    session: result[0].t_game_sessions,
    spa: result[0].m_spas!
  };
}
```

### 🎯 回答送信用Action（Form Action用）

```typescript
// Form Action用: 推測結果送信
export async function submitGuessAction(formData: FormData) {
  'use server';
  
  // FormDataから値を取得
  const gameId = formData.get('gameId') as string;
  const lat = parseFloat(formData.get('lat') as string);
  const lng = parseFloat(formData.get('lng') as string);
  const timeSeconds = parseInt(formData.get('timeSeconds') as string);

  // 入力検証
  if (!gameId || isNaN(lat) || isNaN(lng) || isNaN(timeSeconds)) {
    throw new Error('Invalid input data');
  }

  // ゲームセッションと温泉宿情報を取得
  const session = await db
    .select()
    .from(gameSessionsTable)
    .leftJoin(spasTable, eq(gameSessionsTable.spaId, spasTable.id))
    .where(eq(gameSessionsTable.id, gameId))
    .limit(1);

  if (!session[0]?.m_spas) {
    throw new Error('Game session not found');
  }

  const spa = session[0].m_spas;

  // 距離とスコアを計算
  const distance = calculateDistance(lat, lng, spa.latitude, spa.longitude);
  const { baseScore, timeMultiplier, finalScore } = calculateScore(distance, timeSeconds);

  // 結果をDBに保存
  await db
    .update(gameSessionsTable)
    .set({
      guessedLat: lat,
      guessedLng: lng,
      distanceKm: distance,
      timeSeconds: timeSeconds,
      baseScore: baseScore,
      timeMultiplier: timeMultiplier,
      finalScore: finalScore,
      completedAt: new Date()
    })
    .where(eq(gameSessionsTable.id, gameId));

  // 関連ページのキャッシュを更新
  revalidatePath('/rankings');
  revalidatePath(`/game/${gameId}`);

  // 結果ページにリダイレクト
  redirect(`/game/${gameId}/result`);
}
```

## フォームベース実装

### 💾 宿保存フォーム

```typescript
// lib/actions/user.ts
'use server';

import { db } from '@/lib/db';
import { savedSpasTable } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

export async function saveSpaAction(formData: FormData) {
  'use server';
  
  const userId = formData.get('userId') as string;
  const spaId = formData.get('spaId') as string;
  
  if (!userId || !spaId) {
    throw new Error('Missing required data');
  }

  // 重複チェック付きでinsert
  await db.insert(savedSpasTable).values({
    id: crypto.randomUUID(),
    userId,
    spaId,
    createdAt: new Date()
  }).onConflictDoNothing(); // 重複は無視

  // 関連ページのキャッシュを更新
  revalidatePath('/profile');
  revalidatePath(`/user/${userId}`);
}

// フォームコンポーネント
function SaveSpaForm({ userId, spaId }: { userId: string; spaId: string }) {
  return (
    <form action={saveSpaAction}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="spaId" value={spaId} />
      <button type="submit" className="btn-primary">
        宿を保存
      </button>
    </form>
  );
}
```

### 🎨 アバター更新フォーム

```typescript
export async function updateAvatarAction(formData: FormData) {
  'use server';
  
  const userId = formData.get('userId') as string;
  const hat = formData.get('hat') as string;
  const shirt = formData.get('shirt') as string;
  const accessory = formData.get('accessory') as string;
  
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  const avatarConfig = {
    hat: hat || undefined,
    shirt: shirt || undefined,
    accessory: accessory || undefined
  };
  
  await db
    .update(usersTable)
    .set({ 
      avatarConfig: avatarConfig,
      updatedAt: new Date()
    })
    .where(eq(usersTable.id, userId));

  // ユーザー関連ページのキャッシュを更新
  revalidatePath('/profile');
  revalidatePath('/rankings');
}

// フォームコンポーネント（useActionStateを使用）
'use client';
import { useActionState } from 'react';

function AvatarUpdateForm({ userId, currentConfig }: {
  userId: string;
  currentConfig: AvatarConfig;
}) {
  const [state, formAction] = useActionState(updateAvatarAction, null);
  
  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={userId} />
      
      <select name="hat" defaultValue={currentConfig.hat}>
        <option value="">帽子なし</option>
        <option value="cap">キャップ</option>
        <option value="hat">ハット</option>
      </select>
      
      <select name="shirt" defaultValue={currentConfig.shirt}>
        <option value="">シャツなし</option>
        <option value="blue">青いシャツ</option>
        <option value="red">赤いシャツ</option>
      </select>
      
      <button type="submit">アバターを更新</button>
    </form>
  );
}
```

## エラーハンドリング

### 🚨 Form Action用エラーハンドリング

```typescript
// lib/actions/game.ts
export async function submitGuessAction(formData: FormData) {
  'use server';
  
  try {
    // バリデーション
    const gameId = formData.get('gameId') as string;
    const lat = parseFloat(formData.get('lat') as string);
    const lng = parseFloat(formData.get('lng') as string);
    
    if (!gameId || isNaN(lat) || isNaN(lng)) {
      // エラーはthrowでNext.jsが自動的に処理
      throw new Error('入力データが無効です');
    }
    
    // 処理実行
    const result = await processGuess(gameId, lat, lng);
    
    // 成功時はrevalidateとredirect
    revalidatePath('/rankings');
    redirect(`/game/${gameId}/result`);
    
  } catch (error) {
    // Next.jsが自動的にエラーページまたはerror.tsxを表示
    throw error;
  }
}
```

### 🎭 useActionStateでの統合

```typescript
// components/GameForm.tsx
'use client';

import { useActionState } from 'react';
import { submitGuessAction } from '@/lib/actions/game';

// Server ActionをuseActionStateで使用
export function GameForm({ gameId }: { gameId: string }) {
  const [state, formAction, pending] = useActionState(
    submitGuessAction,
    null
  );
  
  return (
    <form action={formAction}>
      <input type="hidden" name="gameId" value={gameId} />
      <input type="hidden" name="lat" id="lat" />
      <input type="hidden" name="lng" id="lng" />
      <input type="hidden" name="timeSeconds" id="timeSeconds" />
      
      <MapComponent 
        onPinPlace={(lat, lng) => {
          document.getElementById('lat').value = lat.toString();
          document.getElementById('lng').value = lng.toString();
        }}
      />
      
      <button 
        type="submit"
        disabled={pending}
      >
        {pending ? '送信中...' : '推測を送信'}
      </button>
      
      {state?.error && (
        <div className="error">{state.error}</div>
      )}
    </form>
  );
}
```

### 🔄 楽観的更新のパターン

```typescript
'use client';

import { useOptimistic, useActionState } from 'react';
import { saveSpaAction } from '@/lib/actions/user';

export function SaveSpaButton({ userId, spaId, isSaved }: {
  userId: string;
  spaId: string;
  isSaved: boolean;
}) {
  const [optimisticSaved, setOptimisticSaved] = useOptimistic(
    isSaved,
    (state, newSaved: boolean) => newSaved
  );
  
  const [state, formAction] = useActionState(saveSpaAction, null);

  return (
    <form 
      action={async (formData) => {
        // 楽観的更新
        setOptimisticSaved(!optimisticSaved);
        // Server Action実行
        await formAction(formData);
      }}
    >
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="spaId" value={spaId} />
      <button type="submit">
        {optimisticSaved ? '保存済み ✓' : '保存する'}
      </button>
    </form>
  );
}
```

## パフォーマンス最適化

### ⚡ Server Component用キャッシュ戦略

```typescript
// lib/actions/rankings.ts
import { unstable_cache } from 'next/cache';

// Server Component用: キャッシュ付きランキング取得
export async function getWeeklyRankingsAction(): Promise<WeeklyRanking[]> {
  'use server';
  
  const rankings = await unstable_cache(
    async () => {
      return await db
        .select()
        .from(weeklyRankingsTable)
        .orderBy(desc(weeklyRankingsTable.totalScore))
        .limit(50);
    },
    ['weekly-rankings'], // キャッシュキー
    { 
      revalidate: 300, // 5分間キャッシュ
      tags: ['rankings'] // タグベースの無効化
    }
  )();

  return rankings;
}

// Server Component用: 温泉データの取得
export async function getSpaDataAction(spaId: string): Promise<Spa | null> {
  'use server';
  
  const spa = await unstable_cache(
    async () => {
      const result = await db
        .select()
        .from(spasTable)
        .where(eq(spasTable.id, spaId))
        .limit(1);
      return result[0] || null;
    },
    [`spa-${spaId}`],
    { revalidate: 3600 } // 1時間キャッシュ
  )();
  
  return spa;
}
```

### 🔗 正しいクライアントサイド連携

```typescript
// Server ComponentでServer Actionsを呼び出し
export async function RankingsPage() {
  const rankings = await getWeeklyRankingsAction();
  
  return (
    <div>
      <h1>週間ランキング</h1>
      <RankingsList rankings={rankings} />
    </div>
  );
}

// Client ComponentではフォームとuseActionStateを使用
'use client';

import { useActionState } from 'react';

export function GameControlForm({ onGameStart }: { 
  onGameStart: (gameData: { gameId: string; spa: Spa }) => void 
}) {
  const [state, formAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      // Server Actionによる新しいゲーム開始
      // このServer Actionは成功時にリダイレクトまたはデータを返す
      return await startNewGameAction();
    },
    null
  );

  return (
    <form action={formAction}>
      <button type="submit">
        新しいゲームを開始
      </button>
    </form>
  );
}
```

### 📊 Zustand Store（フォームベース）

```typescript
// lib/stores/gameStore.ts - 正しい実装
import { create } from 'zustand';

interface GameStore {
  gameId: string | null;
  currentSpa: Spa | null;
  userGuess: { lat: number; lng: number } | null;
  
  // Server Actionsは呼び出さず、状態管理のみ
  setGameData: (gameId: string, spa: Spa) => void;
  setUserGuess: (lat: number, lng: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameId: null,
  currentSpa: null,
  userGuess: null,

  // Server Actionsは呼び出さない
  setGameData: (gameId, spa) => {
    set({ gameId, currentSpa: spa });
  },

  setUserGuess: (lat, lng) => {
    set({ userGuess: { lat, lng } });
  },

  resetGame: () => {
    set({
      gameId: null,
      currentSpa: null,
      userGuess: null
    });
  }
}));
```

## まとめ

### ✅ 正しいServer Actions使用方法

SpaGuessrでは、Server Actionsを以下の**2つの用途のみ**で使用します：

#### 1. 📄 Server Component（初期データ取得）
```typescript
// Server ComponentでServer Actionsを直接呼び出し
export async function GamePage() {
  const gameData = await getGameDataAction();
  return <GameBoard data={gameData} />;
}
```

#### 2. 📝 Form Action（フォーム送信）
```typescript
// フォームのactionプロパティに指定
export function GameForm() {
  return (
    <form action={submitGuessAction}>
      <input type="hidden" name="gameId" value={gameId} />
      <button type="submit">送信</button>
    </form>
  );
}
```

### ❌ やってはいけないこと

- `onClick`や`onChange`でServer Actionsを直接呼び出し
- Zustand Store等でServer Actionsを直接呼び出し  
- `useEffect`内でServer Actionsを呼び出し

### 🎯 パターン別使い分け

| パターン | 用途 | 実装方法 |
|---|---|---|
| **データ取得** | 初期表示、SSR | Server ComponentでServer Actions直接呼び出し |
| **フォーム送信** | ユーザー操作 | `<form action={serverAction}>` |
| **楽観的更新** | UX向上 | `useOptimistic` + Form Action |
| **エラーハンドリング** | 統一処理 | `useActionState` + Form Action |
| **状態管理** | グローバル状態 | Zustand（Server Actionsは呼び出さない） |

この実装方針により、型安全で保守性の高いモダンなNext.js 14アプリケーションを構築できます。 