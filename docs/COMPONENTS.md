# SpaGuessr コンポーネント実装詳細

本書はSpaGuessrの主要コンポーネントの実装詳細を記録し、開発者が正確な実装を行えるようにするためのガイドです。

## 📋 目次
- [GameScreen](#gamescreen) - メインゲーム画面
- [GameMap](#gamemap) - 地図コンポーネント
- [重要な実装注意点](#重要な実装注意点)

## GameScreen

### 概要
メインゲーム画面を管理するコンポーネント。画像表示、タイマー、ナビゲーション、結果表示などの全体的なゲームフローを制御。

### 主要なState管理

```typescript
// 基本ゲーム状態
const [userId, setUserId] = useState<string | null>(null)
const [isStarting, setIsStarting] = useState(false)
const [isSubmitting, setIsSubmitting] = useState(false)

// 地図制御
const [mapSize, setMapSize] = useState<MapSize>('small') // 'small' | 'large'
const [showMap, setShowMap] = useState(true)
const [isMapHovered, setIsMapHovered] = useState(false)

// 画像表示制御
const [currentImageIndex, setCurrentImageIndex] = useState(0)
const [hasCompletedImageCycle, setHasCompletedImageCycle] = useState(false)
const [showGuessPrompt, setShowGuessPrompt] = useState(false)
const [imageZoomKey, setImageZoomKey] = useState(0) // ズームアニメーションリセット用

// タイマー制御
const [timeRemaining, setTimeRemaining] = useState(60)
const [isTimerActive, setIsTimerActive] = useState(false)
const [isTimeUp, setIsTimeUp] = useState(false)

// Zustand Store
const {
  session, currentImage, isLoading, error, currentGuess, lastResult, hasSubmittedGuess,
  setSession, setCurrentImage, setLoading, setError, setResult, clearResult, 
  startRound, reset, clearGuess
} = useGameStore()
```

### 重要なuseEffect処理

#### 1. 自動画像切り替え
```typescript
useEffect(() => {
  if (!currentImage || !currentImage.images || currentImage.images.length <= 1 || hasCompletedImageCycle || isTimeUp) return

  const interval = setInterval(() => {
    setCurrentImageIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      
      if (nextIndex >= currentImage.images.length) {
        setHasCompletedImageCycle(true)
        setShowGuessPrompt(true)
        return prevIndex // 最後の画像で停止
      }
      
      return nextIndex
    })
  }, 5000) // 5秒間隔

  return () => clearInterval(interval)
}, [currentImage, hasCompletedImageCycle, isTimeUp])
```

#### 2. タイマー制御
```typescript
// タイマー開始
useEffect(() => {
  if (currentImage && !isTimerActive && !hasSubmittedGuess && !isTimeUp) {
    setIsTimerActive(true)
  }
}, [currentImage, isTimerActive, hasSubmittedGuess, isTimeUp])

// カウントダウン
useEffect(() => {
  if (!isTimerActive || hasSubmittedGuess || isTimeUp) return

  const timer = setInterval(() => {
    setTimeRemaining((prev) => {
      if (prev <= 1) {
        setIsTimeUp(true)
        setIsTimerActive(false)
        setTimeout(() => handleTimeUp(), 0) // ステート更新サイクル外で実行
        return 0
      }
      return prev - 1
    })
  }, 1000)

  return () => clearInterval(timer)
}, [isTimerActive, hasSubmittedGuess, isTimeUp])
```

#### 3. ズームアニメーションリセット
```typescript
// 画像切り替え時にズームアニメーションをリセット
useEffect(() => {
  if (!hasCompletedImageCycle) {
    setImageZoomKey(prev => prev + 1)
  }
}, [currentImageIndex, hasCompletedImageCycle])
```

#### 4. キーボードナビゲーション
```typescript
useEffect(() => {
  const handleKeyPress = (event: KeyboardEvent) => {
    // Spaceキー: 次のラウンドへ（結果表示時）
    if (event.code === 'Space' && lastResult && !isLoading) {
      event.preventDefault()
      handleNextRound()
    }
    
    // 矢印キー: 画像ナビゲーション（画像サイクル完了後）
    if (hasCompletedImageCycle && !lastResult) {
      if (event.code === 'ArrowLeft') {
        event.preventDefault()
        goToPreviousImage()
      } else if (event.code === 'ArrowRight') {
        event.preventDefault()
        goToNextImage()
      }
    }
  }

  if (lastResult || hasCompletedImageCycle) {
    document.addEventListener('keydown', handleKeyPress)
  }

  return () => {
    document.removeEventListener('keydown', handleKeyPress)
  }
}, [lastResult, isLoading, hasCompletedImageCycle])
```

### 重要な関数実装

#### handleTimeUp（エラー回避版）
```typescript
const handleTimeUp = async () => {
  if (!session || hasSubmittedGuess || isSubmitting || !currentImage) return

  try {
    setIsSubmitting(true)
    
    // submitGuessを呼ばずに直接結果を作成（重要！）
    const correctSpa = currentImage.spa
    
    if (!correctSpa) {
      setError('時間切れの処理中にエラーが発生しました')
      return
    }
    
    const timeUpResult = {
      distance: 999999,
      score: 0,
      correctLocation: {
        lat: parseFloat(correctSpa.latitude),
        lng: parseFloat(correctSpa.longitude),
        name: correctSpa.name,
        prefecture: correctSpa.prefecture,
        city: correctSpa.city
      },
      isGameComplete: (session.currentRound + 1) >= 5,
      totalScore: session.totalScore,
      currentRound: session.currentRound + 1,
      totalRounds: 5,
      isTimeUp: true // 時間切れフラグ
    }
    
    setResult(timeUpResult)
    clearGuess() // 青ピンを表示しない
    
    setSession({
      ...session,
      currentRound: timeUpResult.currentRound,
      totalScore: timeUpResult.totalScore,
      status: timeUpResult.isGameComplete ? 'completed' : 'playing'
    })
    
  } catch (err) {
    console.error('Error in handleTimeUp:', err)
    setError('時間切れの処理中にエラーが発生しました')
  } finally {
    setIsSubmitting(false)
  }
}
```

### UI実装のポイント

#### 画像表示（ケン・バーンズ効果付き）
```jsx
<div className="absolute inset-0">
  <Image
    key={`${currentImage.spa.id}-${currentImageIndex}-${imageZoomKey}`}
    src={currentImage.images[currentImageIndex]?.originalUrl || currentImage.images[0]?.originalUrl}
    alt={currentImage.images[currentImageIndex]?.alt || currentImage.images[0]?.alt}
    fill
    className={`object-cover ${
      !hasCompletedImageCycle ? 'animate-ken-burns' : ''
    }`}
    priority
  />
</div>
```

**重要**: 
- `transition-transform duration-75` は使用しない（アニメーション干渉防止）
- `key` プロパティで各画像の新しいアニメーションを保証

#### 画像インジケーター（2段階UI）
```jsx
{hasCompletedImageCycle ? (
  // 手動ナビゲーション時: クリック可能
  <div className="flex items-center space-x-3">
    <div className="flex space-x-1">
      {currentImage.images.map((_, index) => (
        <button
          key={index}
          onClick={() => goToImageIndex(index)}
          className={`w-3 h-3 rounded-full transition-all hover:scale-110 ${
            index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
          }`}
        />
      ))}
    </div>
    <span>{currentImageIndex + 1} / {currentImage.images.length}</span>
    <div className="text-xs opacity-80">← → で切り替え</div>
  </div>
) : (
  // 自動再生時: 静的表示
  <div className="flex items-center space-x-2">
    <div className="flex space-x-1">
      {currentImage.images.map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full transition-colors ${
            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
          }`}
        />
      ))}
    </div>
    <span>{currentImageIndex + 1} / {currentImage.images.length}</span>
  </div>
)}
```

## GameMap

### 概要
Mapbox GL JSを使用した地図コンポーネント。ユーザーの推測ピン、正解ピンの表示と地図操作を管理。

### 重要な修正内容

#### 🚨 絶対に避けるべき実装
```typescript
// ❌ 複雑な手動positioning（エラーの原因）
useEffect(() => {
  setTimeout(() => {
    const container = map.getContainer()
    const bounds = container.getBoundingClientRect()
    // 複雑なDOM操作とpositioning...
  }, 100)
}, [userGuess])
```

#### ✅ 正しい実装（シンプルなMapboxマーカー）
```typescript
// ユーザー推測ピン
useEffect(() => {
  if (userGuess && map) {
    if (userMarkerRef.current) {
      userMarkerRef.current.remove()
    }
    
    const marker = new mapboxgl.Marker({ color: '#3B82F6' })
      .setLngLat([userGuess.lng, userGuess.lat])
      .addTo(map)
    
    userMarkerRef.current = marker
  }
}, [userGuess, map])

