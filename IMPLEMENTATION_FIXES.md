# SpaGuessr 実装修正記録

本書は初期実装後に行われた重要な修正内容を記録し、将来の開発で同じ状態を一発で再現できるようにするための詳細な実装ガイドです。

## 📝 修正概要

初期のMDファイルに基づいて実装したが、実際の運用において以下の問題が発生し、段階的に修正を実施しました。

### 修正履歴サマリー
1. **地図ピン位置の修正** - 青いピンが間違った位置に表示される問題
2. **画像表示機能の強化** - 複数画像の自動切り替えと手動ナビゲーション
3. **タイマー機能の実装** - 60秒カウントダウンと自動結果表示
4. **視覚効果の追加** - ケン・バーンズ効果によるズームイン
5. **UI/UX の改善** - 地図サイズ簡素化、不要メッセージ削除

## 🔧 詳細修正内容

### 1. 地図ピン位置修正 (GameMap.tsx)

**問題**: 青いピン（ユーザーの推測）が正しい位置に表示されず、高精度スコア（960点、0.1km）でもピンが大きくずれて表示される

**原因**: 複雑な手動positioning処理とDOM操作のsetTimeoutが干渉

**修正内容**:
```typescript
// ❌ 修正前: 複雑な手動positioning
useEffect(() => {
  setTimeout(() => {
    const container = map.getContainer()
    // 複雑なDOM操作とpositioning...
  }, 100)
}, [userGuess])

// ✅ 修正後: シンプルなMapboxマーカー
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
```

**結果**: ピンが正確な位置に表示され、高精度推測時の表示も正常化

### 2. 複数画像表示機能の実装

**要件**: 1枚の静止画ではなく、6枚の画像を5秒間隔で自動表示

**実装内容**:

#### 2.1 データ構造の変更
```typescript
// lib/actions/game-mock.ts
interface CurrentImage {
  spa: SpaInfo
  images: ImageInfo[] // 単一imageから配列に変更
}

// sample-spas.ts - 各温泉に6枚目の画像を追加
const sampleSpas = [
  {
    id: 1,
    name: "草津温泉",
    images: [
      { id: 1, originalUrl: "/images/kusatsu-1.jpg", alt: "草津温泉の湯畑" },
      { id: 2, originalUrl: "/images/kusatsu-2.jpg", alt: "草津温泉の源泉" },
      { id: 3, originalUrl: "/images/kusatsu-3.jpg", alt: "草津温泉の旅館" },
      { id: 4, originalUrl: "/images/kusatsu-4.jpg", alt: "草津温泉の露天風呂" },
      { id: 5, originalUrl: "/images/kusatsu-5.jpg", alt: "草津温泉の町並み" },
      { id: 6, originalUrl: "/images/kusatsu-6.jpg", alt: "草津温泉の夜景" }
    ]
  }
]
```

#### 2.2 自動画像切り替え機能
```typescript
// GameScreen.tsx
const [currentImageIndex, setCurrentImageIndex] = useState(0)
const [hasCompletedImageCycle, setHasCompletedImageCycle] = useState(false)

useEffect(() => {
  if (!currentImage || !currentImage.images || currentImage.images.length <= 1 || hasCompletedImageCycle || isTimeUp) return

  const interval = setInterval(() => {
    setCurrentImageIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      
      if (nextIndex >= currentImage.images.length) {
        setHasCompletedImageCycle(true)
        return prevIndex // Stop at the last image
      }
      
      return nextIndex
    })
  }, 5000) // 5秒間隔

  return () => clearInterval(interval)
}, [currentImage, hasCompletedImageCycle, isTimeUp])
```

#### 2.3 画像インジケーター
```jsx
{/* Static indicator during auto-play */}
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
```

### 3. 画像ナビゲーション機能の実装

**要件**: 全画像表示完了後に、ユーザーが手動で画像を見直せる機能

**実装内容**:

