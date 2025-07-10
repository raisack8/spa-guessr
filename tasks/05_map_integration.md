# 🗺️ Mapbox地図機能統合

## 📋 タスク一覧

### 1. Mapbox基盤セットアップ
- [ ] **1.1 Mapbox設定・初期化**
  - [ ] 1.1.1 環境変数設定確認 (`NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`)
  - [ ] 1.1.2 `lib/mapbox/config.ts` 設定ファイル作成
  - [ ] 1.1.3 日本地図の境界設定（maxBounds）
  - [ ] 1.1.4 初期表示設定（center, zoom, style）

- [ ] **1.2 Mapbox型定義・ユーティリティ**
  - [ ] 1.2.1 `lib/mapbox/types.ts` 型定義作成
  - [ ] 1.2.2 地図インスタンス型定義
  - [ ] 1.2.3 マーカー・ピン型定義
  - [ ] 1.2.4 座標・境界型定義

### 2. 基本地図コンポーネント
- [ ] **2.1 メイン地図コンポーネント**
  - [ ] 2.1.1 `components/map/MapboxMap.tsx` 基本地図コンポーネント作成
    - [ ] 2.1.1.1 地図コンテナRef設定
    - [ ] 2.1.1.2 Mapbox GL JSインスタンス初期化
    - [ ] 2.1.1.3 日本境界内制限設定
    - [ ] 2.1.1.4 初期スタイル設定（satellite-v9）
    - [ ] 2.1.1.5 useEffect でのマウント・アンマウント

- [ ] **2.2 地図操作コントロール**
  - [ ] 2.2.1 `components/map/MapControls.tsx` 操作コントロール作成
    - [ ] 2.2.1.1 ズームイン・ズームアウトボタン
    - [ ] 2.2.1.2 地図リセット（全体表示）ボタン
    - [ ] 2.2.1.3 衛星・地図表示切り替えボタン
    - [ ] 2.2.1.4 カスタムコントロールUI

- [ ] **2.3 コンパス・方向表示**
  - [ ] 2.3.1 `components/map/CompassOverlay.tsx` コンパス作成
    - [ ] 2.3.1.1 北方向インジケーター
    - [ ] 2.3.1.2 クリックでの北向きリセット
    - [ ] 2.3.1.3 回転アニメーション対応
    - [ ] 2.3.1.4 GeoGuessr風デザイン

### 3. ピン・マーカー機能
- [ ] **3.1 推測ピン機能**
  - [ ] 3.1.1 `components/map/GuessPin.tsx` 推測ピンコンポーネント
    - [ ] 3.1.1.1 青色ピン表示（ユーザー推測）
    - [ ] 3.1.1.2 地図クリックでピン配置
    - [ ] 3.1.1.3 ドラッグでピン移動機能
    - [ ] 3.1.1.4 ピン配置アニメーション

- [ ] **3.2 正解ピン表示**
  - [ ] 3.2.1 `components/map/AnswerPin.tsx` 正解ピンコンポーネント
    - [ ] 3.2.1.1 赤色ピン表示（正解位置）
    - [ ] 3.2.1.2 固定位置表示（移動不可）
    - [ ] 3.2.1.3 結果発表時のみ表示
    - [ ] 3.2.1.4 アニメーション効果

- [ ] **3.3 距離線表示**
  - [ ] 3.3.1 `components/map/DistanceLine.tsx` 距離線コンポーネント
    - [ ] 3.3.1.1 推測位置と正解位置を結ぶ線
    - [ ] 3.3.1.2 GeoJSON LineString使用
    - [ ] 3.3.1.3 線の色・太さ設定
    - [ ] 3.3.1.4 アニメーション描画

### 4. 地図スタイル・表示設定
- [ ] **4.1 地図スタイル切り替え**
  - [ ] 4.1.1 `lib/mapbox/styles.ts` スタイル定義
    - [ ] 4.1.1.1 衛星画像スタイル設定
    - [ ] 4.1.1.2 標準地図スタイル設定
    - [ ] 4.1.1.3 地名表示・非表示設定
    - [ ] 4.1.1.4 スタイル切り替え関数

