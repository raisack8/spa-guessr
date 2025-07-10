# Mapbox GL JS 実装ガイド

SpaGuessrでのMapbox GL JS実装の詳細ガイドです。地図表示・操作の全機能を網羅します。

## 📋 目次
- [環境設定](#環境設定)
- [基本地図実装](#基本地図実装)
- [ピン・マーカー機能](#ピンマーカー機能)
- [地図コントロール](#地図コントロール)
- [スタイル・カスタマイズ](#スタイルカスタマイズ)
- [パフォーマンス最適化](#パフォーマンス最適化)

## 環境設定

### 🔧 インストール・設定

```bash
# 必須パッケージ
npm install mapbox-gl
npm install --save-dev @types/mapbox-gl

# CSS読み込み（globals.css）
@import 'mapbox-gl/dist/mapbox-gl.css';
```

### 🌍 環境変数設定

```bash
# .env.local
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token_here
```

```typescript
// lib/mapbox.ts - 設定管理
export function getMapboxToken(): string {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  
  if (!token) {
    throw new Error('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is required');
  }
  
  if (!token.startsWith('pk.')) {
    throw new Error('Invalid Mapbox token format');
  }
  
  return token;
}

// 日本の地理的境界
export const JAPAN_BOUNDS: [number, number, number, number] = [
  129.0, 31.0, // Southwest coordinates
  146.0, 46.0  // Northeast coordinates
];

export const DEFAULT_CENTER: [number, number] = [138.2529, 36.2048]; // 日本中心
export const DEFAULT_ZOOM = 5;
```

### ⚙️ Next.js設定

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['mapbox-gl']
  },
  webpack: (config) => {
    // Mapbox GL JS用の設定
    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
      options: {
        name: 'static/[hash].worker.js',
        publicPath: '/_next/',
      },
    });
    return config;
  },
};

module.exports = nextConfig;
```

## 基本地図実装

### 🗺️ MapboxMap コンポーネント

```typescript
// components/map/MapboxMap.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { getMapboxToken, JAPAN_BOUNDS, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/mapbox';

interface MapboxMapProps {
  onMapClick?: (lng: number, lat: number) => void;
  guessMarker?: { lng: number; lat: number } | null;
  answerMarker?: { lng: number; lat: number } | null;
  showDistanceLine?: boolean;
  className?: string;
}

export function MapboxMap({
  onMapClick,
  guessMarker,
  answerMarker,
  showDistanceLine = false,
  className = 'w-full h-full'
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // マーカー参照を保持
  const guessMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const answerMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // 地図初期化
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = getMapboxToken();
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // 衛星画像
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        maxBounds: JAPAN_BOUNDS, // 日本範囲に制限
        attributionControl: false, // カスタム属性に変更
      });

      // 地図読み込み完了イベント
      map.current.on('load', () => {
        setIsLoaded(true);
        
        // 距離線用のソース・レイヤーを追加
        if (map.current) {
          map.current.addSource('distance-line', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: []
              }
            }
          });

          map.current.addLayer({
            id: 'distance-line',
            type: 'line',
            source: 'distance-line',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#ff0000',
              'line-width': 3,
              'line-opacity': 0.8
            }
          });
        }
      });

      // 地図クリックイベント
      if (onMapClick) {
        map.current.on('click', (e) => {
          const { lng, lat } = e.lngLat;
          onMapClick(lng, lat);
        });
      }

      // 日本境界外クリック制限
      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        if (lng < JAPAN_BOUNDS[0] || lng > JAPAN_BOUNDS[2] || 
            lat < JAPAN_BOUNDS[1] || lat > JAPAN_BOUNDS[3]) {
          // 日本外の場合は何もしない
          return;
        }
      });

    } catch (error) {
      console.error('Mapbox initialization failed:', error);
    }
  }, [onMapClick]);

  // 推測マーカー更新
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // 既存マーカーを削除
    if (guessMarkerRef.current) {
      guessMarkerRef.current.remove();
      guessMarkerRef.current = null;
    }

    // 新しいマーカーを追加
    if (guessMarker) {
      const el = document.createElement('div');
      el.className = 'guess-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#3b82f6'; // blue-500
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      guessMarkerRef.current = new mapboxgl.Marker({ 
        element: el,
        draggable: true 
      })
        .setLngLat([guessMarker.lng, guessMarker.lat])
        .addTo(map.current);

      // ドラッグイベント
      guessMarkerRef.current.on('dragend', () => {
        if (guessMarkerRef.current && onMapClick) {
          const lngLat = guessMarkerRef.current.getLngLat();
          onMapClick(lngLat.lng, lngLat.lat);
        }
      });
    }
  }, [guessMarker, isLoaded, onMapClick]);

  // 正解マーカー更新
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // 既存マーカーを削除
    if (answerMarkerRef.current) {
      answerMarkerRef.current.remove();
      answerMarkerRef.current = null;
    }

    // 新しいマーカーを追加
    if (answerMarker) {
      const el = document.createElement('div');
      el.className = 'answer-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#ef4444'; // red-500
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      answerMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat([answerMarker.lng, answerMarker.lat])
        .addTo(map.current);
    }
  }, [answerMarker, isLoaded]);

  // 距離線更新
  useEffect(() => {
    if (!map.current || !isLoaded || !showDistanceLine) return;

    if (guessMarker && answerMarker) {
      const source = map.current.getSource('distance-line') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [guessMarker.lng, guessMarker.lat],
              [answerMarker.lng, answerMarker.lat]
            ]
          }
        });

        // 両マーカーが見えるようにズーム調整
        const bounds = new mapboxgl.LngLatBounds()
          .extend([guessMarker.lng, guessMarker.lat])
          .extend([answerMarker.lng, answerMarker.lat]);

        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 10
        });
      }
    }
  }, [guessMarker, answerMarker, showDistanceLine, isLoaded]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainer} 
      className={className}
      style={{ position: 'relative' }}
    />
  );
}
```

## ピン・マーカー機能

### 📍 カスタムマーカー実装

```typescript
// components/map/CustomMarker.tsx
'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface CustomMarkerProps {
  map: mapboxgl.Map | null;
  lng: number;
  lat: number;
  type: 'guess' | 'answer';
  draggable?: boolean;
  onDrag?: (lng: number, lat: number) => void;
  onClick?: () => void;
}

