# SpaGuessr トラブルシューティングガイド

## 距離計算の問題 (2025-01-12)

### 症状
- ゲームで常に0.1km〜0.3km程度の非常に小さい距離が表示される
- 宮城県や群馬県など実際には遠く離れた場所をクリックしても同様の小さい距離が出る

### 原因
この問題は2つの独立した原因によって発生していた：

#### 1. サンプルデータ不足
**ファイル**: `lib/data/sample-spas.ts`

**問題**: 
- サンプルデータに草津温泉1件しか登録されていなかった
- すべてのゲームラウンドで同じ温泉が選択され、似たような距離になっていた

**解決策**:
```typescript
// 追加した温泉データ（計8件）
{ id: 2, name: '箱根温泉', prefecture: '神奈川県', lat: '35.2323', lng: '139.1058' },
{ id: 3, name: '有馬温泉', prefecture: '兵庫県', lat: '34.7975', lng: '135.2482' },
{ id: 4, name: '熱海温泉', prefecture: '静岡県', lat: '35.0954', lng: '139.0678' },
{ id: 5, name: '別府温泉', prefecture: '大分県', lat: '33.2844', lng: '131.4901' },
{ id: 6, name: '下呂温泉', prefecture: '岐阜県', lat: '35.8071', lng: '137.2459' },
{ id: 7, name: '道後温泉', prefecture: '愛媛県', lat: '33.8518', lng: '132.7867' },
{ id: 8, name: '白骨温泉', prefecture: '長野県', lat: '36.1353', lng: '137.6951' }
```

#### 2. 距離表示の単位変換バグ
**ファイル**: `components/game/GameScreen.tsx` (line 851)

**問題**:
```typescript
// 間違った実装
{(lastResult.distance / 1000).toFixed(1)}km
```
- `calculateDistance`関数は既にキロメートル単位で結果を返していた
- 表示時に再度1000で割っていたため、実際の距離の1/1000が表示されていた
- 例：271.6km → 0.27km として表示

**解決策**:
```typescript
// 正しい実装
{lastResult.distance.toFixed(1)}km
```

### デバッグ手順
1. **ターミナルログの確認**: Server Actionsでの距離計算結果をログ出力
2. **サンプルデータの確認**: `lib/data/sample-spas.ts`の件数をチェック
3. **距離計算関数の確認**: `calculateDistance`の返り値の単位を確認
4. **表示コードの確認**: フロントエンドでの単位変換処理をチェック

### 予防策
- **サンプルデータ**: 最低5-10件の多様な地域の温泉データを維持する
- **単位の統一**: 距離計算と表示で単位を統一し、コメントで明記する
- **テストケース**: 遠距離（数百km）と近距離（数十km）のテストケースを用意する

### 検証方法
```bash
# 開発サーバー起動
npm run dev

# ターミナルで距離計算ログを確認
# 期待値: 100km以上の距離が正しく表示されること
```

### 関連ファイル
- `lib/data/sample-spas.ts` - サンプル温泉データ
- `lib/utils/distance.ts` - 距離計算関数（Haversine公式）
- `components/game/GameScreen.tsx` - 距離表示UI
- `lib/actions/game.ts` - ゲームロジック（Server Actions） 