- [ ] **4.2 地図表示最適化**
  - [ ] 4.2.1 日本地域特化設定
    - [ ] 4.2.1.1 日本の地理的境界設定 (maxBounds)
    - [ ] 4.2.1.2 最小・最大ズームレベル設定
    - [ ] 4.2.1.3 初期表示中心点設定（日本中央）
    - [ ] 4.2.1.4 範囲外パン防止設定

### 5. インタラクション機能
- [ ] **5.1 地図クリック・操作**
  - [ ] 5.1.1 `lib/mapbox/interactions.ts` 操作関数集
    - [ ] 5.1.1.1 地図クリックイベント処理
    - [ ] 5.1.1.2 座標取得・バリデーション
    - [ ] 5.1.1.3 ピン配置可能エリア判定
    - [ ] 5.1.1.4 無効エリアクリック警告

- [ ] **5.2 ピンドラッグ機能**
  - [ ] 5.2.1 ドラッグ可能ピン実装
    - [ ] 5.2.1.1 mousedown/touchstart イベント
    - [ ] 5.2.1.2 mousemove/touchmove での移動
    - [ ] 5.2.1.3 mouseup/touchend での確定
    - [ ] 5.2.1.4 ドラッグ中の視覚フィードバック

### 6. 地図アニメーション・エフェクト
- [ ] **6.1 ズーム・パンアニメーション**
  - [ ] 6.1.1 `lib/mapbox/animations.ts` アニメーション関数
    - [ ] 6.1.1.1 2点を含むズーム（fitBounds）
    - [ ] 6.1.1.2 スムーズパン・ズーム設定
    - [ ] 6.1.1.3 結果表示時の自動フィット
    - [ ] 6.1.1.4 アニメーション速度・イージング

- [ ] **6.2 マーカーアニメーション**
  - [ ] 6.2.1 ピン表示・非表示アニメーション
    - [ ] 6.2.1.1 ピン出現時のバウンス効果
    - [ ] 6.2.1.2 ピン消去時のフェードアウト
    - [ ] 6.2.1.3 距離線描画アニメーション
    - [ ] 6.2.1.4 結果発表演出

### 7. ゲーム統合機能
- [ ] **7.1 ゲーム状態連動**
  - [ ] 7.1.1 `hooks/useGameMap.ts` カスタムフック作成
    - [ ] 7.1.1.1 ゲーム状態との同期
    - [ ] 7.1.1.2 推測座標の管理
    - [ ] 7.1.1.3 地図表示モード切り替え
    - [ ] 7.1.1.4 ラウンド進行との連動

- [ ] **7.2 結果表示統合**
  - [ ] 7.2.1 結果発表時の地図表示
    - [ ] 7.2.1.1 推測ピンと正解ピンの同時表示
    - [ ] 7.2.1.2 距離線の表示
    - [ ] 7.2.1.3 両点を含む最適ズーム
    - [ ] 7.2.1.4 結果情報のオーバーレイ表示

### 8. パフォーマンス最適化
- [ ] **8.1 地図レンダリング最適化**
  - [ ] 8.1.1 `lib/mapbox/performance.ts` 最適化設定
    - [ ] 8.1.1.1 地図タイル読み込み最適化
    - [ ] 8.1.1.2 不要なレイヤー非表示
    - [ ] 8.1.1.3 ズームレベル別表示制御
    - [ ] 8.1.1.4 メモリ使用量最適化

- [ ] **8.2 イベント最適化**
  - [ ] 8.2.1 イベントリスナー管理
    - [ ] 8.2.1.1 debounce/throttle適用
    - [ ] 8.2.1.2 不要なイベント削除
    - [ ] 8.2.1.3 メモリリーク防止
    - [ ] 8.2.1.4 適切なクリーンアップ

