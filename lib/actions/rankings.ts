'use server'

import { db, rankings, users, gameSessions } from '@/lib/db'
import { eq, desc, and, gte, sql } from 'drizzle-orm'

// デイリーランキングを取得
export async function getDailyRankings(date?: string, limit: number = 10) {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0]
    
    const dailyRankings = await db
      .select({
        ranking: rankings,
        user: users,
        session: gameSessions
      })
      .from(rankings)
      .innerJoin(users, eq(rankings.userId, users.id))
      .innerJoin(gameSessions, eq(rankings.sessionId, gameSessions.id))
      .where(eq(rankings.rankDate, targetDate))
      .orderBy(desc(rankings.score), desc(rankings.roundsCompleted))
      .limit(limit)

    return {
      success: true,
      data: dailyRankings.map((item, index) => ({
        rank: index + 1,
        user: item.user,
        score: item.ranking.score,
        roundsCompleted: item.ranking.roundsCompleted,
        averageDistance: item.ranking.averageDistance,
        completedAt: item.ranking.completedAt,
        date: targetDate
      }))
    }
  } catch (error) {
    console.error('Error getting daily rankings:', error)
    return {
      success: false,
      error: 'Failed to get daily rankings'
    }
  }
}

// 週間ランキングを取得
export async function getWeeklyRankings(limit: number = 10) {
  try {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const weekStart = oneWeekAgo.toISOString().split('T')[0]

    const weeklyRankings = await db
      .select({
        userId: rankings.userId,
        user: users,
        totalScore: sql<number>`SUM(${rankings.score})`.as('total_score'),
        totalGames: sql<number>`COUNT(${rankings.id})`.as('total_games'),
        avgScore: sql<number>`AVG(${rankings.score})`.as('avg_score'),
        bestScore: sql<number>`MAX(${rankings.score})`.as('best_score')
      })
      .from(rankings)
      .innerJoin(users, eq(rankings.userId, users.id))
      .where(gte(rankings.rankDate, weekStart))
      .groupBy(rankings.userId, users.id)
      .orderBy(sql`total_score DESC`, sql`avg_score DESC`)
      .limit(limit)

    return {
      success: true,
      data: weeklyRankings.map((item, index) => ({
        rank: index + 1,
        user: item.user,
        totalScore: item.totalScore,
        totalGames: item.totalGames,
        averageScore: Math.round(item.avgScore),
        bestScore: item.bestScore,
        weekStart
      }))
    }
  } catch (error) {
    console.error('Error getting weekly rankings:', error)
    return {
      success: false,
      error: 'Failed to get weekly rankings'
    }
  }
}

// 全体ランキング（ベストスコア順）を取得
export async function getAllTimeRankings(limit: number = 10) {
  try {
    const allTimeRankings = await db
      .select({
        user: users,
        bestScore: users.bestScore,
        totalGames: users.totalGames,
        totalScore: users.totalScore,
        averageScore: users.averageScore
      })
      .from(users)
      .where(sql`${users.totalGames} > 0`)
      .orderBy(desc(users.bestScore), desc(users.totalGames))
      .limit(limit)

    return {
      success: true,
      data: allTimeRankings.map((item, index) => ({
        rank: index + 1,
        user: item.user,
        bestScore: item.bestScore,
        totalGames: item.totalGames,
        totalScore: item.totalScore,
        averageScore: parseFloat(item.averageScore || '0')
      }))
    }
  } catch (error) {
    console.error('Error getting all-time rankings:', error)
    return {
      success: false,
      error: 'Failed to get all-time rankings'
    }
  }
}

// ユーザーの個人統計を取得
export async function getUserStats(userId: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (user.length === 0) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    // 最近の10ゲームを取得
    const recentGames = await db
      .select({
        session: gameSessions,
        ranking: rankings
      })
      .from(gameSessions)
      .leftJoin(rankings, eq(gameSessions.id, rankings.sessionId))
      .where(and(
        eq(gameSessions.userId, userId),
        eq(gameSessions.status, 'completed')
      ))
      .orderBy(desc(gameSessions.completedAt))
      .limit(10)

    // ランキングでの順位を取得（ベストスコア）
    const rankPosition = await db
      .select({
        rank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${users.bestScore} DESC, ${users.totalGames} DESC)`.as('rank')
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    return {
      success: true,
      data: {
        user: user[0],
        recentGames: recentGames.map(game => ({
          ...game.session,
          ranking: game.ranking
        })),
        currentRank: rankPosition[0]?.rank || null
      }
    }
  } catch (error) {
    console.error('Error getting user stats:', error)
    return {
      success: false,
      error: 'Failed to get user stats'
    }
  }
}

// 今日のゲーム統計を取得
export async function getTodayStats() {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    const todayStats = await db
      .select({
        totalGames: sql<number>`COUNT(*)`.as('total_games'),
        avgScore: sql<number>`AVG(${rankings.score})`.as('avg_score'),
        bestScore: sql<number>`MAX(${rankings.score})`.as('best_score'),
        uniquePlayers: sql<number>`COUNT(DISTINCT ${rankings.userId})`.as('unique_players')
      })
      .from(rankings)
      .where(eq(rankings.rankDate, today))

    return {
      success: true,
      data: {
        date: today,
        totalGames: todayStats[0]?.totalGames || 0,
        averageScore: Math.round(todayStats[0]?.avgScore || 0),
        bestScore: todayStats[0]?.bestScore || 0,
        uniquePlayers: todayStats[0]?.uniquePlayers || 0
      }
    }
  } catch (error) {
    console.error('Error getting today stats:', error)
    return {
      success: false,
      error: 'Failed to get today stats'
    }
  }
}

// 全体統計を取得
export async function getGlobalStats() {
  try {
    const globalStats = await db
      .select({
        totalUsers: sql<number>`COUNT(DISTINCT ${users.id})`.as('total_users'),
        totalGames: sql<number>`SUM(${users.totalGames})`.as('total_games'),
        avgScore: sql<number>`AVG(${users.averageScore}::float)`.as('avg_score'),
        bestScore: sql<number>`MAX(${users.bestScore})`.as('best_score')
      })
      .from(users)
      .where(sql`${users.totalGames} > 0`)

    const recentActivity = await db
      .select({
        date: rankings.rankDate,
        gamesCount: sql<number>`COUNT(*)`.as('games_count')
      })
      .from(rankings)
      .where(gte(rankings.rankDate, sql`(CURRENT_DATE - INTERVAL '7 days')::text`))
      .groupBy(rankings.rankDate)
      .orderBy(rankings.rankDate)

    return {
      success: true,
      data: {
        totalUsers: globalStats[0]?.totalUsers || 0,
        totalGames: globalStats[0]?.totalGames || 0,
        averageScore: Math.round(globalStats[0]?.avgScore || 0),
        bestScore: globalStats[0]?.bestScore || 0,
        recentActivity: recentActivity.map(day => ({
          date: day.date,
          games: day.gamesCount
        }))
      }
    }
  } catch (error) {
    console.error('Error getting global stats:', error)
    return {
      success: false,
      error: 'Failed to get global stats'
    }
  }
} 