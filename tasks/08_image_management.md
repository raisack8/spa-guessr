# 08. 画像管理システム (Image Management System)

## 概要
SpaGuessrアプリケーションにおける温泉画像の効率的な管理、最適化、配信システムの実装

## 実装フェーズ
- **Phase 1**: 基本画像管理 (2-3日)
- **Phase 2**: 最適化・CDN (2-3日)  
- **Phase 3**: 高度な機能 (3-4日)
- **Phase 4**: パフォーマンス調整 (1-2日)

---

## Phase 1: 基本画像管理システム

### 1.1 データベース設計拡張
- [ ] 1.1.1 画像テーブル設計
  - [ ] 1.1.1.1 `images`テーブル拡張
    ```sql
    -- 追加フィールド
    file_size: integer
    width: integer  
    height: integer
    mime_type: varchar(50)
    uploaded_at: timestamp
    updated_at: timestamp
    status: enum('pending', 'processing', 'ready', 'error')
    ```
  - [ ] 1.1.1.2 画像メタデータテーブル
    ```sql
    CREATE TABLE image_metadata (
      id: serial PRIMARY KEY
      image_id: integer REFERENCES images(id)
      exif_data: jsonb
      color_palette: jsonb
      brightness: float
      contrast: float
      quality_score: float
    )
    ```
  - [ ] 1.1.1.3 画像カテゴリテーブル
    ```sql
    CREATE TABLE image_categories (
      id: serial PRIMARY KEY
      name: varchar(100)
      description: text
      color: varchar(7) -- hex color
    )
    ```
  - [ ] 1.1.1.4 画像タグテーブル
    ```sql
    CREATE TABLE image_tags (
      id: serial PRIMARY KEY
      image_id: integer REFERENCES images(id)
      tag: varchar(50)
      confidence: float -- AI生成タグの信頼度
    )
    ```

### 1.2 基本アップロード機能
- [ ] 1.2.1 管理者向けアップロード画面
  - [ ] 1.2.1.1 ドラッグ&ドロップアップロード
    ```tsx
    // components/admin/ImageUpload.tsx
    const ImageUpload = () => {
      const [dragActive, setDragActive] = useState(false)
      const [uploading, setUploading] = useState(false)
      
      const handleDrop = (e: DragEvent) => {
        // ファイル処理ロジック
      }
    }
    ```
  - [ ] 1.2.1.2 複数ファイル選択対応
  - [ ] 1.2.1.3 アップロード進捗表示
  - [ ] 1.2.1.4 エラーハンドリング・リトライ機能
  - [ ] 1.2.1.5 温泉情報入力フォーム連携

- [ ] 1.2.2 ファイル検証システム
  - [ ] 1.2.2.1 ファイル形式チェック (JPEG, PNG, WebP)
  - [ ] 1.2.2.2 ファイルサイズ制限 (最大10MB)
  - [ ] 1.2.2.3 画像解像度チェック (最小1024x768)
  - [ ] 1.2.2.4 MIME型検証
  - [ ] 1.2.2.5 悪意のあるファイル検出

### 1.3 ファイルストレージシステム
- [ ] 1.3.1 ローカルストレージ設定
  - [ ] 1.3.1.1 アップロードディレクトリ構造
    ```
    /uploads
      /images
        /original      # 元画像
        /optimized     # 最適化後
        /thumbnails    # サムネイル
        /temp          # 一時ファイル
    ```
  - [ ] 1.3.1.2 ファイル命名規則 (UUID + timestamp)
  - [ ] 1.3.1.3 ディレクトリ権限設定
  - [ ] 1.3.1.4 自動バックアップ設定

- [ ] 1.3.2 クラウドストレージ準備
  - [ ] 1.3.2.1 Vercel Blob or AWS S3設定
  - [ ] 1.3.2.2 環境変数設定
    ```env
    BLOB_READ_WRITE_TOKEN=
    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    AWS_REGION=
    S3_BUCKET_NAME=
    ```
  - [ ] 1.3.2.3 アップロード/ダウンロード関数

### 1.4 基本画像処理
- [ ] 1.4.1 画像情報取得
  - [ ] 1.4.1.1 Sharp.jsライブラリ導入
    ```bash
    npm install sharp @types/sharp
    ```
  - [ ] 1.4.1.2 画像メタデータ抽出
    ```ts
    // lib/image-processing.ts
    export async function extractImageMetadata(buffer: Buffer) {
      const image = sharp(buffer)
      const metadata = await image.metadata()
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size
      }
    }
    ```
  - [ ] 1.4.1.3 EXIF データ処理
  - [ ] 1.4.1.4 色彩情報分析

---

## Phase 2: 画像最適化・CDN