export function CustomMarker({
  map,
  lng,
  lat,
  type,
  draggable = false,
  onDrag,
  onClick
}: CustomMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    // マーカー要素作成
    const el = document.createElement('div');
    el.className = `custom-marker marker-${type}`;
    
    // スタイル設定
    Object.assign(el.style, {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      border: '3px solid white',
      cursor: draggable ? 'grab' : 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      backgroundColor: type === 'guess' ? '#3b82f6' : '#ef4444',
      transition: 'transform 0.2s ease'
    });

    // ホバーエフェクト
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.2)';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
    });

    // クリックイベント
    if (onClick) {
      el.addEventListener('click', onClick);
    }

    // マーカー作成
    markerRef.current = new mapboxgl.Marker({
      element: el,
      draggable
    })
      .setLngLat([lng, lat])
      .addTo(map);

    // ドラッグイベント
    if (draggable && onDrag) {
      markerRef.current.on('dragend', () => {
        const lngLat = markerRef.current!.getLngLat();
        onDrag(lngLat.lng, lngLat.lat);
      });
    }

    // クリーンアップ
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [map, lng, lat, type, draggable, onDrag, onClick]);

  // 位置更新
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
    }
  }, [lng, lat]);

  return null; // レンダリングなし
}
```

### 🎯 ピン配置管理

```typescript
// hooks/useMapPins.ts
import { useState, useCallback } from 'react';

interface Pin {
  lng: number;
  lat: number;
}

export function useMapPins() {
  const [guessPin, setGuessPin] = useState<Pin | null>(null);
  const [answerPin, setAnswerPin] = useState<Pin | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const placeGuessPin = useCallback((lng: number, lat: number) => {
    setGuessPin({ lng, lat });
  }, []);

  const placeAnswerPin = useCallback((lng: number, lat: number) => {
    setAnswerPin({ lng, lat });
    setShowAnswer(true);
  }, []);

  const clearPins = useCallback(() => {
    setGuessPin(null);
    setAnswerPin(null);
    setShowAnswer(false);
  }, []);

  const calculateDistance = useCallback((): number | null => {
    if (!guessPin || !answerPin) return null;

    // Haversine公式で距離計算
    const R = 6371; // 地球の半径 (km)
    const dLat = toRad(answerPin.lat - guessPin.lat);
    const dLng = toRad(answerPin.lng - guessPin.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(guessPin.lat)) * Math.cos(toRad(answerPin.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, [guessPin, answerPin]);

  return {
    guessPin,
    answerPin,
    showAnswer,
    placeGuessPin,
    placeAnswerPin,
    clearPins,
    calculateDistance
  };
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
```

## 地図コントロール

### 🎛️ MapControls コンポーネント

```typescript
// components/map/MapControls.tsx
'use client';

import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Compass } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleStyle: () => void;
  currentStyle: 'satellite' | 'street';
  className?: string;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleStyle,
  currentStyle,
  className = ''
}: MapControlsProps) {
  return (
    <div className={`absolute right-4 top-4 flex flex-col gap-2 z-10 ${className}`}>
      {/* ズームコントロール */}
      <div className="bg-white rounded-lg shadow-lg border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="rounded-b-none border-b"
          title="ズームイン"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="rounded-t-none"
          title="ズームアウト"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>

      {/* リセットボタン */}
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="bg-white"
        title="地図をリセット"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>

      {/* スタイル切替ボタン */}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleStyle}
        className="bg-white"
        title={`${currentStyle === 'satellite' ? '地図' : '衛星画像'}に切替`}
      >
        {currentStyle === 'satellite' ? '🗺️' : '🛰️'}
      </Button>
    </div>
  );
}
```

### 🧭 CompassOverlay コンポーネント

```typescript
// components/map/CompassOverlay.tsx
'use client';