### 9. エラーハンドリング・フォールバック
- [ ] **9.1 地図読み込みエラー対応**
  - [ ] 9.1.1 `components/map/MapError.tsx` エラー表示
    - [ ] 9.1.1.1 Mapboxアクセストークンエラー
    - [ ] 9.1.1.2 ネットワークエラー対応
    - [ ] 9.1.1.3 地図読み込み失敗時の表示
    - [ ] 9.1.1.4 再試行ボタン機能

- [ ] **9.2 フォールバック機能**
  - [ ] 9.2.1 地図利用不可時の代替表示
    - [ ] 9.2.1.1 静的地図画像表示
    - [ ] 9.2.1.2 座標入力フォーム
    - [ ] 9.2.1.3 都道府県選択UI
    - [ ] 9.2.1.4 エラー状況の記録・報告

## 🔄 実装順序

### Phase 1: 基盤構築 (3時間)
1. Mapbox基盤セットアップ・設定
2. 基本地図コンポーネント作成
3. 地図操作コントロール実装
4. コンパス・方向表示実装

### Phase 2: ピン・マーカー機能 (4時間)
1. 推測ピン機能実装
2. 正解ピン表示実装
3. 距離線表示実装
4. ピンドラッグ機能実装

### Phase 3: 高度な機能 (3時間)
1. 地図スタイル切り替え実装
2. アニメーション・エフェクト実装
3. ゲーム統合機能実装

### Phase 4: 最適化・仕上げ (2時間)
1. パフォーマンス最適化実装
2. エラーハンドリング実装
3. 総合テスト・調整

## 🎯 完了条件

### 基本機能確認項目
- [ ] 地図が正常に表示される（衛星画像）
- [ ] 日本国内のみ表示制限が機能する
- [ ] 地図クリックでピン配置ができる
- [ ] ピンのドラッグ移動ができる

### ゲーム統合確認項目
- [ ] 推測ピン（青）と正解ピン（赤）が表示される
- [ ] 距離線が正確に描画される
- [ ] 結果表示時に適切にズーム・フィットする
- [ ] ラウンド進行と連動して地図がリセットされる

### 操作性確認項目
- [ ] ズーム・パン操作がスムーズ
- [ ] コンパスクリックで北向きリセットできる
- [ ] 衛星・地図表示切り替えができる
- [ ] モバイルでのタッチ操作が正常

## 📝 実装メモ

### 重要な設定値

#### 地図基本設定
```typescript
// lib/mapbox/config.ts
export const MAPBOX_CONFIG = {
  style: 'mapbox://styles/mapbox/satellite-v9',
  center: [138.252924, 36.204824] as [number, number], // 日本中央
  zoom: 5,
  maxBounds: [
    [129.0, 31.0], // 南西角
    [146.0, 46.0]  // 北東角
  ] as [[number, number], [number, number]],
  minZoom: 4,
  maxZoom: 18,
} as const;
```

#### ピン設定
```typescript
// lib/mapbox/pins.ts
export const PIN_STYLES = {
  guess: {
    color: '#3B82F6', // 青色
    size: 'large',
    draggable: true,
  },
  answer: {
    color: '#EF4444', // 赤色
    size: 'large',
    draggable: false,
  },
} as const;
```

### コンポーネント実装例