### 2.1 自動画像最適化
- [ ] 2.1.1 リサイズ機能
  - [ ] 2.1.1.1 複数サイズ生成
    ```ts
    const SIZES = {
      thumbnail: { width: 200, height: 150 },
      small: { width: 400, height: 300 },
      medium: { width: 800, height: 600 },
      large: { width: 1200, height: 900 },
      original: null
    }
    ```
  - [ ] 2.1.1.2 アスペクト比保持
  - [ ] 2.1.1.3 スマート切り抜き（重要部分検出）
  - [ ] 2.1.1.4 バッチ処理機能

- [ ] 2.1.2 画像圧縮・最適化
  - [ ] 2.1.2.1 品質設定（JPEG: 80-85%, WebP: 75-80%）
  - [ ] 2.1.2.2 プログレッシブJPEG生成
  - [ ] 2.1.2.3 WebP変換
    ```ts
    export async function optimizeImage(
      inputBuffer: Buffer,
      options: OptimizeOptions
    ) {
      return await sharp(inputBuffer)
        .resize(options.width, options.height)
        .webp({ quality: 80 })
        .toBuffer()
    }
    ```
  - [ ] 2.1.2.4 ファイルサイズ最適化

### 2.2 Next.js Image最適化
- [ ] 2.2.1 Image コンポーネント実装
  - [ ] 2.2.1.1 ゲーム用画像コンポーネント
    ```tsx
    // components/GameImage.tsx
    import Image from 'next/image'
    
    interface GameImageProps {
      src: string
      alt: string
      priority?: boolean
      onLoad?: () => void
      onError?: () => void
    }
    
    export const GameImage = ({ src, alt, priority, onLoad, onError }: GameImageProps) => {
      return (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          className="object-cover"
          onLoad={onLoad}
          onError={onError}
        />
      )
    }
    ```
  - [ ] 2.2.1.2 レスポンシブ画像対応
  - [ ] 2.2.1.3 プリロード設定
  - [ ] 2.2.1.4 遅延読み込み設定

- [ ] 2.2.2 カスタム画像ローダー
  - [ ] 2.2.2.1 CDN URL生成
    ```ts
    // lib/image-loader.ts
    export const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
      return `${CDN_BASE_URL}/${src}?w=${width}&q=${quality || 75}`
    }
    ```
  - [ ] 2.2.2.2 フォールバック画像設定
  - [ ] 2.2.2.3 エラー画像処理

### 2.3 CDN配信設定
- [ ] 2.3.1 Vercel Edge Network活用
  - [ ] 2.3.1.1 next.config.js設定
    ```js
    // next.config.js
    module.exports = {
      images: {
        domains: ['your-domain.vercel.app'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        formats: ['image/webp'],
      },
    }
    ```
  - [ ] 2.3.1.2 キャッシュヘッダー設定
  - [ ] 2.3.1.3 画像配信最適化

- [ ] 2.3.2 外部CDN連携準備
  - [ ] 2.3.2.1 Cloudinary設定
  - [ ] 2.3.2.2 ImageKit.io設定
  - [ ] 2.3.2.3 自動変換URL生成

---

## Phase 3: 高度な画像機能

### 3.1 AI画像分析・タグ付け
- [ ] 3.1.1 画像内容認識
  - [ ] 3.1.1.1 Google Vision API連携
    ```ts
    // lib/image-analysis.ts
    export async function analyzeImage(imageBuffer: Buffer) {
      const [result] = await client.labelDetection({
        image: { content: imageBuffer.toString('base64') }
      })
      return result.labelAnnotations
    }
    ```
  - [ ] 3.1.1.2 自動タグ生成
  - [ ] 3.1.1.3 不適切画像検出
  - [ ] 3.1.1.4 画質評価スコア

- [ ] 3.1.2 色彩分析
  - [ ] 3.1.2.1 主要色抽出
    ```ts
    export async function extractColors(imageBuffer: Buffer) {
      const { data, info } = await sharp(imageBuffer)
        .resize(100, 100)
        .raw()
        .toBuffer({ resolveWithObject: true })
      
      // カラーパレット生成ロジック
    }
    ```
  - [ ] 3.1.2.2 明度・コントラスト分析
  - [ ] 3.1.2.3 季節判定（紅葉、雪景色など）

### 3.2 ゲーム用画像機能
- [ ] 3.2.1 ランダム画像選択
  - [ ] 3.2.1.1 重み付き選択アルゴリズム
    ```ts
    // lib/game-images.ts
    export async function selectRandomImages(
      count: number,
      difficulty?: 'easy' | 'medium' | 'hard',
      excludeIds?: number[]
    ) {
      // 難易度に基づく重み付き選択
    }
    ```
  - [ ] 3.2.1.2 難易度別フィルタリング
  - [ ] 3.2.1.3 重複防止機能
  - [ ] 3.2.1.4 地域バランス考慮

