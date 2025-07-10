'use server'

import { db, gameSessions, spas, images, rankings, users } from '@/lib/db'
import { eq, and, desc, sql, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

// ゲームで使用する温泉画像をランダムに選択
export async function getRandomSpaImages(count: number = 5) {
  try {
    // アクティブな温泉の中からランダムに選択
    const activeSpas = await db
      .select({
        spa: spas,
        image: images
      })
      .from(spas)
      .innerJoin(images, eq(spas.id, images.spaId))
      .where(and(
        eq(spas.isActive, true),
        eq(images.status, 'ready'),
        eq(images.isPrimary, true)
      ))
      .orderBy(sql`RANDOM()`)
      .limit(count * 2) // 余裕を持って取得

    // 重複する温泉を排除
    const uniqueSpas = activeSpas.reduce((acc, current) => {
      if (!acc.find(item => item.spa.id === current.spa.id)) {
        acc.push(current)
      }
      return acc
    }, [] as typeof activeSpas)

    return {
      success: true,
      data: uniqueSpas.slice(0, count).map(item => ({
        spa: item.spa,
        image: item.image
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

    const sessionId = uuidv4()
    const sessionData = {
      rounds: spaImages.data.map(item => ({
        spaId: item.spa.id,
        imageId: item.image.id,
      })),
      currentRound: 0,
      totalScore: 0,
      status: 'playing' as const
    }

    await db.insert(gameSessions).values({
      id: sessionId,
      userId,
      sessionData,
      status: 'playing'
    })

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
    const session = await db
      .select()
      .from(gameSessions)
      .where(eq(gameSessions.id, sessionId))
      .limit(1)

    if (session.length === 0) {
      return {
        success: false,
        error: 'Game session not found'
      }
    }

    const sessionData = session[0]
    const currentRound = sessionData.sessionData.currentRound

    // 現在のラウンドの画像情報を取得
    if (currentRound < sessionData.sessionData.rounds.length) {
      const currentRoundData = sessionData.sessionData.rounds[currentRound]
      
      const spaImage = await db
        .select({
          spa: spas,
          image: images
        })
        .from(spas)
        .innerJoin(images, eq(spas.id, images.spaId))
        .where(and(
          eq(spas.id, currentRoundData.spaId),
          eq(images.id, currentRoundData.imageId)
        ))
        .limit(1)

      return {
        success: true,
        data: {
          ...sessionData,
          currentImage: spaImage[0] || null
        }
      }
    }

    return {
      success: true,
      data: sessionData
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
    const sessionResult = await getGameSession(sessionId)
    if (!sessionResult.success || !sessionResult.data) {
      throw new Error('Game session not found')
    }

    const session = sessionResult.data
    const currentRound = session.sessionData.currentRound
    const rounds = session.sessionData.rounds

    if (currentRound >= rounds.length) {
      return {
        success: false,
        error: 'Game already completed'
      }
    }

    // 正解の温泉情報を取得
    const correctSpa = await db
      .select()
      .from(spas)
      .where(eq(spas.id, rounds[currentRound].spaId))
      .limit(1)

    if (correctSpa.length === 0) {
      throw new Error('Spa not found')
    }

    const spa = correctSpa[0]
    const distance = calculateDistance(
      guess.lat,
      guess.lng,
      parseFloat(spa.latitude),
      parseFloat(spa.longitude)
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

    const updatedSessionData = {
      ...session.sessionData,
      rounds: updatedRounds,
      currentRound: nextRound,
      totalScore,
      status: isGameComplete ? 'completed' as const : 'playing' as const
    }

    // セッションを更新
    await db
      .update(gameSessions)
      .set({
        sessionData: updatedSessionData,
        totalScore,
        roundsCompleted: nextRound,
        status: isGameComplete ? 'completed' : 'playing',
        completedAt: isGameComplete ? new Date() : undefined,
        updatedAt: new Date()
      })
      .where(eq(gameSessions.id, sessionId))

    // ゲーム完了時の処理
    if (isGameComplete && session.userId) {
      // ランキングに追加
      const today = new Date().toISOString().split('T')[0]
      await db.insert(rankings).values({
        userId: session.userId,
        sessionId,
        score: totalScore,
        roundsCompleted: nextRound,
        averageDistance: updatedRounds.reduce((sum, round) => sum + (round.distance || 0), 0) / nextRound,
        completedAt: new Date(),
        rankDate: today
      })

      // ユーザー統計を更新
      const userStats = await db
        .select()
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1)

      if (userStats.length > 0) {
        const user = userStats[0]
        const newTotalGames = user.totalGames + 1
        const newTotalScore = user.totalScore + totalScore
        const newBestScore = Math.max(user.bestScore, totalScore)
        const newAverageScore = newTotalScore / newTotalGames

        await db
          .update(users)
          .set({
            totalGames: newTotalGames,
            totalScore: newTotalScore,
            bestScore: newBestScore,
            averageScore: newAverageScore.toString(),
            updatedAt: new Date()
          })
          .where(eq(users.id, session.userId))
      }

      revalidatePath('/rankings')
    }

    return {
      success: true,
      data: {
        distance,
        score,
        correctLocation: {
          lat: parseFloat(spa.latitude),
          lng: parseFloat(spa.longitude),
          name: spa.name,
          prefecture: spa.prefecture,
          city: spa.city
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
    const session = await db
      .select()
      .from(gameSessions)
      .where(eq(gameSessions.id, sessionId))
      .limit(1)

    if (session.length === 0) {
      return {
        success: false,
        error: 'Game session not found'
      }
    }

    const sessionData = session[0]
    
    // 各ラウンドの詳細情報を取得
    const rounds = await Promise.all(
      sessionData.sessionData.rounds.map(async (round) => {
        const spaImage = await db
          .select({
            spa: spas,
            image: images
          })
          .from(spas)
          .innerJoin(images, eq(spas.id, images.spaId))
          .where(and(
            eq(spas.id, round.spaId),
            eq(images.id, round.imageId)
          ))
          .limit(1)

        return {
          ...round,
          spa: spaImage[0]?.spa || null,
          image: spaImage[0]?.image || null
        }
      })
    )

    return {
      success: true,
      data: {
        ...sessionData,
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