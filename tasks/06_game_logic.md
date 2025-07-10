# 🎮 ゲームロジック実装

## 📋 タスク一覧

### 1. ゲーム状態管理
- [ ] **1.1 ゲーム状態型定義**
  - [ ] 1.1.1 `lib/types/game.ts` ゲーム関連型定義作成
  - [ ] 1.1.2 `GameSession` 型定義（ID, status, score など）
  - [ ] 1.1.3 `GameRound` 型定義（ラウンド番号、温泉宿、推測など）
  - [ ] 1.1.4 `GameMode` 列挙型（Classic, NoMove, TimeLimited など）
  - [ ] 1.1.5 `GameStatus` 列挙型（not_started, playing, completed など）

- [ ] **1.2 ゲーム状態ストア**
  - [ ] 1.2.1 `lib/store/game-store.ts` Zustand ストア作成
  - [ ] 1.2.2 現在のゲームセッション管理
  - [ ] 1.2.3 現在ラウンド情報管理
  - [ ] 1.2.4 推測座標・時間管理
  - [ ] 1.2.5 スコア・結果管理

### 2. ゲーム初期化・開始
- [ ] **2.1 新ゲーム作成**
  - [ ] 2.1.1 `lib/game/game-manager.ts` ゲーム管理クラス作成
  - [ ] 2.1.2 `createNewGame()` 新ゲーム初期化関数
    - [ ] 2.1.2.1 ゲームセッションID生成
    - [ ] 2.1.2.2 5つの温泉宿をランダム選択
    - [ ] 2.1.2.3 ラウンドデータ生成
    - [ ] 2.1.2.4 初期状態設定

- [ ] **2.2 温泉宿選択ロジック**
  - [ ] 2.2.1 `lib/game/spa-selector.ts` 温泉宿選択機能
  - [ ] 2.2.2 都道府県重複回避ロジック
  - [ ] 2.2.3 難易度バランス調整
  - [ ] 2.2.4 過去のゲームとの重複回避
  - [ ] 2.2.5 地域的な分散確保

### 3. ラウンド進行管理
- [ ] **3.1 ラウンド開始処理**
  - [ ] 3.1.1 `lib/game/round-manager.ts` ラウンド管理機能
  - [ ] 3.1.2 `startRound()` ラウンド開始関数
    - [ ] 3.1.2.1 温泉宿データ読み込み
    - [ ] 3.1.2.2 画像リスト設定
    - [ ] 3.1.2.3 タイマー初期化
    - [ ] 3.1.2.4 地図状態リセット

- [ ] **3.2 タイマー機能**
  - [ ] 3.2.1 `lib/game/timer.ts` タイマー管理機能
  - [ ] 3.2.2 `useGameTimer()` カスタムフック作成
    - [ ] 3.2.2.1 経過時間カウント
    - [ ] 3.2.2.2 一時停止・再開機能
    - [ ] 3.2.2.3 時間制限モード対応
    - [ ] 3.2.2.4 タイマー表示フォーマット

### 4. 推測処理・検証
- [ ] **4.1 推測データ収集**
  - [ ] 4.1.1 `lib/game/guess-handler.ts` 推測処理機能
  - [ ] 4.1.2 推測座標バリデーション
    - [ ] 4.1.2.1 日本国内座標チェック
    - [ ] 4.1.2.2 有効な座標範囲確認
    - [ ] 4.1.2.3 座標精度チェック
    - [ ] 4.1.2.4 異常値検出・除外

- [ ] **4.2 推測送信処理**
  - [ ] 4.2.1 `submitGuess()` 推測送信関数
    - [ ] 4.2.1.1 推測データ収集
    - [ ] 4.2.1.2 時間記録（タイマー停止）
    - [ ] 4.2.1.3 Server Action呼び出し
    - [ ] 4.2.1.4 結果データ処理

### 5. 距離計算・スコアリング
- [ ] **5.1 距離計算実装**
  - [ ] 5.1.1 `lib/game/distance-calculator.ts` 距離計算機能
  - [ ] 5.1.2 Haversine公式実装
    - [ ] 5.1.2.1 緯度・経度から距離算出
    - [ ] 5.1.2.2 地球の曲率考慮
    - [ ] 5.1.2.3 高精度計算実装
    - [ ] 5.1.2.4 距離単位統一（km）

