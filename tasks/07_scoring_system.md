# 🏆 スコアリングシステム詳細実装

## 📋 タスク一覧

### 1. 基本スコア計算エンジン
- [ ] **1.1 距離ベーススコア計算**
  - [ ] 1.1.1 `lib/scoring/distance-score.ts` 距離スコア計算機能
  - [ ] 1.1.2 GeoGuessr式スコア関数実装
    - [ ] 1.1.2.1 指数関数ベース計算 (5000 * e^(-d/2000))
    - [ ] 1.1.2.2 最大スコア5000点設定
    - [ ] 1.1.2.3 最小スコア0点設定
    - [ ] 1.1.2.4 小数点以下切り捨て処理

- [ ] **1.2 時間ボーナス計算**
  - [ ] 1.2.1 `lib/scoring/time-bonus.ts` 時間ボーナス機能
  - [ ] 1.2.2 時間階層別ボーナス設定
    - [ ] 1.2.2.1 10秒以内: +500点
    - [ ] 1.2.2.2 30秒以内: +300点
    - [ ] 1.2.2.3 60秒以内: +100点
    - [ ] 1.2.2.4 60秒超過: +0点

### 2. 特別ボーナスシステム
- [ ] **2.1 完璧推測ボーナス**
  - [ ] 2.1.1 `lib/scoring/perfect-bonus.ts` 完璧推測処理
  - [ ] 2.1.2 完璧推測条件設定
    - [ ] 2.1.2.1 150m以内判定
    - [ ] 2.1.2.2 +1000点ボーナス
    - [ ] 2.1.2.3 アニメーション表示トリガー
    - [ ] 2.1.2.4 実績解除判定

- [ ] **2.2 連続ボーナス**
  - [ ] 2.2.1 `lib/scoring/streak-bonus.ts` 連続ボーナス機能
  - [ ] 2.2.2 連続高得点ボーナス
    - [ ] 2.2.2.1 3ラウンド連続4000点以上: +500点
    - [ ] 2.2.2.2 5ラウンド連続3000点以上: +1000点
    - [ ] 2.2.2.3 連続記録追跡機能
    - [ ] 2.2.2.4 ボーナス累積計算

### 3. 難易度補正システム
- [ ] **3.1 温泉宿難易度係数**
  - [ ] 3.1.1 `lib/scoring/difficulty-rating.ts` 難易度レーティング
  - [ ] 3.1.2 難易度レーティング算出
    - [ ] 3.1.2.1 過去プレイヤーの平均距離
    - [ ] 3.1.2.2 平均所要時間
    - [ ] 3.1.2.3 完璧推測率
    - [ ] 3.1.2.4 動的難易度更新

- [ ] **3.2 難易度補正スコア**
  - [ ] 3.2.1 難易度別補正係数適用
    - [ ] 3.2.1.1 易しい温泉宿: 0.8倍
    - [ ] 3.2.1.2 普通の温泉宿: 1.0倍
    - [ ] 3.2.1.3 難しい温泉宿: 1.2倍
    - [ ] 3.2.1.4 非常に難しい: 1.5倍

### 4. スコア履歴・統計
- [ ] **4.1 個人スコア履歴**
  - [ ] 4.1.1 `lib/scoring/score-history.ts` スコア履歴管理
  - [ ] 4.1.2 詳細スコア記録
    - [ ] 4.1.2.1 ラウンド別スコア内訳
    - [ ] 4.1.2.2 ボーナス種別記録
    - [ ] 4.1.2.3 距離・時間履歴
    - [ ] 4.1.2.4 改善度分析

- [ ] **4.2 統計データ算出**
  - [ ] 4.2.1 `lib/scoring/statistics.ts` 統計計算機能
  - [ ] 4.2.2 各種統計指標
    - [ ] 4.2.2.1 平均スコア計算
    - [ ] 4.2.2.2 最高スコア記録
    - [ ] 4.2.2.3 平均距離・時間
    - [ ] 4.2.2.4 改善率分析

### 5. ランキング統合
- [ ] **5.1 リアルタイムランキング**
  - [ ] 5.1.1 `lib/scoring/ranking-calculator.ts` ランキング計算
  - [ ] 5.1.2 ランキング更新処理
    - [ ] 5.1.2.1 新スコア投入時の順位計算
    - [ ] 5.1.2.2 同点時の順位付けルール
    - [ ] 5.1.2.3 週間・月間ランキング
    - [ ] 5.1.2.4 カテゴリ別ランキング

- [ ] **5.2 レーティングシステム**
  - [ ] 5.2.1 `lib/scoring/rating-system.ts` レーティング機能
  - [ ] 5.2.2 Elo風レーティング実装
    - [ ] 5.2.2.1 対戦相手なしの修正Elo
    - [ ] 5.2.2.2 予想vs実績の差分評価
    - [ ] 5.2.2.3 レーティング変動計算
    - [ ] 5.2.2.4 レーティング履歴記録

