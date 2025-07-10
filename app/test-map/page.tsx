'use client'

import { useState } from 'react'
import { GameMap } from '@/components/map/GameMap'

type MapSize = 'small' | 'medium' | 'large'

export default function TestMapPage() {
  const [mapSize, setMapSize] = useState<MapSize>('small')
  const [guess, setGuess] = useState<{ lat: number; lng: number } | null>(null)

  const handleMapSizeChange = () => {
    const sizes: MapSize[] = ['small', 'medium', 'large']
    const currentIndex = sizes.indexOf(mapSize)
    const nextIndex = (currentIndex + 1) % sizes.length
    setMapSize(sizes[nextIndex])
  }

  const getMapStyle = (): React.CSSProperties => {
    switch (mapSize) {
      case 'small':
        return { width: '320px', height: '240px' }
      case 'medium':
        return { width: '600px', height: '450px' }
      case 'large':
        return { width: '800px', height: '600px' }
      default:
        return { width: '320px', height: '240px' }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">GameMap Resize Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleMapSizeChange}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Change Size: {mapSize}
            </button>
            <div className="text-sm text-gray-600">
              Current size: {getMapStyle().width} x {getMapStyle().height}
            </div>
          </div>

          {guess && (
            <div className="mb-4 p-3 bg-green-100 rounded">
              <strong>Last guess:</strong> {guess.lat.toFixed(4)}, {guess.lng.toFixed(4)}
            </div>
          )}

          <div 
            style={getMapStyle()}
            className="transition-all duration-500 ease-out border border-gray-300 rounded overflow-hidden"
          >
            <GameMap
              miniMap={mapSize === 'small'}
              mapSize={mapSize}
              onGuessChange={(newGuess) => {
                setGuess(newGuess)
                console.log('Guess changed:', newGuess)
              }}
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Click the "Change Size" button to cycle through small → medium → large</li>
            <li>Click anywhere on the map to place a blue pin</li>
            <li>Check if the map properly resizes when the container size changes</li>
            <li>Verify that pin placement works correctly at all sizes</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 