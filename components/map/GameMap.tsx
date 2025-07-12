'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { useGameStore } from '@/lib/store/game'

interface GameMapProps {
  onGuessChange?: (guess: { lat: number; lng: number }) => void
  showResult?: boolean
  correctLocation?: { lat: number; lng: number; name: string }
  userGuess?: { lat: number; lng: number }
  className?: string
  miniMap?: boolean
  mapSize?: 'small' | 'medium' | 'large'
}

export function GameMap({
  onGuessChange,
  showResult = false,
  correctLocation,
  userGuess,
  className = '',
  miniMap = true,
  mapSize = 'small'
}: GameMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const correctMarkerRef = useRef<mapboxgl.Marker | null>(null)

  const { setMapReady, setGuess, hasSubmittedGuess } = useGameStore()
  const clearGuess = useGameStore(state => state.clearGuess)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  // Handle map resize when mapSize changes
  useEffect(() => {
    if (mapRef.current && isMapLoaded) {
      // Use longer delay and multiple resize calls for more reliable resizing
      const timer1 = setTimeout(() => {
        mapRef.current?.resize()
      }, 100)
      
      const timer2 = setTimeout(() => {
        mapRef.current?.resize()
      }, 300)
      
      const timer3 = setTimeout(() => {
        mapRef.current?.resize()
      }, 500)
      
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [mapSize, isMapLoaded])

  // Add ResizeObserver for container size changes
  useEffect(() => {
    if (!mapContainerRef.current || !mapRef.current || !isMapLoaded) return

    let resizeTimer: NodeJS.Timeout

    const resizeObserver = new ResizeObserver(() => {
      // Debounced resize with multiple calls
      const performResize = () => {
        if (mapRef.current) {
          mapRef.current.resize()
          // Call resize again after a short delay to ensure it takes effect
          setTimeout(() => {
            mapRef.current?.resize()
          }, 100)
        }
      }
      
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(performResize, 150)
    })

    resizeObserver.observe(mapContainerRef.current)

    return () => {
      clearTimeout(resizeTimer)
      resizeObserver.disconnect()
    }
  }, [isMapLoaded])

  useEffect(() => {
    console.log('GameMap useEffect triggered - checking conditions...');
    console.log('mapboxgl.accessToken:', mapboxgl.accessToken ? 'SET' : 'NOT SET');
    console.log('mapContainerRef.current:', !!mapContainerRef.current);
    console.log('mapRef.current:', !!mapRef.current);
    
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''
      console.log('Set Mapbox access token');
    }

    if (!mapContainerRef.current || mapRef.current) {
      console.log('Skipping map initialization - container missing or map already exists');
      return
    }

    // Prevent duplicate initialization by immediately setting mapRef
    const tempRef = {}
    mapRef.current = tempRef as any

    console.log('Creating new Mapbox map...');
    
    // Initialize map with simple, working configuration
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [138.252924, 36.204824], // Japan center
      zoom: miniMap ? 5 : 6,
      maxZoom: miniMap ? 15 : 18,
      minZoom: 2,
      attributionControl: false
    })

    console.log('Map created, setting bounds...');

    // Set Japan bounds
    map.setMaxBounds([
      [129.0, 31.0], // Southwest coordinates
      [146.0, 46.0]  // Northeast coordinates
    ])

    // Simple click handler for placing guess
    map.on('click', (e) => {
      if (hasSubmittedGuess || showResult) {
        console.log('Click ignored - game state:', { hasSubmittedGuess, showResult });
        return
      }

      const { lng, lat } = e.lngLat
      console.log('Map clicked - Raw event:', e);
      console.log('Map clicked - LngLat object:', e.lngLat);
      console.log('Map clicked - Extracted coordinates:', { lat, lng });
      console.log('Map clicked - User guess coordinates:', { lat, lng });

      // Remove existing user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
      }

      // Create new blue marker at clicked location
      const userMarker = new mapboxgl.Marker({
        color: '#3b82f6',
        scale: miniMap ? 1.0 : 1.4
      })
        .setLngLat([lng, lat])
        .addTo(map)

      userMarkerRef.current = userMarker

      // Update game state
      const guess = { lat, lng }
      console.log('Setting guess in store:', guess);
      setGuess({
        ...guess,
        timestamp: new Date()
      })

      // Call callback
      onGuessChange?.(guess)
    })

    // Add controls
    if (!miniMap) {
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    }

    map.on('load', () => {
      console.log('Map loaded successfully');
      setIsMapLoaded(true)
      setMapReady(true)

      // Add data source for distance line
      map.addSource('distance-line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      })

      // Add layer for distance line
      map.addLayer({
        id: 'distance-line',
        type: 'line',
        source: 'distance-line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ef4444',
          'line-width': miniMap ? 3 : 4,
          'line-opacity': 0.9
        }
      })
    })

    // Set the actual map reference after successful creation
    mapRef.current = map

    return () => {
      console.log('Cleaning up map...');
      if (map) {
        map.remove()
      }
      mapRef.current = null
      setMapReady(false)
    }
  }, []) // Empty dependency array - map should be created only once

  // Handle miniMap changes without recreating the map
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return
    
    const map = mapRef.current
    
    // Update zoom based on miniMap setting
    const currentZoom = map.getZoom()
    const targetZoom = miniMap ? 5 : 6
    
    if (Math.abs(currentZoom - targetZoom) > 0.5) {
      map.setZoom(targetZoom)
    }
    
    // Update max zoom
    map.setMaxZoom(miniMap ? 15 : 18)
    
    console.log('Updated map settings for miniMap:', miniMap);
  }, [miniMap, isMapLoaded])

  // Clear previous round results when starting a new round
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return

    const map = mapRef.current

    if (!showResult) {
      // Remove user marker only when starting a completely new round
      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
        userMarkerRef.current = null
      }

      // Clear game store state
      clearGuess()

      // Remove correct location marker
      if (correctMarkerRef.current) {
        correctMarkerRef.current.remove()
        correctMarkerRef.current = null
      }

      // Clear distance line
      const source = map.getSource('distance-line') as mapboxgl.GeoJSONSource
      if (source) {
        source.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        })
      }

      // Remove all popups
      const popups = document.querySelectorAll('.mapboxgl-popup')
      popups.forEach(popup => popup.remove())
    }
  }, [showResult, isMapLoaded])

  // Show result when game round is completed
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded || !showResult) return

    const map = mapRef.current

    if (correctLocation) {
      // Remove existing correct marker
      if (correctMarkerRef.current) {
        correctMarkerRef.current.remove()
      }

      // Add correct location marker (green)
      const correctMarker = new mapboxgl.Marker({
        color: '#10b981',
        scale: miniMap ? 1.2 : 1.6
      })
        .setLngLat([correctLocation.lng, correctLocation.lat])
        .addTo(map)

      // Add popup to correct location
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false
      })
        .setLngLat([correctLocation.lng, correctLocation.lat])
        .setHTML(`
          <div class="p-3 bg-white rounded-lg shadow-lg border border-green-200">
            <h3 class="font-bold text-green-700 mb-1">${correctLocation.name}</h3>
            <p class="text-sm text-gray-600">正解位置</p>
          </div>
        `)
        .addTo(map)

      correctMarkerRef.current = correctMarker

      if (userGuess) {
        // Normal guess scenario - show both pins and line
        
        // Ensure user marker (blue pin) is still visible
        if (!userMarkerRef.current) {
          const userMarker = new mapboxgl.Marker({
            color: '#3b82f6',
            scale: miniMap ? 1.0 : 1.4
          })
            .setLngLat([userGuess.lng, userGuess.lat])
            .addTo(map)
          
          userMarkerRef.current = userMarker
        }

        // Draw line between guess and correct location
        const source = map.getSource('distance-line') as mapboxgl.GeoJSONSource
        if (source) {
          source.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [userGuess.lng, userGuess.lat],
                [correctLocation.lng, correctLocation.lat]
              ]
            }
          })
        }

        // Fit map to show both markers
        const bounds = new mapboxgl.LngLatBounds()
        bounds.extend([userGuess.lng, userGuess.lat])
        bounds.extend([correctLocation.lng, correctLocation.lat])

        map.fitBounds(bounds, {
          padding: miniMap ? 30 : 50,
          maxZoom: miniMap ? 8 : 12
        })
      } else {
        // Time up scenario - only show green pin and zoom in
        
        // Remove any existing user marker
        if (userMarkerRef.current) {
          userMarkerRef.current.remove()
          userMarkerRef.current = null
        }

        // Clear distance line
        const source = map.getSource('distance-line') as mapboxgl.GeoJSONSource
        if (source) {
          source.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          })
        }

        // Zoom in to correct location with animation
        map.flyTo({
          center: [correctLocation.lng, correctLocation.lat],
          zoom: miniMap ? 10 : 14,
          duration: 2000, // 2 second animation
          essential: true
        })
      }
    }
  }, [showResult, correctLocation, userGuess, isMapLoaded, miniMap])

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ minHeight: miniMap ? '200px' : '400px' }}
      />
      
      {/* Loading overlay */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">地図を読み込み中...</p>
          </div>
        </div>
      )}
    </div>
  )
} 