### 6. スコア表示・UI統合
- [ ] **6.1 リアルタイムスコア表示**
  - [ ] 6.1.1 `components/scoring/ScoreDisplay.tsx` スコア表示UI
  - [ ] 6.1.2 動的スコア更新表示
    - [ ] 6.1.2.1 カウントアップアニメーション
    - [ ] 6.1.2.2 ボーナス種別の色分け表示
    - [ ] 6.1.2.3 スコア内訳の詳細表示
    - [ ] 6.1.2.4 視覚的フィードバック

- [ ] **6.2 スコア結果画面**
  - [ ] 6.2.1 `components/scoring/ScoreBreakdown.tsx` スコア詳細
    - [ ] 6.2.1.1 基本スコア表示
    - [ ] 6.2.1.2 各種ボーナス表示
    - [ ] 6.2.1.3 難易度補正表示
    - [ ] 6.2.1.4 総合スコア表示

### 7. スコア検証・不正防止
- [ ] **7.1 スコア妥当性検証**
  - [ ] 7.1.1 `lib/scoring/validation.ts` スコア検証機能
  - [ ] 7.1.2 異常スコア検出
    - [ ] 7.1.2.1 理論上最大スコア超過チェック
    - [ ] 7.1.2.2 負のスコア値チェック
    - [ ] 7.1.2.3 時間データとの整合性確認
    - [ ] 7.1.2.4 距離データとの整合性確認

- [ ] **7.2 不正行為検出**
  - [ ] 7.2.1 `lib/scoring/anti-cheat.ts` 不正検出機能
    - [ ] 7.2.1.1 異常に短い時間での高得点検出
    - [ ] 7.2.1.2 連続完璧推測の検出
    - [ ] 7.2.1.3 座標操作パターン検出
    - [ ] 7.2.1.4 疑わしいスコア記録フラグ

### 8. パフォーマンス最適化
- [ ] **8.1 スコア計算最適化**
  - [ ] 8.1.1 `lib/scoring/optimization.ts` 計算最適化
  - [ ] 8.1.2 計算効率化
    - [ ] 8.1.2.1 数学関数のメモ化
    - [ ] 8.1.2.2 繰り返し計算の最適化
    - [ ] 8.1.2.3 バッチ処理による効率化
    - [ ] 8.1.2.4 不要な再計算の排除

- [ ] **8.2 ランキング更新最適化**
  - [ ] 8.2.1 増分更新システム
    - [ ] 8.2.1.1 全体再計算の回避
    - [ ] 8.2.1.2 影響範囲限定更新
    - [ ] 8.2.1.3 非同期バックグラウンド更新
    - [ ] 8.2.1.4 キャッシュ戦略最適化

## 🔄 実装順序

### Phase 1: 基盤スコア計算 (3時間)
1. 基本スコア計算エンジン
2. 時間ボーナス計算
3. 特別ボーナスシステム
4. 基本的なスコア表示UI

### Phase 2: 高度な機能 (4時間)
1. 難易度補正システム
2. スコア履歴・統計
3. ランキング統合
4. レーティングシステム

### Phase 3: 表示・検証 (2時間)
1. スコア表示・UI統合
2. スコア検証・不正防止
3. エラーハンドリング強化

### Phase 4: 最適化 (1時間)
1. パフォーマンス最適化
2. 計算効率化
3. 総合テスト・調整

## 🎯 完了条件

### 計算精度確認項目
- [ ] GeoGuessrと同等のスコア計算精度
- [ ] 距離とスコアの相関が正確
- [ ] ボーナス計算が正しく適用される
- [ ] 難易度補正が適切に機能する

### UI/UX確認項目
- [ ] スコアアニメーションが美しく表示される
- [ ] スコア内訳が分かりやすく表示される
- [ ] リアルタイム更新が滑らか
- [ ] ランキング表示が正確

### セキュリティ確認項目
- [ ] スコア改ざん防止が機能する
- [ ] 異常スコア検出が働く
- [ ] 不正行為検出が適切
- [ ] データ整合性が保たれる

## 📝 実装メモ

### スコア計算式詳細

#### 基本スコア計算
```typescript
// lib/scoring/distance-score.ts
export function calculateDistanceScore(distanceKm: number): number {
  // GeoGuessr式スコア計算
  const score = 5000 * Math.exp(-distanceKm / 2000);
  return Math.floor(Math.max(0, Math.min(5000, score)));
}

// スコア-距離対応表
// 0km: 5000点
// 100km: ~4878点
// 500km: ~3894点
// 1000km: ~3033点
// 2000km: ~1839点
// 5000km: ~410点
// 10000km: ~67点
```

#### 時間ボーナス計算
```typescript
// lib/scoring/time-bonus.ts
export function calculateTimeBonus(timeSeconds: number): number {
  if (timeSeconds <= 10) return 500;
  if (timeSeconds <= 30) return 300;
  if (timeSeconds <= 60) return 100;
  return 0;
}

export function calculateTimeBonusSmooth(timeSeconds: number): number {
  // スムーズな時間ボーナス（線形減衰）
  if (timeSeconds <= 10) return 500;
  if (timeSeconds <= 60) {
    return Math.floor(500 * (60 - timeSeconds) / 50);
  }
  return 0;
}
```

