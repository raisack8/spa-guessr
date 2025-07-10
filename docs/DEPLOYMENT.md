# デプロイメント・運用ガイド

SpaGuessrの本番環境デプロイメントとCI/CD、運用監視の詳細を説明します。

## 📋 目次
- [環境構成](#環境構成)
- [Vercelデプロイ](#vercelデプロイ)
- [データベース設定](#データベース設定)
- [CI/CD設定](#cicd設定)
- [監視・ログ](#監視ログ)
- [セキュリティ](#セキュリティ)

## 環境構成

### 🌍 環境別設定

| 環境 | 用途 | URL | DB | デプロイ方式 |
|---|---|---|---|---|
| **開発** | ローカル開発 | localhost:3000 | Docker PostgreSQL | `npm run dev` |
| **プレビュー** | PR確認 | `*.vercel.app` | Neon (dev) | Vercel Preview |
| **ステージング** | 本番前検証 | `staging.spaguessr.com` | Neon (staging) | Vercel Production |
| **本番** | ユーザー向け | `spaguessr.com` | Neon (prod) | Vercel Production |

### ⚙️ 環境変数管理

```bash
# .env.local (開発環境)
DATABASE_URL="postgresql://localhost:5432/spaguessr_dev"
REDIS_URL="redis://localhost:6379"
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="pk.dev_token"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Vercel Environment Variables (本番環境)
DATABASE_URL="postgresql://[user]:[password]@[host]/[db]?sslmode=require"
REDIS_URL="rediss://[password]@[host]:6380"
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="pk.prod_token"
NEXT_PUBLIC_APP_URL="https://spaguessr.com"
RAKUTEN_APP_ID="your_rakuten_app_id"
GOOGLE_PLACES_API_KEY="your_google_places_key"

# セキュリティ
NEXTAUTH_SECRET="your_secure_secret"
NEXTAUTH_URL="https://spaguessr.com"
```

## Vercelデプロイ

### 🚀 初回デプロイ設定

```bash
# 1. Vercel CLI インストール
npm i -g vercel

# 2. Vercelプロジェクト初期化
vercel

# 3. 環境変数設定
vercel env add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
vercel env add DATABASE_URL
vercel env add REDIS_URL

# 4. 本番デプロイ
vercel --prod
```

### 📁 vercel.json 設定

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "regions": ["nrt1"],
  "functions": {
    "app/**": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=0, stale-while-revalidate"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/",
      "destination": "/game",
      "permanent": false
    }
  ],
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/api/sitemap"
    }
  ]
}
```

### 🔧 Next.js本番最適化

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 基本設定
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['mapbox-gl']
  },

  // 画像最適化
  images: {
    domains: ['images.spaguessr.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1年
  },

  // バンドル最適化
  webpack: (config, { isServer }) => {
    // Mapbox GL JS用設定
    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
      options: {
        name: 'static/[hash].worker.js',
        publicPath: '/_next/',
      },
    });

    // 本番環境での最適化
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          mapbox: {
            test: /[\\/]node_modules[\\/](mapbox-gl)[\\/]/,
            name: 'mapbox',
            priority: 10,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 5,
          },
        },
      };
    }

    return config;
  },

  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.mapbox.com; style-src 'self' 'unsafe-inline' *.mapbox.com; img-src 'self' data: *.mapbox.com; connect-src 'self' *.mapbox.com"
          }
        ]
      }
    ];
  },

  // 本番環境での分析
  ...(process.env.ANALYZE === 'true' && {
    '@next/bundle-analyzer': {
      enabled: true,
    },
  }),
};

module.exports = nextConfig;
```

## データベース設定

### 🗄️ Neon PostgreSQL設定

```typescript
// scripts/setup-production-db.ts
import { db } from '@/lib/db';
import { runMigrations } from '@/lib/db/migrate';
import { seedDatabase } from '@/lib/db/seed';

async function setupProductionDatabase() {
  try {
    console.log('🚀 Setting up production database...');

    // 1. マイグレーション実行
    console.log('📦 Running migrations...');
    await runMigrations();

    // 2. 本番環境では基本データのみシード
    if (process.env.NODE_ENV === 'production') {
      console.log('🌱 Seeding essential data...');
      await seedEssentialData();
    }

    console.log('✅ Production database setup completed');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

async function seedEssentialData() {
  // 本番環境用の最小限のデータ投入
  // 開発用のテストデータは含めない
}

if (require.main === module) {
  setupProductionDatabase();
}
```

### 📊 データベース最適化

```sql
-- 本番環境用インデックス
CREATE INDEX CONCURRENTLY idx_game_sessions_created_at_btree 
ON t_game_sessions USING btree(created_at DESC);

CREATE INDEX CONCURRENTLY idx_weekly_rankings_composite 
ON t_weekly_rankings USING btree(week_start, total_score DESC);

-- パフォーマンス監視用ビュー
CREATE VIEW v_performance_stats AS
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public';

-- 自動VACUUM設定
ALTER TABLE t_game_sessions SET (
    autovacuum_vacuum_scale_factor = 0.05,
    autovacuum_analyze_scale_factor = 0.02
);
```

## CI/CD設定

### 🔄 GitHub Actions ワークフロー

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: spaguessr_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Test
        run: npm run test
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/spaguessr_test
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: ${{ secrets.MAPBOX_TOKEN_TEST }}

  deploy-preview:
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-production:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}
      
      - name: Run Database Migrations
        run: |
          npm ci
          npm run db:migrate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Health Check
        run: |
          sleep 30
          curl -f https://spaguessr.com/api/health || exit 1

  lighthouse:
    runs-on: ubuntu-latest
    needs: deploy-production
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://spaguessr.com
            https://spaguessr.com/game
            https://spaguessr.com/rankings
          configPath: './.lighthouserc.json'
```

### 📋 品質チェック設定

```json
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop",
        "chromeFlags": "--no-sandbox --disable-dev-shm-usage"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.8}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