#### 3.1 ナビゲーション関数
```typescript
const goToPreviousImage = () => {
  if (!hasCompletedImageCycle || !currentImage?.images) return
  setCurrentImageIndex((prevIndex) => {
    return prevIndex > 0 ? prevIndex - 1 : currentImage.images.length - 1
  })
}

const goToNextImage = () => {
  if (!hasCompletedImageCycle || !currentImage?.images) return
  setCurrentImageIndex((prevIndex) => {
    return prevIndex < currentImage.images.length - 1 ? prevIndex + 1 : 0
  })
}

const goToImageIndex = (index: number) => {
  if (!hasCompletedImageCycle || !currentImage?.images) return
  if (index >= 0 && index < currentImage.images.length) {
    setCurrentImageIndex(index)
  }
}
```

#### 3.2 UI要素
```jsx
{/* 左右の矢印ボタン */}
{hasCompletedImageCycle && currentImage.images && currentImage.images.length > 1 && (
  <>
    <button
      onClick={goToPreviousImage}
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110"
    >
      <ChevronLeft className="h-6 w-6" />
    </button>
    
    <button
      onClick={goToNextImage}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110"
    >
      <ChevronRight className="h-6 w-6" />
    </button>
  </>
)}

{/* クリック可能ドットインジケーター */}
{hasCompletedImageCycle ? (
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
  {/* 自動再生時の静的インジケーター */}
)}
```

#### 3.3 キーボードナビゲーション
```typescript
useEffect(() => {
  const handleKeyPress = (event: KeyboardEvent) => {
    // 画像ナビゲーション（画像サイクル完了後）
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

  if (hasCompletedImageCycle) {
    document.addEventListener('keydown', handleKeyPress)
  }

  return () => {
    document.removeEventListener('keydown', handleKeyPress)
  }
}, [hasCompletedImageCycle])
```

### 4. 60秒タイマー機能の実装

**要件**: ゲーム開始から60秒でタイムアップ、自動的に結果表示

**実装内容**:

#### 4.1 タイマーステート
```typescript
const [timeRemaining, setTimeRemaining] = useState(60)
const [isTimerActive, setIsTimerActive] = useState(false)
const [isTimeUp, setIsTimeUp] = useState(false)
```

#### 4.2 タイマー開始タイミング
```typescript
// 最初の画像表示時にタイマー開始
useEffect(() => {
  if (currentImage && !isTimerActive && !hasSubmittedGuess && !isTimeUp) {
    setIsTimerActive(true)
  }
}, [currentImage, isTimerActive, hasSubmittedGuess, isTimeUp])
```

#### 4.3 カウントダウン処理
```typescript
useEffect(() => {
  if (!isTimerActive || hasSubmittedGuess || isTimeUp) return

  const timer = setInterval(() => {
    setTimeRemaining((prev) => {
      if (prev <= 1) {
        setIsTimeUp(true)
        setIsTimerActive(false)
        setTimeout(() => handleTimeUp(), 0)
        return 0
      }
      return prev - 1
    })
  }, 1000)

  return () => clearInterval(timer)
}, [isTimerActive, hasSubmittedGuess, isTimeUp])
```

#### 4.4 時間切れ処理（修正版）
```typescript
const handleTimeUp = async () => {
  if (!session || hasSubmittedGuess || isSubmitting || !currentImage) return

  try {
    setIsSubmitting(true)
    
    // submitGuessを呼ばずに直接結果を作成（エラー回避）
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
      isTimeUp: true
    }
    
    setResult(timeUpResult)
    clearGuess()
    
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

#### 4.5 タイマーUI
```jsx
{/* タイマー表示 */}
{currentImage && !hasSubmittedGuess && (
  <div className={`bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white ${
    timeRemaining <= 10 ? 'animate-pulse bg-red-600/70' : ''
  }`}>
    <div className="text-center">
      <div className="text-xs opacity-80">残り時間</div>
      <div className={`text-lg font-bold ${
        timeRemaining <= 10 ? 'text-red-300' : 'text-blue-300'
      }`}>
        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
      </div>
    </div>
  </div>
)}
```

### 5. ケン・バーンズ効果（ズームイン）の実装

**要件**: 各画像表示中に100%→105%のスローズーム（5秒間）

**実装内容**:

#### 5.1 CSS アニメーション定義
```typescript
// tailwind.config.ts
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