- [ ] **5.2 スコア計算システム**
  - [ ] 5.2.1 `lib/game/scoring.ts` スコア計算機能
  - [ ] 5.2.2 GeoGuessr式スコア計算
    - [ ] 5.2.2.1 距離ベース基本スコア
    - [ ] 5.2.2.2 時間ボーナス計算
    - [ ] 5.2.2.3 完璧推測ボーナス
    - [ ] 5.2.2.4 連続ボーナス計算

### 6. 結果処理・表示
- [ ] **6.1 ラウンド結果処理**
  - [ ] 6.1.1 `lib/game/result-processor.ts` 結果処理機能
  - [ ] 6.1.2 `processRoundResult()` ラウンド結果処理
    - [ ] 6.1.2.1 スコア・距離計算
    - [ ] 6.1.2.2 ラウンドデータ保存
    - [ ] 6.1.2.3 累計スコア更新
    - [ ] 6.1.2.4 統計データ更新

- [ ] **6.2 最終結果集計**
  - [ ] 6.2.1 `processFinalResult()` 最終結果処理
    - [ ] 6.2.1.1 全ラウンド結果集計
    - [ ] 6.2.1.2 最終スコア計算
    - [ ] 6.2.1.3 ランキング順位判定
    - [ ] 6.2.1.4 実績・バッジ判定

### 7. ゲーム進行制御
- [ ] **7.1 状態遷移管理**
  - [ ] 7.1.1 `lib/game/state-machine.ts` 状態遷移機能
  - [ ] 7.1.2 ゲーム状態遷移定義
    - [ ] 7.1.2.1 not_started → playing
    - [ ] 7.1.2.2 playing → round_completed
    - [ ] 7.1.2.3 round_completed → next_round / game_completed
    - [ ] 7.1.2.4 不正な遷移の防止

- [ ] **7.2 進行制御フック**
  - [ ] 7.2.1 `hooks/useGameProgress.ts` 進行管理フック
    - [ ] 7.2.1.1 現在状態管理
    - [ ] 7.2.1.2 次のアクション決定
    - [ ] 7.2.1.3 進行可能性チェック
    - [ ] 7.2.1.4 エラー状態処理

### 8. ゲームデータ永続化
- [ ] **8.1 ローカルストレージ管理**
  - [ ] 8.1.1 `lib/game/local-storage.ts` ローカル保存機能
  - [ ] 8.1.2 進行中ゲーム保存
    - [ ] 8.1.2.1 現在ラウンド状態保存
    - [ ] 8.1.2.2 推測履歴保存
    - [ ] 8.1.2.3 タイマー状態保存
    - [ ] 8.1.2.4 自動保存機能

- [ ] **8.2 ゲーム復元機能**
  - [ ] 8.2.1 `restoreGame()` ゲーム復元関数
    - [ ] 8.2.1.1 保存データ検証
    - [ ] 8.2.1.2 ゲーム状態復元
    - [ ] 8.2.1.3 タイマー再開処理
    - [ ] 8.2.1.4 不整合データ処理

### 9. エラーハンドリング・検証
- [ ] **9.1 ゲーム整合性チェック**
  - [ ] 9.1.1 `lib/game/validators.ts` 検証機能
  - [ ] 9.1.2 データ整合性検証
    - [ ] 9.1.2.1 ラウンド数チェック（1-5）
    - [ ] 9.1.2.2 スコア妥当性チェック
    - [ ] 9.1.2.3 時間データ検証
    - [ ] 9.1.2.4 座標データ検証

- [ ] **9.2 エラー回復処理**
  - [ ] 9.2.1 `lib/game/error-recovery.ts` エラー回復機能
    - [ ] 9.2.1.1 データ破損時の復旧
    - [ ] 9.2.1.2 ネットワークエラー対応
    - [ ] 9.2.1.3 タイムアウト処理
    - [ ] 9.2.1.4 緊急保存機能

### 10. ゲーム統計・分析
- [ ] **10.1 プレイ統計収集**
  - [ ] 10.1.1 `lib/game/analytics.ts` 分析機能
  - [ ] 10.1.2 プレイデータ収集
    - [ ] 10.1.2.1 推測精度分析
    - [ ] 10.1.2.2 回答時間分析
    - [ ] 10.1.2.3 地域別成績分析
    - [ ] 10.1.2.4 改善点提案機能

