# Tech Context

## 使用技術
- **p5.js**（v1.9.0, CDN利用）
  - WEBGLモードによる3D描画
  - タッチ・マウスイベントの統合
- **HTML5**
  - メタタグによるviewport・スケーリング制御
- **CSS3**
  - レスポンシブレイアウト
  - タッチ操作最適化（touch-action, overflow制御）
- **JavaScript**
  - グローバル変数による状態管理
  - イベント駆動型インタラクション

## 開発環境
- エディタ: VS Code推奨
- テスト: モダンブラウザ（Chrome, Firefox, Safari, Edge最新版）
- ローカルサーバ: Live Server等（p5.js Web Editorも可）

## 技術的制約・注意点
- 追加UI要素禁止（canvas操作のみ）
- 主要ブラウザ・スマホ/PC両対応必須
- パフォーマンス最適化（30fps目安）
- ファイル分割推奨（sketch.js肥大化時）

## 依存関係
- p5.js本体（CDN: https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.js）
- （将来拡張時）p5.dom.js, p5.sound.js等

## ビルド・デプロイ
- 静的ファイルのみ（HTML, CSS, JS）
- サーバ不要、ローカルで動作可
- GitHub Pages等での公開容易

## 今後の技術拡張
- ピンチズーム・パン操作対応
- 4次元以外の図形対応
- テスト自動化・CI/CD導入