#### 5.2 アニメーション適用
```typescript
// GameScreen.tsx
const [imageZoomKey, setImageZoomKey] = useState(0)

// 画像切り替え時にアニメーションリセット
useEffect(() => {
  if (!hasCompletedImageCycle) {
    setImageZoomKey(prev => prev + 1)
  }
}, [currentImageIndex, hasCompletedImageCycle])

// 画像にアニメーション適用
<Image
  key={`${currentImage.spa.id}-${currentImageIndex}-${imageZoomKey}`}
  src={currentImage.images[currentImageIndex]?.originalUrl}
  alt={currentImage.images[currentImageIndex]?.alt}
  fill
  className={`object-cover ${
    !hasCompletedImageCycle ? 'animate-ken-burns' : ''
  }`}
  priority
/>
```

**重要**: `transition-transform duration-75` を削除（干渉防止）

### 6. 地図サイズの簡素化

**問題**: medium サイズが不要で操作が複雑

**修正内容**:
```typescript
// 修正前: 3段階サイズ
type MapSize = 'small' | 'medium' | 'large'

// 修正後: 2段階サイズ
type MapSize = 'small' | 'large'

// ホバー動作の簡素化
const handleMapMouseEnter = () => {
  if (mapSize === 'small') {
    setMapSize('large') // 直接 large に切り替え
  }
}

const handleMapMouseLeave = () => {
  setTimeout(() => {
    if (mapSize === 'large') {
      setMapSize('small') // 直接 small に戻す
    }
  }, 300)
}
```

### 7. UI改善

#### 7.1 推測プロンプトメッセージの削除
```jsx
// ❌ 削除: 煩わしい説明メッセージ
{showGuessPrompt && hasCompletedImageCycle && (
  <div className="absolute inset-x-0 bottom-20 z-20 flex justify-center">
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg shadow-xl animate-bounce">
      <div className="text-center">
        <div className="text-lg font-bold mb-2">📍 全ての画像を確認しました！</div>
        <div className="text-sm opacity-90">準備ができたら、地図をクリックして温泉の場所を推測してください</div>
      </div>
    </div>
  </div>
)}

// ✅ 修正後: メッセージなし、クリーンなUI
```

#### 7.2 地図自動拡大の無効化
```typescript
// ❌ 修正前: 画像サイクル完了時に自動拡大
useEffect(() => {
  if (hasCompletedImageCycle) {
    if (!showMap) {
      setShowMap(true)
    }
    if (mapSize === 'small') {
      setMapSize('medium') // 自動拡大
    }
  }
}, [hasCompletedImageCycle, showMap, mapSize])

// ✅ 修正後: 地図表示復活のみ、サイズ自動変更なし
useEffect(() => {
  if (hasCompletedImageCycle) {
    if (!showMap) {
      setShowMap(true)
    }
    // 自動拡大を削除
  }
}, [hasCompletedImageCycle, showMap])
```

## 🎯 最終的な完成機能

### 画像表示フロー
```
開始 → 画像1(5秒+ズーム) → 画像2(5秒+ズーム) → ... → 画像6(5秒+ズーム)
↓
手動ナビゲーション開始（矢印ボタン、ドット、キーボード）
↓
推測フェーズ（地図クリック）
↓
結果表示
```

### タイマーフロー
```
画像1表示開始 → 60秒タイマー開始
↓
手動推測 → タイマー停止 → 通常結果
OR
60秒経過 → 自動タイムアップ → 時間切れ結果（0点）
```

### 視覚効果
- **ケン・バーンズ効果**: 各画像で100%→105%ズーム（5秒間）
- **スムーズな画像ナビゲーション**: 手動切り替え時はアニメーションなし
- **直感的な地図操作**: small ↔ large の2段階のみ

## 📋 今後の開発での注意点

1. **GameMap.tsx**: 複雑な手動positioning処理は使用せず、基本的なMapboxマーカーAPI を使用
2. **画像データ**: 必ず6枚の画像を用意し、配列形式で管理
3. **タイマー処理**: submitGuess ではなく直接結果作成でエラー回避
4. **CSS アニメーション**: transition-transform との併用は避ける
5. **UI設計**: 不要なメッセージは表示せず、直感的な操作を重視

この記録に基づいて実装すれば、同じ問題を回避して現在の完成状態を一発で再現できます。 