- [ ] **10.2 難易度調整**
  - [ ] 10.2.1 `lib/game/difficulty.ts` 難易度調整機能
    - [ ] 10.2.1.1 温泉宿難易度レーティング
    - [ ] 10.2.1.2 ユーザースキルレベル判定
    - [ ] 10.2.1.3 適応的難易度調整
    - [ ] 10.2.1.4 学習曲線最適化

## 🔄 実装順序

### Phase 1: 基盤構築 (4時間)
1. ゲーム状態管理・型定義
2. ゲーム初期化・開始機能
3. 温泉宿選択ロジック
4. ラウンド進行管理

### Phase 2: 核心機能 (5時間)
1. 推測処理・検証
2. 距離計算・スコアリング
3. 結果処理・表示
4. タイマー機能

### Phase 3: 高度な機能 (3時間)
1. ゲーム進行制御
2. データ永続化・復元
3. エラーハンドリング・検証

### Phase 4: 最適化・分析 (2時間)
1. ゲーム統計・分析
2. 難易度調整
3. パフォーマンス最適化

## 🎯 完了条件

### 基本機能確認項目
- [ ] 新ゲームが正常に開始される
- [ ] 5ラウンドが順序通り進行する
- [ ] 推測送信が正常に動作する
- [ ] スコア計算が正確に実行される

### ゲーム体験確認項目
- [ ] ラウンド間の遷移がスムーズ
- [ ] タイマーが正確に動作する
- [ ] 結果表示が分かりやすい
- [ ] エラー時の回復が適切

### データ整合性確認項目
- [ ] ゲーム状態が正しく保存・復元される
- [ ] スコア計算に誤差がない
- [ ] 距離計算が高精度
- [ ] データ破損時の対処が適切

## 📝 実装メモ

### 重要な設定値

#### ゲーム設定
```typescript
// lib/game/config.ts
export const GAME_CONFIG = {
  ROUNDS_PER_GAME: 5,
  MAX_SCORE_PER_ROUND: 5000,
  PERFECT_GUESS_THRESHOLD: 150, // meters
  TIME_BONUS_THRESHOLD: 30, // seconds
  MAX_GAME_TIME: 1800, // 30 minutes
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
} as const;
```

#### スコア計算設定
```typescript
// lib/game/scoring-config.ts
export const SCORING_CONFIG = {
  // 距離ベーススコア（GeoGuessr式）
  BASE_SCORE_FORMULA: (distance: number) => {
    return Math.round(5000 * Math.exp(-distance / 2000));
  },
  
  // 時間ボーナス
  TIME_BONUS: {
    UNDER_10_SEC: 500,
    UNDER_30_SEC: 300,
    UNDER_60_SEC: 100,
  },
  
  // 完璧推測ボーナス
  PERFECT_BONUS: 1000,
} as const;
```

### 核心実装例

#### ゲーム状態管理
```typescript
// lib/store/game-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  // ゲーム基本情報
  gameId: string | null;
  status: GameStatus;
  mode: GameMode;
  
  // ラウンド情報
  currentRound: number;
  rounds: GameRound[];
  
  // スコア・結果
  totalScore: number;
  roundResults: RoundResult[];
  
  // 推測情報
  currentGuess: {
    coordinates: [number, number] | null;
    timestamp: number | null;
  };
  
  // アクション
  startNewGame: (mode: GameMode) => void;
  submitGuess: (coordinates: [number, number]) => void;
  nextRound: () => void;
  finishGame: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // 初期状態
      gameId: null,
      status: 'not_started',
      mode: 'classic',
      currentRound: 0,
      rounds: [],
      totalScore: 0,
      roundResults: [],
      currentGuess: {
        coordinates: null,
        timestamp: null,
      },
      
      // アクション実装
      startNewGame: (mode) => {
        const gameId = crypto.randomUUID();
        set({
          gameId,
          status: 'playing',
          mode,
          currentRound: 1,
          totalScore: 0,
          roundResults: [],
          currentGuess: {
            coordinates: null,
            timestamp: Date.now(),
          },
        });
      },
      
      submitGuess: (coordinates) => {
        set((state) => ({
          currentGuess: {
            coordinates,
            timestamp: Date.now(),
          },
        }));
      },
      
      // その他のアクション...
    }),
    {
      name: 'spa-guessr-game',
      partialize: (state) => ({
        gameId: state.gameId,
        status: state.status,
        currentRound: state.currentRound,
        totalScore: state.totalScore,
        roundResults: state.roundResults,
      }),
    }
  )
);
```

