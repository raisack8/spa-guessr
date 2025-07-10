import Link from 'next/link'
import { Play, Trophy, Users, MapPin } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              SpaGuessr
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/rankings" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              ランキング
            </Link>
            <Link 
              href="/about" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              遊び方
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                温泉当てゲーム
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              日本全国の美しい温泉地を写真から当てよう！
              <br />
              あなたは何点取れるかな？
            </p>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="spa-card p-6">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">温泉地</div>
            </div>
            <div className="spa-card p-6">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">1,234</div>
              <div className="text-gray-600">プレイヤー</div>
            </div>
            <div className="spa-card p-6">
              <div className="flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">5,678</div>
              <div className="text-gray-600">ゲーム回数</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="/game" 
              className="spa-button-primary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <Play className="h-6 w-6" />
              <span>ゲームを始める</span>
            </Link>
            <Link 
              href="/practice" 
              className="spa-button-secondary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>練習モード</span>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="spa-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">リアルな地図</h3>
                <p className="text-sm text-gray-600">
                  Mapboxを使用した美しく正確な日本地図でプレイ
                </p>
              </div>
            </div>
            <div className="spa-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">スコアシステム</h3>
                <p className="text-sm text-gray-600">
                  距離に応じたスコア計算で友達と競争
                </p>
              </div>
            </div>
            <div className="spa-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ランキング</h3>
                <p className="text-sm text-gray-600">
                  全国のプレイヤーとスコアを競い合おう
                </p>
              </div>
            </div>
            <div className="spa-card p-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Play className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">簡単操作</h3>
                <p className="text-sm text-gray-600">
                  クリックするだけの直感的な操作
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-8 border-t border-gray-200 bg-white/50">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>&copy; 2024 SpaGuessr. Made with ❤️ for 温泉 lovers.</p>
        </div>
      </footer>
    </div>
  )
} 