interface CompassOverlayProps {
  bearing: number; // 地図の回転角度
  className?: string;
}

export function CompassOverlay({ bearing, className = '' }: CompassOverlayProps) {
  return (
    <div className={`absolute bottom-4 right-4 z-10 ${className}`}>
      <div className="bg-white rounded-full shadow-lg border p-3">
        <div 
          className="w-8 h-8 relative"
          style={{ transform: `rotate(${-bearing}deg)` }}
        >
          {/* 北を示す矢印 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-red-500" />
          </div>
          
          {/* N マーク */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
            N
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 🎮 useMapControls hook

```typescript
// hooks/useMapControls.ts
import { useCallback, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/mapbox';

export function useMapControls(map: mapboxgl.Map | null) {
  const [mapStyle, setMapStyle] = useState<'satellite' | 'street'>('satellite');

  const zoomIn = useCallback(() => {
    if (map) {
      map.zoomIn();
    }
  }, [map]);

  const zoomOut = useCallback(() => {
    if (map) {
      map.zoomOut();
    }
  }, [map]);

  const resetView = useCallback(() => {
    if (map) {
      map.flyTo({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        bearing: 0,
        pitch: 0,
        duration: 1000
      });
    }
  }, [map]);

  const toggleStyle = useCallback(() => {
    if (!map) return;

    const newStyle = mapStyle === 'satellite' ? 'street' : 'satellite';
    const styleUrl = newStyle === 'satellite' 
      ? 'mapbox://styles/mapbox/satellite-streets-v12'
      : 'mapbox://styles/mapbox/streets-v12';

    map.setStyle(styleUrl);
    setMapStyle(newStyle);
  }, [map, mapStyle]);

  return {
    mapStyle,
    zoomIn,
    zoomOut,
    resetView,
    toggleStyle
  };
}
```

## スタイル・カスタマイズ

### 🎨 カスタムマップスタイル

```typescript
// lib/mapbox/styles.ts

// SpaGuessr専用のカスタムスタイル設定
export const CUSTOM_STYLES = {
  // 基本の衛星画像スタイル
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  
  // 基本の地図スタイル
  streets: 'mapbox://styles/mapbox/streets-v12',
  
  // カスタムスタイル（温泉宿周辺の詳細表示用）
  detailed: 'mapbox://styles/mapbox/outdoors-v12'
};

// 地図レイヤーの設定
export const MAP_LAYERS = {
  // 距離線
  distanceLine: {
    id: 'distance-line',
    type: 'line' as const,
    paint: {
      'line-color': '#ff0000',
      'line-width': 3,
      'line-opacity': 0.8
    }
  },
  
  // 推測エリア（半径表示）
  guessRadius: {
    id: 'guess-radius',
    type: 'circle' as const,
    paint: {
      'circle-radius': {
        stops: [
          [5, 10],
          [10, 20],
          [15, 30]
        ]
      },
      'circle-color': '#3b82f6',
      'circle-opacity': 0.1,
      'circle-stroke-color': '#3b82f6',
      'circle-stroke-width': 2,
      'circle-stroke-opacity': 0.5
    }
  }
};
```

### 💅 CSS スタイル

```css
/* globals.css - Mapbox関連スタイル */

/* Mapbox GLのベーススタイルをインポート */
@import 'mapbox-gl/dist/mapbox-gl.css';

/* カスタムマーカースタイル */
.custom-marker {
  transition: all 0.2s ease;
  will-change: transform;
}

.custom-marker:hover {
  transform: scale(1.1);
}

.marker-guess {
  background: #3b82f6;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.marker-answer {
  background: #ef4444;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

/* 地図コンテナ */
.mapbox-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* ローディング状態 */
.map-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1000;
}

/* コントロールボタンのスタイル */
.map-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
}

.map-control-button {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.map-control-button:hover {
  background: #f9fafb;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* ポップアップのスタイル */
.mapboxgl-popup-content {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.mapboxgl-popup-close-button {
  font-size: 16px;
  color: #6b7280;
}

/* 距離線のアニメーション */
@keyframes distance-line-draw {
  from {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dasharray: 1000;
    stroke-dashoffset: 0;
  }
}

.distance-line-animated {
  animation: distance-line-draw 1s ease-out;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .map-controls {
    top: 8px;
    right: 8px;
  }
  
  .map-control-button {
    padding: 6px;
  }
  
  .custom-marker {
    width: 20px !important;
    height: 20px !important;
  }
}
```

## パフォーマンス最適化

### ⚡ 遅延ロードとメモ化

```typescript
// components/map/LazyMapboxMap.tsx
import { lazy, Suspense } from 'react';
import { MapLoadingSkeleton } from './MapLoadingSkeleton';

// Mapboxコンポーネントの遅延ロード
const MapboxMap = lazy(() => import('./MapboxMap').then(m => ({ default: m.MapboxMap })));

interface LazyMapboxMapProps {
  // MapboxMapのprops
}

export function LazyMapboxMap(props: LazyMapboxMapProps) {
  return (
    <Suspense fallback={<MapLoadingSkeleton />}>
      <MapboxMap {...props} />
    </Suspense>
  );
}

// ローディングスケルトン
function MapLoadingSkeleton() {
  return (
    <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-gray-400">地図を読み込み中...</div>
    </div>
  );
}
```

### 🔄 効率的な再描画

```typescript
// components/map/OptimizedMapboxMap.tsx
import { memo, useCallback, useMemo } from 'react';
import { MapboxMap } from './MapboxMap';

interface OptimizedMapboxMapProps {
  onMapClick?: (lng: number, lat: number) => void;
  guessMarker?: { lng: number; lat: number } | null;
  answerMarker?: { lng: number; lat: number } | null;
  showDistanceLine?: boolean;
}

export const OptimizedMapboxMap = memo(function OptimizedMapboxMap({
  onMapClick,
  guessMarker,
  answerMarker,
  showDistanceLine
}: OptimizedMapboxMapProps) {
  
  // コールバック関数をメモ化
  const handleMapClick = useCallback((lng: number, lat: number) => {
    onMapClick?.(lng, lat);
  }, [onMapClick]);

  // マーカー座標の変更検出を最適化
  const memoizedGuessMarker = useMemo(() => guessMarker, [
    guessMarker?.lng, guessMarker?.lat
  ]);

  const memoizedAnswerMarker = useMemo(() => answerMarker, [
    answerMarker?.lng, answerMarker?.lat
  ]);

  return (
    <MapboxMap
      onMapClick={handleMapClick}
      guessMarker={memoizedGuessMarker}
      answerMarker={memoizedAnswerMarker}
      showDistanceLine={showDistanceLine}
    />
  );
});
```

### 📊 パフォーマンス監視

```typescript
// hooks/useMapPerformance.ts
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

export function useMapPerformance(map: mapboxgl.Map | null) {
  const renderTime = useRef<number>(0);
  const frameCount = useRef<number>(0);

  useEffect(() => {
    if (!map) return;

    const handleRender = () => {
      frameCount.current++;
      renderTime.current = performance.now();
    };

    const handleIdle = () => {
      if (frameCount.current > 0) {
        const fps = 1000 / (renderTime.current / frameCount.current);
        console.log(`Map performance: ${fps.toFixed(1)} FPS`);
        frameCount.current = 0;
      }
    };

    map.on('render', handleRender);
    map.on('idle', handleIdle);

    return () => {
      map.off('render', handleRender);
      map.off('idle', handleIdle);
    };
  }, [map]);
}
```

### 🎯 メモリ管理

```typescript
// utils/mapboxCleanup.ts

export function cleanupMapboxResources(map: mapboxgl.Map) {
  try {
    // すべてのマーカーを削除
    const markers = (map as any)._markers || [];
    markers.forEach((marker: mapboxgl.Marker) => {
      marker.remove();
    });

    // カスタムレイヤーを削除
    const style = map.getStyle();
    if (style) {
      style.layers?.forEach(layer => {
        if (layer.id.startsWith('custom-')) {
          map.removeLayer(layer.id);
        }
      });
    }

    // イベントリスナーを削除
    map.off();

    // 地図インスタンスを削除
    map.remove();
    
    console.log('Mapbox resources cleaned up');
  } catch (error) {
    console.error('Failed to cleanup Mapbox resources:', error);
  }
}

// React コンポーネントでの使用
export function useMapboxCleanup(map: mapboxgl.Map | null) {
  useEffect(() => {
    return () => {
      if (map) {
        cleanupMapboxResources(map);
      }
    };
  }, [map]);
}
```

---

このMapbox実装により、高性能でユーザビリティの高い地図機能が実現できます。 