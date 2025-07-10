'use server'

import { sampleSpas } from '@/lib/data/sample-spas'

// モック用のグローバル状態（実際のアプリではRedisやDBを使用）
const mockSessions = new Map()
const mockUsers = new Map()

// ゲームで使用する温泉画像をランダムに選択
export async function getRandomSpaImages(count: number = 5) {
  try {
    // サンプルデータからランダムに選択
    const shuffled = [...sampleSpas].sort(() => 0.5 - Math.random())
    const selectedSpas = shuffled.slice(0, count)

    return {
      success: true,
      data: selectedSpas.map(spa => ({
        spa: {
          id: spa.id,
          name: spa.name,
          prefecture: spa.prefecture,
          city: spa.city,
          latitude: spa.latitude,
          longitude: spa.longitude,
          description: spa.description || '',
          features: spa.features,
          difficulty: spa.difficulty
        },
        images: spa.images
      }))
    }
  } catch (error) {
    console.error('Error getting random spa images:', error)
    return {
      success: false,
      error: 'Failed to load spa images'
    }
  }
}

// 新しいゲームセッションを開始
export async function startGameSession(userId?: string) {
  try {
    // ランダムな温泉画像を取得
    const spaImages = await getRandomSpaImages(5)
    if (!spaImages.success || !spaImages.data) {
      throw new Error('Failed to get spa images')
    }

    const sessionId = Math.random().toString(36).substring(2, 15)
    const sessionData = {
      sessionId,
      rounds: spaImages.data.map(item => ({
        spaId: item.spa.id,
        imageId: item.images[0]?.id || 1,
      })),
      currentRound: 0,
      totalScore: 0,
      status: 'playing' as const,
      startedAt: new Date()
    }

    // モックセッションを保存
    mockSessions.set(sessionId, sessionData)

    return {
      success: true,
      data: {
        sessionId,
        currentRound: 0,
        totalRounds: sessionData.rounds.length,
        currentImage: spaImages.data[0]
      }
    }
  } catch (error) {
    console.error('Error starting game session:', error)
    return {
      success: false,
      error: 'Failed to start game session'
    }
  }
}

// 現在のゲームセッション情報を取得
export async function getGameSession(sessionId: string) {
  try {
    const session = mockSessions.get(sessionId)
    if (!session) {
      return {
        success: false,
        error: 'Game session not found'
      }
    }

    const currentRound = session.currentRound

    // 現在のラウンドの画像情報を取得
    if (currentRound < session.rounds.length) {
      const currentRoundData = session.rounds[currentRound]
      
      // サンプルデータから対応するデータを取得
      const spa = sampleSpas.find(s => s.id === currentRoundData.spaId)
      if (spa) {
        return {
          success: true,
          data: {
            ...session,
            currentImage: {
              spa: {
                id: spa.id,
                name: spa.name,
                prefecture: spa.prefecture,
                city: spa.city,
                latitude: spa.latitude,
                longitude: spa.longitude,
                description: spa.description || '',
                features: spa.features,
                difficulty: spa.difficulty
              },
              images: spa.images
            }
          }
        }
      }
    }

    return {
      success: true,
      data: session
    }
  } catch (error) {
    console.error('Error getting game session:', error)
    return {
      success: false,
      error: 'Failed to get game session'
    }
  }
}

// Haversine距離計算関数
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // 地球の半径 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// スコア計算関数（GeoGuessr風）
function calculateScore(distance: number): number {
  if (distance === 0) return 5000
  if (distance < 1) return Math.round(5000 - (distance * 1000))
  if (distance < 10) return Math.round(4000 - ((distance - 1) * 100))
  if (distance < 50) return Math.round(3000 - ((distance - 10) * 25))
  if (distance < 100) return Math.round(2000 - ((distance - 50) * 20))
  if (distance < 500) return Math.round(1000 - ((distance - 100) * 2))
  return Math.max(0, Math.round(500 - ((distance - 500) * 0.5)))
}

// ユーザーの推測を送信
export async function submitGuess(
  sessionId: string,
  guess: { lat: number; lng: number },
  timeSpent?: number
) {
  try {
    const session = mockSessions.get(sessionId)
    if (!session) {
      throw new Error('Game session not found')
    }

    const currentRound = session.currentRound
    const rounds = session.rounds

    if (currentRound >= rounds.length) {
      return {
        success: false,
        error: 'Game already completed'
      }
    }

    // 正解の温泉情報を取得
    const currentRoundData = rounds[currentRound]
    const correctSpa = sampleSpas.find(s => s.id === currentRoundData.spaId)

    if (!correctSpa) {
      throw new Error('Spa not found')
    }

    const distance = calculateDistance(
      guess.lat,
      guess.lng,
      parseFloat(correctSpa.latitude),
      parseFloat(correctSpa.longitude)
    )
    const score = calculateScore(distance)

    // ラウンドデータを更新
    const updatedRounds = [...rounds]
    updatedRounds[currentRound] = {
      ...updatedRounds[currentRound],
      userGuess: guess,
      distance,
      score,
      timeSpent
    }

    const nextRound = currentRound + 1
    const isGameComplete = nextRound >= rounds.length
    const totalScore = updatedRounds.reduce((sum, round) => sum + (round.score || 0), 0)

    const updatedSession = {
      ...session,
      rounds: updatedRounds,
      currentRound: nextRound,
      totalScore,
      status: isGameComplete ? 'completed' as const : 'playing' as const
    }

    // セッションを更新
    mockSessions.set(sessionId, updatedSession)

    return {
      success: true,
      data: {
        distance,
        score,
        correctLocation: {
          lat: parseFloat(correctSpa.latitude),
          lng: parseFloat(correctSpa.longitude),
          name: correctSpa.name,
          prefecture: correctSpa.prefecture,
          city: correctSpa.city
        },
        isGameComplete,
        totalScore,
        currentRound: nextRound,
        totalRounds: rounds.length
      }
    }
  } catch (error) {
    console.error('Error submitting guess:', error)
    return {
      success: false,
      error: 'Failed to submit guess'
    }
  }
}

// ゲーム完了後の詳細結果を取得
export async function getGameResults(sessionId: string) {
  try {
    const session = mockSessions.get(sessionId)
    if (!session) {
      return {
        success: false,
        error: 'Game session not found'
      }
    }

    // 各ラウンドの詳細情報を取得
    const rounds = session.rounds.map((round: any) => {
      const spa = sampleSpas.find(s => s.id === round.spaId)
      return {
        ...round,
        spa: spa ? {
          id: spa.id,
          name: spa.name,
          prefecture: spa.prefecture,
          city: spa.city,
          latitude: spa.latitude,
          longitude: spa.longitude,
          description: spa.description || '',
          features: spa.features,
          difficulty: spa.difficulty
        } : null,
        image: spa ? spa.images[0] : null
      }
    })

    return {
      success: true,
      data: {
        ...session,
        rounds
      }
    }
  } catch (error) {
    console.error('Error getting game results:', error)
    return {
      success: false,
      error: 'Failed to get game results'
    }
  }
} 