// 正解ピン
useEffect(() => {
  if (correctLocation && map) {
    if (correctMarkerRef.current) {
      correctMarkerRef.current.remove()
    }
    
    const marker = new mapboxgl.Marker({ color: '#10B981' })
      .setLngLat([correctLocation.lng, correctLocation.lat])
      .addTo(map)
    
    correctMarkerRef.current = marker
  }
}, [correctLocation, map])
```

### マーカー管理
```typescript
const userMarkerRef = useRef<mapboxgl.Marker | null>(null)
const correctMarkerRef = useRef<mapboxgl.Marker | null>(null)

// クリーンアップ
useEffect(() => {
  return () => {
    if (userMarkerRef.current) {
      userMarkerRef.current.remove()
    }
    if (correctMarkerRef.current) {
      correctMarkerRef.current.remove()
    }
  }
}, [])
```

### 地図リサイズ処理
```typescript
useEffect(() => {
  if (map && mapContainer.current) {
    // 複数回のリサイズ呼び出しで確実に更新
    map.resize()
    
    setTimeout(() => map.resize(), 100)
    setTimeout(() => map.resize(), 300)
    
    // ResizeObserverでコンテナサイズ変更を監視
    const resizeObserver = new ResizeObserver(() => {
      map.resize()
    })
    
    resizeObserver.observe(mapContainer.current)
    
    return () => {
      resizeObserver.disconnect()
    }
  }
}, [map, mapSize])
```

## CSS アニメーション設定

### tailwind.config.ts
```typescript
keyframes: {
  "ken-burns": {
    "0%": { transform: "scale(1.00)" },
    "100%": { transform: "scale(1.05)" },
  },
},
animation: {
  "ken-burns": "ken-burns 5s ease-in-out forwards",
},
```

### 重要なポイント
- **イージング**: `ease-in-out` で滑らかな加減速
- **継続時間**: 5秒（画像表示時間と完全同期）
- **拡大率**: 5%（控えめで上品な効果）
- **forwards**: アニメーション終了状態を維持

## 重要な実装注意点

### 1. エラー回避
- **地図ピン**: 複雑な手動positioning を避け、基本的なMapboxマーカーAPI を使用
- **タイマー**: submitGuess ではなく直接結果作成でエラー回避
- **CSS**: transition-transform との併用を避ける

### 2. パフォーマンス
- **画像キー**: 適切なkey設定でアニメーションリセット
- **リサイズ**: 複数回呼び出し + ResizeObserver で確実な地図更新
- **メモリ**: useRefでマーカー参照管理、適切なクリーンアップ

### 3. UX設計
- **直感的操作**: 不要なメッセージは表示しない
- **段階的UI**: 自動再生 → 手動ナビゲーション の明確な区別
- **視覚フィードバック**: 適切なホバー効果とアニメーション

### 4. 型定義
```typescript
type MapSize = 'small' | 'large' // mediumは使用しない

interface CurrentImage {
  spa: SpaInfo
  images: ImageInfo[] // 必ず配列形式
}

interface GameResult {
  distance: number
  score: number
  correctLocation: CorrectLocation
  isGameComplete: boolean
  totalScore: number
  currentRound: number
  totalRounds: number
  isTimeUp?: boolean // 時間切れフラグ
}
```

この実装ガイドに従えば、同じ問題を回避して安定したゲーム体験を提供できます。 