#### 距離計算実装
```typescript
// lib/game/distance-calculator.ts

/**
 * Haversine公式を使用した2点間の距離計算
 * @param lat1 緯度1
 * @param lng1 経度1  
 * @param lat2 緯度2
 * @param lng2 経度2
 * @returns 距離（キロメートル）
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // 地球の半径（km）
  
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 距離に基づくスコア計算
 */
export function calculateScore(
  distance: number,
  timeSeconds: number
): {
  baseScore: number;
  timeBonus: number;
  totalScore: number;
} {
  // 基本スコア（GeoGuessr式）
  const baseScore = Math.round(5000 * Math.exp(-distance / 2000));
  
  // 時間ボーナス
  let timeBonus = 0;
  if (timeSeconds <= 10) timeBonus = 500;
  else if (timeSeconds <= 30) timeBonus = 300;
  else if (timeSeconds <= 60) timeBonus = 100;
  
  // 完璧推測ボーナス
  const perfectBonus = distance <= 0.15 ? 1000 : 0;
  
  const totalScore = baseScore + timeBonus + perfectBonus;
  
  return {
    baseScore,
    timeBonus: timeBonus + perfectBonus,
    totalScore: Math.min(totalScore, 5000), // 最大5000点
  };
}
```

#### ラウンド進行管理
```typescript
// lib/game/round-manager.ts
import { useGameStore } from '@/lib/store/game-store';
import { submitGuessAction, nextRoundAction } from '@/lib/actions/game';

export class RoundManager {
  private gameStore = useGameStore;
  
  async submitCurrentGuess(): Promise<RoundResult> {
    const state = this.gameStore.getState();
    
    if (!state.currentGuess.coordinates) {
      throw new Error('No guess coordinates available');
    }
    
    if (!state.currentGuess.timestamp) {
      throw new Error('No guess timestamp available');
    }
    
    const timeSeconds = Math.floor(
      (Date.now() - state.currentGuess.timestamp) / 1000
    );
    
    // Server Actionで推測を送信
    const result = await submitGuessAction({
      gameId: state.gameId!,
      roundNumber: state.currentRound,
      coordinates: state.currentGuess.coordinates,
      timeSeconds,
    });
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to submit guess');
    }
    
    // 結果をストアに保存
    this.gameStore.setState((prevState) => ({
      roundResults: [...prevState.roundResults, result.data],
      totalScore: prevState.totalScore + result.data.score,
    }));
    
    return result.data;
  }
  
  async proceedToNextRound(): Promise<boolean> {
    const state = this.gameStore.getState();
    
    if (state.currentRound >= 5) {
      // ゲーム終了
      await this.finishGame();
      return false;
    }
    
    // 次のラウンドへ
    const result = await nextRoundAction(state.gameId!);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to proceed to next round');
    }
    
    this.gameStore.setState({
      currentRound: state.currentRound + 1,
      currentGuess: {
        coordinates: null,
        timestamp: Date.now(),
      },
    });
    
    return true;
  }
  
  private async finishGame(): Promise<void> {
    const state = this.gameStore.getState();
    
    this.gameStore.setState({
      status: 'completed',
    });
    
    // 最終結果を保存
    await finishGameAction(state.gameId!, state.totalScore);
  }
}
```

### パフォーマンス最適化

#### メモ化・最適化
```typescript
// lib/game/memoization.ts
import { useMemo } from 'react';

export function useGameCalculations(
  coordinates: [number, number] | null,
  answerCoordinates: [number, number],
  timeSeconds: number
) {
  return useMemo(() => {
    if (!coordinates) return null;
    
    const distance = calculateDistance(
      coordinates[1], coordinates[0],
      answerCoordinates[1], answerCoordinates[0]
    );
    
    const scoreData = calculateScore(distance, timeSeconds);
    
    return {
      distance,
      ...scoreData,
    };
  }, [coordinates, answerCoordinates, timeSeconds]);
}
```

---

**完了後の次のアクション:** [07_scoring_system.md](./07_scoring_system.md) でスコアリングシステム詳細実装開始 