## 監視・ログ

### 📊 Vercel Analytics統合

```typescript
// lib/analytics.ts
import { Analytics } from '@vercel/analytics/react';

// ページビュー追跡
export function trackPageView(path: string) {
  if (typeof window !== 'undefined') {
    (window as any).va?.track('page_view', { path });
  }
}

// ゲーム結果追跡
export function trackGameResult(result: {
  score: number;
  distance: number;
  timeSeconds: number;
  spaId: string;
}) {
  if (typeof window !== 'undefined') {
    (window as any).va?.track('game_completed', result);
  }
}

// エラー追跡
export function trackError(error: string, context?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    (window as any).va?.track('error', { error, ...context });
  }
}

// Analytics コンポーネント
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
```

### 🔍 ヘルスチェックAPI

```typescript
// app/api/health/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // データベース接続確認
    await db.execute(sql`SELECT 1`);
    
    // Redis接続確認（キャッシュ）
    // await redis.ping();
    
    // 外部API確認
    const mapboxHealthy = await checkMapboxHealth();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        mapbox: mapboxHealthy ? 'healthy' : 'degraded'
      }
    };
    
    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      },
      { status: 503 }
    );
  }
}

async function checkMapboxHealth(): Promise<boolean> {
  try {
    const response = await fetch('https://api.mapbox.com/v1', {
      method: 'HEAD',
      timeout: 5000
    });
    return response.ok;
  } catch {
    return false;
  }
}
```

### 📈 パフォーマンス監視

```typescript
// lib/monitoring.ts
import { unstable_cache } from 'next/cache';

// Server Actions パフォーマンス監視
export function withPerformanceMonitoring<T extends any[], R>(
  action: (...args: T) => Promise<R>,
  actionName: string
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    
    try {
      const result = await action(...args);
      const duration = Date.now() - startTime;
      
      // パフォーマンスログ
      console.log(`[${actionName}] Completed in ${duration}ms`);
      
      // Vercel Analyticsに送信
      if (typeof window !== 'undefined') {
        (window as any).va?.track('server_action_performance', {
          action: actionName,
          duration,
          success: true
        });
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      console.error(`[${actionName}] Failed after ${duration}ms:`, error);
      
      if (typeof window !== 'undefined') {
        (window as any).va?.track('server_action_performance', {
          action: actionName,
          duration,
          success: false,
          error: error.message
        });
      }
      
      throw error;
    }
  };
}

// キャッシュ使用状況監視
export const monitoredCache = <T>(
  fn: () => Promise<T>,
  keyParts: string[],
  options: Parameters<typeof unstable_cache>[2] = {}
) => {
  return unstable_cache(
    async () => {
      const startTime = Date.now();
      const result = await fn();
      const duration = Date.now() - startTime;
      
      console.log(`[Cache] ${keyParts.join('/')} computed in ${duration}ms`);
      return result;
    },
    keyParts,
    options
  );
};
```

## セキュリティ

### 🔒 セキュリティ設定

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { ratelimit } from '@/lib/redis';

export async function middleware(request: NextRequest) {
  // CORS設定
  const response = NextResponse.next();
  
  // セキュリティヘッダー
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // API レート制限
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? '127.0.0.1';
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString()
          }
        }
      );
    }
    
    // レート制限ヘッダーを追加
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());
  }
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};
```

### 🛡️ 環境変数検証

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  RAKUTEN_APP_ID: z.string().min(1).optional(),
  GOOGLE_PLACES_API_KEY: z.string().min(1).optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);

// 起動時検証
export function validateEnvironment() {
  try {
    envSchema.parse(process.env);
    console.log('✅ Environment variables validated');
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    process.exit(1);
  }
}
```

### 📝 デプロイメントチェックリスト

```markdown
## 🚀 本番デプロイ前チェックリスト

### セキュリティ
- [ ] 環境変数が適切に設定されている
- [ ] APIキーが本番用に更新されている
- [ ] データベース接続が暗号化されている
- [ ] レート制限が設定されている
- [ ] CSPヘッダーが適切に設定されている

### パフォーマンス
- [ ] 画像が最適化されている
- [ ] Bundle Analyzerでバンドルサイズを確認
- [ ] Lighthouse スコアが基準を満たしている
- [ ] キャッシュ戦略が適切に設定されている

### 機能
- [ ] 全ての主要機能が動作する
- [ ] エラーハンドリングが適切
- [ ] モバイル・デスクトップで動作確認
- [ ] 各ブラウザで動作確認

### 監視
- [ ] ヘルスチェックが正常に動作
- [ ] Analytics設定が有効
- [ ] エラー追跡が設定されている
- [ ] アラート設定が完了

### データ
- [ ] データベースマイグレーションが完了
- [ ] バックアップ戦略が確立
- [ ] データの整合性確認

### ドキュメント
- [ ] README更新
- [ ] API仕様書更新
- [ ] 運用手順書作成
```

---

この本番運用設定により、安全で安定したサービス提供が実現できます。 