- [ ] 3.2.2 画像プリロード機能
  - [ ] 3.2.2.1 次の画像の事前読み込み
    ```ts
    // hooks/useImagePreload.ts
    export function useImagePreload(imageUrls: string[]) {
      useEffect(() => {
        imageUrls.forEach(url => {
          const img = new Image()
          img.src = url
        })
      }, [imageUrls])
    }
    ```
  - [ ] 3.2.2.2 バックグラウンドローディング
  - [ ] 3.2.2.3 メモリ使用量管理

### 3.3 管理画面機能
- [ ] 3.3.1 画像一覧・検索
  - [ ] 3.3.1.1 ページング機能
  - [ ] 3.3.1.2 フィルター機能（カテゴリ、タグ、日付）
  - [ ] 3.3.1.3 ソート機能
  - [ ] 3.3.1.4 一括選択・操作

- [ ] 3.3.2 画像編集機能
  - [ ] 3.3.2.1 基本情報編集
  - [ ] 3.3.2.2 タグ編集
  - [ ] 3.3.2.3 カテゴリ変更
  - [ ] 3.3.2.4 ステータス管理

- [ ] 3.3.3 統計・分析
  - [ ] 3.3.3.1 画像使用頻度
  - [ ] 3.3.3.2 ユーザー正答率
  - [ ] 3.3.3.3 画像品質レポート

---

## Phase 4: パフォーマンス最適化

### 4.1 キャッシュ戦略
- [ ] 4.1.1 ブラウザキャッシュ
  - [ ] 4.1.1.1 Cache-Control ヘッダー設定
    ```ts
    // middleware.ts
    export function middleware(request: NextRequest) {
      const response = NextResponse.next()
      
      if (request.nextUrl.pathname.startsWith('/images/')) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
      }
      
      return response
    }
    ```
  - [ ] 4.1.1.2 ETags設定
  - [ ] 4.1.1.3 Service Worker実装

- [ ] 4.1.2 サーバーサイドキャッシュ
  - [ ] 4.1.2.1 Redis画像キャッシュ
  - [ ] 4.1.2.2 メタデータキャッシュ
  - [ ] 4.1.2.3 キャッシュ無効化戦略

### 4.2 読み込み最適化
- [ ] 4.2.1 遅延読み込み
  - [ ] 4.2.1.1 Intersection Observer実装
    ```tsx
    // hooks/useLazyImage.ts
    export function useLazyImage(ref: RefObject<HTMLElement>) {
      const [isVisible, setIsVisible] = useState(false)
      
      useEffect(() => {
        const observer = new IntersectionObserver(
          ([entry]) => setIsVisible(entry.isIntersecting),
          { threshold: 0.1 }
        )
        
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
      }, [ref])
      
      return isVisible
    }
    ```
  - [ ] 4.2.1.2 Progressive loading
  - [ ] 4.2.1.3 画像プレースホルダー

- [ ] 4.2.2 バンドルサイズ最適化
  - [ ] 4.2.2.1 動的インポート
  - [ ] 4.2.2.2 画像処理ライブラリ最適化
  - [ ] 4.2.2.3 不要な画像除去

### 4.3 モニタリング・分析
- [ ] 4.3.1 パフォーマンス計測
  - [ ] 4.3.1.1 画像読み込み時間測定
    ```ts
    // lib/performance.ts
    export function measureImageLoadTime(imageUrl: string) {
      const startTime = performance.now()
      const img = new Image()
      
      img.onload = () => {
        const loadTime = performance.now() - startTime
        // ログ送信
      }
      
      img.src = imageUrl
    }
    ```
  - [ ] 4.3.1.2 Core Web Vitals追跡
  - [ ] 4.3.1.3 エラー率監視

- [ ] 4.3.2 使用量分析
  - [ ] 4.3.2.1 帯域幅使用量
  - [ ] 4.3.2.2 ストレージ使用量
  - [ ] 4.3.2.3 CDN統計

---

## セキュリティ・品質管理

### セキュリティ対策
- [ ] ファイルアップロード制限
- [ ] 画像コンテンツ検証
- [ ] XSS防止（適切なalt属性設定）
- [ ] CSP設定（画像ソース制限）
- [ ] アクセス権限管理

### 品質管理
- [ ] 画像品質基準策定
- [ ] 自動品質チェック
- [ ] 手動レビュープロセス
- [ ] ユーザーフィードバック収集

### テスト項目
- [ ] アップロード機能テスト
- [ ] 画像最適化テスト
- [ ] パフォーマンステスト
- [ ] セキュリティテスト

---

## 完了基準
- [ ] 管理者が効率的に画像をアップロード・管理できる
- [ ] ゲーム用画像が最適化されて高速に表示される
- [ ] CDN経由で画像が配信される
- [ ] モバイル・デスクトップで適切に表示される
- [ ] セキュリティ要件を満たしている
- [ ] パフォーマンス要件を満たしている（LCP < 2.5s）

## 次のタスク
次は `09_testing_quality.md` でテスト戦略と品質保証について詳細に定義します。 