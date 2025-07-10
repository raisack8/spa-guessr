import { getDailyRankings, getWeeklyRankings, getAllTimeRankings, getTodayStats } from '@/lib/actions/rankings'
import Link from 'next/link'
import { Trophy, Calendar, Users, TrendingUp, Home } from 'lucide-react'

export default async function RankingsPage() {
  // Parallel fetch for better performance
  const [dailyResult, weeklyResult, allTimeResult, statsResult] = await Promise.all([
    getDailyRankings(),
    getWeeklyRankings(),
    getAllTimeRankings(),
    getTodayStats()
  ])

  const dailyRankings = dailyResult.success ? dailyResult.data : []
  const weeklyRankings = weeklyResult.success ? weeklyResult.data : []
  const allTimeRankings = allTimeResult.success ? allTimeResult.data : []
  const todayStats = statsResult.success ? statsResult.data : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <span>ランキング</span>
            </h1>
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>ホームに戻る</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Today's Stats */}
        {todayStats && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">今日の統計</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="spa-card text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {todayStats.totalGames}
                </div>
                <div className="text-sm text-gray-600">今日のゲーム数</div>
              </div>
              <div className="spa-card text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {todayStats.uniquePlayers}
                </div>
                <div className="text-sm text-gray-600">ユニークプレイヤー</div>
              </div>
              <div className="spa-card text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {todayStats.averageScore}
                </div>
                <div className="text-sm text-gray-600">平均スコア</div>
              </div>
              <div className="spa-card text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {todayStats.bestScore}
                </div>
                <div className="text-sm text-gray-600">最高スコア</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Rankings */}
          <div className="spa-card">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900">デイリーランキング</h2>
            </div>
            
            {dailyRankings.length > 0 ? (
              <div className="space-y-3">
                {dailyRankings.map((ranking) => (
                  <div
                    key={ranking.rank}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${ranking.rank === 1 ? 'bg-yellow-500 text-white' :
                          ranking.rank === 2 ? 'bg-gray-400 text-white' :
                          ranking.rank === 3 ? 'bg-amber-600 text-white' :
                          'bg-gray-200 text-gray-700'}
                      `}>
                        {ranking.rank}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {ranking.user.name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ranking.roundsCompleted} ラウンド完了
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">
                        {ranking.score} pt
                      </div>
                      <div className="text-sm text-gray-500">
                        平均 {ranking.averageDistance.toFixed(1)} km
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>今日のランキングデータがありません</p>
              </div>
            )}
          </div>

          {/* Weekly Rankings */}
          <div className="spa-card">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-900">週間ランキング</h2>
            </div>
            
            {weeklyRankings.length > 0 ? (
              <div className="space-y-3">
                {weeklyRankings.map((ranking) => (
                  <div
                    key={ranking.rank}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${ranking.rank === 1 ? 'bg-yellow-500 text-white' :
                          ranking.rank === 2 ? 'bg-gray-400 text-white' :
                          ranking.rank === 3 ? 'bg-amber-600 text-white' :
                          'bg-gray-200 text-gray-700'}
                      `}>
                        {ranking.rank}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {ranking.user.name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ranking.totalGames} ゲーム
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {ranking.totalScore} pt
                      </div>
                      <div className="text-sm text-gray-500">
                        平均 {ranking.averageScore} pt
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>今週のランキングデータがありません</p>
              </div>
            )}
          </div>

          {/* All-Time Rankings */}
          <div className="spa-card">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900">殿堂入り</h2>
            </div>
            
            {allTimeRankings.length > 0 ? (
              <div className="space-y-3">
                {allTimeRankings.map((ranking) => (
                  <div
                    key={ranking.rank}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${ranking.rank === 1 ? 'bg-yellow-500 text-white' :
                          ranking.rank === 2 ? 'bg-gray-400 text-white' :
                          ranking.rank === 3 ? 'bg-amber-600 text-white' :
                          'bg-gray-200 text-gray-700'}
                      `}>
                        {ranking.rank}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {ranking.user.name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ranking.totalGames} ゲーム
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-600">
                        {ranking.bestScore} pt
                      </div>
                      <div className="text-sm text-gray-500">
                        最高記録
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>ランキングデータがありません</p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="spa-card max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              あなたもランキングに挑戦しよう！
            </h3>
            <p className="text-gray-600 mb-6">
              日本の美しい温泉を当てて、トップランキングを目指しましょう
            </p>
            <Link
              href="/game"
              className="spa-button-primary inline-flex items-center space-x-2 text-lg px-8 py-3"
            >
              <span>ゲームを開始</span>
              <Trophy className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 