#### 完璧推測ボーナス
```typescript
// lib/scoring/perfect-bonus.ts
export function calculatePerfectBonus(
  distanceKm: number,
  threshold: number = 0.15
): number {
  return distanceKm <= threshold ? 1000 : 0;
}

// 完璧推測の難易度別調整
export function calculatePerfectBonusWithDifficulty(
  distanceKm: number,
  difficulty: 'easy' | 'normal' | 'hard' | 'expert'
): number {
  const thresholds = {
    easy: 0.25,    // 250m
    normal: 0.15,  // 150m
    hard: 0.10,    // 100m
    expert: 0.05,  // 50m
  };
  
  const bonuses = {
    easy: 500,
    normal: 1000,
    hard: 1500,
    expert: 2000,
  };
  
  return distanceKm <= thresholds[difficulty] ? bonuses[difficulty] : 0;
}
```

### 難易度レーティングシステム

#### 温泉宿難易度計算
```typescript
// lib/scoring/difficulty-rating.ts
export interface SpaStatistics {
  totalGuesses: number;
  averageDistance: number;
  averageTime: number;
  perfectGuesses: number;
  averageScore: number;
}

export function calculateDifficultyRating(stats: SpaStatistics): number {
  // 複数指標による難易度計算
  const distanceRating = Math.log(stats.averageDistance + 1) * 10;
  const timeRating = Math.log(stats.averageTime + 1) * 5;
  const perfectRating = (1 - stats.perfectGuesses / stats.totalGuesses) * 20;
  const scoreRating = (5000 - stats.averageScore) / 100;
  
  return Math.max(0, Math.min(100, 
    distanceRating + timeRating + perfectRating + scoreRating
  ));
}

export function getDifficultyCategory(rating: number): 
  'very_easy' | 'easy' | 'normal' | 'hard' | 'very_hard' {
  if (rating <= 20) return 'very_easy';
  if (rating <= 40) return 'easy';
  if (rating <= 60) return 'normal';
  if (rating <= 80) return 'hard';
  return 'very_hard';
}
```

### レーティングシステム実装

#### プレイヤーレーティング
```typescript
// lib/scoring/rating-system.ts
export interface PlayerRating {
  rating: number;
  confidence: number; // レーティングの信頼度
  gamesPlayed: number;
  volatility: number; // レーティングの変動性
}

export function updatePlayerRating(
  currentRating: PlayerRating,
  gameScore: number,
  expectedScore: number
): PlayerRating {
  const K = calculateKFactor(currentRating);
  const performance = (gameScore - expectedScore) / 5000;
  
  const newRating = currentRating.rating + K * performance * 100;
  const newConfidence = Math.min(1.0, 
    currentRating.confidence + 0.1 / Math.sqrt(currentRating.gamesPlayed + 1)
  );
  
  return {
    rating: newRating,
    confidence: newConfidence,
    gamesPlayed: currentRating.gamesPlayed + 1,
    volatility: updateVolatility(currentRating.volatility, performance),
  };
}

function calculateKFactor(rating: PlayerRating): number {
  // 新規プレイヤーはK値大きく、熟練プレイヤーは小さく
  if (rating.gamesPlayed < 10) return 40;
  if (rating.gamesPlayed < 50) return 20;
  return 10;
}
```

### UI統合実装例

#### スコア表示コンポーネント
```typescript
// components/scoring/ScoreDisplay.tsx
import { useSpring, animated } from '@react-spring/web';

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  duration?: number;
  showBreakdown?: boolean;
}

export function ScoreDisplay({ 
  score, 
  maxScore = 5000, 
  duration = 2000,
  showBreakdown = false 
}: ScoreDisplayProps) {
  const { displayScore } = useSpring({
    displayScore: score,
    from: { displayScore: 0 },
    config: { duration },
  });

  const scorePercentage = (score / maxScore) * 100;
  const scoreColor = getScoreColor(scorePercentage);

  return (
    <div className="text-center">
      <animated.div 
        className={`text-6xl font-bold ${scoreColor}`}
      >
        {displayScore.to(val => Math.floor(val).toLocaleString())}
      </animated.div>
      
      <div className="text-lg text-muted-foreground">
        / {maxScore.toLocaleString()} pts
      </div>
      
      {showBreakdown && (
        <ScoreBreakdown score={score} />
      )}
    </div>
  );
}

function getScoreColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-500';
  if (percentage >= 60) return 'text-yellow-500';
  if (percentage >= 40) return 'text-orange-500';
  return 'text-red-500';
}
```

---

**完了後の次のアクション:** [08_image_management.md](./08_image_management.md) で画像管理システム実装開始 