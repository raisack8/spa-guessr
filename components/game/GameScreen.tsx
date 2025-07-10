'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { GameMap } from '@/components/map/GameMap'
import { useGameStore, useGameSelectors } from '@/lib/store/game'
import { startGameSession, submitGuess, getGameSession } from '@/lib/actions/game-mock'
import { Play, ArrowRight, RotateCcw, Home, Map, Maximize2, Minimize2, Pin, ChevronLeft, ChevronRight } from 'lucide-react'

type MapSize = 'small' | 'large'

export default function GameScreen() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mapSize, setMapSize] = useState<MapSize>('small')
  const [showMap, setShowMap] = useState(true)
  const [isMapHovered, setIsMapHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [hasCompletedImageCycle, setHasCompletedImageCycle] = useState(false)
  const [showGuessPrompt, setShowGuessPrompt] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(60) // 60 seconds
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [imageZoomKey, setImageZoomKey] = useState(0) // Key to trigger zoom animation reset

  const {
    session,
    currentImage,
    isLoading,
    error,
    currentGuess,
    lastResult,
    hasSubmittedGuess,
    setSession,
    setCurrentImage,
    setLoading,
    setError,
    setResult,
    clearResult,
    startRound,
    reset,
    clearGuess
  } = useGameStore()

  const {
    gameProgress,
    currentRoundNumber,
    totalRounds,
    canSubmitGuess,
    isGameComplete
  } = useGameSelectors()

  // Initialize game when component mounts
  useEffect(() => {
    initializeGame()
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Space key for next round when result is shown
      if (event.code === 'Space' && lastResult && !isLoading) {
        event.preventDefault()
        handleNextRound()
      }
      
      // Arrow keys for image navigation (after image cycle completion)
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

    // Add listener when result is shown OR when image cycle is completed
    if (lastResult || hasCompletedImageCycle) {
      document.addEventListener('keydown', handleKeyPress)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [lastResult, isLoading, hasCompletedImageCycle])

  // Handle automatic image switching (5 second intervals)
  useEffect(() => {
    if (!currentImage || !currentImage.images || currentImage.images.length <= 1 || hasCompletedImageCycle || isTimeUp) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        
        // Check if we've completed one full cycle (6 images)
        if (nextIndex >= currentImage.images.length) {
          setHasCompletedImageCycle(true)
          setShowGuessPrompt(true)
          return prevIndex // Stop at the last image
        }
        
        return nextIndex
      })
    }, 5000) // 5 seconds

    return () => clearInterval(interval)
  }, [currentImage, hasCompletedImageCycle, isTimeUp])

  // Reset states when currentImage changes
  useEffect(() => {
    setCurrentImageIndex(0)
    setHasCompletedImageCycle(false)
    setShowGuessPrompt(false)
    setTimeRemaining(60)
    setIsTimerActive(false)
    setIsTimeUp(false)
    setImageZoomKey(prev => prev + 1) // Reset zoom animation only when new round starts
  }, [currentImage])

  // Remove this effect - let each image complete its zoom animation
  // useEffect(() => {
  //   if (!hasCompletedImageCycle) {
  //     setImageZoomKey(prev => prev + 1)
  //   }
  // }, [currentImageIndex, hasCompletedImageCycle])

  // Reset zoom animation when image index changes during auto-play
  useEffect(() => {
    if (!hasCompletedImageCycle) {
      setImageZoomKey(prev => prev + 1)
    }
  }, [currentImageIndex, hasCompletedImageCycle])

  // Auto-enhance map visibility when image cycle completes
  useEffect(() => {
    if (hasCompletedImageCycle) {
      // Show map if hidden
      if (!showMap) {
        setShowMap(true)
      }
      // Remove automatic map size increase - only show on hover
    }
  }, [hasCompletedImageCycle, showMap])

  // Start 60-second timer when first image is loaded
  useEffect(() => {
    if (currentImage && !isTimerActive && !hasSubmittedGuess && !isTimeUp) {
      setIsTimerActive(true)
    }
  }, [currentImage, isTimerActive, hasSubmittedGuess, isTimeUp])

  // 60-second countdown timer
  useEffect(() => {
    if (!isTimerActive || hasSubmittedGuess || isTimeUp) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimeUp(true)
          setIsTimerActive(false)
          // Auto-submit with no guess (time up scenario)
          // Use setTimeout to avoid calling handleTimeUp during state update
          setTimeout(() => handleTimeUp(), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerActive, hasSubmittedGuess, isTimeUp])

  // Hide guess prompt when user places a pin
  useEffect(() => {
    if (currentGuess && showGuessPrompt) {
      setShowGuessPrompt(false)
    }
  }, [currentGuess, showGuessPrompt])

  // Image navigation functions (available after completing image cycle)
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

  const initializeGame = async () => {
    try {
      setLoading(true)
      
      // Create guest user if needed
      let currentUserId = userId
      if (!currentUserId) {
        currentUserId = 'guest_' + Math.random().toString(36).substring(2, 15)
        setUserId(currentUserId)
      }

      // Start new game session
      const gameResult = await startGameSession(currentUserId || undefined)
      if (gameResult.success && gameResult.data) {
        // Create rounds array with the correct length
        const rounds = Array.from({ length: gameResult.data.totalRounds }, (_, index) => ({
          spaId: 0, // Will be populated when the round is played
          imageId: 0, // Will be populated when the round is played
        }))

        setSession({
          sessionId: gameResult.data.sessionId,
          rounds: rounds,
          currentRound: gameResult.data.currentRound,
          totalScore: 0,
          status: 'playing',
          startedAt: new Date()
        })
        
        setCurrentImage(gameResult.data.currentImage)
        startRound()
      } else {
        setError(gameResult.error || 'Failed to start game')
      }
    } catch (err) {
      setError('Failed to initialize game')
    } finally {
      setLoading(false)
    }
  }

  const handleGuessSubmit = async () => {
    if (!currentGuess || !session || isSubmitting || isTimeUp) return

    try {
      setIsSubmitting(true)
      
      // Stop the timer when user submits manually
      setIsTimerActive(false)
      
      const result = await submitGuess(
        session.sessionId,
        { lat: currentGuess.lat, lng: currentGuess.lng }
      )

      if (result.success && result.data) {
        setResult(result.data)
        
        // Update session state
        setSession({
          ...session,
          currentRound: result.data.currentRound,
          totalScore: result.data.totalScore,
          status: result.data.isGameComplete ? 'completed' : 'playing'
        })
      } else {
        setError(result.error || 'Failed to submit guess')
      }
    } catch (err) {
      setError('Failed to submit guess')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTimeUp = async () => {
    if (!session || hasSubmittedGuess || isSubmitting || !currentImage) return

    try {
      setIsSubmitting(true)
      
      // For time up, we create a result directly without calling submitGuess
      // since we don't have a valid user guess to submit
      
      // Get the correct spa info from currentImage
      const correctSpa = currentImage.spa
      
      if (!correctSpa) {
        console.error('No spa data available for time up')
        setError('時間切れの処理中にエラーが発生しました')
        return
      }
      
      // Create a time-up result directly
      const timeUpResult = {
        distance: 999999, // Large distance to indicate no guess
        score: 0,
        correctLocation: {
          lat: parseFloat(correctSpa.latitude),
          lng: parseFloat(correctSpa.longitude),
          name: correctSpa.name,
          prefecture: correctSpa.prefecture,
          city: correctSpa.city
        },
        isGameComplete: (session.currentRound + 1) >= 5, // Check if this was the last round
        totalScore: session.totalScore, // Don't add points for time up
        currentRound: session.currentRound + 1,
        totalRounds: 5,
        isTimeUp: true // Special flag for time up
      }
      
      setResult(timeUpResult)
      
      // Clear the current guess so no blue pin shows
      clearGuess()
      
      // Update session state
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

  const handleNextRound = async () => {
    if (!session || !lastResult) return

    try {
      setLoading(true)
      
      // Reset all UI states immediately
      setMapSize('small')
      setShowMap(true)
      setIsMapHovered(false)
      setIsSubmitting(false)
      
      // Clear game result
      clearResult()

      if (lastResult.isGameComplete) {
        router.push(`/game/results/${session.sessionId}`)
        return
      }

      // Load next round
      const sessionResult = await getGameSession(session.sessionId)
      if (sessionResult.success && sessionResult.data) {
        setCurrentImage(sessionResult.data.currentImage)
        startRound()
      } else {
        setError('Failed to load next round')
      }
    } catch (err) {
      setError('Failed to proceed to next round')
    } finally {
      setLoading(false)
    }
  }

  const handleRestart = () => {
    reset()
    initializeGame()
  }

  const handleGoHome = () => {
    reset()
    router.push('/')
  }

  const handleMapSizeChange = () => {
    const sizes: MapSize[] = ['small', 'large']
    const currentIndex = sizes.indexOf(mapSize)
    const nextIndex = (currentIndex + 1) % sizes.length
    setMapSize(sizes[nextIndex])
  }

  const handleMapSizeIncrease = () => {
    if (mapSize === 'small') setMapSize('large')
  }

  const handleMapSizeDecrease = () => {
    if (mapSize === 'large') setMapSize('small')
  }

  const toggleMap = () => {
    setShowMap(!showMap)
  }

  const canIncrease = mapSize !== 'large'
  const canDecrease = mapSize !== 'small'

  if (isLoading && !currentImage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">ゲームを準備中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">エラーが発生しました</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="spa-button-primary flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>再試行</span>
            </button>
            <button
              onClick={handleGoHome}
              className="spa-button-secondary flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>ホームに戻る</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentImage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🎯</div>
          <p className="text-lg text-gray-600">画像が見つかりませんでした</p>
          <button
            onClick={handleRestart}
            className="mt-4 spa-button-primary"
          >
            ゲームを再開
          </button>
        </div>
      </div>
    )
  }

  // Get map dimensions based on size - using specific pixel values
  const getMapStyle = (): React.CSSProperties => {
    switch (mapSize) {
      case 'small':
        return { width: '320px', height: '240px' }
      case 'large':
        return { width: '800px', height: '600px' }
      default:
        return { width: '320px', height: '240px' }
    }
  }

  // Auto expand on hover, auto shrink on mouse leave
  const handleMapMouseEnter = () => {
    setIsMapHovered(true)
    // Auto expand when hovering if not already at largest size
    if (mapSize === 'small') {
      setMapSize('large')
    }
  }

  const handleMapMouseLeave = () => {
    setIsMapHovered(false)
    // Auto shrink when mouse leaves
    setTimeout(() => {
      if (mapSize === 'large') {
        setMapSize('small')
      }
    }, 300) // Small delay to prevent immediate shrinking
  }

  const getTriviaText = (locationName: string) => {
    const triviaFacts = [
      '日本には約3,000の温泉地があり、世界でも有数の温泉大国として知られています。',
      '温泉の効能は含有成分によって異なり、美肌効果や疲労回復、リラクゼーション効果があります。',
      '多くの温泉地では、源泉掛け流しという贅沢な方式で新鮮な温泉を楽しむことができます。',
      '日本の温泉文化は1,000年以上の歴史があり、古くから湯治文化として親しまれてきました。',
      '温泉地周辺では、地熱を活用した特産品や温泉卵などのグルメも楽しむことができます。',
      '露天風呂では四季折々の自然を感じながら入浴でき、特に雪見風呂は日本独特の風情があります。'
    ];
    
    // ランダムに豆知識を選択
    const randomFact = triviaFacts[Math.floor(Math.random() * triviaFacts.length)];
    
    return `${locationName}周辺の温泉地情報: ${randomFact}`;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full-screen image */}
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

      {/* Image indicator */}
      {currentImage.images && currentImage.images.length > 1 && (
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
            {hasCompletedImageCycle ? (
              // Interactive navigation after cycle completion
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  {currentImage.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all hover:scale-110 ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                      }`}
                      title={`画像 ${index + 1} を表示`}
                    />
                  ))}
                </div>
                <span>{currentImageIndex + 1} / {currentImage.images.length}</span>
                <div className="text-xs opacity-80">← → で切り替え</div>
              </div>
            ) : (
              // Static indicator during auto-play
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
          </div>
        </div>
      )}

      {/* Image navigation arrows (shown after cycle completion) */}
      {hasCompletedImageCycle && currentImage.images && currentImage.images.length > 1 && (
        <>
          {/* Left arrow */}
          <button
            onClick={goToPreviousImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110"
            title="前の画像"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          {/* Right arrow */}
          <button
            onClick={goToNextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110"
            title="次の画像"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Guess prompt after image cycle completion */}
      {/* Removed - no longer showing guess prompt message */}

      {/* Top UI overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex justify-between items-center">
          {/* Left side - Round info */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
            <div className="text-sm">
              ラウンド {currentRoundNumber} / {totalRounds}
            </div>
          </div>

          {/* Center - Timer (show from first image) */}
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

          {/* Right side - Score and home button */}
          <div className="flex items-center space-x-3">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
              <span className="text-sm">スコア: </span>
              <span className="font-semibold text-blue-300">{session?.totalScore || 0}</span>
            </div>
            <button
              onClick={handleGoHome}
              className="bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-black/70 transition-colors"
            >
              <Home className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Map toggle button (when map is hidden) */}
      {!showMap && (
        <button
          onClick={toggleMap}
          className="absolute bottom-6 right-6 z-20 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <Map className="h-6 w-6" />
        </button>
      )}

      {/* Bottom right - Mini map (when visible) */}
      {showMap && (
        <div 
          className={`absolute z-10 transition-all duration-300 ease-out ${
            mapSize === 'large' 
              ? 'bottom-6 right-6 sm:bottom-12 sm:right-12 md:bottom-16 md:right-16' 
              : 'bottom-6 right-6'
          }`}
          onMouseEnter={handleMapMouseEnter}
          onMouseLeave={handleMapMouseLeave}
        >
          <div className="bg-white rounded-lg shadow-xl overflow-hidden relative">
            {/* Map controls - only show on hover like the original */}
            <div className={`absolute top-2 left-2 z-10 flex space-x-1 transition-opacity duration-200 ${
              isMapHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <button
                onClick={handleMapSizeIncrease}
                disabled={!canIncrease}
                className={`p-1 rounded transition-colors ${
                  canIncrease 
                    ? 'bg-white/90 hover:bg-white shadow-sm border' 
                    : 'bg-gray-200 cursor-not-allowed'
                }`}
                title="拡大"
              >
                <Maximize2 className={`h-4 w-4 ${canIncrease ? 'text-gray-700' : 'text-gray-400'}`} />
              </button>
              <button
                onClick={handleMapSizeDecrease}
                disabled={!canDecrease}
                className={`p-1 rounded transition-colors ${
                  canDecrease 
                    ? 'bg-white/90 hover:bg-white shadow-sm border' 
                    : 'bg-gray-200 cursor-not-allowed'
                }`}
                title="縮小"
              >
                <Minimize2 className={`h-4 w-4 ${canDecrease ? 'text-gray-700' : 'text-gray-400'}`} />
              </button>
              <button
                onClick={toggleMap}
                className="p-1 bg-white/90 hover:bg-white rounded transition-colors shadow-sm border"
                title="地図を隠す"
              >
                <Map className="h-4 w-4 text-gray-700" />
              </button>
            </div>

            {/* Guess indicator - only show on hover */}
            <div className={`absolute top-2 right-2 z-10 transition-opacity duration-200 ${
              isMapHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="bg-black/75 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                <Pin className="h-3 w-3" />
                <span>クリックして推測</span>
              </div>
            </div>

            {/* Map container with smooth transitions */}
            <div 
              style={getMapStyle()}
              className="transition-all duration-500 ease-out"
            >
              <GameMap
                miniMap={mapSize === 'small'}
                mapSize={mapSize}
                onGuessChange={(guess) => {
                  // GameStore will be updated by GameMap's internal setGuess call
                }}
                showResult={hasSubmittedGuess}
                correctLocation={lastResult ? {
                  lat: lastResult.correctLocation.lat,
                  lng: lastResult.correctLocation.lng,
                  name: lastResult.correctLocation.name
                } : undefined}
                userGuess={currentGuess ? {
                  lat: currentGuess.lat,
                  lng: currentGuess.lng
                } : undefined}
                className="w-full h-full"
              />
            </div>

            {/* Submit button */}
            <div className="p-3 bg-gray-50 border-t">
              {!hasSubmittedGuess ? (
                <button
                  onClick={handleGuessSubmit}
                  disabled={!canSubmitGuess || isSubmitting}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    canSubmitGuess && !isSubmitting
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting 
                    ? '送信中...' 
                    : currentGuess 
                    ? '推測する' 
                    : 'ピンをマップに配置する'
                  }
                </button>
              ) : (
                <button
                  onClick={handleNextRound}
                  className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <span>{lastResult?.isGameComplete ? 'ゲーム完了' : '次のラウンド'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Result overlay - Full screen like original GeoGuessr */}
      {lastResult && (
        <div className="absolute inset-0 z-30 bg-black/90 flex items-center justify-center animate-fade-in">
          <div className="w-full h-full flex animate-slide-up">
            {/* Left side - Map */}
            <div className="flex-1 p-6">
              <div className="w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden transform transition-all duration-500 scale-100">
                <GameMap
                  miniMap={false}
                  mapSize="large"
                  showResult={true}
                  correctLocation={lastResult ? {
                    lat: lastResult.correctLocation.lat,
                    lng: lastResult.correctLocation.lng,
                    name: lastResult.correctLocation.name
                  } : undefined}
                  userGuess={lastResult?.isTimeUp ? undefined : (currentGuess ? {
                    lat: currentGuess.lat,
                    lng: currentGuess.lng
                  } : undefined)}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Right side - Results and info */}
            <div className="w-96 p-6 flex flex-col justify-center space-y-6 transform transition-all duration-700 delay-200">
              {/* Round header */}
              <div className="text-center opacity-100 transition-opacity duration-500 delay-300">
                <h1 className="text-4xl font-bold text-white mb-2">Round {currentRoundNumber}</h1>
              </div>

              {/* Score display */}
              <div className="bg-white rounded-lg p-6 text-center transform transition-all duration-500 delay-400 scale-100">
                <div className="text-6xl font-bold text-green-600 mb-2">
                  {lastResult.score}
                </div>
                <div className="text-lg text-gray-600">ポイント</div>
              </div>

              {/* Distance info */}
              <div className="bg-white rounded-lg p-4 text-center transform transition-all duration-500 delay-500 scale-100">
                {lastResult.isTimeUp ? (
                  <>
                    <div className="text-gray-600 mb-1">⏰ 時間切れ</div>
                    <div className="text-2xl font-bold text-orange-600">
                      タイムアップ
                    </div>
                    <div className="text-gray-600">推測できませんでした</div>
                  </>
                ) : (
                  <>
                    <div className="text-gray-600 mb-1">あなたの推測は正しい場所から</div>
                    <div className="text-2xl font-bold text-red-600">
                      {(lastResult.distance / 1000).toFixed(1)}km
                    </div>
                    <div className="text-gray-600">でした。</div>
                  </>
                )}
              </div>

              {/* Trivia section */}
              <div className="bg-white rounded-lg overflow-hidden transform transition-all duration-500 delay-600 translate-y-0">
                <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
                  <h2 className="font-semibold">Trivia</h2>
                  <button className="text-white/80 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {getTriviaText(lastResult.correctLocation.name)}
                  </p>
                  
                  {/* Voting section */}
                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 7m5 3v3M9 7H6m0 0v3m0-3h3m-3 3l-3-3" />
                        </svg>
                        <span className="text-xs">85</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L15 17m-5-3v-3m-5 3H4m0 0v3m0-3h3m-3 3l3-3" />
                        </svg>
                        <span className="text-xs">12</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-yellow-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-xs">報告</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        S
                      </div>
                      <div>
                        <div className="font-medium">Submitted by</div>
                        <div>SpaGuessr</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next round button */}
              <div className="space-y-3 transform transition-all duration-500 delay-700 translate-y-0">
                <button
                  onClick={handleNextRound}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-lg hover:scale-105 transform"
                >
                  <span>{lastResult?.isGameComplete ? '結果を見る' : '次のラウンドをスタート'}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                
                {/* Keyboard shortcut hint */}
                <div className="text-center text-white/70 text-sm animate-pulse">
                  続けるためには <span className="bg-white/20 px-2 py-1 rounded font-mono">Space</span> を押してください
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}