#### 基本地図コンポーネント
```typescript
// components/map/MapboxMap.tsx
'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '@/lib/mapbox/config';

interface MapboxMapProps {
  onMapClick?: (coordinates: [number, number]) => void;
  guessPin?: [number, number] | null;
  answerPin?: [number, number] | null;
  showDistanceLine?: boolean;
}

export function MapboxMap({ 
  onMapClick, 
  guessPin, 
  answerPin, 
  showDistanceLine 
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.style,
      center: MAPBOX_CONFIG.center,
      zoom: MAPBOX_CONFIG.zoom,
      maxBounds: MAPBOX_CONFIG.maxBounds,
      minZoom: MAPBOX_CONFIG.minZoom,
      maxZoom: MAPBOX_CONFIG.maxZoom,
    });

    // 地図クリックイベント
    map.current.on('click', (e) => {
      if (onMapClick) {
        onMapClick([e.lngLat.lng, e.lngLat.lat]);
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [onMapClick]);

  // ピン更新ロジック
  useEffect(() => {
    if (!map.current) return;
    
    // 推測ピン更新
    if (guessPin) {
      updateGuessPin(map.current, guessPin);
    }
    
    // 正解ピン更新
    if (answerPin) {
      updateAnswerPin(map.current, answerPin);
    }
    
    // 距離線更新
    if (showDistanceLine && guessPin && answerPin) {
      updateDistanceLine(map.current, guessPin, answerPin);
    }
  }, [guessPin, answerPin, showDistanceLine]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
}
```

#### ピン管理関数
```typescript
// lib/mapbox/pins.ts
import mapboxgl from 'mapbox-gl';

let guessMarker: mapboxgl.Marker | null = null;
let answerMarker: mapboxgl.Marker | null = null;

export function updateGuessPin(
  map: mapboxgl.Map, 
  coordinates: [number, number]
) {
  // 既存の推測ピンを削除
  if (guessMarker) {
    guessMarker.remove();
  }

  // 新しい推測ピンを作成
  guessMarker = new mapboxgl.Marker({
    color: '#3B82F6',
    draggable: true,
  })
    .setLngLat(coordinates)
    .addTo(map);

  // ドラッグイベント
  guessMarker.on('dragend', () => {
    const lngLat = guessMarker!.getLngLat();
    // ドラッグ後の座標をゲーム状態に反映
    updateGuessCoordinates([lngLat.lng, lngLat.lat]);
  });
}

export function updateAnswerPin(
  map: mapboxgl.Map, 
  coordinates: [number, number]
) {
  // 既存の正解ピンを削除
  if (answerMarker) {
    answerMarker.remove();
  }

  // 新しい正解ピンを作成
  answerMarker = new mapboxgl.Marker({
    color: '#EF4444',
    draggable: false,
  })
    .setLngLat(coordinates)
    .addTo(map);
}
```

#### 距離線描画
```typescript
// lib/mapbox/distance-line.ts
import mapboxgl from 'mapbox-gl';

export function updateDistanceLine(
  map: mapboxgl.Map,
  start: [number, number],
  end: [number, number]
) {
  const sourceId = 'distance-line';
  const layerId = 'distance-line-layer';

  // 既存の線を削除
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }

  // GeoJSON LineString作成
  const lineGeoJSON = {
    type: 'Feature' as const,
    geometry: {
      type: 'LineString' as const,
      coordinates: [start, end],
    },
    properties: {},
  };

  // ソースとレイヤーを追加
  map.addSource(sourceId, {
    type: 'geojson',
    data: lineGeoJSON,
  });

  map.addLayer({
    id: layerId,
    type: 'line',
    source: sourceId,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#FF6B6B',
      'line-width': 3,
      'line-opacity': 0.8,
    },
  });

  // 両点を含むように地図をフィット
  map.fitBounds([start, end], {
    padding: 50,
    maxZoom: 12,
  });
}
```

### セキュリティ・パフォーマンス

#### アクセストークン管理
```typescript
// lib/env.ts
export function validateMapboxToken() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  
  if (!token) {
    throw new Error('Mapbox access token is required');
  }
  
  if (!token.startsWith('pk.')) {
    throw new Error('Invalid Mapbox access token format');
  }
  
  return token;
}
```

#### メモリ管理
```typescript
// hooks/useGameMap.ts
export function useGameMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return { mapRef };
}
```

---

**完了後の次のアクション:** [06_game_logic.md](./06_game_logic.md) でゲームロジック実装開始 